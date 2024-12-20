package sender

import "charge/sender/server3"

type Monitor struct {
	Title string
	Desp  string
	Tag   string
}

func (m *Monitor) PushS() {
	server3.Push(m.Title, m.Desp, m.Tag)
}

func (m *Monitor) PushQ() {}
