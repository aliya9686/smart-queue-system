# Smart Queue System Architecture

## Purpose

The Smart Queue System is a real-time queue management application for businesses
that want to replace physical waiting lines with a digital queue.

Version 1 assumes two primary user groups:

- Customers who join a queue, track their live position, and receive status
  updates.
- Staff or admins who create queues, call the next customer, and manage queue
  flow.

This document is the source of truth for backend and frontend structure before
deeper implementation starts.

## Product Goals

- Let a customer join a queue quickly with minimal friction.
- Show live queue position, estimated wait, and ticket status.
- Let admins manage the queue in real time.
- Keep the frontend and backend aligned through a clear REST and Socket.IO
  contract.
- Support a clean future path to multi-branch or multi-service queues.

## Core Assumptions

- The first version supports one business location or one logical queue space.
- A queue may represent a service type such as billing, consultation, or pickup.
- Customers can join without a full account in version 1.
- Admin access is authenticated separately from customer queue joining.
- Real-time updates are required, so Socket.IO is part of the planned backend.

If any of these assumptions are wrong, they should be corrected before backend
build-out because they affect API shape and data modeling.

## User Roles

### Customer

- Join a queue
- View ticket details
- Track live position and estimated wait
- Leave or cancel the queue

### Staff or Admin

- Create and open a queue
- Pause or close a queue
- View waiting entries
- Call, serve, skip, complete, or cancel entries
- View queue metrics

## System Overview

The system has three major parts:

### Client

A React application that serves:

- A customer queue-join and status experience
- An admin dashboard for queue operations

The client consumes:

- REST endpoints for data fetches and state-changing actions
- Socket.IO events for real-time queue and ticket updates

### Server

A Node.js and Express API server that handles:

- Queue creation and configuration
- Customer entry creation and lookup
- Admin actions on queue entries
- Validation and business rules
- Socket broadcasting for live updates

### Realtime Layer

Socket.IO sits beside the Express HTTP API and is responsible for:

- Queue room subscriptions
- Entry room subscriptions
- Admin dashboard live updates
- Broadcasting state changes after every queue action

## High-Level Architecture

```text
[React Client]
   |\
   | \-- HTTP (REST) ----------------------\
   |                                        \
   \---- WebSocket / Socket.IO --------------> [Express + Queue Engine]
                                                 |
                                                 |-- routes
                                                 |-- controllers
                                                 |-- services
                                                 |-- sockets
                                                 |-- models
                                                 |
                                                 \-- persistent storage
```

## Main Domain Objects

### Queue

Represents a service line.

Suggested fields:

- `id`
- `name`
- `serviceCode`
- `status` as `open | paused | closed`
- `currentTicketNumber`
- `estimatedServiceMinutes`
- `createdAt`
- `updatedAt`

### Queue Entry

Represents a customer inside a queue.

Suggested fields:

- `id`
- `queueId`
- `ticketNumber`
- `customerName`
- `phone` optional
- `partySize` optional
- `notes` optional
- `status`
- `position`
- `joinedAt`
- `calledAt` optional
- `servedAt` optional
- `completedAt` optional

Suggested status values:

- `waiting`
- `called`
- `serving`
- `completed`
- `skipped`
- `cancelled`
- `no_show`

### Admin User

Represents a staff member managing the queue.

Suggested fields:

- `id`
- `name`
- `email`
- `passwordHash`
- `role`

Suggested role values:

- `admin`
- `staff`

## Queue Engine Rules

These rules should be centralized in the service layer and never duplicated
between routes and sockets.

- Only queues with `status=open` accept new entries.
- Ticket numbers are generated sequentially per queue.
- Only entries in `waiting` can be called.
- Only entries in `called` can move to `serving`.
- Only entries in `serving` can move to `completed`.
- Waiting positions are recalculated whenever an entry is created, cancelled,
  skipped, or completed.
- Estimated wait is derived from active waiting count multiplied by average
  service time.
- Every state change must emit a socket update to affected rooms.

## Backend Structure

The current backend folders already point in a good direction. They should be
used like this:

- `src/config`
  Application config, env parsing, CORS config, socket config.
- `src/routes`
  Route registration for auth, queues, entries, admin actions, and health.
- `src/controllers`
  Thin HTTP handlers that validate input and call services.
- `src/services`
  Queue engine logic, ticket generation, status transitions, metrics.
- `src/models`
  Data access models or repository adapters.
- `src/middleware`
  Auth, error handling, request validation, not-found handling.
- `src/sockets`
  Socket.IO setup, room subscriptions, and event broadcasting.
- `src/utils`
  Shared helpers such as ID generation, date math, and response formatting.

## Suggested API Areas

- `GET /api/health`
- `POST /api/admin/auth/login`
- `GET /api/queues`
- `POST /api/queues`
- `GET /api/queues/:queueId`
- `PATCH /api/queues/:queueId`
- `POST /api/queues/:queueId/join`
- `GET /api/entries/:entryId`
- `POST /api/entries/:entryId/cancel`
- `POST /api/admin/entries/:entryId/call`
- `POST /api/admin/entries/:entryId/serve`
- `POST /api/admin/entries/:entryId/complete`
- `POST /api/admin/entries/:entryId/skip`

Detailed request and response contracts live in `docs/api.md`.

## Frontend Structure

Recommended React folder structure:

```text
client/src/
  app/
  api/
  components/
  features/
    admin/
    queue/
    status/
  hooks/
  layouts/
  pages/
  routes/
  sockets/
  utils/
```

Recommended page flows:

- `/`
  Landing or queue selection
- `/join/:queueId`
  Customer join form
- `/status/:entryId`
  Customer live ticket status
- `/admin/login`
  Staff login
- `/admin/queues/:queueId`
  Admin queue dashboard

## Tech Decisions

### Frontend

- React with Vite
- React Router for routing
- Axios for HTTP calls
- Tailwind CSS for UI styling
- Socket.IO Client for realtime events

### Backend

- Node.js with Express
- Socket.IO for realtime messaging
- Environment-based config via dotenv

### Suggested Next Backend Additions

- `socket.io`
- `zod` or `joi` for validation
- `uuid` or database-generated IDs
- a persistence layer such as MongoDB, PostgreSQL, or an in-memory adapter for
  version 1

## Data Persistence Strategy

To reduce complexity, development can start with an in-memory repository behind
service interfaces.

That means:

- routes and services are written as if storage is permanent
- models or repositories abstract read and write operations
- the actual database can be swapped in later without rewriting controllers

## Non-Functional Requirements

- Queue actions should feel instant to both customer and admin views.
- A customer should not need to refresh the page to see queue movement.
- Admin actions should be idempotent or guarded against invalid repeats.
- APIs should return consistent JSON envelopes.
- All queue state changes should be auditable in a future version.

## Delivery Order

Recommended implementation order:

1. Build the Express server bootstrap, routing, error handling, and health check.
2. Build the queue engine service and in-memory data layer.
3. Add REST endpoints for queue and entry actions.
4. Add Socket.IO rooms and broadcast events.
5. Build React routes and customer status UI.
6. Build the admin queue dashboard.

## Open Decisions

These choices should be confirmed before deeper implementation:

- single queue vs multiple queues per location
- anonymous customer join vs OTP-based verification
- single admin role vs separate staff and manager permissions
- in-memory storage for prototype vs immediate database integration
