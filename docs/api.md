# Smart Queue System API Outline

## Base Path

`/api`

## Response Shape

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong."
  }
}
```

## Current Foundation Endpoints

### `GET /api/health`

Purpose:
- verify the API is alive
- verify whether PostgreSQL is connected

### `GET /api/queues`

Purpose:
- provide a minimal queue list for frontend integration

## Auth Endpoints

### `POST /api/auth/register`

Registers a new user.

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass1",
  "role": "customer"
}
```

### `POST /api/auth/login`

Authenticates an existing user and returns a JWT.

```json
{
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```

### `GET /api/auth/me`

Protected endpoint. Requires:

```http
Authorization: Bearer <jwt-token>
```

### `GET /api/auth/admin/overview`

Protected admin-only endpoint used to demonstrate role-based access control.

### Auth success response

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    }
  }
}
```

### Validation error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      "Password must be at least 8 characters long."
    ]
  }
}
```

## Planned Resource Areas

- `queues`
  Queue creation and administration
- `tokens`
  Token creation, lookup, and lifecycle
- `counters`
  Counter assignment and currently served token state

## Error Conventions

- `VALIDATION_ERROR`
- `NOT_FOUND`
- `DATABASE_UNAVAILABLE`
- `INTERNAL_SERVER_ERROR`
