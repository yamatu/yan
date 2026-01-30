package routes

import (
	"backend/controllers"
	"backend/middleware"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// 公开 GET 接口缓存（Redis 可选）
		ttlSeconds := 300
		if v := os.Getenv("CACHE_TTL_SECONDS"); v != "" {
			if parsed, err := strconv.Atoi(v); err == nil && parsed > 0 {
				ttlSeconds = parsed
			}
		}
		api.Use(middleware.CachePublicGetResponses(time.Duration(ttlSeconds)*time.Second, 1024*1024))

		// 公开接口
		api.GET("/blogs", controllers.GetBlogs)
		api.GET("/blogs/:id", controllers.GetBlog)
		api.GET("/blogs/by-path/:path", controllers.GetBlogByPath)
		api.GET("/carousels", controllers.GetCarousels)

		// 解决方案接口
		api.GET("/solutions", controllers.GetSolutions)
		api.GET("/solutions/:id", controllers.GetSolution)
		api.GET("/solutions/by-path/:path", controllers.GetSolutionByPath)

		// 联系表单接口
		api.POST("/contact", controllers.CreateContact)

		// 博客分类接口
		api.GET("/categories", controllers.GetCategories)
		api.GET("/categories/:id", controllers.GetCategory)

		// 社交媒体链接接口
		api.GET("/social-links", controllers.GetSocialLinks)

		// 管理员登录
		api.POST("/admin/login", controllers.AdminLogin)

		// 需要认证的管理员接口
		admin := api.Group("/admin")
		admin.Use(controllers.AuthMiddleware())
		{
			// 数据库备份/恢复
			admin.GET("/db/backup", controllers.BackupDatabase)
			admin.POST("/db/restore", controllers.RestoreDatabase)

			// 管理员账号管理
			admin.PUT("/credentials", controllers.UpdateAdminCredentials)

			// 博客管理
			admin.POST("/blogs", controllers.CreateBlog)
			admin.PUT("/blogs/:id", controllers.UpdateBlog)
			admin.DELETE("/blogs/:id", controllers.DeleteBlog)

			// 解决方案管理
			admin.POST("/solutions", controllers.CreateSolution)
			admin.PUT("/solutions/:id", controllers.UpdateSolution)
			admin.DELETE("/solutions/:id", controllers.DeleteSolution)

			// 联系请求管理
			admin.GET("/contacts", controllers.GetContacts)
			admin.DELETE("/contacts/:id", controllers.DeleteContact)

			// 首页轮播图管理
			admin.POST("/carousels", controllers.CreateCarousel)
			admin.PUT("/carousels/:id", controllers.UpdateCarousel)
			admin.DELETE("/carousels/:id", controllers.DeleteCarousel)

			// 社交媒体链接管理
			admin.POST("/social-links", controllers.CreateSocialLink)
			admin.PUT("/social-links/:id", controllers.UpdateSocialLink)
			admin.DELETE("/social-links/:id", controllers.DeleteSocialLink)
		}
	}
}
