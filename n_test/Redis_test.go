package n_test

import (
	"charge/config"
	redis2 "charge/dao/redis"
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"testing"
	"time"
)

type U struct {
	Name string
	Age  int
}

func TestRedisIpv6(t *testing.T) {
	addr := config.Cfg.Redis.Addr
	network := ""
	if true {
		w := "2408:8421:4b50:371:ea8f:b64d:594b:fa19"
		addr = "[" + w + "]"
		network = "tcp6"
	}
	redisClient := redis.NewClient(&redis.Options{
		Addr:     addr + config.Cfg.Redis.Port,
		Network:  network,
		Password: config.Cfg.Redis.Password,
	})

	ok := redisClient.Ping(context.Background())
	//fmt.Println(ok.Result())
	if ok.Err() != nil {
		fmt.Println(ok)
		panic(ok.Err())
	}
	fmt.Println(ok)
}

func TestRedisZrang(t *testing.T) {

	redisClient := redis.NewClient(&redis.Options{
		Addr:     config.Cfg.Redis.Addr,
		Password: config.Cfg.Redis.Password,
	})
	ctx := context.Background()
	u1 := U{
		"chen", 2,
	}

	redisClient.ZAdd(ctx, "n_test", redis.Z{
		Score:  1,
		Member: u1,
	})
	redisClient.ZAdd(ctx, "n_test", redis.Z{
		Score:  3,
		Member: "12312312",
	})

	k := redisClient.ZRange(ctx, "n_test", 0, -1)
	fmt.Println(k.Result())
	fmt.Println(k.Val())

}

func TestFindTimeCharge(t *testing.T) {
	redis2.Start()
	key := redis2.Month
	ts := time.Now().Format(time.DateOnly)
	tr, _ := time.Parse(time.DateOnly, ts)
	resp := redis2.FindTimeCharge(context.Background(), key, tr)
	fmt.Println(resp)
}

func TestLotteryTime(t *testing.T) {
	redis2.Start()
	k := map[string]int{}
	for i := 0; i < 5; i++ {
		tn := time.Now().Add(time.Duration(-i*24) * time.Hour).Format(time.DateOnly)
		l := redis2.ReadLotteryDay(context.Background(), tn)
		for _, v := range l {
			k[v]++
		}
	}
	fmt.Println(k)

}

func TestExitH(t *testing.T) {
	redis2.Start()
	n := redis2.ExitLottery(context.Background(), "1007779282486820868")
	fmt.Println(n)
	l := redis2.GetAllKey(context.Background())
	fmt.Println(l)
}

//func TestD(t *testing.T) {
//	redis.NewDialer(context.Background(),)
//}
