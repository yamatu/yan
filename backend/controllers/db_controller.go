package controllers

import (
	"archive/tar"
	"archive/zip"
	"backend/cache"
	"backend/config"
	"backend/middleware"
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const maxRestoreUploadBytes = 300 << 20 // 300MB

func BackupDatabase(c *gin.Context) {
	if config.DBPath == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB_PATH not configured"})
		return
	}

	middleware.LockDBRead()
	defer middleware.UnlockDBRead()

	f, err := os.Open(config.DBPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open database"})
		return
	}
	defer f.Close()

	filename := fmt.Sprintf("data.db.%s.gz", time.Now().UTC().Format("20060102-150405"))
	c.Header("Content-Type", "application/gzip")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))

	gz := gzip.NewWriter(c.Writer)
	defer gz.Close()

	if _, err := io.Copy(gz, f); err != nil {
		// response already started; just stop
		return
	}
}

func RestoreDatabase(c *gin.Context) {
	if config.DBPath == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB_PATH not configured"})
		return
	}

	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxRestoreUploadBytes)

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing upload file (field name: file)"})
		return
	}
	defer file.Close()

	// Write upload to temp file
	uploadTmp, err := os.CreateTemp("", "db-upload-*")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create temp file"})
		return
	}
	uploadTmpPath := uploadTmp.Name()
	defer os.Remove(uploadTmpPath)

	if _, err := io.Copy(uploadTmp, file); err != nil {
		uploadTmp.Close()
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read upload"})
		return
	}
	_ = uploadTmp.Close()

	extractedPath, err := extractDatabaseFile(uploadTmpPath, header.Filename)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer os.Remove(extractedPath)

	if err := validateSQLiteFile(extractedPath); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Restore under exclusive lock
	middleware.LockDBWrite()
	defer middleware.UnlockDBWrite()

	config.CloseDB()

	// Backup current db file (best-effort)
	if _, err := os.Stat(config.DBPath); err == nil {
		bak := fmt.Sprintf("%s.bak.%s", config.DBPath, time.Now().UTC().Format("20060102-150405"))
		_ = copyFile(config.DBPath, bak)
	}

	// Atomic replace: write to tmp in same dir then rename
	dir := filepath.Dir(config.DBPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare db directory"})
		return
	}
	tmpDst, err := os.CreateTemp(dir, "data.db.restore-*")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create temp db"})
		return
	}
	tmpDstPath := tmpDst.Name()

	if err := copyReaderToFile(extractedPath, tmpDst); err != nil {
		_ = tmpDst.Close()
		_ = os.Remove(tmpDstPath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to write restored db"})
		return
	}
	_ = tmpDst.Close()

	if err := os.Rename(tmpDstPath, config.DBPath); err != nil {
		_ = os.Remove(tmpDstPath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to replace db"})
		return
	}

	// Re-init DB (will run migrations)
	config.InitDB()

	// Clear cache
	cache.PurgePatterns(c.Request.Context(), "cache:v1:GET:*")

	c.JSON(http.StatusOK, gin.H{
		"message":  "database restored",
		"filename": header.Filename,
	})
}

func validateSQLiteFile(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("failed to open extracted file")
	}
	defer f.Close()

	header := make([]byte, 16)
	n, _ := io.ReadFull(f, header)
	if n < 16 {
		return fmt.Errorf("uploaded file is too small to be a sqlite database")
	}
	if string(header) != "SQLite format 3\x00" {
		return fmt.Errorf("uploaded file is not a sqlite database")
	}
	return nil
}

func extractDatabaseFile(uploadPath, originalName string) (string, error) {
	name := strings.ToLower(originalName)
	if strings.HasSuffix(name, ".tar.gz") || strings.HasSuffix(name, ".tgz") {
		return extractFromTarGz(uploadPath)
	}
	if strings.HasSuffix(name, ".tar") {
		return extractFromTar(uploadPath)
	}
	if strings.HasSuffix(name, ".gz") {
		return extractFromGzip(uploadPath)
	}
	if strings.HasSuffix(name, ".zip") {
		return extractFromZip(uploadPath)
	}

	// Unknown: treat as raw sqlite file
	out, err := os.CreateTemp("", "db-raw-*.db")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file")
	}
	outPath := out.Name()
	if err := copyReaderToFile(uploadPath, out); err != nil {
		out.Close()
		os.Remove(outPath)
		return "", fmt.Errorf("failed to read upload")
	}
	out.Close()
	return outPath, nil
}

func extractFromGzip(uploadPath string) (string, error) {
	f, err := os.Open(uploadPath)
	if err != nil {
		return "", fmt.Errorf("failed to open gzip")
	}
	defer f.Close()

	gz, err := gzip.NewReader(f)
	if err != nil {
		return "", fmt.Errorf("invalid gzip")
	}
	defer gz.Close()

	out, err := os.CreateTemp("", "db-*.db")
	if err != nil {
		return "", fmt.Errorf("failed to create temp")
	}
	outPath := out.Name()
	if _, err := io.Copy(out, gz); err != nil {
		out.Close()
		os.Remove(outPath)
		return "", fmt.Errorf("failed to decompress gzip")
	}
	out.Close()
	return outPath, nil
}

func extractFromZip(uploadPath string) (string, error) {
	r, err := zip.OpenReader(uploadPath)
	if err != nil {
		return "", fmt.Errorf("invalid zip")
	}
	defer r.Close()

	var chosen *zip.File
	for _, f := range r.File {
		if f.FileInfo().IsDir() {
			continue
		}
		lower := strings.ToLower(f.Name)
		if strings.HasSuffix(lower, ".db") || strings.HasSuffix(lower, ".sqlite") || strings.HasSuffix(lower, ".sqlite3") {
			chosen = f
			break
		}
		if chosen == nil {
			chosen = f
		}
	}
	if chosen == nil {
		return "", fmt.Errorf("zip contains no files")
	}

	rc, err := chosen.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open zip entry")
	}
	defer rc.Close()

	out, err := os.CreateTemp("", "db-*.db")
	if err != nil {
		return "", fmt.Errorf("failed to create temp")
	}
	outPath := out.Name()
	if _, err := io.Copy(out, rc); err != nil {
		out.Close()
		os.Remove(outPath)
		return "", fmt.Errorf("failed to extract zip")
	}
	out.Close()
	return outPath, nil
}

func extractFromTar(uploadPath string) (string, error) {
	f, err := os.Open(uploadPath)
	if err != nil {
		return "", fmt.Errorf("failed to open tar")
	}
	defer f.Close()

	return extractFromTarReader(tar.NewReader(f))
}

func extractFromTarGz(uploadPath string) (string, error) {
	f, err := os.Open(uploadPath)
	if err != nil {
		return "", fmt.Errorf("failed to open tar.gz")
	}
	defer f.Close()

	gz, err := gzip.NewReader(f)
	if err != nil {
		return "", fmt.Errorf("invalid gzip")
	}
	defer gz.Close()

	return extractFromTarReader(tar.NewReader(gz))
}

func extractFromTarReader(tr *tar.Reader) (string, error) {
	var best []byte

	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return "", fmt.Errorf("invalid tar")
		}
		if hdr == nil {
			continue
		}
		if hdr.Typeflag != tar.TypeReg {
			continue
		}

		buf, err := io.ReadAll(io.LimitReader(tr, maxRestoreUploadBytes))
		if err != nil {
			return "", fmt.Errorf("failed to extract tar")
		}

		lower := strings.ToLower(hdr.Name)
		if best == nil {
			best = buf
		}
		if strings.HasSuffix(lower, ".db") || strings.HasSuffix(lower, ".sqlite") || strings.HasSuffix(lower, ".sqlite3") {
			best = buf
			break
		}
	}

	if best == nil {
		return "", fmt.Errorf("tar contains no files")
	}

	out, err := os.CreateTemp("", "db-*.db")
	if err != nil {
		return "", fmt.Errorf("failed to create temp")
	}
	outPath := out.Name()
	if _, err := io.Copy(out, bytes.NewReader(best)); err != nil {
		out.Close()
		os.Remove(outPath)
		return "", fmt.Errorf("failed to write extracted db")
	}
	out.Close()
	return outPath, nil
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()
	if _, err := io.Copy(out, in); err != nil {
		return err
	}
	return out.Sync()
}

func copyReaderToFile(srcPath string, out *os.File) error {
	in, err := os.Open(srcPath)
	if err != nil {
		return err
	}
	defer in.Close()
	if _, err := io.Copy(out, in); err != nil {
		return err
	}
	return out.Sync()
}
