package common

import (
	"charge/inet"
	utils2 "charge/utils"
	"fmt"
	"github.com/goccy/go-json"
	"regexp"
	"strings"
	"time"
)

var active = map[string]string{"浏览新人专区": "jump", "分享可爱fufu~": "jump", "浏览欧气专区": "jump", "浏览周边特惠频道": "jump"}

type MemberResp struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Tasks []struct {
			NodeId      int    `json:"nodeId"`
			ActualValue string `json:"actualValue"`
			ExpectValue string `json:"expectValue"`
			Title       string `json:"title"`       // 活动名称
			TaskTitle   string `json:"taskTitle"`   // 活动名称
			Description string `json:"description"` // 活动描述  浏览新人专区|购买任意商品1单|分享可爱fufu|浏览欧气专区|浏览周边特惠频道
			Action      string `json:"action"`      // jump| done | receive
			ButtonText  string `json:"buttonText"`  // 去完成 | 已完成 | 领取奖励
			ButtonStyle string `json:"buttonStyle"` // go | done | receive
			Prize       struct {
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

type mRecA struct {
	Code    int    `json:"code"`    // 8004070201
	Message string `json:"message"` // 您没有待领取的奖励哦
	Data    struct {
		ReceiveAssocIds []int  `json:"receiveAssocIds"`
		NodeId          int    `json:"nodeId"`
		TaskId          string `json:"taskId"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type mRecQ struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Prizes []struct {
			PrizeName string      `json:"prizeName"`
			PrizeImg  string      `json:"prizeImg"`
			PrizeNum  int         `json:"prizeNum"`
			PrizeType interface{} `json:"prizeType"`
		} `json:"prizes"`
	} `json:"data"`
	Errtag int   `json:"errtag"`
	Ttl    int64 `json:"ttl"`
}

type MGoods struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		ItemAreas []struct {
			ItemList []struct {
				Title         string `json:"title"`         //  名字
				PrizeId       string `json:"prizeId"`       //   id
				PrizeType     int    `json:"prizeType"`     //
				PrizeDesc     string `json:"prizeDesc"`     //  库存更新描述
				PrizeSpec     string `json:"prizeSpec"`     //	规格描述
				GameId        string `json:"gameId"`        //
				Price         int    `json:"price"`         // 兑换价格
				IsExchangeOut bool   `json:"isExchangeOut"` // 不可兑换时为true，可兑换是为false
				LimitType     int    `json:"limitType"`     // 1为每日一次，2为id一次
			} `json:"itemList"`
		} `json:"itemAreas"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

func MemberGoodsInfo(idx int) {
	t := time.Now().UnixMilli()
	url := fmt.Sprintf("https://mall.bilibili.com/activity/game/exchange_shop/prize_list?shopType=1&_=%d", t) // 浏览欧气专区
	mGoods := MGoods{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, &mGoods)
	if err != nil {
		fmt.Println(err)
		return
	}
	desp := ""
	fmt.Println(desp)

}

// 可以完成任务，但是领取金币需要access_key
func MemberRegister(idx int) {

	// 获取当前硬币个数

	// 做任务赚金币目录
	url := "https://show.bilibili.com/api/activity/hercules/task/get?activityId=tx7cfe2ej2"
	memberResp := MemberResp{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, &memberResp)
	fmt.Println(memberResp)
	fmt.Println(string(resp))
	if err != nil {
		fmt.Println(err)
	}

	for _, mt := range memberResp.Data.Tasks {
		fmt.Printf("%+v\n", mt)
		if _, ok := active[mt.Description]; ok {
			v := mt.Action
			// url = "https://mall.bilibili.com/act/aicms/ab0edacaa9b.html?herculesId=htask_xborcfl2xib&rmsource=calendar_task" // 浏览欧气专区
			if v == "jump" { // 任务还未完成
				re := regexp.MustCompile("herculesId=[A-Za-z0-9_]+")
				herculesId := re.FindString(mt.Data.Url)
				if herculesId == "" { //  当任务完成后即v == "receive"时，url就已经变了，匹配不到herculesId
					continue
				} else {
					herculesId = strings.Replace(herculesId, "herculesId=", "", -1)
				}
				fmt.Println(v, herculesId)
				t := time.Now().UnixMilli()
				urlR := fmt.Sprintf("https://show.bilibili.com/api/activity/hercules/task/report-detail?taskId=%s&_=%d", herculesId, t) // 浏览欧气专区
				mDispatch(urlR, idx)
				mReceive(idx, "tx7cfe2ej2", mt.NodeId)
			} else if v == "receive" { // 表示任务已经完成，但还未领取奖励
				mReceive(idx, "tx7cfe2ej2", mt.NodeId)
			} else if v == "done" { // 表示任务已经完成，已领取奖励
				continue
			} else {
				fmt.Printf("%+v", v)
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
	fmt.Println(url, s, string(resp))
	resp = inet.DefaultClient.CheckSelectPost(url, utils2.ContentType["json"], "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	t := &T{}
	err = json.Unmarshal(resp, &t)
	fmt.Println(url, s, string(resp))
	if err != nil {
		fmt.Println(err)
	}
	if t.Code != 0 {
		fmt.Printf("%+v", t)
	}
	return t.Code
}

func mReceive(idx int, activityId string, nodeId int) int {
	/*	url := "https://show.bilibili.com/api/activity/hercules/task/receive" //
		req, err := http.NewRequest(http.MethodOptions, url, nil)
		req.Header.Set("Referer", " https://mall.bilibili.com/")

		req.Header.Set("Connection", "keep-alive")
		req.Header.Set("Cookie", inet.DefaultClient.Cks[idx].Ck)
		resp1, err := inet.DefaultClient.Client.Do(req)
		if err != nil {
			fmt.Println(err)
		}
		body, err := io.ReadAll(resp1.Body)
		fmt.Println(",,,", string(body))*/

	// 需要access_key
	url := "https://show.bilibili.com/api/activity/hercules/task/receive"
	s := fmt.Sprintf(`{"activityId":"%s","nodeId":%d}`, activityId, nodeId)
	mReca := mRecA{}
	resp := inet.DefaultClient.APPCheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err := json.Unmarshal(resp, &mReca)
	fmt.Println(url, s, string(resp))
	if err != nil {
		fmt.Println(err)
		return -1
	}
	url = "https://show.bilibili.com/api/activity/hercules/task/reward/query"
	s = fmt.Sprintf(`{"activityId":"%s","nodeId":%d,"taskId":"%s","receiveAssocIds":%d}`, activityId, nodeId, mReca.Data.TaskId, mReca.Data.ReceiveAssocIds)
	mRecq := mRecQ{}
	resp = inet.DefaultClient.CheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err = json.Unmarshal(resp, &mRecq)
	fmt.Println(url, s, string(resp))
	if err != nil {
		fmt.Println(err)
		return -1
	}
	if mRecq.Code != 0 {
		fmt.Printf("%+v", mRecq)
		return -1
	}
	fmt.Println("已领取")
	return 0
}

func BlindBoxRegister(idx int) {

}

func MemberExchange(idx int) {

}

func BlindBoxExchange(idx int) {

}

// 转发复杂动态  rpc
//func LotteryRelayComplex(idx int) {
//	url := "https://api.bilibili.com/x/dynamic/feed/create/dyn"
//}
