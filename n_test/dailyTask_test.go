package n

import (
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/common"
	"testing"
	"time"
)

func TestDailyTask(t *testing.T) {
	redis.Start()

	inet.DefaultClient.ReFresh(true)
	common.MaxRunCKNum = 2
	time.Sleep(20 * time.Second)
	f := common.DailyTask()
	f()
}
