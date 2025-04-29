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

// 视频简介 和 专栏两种

// 99584491  沉吟浅笑  视频简介
// 885439    哔哩抽奖小助理  视频简介
// 1673762431 欠抽菌  视频简介

// 417545609 禄光同尘 专栏  抽奖合计第192期/显卡抽奖合集第十八期
// 226257459 _大锦鲤_  专栏  第749弹丨114个互动抽奖合集
// 100680137 你的工具人老公 专栏 2025.3.1史上最全抽奖合集（重磅出击！史上最好！最全！
// 666793038 官feifei 专栏 3月2日《官方互动抽奖合集》/3月2日《高价值抽奖合集&充电》
// 5536630 西伯利亞倉鼠 专栏 无标题
// 492426375 糯米是个背包 专栏 2025-03-01 互动抽奖&预约抽奖
// 373018905 奖指南  专栏 B站2025年抽奖活动汇总-1月23日更
// 2595733 无夏不春风 专栏 互动抽奖【2025-03-03开奖】/充电抽奖【2025-03-03开奖】/预约抽奖【2025-03-03开奖】

// 5536630  标题太长了，，，   也是短链。抽象
// 417545609  ... a href="https://b23.tv/GZWMZ3P"

type Videos struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Ttl     int    `json:"ttl"`
	Data    struct {
		Count int `json:"count"`
		Item  []struct {
			Title    string `json:"title"`
			Subtitle string `json:"subtitle"`
			Tname    string `json:"tname"`
			Uri      string `json:"uri"`
			Param    string `json:"param"`
			Goto     string `json:"goto"`
			Length   string `json:"length"`
			Duration int    `json:"duration"`
			Ctime    int    `json:"ctime"`
			Bvid     string `json:"bvid"`
			Videos   int    `json:"videos"`
			FirstCid int64  `json:"first_cid"`
		} `json:"item"`
	} `json:"data"`
}

var marchDiy = regexp.MustCompile("[0-9]{18,}")

// 预约抽奖中不了一点
// 获取uname最近的几个动态dity
func ListenUpForLotteryOpus(Uid []string, cmp chan struct{}) []string {
	opus := map[string]int{} // 去重使用
	ctx := context.Background()
	d := inet.DefaultClient

	if len(Uid) != 0 {
		utils.Shuffle(Uid) // 打乱被监听者uid

		reBv := regexp.MustCompile("https://b23.tv/[A-Za-z0-9]{7,17}")
		stopPage := 5
		fmt.Println("[opus]:监听专栏用户列表：", Uid)
		hu := map[string]string{}
		for _, uid := range Uid {
			fmt.Printf("[opus]:查看用户uid:【%s】。\n", uid)
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
				fmt.Println("[opus]:1.", err.Error())
				continue
			}
			his := redis.ListenUpHistory(ctx, uid)
			// 获取uid用户的space_opus
			// 只获取前五个图文数据
			counter := 0
			for _, item := range userSpace.Data.Items {
				if uid == "373018905" && counter == 1 {
					break
				}
				if counter == stopPage { //
					break
				}
				counter++
				skip := false
				//if uid == "2595733" && strings.Contains(item.Content, "互动抽奖") == false || strings.Contains(item.Content, "预约抽奖") == false
				if uid == "2595733" && strings.Contains(item.Content, "互动抽奖") == false {
					skip = true
				}
				if strings.Contains(his, item.OpusID) {
					skip = true
				}
				if skip {
					continue
				}

				f := DaleyTimeRandom2_10() // 做个延时，减少风控几率
				// https://www.bilibili.com/opus/1009676614375571474
				_url := SpaceUrl + item.OpusID
				d.RedundantDW(_url, modelTp, 0)
				body = <-d.AliveCh[modelTp]
				doc, err := goquery.NewDocumentFromReader(bytes.NewReader(body[:len(body)-1]))
				if err != nil {
					fmt.Println("[opus]:2.", err.Error())
					continue
				}

				lTime := doc.Find(".opus-module-author__pub__text").Text()
				if len(lTime) > 10 {
					lTime = lTime[:5] + "..."
				}
				fmt.Printf("[opus]:正在查看第【%d】页内容。文章id：%s；文章标题《%s》；%s\n", counter, item.OpusID, item.Content[:10], lTime)
				d.ArticleLike(item.OpusID) // 给专栏点赞
				doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
					//fmt.Println(1, s.Get(i), s.Text())
					if v := s.Find("span").Text(); v != "" { // 文字内容
						if marchDiy.MatchString(v) {
							opus[marchDiy.FindString(v)]++
						}
					}

					if v := s.Find("a").Text(); v != "" { // 文字内容
						if marchDiy.MatchString(v) {
							opus[marchDiy.FindString(v)]++
						}
					}

					s.Find("a").Each(func(i int, s *goquery.Selection) { //  内嵌url 专门处理 5536630
						if v, ok := s.Attr("href"); ok == true {
							if marchDiy.MatchString(v) {
								opus[marchDiy.FindString(v)]++
							}
							if reBv.MatchString(v) {
								o := Btv2opus(v)
								if marchDiy.MatchString(o) {
									opus[marchDiy.FindString(o)]++
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
			fmt.Printf("[opus]:目前统计到%d个Lottery，重复率是%f。\n", len(opus), float64(lotteryRepetitionRate)/float64(len(opus)))
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

// 1673762431，885439  视频置顶或简介
func ListenUpForLotteryVideo(Uid []string, cmp chan struct{}) []string {
	opus := map[string]int{} // 去重使用
	ctx := context.Background()
	d := inet.DefaultClient

	if len(Uid) != 0 {
		utils.Shuffle(Uid) // 打乱被监听者uid
		fmt.Println("[video]:监听视频用户列表：", Uid)
		hu := map[string]string{}
		for _, uid := range Uid {
			fmt.Printf("[video]:查看用户uid：【%s】。\n", uid)
			_url := "https://app.bilibili.com/x/v2/space/archive/cursor?vmid=" + uid
			videos := &Videos{}
			//fmt.Println(inet.DefaultClient)
			d.RedundantDW(_url, modelTp, 0)
			body := <-d.AliveCh[modelTp]
			err := json.Unmarshal(body[:len(body)-1], &videos)
			if err != nil {
				continue
			}
			his := redis.ListenUpHistory(ctx, uid)
			stopPage := 5
			counter := 0
			for _, item := range videos.Data.Item {
				if int64(item.Ctime+24*3600*10) < time.Now().Unix() { // 跳过发布超过10天的视频
					break
				}
				if counter == stopPage {
					break
				}
				_url = fmt.Sprintf("https://www.bilibili.com/video/%s/?spm_id_from=333.1387.homepage.video_card.click", item.Bvid)
				f := DaleyTimeRandom2_10() // 做个延时，减少风控几率.双重延时
				d.RedundantDW(_url, modelTp, 0)
				body = <-d.AliveCh[modelTp]
				doc, err := goquery.NewDocumentFromReader(bytes.NewReader(body[:len(body)-1]))
				if err != nil {
					continue
				}
				counter++

				rt := doc.Find(".desc-info-text").Text()
				if marchDiy.MatchString(rt) {
					diy := marchDiy.FindAllString(rt, -1)
					for _, di := range diy {
						opus[di]++
					}
					f()
				}

				if his != "" {
					his += "&" + item.Bvid
				} else {
					his = item.Bvid
				}

			}
			hu[uid] = his
			lotteryRepetitionRate := 0
			for _, v := range opus {
				lotteryRepetitionRate += v
			}
			fmt.Printf("[video]:目前统计到%d个Lottery，重复率是%f。\n", len(opus), float64(lotteryRepetitionRate)/float64(len(opus)))
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

// https://app.bilibili.com/x/v2/space/archive/cursor?vmid=[这里填写用户的uid（填写的时候记得把外面的方括号去掉）]
// 417545609，5536630 动态
