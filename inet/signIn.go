package inet

import (
	"charge/config"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// token, url = 申请二维码()
//生成二维码(url) # 等待客户端扫码
//while True:
//    status, cookie = 扫码登录(token)
//    match status:
//        case 未扫描:
//            continue
//        case 二维码超时 | 二维码失效:
//            提示('二维码失效或超时') # 需要用户重新操作
//            break
//        case 已扫描未确认:
//            提示('扫描成功')
//        case 登录成功:
//            提示('扫描成功')
//            存储cookie(cookie)
//            SSO登录页面跳转()
//            break

//cookie, refresh_token = SignIn() # can be 二维码 / 密码 / 短信验证码

type G struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Url       string `json:"url"`        // 生成二维码文本
		QrcodeKey string `json:"qrcode_key"` // 有效时间180s。
	} `json:"data"`
}

type pool struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Url          string `json:"url"`
		RefreshToken string `json:"refresh_token"`
		Timestamp    int    `json:"timestamp"`
		Code         int    `json:"code"`
		Message      string `json:"message"`
	} `json:"data"`
}

// ocr
func SignIn(uid string) bool {
	qrToken, url := generate()
	if qrToken == "" || url == "" {
		return false
	}

	url = strings.Replace(url, "\u0026", "&", -1) // json的url会进行编码

	q, err := New(url, 2)
	if err != nil {
		fmt.Println(err)
		return false
	}
	fileName := config.Path + "/dao/qrCode/" + uid + ".png"
	err = q.WriteFile(fileName)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	u := ""
	token := ""
	var c1, c2 int
	for i := 0; i < 180; i += 2 { //   url 180失效
		c1, c2, u, token = getPoll(qrToken)
		time.Sleep(3 * time.Second)
		if c1 != 0 {
			return false
		}
		if c2 == 0 {
			//u = u
			fmt.Println("扫码登录成功")
			break
		} else if c2 == 86038 {
			fmt.Println("二维码已失效")
			return false
		} else if c2 == 86090 {
			fmt.Println("二维码已扫码未确认")
			continue
		} else if c2 == 86101 {
			fmt.Println("未扫码")
			continue
		}

	}

	_u := strings.Split(u, "?")
	u = strings.Join(strings.Split(_u[1], "&"), "; ")
	fmt.Println(u, token, uid)
	config.SetUck("ck", u, uid)
	config.SetUck("token", token, uid)
	return true
}

func generate() (string, string) {
	url := "https://passport.bilibili.com/x/passport-login/web/qrcode/generate"
	resp := DefaultClient.Http("GET", url, "", nil)
	g := &G{}
	err := json.Unmarshal(resp, g)
	if err != nil {
		fmt.Println("generate.json解析错误")
		return "", ""
	}
	if g.Code != 0 {
		fmt.Println("generate.code错误", g)
		return "", ""
	}
	return g.Data.QrcodeKey, g.Data.Url
}

func getPoll(qrcode_key string) (int, int, string, string) {
	url := "https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=" + qrcode_key

	resp := DefaultClient.Http("GET", url, "", nil)
	p := &pool{}
	err := json.Unmarshal(resp, p)
	if err != nil {
		return -1, -1, "", ""
	}
	if p.Code != 0 {
		return p.Code, -1, "", ""
	}
	return p.Code, p.Data.Code, p.Data.Url, p.Data.RefreshToken
}
