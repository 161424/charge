package n

// go get github.com/tencent-connect/botgo@42cb5b8  安装git最新版本
import (
	"context"
	"encoding/json"
	"fmt"
	bot "github.com/2mf8/Go-QQ-SDK"
	"github.com/2mf8/Go-QQ-SDK/dto"
	"github.com/2mf8/Go-QQ-SDK/log"
	"github.com/2mf8/Go-QQ-SDK/openapi"
	"github.com/2mf8/Go-QQ-SDK/token"
	"github.com/2mf8/Go-QQ-SDK/webhook"
	"strings"
	"testing"
	"time"
)

//
//todo ip白名单、Webhook

//func TestQb(t *testing.T) {
//
//	//创建oauth2标准token source
//	credentials := &token.QQBotCredentials{
//		AppID:     "102561293",
//		AppSecret: "dRF4tiXMB0qgWMC2sjaRI90riaSKC4wo",
//	}
//	tokenSource := token.NewQQBotTokenSource(credentials)
//	//启动自动刷新access token协程
//	ctx := context.Background()
//	if err := token.StartRefreshAccessToken(ctx, tokenSource); err != nil {
//		log.Fatalln(err)
//	}
//	// 初始化 openapi，正式环境
//	api = botgo.NewSandboxOpenAPI(credentials.AppID, tokenSource).WithTimeout(5 * time.Second).SetDebug(true)
//	// 注册事件处理函数
//	_ = event.RegisterHandlers(
//		// 注册c2c消息处理函数
//		GroupATMessageEventHandler(),
//	)
//	//注册回调处理函数
//	path_ := "/"
//	http.HandleFunc(path_, func(writer http.ResponseWriter, request *http.Request) {
//		webhook.HTTPHandler(writer, request, credentials)
//		//event.DefaultHandlers.Plain()
//	})
//	fmt.Println("...")
//	// 启动http服务监听端口
//	if err := http.ListenAndServe(fmt.Sprintf("%s:%s", "192.168.10.178", "8443"), nil); err != nil {
//		log.Fatal("setup server fatal:", err)
//	}
//}
//
//// C2CMessageEventHandler 实现处理 at 消息的回调
//func GroupATMessageEventHandler() event.C2CMessageEventHandler {
//	return func(event *dto.WSPayload, data *dto.WSC2CMessageData) error {
//		//TODO use api do sth.
//		mg, err := api.PostGroupMessage(context.Background(), "605939084", &dto.MessageToCreate{Content: "123123"})
//		fmt.Println(mg, err)
//		return nil
//	}
//}

var Apis = make(map[string]openapi.OpenAPI, 0)

func TestQb(t *testing.T) {
	webhook.InitLog()
	as := webhook.ReadSetting()
	var ctx context.Context
	for i, v := range as.Apps {
		token := token.BotToken(v.AppId, v.Token, string(token.TypeBot))
		api := bot.NewSandboxOpenAPI(token).WithTimeout(3 * time.Second)
		Apis[i] = api
	}
	b, _ := json.Marshal(as)
	fmt.Println("配置", string(b))
	webhook.GroupAtMessageEventHandler = func(bot *webhook.BotHeaderInfo, event *dto.WSPayload, data *dto.WSGroupATMessageData) error {
		fmt.Println(bot.XBotAppid, data.GroupId, data.Content)
		if len(data.Attachments) > 0 {
			log.Infof(`BotId(%s) GroupId(%s) UserId(%s) <- %s <image id="%s">`, bot.XBotAppid[0], data.GroupId, data.Author.UserId, data.Content, data.Attachments[0].URL)
		} else {
			log.Infof("BotId(%s) GroupId(%s) UserId(%s) <- %s", bot.XBotAppid[0], data.GroupId, data.Author.UserId, data.Content)
		}
		if strings.TrimSpace(data.Content) == "测试" {
			Apis[bot.XBotAppid[0]].PostGroupMessage(ctx, data.GroupId, &dto.GroupMessageToCreate{
				Content: "成功",
				MsgID:   data.MsgId,
				MsgType: 0,
			})
		}
		return nil
	}
	webhook.C2CMessageEventHandler = func(bot *webhook.BotHeaderInfo, event *dto.WSPayload, data *dto.WSC2CMessageData) error {
		b, _ := json.Marshal(event)
		fmt.Println(bot.XBotAppid, string(b), data.Content)
		return nil
	}
	webhook.MessageEventHandler = func(bot *webhook.BotHeaderInfo, event *dto.WSPayload, data *dto.WSMessageData) error {
		b, _ := json.Marshal(event)
		fmt.Println(bot.XBotAppid, string(b), data.Content)
		return nil
	}
	webhook.InitGin()
	select {}
}
