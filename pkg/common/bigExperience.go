package common

import (
	"charge/inet"
	utils2 "charge/pkg/utils"
	"charge/utils"
	"encoding/json"
	url2 "net/url"
	"strings"
)

//{
//"code": 69155,
//"message": "当前非有效大会员",
//"ttl": 1,
//"data": {
//"type": 0,
//"is_grant": false
//}
//}

type bE struct {
	Code    int
	Message string //用户经验已经领取、访问频繁、领取成功
	Ttl     int
	Data    struct {
		Type    int
		IsGrant bool
	}
}

var modelBExp = "大会员10经验"

func BigExperience(idx int) {
	if Note.Register(modelBExp) { // 在第一轮执行无误后会跳过
		Note.AddString("今日【%s】已执行完毕\n", modelBExp)
		return
	}
	uTable := utils2.UrlTable.VipAdd10Exp
	url := uTable.Host + uTable.Url
	reqBody := url2.Values{}
	if uTable.Query != "" {
		reqBody.Set(uTable.Query, inet.DefaultClient.Cks[idx].Csrf)
	}

	be := &bE{}
	resp := inet.DefaultClient.CheckSelectPost(url, uTable.ContentType, uTable.Referer, "", idx, strings.NewReader(reqBody.Encode()))

	err := json.Unmarshal(resp, be)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "BigExperience", err.Error(), string(resp))
	}
	if be.Code == 69198 {
		Note.AddString("大会员每日10经验已领取\n")
		return
	}
	if be.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "BigExperience", be.Code, be.Message)
		return
	}
	Note.AddString("大会员每日10经验领取成功\n")
}
