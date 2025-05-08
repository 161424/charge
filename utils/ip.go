package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net"
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
		fmt.Println("未找到公网ipv4")
		return ""
	}
	defer resp.Body.Close()

	ip, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("公网ipv4解析错误", string(ip), err.Error())
		return ""
	}
	fmt.Println("公网ipv4:", string(ip))
	return string(ip)
}

func GetCurrentIpv4Private() []string {
	var ips []string

	interfaces, err := net.Interfaces()
	if err != nil {
		return nil
	}

	for _, iface := range interfaces {
		// 排除 docker0 接口
		if iface.Name == "docker0" {
			continue
		}

		// 跳过回环接口和未启用的接口
		if iface.Flags&net.FlagLoopback != 0 ||
			iface.Flags&net.FlagUp == 0 {
			continue
		}

		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		for _, addr := range addrs {
			ipNet, ok := addr.(*net.IPNet)
			if !ok {
				continue
			}

			ip := ipNet.IP
			if ip.To4() == nil {
				continue // 跳过 IPv6 地址（可选）
			}

			if isPrivateIP(ip) {
				ips = append(ips, ip.String())
			}
		}
	}

	return ips
}

// 判断是否为私有网络地址
func isPrivateIP(ip net.IP) bool {
	// IPv4私有地址范围：
	// 10.0.0.0/8
	// 172.16.0.0/12
	// 192.168.0.0/16
	// 169.254.0.0/16 (link-local)

	if ip4 := ip.To4(); ip4 != nil {
		return ip4[0] == 10 ||
			(ip4[0] == 172 && ip4[1] >= 16 && ip4[1] <= 31) ||
			(ip4[0] == 192 && ip4[1] == 168) ||
			(ip4[0] == 169 && ip4[1] == 254)
	}

	// 如果是IPv6，检查私有地址范围
	if len(ip) == net.IPv6len {
		// IPv6私有地址范围：
		// fc00::/7 (ULA)
		// fe80::/10 (link-local)
		return ip[0] == 0xfc || ip[0] == 0xfd ||
			(ip[0] == 0xfe && (ip[1]&0xc0) == 0x80)
	}

	return false
}
