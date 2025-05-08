package ql

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"time"

	"charge/config"
	"charge/utils"
	"github.com/elliotchance/pie/v2"
)

type qlClient struct {
	Client       *http.Client
	Addr         string
	ClientId     string
	ClientSecret string
}

var QlClient = qlClient{}

// var QlClientRemote = qlClient{}
func init() {
	QlClient.Client = &http.Client{
		Transport: &http.Transport{
			IdleConnTimeout: 30 * time.Second,
		},
	}
	var ql config.Ql
	var addr string
	var device = config.Cfg.LocalDevice
	ip := utils.GetCurrentIpv4()
	qlidx := pie.FindFirstUsing(config.Cfg.RemoteDevice, func(value config.Device) bool {
		return value.IP == ip
	})

	if qlidx != -1 {
		device = config.Cfg.RemoteDevice[qlidx]
	} else {
		fmt.Println("ql.未找到公网ip，尝试连接本地服务")
		ip = "localhost"

		// 私有ip需要的信息
	}
	ql = device.Ql
	QlClient.ClientId = ql.ClientId
	QlClient.ClientSecret = ql.ClientSecret
	port := ql.QLPort

	addr = ip + ":" + port
	QlClient.Addr = "http://" + addr
	ok := LinkQl()
	if ok != "" {
		fmt.Printf("成功访问 Local.QL地址%s\n", addr)
		return
	}

	fmt.Printf("访问 QL %s 失败。部分任务无法执行！！！。\n", QlClient.Addr)

}

func (q *qlClient) Post(url string, data io.Reader) ([]byte, error) {
	req, err := http.NewRequest("POST", url, data)
	if err != nil {
		return nil, err
	}
	resp, err := q.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

func (q *qlClient) Get(url string, token string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	resp, err := q.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

type AToken struct {
	Code int `json:"code"`
	Data struct {
		Token      string `json:"token"`
		TokenType  string `json:"token_type"`
		Expiration int    `json:"expiration"`
	} `json:"data"`
}

func LinkQl() string {
	time.Sleep(10 * time.Second)
	if QlClient.ClientId == "" || QlClient.ClientSecret == "" {
		fmt.Println("ql 身份验证失败")
		return ""
	}
	url := QlClient.Addr + fmt.Sprintf("/open/auth/token?client_secret=%s&client_id=%s", QlClient.ClientSecret, QlClient.ClientId)

	resp, ok := QlClient.Get(url, "")
	if ok != nil {
		fmt.Println(ok)
		return ""
	}
	aToken := &AToken{}
	err := json.Unmarshal(resp, aToken)
	if err != nil {
		fmt.Println(utils.ErrMsg["json"], "LinkQl", err, string(resp))
		fmt.Println("err", err)
		return ""
	}
	if aToken.Code != 200 {
		fmt.Println(utils.ErrMsg["code"], "LinkQl", aToken.Code, string(resp))
		return ""
	}
	return aToken.Data.Token

}
