package common

import (
	"charge/config"
	"charge/inet"
	"charge/sender"
	"charge/utils"
	"crypto/md5"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"sort"
	"strings"
)

var goods = map[string]int{"大会员3天卡": 720, "大会员7天卡": 1680}
var notifyDesp = ""

type S struct {
	Token              string `json:"token"`
	Title              string `json:"title"`
	Sale               int    `json:"sale"`
	Exchange_limit_num int
}

type Sku struct {
	Code    int
	Message string
	Data    struct {
		Skus []struct {
			Token string // 商品id
			Title string
			Price struct {
				Sale int
			}
			Exchange_limit_num int // 兑换次数

		}
		Page struct {
			Num   int
			Size  int
			Total int
		}
	}
}

type ExchangeResp struct {
	Code    int
	Message string
}

type SkuInfo struct {
	Code    int
	Message string
	Data    struct {
		Token              string
		Title              string
		Exchange_limit_num int
		Rights_detail      []struct {
			Content string
			Type    string // text,pic
		}
		Purchase_button struct {
			Status string // sold_out,available
		}
	}
}

func ExchangePoint(idx int) int {
	// 商品列表
	pn := 1  // 页面
	ps := 20 //  每一页的长度

	url := "https://api.bilibili.com/x/vip_point/sku/list?pn=%d&ps=%d"             // pn  ps   total
	iurl := "https://api.bilibili.com/x/vip_point/sku/info?token=%s&access_key=%s" // access_key,token
	for i := 1; i <= pn; i++ {
		_url := fmt.Sprintf(url, i, ps)
		sku := &Sku{}
		resp := inet.DefaultClient.CheckSelect(_url, idx)
		err := json.Unmarshal(resp, sku)
		if err != nil {
			fmt.Printf(utils.ErrMsg["json"], "ExchangePoint", err.Error(), string(resp))
			return -1
		}
		if sku.Code != 0 {
			fmt.Printf(utils.ErrMsg["code"], "exchangePoint", sku.Code, sku.Message)
			return sku.Code
		}
		for j := 0; j < len(sku.Data.Skus); j++ {
			_iurl := fmt.Sprintf(iurl, sku.Data.Skus[j].Token, config.Cfg.BUserCk[idx].Access_key)
			//if isMonday {
			//	exchangeGoodsNotify(_iurl, idx)
			//}

			skuInfo := &SkuInfo{}
			resp := inet.DefaultClient.CheckSelect(_iurl, idx)
			err := json.Unmarshal(resp, skuInfo)
			if err != nil {
				fmt.Printf(utils.ErrMsg["json"], "ExchangePoint", err.Error(), string(resp))
				continue
			}
			if skuInfo.Code != 0 {
				fmt.Printf(utils.ErrMsg["code"], "exchangePoint", skuInfo.Code, skuInfo.Message)
				continue
			}
			s := ""
			for i := 0; i < len(skuInfo.Data.Rights_detail); i++ {
				if skuInfo.Data.Rights_detail[i].Type == "text" {
					if len(skuInfo.Data.Rights_detail[i].Content) <= 2 {
						continue
					}
					s += skuInfo.Data.Rights_detail[i].Content
				}
			}

			notifyDesp += fmt.Sprintf("- 【%s】:%s\n", skuInfo.Data.Title, s)

			// 商品页面
			fmt.Println(skuInfo.Data.Title, skuInfo.Data.Token)
			if _, ok := goods[skuInfo.Data.Title]; ok == false {
				continue
			}

			//purchase_button.status 有available(可以兑换)，not_logging(没有access_key)，exchange_limit(不能兑换)
			if skuInfo.Data.Purchase_button.Status == "available" {
				fmt.Printf("《%s》可以兑换", skuInfo.Data.Title)
				if exchangePoint(idx, skuInfo.Data.Token) == 0 {
					fmt.Printf("大会员积分兑换物品【%s】成功，可能还可以兑换%d次\n", skuInfo.Data.Title, skuInfo.Data.Exchange_limit_num-1)
				}
			} else if skuInfo.Data.Purchase_button.Status == "not_logging" {
				fmt.Printf("大会员积分兑换物品【%s】失败，可能是因为Access_key失效\n", skuInfo.Data.Title)
			} else if skuInfo.Data.Purchase_button.Status == "exchange_limit" {
				fmt.Printf("大会员积分兑换物品【%s】失败，已达到最大兑换次数\n", skuInfo.Data.Title)
			} else if skuInfo.Data.Purchase_button.Status == "sold_out" {
				fmt.Printf("大会员积分兑换物品【%s】失败，该物品已售罄\n", skuInfo.Data.Title)
			} else {
				fmt.Println("未知状态", skuInfo)
			}
		}
		if sku.Data.Page.Total/sku.Data.Page.Size+1 == i {
			break
		} else {
			pn = sku.Data.Page.Total/sku.Data.Page.Size + 1
		}
	}

	monitor := sender.Monitor{}
	monitor.Title = "大会员积分兑换一览"
	monitor.Tag = "BigVip"
	monitor.Desp = notifyDesp
	monitor.PushS()

	return 0
}

func exchangePoint(idx int, token string) int {
	// 兑换礼品
	// token 1121621104260112804
	// access_key 88b1b9650860fe65157260671b4a08c1	 获取不到
	// resp {"code":0,"message":"0","ttl":1,"data":{"order":{"order_no":"1127676441278936310","sku_token":"1121621104260112804","mid":74199115,"point":29,"trade_time":1735332884,"state":1}}}

	url := "https://api.bilibili.com/x/vip_point/trade/order/create" // post
	reqBody := url2.Values{}
	reqBody.Set("token", token)
	reqBody.Set("access_key", config.Cfg.BUserCk[idx].Access_key)
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "", "", idx, strings.NewReader(reqBody.Encode()))
	eResp := &ExchangeResp{}
	err := json.Unmarshal(resp, &eResp)
	if err != nil {
		fmt.Printf(utils.ErrMsg["json"], "exchangePoint", err.Error(), string(resp))
		return -1
	}
	if eResp.Code != 0 {
		fmt.Printf(utils.ErrMsg["code"], "exchangePoint", eResp.Code, eResp)
		return eResp.Code
	}
	return 0
}

func exchangeGoodsNotify(url string, idx int) {
	//fmt.Println("url:", url)

}

func Appkey() {
	params := map[string]string{}
	pl := []string{"id", "str", "test", "appkey"}
	params["id"] = "114514"
	params["str"] = "1919810"
	params["test"] = "いいよ，こいよ"
	params["appkey"] = "1d8b6e7d45233436"
	appsec := "560c52ccd288fed045859ed18bffd973"

	sort.Strings(pl)
	s := ""
	for _, v := range pl {
		s += v + "=" + url2.QueryEscape(params[v]) + "&"
	}
	s = s[:len(s)-1]

	s += appsec
	fmt.Println(s)

	data := []byte(s) //切片
	has := md5.Sum(data)
	md5str := fmt.Sprintf("%x", has) //将[]byte转成16进制
	fmt.Println(md5str)
	fmt.Println(has)

}

func ExchangeManga(a, b, c, d int) {

}
