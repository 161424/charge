package n

import (
	"charge/server"
	"fmt"
	"testing"
	"time"
)

func TestTicker(t *testing.T) {
	tw := server.NewTimingWheel()
	// 600/1440  对应10点钟
	tw.AddTimer(time.Minute, true, 1, time.Minute, true, "tf", tf) // 监听固定用户的动态
	//todo 多账号监听up充电
	//todo
	defer tw.Stop()
	time.Sleep(5 * time.Minute)
}

func tf() {
	fmt.Println("run 123")
}
