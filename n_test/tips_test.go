package n

import (
	"fmt"
	"sync"
	"testing"
)

type ty struct {
	Name string
	Age  int
}

func TestTips1(t *testing.T) {
	a := []*ty{
		{Name: "1", Age: 1},
		{Name: "2", Age: 2},
	}
	q := sync.Map{}
	b, _ := q.LoadOrStore("1", a)
	c := b.([]*ty)
	c[0].Name = "3"
	d, _ := q.LoadOrStore("1", a)
	fmt.Println(d.([]*ty)[0].Name)

}
