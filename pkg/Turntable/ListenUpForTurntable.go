package Turntable

import (
	utils2 "charge/pkg/utils"
	"fmt"
	"time"
)

// 根本中不了。。。
func ListenUpForTurntable() func() {
	return func() {
		t := utils2.ListenTurnTable()
		for _, v := range t {
			for j := 0; j < 21; j++ {
				time.Sleep(time.Second)
				action_type := 3
				if v.Action_type != 0 {
					action_type = v.Action_type
				}
				fmt.Println(action_type)
			}
		}
	}
}
