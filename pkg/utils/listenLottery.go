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

// 5536630  标题太长了，，，   也是短链。抽象
// 417545609  ... a href="https://b23.tv/GZWMZ3P"
// 获取uname最近的几个动态dity
func ListenUpForLottery(Uid []string, cmp chan struct{}) []string {
	opus := map[string]int{} // 去重使用
	ctx := context.Background()
	d := inet.DefaultClient

	if len(Uid) != 0 {
		utils.Shuffle(Uid) // 打乱被监听者uid
		re := regexp.MustCompile("[0-9]{18,}")
		reBv := regexp.MustCompile("https://b23.tv/[A-Za-z0-9]{7,17}")
		stopPage := 5
		fmt.Println(Uid)
		hu := map[string]string{}
		for _, uid := range Uid {
			fmt.Printf("查看用户uid：【%s】。\n", uid)
			if uid == "2595733" {
				stopPage = 12
			} else {
				stopPage = 5
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
				if counter == stopPage { //
					break
				}
				counter++
				skip := false

				if uid == "2595733" && strings.Contains(item.Content, "互动抽奖") == false {
					skip = true
				}
				if strings.Contains(his, item.OpusID) {
					skip = true
				}
				fmt.Printf("正在查看第【%d】页内容，是否跳过【%t】。\n", counter, skip)
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

				lTime := doc.Find(".opus-module-author__pub__text").Text()
				if len(lTime) > 10 {
					lTime = lTime[:10] + "..."
				}
				fmt.Printf("文章id：%s；文章标题《%s》；%s\n", item.OpusID, item.Content, lTime)
				inet.DefaultClient.ArticleLike(item.OpusID)
				doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
					//fmt.Println(1, s.Get(i), s.Text())
					if v := s.Find("span").Text(); v != "" { // 文字内容
						if re.MatchString(v) {
							opus[re.FindString(v)]++
						}
					}

					if v := s.Find("a").Text(); v != "" { // 文字内容
						if re.MatchString(v) {
							opus[re.FindString(v)]++
						}
					}

					//if v, ok := s.Find("a").Attr("href"); ok { // 内嵌url
					//	if re.MatchString(v) {
					//		opus[re.FindString(v)]++
					//	}
					//	if reBv.MatchString(v) {
					//		o := Btv2opus(v)
					//		if re.MatchString(o) {
					//			opus[re.FindString(o)]++
					//		}
					//	}
					//}

					s.Find("a").Each(func(i int, s *goquery.Selection) { //  内嵌url 专门处理 5536630
						if v, ok := s.Attr("href"); ok == true {
							if re.MatchString(v) {
								opus[re.FindString(v)]++
							}
							if reBv.MatchString(v) {
								o := Btv2opus(v)
								if re.MatchString(o) {
									opus[re.FindString(o)]++
								}
							}
						}
					})

				})
				f()

				if his != "" {
					his += "&" + item.OpusID
				} else {
					his = item.OpusID
				}

			}
			hu[uid] = his
			lotteryRepetitionRate := 0
			for _, v := range opus {
				lotteryRepetitionRate += v
			}
			fmt.Printf("目前总取到Lottery个数：%d，重复率是%f。\n", len(opus), float64(lotteryRepetitionRate)/float64(len(opus)))
		}
		go func() {
			<-cmp
			for k, v := range hu {
				redis.UpdateLUpHistory(ctx, k, v) // 同步可能导致未能完全获取动态
			}
		}()
	}
	reOpus := []string{}
	for k := range opus {
		reOpus = append(reOpus, k)
	}
	return reOpus
}

// 不稳定，不在持久化
// 373018905 用户只更新这一条动态 https://www.bilibili.com/opus/940160425734963240
// 1673762431，885439  视频置顶或简介
func ListenUpForLottery2(Uid []string, cmp chan struct{}) []string {
	opus := map[string]int{} // 去重使用
	ctx := context.Background()
	d := inet.DefaultClient

	if len(Uid) != 0 {
		utils.Shuffle(Uid) // 打乱被监听者uid
		re := regexp.MustCompile("[0-9]{18,}")
		stopPage := 3
		fmt.Println(Uid)
		hu := map[string]string{}
		for _, uid := range Uid {
			fmt.Printf("查看用户uid：【%s】。\n", uid)
			f := DaleyTime(time.Now()) // 做个延时，减少风控几率
			if uid == "373018905" {    // 固定第一个文章
				_url := SpaceUrl + "940160425734963240"
				inet.DefaultClient.RedundantDW(_url, modelTp, 0)
				body := <-d.AliveCh[modelTp]
				doc, err := goquery.NewDocumentFromReader(bytes.NewReader(body[:len(body)-1]))
				if err != nil {
					panic(err)
				}

				lTime := doc.Find(".opus-module-author__pub__text").Text()
				lContent := doc.Find("title").Text()
				fmt.Printf("文章id：%s；文章标题《%s》；%s\n", "940160425734963240", lContent, lTime)
				doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
					if v := s.Find("span").Text(); v != "" { // 文字内容
						if re.MatchString(v) {
							opus[re.FindString(v)]++
						}
					}

					if v := s.Find("a").Text(); v != "" { // 文字内容
						if re.MatchString(v) {
							opus[re.FindString(v)]++
						}
					}

					if v, ok := s.Find("a").Attr("href"); ok { // 内嵌url
						if re.MatchString(v) {
							opus[re.FindString(v)]++

						}
					}
				})
			} else {
				stopPage = 3
				//url := fmt.Sprintf(DefaultSpaceVideo, uid)
				//resp := inet.DefaultClient.RedundantDW(url, modelTp, 2*time.Second)
				//for j := 0; j < stopPage; j++ {
				//
				//}
			}

			// https://www.bilibili.com/opus/1009676614375571474

			f()
			lotteryRepetitionRate := 0
			for _, v := range opus {
				lotteryRepetitionRate += v
			}
			fmt.Printf("目前总取到Lottery个数：%d，重复率是:%f\n", len(opus), float64(lotteryRepetitionRate)/float64(len(opus)))
		}
		fmt.Println(stopPage)
		go func() {
			<-cmp
			for k, v := range hu {
				redis.UpdateLUpHistory(ctx, k, v) // 同步可能导致未能完全获取动态
			}
		}()
	}
	reOpus := []string{}
	for k := range opus {
		reOpus = append(reOpus, k)
	}
	return reOpus
}

// https://app.bilibili.com/x/v2/space/archive/cursor?vmid=[这里填写用户的uid（填写的时候记得把外面的方括号去掉）]
// 417545609，5536630 动态
