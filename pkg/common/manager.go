package common

import (
	"charge/inet"
	"charge/sender"
	"fmt"
)

var contentType = map[string]string{
	"x":    "application/x-www-form-urlencoded",
	"json": "application/json",
}

var errMsg = map[string]string{
	"json": "json解析错误，应该是参数出现了问题。错误信息:%s，返回数据：%s",
	"code": "执行【】失败，错误代码：%d，错误信息：%s",
}

func DailyTask() func() {
	return func() {
		mointer := sender.Monitor{}
		mointer.Tag = "Daily Tasks"
		cks := inet.DefaultClient.Cks
		for idx := range len(cks) {
			fmt.Printf("正在执行第【%d】个账号的每日任务\n", idx+1)
			if cks[idx].Alive == false {
				continue
			}

			// coin
			GainCoin(idx)  //  查看硬币使用历史，暂未找到获得硬币api
			SpendCoin(idx) //  观看推荐视频，并点赞投币
			// 银瓜子兑换硬币？

			// shareAndWatch

			// like

			// manga

			// Expire

			// 大会员积分
			BigPoint(idx) // 每日积分签到，保底45~50。最少1350，最多2700
			// ExchangePoint(idx) // 月兑换10天大会员，需要2400积分
			// 会员BB券提醒

			// 大会员线下活动监听

		}

	}
}
