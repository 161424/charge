package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
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
}

func BigExperience(idx int) string {
	url := "https://api.bilibili.com/x/vip/experience/add"
	reqBody := url2.Values{}
	reqBody.Set("csrf", utils.CutCsrf(inet.DefaultClient.Cks[idx].Ck))
	be := &bE{}
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "", "", idx, strings.NewReader(reqBody.Encode()))
	err := json.Unmarshal([]byte(resp), be)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], err.Error(), string(resp))
	}
	if be.Code != 0 {
		return fmt.Sprintf(utils.ErrMsg["code"], be.Code, be.Message)
	}
	return fmt.Sprintf("大会员每日10经验领取成功")
}
