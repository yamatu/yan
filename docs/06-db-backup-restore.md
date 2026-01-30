# 数据库备份与恢复

## API

需要管理员登录（Bearer Token）。

- 备份：`GET /api/admin/db/backup`
  - 返回：`application/gzip`（下载文件名类似 `data.db.YYYYMMDD-HHMMSS.gz`）
- 恢复：`POST /api/admin/db/restore`
  - 表单：`multipart/form-data`
  - 文件字段名：`file`
  - 支持：`.zip` / `.gz` / `.tar` / `.tar.gz` / `.tgz` / 以及直接上传 sqlite 文件

恢复会在服务端做 sqlite header 校验（`SQLite format 3\0`），并在恢复期间阻塞其他 API 请求，避免恢复过程中读写数据库。

## 管理后台

前端管理后台新增了 Database 页签：

- 下载备份
- 上传文件并恢复（恢复成功后会强制登出，建议重新登录）
