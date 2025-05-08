package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"charge/config"
	"charge/router/types"
	"charge/utils"
	"github.com/elliotchance/pie/v2"
	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var Month = time.Now().Month().String()

// todo:打包到docker
// 1. 脚本ck推送到redis，再由该软件推送到ql
// 2.

// 启动redis，并做ping检查
func Start() {

	var redisClient *redis.Client
	// 当使用ipv6访问本机wsl中redis时，会访问失败，但是远程客户端使用ipv6访问本机redis服务器时，就能访问成功

	idx := pie.FindFirstUsing(config.Cfg.RemoteDevice, func(value config.Device) bool {
		return value.Host
	})
	hostInfo := config.Cfg.RemoteDevice[idx]

	// 连接host节点
	addr := hostInfo.IP + ":" + hostInfo.RedisPort
	redisClient = start(addr)
	ok := redisClient.Ping(context.Background())

	fmt.Printf("/-------- redis---------/\n"+
		"hostInfo.IP:%s\n"+
		"hostInfo.RedisPort:%s\n\n", hostInfo.IP, hostInfo.RedisPort)

	if ok.Err() == nil {
		RedisClient = redisClient
		fmt.Printf("成功访问 Host.Redis地址%s\n", addr)
		return
	}

	fmt.Printf("访问  Host.Redis地址 %s 失败。部分任务无法执行！！！。err:%s\n", addr, ok.Err())

}

func start(addr string) *redis.Client {

	return redis.NewClient(&redis.Options{
		Addr:     addr,
		Network:  "tcp",
		Password: config.Cfg.Redis.Password,
	})
}

func GetAllKey(ctx context.Context) []string {
	re := RedisClient.Keys(ctx, "*")
	return re.Val()
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
func FindAllChargeRecord(ctx context.Context, header string) map[string]string {

	key := fmt.Sprintf("%s-chargeRecord", header)
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
// 数据类型：Hash。key：up，(return) field:upuid，member：FollowingData.String()
func UpdateUp(ctx context.Context, key, member string) {
	w := RedisClient.HSet(ctx, "up", key, member)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}

func ExitUp(ctx context.Context, key string) bool {
	return RedisClient.HExists(ctx, "up", key).Val()
}

func FindUp(ctx context.Context, key string) string {
	if ExitUp(ctx, key) {
		return RedisClient.HGet(ctx, "up", key).Val()
	}
	return ""
}

func LenUp(ctx context.Context) int64 {
	return RedisClient.HLen(ctx, "up").Val()
}

//func UpdateUp(ctx context.Context, key, tp string, member int) {
//	//n := RedisClient.HGet(ctx, "up", key).Val()
//	//AddUp(ctx, key, string(w))
//
//}

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

func GetAllLUpHistory(ctx context.Context) map[string]string {
	return RedisClient.HGetAll(ctx, "lottery-up").Val()
}

func ListenUpHistory(ctx context.Context, key string) string {
	return RedisClient.HGet(ctx, "lottery-up", key).Val()
}

func UpdateLUpHistory(ctx context.Context, key, val string) {
	w := RedisClient.HSet(ctx, "lottery-up", key, val)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}

func ListenUpHistoryReserve(ctx context.Context, key string) string {
	return RedisClient.HGet(ctx, "reserve-up", key).Val()
}

func UpdateRUpHistory(ctx context.Context, key, val string) {
	w := RedisClient.HSet(ctx, "reserve-up", key, val)
	if w.Err() != nil {
		fmt.Println(w.Err())
	}
}

func PixivAdd(ctx context.Context, val string) bool {
	w := RedisClient.SAdd(ctx, "pixiv", val)
	if w.Err() != nil {
		fmt.Println(w.Err())
		return false
	}
	return true
}

func PixivCheck(ctx context.Context, val string) bool {
	w := RedisClient.SIsMember(ctx, "pixiv", val)
	if w.Err() != nil {
		fmt.Println(w.Err())
		return false
	}
	return w.Val()
}
