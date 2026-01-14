package utils

import (
	"regexp"
	"strings"
)

// GeneratePathFromTitle 根据标题生成URL路径
func GeneratePathFromTitle(title string) string {
	// 转换为小写
	path := strings.ToLower(title)

	// 移除特殊字符，只保留字母、数字和中文
	re := regexp.MustCompile(`[^\p{L}\p{N}]+`)
	path = re.ReplaceAllString(path, "-")

	// 移除开头和结尾的连字符
	path = strings.Trim(path, "-")

	// 如果路径为空，使用默认值
	if path == "" {
		path = "item"
	}

	return path
}