package n

// go get github.com/tencent-connect/botgo@42cb5b8  安装git最新版本
import (
	"bytes"
	"context"
	"crypto/ed25519"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/tencent-connect/botgo"
	"github.com/tencent-connect/botgo/dto"
	"io"
	"strings"

	"github.com/tencent-connect/botgo/event"
	"github.com/tencent-connect/botgo/interaction/webhook"
	"github.com/tencent-connect/botgo/openapi"
	"github.com/tencent-connect/botgo/token"

	"log"
	"net/http"
	"testing"
	"time"
)

var api openapi.OpenAPI

//
//todo ip白名单、Webhook

func TestQb(t *testing.T) {

	//创建oauth2标准token source
	credentials := &token.QQBotCredentials{
		AppID:     "102561293",
		AppSecret: "dRF4tiXMB0qgWMC2sjaRI90riaSKC4wo",
	}
	tokenSource := token.NewQQBotTokenSource(credentials)
	//启动自动刷新access token协程
	ctx := context.Background()
	if err := token.StartRefreshAccessToken(ctx, tokenSource); err != nil {
		log.Fatalln(err)
	}
	// 初始化 openapi，正式环境
	api = botgo.NewOpenAPI(credentials.AppID, tokenSource).WithTimeout(5 * time.Second).SetDebug(true)
	// 注册事件处理函数
	_ = event.RegisterHandlers(
		// 注册c2c消息处理函数
		C2CMessageEventHandler(),
	)
	//注册回调处理函数
	path_ := "/"
	http.HandleFunc(path_, func(writer http.ResponseWriter, request *http.Request) {
		webhook.HTTPHandler(writer, request, credentials)
	})
	// 启动http服务监听端口
	if err := http.ListenAndServe(fmt.Sprintf("%s:%s", "127.0.0.1", "8443"), nil); err != nil {
		log.Fatal("setup server fatal:", err)
	}
}

// C2CMessageEventHandler 实现处理 at 消息的回调
func C2CMessageEventHandler() event.C2CMessageEventHandler {
	return func(event *dto.WSPayload, data *dto.WSC2CMessageData) error {
		//TODO use api do sth.
		mg, err := api.PostGroupMessage(context.Background(), "605939084", &dto.MessageToCreate{Content: "123123"})
		fmt.Println(mg, err)
		return nil
	}
}

func handleValidation(rw http.ResponseWriter, r *http.Request, botSecret string) {
	httpBody, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println("read http body err", err)
		return
	}
	payload := &Payload{}
	if err = json.Unmarshal(httpBody, payload); err != nil {
		log.Println("parse http payload err", err)
		return
	}
	validationPayload := &ValidationRequest{}
	if err = json.Unmarshal(payload.Data, validationPayload); err != nil {
		log.Println("parse http payload failed:", err)
		return
	}
	seed := botSecret
	for len(seed) < ed25519.SeedSize {
		seed = strings.Repeat(seed, 2)
	}
	seed = seed[:ed25519.SeedSize]
	reader := strings.NewReader(seed)
	// GenerateKey 方法会返回公钥、私钥，这里只需要私钥进行签名生成不需要返回公钥
	_, privateKey, err := ed25519.GenerateKey(reader)
	if err != nil {
		log.Println("ed25519 generate key failed:", err)
		return
	}
	var msg bytes.Buffer
	msg.WriteString(validationPayload.EventTs)
	msg.WriteString(validationPayload.PlainToken)
	signature := hex.EncodeToString(ed25519.Sign(privateKey, msg.Bytes()))
	if err != nil {
		log.Println("generate signature failed:", err)
		return
	}
	rspBytes, err := json.Marshal(
		&ValidationResponse{
			PlainToken: validationPayload.PlainToken,
			Signature:  signature,
		})
	if err != nil {
		log.Println("handle validation failed:", err)
		return
	}
	rw.Write(rspBytes)
}
