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
	fmt.Println("Run time:", tm.Sub(t))
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
	if !strings.Contains(nre[0], "=") {
		return ""
	}
	nre = strings.Split(nre[0], "=")
	return nre[1]
}

func CutCsrf(s string) string {
	re := regexp.MustCompile("bili_jct=[0-9a-z]{32}")
	nre := re.FindAllString(s, -1)
	if len(nre) == 0 {
		return ""
	}
	nre = strings.Split(nre[0], "=")
	return nre[1]
}

func RandomStr(num int, toLow bool) string {
	chars := "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	var result string
	for i := 0; i < num; i++ {
		result += string(chars[rand.Intn(len(chars))])
	}
	if toLow == true {
		return strings.ToLower(result)
	}
	return result
}

func RandomNum(num int) string {
	chars := "1234567890"
	var result string
	for i := 0; i < num; i++ {
		result += string(chars[rand.Intn(len(chars))])
	}
	return result
}

// 只能睡眠整数秒，放弃
//func Sleep(t time.Duration) {
//	rand.Seed(time.Now().Unix()) //Seed生成的随机数
//	d := float64(1500+rand.Intn(1000)) / float64(2000)
//	fmt.Println(d, t)
//	fmt.Printf("Sleep %v seconds\n", time.Duration(d)*t)
//	time.Sleep(2 * t)
//
//}
