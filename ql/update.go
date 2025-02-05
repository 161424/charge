package ql

import (
	"charge/config"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

type QlEnvs struct {
	Code    int
	Message string
	Data    []struct {
		Id       int
		Name     string
		Value    string
		Remarks  string
		Status   int
		Position int
	}
}

type qlCks struct {
	cks map[string]string
	tim time.Time
}

var qlCk qlCks

func RespNewCk(uid string) string {
	return ""
}

func GetQLEnv(token string) {
	qlCk.cks = make(map[string]string)
	qlCk.tim = time.Now()
	url := QlClient.Addr + "/open/envs"
	url += "?searchValue=BILIBILI_COOKIES"
	qlEnvs := &QlEnvs{}
	resp, _ := QlClient.Get(url, token)
	err := json.Unmarshal(resp, qlEnvs)
	if err != nil {
		fmt.Println(utils.ErrMsg["json"], "UpdateLocalEnv", err, string(resp))
		return
	}
	for _, ck := range config.Cfg.BUserCk {
		c := utils.CutUid(ck.Ck)
		qlCk.cks[c] = ""
	}
	for _, v := range qlEnvs.Data {
		if v.Status == 1 { // 表示禁用
			continue
		}

		if strings.Contains(v.Value, "DedeUserID") == false || strings.Contains(v.Value, "SESSDATA") == false || strings.Contains(v.Value, "bili_jct") == false {
			continue
		}

		uid_name_token := strings.Split(v.Remarks, "_")
		uid := uid_name_token[0]
		acTime := ""
		if len(uid_name_token) >= 3 && uid_name_token[2] != "" {
			acTime = uid_name_token[2]
		}
		if _, ok := qlCk.cks[uid]; !ok { // 如果不存在则push
			nck := config.BUserCk{}
			nck.Ck = v.Value
			nck.Token = acTime
			config.Cfg.BUserCk = append(config.Cfg.BUserCk, nck)
		} else { // 如果存在呢？  则进行替换
			repeat := false
			for k, ck := range config.Cfg.BUserCk {
				if utils.CutUid(ck.Ck) == uid {
					if repeat == true {
						config.Cfg.BUserCk = append(config.Cfg.BUserCk[:k], config.Cfg.BUserCk[k+1:]...)
						continue
					}
					config.Cfg.BUserCk[k].Ck = v.Value
					config.Cfg.BUserCk[k].Token = acTime
					repeat = true
				}
			}
		}
		qlCk.cks[uid] = v.Value
	}
	config.Write()
}

func LinkQLAndUpdateCk() func() {
	return func() {
		token := LinkQl()
		GetQLEnv(token)
		fmt.Println("青龙CK更新完毕")
		inet.DefaultClient.ReFresh()
		fmt.Println("inet CK更新完毕")

	}
}

func UpdateQlEnv() {

}
