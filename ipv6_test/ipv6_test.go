package ipv6_test

import (
	"fmt"
	"net"
	"net/http"
	"testing"
)

func TestLink(t *testing.T) {
	conn, err := net.Dial("ip6:ipv6-icmp", "2408:8726:1001:182::4b")
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	fmt.Println("?")
	buf := make([]byte, 1024)
	n, err := conn.Read(buf)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(n, string(buf[:n]))

	// right
	//req, err := http.NewRequest(http.MethodGet, "http://[2402:4e00:1013:e500:0:9671:f018:4947]", nil)
	//if err != nil {
	//	panic(err)
	//}
	//fmt.Println(req)
	//resp, err := http.DefaultClient.Do(req)
	//if err != nil {
	//	panic(err)
	//}
	//defer resp.Body.Close()
	//body, err := io.ReadAll(resp.Body)
	//fmt.Println(string(body))

}

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
