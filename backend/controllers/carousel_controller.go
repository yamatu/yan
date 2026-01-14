package controllers

import (
	"backend/config"
	"backend/models"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetCarousels 获取轮播图（可按 position 过滤，按排序和创建时间倒序）
func GetCarousels(c *gin.Context) {
	position := c.Query("position")

	var (
		rows *sql.Rows
		err  error
	)

	// 注意：SQL 里增加 rotation 字段，需确保数据库表 carousels 已有该列
	if position != "" {
		rows, err = config.DB.Query(`
			SELECT id, title, image_url, alt_text, description, sort_order, position, rotation, created_at, updated_at
			FROM carousels
			WHERE position = ?
			ORDER BY sort_order ASC, created_at DESC
		`, position)
	} else {
		rows, err = config.DB.Query(`
			SELECT id, title, image_url, alt_text, description, sort_order, position, rotation, created_at, updated_at
			FROM carousels
			ORDER BY sort_order ASC, created_at DESC
		`)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取轮播图失败"})
		return
	}
	defer rows.Close()

	var carousels []models.Carousel
	for rows.Next() {
		var item models.Carousel
		if err := rows.Scan(
			&item.ID,
			&item.Title,
			&item.ImageURL,
			&item.AltText,
			&item.Description,
			&item.SortOrder,
			&item.Position,
			&item.Rotation,
			&item.CreatedAt,
			&item.UpdatedAt,
		); err != nil {
			continue
		}
		carousels = append(carousels, item)
	}

	if carousels == nil {
		carousels = []models.Carousel{}
	}

	c.JSON(http.StatusOK, carousels)
}

// CreateCarousel 创建轮播图（管理员）
func CreateCarousel(c *gin.Context) {
	var payload models.Carousel
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式"})
		return
	}

	if payload.ImageURL == "" || payload.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "标题和图片地址不能为空"})
		return
	}

	// 旋转角度防御性处理，仅允许 0/90/180/270
	switch payload.Rotation {
	case 0, 90, 180, 270:
	default:
		payload.Rotation = 0
	}

	// 默认位置为顶部轮播图
	if payload.Position == "" {
		payload.Position = "top"
	}

	result, err := config.DB.Exec(
		"INSERT INTO carousels (title, image_url, alt_text, description, sort_order, position, rotation) VALUES (?, ?, ?, ?, ?, ?, ?)",
		payload.Title,
		payload.ImageURL,
		payload.AltText,
		payload.Description,
		payload.SortOrder,
		payload.Position,
		payload.Rotation,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建失败: " + err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	payload.ID = int(id)

	c.JSON(http.StatusCreated, payload)
}

// UpdateCarousel 更新轮播图（管理员）
func UpdateCarousel(c *gin.Context) {
	id := c.Param("id")

	var payload models.Carousel
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式"})
		return
	}

	if payload.ImageURL == "" || payload.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "标题和图片地址不能为空"})
		return
	}

	// 如果未传 position，则默认仍为顶部轮播图
	position := payload.Position
	if position == "" {
		position = "top"
	}

	// 旋转角度防御性处理，仅允许 0/90/180/270
	rotation := payload.Rotation
	switch rotation {
	case 0, 90, 180, 270:
	default:
		rotation = 0
	}

	_, err := config.DB.Exec(
		"UPDATE carousels SET title = ?, image_url = ?, alt_text = ?, description = ?, sort_order = ?, position = ?, rotation = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
		payload.Title,
		payload.ImageURL,
		payload.AltText,
		payload.Description,
		payload.SortOrder,
		position,
		rotation,
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败: " + err.Error()})
		return
	}

	idInt, _ := strconv.Atoi(id)
	payload.ID = idInt
	payload.Position = position
	payload.Rotation = rotation

	c.JSON(http.StatusOK, payload)
}

// DeleteCarousel 删除轮播图（管理员）
func DeleteCarousel(c *gin.Context) {
	id := c.Param("id")

	_, err := config.DB.Exec("DELETE FROM carousels WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}
