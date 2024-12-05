package types

import "encoding/json"

type FormReq struct {
	Key string `json:"key"`
}

type FormResp struct {
	Id              int    `json:"id"`   // 默认id
	UName           string `json:"name"` // 抽奖者名字
	UFans           string `json:"fans"` // 抽奖者粉丝数
	Uid             int    `json:"uid"`  //
	EndTimeUnix     int64  `json:"end_timeUnix"`
	EndTime         string `json:"end_time"`         // 结束时间
	Prizes          string `json:"Prizes"`           // 奖品内容
	NumParticipants int    `json:"num_participants"` // 参与人数
	NumPrizes       int    `json:"num_prizes"`       // 奖品个数
	Cost            int    `json:"cost"`             // 需要花多少钱
	IsParticipants  bool   `json:"is_participants"`  // 是否参加
	AllCost         int    `json:"all_cost"`         // 总花费money，按月计算
	Winner          string `json:"wins"`
}

func (f FormResp) String() string {
	buf, err := json.Marshal(f)
	if err != nil {
		return err.Error()
	}
	return string(buf)
}
