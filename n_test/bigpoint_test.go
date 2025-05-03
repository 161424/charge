package n

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/common"
	"fmt"
	"testing"
	"time"
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
	config.Start()
	redis.Start()
	inet.DefaultClient.ReFresh(true)
	n := common.VSign(1)
	fmt.Println(n)
	fmt.Println("【123】，【哈哈哈】，[123]，[哈哈哈]")
}

func TestExchangePoint(t *testing.T) {
	common.ExchangePoint(0, 1)
}

func TestGetUserInfo(t *testing.T) {
	userInfo := common.GetUserInfo(0) // 获取user基本信息

	// 打印目前用户信息
	fmt.Printf("%+v", userInfo)
	if userInfo.Data.VipStatus == 1 {
		n := time.UnixMilli(userInfo.Data.VipDueDate)
		fmt.Println(n)
		t1 := n.Format("2006-01-02")
		t2 := int(n.Sub(time.Now()).Hours() / 24)
		fmt.Printf("尊敬的 %s-【%s】您好,您的大会员在 %s 到期，还剩 %d 天。", userInfo.Data.VipLabel.Text, userInfo.Data.Uname,
			t1, t2)
	}
}
