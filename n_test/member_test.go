package n

import (
	"charge/pkg/common"
	"testing"
)

func TestMember(t *testing.T) {
	//memberSign := &common.MemberSign{}
	//resp, err := os.Open("D:\\编程\\golang\\porject-study\\charge\\data\\memberSign.json")
	//if err != nil {
	//	fmt.Println(err)
	//}
	//buf, _ := io.ReadAll(resp)
	//err = json.Unmarshal(buf, memberSign)
	//if err != nil {
	//	fmt.Println(err)
	//}
	//fmt.Println(memberSign)

	common.MemberRegister(3)
}

func TestMagicRegister(t *testing.T) {
	common.MagicRegister(3)
}
