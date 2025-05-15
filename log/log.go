package log

import (
	"fmt"
	"log"
	"os"
)

var Log *log.Logger

func Write(s string, Day string) {
	logName := "log-" + Day + ".md"

	logFile, err := os.OpenFile("./log/logs/"+logName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println(err)
		return
	}
	if logFile == nil {
		return
	}
	defer logFile.Close()
	_, err = logFile.Write([]byte(s))
	if err != nil {
		fmt.Println(err)
		return
	}

}
