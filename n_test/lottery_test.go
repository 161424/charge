package n

import (
	"charge/config"
	"charge/dao/redis"
	"charge/pkg/listenUpForLottery"
	utils2 "charge/pkg/utils"
	"charge/utils"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"os"
	"regexp"
	"testing"
	"time"
)

func TestLottery2(t *testing.T) {
	d, _ := os.Open("D:\\编程\\golang\\porject-study\\charge\\date\\lottery2.html")
	doc, _ := goquery.NewDocumentFromReader(d)
	data := map[string]struct{}{}
	re := regexp.MustCompile("[0-9]{18,}")
	doc.Find(".opus-module-content > p").Each(func(i int, s *goquery.Selection) {
		//fmt.Println(1, s.Get(i), s.Text())
		if v := s.Find("span").Text(); v != "" {
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

	f2 := listenUpForLottery.BalanceLottery()
	f2()
}

func TestU(t *testing.T) {
	config.Start()
	lotterys := utils2.ListenupforLottery(config.Cfg.LotteryUid)

	//opus := utils2.GetUserOpus(config.Cfg.ChargeUid)
	fmt.Println(len(lotterys), lotterys)
	v := map[string]int{}
	for _, lottery := range lotterys {
		v[lottery]++
	}
	fmt.Println(v)
}
