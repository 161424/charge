package utils

type Dyn_Reqs struct {
	Dyn Dyn_Req `json:"dyn_req"`
}

type Dyn_Req struct {
	Content struct {
		Contents []struct {
			RawText string `json:"raw_text"`
			Type    int    `json:"type"`
			BizId   string `json:"biz_id"`
		} `json:"contents"`
		Title string `json:"title"`
	} `json:"content"`
	Pics       []pics      `json:"pics"`
	AttachCard interface{} `json:"attach_card"`
	Option     struct {
		Pic_mode int `json:"pic_mode"`
	} `json:"option"`
	Scene int `json:"scene"`

	App_meta struct {
		From     string `json:"from"`
		Mobi_app string `json:"mobi_app"`
	} `json:"app_meta"`
	Upload_id string `json:"upload_id"`
}

type pics struct {
	ImgSrc string `json:"img_src"`
}

type UploadCreateResp struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Ttl     int    `json:"ttl"`
	Data    struct {
		DynId    int64  `json:"dyn_id"`
		DynIdStr string `json:"dyn_id_str"`
		DynType  int    `json:"dyn_type"`
		DynRid   int    `json:"dyn_rid"`
	} `json:"data"`
}
