package redis

import (
	"charge/config"
	"charge/pkg/getcharge"
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
// 数据类型：ZSEt。key：charge-月份，score：结束时间，(return) member：types.FormResp
// 读取信息
func FindAllCharge(ctx context.Context, key string) []types.FormResp {
	if key == "" {
		key = Month
	}
	// charge-月份
	key = fmt.Sprintf("charge-%s", Month)
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

func FindTimeCharge(ctx context.Context, key string, t time.Time) []types.FormResp {
	if key == "" {
		key = Month
	}
	key = fmt.Sprintf("charge-%s", Month)
	if RedisClient == nil {
		return nil
	}
	score := t.Add(-2 * 24 * time.Hour).Unix()

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
func AddCharge(ctx context.Context, score int64, member types.FormResp) {

	w := RedisClient.ZAdd(ctx, fmt.Sprintf("charge-%s", Month), redis.Z{Score: float64(score), Member: member.String()})

	if w.Err() != nil {
		fmt.Println(w.Err())
	}
	//
	//fmt.Println(w.Result())
	//
	//fmt.Println(w.Err())
}

// 数据类型：hash。key：business_id，member：types.FormResp.String()
// 去重使用
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
// 数据类型：Hash。key：chargerUid_chargeRecord，(return) field:upuid，member：chargeRecordLoad.String()
func FindAllChargeRecord(ctx context.Context, header string) map[string]getcharge.ChargeRecordLoad {

	key := fmt.Sprintf("%s-chargeRecord", header)
	result, err := RedisClient.HGetAll(ctx, key).Result()
	if err != nil {
		fmt.Println(err)
		return nil
	}
	var resp = make(map[string]getcharge.ChargeRecordLoad)
	for k, v := range result {
		j := getcharge.ChargeRecordLoad{}
		json.Unmarshal([]byte(v), &j)
		resp[k] = j
	}
	return resp

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

func ExitLottery(ctx context.Context, key string) bool { // hash
	ok := RedisClient.HExists(ctx, "lottery", key)
	return ok.Val()
}
func AddLotteryRecord(ctx context.Context, key, member string) {
	w := RedisClient.HSet(ctx, "lottery", key, member)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}

func ReadLotteryRecord(ctx context.Context) map[string]string {
	w := RedisClient.HGetAll(ctx, "lottery")
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
	return w.Val()
}

func DelLotteryRecord(ctx context.Context, key string) {
	w := RedisClient.HDel(ctx, "lottery", key)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}

func ExitLotteryDay(ctx context.Context, header string) int64 { // set
	ok := RedisClient.Exists(ctx, "lottery-"+header)
	return ok.Val()
}
func AddLotteryDay(ctx context.Context, header, key string) bool {
	w := RedisClient.SAdd(ctx, "lottery-"+header, key)
	if w.Err() != nil {
		fmt.Println(w.Err())
		return false

	}
	return true
}
func ReadLotteryDay(ctx context.Context, header string) []string {
	w := RedisClient.SMembers(ctx, "lottery-"+header)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
	return w.Val()
}
