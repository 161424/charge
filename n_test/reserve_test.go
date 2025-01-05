package n

import (
	"charge/config"
	"charge/dao/redis"
	"charge/pkg/listenUpForReserve"
	"charge/pkg/utils"
	"fmt"
	"testing"
)

func TestReserve(t *testing.T) {
	config.Start()
	s := listenUpForReserve.ReserveFromBusinessId(2, "4345074")
	fmt.Println(s)
}

func TestListenupforReverse(t *testing.T) {
	config.Start()
	redis.Start()
	c := make(chan struct{})
	w := utils.ListenupforReverse(c)
	c <- struct{}{}
	fmt.Println(w)
	for i := 0; i < len(w); i++ {
		for j := 0; j < 3; j++ {
			s := listenUpForReserve.ReserveFromBusinessId(j, w[i])
			fmt.Println(s)
		}
	}
}
