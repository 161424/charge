package common

import (
	"charge/config"
	"charge/inet"
	"charge/log"
	"charge/sender"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type note struct {
	Wait sync.WaitGroup
	Id   int //类似于sync.Once。每日刷新

	Status    map[string]map[string]*Active
	HasSub    bool
	AddDesc   bool
	lastTitle string
	NowUid    string
	Desc      string
}

type Active struct {
	Name   string // 模块名称
	Id     int
	HadErr bool
	ErrMsg string
}

var Note note
var User = map[string]UserInfo{} // user cache
func init() {
	go func() {
		Note = note{}
		Note.Status = make(map[string]map[string]*Active)
		Note.AddDesc = true
		for {
			now := time.Now()
			next := now.Add(time.Hour * 24)
			next = time.Date(next.Year(), next.Month(), next.Day(), 0, 0, 0, 0, next.Location())
			t := time.NewTicker(next.Sub(now))
			<-t.C
			Note.Wait.Wait()
			Note.Id = 0
			Note.HasSub = false
			Note.AddDesc = true
			Note.Desc = ""
		}
	}()
}

func (n *note) Register(title string) (stop bool) {
	if _, ok := n.Status[n.NowUid]; ok == false {
		n.Status[n.NowUid] = make(map[string]*Active)
	}
	u := n.Status[n.NowUid]
	if _, ok := u[title]; ok == false {
		u[title] = &Active{}
	}
	ac := u[title]
	ac.Id++
	n.AddDesc = true
	if ac.Id == n.Id { // 每轮第一次运行
		e := false
		if ac.ErrMsg != "" {
			e = true
		} else {
			if n.Id > 1 { // 在第二轮及以后检测到上一轮执行无错误，则本轮不在记录打印信息
				return true
			}
		}
		n.HasSub = false
		n.AddString("  **  %s  **\n", title)
		n.lastTitle = title
		if e {
			n.AddString("上次执行Err信息：`%s`\n", ac.ErrMsg)
		}
		n.HasSub = true
	} else if ac.Id > n.Id { // 每轮第二次及以上运行
		ac.Id = n.Id
	} else { // err

	}
	return false

}

func (n *note) String() string {
	return n.Desc
}

func (n *note) StatusAddString(format string, a ...any) {
	if _, ok := n.Status[n.lastTitle]; ok {
		n.Status[n.NowUid][n.lastTitle].ErrMsg = fmt.Sprintf(format, a...)
	}
	n.AddString(format, a...)
}

func (n *note) AddString(format string, a ...any) {
	s := ""
	if n.HasSub {
		s = "- "
	}
	s += fmt.Sprintf(format, a...)
	n.Desc += s
	fmt.Printf(s)
}

// 每日任务执行
// serve酱的文本采用的是markdown格式，因此消息也是markdown格式
func DailyTask() func() {
	return func() {
		monitor := sender.Monitor{}
		monitor.Tag = "Daily Tasks"
		cks := inet.DefaultClient.Cks
		Note.Id++
		day := time.Now().Format(time.DateTime)
		Note.AddString("  --------  Daily Tasks  --------\n")
		for idx := range len(cks) {
			var uS string
			if v, ok := User[cks[idx].Uid]; ok {
				uS = fmt.Sprintf("uname:%s uid:%d", v.Data.Uname, v.Data.Mid)
			} else {
				uS = fmt.Sprintf("uid:%s", cks[idx].Uid)
			}
			Note.AddDesc = false
			if cks[idx].Alive == false {
				Note.AddString("## 现在是%s，第%d个账号【%s】Ck已失活\n", day, idx+1, uS)
				continue
			}
			Note.AddString("## 现在是%s，正在执行第%d个账号【%s】的每日任务\n", time.Now().Format(time.DateTime), idx+1, uS)
			Note.AddDesc = false
			// userinfo
			userInfo := GetUserInfo(idx) // 获取user基本信息
			if userInfo == nil {
				continue
			}
			User[cks[idx].Uid] = *userInfo // 保存user基本信息
			Note.AddString("用户【uname:%s】[uid:%d]信息获取成功。\n", userInfo.Data.Uname, userInfo.Data.Mid)
			if userInfo.Data.VipStatus == 1 {
				t := time.UnixMilli(userInfo.Data.VipDueDate)
				t1 := t.Format("2006-01-02")
				t2 := int(t.Sub(time.Now()).Hours() / 24)
				Note.AddString("尊敬的 {%s}-【name:%s】您好,您的大会员在 %s 到期，还剩 %d 天。\n", userInfo.Data.VipLabel.Text, userInfo.Data.Uname,
					t1, t2)
			} else {
				Note.AddString("尊敬的【name:%s】您好。\n", userInfo.Data.Uname)
			}

			if userInfo.Data.Wallet.BcoinBalance != 0 {
				Note.AddString("您共有%d个B币，其中大会员赠送的B币有%d个\n", userInfo.Data.Wallet.BcoinBalance, userInfo.Data.Wallet.CouponBalance)
			}
			// Experience  登录和观看视频的10经验不知道怎么搞
			// coin
			GainCoin(idx) //  查看硬币使用历史，暂未找到获得硬币api
			if userInfo.Data.Level_info.CurrentLevel < 6 {
				next := (userInfo.Data.Level_info.NextExp).(float64) - float64(userInfo.Data.Level_info.CurrentExp)
				Note.AddString("当前用户等级【Lv%d】，目前%d经验，还差%.f经验升级。大概需要%.f天\n", userInfo.Data.Level_info.CurrentLevel, userInfo.Data.Level_info.CurrentExp, next, (next)/50)
			} else {
				Note.AddString("当前用户等级【Lv%d】，以达到最大等级，无需升级\n", userInfo.Data.Level_info.CurrentLevel)
			}
			Note.AddString("当前用户有%.2f个硬币\n", userInfo.Data.Money)
			if code := GetCoinExp(idx); code >= 0 && code < 50 { // 投币经验小于50
				if userInfo.Data.Level_info.CurrentLevel < 6 && userInfo.Data.Money > 5 { // 只在6级之下投币且硬币数量大于5个
					coin := SpendCoin(idx, code) //  观看推荐视频，并点赞投币
					if coin/10 < 5 {
						Note.StatusAddString("投币未达到预期\n")
					}
				} else {
					Note.AddString("已达到最大等级或未有足够硬币，停止投币\n")
				}
			}

			// 会员购签到
			MemberRegister(idx)

			// 魔晶签到
			MagicRegister(idx)
			// 魔晶战令
			MagicWarOrder(idx, 1)
			// 银瓜子兑换硬币？  银瓜子快绝版了，没啥用了

			// shareAndWatch。视频观看及分享

			// like 点赞

			// manga    没漫画需求，先不做吧。漫画积分以及兑换品都会失效

			// 大会员栏目
			if userInfo.Data.VipStatus == 1 {
				// 大会员积分
				BigPoint(idx) // 每日积分签到，保底45~50。最少1350，最多2700
				// 会员BB券提醒,含领取功能。当即将过期会对B币进行兑换
				BCoinState(idx)
				// BB券充电。检测到马上过期，会自动充电
				if BCoinExpiringSoon && userInfo.Data.Wallet.CouponBalance > 0 { // bug
					if cks[idx].Uid == config.Cfg.BCoinExchange { // 无法为自己充电，只能冲电池
						BCoinExchangeForBattery(idx, userInfo.Data.Wallet.CouponBalance) // 即将过期的b币为自己换成电池
					} else {
						BCoinExchangeForUp(idx, userInfo.Data.Wallet.CouponBalance) // 即将过期的b币为别人充电
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
			Note.Id++

		}
		//  使用随机账户查看信息
		Note.AddString("正在打印会员购兑换物品...\n")
		if k := randomCk(len(cks)); k >= 0 {
			// 会员购兑换物品通知
			MemberGoodsInfo(k)
		}

		// 每日远程通知一次
		fmt.Println("打印通知")
		//fmt.Println(Note.String())
		monitor.Desp = Note.String()
		monitor.PushS()
		log.Write(Note.Desc, day)

	}
}

//	 战令魔晶保质期3天
//		会员购积分兑换魔晶保质期14天，12点刷新
//		金币兑换魔晶0点刷新，有效期1天。秒没
func GiftExchange() func() {
	return func() {
		tm := time.Now()
		Gift := false
		if tm.Weekday() == time.Saturday || tm.Weekday() == time.Sunday {
			Gift = true
		}
		Note.AddString("  --------  Gift  Exchange  --------\n")
		cks := inet.DefaultClient.Cks
		for idx := range len(cks) {
			// 战令魔晶
			if Gift {
				MagicWarOrder(idx, 2)
			}
			userInfo := User[cks[idx].Uid]
			if userInfo.Data.VipStatus == 1 {
				go func() {
					time.Sleep(12 * time.Hour)
					// 全勤月兑换10天大会员，需要2400积分。   -404 bug
					if Gift {
						ExchangePoint(idx, 2) // 比1多花费500积分兑换魔晶
					} else {
						ExchangePoint(idx, 1)
					}

				}()
			}

		}
	}
}

func randomCk(num int) int {
	for i := 0; i < num; i++ {
		k := rand.Intn(num)
		if inet.DefaultClient.Cks[k].Alive == true {
			return k
		}
	}
	return -1
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
