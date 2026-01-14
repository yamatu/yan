package controllers

import (
	"backend/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateContact 创建联系请求
func CreateContact(c *gin.Context) {
	var req struct {
		Name    string `json:"name" binding:"required"`
		Email   string `json:"email" binding:"required"`
		Subject string `json:"subject" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := config.DB.Exec("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)", req.Name, req.Email, req.Subject, req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit contact form"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Contact form submitted successfully",
		"status":  "success",
	})
}

// GetContacts 获取所有联系请求（管理员用）
func GetContacts(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, name, email, subject, message, created_at, updated_at FROM contacts ORDER BY created_at DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取联系消息失败"})
		return
	}
	defer rows.Close()

	var contacts []map[string]interface{}
	for rows.Next() {
		var id int
		var name, email, subject, message, createdAt, updatedAt string
		if err := rows.Scan(&id, &name, &email, &subject, &message, &createdAt, &updatedAt); err != nil {
			continue
		}

		contacts = append(contacts, map[string]interface{}{
			"id":         id,
			"name":       name,
			"email":      email,
			"subject":    subject,
			"message":    message,
			"created_at": createdAt,
			"updated_at": updatedAt,
		})
	}

	c.JSON(http.StatusOK, contacts)
}

// DeleteContact 删除联系请求（管理员用）
func DeleteContact(c *gin.Context) {
	id := c.Param("id")

	_, err := config.DB.Exec("DELETE FROM contacts WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contact deleted successfully"})
}