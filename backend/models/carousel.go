package models

import "time"

// Carousel 表示首页轮播图配置
// Position 用于区分顶部和底部轮播图，例如 "top" 或 "bottom"
type Carousel struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	ImageURL    string    `json:"image_url"`
	AltText     string    `json:"alt_text"`
	Description string    `json:"description"`
	SortOrder   int       `json:"sort_order"`
	Position    string    `json:"position"`
	Rotation    int       `json:"rotation"` // 图片旋转角度：0、90、180、270
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
