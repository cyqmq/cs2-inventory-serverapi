# CS2 Inventory Server API

后端 API 服务器，为 [CS2 Inventory Simulator 前端](https://github.com/cyqmq/cs2-inventory-Frontend) 提供数据存储、Steam 认证和业务逻辑。处理库存同步、开箱、物品合成等操作。

## 环境要求

- **Node.js** >= 24
- **PostgreSQL** — 存储库存数据的数据库

## 安装

```bash
git clone https://github.com/cyqmq/cs2-inventory-serverapi.git
cd cs2-inventory-serverapi
npm install
```

### 环境变量

复制 `.env.example` 为 `.env` 并配置：

| 变量 | 必需 | 说明 |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL 连接字符串 |
| `SESSION_SECRET` | ✅ | Session 加密密钥 |
| `STEAM_API_KEY` | ❌ | Steam Web API 密钥（用于认证） |
| `STEAM_CALLBACK_URL` | ❌ | Steam OAuth 回调地址 |

```bash
cp .env.example .env
```

推送 Prisma schema 到数据库：

```bash
npm run db:push
```

## 开发

```bash
npm run dev
```

服务器启动在 `http://localhost:3000`。

## 构建与运行

```bash
npm run build
npm start
```

## API 端点

| 方法 | 路径 | 认证 | 说明 |
|---|---|---|---|
| GET | `/healthz` | — | 健康检查 |
| GET | `/api/init` | — | 客户端初始化数据 |
| POST | `/api/sign-in` | — | API Key 登录 |
| GET | `/api/sign-in/callback` | — | Steam OAuth 回调 |
| GET | `/api/auth/electron` | — | Electron 无头认证 |
| GET | `/api/auth/electron-config` | — | Electron 获取 Steam API Key |
| POST | `/api/action/sync` | Session | 同步库存 |
| GET | `/api/action/resync` | Session | 重新同步库存 |
| GET | `/api/action/reset-inventory` | Session | 重置库存 |
| POST | `/api/action/unlock-case` | Session | 开箱 |
| POST | `/api/action/import-inspect-link` | Session | 导入检视链接 |
| GET/POST | `/api/action/preferences` | Session | 用户偏好设置 |
| GET | `/api/users` | API Key | 用户列表 |
| GET | `/api/user/:userId` | API Key | 获取单个用户 |
| POST | `/api/add-item` | API Key | 添加物品 |
| POST | `/api/add-container` | API Key | 添加容器 |
| POST | `/api/increment-item-stattrak` | API Key | 增加 StatTrak 计数器 |
| GET | `/api/inventory/:userId.json` | — | 公开库存 JSON |
| GET | `/api/equipped/v4/:userId.json` | — | 公开已装备 v4 JSON |
| GET | `/api/equipped/v5/:userId.json` | — | 公开已装备 v5 JSON |
| GET | `/translations/:language.json` | — | 翻译文件 |

## 技术栈

- **运行环境**：Node.js
- **框架**：Express + React Router v8
- **数据库**：PostgreSQL + Prisma ORM
- **认证**：Steam OAuth + API Key
- **语言**：TypeScript
