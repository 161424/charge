package getcharge

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"time"

	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/utils"
	"charge/router/types"
	"charge/sender"
	utils2 "charge/utils"
)

type ChargeDetail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Item struct {
			Modules struct {
				Module_author struct {
					Mid    int
					Name   string
					Pub_ts int64 // 动态发布时间
				}
				Module_dynamic struct {
					Additional struct { // 抽奖信息
						Upower_lottery struct {
							Button struct {
								Check struct {
									Text string
								}
								Jump_style struct {
									Text string
								}
							}
							Desc struct {
								Text string
							}
							Hint struct {
								Text string
							}
						}
					}
					Desc struct { // 动态文本信息
						Rich_text_nodes []struct {
							Text string
						}
						Text string
					}
				}
			}
		}
	}
}

type ChargeOtherInfo struct {
	Code int `json:"code"`
	Data struct {
		Lottery_time int64 `json:"lottery_time"`
		Participants int   `json:"participants"`
		FirstPrize   int   `json:"first_prize"`
		SecondPrize  int   `json:"second_prize"`
		ThirdPrize   int   `json:"third_prize"`
	}
}

var modelTp = "charge"

// 待完善
func GetChargeFromMonitorDefaultUsersDynamic() func() {
	inet.DefaultClient.RegisterTp(modelTp)
	return func() {
		opus := utils.GetUserOpus(config.Cfg.ChargeUid)
		CU := "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=" // web json
		HCU := "https://www.bilibili.com/opus/"                              // web html
		COU := "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_type=12&business_id="
		PrePrizesUrl := "https://www.bilibili.com/h5/lottery/result?business_type=12&business_id="
		re := regexp.MustCompile(`\d+`)
		ctx := context.Background()
		monitor := sender.Monitor{}
		monitor.Tag = "Charge"
		monitor.Title = "充电监听——1（ChargeUp）"
		addChargeList := true
		t := time.Now()
		d := inet.DefaultClient

		for i := 0; i < len(opus); i++ {
			op := opus[i]
			if redis.ExitCharge(ctx, op) == true {
				continue
			}
			_url := COU + op
			data := types.FormResp{}

			d.RedundantDW(_url, modelTp, time.Second)
			resp := <-d.AliveCh[modelTp]
			idx := int(resp[len(resp)-1])
			oDetail := ChargeOtherInfo{}
			err := json.Unmarshal(resp[:len(resp)-1], &oDetail)
			if err != nil { // 出现错误，进行睡眠
				fmt.Println(1, err)
				d.Sleep(idx, 5*time.Minute)
				continue
			}
			if !(oDetail.Code == 0 || oDetail.Code == 200) { // 出现错误，进行睡眠
				fmt.Println(3, "err code: ", oDetail.Code)
				d.Sleep(idx, 5*time.Minute) // 将线程休眠转换成ck休眠
				i--
				continue
			}
			if oDetail.Data.Lottery_time < t.Unix() { // 过期
				fmt.Println(4, "过期")
				continue
			}
			data.EndTimeUnix = oDetail.Data.Lottery_time
			data.EndTime = time.Unix(oDetail.Data.Lottery_time, 0).Format(time.DateOnly)
			data.NumParticipants = oDetail.Data.Participants
			data.NumPrizes = oDetail.Data.FirstPrize + oDetail.Data.SecondPrize + oDetail.Data.ThirdPrize
			ChargerUid := utils2.CutUid(config.Cfg.BUserCk[0].Ck)
			data.ChargerUid = ChargerUid
			data.BusinessId = op

			_url = CU + op
			resp = d.CheckSelect(_url, idx)
			if resp == nil {
				fmt.Println("body is nil")
				continue
			}
			// 过滤出有用信息
			detail := ChargeDetail{}
			err = json.Unmarshal(resp, &detail)
			if err != nil {
				fmt.Println(2, err)
				continue
			}
			if !(detail.Code == 0 || detail.Code == 200) {
				continue
			}
			mainBody := detail.Data.Item.Modules
			data.IsParticipants = mainBody.Module_dynamic.Additional.Upower_lottery.Button.Check.Text //  "已参与"
			if data.IsParticipants == "" {
				data.IsParticipants = mainBody.Module_dynamic.Additional.Upower_lottery.Button.Jump_style.Text // 未参加的没有check按钮
			}

			data.Uid = strconv.Itoa(mainBody.Module_author.Mid)
			data.UName = mainBody.Module_author.Name
			tx := mainBody.Module_dynamic.Additional.Upower_lottery.Hint.Text
			txl := re.FindAllString(tx, -1) // 加入当前UP主的「6元档包月充电」即可参与
			if len(txl) != 0 {
				data.Cost = txl[0]
			} else {
				data.Cost = "被风控了"
				addChargeList = false
			}

			data.Prizes = mainBody.Module_dynamic.Additional.Upower_lottery.Desc.Text
			data.PrizesUrl = HCU + op
			data.Winner = PrePrizesUrl + op
			dm := ""
			for _, v := range mainBody.Module_dynamic.Desc.Rich_text_nodes {
				dm += v.Text
			}
			dm += mainBody.Module_dynamic.Desc.Text
			data.DynamicMessage = dm
			// base info
			// csrf就是bili_jct
			// https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=1006518945822277649

			// other info
			//  https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_id=1006518945822277649&business_type=12
			go func() {
				if s := redis.ReadOneChargeRecord(ctx, ChargerUid, data.Uid); s != "" {
					tr := ChargeRecordLoad{}
					err = json.Unmarshal([]byte(s), &tr)
					if err == nil {
						if tr.Expire_time < t.Unix() {
							return
						}
						if tr.ReNew {
							data.RemainingTime = (tr.Expire_time - t.Unix()) % (24 * 60 * 60)
						}
					}
				}
				redis.AddCharge(ctx, data.EndTimeUnix, data)
			}()

			fmt.Println("getCharge data: ", data)
			time.Sleep(500 * time.Millisecond)
			if addChargeList {
				redis.AddChargeList(ctx, op, data.String())
			}
		}
		inet.DefaultClient.Lock()
		inet.DefaultClient.AliveCh = nil
		defer inet.DefaultClient.Unlock()
		monitor.Desp = "Charge"
		monitor.PushS()

	}
}

//todo GetChargeFromAll
