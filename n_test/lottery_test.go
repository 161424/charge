package n

import (
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"os"
	"regexp"
	"testing"
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
