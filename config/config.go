package config

import (
	"fmt"
	"gopkg.in/yaml.v3"
	"io"
	"strings"

	"log"
	"os"
)

type config struct {
	Port  string `yaml:"Port"`
	Redis struct {
		Addr     string `yaml:"Addr"`
		Password string `yaml:"Password"`
	}
	Mongodb struct {
		Addr     string `yaml:"Addr"`
		Password string `yaml:"Password"`
	}
	Cks            []string `yaml:"CKs"`
	User_Agent     string   `yaml:"UserAgent"`
	ChargeUid      []string `yaml:"ChargeUid"`
	LotteryUid     []string `yaml:"LotteryUid"`
	FakeLotteryUid []string `yaml:"FakeLotteryUid"`
	DaleyTime      int64    `yaml:"DaleyTime"`
}

var Cfg = &config{}

func Start() {
	// 读取 YAML 文件
	path, _ := os.Getwd()
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
