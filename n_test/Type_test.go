package n

import (
	"encoding/json"
	"fmt"
	"testing"
	"time"
)

type U struct {
	Name string
	Age  int
}

func TestType(t *testing.T) {
	u1 := U{
		"chen", 2,
	}
	buf, err := json.Marshal(u1)
	fmt.Println(string(buf), err)
}

func TestTimeMinute(t *testing.T) {
	fmt.Println(time.Now().Minute() + time.Now().Hour()*60)
}

func TestFloat(t *testing.T) {
	a := 3
	b := 2
	fmt.Println(float64(a) / float64(b))
}
