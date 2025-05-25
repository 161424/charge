package main

import (
	"charge/server"
)

func main() {
	server.Start()
	server.Run()
	defer server.Stop()

}
