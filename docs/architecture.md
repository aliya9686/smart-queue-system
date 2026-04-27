# Smart Queue System Architecture

## Purpose

Smart Queue System manages customer queues digitally instead of physical lines.
The first backend foundation supports queue definitions, token issuance, and
counter assignment.

## Primary Actors

- Customer
  Joins a queue and tracks token progress
- Staff
  Calls and serves customers from one or more counters
- Admin
  Configures queues and monitors queue operations

## System Components

### Frontend

- React + Vite application
- React Router for route-level separation
- Axios for HTTP communication with the backend

### Backend

- Express application exposing REST APIs
- Mongoose models for persistence
- MongoDB as the primary data store
- Middleware for security headers, CORS, logging, and error responses

### Data Model

- `queues`
  Metadata about each service queue
- `tokens`
  Issued queue tickets with lifecycle state
- `counters`
  Service desks and their queue assignments
- `sequences`
  Atomic token number generators partitioned by queue and service date

## High-Level Flow

```text
[React Client]
    |
    +-- HTTP /api/* --------------------------+
                                              |
                                    [Express Application]
                                              |
                           +------------------+------------------+
                           |                  |                  |
                      [Routes]           [Middleware]       [Services]
                                              |
                                          [Mongoose]
                                              |
                                          [MongoDB]
```

## Backend Structure

```text
server/src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
```

## Design Decisions

- Queue and token data are separated to keep queue documents small.
- Tokens are partitioned logically by `queueId + serviceDate`.
- Sequence documents support atomic `$inc` token generation under concurrency.
- Indexes are tuned for:
  - fetching the next waiting token
  - fetching tokens currently being served
  - listing queue activity for a business day

## Non-Goals For This Stage

- full queue engine business rules
- authentication
- websocket event delivery
- analytics and reporting pipelines
