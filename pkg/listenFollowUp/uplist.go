package listenFollowUp

import (
	"charge/dao/redis"
	"charge/inet"
	"charge/sender"
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
)

// 根据多ck监听其关注的up 或 将up进行列表统计然后多ck进行监听
var url = "https://api.bilibili.com/x/relation/followings?vmid=%s&pn=%d&order=desc&order_type=attention" // vmid为uid，pn为第几页，默认一页50个up

type FollowingData struct {
	Mid             string `json:"mid"`
	Uname           string `json:"uname"`
	Official_Desc   string `json:"official_desc"`
	ChargeLottery   int
	OfficialLottery int
	CommonLottery   int
}

type Following struct {
	Code int `json:"code"`
	Data struct {
		List []struct {
			Mid             int
			Uname           string
			Official_verify struct {
				Desc string
			}
		}
		Total int
	}
}

func ListenFollowUp() func() {
	return func() {
		if redis.RedisClient == nil {
			return
		}
		cks := inet.DefaultClient.Cks
		ctx := context.Background()
		monitor := sender.Monitor{}
		t := time.Now().Format(time.DateOnly)
		monitor.Title = fmt.Sprintf("%s完成监控关注任务", t)
		monitor.Tag = "listenFollowUp"
		desp := fmt.Sprintf("当前共保存%d个up", redis.LenUp(ctx))
		num := 1
		for idx := range len(cks) {
			followData := Following{}
			pageIdx := 1
			uid := cks[idx].Uid
			total := 0
			ftotal := 100
			for total < ftotal {
				_url := fmt.Sprintf(url, uid, pageIdx)
				resp := inet.DefaultClient.CheckSelect(_url, idx)
				err := json.Unmarshal(resp, &followData)
				ftotal = followData.Data.Total
				if err != nil || followData.Code != 0 {
					// err code -352
					fmt.Println(err, string(resp))
					total = ftotal
					continue
				}
				vFollowData := FollowingData{}
				for _, ls := range followData.Data.List {
					vFollowData.Mid = strconv.Itoa(ls.Mid)
					vFollowData.Uname = ls.Uname
					vFollowData.Official_Desc = ls.Official_verify.Desc
					//followingData = append(followingData, vFollowData.String())
					if redis.FindUp(ctx, vFollowData.Mid) == "" {
						redis.UpdateUp(ctx, vFollowData.Mid, vFollowData.String()) //
						num++
					}
					time.Sleep(2 * time.Second)
				}
				total += 50
				pageIdx++
			}
		}
		desp += fmt.Sprintf("执行完毕后，新增%d个关注", num)
		monitor.Desp = desp
		monitor.PushS()
	}
}

func (u *FollowingData) String() string {
	c, _ := json.Marshal(u)
	return string(c)
}
