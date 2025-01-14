package utils

import (
	"strconv"
	"time"
)

func TimeFilter(endTime string) bool {
	t, _ := strconv.ParseInt(endTime, 10, 64)
	if time.UnixMilli(t).Sub(time.Now()) < time.Duration(3*24*time.Hour) {
		return true
	}
	return false
}
