package n

import (
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
