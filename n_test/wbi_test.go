package n

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"github.com/tidwall/gjson"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"
	"sync"
	"testing"
	"time"
)

func TestWbi(t *testing.T) {
	s := "https://api.bilibili.com/x/dynamic/feed/create/dyn?platform=web&csrf=7fa21130f4355dd96b5163daf0d69156&x-bili-device-req-json={\"platform\":\"web\",\"device\":\"pc\"}&x-bili-web-req-json={\"spm_id\":\"333.1365\"}&dm_img_list=[{\"x\":4744,\"y\":4033,\"z\":0,\"timestamp\":2413390,\"k\":82,\"type\":0},{\"x\":4803,\"y\":4084,\"z\":60,\"timestamp\":2413563,\"k\":89,\"type\":0},{\"x\":4917,\"y\":4192,\"z\":192,\"timestamp\":2413665,\"k\":85,\"type\":0},{\"x\":4973,\"y\":4241,\"z\":269,\"timestamp\":2413766,\"k\":87,\"type\":0},{\"x\":4928,\"y\":4189,\"z\":245,\"timestamp\":2413868,\"k\":104,\"type\":0},{\"x\":4735,\"y\":3998,\"z\":69,\"timestamp\":2413968,\"k\":69,\"type\":0},{\"x\":5059,\"y\":4322,\"z\":393,\"timestamp\":2414198,\"k\":62,\"type\":1},{\"x\":5393,\"y\":4656,\"z\":727,\"timestamp\":2414304,\"k\":124,\"type\":0},{\"x\":4983,\"y\":4234,\"z\":330,\"timestamp\":2414566,\"k\":65,\"type\":0},{\"x\":5021,\"y\":4278,\"z\":373,\"timestamp\":2415014,\"k\":70,\"type\":0},{\"x\":5254,\"y\":4510,\"z\":609,\"timestamp\":2415197,\"k\":116,\"type\":0},{\"x\":5800,\"y\":5062,\"z\":1160,\"timestamp\":2415299,\"k\":63,\"type\":0},{\"x\":5569,\"y\":4806,\"z\":935,\"timestamp\":2415769,\"k\":75,\"type\":0},{\"x\":5647,\"y\":4266,\"z\":1303,\"timestamp\":2415869,\"k\":81,\"type\":0},{\"x\":5744,\"y\":3968,\"z\":1550,\"timestamp\":2415970,\"k\":71,\"type\":0},{\"x\":5728,\"y\":3947,\"z\":1549,\"timestamp\":2416201,\"k\":108,\"type\":0},{\"x\":4618,\"y\":2871,\"z\":636,\"timestamp\":2416302,\"k\":105,\"type\":0},{\"x\":3733,\"y\":2285,\"z\":96,\"timestamp\":2416404,\"k\":99,\"type\":0},{\"x\":5444,\"y\":4139,\"z\":1930,\"timestamp\":2416505,\"k\":111,\"type\":0},{\"x\":4222,\"y\":2912,\"z\":769,\"timestamp\":2416605,\"k\":78,\"type\":0},{\"x\":4263,\"y\":2884,\"z\":810,\"timestamp\":2416706,\"k\":115,\"type\":0},{\"x\":4843,\"y\":3410,\"z\":1368,\"timestamp\":2416808,\"k\":86,\"type\":0},{\"x\":4169,\"y\":2700,\"z\":664,\"timestamp\":2416909,\"k\":124,\"type\":0},{\"x\":5868,\"y\":4393,\"z\":2358,\"timestamp\":2417015,\"k\":69,\"type\":0},{\"x\":5595,\"y\":4143,\"z\":2085,\"timestamp\":2417116,\"k\":108,\"type\":0},{\"x\":5058,\"y\":3613,\"z\":1550,\"timestamp\":2417216,\"k\":76,\"type\":0},{\"x\":6238,\"y\":4800,\"z\":2732,\"timestamp\":2417419,\"k\":120,\"type\":0},{\"x\":4433,\"y\":2995,\"z\":927,\"timestamp\":2417527,\"k\":90,\"type\":1},{\"x\":4510,\"y\":1085,\"z\":272,\"timestamp\":2467860,\"k\":80,\"type\":0},{\"x\":5711,\"y\":3149,\"z\":1230,\"timestamp\":2467961,\"k\":79,\"type\":0},{\"x\":5853,\"y\":3432,\"z\":1340,\"timestamp\":2468063,\"k\":105,\"type\":0},{\"x\":7098,\"y\":4726,\"z\":2576,\"timestamp\":2468173,\"k\":83,\"type\":0},{\"x\":6173,\"y\":3812,\"z\":1641,\"timestamp\":2468862,\"k\":104,\"type\":0},{\"x\":8829,\"y\":6988,\"z\":2967,\"timestamp\":2468962,\"k\":90,\"type\":0},{\"x\":9507,\"y\":8304,\"z\":2536,\"timestamp\":2469064,\"k\":81,\"type\":0},{\"x\":8444,\"y\":7472,\"z\":1217,\"timestamp\":2469164,\"k\":70,\"type\":0},{\"x\":11312,\"y\":10392,\"z\":3952,\"timestamp\":2469264,\"k\":66,\"type\":0},{\"x\":10655,\"y\":9712,\"z\":3226,\"timestamp\":2469365,\"k\":110,\"type\":0},{\"x\":11109,\"y\":10160,\"z\":3652,\"timestamp\":2469465,\"k\":85,\"type\":0},{\"x\":11431,\"y\":10482,\"z\":3974,\"timestamp\":2470797,\"k\":116,\"type\":1},{\"x\":6695,\"y\":4343,\"z\":2389,\"timestamp\":2473960,\"k\":74,\"type\":0},{\"x\":4899,\"y\":1990,\"z\":907,\"timestamp\":2474061,\"k\":69,\"type\":0},{\"x\":6841,\"y\":3867,\"z\":3044,\"timestamp\":2474162,\"k\":116,\"type\":0},{\"x\":7505,\"y\":4506,\"z\":3898,\"timestamp\":2474262,\"k\":92,\"type\":0},{\"x\":5399,\"y\":2385,\"z\":1883,\"timestamp\":2474362,\"k\":120,\"type\":0},{\"x\":8048,\"y\":4996,\"z\":4577,\"timestamp\":2474463,\"k\":116,\"type\":0},{\"x\":3937,\"y\":818,\"z\":529,\"timestamp\":2474563,\"k\":93,\"type\":0},{\"x\":3624,\"y\":492,\"z\":255,\"timestamp\":2474664,\"k\":116,\"type\":0},{\"x\":4340,\"y\":1207,\"z\":974,\"timestamp\":2474765,\"k\":123,\"type\":0},{\"x\":7088,\"y\":3955,\"z\":3722,\"timestamp\":2476486,\"k\":60,\"type\":1}]&dm_img_str=V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ&dm_cover_img_str=QU5HTEUgKEludGVsLCBJbnRlbChSKSBBcmMoVE0pIEE3NzAgR3JhcGhpY3MgKDB4MDAwMDU2QTApIERpcmVjdDNEMTEgdnNfNV8wIHBzXzVfMCwgRDNEMTEpR29vZ2xlIEluYy4gKEludGVsKQ&dm_img_inter={\"ds\":[{\"t\":2,\"c\":\"YmlsaS1keW4tcHVibGlzaGluZ19fYWN0aW9uIGxhdW5jaGVyIGRpc2FibG\",\"p\":[2647,49,1519],\"s\":[329,603,810]}],\"wh\":[4972,3284,92],\"of\":[114,228,114]}&w_dyn_req.upload_id=74199115_1739551793_3529&w_dyn_req.meta={\"app_meta\":{\"from\":\"create.dynamic.web\",\"mobi_app\":\"web\"}}"
	s1, err := signAndGenerateURL(s)
	fmt.Println(s1, err)
}

var (
	mixinKeyEncTab = []int{
		46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
		33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
		61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
		36, 20, 34, 44, 52,
	}
	cache          sync.Map
	lastUpdateTime time.Time
)

func main() {
	urlStr := "https://api.bilibili.com/x/space/wbi/acc/info?mid=1850091"
	newUrlStr, err := signAndGenerateURL(urlStr)
	if err != nil {
		fmt.Printf("Error=%s", err)
		return
	}
	req, err := http.NewRequest("GET", newUrlStr, nil)
	if err != nil {
		fmt.Printf("Error=%s", err)
		return
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	req.Header.Set("Referer", "https://www.bilibili.com/")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Printf("Request failed: %s", err)
		return
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("Failed to read response: %s", err)
		return
	}
	fmt.Println(string(body))
}

func signAndGenerateURL(urlStr string) (string, error) {
	urlObj, err := url.Parse(urlStr)
	if err != nil {
		return "", err
	}
	imgKey, subKey := getWbiKeysCached()
	query := urlObj.Query()
	params := map[string]string{}
	for k, v := range query {
		params[k] = v[0]
	}
	newParams := encWbi(params, imgKey, subKey)
	for k, v := range newParams {
		query.Set(k, v)
	}
	urlObj.RawQuery = query.Encode()
	newUrlStr := urlObj.String()
	return newUrlStr, nil
}

func encWbi(params map[string]string, imgKey, subKey string) map[string]string {
	mixinKey := getMixinKey(imgKey + subKey)
	currTime := "1739601221"
	// 	currTime := strconv.FormatInt(time.Now().Unix(), 10)
	params["wts"] = currTime

	// Sort keys
	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	// Remove unwanted characters
	for k, v := range params {
		v = sanitizeString(v)
		params[k] = v
	}

	// Build URL parameters
	query := url.Values{}
	for _, k := range keys {
		query.Set(k, params[k])
	}
	queryStr := query.Encode()

	// Calculate w_rid
	hash := md5.Sum([]byte(queryStr + mixinKey))
	params["w_rid"] = hex.EncodeToString(hash[:])
	return params
}

func getMixinKey(orig string) string {
	var str strings.Builder
	for _, v := range mixinKeyEncTab {
		if v < len(orig) {
			str.WriteByte(orig[v])
		}
	}
	return str.String()[:32]
}

func sanitizeString(s string) string {
	unwantedChars := []string{"!", "'", "(", ")", "*"}
	for _, char := range unwantedChars {
		s = strings.ReplaceAll(s, char, "")
	}
	return s
}

func updateCache() {
	if time.Since(lastUpdateTime).Minutes() < 10 {
		return
	}
	imgKey, subKey := getWbiKeys()
	cache.Store("imgKey", imgKey)
	cache.Store("subKey", subKey)
	lastUpdateTime = time.Now()
}

func getWbiKeysCached() (string, string) {
	updateCache()
	imgKeyI, _ := cache.Load("imgKey")
	subKeyI, _ := cache.Load("subKey")
	return imgKeyI.(string), subKeyI.(string)
}

func getWbiKeys() (string, string) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.bilibili.com/x/web-interface/nav", nil)
	if err != nil {
		fmt.Printf("Error creating request: %s", err)
		return "", ""
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	req.Header.Set("Referer", "https://www.bilibili.com/")
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending request: %s", err)
		return "", ""
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %s", err)
		return "", ""
	}
	json := string(body)
	imgURL := gjson.Get(json, "data.wbi_img.img_url").String()
	subURL := gjson.Get(json, "data.wbi_img.sub_url").String()
	imgKey := strings.Split(strings.Split(imgURL, "/")[len(strings.Split(imgURL, "/"))-1], ".")[0]
	subKey := strings.Split(strings.Split(subURL, "/")[len(strings.Split(subURL, "/"))-1], ".")[0]
	return imgKey, subKey
}
