package server

import (
	"charge/config"
	"charge/dao/redis"
	"charge/log"
	"charge/router"
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
	tw.AddTimer()
	defer tw.Stop()
	return nil
}

func Stop() {
}
