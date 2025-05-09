package n

import (
	"charge/config"
	"charge/inet"
	"charge/sender/utils"
	utils2 "charge/utils"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"testing"
	"time"
)

var modelTp = "test"

// 2409:8a44:4b12:c6e0:69ec:d9ee:89b:7878
func TestDDNS(t *testing.T) {
	ip := utils2.GetCurrentIpv6()
	fmt.Println(ip)
	utils.UpdateDnsRecode()
}

func TestCheck(t *testing.T) {
	rawURL := "http://like.151580.xyz"
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		fmt.Println("Error parsing URL:", err)
		return
	}
	ips, err := net.LookupIP(parsedURL.Hostname())
	if err != nil {
		fmt.Println("Error looking up IP:", err)
		return
	}
	for _, ip := range ips {
		fmt.Println("IP address:", ip)
	}
}

func TestYY(t *testing.T) {

	url2 := "https://api.bilibili.com/x/web-interface/coin/add" // 正文参数（ application/x-www-form-urlencoded ）
	postData := url.Values{}
	postData.Add("aid", "113480552157779")
	postData.Add("multiply", "2")
	postData.Add("csrf", "583fcc54c6e06e6220657ee0b29c9470")
	fmt.Println(postData.Encode())
	req, _ := http.NewRequest(http.MethodPost, url2, strings.NewReader(postData.Encode()))

	req.Header.Set("User-Agent", config.Cfg.WebUserAgent)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Cookie", "buvid3=BD420DC9-1E50-8034-A85F-9DD26C0F170282921infoc; b_nut=1718953682; _uuid=7C114E66-831F-C8E3-35DD-910F325342D8883701infoc; enable_web_push=DISABLE; rpdid=|(umRR~|kJm|0J'u~u)mlRRRl; header_theme_version=CLOSE; LIVE_BUVID=AUTO6817258668713773; buvid4=A2EED5AE-F341-6341-0BAE-B4EB7782CDFF10251-023040919-yFM8A5Q5nEe3t1Sl1VHWJA%3D%3D; buvid_fp_plain=undefined; CURRENT_BLACKGAP=0; hit-dyn-v2=1; DedeUserID=74199115; DedeUserID__ckMd5=8d1ad2254e14c603; CURRENT_QUALITY=116; fingerprint=d2bb79ad289465b816cc4c155fc421db; PVID=1; bsource=search_bing; buvid_fp=d2bb79ad289465b816cc4c155fc421db; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ4MDI4MTEsImlhdCI6MTczNDU0MzU1MSwicGx0IjotMX0.cZfiX5cuhN3gU7T8h-vQ5cZpx1suMKDwPqRUhDpcHLY; bili_ticket_expires=1734802751; bp_t_offset_74199115=1013384944942055424; b_lsid=1063645C3_193E9A89E3E; SESSDATA=5ab3ec5f%2C1750344670%2Ca11e0%2Ac1CjDMD39udWY4iRqNiObM0ayPVdyPJa93TIujA21t3s3ldWm4JN2BXeSrRlgu13LzfZQSVjNBNXRFUm5jTFFZR204T1NqQzJVVmpxTlNsTERfYXVDUlRQUHduU0ZpSXZBVUVaN1E4X2ZJX19XeXdhOUV5YjRCemhtX1d3UEZLMm9sV3VacVZtVnp3IIEC; bili_jct=583fcc54c6e06e6220657ee0b29c9470; CURRENT_FNVAL=2000; sid=gcrqfv1v; home_feed_column=4; browser_resolution=754-996")
	//req.PostForm = postData

	resp, _ := http.DefaultClient.Do(req)

	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}

func TestMutile(t *testing.T) {
	d := inet.DefaultClient
	d.RegisterTp(modelTp)
	for i := 0; i < 10; i++ {
		fmt.Println(i)

		d.RedundantDW(modelTp, "https://api.bilibili.com/x/web-interface/nav", time.Second)
		resp := <-d.AliveCh[modelTp]
		idx := int(resp[len(resp)-1])
		resp = resp[:len(resp)-1]
		fmt.Println(string(resp), idx)
	}
	//fmt.Println(1 % 2)

}
