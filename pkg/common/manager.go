package common

import (
	"charge/inet"
	"charge/sender"
	"fmt"
)

func DailyTask() func() {
	return func() {
		mointer := sender.Monitor{}
		mointer.Tag = "Daily Tasks"
		cks := inet.DefaultClient.Cks
		fmt.Printf("%+v", cks)
		for idx := range len(cks) {
			fmt.Println("---------------------------")
			fmt.Printf("正在执行第【%d】个账号的每日任务\n", idx+1)
			if cks[idx].Alive == false {
				fmt.Printf("第【%d】个账号Ck已失活\n", idx+1)
				continue
			}
			//s1 := ""
			// userinfo
			userInfo := GetUserInfo(idx)
			if userInfo.Data.IsLogin == false {
				fmt.Printf("第【%d】个账号Ck已失活。原因是：%s\n", idx+1, userInfo.Message)
				cks[idx].Alive = false
				continue
			}
			// Experience
			// coin
			GainCoin(idx)  //  查看硬币使用历史，暂未找到获得硬币api
			SpendCoin(idx) //  观看推荐视频，并点赞投币

			// 银瓜子兑换硬币？  银瓜子快绝版了，没啥用了

			// shareAndWatch

			// like

			// manga    没漫画需求，先不做吧

			// 大会员栏目
			if userInfo.Data.VipStatus == 1 {
				// 大会员积分
				BigPoint(idx)      // 每日积分签到，保底45~50。最少1350，最多2700
				ExchangePoint(idx) // 月兑换10天大会员，需要2400积分。
				// 会员BB券提醒
				BCoinState(idx)
				// BB券充电。检测到马上过期，会自动充电
				if BCoinExpiringSoon {
					BCoinExchangeForUp(idx)
				}
				// 10Experience
				BigExperience(idx)
				// 大会员线下活动监听
			}

			// 风纪会员栏目
			if userInfo.Data.Is_jury == true {

			}

			fmt.Printf("第【%d】个账号的每日任务执行完毕\n", idx+1)

		}

	}
}

// https://passport.bilibili.com/x/passport-login/web/cookie/info?web_location=333.1296&csrf=731d82eaf23deac60ab3516967a0107a
//{
//"code": 0,
//"message": "0",
//"ttl": 1,
//"data": {
//"refresh": false,
//"timestamp": 1735715294232
//}
//}
