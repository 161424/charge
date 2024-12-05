package getcharge

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/utils"
	"charge/router/types"
	"context"
	"encoding/json"
)

var chargeUrl = ""

type ChargeDetail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Item struct {
			Modules struct {
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

func GetChargeFromOne() func() {
	opus := utils.GetUserOpus(config.Cfg.ChargeUid)
	return func() {
		url := ""

		for _, op := range opus {
			_url := url + op
			body := inet.DefaultClient.RedundantDW(_url)
			// 过滤出有用信息
			detail := ChargeDetail{}
			err := json.Unmarshal(body, &detail)
			// base info
			// csrf就是bili_jct
			// https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?csrf=4b390dcd60ca3c26299f1a356bc625ab&gaia_source=Athena&id=1006518945822277649&timezone_offset=-480&web_location=333.1330

			// other info
			//  https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_id=1006518945822277649&business_type=12&csrf=4b390dcd60ca3c26299f1a356bc625ab&web_location=333.1330
			//  endtime lottery_time
			data := &types.FormResp{}
			redis.AddCharge(context.Background())
		}
	}
}
