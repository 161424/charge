package redis

import (
	"charge/config"
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func Start() {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     config.Cfg.Redis.Addr,
		Password: config.Cfg.Redis.Password,
	})
	RedisClient = redisClient
	ok := RedisClient.Ping(context.Background())
	if ok.Err() != nil {
		fmt.Println(ok)
		panic(ok.Err())
	}
}

func Add(tp string, key string, value interface{}) {

}

func Del(tp string, key string) {}
