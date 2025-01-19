package common

import (
	"charge/inet"
	"charge/utils"
	"crypto/md5"
	"encoding/json"
	"fmt"
	"math/rand/v2"
	url2 "net/url"
	"strconv"
	"strings"
	"time"
)

type videoView struct {
	Code int
	Data struct {
		Bvid      string
		Aid       int
		Cid       int // pages[0]d对应的cid
		Title     string
		Videos    int // 稿件分p总数
		Copyright int // 1：原创 2：转载
		Pages     []struct {
			Cid      int
			Page     int
			Part     string // 分p标题
			Duration int    //  视频长度：分钟
		}
	}
	Message string
}

type reHeart struct {
	Code    int
	Message string
}

type WatchReceiveResp struct {
	Code int `json:"code"`
	Data struct {
		WatchCountDownCfg struct {
			TaskId string `json:"task_id"`
			Token  string `json:"token"`
		} `json:"watch_count_down_cfg"`
	} `json:"data"`
	Message string `json:"message"`
}

type OgvCards struct {
	Code int `json:"code"`
	Data []struct {
		ActivityId      int    `json:"activity_id"`
		BusinessType    int    `json:"business_type"`
		CardType        int    `json:"card_type"`
		EpId            int    `json:"ep_id"`
		From            int    `json:"from"`
		HasCloseButton  int    `json:"has_close_button"`
		Id              int    `json:"id"`
		ImgStyle        int    `json:"imgStyle"`
		ImgUrl          string `json:"img_url"`
		IsSupportCancel bool   `json:"is_support_cancel"`
		NeedLogin       bool   `json:"need_login"`
		Report          struct {
			ActivityExpGroupTag int `json:"activity_exp_group_tag"`
			ActivityExpTag      int `json:"activity_exp_tag"`
			EpId                int `json:"ep_id"`
			Interaction         int `json:"interaction"`
			OrderId             int `json:"order_id"`
			SeasonId            int `json:"season_id"`
		} `json:"report"`
		SeasonId       int `json:"season_id"`
		SelectedButton struct {
			EndColor   string `json:"end_color"`
			StartColor string `json:"start_color"`
			Title      string `json:"title"`
			TitleColor string `json:"title_color"`
		} `json:"selected_button"`
		ShowSelected      bool   `json:"show_selected"`
		SpecifiedSeasonId int    `json:"specifiedSeasonId"`
		Title             string `json:"title"`
		TitleColor        string `json:"title_color"`
		To                int    `json:"to"`
		UniqueId          string `json:"unique_id"`
		UnselectedSubText string `json:"unselectedSubText"`
		UnselectedButton  struct {
			EndColor   string `json:"end_color"`
			StartColor string `json:"start_color"`
			Title      string `json:"title"`
		} `json:"unselected_button"`
		UnselectedDisappearTime int `json:"unselected_disappear_time"`
		UnselectedShowTime      int `json:"unselected_show_time"`
	} `json:"data"`
	Message string `json:"message"`
}

func WatchTask() {

}

// 视频选集不需要更换bvid，只需要更换p就可
// bvid=BV1WDzFYjE3q的第140个视频
// https://www.bilibili.com/video/BV1WDzFYjE3q?p=140
// 对于不同的视频合集，需要更新bvid来更换视频

func watchTargetVideoCommon(idx int, bvid string) {
	// 获取vedio
	url := "https://api.bilibili.com/x/web-interface/view?bvid=" // 每一个视频的bvid都不同，
	_url := url + bvid
	resp := inet.DefaultClient.CheckSelect(_url, idx)
	vw := &videoView{}
	err := json.Unmarshal(resp, vw)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "watchTargetVideoCommon", err.Error(), string(resp))
		return
	}
	if vw.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "watchTargetVideoCommon", vw.Code, vw.Message)
		return
	}

	Note.AddString("正在观看:%s·《%s》\n", vw.Data.Title, vw.Data.Pages[0].Part)

	reqBody := url2.Values{}
	rh := &reHeart{}
	for _, t := range RandomTime() {
		reqBody.Set("bvid", vw.Data.Bvid)
		reqBody.Set("cid", strconv.Itoa(vw.Data.Cid))
		reqBody.Set("start_ts", strconv.FormatInt(time.Now().Unix(), 10))
		reqBody.Set("played_time", strconv.Itoa(t))
		reqBody.Set("realtime", strconv.Itoa(t))
		time.Sleep(time.Duration(t) * time.Second)
		resp = inet.DefaultClient.CheckSelectPost(_url, "application/x-www-form-urlencoded", "", "", idx, strings.NewReader(reqBody.Encode()))

		err = json.Unmarshal(resp, rh)
		if err != nil {
			return
		}
		if rh.Code != 0 {
			return
		}
	}
}

func RandomTime() (re []int) {
	t1 := rand.IntN(20) + 4 // 最少4，最长23
	t2 := rand.IntN(15)
	for i := 0; i < t1; i++ {
		re = append(re, 15)
	}
	re = append(re, t2)
	return
}

func WatchExp(idx int) int {
	url := "https://api.bilibili.com/x/report/web/heartbeat"
	reqBody := url2.Values{}
	reqBody.Set("aid", "113788095305605")
	reqBody.Set("cid", "27752595972")
	reqBody.Set("mid", "17819768")
	reqBody.Set("start_ts", "1736439677")
	reqBody.Set("realtime", "10")
	reqBody.Set("type", "3")
	reqBody.Set("play_type", "0")
	reqBody.Set("dt", "2")
	resp := inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", "", "", idx, strings.NewReader(reqBody.Encode()))
	re := &reSign{}
	err := json.Unmarshal(resp, re)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "WatchExp", err.Error(), string(resp))
		return -1
	}
	if re.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "WatchExp", re.Code, re.Message)
	}
	return re.Code
}

// 不知道干咩用的
func WatchRandomEp(idx int) {
	url := "https://api.bilibili.com/pgc/season/player/ogv/cards"
	reqBody := url2.Values{}
	b := BangumiList.Random()
	reqBody.Set("access_key", "c36372f25f8cbd568b7a506e86c65711CjA5U6SXRli12mz7hDToIAIIAbcix8ujBSoTKKQGWvz8h1krr5eQ9rEimbUu2vXSNzMSVldPRDZQWGo2UmphdXBEa0NTTzZmNjhEUkU0TWs0cmwzeENZYTlwS2ptcXk1dmk4WGRMSEpsXzVJWU1kTFJ5NmFvbWc5ZG5HN3NhSkNydGlucW1POERBIIEC")
	reqBody.Set("appkey", "1d8b6e7d45233436")
	reqBody.Set("build", "8020300")
	reqBody.Set("c_locale", "zh_CN")
	reqBody.Set("channel", "yingyongbao")
	reqBody.Set("disable_rcmd", "0")
	reqBody.Set("ep_id", strconv.Itoa(b.Id))
	reqBody.Set("mobi_app", "android")
	reqBody.Set("platform", "android")
	reqBody.Set("s_locale", "zh_CN")
	reqBody.Set("scene_type", "0")
	reqBody.Set("ts", strconv.FormatInt(time.Now().Unix(), 10))
	s := reqBody.Encode()
	s = APPKey(s)
	reqBody.Set("sign", s)
	url += "?" + reqBody.Encode()
	ogvCards := &OgvCards{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, ogvCards)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "watchRandomEp", err.Error(), string(resp))
		return
	}
	if ogvCards.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "watchRandomEp", ogvCards.Code, string(resp))
		return
	}

	url = "https://api.bilibili.com/pgc/activity/deliver/material/receive"
	reqBody = url2.Values{}
	reqBody.Set("access_key", "c36372f25f8cbd568b7a506e86c65711CjA5U6SXRli12mz7hDToIAIIAbcix8ujBSoTKKQGWvz8h1krr5eQ9rEimbUu2vXSNzMSVldPRDZQWGo2UmphdXBEa0NTTzZmNjhEUkU0TWs0cmwzeENZYTlwS2ptcXk1dmk4WGRMSEpsXzVJWU1kTFJ5NmFvbWc5ZG5HN3NhSkNydGlucW1POERBIIEC")
	reqBody.Set("activity_code", "")
	reqBody.Set("appkey", "1d8b6e7d45233436")
	reqBody.Set("build", "8020300")
	reqBody.Set("c_locale", "zh_CN")
	reqBody.Set("channel", "yingyongbao")
	reqBody.Set("disable_rcmd", "0")
	reqBody.Set("ep_id", strconv.Itoa(b.Id))
	reqBody.Set("from_spmid", "search.search-result.0.0") // 视频获取方法
	reqBody.Set("mobi_app", "android")
	reqBody.Set("platform", "android")
	reqBody.Set("s_locale", "zh_CN")
	reqBody.Set("season_id", strconv.Itoa(BangumiList.Season))
	reqBody.Set("spmid", "united.player-video-detail.0.0")
	reqBody.Set("statistics", "{\"appId\":1,\"platform\":3,\"version\":\"8.2.0\",\"abtest\":\"\"}")
	reqBody.Set("ts", strconv.FormatInt(time.Now().Unix(), 10))
	s = reqBody.Encode()
	s = APPKey(s)
	reqBody.Set("sign", s)
	other := map[string]string{}
	other["APP-KEY"] = "android"
	other["env"] = "prod"
	other["fp_local"] = "951c86318c17690e885ec6de669facc320241230014023186f2ba9aef4532de7"
	other["fp_remote"] = "951c86318c17690e885ec6de669facc320241230014023186f2ba9aef4532de7"
	other["Buvid"] = "XUF1B5AF0BF95BB6F1614E7BC40B3881EA6C6"
	other["GuestId"] = "24045169332770"
	other["session_id"] = "50809fbf"
	other["Host"] = "api.bilibili.com"
	//other["Buvid"] = "XUF1B5AF0BF95BB6F1614E7BC40B3881EA6C6"
	resp = inet.DefaultClient.APPCheckSelectPost(url, utils.ContentType["x"], "", "", other, idx, strings.NewReader(reqBody.Encode()))
	fmt.Printf("正在观看:%s·《%s》\n", BangumiList.Name, b.Show_title)
	watchReceiveResp := &WatchReceiveResp{}
	err = json.Unmarshal(resp, &watchReceiveResp)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "WatchRandomEp", err.Error(), string(resp))
		return
	}
	if watchReceiveResp.Code != 0 {
		Note.StatusAddString("观看视频%s失败.res Code:%d,res Message:%s", BangumiList.Name, watchReceiveResp.Code, watchReceiveResp.Message)
		return
	}
	// 异步执行
	go func() {
		time.Sleep(10 * time.Minute)
		code := WatchMovie(idx, watchReceiveResp.Data.WatchCountDownCfg.Token, watchReceiveResp.Data.WatchCountDownCfg.TaskId)
		if code == 0 {
			Note.AddString("10分钟视频观看完毕，获得40积分")
		}
	}()

}

func WatchMovie(idx int, token, taskId string) int {
	t := time.Now().Unix()
	tm := fmt.Sprintf("%d", time.Now().UnixMilli())
	url := "https://api.bilibili.com/pgc/activity/deliver/task/complete"
	reqBody := url2.Values{}
	reqBody.Set("csrf", inet.DefaultClient.Cks[idx].Csrf)
	reqBody.Set("timestamp", tm)
	reqBody.Set("task_id", taskId)                   //
	reqBody.Set("task_sign", GetTaskSign(tm, token)) // md5(`${timestamp}#df2a46fd53&${token}`)
	reqBody.Set("token", token)                      //
	reqBody.Set("statistics", "{\"appId\":1,\"platform\":3,\"version\":\"8.2.0\",\"abtest\":\"\"}")
	reqBody.Set("activity_code", "")
	reqBody.Set("ts", fmt.Sprintf("%d", t))
	//reqBody.Set("sign", "...")
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "", "", idx, strings.NewReader(reqBody.Encode()))
	re := &reSign{}
	err := json.Unmarshal(resp, re)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "WatchMovie", err.Error(), string(resp))
		return -1
	}
	if re.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "WatchMovie", re.Code, string(resp))
	}

	return re.Code
}

func GetTaskSign(timestamp, token string) string {
	data := fmt.Sprintf("%s#df2a46fd53&%s", timestamp, token)
	has := md5.Sum([]byte(data))
	md5str := fmt.Sprintf("%x", has) //将[]byte转成16进制
	return md5str
}
