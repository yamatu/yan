package controllers

import (
	"backend/cache"
	"backend/config"
	"database/sql"
	"net/http"
	"strings" // New import for string manipulation
	"time"    // New import for time.Time

	"github.com/gin-gonic/gin"
)

// Solution represents a solution entity with SEO fields.
type Solution struct {
	ID              int       `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	ImageURL        string    `json:"image_url"`
	Path            string    `json:"path"`
	MetaTitle       string    `json:"meta_title"`
	MetaDescription string    `json:"meta_description"`
	MetaKeywords    string    `json:"meta_keywords"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// GetSolutions 获取所有解决方案
func GetSolutions(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, title, description, image_url, path, COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(meta_keywords, ''), created_at, updated_at FROM solutions ORDER BY created_at DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var solutions []Solution
	for rows.Next() {
		var solution Solution
		if err := rows.Scan(&solution.ID, &solution.Title, &solution.Description, &solution.ImageURL, &solution.Path, &solution.MetaTitle, &solution.MetaDescription, &solution.MetaKeywords, &solution.CreatedAt, &solution.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		solutions = append(solutions, solution)
	}

	if solutions == nil {
		solutions = []Solution{}
	}

	c.JSON(http.StatusOK, solutions)
}

// GetSolution 获取单个解决方案 (now handles both ID and path/slug)
func GetSolution(c *gin.Context) {
	slug := c.Param("id") // Changed from "id" to "slug" in the diff, but c.Param("id") is still used in routes. Let's assume "id" is the parameter name and it can be an ID or a slug.
	// If the parameter is named "slug" in the route, then c.Param("slug") should be used.
	// For now, keeping c.Param("id") as per original code, but using 'slug' variable name.
	// The diff provided `slug := c.Param("slug")` but the original `GetSolution` used `id := c.Param("id")`.
	// Assuming the route parameter name remains "id" but it can be a slug or an ID.
	// If the route parameter name is changed to "slug", then `c.Param("slug")` should be used.
	// For consistency with the diff's variable name, I'll use `slug` for the parameter value.

	var solution Solution
	err := config.DB.QueryRow("SELECT id, title, description, image_url, path, COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(meta_keywords, ''), created_at, updated_at FROM solutions WHERE path = ? OR id = ?", slug, slug).
		Scan(&solution.ID, &solution.Title, &solution.Description, &solution.ImageURL, &solution.Path, &solution.MetaTitle, &solution.MetaDescription, &solution.MetaKeywords, &solution.CreatedAt, &solution.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Solution not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch solution: " + err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, solution)
}

// CreateSolution 创建解决方案
func CreateSolution(c *gin.Context) {
	var solution Solution
	if err := c.ShouldBindJSON(&solution); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 如果没有提供路径，自动生成基于标题的路径
	if solution.Path == "" {
		solution.Path = strings.ToLower(strings.ReplaceAll(solution.Title, " ", "-"))
	}

	result, err := config.DB.Exec("INSERT INTO solutions (title, description, image_url, path, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?)",
		solution.Title, solution.Description, solution.ImageURL, solution.Path, solution.MetaTitle, solution.MetaDescription, solution.MetaKeywords)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建失败: " + err.Error()})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/solutions*")

	id, _ := result.LastInsertId()
	solution.ID = int(id)

	c.JSON(http.StatusCreated, solution)
}

// UpdateSolution 更新解决方案
func UpdateSolution(c *gin.Context) {
	id := c.Param("id")

	var solution Solution
	if err := c.ShouldBindJSON(&solution); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// The diff removes the automatic path generation for UpdateSolution.
	// If path is meant to be updated, it should be provided in the JSON.

	_, err := config.DB.Exec("UPDATE solutions SET title=?, description=?, image_url=?, path=?, meta_title=?, meta_description=?, meta_keywords=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
		solution.Title, solution.Description, solution.ImageURL, solution.Path, solution.MetaTitle, solution.MetaDescription, solution.MetaKeywords, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败: " + err.Error()})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/solutions*")

	// The diff changes the response to a message.
	c.JSON(http.StatusOK, gin.H{"message": "Solution updated successfully"})
}

// DeleteSolution 删除解决方案
func DeleteSolution(c *gin.Context) {
	id := c.Param("id")

	_, err := config.DB.Exec("DELETE FROM solutions WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/solutions*")

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

// 根据路径获取解决方案
func GetSolutionByPath(c *gin.Context) {
	path := c.Param("path")

	var solution Solution
	err := config.DB.QueryRow("SELECT id, title, description, image_url, path, COALESCE(meta_title, ''), COALESCE(meta_description, ''), COALESCE(meta_keywords, ''), created_at, updated_at FROM solutions WHERE path = ?", path).
		Scan(&solution.ID, &solution.Title, &solution.Description, &solution.ImageURL, &solution.Path, &solution.MetaTitle, &solution.MetaDescription, &solution.MetaKeywords, &solution.CreatedAt, &solution.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Solution not found"})
		return
	}

	c.JSON(http.StatusOK, solution)
}
