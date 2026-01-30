package middleware

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

var dbMu sync.RWMutex

func LockDBRead() {
	dbMu.RLock()
}

func UnlockDBRead() {
	dbMu.RUnlock()
}

func LockDBWrite() {
	dbMu.Lock()
}

func UnlockDBWrite() {
	dbMu.Unlock()
}

// DBReadLock blocks DB operations during a restore.
// It skips locking for the restore/backup endpoints themselves.
func DBReadLock() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		if c.Request.Method == http.MethodPost && path == "/api/admin/db/restore" {
			c.Next()
			return
		}
		if c.Request.Method == http.MethodGet && path == "/api/admin/db/backup" {
			c.Next()
			return
		}

		dbMu.RLock()
		defer dbMu.RUnlock()
		c.Next()
	}
}
