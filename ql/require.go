package ql

import (
	"charge/config"
	"charge/utils"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"time"
)

type qlClient struct {
	Client       *http.Client
	Addr         string
	ClientId     string
	ClientSecret string
}

var QlClient = qlClient{}

func init() {
	QlClient.Client = &http.Client{
		Transport: &http.Transport{
			IdleConnTimeout: 30 * time.Second,
		},
	}
	port := "5700"
	if config.Cfg.Ql.Port != "" {
		port = config.Cfg.Ql.Port
	}

	if config.Cfg.Ql.Addr != "" {
		QlClient.Addr = config.Cfg.Ql.Addr
	} else {
		if config.Pod == "Docker" {
			QlClient.Addr = "host.docker.internal"
		} else {
			QlClient.Addr = "127.0.0.1"
		}
	}

	QlClient.Addr = "http://" + QlClient.Addr + ":" + port
	QlClient.ClientId = config.Cfg.Ql.ClientId
	QlClient.ClientSecret = config.Cfg.Ql.ClientSecret

	ok := LinkQl()
	if ok != "" {
		fmt.Println("青龙第一次连接成功", QlClient.Addr)
		return
	}
	fmt.Println("青龙第一次连接失败", QlClient.Addr)
	QlClient.Addr = "http://" + config.IP + ":" + port
	ok = LinkQl()
	if ok != "" {
		fmt.Println("青龙第二次连接成功", QlClient.Addr)
		return
	}
	fmt.Println("青龙第二次连接失败", QlClient.Addr)

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
	if QlClient.ClientId == "" || QlClient.ClientSecret == "" {
		fmt.Println("身份验证失败")
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
