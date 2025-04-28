package utils

import (
	"charge/config"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

var modelTp = "utils"

func init() {
	inet.DefaultClient.RegisterTp(modelTp)
}

var DefaultUid = ""

func SetDefaultUid(uid string) {
	if uid == "" {
		DefaultUid = utils.CutUid(config.Cfg.BUserCk[0].Ck)
	} else {
		DefaultUid = utils.CutUid(uid)
	}
}

func DaleyTimeRandom2_10() func() {
	start := time.Now()
	return func() {
		nt := time.Now()
		dyT := 2 + rand.Int63n(8)

		if nt.Sub(start) < time.Duration(dyT*1000) {
			time.Sleep(start.Add(time.Duration(dyT * 1000)).Sub(nt))
		}
	}
}

func Btv2opus(tv string) string {
	c := http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	req, _ := http.NewRequest(http.MethodGet, tv, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0")
	resp, err := c.Do(req)

	if err != nil {
		fmt.Println("请求错误:", err)
		return ""
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusFound { // 检查状态码是否为302
		redirectURL := resp.Header.Get("Location") // 获取重定向地址
		return redirectURL
	} else {
		return ""
	}
}

func TakeUid(user []config.User) []string {
	uid := []string{}
	for _, u := range user {
		uid = append(uid, u.Uid)
	}
	return uid
}

func TakeName(user *[]config.User) {
	_inet := inet.DefaultClient
	for i, u := range *user {
		respBody := _inet.Http("GET", "https://api.bilibili.com/x/space/acc/info?mid="+u.Uid, "", nil)
		var body = map[string]interface{}{}
		json.Unmarshal(respBody, &body)
		(*user)[i].Name = body["data"].(map[string]interface{})["name"].(string)
	}
}

//func ErrCode(err error) int {
//	| 代码 | 含义                       |
//	| ---- | -------------------------- |
//	| -1   | 应用程序不存在或已被封禁   |
//	| -2   | Access Key 错误            |
//	| -3   | API 校验密匙错误           |
//	| -4   | 调用方对该 Method 没有权限 |
//	| -101 | 账号未登录                 |
//	| -102 | 账号被封停                 |
//	| -103 | 积分不足                   |
//	| -104 | 硬币不足                   |
//	| -105 | 验证码错误                 |
//	| -106 | 账号非正式会员或在适应期   |
//	| -107 | 应用不存在或者被封禁       |
//	| -108 | 未绑定手机                 |
//	| -110 | 未绑定手机                 |
//	| -111 | csrf 校验失败              |
//	| -112 | 系统升级中                 |
//	| -113 | 账号尚未实名认证           |
//	| -114 | 请先绑定手机               |
//	| -115 | 请先完成实名认证           |
//
//	## 请求类
//
//	| 代码 | 含义                  |
//	| ---- | --------------------- |
//	| -304 | 木有改动              |
//	| -307 | 撞车跳转              |
//	| -352 | 风控校验失败 (UA 或 wbi 参数不合法) |
//	| -400 | 请求错误              |
//	| -401 | 未认证 (或非法请求) |
//	| -403 | 访问权限不足          |
//	| -404 | 啥都木有              |
//	| -405 | 不支持该方法          |
//	| -409 | 冲突                  |
//	| -412 | 请求被拦截 (客户端 ip 被服务端风控) |
//	| -500 | 服务器错误            |
//	| -503 | 过载保护,服务暂不可用 |
//	| -504 | 服务调用超时          |
//	| -509 | 超出限制              |
//	| -616 | 上传文件不存在        |
//	| -617 | 上传文件太大          |
//	| -625 | 登录失败次数太多      |
//	| -626 | 用户不存在            |
//	| -628 | 密码太弱              |
//	| -629 | 用户名或密码错误      |
//	| -632 | 操作对象数量限制      |
//	| -643 | 被锁定                |
//	| -650 | 用户等级太低          |
//	| -652 | 重复的用户            |
//	| -658 | Token 过期            |
//	| -662 | 密码时间戳过期        |
//	| -688 | 地理区域限制          |
//	| -689 | 版权限制              |
//	| -701 | 扣节操失败            |
//	| -799 | 请求过于频繁，请稍后再试 |
//	| -8888 | 对不起，服务器开小差了~ (ಥ﹏ಥ) |
//}
