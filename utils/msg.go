package utils

var ContentType = map[string]string{
	"x":    "application/x-www-form-urlencoded",
	"json": "application/json",
}

var ErrMsg = map[string]string{
	"json": "函数【%s】json解析错误，应该是参数出现了问题。错误信息:%s，返回数据：%s\n",
	"code": "执行【%s】失败，错误代码：%d，错误信息：%s\n",
}
