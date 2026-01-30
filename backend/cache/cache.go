package cache

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"time"

	"backend/config"
)

type CachedResponse struct {
	Status      int    `json:"status"`
	ContentType string `json:"content_type"`
	BodyB64     string `json:"body_b64"`
}

func Enabled() bool {
	return config.Redis != nil
}

func CacheKey(method, path, rawQuery string) string {
	h := sha1.Sum([]byte(rawQuery))
	return "cache:v1:" + method + ":" + path + ":" + hex.EncodeToString(h[:])
}

func Get(ctx context.Context, key string) (*CachedResponse, bool) {
	if !Enabled() {
		return nil, false
	}

	b, err := config.Redis.Get(ctx, key).Bytes()
	if err != nil {
		return nil, false
	}

	var cr CachedResponse
	if err := json.Unmarshal(b, &cr); err != nil {
		return nil, false
	}
	if cr.Status == 0 {
		return nil, false
	}
	return &cr, true
}

func Set(ctx context.Context, key string, cr *CachedResponse, ttl time.Duration) {
	if !Enabled() {
		return
	}
	if cr == nil {
		return
	}
	b, err := json.Marshal(cr)
	if err != nil {
		return
	}
	_ = config.Redis.Set(ctx, key, b, ttl).Err()
}

// PurgePatterns deletes keys matching the provided Redis glob patterns.
//
// This is best-effort: it logs errors but does not fail requests.
func PurgePatterns(ctx context.Context, patterns ...string) {
	if !Enabled() {
		return
	}
	if len(patterns) == 0 {
		return
	}

	for _, pattern := range patterns {
		if pattern == "" {
			continue
		}

		var cursor uint64
		for {
			keys, next, err := config.Redis.Scan(ctx, cursor, pattern, 500).Result()
			if err != nil {
				if !errors.Is(err, context.Canceled) {
					log.Printf("redis scan failed (%s): %v", pattern, err)
				}
				break
			}

			if len(keys) > 0 {
				if err := config.Redis.Del(ctx, keys...).Err(); err != nil {
					log.Printf("redis del failed (%s): %v", pattern, err)
				}
			}

			cursor = next
			if cursor == 0 {
				break
			}
		}
	}
}
