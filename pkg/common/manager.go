package common

import (
	"charge/config"
	"charge/inet"
	"charge/sender"
	"fmt"
	"time"
)

type note struct {
	Once bool //类似于sync.Once。每日刷新
	Desc string
}

var Note note

func init() {
	go func() {
		Note = note{}
		Note.Once = true
		now := time.Now()
		next := now.Add(time.Hour * 24)
		next = time.Date(next.Year(), next.Month(), next.Day(), 0, 0, 0, 0, next.Location())
		t := time.NewTicker(next.Sub(now))
		<-t.C
		Note.Once = true
	}()
}

func (n note) String() string {
	return n.Desc
}

func (n note) AddString(format string, a ...any) {
	s := fmt.Sprintf(format, a...)
	n.Desc += s
	fmt.Println(s)
}

func DailyTask() func() {
	return func() {
		mointer := sender.Monitor{}
		mointer.Tag = "Daily Tasks"
		cks := inet.DefaultClient.Cks
		for idx := range len(cks) {
			Note.AddString("---------------------------\n")
			Note.AddString("正在执行第%d个账号【%s】的每日任务\n", idx+1, cks[idx].Uid)
			if cks[idx].Alive == false {
				Note.AddString("第%d个账号【%s】Ck已失活\n", idx+1, cks[idx].Uid)
				continue
			}
			// userinfo
			userInfo := GetUserInfo(idx) // 获取user基本信息
			if userInfo.Message != "" {
				Note.AddString(userInfo.Message)
			}
			if userInfo.Data.IsLogin == false {
				Note.AddString("第【%d】个账号Ck已失活。原因是：%s\n", idx+1, userInfo.Message)
				cks[idx].Alive = false
				continue
			}

			// 打印目前用户信息

			if userInfo.Data.VipStatus == 1 {
				t := time.UnixMicro(userInfo.Data.VipDueDate)
				t1 := t.Format("2006-01-02")
				t2 := int(t.Sub(time.Now()).Hours() / 24)
				Note.AddString("尊敬的 %s-【%s】您好,您的大会员在 %s 到期，还剩 %d 天。", userInfo.Data.VipLabel.Text, userInfo.Data.Uname,
					t1, t2)
			} else {
				Note.AddString("尊敬的【%s】您好。", userInfo.Data.Uname)
			}

			if userInfo.Data.Wallet.BcoinBalance != 0 {
				Note.AddString("您共有%d个B币，其中大会员赠送的B币有%d个", userInfo.Data.Wallet.BcoinBalance, userInfo.Data.Wallet.CouponBalance)
			}
			// Experience  登录和观看视频的10经验不知道怎么搞
			// coin
			GainCoin(idx) //  查看硬币使用历史，暂未找到获得硬币api
			if userInfo.Data.Level_info.CurrentLevel < 6 {
				userInfo.Data.Level_info.NextExp = userInfo.Data.Level_info.NextExp.(float64)
				Note.AddString("当前用户等级【Lv%d】，目前%d经验，还差%.f经验升级。大概需要%.f天\n", userInfo.Data.Level_info.CurrentLevel, userInfo.Data.Level_info.CurrentExp, userInfo.Data.Level_info.NextExp, (userInfo.Data.Level_info.NextExp).(float64)/50)
			} else {
				Note.AddString("当前用户等级【Lv%d】，以达到最大等级，无需升级\n", userInfo.Data.Level_info.CurrentLevel)
			}
			Note.AddString("当前用户有%.2f个硬币\n", userInfo.Data.Money)
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

			// shareAndWatch。视频观看及分享

			// like 点赞

			// manga    没漫画需求，先不做吧。漫画积分以及兑换品都会失效

			// 大会员栏目
			if userInfo.Data.VipStatus == 1 {
				// 大会员积分
				BigPoint(idx)      // 每日积分签到，保底45~50。最少1350，最多2700
				ExchangePoint(idx) // 全勤月兑换10天大会员，需要2400积分。   -404 bug
				// 会员BB券提醒,含领取功能。当即将过期会对B币进行兑换
				Note.AddString(BCoinState(idx))
				// BB券充电。检测到马上过期，会自动充电
				if BCoinExpiringSoon {
					if cks[idx].Uid == "74199115" { // 无法为自己充电，只能冲电池
						BCoinExchangeForBattery(idx) // 即将过期的b币为自己换成电池
					} else {
						BCoinExchangeForUp(idx) // 即将过期的b币为别人充电
					}

				}
				// 10Experience
				BigExperience(idx)
				// 大会员线下点映会监听?
				// 往期回顾都是图片+按钮组成
				// 火热报名中还未找到有效数据
				//BigMeeting(idx)
			}

			// 风纪会员栏目
			if userInfo.Data.Is_jury == true {
				// pass 没活动了
			}

			Note.AddString("第【%d】个账号的每日任务执行完毕\n", idx+1)
			Note.Once = false

		}
		if Note.Once {
			fmt.Println(Note.String())
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
