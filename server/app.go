package server

import (
	"charge/config"
	"charge/dao/redis"
	"charge/log"
	"charge/pkg/getcharge"
	"charge/router"
	"time"
)

// 启动基础服务
func Start() {
	log.Start()
	config.Start()
	redis.Start()
}

// 启动后端
func Run() error {
	router.Run()
	tw := NewTimingWheel()
	tw.AddTimer(10*60*time.Minute, true, getcharge.GetChargeFromMonitorDefaultUsersDynamic()) // 监听固定用户的动态
	//todo 多账号监听up充电
	//todo
	defer tw.Stop()
	return nil
}

func Stop() {
}
