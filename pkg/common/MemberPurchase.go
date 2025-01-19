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

// 活动日历会变化，因此采用排除法
var NotActive = map[string]struct{}{"会员购下单": struct{}{}}

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
		TaskActivityId     string `json:"taskActivityId"` // 活动id，会变更tx7cfe2ej2
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

var todayG = 0

func MemberGoodsInfo(idx int) {
	// 粘土人4000金币。每日任务55金币，一个月有效期，最多1650.签到一个星期95金币，至少签到24.7个星期再能兑换(灬ꈍ ꈍ灬)
	// （55*7=385+95=480）魔晶240兑换4个，魔晶签到第七天有15个，大会员500积分可以换5魔晶。拢共24魔晶。3.78魔晶可以抵1元，拢共抵挡6.34

	t := time.Now().UnixMilli()
	url := fmt.Sprintf("https://mall.bilibili.com/activity/game/exchange_shop/prize_list?shopType=1&_=%d", t) // 浏览欧气专区
	mGoods := MGoods{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, &mGoods)
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "memberRegister", err.Error(), string(resp))
		return
	}
	if mGoods.Data.ItemAreas == nil {
		return
	}
	desp := ""
	for _, item := range mGoods.Data.ItemAreas[0].ItemList {
		s := item.Title + fmt.Sprintf("【价格：%d】。", item.Price) + item.PrizeDesc + item.PrizeSpec
		desp += "- " + s + "\n"
	}
	Note.AddString(desp)

}

var mUa = "Mozilla/5.0 (Linux; Android 12; 24031PN0DC Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Safari/537.36 BiliApp/8020300 mobi_app/android isNotchWindow/0 NotchHeight=1 mallVersion/8020300 mVersion/263 disable_rcmd/0"
var stop = 0
var hadReceive = true

// 可以完成任务，但是领取金币需要access_key
func MemberRegister(idx int) {
	// 签到一星期获得5 + 6 + 15 + 5 + 6 + 8 + 50 = 95，过期时间180天
	// 签到查询
	if Note.Register("会员购签到") { // 在第一轮执行无误后会跳过
		return
	}
	hadReceive = true
	ok, objectsGameId := memberRegister(idx)
	if ok == false {
		Note.StatusAddString("会员购签到任务领取失败（任务领取阶段失败） ×\n")
		return
	}
	// 获取任务执行前的的金币个数
	time.Sleep(5 * time.Second)
	num1, ok := memberGold(idx, objectsGameId)
	if ok == false {
		Note.StatusAddString("会员购签到任务执行失败（初始金币查询阶段失败） ×\n")
		return
	}
	time.Sleep(5 * time.Second)
	// 在任务执行完毕后领取金币会遇到领取失败的问题，因此采用分开处理

	if hadReceive == false {
		ok, _ = memberRegister(idx)
		if ok == false {
			Note.StatusAddString("会员购签到任务执行失败（任务领取阶段失败） ×\n")
			return
		}
		time.Sleep(5 * time.Second)
		// 获取任务执行后的的金币个数
		num2, ok := memberGold(idx, objectsGameId)
		if ok == false {
			Note.StatusAddString("会员购签到任务执行失败（最终金币查询阶段失败） ×\n")
			return
		}
		Note.AddString("会员购签到完毕。今日已获得%d个金币\n", num2-num1+todayG) // 统计不准,尝试做一下延迟
	} else {
		Note.AddString("会员购签到完毕。现在有%d个金币\n", num1) // 统计不准,尝试做一下延迟
	}

}

func memberRegister(idx int) (req bool, rs string) {
	url := "https://show.bilibili.com/api/activity/v2/continue/sign/detail?activityId=calendar_sign"
	memberSign := &MemberSign{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, memberSign)
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "memberRegister", err.Error(), string(resp))
		return
	}
	if memberSign.Code != 0 {
		Note.StatusAddString(utils2.ErrMsg["code"], "memberRegister", memberSign.Code, string(resp))
		return
	}

	if memberSign.Data.IsSigned {
		todayG = memberSign.Data.SignList[memberSign.Data.CurrDay-1].PrizeList[0].PrizeNum
	}

	// 获取任务id
	url = "https://show.bilibili.com/api/activity/v2/basic-config/query"
	s := `{"type":1}`
	memberQuery := &MemberQuery{}
	resp = inet.DefaultClient.CheckSelectPost(url, utils2.ContentType["json"], "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err = json.Unmarshal(resp, &memberQuery)
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "memberRegister", err.Error(), string(resp))
		return
	}
	if memberQuery.Code != 0 {
		Note.StatusAddString(utils2.ErrMsg["code"], "memberRegister", memberQuery.Code, string(resp))
		return
	}
	activityId := memberQuery.Data.TaskActivityId
	objectsGameId := memberQuery.Data.ExchangeActivityId

	// 做任务赚金币目录。任务每日获得55金币。有效期30天
	url = "https://show.bilibili.com/api/activity/hercules/task/get?activityId=" + activityId
	memberResp := MemberResp{}
	resp = inet.DefaultClient.CheckSelect(url, idx)
	err = json.Unmarshal(resp, &memberResp)

	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "memberRegister", err.Error(), string(resp))
		return
	}

	for _, mt := range memberResp.Data.Tasks {
		if _, ok := NotActive[mt.TaskTitle]; ok == false {
			action := mt.Action
			if action == "jump" { // 任务还未完成
				re := regexp.MustCompile("herculesId=[A-Za-z0-9_]+")
				herculesId := re.FindString(mt.Data.Url)
				if herculesId == "" { //  当任务完成后即v == "receive"时，url就已经变了，匹配不到herculesId
					Note.StatusAddString("会员购任务【%s】匹配不到herculesId。可能是接口改变.url:%s\n", mt.Description, mt.Data.Url)
					continue
				} else {
					herculesId = strings.Replace(herculesId, "herculesId=", "", -1)
				}
				t := time.Now().UnixMilli()
				urlR := fmt.Sprintf("https://show.bilibili.com/api/activity/hercules/task/report-detail?taskId=%s&_=%d", herculesId, t) // 浏览欧气专区
				code := mDispatch(urlR, idx)
				if code == 0 {
					Note.AddString("会员购任务【%s】执行成功，预计获得%d金币\n", mt.Description, mt.Prize.PrizeNum)
				} else {
					Note.StatusAddString("会员购任务【%s】执行失败。\n", mt.Description)
				}
				time.Sleep(time.Second * 5)
			} else if action == "receive" { // 表示任务已经完成，但还未领取奖励
				Note.AddString("正在领取任务-%s的%d个金币\n", mt.Description, mt.Prize.PrizeNum)
				time.Sleep(time.Second)
				code := mReceive(idx, activityId, mt.NodeId)
				if code == 0 {
					Note.AddString("会员购任务【%s】成功领取%d个金币 √\n", mt.Description, mt.Prize.PrizeNum)
				} else {
					Note.StatusAddString("会员购任务【%s】领取%d个金币失败 X\n", mt.Description, mt.Prize.PrizeNum)
					hadReceive = false
				}
			} else if action == "done" { // 表示任务已经完成，已领取奖励
				Note.AddString("会员购任务【%s】已成功领取%d个金币\n", mt.Description, mt.Prize.PrizeNum)
				continue
			} else {
				Note.StatusAddString("未知错误。%+v\n", action)
			}
		}
	}

	return true, objectsGameId

}

// 完成每日任务的主要函数
func mDispatch(url string, idx int) int {
	resp := inet.DefaultClient.CheckSelect(url, idx)
	memberReporter := MemberReporter{}
	err := json.Unmarshal(resp, &memberReporter)
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "mDispatch", err.Error(), string(resp))
	}
	time.Sleep(11 * time.Second)
	url = "https://show.bilibili.com/api/activity/fire/common/event/dispatch"
	s := fmt.Sprintf(`{"eventId":"%s"}`, memberReporter.Data.EventId)
	resp = inet.DefaultClient.CheckSelectPost(url, utils2.ContentType["json"], "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	t := &T{}
	err = json.Unmarshal(resp, &t)
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "mDispatch", err.Error(), string(resp))
	}
	if t.Code != 0 {
		Note.StatusAddString(utils2.ErrMsg["code"], "mReceive", t.Code, string(resp))
	}
	return t.Code
}

// 领取每日任务金币的主要函数
func mReceive(idx int, activityId string, nodeId int) int {
	url := "https://show.bilibili.com/api/activity/hercules/task/receive" // 获取id信息
	s := fmt.Sprintf(`{"activityId":"%s","nodeId":%d}`, activityId, nodeId)
	mReca := mRecA{}
	resp := inet.DefaultClient.CheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err := json.Unmarshal(resp, &mReca)
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "mReceive", err.Error(), string(resp))
		return -1
	}
	if mReca.Code != 0 {
		Note.StatusAddString("未知错误。%+v\n", mReca)
		return -1
	}
	url = "https://show.bilibili.com/api/activity/hercules/task/reward/query"
	s = fmt.Sprintf(`{"activityId":"%s","nodeId":%d,"taskId":"%s","receiveAssocIds":%d}`, activityId, nodeId, mReca.Data.TaskId, mReca.Data.ReceiveAssocIds) // mReca获取失败
	mRecq := mRecQ{}
	resp = inet.DefaultClient.CheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	err = json.Unmarshal(resp, &mRecq)
	//fmt.Println(url, s, string(resp))
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "mReceive", err.Error(), string(resp))
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
		Note.StatusAddString(utils2.ErrMsg["code"], "mReceive", mRecq.Code, string(resp))
		return -1
	}
	return 0
}

// 查看金币数量
func memberGold(idx int, objectsGameId string) (num int, re bool) {
	url := "https://show.bilibili.com/api/activity/v2/calendar/chip"
	s := fmt.Sprintf(`{"objectsGameId":"%s"}`, objectsGameId)
	resp := inet.DefaultClient.CheckSelectPost(url, "", "https://mall.bilibili.com/", "", idx, strings.NewReader(s))
	memberChip := &MemberChip{}
	err := json.Unmarshal(resp, &memberChip)
	if err != nil {
		Note.StatusAddString(utils2.ErrMsg["json"], "memberGold", err.Error(), string(resp))
		return
	}
	if memberChip.Code != 0 {
		Note.StatusAddString(utils2.ErrMsg["code"], "memberGold", memberChip.Code, string(resp))
		return
	}
	return memberChip.Data.EffectiveChips, true
}

// 金币进行兑换奖品
func MemberExchange(idx int) {

}
