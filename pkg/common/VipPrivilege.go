package common

import (
	"charge/config"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"math/rand"
	url2 "net/url"
	"strconv"
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
func BCoinState(idx int) {
	if Note.Register("B币券监听和兑换") {
		return
	}
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
		Note.StatusAddString(utils.ErrMsg["json"], "BCoinState", err.Error(), string(resp))
		return
	}
	if bcS.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "B币券监听", bcS.Code, string(resp))
		return
	}
	// code==0，但是message=“内部错误”
	if len(bcS.Data.Result) == 0 || bcS.Data.Result[0].CouponDueTime < time.Now().UnixMilli() {
		BCoinReceive(idx)
		return
	}
	expireTime := time.UnixMilli(bcS.Data.Result[0].CouponDueTime)
	expireDay := expireTime.Sub(time.Now()).Hours() / 24
	if expireDay < 3 {
		BCoinExpiringSoon = true
		Note.AddString("B币券过期时间【%s】，距离过期还有%d天。即将为你充电\n", expireTime.Format("2006-01-02"), int(expireDay))
	} else {
		Note.AddString("B币券过期时间【%s】，距离过期还有%d天\n。", expireTime.Format("2006-01-02"), int(expireDay))
	}
}

// B币券领取
func BCoinReceive(idx int) {
	Note.AddString("正在领取B币券\n")
	url := "https://api.bilibili.com/x/vip/privilege/receive"

	reqBody := url2.Values{}
	reqBody.Set("type", "1") // 1.大会员B币券；2.大会员福利
	reqBody.Set("csrf", utils.CutCsrf(inet.DefaultClient.Cks[idx].Ck))
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "https://www.bilibili.com/", "", idx, strings.NewReader(reqBody.Encode()))
	pR := &pReceive{}
	err := json.Unmarshal(resp, &pR)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "BCoinState", err.Error(), string(resp))
	}
	if pR.Code == 69801 { // 重复领取
		Note.AddString(utils.ErrMsg["code"], "B币券领取", pR.Code, pR.Message)
	} else if pR.Code == 69824 { // 繁忙
		Note.StatusAddString(utils.ErrMsg["code"], "B币券领取", pR.Code, pR.Message)
	} else if pR.Code == 0 { // 领取成功
		Note.AddString(utils.ErrMsg["code"], "B币券领取", pR.Code, pR.Message)
	} else {
		Note.StatusAddString(utils.ErrMsg["code"], "B币券领取", pR.Code, string(resp))
	}
	//return VipPrivilege(idx)
}

// 默认充电
func BCoinExchangeForUp(idx int) {
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
		Note.StatusAddString(utils.ErrMsg["json"], "BCoinExchangeForUp", err.Error(), string(resp))
		return
	}
	if cU.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "BCoinExchangeForUp", cU.Code, cU.Message)
		return
	}
	if cU.Data.Status == 4 {
		Note.AddString("B币已为up【%s】充电成功\n", config.Cfg.Exchange)
	} else if cU.Data.Status == -2 {
		Note.StatusAddString("B币为up【%s】充电失败，原因是低于20电池下限\n", config.Cfg.Exchange)
	} else if cU.Data.Status == -4 {
		Note.AddString("B币为up【%s】充电失败，原因是B币不足\n", config.Cfg.Exchange)
	}

	Note.StatusAddString("BCoinExchangeForUp出现未知错误。%s，%p\n", string(resp), cU)
}

// 电池
func BCoinExchangeForBattery(idx int) {
	pay_bp := strconv.Itoa(5 * 1000)
	url := "https://api.live.bilibili.com/xlive/revenue/v1/order/createOrder"
	reqBody := url2.Values{}
	reqBody.Set("platform", "pc")
	reqBody.Set("pay_bp", pay_bp)
	reqBody.Set("context_id", "10231093")
	reqBody.Set("context_type", "1")
	reqBody.Set("goods_id", "1")
	reqBody.Set("goods_num", "5")
	reqBody.Set("goods_type", "2")
	reqBody.Set("ios_bp", "0")
	reqBody.Set("common_bp", pay_bp)
	reqBody.Set("csrf_tokens_bp", inet.DefaultClient.Cks[idx].Csrf)
	reqBody.Set("csrf", inet.DefaultClient.Cks[idx].Csrf)
	reqBody.Set("visit_id", createVisitId())
	pR := &pReceive{}
	resp := inet.DefaultClient.CheckSelectPost(url, "", "https://www.bilibili.com/", "", idx, strings.NewReader(reqBody.Encode()))
	err := json.Unmarshal(resp, &pR)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "BCoinExchangeForBattery", err.Error(), string(resp))
		return
	}
	if pR.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "BCoinExchangeForBattery", pR.Code, pR.Message)
		return
	}
	Note.AddString("用户【uid:%s】为直播间【10231093】充电成功\n", inet.DefaultClient.Cks[idx].Uid)
}

func createVisitId() string {
	// 1 ~ 9
	randomNum := rand.Intn(9) + 1
	// 10 位随机数字字母字符串
	randomStr := utils.RandomStr(10, true)
	return fmt.Sprintf("%d%s0", randomNum, randomStr)
}

func BigMeeting(idx int) {
	// 非常庞大的resp
	url := "https://api.bilibili.com/x/vip/web/vip_center/v2?"
	url += "access_key=&"
	url += "csrf=&"
	url += "act_id=334"
	url += ""

	url = "https://www.bilibili.com/blackboard/activity-g97AHtCUsb.html?"
	url += "source_from=666.146.selfDef.slideBannerClick&native.theme=1"
	// 目前先使用此数据。该数据由前面的url获得
	url += `order_report_params={"exp_group_tag":"def","exp_tag":"def","material_type":"3","position_id":"13","request_id":"6bbcd7210dd62e0011c75b485e6784b8","tips_id":"89714","tips_repeat_key":"89714:13:1736751193:74199115","unit_id":"23221","vip_status":"1","vip_type":"2"}`

}
