package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"strings"
)

type MgDetail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		TaskName    string     `json:"taskName"` // 签到名字
		TaskId      string     `json:"taskId"`   // 签到任务id
		Signed      bool       `json:"signed"`   // 是否签到
		SignConfigs []struct { // 签到奖品列表
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
	Errtag  int         `json:"errtag"`
}

// 好像签到成功了

func MagicRegister(idx int) {
	// 任务id会进行刷新
	if Note.Register("魔晶签到") { // 在第一轮执行无误后会跳过
		return
	}
	taskId := magicRegister(idx, false)

	url := "https://mall.bilibili.com/magic-c/sign/achieve"
	//reqBody := url2.Values{}
	s := fmt.Sprintf(`{"taskId":"%s"}`, taskId)
	resp := inet.DefaultClient.CheckSelectPost(url, "", "https://mall.bilibili.com/neul-next/index.html?noTitleBar=1&from=mall_home_mine&page=magic-list_actSquare&track_id=mall_home_tab&msource=bilibiliapp&outsideMall=no",
		"", idx, strings.NewReader(s))
	mgr := &mgR{}
	err := json.Unmarshal(resp, mgr)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "getAidByRecommend", err.Error(), string(resp))
		return
	}
	if mgr.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "getAidByRecommend", mgr.Code, mgr.Message)
		return
	}

	// 第二次访问是为了获取签到后的数据
	magicRegister(idx, true)

}

func magicRegister(idx int, note bool) string {
	url := "https://mall.bilibili.com/magic-c/sign/detail" // 获取taskId
	mgDetail := &MgDetail{}
	resp := inet.DefaultClient.CheckSelectPost(url, "", "https://mall.bilibili.com/neul-next/index.html?noTitleBar=1&from=newhomepage&page=magic-list_actSquare&track_id=mall_home_tab&msource=mall_home_mine&outsideMall=no",
		"", idx, nil)
	err := json.Unmarshal(resp, mgDetail)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "getAidByRecommend", err.Error(), string(resp))
		return ""
	}
	if mgDetail.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "getAidByRecommend", mgDetail.Code, string(resp))
		return ""
	}
	if note {
		pr := ""
		for k := range mgDetail.Data.SignConfigs {
			if mgDetail.Data.SignConfigs[k].Achieve == 1 && (k == len(mgDetail.Data.SignConfigs)-1 || mgDetail.Data.SignConfigs[k+1].Achieve == 2) {
				for _, m := range mgDetail.Data.SignConfigs[k].Imgs {
					pr += fmt.Sprintf("%s*%d;", m.Name, m.Count)
				}
				break
			}
		}
		Note.AddString("今日魔晶签到完毕，获得奖励: %s\n", pr)
	}
	return mgDetail.Data.TaskId
}
