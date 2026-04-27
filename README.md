# Smart Queue System

Smart Queue System is a MERN stack application for managing digital queues,
issuing service tokens, and operating service counters in real time.

This branch currently combines:

- Day 1 to Day 4 project foundation work
- a React authentication flow for `admin` and `customer`
- an Express + MongoDB backend scaffold
- Mongoose models for queues, tokens, counters, token sequences, and users

## Repository Structure

```text
smart-queue-system/
  client/   React + Vite frontend
  server/   Express + MongoDB backend
  docs/     Architecture, API outline, and flow notes
```

## Implemented Foundation

- frontend routing shell and page structure
- authentication context, protected routes, login, and register flows
- backend app bootstrap, middleware, and MongoDB connection handling
- queue, token, counter, sequence, and user models
- auth APIs and basic queue read endpoints

## Quick Start

1. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

2. Create an environment file from the example:

```bash
copy .env.example .env
```

3. Ensure MongoDB is running locally, or point `MONGODB_URI` to a remote
   cluster.

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
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/admin/overview`

## Documentation

- [Architecture](docs/architecture.md)
- [API Outline](docs/api.md)
- [Flow Notes](docs/flow-diagrams.md)
