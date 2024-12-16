package n

import (
	"charge/config"
	"charge/dao/redis"
	"charge/pkg/listenGroup"
	"charge/utils"
	"testing"
	"time"
)

func TestGroup(t *testing.T) {
	defer utils.Tracker(time.Now())
	config.Start()
	redis.Start()
	f := listenGroup.ListenDJLChannel()
	f()
}
