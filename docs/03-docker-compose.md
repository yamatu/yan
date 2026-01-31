# Docker Compose 部署（本机测试）

## 一键启动

在项目根目录执行：

```bash
docker compose up --build
```

## 默认服务

- `frontend`：Next.js，暴露 `127.0.0.1:3002`
- `backend`：Go/Gin，暴露 `127.0.0.1:8081`
- `redis`：后端缓存使用（默认映射到 `127.0.0.1:6380`）

## 数据持久化

- SQLite：通过 Compose volume 挂载到容器内 `/data/data.db`
- Redis：通过 Compose volume 持久化 `/data`

## 停止

```bash
docker compose down
```
