package n_test

import (
	"charge/config"
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"testing"
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
