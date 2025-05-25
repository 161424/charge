package n

import (
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/common"
	"fmt"
	"testing"
	"time"
)

func TestDailyTask(t *testing.T) {
	redis.Start()

	inet.DefaultClient.ReFresh(false)
	common.MaxRunCKNum = 2
	time.Sleep(5 * time.Second)
	f := common.DailyTask()
	f()
}

func TestBangumiListRandom(t *testing.T) {
	inet.DefaultClient.ReFresh(true)
	b := common.BangumiList.Random()
	fmt.Println(b)
}
