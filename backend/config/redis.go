package config

import (
	"context"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

var Redis *redis.Client

// InitRedis initializes the global Redis client.
//
// If REDIS_ADDR is empty, Redis is treated as disabled and no error is returned.
func InitRedis() {
	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		log.Println("REDIS_ADDR not set; redis cache disabled")
		return
	}

	db := 0
	if v := os.Getenv("REDIS_DB"); v != "" {
		if parsed, err := strconv.Atoi(v); err == nil {
			db = parsed
		}
	}

	Redis = redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     os.Getenv("REDIS_PASSWORD"),
		DB:           db,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 2 * time.Second,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := Redis.Ping(ctx).Err(); err != nil {
		log.Printf("Redis ping failed (%s): %v; redis cache disabled", addr, err)
		Redis = nil
		return
	}

	log.Printf("Redis connected: %s (db=%d)", addr, db)
}

func CloseRedis() {
	if Redis == nil {
		return
	}
	if err := Redis.Close(); err != nil {
		log.Printf("Redis close failed: %v", err)
	}
}
