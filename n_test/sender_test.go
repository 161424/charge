package n

import (
	"charge/config"
	"charge/sender/server3"
	"testing"
)

func TestMarkdown(t *testing.T) {
	config.Start()
	server3.Push("test", "test", "err")
}
