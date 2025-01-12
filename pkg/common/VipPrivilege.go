package common

import (
	"charge/config"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strings"
	"time"
)

var BCoinExpiringSoon = false

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
			CouponDueTime int64 `json:"couponDueTime"` // 过期时间
			ReceiveTime   int64 `json:"receiveTime"`   // 领取时间
			Status        int   `json:"status"`        // 0：未使用，2：已使用，3：已过期
		} `json:"result"`
	} `json:"data"`
}

type pReceive struct {
	Code    int
	Message string
}

type ChargeUp struct {
	Code    int
	Message string
	Data    struct {
		Mid      int    // 本用户mid
		Up_mid   int    // 目标用户mid
		Order_no string // 留言token	 用于添加充电留言
		Bp_num   string // 充电贝壳数
		Exp      int    // 获得经验数
		Status   int    // 返回结果	 4：成功 -2：低于20电池下限 -4：B币不足
		Msg      string // 错误信息
	}
}

// 大会员福利，感觉不重要。目前仅实现与BCoin相关的方法
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
// 通过扫码进行登录获取到的ck无法使用.不是，需要将SESSDATA中的，换成%2C就可以了
func BCoinState(idx int) string {
	url := "https://pay.bilibili.com/paywallet/coupon/listForUserCoupons"
	t := time.Now()
	te := t.Format("2006-01-02")
	ts := t.Add(-1 * time.Hour * 24 * 35).Format("2006-01-02")
	tm := t.UnixMilli()
	s := fmt.Sprintf(`{"currentPage":1,"pageSize":10,"beginTime":"%s 00:00:00","endTime":"%s 23:59:59","traceId":%d,"timestamp":%d,"version":"1.0"}`, ts, te, tm, tm)
	resp := inet.DefaultClient.CheckSelectPost(url, "", "https://pay.bilibili.com/pay-v2-web/bcoin_record", "", idx, strings.NewReader(s))
	bcS := &bsState{}
	err := json.Unmarshal(resp, &bcS)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], "BCoinState", err.Error(), string(resp))
	}
	if bcS.Code != 0 {
		return fmt.Sprintf(utils.ErrMsg["code"], "B币券监听", bcS.Code, string(resp))
	}
	// code==0，但是message=“内部错误”
	fmt.Printf("%+v\n", bcS)
	if len(bcS.Data.Result) == 0 || bcS.Data.Result[0].CouponDueTime < time.Now().UnixMilli() {
		return BCoinReceive(idx)
	}
	expireTime := time.UnixMilli(bcS.Data.Result[0].CouponDueTime)
	expireDay := expireTime.Sub(time.Now()).Hours() / 24
	if expireDay < 3 {
		BCoinExpiringSoon = true
		return fmt.Sprintf("B币券过期时间【%s】，距离过期还有%d天。即将为你充电", expireTime.Format("2006-01-02"), int(expireDay))
	} else {
		return fmt.Sprintf("B币券过期时间【%s】，距离过期还有%d天。", expireTime.Format("2006-01-02"), int(expireDay))

	}
}

// B币券领取
func BCoinReceive(idx int) string {
	fmt.Println("正在领取B币券")
	url := "https://api.bilibili.com/x/vip/privilege/receive"

	reqBody := url2.Values{}
	reqBody.Set("type", "1") // 1.大会员B币券；2.大会员福利
	reqBody.Set("csrf", utils.CutCsrf(inet.DefaultClient.Cks[idx].Ck))
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "https://www.bilibili.com/", "", idx, strings.NewReader(reqBody.Encode()))
	pR := &pReceive{}
	err := json.Unmarshal(resp, &pR)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], "BCoinReceive", err.Error(), string(resp))
	}
	if pR.Code == 69801 {
		return "你已领取过该权益"
	} else if pR.Code == 69824 {
		return "领取太频繁,请稍后再试!"
	} else if pR.Code == 0 {
		return "B币券领取成功"
	} else {
		return fmt.Sprintf(utils.ErrMsg["code"], "B币券领取", pR.Message, string(resp))
	}
	//return VipPrivilege(idx)
}

// 默认充电
func BCoinExchangeForUp(idx int) string {
	url := "https://api.bilibili.com/x/ugcpay/web/v2/trade/elec/pay/quick"
	reqBody := url2.Values{}
	reqBody.Set("bp_num", "5")                 // 充电 b 币数量
	reqBody.Set("is_bp_remains_prior", "true") //B币充电请选择true
	reqBody.Set("up_mid", "74199115")          // 充电对象用户UID
	reqBody.Set("otype", "up")                 // 充电来源 up：空间充电 archive：视频充电
	reqBody.Set("oid", "74199115")             // 充电来源代码 空间充电：充电对象用户mid 视频充电：稿件avid
	reqBody.Set("csrf", utils.CutCsrf(inet.DefaultClient.Cks[idx].Ck))
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "https://www.bilibili.com/", "", idx, strings.NewReader(reqBody.Encode()))
	cU := &ChargeUp{}
	err := json.Unmarshal(resp, &cU)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], "BCoinExchangeForUp", err.Error(), string(resp))
	}
	if cU.Code != 0 {
		return fmt.Sprintf(utils.ErrMsg["code"], "BCoinExchangeForUp", cU.Code, cU.Message)
	}
	if cU.Data.Status == 4 {
		return fmt.Sprintf("B币已为up【%s】充电成功", config.Cfg.Exchange)
	} else if cU.Data.Status == -2 {
		return fmt.Sprintf("B币为up【%s】充电失败，原因是低于20电池下限", config.Cfg.Exchange)
	} else if cU.Data.Status == -4 {
		return fmt.Sprintf("B币为up【%s】充电失败，原因是B币不足", config.Cfg.Exchange)
	}

	return fmt.Sprintf("BCoinExchangeForUp出现未知错误。%s，%p", string(resp), cU)
}
