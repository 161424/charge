package n

import (
	"charge/dao/redis"
	"charge/pkg/Reserve"

	"charge/pkg/utils"
	"fmt"
	"testing"
)

func TestReserve(t *testing.T) {
	s := Reserve.ReserveFromBusinessId(2, "4345074")
	fmt.Println(s)
}

func TestListenupforReverse(t *testing.T) {
	redis.Start()
	c := make(chan struct{})
	w := utils.ListenReverse(c)
	c <- struct{}{}
	fmt.Println(w)
	for i := 0; i < len(w); i++ {
		for j := 0; j < 3; j++ {
			s := Reserve.ReserveFromBusinessId(j, w[i])
			fmt.Println(s)
		}
	}
}
