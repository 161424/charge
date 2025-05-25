package n

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"testing"
	"time"

	"charge/dao/redis"
	"charge/inet"
	getcharge2 "charge/pkg/charge/getcharge"
	"charge/router/types"
	"charge/utils"
)

func TestChargeInfo(t *testing.T) {

	_url := "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=1006518945822277649"
	body := inet.DefaultClient.RedundantDW(_url, "", time.Second*5)
	data := types.FormResp{}
	re := regexp.MustCompile(`\d+`)
	// 过滤出有用信息
	detail := getcharge2.ChargeDetail{}
	err := json.Unmarshal(body, &detail)
	mainBody := detail.Data.Item.Modules
	data.IsParticipants = mainBody.Module_dynamic.Additional.Upower_lottery.Button.Check.Text
	data.UName = mainBody.Module_author.Name
	tx := mainBody.Module_dynamic.Additional.Upower_lottery.Hint.Text
	txl := re.FindAllString(tx, -1)
	data.Cost = txl[0]
	data.Prizes = mainBody.Module_dynamic.Additional.Upower_lottery.Desc.Text
	//data.PrizesUrl = mainBody.Module_dynamic.Additional.Upower_lottery.Desc.Jump_url
	dm := ""
	for _, v := range mainBody.Module_dynamic.Desc.Rich_text_nodes {
		dm += v.Text
	}
	dm += mainBody.Module_dynamic.Desc.Text
	data.DynamicMessage = dm
	fmt.Println(detail)
	fmt.Println(data, err)
	// base info
	// csrf就是bili_jct
	//
}

func TestChargeOtherInfo(t *testing.T) {
	_url := "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_id=1006518945822277649&business_type=12"
	body := inet.DefaultClient.CheckFirst(_url)

	detail := getcharge2.ChargeOtherInfo{}
	err := json.Unmarshal(body, &detail)
	fmt.Println(err, detail)

}

func TestGetChargeFromMonitorDefaultUsersDynamic(t *testing.T) {
	defer utils.Tracker(time.Now())
	redis.Start()
	f := getcharge2.GetChargeFromMonitorDefaultUsersDynamic()
	f()
	time.Sleep(5 * time.Second)
	fmt.Println("end")
}

func TestShuffle(t *testing.T) {
	u := []int{}
	for i := 0; i < 20; i++ {
		u = append(u, i)
	}
	utils.Shuffle(u)
	fmt.Println(u)
}

type Name struct {
	U struct {
		Uname string `json:"uname"`
		Age   int    `json:"age"`
	}
}

func TestNilStruct(t *testing.T) {
	s := `{"name":null}"`
	n := new(Name)
	json.Unmarshal([]byte(s), n)
	fmt.Println(*n)
}

func TestGetChargeRecordFromCharger(t *testing.T) {
	redis.Start()
	defer utils.Tracker(time.Now())
	f := getcharge2.GetChargeRecordFromCharger()
	f()
}

func TestT(t *testing.T) {
	redis.Start()
	s := redis.ReadOneChargeRecord(context.Background(), "74199115", "686127")
	fmt.Println(s)
}
