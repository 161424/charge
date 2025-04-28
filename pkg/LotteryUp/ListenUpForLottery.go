package LotteryUp

import (
	"bytes"
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/getcharge"
	"charge/pkg/utils"
	"charge/sender"
	utils2 "charge/utils"
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strconv"
	"time"
)

var CU = "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id="                                        // 获取动态创建时间
var COU = "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_type=1&business_id=" // 非官抽是-9999
var SleepStep = 0
var modelTp = "lotteryUp"

type Lottery struct {
	AddTime        int64  `json:"start_time"`
	CreateTime     int64  `json:"create_time"`
	BusinessId     string `json:"business_id"`
	Mid            string `json:"mid"`
	Uname          string `json:"uname"`
	IsOfficial     bool   `json:"is_official"`
	EndTime        int64  `json:"end_time"`       // 对与官方的，在超过结束时间就会删除，非官方的根据CreateTime时间，两个月删除
	IsParticipate  string `json:"is_participate"` // 已成功参与
	NumParticipate int    `json:"num_participate"`
	NumPrizes      int    `json:"num_prizes"`
	Sent           bool   `json:"sent"`
}

type LotteryBody struct {
	Code int `json:"code"`
	Data struct {
		Sender_uid   int   `json:"sender_uid"`
		Lottery_time int64 `json:"lottery_time"`
		Participants int   `json:"participants"`
		FirstPrize   int   `json:"first_prize"`
		SecondPrize  int   `json:"second_prize"`
		ThirdPrize   int   `json:"third_prize"`
	}
}

type BLottery struct {
	Official map[string]Lottery `json:"official"`
	Common   []string           `json:"common"`
}

// 根据多ck监听其关注的up 或 将up进行列表统计然后多ck进行监听
func ListenLotteryUp() func() {
	inet.DefaultClient.RegisterTp(modelTp)
	return func() {
		if redis.RedisClient == nil {
			return
		}
		monitor := sender.Monitor{}
		monitor.Tag = "lottery"
		monitor.Title = "每日lottery(ByUp)监控"
		complete := make(chan struct{})
		opusUid := utils.TakeUid(config.Cfg.LotteryUid)
		videoUid := utils.TakeUid(config.Cfg.SpecialUid)
		lotterys := utils.ListenUpForLotteryOpus(opusUid, complete)
		lotterys = append(lotterys, utils.ListenUpForLotteryVideo(videoUid, complete)...)
		time.Sleep(20 * time.Second)
		if len(lotterys) == 0 {
			fmt.Println("并未获取到有效的lottery")
			return
		}
		t := time.Now()
		ctx := context.Background()
		SleepStep = 0
		ExecFreq := 0
		for _, lottery := range lotterys {
			if LotteryDetail(ctx, modelTp, lottery, t) {
				ExecFreq++
			}
		}
		inet.DefaultClient.Lock()
		defer inet.DefaultClient.Unlock()
		fmt.Println("ListenLotteryUp complete。从lottery(ByUp)获取到的有效动态数:", ExecFreq)
		complete <- struct{}{}
		if ExecFreq != 0 {
			monitor.Desp = fmt.Sprintf("%slottery(ByUp)新增【%d】个lottery。", t.Format("2006-01-02"), ExecFreq)
			monitor.PushS()
		}

	}
}

func LotteryDetail(ctx context.Context, modelTP, lottery string, t time.Time) (re bool) {
	if redis.ExitLottery(ctx, lottery) {
		return
	}
	d := inet.DefaultClient
	LotteryData := Lottery{}
	LotteryData.AddTime = t.Unix()
	LotteryData.BusinessId = lottery
	_url := COU + lottery // 官方抽奖才能访问
	for i := 0; i < d.AliveNum; i++ {
		d.RedundantDW(_url, modelTP, 2*time.Second)
		body := <-d.AliveCh[modelTP]
		fmt.Println("正在查询lottery：", lottery)
		// 过滤出有用信息
		detail := LotteryBody{}
		idx := int(body[len(body)-1])
		body = body[:len(body)-1]
		err := json.Unmarshal(body, &detail)
		if err != nil {
			fmt.Printf(utils2.ErrMsg["json"], "LotteryDetail", err.Error(), string(body))
			// invalid character '{' after top-level value {"code":-400,"message":"strconv.ParseInt: parsing \"id_from=333.999.0.0\": invalid syntax","ttl":1}{"code":-9999,"data":{},"message":"服务系统错误","msg":"服务系统错误"}
			if bytes.Contains(body, []byte("风控")) || bytes.Contains(body, []byte("稍后再试")) {
				d.Sleep(idx, 10*time.Minute)
			}
			continue
		}
		time.Sleep(2 * time.Second)
		if detail.Code == -9999 {
			//fmt.Println("非官抽")
			// 需要添加detail里面的pub_time，进行定期清除lotterylist
			_url = CU + lottery
			body = inet.DefaultClient.CheckSelect(_url, idx)
			if body == nil {
				fmt.Println("body is nil") // 换个ck。应答达到不到
				continue
			}
			// 过滤出有用信息
			_detail := getcharge.ChargeDetail{}
			err = json.Unmarshal(body, &_detail)
			if err != nil {
				fmt.Printf(utils2.ErrMsg["json"], "LotteryDetail", err.Error(), string(body))
				if bytes.Contains(body, []byte("风控")) || bytes.Contains(body, []byte("稍后再试")) {
					d.Sleep(idx, 10*time.Minute)
				}
				continue
			}
			if !(_detail.Code == 0 || _detail.Code == 200) {
				fmt.Println(3, "10分钟大休息。err code: ", _detail.Code, _detail.Message) // 管抽访问太频繁会风控
				// 3 err code:  4101152  动态不见了
				// 3 err code:  500
				if _detail.Code == 4101152 {
					time.Sleep(1 * time.Minute)
					continue
				}
				time.Sleep(10 * time.Minute)
			}
			LotteryData.CreateTime = _detail.Data.Item.Modules.Module_author.Pub_ts
			LotteryData.Mid = strconv.Itoa(_detail.Data.Item.Modules.Module_author.Mid)
			LotteryData.Uname = _detail.Data.Item.Modules.Module_author.Name
			break
		} else if detail.Code == 0 {
			if detail.Data.Lottery_time < t.Unix() { // 管抽有截止时间，忽略掉已经截止的
				return
			}
			LotteryData.IsOfficial = true
			LotteryData.EndTime = detail.Data.Lottery_time
			LotteryData.NumParticipate = detail.Data.Participants
			LotteryData.NumPrizes = detail.Data.FirstPrize + detail.Data.SecondPrize + detail.Data.ThirdPrize
			LotteryData.Mid = strconv.Itoa(detail.Data.Sender_uid)
			SleepStep++
			if SleepStep/10 == 1 {
				fmt.Println("1分钟小休息")
				time.Sleep(time.Minute)
				SleepStep = 0
			}
			break
		} else if detail.Code == 4101152 {
			fmt.Println("动态不见了")
			return false
		} else {
			fmt.Println("other err code", detail.Code, detail.Data)
			continue
		}
		//fmt.Println(4, LotteryData)

	}
	// 保底会将lottery存储到redis中。通过for会尽量获取到lottery中的信息
	redis.AddLotteryRecord(ctx, lottery, LotteryData.String()) // 添加到总的lottery中
	LotteryRecords(modelTP, LotteryData)
	// 由于监听up均为隔日开奖，无法进行多日均衡
	notBalance := true
	if notBalance {
		redis.AddLotteryDay(ctx, time.Now().Format(time.DateOnly), LotteryData.BusinessId)
	}
	return true

}

func (l *Lottery) String() string {
	str, _ := json.Marshal(l)
	return string(str)
}

func BalanceLottery() func() {
	return func() {
		bl := &BLottery{}
		bl.Official = make(map[string]Lottery)
		ctx := context.Background()
		tn := time.Now()
		t := tn.Format(time.DateOnly)
		lr := redis.ReadLotteryRecord(ctx)
		if lr == nil {
			fmt.Println("balance lottery err: redis.ReadLotteryRecord is nil")
		}
		tlk := []int64{}  // 管抽发布时间
		tlv := []string{} // 管抽id
		shortL := Lottery{}
		shortLL := map[string]Lottery{}
		for k, v := range lr { // business_id:lottery
			err := json.Unmarshal([]byte(v), &shortL)
			if err != nil {
				fmt.Println(err)
				continue
			}
			if shortL.IsOfficial == true { // 官抽
				// err nil
				if shortL.EndTime < tn.Unix() { // 超时删除
					redis.DelLotteryRecord(ctx, k)
					continue
				} else {
					bl.Official[k] = shortL
					tlk = append(tlk, shortL.EndTime)
					tlv = append(tlv, shortL.BusinessId)
				}
			} else {
				if shortL.CreateTime < tn.Add(-30*24*time.Hour).Unix() { //  删除距离动态发布时间超过一个月的数据
					redis.DelLotteryRecord(ctx, k)
					continue
				} else {
					if shortL.Sent == false {
						bl.Common = append(bl.Common, k)
					} else {
						continue
					}
				}
			}
			shortLL[k] = shortL
		}
		fmt.Printf("管抽数量：%d，非关抽数量：%d\n\t", len(tlk), len(bl.Common))
		// 生成 lottery-t
		sort.Slice(tlk, func(i, j int) bool {
			if tlk[i] < tlk[j] {
				return true
			} else {
				tlv[i], tlv[j] = tlv[j], tlv[i]
				return false
			}
		})

		_bid := []string{}
		for j, v := range tlk {
			if v < tn.Add(6*24*time.Hour).Unix() {
				continue
			} else {
				_bid = tlv[:j]
				break
			}
		}
		cml := len(bl.Common)/30 + 1
		sort.Strings(bl.Common)
		_bid = append(_bid, bl.Common[:cml]...) // 管抽+非管抽

		for _, v := range _bid {
			if redis.AddLotteryDay(ctx, t, v) {
				_v := shortLL[v]
				_v.Sent = true
				redis.AddLotteryRecord(ctx, v, _v.String())
			}
		}
		fmt.Printf("BalanceLottery complete. %s管抽数量%d，非关抽数量%d\n\t", t, len(_bid)-cml, cml)
	}
}
