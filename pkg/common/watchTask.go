package common

import (
	"charge/inet"
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
		fmt.Println(rh, reqBody, string(resp), t)
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

// 不知道干咩用的
func watchRandomEp(idx int) int {
	url := "https://api.bilibili.com/pgc/activity/deliver/material/receive"
	referer := "https://big.bilibili.com/mobile/bigPoint"
	b := BangumiList.Random()
	reqBody := url2.Values{}
	reqBody.Set("spmid", "united.player-video-detail.0.0")
	reqBody.Set("season_id", strconv.Itoa(BangumiList.Season))
	reqBody.Set("activity_code", "")
	reqBody.Set("ep_id", strconv.Itoa(b.Id))
	reqBody.Set("from_spmid", "search.search-result.0.0")
	resp := inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", referer, "", idx, strings.NewReader(reqBody.Encode()))
	fmt.Printf("正在观看:%s·《%s》\n", BangumiList.Name, b.Show_title)
	reS := &reSign{}
	err := json.Unmarshal(resp, &reS)
	if err != nil {
		fmt.Println(err)
		return -1
	}
	if reS.Code != 0 {
		fmt.Printf("观看视频%s失败.res Code:%d,res Message:%s", BangumiList.Name, reS.Code, reS.Message)
		return reS.Code
	}

	return 0

}
