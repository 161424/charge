package inet

import (
	"bytes"
	"charge/config"
	"charge/utils"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"log"
	url2 "net/url"
	"strings"
	"time"
)

type T struct {
	Code    int    `json:"code"` // 0 -101:账号未登录
	Message string `json:"message"`
	Data    struct {
		Refresh   bool  `json:"refresh"` // true:需要刷新 false 无需刷新
		Timestamp int64 `json:"timestamp"`
	} `json:"data"`
}

type Rt struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Status       int    `json:"status"`
		Message      string `json:"message"`
		RefreshToken string `json:"refresh_token"`
	} `json:"data"`
}

type rC struct {
	Code    int    `json:"code"` //0：成功 -101：账号未登录 -111：csrf 校验失败 -400：请求错误
	Message string `json:"message"`
}

var uid string
var csrf string

// 检测ck是否需要刷新

func Refresh(idx int) int {
	url := "https://passport.bilibili.com/x/passport-login/web/cookie/info?csrf=" // 检查是否需要刷新。代表csrf可用
	resp := DefaultClient.CheckSelect(url, idx)
	t := &T{}
	err := json.Unmarshal(resp, t)
	if err != nil {
		return -1
	}
	uid = utils.CutUid(config.Cfg.BUserCk[idx].Ck)
	csrf = utils.CutCsrf(config.Cfg.BUserCk[idx].Ck)
	if t.Code == 0 {
		if t.Data.Refresh {
			fmt.Printf("【%s】ck需要刷新\n", uid)
			token := config.Cfg.BUserCk[idx].Token // 该token就是refresh_token就是存储于 localStorage 中的ac_time_value字段。在ck更新时使用
			if token == "" {
				fmt.Printf("【%s】不存在有效token，需要进行登录\n", uid)
				ok := SignIn(uid)
				if ok == false {
					return -1
				} else {
					fmt.Printf("【%s】登陆成功 √\n", uid)
					return 1
				}
			}
			token = config.Cfg.BUserCk[idx].Token
			ok := refresh(idx, token)
			if ok == false {
				fmt.Printf("【%s】ck刷新失败 x\n", uid)
				return -1
			} else {
				fmt.Printf("【%s】ck刷新成功 √\n", uid)
				return 2
			}
		} else {
			return 0
		}
	} else if t.Code == -101 {
		return t.Code // ck已经失效，无法通过刷新修复
	}
	return 0
}

// "d6fdda09f59ffeeca774ae4e5047f911"
func refresh(idx int, token string) bool {
	correspondPath := CorrespondPath()
	if correspondPath == "" {
		fmt.Println("correspondPath is empty")
		return false
	}
	refreshCsrf := RefreshCsrf(correspondPath, idx)
	if refreshCsrf == "" {
		fmt.Println("refreshCsrf is empty")
		return false
	}
	refreshTokenOld := token // 这一步必须保存旧的 refresh_token 备用

	url := "https://passport.bilibili.com/x/passport-login/web/cookie/refresh" // post

	reqBody := url2.Values{}
	reqBody.Set("csrf", csrf)
	reqBody.Set("refresh_csrf", refreshCsrf)
	reqBody.Set("source", "main_web")
	reqBody.Set("refresh_token", refreshTokenOld)
	cookie, refreshToken := DefaultClient.CheckSelectPost2(url, idx, "", strings.NewReader(reqBody.Encode()))

	rt := &Rt{}
	err := json.Unmarshal(refreshToken, rt)
	if err != nil {
		fmt.Printf(utils.ErrMsg["json"], "refresh1", err.Error(), string(refreshToken))
		return false
	}
	if rt.Code != 0 || len(cookie) == 0 {
		fmt.Printf(utils.ErrMsg["code"], "refresh2", rt.Code, string(refreshToken))
		return false
	}

	for i := 0; i < len(cookie); i++ {
		k := strings.Split(cookie[i], "; ")
		cookie[i] = k[0]
	}
	ck := strings.Join(cookie, "; ")
	//确认更新(refresh_token_old, cookie) # 这一步需要新的 Cookie 以及旧的 refresh_token

	csrf = utils.CutCsrf(ck) // 新csrf
	ok := refreshConfirm(csrf, refreshTokenOld, ck)
	if ok == 0 {
		config.Cfg.BUserCk[idx].Ck = ck
		config.SetUck("ck", ck, "")
		config.SetUck("token", rt.Data.RefreshToken, utils.CutUid(ck))
		return true
	} else {
		return false
	}
	//SSO站点跨域登录(cookie)
}

func CorrespondPath() string {
	result, err := getCorrespondPath(time.Now().UnixMilli())
	if err != nil {
		return ""
	}
	return result
}

func getCorrespondPath(ts int64) (string, error) {
	// 不要动，就是这种格式
	const publicKeyPEM = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDLgd2OAkcGVtoE3ThUREbio0Eg
Uc/prcajMKXvkCKFCWhJYJcLkcM2DKKcSeFpD/j6Boy538YXnR6VhcuUJOhH2x71
nzPjfdTcqMz7djHum0qSZA0AyCBDABUqCrfNgCiJ00Ra7GmRj+YCK1NJEuewlb40
JNrRuoEUXpabUzGB8QIDAQAB
-----END PUBLIC KEY-----
	`
	pubKeyBlock, _ := pem.Decode([]byte(publicKeyPEM))
	if pubKeyBlock == nil {
		log.Fatal("failed to decode PEM block containing public key")
	}
	hash := sha256.New()
	random := rand.Reader
	msg := []byte(fmt.Sprintf("refresh_%d", ts))
	var pub *rsa.PublicKey
	pubInterface, parseErr := x509.ParsePKIXPublicKey(pubKeyBlock.Bytes)
	if parseErr != nil {
		return "", parseErr
	}
	pub = pubInterface.(*rsa.PublicKey)
	encryptedData, _ := rsa.EncryptOAEP(hash, random, pub, msg, nil)
	//if encreryptErr != nil {
	//	return "", encryptErr
	//}
	return hex.EncodeToString(encryptedData), nil
}
func RefreshCsrf(correspondPath string, idx int) string {
	url := "https://www.bilibili.com/correspond/1/" + correspondPath
	resp := DefaultClient.CheckSelect(url, idx)
	d, err := goquery.NewDocumentFromReader(bytes.NewReader(resp))
	if err != nil {
		return ""
	}

	return d.Find("#1-name").Text()

}

func refreshConfirm(csrf, refreshToken, ck string) int {
	url := "https://passport.bilibili.com/x/passport-login/web/confirm/refresh" //确认刷新
	reqBody := url2.Values{}
	reqBody.Set("csrf", csrf)
	reqBody.Set("refresh_token", refreshToken)
	_, resp := DefaultClient.CheckSelectPost2(url, 0, ck, strings.NewReader(reqBody.Encode()))
	rc := &rC{}
	err := json.Unmarshal(resp, rc)
	if err != nil {
		fmt.Printf(utils.ErrMsg["json"], "refreshConfirm", err.Error(), string(refreshToken))
		return -1
	}
	if rc.Code != 0 {
		fmt.Printf(utils.ErrMsg["Code"], "refreshConfirm", rc.Code, string(resp))
		return rc.Code
	} else {
		fmt.Println("刷新成功")
		return 0
	}

}
