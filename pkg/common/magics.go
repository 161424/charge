package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"
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

type MHead struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		GoBackCardNum int `json:"goBackCardNum"` // 反悔卡数量
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type RMER struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		EffectAmount        int     `json:"effectAmount"`        //   可用魔晶数量
		Ratio               float64 `json:"ratio"`               //  汇率
		MagicStoneIsOffline int     `json:"magicStoneIsOffline"` //  发货数量
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MER struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		PageInfo struct {
			List []struct {
				UseStartTime int `json:"useStartTime"` // 魔晶获取时间
				UseEndTime   int `json:"useEndTime"`   //魔晶结束时间
				Status       int `json:"status"`       // 固定3
				BenefitType  int `json:"benefitType"`  // 固定3
				RemainAmount int `json:"remainAmount"` // 魔晶数量
			} `json:"list"`
		} `json:"pageInfo"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MCard struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		PageInfo struct {
			List []struct {
				ShowName   string `json:"showName"`
				UseEndTime int    `json:"useEndTime"`
			} `json:"list"`
		} `json:"pageInfo"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

var modelMagic = "魔晶签到"

// MagicRegister 魔力赏签到
func MagicRegister(idx int) {
	// 任务id会进行刷新
	if Note.Register(modelMagic) { // 在第一轮执行无误后会跳过
		Note.AddString("今日【%s】已执行完毕\n", modelMagic)
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
	MagicExpiredReminder(idx)

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

func MagicExpiredReminder(idx int) {
	// 首先获取魔晶数量，再根据魔晶数量获取到魔晶到期时间。

	url := "https://mall.bilibili.com/magic-c/magic_crystal/get_magic_crystal"
	mRER := &RMER{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, mRER)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "MagicExpiredReminder", err.Error(), string(resp))
		return
	}
	if mRER.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "MagicExpiredReminder", mRER.Code, string(resp))
		return
	}
	ef := mRER.Data.EffectAmount
	url = "https://mall.bilibili.com/magic-c/magic_crystal/list_page_magic_crystal?"
	url += fmt.Sprintf("v=%d&status=3&pageNum=1&pageSize=20", time.Now().UnixMilli())
	mER := &MER{}
	resp = inet.DefaultClient.CheckSelect(url, idx)
	err = json.Unmarshal(resp, mER)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "MagicExpiredReminder", err.Error(), string(resp))
		return
	}
	if mRER.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "MagicExpiredReminder", mER.Code, string(resp))
		return
	}

	mp := make(map[int]int)
	endTime := []int{}
	num := 0
	for _, l := range mER.Data.PageInfo.List {
		if num == ef {
			break
		}
		num += l.RemainAmount
		if _, ok := mp[l.UseEndTime]; ok {
			mp[l.UseEndTime] += l.RemainAmount
		} else {
			mp[l.UseEndTime] = l.RemainAmount
			endTime = append(endTime, l.UseEndTime)
		}
	}
	sort.Ints(endTime)
	sl := []string{}
	for _, v := range endTime {
		et := time.Unix(int64(v), 0).Sub(time.Now()).Hours()
		en := mp[v]
		g1 := int(et / 24)
		g2 := et - float64(g1*24)
		sl = append(sl, fmt.Sprintf("%d个魔晶在%d天%.1f小时后过期", en, g1, g2))
	}
	Note.AddString("魔晶数量：【%d】，当前汇率为[%.2f],可以抵扣[%.2f￥]。%s。\n", ef, mRER.Data.Ratio, float64(ef)/mRER.Data.Ratio, strings.Join(sl, ","))

	url = "https://mall.bilibili.com/magic-c/ticket/list_page_tickets?"
	url += "type=1&status=1&pageNum=1&pageSize=20"
	mCard := &MCard{}
	resp = inet.DefaultClient.CheckSelect(url, idx)
	err = json.Unmarshal(resp, mCard)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "MagicExpiredReminder", err.Error(), string(resp))
		return
	}
	if mCard.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "MagicExpiredReminder", mCard.Code, string(resp))
		return
	}

	if len(mCard.Data.PageInfo.List) == 0 {
		Note.AddString("暂无权益卡可以使用")
	}

	// 两次返回类型基本相同
	mpc := make(map[int]string)
	endTime = []int{}
	for _, l := range mCard.Data.PageInfo.List {
		if _, ok := mpc[l.UseEndTime]; ok {
			mpc[l.UseEndTime] += l.ShowName
		} else {
			mpc[l.UseEndTime] = l.ShowName
			endTime = append(endTime, l.UseEndTime)
		}
	}
	sort.Ints(endTime)
	sl = []string{}
	for _, v := range endTime {
		et := time.Unix(int64(v), 0).Sub(time.Now()).Hours()
		en := mpc[v]
		g1 := int(et / 24)
		g2 := et - float64(g1*24)
		sl = append(sl, fmt.Sprintf("【%s】权益卡在%d天%.1f小时后过期", en, g1, g2))
	}

	Note.AddString("权益卡数量：【%d】。%s。\n", len(mCard.Data.PageInfo.List), strings.Join(sl, ","))

}

type MagicWarPage struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		CurrentMagicValue           int `json:"currentMagicValue"`
		CurrentGrade                int `json:"currentGrade"`
		MagicValue2NextGrade        int `json:"magicValue2nextGrade"`
		CurrentMagicValue2NextGrade int `json:"currentMagicValue2nextGrade"`
		MagicValueToday             int `json:"magicValueToday"`
		TaskList                    struct {
			IsNew       bool          `json:"isNew"`
			StairTasks  []interface{} `json:"stairTasks"`
			NormalTasks []struct {
				ActivityId string `json:"activityId"`
				UserTaskId int    `json:"userTaskId"`
				TaskName   string `json:"taskName"`
				GuideLink  string `json:"guideLink"`
			} `json:"normalTasks"`
		} `json:"taskList"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MagicWarViewReporter struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		TaskId  string `json:"taskId"`
		EventId string `json:"eventId"`
	} `json:"data"`
	Errtag int   `json:"errtag"`
	Ttl    int64 `json:"ttl"`
}

type MagicWarViewResp struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Errtag  int         `json:"errtag"`
	Ttl     int64       `json:"ttl"`
}

type MagicWarOrder struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		ActivityId                  string `json:"activityId"`
		Channel                     int    `json:"channel"`
		Mid                         int    `json:"mid"`
		Avatar                      string `json:"avatar"`
		NickName                    string `json:"nickName"`
		SuperPoolGrade              int    `json:"superPoolGrade"`
		SuperPoolUnlock             bool   `json:"superPoolUnlock"`
		CurrentMagicValue           int    `json:"currentMagicValue"`
		CurrentGrade                int    `json:"currentGrade"`
		NextGrade                   int    `json:"nextGrade"`
		TotalGrade                  int    `json:"totalGrade"`
		MagicValue2NextGrade        int    `json:"magicValue2nextGrade"`
		NextMagicValue              int    `json:"nextMagicValue"`
		CurrentMagicValue2NextGrade int    `json:"currentMagicValue2nextGrade"`
		SwoThreshold                int    `json:"swoThreshold"`
		CurrentSwoValue             int    `json:"currentSwoValue"`
		SwoText                     string `json:"swoText"`
		UnReceivedPrizeCount        int    `json:"unReceivedPrizeCount"`
		GradeList                   []struct {
			GradeIndex           int  `json:"gradeIndex"`
			IsGradeActive        bool `json:"isGradeActive"`
			IsSwoActive          bool `json:"isSwoActive"`
			MagicValueThreshold  int  `json:"magicValueThreshold"`
			IsSuperPool          bool `json:"isSuperPool"`
			UnReceivedPrizeCount int  `json:"unReceivedPrizeCount"`
			SuperPoolGradeInfo   *struct {
				RewardTime              int `json:"rewardTime"`
				TotalMagicCrystalAmount int `json:"totalMagicCrystalAmount"`
				SuperPoolStatus         int `json:"superPoolStatus"`
				UserSuperPoolStatus     int `json:"userSuperPoolStatus"`
				MagicCrystalAmount      int `json:"magicCrystalAmount"`
			} `json:"superPoolGradeInfo"`
			NormalPrizeList []struct {
				Index         int    `json:"index"`
				PrizeName     string `json:"prizeName"`
				PrizeImg      string `json:"prizeImg"`
				PrizeNum      int    `json:"prizeNum"`
				FaceValue     *int   `json:"faceValue"`
				RightsId      int    `json:"rightsId"`
				RightsType    int    `json:"rightsType"`
				AmountType    int    `json:"amountType"`
				ReceiveStatus int    `json:"receiveStatus"` // 0 可领取，1不可领取
				RewardId      int    `json:"rewardId"`
				RandomType    int    `json:"randomType"`
				IsMust        *bool  `json:"isMust"`
			} `json:"normalPrizeList"`
			SwoPrizeList []struct {
				Index         int    `json:"index"`
				PrizeName     string `json:"prizeName"`
				PrizeImg      string `json:"prizeImg"`
				PrizeNum      int    `json:"prizeNum"`
				FaceValue     *int   `json:"faceValue"`
				RightsId      int    `json:"rightsId"`
				RightsType    int    `json:"rightsType"`
				AmountType    int    `json:"amountType"`
				ReceiveStatus int    `json:"receiveStatus"`
				RewardId      int    `json:"rewardId"`
				RandomType    int    `json:"randomType"`
				IsMust        *bool  `json:"isMust"`
			} `json:"swoPrizeList"`
		} `json:"gradeList"`
		LastCardReleaseTime int  `json:"lastCardReleaseTime"`
		ServerTime          int  `json:"serverTime"`
		SwoUnlock           bool `json:"swoUnlock"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

// 5 魔晶
func magicWarOrder(idx int) {
	magicWarOrderView(idx)

}
func magicWarOrderView(idx int) {
	// 浏览获得得5积分
	urlView := "https://mall.bilibili.com/mall-magic-c/internet/mls_pm/war_order/activity_task_list" // POST
	resp := inet.DefaultClient.CheckSelectPost(urlView, "", "", "", idx, nil)
	magicWarPage := &MagicWarPage{}
	err := json.Unmarshal(resp, magicWarPage)
	if err != nil {
		fmt.Println(err)
		return
	}
	if magicWarPage.Code != 0 {
		fmt.Println(idx, magicWarPage.Code, magicWarPage.Message)
		return
	}
	herculesId := magicWarPage.Data.TaskList.NormalTasks[0].GuideLink
	herculesIds := strings.Split(herculesId, "=")
	if len(herculesIds) != 2 {
		fmt.Println(herculesId)
		return
	}
	taskId := herculesIds[1]
	urlView = fmt.Sprintf("https:///api/activity/hercules/task/report-detail?taskId=%s&_=%d", taskId, time.Now().UnixMilli()) // get
	magicWarViewReporter := &MagicWarViewReporter{}
	resp = inet.DefaultClient.CheckSelect(urlView, idx)
	err = json.Unmarshal(resp, magicWarViewReporter)
	if err != nil {
		fmt.Println(err)
		return
	}
	if magicWarViewReporter.Code != 0 {
		fmt.Println(idx, magicWarViewReporter.Code, magicWarViewReporter.Message)
		return
	}
	time.Sleep(10 * time.Second)
	urlView = "https://show.bilibili.com/api/activity/fire/common/event/dispatch" // post json csrf+eventid
	reqBody := fmt.Sprintf(`{"csrf":%s,"eventId":%s}`, inet.DefaultClient.Cks[idx].Csrf, magicWarViewReporter.Data.EventId)
	resp = inet.DefaultClient.CheckSelectPost(urlView, "", utils.ContentType["json"], "", idx, strings.NewReader(reqBody))
	magicWarViewResp := &MagicWarViewResp{}
	err = json.Unmarshal(resp, magicWarViewResp)
	if err != nil {
		fmt.Println(err)
		return
	}
	if magicWarViewResp.Code != 0 {
		fmt.Println(idx, magicWarViewResp.Code, magicWarViewResp.Message)
		return
	}

}

// hard
func magicWarOrderWish(idx int) {
}

func magicWarOrderReceive(idx int) {
	// url := "Host: mall.bilibili.com/mall-magic-c/internet/mls_pm/war_order/activity_grade_list" // post  {"activityId":"warOrder_b1fy4zl"}
}
