package uploadOpus

import (
	"charge/inet"
	"charge/pkg/upload/utils"
	"fmt"
)

func UploadOpus(idx int) {
	fmt.Println(inet.DefaultClient.Cks[idx].Csrf)
	uname := inet.DefaultClient.Cks[idx].Uname
	uname = "来拿外卖"
	desp, paths := utils.ImageGeneration(uname)
	utils.UploadOpus(idx, 2, uname, desp, paths)
}
