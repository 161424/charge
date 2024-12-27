package common

import "fmt"

func ExchangePoint(idx int) int {
	// 兑换列表
	url := "https://api.bilibili.com/x/vip_point/sku/list"

	// 商品页面
	url = "/x/vip_point/sku/info?token=%saccess_key=%s" // access_key,token
	fmt.Println(url)
	// purchase_button.status 有available(可以兑换)，not_logging(没有access_key)，exchange_limit(不能兑换)
	return 0
}

func ExchangeManga(a, b, c, d int) {

}
