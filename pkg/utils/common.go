package utils

import (
	"charge/config"
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
