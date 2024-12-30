package common

import (
	"charge/inet"
	"encoding/json"
)

type My struct {
	Code    int // -101：账号未登录 -400：请求错误 0：成功
	Message string
	Data    struct {
		List []struct {
			Type        int `json:"type"`        // id
			State       int `json:"state"`       // 0：未兑换 1：已兑换 2：未完成（若需要完成）
			Expire_time int `json:"expire_time"` //本轮卡券过期时间戳

		}
		Level    int
		Cur_exp  int
		Next_exp int
		Is_vip   int
	}
}

type userV struct {
	Level    int
	Cur_exp  int
	Next_exp int
	Is_vip   int
	List     []struct {
	}
}

func VipPrivilege(idx int) int {
	url := "https://api.bilibili.com/x/vip/privilege/my"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	my := &My{}
	err := json.Unmarshal(resp, &my)
	if err != nil {
		return 0
	}
	return 0
}

// B币券监听和使用

func BCoinNotify() {

}
