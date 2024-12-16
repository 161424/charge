package n

import (
	"fmt"
	"os"
	"regexp"
	"strings"
	"testing"
	"time"
)

func TestCutUid(t *testing.T) {
	s := "buvid4=BCBBE5DD-DA08-3323-C879-3B8B4181302D07932-023072221-u3CRc4RDNboKQbEiVxyj1w%3D%3D; header_theme_version=CLOSE; DedeUserID=74199115; DedeUserID__ckMd5=8d1ad2254e14c603; buvid_fp_plain=undefined; enable_web_push=DISABLE; is-2022-channel=1; hit-dyn-v2=1; CURRENT_BLACKGAP=0; FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW; buvid3=10783F3E-F0BB-478C-A9DD-C86A50E920B990117infoc; b_nut=1721570090; _uuid=2E2104DB3-C461-722A-10E5E-49D7B829823C96320infoc; rpdid=|(J~R~kJku|~0J'u~kRY~uk|u; CURRENT_QUALITY=116; PVID=3; home_feed_column=5; browser_resolution=1897-1013; fingerprint=93f22076a6f2434d8f425b61a1b95706; share_source_origin=COPY; bsource=search_bing; SESSDATA=7ebdded7%2C1748864539%2C457c2%2Ac1CjBr5lA4u5_RBj9hhj0rjceY9C5yO58lAhVbdidefQhl5dv3i1aHY1B-f_4iC8weBvkSVkl5OUs2T1lDbTRveHVfYXRLX2lOMmN5MW93Smt6ejVFb2Y4cDNMX3FiM2Q2WndwNkNuc0lpUHRUYkc3c2ZDSlVlbERvdXU5cmstSFY4dWpjS2dxQWNBIIEC; bili_jct=1bc3f227c78efff74c888dfff1b0c0b1; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzM1NzkzMzAsImlhdCI6MTczMzMyMDA3MCwicGx0IjotMX0.zdj1k7XQDt23PGTyiYT1Vtcy6cmdOMbLSvNn2BEMGac; bili_ticket_expires=1733579270; sid=83y1uhc0; buvid_fp=93f22076a6f2434d8f425b61a1b95706; b_lsid=6585EC4A_19399BCF5FC; CURRENT_FNVAL=4048; bp_t_offset_74199115=1007661754991247360"

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
