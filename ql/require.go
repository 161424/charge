package ql


var clientId = G_NnpUwLV8dq
var clientSecret = y112y2WwJwsIFx_78L_ExtRs

type QlClient struct {
	Client      *http.Client
	ClientId    string
	ClientSecret string
}

var QlClient = Client{}
func init() {
	&http.Client{
		Transport: &http.Transport{
			IdleConnTimeout: 30 * time.Second,
		},
	}
}

func LinkQl() {

}

