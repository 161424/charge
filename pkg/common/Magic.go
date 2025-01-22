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

// MagicRegister 魔力赏签到
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
