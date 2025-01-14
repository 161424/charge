package pkg

import (
	redis2 "charge/dao/redis"
	"fmt"
	"time"
)

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

	//f := getcharge.GetChargeFromMonitorDefaultUsersDynamic()
	//fmt.Println("init start: getcharge.GetChargeFromMonitorDefaultUsersDynamic() ")

	//f := getcharge.GetChargeRecordFromCharger()
	//fmt.Println("init start: getcharge.GetChargeRecordFromCharger()")
	//lf = append(lf, f)

	//f1 := listenUpForLottery.ListenLotteryUp()
	//fmt.Println("init start: listenUpForLottery.ListenLotteryUp()")
	//lf = append(lf, f1)
	//f2 := listenGroup.ListenDJLChannel()
	//fmt.Println("开始f2")
	//lf = append(lf, f2)
	//f2 := listenUpForLottery.BalanceLottery()
	//fmt.Println("init start: listenUpForLottery.BalanceLottery()")
	//lf = append(lf, f2)

	//lf = append(lf, common.DailyTask())
	if len(lf) > 0 {
		for _, f := range lf {
			f()
		}
	}
}
