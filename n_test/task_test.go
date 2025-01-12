package n

import (
	"charge/pkg/common"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"
)

func TestTask(t *testing.T) {
	os := "android"
	channel := "xiaomi"
	mobileUA := fmt.Sprintf("Mozilla/5.0 BiliDroid/%s (bbcallen@gmail.com) os/%s model/%s mobi_app/%s build/%s channel/%s innerVer/%s osVer/%s network/2", "7.72.0", os, "MI 11 Ulter", os, "7720210", channel, channel, "10")
	fmt.Println(mobileUA)
}

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

func TestTask2(t *testing.T) {
	path, _ := os.Getwd()
	npath := strings.Split(path, "\\")
	if npath[len(npath)-1] != "charge" {
		npath = npath[:len(npath)-1]
	}
	path = strings.Join(npath, "/")
	f, err := os.Open(path + "/data/243343066.json")
	if err != nil {
		panic(err)
	}
	bangumibody := &bangumiBody{}
	defer f.Close()
	err = json.NewDecoder(f).Decode(&bangumibody)
	if err != nil {
		panic(err)
	}
	fmt.Println(bangumibody)
}

func TestWatchExp(t *testing.T) {
	common.WatchExp(3)
}

func TestWatchRandomEp(t *testing.T) {
	common.WatchRandomEp(0)
	time.Sleep(10 * time.Minute)
	time.Sleep(10 * time.Second)
}
