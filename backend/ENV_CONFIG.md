# 后端环境变量配置更新指南

## ⚠️ 重要提示
您当前的 `.env` 文件还在使用 MySQL 配置，需要更新为 SQLite 配置。

## 当前 .env 文件内容（MySQL - 需要更换）

```bash
# 数据库配置
DB_HOST=dz.yamatu.xyz
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Window189.
DB_NAME=b2b_platform

# JWT密钥（生产环境请修改）
JWT_SECRET=your-secret-key-change-this-in-production

# 服务器配置
SERVER_PORT=8080

# CORS配置
CORS_ORIGIN=http://localhost:3000
```

## 新的 .env 文件内容（SQLite - 推荐使用）

请将 `backend/.env` 文件**完全替换**为以下内容：

```bash
# ==========================================
# 后端服务器配置 (SQLite 版本)
# ==========================================

# 服务器端口（生产环境使用 9001）
PORT=9001

# 数据库配置 (SQLite - 本地文件存储)
DB_PATH=./data.db

# JWT 密钥（生产环境请修改为强随机字符串！）
JWT_SECRET=your-secret-key-please-change-this-in-production

# CORS 允许的源（多个源用逗号分隔）
CORS_ORIGINS=http://localhost:3001,https://yourdomain.com

# 应用模式 (development/production)
GIN_MODE=release
```

## 📝 修改步骤

### 1. 编辑 .env 文件
```bash
cd backend
nano .env   # 或使用其他编辑器
```

### 2. 替换为新配置
将上面的"新的 .env 文件内容"复制粘贴到文件中。

### 3. 自定义配置
- `PORT`: 保持 `9001` 用于生产环境
- `JWT_SECRET`: 改为强随机字符串
- `CORS_ORIGINS`: 添加您的实际域名
- `yourdomain.com`: 替换为您的真实域名

### 4. 保存并重启后端
```bash
# 停止当前运行的后端
pm2 stop yan-backend  # 如果使用 PM2
# 或者 Ctrl+C 停止直接运行的进程

# 重新启动
go run main.go
# 或
pm2 restart yan-backend
```

## ✅ 验证配置

启动后端后，您应该看到：

```
2025/11/25 XX:XX:XX SQLite数据库连接成功
2025/11/25 XX:XX:XX 数据表创建完成
2025/11/25 XX:XX:XX 服务器启动在 http://localhost:9001
[GIN-debug] Listening and serving HTTP on :9001
```

注意端口应该是 **9001** 而不是 8080。

## 🔧 故障排查

### 问题：端口仍然是 8080
**原因**: `.env` 文件中的 `PORT` 变量未生效

**解决方案**:
1. 确认 `.env` 文件在 `backend/` 目录下
2. 确认使用 `PORT` 而不是 `SERVER_PORT`
3. 重新启动后端服务

### 问题：数据库连接失败
**原因**: 仍在使用旧的 MySQL 配置

**解决方案**:
1. 删除所有 `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` 配置
2. 只保留 `DB_PATH=./data.db`
3. 代码已经迁移到 SQLite，不再需要 MySQL

## 📦 配置文件对比

| 变量名 | 旧配置 (MySQL) | 新配置 (SQLite) | 说明 |
|--------|---------------|----------------|------|
| PORT | `SERVER_PORT=8080` | `PORT=9001` | 端口配置 |
| 数据库 | `DB_HOST`, `DB_PORT`, 等 | `DB_PATH=./data.db` | SQLite 本地文件 |
| CORS | `CORS_ORIGIN` | `CORS_ORIGINS` | 支持多个源 |
| JWT | `JWT_SECRET` | `JWT_SECRET` | 相同 |
| - | - | `GIN_MODE` | 新增：应用模式 |

## ⚙️ main.go 已支持的功能

我已经更新了 `main.go`，现在支持：
- ✅ 从 `.env` 读取 `PORT` 变量
- ✅ 从 `.env` 读取 `CORS_ORIGINS` 变量（支持多个源）
- ✅ 默认值：PORT=8080, CORS_ORIGINS=localhost:3000,localhost:3001
- ✅ 使用 `github.com/joho/godotenv` 自动加载 `.env`

## 🚀 完成后的效果

配置完成后：
- 后端运行在端口 **9001**
- 使用 SQLite 数据库 (`data.db` 文件)
- 支持来自前端 (3001) 和您域名的 CORS 请求
- 无需 MySQL 服务器，部署更简单

---

**参考文件**:
- [.env.example](file:///c:/Users/98434/Desktop/yan/backend/.env.example) - 完整的配置示例
- [main.go](file:///c:/Users/98434/Desktop/yan/backend/main.go) - 已更新支持环境变量
