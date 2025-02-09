package n

import (
	"charge/config"
	"context"
	"fmt"
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
	tp := []string{"ck", "token", "access_key", "Group"}
	uid := "DedeUserID=349869794;AAAAAAA"
	//for i := 0; i < 10; i++ {
	//	for j := 0; j < len(tp); j++ {
	//		config.SetUck(tp[j], uid, uid)
	//	}
	//}
	j := 0
	config.SetUck(tp[j], uid, uid)

}

func TestVVV(t *testing.T) {
	HttpHandler()
}

func NewContextWithTimeout() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 3*time.Second)
}

func HttpHandler() {
	ctx, cancel := NewContextWithTimeout()
	defer cancel()
	deal(ctx)
}

func deal(ctx context.Context) {
	for i := 0; i < 10; i++ {
		time.Sleep(5 * time.Second)
		select {
		case <-ctx.Done():
			fmt.Println(ctx.Err())
			return
		default:
			fmt.Printf("deal time is %d\n", i)
		}
	}
}
