package inet

import (
	"charge/config"
	"charge/utils"
	"io"
	"net/http"
	"time"
)

type defaultClient struct {
	Client     *http.Client
	Tracker    time.Ticker
	IsActive   bool
	AliveCK    []int
	AliveCkNum int
	State      []int
}

var DefaultClient = &defaultClient{}

func init() {
	DefaultClient.Client = &http.Client{
		Transport: &http.Transport{
			IdleConnTimeout: 30 * time.Second,
		},
	}
}

func (d *defaultClient) CheckOne(url string) []byte {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}

	req.Header.Set("User-Agent", config.Cfg.User_Agent)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", config.Cfg.Cks[0])
	resp, err := d.Client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}

func (d *defaultClient) CheckSelect(url string, idx int) []byte {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}
	req.Header.Set("User-Agent", config.Cfg.User_Agent)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", config.Cfg.Cks[idx])

	resp, err := d.Client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}

func (d *defaultClient) RedundantDW(url string) []byte {
	if d.IsActive {
		d.CheckAliveCk()
	}
	var re = []byte{}
	l := len(config.Cfg.Cks)
	if l == 0 {
		re = d.CheckOne(url)
		if utils.WebFilter(re) {
			return nil
		}
	} else {
		for i := 0; i < l; i++ {
			if d.AliveCK[i] == 0 {
				continue
			}
			re = d.CheckSelect(url, i)
			if utils.WebFilter(re) {
				return re
			}
		}
	}
	return nil
}

func (d *defaultClient) CheckAliveCk() {
	url := ""
	l := len(config.Cfg.Cks)
	d.AliveCK = make([]int, l)
	d.State = make([]int, l)
	for i := 0; i < l; i++ {
		re := d.CheckSelect(url, i)
		if utils.WebFilter(re) {
			d.AliveCK[i] = 1
		}
	}
}
