package controllers

import (
	"backend/cache"
	"backend/config"
	"net/http"
	"strings" // Added for string manipulation in path generation
	"time"    // Added for time.Time in Blog struct

	"github.com/gin-gonic/gin"
)

// Define the Blog struct here as it's used by multiple functions in this package.
// The original code used `models.Blog`, but the instruction provides a new struct definition.
type Blog struct {
	ID              int       `json:"id"`
	Title           string    `json:"title"`
	Summary         string    `json:"summary"`
	Content         string    `json:"content"`
	Path            string    `json:"path"`
	MetaTitle       string    `json:"meta_title"`
	MetaDescription string    `json:"meta_description"`
	MetaKeywords    string    `json:"meta_keywords"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// 获取所有博客
func GetBlogs(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, title, summary, content, path, COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(meta_keywords, ''), created_at, updated_at FROM blogs ORDER BY created_at DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var blogs []Blog
	for rows.Next() {
		var blog Blog
		if err := rows.Scan(&blog.ID, &blog.Title, &blog.Summary, &blog.Content, &blog.Path, &blog.MetaTitle, &blog.MetaDescription, &blog.MetaKeywords, &blog.CreatedAt, &blog.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		blogs = append(blogs, blog)
	}

	c.JSON(http.StatusOK, blogs)
}

// 获取单个博客
func GetBlog(c *gin.Context) {
	slug := c.Param("slug")
	var blog Blog
	err := config.DB.QueryRow("SELECT id, title, summary, content, path, COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(meta_keywords, ''), created_at, updated_at FROM blogs WHERE path = ? OR id = ?", slug, slug).Scan(&blog.ID, &blog.Title, &blog.Summary, &blog.Content, &blog.Path, &blog.MetaTitle, &blog.MetaDescription, &blog.MetaKeywords, &blog.CreatedAt, &blog.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		return
	}

	c.JSON(http.StatusOK, blog)
}

// 创建博客（需要管理员权限）
func CreateBlog(c *gin.Context) {
	var blog Blog
	if err := c.ShouldBindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate path from title if empty
	if blog.Path == "" {
		blog.Path = strings.ToLower(strings.ReplaceAll(blog.Title, " ", "-"))
	}

	result, err := config.DB.Exec("INSERT INTO blogs (title, summary, content, path, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?)",
		blog.Title, blog.Summary, blog.Content, blog.Path, blog.MetaTitle, blog.MetaDescription, blog.MetaKeywords)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/blogs*")

	id, _ := result.LastInsertId()
	blog.ID = int(id)
	c.JSON(http.StatusCreated, blog)
}

// 更新博客（需要管理员权限）
func UpdateBlog(c *gin.Context) {
	id := c.Param("id")
	var blog Blog
	if err := c.ShouldBindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If path is empty, generate from title (if title is provided)
	if blog.Path == "" && blog.Title != "" {
		blog.Path = strings.ToLower(strings.ReplaceAll(blog.Title, " ", "-"))
	}

	_, err := config.DB.Exec("UPDATE blogs SET title=?, summary=?, content=?, path=?, meta_title=?, meta_description=?, meta_keywords=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
		blog.Title, blog.Summary, blog.Content, blog.Path, blog.MetaTitle, blog.MetaDescription, blog.MetaKeywords, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/blogs*")

	c.JSON(http.StatusOK, gin.H{"message": "Blog updated successfully"})
}

// 删除博客（需要管理员权限）
func DeleteBlog(c *gin.Context) {
	id := c.Param("id")

	_, err := config.DB.Exec("DELETE FROM blogs WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/blogs*")

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

// 根据路径获取博客
func GetBlogByPath(c *gin.Context) {
	path := c.Param("path")

	var blog Blog
	err := config.DB.QueryRow("SELECT id, title, summary, content, path, COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(meta_keywords, ''), created_at, updated_at FROM blogs WHERE path = ?", path).
		Scan(&blog.ID, &blog.Title, &blog.Summary, &blog.Content, &blog.Path, &blog.MetaTitle, &blog.MetaDescription, &blog.MetaKeywords, &blog.CreatedAt, &blog.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		return
	}

	c.JSON(http.StatusOK, blog)
}
