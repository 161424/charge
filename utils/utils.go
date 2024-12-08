package utils

import (
	"fmt"
	"math/rand"
	"regexp"
	"strings"
	"time"
)

func Tracker(t time.Time) {
	tm := time.Now()
	fmt.Println(tm.Sub(t))
}

func Shuffle(arr interface{}) {

	if v, ok := arr.([]int); ok == true {
		rand.New(rand.NewSource(time.Now().UnixNano())).Shuffle(len(v), func(i, j int) { v[i], v[j] = v[j], v[i] })
	} else if v, ok := arr.([]string); ok == true {
		rand.New(rand.NewSource(time.Now().UnixNano())).Shuffle(len(v), func(i, j int) { v[i], v[j] = v[j], v[i] })
	}

}

func CutUid(s string) string {
	re := regexp.MustCompile("DedeUserID=[0-9]+")
	nre := re.FindAllString(s, -1)
	nre = strings.Split(nre[0], "=")
	return nre[1]
}
