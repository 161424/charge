package listenGroup

import (
	"charge/inet"
	"charge/pkg/listenUpForLottery"
	"charge/sender"
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
		Timestamp int64
		Min_seqno int
		Max_seqno int
	}
}

var lastTime int64 = 0

// 监听大锦鲤频道
func ListenDJLChannel() func() {
	return func() {
		size := 20
		ReadGroup(size)
	}

}

// 默认使用第一个账户配置
func ReadGroup(size int) {
	monitor := sender.Monitor{}
	monitor.Tag = "lottery"
	monitor.Title = "每日lottery监控——2(Group)"
	var groupUrl = "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs?talker_id=221094376&session_type=2&size="
	ctx := context.Background()
	group := Group{}
	t := time.Now()

	re := regexp.MustCompile(`[0-9]{18,}`)
	_groupUrl := groupUrl + strconv.Itoa(size)
	responders := inet.DefaultClient.CheckOne(_groupUrl)
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

	ExecFreq := 0
	groupContent := group.Data.Messages

	for i := 0; i < len(groupContent); i++ {
		cbody := groupContent[i]
		if cbody.Timestamp <= lastTime {
			continue
		}
		res := re.FindAllString(cbody.Content, -1)
		for j := 0; j < len(res); j++ {
			msg = append(msg, res[j])
			if listenUpForLottery.LotteryDetail(ctx, res[j], t) {
				ExecFreq++
			}
		}
	}
	lastTime = groupContent[0].Timestamp
	fmt.Println("从group获取到的信息数:", ExecFreq)
	if ExecFreq > 0 {
		monitor.Desp = fmt.Sprintf("从group获的lottery的个数%d", ExecFreq)
		monitor.PushS()
	}

}
