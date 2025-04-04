package n

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/common"
	"testing"
	"time"
)

func TestDailyTask(t *testing.T) {
	config.Start()
	redis.Start()

	inet.DefaultClient.ReFresh(true)
	common.MaxRunCKNum = 2
	time.Sleep(20 * time.Second)
	f := common.DailyTask()
	f()
}
