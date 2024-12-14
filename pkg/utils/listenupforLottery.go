package utils

import (
	"bytes"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"regexp"
	"time"
)

// 获取uname最近的几个动态dity
func ListenupforLottery(Uid []string) []string {
	opus := map[string]struct{}{} // 去重使用
	if len(Uid) != 0 {
		utils.Shuffle(Uid) // 打乱被监听者uid
		re := regexp.MustCompile("[0-9]{18,}")
		for _, uid := range Uid {
			fmt.Println("查看用户uid：", uid)
			url := DefaultUrl + uid
			body := inet.DefaultClient.RedundantDW(url)
			userSpace := UserSpace{}
			err := json.Unmarshal(body, &userSpace)
			if err != nil {
				fmt.Println(err)
				continue
			}
			// 获取uid用户的space_opus
			// 只获取前五个图文数据
			counter := 0
			for _, item := range userSpace.Data.Items {
				// https://www.bilibili.com/opus/1009676614375571474
				if counter == 5 { //
					break
				}
				f := DaleyTime(time.Now()) // 做个延时，减少风控几率
				_url := SpaceUrl + item.OpusID
				ibody := inet.DefaultClient.RedundantDW(_url)

				doc, err := goquery.NewDocumentFromReader(bytes.NewReader(ibody))
				if err != nil {
					panic(err)
				}

				doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
					//fmt.Println(1, s.Get(i), s.Text())
					if v := s.Find("span").Text(); v != "" { // 文字内容
						if re.MatchString(v) {
							opus[re.FindString(v)] = struct{}{}
						}
					}

					if v, ok := s.Find("a").Attr("href"); ok { // 内嵌url
						v = v[len(v)-19:]
						if v[0] == '/' {
							v = v[1:]
						}
						opus[v] = struct{}{}
					}
				})
				f()
				counter++
			}
			if len(opus) == 0 {
				fmt.Println(string(body))
			}
		}
	}
	reOpus := []string{}
	for k := range opus {
		reOpus = append(reOpus, k)
	}
	return reOpus
}
