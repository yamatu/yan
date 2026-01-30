# 本地开发（不使用 Docker）

## 1) 启动后端

```bash
cd backend
cp .env.example .env
go run main.go
```

默认监听 `:8080`（如果 `.env` 里设置了 `PORT` 会以 `.env` 为准）。

## 2) 启动前端

```bash
cd frontend
npm install
npm run dev -- -p 3001
```

访问 `http://localhost:3001`。

说明：前端会把 `/api/*` 通过 `frontend/next.config.ts` 转发到后端（默认 `http://localhost:8080`）。
