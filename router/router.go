package router

import (
	"charge/config"
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

	g.POST("/from", func(c *gin.Context) {
		rep := &types.FormReq{}
		buf, _ := io.ReadAll(c.Request.Body)
		json.Unmarshal(buf, rep)
		resp := types.FormResp{}
		c.JSON(200, resp)
	})

	err := g.Run(config.Cfg.Port)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

}
