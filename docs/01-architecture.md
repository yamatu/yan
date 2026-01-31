# 架构速览

## 目录结构

- `frontend/`：Next.js（App Router）前端
- `backend/`：Go + Gin 后端 API（SQLite）
- `docker-compose.yml`：本机/服务器一键启动编排（前端 + 后端 + Redis）

## 端口与访问方式（默认）

- 前端：`http://localhost:3002`
- 后端：`http://localhost:8081`（Compose 里也会暴露到本机，便于调试）
- Redis：只在容器网络内使用（如需本机直连可自行映射端口）

## 数据流

- 浏览器访问前端（Next.js）
- 前端请求 `/api/...`
- Next.js 通过 `frontend/next.config.ts` 的 rewrite 把 `/api/...` 反代到后端
- 后端从 SQLite 读取/写入数据
- 后端对公开 GET 接口做 Redis 缓存（降低被爬虫高频访问时的 DB/CPU 压力）
