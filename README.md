# Crypto Portfolio Tracker Monorepo

This repository is scaffolded for a crypto portfolio tracker with API, web app, workers, and shared packages.

## Structure
- `apps/api` — API server: routes, services, jobs, providers
- `apps/web` — Web frontend: pages, components, hooks
- `apps/worker` — Background workers: consumers and jobs
- `packages` — Shared libraries: connectors, pricing, db, types
- `infra` — Deployment manifests: docker, k8s, terraform
- `scripts` — Utility scripts
- `migrations` — Database migrations
- `tests` — Test suites
- `docs` — Documentation

## Next steps
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies with pnpm: `pnpm install`.
3. Generate Prisma client: `pnpm --filter @cpt/db prisma:generate`.
4. Ensure Postgres and Redis are running locally (see env vars).
5. Start dev servers in parallel: `pnpm dev` (API, Web, Worker).

### Packages
- `@cpt/shared` — shared types/utilities
- `@cpt/db` — Prisma client and schema
- `@cpt/pricing` — pricing providers (Coingecko)
- `@cpt/connectors-*` — exchange, wallet, on-chain stubs

### Apps
- `apps/api` — Fastify server with `/health` and `/price/:id`
- `apps/web` — Vite + React demo fetching BTC price
- `apps/worker` — BullMQ worker with a demo job

### Common commands
- `pnpm install` — install workspace deps
- `pnpm dev` — run API + Web + Worker in parallel
- `pnpm db:generate` — generate Prisma client for DB package
- `pnpm db:migrate` — run DB migrations (requires Postgres)
- `pnpm db:seed` — seed demo data into the DB
- `pnpm db:setup` — migrate + seed

## Docker Compose (Postgres + Redis)
- Start services: `docker compose up -d` or `pnpm compose:up`
- Check status: `docker compose ps` or `pnpm compose:ps`
- Tail logs: `docker compose logs -f` or `pnpm compose:logs`
- Stop services: `docker compose down` or `pnpm compose:down`

Defaults match `.env.example:1`:
- Postgres: `postgresql://postgres:postgres@localhost:5432/cpt` (db: `cpt`)
- Redis: `redis://127.0.0.1:6379`

After starting services, run: `pnpm db:setup` to migrate and seed.

## Database: Migrate and Seed
1. Ensure Postgres is running and `DATABASE_URL` in `.env` is correct.
2. Generate Prisma client: `pnpm db:generate`
3. Apply migrations: `pnpm db:migrate`
4. Seed demo data: `pnpm db:seed`

The seed creates a demo user `demo@example.com`, a demo account, and BTC/ETH holdings so the API/web can display data immediately.
