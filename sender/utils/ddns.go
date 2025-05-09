package utils

import (
	"bytes"

	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	url2 "net/url"

	"charge/config"
	"charge/sender"
	"charge/utils"
)

// Cloudflare API的设置
// dns_record_id 抓取url https://dash.cloudflare.com/api/v4/zones/{zone_id}/dns_records?per_page=200&order=type&direction=asc
// var zone_id = ""           //Cloudflare域名的Zone ID
// var dns_record_id = ""     //DNS记录的ID
// var api_token = "" // Cloudflare的API Token

func UpdateDnsRecode() func() {
	return func() {
		url := "https://api.cloudflare.com/client/v4/zones/%s/dns_records/%s"

		var device = config.GetDevice()

		ddns := device.DDNS

		monitor := sender.Monitor{}
		monitor.Tag = "DDNS"
		monitor.Title = "Ipv6"
		ip := utils.GetCurrentIpv6()

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
