package ql

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"charge/config"
	"charge/inet"
	"charge/utils"
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

// todo 报错出现失误
// Get "http://localhost:15700/open/auth/token?client_secret=y112y2WwJwsIFx_78L_ExtRs&client_id=G_NnpUwLV8dq": dial tcp [::1]:15700: connectex: No connection could be made because the target machine actively refused it.
//函数【%s】json解析错误，应该是参数出现了问题。错误信息:%s，返回数据：%s
// UpdateLocalEnv unexpected end of JSON input

func GetQLEnv(token string) {
	qlCk.cks = make(map[string]string)
	qlCk.tim = time.Now()
	url := QlClient.Addr + "/open/envs"
	url += "?searchValue=BILIBILI_COOKIES"
	qlEnvs := &QlEnvs{}
	resp, _ := QlClient.Get(url, token)
	err := json.Unmarshal(resp, qlEnvs)
	if err != nil {
		fmt.Printf(utils.ErrMsg["json"], "UpdateLocalEnv", err, string(resp))
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
		_ = uid_name_token[0]
		uid := utils.CutUid(v.Value)
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
		inet.DefaultClient.ReFresh(false)
		fmt.Println("inet CK更新完毕")
	}
}
