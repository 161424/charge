package common

import (
	"charge/config"
	"charge/inet"
	"charge/utils"
	"crypto/md5"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strings"
	"sync"
)

var goods = map[string]int{"大会员3天卡": 720, "大会员7天卡": 1680, "会员购5魔晶": 500}
var notifyDesc = ""

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

// todo 兑换应该但拉出去，以更好地应对缺货商品
func ExchangePoint(idx, tp int) {
	if Note.Register("大会员积分兑换一览") {
		return
	}
	// 商品列表
	pn := 1  // 页面
	ps := 20 //  每一页的长度
	notifyDesc = ""
	url := "https://api.bilibili.com/x/vip_point/sku/list?pn=%d&ps=%d"             // pn  ps   total
	iurl := "https://api.bilibili.com/x/vip_point/sku/info?token=%s&access_key=%s" // access_key,token
	skip := false
	readAccess := sync.Once{}
	for i := 1; i <= pn; i++ {
		_url := fmt.Sprintf(url, i, ps)
		sku := &Sku{}
		resp := inet.DefaultClient.CheckSelect(_url, idx)
		err := json.Unmarshal(resp, sku)
		if err != nil {
			Note.StatusAddString(utils.ErrMsg["json"], "ExchangePoint", err.Error(), string(resp))
			return
		}
		if sku.Code != 0 {
			Note.StatusAddString(utils.ErrMsg["code"], "ExchangePoint", sku.Code, sku.Message)
			return
		}
		if inet.DefaultClient.Cks[idx].Access_key == "" && skip == false {
			Note.AddString("无Access_key，无法兑换大会员积分物品")
			skip = true
		}
		for j := 0; j < len(sku.Data.Skus); j++ {
			_iurl := fmt.Sprintf(iurl, sku.Data.Skus[j].Token, inet.DefaultClient.Cks[idx].Access_key)
			skuInfo := &SkuInfo{}
			resp := inet.DefaultClient.CheckSelect(_iurl, idx)
			err := json.Unmarshal(resp, skuInfo)
			if err != nil {
				Note.StatusAddString(utils.ErrMsg["json"], "ExchangePoint", err.Error(), string(resp))
				continue
			}
			if skuInfo.Code != 0 {
				Note.StatusAddString(utils.ErrMsg["code"], "ExchangePoint", skuInfo.Code, skuInfo.Message)
				continue
			}
			if strings.Contains(sku.Data.Skus[j].Title, "7天试用装扮") { // 去除7天试用装扮
				continue
			}
			s := ""
			for k := 0; k < len(skuInfo.Data.Rights_detail); k++ {
				if skuInfo.Data.Rights_detail[k].Type == "text" {
					if len(skuInfo.Data.Rights_detail[k].Content) <= 2 {
						continue
					}
					s += skuInfo.Data.Rights_detail[k].Content
				}
			}

			notifyDesc += fmt.Sprintf("- 【%s】:%s\n", skuInfo.Data.Title, s)

			// 商品页面
			if skip {
				continue
			}
			//fmt.Println(skuInfo.Data.Title, skuInfo.Data.Token)
			if _, ok := goods[skuInfo.Data.Title]; ok == false {
				continue
			} else if skuInfo.Data.Title == "会员购5魔晶" && tp != 2 {
				continue
			}

			//purchase_button.status 有available(可以兑换)，not_logging(没有access_key)，exchange_limit(不能兑换)
			if skuInfo.Data.Purchase_button.Status == "available" {
				Note.AddString("《%s》可以兑换\n", skuInfo.Data.Title)
				if exchangePoint(idx, skuInfo.Data.Token) == 0 {
					Note.AddString("大会员积分兑换物品【%s】成功，可能还可以兑换%d次\n", skuInfo.Data.Title, skuInfo.Data.Exchange_limit_num-1)
				}
			} else if skuInfo.Data.Purchase_button.Status == "not_logging" {
				Note.AddString("大会员积分兑换物品【%s】失败，可能是因为Access_key失效\n", skuInfo.Data.Title)
				readAccess.Do(func() {
					config.Read()
					if exchangePoint(idx, skuInfo.Data.Token) == 0 {
						Note.AddString("大会员积分兑换物品【%s】成功，可能还可以兑换%d次\n", skuInfo.Data.Title, skuInfo.Data.Exchange_limit_num-1)
					}
				})
			} else if skuInfo.Data.Purchase_button.Status == "exchange_limit" {
				Note.AddString("大会员积分兑换物品【%s】失败，已达到最大兑换次数\n", skuInfo.Data.Title)
			} else if skuInfo.Data.Purchase_button.Status == "sold_out" {
				Note.AddString("大会员积分兑换物品【%s】失败，该物品已售罄\n", skuInfo.Data.Title)
			} else {
				Note.AddString("未知状态\n", skuInfo)
			}
		}
		if sku.Data.Page.Total/sku.Data.Page.Size+1 == i {
			break
		} else {
			pn = sku.Data.Page.Total/sku.Data.Page.Size + 1
		}
	}
	Note.AddString("正在打印大会员积分兑换物品...\n")
	Note.AddString(notifyDesc[2:])

	return
}

func exchangePoint(idx int, token string) int {
	// 兑换礼品
	// token 1121621104260112804  礼品token
	// resp {"code":0,"message":"0","ttl":1,"data":{"order":{"order_no":"1127676441278936310","sku_token":"1121621104260112804","mid":74199115,"point":29,"trade_time":1735332884,"state":1}}}

	url := "https://api.bilibili.com/x/vip_point/trade/order/create" // post
	reqBody := url2.Values{}
	reqBody.Set("token", token)
	reqBody.Set("access_key", config.Cfg.BUserCk[idx].Access_key)
	resp := inet.DefaultClient.CheckSelectPost(url, utils.ContentType["x"], "", "", idx, strings.NewReader(reqBody.Encode()))
	eResp := &ExchangeResp{}
	err := json.Unmarshal(resp, &eResp)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "exchangePoint", err.Error(), string(resp))
		return -1
	}
	if eResp.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "exchangePoint", eResp.Code, eResp)
		return eResp.Code
	}
	return 0
}

func APPKey(s string) string {
	appsec := "560c52ccd288fed045859ed18bffd973"
	s += appsec
	data := []byte(s) //切片
	has := md5.Sum(data)
	md5str := fmt.Sprintf("%x", has) //将[]byte转成16进制
	return md5str
}
