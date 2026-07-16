# CS2 Inventory Server API

Backend API server for [CS2 Inventory Simulator](https://github.com/cyqmq/cs2-inventory-simulator). Handles inventory sync, case unboxing, Steam authentication, and data persistence.

## Prerequisites

- **Node.js** >= 24
- **PostgreSQL** — database for storing inventory data

## Setup

```bash
git clone https://github.com/cyqmq/cs2-inventory-serverapi.git
cd cs2-inventory-serverapi
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | Session encryption secret |
| `STEAM_API_KEY` | ❌ | Steam Web API key (for auth) |
| `STEAM_CALLBACK_URL` | ❌ | Steam OAuth callback URL |

```bash
cp .env.example .env
```

Push the Prisma schema to your database:

```bash
npm run db:push
```

## Development

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

## Build & Run

```bash
npm run build
npm start
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/healthz` | — | Health check |
| GET | `/api/init` | — | Client initialization data |
| POST | `/api/sign-in` | — | Sign in with API key |
| GET | `/api/sign-in/callback` | — | Steam OAuth callback |
| GET | `/api/auth/electron` | — | Electron headless auth |
| GET | `/api/auth/electron-config` | — | Electron Steam API key config |
| POST | `/api/action/sync` | Session | Sync inventory |
| GET | `/api/action/resync` | Session | Re-sync inventory |
| GET | `/api/action/reset-inventory` | Session | Reset inventory |
| POST | `/api/action/unlock-case` | Session | Unlock a case |
| POST | `/api/action/import-inspect-link` | Session | Import inspect link |
| GET/POST | `/api/action/preferences` | Session | User preferences |
| GET | `/api/users` | API Key | List users |
| GET | `/api/user/:userId` | API Key | Get user by ID |
| POST | `/api/add-item` | API Key | Add item to user |
| POST | `/api/add-container` | API Key | Add container to user |
| POST | `/api/increment-item-stattrak` | API Key | Increment StatTrak counter |
| GET | `/api/inventory/:userId.json` | — | Public inventory JSON |
| GET | `/api/equipped/v4/:userId.json` | — | Public equipped v4 JSON |
| GET | `/api/equipped/v5/:userId.json` | — | Public equipped v5 JSON |
| GET | `/translations/:language.json` | — | Translation files |

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express + React Router v8
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Steam OAuth + API Key
- **Language**: TypeScript
