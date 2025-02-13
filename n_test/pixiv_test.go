package n

import (
	"charge/dao/redis"
	"charge/pkg/upload/utils"
	"testing"
)

func TestPixivImgDown(t *testing.T) {
	redis.Start()
	utils.ImageGeneration(0)
}
