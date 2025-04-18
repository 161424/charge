package router

import (
	"charge/config"
	"charge/dao/redis"
	"charge/router/types"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

func Run() {
	g := gin.Default()
	g.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	g.GET("/charge/", func(c *gin.Context) {

		//buf, _ := io.ReadAll(c.Request.Body)
		//rep := &types.FormReq{}
		//json.Unmarshal(buf, rep)
		key := c.DefaultQuery("month", redis.Month)
		ts := c.DefaultQuery("time", time.Now().Format(time.DateOnly))
		page := c.DefaultQuery("page", "1")
		np, _ := strconv.Atoi(page)
		t, _ := time.Parse(time.DateOnly, ts)
		resp := redis.FindTimeCharge(c.Copy(), key, t)

		if l := len(resp); l < 20 { // 每页补全20个
			for i := l; i < 20; i++ {
				resp = append(resp, types.FormResp{})
			}
		}
		rr := resp[20*(np-1) : 20*np]
		for i := 0; i < len(rr); i++ {

		}

		c.JSON(200, rr)
	})
	//fmt.Println(config.Cfg.WebPort)
	//fmt.Println(config.Cfg)
	go func() {
		err := g.Run(config.Cfg.WebPort)
		if err != nil {
			fmt.Println(err)
			panic(err)
		}
	}()

}
