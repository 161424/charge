package utils

import (
	"bytes"
	"charge/config"
	"charge/dao/redis"
	"charge/inet"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

var rank = []string{"daily", "weekly", "monthly"}
var headlining = "%d. 画师名字：%s；创作时间：%s；作品id：%s\n"
var defaultPath = config.Path + "/pkg/upload/picture/"

// 图片搬运
// 每日图片n张。   排行榜日、月、周

// 主号和小号
// 每日7张。  排行榜日两张，周两张，月两张，推荐一张。若重复则从推荐选取

// 其余
// 每日一张图片发动态

// 通过SD训练出图对于GPU要求过高，难以完成。因此通过爬取pixiv
// 返回图片路径

type RpJs struct {
	Contents []RpJsContents `json:"contents"`
}

type RpJsContents struct {
	Title             string `json:"title"`             //  名称
	Date              string `json:"date"`              // 日期
	Url               string `json:"url"`               //
	IllustType        string `json:"illust_type"`       //
	IllustBookStyle   string `json:"illust_book_style"` //
	IllustPageCount   string `json:"illust_page_count"` // 图片张数
	UserName          string `json:"user_name"`         // 画者名字
	IllustContentType struct {
		Sexual     int  `json:"sexual"`
		Lo         bool `json:"lo"`
		Grotesque  bool `json:"grotesque"`
		Violent    bool `json:"violent"`
		Homosexual bool `json:"homosexual"`
		Drug       bool `json:"drug"`
		Thoughts   bool `json:"thoughts"`
		Antisocial bool `json:"antisocial"`
		Religion   bool `json:"religion"`
		Original   bool `json:"original"`
		Furry      bool `json:"furry"`
		Bl         bool `json:"bl"`
		Yuri       bool `json:"yuri"`
	} `json:"illust_content_type"`
	IllustSeries interface{} `json:"illust_series"`
	IllustId     int         `json:"illust_id"` // 作品id
	Is_masked    bool        `json:"is_masked"`
	UserId       int         `json:"user_id"`
}

type DiscoveryResp struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
	Body    struct {
		Thumbnails struct {
			Illust []Illust
		} `json:"thumbnails"`
	} `json:"body"`
}

type Illust struct {
	Id         string    `json:"id"`
	Title      string    `json:"title"`
	IllustType int       `json:"illustType"`
	Url        string    `json:"url"`
	UserId     string    `json:"userId"`
	UserName   string    `json:"userName"`
	PageCount  int       `json:"pageCount"`
	CreateDate time.Time `json:"createDate"`
	AiType     int       `json:"aiType"` // 1是ai，0不是
	Urls       struct {
		X250  string `json:"250x250"`
		X360  string `json:"360x360"`
		X540  string `json:"540x540"`
		X1200 string `json:"1200x1200"`
	} `json:"urls"`
}

var u, _ = url.Parse("http://127.0.0.1" + ":" + "10809")
var PixivClient = &http.Client{
	Timeout: time.Second * 60,
	Transport: &http.Transport{
		Proxy: http.ProxyURL(u),
	},
}

func LinkPixiv() {

}

func GetPixivPage(url string) []byte {
	fmt.Println(url)
	client := PixivClient
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		panic(err)
	}
	req.Header.Set("User-Agent", config.Cfg.WebUserAgent)
	req.Header.Set("Referer", "https://www.pixiv.net")
	req.Header.Set("Content-Type", "application/json")
	ck := "first_visit_datetime_pc=2024-12-29%2018%3A35%3A59; p_ab_id=8; p_ab_id_2=5; p_ab_d_id=75731399; yuid_b=MSZilHY; privacy_policy_agreement=7; c_type=26; privacy_policy_notification=0; a_type=0; b_type=1; cc1=2025-02-12%2000%3A55%3A07; PHPSESSID=23316552_FsU0Vmvv5m2Ep0P0CahrTNhRojGSdKJr; device_token=23411fecd6c07ea215e71ce35529fb07; __cf_bm=mZ4B3b2Wm0i_ibRweZMzaFO4Q.2BeSK0DSuR1_Vr6Ps-1739342655-1.0.1.1-Rb9265G8FHHwrimJBilWrZQd2fkZSNSlYyCNMTTVgLiUv4PCgB1HzrOj9wku0PeFuzwz23ntsXYpjyWLGxSmq4hVpfwyqRm7huJZpo7IXKw; cf_clearance=9Zkbts04hvo6PG13nz4a8GUTilMMfwNJzt98dh4drC8-1739342661-1.2.1.1-jVlGTRzTDaOcD_0wpcsKRhjxEfAUSvezLkIQBH.MQTwqFBRlAMTrOuVo.LMHMXfSIA1cVY9t4h85yYm_CgA8C5eB7iXs1IWi46ua.sYKy6qECdGavkkoshefFXyTJdGi53sfnDdJsjHacxgGcDKicJJBF1MTptBn4VQmXfNokJFOI0.kFCd9UPkQThNcr3F0R9kBW5gQAwwaarI2pPhUjyzzbIPdVWRDlYruJJWQPGhTzXtb7MkMKU7anEk0wtfPDwW4_ZDH1UJ39Zhe0AueqB05PP8O2colZcd08ShQC2g; login_ever=yes; howto_recent_view_history=127115916"
	for _, i := range strings.Split(ck, "; ") {
		a := strings.Split(i, "=")
		req.AddCookie(&http.Cookie{Name: a[0], Value: a[1]})
	}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	body, _ := io.ReadAll(resp.Body)
	defer resp.Body.Close()
	return body
}

func ReqDwUrl() []RpJsContents {
	urls := []RpJsContents{}
	url := "https://www.pixiv.net/ranking.php?mode="
	for _, v := range rank {
		_url := url + v
		rpJs := &RpJs{}
		resp := GetPixivPage(_url)
		err := json.Unmarshal(resp, rpJs)
		if err != nil {
			return nil
		}
		sk := 0
		for _, c := range rpJs.Contents {
			if sk == 2 { // 每个排行榜两张
				break
			}
			if c.IllustPageCount == "1" && c.Is_masked == false && c.IllustContentType.Sexual == 0 {
				urls = append(urls, c)
				sk++
			}
		}
	}
	return urls

}

func DownloadPixiv(uname string) []RpJsContents {
	resp := ReqDwUrl()
	path := []RpJsContents{}
	ctx := context.Background()
	if resp == nil {
		return path
	}

	for _, v := range resp {
		id := strconv.Itoa(v.IllustId)
		if redis.PixivCheck(ctx, id) {
			continue
		} else {
			name := DelSpeChar(v.UserName + "_" + v.Title + "_" + id + ".jpg")
			fileNameAll := MakeFilename("all")
			fileNameAll += string(os.PathSeparator) + name

			fileName := MakeFilename(uname)
			fileName += string(os.PathSeparator) + name
			imgUrl := strings.Split(v.Url, "img-master")
			if len(imgUrl) != 2 {
				return path
			}
			_url := "https://i.pximg.net/img-master" + imgUrl[1]
			for retryCount := 0; retryCount < 3; retryCount++ {
				imgBt := GetPixivPage(_url)
				b := PerformDownload(imgBt, fileName)
				if b {
					PerformDownload(imgBt, fileNameAll)
					redis.PixivAdd(ctx, id)
					v.Title = name
					path = append(path, v)
					break
				}
				time.Sleep(10 * time.Second)
			}
		}
	}

	return path
}

func DownloadDiscovery(uname string, num int) []Illust {
	url := "https://www.pixiv.net/ajax/discovery/artworks?mode=all&limit=30&lang=zh"
	ctx := context.Background()
	path := []Illust{}
	discoveryResp := &DiscoveryResp{}
	resp := GetPixivPage(url)
	err := json.Unmarshal(resp, discoveryResp)
	if err != nil {
		return path
	}
	k := 0
	for _, v := range discoveryResp.Body.Thumbnails.Illust {
		if k == num {
			break
		}
		if v.PageCount != 1 {
			continue
		}
		id := v.Id
		if redis.PixivCheck(ctx, id) {
			continue
		} else {
			name := DelSpeChar(v.UserName + "_" + v.Title + "_" + id + ".jpg")
			fileNameAll := MakeFilename("all")
			fileNameAll += "/" + name

			fileName := MakeFilename(uname)
			fileName += "/" + name
			_url := ""
			if v.Urls.X1200 != "" {
				_url = v.Urls.X1200
			} else {
				imgUrl := strings.Split(v.Url, "img-master")
				if len(imgUrl) != 2 {
					return path
				}
				_url = "https://i.pximg.net/img-master" + imgUrl[1]
			}

			for retryCount := 0; retryCount < 3; retryCount++ {
				imgBt := GetPixivPage(_url)
				b := PerformDownload(imgBt, fileName)
				if b {
					PerformDownload(imgBt, fileNameAll)
					redis.PixivAdd(ctx, id)
					v.Title = name
					path = append(path, v)
					break
				}
				time.Sleep(10 * time.Second)
			}
			k++
		}
	}

	return path

}

func MakeFilename(path string) string {
	path = defaultPath + path
	_, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			err = os.MkdirAll(path, os.ModeDir|os.ModePerm)
			if err != nil {
				log.Fatalf("创建文件夹(%s)出现错误喽", path)
			}
		}
	}
	return path
}

func PerformDownload(resp []byte, fileNameSave string) bool {
	buf := new(bytes.Buffer)
	f, err := os.OpenFile(fileNameSave, os.O_WRONLY|os.O_CREATE, 0777)
	if err != nil {
		log.Fatalln(err)
	}
	buf.Write(resp)
	f.Write(resp)
	defer f.Close()

	st, _ := os.Stat(fileNameSave)
	if st.Size() == int64(len(resp)) {
		return true
	}

	return false

}

func ImageGeneration(uname string) (string, []string) {
	desp := ""
	path := []string{}
	inet.DefaultClient.ReFresh(false)
	imgs1 := DownloadPixiv(uname)
	if len(imgs1) != 0 {
		for i, img := range imgs1 {
			id := strconv.Itoa(img.IllustId)
			date := strings.Split(img.Date, " ")[0]
			desp += fmt.Sprintf(headlining, i, img.UserName, date, id)
			path = append(path, img.Title)
		}
	}
	num := 6 - len(imgs1)
	imgs2 := DownloadDiscovery(uname, num)
	if len(imgs2) != 0 {
		for i, img := range imgs2 {
			date := img.CreateDate.Format("2006-01-02")
			desp += fmt.Sprintf(headlining, i, img.UserName, date, img.Id)
			path = append(path, img.Title)
		}
	}
	return desp, path
}

func DelSpeChar(DF string) string {
	DF = strings.Replace(DF, "\\", "", -1)
	DF = strings.Replace(DF, "/", "", -1)
	DF = strings.Replace(DF, ":", "", -1)
	DF = strings.Replace(DF, "*", "", -1)
	DF = strings.Replace(DF, "?", "", -1)
	DF = strings.Replace(DF, "\\\"", "", -1)
	DF = strings.Replace(DF, "<", "", -1)
	DF = strings.Replace(DF, ">", "", -1)
	DF = strings.Replace(DF, "|", "", -1)
	return DF

}
