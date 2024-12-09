package router

import (
	"charge/config"
	"charge/dao/redis"
	"fmt"
	"github.com/gin-gonic/gin"
)

func Run() {
	g := gin.Default()
	g.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	g.GET("/charge/:month", func(c *gin.Context) {

		//buf, _ := io.ReadAll(c.Request.Body)
		//rep := &types.FormReq{}
		//json.Unmarshal(buf, rep)
		key := c.Param("month")
		resp := redis.FindAllCharge(c.Copy(), "charge", key)
		c.JSON(200, resp)
	})

	err := g.Run(config.Cfg.Port)
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

}
