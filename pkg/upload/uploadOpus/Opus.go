package uploadOpus

import (
	"charge/inet"
	"math/rand"
	"time"
)

// 默认延迟发送动态
func PushOpus() func() {
	return func() {
		OneDay := 3600 * 20
		for i := 0; i < len(inet.DefaultClient.Cks); i++ {
			randomNumber := rand.Intn(OneDay)
			user := inet.DefaultClient.Cks[i]
			if user.Alive == false {
				continue
			}
			if i == 0 {
				time.Sleep(time.Duration(rand.Intn(randomNumber)) * time.Second)
				go func(idx int) {
					UploadOpus(idx)
				}(i)
			} else {
				rn := rand.Intn(2)
				if rn == 2 {
					time.Sleep(time.Duration(rand.Intn(randomNumber)) * time.Second)
					go func(idx int) {
						UploadOnlyWordOpus(idx)
					}(i)
				}
			}
		}
	}

}
