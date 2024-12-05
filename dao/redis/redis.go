package redis

import (
	"charge/config"
	"charge/router/types"
	"charge/utils"
	"context"
	"encoding/json"
	"fmt"
	"github.com/redis/go-redis/v9"
	"time"
)

var RedisClient *redis.Client
var Month = time.Now().Month().String()

// 启动redis，并做ping检查
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

// 用Zset保存charge信息
// 读取信息
func FindAllCharge(ctx context.Context, key string) []types.FormResp {
	if key == "" {
		key = Month
	}
	if RedisClient == nil {
		return nil
	}
	result, err := RedisClient.ZRange(ctx, key, 0, -1).Result()
	if err != nil {
		fmt.Println(err)
		return nil
	}
	var resp []types.FormResp
	for _, v := range result {
		j := &types.FormResp{}
		json.Unmarshal([]byte(v), j)
		if utils.Filter(j.EndTime) {
			resp = append(resp, *j)
		}
	}
	return resp
}

// 添加信息
func AddCharge(ctx context.Context, score int, member types.FormResp) {
	RedisClient.ZAdd(ctx, Month, redis.Z{Score: float64(score), Member: member.String()})
}

func Add(tp string, key string, value interface{}) {

}

func Del(tp string, key string) {}
