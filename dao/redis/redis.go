package redis

import (
	"charge/config"
	utils2 "charge/pkg/utils"
	"charge/router/types"
	"charge/utils"
	"context"
	"encoding/json"
	"fmt"
	"github.com/redis/go-redis/v9"
	"strconv"
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
	//fmt.Println(ok.Result())
	if ok.Err() != nil {
		fmt.Println(ok)
		panic(ok.Err())
	}

}

// 用Zset保存charge信息
// 读取信息
func FindAllCharge(ctx context.Context, header, key string) []types.FormResp {
	if key == "" {
		key = Month
	}
	key = fmt.Sprintf("%s-%s", header, Month)
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
		if utils.TimeFilter(j.EndTime) {
			resp = append(resp, *j)
		}
	}
	return resp
}

func FindTimeCharge(ctx context.Context, header, key string, t time.Time) []types.FormResp {
	if key == "" {
		key = Month
	}
	key = fmt.Sprintf("%s-%s", header, Month)
	if RedisClient == nil {
		return nil
	}
	score := t.Add(-2 * 24 * time.Hour).Unix()
	fmt.Println(header, key, t.Unix(), score)
	result, err := RedisClient.ZRangeByScore(ctx, key, &redis.ZRangeBy{
		Min: strconv.Itoa(int(score)),
		Max: "+inf",
	}).Result()
	if err != nil {
		fmt.Println(err)
		return nil
	}
	var resp []types.FormResp
	for _, v := range result {
		j := &types.FormResp{}
		json.Unmarshal([]byte(v), j)
		if utils.TimeFilter(j.EndTime) {
			resp = append(resp, *j)
		}
	}
	return resp
}

// 添加信息
func AddCharge(ctx context.Context, header string, score int64, member types.FormResp) {

	w := RedisClient.ZAdd(ctx, fmt.Sprintf("%s-%s", header, Month), redis.Z{Score: float64(score), Member: member.String()})

	if w.Err() != nil {
		fmt.Println(w.Err())
	}
	//
	//fmt.Println(w.Result())
	//
	//fmt.Println(w.Err())
}

func ExitCharge(ctx context.Context, key string) bool {
	ok := RedisClient.HExists(ctx, "charge", key)
	return ok.Val()
}
func AddChargeList(ctx context.Context, key, member string) {
	w := RedisClient.HSet(ctx, "charge", key, member)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}

// chargeRecord
// key chargeUid_chargeRecord
func FindAllChargeRecord(ctx context.Context, header, key string) map[string]string {
	key = fmt.Sprintf("%s-chargeRecord", header)

	result, err := RedisClient.HGetAll(ctx, key).Result()
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return result
}

func ReadOneChargeRecord(ctx context.Context, header, field string) string {
	key := fmt.Sprintf("%s-chargeRecord", header)
	result, err := RedisClient.HGet(ctx, key, field).Result()
	if err != nil {
		fmt.Println(err) // 没有找到
		return ""
	}
	return result
}

func AddChargeRecord(ctx context.Context, header string, key, member string) {
	w := RedisClient.HSet(ctx, fmt.Sprintf("%s-chargeRecord", header), key, member)
	if w.Err() != nil {
		fmt.Println("?", w.Err())
	}
}

// up 数据
func AddUp(ctx context.Context, key, member string) {
	w := RedisClient.HSet(ctx, "up", key, member)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}

func ExitUp(ctx context.Context, key string) bool {
	return RedisClient.HExists(ctx, "up", key).Val()
}

func UpdateUp(ctx context.Context, key, tp string, member int) {
	n := RedisClient.HGet(ctx, "up", key).Val()
	up := utils2.Up{}
	json.Unmarshal([]byte(n), &up)
	switch tp {
	case "fans":
		up.Fans = member
	case "charge":
		up.ChargeLottery++
	case "ol":
		up.OfficialLottery++
	case "cl":
		up.CommonLottery++
	}
	w, _ := json.Marshal(up)
	AddUp(ctx, key, string(w))

}

func DeleteUp(ctx context.Context, key string) bool {
	return true
}

// lottery

func ExitLottery(ctx context.Context, key string) bool {
	// zset
	ok := RedisClient.HExists(ctx, "lottery", key)
	return ok.Val()

}
func AddLotteryRecord(ctx context.Context, key, member string) {
	w := RedisClient.HSet(ctx, "lottery", key, member)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}
func ExitLotteryDay(ctx context.Context, header string) int64 {
	// set
	ok := RedisClient.Exists(ctx, "lottery-"+header)
	return ok.Val()
}
func AddLotteryDay(ctx context.Context, header, key string, member string) {
	w := RedisClient.HSet(ctx, "lottery-"+header, key, member)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}
func ReadLotteryDay(ctx context.Context, header, key string) []string {
	w := RedisClient.HGet(ctx, "lottery-"+header, key)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
	return nil
}
