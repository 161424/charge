package config

import (
	"fmt"
	"gopkg.in/yaml.v3"
	"io"

	"log"
	"os"
)

type config struct {
	Port  string `yaml:"port"`
	Redis struct {
		Addr     string `yaml:"addr"`
		Password string `yaml:"password"`
	}
	Mongodb struct {
		Addr     string `yaml:"addr"`
		Password string `yaml:"password"`
	}
	Cks        []string `yaml:"CKs"`
	User_Agent string   `yaml:"UserAgent"`
	ChargeUid  []string `yaml:"ChargeUid"`
}

var Cfg = &config{}

func Start() {
	// 读取 YAML 文件
	data, err := os.OpenFile("D:\\编程\\golang\\porject-study\\charge\\config\\config.yaml", os.O_RDWR, 777)
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
