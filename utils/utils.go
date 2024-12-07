package utils

import (
	"fmt"
	"time"
)

func Tracker(t time.Time) {
	tm := time.Now()
	fmt.Println(tm.Sub(t))
}
