package pkg

import (
	"charge/config"
	redis2 "charge/dao/redis"
	"charge/pkg/common"
	"charge/pkg/getcharge"
	"charge/pkg/listenUpForLottery"
	"charge/utils"
	"context"
	"fmt"
	"time"
)

var Month = time.Now().Month().String()

// 用来初始化数据库
func Start() {
	lf := []func(){}
	redis := redis2.RedisClient

	if redis == nil {
		fmt.Println("dbinit redis==nil")
		return
	}
	ctx := context.Background()
	if k, err := redis.Exists(ctx, fmt.Sprintf("charge-%s", Month)).Result(); err == nil {
		if k == 0 {
			f := getcharge.GetChargeFromMonitorDefaultUsersDynamic()
			fmt.Println("init start: getcharge.GetChargeFromMonitorDefaultUsersDynamic() ")
			lf = append(lf, f)
		}
	}

	if k, err := redis.Exists(ctx, fmt.Sprintf("%s-chargeRecord", utils.CutUid(config.Cfg.BUserCk[0].Ck))).Result(); err == nil {
		if k == 0 {
			f := getcharge.GetChargeRecordFromCharger()
			fmt.Println("init start: getcharge.GetChargeRecordFromCharger()")
			lf = append(lf, f)
		}
	}

	if k, err := redis.Exists(ctx, "lottery").Result(); err == nil {
		if k == 0 {
			f1 := listenUpForLottery.ListenLotteryUp()
			fmt.Println("init start: listenUpForLottery.ListenLotteryUp()")
			lf = append(lf, f1)
			f2 := listenUpForLottery.BalanceLottery()
			fmt.Println("init start: listenUpForLottery.BalanceLottery()")
			lf = append(lf, f2)
		}
	}
	lf = append(lf, common.DailyTask())
	if len(lf) > 0 {
		for _, f := range lf {
			f()
		}
	}
}
