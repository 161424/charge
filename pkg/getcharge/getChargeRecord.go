package getcharge

import (
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"charge/sender"
	"charge/utils"
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"
)

var chargeRecordUrl = "https://api.live.bilibili.com/xlive/revenue/v1/guard/getChargeRecord?type=1&page="

type ChargeRecordLoad struct {
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

type ChargeRecord struct {
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
			Start int64 `json:"start"` //  充电开始时间
		}
		Total_page int `json:"total_page"`
		Total_num  int `json:"total_num"`
		Is_more    int `json:"is_more"`
	}
}

func GetChargeRecordFromCharger() func() {
	return func() {
		monitor := sender.Monitor{}
		monitor.Tag = "Charge"
		monitor.Title = "Charge——2（ChargeRecord）"
		page := 1
		url := chargeRecordUrl + strconv.Itoa(page)
		fmt.Println(url)
		body := inet.DefaultClient.CheckFirst(url)
		record := ChargeRecord{}
		err := json.Unmarshal(body, &record)
		if err != nil {
			fmt.Println("json Unmarshal err:", err)
			return
		}
		if record.Code != 0 {
			fmt.Println("ChargeRecode.Code:", record.Code)
			fmt.Println(record)
			return
		}
		total_page := record.Data.Total_page
		//key_member := []string{}
		for i := 1; i <= total_page; i++ {
			time.Sleep(500 * time.Millisecond)
			if i != 1 {
				url = chargeRecordUrl + strconv.Itoa(i)
				body = inet.DefaultClient.CheckFirst(url)
				record = ChargeRecord{}
				err = json.Unmarshal(body, &record)
				if err != nil {
					fmt.Println("json Unmarshal err:", err)
					continue
				}
			}
			for j := 0; j < len(record.Data.List); j++ {
				recd := record.Data.List[j]
				chargeRecordData := ChargeRecordLoad{}
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
					chargeRecordData.ChargerId, err = strconv.Atoi(utils.CutUid(config.Cfg.BUserCk[0].Ck))
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
		monitor.Desp = "charge"
		monitor.PushS()
	}
} // 初始化使用

type AJCharge struct {
	Code    int
	Message string
	Data    struct{}
}

func AutoJoinCharge() func() {
	return func() {
		ctx := context.Background()
		charges := redis.FindAllCharge(ctx, "")
		chargeRecords := redis.FindAllChargeRecord(ctx, utils.DefaultUid)
		//var resp = make(map[string]getcharge.ChargeRecordLoad)
		//for k, v := range result {
		//	j := getcharge.ChargeRecordLoad{}
		//	json.Unmarshal([]byte(v), &j)
		//	resp[k] = j
		//}
		for _, c := range charges {
			uid := strconv.Itoa(int(c.Uid))
			if v, ok := chargeRecords[uid]; ok { // 已冲电
				// code:4420014,已冲电但是未关注
				// code:4100001,参数错误
				// code:-101,csrf校验失败
				// code:-400,EOF
				// 判断充电是否过期
				if c.ChargerUid == uid {
					if c.IsParticipants == "已参与" {
						continue
					}
				}
				resp := inet.DefaultClient.JoinChargeLottery("", c.BusinessId)
				ajc := AJCharge{}
				err := json.Unmarshal(resp, &ajc)
				if err != nil {
					fmt.Println("json Unmarshal err:", err)
					continue
				}
				if ajc.Code != 0 {
					fmt.Println("ajc.Code:", ajc.Code, v)
				}

			}
		}

	}
}

func (c ChargeRecordLoad) String() string {
	js, _ := json.Marshal(c)
	return string(js)
}
