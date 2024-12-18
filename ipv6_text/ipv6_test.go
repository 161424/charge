package ipv6_text

import (
	"fmt"
	"net"
	"net/http"
	"testing"
)

type helloHandler struct{}

func (h *helloHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, world!"))
}

func TestI6(t *testing.T) {
	var err error
	http.Handle("/", &helloHandler{})
	//err = http.ListenAndServe(":8083", nil) // IPv4 或 IPv6
	//err = http.ListenAndServe("[2604:180:3:dd3::276e]:8083", nil) // 具体指定，仅 IPv6
	err = ListenAndServe("[2409:8a44:4b12:c6e0:69ec:d9ee:89b:7878]:8083", nil) // 重构的 ListenAndServe 函数
	if err != nil {
		fmt.Println(err)
	}

}

type tcpKeepAliveListener struct {
	*net.TCPListener
}

func ListenAndServe(addr string, handler http.Handler) error {
	srv := &http.Server{Addr: addr, Handler: handler}
	addr = srv.Addr
	if addr == "" {
		addr = ":http"
	}
	ln, err := net.Listen("tcp", addr) // 仅指定 IPv6
	if err != nil {
		return err
	}
	return srv.Serve(tcpKeepAliveListener{ln.(*net.TCPListener)})
}
