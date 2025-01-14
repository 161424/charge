package server

import (
	"charge/config"
	"charge/dao/redis"
	"charge/log"
	"charge/pkg"
	"charge/pkg/LotteryGroup"
	"charge/pkg/LotteryUp"
	"charge/pkg/common"
	utils2 "charge/pkg/utils"
	"charge/router"
	"fmt"
	"time"
)

// 启动基础服务
func Start() {
	log.Start()
	config.Start()
	redis.Start()
	pkg.Start()
	utils2.SetDefaultUid("")
}

var Tw *TimingWheel

// 启动后端
func Run() error {
	router.Run()
	tw := NewTimingWheel()
	// 更新config配置
	tw.AddTimer(10*time.Hour, true, 0, 24*time.Hour, true, "UpdateConfigExample", config.UpdateConfigExample())

	// 600/1440  对应10点钟
	//tw.AddTimer(10*60*time.Minute, 1, 1, "GetChargeFromMonitorDefaultUsersDynamic", getcharge.GetChargeFromMonitorDefaultUsersDynamic()) // 监听固定用户的动态
	// 10点钟
	//tw.AddTimer(12*60*time.Minute, 1, 1, "GetChargeRecordFromCharger", getcharge.GetChargeRecordFromCharger()) // 监听充电者的充电状态
	// 每4个小时，循环运行
	tw.AddTimer(4*60*time.Minute, true, 1, 4*60*time.Minute, true, "ListenLotteryUp", LotteryUp.ListenLotteryUp()) // 监听lottery
	// 每6个小时，循环运行
	tw.AddTimer(6*60*time.Minute, true, 1, 6*60*time.Minute, true, "ListenDJLChannel", LotteryGroup.ListenGroupForLottery()) // 监听lottery group
	// 15点钟  过期
	//tw.AddTimer(8*60*time.Minute, 2, listenUpForLottery.BalanceLottery()) // 设置每日转发lottery (会删除，因此要最后进行)

	// DailyTask。每8个小时运行一次
	tw.AddTimer(8*60*time.Minute, true, 0, 12*60*time.Minute, true, "DailyTask", common.DailyTask())
	Tw = tw
	//todo 多账号监听up充电
	//todo
	fmt.Println("执行AddTimer")
	for {
		select {}
	}
	defer tw.Stop()
	return nil
}

func Stop() {
}
