package n

import (
	s "charge/sender"
	"charge/sender/server3"
	"testing"
)

func TestMarkdown(t *testing.T) {
	server3.Push("test", "test", "err")
}

func TestPush3(t *testing.T) {
	mo := &s.Monitor{
		Title: "title",
		Desp:  "desp",
		Tag:   "tag",
	}
	mo.PushS()
}
