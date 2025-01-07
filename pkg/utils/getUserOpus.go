package utils

import (
	"bytes"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"regexp"
	"strings"
	"time"
)

var DefaultUrl = "https://api.bilibili.com/x/polymer/web-dynamic/v1/opus/feed/space?page=1&host_mid="
var DefaultSpaceVideo = "https://api.bilibili.com/x/space/wbi/arc/search?mid=%s&pn=1&ps=10"
var SpaceUrl = "https://www.bilibili.com/opus/"
var modelTp = "utils"

type UserSpace struct {
	Code    int
	Message string
	Data    struct {
		Items []struct {
			Content string `json:"content"` // 标题
			OpusID  string `json:"opus_id"` // 跳转链接
		}
	}
}

// #todo 有err，还不想改
// 获取uname最近的几个动态dity
func GetUserOpus(Uid []string) []string {
	opus := map[string]struct{}{} // 去重使用
	d := inet.DefaultClient

	if len(Uid) != 0 {
		re := regexp.MustCompile("[0-9]{18,}")
		utils.Shuffle(Uid) // 打乱被监听者uid
		for _, uid := range Uid {
			url := DefaultUrl + uid
			d.RedundantDW(url, modelTp, time.Second*5)
			userSpace := UserSpace{}
			body := <-d.AliveCh[modelTp]
			//idx := int(body[len(body)-1])
			err := json.Unmarshal(body[:len(body)-1], &userSpace)
			if err != nil {
				fmt.Println(string(body))
				fmt.Println(3, err)
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
				ibody := inet.DefaultClient.RedundantDW(_url, modelTp, time.Second*5)

				doc, err := goquery.NewDocumentFromReader(bytes.NewReader(ibody))
				if err != nil {
					panic(err)
				}

				doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
					//fmt.Println(1, s.Get(i), s.Text())
					if v, ok := s.Find("a").Attr("href"); ok {
						if re.MatchString(v) {
							opus[v] = struct{}{}
						}

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
