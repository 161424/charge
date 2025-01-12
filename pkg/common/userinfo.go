package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
)

type UserInfo struct {
	Code    int
	Message string
	Data    struct {
		IsLogin    bool //  是否登录
		Level_info struct {
			CurrentLevel int         `json:"current_level"` //   当前等级
			CurrentMin   int         `json:"current_min"`   //   到达当前等级要求最小经验
			CurrentExp   int         `json:"current_exp"`   //    当前等级经验
			NextExp      interface{} `json:"next_exp"`      //   到下一个等级所需升级经验
		}
		Mid        int
		Uname      string  `json:"uname"`
		Money      float64 // 硬币数量
		VipStatus  int     // 0 不是大会员，1是大会员
		VipDueDate int64   // 大会员到期时间

		VipLabel struct {
			Text       string `json:"text"`        // 会员名称
			LabelTheme string `json:"label_theme"` // vip：大会员annual_vip：年度大会员ten_annual_vip：十年大会员hundred_annual_vip：百年大会员
		} `json:"vip_label"`

		Wallet struct {
			BcoinBalance  int `json:"bcoin_balance"`
			CouponBalance int `json:"coupon_balance"`
			CouponDueTime int `json:"coupon_due_time"`
		} `json:"wallet"`

		Is_senior_member int  // 1硬核会员
		Is_jury          bool // true 风纪委员
	}
}

//
//type UserInfo struct {
//	Code    int    `json:"code"`
//	Message string `json:"message"`
//}

func GetUserInfo(idx int) *UserInfo {
	userinfo := &UserInfo{}
	url := "https://api.bilibili.com/x/web-interface/nav"
	//userinfoResp := &userInfoResp{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, userinfo)
	//fmt.Println(userinfo, string(resp))
	if err != nil {
		userinfo.Message = fmt.Sprintf(utils.ErrMsg["json"], "GetUserInfo", err.Error(), string(resp))
		return userinfo
	}
	if userinfo.Code != 0 {
		userinfo.Message = fmt.Sprintf(utils.ErrMsg["code"], "GetUserInfo", userinfo.Code, userinfo.Message)
		return userinfo
	}
	//fmt.Println(userinfo)
	return userinfo

}
