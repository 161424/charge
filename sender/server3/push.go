package server3

import (
	"encoding/json"
	"fmt"

	"charge/config"
	serverchan_sdk "github.com/easychen/serverchan-sdk-golang"
)

func Push(title, desp, tag string) {
	resp, err := serverchan_sdk.ScSend(config.Cfg.Server3, title, desp, &serverchan_sdk.ScSendOptions{
		Tags: tag, // 传入 tags 参数
	})
	if err != nil {
		desp, _ := json.Marshal(resp)
		fmt.Println(string(desp))
		Push("发送错误", string(desp), "错误")
	}
	if resp == nil {
		fmt.Println("server酱返回信息为nil？？？")
		return
	}
	fmt.Printf("【tag：%s】通知发送结果：Code:%d,Message:%s,Data:%+v", tag, resp.Code, resp.Message, resp)
}
