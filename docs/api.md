# Smart Queue System API Contract

## API Principles

- Base path: `/api`
- JSON request and response bodies
- Consistent error shape
- REST for durable state changes and fetches
- Socket.IO for live updates after state changes

## Response Shapes

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
    "code": "QUEUE_CLOSED",
    "message": "This queue is not accepting new entries."
  }
}
```

## REST Endpoints

### Health

#### `GET /api/health`

Checks whether the API is available.

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

### Admin Auth

#### `POST /api/admin/auth/login`

Logs in an admin or staff user.

Request:

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "jwt-or-session-token",
    "user": {
      "id": "admin_1",
      "name": "Queue Manager",
      "role": "admin"
    }
  }
}
```

### Queues

#### `GET /api/queues`

Returns visible queues.

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "queue_1",
      "name": "General Service",
      "status": "open",
      "waitingCount": 8,
      "estimatedWaitMinutes": 24
    }
  ]
}
```

#### `POST /api/queues`

Creates a queue. Admin only.

Request:

```json
{
  "name": "General Service",
  "serviceCode": "GEN",
  "estimatedServiceMinutes": 3
}
```

#### `GET /api/queues/:queueId`

Returns queue summary, counts, and current active ticket.

Response:

```json
{
  "success": true,
  "data": {
    "id": "queue_1",
    "name": "General Service",
    "status": "open",
    "waitingCount": 8,
    "calledCount": 1,
    "servingCount": 1,
    "estimatedWaitMinutes": 24,
    "currentServingTicket": "A013"
  }
}
```

#### `PATCH /api/queues/:queueId`

Updates queue metadata or status. Admin only.

Request example:

```json
{
  "status": "paused"
}
```

Supported queue status:

- `open`
- `paused`
- `closed`

### Queue Entries

#### `POST /api/queues/:queueId/join`

Creates a new queue entry for a customer.

Request:

```json
{
  "customerName": "Asha",
  "phone": "9999999999",
  "partySize": 1
}
```

Response:

```json
{
  "success": true,
  "data": {
    "entryId": "entry_1",
    "queueId": "queue_1",
    "ticketNumber": "A014",
    "status": "waiting",
    "position": 9,
    "estimatedWaitMinutes": 27
  }
}
```

#### `GET /api/entries/:entryId`

Returns a single queue entry and customer-facing status view.

Response:

```json
{
  "success": true,
  "data": {
    "id": "entry_1",
    "queueId": "queue_1",
    "ticketNumber": "A014",
    "customerName": "Asha",
    "status": "waiting",
    "position": 9,
    "estimatedWaitMinutes": 27,
    "joinedAt": "2026-04-23T10:30:00.000Z"
  }
}
```

#### `POST /api/entries/:entryId/cancel`

Cancels a customer entry if still active.

Request body:

```json
{}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "entry_1",
    "status": "cancelled"
  }
}
```

### Admin Queue Actions

#### `POST /api/admin/entries/:entryId/call`

Moves an entry from `waiting` to `called`.

#### `POST /api/admin/entries/:entryId/serve`

Moves an entry from `called` to `serving`.

#### `POST /api/admin/entries/:entryId/complete`

Moves an entry from `serving` to `completed`.

#### `POST /api/admin/entries/:entryId/skip`

Marks an entry as `skipped`.

For these actions, the response shape is:

```json
{
  "success": true,
  "data": {
    "id": "entry_1",
    "queueId": "queue_1",
    "ticketNumber": "A014",
    "status": "called"
  }
}
```

## Socket.IO Event Contract

### Room Strategy

- `queue:{queueId}`
  Everyone interested in a queue joins this room.
- `entry:{entryId}`
  A customer status page joins this room for personal updates.
- `admin:{queueId}`
  Admin dashboard joins this room for operational updates.

### Client to Server Events

#### `queue:subscribe`

Payload:

```json
{
  "queueId": "queue_1"
}
```

#### `entry:subscribe`

Payload:

```json
{
  "entryId": "entry_1"
}
```

#### `admin:subscribe`

Payload:

```json
{
  "queueId": "queue_1"
}
```

### Server to Client Events

#### `queue:snapshot`

Sent when a client first subscribes.

Payload:

```json
{
  "queueId": "queue_1",
  "status": "open",
  "waitingCount": 8,
  "estimatedWaitMinutes": 24,
  "currentServingTicket": "A013"
}
```

#### `queue:entry-joined`

Broadcast when a new customer joins.

Payload:

```json
{
  "queueId": "queue_1",
  "ticketNumber": "A014",
  "waitingCount": 9
}
```

#### `queue:positions-updated`

Broadcast when queue positions change.

Payload:

```json
{
  "queueId": "queue_1",
  "affectedEntries": [
    {
      "entryId": "entry_1",
      "position": 8
    }
  ]
}
```

#### `entry:status-changed`

Broadcast to `entry:{entryId}` whenever an entry changes state.

Payload:

```json
{
  "entryId": "entry_1",
  "queueId": "queue_1",
  "ticketNumber": "A014",
  "status": "called",
  "position": 0
}
```

#### `queue:serving-changed`

Broadcast when the active serving ticket changes.

Payload:

```json
{
  "queueId": "queue_1",
  "currentServingTicket": "A014"
}
```

#### `queue:status-changed`

Broadcast when queue open state changes.

Payload:

```json
{
  "queueId": "queue_1",
  "status": "paused"
}
```

#### `queue:metrics-updated`

Broadcast to admin dashboards.

Payload:

```json
{
  "queueId": "queue_1",
  "waitingCount": 7,
  "calledCount": 1,
  "servingCount": 1,
  "completedCount": 5
}
```

## Queue Entry State Machine

Valid transitions:

- `waiting -> called`
- `called -> serving`
- `serving -> completed`
- `waiting -> cancelled`
- `waiting -> skipped`
- `called -> skipped`
- `called -> no_show`

Invalid transitions should return a `400` or `409` style error, depending on
implementation preference.

## Suggested Error Codes

- `QUEUE_NOT_FOUND`
- `QUEUE_CLOSED`
- `ENTRY_NOT_FOUND`
- `INVALID_ENTRY_STATE`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `VALIDATION_ERROR`

## Backend Build Notes

When the backend is implemented, every state-changing REST action should:

1. validate input
2. perform the queue engine action
3. persist the updated state
4. emit related socket events
5. return the updated entity
