package common

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	url2 "net/url"
	"strconv"
	"strings"
	"time"
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

// 投币经验查询
func GetCoinExp(idx int) int {
	Note.Register("投币经验查询")
	urlCoinExp := "https://api.bilibili.com/x/web-interface/coin/today/exp" // 获得的经验
	resp := inet.DefaultClient.CheckSelect(urlCoinExp, idx)
	b := &body{}
	err := json.Unmarshal(resp, b)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "GetCoinExp", err.Error(), string(resp))
		return -1
	}
	if b.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "GetCoinExp", b.Code, b.Message)
		return -1
	}
	if b.Data != 0 {
		Note.AddString("今日已通过投币获得经验：*%d*\n", b.Data)
	}

	return b.Data
}

// 投币获取经验
func SpendCoin(idx, coin int) int {
	getAidByRecommend(idx, coin)
	time.Sleep(5 * time.Second)
	return GetCoinExp(idx)

}

// 获取推荐视频列表
func getAidByRecommend(idx, coin int) {
	url := "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=12&version=1&ps=4"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	r := &recommend{}
	err := json.Unmarshal(resp, r)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "getAidByRecommend", err.Error(), string(resp))
		return
	}
	if r.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "getAidByRecommend", r.Code, r.Message)
		return
	}
	state := 5 - coin/10
	for _, item := range r.Data.Item {
		// 获取稿件投币数量
		url = "https://api.bilibili.com/x/web-interface/archive/relation?aid="
		_url := url + strconv.Itoa(item.Id)
		resp = inet.DefaultClient.CheckSelect(_url, idx)
		ad := &aid{}
		err = json.Unmarshal(resp, ad)
		if err != nil {
			Note.StatusAddString(utils.ErrMsg["json"], "getAidByRecommend", err.Error(), string(resp))
			continue
		}
		if ad.Code != 0 {
			Note.StatusAddString(utils.ErrMsg["code"], "getAidByRecommend", ad.Code, ad.Data)
			continue
		}

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
		resp = inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", "", "", idx, strings.NewReader(postData.Encode()))
		aC := &addCoin{}
		err = json.Unmarshal(resp, aC)
		if err != nil {
			Note.StatusAddString(utils.ErrMsg["json"], "getAidByRecommend", err.Error(), string(resp))
			continue
		}
		//fmt.Println("ac", aC, string(resp), item)
		if aC.Code == 0 {
			Note.AddString("视频【%d】投币成功。获得%d经验。\n", item.Id, ct*10)
			state -= 2
		} else if aC.Code == 34005 {
			Note.AddString("视频【%d】投币已达到上限。\n", item.Id)
		} else {
			Note.AddString("视频【%d】投币失败。code:%d; msg：%s。\n", item.Id, aC.Code, aC.Message) // code:-403; msg：账号异常,操作失败。
		}

		// 观看任务。好像没啥用
		watchTargetVideoCommon(idx, item.Bvid)

		if state <= 0 {
			return
		}
	}

}
