package utils

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
)

type GCI struct {
	Result    bool
	Code      string
	Message   string
	IP        string
	IPVersion string
}

func GetCurrentIpv6() string {
	url := "https://6.ipw.cn/api/ip/myip?json"
	resp, err := http.Get(url)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	gci := &GCI{}
	err = json.Unmarshal(body, gci)
	if err != nil {
		return ""
	}
	return gci.IP
}

func GetCurrentIpv4() string {
	resp, err := http.Get("https://ipinfo.io/ip")
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	ip, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return ""
	}

	return string(ip)
}
