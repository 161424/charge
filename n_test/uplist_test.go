package n

import (
	"charge/dao/redis"
	"charge/pkg/listenFollowUp"
	"testing"
)

func TestUplist(t *testing.T) {
	redis.Start()
	f := listenFollowUp.ListenFollowUp()
	f()
}
