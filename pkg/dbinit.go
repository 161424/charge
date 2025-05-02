package pkg

import (
	"charge/config"
	redis2 "charge/dao/redis"
	utils2 "charge/pkg/utils"
	"fmt"
	"time"
)

var Host = map[string]string{
	"show": "https://show.bilibili.com",
	"mall": "https://mall.bilibili.com",
}
var Month = time.Now().Month().String()

// 用来初始化数据库
// 可以配置单次运行函数
func Start() {
	lf := []func(){}
	redis := redis2.RedisClient

	if redis == nil {
		fmt.Println("dbinit redis==nil")
		return
	}

	f := func() {
		users := config.Cfg.ChargeUid
		users = append(users, config.Cfg.LotteryUid...)
		users = append(users, config.Cfg.SpecialUid...)
		utils2.TakeName(&users)
	}

	lf = append(lf, f)

	//lf = append(lf, common.DailyTask())
	if len(lf) > 0 {
		for _, f := range lf {
			f()
		}
	}
}
