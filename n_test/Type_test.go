package n

import (
	"encoding/json"
	"fmt"
	"testing"
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
