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

// 大会员经验10
// /x/vip/experience/add
//POST /x/vip/experience/add HTTP/1.1
//native_api_from: h5
//Cookie: SESSDATA=f961354b%2C1751046279%2C4b5918c1CjDrDF6Zjbtj8LtHjYiGQporM3gsHm5BsY0OQh7Ow82jvCiay_gsWG9n-dacE3ESExkSVmFUMkN5c1hSY3hJaWswWGNmQjJjR3NQVmMxSV83bEU4bldocDMycV95RjJ3MTVHcGRmeEgzeExaR3hVRG9CUzZhUjMyYWlLbFpTWHhvbUtQWVFSQ1h3IIEC; bili_jct=0b38ccc1c50be02b2cdf27f69bddfc8f; DedeUserID=74199115; DedeUserID__ckMd5=8d1ad2254e14c603; sid=4ra8ix9l; Buvid=XUF1B5AF0BF95BB6F1614E7BC40B3881EA6C6
//buvid: XUF1B5AF0BF95BB6F1614E7BC40B3881EA6C6
//Accept: application/json, text/plain, */*
//Referer: https://big.bilibili.com/mobile/index?appId=125&appSubId=minetext&order_report_params=%7B%22act_id%22%3A%22691%22%2C%22buvid%22%3A%22XUF1B5AF0BF95BB6F1614E7BC40B3881EA6C6%22%2C%22exp_group_tag%22%3A%22def%22%2C%22exp_tag%22%3A%22def%22%2C%22material_type%22%3A%223%22%2C%22mid%22%3A%2274199115%22%2C%22position_id%22%3A%223%22%2C%22request_id%22%3A%225736d52cdfb9ae46358e0d3bcc67718a%22%2C%22source_from%22%3A%22vip.my-page.vip.entrance.click%22%2C%22tips_id%22%3A%2298257%22%2C%22tips_repeat_key%22%3A%2298257%3A3%3A1735494286%3A74199115%22%2C%22unit_id%22%3A%2225027%22%2C%22vip_status%22%3A%221%22%2C%22vip_type%22%3A%222%22%7D&source_from=vip.my-page.vip.entrance.click&exp_symbol=release_version&oflAb=1
//User-Agent: Mozilla/5.0 (Linux; Android 12; 24031PN0DC Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Safari/537.36 Mobile os/android model/24031PN0DC build/8020300 osVer/12 sdkInt/32 network/2 BiliApp/8020300 mobi_app/android channel/yingyongbao Buvid/XUF1B5AF0BF95BB6F1614E7BC40B3881EA6C6 sessionID/6ed164f5 innerVer/8020300 c_locale/zh_CN s_locale/zh_CN disable_rcmd/0 8.2.0 os/android model/24031PN0DC mobi_app/android build/8020300 channel/yingyongbao innerVer/8020300 osVer/12 network/2
//x-bili-trace-id: d8ebfbe8b723add3703dd30b2c67718c:703dd30b2c67718c:0:0
//x-bili-aurora-eid: VlAAT1gFB1Q=
//x-bili-mid: 74199115
//x-bili-aurora-zone:
//x-bili-gaia-vtoken:
//x-bili-ticket: eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzU1MjI4MzAsImlhdCI6MTczNTQ5MzczMCwiYnV2aWQiOiJYVUYxQjVBRjBCRjk1QkI2RjE2MTRFN0JDNDBCMzg4MUVBNkM2In0.BieYqUC6s7xcV_YfcgPg9ybW6RYbLZAaGWBJDT8Tm7o
//Content-Type: application/x-www-form-urlencoded; charset=utf-8
//Content-Length: 546
//Host: api.bilibili.com
//Connection: Keep-Alive
//Accept-Encoding: gzip

// access_key=4ef65d25ac3c507599c65afca0f399c1CjDrDF6Zjbtj8LtHjYiGQporM3gsHm5BsY0OQh7Ow82jvCiay_gsWG9n-dacE3ESExkSVmFUMkN5c1hSY3hJaWswWGNmQjJjR3NQVmMxSV83bEU4bldocDMycV95RjJ3MTVHcGRmeEgzeExaR3hVRG9CUzZhUjMyYWlLbFpTWHhvbUtQWVFSQ1h3IIEC&appkey=1d8b6e7d45233436&buvid=XUF1B5AF0BF95BB6F1614E7BC40B3881EA6C6&csrf=0b38ccc1c50be02b2cdf27f69bddfc8f&disable_rcmd=0&mobi_app=android&platform=android&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%228.2.0%22%2C%22abtest%22%3A%22%22%7D&ts=1735494720&sign=46b155369b3f97d31208265940b3c2dd

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
		fmt.Println(err)
		return
	}
	if b.Code != 0 {
		fmt.Println(b.Code, b.Message)
		return
	}
	if b.Data >= 50 { //  已经通过硬币获得50经验
		// 获取账号硬币数量
		// earn expire
		fmt.Printf("已获得经验：%d", b.Data)
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
	resp = inet.DefaultClient.CheckSelect(urlCoinExp, idx)
	b = &body{}
	err = json.Unmarshal(resp, b)
	if err != nil {
		return
	}
	if b.Code != 0 {
		return
	}
	fmt.Printf("通过投币已获得经验：%d\n", b.Data)

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
		resp = inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", "", "", idx, strings.NewReader(postData.Encode()))
		aC := &addCoin{}
		err = json.Unmarshal(resp, aC)
		if err != nil {
			continue
		}
		//fmt.Println("ac", aC, string(resp), item)
		if aC.Code == 0 {
			fmt.Println("投币成功")
			state -= 2
		} else if aC.Code == 34005 {
			fmt.Println("投币已达到上限")
		} else {
			fmt.Println("投币失败：", aC.Message)
		}

		// 观看任务
		watchTargetVideoCommon(idx, item.Bvid)

		if state <= 0 {
			return
		}
	}

}
