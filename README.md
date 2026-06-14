# Dashboard — Suara Kita Command Centre

Next.js 15 admin dashboard for monitoring citizen-reported issues, live metrics, and approving actions for dispatch.

## Architecture

```
Browser → Next.js (SSR + API routes) → PostgreSQL (metrics + issues)
                                       → Redis (queue push for approvals)
                                       → Maplibre GL (constituency map)
```

## Features

- **Live metrics feed** — Pending/approved/high-urgency counts, auto-polls every 15s
- **Paginated issue feed** — Filterable by urgency, status, category; entry animation for new items
- **Approval workflow** — Approve issues → updates DB status + LPUSHes to `queue:approved_actions`
- **Cyberpunk map** — Maplibre GL with custom dark theme, Pemanis + Kemelah constituency boundaries, Segamat marker
- **Background map** — Full-screen map with glass-panel UI overlay
- **Layer controls** — 30 togglable intelligence layers (placeholder-ready)

## Quick Start

```bash
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://voter_app:changeme@localhost:5433/voter_intelligence` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6380` |
| `REDIS_PASSWORD` | Redis password | `redis` |

## Tech Stack

- **Framework** — Next.js 15 (Webpack, SSR)
- **Styling** — Tailwind CSS v4 with custom cyberpunk theme
- **Database** — `postgres.js` (PostgreSQL)
- **Cache** — `ioredis` (Redis)
- **Map** — Maplibre GL with OpenFreeMap tiles

## Related Repositories

- [telegram-bot](https://github.com/Suara-Kita/telegram-bot) — Ingestion bot that pushes citizen messages to Redis
- [main-engine-processor](https://github.com/Suara-Kita/main-engine-processor) — Rust triage engine that analyzes and persists issues
