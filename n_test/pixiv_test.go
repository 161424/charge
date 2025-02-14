package n

import (
	"charge/dao/redis"
	"charge/inet"
	"charge/pkg/upload/uploadOpus"
	"charge/pkg/upload/utils"
	"testing"
)

func TestPixivImgDown(t *testing.T) {
	redis.Start()
	inet.DefaultClient.CheckCkAlive(true)
	utils.ImageGeneration("来拿外卖")
}

func TestPixivImgOpus(t *testing.T) {
	redis.Start()
	inet.DefaultClient.ReFresh(true)
	uploadOpus.UploadOpus(0)
}
