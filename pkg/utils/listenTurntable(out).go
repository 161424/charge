package utils

import (
	"charge/inet"
	"charge/utils"
	"encoding/json"
	"fmt"
)

type T struct {
	Name string `json:"name"`
	Sid  string `json:"sid"`
	Url  string `json:"url"`
	Ts   int    `json:"ts"`

	Business    string `json:"business"`
	TaskId      string `json:"taskId"`
	Action_type int
}

func ListenTurnTable() []T {
	url := "http://flyx.fun:1369/sync/new_activities"
	var t []T
	resp := inet.DefaultClient.Http("GET", url, "", nil)
	err := json.Unmarshal(resp, &t)
	if err != nil {
		fmt.Printf(utils.ErrMsg["json"], err.Error(), string(resp))
		return nil
	}
	return t

}
