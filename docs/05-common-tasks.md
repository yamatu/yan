# 常见改动

## 新增一个后端接口

1. 在 `backend/controllers/` 增加 handler
2. 在 `backend/routes/routes.go` 注册路由
3. 如是公开 GET，默认会走 Redis 缓存（注意响应应为 JSON）

## 前端调用后端

- 浏览器侧：优先用相对路径 `/api/...`（由 Next rewrite 转发）
- 统一入口：`frontend/app/lib/api.ts` 的 `getApiBase()`

## 上线/发布前检查（建议顺序）

1. `frontend/`：`npm audit --omit=dev`
2. `frontend/`：`npm run build`
3. `backend/`：`go test ./...`
4. `docker compose up --build` 本机回归
