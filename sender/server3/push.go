package server3

import (
	"charge/config"
	"encoding/json"
	serverchan_sdk "github.com/easychen/serverchan-sdk-golang"
)

func Push(title, desp, tag string) {
	resp, err := serverchan_sdk.ScSend(config.Cfg.Server3, title, desp, &serverchan_sdk.ScSendOptions{
		Tags: tag, // 传入 tags 参数
	})
	if err != nil {
		desp, _ := json.Marshal(resp)
		Push("发送错误", string(desp), "错误")
	}
	//fmt.Println(resp)
}
