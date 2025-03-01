package n

import (
	"charge/config"
	"charge/dao/redis"
	"charge/pkg/LotteryGroup"
	"charge/pkg/LotteryUp"
	utils2 "charge/pkg/utils"
	"charge/utils"
	"context"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"os"
	"regexp"
	"testing"
	"time"
)

func TestLottery2(t *testing.T) {
	d, _ := os.Open("G:/编程/goland/project/try/charge/data/lottery2.html")
	doc, _ := goquery.NewDocumentFromReader(d)
	data := map[string]struct{}{}
	re := regexp.MustCompile("[0-9]{18,}")

	doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
		//fmt.Println(1, s.Get(i), s.Text())
		if v, ok := s.Find("a").Attr("href"); ok == true {
			fmt.Println("A href")
			if re.MatchString(v) {
				data[re.FindString(v)] = struct{}{}
			}
		}
		if v := s.Find("span").Text(); v != "" { // 文字内容
			fmt.Println("span")
			if re.MatchString(v) {
				data[re.FindString(v)] = struct{}{}
			}
		}

		if v := s.Find("a").Text(); v != "" { // 文字内容
			fmt.Println("a")
			if re.MatchString(v) {
				data[re.FindString(v)] = struct{}{}
			}
		}

	})
	fmt.Println(data, len(data))
}

func TestListenLotteryUp(t *testing.T) {
	config.Start()
	redis.Start()
	defer utils.Tracker(time.Now())

	f2 := LotteryUp.BalanceLottery()
	f2()
}

//func TestU(t *testing.T) {
//	config.Start()
//	lotterys := utils2.ListenupforLottery(config.Cfg.LotteryUid)
//
//	//opus := utils2.GetUserOpus(config.Cfg.ChargeUid)
//	fmt.Println(len(lotterys), lotterys)
//	v := map[string]int{}
//	for _, lottery := range lotterys {
//		v[lottery]++
//	}
//	fmt.Println(v)
//}

func TestAAL(t *testing.T) {
	config.Start()
	redis.Start()

	defer utils.Tracker(time.Now())
	f1 := LotteryUp.ListenLotteryUp()
	fmt.Println("开始f1")
	f1()
	time.Sleep(1 * time.Minute)
	f2 := LotteryGroup.ListenGroupForLottery()
	fmt.Println("开始f2")
	f2()
	time.Sleep(1 * time.Minute)
	//f3 := listenUpForLottery.BalanceLottery()
	//fmt.Println("开始f3")
	//f3()
	m := redis.GetAllLUpHistory(context.Background())
	fmt.Println(m)
}

//func TestR(t *testing.T) {
//	redis.Start()
//	lotterys := utils2.ListenupforLottery(config.Cfg.LotteryUid)
//	time.Sleep(20 * time.Second)
//	fmt.Println(len(lotterys), lotterys)
//	u := 0
//	for _, lottery := range lotterys {
//		if redis.ExitLottery(context.Background(), lottery) {
//			u++
//			fmt.Printf("%s is exit.%d", lottery, u)
//
//			continue
//		}
//
//	}
//}

func TestHget(t *testing.T) {
	config.Start()
	redis.Start()
	n := redis.RedisClient.HGet(context.Background(), "up", "123").Val()
	fmt.Println(n)
}

func TestLottery3(t *testing.T) {
	d, _ := os.Open("G:/编程/goland/project/try/charge/data/lottery2.html")
	doc, _ := goquery.NewDocumentFromReader(d)

	f := doc.Find("title").Text()
	fmt.Println(f)
}

func TestTv(t *testing.T) {
	fmt.Println(utils2.Btv2opus("https://b23.tv/rNyzhIB"))
}

func TestLottery4(t *testing.T) {
	d, _ := os.Open("G:/编程/goland/project/try/charge/data/lottery4.html")
	doc, _ := goquery.NewDocumentFromReader(d)
	doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
		//fmt.Println(1, s.Get(i), s.Text())
		//if v, ok := s.Attr("href"); ok == true {
		//	fmt.Println(v)
		//
		//}

		s.Find("a").Each(func(i int, s *goquery.Selection) {
			if v, ok := s.Attr("href"); ok == true {
				fmt.Println(v)

			}
		})
	})

}

func TestLottery5(t *testing.T) {
	d, _ := os.Open("G:/编程/goland/project/try/charge/data/videoPlayPage.html")
	doc, _ := goquery.NewDocumentFromReader(d)
	rt := doc.Find(".desc-info-text").Text()
	fmt.Println(rt)
}
