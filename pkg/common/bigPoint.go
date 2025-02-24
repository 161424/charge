package common

import (
	"charge/config"
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strings"
	"time"
)

// 大会员积分项目的请求内容，需要对app进行抓包获取。
// 1. 获得大会员积分
// 2. 积分兑换

var task_code = map[string]string{"dress-view": "浏览装扮商城主页", "vipmallview": "浏览会员购页面10秒", "filmtab": "浏览影视频道页10秒", "ogvwatchnew": "观看剧集内容"}

type VipTask struct {
	Code    int
	Message string
	Data    struct {
		Vip_info struct {
			Type   int // 0 普通 1 月度 2 年度
			Status int // 0 不存在 1 存在
		}
		Point_info struct {
			Point        int
			Expire_point int
			Expire_time  int
			Expire_days  int
		}
		Task_info struct {
			Modules []struct {
				Module_title     string
				Common_task_item []struct {
					Task_code      string // 任务代码
					State          int    // 0表示未接受任务，1表示已经接受任务，3表示任务已经完成
					Title          string
					Link           string
					Complete_times int // 执行次数
					Max_times      int // 最大执行次数
				}
			}
			Sing_task_item struct {
				Histories []struct {
					Day      string
					Signed   bool
					Score    int
					Is_today bool
				}
				Count int // 连续签到次数
			}
		}
	}
}

type reSign struct {
	Code    int
	Message string
	Data    struct{}
}

type PointInfo struct {
	CurrPoint   int
	ExpirePoint int
	ExpireTime  int
	ExpireDays  int
}

type PointList struct {
	Code    int
	Message string
	Data    struct {
		Big_point_list []struct {
			Point       int
			Change_time int64
		}
	}
}

var modelBigTask = "大会员积分签到"

func BigPoint(idx int) {
	if Note.Register(modelBigTask) { // 在第一轮执行无误后会跳过
		Note.AddString("今日【%s】已执行完毕\n", modelBigTask)
		return
	}
	url := "https://api.bilibili.com/x/vip_point/task/combine"
	vTask := &VipTask{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, vTask)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "BigPoint", err.Error(), string(resp))
		return
	}
	if vTask.Code != 0 {
		Note.StatusAddString(utils.ErrMsg["code"], "BigPoint", vTask.Code, vTask.Message)
		return
	}
	if len(vTask.Data.Task_info.Modules) == 0 {
		Note.StatusAddString("%s获取任务列表失败，列表为空\n", "BigPoint")
		//fmt.Println("获取任务列表失败，列表为空")
		return
	}
	Note.AddString("当前大会员积分：%d。其中%d积分即将过期，剩余%d天\n", vTask.Data.Point_info.Point, vTask.Data.Point_info.Expire_point, vTask.Data.Point_info.Expire_days)

	day := time.Now().Format("2006-01-02")
	for _, d := range vTask.Data.Task_info.Sing_task_item.Histories {
		if d.Day == day {
			if d.Signed == false {
				if code := VSign(idx); code == 0 {
					Note.AddString("今日份大会员签到成功 ✓\n")
				} else if code == -401 {
					Note.StatusAddString("出现非法访问异常，可能账号存在异常，放弃大积分任务\n")
					return
				}
			} else {
				Note.AddString("今日份大会员已签到 ✓\n")
			}
		}
	}

	// 领取任务
	for _, taskList := range vTask.Data.Task_info.Modules {
		if len(taskList.Common_task_item) == 1 {
			// 非日常任务即一次性任务，pass。
			if taskList.Common_task_item[0].Complete_times == taskList.Common_task_item[0].Max_times {
				continue
			}
		} else {
			// 日常任务
			for _, task := range taskList.Common_task_item {
				if _, ok := task_code[task.Task_code]; ok {
					if task.Complete_times == task.Max_times {
						// 任务已经完成
						continue
					}
					if task.State != 3 { //
						time.Sleep(500 * time.Millisecond)
						code := ReceiveTask(idx, task.Task_code)
						if code == 0 {
							// 执行任务
							if task.Task_code == "ogvwatchnew" {
								// 10分钟观影任务 ,看视频40积分
								if inet.DefaultClient.Cks[idx].Access_key == "" {
									Note.AddString("【10分钟观影任务】无法完成，因为缺少必要的Access_key\n")
								} else {
									config.Read() // 确保access尽可能正确
									WatchRandomEp(idx)
								}
							} else if task.Task_code == "vipmallview" {
								// 会员购
								if VipMallView(idx) == 0 {
									Note.AddString("【浏览会员购】每日任务 ✓")
								}
							} else if task.Task_code == "dress-view" {
								// 装扮商城
								if CompleteTaskV2(idx, task.Task_code) == 0 {
									Note.AddString("【%s】任务完成 ✓\n", task_code[task.Task_code])
								}
							} else {
								if CompleteTask(idx, task.Task_code) == 0 {
									// 影视、番剧10s
									Note.AddString("【%s】任务完成 ✓\n", task_code[task.Task_code])
								}
							}
						}
					}

				}
			}
			// jp_channel任务 不在task目录中，奇怪  需要修改位置
			if CompleteTask(idx, "jp_channel") == 0 {
				// 影视、番剧10s
				Note.AddString("任务【%s】完成 ✓\n", "jp_channel")
			}
		}
	}
	// 积分查询任务
	time.Sleep(2 * time.Second)
	todayPoint := GetTodayPoint(idx)
	if todayPoint >= 45 {
		Note.AddString("今日获取积分【%d】，跳过检测观看结果\n", todayPoint)
	} else if todayPoint < 35 {
		Note.StatusAddString("今日获取积分【%d】, 未达到预期 ×。\n", todayPoint)
	} else {
		Note.StatusAddString("今日获取积分【%d】, 部分任务未成功（可能是完成获取，但是接口数据延迟） ×。\n", todayPoint)
	}
}

// 签到
func VSign(idx int) int {
	url := "https://api.bilibili.com/pgc/activity/score/task/sign"
	resp := inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, nil)
	reS := &reSign{}
	err := json.Unmarshal(resp, reS)
	//fmt.Println(string(resp), reS)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "VSign", err.Error(), string(resp))
		return -1
	}
	if reS.Code != 0 { // -401
		Note.StatusAddString(utils.ErrMsg["code"], "VSign", reS.Code, string(resp))
		return reS.Code
	}
	return 0

}

// 接受任务
func ReceiveTask(idx int, taskCode string) int {
	os := "android"
	channel := "xiaomi"
	mobileUA := fmt.Sprintf("Mozilla/5.0 BiliDroid/%s (bbcallen@gmail.com) os/%s model/%s mobi_app/%s build/%s channel/%s innerVer/%s osVer/%s network/2", "7.72.0", os, "MI 11 Ulter", os, "7720210", channel, channel, "10")
	refer := "https://big.bilibili.com/mobile/bigPoint/task"
	url := "https://api.bilibili.com/pgc/activity/score/task/receive/v2"
	reqBody := url2.Values{}
	reqBody.Add("taskCode", taskCode)
	resp := inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", refer, mobileUA, idx, strings.NewReader(reqBody.Encode()))
	reS := &reSign{}
	err := json.Unmarshal(resp, &reS)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "ReceiveTask", err.Error(), string(resp))
		return -1
	}
	if reS.Code != 0 {
		Note.StatusAddString("领取任务【%s】失败.res Code:%d,res Message:%s\n", task_code[taskCode], reS.Code, reS.Message)
		return reS.Code
	}
	Note.AddString("领取任务【%s】成功\n", task_code[taskCode])
	return 0

}

// 不知道api，先放弃
// 观看剧集10分钟

// 浏览追番页面10s    jp_channel
// 浏览影视界面10s    tv_channel
func CompleteTask(idx int, taskCode string) int {
	url := "https://api.bilibili.com/pgc/activity/deliver/task/complete"
	refer := "https://big.bilibili.com/mobile/bigPoint"
	reqBody := url2.Values{}
	taskC := taskCode
	if taskCode == "filmtab" {
		taskC = "tv_channel"
	}
	reqBody.Add("position", taskC)
	resp := inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", refer, "", idx, strings.NewReader(reqBody.Encode()))
	reS := &reSign{}
	err := json.Unmarshal(resp, &reS)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "CompleteTask", err.Error(), string(resp))
		return -1
	}
	if reS.Code != 0 {
		Note.StatusAddString("任务【%s】完成失败.res Code:%d,res Message:%s\n", task_code[taskCode], reS.Code, reS.Message)
		return reS.Code
	}
	return 0

}

// 浏览装扮商城e
func CompleteTaskV2(idx int, taskCode string) int {
	url := "https://api.bilibili.com/pgc/activity/score/task/complete/v2"
	refer := "https://big.bilibili.com/mobile/bigPoint/task"
	reqBody := url2.Values{}
	reqBody.Add("taskCode", taskCode)
	resp := inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", refer, "", idx, strings.NewReader(reqBody.Encode()))
	reS := &reSign{}
	err := json.Unmarshal(resp, &reS)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "CompleteTaskV2", err.Error(), string(resp))
		return -1
	}
	if reS.Code != 0 {
		Note.StatusAddString("任务【%s】完成失败.res Code:%d,res Message:%s\n", task_code[taskCode], reS.Code, reS.Message)
		return reS.Code
	}
	return 0

}

// 浏览会员购
func VipMallView(idx int) int {
	_url := "https://show.bilibili.com/api/activity/fire/common/event/dispatch"
	reqBody := `{"eventId":"hevent_oy4b7h3epeb"}`
	resp := inet.DefaultClient.CheckSelectPost(_url, "", "", "", idx, strings.NewReader(reqBody))
	reS := &reSign{}
	err := json.Unmarshal(resp, reS)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "CompleteTaskV2", err.Error(), string(resp))
		return -1
	}
	if reS.Code != 0 {
		Note.StatusAddString("任务【%s】完成失败.res Code:%d,res Message:%s\n", "浏览会员购", reS.Code, reS.Message)
		return reS.Code

	}
	return 0

}

func GetTodayPoint(idx int) int {
	url := "https://api.bilibili.com/x/vip_point/list"
	pointList := PointList{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, &pointList)
	if err != nil {
		Note.StatusAddString(utils.ErrMsg["json"], "GetTodayPoint", err.Error(), string(resp))
		return -1
	}
	if pointList.Code != 0 {
		Note.StatusAddString("获取积分列表失败，res.Code：%d，res.Message：%s\n", pointList.Code, pointList.Message)
		return -1
	}

	point := 0
	todayStart := time.Now().Day()
	for _, l := range pointList.Data.Big_point_list {
		// 判断时间戳是否在今天的范围内
		t := time.Unix(l.Change_time, 0).Day()
		if t == todayStart {
			point += l.Point
		} else {
			return point
		}
	}
	return point

}

//  兑换礼品

func CostPointForTarget(idx int) {

}
