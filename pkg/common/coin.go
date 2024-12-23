package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strconv"
	"strings"
)

type body struct {
	Code    int
	Message string
	Data    int
}

type gainCoin struct {
	Code    int
	Message string
	Data    []struct {
		Time   string `json:"time"`
		Delta  int    `json:"delta"`
		Reason string `json:"reason"`
	}
}

type account struct {
	Code int
	Data struct {
		Money float64
	}
}

type aid struct {
	Code int
	Data struct {
		Attention bool
		Coin      int
	}
}

type recommend struct {
	Code    int
	Message string
	Data    struct {
		Item []struct {
			Id    int
			Bvid  string
			Title string
			Owner struct {
				Mid  int
				Name string
				Face string
			}
		}
	}
}

type addCoin struct {
	Code    int // 0 是投币成功，34005是投币上限
	Message string
	Data    struct {
		Like bool // 是否点赞成功
	}
}

func GainCoin(idx int) {
	url := "https://api.bilibili.com/x/member/web/coin/log?jsonp=jsonp"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	gc := &gainCoin{}
	err := json.Unmarshal(resp, gc)
	if err != nil {
		return
	}
	if gc.Code != 0 {
		return
	}
}

// 1. 获取今日已投币经验，获取推荐列表，查看是否投币
// 2. 查看账号硬币个数
// 3. 对列表视频进行投币
// 4. 观看投币视频
func SpendCoin(idx int) {

	urlAccount := "https://account.bilibili.com/site/getCoin"
	urlCoinExp := "https://api.bilibili.com/x/web-interface/coin/today/exp" // 获得的经验

	resp := inet.DefaultClient.CheckSelect(urlCoinExp, idx)
	b := &body{}
	err := json.Unmarshal(resp, b)
	if err != nil {
		return
	}
	if b.Code != 0 {
		return
	}
	if b.Data >= 50 { //  已经通过硬币获得50经验
		// 获取账号硬币数量
		// earn expire
		return
	}
	resp = inet.DefaultClient.CheckSelect(urlAccount, idx)
	ac := &account{}
	err = json.Unmarshal(resp, ac)
	if err != nil {
		return
	}
	if b.Code != 0 {
		return
	}
	money := int(ac.Data.Money)
	if money < 5 { //账户不足5个硬币
		return
	}
	getAidByRecommend(idx)

}

func getAidByRecommend(idx int) {
	// 获取推荐视频列表
	url := "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=12&version=1&ps=4"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	r := &recommend{}
	err := json.Unmarshal(resp, r)
	if err != nil {
		return
	}
	if r.Code != 0 {
		return
	}

	state := 5
	for _, item := range r.Data.Item {
		// 获取稿件投币数量
		url = "https://api.bilibili.com/x/web-interface/archive/relation?aid="
		_url := url + strconv.Itoa(item.Id)
		resp = inet.DefaultClient.CheckSelect(_url, idx)
		ad := &aid{}
		err = json.Unmarshal(resp, ad)
		if err != nil {
			continue
		}
		if ad.Code != 0 {
			continue
		}
		//aid: 113672986822554
		//multiply: 2
		//select_like: 1
		//cross_domain: true
		//from_spmid: 333.1007.tianma.1-1-1.click
		//spmid: 333.788.0.0
		//statistics: {"appId":100,"platform":5}
		//eab_x: 2
		//ramval: 542
		//source: web_normal
		//ga: 1
		//csrf: f8eb4c45f314c7c88539facb7e077c55
		// 进行投币
		ct := 1 // 投币数量
		if state > 1 {
			ct = 2
		}
		url = "https://api.bilibili.com/x/web-interface/coin/add" // 正文参数（ application/x-www-form-urlencoded ）
		postData := url2.Values{}
		postData.Add("aid", strconv.Itoa(item.Id))
		postData.Add("multiply", strconv.Itoa(ct))                          // 投币数量
		postData.Add("csrf", utils.CutCsrf(inet.DefaultClient.Cks[idx].Ck)) // 必要
		postData.Add("select_like", "1")                                    // 进行点赞
		resp = inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", "", idx, strings.NewReader(postData.Encode()))
		aC := &addCoin{}
		err = json.Unmarshal(resp, aC)
		if err != nil {
			continue
		}
		fmt.Println("ac", aC, string(resp), item)
		if aC.Code == 0 {
			fmt.Println("点赞成功")
			state -= 2
		} else if aC.Code == 34005 {
			fmt.Println("点赞已达到上限")
		} else {
			fmt.Println("点赞失败：", aC.Message)
		}

		// 观看任务
		watchTargetVideoCommon(idx, item.Bvid)

		if state <= 0 {
			return
		}
	}

}
