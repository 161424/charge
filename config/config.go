package config

import (
	"charge/utils"
	"fmt"
	"gopkg.in/yaml.v3"
	"io"
	"log"
	"os"
	"strings"
)

type config struct {
	GIP struct {
		IPV4 string `yaml:"IPV4"`
		IPV6 string `yaml:"IPV6"`
	} `yaml:"GIP"`

	WebPort string `yaml:"WebPort"`
	Redis   Redis  `yaml:"Redis"`
	Mongodb struct {
		IsLocal  bool   `yaml:"IsLocal"`
		Addr     string `yaml:"Addr"`
		Port     string `yaml:"Port"`
		Password string `yaml:"Password"`
	} `yaml:"Mongodb"`
	Refresh bool      `yaml:"Refresh"`
	BUserCk []BUserCk `yaml:"BUserCk"`

	ChargeUid       []string `yaml:"ChargeUid"`
	LotteryUid      []string `yaml:"LotteryUid"`
	FakeLotteryUid  []string `yaml:"FakeLotteryUid"`
	SpecialUid      []string `yaml:"SpecialUid"`
	WebUserAgent    string   `yaml:"WebUserAgent"`
	MobileUserAgent string   `yaml:"MobileUserAgent"`

	DDNS DDNS `yaml:"DDNS"`

	DaleyTime     int64  `yaml:"DaleyTime"`
	Server3       string `yaml:"Server3"`
	BCoinExchange string `yaml:"BCoinExchange"`
	Ql            Ql     `yaml:"Ql"`

	Model string `yaml:"Model"`
}

type Redis struct {
	Addr     string `yaml:"Addr"`
	Port     string `yaml:"Port"`
	Password string `yaml:"Password"`
	Id_rsa   string `yaml:"Id_rsa"`
}

type BUserCk struct {
	Ck         string `yaml:"Ck"`
	Token      string `yaml:"Token"`
	Access_key string `yaml:"Access_key"`
	Group      string `yaml:"Group"`
	Uname      string `yaml:"Uname"`
	Uid        int64  `yaml:"Uid"`
}

type DDNS struct {
	Update      bool   `yaml:"Update"`
	ZoneID      string `yaml:"ZoneID"`
	DnsRecordId string `yaml:"DnsRecordId"`
	ApiToken    string `yaml:"ApiToken"`
	Type        string `yaml:"Type"`
	Name        string `yaml:"Name"`
}

type Ql struct {
	Addr         string `yaml:"Addr"`
	Port         string `yaml:"Port"`
	ClientId     string `yaml:"ClientId"`
	ClientSecret string `yaml:"ClientSecret"`
}

var Cfg = &config{}
var Ps = string(os.PathSeparator)
var Path = ""
var IP = "127.0.0.1"
var Pod = os.Getenv("Pod")

func init() {
	// 读取 YAML 文件
	Read()
}

func Start() {
	if len(Cfg.BUserCk) == 0 {
		panic("BUserCk为无效配置，无法启动服务")
	}
}

func Read() {
	//fmt.Println(Pod)
	Path, _ = os.Getwd()

	npath := strings.Split(Path, Ps)
	if npath[len(npath)-1] != "charge" {
		npath = npath[:len(npath)-1]
	}
	fmt.Println("Path:", Path)
	Path = strings.Join(npath, "/")

	fmt.Println("rootPath:", Path+"/config/config.yaml")
	data, err := os.OpenFile(Path+"/config/config.yaml", os.O_RDWR, 777)
	if err != nil {
		log.Fatalf("读取文件失败: %v", err)
	}
	defer data.Close()
	// 创建一个 Config 实例
	//var config Config
	buf, _ := io.ReadAll(data)
	// 解析 YAML 数据
	err = yaml.Unmarshal(buf, Cfg)
	if err != nil {
		log.Fatalf("解析 YAML 失败: %v", err)
	}
	fmt.Println("config:", Cfg)
	if Cfg.GIP.IPV4 != "" {
		IP = Cfg.GIP.IPV4
	} else if Cfg.GIP.IPV6 != "" {
		IP = "[" + Cfg.GIP.IPV6 + "]"
	}

}

// 有一些bug，在覆盖yaml后，yaml总会多一些重复的内容
func Write() {
	o, err := yaml.Marshal(Cfg)
	data, err := os.OpenFile(Path+"/config/config.yaml", os.O_RDWR|os.O_TRUNC, 777)
	if err != nil {
		log.Fatalf("读取文件失败: %v", err)
	}
	defer data.Close()
	_, err = data.Write(o)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("config保存配置成功")
}

func SetUck(tp string, value, uid string) {
	switch tp {
	case "ck":
		uid = utils.CutUid(value)
		for idx, v := range Cfg.BUserCk {
			if utils.CutUid(v.Ck) == uid {
				Cfg.BUserCk[idx].Ck = value
				break
			}
		}
	case "token":
		for idx, v := range Cfg.BUserCk {
			if utils.CutUid(v.Ck) == uid {
				Cfg.BUserCk[idx].Token = value
				break
			}
		}
	case "access_key":
		for idx, v := range Cfg.BUserCk {
			if utils.CutUid(v.Ck) == uid {
				Cfg.BUserCk[idx].Access_key = value
				break
			}
		}
	case "Group":
		for _, v := range Cfg.BUserCk {
			if utils.CutUid(v.Ck) == uid {
				v.Group = value
				break
			}
		}
	default:
		fmt.Println("tp输入错误，找不到对应关系")
	}
}

func UpdateConfigExample() func() {
	return func() {
		newCfg := &config{}
		newCfg.BUserCk = []BUserCk{}
		o, err := yaml.Marshal(newCfg)
		data, err := os.OpenFile(Path+"/config/config.example.yaml", os.O_RDWR|os.O_TRUNC, 777)
		if err != nil {
			log.Fatalf("读取文件失败: %v", err)
		}
		defer data.Close()
		_, err = data.Write(o)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("config.example保存配置成功")
	}
}
