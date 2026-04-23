# Smart Queue System Flow Diagrams

## Queue Lifecycle

```text
Queue Created
   |
   v
Open
   |\
   | \-- Pause Queue --> Paused -- Resume --> Open
   |
   \-- Close Queue --> Closed
```

## Customer Queue Entry Lifecycle

```text
Customer submits join form
   |
   v
Entry Created
   |
   v
Waiting
   |\
   | \-- customer cancels ----------> Cancelled
   | \
   |  \-- admin skips --------------> Skipped
   |   \
   |    \-- admin calls ------------> Called
   |                                  |\
   |                                  | \-- admin marks no-show --> No Show
   |                                  |  \
   |                                  |   \-- admin skips --------> Skipped
   |                                  |    \
   |                                  |     \-- admin starts -----> Serving
   |                                  |                           |
   |                                  |                           v
   |                                  |                        Completed
   v
Position updates in real time while waiting
```

## Customer Join Flow

```text
Open queue list
   |
   v
Select queue
   |
   v
Submit name and optional details
   |
   v
POST /api/queues/:queueId/join
   |
   v
Receive entryId + ticketNumber + position
   |
   v
Open status page
   |
   v
Subscribe to entry:{entryId} and queue:{queueId}
   |
   v
Receive live position and status changes
```

## Admin Queue Operation Flow

```text
Admin logs in
   |
   v
Open queue dashboard
   |
   v
Subscribe to admin:{queueId}
   |
   v
View waiting entries
   |
   +--> Call next entry ------> entry status becomes Called
   |
   +--> Start service --------> entry status becomes Serving
   |
   +--> Complete service -----> entry status becomes Completed
   |
   +--> Skip entry -----------> entry status becomes Skipped
   |
   \--> Pause or close queue -> queue status changes
```

## REST and Socket Interaction

```text
Admin presses "Call Next"
   |
   v
HTTP request to backend
   |
   v
Queue service validates current state
   |
   v
Entry status changes
   |
   +--> REST response returns updated entry
   |
   +--> Socket emits entry:status-changed to entry room
   |
   +--> Socket emits queue:metrics-updated to admin room
   |
   \--> Socket emits queue:positions-updated to queue room
```

## Suggested Frontend Routes

```text
/                    -> queue list or landing page
/join/:queueId       -> customer join form
/status/:entryId     -> customer live status screen
/admin/login         -> admin login
/admin/queues/:id    -> admin queue dashboard
```
