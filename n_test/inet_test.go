package n

import (
	"charge/utils"
	"fmt"
	"net"
	"net/url"
	"testing"
)

// 2409:8a44:4b12:c6e0:69ec:d9ee:89b:7878
func TestDDNS(t *testing.T) {
	ip := utils.GetCurrentIp()
	fmt.Println(ip)
	utils.UpdateDnsRecode(ip)
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
