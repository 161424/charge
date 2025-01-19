package n

import (
	"charge/pkg/common"
	"fmt"
	"testing"
	"time"
)

func TestCoin(t *testing.T) {
	common.SpendCoin(0, 5)
}

func TestW(t *testing.T) {
	for _, tn := range common.RandomTime() {
		fmt.Println(tn)
		sleepTime := time.Duration(tn)
		time.Sleep(sleepTime * time.Second)
	}
}
