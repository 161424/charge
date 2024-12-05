package router

import (
	"charge/config"
	"charge/dao/redis"
	"charge/router/types"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
)

func Run() {
	g := gin.Default()
	g.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	g.POST("/charge", func(c *gin.Context) {
		buf, _ := io.ReadAll(c.Request.Body)
		rep := &types.FormReq{}
		json.Unmarshal(buf, rep)
		resp := redis.FindAllCharge(c.Copy(), rep.Key)
		c.JSON(200, resp)
	})

	err := g.Run(config.Cfg.Port)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

}
