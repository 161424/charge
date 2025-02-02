package log

import (
	"log"
	"os"
)

var Log *log.Logger

func Write(s string, Day string) {
	logName := "log-" + Day + ".md"

	f, err := os.OpenFile(logName, os.O_RDWR, 777)
	if os.IsExist(err) == false {
		err = os.Mkdir(logName, os.ModePerm)
		if err != nil {
			return
		}
		f, err = os.OpenFile(logName, os.O_RDWR, 777)
	} else {
		return
	}
	if f == nil {
		return
	}
	defer f.Close()
	_, err = f.Write([]byte(s))
	if err != nil {
		return
	}

}
