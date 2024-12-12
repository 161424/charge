package getcharge

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/utils"
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
)

var chargeRecordUrl = "https://api.live.bilibili.com/xlive/revenue/v1/guard/getChargeRecord?type=1$page="

type chargeRecordLoad struct {
	UpUid        int    `json:"up_uid"`
	UpName       string `json:"up_name"`
	ChargerId    int    `json:"charger_id"`
	ChargerName  string `json:"charger_name"`
	Start        int64  `json:"start"`
	Expire_time  int64  `json:"expire_time"`
	ReNew        bool   `json:"re_new"`
	Signed_price int    `json:"signed_price"`
	Period       int    `json:"period"`
}

type chargeRecord struct {
	Code int    `json:"code"` // 正常是0
	Msg  string `json:"message"`
	Data struct {
		List []struct {
			Up_uid    int    `json:"up_uid"`    //  充电up uid
			User_name string `json:"user_name"` //  充电up name
			Item      []struct {
				Expire_time int64    `json:"expire_time"` // 充电到期时间
				Renew       struct { // 当自动续费是存在，当不自动续费时为nil
					Uid               int   `json:"uid"`               //  充电者uid
					Next_execute_time int64 `json:"next_execute_time"` //   充电续费时间
					Signed_price      int   `json:"signed_price"`      //   充电花费*1000
					Pay_channel       int   `json:"pay_channel"`       //  充电渠道 4应该是支付宝
					Period            int   `json:"period"`            //  充电时长
				}
			}
			Start int64 `json:"start_time"` //  充电开始时间
		}
		Total_page int `json:"total_page"`
		Total_num  int `json:"total_num"`
		Is_more    int `json:"is_more"`
	}
}

func GetChargeRecordFromCharger() func() {
	return func() {
		page := 1
		url := chargeRecordUrl + strconv.Itoa(page)
		body := inet.DefaultClient.CheckOne(url)
		//chargeRecordLoads := []chargeRecordLoad{}
		//fmt.Println(chargeRecordLoads)
		record := chargeRecord{}
		err := json.Unmarshal(body, &record)
		if err != nil {
			fmt.Println("json Unmarshal err:", err)
			return
		}
		if record.Code != 0 {
			fmt.Println("ChargeRecode.Code:", record.Code)
			return
		}
		total_page := record.Data.Total_page
		//key_member := []string{}
		for i := 1; i < total_page; i++ {
			time.Sleep(500 * time.Millisecond)
			if i != 1 {
				url = chargeRecordUrl + strconv.Itoa(i)
				body = inet.DefaultClient.CheckOne(url)
				record = chargeRecord{}
				err = json.Unmarshal(body, &record)
				if err != nil {
					fmt.Println("json Unmarshal err:", err)
					continue
				}
			}
			recd := record.Data.List[0]
			chargeRecordData := chargeRecordLoad{}
			chargeRecordData.UpUid = recd.Up_uid
			chargeRecordData.UpName = recd.User_name
			chargeRecordData.Start = recd.Start
			chargeRecordData.Expire_time = recd.Item[0].Expire_time
			chargeRecordData.ReNew = false
			if recd.Item[0].Renew.Uid != 0 {
				chargeRecordData.ReNew = true
				chargeRecordData.ChargerId = recd.Item[0].Renew.Uid
				chargeRecordData.Period = recd.Item[0].Renew.Period
				chargeRecordData.Signed_price = recd.Item[0].Renew.Signed_price
			} else {
				chargeRecordData.ChargerId, err = strconv.Atoi(utils.CutUid(config.Cfg.Cks[0]))
				if err != nil {
					continue
				}
			}
			header := strconv.Itoa(chargeRecordData.ChargerId)
			key := strconv.Itoa(chargeRecordData.UpUid)
			member := chargeRecordData.String()
			redis.AddChargeRecord(context.Background(), header, key, member)

		}
	}
} // 初始化使用

func (c chargeRecordLoad) String() string {
	js, _ := json.Marshal(c)
	return string(js)
}
