# Redis 缓存（应对爬虫高频访问）

## 现象

爬虫/搜索引擎会高频访问博客/解决方案等页面；这些页面在服务端渲染时会调用后端 API，导致：

- 后端 SQLite 被高频读
- 前端 SSR 与后端 API 之间产生大量内部请求
- CPU/网络资源占用在高并发下升高

## 方案

后端对公开 GET 接口做 Redis 缓存：

- 位置：`backend/middleware/response_cache.go`
- 开关：只要设置了 `REDIS_ADDR` 就启用
- TTL：`CACHE_TTL_SECONDS`（默认 300 秒）
- 缓存范围：`/api/*` 的 GET 请求（自动跳过 `/api/admin/*`）
- 失效策略：管理员写操作（创建/更新/删除）会清理相关 key 前缀

## 调试

- 命中缓存时后端会返回 `X-Cache: HIT`
- 你也可以用 `redis-cli` 在容器里查看 key：

```bash
docker exec -it kindanddivine-redis redis-cli
keys cache:v1:GET:*
```
