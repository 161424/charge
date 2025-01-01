package common

import (
	"charge/inet"
	"encoding/json"
	"fmt"
)

type UserInfo struct {
	Code       int
	Message    string
	IsLogin    bool
	Level_info struct {
		CurrentLevel int    `json:"current_level"`
		CurrentMin   int    `json:"current_min"`
		CurrentExp   int    `json:"current_exp"`
		NextExp      string `json:"next_exp"`
	}
	Mid              int
	Uname            string `json:"uname"`
	Money            int    // 硬币数量
	VipStatus        int    // 0 不是大会员，1是大会员
	VipDueDate       int64  // 大会员到期时间
	Is_senior_member int    // 1硬核会员
	Is_jury          bool   // true 风纪委员
}

//
//type UserInfo struct {
//	Code    int    `json:"code"`
//	Message string `json:"message"`
//}

func GetUserInfo(idx int) (userinfo UserInfo) {
	url := "https://api.bilibili.com/x/web-interface/nav"
	//userinfoResp := &userInfoResp{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, &userinfo)
	if err != nil {
		userinfo.Message = fmt.Sprintf(errMsg["json"], err.Error(), string(resp))
		return
	}
	if userinfo.Code != 0 {
		userinfo.Message = fmt.Sprintf(errMsg["code"], "GetUserInfo", userinfo.Code, userinfo.Message)
		return
	}
	return

}
