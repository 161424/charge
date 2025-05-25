package n

import (
	"testing"
	"time"

	"charge/dao/redis"
	"charge/pkg/lottery/LotteryGroup"
	"charge/utils"
)

func TestGroup(t *testing.T) {
	defer utils.Tracker(time.Now())
	redis.Start()
	f := LotteryGroup.ListenGroupForLottery()
	f()
}
