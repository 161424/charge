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
	"charge/ql"
	"charge/sender/utils"
	"fmt"
	"github.com/go-co-op/gocron/v2"
	"time"
)

type App struct {
	Name string
	Cron string
	Task func()
}

// Start 启动基础服务
func Start() {
	log.Start()
	config.Start()
	redis.Start()
	pkg.Start()
	utils2.SetDefaultUid("")
}

var s, err = gocron.NewScheduler()

func Run() {

	if err != nil {
		panic(err)
	}
	var app []App
	app = append(app, App{"Config模板更新", "0 10 * * *", config.UpdateConfigExample()})
	app = append(app, App{"DDNS每日更新", "0 11 * * *", utils.UpdateDnsRecode()})

	app = append(app, App{Name: "青龙更新CK", Cron: "0 1 * * *", Task: ql.LinkQLAndUpdateCk()})

	app = append(app, App{"监听lottery", "0 */4 * * *", LotteryUp.ListenLotteryUp()}) // 0 4 8 12 16 20
	app = append(app, App{"监听lotteryGroup", "0 */6 * * *", LotteryGroup.ListenGroupForLottery()})
	app = append(app, App{"DailyTask", "0 8/8 * * *", common.DailyTask()})

	// add a job to the scheduler
	// 秒 分 时 日 月 星期(非必须)

	var j gocron.Job
	for _, a := range app {
		a.Task()
		j, err = s.NewJob(
			gocron.CronJob(a.Cron, false),
			gocron.NewTask(a.Task),
		)
		if err != nil {
			fmt.Println("Start gocron.Job.err:", err)
		}
		// each job has a unique id
		fmt.Printf("任务【%s】的ID是：%s\n", a.Name, j.ID())

		time.Sleep(10 * time.Second)
	}
	// start the scheduler
	s.Start()

	// block until you are ready to shut down
	for {
		select {}
	}

}

func Stop() {
	// when you're done, shut it down
	err = s.Shutdown()
	if err != nil {
		panic(err)
	}
}

//var Tw *TimingWheel

//// 启动后端
//func Run() error {
//	router.Run()
//	tw := NewTimingWheel()
//	// 更新config配置
//	tw.AddTimer(10*time.Hour, 24*time.Hour, true, "UpdateConfigExample", config.UpdateConfigExample())
//	// 更新DDNS
//	tw.AddTimer(12*time.Hour, 24*time.Hour, true, "UpdateDnsRecode", utils.UpdateDnsRecode())
//
//  // charge 先不使用
//	// 600/1440  对应10点钟
//	//tw.AddTimer(10*60*time.Minute, 1, 1, "GetChargeFromMonitorDefaultUsersDynamic", getcharge.GetChargeFromMonitorDefaultUsersDynamic()) // 监听固定用户的动态
//	// 10点钟
//	//tw.AddTimer(12*60*time.Minute, 1, 1, "GetChargeRecordFromCharger", getcharge.GetChargeRecordFromCharger()) // 监听充电者的充电状态

//	// 每4个小时，循环运行
//	tw.AddTimer(4*60*time.Minute, 4*60*time.Minute, true, "ListenLotteryUp", LotteryUp.ListenLotteryUp()) // 监听lottery
//
//	// 每6个小时，循环运行
//	tw.AddTimer(6*60*time.Minute, 6*60*time.Minute, true, "ListenDJLChannel", LotteryGroup.ListenGroupForLottery()) // 监听lottery group
//
//	// 15点钟  过期
//	//tw.AddTimer(8*60*time.Minute, 2, listenUpForLottery.BalanceLottery()) // 设置每日转发lottery (会删除，因此要最后进行)
//
//	// DailyTask。每8个小时运行一次
//	tw.AddTimer(8*60*time.Minute, 12*60*time.Minute, true, "DailyTask", common.DailyTask())
//

//	fmt.Println("执行AddTimer")
//	for {
//		select {}
//	}
//	defer tw.Stop()
//	return nil
//}
//
//func Stop() {
//}
