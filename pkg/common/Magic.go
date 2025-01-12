package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"strings"
)

type mgDetail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		TaskName    string `json:"taskName"` // 签到名字
		TaskId      string `json:"taskId"`   // 签到任务id
		Signed      bool   `json:"signed"`   // 是否签到
		SignConfigs []struct {
			Num     int    `json:"num"`
			Text    string `json:"text"`
			Achieve int    `json:"achieve"`
			Imgs    []struct {
				Count int    `json:"count"` // 数量
				Img   string `json:"img"`
				Name  string `json:"name"` // 奖品内容。魔晶保质期就3天，签到第7天顶多15魔晶，抵4块钱。有心情在开发
			} `json:"imgs"`
		} `json:"signConfigs"`
		NextGiftPrize struct {
			Num     int    `json:"num"`
			Text    string `json:"text"`
			Achieve int    `json:"achieve"`
			Imgs    []struct {
				Count int    `json:"count"`
				Img   string `json:"img"`
				Name  string `json:"name"`
			} `json:"imgs"`
		} `json:"nextGiftPrize"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type mgR struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Errtag  int         `json:"errtag"M`
}

// 好像签到成功了
func MagicRegister(idx int) {
	url := "https://mall.bilibili.com/magic-c/sign/achieve"
	//reqBody := url2.Values{}
	s := `{"taskId":"sr_pd4gtd8cik"}`
	resp := inet.DefaultClient.APPCheckSelectPost(url, "", "https://mall.bilibili.com/neul-next/index.html?noTitleBar=1&from=mall_home_mine&page=magic-list_actSquare&track_id=mall_home_tab&msource=bilibiliapp&outsideMall=no",
		"", idx, strings.NewReader(s))
	mgr := &mgR{}
	err := json.Unmarshal(resp, mgr)
	if err != nil {
		fmt.Println(utils.ErrMsg["json"], "getAidByRecommend", err.Error(), string(resp))
		return
	}
	if mgr.Code != 0 {
		fmt.Println(utils.ErrMsg["code"], "getAidByRecommend", mgr.Code, mgr.Message)
		return
	}
	//url = "https://mall.bilibili.com/magic-c/sign/detail"
	//  好像只有一个请求？
	fmt.Println(mgr, string(resp))
}
