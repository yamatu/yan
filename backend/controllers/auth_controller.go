package controllers

import (
	"backend/config"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key-change-this-in-production")

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type UpdateCredentialsRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewUsername     string `json:"new_username" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
}

// 管理员登录
func AdminLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	// 查询管理员
	var password string
	err := config.DB.QueryRow("SELECT password FROM admins WHERE username = ?", req.Username).Scan(&password)
	if err != nil || password != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或密码错误"})
		return
	}

	// 生成JWT token
	claims := Claims{
		Username: req.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成token失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"username": req.Username,
	})
}

// 更新管理员账号和密码（需要已登录）
func UpdateAdminCredentials(c *gin.Context) {
	usernameVal, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未找到登录信息"})
		return
	}
	currentUsername, ok := usernameVal.(string)
	if !ok || currentUsername == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的登录信息"})
		return
	}

	var req UpdateCredentialsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

	// 查询当前管理员密码
	var storedPassword string
	err := config.DB.QueryRow("SELECT password FROM admins WHERE username = ?", currentUsername).Scan(&storedPassword)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "管理员不存在或登录已失效"})
		return
	}

	if storedPassword != req.CurrentPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "当前密码不正确"})
		return
	}

	// 更新用户名和密码
	_, err = config.DB.Exec("UPDATE admins SET username = ?, password = ? WHERE username = ?",
		req.NewUsername, req.NewPassword, currentUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新管理员信息失败: " + err.Error()})
		return
	}

	// 使用新的用户名生成新的 token
	claims := Claims{
		Username: req.NewUsername,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成新的token失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "管理员账号信息已更新",
		"token":    tokenString,
		"username": req.NewUsername,
	})
}

// 验证JWT中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未提供token"})
			c.Abort()
			return
		}

		// 移除 "Bearer " 前缀
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token格式错误"})
			c.Abort()
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// 验证签名方法
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("无效的签名方法: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token解析失败: " + err.Error()})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的token"})
			c.Abort()
			return
		}

		c.Set("username", claims.Username)
		c.Next()
	}
}
