package common

import (
	"charge/inet"
	"charge/pkg"
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

type MagicWarOrderInfo struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		ActivityId            string      `json:"activityId"`
		PreActivityId         string      `json:"preActivityId"`
		NextActivityId        interface{} `json:"nextActivityId"`
		Channel               int         `json:"channel"`
		Mid                   int         `json:"mid"`
		StartTime             int         `json:"startTime"`
		EndTime               int         `json:"endTime"`
		Title                 string      `json:"title"`
		IsNew                 bool        `json:"isNew"`
		ActivityStatus        int         `json:"activityStatus"`
		SuperPoolStatus       int         `json:"superPoolStatus"`
		PromptUnlockSuperPool bool        `json:"promptUnlockSuperPool"`
		RuleUrl               string      `json:"ruleUrl"`
		SuperPoolInfo         struct {
			RewardTime             int   `json:"rewardTime"`
			MagicCrystalAmountList []int `json:"magicCrystalAmountList"`
			RewardPoolGrade        int   `json:"rewardPoolGrade"`
		} `json:"superPoolInfo"`
		SignInfo struct {
			SignStatus int `json:"signStatus"`
		} `json:"signInfo"`
		ServerTime          int    `json:"serverTime"`
		ActivityGuideLink   string `json:"activityGuideLink"`
		WaitReceivePrizeNum int    `json:"waitReceivePrizeNum"`
	} `json:"data"`
	Errtag int `json:"errtag"`
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

type MagicWarOrder1 struct {
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

type MagicWarOrderBoxPageReq struct {
	PageNum       int           `json:"pageNum"`
	RangeQueries  []interface{} `json:"rangeQueries"`
	TermQueries   []interface{} `json:"termQueries"`
	FixSelect     []FixSelect   `json:"fixSelect"`
	Scene         string        `json:"scene"`
	Group         int           `json:"group"`
	MallChannelId string        `json:"mall-channel-id"`
	BzType        int           `json:"bzType"`
	Network       string        `json:"network"`
	PageSize      int           `json:"pageSize"`
	MVersion      int           `json:"mVersion"`
	Init          bool          `json:"init"`
}

type FixSelect struct {
	SelectName  string      `json:"selectName"`
	SelectType  int         `json:"selectType"`
	BriefName   interface{} `json:"briefName"`
	Check       bool        `json:"check"`
	CurrentName string      `json:"currentName"`
}

type MagicWarOrderBoxPage struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		CodeType int    `json:"codeType"`
		CodeMsg  string `json:"codeMsg"`
		Vo       struct {
			AssociatedTaoBaoSpuId string `json:"associatedTaoBaoSpuId"`
			List                  []struct {
				Type          string        `json:"type"`
				Title         string        `json:"title"`
				ImageUrls     []string      `json:"imageUrls"`
				JumpUrls      []string      `json:"jumpUrls"`
				PriceDesc     []string      `json:"priceDesc"`
				PricePrefix   string        `json:"pricePrefix"`
				PriceSymbol   string        `json:"priceSymbol"`
				PayType       int           `json:"payType"`
				HasWished     int           `json:"hasWished"`
				LogData       string        `json:"logData"`
				ActivityCount int           `json:"activityCount"`
				SubSaleType   int           `json:"subSaleType"`
				ItemsId       int           `json:"itemsId"`
				ItemType      int           `json:"itemType"`
				SaleType      int           `json:"saleType"`
				UgcList       []interface{} `json:"ugcList"`
				Tags          struct {
					PromotionTagNames     interface{}   `json:"promotionTagNames"`
					MarketingTagNames     interface{}   `json:"marketingTagNames"`
					SaleTypeTagNames      interface{}   `json:"saleTypeTagNames"`
					TypeAndLimitTagName   *string       `json:"typeAndLimitTagName"`
					ItemTagNames          interface{}   `json:"itemTagNames"`
					RecommendTagNames     []interface{} `json:"recommendTagNames"`
					FeedBoardTag          interface{}   `json:"feedBoardTag"`
					BlindBoxHideTypeNames interface{}   `json:"blindBoxHideTypeNames"`
					BlindBoxHasWishNames  interface{}   `json:"blindBoxHasWishNames"`
					TitleTagNames         interface{}   `json:"titleTagNames"`
					TagsSort              interface{}   `json:"tagsSort"`
					AdTagNames            interface{}   `json:"adTagNames"`
					GodlikeTag            interface{}   `json:"godlikeTag"`
					AttributeTagNames     interface{}   `json:"attributeTagNames"`
					ExclusiveSalePoints   interface{}   `json:"exclusiveSalePoints"`
					OtherSalePoints       interface{}   `json:"otherSalePoints"`
					BlindBoxEuroNames     interface{}   `json:"blindBoxEuroNames"`
					BlindBoxCommendTags   interface{}   `json:"blindBoxCommendTags"`
					ServiceTagNames       interface{}   `json:"serviceTagNames"`
					DrainageTags          interface{}   `json:"drainageTags"`
					ActionTags            interface{}   `json:"actionTags"`
					ActThereMaterial      interface{}   `json:"actThereMaterial"`
					ExtraTempTags         interface{}   `json:"extraTempTags"`
				} `json:"tags"`
				UgcSize                int    `json:"ugcSize"`
				Like                   int    `json:"like"`
				Brief                  string `json:"brief"`
				SubStatus              int    `json:"subStatus"`
				BrandId                int    `json:"brandId"`
				PresaleDeliveryTimeStr string `json:"presaleDeliveryTimeStr"`
				ItemsType              int    `json:"itemsType"`
				SubSkuList             []struct {
					ImageUrl                string      `json:"imageUrl"`
					Type                    int         `json:"type"`
					Name                    string      `json:"name"`
					SubSkuId                int         `json:"subSkuId"`
					SaleStatus              interface{} `json:"saleStatus"`
					WishedSku               bool        `json:"wishedSku"`
					ItemsType               interface{} `json:"itemsType"`
					PresaleDeliveryTimeStr  interface{} `json:"presaleDeliveryTimeStr"`
					OverseasPreShippingTime interface{} `json:"overseasPreShippingTime"`
					WhiteListSku            interface{} `json:"whiteListSku"`
					SubSkuPrice             interface{} `json:"subSkuPrice"`
					SubSkuItemsId           interface{} `json:"subSkuItemsId"`
					Url                     interface{} `json:"url"`
					SliceNum                interface{} `json:"sliceNum"`
					SkuSpec                 interface{} `json:"skuSpec"`
				} `json:"subSkuList"`
				JumpLinkType   int  `json:"jumpLinkType"`
				SubSkuNum      int  `json:"subSkuNum,omitempty"`
				SubSkuRareNum  int  `json:"subSkuRareNum,omitempty"`
				CanFav         bool `json:"canFav"`
				BzType         int  `json:"bzType"`
				Living         bool `json:"living"`
				HasWishedCount int  `json:"hasWishedCount,omitempty"`
				SkuCardVO      struct {
					BlindBoxNewsVOList []struct {
						Avatar     interface{} `json:"avatar"`
						Nickname   string      `json:"nickname"`
						Mid        interface{} `json:"mid"`
						Content    string      `json:"content"`
						Style      interface{} `json:"style"`
						StyleValue string      `json:"styleValue"`
						Ctime      interface{} `json:"ctime"`
					} `json:"blindBoxNewsVOList"`
					SubSkuVO struct {
						ImageUrl                string      `json:"imageUrl"`
						Type                    int         `json:"type"`
						Name                    string      `json:"name"`
						SubSkuId                int         `json:"subSkuId"`
						SaleStatus              interface{} `json:"saleStatus"`
						WishedSku               bool        `json:"wishedSku"`
						ItemsType               interface{} `json:"itemsType"`
						PresaleDeliveryTimeStr  interface{} `json:"presaleDeliveryTimeStr"`
						OverseasPreShippingTime interface{} `json:"overseasPreShippingTime"`
						WhiteListSku            interface{} `json:"whiteListSku"`
						SubSkuPrice             interface{} `json:"subSkuPrice"`
						SubSkuItemsId           interface{} `json:"subSkuItemsId"`
						Url                     interface{} `json:"url"`
						SliceNum                interface{} `json:"sliceNum"`
						SkuSpec                 interface{} `json:"skuSpec"`
					} `json:"subSkuVO"`
					PuppyNum interface{} `json:"puppyNum"`
					LemonNum interface{} `json:"lemonNum"`
					ImageUrl string      `json:"imageUrl"`
				} `json:"skuCardVO,omitempty"`
			} `json:"list"`

			NumResults      int    `json:"numResults"`
			TagLayout       int    `json:"tagLayout"`
			QuickFilterType string `json:"quickFilterType"`
			Seid            string `json:"seid"`
		} `json:"vo"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MagicWarOrderBoxDetail struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		ItemsId        int     `json:"itemsId"`
		PayType        int     `json:"payType"`
		Price          float64 `json:"price"`
		SkuId          int     `json:"skuId"`
		ActivityInfoVO struct {
			ActivityId interface{} `json:"activityId"`
			Type       interface{} `json:"type"`
		} `json:"activityInfoVO"`
		SubSkuVOList []struct {
			ImageUrl         string `json:"imageUrl"`
			HideType         int    `json:"hideType"`
			HasWish          int    `json:"hasWish"`
			SkuId            int    `json:"skuId"`
			WishSuccCount    int    `json:"wishSuccCount"`
			SkuName          string `json:"skuName"`
			DemogorgonSku    bool   `json:"demogorgonSku"`
			DemogorgonAvatar string `json:"demogorgonAvatar,omitempty"`
		} `json:"subSkuVOList"`
		HasWished       bool    `json:"hasWished"`
		BlindBoxCoin    float64 `json:"blindBoxCoin"`
		WishSuccNum     int     `json:"wishSuccNum"`
		BlindBoxWishUgc []struct {
			Avatar     string `json:"avatar,omitempty"`
			UgcContent string `json:"ugcContent"`
			SrcStatus  int    `json:"srcStatus"`
			Index      int    `json:"index"`
		} `json:"blindBoxWishUgc"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MagicWarOrderBoxWishReq struct {
	ItemsId       int     `json:"itemsId"`
	Avatar        string  `json:"avatar"`
	Msource       string  `json:"msource"`
	Nickname      string  `json:"nickname"`
	BlindBoxCoin  float64 `json:"blindBoxCoin"`
	DeviceId      string  `json:"deviceId"`
	PayType       int     `json:"payType"`
	Price         float64 `json:"price"`
	ImageUrl      string  `json:"imageUrl"`
	HideType      int     `json:"hideType"`
	HasWish       int     `json:"hasWish"`
	SkuId         int     `json:"skuId"`
	WishSuccCount int     `json:"wishSuccCount"`
	SkuName       string  `json:"skuName"`
	DemogorgonSku bool    `json:"demogorgonSku"`
}

type MagicWarOrderBoxWishResp struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		WishResult           bool        `json:"wishResult"`
		ShieldCheckResult    bool        `json:"shieldCheckResult"`
		ShieldCheckResultDTO interface{} `json:"shieldCheckResultDTO"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type MagicWarReceiveResp struct {
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
				ReceiveStatus int    `json:"receiveStatus"`
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

type MagicWarReceiveResp2 struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		PrizeList []struct {
			RightsJumpDesc string      `json:"rightsJumpDesc"`
			RightsJumpUrl  interface{} `json:"rightsJumpUrl"`
			Prize          struct {
				PrizeName        string `json:"prizeName"`
				PrizeImg         string `json:"prizeImg"`
				PrizeNum         int    `json:"prizeNum"`
				FaceValue        int    `json:"faceValue"`
				AmountType       int    `json:"amountType"`
				RightsType       int    `json:"rightsType"`
				TaskRightsIdList []struct {
					RightsId int `json:"rightsId"`
					RewardId int `json:"rewardId"`
				} `json:"taskRightsIdList"`
				RandomType int `json:"randomType"`
			} `json:"prize"`
		} `json:"prizeList"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

// 部分账号没有战令
// 5 魔晶
func MagicWarOrder(idx, tp int) {
	url := pkg.Host["mall"] + "/mall-magic-c/internet/mls_pm/war_order/activity_head_info"
	//fmt.Println(url)
	magicWarOrderInfo := MagicWarOrderInfo{}
	resp := inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, strings.NewReader("{}"))
	err := json.Unmarshal(resp, &magicWarOrderInfo)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "MagicWarOrder", err.Error(), string(resp))
		return
	}
	if magicWarOrderInfo.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "MagicWarOrder", magicWarOrderInfo.Code, string(resp))
		return
	}

	if tp == 2 {
		magicWarOrderReceive(idx, magicWarOrderInfo.Data.ActivityId)
	} else {
		MagicWarOrderView(idx, magicWarOrderInfo.Data.ActivityId)
		MagicWarOrderWish(idx)
	}
}

func MagicWarOrderView(idx int, acId string) {
	// 浏览获得得5积分
	urlView := "https://mall.bilibili.com/mall-magic-c/internet/mls_pm/war_order/activity_task_list" // POST
	reqBody := fmt.Sprintf(`{"activityId":"%s"}`, acId)
	resp := inet.DefaultClient.CheckSelectPost(urlView, "", "", "", idx, strings.NewReader(reqBody))
	magicWarPage := &MagicWarPage{}
	err := json.Unmarshal(resp, magicWarPage)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "MagicWarOrderView", err.Error(), string(resp))
		return
	}
	if magicWarPage.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "MagicWarOrderView", magicWarPage.Code, string(resp))
		return
	}
	herculesId := magicWarPage.Data.TaskList.NormalTasks[0].GuideLink
	herculesIds := strings.Split(herculesId, "=")
	if len(herculesIds) != 2 {
		fmt.Println(herculesId)
		return
	}
	taskId := herculesIds[1]
	//fmt.Println("taskId", taskId)
	urlView = fmt.Sprintf(pkg.Host["show"]+"/api/activity/hercules/task/report-detail?taskId=%s", taskId) // get
	magicWarViewReporter := &MagicWarViewReporter{}
	resp = inet.DefaultClient.CheckSelect(urlView, idx)
	err = json.Unmarshal(resp, magicWarViewReporter)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "MagicWarOrderView", err.Error(), string(resp))
		return
	}
	if magicWarViewReporter.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "MagicWarOrderView", magicWarPage.Code, string(resp))
		return
	}
	time.Sleep(10 * time.Second)
	urlView = pkg.Host["show"] + "/api/activity/fire/common/event/dispatch" // post json csrf+eventid
	reqBody = fmt.Sprintf(`{"csrf":"%s","eventId":"%s"}`, inet.DefaultClient.Cks[idx].Csrf, magicWarViewReporter.Data.EventId)
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
	fmt.Println("战令浏览成功")

}

// hard
func MagicWarOrderWish(idx int) {
	magicWarOrderBoxPageReq := &MagicWarOrderBoxPageReq{}
	magicWarOrderBoxPageReq.BzType = 1
	magicWarOrderBoxPageReq.FixSelect = make([]FixSelect, 1)
	magicWarOrderBoxPageReq.FixSelect[0].BriefName = "综合"
	magicWarOrderBoxPageReq.FixSelect[0].Check = true
	magicWarOrderBoxPageReq.FixSelect[0].SelectName = "综合排序"
	magicWarOrderBoxPageReq.FixSelect[0].SelectType = 4
	magicWarOrderBoxPageReq.Group = 1
	magicWarOrderBoxPageReq.Init = true
	magicWarOrderBoxPageReq.MallChannelId = "1"
	magicWarOrderBoxPageReq.MVersion = 168
	magicWarOrderBoxPageReq.Network = "mobile"
	magicWarOrderBoxPageReq.PageNum = 1
	magicWarOrderBoxPageReq.PageSize = 20
	magicWarOrderBoxPageReq.Scene = "bilndbox"
	s, _ := json.Marshal(magicWarOrderBoxPageReq)
	rs := strings.NewReader(string(s))
	url := pkg.Host["mall"] + "/magic-c-search/blind_box/feed/list/v2"
	magicWarOrderBoxPage := &MagicWarOrderBoxPage{}
	resp := inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, rs)
	err := json.Unmarshal(resp, magicWarOrderBoxPage)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "magicWarOrderWish", err.Error(), string(resp))
		return
	}
	if magicWarOrderBoxPage.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "magicWarOrderWish", magicWarOrderBoxPage.Code, string(resp))
		return
	}
	itemsId := magicWarOrderBoxPage.Data.Vo.List[0].ItemsId
	for i := 0; i < len(magicWarOrderBoxPage.Data.Vo.List); i++ {
		if magicWarOrderBoxPage.Data.Vo.List[i].HasWished == 1 || magicWarOrderBoxPage.Data.Vo.List[i].BzType != 2 {
			continue
		}
		itemsId = magicWarOrderBoxPage.Data.Vo.List[i].ItemsId
		break
	}

	url = pkg.Host["mall"] + fmt.Sprintf("/magic-c-search/blind_box/wish/detail?itemsId=%d&msource=magic-detail_detail&v=%d", itemsId, time.Now().UnixMilli())
	magicWarOrderBoxDetail := &MagicWarOrderBoxDetail{}
	resp = inet.DefaultClient.CheckSelect(url, idx)
	err = json.Unmarshal(resp, magicWarOrderBoxDetail)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "magicWarOrderWish", err.Error(), string(resp))
		return
	}
	if magicWarOrderBoxDetail.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "magicWarOrderWish", magicWarOrderBoxDetail.Code, string(resp))
		return
	}

	magicWarOrderBoxWishReq := &MagicWarOrderBoxWishReq{}
	magicWarOrderBoxWishReq.BlindBoxCoin = magicWarOrderBoxDetail.Data.BlindBoxCoin
	magicWarOrderBoxWishReq.HideType = 3
	magicWarOrderBoxWishReq.ImageUrl = magicWarOrderBoxDetail.Data.SubSkuVOList[0].ImageUrl
	magicWarOrderBoxWishReq.ItemsId = itemsId
	magicWarOrderBoxWishReq.Msource = "magic-detail_detail"
	magicWarOrderBoxWishReq.Price = magicWarOrderBoxDetail.Data.Price
	magicWarOrderBoxWishReq.SkuId = magicWarOrderBoxDetail.Data.SubSkuVOList[0].SkuId
	magicWarOrderBoxWishReq.SkuName = magicWarOrderBoxDetail.Data.SubSkuVOList[0].SkuName

	//url = pkg.Host["mall"] + fmt.Sprintf("/magic-c-search/blind_box/info?itemsId=%d&afterDraw=false&v=%d", itemsId, time.Now().UnixMilli())

	s, _ = json.Marshal(magicWarOrderBoxWishReq)
	rs = strings.NewReader(string(s))
	//fmt.Println(rs)
	url = pkg.Host["mall"] + "/magic-c-search/blind_box/wish/create/v2" // post
	resp = inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, rs)
	magicWarOrderBoxWishResp := &MagicWarOrderBoxWishResp{}
	err = json.Unmarshal(resp, magicWarOrderBoxWishResp)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "magicWarOrderWish", err.Error(), string(resp))
		return
	}
	if magicWarOrderBoxWishResp.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "magicWarOrderWish", magicWarOrderBoxWishResp.Code, string(resp))
		return
	}
	//magicWarOrderBoxWishReq.
	//fmt.Println(magicWarOrderBoxWishResp)

}

// 领取战令奖励
func magicWarOrderReceive(idx int, acId string) {
	url := pkg.Host["mall"] + "/mall-magic-c/internet/mls_pm/war_order/activity_grade_list"
	reqBody := fmt.Sprintf(`{"activityId":"%s"}`, acId)
	magicWarReceiveResp := &MagicWarReceiveResp{}
	resp := inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, strings.NewReader(reqBody))
	err := json.Unmarshal(resp, magicWarReceiveResp)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "magicWarOrderReceive1", err.Error(), string(resp))
		return
	}
	if magicWarReceiveResp.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "magicWarOrderReceive1", magicWarReceiveResp.Code, string(resp))
		return
	}
	url = pkg.Host["mall"] + "/mall-magic-c/internet/mls_pm/war_order/prize_receive"
	grade := magicWarReceiveResp.Data.CurrentGrade
	for i := 0; i < grade; i++ {
		reqBody = fmt.Sprintf(`{"woActivityId":"%s","rewardIdList":[%d]}`, acId, magicWarReceiveResp.Data.GradeList[i].NormalPrizeList[0].RewardId)
		magicWarReceiveResp2 := &MagicWarReceiveResp2{}
		resp = inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, strings.NewReader(reqBody))
		err = json.Unmarshal(resp, magicWarReceiveResp2)
		if err != nil {
			Note.StatusAddString(utils.ErrMsg["json"], "magicWarOrderReceive2", err.Error(), string(resp))
			continue
		}
		if magicWarReceiveResp2.Code != 0 {
			Note.StatusAddString(utils.ErrMsg["code"], "magicWarOrderReceive2", magicWarReceiveResp2.Code, string(resp))
			continue
		} else {
			fmt.Println("战令奖励领取成功")
		}

	}

}
