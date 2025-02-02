package ql

import (
	"charge/config"
	"charge/utils"
	"encoding/json"
	"fmt"
	"strings"
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

func UpdateLocalEnv(token string) {
	url := QlClient.Addr + "/open/envs"
	url += "?searchValue=BILIBILI_COOKIES"
	qlEnvs := &QlEnvs{}
	resp, _ := QlClient.Get(url, token)
	err := json.Unmarshal(resp, qlEnvs)
	if err != nil {
		fmt.Println(utils.ErrMsg["json"], "UpdateLocalEnv", err, string(resp))
		return
	}
	uids := map[string]string{}
	for _, ck := range config.Cfg.BUserCk {
		c := utils.CutUid(ck.Ck)
		uids[c] = ""
	}
	for _, v := range qlEnvs.Data {
		if v.Status == 1 { // 表示禁用
			continue
		}
		uid := strings.Split(v.Remarks, "_")[0]
		if _, ok := uids[uid]; !ok { // 如果不存在则直接替换
			nck := config.BUserCk{}
			nck.Ck = v.Value
			config.Cfg.BUserCk = append(config.Cfg.BUserCk, nck)
		} else { // 如果存在呢？  则进行替换
			for k, ck := range config.Cfg.BUserCk {
				if utils.CutUid(ck.Ck) == uid {
					config.Cfg.BUserCk[k].Ck = v.Value
				}
			}
		}
	}
	config.Write()
}

func UpdateQlEnv() {

}
