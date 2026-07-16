# CS2 Inventory Server API

后端 API 服务器，为 [CS2 Inventory Simulator 前端](https://github.com/cyqmq/cs2-inventory-Frontend) 提供数据存储、Steam 认证和业务逻辑。

支持两种运行模式：**纯 API 模式** 和 **含 Web 前端模式**。

## 环境要求

- **Node.js** >= 24
- **PostgreSQL**

## 安装

```bash
git clone https://github.com/cyqmq/cs2-inventory-serverapi.git
cd cs2-inventory-serverapi
npm install
```

### 环境变量

```bash
cp .env.example .env
```

| 变量 | 必需 | 说明 |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL 连接字符串 |
| `SESSION_SECRET` | ✅ | Session 加密密钥 |
| `STEAM_API_KEY` | ❌ | Steam Web API 密钥 |
| `STEAM_CALLBACK_URL` | ❌ | Steam OAuth 回调地址 |
| `API_MODE` | ❌ | 设为 `true` 启用纯 API 模式 |

### 初始化数据库

```bash
npm run db:push
```

## 两种运行模式

### 纯 API 模式

仅提供 JSON API，不托管任何静态文件或 HTML。非 `/api/*` 和 `/healthz` 的路径一律返回 404。

```bash
npm run build:api
npm run start:api
```

### Web 模式（默认）

API + SSR + 静态文件服务。适合一体部署前后端。

```bash
npm run build
npm start
```

## 项目结构

```
app/
├── api/              纯 API 逻辑
│   ├── middleware/    认证、库存迁移等中间件
│   ├── models/        数据模型（用户、规则、凭证）
│   ├── preferences/   偏好处理（语言、背景）
│   ├── routines/      定时任务（失效重置、规则初始化）
│   ├── data/          服务端数据（viewer.server）
│   └── utils/         服务端工具（shapes.server, rate-limiter）
├── web/              Web UI 模块（仅 Web 模式使用）
│   ├── root.tsx       HTML 壳
│   ├── root-meta.ts  Meta 标签
│   ├── globals.ts    全局状态
│   └── app.ts        EventTarget
├── shared/           共享代码
│   ├── data/          数据定义（api-urls, sync, backgrounds, languages）
│   ├── utils/         工具函数（economy, shapes, inventory, misc）
│   └── translations/  27 种语言翻译
├── routes/            React Router 路由（框架必需）
├── entry.server.tsx   服务端入口（mode-aware）
├── entry.client.tsx   客户端入口
├── root.tsx           代理到 web/root.tsx
└── routes.ts          路由注册（mode-aware）
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
| GET | `/api/action/resync` | Session | 重新同步 |
| GET | `/api/action/reset-inventory` | Session | 重置库存 |
| POST | `/api/action/unlock-case` | Session | 开箱 |
| POST | `/api/action/import-inspect-link` | Session | 导入检视链接 |
| GET/POST | `/api/action/preferences` | Session | 偏好设置 |
| GET | `/api/users` | API Key | 用户列表 |
| GET | `/api/user/:userId` | API Key | 获取用户 |
| POST | `/api/add-item` | API Key | 添加物品 |
| POST | `/api/add-container` | API Key | 添加容器 |
| POST | `/api/increment-item-stattrak` | API Key | StatTrak 递增 |
| GET | `/api/inventory/:userId.json` | — | 公共库存 JSON |
| GET | `/api/equipped/v4/:userId.json` | — | 已装备 v4 JSON |
| GET | `/api/equipped/v5/:userId.json` | — | 已装备 v5 JSON |
| GET | `/translations/:language.json` | — | 翻译文件 |

## 脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 开发模式（Web） |
| `npm run dev:api` | 开发模式（纯 API） |
| `npm run build` | 生产构建（Web） |
| `npm run build:api` | 生产构建（纯 API） |
| `npm start` | 启动（Web） |
| `npm run start:api` | 启动（纯 API） |
| `npm run db:push` | 推送 Prisma schema |
| `npm run db:generate` | 生成 Prisma client |
| `npm run db:migrate` | 部署迁移 |
| `npm run typecheck` | 类型检查 |
| `npm run lint` | ESLint 检查 |

## 技术栈

- **运行环境**：Node.js
- **框架**：Express + React Router v8
- **数据库**：PostgreSQL + Prisma ORM
- **认证**：Steam OAuth + API Key
- **语言**：TypeScript