package inet

import (
	"bytes"
	"charge/config"
	"charge/utils"
	"encoding/json"
	"fmt"
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
	Tracker     <-chan time.Time
	Idx         int
	Cks         []ckStatus
	AliveNum    int
	AliveCh     chan struct{} // 控制访问并发数量
	ShuffleTime time.Time
}

type ckStatus struct {
	Ck               string
	Status           atomic.Bool // true表示正在占用中
	Alive            bool
	DynamicSleep     bool
	DynamicSleepTime time.Time
	CkCheckTime      time.Time
}

var DefaultClient = &defaultClient{}

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

	DefaultClient.HandCheckAlive()
	DefaultClient.Tracker = time.Tick(3 * 24 * time.Hour)
	// 定期检查ck是否存活
	go func() {
		for {
			select {
			case <-DefaultClient.Tracker:
				DefaultClient.HandCheckAlive()
			}
		}
	}()
}

var act = 0

// 支持ck[0]单独使用的get访问
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
	act++
	fmt.Println("访问次数：", act)
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}

// 支持多ck使用的get访问
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

func (d *defaultClient) CheckSelectPost(url string, contentType, referer, ua string, idx int, rbody io.Reader) []byte {
	req, err := http.NewRequest(http.MethodPost, url, rbody)
	if err != nil {
		return nil
	}
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	} else {
		req.Header.Set("Content-Type", "application/json")
	}
	if referer == "" {
		referer = "https://www.bilibili.com/"
	}
	if ua == "" {
		ua = config.Cfg.User_Agent
	}
	req.Header.Set("Referer", referer)
	req.Header.Set("User-Agent", ua)
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

// 尽可能保证请求成功,应该尽可能保证返回结果，
func (d *defaultClient) RedundantDW(url string, dyTime time.Duration) (re []byte) {
	t := time.Now()
	l := len(d.Cks)
	if l == 1 {
		re = d.CheckOne(url)
		time.Sleep(dyTime)
	} else {
		AliveCkNum := d.AliveNum
		d.AliveCh <- struct{}{}

		idx := d.Idx
		for {
			idx %= AliveCkNum
			if d.Cks[idx].Alive {
				// 检测是否在睡眠中,最好是动态睡眠吧
				if d.Cks[idx].DynamicSleep {
					if t.Sub(d.Cks[idx].DynamicSleepTime) > 0 {
						d.Cks[idx].DynamicSleep = false
					}
				}
				// 执行访问
				if d.Cks[idx].Status.Load() == false && d.Cks[idx].DynamicSleep == false {
					d.Cks[idx].Status.Store(true)
					re = d.CheckSelect(url, idx)
					d.Cks[idx].Status.Store(false)
					<-d.AliveCh
					d.Cks[idx].DynamicSleepTime = t.Add(dyTime)
					d.Cks[idx].DynamicSleep = true
					return

				}
			}
			d.Idx++
		}
	}
	return
}

// code:-101 未登录
func (d *defaultClient) Unav(unav *Unav, idx int, t time.Time) (re bool) {
	if unav.Code == 0 {
		re = true
		d.Cks[idx].Alive = true
	} else if unav.Code == -101 {
		d.Cks[idx].Alive = false
	}
	d.Cks[idx].CkCheckTime = t
	time.Sleep(500 * time.Millisecond)
	return
}

func (d *defaultClient) HandCheckAlive() {
	d.Lock()
	d.AliveNum = 0
	d.AliveCh = nil

	for idx := 0; idx < len(d.Cks); idx++ {
		re := d.CheckSelect(nUrl, idx)
		unav := &Unav{}
		err := json.Unmarshal(re, unav)
		if err != nil {
			d.Cks[idx].Alive = false
			fmt.Println(err, string(re))
			continue
		}
		if d.Unav(unav, idx, time.Now()) {
			d.AliveNum++
		}
	}
	d.AliveCh = make(chan struct{}, d.AliveNum)
	d.Unlock()

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

// csrf就是bili_jct
// csrf极易失效
func (d *defaultClient) JoinChargeLottery(csrf, businessId string) []byte {
	ck := config.Cfg.Cks[0]
	if csrf == "" {
		csrf = utils.CutCsrf(ck)
	}
	url := "https://api.bilibili.com/x/dynamic/feed/attach/click?csrf=" + csrf
	pbody := fmt.Sprintf(`{"attach_card_type": 20,"cur_btn_status": 1,"dynamic_id_str": "%s"}`, businessId)
	pbodyReader := bytes.NewReader([]byte(pbody))
	req, err := http.NewRequest(http.MethodPost, url, pbodyReader)
	if err != nil {
		return nil
	}

	req.Header.Set("User-Agent", config.Cfg.User_Agent)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", ck)
	resp, err := d.Client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}
