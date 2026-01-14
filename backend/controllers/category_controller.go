package controllers

import (
	"backend/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Category struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Slug      string `json:"slug"`
	Icon      string `json:"icon"`
	Color     string `json:"color"`
	Count     int    `json:"count"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// 获取所有分类
func GetCategories(c *gin.Context) {
	// 查询分类及其关联的文章数量
	query := `
		SELECT 
			c.id, c.name, c.slug, c.icon, c.color, c.created_at, c.updated_at,
			(SELECT COUNT(*) FROM blog_category_relations bcr WHERE bcr.category_id = c.id) as count
		FROM blog_categories c
		ORDER BY c.sort_order ASC, c.created_at DESC
	`

	// SQLite doesn't have sort_order in our schema yet, let's fix the query
	query = `
		SELECT 
			c.id, c.name, c.slug, c.icon, c.color, c.created_at, c.updated_at,
			(SELECT COUNT(*) FROM blog_category_relations bcr WHERE bcr.category_id = c.id) as count
		FROM blog_categories c
		ORDER BY c.id ASC
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询分类失败: " + err.Error()})
		return
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var cat Category
		err := rows.Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.Icon, &cat.Color, &cat.CreatedAt, &cat.UpdatedAt, &cat.Count)
		if err != nil {
			continue
		}
		categories = append(categories, cat)
	}

	if categories == nil {
		categories = []Category{}
	}

	c.JSON(http.StatusOK, categories)
}

// 获取单个分类
func GetCategory(c *gin.Context) {
	id := c.Param("id")

	var cat Category
	query := `
		SELECT 
			c.id, c.name, c.slug, c.icon, c.color, c.created_at, c.updated_at,
			(SELECT COUNT(*) FROM blog_category_relations bcr WHERE bcr.category_id = c.id) as count
		FROM blog_categories c
		WHERE c.id = ?
	`

	err := config.DB.QueryRow(query, id).Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.Icon, &cat.Color, &cat.CreatedAt, &cat.UpdatedAt, &cat.Count)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "分类不存在"})
		return
	}

	c.JSON(http.StatusOK, cat)
}
