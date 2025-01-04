package n

import (
	"charge/inet"
	"fmt"
	"testing"
)

func TestQr(t *testing.T) {
	q, _ := inet.New("https://account.bilibili.com/h5/account-h5/auth/scan-web?navhide=1&callback=close&qrcode_key=9b10d62beaad9b9936bdd149d0761d15&from=main_web", 2)
	fmt.Printf("%+v", q)
	q.WriteFile("./qr.png")
}

func TestRe(t *testing.T) {
	inet.Refresh(2)
}

func TestReh(t *testing.T) {

}
