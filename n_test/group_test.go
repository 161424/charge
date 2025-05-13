package n

import (
	"testing"
	"time"

	"charge/config"
	"charge/dao/redis"
	"charge/pkg/lottery/LotteryGroup"
	"charge/utils"
)

func TestGroup(t *testing.T) {
	defer utils.Tracker(time.Now())
	config.Start()
	redis.Start()
	f := LotteryGroup.ListenGroupForLottery()
	f()
}
