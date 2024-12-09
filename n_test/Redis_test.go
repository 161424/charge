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
	resp := redis2.FindTimeCharge(context.Background(), "charge", key, tr)
	fmt.Println(resp)
}
