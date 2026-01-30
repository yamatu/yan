package middleware

import (
	"bytes"
	"encoding/base64"
	"net/http"
	"strings"
	"time"

	"backend/cache"

	"github.com/gin-gonic/gin"
)

type bodyCaptureWriter struct {
	gin.ResponseWriter
	body bytes.Buffer
}

func (w *bodyCaptureWriter) Write(b []byte) (int, error) {
	_, _ = w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func CachePublicGetResponses(ttl time.Duration, maxBodyBytes int) gin.HandlerFunc {
	if ttl <= 0 {
		ttl = 5 * time.Minute
	}
	if maxBodyBytes <= 0 {
		maxBodyBytes = 1024 * 1024 // 1MB
	}

	return func(c *gin.Context) {
		if c.Request.Method != http.MethodGet {
			c.Next()
			return
		}

		// Avoid caching authenticated/admin endpoints.
		if strings.HasPrefix(c.Request.URL.Path, "/api/admin") {
			c.Next()
			return
		}

		key := cache.CacheKey(c.Request.Method, c.Request.URL.Path, c.Request.URL.RawQuery)

		if cached, ok := cache.Get(c.Request.Context(), key); ok {
			body, err := base64.StdEncoding.DecodeString(cached.BodyB64)
			if err == nil {
				if cached.ContentType != "" {
					c.Header("Content-Type", cached.ContentType)
				}
				c.Header("X-Cache", "HIT")
				c.Status(cached.Status)
				_, _ = c.Writer.Write(body)
				c.Abort()
				return
			}
		}

		bw := &bodyCaptureWriter{ResponseWriter: c.Writer}
		c.Writer = bw

		c.Next()

		status := bw.Status()
		if status != http.StatusOK {
			return
		}

		if bw.body.Len() == 0 || bw.body.Len() > maxBodyBytes {
			return
		}

		ct := bw.Header().Get("Content-Type")
		if ct != "" && !strings.HasPrefix(ct, "application/json") {
			// Only cache JSON responses to keep behavior predictable.
			return
		}

		cache.Set(c.Request.Context(), key, &cache.CachedResponse{
			Status:      status,
			ContentType: ct,
			BodyB64:     base64.StdEncoding.EncodeToString(bw.body.Bytes()),
		}, ttl)
	}
}
