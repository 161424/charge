package inet

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"log"
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

// 检测ck是否需要刷新
func Refresh(idx int) int {
	url := "https://passport.bilibili.com/x/passport-login/web/cookie/info"
	resp := DefaultClient.CheckSelect(url, idx)
	t := &T{}
	err := json.Unmarshal(resp, t)
	if err != nil {
		log.Fatal(err)
	}
	if t.Code == 0 {
		if t.Data.Refresh {
			refresh(idx)
		}

	} else if t.Code == -101 {
		return t.Code
	}
	return 0
}

func refresh(idx int) {
	//url := "https://passport.bilibili.com/x/passport-login/web/cookie/refresh"  // post
	//correspondPath := CorrespondPath()
	//refreshCsrf := RefreshCsrf(correspondPath, idx)
	//refresh_token_old := refresh_token   // 这一步必须保存旧的 refresh_token 备用
	//cookie, refresh_token := 刷新Cookie(refresh_token, refresh_csrf, cookie)
	//确认更新(refresh_token_old, cookie) # 这一步需要新的 Cookie 以及旧的 refresh_token
	//SSO站点跨域登录(cookie)
	//url = "https://passport.bilibili.com/x/passport-login/web/confirm/refresh" //确认刷新
}

func CorrespondPath() string {
	result, err := getCorrespondPath(time.Now().UnixMilli())
	if err != nil {
		panic(err)
	}
	fmt.Println(result)
	return result
}

func getCorrespondPath(ts int64) (string, error) {
	const publicKeyPEM = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDLgd2OAkcGVtoE3ThUREbio0Eg
Uc/prcajMKXvkCKFCWhJYJcLkcM2DKKcSeFpD/j6Boy538YXnR6VhcuUJOhH2x71
nzPjfdTcqMz7djHum0qSZA0AyCBDABUqCrfNgCiJ00Ra7GmRj+YCK1NJEuewlb40
JNrRuoEUXpabUzGB8QIDAQAB
-----END PUBLIC KEY-----
`
	pubKeyBlock, _ := pem.Decode([]byte(publicKeyPEM))
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
	return url
}
