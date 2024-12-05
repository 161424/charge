package main

import (
	"charge/server"
	"fmt"
)

func main() {
	server.Start()
	if err := server.Run(); err != nil {
		fmt.Println(err)
		panic(err)
	}
	defer server.Stop()

}
