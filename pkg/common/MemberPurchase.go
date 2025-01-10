package common

import (
	"charge/inet"
	utils2 "charge/utils"
	"fmt"
	"github.com/goccy/go-json"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var active = map[string]string{"浏览新人专区": "jump", "分享可爱fufu~": "jump", "浏览欧气专区": "jump", "浏览周边特惠频道": "jump"}

type MemberResp struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Tasks []struct {
			NodeId       int    `json:"nodeId"`
			ActualValue  string `json:"actualValue"`
			ExpectValue  string `json:"expectValue"`
			Title        string `json:"title"`       // 活动名称
			TaskTitle    string `json:"taskTitle"`   // 活动名称
			Description  string `json:"description"` // 活动描述  浏览新人专区|购买任意商品1单|分享可爱fufu|浏览欧气专区|浏览周边特惠频道
			ShowProgress bool   `json:"showProgress"`
			Action       string `json:"action"`      // jump| done | receive
			ButtonText   string `json:"buttonText"`  // 去完成 | 已完成 | 领取奖励
			ButtonStyle  string `json:"buttonStyle"` // go | done | receive
			Prize        struct {
				Value     string `json:"value"`     // 奖励名称
				PrizeName string `json:"prizeName"` // 奖励名称
				PrizeNum  int    `json:"prizeNum"`  // 个数
			} `json:"prize"`
			Data struct {
				Url          string `json:"url"`          // 目标地址
				NeedDispatch bool   `json:"needDispatch"` //  false
			} `json:"data"`
		} `json:"tasks"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MemberReporter struct {
	Code int `json:"code"`
	Data struct {
		EventId string `json:"eventId"`
	} `json:"data"`
	Errtag  int    `json:"errtag"`
	Message string `json:"message"`
}

type T struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Errtag  int    `json:"errtag"`
}

func MemberRegister(idx int) {

	// 获取当前硬币个数

	// 做任务赚金币目录
	url := "https://show.bilibili.com/api/activity/hercules/task/get?activityId=tx7cfe2ej2"
	memberResp := MemberResp{}
	resp := inet.DefaultClient.CheckFirst(url)
	err := json.Unmarshal(resp, &memberResp)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(resp))
	for i, mt := range memberResp.Data.Tasks {
		if v, ok := active[mt.Description]; ok {
			// url = "https://mall.bilibili.com/act/aicms/ab0edacaa9b.html?herculesId=htask_xborcfl2xib&rmsource=calendar_task" // 浏览欧气专区
			re := regexp.MustCompile("herculesId=[A-Za-z0-9]+")
			herculesId := re.FindString(mt.Data.Url)
			if herculesId == "" {
				continue
			} else {
				herculesId = strings.Replace(herculesId, "herculesId=", "", -1)
			}
			if v == "jump" { // 任务还未完成
				t := time.Now().UnixMilli()
				urlR := fmt.Sprintf("https://show.bilibili.com/api/activity/hercules/task/report-detail?taskId=%s&_=%d", herculesId, t) // 浏览欧气专区
				mDispatch(urlR, idx)
			} else if v == "done" { // 表示任务已经完成，但还未领取奖励

			} else if v == "receive" { // 表示任务已经完成，已领取奖励
				continue
			} else {

			}
		}
	}

	// 奖励领取
	// POST /api/activity/hercules/task/receive HTTP/1.1  {"activityId":"tx7cfe2ej2","nodeId":3452}
	//{"code":0,"message":"SUCCESS","data":{"receiveAssocIds":[235219],"nodeId":3452,"taskId":"htask_6i0yskdmetw"},"errtag":0,"ttl":1736496434487}

}

func mDispatch(url string, idx int) int {
	resp := inet.DefaultClient.CheckSelect(url, idx)
	memberReporter := MemberReporter{}
	err := json.Unmarshal(resp, &memberReporter)
	if err != nil {
		fmt.Println(err)
	}
	time.Sleep(11 * time.Second)
	url = "https://show.bilibili.com/api/activity/fire/common/event/dispatch"
	s := fmt.Sprintf(`{"eventId":"%s"}`, memberReporter.Data.EventId)
	resp = inet.DefaultClient.CheckSelectPost(url, utils2.ContentType["json"], "https://mall.bilibili.com/", "", 0, strings.NewReader(s))
	t := &T{}
	err = json.Unmarshal(resp, &t)
	if err != nil {
		fmt.Println(err)
	}
	if t.Code != 0 {
		fmt.Printf("%+v", t)
	}
	return t.Code
}

func BlindBoxRegister(idx int) {

}

func MemberExchange(idx int) {

}

func BlindBoxExchange(idx int) {

}
