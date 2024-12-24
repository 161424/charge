package common

import (
	"charge/inet"
	"encoding/json"
	"fmt"
	url2 "net/url"
	"strings"
	"time"
)

// 1. 获得大会员积分
// 2. 积分兑换

var goods = map[string]int{"大会员3天卡": 720, "大会员7天卡": 1680}
var task_code = map[string]string{"dress-view": "浏览装扮商城主页", "vipmallview": "浏览会员购页面10秒", "filmtab": "浏览影视频道页10秒", "ogvwatchnew": "观看剧集内容"}
var free_point = 75

type VipTask struct {
	Code int
	Data struct {
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
					Task_code      string
					State          int
					Title          string
					Link           string
					Complete_times int
					Max_times      int
				}
			}
			Sing_task_item struct {
				Histories []struct {
					Day      string
					Signed   bool
					Score    int
					Is_today bool
				}
				Count int
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

func BigPoint(idx int) {
	url := "https://api.bilibili.com/x/vip_point/task/combine"
	vTask := &VipTask{}
	resp := inet.DefaultClient.CheckSelect(url, idx)
	err := json.Unmarshal(resp, vTask)
	if err != nil {
		fmt.Println(err)
		return
	}
	if vTask.Code != 0 {
		fmt.Println("vip task err code:", vTask.Code)
		return
	}
	if len(vTask.Data.Task_info.Modules) == 0 {
		fmt.Println("获取任务列表失败，列表为空")
		return
	}
	fmt.Println("当前积分：", vTask.Data.Point_info.Point)
	fmt.Printf("%d积分即将过期，剩余%d天/n", vTask.Data.Point_info.Expire_point, vTask.Data.Point_info.Expire_time)
	if vTask.Data.Vip_info.Status == 0 || vTask.Data.Vip_info.Type == 0 {
		fmt.Println("当前无大会员，无法继续执行任务")
	}
	day := time.Now().Format("2006-01-02")
	for _, d := range vTask.Data.Task_info.Sing_task_item.Histories {
		if d.Day == day {
			if d.Signed {
				if code := vSign(idx); code == 0 {
					fmt.Println("签到成功 ✓")
				} else if code == -401 {
					fmt.Println("出现非法访问异常，可能账号存在异常，放弃大积分任务")
					return
				}
			} else {
				fmt.Println("今日已签到 ✓")
			}
		}
	}
	complateTask := 0
	// 领取任务
	for _, taskList := range vTask.Data.Task_info.Modules {
		if len(taskList.Common_task_item) == 1 {
			// 非日常任务
			if taskList.Common_task_item[0].Complete_times == taskList.Common_task_item[0].Max_times {
				continue
			}
		} else {
			// 日常任务
			for _, task := range taskList.Common_task_item {
				if _, ok := task_code[task.Task_code]; ok {
					if task.Complete_times == task.Max_times {
						// 任务已经完成
						complateTask++
						continue
					}
					if task.State == 1 {
						code := receiveTask(idx, task.Task_code)
						if code == 0 {
							if true {
							}
							completeTask(idx, task.Task_code)
						}
					}

				}
			}
		}
	}
	if complateTask >= len(task_code) {
		fmt.Println("任务都执行完毕，无可执行任务")
		return
	}

	// 任务执行

}

// 签到
func vSign(idx int) int {
	url := "https://api.bilibili.com/pgc/activity/score/task/sign"
	resp := inet.DefaultClient.CheckSelect(url, idx)
	reS := &reSign{}
	err := json.Unmarshal(resp, reS)
	if err != nil {
		fmt.Println("签到失败:", err)
		return -1
	}
	if reS.Code != 0 { // -401
		fmt.Println("签到失败:res Code", reS.Code, reS.Message)
		return reS.Code
	}
	return 0

}

func receiveTask(idx int, taskCode string) int {
	os := "android"
	channel := "xiaomi"
	mobileUA := fmt.Sprintf("Mozilla/5.0 BiliDroid/%s (bbcallen@gmail.com) os/%s model/%s mobi_app/%s build/%s channel/%s innerVer/%s osVer/%s network/2", "7.72.0", os, "MI 11 Ulter", os, "7720210", channel, channel, "10")
	refer := "https://big.bilibili.com/mobile/bigPoint/task"
	url := "https://api.bilibili.com/pgc/activity/score/task/receive/v2"
	reqBody := url2.Values{}
	//reqBody.Add("csrf", taskCode)
	reqBody.Add("taskCode", taskCode)
	//reqBody.Add("ts", strconv.Itoa(int(time.Now().Unix())))
	resp := inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", refer, mobileUA, idx, strings.NewReader(reqBody.Encode()))
	reS := &reSign{}
	err := json.Unmarshal(resp, &reS)
	if err != nil {
		fmt.Println(err)
		return -1
	}
	if reS.Code != 0 {
		fmt.Printf("接受任务%s失败.res Code:%d,res Message:%s", task_code, reS.Code, reS.Message)
		return reS.Code
	}
	fmt.Printf("领取[%s]任务完成", task_code[taskCode])
	return 0

}

//  观看剧集10分钟

// 浏览追番页面10s
// 浏览影视界面10s
func completeTask(idx int, taskCode string) int {
	url := "https://api.bilibili.com/pgc/activity/deliver/task/complete"
	refer := "https://big.bilibili.com/mobile/bigPoint"
	reqBody := url2.Values{}
	//reqBody.Add("csrf", taskCode)
	reqBody.Add("position", taskCode)
	resp := inet.DefaultClient.CheckSelectPost(url, "application/x-www-form-urlencoded", refer, "", idx, strings.NewReader(reqBody.Encode()))
	reS := &reSign{}
	err := json.Unmarshal(resp, &reS)
	if err != nil {
		fmt.Println(err)
		return -1
	}
	if reS.Code != 0 {
		fmt.Printf("完成任务%s失败.res Code:%d,res Message:%s", task_code, reS.Code, reS.Message)
		return reS.Code
	}
	fmt.Printf("完成[%s]任务完成", task_code[taskCode])
	return 0

}

//  浏览装扮商城e
//  浏览会员购

//  兑换礼品
