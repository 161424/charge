package common

import (
	"charge/inet"
	"charge/sender"
)

var contentType = map[string]string{
	"x":    "application/x-www-form-urlencoded",
	"json": "application/json",
}

func DailyTask() func() {
	return func() {
		mointer := sender.Monitor{}
		mointer.Tag = "Daily Tasks"
		cks := inet.DefaultClient.Cks
		for idx := range len(cks) {
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
