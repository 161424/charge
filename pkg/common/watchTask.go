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
		fmt.Println(err)
		return
	}
	if vw.Code != 0 {
		fmt.Println(vw.Code)
		return
	}

	fmt.Printf("正在观看:%s·《%s》\n", vw.Data.Title, vw.Data.Pages[0].Part)

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
		fmt.Printf(utils.ErrMsg["json"], "watchExp", err.Error(), string(resp))
		return -1
	}
	if re.Code != 0 {
		fmt.Printf(utils.ErrMsg["Code"], "watchExp", re.Code, string(resp))
	}
	return re.Code
}

// 不知道干咩用的
func WatchRandomEp(idx int) {
	url := "https://api.bilibili.com/pgc/activity/deliver/material/receive"
	b := BangumiList.Random()
	reqBody := url2.Values{}
	//reqBody.Set("access_key", "c36372f25f8cbd568b7a506e86c65711CjA5U6SXRli12mz7hDToIAIIAbcix8ujBSoTKKQGWvz8h1krr5eQ9rEimbUu2vXSNzMSVldPRDZQWGo2UmphdXBEa0NTTzZmNjhEUkU0TWs0cmwzeENZYTlwS2ptcXk1dmk4WGRMSEpsXzVJWU1kTFJ5NmFvbWc5ZG5HN3NhSkNydGlucW1POERBIIEC")
	reqBody.Set("spmid", "united.player-video-detail.0.0")
	reqBody.Set("season_id", strconv.Itoa(BangumiList.Season))
	reqBody.Set("activity_code", "")
	reqBody.Set("ep_id", strconv.Itoa(b.Id))
	reqBody.Set("from_spmid", "search.search-result.0.0")
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "", "", idx, strings.NewReader(reqBody.Encode()))
	fmt.Printf("正在观看:%s·《%s》\n", BangumiList.Name, b.Show_title)
	watchReceiveResp := &WatchReceiveResp{}
	err := json.Unmarshal(resp, &watchReceiveResp)
	if err != nil {
		fmt.Printf(utils.ErrMsg["json"], "WatchRandomEp", err.Error(), string(resp))
		return
	}
	if watchReceiveResp.Code != 0 {
		fmt.Printf("观看视频%s失败.res Code:%d,res Message:%s", BangumiList.Name, watchReceiveResp.Code, watchReceiveResp.Message)
	}
	fmt.Println(idx, watchReceiveResp.Data.WatchCountDownCfg.Token, watchReceiveResp.Data.WatchCountDownCfg.TaskId)
	// 异步执行
	go func() {
		time.Sleep(10 * time.Minute)
		code := WatchMovie(idx, watchReceiveResp.Data.WatchCountDownCfg.Token, watchReceiveResp.Data.WatchCountDownCfg.TaskId)
		if code == 0 {
			fmt.Println("10分钟视频观看完毕，获得40积分")
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
		fmt.Printf(utils.ErrMsg["json"], "WatchMovie", err.Error(), string(resp))
		return -1
	}
	if re.Code != 0 {
		fmt.Printf(utils.ErrMsg["code"], "WatchMovie", re.Code, string(resp))
	}

	return re.Code
}

func GetTaskSign(timestamp, token string) string {
	data := fmt.Sprintf("%s#df2a46fd53&%s", timestamp, token)
	has := md5.Sum([]byte(data))
	md5str := fmt.Sprintf("%x", has) //将[]byte转成16进制
	return md5str
}
