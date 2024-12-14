package utils

import "encoding/json"

type Up struct {
	Uid             int
	Name            string
	Fans            int
	ChargeLottery   int
	OfficialLottery int
	CommonLottery   int
}

func (u *Up) String() string {
	c, _ := json.Marshal(u)
	return string(c)
}
