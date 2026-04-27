# API

## Base URL

`/api`

## Auth endpoints

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

## Success response shape

```json
{
  "message": "Login successful.",
  "token": "jwt-token",
  "user": {
    "id": "mongo-object-id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

## Error response shape

```json
{
  "message": "Validation failed",
  "errors": [
    "Password must be at least 8 characters long."
  ]
}
```
