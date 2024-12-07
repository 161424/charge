package utils

import (
	"bytes"
	"charge/inet"
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"strings"
)

var DefaultUrl = "https://api.bilibili.com/x/polymer/web-dynamic/v1/opus/feed/space?host_mid="
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
	opus := []string{}
	if len(Uid) != 0 {
		for _, uid := range Uid {
			url := DefaultUrl + uid
			body := inet.DefaultClient.RedundantDW(url)
			userSpace := UserSpace{}
			err := json.Unmarshal(body, &userSpace)
			if err != nil {
				fmt.Println(err)
				continue
			}
			for _, item := range userSpace.Data.Items {
				if !strings.Contains(item.Content, "充电") {
					continue
				}
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
						opus = append(opus, v)
					}
				})
			}
			if len(opus) == 0 {
				fmt.Println(string(body))
			}

		}

	}
	return opus
}
