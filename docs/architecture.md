# Smart Queue System Architecture

## Purpose

Smart Queue System manages customer queues digitally instead of physical lines.
The current foundation supports queue definitions, token issuance, counter
assignment, and authentication bootstrap.

## Primary Actors

- Customer
  Joins a queue, authenticates if needed, and tracks token progress
- Staff
  Calls and serves customers from one or more counters
- Admin
  Configures queues and monitors queue operations

## System Components

### Frontend

- React + Vite application
- React Router for route-level separation
- Axios for HTTP communication with the backend
- Auth context and protected routes for session handling

### Backend

- Express application exposing REST APIs
- Mongoose models for persistence
- MongoDB as the primary data store
- Middleware for security headers, CORS, logging, authentication, and errors

### Data Model

- `queues`
  Metadata about each service queue
- `tokens`
  Issued queue tickets with lifecycle state
- `counters`
  Service desks and their queue assignments
- `sequences`
  Atomic token number generators partitioned by queue and service date
- `users`
  Authenticated actors with role-based access

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

## Authentication Slice

- `models/User.js`
  User schema, password hashing, and safe serialization
- `controllers/authController.js`
  Register, login, current-user lookup, and admin overview handlers
- `routes/authRoutes.js`
  Auth endpoint definitions
- `middleware/authMiddleware.js`
  JWT verification and role checks
- `client/src/context/AuthContext.jsx`
  Client auth state and session bootstrap
- `client/src/components/ProtectedRoute.jsx`
  Client-side route guarding

## Queue Design Decisions

- Queue and token data are separated to keep queue documents small.
- Tokens are partitioned logically by `queueId + serviceDate`.
- Sequence documents support atomic `$inc` token generation under concurrency.
- Indexes are tuned for:
  - fetching the next waiting token
  - fetching tokens currently being served
  - listing queue activity for a business day

## Auth Flow

1. User registers or logs in from the React client.
2. Express validates input and looks up the user in MongoDB.
3. Passwords are verified with `bcrypt`.
4. A JWT is signed and returned to the client.
5. The client stores the token and attaches it through the Axios interceptor.
6. Protected Express middleware verifies the token and attaches the user to `req.user`.
7. Role-based middleware blocks users from routes outside their allowed roles.
