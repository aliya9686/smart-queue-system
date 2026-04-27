# Smart Queue System Flow Notes

## Queue Setup Flow

```text
Admin creates queue
  -> queue stored in MongoDB
  -> queue becomes available for token issuance
```

## Token Issuance Flow

```text
Customer selects queue
  -> backend resolves queue and current business date
  -> backend increments queue/day sequence atomically
  -> token is created with status = waiting
```

## Counter Service Flow

```text
Staff opens counter
  -> counter is assigned one or more queues
  -> staff requests next waiting token
  -> token transitions from waiting to serving
  -> counter.currentTokenId is updated
```

## Completion Flow

```text
Serving token is completed or skipped
  -> token status changes
  -> completedAt is recorded when applicable
  -> counter.currentTokenId is cleared or replaced
```
