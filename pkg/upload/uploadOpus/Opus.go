package uploadOpus

import (
	"charge/inet"
	"math/rand"
	"time"
)

func PushOpus() func() {
	return func() {
		OneDay := 3600 * 24
		for i := 0; i < len(inet.DefaultClient.Cks); i++ {
			randomNumber := rand.Intn(OneDay)
			user := inet.DefaultClient.Cks[i]
			if user.Alive == false {
				continue
			}
			if i == 0 {
				time.Sleep(time.Duration(rand.Intn(randomNumber)))
				go func(idx int) {
					UploadOpus(idx)
				}(i)
			} else {
				rn := rand.Intn(5)
				if rn == 2 {
					time.Sleep(time.Duration(rand.Intn(randomNumber)))
					go func(idx int) {
						UploadOnlyWordOpus(idx)
					}(i)
				}
			}
		}
	}

}
