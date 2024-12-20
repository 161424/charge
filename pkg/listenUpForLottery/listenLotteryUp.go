package listenUpForLottery

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/getcharge"
	"charge/pkg/utils"
	"charge/sender"
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"time"
)

var CU = "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id="                                        // 获取动态创建时间
var COU = "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_type=1&business_id=" // 非官抽是-9999
var SleepStep = 0

type Lottery struct {
	AddTime        int64  `json:"start_time"`
	CreateTime     int64  `json:"create_time"`
	BusinessId     string `json:"business_id"`
	Mid            string `json:"mid"`
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
	return func() {
		monitor := sender.Monitor{}
		monitor.Tag = "lottery"
		monitor.Title = "每日lottery监控——1(LotteryUp)"
		lotterys := utils.ListenupforLottery(config.Cfg.LotteryUid)
		time.Sleep(20 * time.Second)
		fmt.Println(len(lotterys), lotterys)
		t := time.Now()
		ctx := context.Background()
		SleepStep = 0
		ExecFreq := 0
		for _, lottery := range lotterys {
			if LotteryDetail(ctx, lottery, t) {
				ExecFreq++
			}
		}
		inet.DefaultClient.Lock()
		inet.DefaultClient.AliveCh = nil
		defer inet.DefaultClient.Unlock()
		fmt.Println("ListenLotteryUp complete")
		monitor.Desp = fmt.Sprintf("%s新增lottery数量%d", t.Format("2006-01-02"), ExecFreq)
		monitor.PushS()
	}
}

func LotteryDetail(ctx context.Context, lottery string, t time.Time) (re bool) {
	if redis.ExitLottery(ctx, lottery) {
		fmt.Printf("%s is exit\n", lottery)
		return
	}
	LotteryData := Lottery{}
	LotteryData.AddTime = t.Unix()
	LotteryData.BusinessId = lottery
	_url := COU + lottery
	body := inet.DefaultClient.RedundantDW(_url, 10*time.Second)
	if body == nil {
		fmt.Println("body is nil")
		return
	}

	// 过滤出有用信息
	detail := LotteryBody{}
	err := json.Unmarshal(body, &detail)
	if err != nil {
		fmt.Println(1, lottery, err, string(body))
		// invalid character '{' after top-level value {"code":-400,"message":"strconv.ParseInt: parsing \"id_from=333.999.0.0\": invalid syntax","ttl":1}{"code":-9999,"data":{},"message":"服务系统错误","msg":"服务系统错误"}
		return
	}
	time.Sleep(10 * time.Second)
	if detail.Code == -9999 {
		fmt.Println("非官抽")
		// 需要添加detail里面的pub_time，进行定期清除lotterylist
		_url = CU + lottery
		body = inet.DefaultClient.RedundantDW(_url, 10*time.Second)
		if body == nil {
			fmt.Println("body is nil")
			return
		}
		// 过滤出有用信息
		_detail := getcharge.ChargeDetail{}
		err = json.Unmarshal(body, &_detail)
		if err != nil {
			fmt.Println(2, err, string(body))
			return
		}
		if !(_detail.Code == 0 || _detail.Code == 200) {
			fmt.Println(3, "5m大休息。err code: ", _detail.Code) // 管抽访问太频繁会风控
			// 3 err code:  4101152
			// 3 err code:  500
			time.Sleep(10 * time.Minute)
			return
		}
		LotteryData.CreateTime = _detail.Data.Item.Modules.Module_author.Pub_ts
	} else if detail.Code == 0 {
		if detail.Data.Lottery_time < t.Unix() { // 管抽有截止时间，忽略掉已经截止的
			return
		}
		LotteryData.IsOfficial = true
		LotteryData.EndTime = detail.Data.Lottery_time
		LotteryData.NumParticipate = detail.Data.Participants
		LotteryData.NumPrizes = detail.Data.FirstPrize + detail.Data.SecondPrize + detail.Data.ThirdPrize
		SleepStep++
		if SleepStep/5 == 1 {
			fmt.Println("20s小休息")
			time.Sleep(time.Minute)
			SleepStep = 0
		}

	} else {
		fmt.Println("other err code")
		return
	}
	fmt.Println(4, LotteryData)
	redis.AddLotteryRecord(ctx, lottery, LotteryData.String()) // 添加到总的lottery中
	// 监听up均为隔日，无法进行多日均衡
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
