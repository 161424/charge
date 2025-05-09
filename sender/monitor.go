package sender

import (
	"charge/config"
	"charge/sender/server3"
)

type Monitor struct {
	Title string
	Desp  string
	Tag   string
}

var device = config.GetDevice()

func (m *Monitor) PushS() {
	server3.Push(m.Title, m.Desp, m.Tag, device.Name)
}

func (m *Monitor) PushQ() {}
