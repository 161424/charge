package common

import (
	"charge/config"
	"encoding/json"
	"log"
	"math/rand"
	"os"
)

type Bangumi struct {
	Id         int
	Show_title string
	Aid        int
	Cid        int
}

type bangumiList struct {
	Name   string
	Md     int
	Season int
	Type   int
	List   []Bangumi
}

type bangumiBody struct {
	Result struct {
		Episodes []Bangumi
	}
}

var BangumiList = &bangumiList{}

func (b bangumiList) ReadFile() {
	// 默认观看西游记，但没有观看api，暂时还没有作用
	//GET https://api.bilibili.com/pgc/review/user?media_id=28229051
	BangumiList.Md = 28229051
	// GET https://api.bilibili.com/pgc/view/web/ep/list?season_id=33622
	BangumiList.Season = 33622
	BangumiList.Type = 3

	path := config.Path
	f, err := os.OpenFile(path+"/data/243343066.json", os.O_RDWR, 777)
	if err != nil {
		log.Fatalf("读取文件失败: %v", err)
	}

	bangumibody := &bangumiBody{}
	defer f.Close()
	err = json.NewDecoder(f).Decode(&bangumibody)
	if err != nil {
		panic(err)
	}
	BangumiList.List = bangumibody.Result.Episodes
	//
	bangumibody = nil
}

func (b bangumiList) Random() Bangumi {
	b.ReadFile()
	return b.List[rand.Intn(len(b.List))]
}
