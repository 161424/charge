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
	WebPort string `yaml:"WebPort"`

	Redis struct {
		Addr           string `yaml:"Addr"`
		Port           string `yaml:"Port"`
		Password       string `yaml:"Password"`
		IsIpv6         bool   `yaml:"IsIpv6"`
		StaticIpv6Addr string `yaml:"StaticIpv6Addr"`
		DynamicIpv6    string `yaml:"DynamicIpv6"`
		Id_rsa         string `yaml:"Id_rsa"`
	}
	Mongodb struct {
		Addr     string `yaml:"Addr"`
		Password string `yaml:"Password"`
	}

	BUserCk []struct {
		Ck         string `yaml:"Ck"`
		Token      string `yaml:"Token"`
		Access_key string `yaml:"Access_key"`
		Group      string `yaml:"Group"`
	} `yaml:"BUserCk"`

	ChargeUid      []string `yaml:"ChargeUid"`
	LotteryUid     []string `yaml:"LotteryUid"`
	FakeLotteryUid []string `yaml:"FakeLotteryUid"`

	WebUserAgent    string `yaml:"WebUserAgent"`
	MobileUserAgent string `yaml:"MobileUserAgent"`

	DDNS struct {
		ZoneID      string `yaml:"ZoneID"`
		DnsRecordId string `yaml:"DnsRecordId"`
		ApiToken    string `yaml:"ApiToken"`
		Type        string `yaml:"Type"`
		Name        string `yaml:"Name"`
	}

	DaleyTime int64  `yaml:"DaleyTime"`
	Server3   string `yaml:"Server3"`
	Exchange  string `yaml:"Exchange"`
	Model     string `yaml:"Model"`
}

var Cfg = &config{}
var path = ""

func init() {
	// 读取 YAML 文件
	path, _ = os.Getwd()
	npath := strings.Split(path, "\\")
	if npath[len(npath)-1] != "charge" {
		npath = npath[:len(npath)-1]
	}
	path = strings.Join(npath, "/")

	fmt.Println(path)
	data, err := os.OpenFile(path+"/config/config.yaml", os.O_RDWR, 777)
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

	fmt.Println(Cfg)
}

func Start() {
	if len(Cfg.BUserCk) == 0 {
		panic("BUserCk为无效配置，无法启动服务")
	}
}

func Write() {
	o, err := yaml.Marshal(Cfg)
	data, err := os.OpenFile(path+"/config/config.yaml", os.O_RDWR, 777)
	if err != nil {
		log.Fatalf("读取文件失败: %v", err)
	}
	defer data.Close()
	_, err = data.Write(o)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("保存配置成功")

}

func SetUck(tp string, value string) {
	uid := utils.CutUid(value)
	for _, v := range Cfg.BUserCk {
		if utils.CutUid(v.Ck) == uid {
			v.Ck = value
			break
		}
	}
	Write()
}
