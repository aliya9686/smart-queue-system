# Smart Queue System

Smart Queue System is a full-stack application for managing digital queues,
issuing service tokens, and operating service counters in real time.

This branch currently combines:

- Day 1 to Day 4 project foundation work
- a React authentication flow for `admin` and `customer`
- an Express + TypeScript backend
- Prisma + PostgreSQL persistence for queues, tokens, counters, token sequences, and users

## Repository Structure

```text
smart-queue-system/
  client/   React + Vite frontend
  server/   Express + Prisma + PostgreSQL backend
  docs/     Architecture, API outline, and flow notes
```

## Implemented Foundation

- frontend routing shell and page structure
- authentication context, protected routes, login, and register flows
- backend app bootstrap, middleware, and PostgreSQL connection handling
- Prisma schema for queue, token, counter, sequence, and user resources
- queue and token APIs with validation and transaction-safe token sequencing
- auth APIs and health checks

## Quick Start

1. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

2. Create an environment file from the example:

```bash
copy server\.env.example server\.env
```

3. Ensure PostgreSQL is running locally and set `DATABASE_URL` inside
   `server/.env`.

4. Run the applications in separate terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

5. Open:

- frontend: `http://localhost:5173`
- backend health check: `http://localhost:4000/api/health`

## Current API Baseline

- `GET /api/health`
- `GET /api/queues`
- `POST /api/queues`
- `POST /api/tokens`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/admin/overview`

## Documentation

- [Architecture](docs/architecture.md)
- [API Outline](docs/api.md)
- [Backend Onboarding](docs/backend-onboarding.md)
- [Flow Notes](docs/flow-diagrams.md)
