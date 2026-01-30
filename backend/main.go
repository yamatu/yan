package main

import (
	"backend/config"
	"backend/middleware"
	"backend/routes"
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 加载环境变量
	godotenv.Load()

	// 初始化数据库
	config.InitDB()
	defer config.CloseDB()

	// 初始化Redis（可选）
	config.InitRedis()
	defer config.CloseRedis()

	// 创建Gin路由
	r := gin.Default()
	r.MaxMultipartMemory = 64 << 20

	// 从环境变量获取 CORS 允许的源
	corsOrigins := os.Getenv("CORS_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "http://localhost:3000,http://localhost:3001"
	}
	allowedOrigins := strings.Split(corsOrigins, ",")

	// 配置CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// DB 读写锁（恢复数据库时阻塞其他请求）
	r.Use(middleware.DBReadLock())

	// 设置路由
	routes.SetupRoutes(r)

	// 从环境变量获取端口
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// 启动服务器
	log.Printf("服务器启动在 http://localhost:%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("服务器启动失败:", err)
	}
}
