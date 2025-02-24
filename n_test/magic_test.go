package n

import (
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/common"
	"fmt"
	"testing"
	"time"
)

func TestMagic(t *testing.T) {
	common.MagicRegister(0)
}

func TestMagicExpiredReminder(t *testing.T) {
	//common.MagicExpiredReminder(0)
	g := time.Unix(int64(1739388799), 0).Sub(time.Now()).Hours()

	g2 := int(g / 24)
	g1 := g - float64(g2*24)
	fmt.Printf("%d天%.1f小时", g2, g1)
}

func TestMagicWarOrderTask1(t *testing.T) {
	redis.Start()
	inet.DefaultClient.ReFresh(true)
	inet.DefaultClient.Cks[0].Access_key = "a5b0601c51002d014e446d4e498d0521CjAChJwsOSGDKtj34_UreNoy8xgTcVUjx1D_PiRwXh0kMQFIjWNRtOh2h_O-pDhWDCkSVlRFaTRHV1JwQkk5UUVNMDVqT05EMTFia29CQWJtVm9Od1V6LVlGaFJzaFhaRzctbTd6NzIzVHVFcnFvVFJpZy1QN2FoZ1JDc2QtZEYxamtuV0pEWVJBIIEC"
	common.MagicWarOrder(0, 1)
	//common.MagicWarOrderWish(0)
}
