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

type MemberSign struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		BatchId    int    `json:"batchId"`
		IsSigned   bool   `json:"isSigned"` // 是否签到
		CurrDay    int    `json:"currDay"`  // 签到天数
		CurrDate   int    `json:"currDate"` // 2025112
		TotalDay   int    `json:"totalDay"`
		RewardTips string `json:"rewardTips"` // 明日可领{{福利日历金币}}奖励
		HeaderImg  string `json:"headerImg"`
		Desc       string `json:"desc"`
		SignList   []struct {
			Day       int    `json:"day"`
			Status    bool   `json:"status"` // 签到状态
			Text      string `json:"text"`
			Desc      string `json:"desc"`
			PrizeList []struct {
				PrizeImg  string `json:"prizeImg"`
				PrizeName string `json:"prizeName"`
				PrizeNum  int    `json:"prizeNum"` // 金币个数
			} `json:"prizeList"`
			Big bool `json:"big"` // day=7时为true。
		} `json:"signList"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MemberQuery struct {
	Code int `json:"code"`
	Data struct {
		RuleUrl            string `json:"ruleUrl"`
		MallUrl            string `json:"mallUrl"`
		TaskActivityId     string `json:"taskActivityId"` // tx7cfe2ej2
		Tips               string `json:"tips"`           // 标题
		ChipBatchId        int    `json:"chipBatchId"`
		SignTaskId         string `json:"signTaskId"`
		ExchangeActivityId string `json:"exchangeActivityId"` // 2022110432139002
		CartUrl            string `json:"cartUrl"`
	} `json:"data"`
	Message string      `json:"message"`
	Errtag  interface{} `json:"errtag"`
	Errno   int         `json:"errno"`
}

type MemberChip struct {
	Code    int    `json:"code"`
	Errno   int    `json:"errno"`
	Msg     string `json:"msg"`
	Message string `json:"message"`
	ShowMsg string `json:"showMsg"`
	Errtag  int    `json:"errtag"`
	Data    struct {
		EffectiveChips int  `json:"effectiveChips"`
		Exchange       bool `json:"exchange"`
	} `json:"data"`
}

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
	// 粘土人4000金币。每日任务55金币，一个月有效期，最多1650.签到一个星期95金币，至少签到24.7个星期再能兑换(灬ꈍ ꈍ灬)
	// （55*7=385+95=480）魔晶240兑换4个，魔晶签到第七天有15个，大会员500积分可以换5魔晶。拢共24魔晶。3.78魔晶可以抵1元，拢共抵挡6.34

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
	for _, item := range mGoods.Data.ItemAreas[0].ItemList {
		s := item.Title + fmt.Sprintf("【价格：%d】。", item.Price) + item.PrizeDesc + item.PrizeSpec
		desp += "- " + s + "\n"
	}
	fmt.Println(desp)

}

var mUa = "Mozilla/5.0 (Linux; Android 12; 24031PN0DC Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Safari/537.36 BiliApp/8020300 mobi_app/android isNotchWindow/0 NotchHeight=1 mallVersion/8020300 mVersion/263 disable_rcmd/0"
var stop = 0

// 可以完成任务，但是领取金币需要access_key
func MemberRegister(idx int) {
	// 签到一星期获得5 + 6 + 15 + 5 + 6 + 8 + 50 = 95，过期时间180天
	// 签到查询
	url := "https://show.bilibili.com/api/activity/v2/continue/sign/detail?activityId=calendar_sign"
	memberSign := &MemberSign{}
	ck := "DedeUserID=74199115; DedeUserID__ckMd5=8d1ad2254e14c603; Buvid=XU812D18534B34C4113916044792A64880198; _uuid=6180244D-1D23-2C6B-CE8E-52D113290AE349556infoc; buvid3=4616F554-6664-69BD-1912-F10E5684BBCA53302infoc; b_nut=1735292951; buvid4=3AA1D37C-0024-6BBB-9A3C-12E73C5D1CB453302-124122709-2pYlC6oBw0BIh9CxzJk%2Bhg%3D%3D; rpdid=|(J~R~kJku)R0J'u~JlkmlRlu; buvid_fp=36cf03397e36ee7d0a86202fd4b298d9; SESSDATA=7abed2d8%2C1752043934%2C10075912CjAEsSdR8ZB9r43ioovjrb8C6a8VIZ3eIpcVPpoU025pTWimh4Lq_7zi7_d2z-bb-5oSVnY4TE0yeHlaQXBDQTFhWnYtUk1Dc1pIWk9Ka1o0VnlKOHdDams1OFlWTGZjMEIxQzV5aERwWWYxU2lMWlNMcm5aSFNvZ1FNb3A0S2pvb05VN3pfR3RBIIEC; bili_jct=79e9794f54da7228883a55319dcaf0d0; themeType=1; kfcFrom=Myth_favorite; deviceFingerprint=XU812D18534B34C4113916044792A64880198; access_key=145bd3d747fba3cfdf8160e783020f12CjAEsSdR8ZB9r43ioovjrb8C6a8VIZ3eIpcVPpoU025pTWimh4Lq_7zi7_d2z-bb-5oSVnY4TE0yeHlaQXBDQTFhWnYtUk1Dc1pIWk9Ka1o0VnlKOHdDams1OFlWTGZjMEIxQzV5aERwWWYxU2lMWlNMcm5aSFNvZ1FNb3A0S2pvb05VN3pfR3RBIIEC; sid=fk08i07m; b_lsid=FD4AABF1_1944F35EF4C; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzY3NTQ5MjYsImlhdCI6MTczNjQ5NTY2NiwicGx0IjotMX0.qW7Q7Fb8HAQhstPy9Nz1NJnRNqQ8II20wPSyvKDUJ_4; bili_ticket_expires=1736754866; identify=appkey%3D1d8b6e7d45233436%26ts%3D1736507111263%26sign%3Da14ec29f6656ff718b4c32c05558593b"
	inet.DefaultClient.Cks[idx].Ck = ck
	resp := inet.DefaultClient.APPCheckSelect(url, mUa, "https://mall.bilibili.com/", idx)
	err := json.Unmarshal(resp, memberSign)
	if err != nil {
		fmt.Println(1, string(resp))
		fmt.Printf(utils2.ErrMsg["json"], "MemberRegister", err.Error(), string(resp))
		return
	}
	if memberSign.Code != 0 {
		fmt.Printf(utils2.ErrMsg["Code"], "MemberRegister", memberSign.Code, string(resp))
		return
	}
	todayG := 0
	if memberSign.Data.IsSigned {
		todayG = memberSign.Data.SignList[memberSign.Data.CurrDay].PrizeList[0].PrizeNum
	}

	// 获取任务id
	url = "https://show.bilibili.com/api/activity/v2/basic-config/query"
	s := `{"type":1}`
	memberQuery := &MemberQuery{}
	resp = inet.DefaultClient.APPCheckSelectPost(url, utils2.ContentType["json"], "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err = json.Unmarshal(resp, &memberQuery)

	if err != nil {
		fmt.Println(2, string(resp))
		fmt.Printf(utils2.ErrMsg["json"], "MemberRegister", err.Error(), string(resp))
		return
	}
	if memberQuery.Code != 0 {
		fmt.Printf(utils2.ErrMsg["Code"], "MemberRegister", memberQuery.Code, string(resp))
		return
	}
	activityId := memberQuery.Data.TaskActivityId
	objectsGameId := memberQuery.Data.ExchangeActivityId
	// 获取当前硬币个数
	num1, ok := memberGold(idx, objectsGameId)
	if ok == false {
		return
	}

	// 做任务赚金币目录。任务每日获得55金币。有效期30天
	url = "https://show.bilibili.com/api/activity/hercules/task/get?activityId=" + activityId
	memberResp := MemberResp{}
	resp = inet.DefaultClient.CheckSelect(url, idx)
	err = json.Unmarshal(resp, &memberResp)

	if err != nil {
		fmt.Println(3, string(resp))
		fmt.Printf(utils2.ErrMsg["json"], "MemberRegister", err.Error(), string(resp))
		return
	}

	for _, mt := range memberResp.Data.Tasks {
		if _, ok := active[mt.Description]; ok {
			v := mt.Action
			// url = "https://mall.bilibili.com/act/aicms/ab0edacaa9b.html?herculesId=htask_xborcfl2xib&rmsource=calendar_task" // 浏览欧气专区
			if v == "jump" { // 任务还未完成
				re := regexp.MustCompile("herculesId=[A-Za-z0-9_]+")
				herculesId := re.FindString(mt.Data.Url)
				if herculesId == "" { //  当任务完成后即v == "receive"时，url就已经变了，匹配不到herculesId
					fmt.Println("匹配不到herculesId。可能是接口改变")
					continue
				} else {
					herculesId = strings.Replace(herculesId, "herculesId=", "", -1)
				}
				t := time.Now().UnixMilli()
				urlR := fmt.Sprintf("https://show.bilibili.com/api/activity/hercules/task/report-detail?taskId=%s&_=%d", herculesId, t) // 浏览欧气专区
				mDispatch(urlR, idx)
				time.Sleep(time.Second * 3)
				mReceive(idx, activityId, mt.NodeId)
			} else if v == "receive" { // 表示任务已经完成，但还未领取奖励
				time.Sleep(time.Second)
				mReceive(idx, activityId, mt.NodeId)
			} else if v == "done" { // 表示任务已经完成，已领取奖励
				continue
			} else {
				fmt.Printf("%+v", v)
			}
		}
	}
	num2, ok := memberGold(idx, objectsGameId)
	fmt.Printf("会员购签到完毕。今日已获得%d金币\n", num2-num1+todayG)
	time.Sleep(time.Second * 3)
	MemberGoodsInfo(idx)
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
	if err != nil {
		fmt.Println(err)
	}
	if t.Code != 0 {
		fmt.Printf("%+v", t)
	}
	return t.Code
}

// 412
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
	url := "https://show.bilibili.com/api/activity/hercules/task/receive" // 获取id信息
	s := fmt.Sprintf(`{"activityId":"%s","nodeId":%d}`, activityId, nodeId)
	mReca := mRecA{}
	resp := inet.DefaultClient.APPCheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err := json.Unmarshal(resp, &mReca)
	if err != nil {
		fmt.Printf(utils2.ErrMsg["json"], "mReceive", err.Error(), string(resp))
		return -1
	}
	url = "https://show.bilibili.com/api/activity/hercules/task/reward/query"
	s = fmt.Sprintf(`{"activityId":"%s","nodeId":%d,"taskId":"%s","receiveAssocIds":%d}`, activityId, nodeId, mReca.Data.TaskId, mReca.Data.ReceiveAssocIds)
	mRecq := mRecQ{}
	resp = inet.DefaultClient.CheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err = json.Unmarshal(resp, &mRecq)
	fmt.Println(url, s, string(resp))
	if err != nil {
		fmt.Printf(utils2.ErrMsg["json"], "mReceive", err.Error(), string(resp))
		return -1
	}
	if mRecq.Code == 8004070020 { // "前方拥堵，请稍后重试",
		stop++
		if stop > 3 {
			return -1
		}
		time.Sleep(time.Second * 3)
		return mReceive(idx, activityId, nodeId)
	} else if mRecq.Code != 0 {
		fmt.Printf(utils2.ErrMsg["Code"], "mReceive", mRecq.Code, string(resp))
		return -1
	}
	fmt.Println("已领取")
	return 0
}

// 查看金币数量
func memberGold(idx int, objectsGameId string) (num int, re bool) {
	url := "https://show.bilibili.com/api/activity/v2/calendar/chip"
	s := fmt.Sprintf(`{"objectsGameId":"%s"}`, objectsGameId)
	resp := inet.DefaultClient.APPCheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	memberChip := &MemberChip{}
	err := json.Unmarshal(resp, &memberChip)
	if err != nil {
		fmt.Println(4, string(resp))
		fmt.Printf(utils2.ErrMsg["json"], "MemberRegister", err.Error(), string(resp))
		return
	}
	if memberChip.Code != 0 {
		fmt.Printf(utils2.ErrMsg["Code"], "watchExp", memberChip.Code, string(resp))
		return
	}
	return memberChip.Data.EffectiveChips, true
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
