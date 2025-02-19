package uploadOpus

import (
	"charge/inet"
	"charge/pkg/upload/utils"
)

func UploadOpus(idx int) {
	uname := inet.DefaultClient.Cks[idx].Uname
	desp, paths := utils.ImageGeneration(uname)
	utils.UploadOpus(idx, 2, uname, desp, paths)
}
