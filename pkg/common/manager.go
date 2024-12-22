package common

import (
	"charge/inet"
	"charge/sender"
)

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
			GainCoin(idx)
			SpendCoin(idx)
			// shareAndWatch

			// like

			// manga

			// Expire

			//  大会员积分

			// 会员BB券提醒

		}

	}
}
