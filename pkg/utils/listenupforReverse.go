package utils

import (
	"bytes"
	"charge/dao/redis"
	"charge/inet"
	"context"
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"regexp"
	"strings"
	"time"
)

// 获取uname最近的几个动态dity
func ListenupforReverse(cmp chan struct{}) []string {
	opus := map[string]int{} // 去重使用
	ctx := context.Background()
	d := inet.DefaultClient
	uid := "2595733"

	re := regexp.MustCompile("[A-Za-z0-9+/.]+[7-9]")
	stopPage := 12

	fmt.Printf("查看用户uid：【%s】。\n", uid)

	url := DefaultUrl + uid
	//fmt.Println(inet.DefaultClient)
	d.RedundantDW(url, modelTp, time.Second*5)
	body := <-d.AliveCh[modelTp]
	userSpace := UserSpace{}
	err := json.Unmarshal(body[:len(body)-1], &userSpace)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	his := redis.ListenUpHistoryReserve(ctx, uid)
	// 获取uid用户的space_opus
	// 只获取前五个图文数据
	counter := 0
	for _, item := range userSpace.Data.Items {

		if counter == stopPage { //
			break
		}
		counter++
		skip := false

		if strings.Contains(item.Content, "预约抽奖") == false {
			skip = true
		}
		if strings.Contains(his, item.OpusID) {
			skip = true
		}
		fmt.Printf("正在查看第【%d】页内容-%s，是否跳过【%t】\n", counter, item.OpusID, skip)
		if skip {
			continue
		}
		f := DaleyTime(time.Now()) // 做个延时，减少风控几率
		// https://www.bilibili.com/opus/1009676614375571474
		_url := SpaceUrl + item.OpusID
		inet.DefaultClient.RedundantDW(_url, modelTp, 0)
		body = <-d.AliveCh[modelTp]
		doc, err := goquery.NewDocumentFromReader(bytes.NewReader(body[:len(body)-1]))
		if err != nil {
			panic(err)
		}

		doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
			//fmt.Println(1, s.Get(i), s.Text())
			if v := s.Find("span").Text(); v != "" { // 文字内容
				if re.MatchString(v) {
					opus[re.FindString(v)]++

				}
			}

		})
		f()

		if his != "" {
			his += "&" + item.OpusID
		} else {
			his = item.OpusID
		}
	}
	fmt.Println("总获取到数据：", len(opus))

	go func() {
		<-cmp
		fmt.Println("2")
		redis.UpdateRUpHistory(ctx, uid, his) // 同步可能导致未能完全获取动态
	}()

	reOpus := []string{}
	for k := range opus {
		reOpus = append(reOpus, k)
	}
	fmt.Println("1")
	return reOpus
}
