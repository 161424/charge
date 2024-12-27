package n

import (
	"charge/pkg/common"
	"fmt"
	"testing"
)

func TestBigpoint(t *testing.T) {
	common.BigPoint(0)
}

func TestCompleteTaskV2(t *testing.T) {
	n := common.CompleteTaskV2(0, "dress-view")
	fmt.Println(n)
}

func TestCompleteTask(t *testing.T) {
	n := common.CompleteTask(0, "tv_channel")
	fmt.Println(n)
}

func TestVipMallView(t *testing.T) {
	n := common.VipMallView(0)
	fmt.Println(n)
}

func TestReceiveTask(t *testing.T) {
	n := common.ReceiveTask(0, "ogvwatchnew")
	fmt.Println(n)
}

func TestGetTodayPoint(t *testing.T) {
	n := common.GetTodayPoint(0)
	fmt.Println(n)
}

func TestVSign(t *testing.T) {
	n := common.VSign(0)
	fmt.Println(n)
}
