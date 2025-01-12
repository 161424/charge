package common

import (
	"charge/config"
	"charge/inet"
	"charge/sender"
	"fmt"
	"time"
)

func DailyTask() func() {
	return func() {
		mointer := sender.Monitor{}
		mointer.Tag = "Daily Tasks"
		cks := inet.DefaultClient.Cks
		for idx := range len(cks) {
			fmt.Println("---------------------------")
			fmt.Printf("正在执行第%d个账号【%s】的每日任务\n", idx+1, cks[idx].Uid)
			if cks[idx].Alive == false {
				fmt.Printf("第%d个账号【%s】Ck已失活\n", idx+1, cks[idx].Uid)
				continue
			}

			// userinfo
			userInfo := GetUserInfo(idx) // 获取user基本信息
			if userInfo.Message != "" {
				fmt.Println(userInfo.Message)
			}
			if userInfo.Data.IsLogin == false {
				fmt.Printf("第【%d】个账号Ck已失活。原因是：%s\n", idx+1, userInfo.Message)
				cks[idx].Alive = false
				continue
			}

			// 打印目前用户信息
			desp := ""
			if userInfo.Data.VipStatus == 1 {
				t := time.UnixMicro(userInfo.Data.VipDueDate)
				t1 := t.Format("2006-01-02")
				t2 := int(t.Sub(time.Now()).Hours() / 24)
				desp += fmt.Sprintf("尊敬的 %s-【%s】您好,您的大会员在 %s 到期，还剩 %d 天。", userInfo.Data.VipLabel.Text, userInfo.Data.Uname,
					t1, t2)
			} else {
				desp += fmt.Sprintf("尊敬的【%s】您好。", userInfo.Data.Uname)
			}

			if userInfo.Data.Wallet.BcoinBalance != 0 {
				desp += fmt.Sprintf("您共有%d个B币，其中大会员赠送的B币有%d个", userInfo.Data.Wallet.BcoinBalance, userInfo.Data.Wallet.CouponBalance)
			}
			// Experience  登录和观看视频的10经验不知道怎么搞
			// coin
			GainCoin(idx) //  查看硬币使用历史，暂未找到获得硬币api
			if userInfo.Data.Level_info.CurrentLevel < 6 {
				userInfo.Data.Level_info.NextExp = userInfo.Data.Level_info.NextExp.(float64)
				fmt.Printf("当前用户等级【Lv%d】，目前%d经验，还差%.f经验升级。大概需要%.f天\n", userInfo.Data.Level_info.CurrentLevel, userInfo.Data.Level_info.CurrentExp, userInfo.Data.Level_info.NextExp, (userInfo.Data.Level_info.NextExp).(float64)/50)
			} else {
				fmt.Printf("当前用户等级【Lv%d】，以达到最大等级，无需升级\n", userInfo.Data.Level_info.CurrentLevel)
			}
			fmt.Printf("当前用户有%.2f个硬币\n", userInfo.Data.Money)
			if code := GetCoinExp(idx); code == 0 { // 投币经验小于50
				if userInfo.Data.Level_info.CurrentLevel < 6 && userInfo.Data.Money >= 5 { // 只在6级之下投币
					SpendCoin(idx) //  观看推荐视频，并点赞投币
				}
			} else if code == -1 {
				continue
			}

			// app内容，需要access_key
			if config.Cfg.BUserCk[idx].Access_key != "" {
				// 会员购签到
				MemberRegister(idx)
				// 魔晶签到
				MagicRegister(idx)
			}

			// 银瓜子兑换硬币？  银瓜子快绝版了，没啥用了

			// shareAndWatch

			// like  点赞

			// manga    没漫画需求，先不做吧。漫画积分以及兑换品都会失效

			// 大会员栏目
			if userInfo.Data.VipStatus == 1 {
				// 大会员积分
				BigPoint(idx)      // 每日积分签到，保底45~50。最少1350，最多2700
				ExchangePoint(idx) // 月兑换10天大会员，需要2400积分。   -404 bug
				// 会员BB券提醒
				fmt.Println(BCoinState(idx))
				// BB券充电。检测到马上过期，会自动充电
				if BCoinExpiringSoon {
					if cks[idx].Uid == "74199115" { // 无法为自己充电，只能冲电池

					} else {
						BCoinExchangeForUp(idx)
					}

				}
				// 10Experience
				BigExperience(idx)
				// 大会员线下活动监听

			}

			// 风纪会员栏目
			if userInfo.Data.Is_jury == true {
				// pass  没活动了
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
