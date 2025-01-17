package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
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
		VipDueDate int64   `json:"vipDueDate"` // 大会员到期时间

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

func GetUserInfo(idx int) *UserInfo {
	Note.Register("用户信息")
	userinfo := &UserInfo{}
	url := "https://api.bilibili.com/x/web-interface/nav"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, userinfo)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "GetUserInfo", err.Error(), string(resp))
		return nil
	}
	if userinfo.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "GetUserInfo", userinfo.Code, userinfo.Message)
		return nil
	}

	if userinfo.Data.IsLogin == false {
		Note.StatusAddString("第%d个账号Ck【uid：%s】已失活。原因是：%s\n", idx+1, inet.DefaultClient.Cks[idx].Uid, userinfo.Message)
		return nil
	}
	return userinfo
}
