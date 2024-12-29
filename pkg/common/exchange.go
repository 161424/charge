package common

import (
	"charge/config"
	"charge/inet"
	"charge/sender"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strings"
	"time"
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
			Type    string
		}
		Purchase_button struct {
			Status string
		}
	}
}

func ExchangePoint(idx int) int {
	// 商品列表
	pn := 1  // 页面
	ps := 20 //  每一页的长度
	isMonday := time.Now().Weekday().String() == "Monday"

	url := "https://api.bilibili.com/x/vip_point/sku/list?pn=%d&ps=%d"            // pn  ps   total
	iurl := "https://api.bilibili.com/x/vip_point/sku/info?token=%saccess_key=%s" // access_key,token
	for i := 1; i <= pn; i++ {
		_url := fmt.Sprintf(url, i, ps)
		sku := &Sku{}
		resp := inet.DefaultClient.CheckSelect(_url, idx)
		err := json.Unmarshal(resp, sku)
		if err != nil {
			fmt.Println(err)
			return -1
		}
		if sku.Code != 0 {
			fmt.Println(sku.Code, sku.Message)
			return sku.Code
		}
		for j := 0; j < len(sku.Data.Skus); j++ {
			_iurl := fmt.Sprintf(iurl, sku.Data.Skus[j].Token, config.Cfg.Access_key[i])
			if isMonday {
				exchangeGoodsNotify(_iurl, idx)
			}
			// 商品页面
			if _, ok := goods[sku.Data.Skus[i].Title]; ok == false {
				continue
			}
			skuInfo := &SkuInfo{}
			resp := inet.DefaultClient.CheckSelect(_iurl, idx)
			err = json.Unmarshal(resp, skuInfo)
			if err != nil {
				fmt.Println(err)
				continue
			}
			if skuInfo.Code != 0 {
				fmt.Println(skuInfo.Code, skuInfo.Message)
				continue
			}
			//purchase_button.status 有available(可以兑换)，not_logging(没有access_key)，exchange_limit(不能兑换)
			if skuInfo.Data.Purchase_button.Status == "available" {
				if exchangePoint(idx, skuInfo.Data.Token) == 0 {
					fmt.Printf("大会员积分兑换物品【%s】成功，可能还可以兑换%d次\n", skuInfo.Data.Title, skuInfo.Data.Exchange_limit_num-1)
				}
			} else if skuInfo.Data.Purchase_button.Status == "not_logging" {
				fmt.Printf("大会员积分兑换物品【%s】失败，可能是因为Access_key失效\n", skuInfo.Data.Title)
			} else if skuInfo.Data.Purchase_button.Status == "exchange_limit" {
				fmt.Printf("大会员积分兑换物品【%s】失败，已达到最大兑换次数\n", skuInfo.Data.Title)
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
	if isMonday {
		monitor := sender.Monitor{}
		monitor.Title = "大会员积分兑换一览"
		monitor.Tag = "BigVip"
		monitor.Desp = notifyDesp
		monitor.PushS()
	}

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
	reqBody.Set("access_key", config.Cfg.Access_key[idx])
	resp := inet.DefaultClient.CheckSelectPost(url, contentType["x"], "", "", idx, strings.NewReader(reqBody.Encode()))
	eResp := &ExchangeResp{}
	err := json.Unmarshal(resp, &eResp)
	if err != nil {
		fmt.Println(err)
		return -1
	}
	if eResp.Code != 0 {
		fmt.Println(eResp.Code)
		return eResp.Code
	}
	return 0
}

func exchangeGoodsNotify(url string, idx int) {
	skuInfo := &SkuInfo{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, skuInfo)
	if err != nil {
		fmt.Println(err)
		return
	}
	if skuInfo.Code != 0 {
		fmt.Println(skuInfo.Code, skuInfo.Message)
		return
	}
	s := ""
	for i := 0; i < len(skuInfo.Data.Rights_detail); i++ {
		s += skuInfo.Data.Rights_detail[i].Content
	}
	notifyDesp += fmt.Sprintf("- 【%s】:%s", skuInfo.Data.Title, s)
}

func ExchangeManga(a, b, c, d int) {

}
