# Smart Queue System

Smart Queue System is a real-time queue management app with separate customer
and admin experiences.

## Planned Product Scope

- Customers join a queue digitally and track live position updates.
- Staff or admins manage the queue from a dashboard.
- Queue state changes are reflected in real time through Socket.IO.

## Workspace Structure

- `client`
  React app for customer and admin UI
- `server`
  Express API and realtime backend
- `docs`
  Architecture, API contract, and flow documentation

## Key Docs

- `docs/architecture.md`
  System design, roles, entities, and tech decisions
- `docs/api.md`
  REST endpoints and Socket.IO event contract
- `docs/flow-diagrams.md`
  Text-based lifecycle and interaction flows

## Current Direction

The project is being built in this order:

1. Write the real system docs and contracts.
2. Build the Express backend and queue engine.
3. Build React routes and queue screens against the agreed API.
