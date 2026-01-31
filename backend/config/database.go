package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

var DB *sql.DB
var DBPath string

func InitDB() {
	var err error

	// Ensure data directory exists
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./data.db"
	}
	DBPath = dbPath
	dir := filepath.Dir(dbPath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	DB, err = sql.Open("sqlite", dbPath)
	if err != nil {
		log.Fatal("数据库连接失败:", err)
	}

	// 测试连接
	err = DB.Ping()
	if err != nil {
		log.Fatal("数据库ping失败:", err)
	}

	log.Println("SQLite数据库连接成功")

	// 创建数据库和数据表
	createTables()

	// 迁移SEO字段
	migrateSEO()

	// 迁移轮播图 rotation 字段（图片旋转角度）
	migrateCarouselRotation()

	// 迁移轮播图图片显示尺寸字段
	migrateCarouselImageSize()
}

func migrateSEO() {
	// Add SEO columns to blogs table
	seoColumns := []string{
		"ALTER TABLE blogs ADD COLUMN meta_title TEXT;",
		"ALTER TABLE blogs ADD COLUMN meta_description TEXT;",
		"ALTER TABLE blogs ADD COLUMN meta_keywords TEXT;",
		"ALTER TABLE solutions ADD COLUMN meta_title TEXT;",
		"ALTER TABLE solutions ADD COLUMN meta_description TEXT;",
		"ALTER TABLE solutions ADD COLUMN meta_keywords TEXT;",
	}

	for _, sqlStmt := range seoColumns {
		_, err := DB.Exec(sqlStmt)
		if err != nil {
			// Ignore error if column already exists (sqlite doesn't support IF NOT EXISTS for ADD COLUMN)
			// In a production env, we would check specifically for "duplicate column name" error
			log.Printf("Migration note (might be expected if columns exist): %v", err)
		} else {
			log.Println("Executed migration:", sqlStmt)
		}
	}
}

// migrateCarouselRotation 为已有的 carousels 表增加 rotation 字段
// SQLite 不支持 IF NOT EXISTS 语法，这里和 migrateSEO 一样：
// - 如果列已存在，会打印一条日志但忽略错误
// - 如果列不存在，则正常新增，默认值为 0（不旋转）
func migrateCarouselRotation() {
	sqlStmt := "ALTER TABLE carousels ADD COLUMN rotation INTEGER NOT NULL DEFAULT 0;"
	if _, err := DB.Exec(sqlStmt); err != nil {
		log.Printf("Migration note for carousels.rotation (might be expected if column exists): %v", err)
	} else {
		log.Println("Executed migration:", sqlStmt)
	}
}

// migrateCarouselImageSize 为已有的 carousels 表增加 image_width / image_height 字段
//
// 这里用于主页 Our Solutions 卡片容器尺寸：
// - 0 表示默认（前端会回退到默认宽度/正方形）
// - >0 表示像素
func migrateCarouselImageSize() {
	stmts := []string{
		"ALTER TABLE carousels ADD COLUMN image_width INTEGER NOT NULL DEFAULT 0;",
		"ALTER TABLE carousels ADD COLUMN image_height INTEGER NOT NULL DEFAULT 0;",
	}
	for _, sqlStmt := range stmts {
		if _, err := DB.Exec(sqlStmt); err != nil {
			log.Printf("Migration note for carousels image size (might be expected if column exists): %v", err)
		} else {
			log.Println("Executed migration:", sqlStmt)
		}
	}
}

func createTables() {
	// Enable foreign keys
	_, err := DB.Exec("PRAGMA foreign_keys = ON")
	if err != nil {
		log.Println("启用外键失败:", err)
	}

	// 创建管理员表
	adminTable := `
	CREATE TABLE IF NOT EXISTS admins (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(adminTable)
	if err != nil {
		log.Fatal("创建管理员表失败:", err)
	}

	// 创建博客表
	blogTable := `
	CREATE TABLE IF NOT EXISTS blogs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		summary TEXT,
		content TEXT NOT NULL,
		path TEXT UNIQUE,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(blogTable)
	if err != nil {
		log.Fatal("创建博客表失败:", err)
	}

	// 创建博客分类表
	categoryTable := `
	CREATE TABLE IF NOT EXISTS blog_categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT UNIQUE NOT NULL,
		slug TEXT UNIQUE NOT NULL,
		icon TEXT,
		color TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(categoryTable)
	if err != nil {
		log.Fatal("创建博客分类表失败:", err)
	}

	// 创建博客-分类关联表
	relationTable := `
	CREATE TABLE IF NOT EXISTS blog_category_relations (
		blog_id INTEGER NOT NULL,
		category_id INTEGER NOT NULL,
		PRIMARY KEY (blog_id, category_id),
		FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
		FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
	);
	`
	_, err = DB.Exec(relationTable)
	if err != nil {
		log.Fatal("创建博客-分类关联表失败:", err)
	}

	// 创建解决方案表
	solutionTable := `
	CREATE TABLE IF NOT EXISTS solutions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT NOT NULL,
		image_url TEXT,
		path TEXT UNIQUE,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(solutionTable)
	if err != nil {
		log.Fatal("创建解决方案表失败:", err)
	}

	// 创建联系表
	contactTable := `
	CREATE TABLE IF NOT EXISTS contacts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		subject TEXT NOT NULL,
		message TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(contactTable)
	if err != nil {
		log.Fatal("创建联系表失败:", err)
	}

	// 创建首页轮播图表
	carouselTable := `
	CREATE TABLE IF NOT EXISTS carousels (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		image_url TEXT NOT NULL,
		alt_text TEXT NOT NULL,
		description TEXT,
		sort_order INTEGER DEFAULT 0,
		position TEXT NOT NULL DEFAULT 'top',
		rotation INTEGER NOT NULL DEFAULT 0,
		image_width INTEGER NOT NULL DEFAULT 0,
		image_height INTEGER NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(carouselTable)
	if err != nil {
		log.Fatal("创建轮播图表失败:", err)
	}

	// 创建社交媒体链接表
	socialLinkTable := `
	CREATE TABLE IF NOT EXISTS social_links (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		platform TEXT NOT NULL,
		url TEXT NOT NULL,
		sort_order INTEGER DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(socialLinkTable)
	if err != nil {
		log.Fatal("创建社交媒体链接表失败:", err)
	}

	// 插入默认管理员账号
	var count int
	err = DB.QueryRow("SELECT COUNT(*) FROM admins").Scan(&count)
	if err == nil && count == 0 {
		_, err = DB.Exec("INSERT INTO admins (username, password) VALUES (?, ?)", "admin", "admin123")
		if err != nil {
			log.Println("插入默认管理员失败:", err)
		} else {
			log.Println("默认管理员账号已创建: admin / admin123")
		}
	}

	// 插入默认分类
	err = DB.QueryRow("SELECT COUNT(*) FROM blog_categories").Scan(&count)
	if err == nil && count == 0 {
		categories := []struct {
			Name  string
			Slug  string
			Icon  string
			Color string
		}{
			{"Industry Trends", "industry-trends", "FaIndustry", "from-sky-500 to-cyan-400"},
			{"Product Updates", "product-updates", "FaBoxOpen", "from-indigo-500 to-sky-500"},
			{"Solutions", "solutions", "FaLightbulb", "from-blue-500 to-emerald-400"},
			{"Tech Insights", "tech-insights", "FaMicrochip", "from-cyan-500 to-blue-600"},
		}

		stmt, _ := DB.Prepare("INSERT INTO blog_categories (name, slug, icon, color) VALUES (?, ?, ?, ?)")
		defer stmt.Close()

		for _, cat := range categories {
			_, err := stmt.Exec(cat.Name, cat.Slug, cat.Icon, cat.Color)
			if err != nil {
				log.Printf("插入分类 %s 失败: %v\n", cat.Name, err)
			} else {
				log.Printf("分类 %s 已创建\n", cat.Name)
			}
		}
	}

	log.Println("数据表创建完成")
}

func CloseDB() {
	if DB != nil {
		DB.Close()
		fmt.Println("数据库连接已关闭")
	}
}
