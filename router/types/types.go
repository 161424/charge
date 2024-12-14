package types

import "encoding/json"

type FormReq struct {
	Key string `json:"key"`
}

type FormResp struct {
	Id              int    `json:"id"` // 默认id
	BusinessId      string `json:"business_id"`
	UName           string `json:"name"`        // 抽奖者名字
	UFans           string `json:"fans"`        // 抽奖者粉丝数
	Uid             int64  `json:"uid"`         //
	ChargerUid      string `json:"charger_uid"` //   抽奖参与者uid
	EndTimeUnix     int64  `json:"end_timeUnix"`
	EndTime         string `json:"end_time"` // 结束时间
	DynamicMessage  string `json:"dynamic_message"`
	Prizes          string `json:"Prizes"` // 奖品内容
	PrizesUrl       string `json:"PrizesUrl"`
	NumParticipants int    `json:"num_participants"` // 参与人数
	NumPrizes       int    `json:"num_prizes"`       // 奖品个数
	//NumPrizesString       string   `json:"num_prizes_string"`       // 奖品个数
	Cost           string `json:"cost"`            // 需要花多少钱
	IsParticipants string `json:"is_participants"` // 是否参加
	AllCost        int    `json:"all_cost"`        // 总花费money，按月计算
	Winner         string `json:"wins"`
	IsNew          bool   `json:"is_new"`
	RemainingTime  int64  `json:"remaining_time"` // 充电剩余时间
}

func (f FormResp) String() string {
	buf, err := json.Marshal(f)
	if err != nil {
		return err.Error()
	}
	return string(buf)
}
