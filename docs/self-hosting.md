# 自托管指南

## 环境要求

- **Node.js** >= 24
- **PostgreSQL** 数据库实例（推荐 16+）
- 能够访问 Steam Community（如果在中国大陆，需自行配置代理）

## 部署步骤

### 1. 获取代码

```bash
git clone https://github.com/cyqmq/cs2-inventory-serverapi.git
cd cs2-inventory-serverapi
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

| 变量 | 必需 | 说明 |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL 连接串，例如 `postgres://user:password@host:5432/cs2_inventory` |
| `SESSION_SECRET` | ✅ | Session 加密密钥，使用随机字符串 |
| `STEAM_API_KEY` | ❌ | Steam Web API 密钥，从 https://steamcommunity.com/dev/apikey 获取 |
| `STEAM_CALLBACK_URL` | ❌ | Steam OAuth 回调地址，例如 `https://your.domain/api/sign-in/callback` |
| `PORT` | ❌ | 监听端口，默认 `3000` |

> `STEAM_API_KEY` 和 `STEAM_CALLBACK_URL` 也可通过运行时规则配置（见下方"运行时规则"），非必填。

### 3. 安装依赖

```bash
npm install
```

### 4. 初始化数据库

```bash
npx prisma migrate deploy
```

### 5. 构建

```bash
npm run build
```

### 6. 启动

```bash
npm start
```

默认监听 `http://0.0.0.0:3000`。

### 验证

```bash
curl http://localhost:3000/healthz
# 预期输出："Supposedly healthy"
```

## 反向代理

建议在生产环境使用 Nginx 或 Caddy 作为反向代理，配置 SSL 和域名。

### Nginx 示例

```nginx
server {
    listen 443 ssl;
    server_name your.domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 进程管理

推荐使用 PM2 管理进程：

```bash
npm install -g pm2
pm2 start npm --name "cs2-inventory-api" -- start
pm2 save
pm2 startup
```

## 运行时规则

系统行为通过数据库 `public.Rule` 表配置。启动时若表为空，`/api/init` 会自动写入默认值。常用规则：

| 规则名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `steamApiKey` | string | `""` | Steam Web API 密钥 |
| `steamCallbackUrl` | string | `""` | Steam OAuth 回调地址 |
| `defaultLanguage` | string | `"english"` | 默认语言 |
| `defaultBackground` | string | `""` | 默认背景 |
| `maxInventoryItems` | number | `1000` | 库存上限 |
| `syncCooldown` | number | `60` | 同步冷却时间（秒） |
| `hideFreeItems` | boolean | `false` | 是否隐藏免费物品 |
| `hideFilters` | boolean | `false` | 是否隐藏筛选器 |
| `statsForNerds` | boolean | `false` | 是否显示技术信息 |

可使用 SQL 或 API 修改：

```sql
UPDATE "Rule" SET value = 'your-api-key' WHERE name = 'steamApiKey';
```

## API 密钥管理

某些 API 端点需要 API Key 认证。在 `public.ApiCredential` 表中插入记录：

| 列 | 说明 |
|---|---|
| `apiKey` | 密钥值，使用 UUID 或随机字符串 |
| `scope` | 权限范围，逗号分隔。`api` 表示全部权限 |
| `comment` | 备注说明 |

```sql
INSERT INTO "ApiCredential" ("apiKey", "scope", "comment")
VALUES ('your-generated-key', 'api', '管理员密钥');
```

## 数据库维护

### 备份

```bash
pg_dump cs2_inventory > backup.sql
```

### 迁移

```bash
npx prisma migrate deploy
```

### 查看迁移状态

```bash
npx prisma migrate status
```

## 环境迁移

如需从原 monorepo 迁移到独立后端：

1. 备份原数据库
2. 在新服务器上部署后端
3. 恢复数据库
4. 运行 `npx prisma migrate deploy` 确保 schema 一致
5. 启动后端验证 `/api/init` 返回正常
6. 修改前端连接的 API 地址指向新后端
