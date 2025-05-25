package common

import (
	"charge/config"
	"charge/inet"
	"charge/sender"
	"fmt"
	"github.com/elliotchance/pie/v2"
	"math/rand"
	"sync"
	"time"
)

var MaxRunCKNum = 99

type note struct {
	Wait sync.WaitGroup

	Uid string
	//UidList []string
	Title string

	Status sync.Map
	//StatusKeysAcName  map[string][]string
	HasSub bool
	Desc   string
}

type Active struct {
	Name      string // 模块名称
	Run       bool
	ErrMsg    string
	oldErrMsg string
}

var Note = &note{}
var User = map[string]UserInfo{} // user cache
func init() {
	// Note.Status 角色 + 活动 + 模块
	go func() {
		for {
			now := time.Now()
			next := now.Add(time.Hour * 24)
			next = time.Date(next.Year(), next.Month(), next.Day(), 0, 0, 0, 0, next.Location())
			t := time.NewTicker(next.Sub(now))
			<-t.C
			Note.DailyRefresh()
		}
	}()
}

func (n *note) DailyRefresh() {
	n.Wait.Wait()
	n.HasSub = false
	n.Status = sync.Map{}
}

func (n *note) SetUid(uid string) {
	n.Uid = uid
	n.Status.LoadOrStore(uid, []*Active{})
}

// map[string][]*Active
func (n *note) Register(title string) (stop bool) {
	ac := n.findActive(title)

	printHead := func() {
		n.HasSub = false
		n.AddString("\n  **%s**\n", title)
		n.Title = title
		n.HasSub = true
	}

	printHead()
	ac.oldErrMsg = ac.ErrMsg
	ac.ErrMsg = ""

	if ac.oldErrMsg == "" {
		if ac.Run == true {
			return true
		}
	} else {
		n.AddString("上次执行Err信息：`%s`\n", ac.oldErrMsg)
	}
	ac.Run = true
	return false

}

func (n *note) String() string {
	return n.Desc
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

func (n *note) StatusAddString(format string, a ...any) {
	ac := n.findActive(n.Title)
	ac.ErrMsg = fmt.Sprintf(format, a...)

	n.AddString(format, a...)
}

func (n *note) findActive(title string) *Active {
	_userAcList, _ := n.Status.LoadOrStore(n.Uid, []*Active{})
	userAcList := _userAcList.([]*Active)

	var ac *Active
	var idx int

	if idx = pie.FindFirstUsing(userAcList, func(value *Active) bool {
		return value.Name == title
	}); idx != -1 {
		ac = userAcList[idx]
	} else {
		ac = &Active{}
		ac.Name = title
	}

	if idx != -1 {
		userAcList[idx] = ac
	} else {
		userAcList = append(userAcList, ac)
	}
	n.Status.Store(n.Uid, userAcList)
	return ac
}

// 每日任务执行
// serve酱的文本采用的是markdown格式，因此消息也是markdown格式
func DailyTask() func() {
	return func() {
		day := time.Now().Format(time.DateTime)

		monitor := sender.Monitor{}
		monitor.Tag = "Daily Tasks"
		monitor.Title = fmt.Sprintf("每日任务（%s）", day)

		Note.Desc = ""
		Note.AddString("#  --------  Daily Tasks  --------\n")
		cks := inet.DefaultClient.Cks

		for idx := range len(cks) {
			Note.SetUid(cks[idx].Uid)

			if idx > MaxRunCKNum {
				break
			}

			var uS string
			if cks[idx].Uname != "" {
				uS = fmt.Sprintf("%s uid:%s", cks[idx].Uname, cks[idx].Uid)
			} else {
				uS = fmt.Sprintf("uid:%s", cks[idx].Uid)
			}

			Note.AddString("现在是%s\n", day)
			//if cks[idx].Alive == false {
			//	Note.AddString("## 第%d个账号【%s】Ck已失活\n", idx+1, uS)
			//	continue
			//}
			Note.AddString("## 正在执行第%d个账号【%s】的每日任务\n", idx+1, uS)

			// userinfo
			userInfo := GetUserInfo(idx) // 获取user基本信息
			if userInfo == nil {
				continue
			}
			StoreUserInfo(idx, userInfo)

			User[cks[idx].Uid] = *userInfo // 保存user基本信息
			Note.AddString("用户【uname:%s】[uid:%d]信息获取成功。\n", userInfo.Data.Uname, userInfo.Data.Mid)
			if userInfo.Data.VipStatus == 1 {
				t := time.UnixMilli(userInfo.Data.VipDueDate)
				t1 := t.Format("2006-01-02")
				t2 := int(t.Sub(time.Now()).Hours() / 24)
				Note.AddString("尊敬的 {*%s*}-【%s】您好,您的大会员在 %s 到期，还剩 %d 天。\n", userInfo.Data.VipLabel.Text, userInfo.Data.Uname,
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
				Note.AddString("当前用户等级【*Lv%d*】，目前%d经验，还差%.f经验升级。大概需要%.f天\n", userInfo.Data.Level_info.CurrentLevel, userInfo.Data.Level_info.CurrentExp, next, (next)/50)
			} else {
				Note.AddString("当前用户等级【Lv%d】，以达到最大等级，无需升级\n", userInfo.Data.Level_info.CurrentLevel)
			}
			Note.AddString("当前用户有*%.2f*个硬币\n", userInfo.Data.Money)
			if code := GetCoinExp(idx); code >= 0 && code < 50 { // 投币经验小于50
				if userInfo.Data.Level_info.CurrentLevel < 6 && userInfo.Data.Money > 20 { // 只在6级之下投币且硬币数量大于5个
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

			// shareAndWatch。 视频观看及分享

			// like 点赞

			// manga    没漫画需求，先不做吧。漫画积分以及兑换品都会失效

			// 大会员积分
			BigPoint(idx) // 每日积分签到，保底45~50。最少1350，最多2700

			// 大会员栏目
			if userInfo.Data.VipStatus == 1 {

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

		}
		//  使用随机账户查看信息
		Note.AddString("正在打印会员购兑换物品...\n")
		if k := randomCk(len(cks)); k >= 0 {
			// 会员购兑换物品通知
			MemberGoodsInfo(k)
		}

		config.Write()

		// 每日远程通知一次
		fmt.Println("打印通知")

		monitor.Desp = Note.String()
		monitor.PushS()
		// log.Write(Note.Desc, day)  需要更新

	}
}

//	 战令魔晶保质期3天
//		会员购积分兑换魔晶保质期14天，12点刷新
//		金币兑换魔晶0点刷新，有效期1天。秒没
func GiftExchange() func() {
	return func() {

		Gift := false
		tm := time.Now()
		if tm.Weekday() == time.Saturday || tm.Weekday() == time.Sunday {
			Gift = true
		}
		Note.AddString("  --------  Gift  Exchange  --------\n")
		cks := inet.DefaultClient.Cks
		for idx := range len(cks) {
			// 战令魔晶(乱用积分)
			if Gift {
				MagicWarOrder(idx, 2)
			}
			userInfo := User[cks[idx].Uid]
			if userInfo.Data.VipStatus == 1 {
				go func() {
					time.Sleep(12 * time.Hour)
					// 全勤月兑换10天大会员，需要2400积分。   -404 bug
					if false {
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
