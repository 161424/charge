package pkg

import (
	"charge/config"
	redis2 "charge/dao/redis"
	"charge/pkg/getcharge"
	"charge/utils"
	"context"
	"fmt"
	"time"
)

var Month = time.Now().Month().String()

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
			fmt.Println("getcharge.GetChargeFromMonitorDefaultUsersDynamic()")
			lf = append(lf, f)
		}
	}

	if k, err := redis.Exists(ctx, fmt.Sprintf("%s-chargeRecord", utils.CutUid(config.Cfg.Cks[0]))).Result(); err == nil {
		if k == 0 {
			f := getcharge.GetChargeRecordFromCharger()
			fmt.Println("getcharge.GetChargeRecordFromCharger()")
			lf = append(lf, f)
		}
	}
	if len(lf) > 0 {
		for _, f := range lf {
			f()
		}
	}
}
