# Smart Queue System

Smart Queue System is a MERN stack application for managing digital queues,
issuing service tokens, and operating service counters in real time.

This repository currently covers the minimum foundation for:

- Day 1: project documentation and architecture baseline
- Day 2: React application structure and frontend scaffold
- Day 3: Express backend bootstrap, middleware, routing, and MongoDB wiring
- Day 4: MongoDB and Mongoose models for queues, tokens, counters, and
  per-day token sequences

## Repository Structure

```text
smart-queue-system/
  client/   React + Vite frontend scaffold
  server/   Express + MongoDB backend scaffold
  docs/     Project architecture, API outline, and flow notes
```

## Core Domain

- `Queue`
  Service line such as Billing, Support, or Enquiry
- `Token`
  A customer's position in a queue for a specific business day
- `Counter`
  A service desk that can serve one or more assigned queues
- `Sequence`
  Atomic per-queue, per-day counter used to generate token numbers safely

## Current Scope

Included in this foundation:

- frontend routing shell and folder structure
- backend app bootstrap and MongoDB connection handling
- queue management data models and indexes
- basic health and queue read routes

Not included yet:

- authentication and authorization
- realtime socket flows
- queue business actions such as call-next, complete, or skip
- production deployment configuration

## Quick Start

1. Create environment variables:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-queue-system
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

2. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

3. Run the applications:

```bash
cd server && npm run dev
cd client && npm run dev
```

## API Baseline

- `GET /api/health`
  Service and database readiness summary
- `GET /api/queues`
  Minimal queue list endpoint for frontend integration

For more details, see:

- [Architecture](D:/Project/smart-queue-system/docs/architecture.md)
- [API Outline](D:/Project/smart-queue-system/docs/api.md)
- [Flow Notes](D:/Project/smart-queue-system/docs/flow-diagrams.md)
