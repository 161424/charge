package utils

import (
	"bytes"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"strings"
	"time"
)

var DefaultUrl = "https://api.bilibili.com/x/polymer/web-dynamic/v1/opus/feed/space?page=1&host_mid="
var SpaceUrl = "https://www.bilibili.com/opus/"

type UserSpace struct {
	Code    int
	Message string
	Data    struct {
		Items []struct {
			Content string `json:"content"`
			OpusID  string `json:"opus_id"`
		}
	}
}

// 获取uname最近的几个动态dity
func GetUserOpus(Uid []string) []string {
	opus := map[string]struct{}{} // 去重使用
	if len(Uid) != 0 {
		utils.Shuffle(Uid) // 打乱被监听者uid
		for _, uid := range Uid {
			url := DefaultUrl + uid
			body := inet.DefaultClient.RedundantDW(url)
			userSpace := UserSpace{}
			err := json.Unmarshal(body, &userSpace)
			if err != nil {
				fmt.Println(err)
				continue
			}
			// 获取uid用户的space_opus
			// 只获取第一页的前十个动态
			counter := 0
			for _, item := range userSpace.Data.Items {
				if !strings.Contains(item.Content, "充电") {
					continue
				}
				if counter == 10 {
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
					if v, ok := s.Find("a").Attr("href"); ok {
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
