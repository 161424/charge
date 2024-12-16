package upList

import "encoding/json"

// 根据多ck监听其关注的up 或 将up进行列表统计然后多ck进行监听
var url = "https://api.bilibili.com/x/relation/followings/?vmid=%s&pn=%d" // vmid为uid，pn为第几页，默认一页50个up

type FollowingData struct {
	Mid             string `json:"mid"`
	Uname           string `json:"uname"`
	Official_Desc   string `json:"official_desc"`
	ChargeLottery   int
	OfficialLottery int
	CommonLottery   int
}

type Following struct {
	Code int `json:"code"`
	Data struct {
		List []struct {
			Mid             int
			Uname           string
			Official_verify struct {
				Desc string
			}
		}
		Total int
	}
}

func ListenUp() func() {
	return func() {

	}
}

func (u *FollowingData) String() string {
	c, _ := json.Marshal(u)
	return string(c)
}
