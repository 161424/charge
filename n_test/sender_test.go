package n

import (
	"charge/config"
	s "charge/sender"
	"charge/sender/server3"
	"testing"
)

func TestMarkdown(t *testing.T) {
	config.Start()
	server3.Push("test", "test", "err")
}

func TestPush3(t *testing.T) {
	config.Start()
	mo := &s.Monitor{
		Title: "title",
		Desp:  "desp",
		Tag:   "tag",
	}
	mo.PushS()
}
