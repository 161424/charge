package inet

import (
	"bytes"
	"charge/config"
	"charge/utils"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	url2 "net/url"
	"strconv"
	"strings"
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
	Idx         int64
	Cks         []ckStatus
	AliveNum    int
	AliveCh     map[string]chan []byte // 控制访问并发数量
	RunTime     map[string]int         // 运行次数
	ShuffleTime time.Time
}

type ckStatus struct {
	Ck               string
	Status           atomic.Bool // true表示正在占用中
	Uid              string
	Csrf             string
	Alive            bool
	DynamicSleep     bool
	DynamicSleepTime time.Time
}

var DefaultClient = &defaultClient{}

func init() {
	DefaultClient.Client = &http.Client{
		Transport: &http.Transport{
			IdleConnTimeout: 30 * time.Second,
		},
	}
	DefaultClient.ReFresh()
	DefaultClient.Tracker = time.Tick(24 * time.Hour)
	// 每日检查ck是否存活
	go func() {
		for {
			select {
			case <-DefaultClient.Tracker:
				DefaultClient.HandCheckAlive()
			}
		}
	}()
}

func (d *defaultClient) ReFresh() {
	DefaultClient.Cks = make([]ckStatus, len(config.Cfg.BUserCk))
	DefaultClient.RunTime = make(map[string]int, len(config.Cfg.BUserCk))
	_u := config.Cfg.BUserCk
	// utils.Shuffle(_u) // 打乱ck毫无必要，还增加了工作量，需要修改
	for i := 0; i < len(_u); i++ {
		DefaultClient.Cks[i].Ck = _u[i].Ck
		DefaultClient.Cks[i].Uid = utils.CutUid(_u[i].Ck)
		DefaultClient.Cks[i].Csrf = utils.CutCsrf(_u[i].Ck) // csrf可能为空，注意验证
	}
	DefaultClient.HandCheckAlive()
}

func (d *defaultClient) Http(method, url, ct string, body io.Reader) []byte {
	var resp *http.Response
	var err error
	if method == http.MethodGet {
		resp, err = http.Get(url)
		if err != nil {
			return nil
		}
	} else if method == http.MethodPost {
		resp, err = http.Post(url, ct, body)
	}
	if resp != nil {
		defer resp.Body.Close()
		body, _ := io.ReadAll(resp.Body)
		return body
	} else {
		return nil
	}
}

// 支持ck[0]单独使用的get访问
func (d *defaultClient) CheckFirst(url string) []byte {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}

	req.Header.Set("User-Agent", config.Cfg.WebUserAgent)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", d.Cks[0].Ck)
	resp, err := d.Client.Do(req)
	if err != nil {
		return nil
	}
	d.RunTime[d.Cks[0].Uid]++
	fmt.Println("访问次数：", d.RunT())
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
	req.Header.Set("User-Agent", config.Cfg.WebUserAgent)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", d.Cks[idx].Ck)

	resp, err := d.Client.Do(req)
	if err != nil {
		return nil
	}
	d.RunTime[d.Cks[idx].Uid]++
	fmt.Println("访问次数：", d.RunT())
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
		ua = config.Cfg.WebUserAgent
	}
	req.Header.Set("Referer", referer)
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", d.Cks[idx].Ck)

	resp, err := d.Client.Do(req)
	if err != nil {
		return nil
	}
	d.RunTime[d.Cks[idx].Uid]++
	fmt.Println("访问次数：", d.RunT())
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}

// 多返回个数据头。用来持久化ck
func (d *defaultClient) CheckSelectPost2(url string, idx int, ck string, rbody io.Reader) ([]string, []byte) {
	req, err := http.NewRequest(http.MethodPost, url, rbody)
	if err != nil {
		return nil, nil
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	if ck != "" {
		req.Header.Set("Cookie", ck)
	} else {
		req.Header.Set("Cookie", d.Cks[idx].Ck)
	}

	resp, err := d.Client.Do(req)
	if err != nil {
		return nil, nil
	}
	d.RunTime[d.Cks[idx].Uid]++
	fmt.Println("访问次数：", d.RunT())
	defer resp.Body.Close()
	cookies := resp.Header.Values("set-cookie")
	body, err := io.ReadAll(resp.Body)
	return cookies, body
}

// 尽可能保证请求成功,应该尽可能保证返回结果，
func (d *defaultClient) RedundantDW(url string, tp string, dyTime time.Duration) (re []byte) {
	t := time.Now()
	l := len(d.Cks)
	if l == 1 || tp == "" {
		re = d.CheckFirst(url)
		time.Sleep(dyTime)
		return
	} else {
		checkAlive := 0
		for {
			idx := d.Idx % int64(len(d.Cks))
			if idx == 0 {
				checkAlive++
			}
			if checkAlive == 3 { // 经过3轮仍未找到合适的ck来执行任务。在超出ck长度的任务在运行时，可能会出发panic
				d.HandCheckAlive()
				time.Sleep(dyTime)
				if d.AliveNum == 0 {
					panic("没有存活的ck")
					return
				}
			}

			if d.Cks[idx].Alive {
				// 检测是否在睡眠中,最好是动态睡眠吧
				if d.Cks[idx].DynamicSleep {
					if t.Sub(d.Cks[idx].DynamicSleepTime) > 0 {
						d.Cks[idx].DynamicSleep = false
					}
				} else if d.Cks[idx].Status.Load() == false && d.Cks[idx].DynamicSleep == false { // 正常执行访问
					go func() {
						d.Cks[idx].Status.Store(true)
						resp := d.CheckSelect(url, int(idx))
						resp = append(resp, byte(idx))
						d.AliveCh[tp] <- resp
						d.Cks[idx].Status.Store(false)
					}()
					time.Sleep(dyTime)
					d.Idx = idx + 1
					return
				}

			}
			//没有执行访问
			d.Idx++
			time.Sleep(dyTime)
		}
	}
	return
}

// code:-101 未登录
func (d *defaultClient) Unav(unav *Unav, idx int) (re bool) {
	if unav.Code == 0 {
		re = true
		d.Cks[idx].Alive = true
	} else if unav.Code == -101 {
		d.Cks[idx].Alive = false
	}
	return
}

// 注册消息通道
func (d *defaultClient) RegisterTp(tp string) {
	if d.AliveCh == nil {
		d.AliveCh = make(map[string]chan []byte)
	}
	d.AliveCh[tp] = make(chan []byte, len(d.Cks))
}

// 初始化检测ck活性
func (d *defaultClient) HandCheckAlive() {

	msg := "  ——————  账号检测  ———————  \n"
	msg += fmt.Sprintf("现在是：%s\n", time.Now().Format("2006-01-02 15:04:05"))
	d.AliveNum = len(d.Cks)
	for idx := 0; idx < len(d.Cks); idx++ {
		uid = utils.CutUid(d.Cks[idx].Ck)
		code := Refresh(idx)
		if code == 0 { // 0 表示登录或ck刷新成功，无需再确定活性
			d.Cks[idx].Alive = true
			msg += fmt.Sprintf("%d. %s又苟过一天. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
			continue
		} else if code == 1 { // 代表了登录成功
			d.Cks[idx].Alive = true
			msg += fmt.Sprintf("%d. %s登录成功. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
			continue
		} else if code == 2 { // 代表了刷新成功
			d.Cks[idx].Alive = true
			msg += fmt.Sprintf("%d. %sck刷新成功. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
			continue
		} else if code == -101 {
			d.Cks[idx].Alive = false
			msg += fmt.Sprintf("%d. %s吃鸡失败. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
			d.AliveNum--
			continue
		}
		// code == -1.代表出现各种为止错误时，会到达
		re := d.CheckSelect(nUrl, idx)
		unav := &Unav{}
		err := json.Unmarshal(re, unav)
		if err != nil {
			d.Cks[idx].Alive = false
			fmt.Println(err, string(re))
			msg += fmt.Sprintf("%d. %s吃鸡失败. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
			d.AliveNum--
			continue
		}
		if d.Unav(unav, idx) {
			msg += fmt.Sprintf("%d. %s又苟过一天. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
		} else {
			msg += fmt.Sprintf("%d. %s吃鸡失败. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
			d.AliveNum--
		}
	}
	msg += "  —————— 账号检测完毕 ———————  \n"
	fmt.Println(msg)
}

// csrf就是bili_jct
// csrf极易失效
func (d *defaultClient) JoinChargeLottery(csrf, businessId string) []byte {
	ck := config.Cfg.BUserCk[0].Ck
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

	req.Header.Set("User-Agent", config.Cfg.WebUserAgent)
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

func (d *defaultClient) RunT() string {
	w := []string{}
	for _, k := range d.Cks {
		w = append(w, k.Uid+":"+strconv.Itoa(d.RunTime[k.Uid]))
	}
	s := strings.Join(w, "; ")
	return s
}

func (d *defaultClient) Sleep(idx int, td time.Duration) {
	d.Cks[idx].DynamicSleep = true
	d.Cks[idx].DynamicSleepTime = time.Now().Add(td)
}

func (d *defaultClient) ArticleLike(bid string) {
	url := "https://api.bilibili.com/x/article/like"
	reqBody := url2.Values{}
	reqBody.Set("id", bid)
	reqBody.Set("type", "1")
	reqBody.Set("csrf", d.Cks[0].Csrf)
	d.CheckSelectPost(url, utils.ContentType["json"], "", "", 0, strings.NewReader(reqBody.Encode()))
}
