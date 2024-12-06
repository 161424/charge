package n

import (
	"charge/config"
	"charge/inet"
	"charge/pkg/getcharge"
	"charge/router/types"
	"encoding/json"
	"fmt"
	"regexp"
	"testing"
)

func TestChargeInfo(t *testing.T) {
	config.Start()
	_url := "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=1006518945822277649"
	body := inet.DefaultClient.RedundantDW(_url)
	data := types.FormResp{}
	re := regexp.MustCompile(`\d+`)
	// 过滤出有用信息
	detail := getcharge.ChargeDetail{}
	err := json.Unmarshal(body, &detail)
	mainBody := detail.Data.Item.Modules
	data.IsParticipants = mainBody.Module_dynamic.Additional.Upower_lottery.Button.Check.Text
	data.Uid = mainBody.Module_author.Mid
	data.UName = mainBody.Module_author.Name
	tx := mainBody.Module_dynamic.Additional.Upower_lottery.Hint.Text
	txl := re.FindAllString(tx, -1)
	data.Cost = txl[0]
	data.Prizes = mainBody.Module_dynamic.Additional.Upower_lottery.Desc.Text
	data.PrizesUrl = mainBody.Module_dynamic.Additional.Upower_lottery.Desc.Jump_url
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
	config.Start()
	_url := "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_id=1006518945822277649&business_type=12"
	body := inet.DefaultClient.RedundantDW(_url)
	detail := getcharge.ChargeOtherInfo{}
	err := json.Unmarshal(body, &detail)
	fmt.Println(err, detail)

}
