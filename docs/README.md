# 项目文档（循序渐进）

这套文档按“先跑起来 → 再理解结构 → 再改功能 → 再部署”的顺序写，适合从零接手/二次开发。

## 路线图

1. `docs/02-local-development.md`：本地不使用 Docker，分别启动前后端
2. `docs/03-docker-compose.md`：用 Docker Compose 一键启动（前端 + 后端 + Redis）
3. `docs/01-architecture.md`：项目结构与数据流（看完就能定位代码）
4. `docs/04-redis-cache.md`：为什么爬虫来时资源占用高，以及 Redis 缓存怎么减压
5. `docs/05-common-tasks.md`：常见改动范式（加接口/加页面/上线前检查）
6. `docs/06-db-backup-restore.md`：数据库备份/恢复（管理后台上传压缩包恢复）
