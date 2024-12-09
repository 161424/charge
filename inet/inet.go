package inet

import (
	"charge/config"
	"charge/utils"
	"encoding/json"
	"io"
	"net/http"
	"sync"
	"sync/atomic"
	"time"
)

var nUrl = "https://api.bilibili.com/x/web-interface/nav"

type Unav struct {
	Code    int
	Message string
	Data    interface{}
}

type defaultClient struct {
	sync.Mutex
	Client      *http.Client
	Tracker     time.Ticker
	Cks         []ckStatus
	AliveCkNum  int
	AliveCh     chan struct{}
	ShuffleTime time.Time
}

type ckStatus struct {
	Ck               string
	Alive            bool        //		// 1表示存活
	Status           atomic.Bool // true表示正在占用中
	DynamicSleep     bool
	DynamicSleepTime time.Time
	CkCheckTime      time.Time
}

var DefaultClient = &defaultClient{}
var AliveCK []int

func init() {
	DefaultClient.Client = &http.Client{
		Transport: &http.Transport{
			IdleConnTimeout: 30 * time.Second,
		},
	}
	DefaultClient.Cks = make([]ckStatus, len(config.Cfg.Cks))
	_u := config.Cfg.Cks
	utils.Shuffle(_u)
	for i := 0; i < len(_u); i++ {
		DefaultClient.Cks[i].Ck = _u[i]
	}
	//DefaultClient.CkCheckTime = make([]time.Time, len(_u))
	DefaultClient.AliveCkNum = len(_u)
	DefaultClient.AliveCh = make(chan struct{}, len(_u))

	//go func() {
	//	t := time.Tick(time.Hour * 24)
	//	for {
	//		select {
	//		case <-t:
	//			DefaultClient.CheckAliveCk()
	//		}
	//	}
	//}()
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
	req.Header.Set("Cookie", d.Cks[idx].Ck)

	resp, err := d.Client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}

func (d *defaultClient) RedundantDW(url string) (re []byte) {

	l := len(config.Cfg.Cks)
	if l == 1 {
		re = d.CheckOne(url)
		if utils.WebFilter(re) {
			return re
		}
	} else {
		if d.AliveCh == nil {
			d.AliveCh = make(chan struct{}, d.AliveCkNum)
		}

		d.AliveCh <- struct{}{}
		t := time.Now()
		idx := 0

		moreSleepNeedToStop := 0
		for {
			idx %= d.AliveCkNum
			if t.Sub(d.Cks[idx].CkCheckTime) > time.Duration(3*24*time.Hour) { // 每3天自动检查一次是否过期
				uid := utils.CutUid(d.Cks[idx].Ck)
				re = d.CheckSelect(nUrl+uid, idx)
				unav := &Unav{}
				json.Unmarshal(re, unav)
				d.Unav(unav, idx, t)
			}
			if d.Cks[idx].Alive {
				// 检测是否在睡眠中,最好是动态睡眠吧
				if d.Cks[idx].DynamicSleep {
					if t.Sub(d.Cks[idx].DynamicSleepTime) > 1*time.Minute {
						d.Cks[idx].DynamicSleep = false
					}
				}
				// 执行访问
				if d.Cks[idx].Status.Load() == false && d.Cks[idx].DynamicSleep == false {
					d.Cks[idx].Status.Store(true)
					re = d.CheckSelect(url, idx)
					<-d.AliveCh
					d.Cks[idx].Status.Store(false)
					if utils.WebFilter(re) {
						d.Cks[idx].DynamicSleepTime = time.Time{}
						d.Cks[idx].DynamicSleep = false
						return re
					} else {
						d.Cks[idx].DynamicSleepTime = t
						d.Cks[idx].DynamicSleep = true
					}
					moreSleepNeedToStop++
				}
			}
			idx++
			if moreSleepNeedToStop > d.AliveCkNum*2 {
				return
			}

		}
	}
	return
}

func (d *defaultClient) Unav(unav *Unav, idx int, t time.Time) {
	if unav.Code != 200 {
		if d.Cks[idx].Alive != false {
			d.Cks[idx].Alive = false
			d.Cks[idx].CkCheckTime = t
			d.AliveCkNum--
		}
	} else {
		if d.Cks[idx].Alive != true {
			d.Cks[idx].Alive = true
			d.Cks[idx].CkCheckTime = t
			d.AliveCkNum++
		}
	}
	time.Sleep(500 * time.Millisecond)
}

func (d *defaultClient) HandCheckAlive() {
	for idx := 0; idx < len(d.Cks); idx++ {
		uid := utils.CutUid(d.Cks[idx].Ck)
		re := d.CheckSelect(nUrl+uid, idx)
		unav := &Unav{}
		json.Unmarshal(re, unav)
		d.Unav(unav, idx, time.Now())
	}

}

//func (d *defaultClient) CheckAliveCk() {
//	d.Lock()
//	defer d.Unlock()
//	url := ""
//	l := len(config.Cfg.Cks)
//
//	for i := 0; i < l; i++ {
//		re := d.CheckSelect(url, i)
//		if utils.WebFilter(re) {
//			d.AliveCK[i] = 1
//		}
//	}
//}
