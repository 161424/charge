package sender

import (
	"charge/config"
	"charge/sender/server3"
	"fmt"
)

type Monitor struct {
	Title string
	Desp  string
	Tag   string
}

var device = config.GetDevice()

func (m *Monitor) PushS() {
	title := fmt.Sprintf("[%s]-%s", device.Name, m.Title)
	server3.Push(title, m.Desp, m.Tag)
}

func (m *Monitor) PushQ() {}
