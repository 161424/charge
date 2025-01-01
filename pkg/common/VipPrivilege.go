package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strings"
	"time"
)

// 大会员福利，感觉不重要。目前仅实现与BCoin相关的方法
type PrivilegeList struct {
	Code    int // -101：账号未登录 -400：请求错误 0：成功
	Message string
	Data    struct {
		Tabs []struct {
			Name   string `json:"name"`
			Groups []struct {
				privilege_skus []struct {
					Token     string `json:"token"`
					Title     string `json:"title"`
					Sub_title string `json:"sub_title"` // 大会员每月礼包、年度大会员每月礼包
					Icon      struct {
						Customized struct {
							Number          string `json:"number"`
							Unit            string `json:"unit"`
							Currency_symbol string `json:"currency_symbol"`
						}
					}
					Exchange struct {
						Can_exchange bool `json:"state"` // 是否可以兑换，不太准确。对于已经过期的仍然为true。
					}
					Desc string
				}
			}
		}
	}
	Vip struct {
		Status int `json:"status"` // 是否是vip
	}
}

type userV struct {
	Level    int
	Cur_exp  int
	Next_exp int
	Is_vip   int
	List     []struct {
		Token      string `json:"token"`
		Title      string `json:"title"`
		Sub_title  string `json:"sub_title"`
		Customized string `json:"customized"`
	}
}

type bsState struct {
	Code int
	Msg  string
	Data struct {
		Result []struct {
			couponDueTime int64 // 过期时间
			receiveTime   int64 // 领取时间
			Status        int   // 0：未使用，2：已使用，3：已过期
		}
	}
}

type pReceive struct {
	code    int
	Message string
}

func VipPrivilege(idx int) int {
	url := "https://api.bilibili.com/x/vip/privilege_assets/list"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	pl := &PrivilegeList{}
	err := json.Unmarshal(resp, &pl)
	if err != nil {
		fmt.Println("页面请求错误", err)
		return -1
	}
	if pl.Code != 0 {
		fmt.Println("VipPrivilege页面访问错误", pl.Code, pl.Message)
	}
	return 0
}

// B币券监听和使用
func BCoinState(idx int) string {
	url := "https://pay.bilibili.com/paywallet/coupon/listForUserCoupons"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	bcS := &bsState{}
	err := json.Unmarshal(resp, &bcS)
	if err != nil {
		return fmt.Sprintf(errMsg["json"], err.Error(), string(resp))
	}
	if bcS.Code != 0 {
		return fmt.Sprintf(errMsg["code"], "B币券监听", bcS.Code, bcS.Msg)
	}
	if len(bcS.Data.Result) == 0 || bcS.Data.Result[0].couponDueTime < time.Now().UnixMilli() {
		return BCoinReceive(idx)
	}
	expireTime := time.UnixMilli(bcS.Data.Result[0].couponDueTime)
	expireDay := expireTime.Sub(time.Now()).Hours() / 24

	return fmt.Sprintf("B币券过期时间【%s】，距离过期还有%d天。", expireTime.Format("2006-01-02"), int(expireDay))
}

// B币券领取
func BCoinReceive(idx int) string {
	fmt.Println("正在领取B币券")
	url := "https://api.bilibili.com/x/vip/privilege/receive"

	reqBody := url2.Values{}
	reqBody.Set("type", "1") // 1.大会员B币券；2.大会员福利
	reqBody.Set("csrf", utils.CutCsrf(inet.DefaultClient.Cks[idx].Ck))
	resp := inet.DefaultClient.CheckSelectPost(url, contentType["x"], "https://www.bilibili.com/", "", idx, strings.NewReader(reqBody.Encode()))
	pR := &pReceive{}
	err := json.Unmarshal(resp, &pR)
	if err != nil {
		return fmt.Sprintf(errMsg["json"], err.Error(), string(resp))
	}
	if pR.code == 69801 {
		return "你已领取过该权益"
	} else if pR.code == 69824 {
		return "领取太频繁,请稍后再试!"
	} else if pR.code == 0 {
		return "B币券领取成功"
	} else {
		return fmt.Sprintf(errMsg["code"], "B币券领取", pR.Message, string(resp))
	}
	//return VipPrivilege(idx)
}

// 默认充电
func BCoinExchange(idx int) string {
	url := "https://api.bilibili.com/x/ugcpay/web/v2/trade/elec/pay/quick"
	return url
}
