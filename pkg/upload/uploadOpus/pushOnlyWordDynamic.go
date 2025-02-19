package uploadOpus

import (
	"charge/config"
	"charge/pkg/upload/utils"
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
)

type Sentence struct {
	Id         int         `json:"id"`
	Uuid       string      `json:"uuid"`
	Hitokoto   string      `json:"hitokoto"`
	Type       string      `json:"type"`
	From       string      `json:"from"`
	FromWho    interface{} `json:"from_who"`
	Creator    string      `json:"creator"`
	CreatorUid int         `json:"creator_uid"`
	Reviewer   int         `json:"reviewer"`
	CommitFrom string      `json:"commit_from"`
	CreatedAt  string      `json:"created_at"`
	Length     int         `json:"length"`
}

type SimpleDyn_Req struct {
	Dynamic_id int    `json:"dynamic_id"`
	Type       int    `json:"type"`
	Rid        int    `json:"rid"`
	Content    string `json:"content"`
}

func ReadSentence() (string, string) {
	randomNumber := rand.Intn(12)
	path := config.Path + "/pkg/upload/sentences/%s.json"
	path = fmt.Sprintf(path, string('a'+randomNumber))
	f, _ := os.Open(path)
	defer f.Close()
	sentences := &[]Sentence{}
	err := json.NewDecoder(f).Decode(sentences)
	if err != nil {
		fmt.Println(err)
		return "", ""
	}
	n := len(*sentences)
	randomNumber = rand.Intn(n)
	sentence := (*sentences)[randomNumber]
	return sentence.Hitokoto, sentence.From
}

func UploadOnlyWordOpus(idx int) {
	content, from := ReadSentence()
	content = fmt.Sprintf("%s\n                                --%s", content, from)
	utils.UploadOpus(idx, 1, "", content, []string{})
	//dyn := SimpleDyn_Req{}
	//dyn.Type = 4
	//dyn.Content = content
	//var s, _ = json.Marshal(dyn)
	//jsonStr := string(s)
	//// 文字模板
	//
	//url := "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create"
	//
	//uploadCreateResp := utils.UploadCreateResp{}
	//resp := inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, strings.NewReader(jsonStr))
	//err := json.Unmarshal(resp, &uploadCreateResp)
	//if err != nil {
	//	fmt.Println("Error unmarshalling upload create resp:", err)
	//	return
	//}
	//if uploadCreateResp.Code != 0 {
	//	fmt.Println("Error upload create resp:", uploadCreateResp.Message)
	//	return
	//}
	//fmt.Println(uploadCreateResp, string(resp))
}
