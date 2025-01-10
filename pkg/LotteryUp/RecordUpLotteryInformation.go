package LotteryUp

import (
	"charge/dao/redis"
	"charge/pkg/listenFollowUp"
	"context"
	"encoding/json"
	"fmt"
)

func LotteryRecords(tp string, input interface{}) {
	ctx := context.Background()
	vFollowData := listenFollowUp.FollowingData{}
	switch tp {
	case "modelTp", "lotteryGroup":
		ls := input.(Lottery)
		if v := redis.FindUp(ctx, ls.Mid); v != "" {
			err := json.Unmarshal([]byte(v), &vFollowData) // json: cannot unmarshal number into Go struct field FollowingData.mid of type string
			if err != nil {
				fmt.Println(err)
				return
			}
			if ls.IsOfficial {
				vFollowData.OfficialLottery++
			} else {
				vFollowData.CommonLottery++
			}
			redis.UpdateUp(ctx, vFollowData.Mid, vFollowData.String()) //

		} else {
			vFollowData.Mid = ls.Mid
			vFollowData.Uname = ls.Uname
			if ls.IsOfficial {
				vFollowData.OfficialLottery++
			} else {
				vFollowData.CommonLottery++
			}
			redis.UpdateUp(ctx, vFollowData.Mid, vFollowData.String()) //
		}
	}

}

func ListenUp() {

}
