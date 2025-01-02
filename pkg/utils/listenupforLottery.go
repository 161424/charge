package utils

import (
	"bytes"
	"charge/dao/redis"
	"charge/inet"
	"charge/utils"
	"context"
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"regexp"
	"strings"
	"time"
)

// 获取uname最近的几个动态dity
func ListenupforLottery(Uid []string) []string {
	opus := map[string]int{} // 去重使用
	ctx := context.Background()
	d := inet.DefaultClient
	if len(Uid) != 0 {
		utils.Shuffle(Uid) // 打乱被监听者uid
		re := regexp.MustCompile("[0-9]{18,}")
		stopPage := 5
		fmt.Println(Uid)
		for _, uid := range Uid {
			fmt.Printf("查看用户uid：%s。", uid)
			if uid == "2595733" {
				stopPage = 12
			}
			url := DefaultUrl + uid
			//fmt.Println(inet.DefaultClient)
			d.RedundantDW(url, modelTp, time.Second*5)
			body := <-d.AliveCh[modelTp]
			userSpace := UserSpace{}
			err := json.Unmarshal(body[:len(body)-1], &userSpace)
			if err != nil {
				fmt.Println(err)
				continue
			}
			his := redis.ListenUpHistory(ctx, uid)
			// 获取uid用户的space_opus
			// 只获取前五个图文数据
			counter := 0
			for _, item := range userSpace.Data.Items {
				op := map[string]int{}
				if counter == stopPage { //
					break
				}
				counter++
				fmt.Printf("正在查看第【%d】页内容；", counter)
				if strings.Contains(item.Content, "互动抽奖") == false {
					continue
				}
				if strings.Contains(his, item.OpusID) {
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
							op[re.FindString(v)]++
						}
					}

					if v, ok := s.Find("a").Attr("href"); ok { // 内嵌url
						if re.MatchString(v) {
							opus[re.FindString(v)]++
							op[re.FindString(v)]++
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
			//if len(opus) == 0 {
			//	fmt.Println(string(body))
			//}
			fmt.Println("获取到数据：", len(opus))
			redis.UpdateLUpHistory(ctx, uid, his)
		}
	}
	reOpus := []string{}
	for k := range opus {
		reOpus = append(reOpus, k)
	}
	return reOpus
}
