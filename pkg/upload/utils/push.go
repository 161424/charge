package utils

import (
	"bytes"
	"charge/config"
	"charge/inet"
	utils2 "charge/utils"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"strings"
	"time"
)

type UploadPic struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		ImageUrl    string `json:"image_url"`
		ImageWidth  int    `json:"image_width"`
		ImageHeight int    `json:"image_height"`
	} `json:"data"`
}

func UploadImg(paths []string, idx int, uname string) (imgUrl []string) {
	// 图片上传模块
	// 添加文件字段
	for _, path := range paths {
		var requestBody bytes.Buffer
		// 创建一个multipart写入器
		writer := multipart.NewWriter(&requestBody)
		boundary := "----WebKitFormBoundaryQzAGnEEgsgtgDTcN"

		// 设置自定义边界值
		err := writer.SetBoundary(boundary)
		if err != nil {
			fmt.Println("设置边界值失败:", err)
			return
		}
		fileName := path
		file, err := os.Open(config.Path + fmt.Sprintf("/pkg/upload/picture/%s/", uname) + fileName)

		if err != nil {
			fmt.Println("Error opening file:", err)
			return
		}
		defer file.Close()

		part, err := writer.CreateFormFile("file_up", fileName)
		if err != nil {
			fmt.Println("Error creating form file:", err)
			return
		}

		_, err = io.Copy(part, file)
		if err != nil {
			fmt.Println("Error copying file content:", err)
			return
		}
		// 添加普通字段
		_ = writer.WriteField("biz", "new_dyn")
		err = writer.WriteField("category", "daily")
		if err != nil {
			fmt.Println("Error writing field:", err)
			return
		}
		err = writer.WriteField("csrf", inet.DefaultClient.Cks[idx].Csrf)
		if err != nil {
			fmt.Println("Error writing field:", err)
			return
		}
		// 关闭multipart写入器，完成表单数据的构建
		err = writer.Close()
		if err != nil {
			fmt.Println("Error closing writer:", err)
			return
		}
		url := "https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs" // 上传图片
		resp := inet.DefaultClient.CheckSelectPost(url, "multipart/form-data; boundary=----WebKitFormBoundaryQzAGnEEgsgtgDTcN", "", "", idx, &requestBody)
		uploadPic := UploadPic{}
		err = json.Unmarshal(resp, &uploadPic)
		if err != nil {
			fmt.Println("Error unmarshalling upload pic:", err)
			return
		}
		if uploadPic.Code != 0 {
			fmt.Println("Error upload pic:", uploadPic.Message)
			return
		}
		imgUrl = append(imgUrl, uploadPic.Data.ImageUrl)
	}
	return
}

func UploadOpus(idx, types int, uname, desp string, paths []string) {

	imgUrl := UploadImg(paths, idx, uname)
	time.Sleep(10 * time.Second)
	dyns := Dyn_Reqs{}
	dyn := Dyn_Req{}

	if types == 1 {
		dyn.Content.Contents = []struct {
			RawText string `json:"raw_text"`
			Type    int    `json:"type"`
			BizId   string `json:"biz_id"`
		}{{desp, 1, ""}}
		dyn.Scene = 1
	} else {
		dyn.Content.Title = "今日一图"
		dyn.Content.Contents = []struct {
			RawText string `json:"raw_text"`
			Type    int    `json:"type"`
			BizId   string `json:"biz_id"`
		}{{fmt.Sprintf("%s今日一图\n%s", time.Now().Format(time.DateOnly), desp), 1, ""}}
		Pics := []pics{}
		for _, iurl := range imgUrl {
			Pic := pics{
				ImgSrc: iurl,
			}
			Pics = append(Pics, Pic)
		}
		dyn.Pics = Pics
		dyn.Scene = 2
	}

	dyn.App_meta.From = "create.dynamic.web"
	dyn.App_meta.Mobi_app = "web"

	dyns.Dyn = dyn
	var s, _ = json.Marshal(dyn)
	jsonStr := string(s)
	// 文字模板
	fmt.Println(jsonStr)
	wts := time.Now().Unix()
	url := fmt.Sprintf("https://api.bilibili.com/x/dynamic/feed/create/submit_check?csrf=%s&wts=%d", inet.DefaultClient.Cks[idx].Csrf, wts)

	upload_id := fmt.Sprintf("%s_%d_%s", inet.DefaultClient.Cks[idx].Uid, time.Now().Unix(), utils2.RandomNum(4))
	uploadCreateResp := UploadCreateResp{}
	resp := inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, strings.NewReader(jsonStr))
	err := json.Unmarshal(resp, &uploadCreateResp)
	if err != nil {
		fmt.Println("Error unmarshalling upload create resp:", err)
		return
	}
	// 返回data固定为空
	if uploadCreateResp.Code != 0 {
		fmt.Println("Error upload create resp:", uploadCreateResp.Message)
		return
	}

	dyn.Upload_id = upload_id
	s, _ = json.Marshal(dyns)
	jsonStr = string(s)
	url = fmt.Sprintf("https://api.bilibili.com/x/dynamic/feed/create/dyn?csrf=%s&wts=%d", inet.DefaultClient.Cks[idx].Csrf, wts)

	resp = inet.DefaultClient.CheckSelectPost(url, "", "", "", idx, strings.NewReader(jsonStr))
	err = json.Unmarshal(resp, &uploadCreateResp)
	if err != nil {
		fmt.Println("Error unmarshalling upload create resp:", err)
		return
	}
	if uploadCreateResp.Code != 0 {
		fmt.Println("Error upload create resp:", uploadCreateResp.Message)
		return
	}
	fmt.Println(uploadCreateResp, string(resp))

}
