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
	desp := "2025-02-15今日一图\n0. 画师名字：torino；创作时间：2023-07-04；作品id：109595813\n1. 画师名字：luizhtx；创作时间：2023-06-26；作品id：109354938\n2. 画师名字：超凶の狄璐卡；创作时间：2025-02-10；作品id：127076216\n3. 画师名字：chabi009；创作时间：2024-02-22；作品id：116293531\n4. 画师名字：ピー；创作时间：2024-08-26；作品id：121855155\n5. 画师名字：wii；创作时间：2024-02-16；作品id：116122067"
	paths := []string{"torino_お姫様ドレスを着せられる甘雨ちゃん_101553418.jpg", "torino_本当に京都に来た_79564865.jpg", "torino_黒猫彼岸_103399484.jpg", "鸦居_无题_122156399.jpg", "二十二_流萤_119360770.jpg", "狗脸脸dogface_和流萤的约会日记♥_117521539.jpg"}
	uploadOpus.UploadOpu(0, "来拿外卖", desp, paths)
}
