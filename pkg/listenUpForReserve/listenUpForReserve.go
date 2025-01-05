package listenUpForReserve

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strconv"
	"strings"
	"time"
)

// 金宝箱搞不了
// todo 转盘

type reserve struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    []struct {
		Sid                int    `json:"sid"`   //  预约uid
		Name               string `json:"name"`  // 预约名称
		Total              int    `json:"total"` //
		Stime              int    `json:"stime"` // 开始时间
		Etime              int    `json:"etime"` // 结束时间
		IsFollow           int    `json:"is_follow"`
		UpMid              int64  `json:"up_mid"` // 预约up
		ReserveRecordCtime int    `json:"reserve_record_ctime"`
	} `json:"data"`
}

type bIdResp struct {
	Code int `json:"code"`
	Data struct {
		LotteryId   int   `json:"lottery_id"`
		SenderUid   int   `json:"sender_uid"` // 预约up
		BusinessId  int   `json:"business_id"`
		Status      int   `json:"status"`       // 0 表示可以参加
		LotteryTime int64 `json:"lottery_time"` // 过期时间
	} `json:"data"`
	Message string `json:"message"`
	Msg     string `json:"msg"`
}

type bInfo struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		List interface{} `json:"list"`
	} `json:"data"`
}

type info struct {
	Sid      int `json:"sid"`
	Total    int `json:"total"`    // 参与人数
	IsFollow int `json:"isFollow"` // 参与后为1
	State    int `json:"state"`
}

type T struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// 预约直播，都是小up唉
func ReserveFromUid(idx int, vmid string) string {
	// 该url是从uid获取直播
	url := "https://api.bilibili.com/x/space/reservation?vmid=" + vmid
	resp := inet.DefaultClient.Http("GET", url, "", nil)
	r := new(reserve)
	err := json.Unmarshal(resp, r)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], err.Error(), string(resp))
	}

	//{
	//    "code": 0,
	//    "message": "0",
	//    "ttl": 1,
	//    "data": [
	//        {
	//            "sid": 4346152,
	//            "name": "直播预约：小天鹅生日Q版新衣回",
	//            "total": 241,
	//            "stime": 1735817097,
	//            "etime": 1736253300,
	//            "is_follow": 0,
	//            "state": 100,
	//            "oid": "",
	//            "type": 2,
	//            "up_mid": 3493259955407264,
	//            "reserve_record_ctime": 0,
	//            "live_plan_start_time": 1736251200,
	//            "lottery_type": 1,
	//            "lottery_prize_info": {
	//                "text": "预约有奖：绝版定制周边一份*3份、10个棒棒糖*7份",
	//                "lottery_icon": "https://i0.hdslb.com/bfs/activity-plat/static/ce06d65bc0a8d8aa2a463747ce2a4752/rgHplMQyiX.png",
	//                "jump_url": "https://www.bilibili.com/h5/lottery/result?business_id=4346152\u0026business_type=10"
	//            },
	//            "show_total": true,
	//            "subtitle": "",
	//            "attached_badge_text": ""
	//        }
	//    ]
	//}
	// https://www.bilibili.com/h5/lottery/result?business_id=4343316&business_type=10
	// url := "https://api.bilibili.com/x/space/reserve" // post
	// sid: 4336349
	// csrf: 776d8fef44b78d62fe2dc1b21f4ddc55

	// {"code":0,"message":"0","ttl":1}
	return ""
}

// have bug
func ReserveFromBusinessId(idx int, bId string) string {
	// 该url是从uid获取直播
	url := fmt.Sprintf("https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_id=%s&business_type=10", bId)
	resp := inet.DefaultClient.Http("GET", url, "", nil)
	bidResp := new(bIdResp)
	err := json.Unmarshal(resp, bidResp)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], err.Error(), string(resp))
	}
	if bidResp.Code != 0 {
		fmt.Println(1)
		return fmt.Sprintf(utils.ErrMsg["code"], "ReserveFromBusinessId", bidResp.Code, string(resp))
	}
	if bidResp.Data.Status != 0 || time.Unix(bidResp.Data.LotteryTime, 0).After(time.Now()) == false {
		return fmt.Sprintf("%s预约抽奖已经过期", bId)
	}

	url = fmt.Sprintf("https://api.bilibili.com/x/activity/up/reserve/relation/info?ids=%s", bId) // 获取total
	resp = inet.DefaultClient.CheckSelect(url, idx)
	binfo := new(bInfo)
	err = json.Unmarshal(resp, binfo)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], err.Error(), string(resp))
	}
	if binfo.Data.List == nil {
		return ""
	}
	ifo := &info{}
	ls := binfo.Data.List.(map[string]interface{})
	b, err := json.Marshal(ls[bId])
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], err.Error(), string(resp))
	}
	err = json.Unmarshal(b, ifo)
	if err != nil {
		fmt.Println(2)
		return fmt.Sprintf(utils.ErrMsg["json"], err.Error(), string(resp))
	}
	if ifo.IsFollow == 1 {
		return fmt.Sprintf("【%s】已经参与", bId)
	}
	// POST https://api.bilibili.com/x/space/reserve X sid=bid csrf 也可以达到效果
	url = "https://api.vc.bilibili.com/dynamic_mix/v1/dynamic_mix/reserve_attach_card_button"
	reqBody := url2.Values{}
	reqBody.Set("reserve_id", bId)
	reqBody.Set("cur_btn_status", "1")
	reqBody.Set("reserve_total", strconv.Itoa(ifo.Total)) // 注释也能使用。但有一个目在于无法知晓是否已经参与过
	//reqBody.Set("csrf", inet.DefaultClient.Cks[idx].Csrf)
	resp = inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "", "", idx, strings.NewReader(reqBody.Encode()))
	t := &T{}
	err = json.Unmarshal(resp, t)
	if err != nil {
		return fmt.Sprintf(utils.ErrMsg["json"], err.Error(), string(resp))
	}
	if t.Code != 0 {
		return fmt.Sprintf(utils.ErrMsg["code"], "ReserveFromBusinessId", t.Code, string(resp))
	}
	return fmt.Sprintf("【%s】参与成功", bId)
	//                 url: "//api.vc.bilibili.com/dynamic_mix/v1/dynamic_mix/reserve_attach_card_button",   // 参与预约
	//                method: "POST",
	//                data: {
	//                    reserve_id:reserve_id,
	//                    cur_btn_status:1,
	//                    reserve_total:reserve_total,
	//                    csrf: csrf_token,
	//                }
}

// 转盘
// http://flyx.fun:1369/sync/new_activities
