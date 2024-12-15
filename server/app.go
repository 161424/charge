package server

import (
	"charge/config"
	"charge/dao/redis"
	"charge/log"
	"charge/pkg"
	"charge/pkg/getcharge"
	"charge/pkg/listenUpForLottery"
	"charge/router"
	"charge/utils"
	"time"
)

// 启动基础服务
func Start() {
	log.Start()
	config.Start()
	redis.Start()
	pkg.Start()
	utils.SetDefaultUid("")
}

// 启动后端
func Run() error {
	router.Run()
	tw := NewTimingWheel()
	// 600/1440  对应10点钟
	tw.AddTimer(10*60*time.Minute, true, getcharge.GetChargeFromMonitorDefaultUsersDynamic()) // 监听固定用户的动态
	// 12点钟
	tw.AddTimer(12*60*time.Minute, true, getcharge.GetChargeRecordFromCharger()) // 监听充电者的充电状态
	// 1点钟
	tw.AddTimer(7*60*time.Minute, true, listenUpForLottery.ListenLotteryUp()) // 监听lottery
	// 3点钟
	tw.AddTimer(8*60*time.Minute, true, listenUpForLottery.BalanceLottery()) // 设置每日转发lottery
	//todo 多账号监听up充电
	//todo
	defer tw.Stop()
	return nil
}

func Stop() {
}
