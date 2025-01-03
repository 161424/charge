package inet

import (
	"encoding/json"
	"fmt"
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
		Url       string `json:"url"`
		QrcodeKey string `json:"qrcode_key"`
	} `json:"data"`
}

// ocr
func SignIn(uid string) {
	token, url := generate()
	q, err := New(url, 2)
	if err != nil {
		fmt.Println(err)
		return
	}
	fileName := "./dao/qrCode" + uid + ".png"
	q.WriteFile(fileName)

	fmt.Println(token, url, q)
}

func generate() (string, string) {
	url := "https://passport.bilibili.com/x/passport-login/web/qrcode/generate"
	resp := DefaultClient.Http("GET", url, "", nil)
	g := new(G)
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

//func getPoll(url string) {
//	url = "https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=" + url
//
//	resp := DefaultClient.Http("GET", url, "", nil)
//	data := appSign(map[string]string{
//		"auth_code": authCode,
//		"local_id":  "0",
//		"ts":        strconv.FormatInt(time.Now().Unix(), 10),
//	})
//	var body QrLogin
//	resp, err := client.R().SetBody(data).SetResult(&body).Post(api)
//	if err != nil {
//		panic(err)
//	}
//	if resp.IsSuccess() {
//		printResult(body)
//		return body
//	}
//}
