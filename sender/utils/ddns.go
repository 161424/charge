package utils

import (
	"bytes"
	"charge/config"
	"charge/sender"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	url2 "net/url"
)

// Cloudflare API的设置
// dns_record_id 抓取url https://dash.cloudflare.com/api/v4/zones/{zone_id}/dns_records?per_page=200&order=type&direction=asc
// var zone_id = ""           //Cloudflare域名的Zone ID
// var dns_record_id = ""     //DNS记录的ID
// var api_token = "" // Cloudflare的API Token

type GCI struct {
	Result    bool
	Code      string
	Message   string
	IP        string
	IPVersion string
}

func GetCurrentIp() string {
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

func UpdateDnsRecode() func() {
	return func() {
		url := "https://api.cloudflare.com/client/v4/zones/%s/dns_records/%s"
		ddns := config.Cfg.DDNS
		monitor := sender.Monitor{}
		monitor.Tag = "DDNS"
		monitor.Title = "Ipv6"
		ip := GetCurrentIp()
		if ip == "" {
			monitor.Desp = fmt.Sprintf("ipv6的ip获取失败")
			monitor.PushS()
			return
		}
		data := map[string]interface{}{
			"type":    ddns.Type,
			"name":    ddns.Name, // 设置你的子域名
			"content": ip,
			"ttl":     1, // 自动TTL
		}
		body, _ := json.Marshal(data)
		client := &http.Client{}
		req, _ := http.NewRequest("PATCH", fmt.Sprintf(url, ddns.ZoneID, ddns.DnsRecordId), bytes.NewBuffer(body))
		req.Header.Add("Authorization", "Bearer "+ddns.ApiToken)
		resp, _ := client.Do(req)
		defer resp.Body.Close()

		if resp.StatusCode == 200 {
			fmt.Println(ip)
			monitor.Desp = fmt.Sprintf("AAAA %s更新为%s", ddns.Name, ip)
		} else {
			u, _ := io.ReadAll(resp.Body)
			monitor.Desp = fmt.Sprintf("AAAA %s更新失败。err data： %s", ddns.Name, string(u))
		}
		monitor.PushS()
	}
}

func DDNSCheck(u string) string {
	rawURL := "http://" + u + ":8080"
	parsedURL, err := url2.Parse(rawURL)
	if err != nil {
		fmt.Println("Error parsing URL:", err)
		return ""
	}
	ips, err := net.LookupIP(parsedURL.Hostname())
	if err != nil {
		fmt.Println("Error looking up IP:", err)
		return ""
	}
	is := []string{}
	for _, ip := range ips {
		fmt.Println("IP address:", ip)
		is = append(is, ip.String())
	}
	return is[0]
}
