package listenUpForLottery

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/utils"
	"context"
	"encoding/json"
	"fmt"
	"time"
)

type Lottery struct {
	AddTime        int64  `json:"start_time"`
	CreateTime     int64  `json:"create_time"`
	BusinessId     string `json:"business_id"`
	IsOfficial     bool   `json:"is_official"`
	EndTime        int64  `json:"end_time"`
	IsParticipate  string `json:"is_participate"` // 已成功参与
	NumParticipate int    `json:"num_participate"`
	NumPrizes      int    `json:"num_prizes"`
}

type LotteryBody struct {
	Code int `json:"code"`
	Data struct {
		Lottery_time int64 `json:"lottery_time"`
		Participants int   `json:"participants"`
		FirstPrize   int   `json:"first_prize"`
		SecondPrize  int   `json:"second_prize"`
		ThirdPrize   int   `json:"third_prize"`
	}
}

type BLottery struct {
	Official map[int][]string `json:"official"`
	Common   []string         `json:"common"`
}

// 根据多ck监听其关注的up 或 将up进行列表统计然后多ck进行监听
func ListenLotteryUp() func() {
	lotterys := utils.ListenupforLottery(config.Cfg.LotteryUid)
	fmt.Println(len(lotterys), lotterys)
	return func() {
		t := time.Now()
		COU := "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_type=1&business_id=" // 非官抽是-9999
		ctx := context.Background()
		idx := 0
		for _, lottery := range lotterys {
			idx++
			if idx == 40 {
				return
			}
			if redis.ExitLottery(ctx, lottery) {
				continue
			}
			LotteryData := Lottery{}
			LotteryData.AddTime = t.Unix()
			LotteryData.BusinessId = lottery
			_url := COU + lottery
			time.Sleep(time.Second)
			body := inet.DefaultClient.RedundantDW(_url)
			if body == nil {
				fmt.Println("body is nil")
				continue
			}

			// 过滤出有用信息
			detail := LotteryBody{}
			err := json.Unmarshal(body, &detail)
			if err != nil {
				fmt.Println(err)
				continue
			}
			if detail.Code == -9999 {
				fmt.Println("非官抽")
				// 需要添加detail里面的pub_time，进行定期清除lotterylist
			} else if detail.Code == 0 {
				LotteryData.IsOfficial = true
				LotteryData.EndTime = detail.Data.Lottery_time
				LotteryData.NumParticipate = detail.Data.Participants
				LotteryData.NumPrizes = detail.Data.FirstPrize + detail.Data.SecondPrize + detail.Data.ThirdPrize
			} else {
				fmt.Println("other err code")
				continue
			}
			fmt.Println(2, LotteryData)
			redis.AddLotteryRecord(ctx, lottery, LotteryData.String())
			redis.AddLotteryDay(ctx, t.Format("20060102"), lottery, LotteryData.BusinessId) // lottery-20260102:[BusinessId...]
		}
		inet.DefaultClient.Lock()
		inet.DefaultClient.AliveCh = nil
		defer inet.DefaultClient.Unlock()
	}
}

func (l *Lottery) String() string {
	str, _ := json.Marshal(l)
	return string(str)
}

func BalanceLottery() {
	bl := &BLottery{}
	t, _ := time.Parse("20060102", time.Now().String())
	if k := redis.ExitLotteryDay(context.Background(), t.String()); k == 1 {

	}
}
