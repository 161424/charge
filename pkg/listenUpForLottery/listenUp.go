package listenUpForLottery

import (
	"charge/dao/redis"
	"charge/pkg/listenFollowUp"
	"context"
	"encoding/json"
	"fmt"
)

func ListenUp(tp string, input interface{}) {
	ctx := context.Background()
	vFollowData := listenFollowUp.FollowingData{}
	switch tp {
	case "modelTp", "lotteryGroup":
		ls := input.(Lottery)
		if v := redis.FindUp(ctx, ls.Mid); v != "" {
			err := json.Unmarshal([]byte(v), &vFollowData)
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
