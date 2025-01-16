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
	fmt.Println(url)
	qlEnvs := &QlEnvs{}
	resp, ok := QlClient.Get(url, token)
	err := json.Unmarshal(resp, qlEnvs)
	if err != nil {
		fmt.Println(err)
		return
	}
	uids := map[string]string{}
	for _, ck := range config.Cfg.BUserCk {
		c := utils.CutUid(ck.Ck)
		uids[c] = ""
	}
	for _, v := range qlEnvs.Data {
		if v.Status == 1 {
			continue
		}
		uid := strings.Split(v.Remarks, "_")[0]
		if _, ok := uids[uid]; !ok {
			nck := config.BUserCk{}
			nck.Ck = v.Value
			config.Cfg.BUserCk = append(config.Cfg.BUserCk, nck)
		}
	}
	config.Write()
	fmt.Println(string(resp), ok)
}
