package getcharge

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/utils"
	"charge/router/types"
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"time"
)

var chargeUrl = ""

type ChargeDetail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Item struct {
			Modules struct {
				Module_author struct {
					Mid  int64
					Name string
				}
				Module_dynamic struct {
					Additional struct { // 抽奖信息
						Upower_lottery struct {
							Button struct {
								Check struct {
									Text string
								}
							}
							Desc struct {
								Jump_url string
								Text     string
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
	}
}

func GetChargeFromMonitorDefaultUsersDynamic() func() {
	opus := utils.GetUserOpus(config.Cfg.ChargeUid)
	fmt.Println("opus:", opus)
	return func() {
		CU := "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id="
		COU := "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_type=12&business_id="
		re := regexp.MustCompile(`\d+`)
		fmt.Println("2opus:", opus)
		for _, op := range opus {
			data := types.FormResp{}
			data.BusinessId = op
			_url := CU + op
			fmt.Println(_url)
			body := inet.DefaultClient.RedundantDW(_url)
			if body == nil {
				fmt.Println("body is nil")
				continue
			}
			// 过滤出有用信息
			detail := ChargeDetail{}
			err := json.Unmarshal(body, &detail)
			if err != nil {
				fmt.Println(err)
				return
			}
			mainBody := detail.Data.Item.Modules
			data.IsParticipants = mainBody.Module_dynamic.Additional.Upower_lottery.Button.Check.Text
			data.Uid = mainBody.Module_author.Mid
			data.UName = mainBody.Module_author.Name
			tx := mainBody.Module_dynamic.Additional.Upower_lottery.Hint.Text
			txl := re.FindAllString(tx, -1)
			data.Cost = txl[0]
			data.Prizes = mainBody.Module_dynamic.Additional.Upower_lottery.Desc.Text
			data.PrizesUrl = mainBody.Module_dynamic.Additional.Upower_lottery.Desc.Jump_url
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
			_url = COU + op
			fmt.Println(1, data)
			oBody := inet.DefaultClient.RedundantDW(_url)
			oDetail := ChargeOtherInfo{}
			err = json.Unmarshal(oBody, &oDetail)
			if err != nil {
				fmt.Println(err)
				return
			}
			data.EndTimeUnix = oDetail.Data.Lottery_time
			data.EndTime = time.Unix(oDetail.Data.Lottery_time, 0).Format(time.DateOnly)
			fmt.Println(2, data)
			redis.AddCharge(context.Background(), "charge", data.EndTimeUnix, data)
		}
	}
}

//todo GetChargeFromAll
