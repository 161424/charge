package listenGroup

import (
	"charge/inet"
	"charge/pkg/listenUpForLottery"
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"time"
)

type GroupData struct {
	Sender_uid int
	BusinessID string
	Msg_seqno  int
	Timestamp  int64
}

type Group struct {
	Code    int
	Message string
	Data    struct {
		Messages []struct {
			Sender_uid int
			Content    string
			Msg_seqno  int
			Timestamp  int64
		}
		Min_seqno int
		Max_seqno int
	}
}

// 监听大锦鲤频道
func ListenDJLChannel() func() {
	isFirst := true
	return func() {
		size := 20
		if isFirst {
			isFirst = false
		} else {
			size = 20
		}
		ReadGroup(size)
	}

}

func ReadGroup(size int) {
	var groupUrl = "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs?talker_id=221094376&session_type=2&size="
	_groupUrl := groupUrl + strconv.Itoa(size)
	responders := inet.DefaultClient.CheckOne(_groupUrl)
	ctx := context.Background()
	group := Group{}
	t := time.Now()
	err := json.Unmarshal(responders, &group)
	if err != nil {
		fmt.Println("err :", err)
		return
	}
	msg := []string{}
	if group.Code != 0 {
		// code:-101  账号未登录
		fmt.Println("ReadGroup err code:", group.Code, group)
		return
	}
	groupContent := group.Data.Messages
	fmt.Println("groupContent长度", len(groupContent))
	re := regexp.MustCompile(`[0-9]{18,}`)

	for i := 0; i < len(groupContent); i++ {
		cbody := groupContent[i]
		res := re.FindAllString(cbody.Content, -1)
		for j := 0; j < len(res); j++ {
			msg = append(msg, res[j])
			listenUpForLottery.LotteryDetail(ctx, res[j], t)
		}
	}
	fmt.Println("从group获取到的信息数:", len(msg), msg)
}
