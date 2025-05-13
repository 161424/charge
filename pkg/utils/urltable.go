package utils

import "net/http"

type urls struct {
	Url         string
	Method      string
	ContentType string
	Body        string
}

var UrlTable = &urlTable{}

type urlTable struct {
	OpusLike  urls
	VideoLike urls
}

func init() {
	UrlTable.OpusLike = urls{
		Url:         "https://api.bilibili.com/x/dynamic/feed/dyn/thumb?csrf=%s",
		Method:      http.MethodPost,
		ContentType: "application/json",
		Body:        `{"dyn_id_str":"%s","up":1,"spmid":"333.1369.0.0","from_spmid":"333.337.0.0"}`,
	}
	UrlTable.VideoLike = urls{
		Url:         "https://api.bilibili.com/x/web-interface/archive/like",
		Method:      http.MethodPost,
		ContentType: "application/x-www-form-urlencoded",
		Body:        `aid=%s&like=1&from_spmid=333.934.0.0&spmid=333.788.0.0&statistics=%7B%22appId%22%3A100%2C%22platform%22%3A5%7D&eab_x=2&ramval=0&source=web_normal&ga=1&csrf=%s`,
	}
}
