package utils

import "charge/sender/server3"

type User struct {
	Id       int64
	UserName string
	UserId   int64
	UFans    string
	Weight   int64
}

type Monitor struct {
	Title string
	Desp  string
	Tag   string
}

func (m *Monitor) PushS() {
	server3.Push(m.Title, m.Desp, m.Tag)
}

func (m *Monitor) PushQ() {}
