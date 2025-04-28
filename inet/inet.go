package inet

import (
	"charge/config"
	"charge/utils"
	"context"
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
	Data    struct {
		IsLogin bool   //  是否登录
		Uname   string `json:"uname"`
	}
}

type defaultClient struct {
	sync.Mutex
	Client   *http.Client
	Tracker  <-chan time.Time
	Idx      int64
	Cks      []ckStatus
	AliveNum int
	AliveCh  map[string]chan []byte // 控制访问并发数量
	RunTime  sync.Map               // 运行次数
	Once     struct {
		once sync.Once
		ch   chan struct{}
	}
}

type ckStatus struct {
	Ck               string
	Status           atomic.Bool // true表示正在占用中
	Uid              string
	Uname            string
	Csrf             string
	Access_key       string
	Alive            bool
	DynamicSleep     bool
	DynamicSleepTime time.Time
}

var DefaultClient = &defaultClient{}

func init() {
	context.WithCancel(context.Background())
	DefaultClient.Client = &http.Client{
		Transport: &http.Transport{
			IdleConnTimeout: 30 * time.Second,
		},
	}
	DefaultClient.Once.ch = make(chan struct{})
}

func (d *defaultClient) SmellDo() {
	d.Once.once.Do(func() {
		close(d.Once.ch)
	})
	time.Sleep(1 * time.Second)
}

func (d *defaultClient) Do(req *http.Request) (resp *http.Response, err error) {
	d.SmellDo()
	return d.Client.Do(req)
}

func (d *defaultClient) ReFresh(skip bool) {
	d.Lock()
	defer d.Unlock()

	_u := config.Cfg.BUserCk
	d.Cks = make([]ckStatus, len(_u))
	d.RunTime = sync.Map{}

	// utils.Shuffle(_u) // 打乱ck毫无必要，还增加了工作量，需要修改
	for i := 0; i < len(_u); i++ {
		d.Cks[i].Ck = _u[i].Ck
		d.Cks[i].Uid = utils.CutUid(_u[i].Ck)
		d.Cks[i].Csrf = utils.CutCsrf(_u[i].Ck) // csrf可能为空，注意验证
		d.Cks[i].Access_key = _u[i].Access_key
	}
	go func() {
		d.CheckCkAlive(skip)
	}()
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

// CheckFirst 支持ck[0]单独使用的get访问
func (d *defaultClient) CheckFirst(url string) []byte {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}

	req.Header.Set("User-Agent", config.Cfg.WebUserAgent)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", d.Cks[0].Ck)
	resp, err := d.Do(req)
	if err != nil {
		return nil
	}
	//d.RunT()
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

	resp, err := d.Do(req)
	if err != nil {
		return nil
	}
	//d.RunT()
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

	resp, err := d.Do(req)
	if err != nil {
		return nil
	}
	//d.RunT()
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}

func (d *defaultClient) CheckSelectOptions(url string, contentType, referer, ua string, idx int, rbody io.Reader) []byte {
	req, err := http.NewRequest(http.MethodOptions, url, rbody)
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

	resp, err := d.Do(req)
	if err != nil {
		return nil
	}
	//d.RunT()
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body
}

func (d *defaultClient) APPCheckSelect(url, ua, re string, idx int) []byte {
	if d.Cks[idx].Access_key == "" {
		return nil
	}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil
	}
	if ua == "" {
		ua = config.Cfg.WebUserAgent
	}
	if re != "" {
		req.Header.Set("Referer", re)
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", d.Cks[idx].Ck+"; access_key="+d.Cks[idx].Access_key)
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7")
	resp, err := d.Do(req)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	//d.RunT()
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	return body
}

func (d *defaultClient) APPCheckSelectPost(url string, contentType, referer, ua string, other map[string]string, idx int, rbody io.Reader) []byte {
	if d.Cks[idx].Access_key == "" {
		return nil
	}
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
	req.Header.Set("Cookie", d.Cks[idx].Ck+"; access_key="+d.Cks[idx].Access_key)

	for k, v := range other {
		req.Header.Set(k, v)
	}
	resp, err := d.Do(req)
	if err != nil {
		return nil
	}

	//d.RunT()
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

	resp, err := d.Do(req)
	if err != nil {
		return nil, nil
	}
	//d.RunT()
	defer resp.Body.Close()
	cookies := resp.Header.Values("set-cookie")
	body, err := io.ReadAll(resp.Body)
	return cookies, body
}

// 尽可能保证请求成功,应该尽可能保证返回结果.(ck延迟时间，ck失活和ck休眠)
// 1. 对于非通道re输出，结果为正常输出
// 2. 对于通道输出，re最后一byte表示的是idx
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
			d.Once.once.Do(func() {
				close(d.Once.ch)
			})
			idx := d.Idx % int64(len(d.Cks))
			if idx == 0 {
				checkAlive++
			}
			if checkAlive == 3 { // 经过3轮仍未找到合适的ck来执行任务。在超出ck长度的任务在运行时，可能会出发panic
				d.CheckCkAlive(false)
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

// todo 1. 设置为lazy检测(DONE);2. ck刷新需要token，然而token容易随着ck失效而失效导致无法刷新，因此ck刷新需要配置为可选参数检测ck活性
func (d *defaultClient) CheckCkAlive(skip bool) {
	if skip == false {
		if d.Once.ch != nil {
			select {
			case <-d.Once.ch:
				d.Once.ch = nil
			}
		}
	}
	msg := "  ——————  账号检测  ———————  \n"
	msg += fmt.Sprintf("现在是：%s\n", time.Now().Format("2006-01-02 15:04:05"))

	d.AliveNum = len(d.Cks)
	for idx := 0; idx < len(d.Cks); idx++ {
		uid = utils.CutUid(d.Cks[idx].Ck)
		code := -1

		if config.Cfg.BUserCk[idx].Token != "" {
			code = Refresh(idx) // Refresh中的刷新函数会刷新失败，报错-101，但是仍能访问个人空间。想当于失效了一半，但是在访问某些内容会-101未登录。可以看出csrf可用，但别的风控失效
		}

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
		// refresh可能返回-101未登录，但是在访问个人空间时，仍可以访问。
		if d.Unav(unav, idx) {
			d.Cks[idx].Uname = unav.Data.Uname
			msg += fmt.Sprintf("%d. %s又苟过一天. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
		} else {
			msg += fmt.Sprintf("%d. %s吃鸡失败. 存活状态：%t\n", idx, uid, d.Cks[idx].Alive)
			d.AliveNum--
		}
	}
	msg += "  —————— 账号检测完毕 ———————  \n"
	fmt.Println(msg)
}

func (d *defaultClient) RunT() {
	v, _ := d.RunTime.Load(d.Cks[0].Uid)
	d.RunTime.Store(d.Cks[0].Uid, v.(int)+1)
	if config.Cfg.Model == "test" {
		return
	}
	w := []string{}
	for _, k := range d.Cks {
		v, _ := d.RunTime.Load(k.Uid)
		w = append(w, k.Uid+":"+strconv.Itoa(v.(int)))
	}
	s := strings.Join(w, "; ")
	fmt.Println("访问次数：", s)
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
