package n

import (
	"bytes"
	"charge/config"
	"charge/inet"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"testing"
)

func TestSpace(t *testing.T) {
	config.Start()
	_url := "https://www.bilibili.com/opus/1007475508047249432"
	opus := []string{}

	body := inet.DefaultClient.RedundantDW(_url)

	doc, err := goquery.NewDocumentFromReader(bytes.NewReader(body))
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
	fmt.Println(opus, len(opus))
}
