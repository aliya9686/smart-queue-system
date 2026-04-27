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
- verify whether MongoDB is connected

Example response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "environment": "development",
    "database": "connected"
  }
}
```

### `GET /api/queues`

Purpose:
- provide a minimal queue list for frontend integration

Example response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "680e3a1f1b2c3d4e5f6a0001",
      "name": "Billing",
      "description": "Billing support queue",
      "status": "active",
      "createdAt": "2026-04-27T10:00:00.000Z",
      "updatedAt": "2026-04-27T10:00:00.000Z"
    }
  ]
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
