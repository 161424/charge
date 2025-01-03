package utils

import (
	"charge/config"
	"charge/inet"
	"charge/utils"
	"strings"
	"time"
)

func init() {
	inet.DefaultClient.RegisterTp(modelTp)
}

var DefaultUid = ""

func SetDefaultUid(uid string) {
	if uid == "" {
		DefaultUid = utils.CutUid(config.Cfg.BUserCk[0].Ck)
	} else {
		DefaultUid = utils.CutUid(uid)
	}
}

func DaleyTime(t time.Time) func() {
	return func() {
		nt := time.Now()
		if nt.Sub(t) < time.Duration(config.Cfg.DaleyTime) {
			time.Sleep(t.Add(time.Duration(config.Cfg.DaleyTime)).Sub(nt))
		}
	}
}

// 睡眠10分钟
func CheckFK(b []byte) {
	s := string(b)
	isSleep := false
	if strings.Contains(s, "由于触发哔哩哔哩安全风控策略，该次访问请求被拒绝。") {
		isSleep = true
	}

	if isSleep {
		time.Sleep(10 * time.Minute)
	}
}
