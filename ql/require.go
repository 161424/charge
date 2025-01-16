package ql

import (
	"charge/config"
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
	QlClient.Addr = "http://" + config.Cfg.Ql.Addr
	QlClient.ClientId = config.Cfg.Ql.ClientId
	QlClient.ClientSecret = config.Cfg.Ql.ClientSecret
	if QlClient.Addr == "" || QlClient.ClientId == "" || QlClient.ClientSecret == "" {

	}
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

func LinkQl() {
	url := QlClient.Addr + fmt.Sprintf("/open/auth/token?client_secret=%s&client_id=%s", QlClient.ClientSecret, QlClient.ClientId)
	//reqBody := url2.Values{}
	//s := fmt.Sprintf(`{"client_secret":"%s","client_id":"%s"}`, QlClient.ClientSecret, QlClient.ClientId)
	//reqBody.Set("client_secret", QlClient.ClientSecret)
	//reqBody.Set("client_id", QlClient.ClientId)

	//fmt.Println(url, s)
	resp, ok := QlClient.Get(url, "")
	if ok != nil {
		fmt.Println(ok)
		return
	}
	aToken := &AToken{}
	err := json.Unmarshal(resp, aToken)
	if err != nil {
		fmt.Println(err)
		return
	}
	if aToken.Code != 200 {
		fmt.Println(aToken.Code, string(resp))
		return
	}
	fmt.Printf("%+v", aToken)
	UpdateLocalEnv(aToken.Data.Token)
}
