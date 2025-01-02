package n

import (
	"charge/config"
	"fmt"
	"gopkg.in/yaml.v3"
	"os"
	"regexp"
	"strings"
	"testing"
	"time"
)

func TestCutUid(t *testing.T) {
	s := "" // ck
	re := regexp.MustCompile("DedeUserID=[0-9]+")
	nre := re.FindAllString(s, -1)
	nre = strings.Split(nre[0], "=")
	fmt.Println(nre[1], nre)
	u := make([]time.Time, 3)
	fmt.Println(u)
}

func TestY(t *testing.T) {
	w := k()
	fmt.Println(w, len(w), w == nil)
}

func k() (re []int) {
	return
}

func TestPath(t *testing.T) {
	p, _ := os.Getwd()
	npath := strings.Split(p, "\\")
	fmt.Println(p, npath)
}

func TestTime(t *testing.T) {
	tn := time.Now()
	tw := tn.Format(time.DateOnly)
	fmt.Println(tw, tn)
}

//func TestSleep(t *testing.T) {
//	utils.Sleep(2 * 1000 * time.Millisecond)
//}

func TestConfig(t *testing.T) {
	config.Start()
	fmt.Println(config.Cfg)

	o, err := yaml.Marshal(config.Cfg)
	fmt.Println(string(o), err)
}
