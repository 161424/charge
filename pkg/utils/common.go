package utils

import (
	"charge/config"
	"strings"
	"time"
)

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
