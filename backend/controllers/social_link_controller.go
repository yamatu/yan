package controllers

import (
	"backend/cache"
	"backend/config"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type SocialLink struct {
	ID        int    `json:"id"`
	Platform  string `json:"platform"` // facebook, twitter, linkedin, instagram, youtube, github, wechat, weibo
	URL       string `json:"url"`
	SortOrder int    `json:"sort_order"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// GetSocialLinks 获取所有社交媒体链接
func GetSocialLinks(c *gin.Context) {
	query := `SELECT id, platform, url, sort_order, created_at, updated_at 
			  FROM social_links 
			  ORDER BY sort_order ASC`

	rows, err := config.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询社交媒体链接失败"})
		return
	}
	defer rows.Close()

	var links []SocialLink
	for rows.Next() {
		var link SocialLink
		err := rows.Scan(&link.ID, &link.Platform, &link.URL, &link.SortOrder, &link.CreatedAt, &link.UpdatedAt)
		if err != nil {
			continue
		}
		links = append(links, link)
	}

	if links == nil {
		links = []SocialLink{}
	}

	c.JSON(http.StatusOK, links)
}

// CreateSocialLink 创建社交媒体链接 (Admin)
func CreateSocialLink(c *gin.Context) {
	var link SocialLink
	if err := c.ShouldBindJSON(&link); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO social_links (platform, url, sort_order) VALUES (?, ?, ?)`
	result, err := config.DB.Exec(query, link.Platform, link.URL, link.SortOrder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建失败"})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/social-links*")

	id, _ := result.LastInsertId()
	c.JSON(http.StatusOK, gin.H{"id": id, "message": "创建成功"})
}

// UpdateSocialLink 更新社交媒体链接 (Admin)
func UpdateSocialLink(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
		return
	}

	var link SocialLink
	if err := c.ShouldBindJSON(&link); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `UPDATE social_links SET platform = ?, url = ?, sort_order = ? WHERE id = ?`
	_, err = config.DB.Exec(query, link.Platform, link.URL, link.SortOrder, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/social-links*")

	c.JSON(http.StatusOK, gin.H{"message": "更新成功"})
}

// DeleteSocialLink 删除社交媒体链接 (Admin)
func DeleteSocialLink(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
		return
	}

	query := `DELETE FROM social_links WHERE id = ?`
	_, err = config.DB.Exec(query, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:/api/social-links*")

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}
