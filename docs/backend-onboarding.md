# Smart Queue System Backend Onboarding Guide

This guide is for teammates pulling the latest backend changes after a PR merge. It walks you from zero local setup to a running API in a Windows PowerShell environment.

## What You Need

- Git
- GitHub access to the repository
- Node.js
- npm
- PostgreSQL
- pgAdmin (recommended for local database management)

Recommended team baseline:

- Node.js 20 LTS or the version agreed by the team
- PostgreSQL 15 or newer

Verify your tools:

```powershell
node -v
npm -v
git --version
psql --version
```

If `psql` is not installed but PostgreSQL is installed, you can still complete the setup with pgAdmin.

## 1. After A PR Merge: Git Workflow

### Pull the latest `main`

Use this after a teammate's PR has been merged into GitHub:

```powershell
git checkout main
git pull origin main
```

What this does:

- switches you to the shared `main` branch
- downloads and applies the latest merged changes from GitHub

### Switch branches safely

To move between branches:

```powershell
git checkout main
git checkout feature/your-branch-name
```

Before switching branches, either commit your work or stash it if you have local changes you are not ready to commit yet.

### Sync your local `main` before starting new work

Always refresh `main` before creating a new feature branch:

```powershell
git checkout main
git pull origin main
```

### Create a new feature branch

Create one branch per task, bug fix, or feature:

```powershell
git checkout -b feature/xyz
```

Examples:

```powershell
git checkout -b feature/queue-status-filter
git checkout -b fix/token-sequence-race-condition
git checkout -b chore/update-api-docs
```

### Commit and push your work

Use small, focused commits:

```powershell
git add .
git commit -m "Add queue creation validation improvements"
git push -u origin feature/xyz
```

Required core commands:

```powershell
git checkout main
git pull origin main
git checkout -b feature/xyz
git add .
git commit -m "your message"
git push -u origin feature/xyz
```

### Create a Pull Request

Open a PR from your feature branch into `main` on GitHub.

PR checklist:

- pull the latest `main` first
- confirm the backend starts locally
- run Prisma commands if schema changed
- test the affected APIs
- describe database and migration impact
- mention frontend impact if request or response shapes changed

### Merge PRs safely

Before merging:

- confirm CI checks pass
- review changed files, especially `prisma/schema.prisma` and `prisma/migrations`
- verify no secrets are included
- confirm at least one reviewer approval if your team requires it

Safe team rule:

- do not commit directly to `main`
- merge only through reviewed PRs

For schema changes:

- merge the Prisma schema update and its migration folder together
- never merge a schema change without the generated migration files

## 2. Backend Setup Workflow (Windows PowerShell)

From the repository root:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Open `server/.env` and set your local database connection:

```env
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/queue_db?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
```

Then run:

```powershell
npx prisma generate
npx prisma migrate dev
npm run dev
```

If you prefer package scripts where available:

```powershell
npm run prisma:generate
npm run prisma:migrate
```

Expected result:

- Prisma Client is generated successfully
- pending migrations are applied to your local PostgreSQL database
- backend starts at `http://localhost:4000`

Useful health check:

```powershell
Invoke-RestMethod http://localhost:4000/api/health
```

Expected example:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "environment": "development",
    "database": "connected",
    "timestamp": "2026-05-07T18:30:00.000Z"
  }
}
```

## 3. PostgreSQL Setup

### Option A: Create the database with pgAdmin

1. Open pgAdmin.
2. Connect to your local PostgreSQL server.
3. Right-click `Databases`.
4. Select `Create` -> `Database`.
5. Name it `queue_db`.
6. Save.

Then use this in `server/.env`:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/queue_db?schema=public
```

### Option B: Create the database with `psql`

If `psql` is installed:

```powershell
psql -U postgres
```

Then inside the PostgreSQL shell:

```sql
CREATE DATABASE queue_db;
```

Exit with:

```sql
\q
```

### Verify PostgreSQL is running on Windows

Check the Windows service:

```powershell
Get-Service *postgres*
```

If the service is stopped, start it from the Services app or with PowerShell if you know the exact service name:

```powershell
Start-Service postgresql-x64-16
```

Service names vary by installed version, so use `Get-Service *postgres*` first.

### Verify database connectivity

Test with:

```powershell
psql -U postgres -d queue_db -h localhost -p 5432
```

If the connection succeeds, your database is ready for Prisma migrations.

### pgAdmin team usage

pgAdmin is helpful for:

- creating local databases
- inspecting tables after migrations
- checking records in `Queue`, `Token`, and `Sequence`
- reviewing migration impact visually

After running Prisma migrations, refresh the database tree in pgAdmin to confirm the tables exist.

## 4. Environment Variable Strategy

### Files and responsibilities

- `server/.env`: your private local runtime values
- `server/.env.example`: the committed template for required backend variables
- `.gitignore`: prevents secrets and machine-specific env files from being committed

### Team rules

- commit `server/.env.example`
- do not commit `server/.env`
- every teammate uses their own local PostgreSQL username, password, and JWT secret
- rotate shared secrets outside git if a secret is ever exposed

### Recommended workflow

1. Pull the latest code.
2. Copy the example file:

```powershell
cd server
Copy-Item .env.example .env -Force
```

3. Update only your local `server/.env`.
4. Never paste real credentials into PR descriptions, commits, or screenshots.

### Secret management guidance

For local development:

- keep secrets in `server/.env`

For shared environments:

- use GitHub Actions secrets, Vercel environment variables, Railway variables, Render secrets, or another managed secret store

Never store production secrets in the repository.

## 5. Prisma Setup And Team Migration Workflow

### `prisma generate`

Run this when:

- you install dependencies for the first time
- `schema.prisma` changes
- you pull a PR that changes models, enums, or relations

Command:

```powershell
cd server
npx prisma generate
```

This generates the Prisma Client used by the Express backend.

### `prisma migrate dev`

Use this in local development to apply pending migrations to your local database:

```powershell
cd server
npx prisma migrate dev
```

If there are committed migration files, Prisma will apply them locally.

If you are the developer making a schema change, create a named migration:

```powershell
npx prisma migrate dev --name add-counter-assignment
```

### Schema syncing rules for the team

- update `server/prisma/schema.prisma`
- generate a migration with `prisma migrate dev --name ...`
- commit the new migration folder
- commit any code changes that depend on that schema update
- teammates pull the branch merge, then run `npx prisma migrate dev`

### Migration sharing best practices

- never edit already-merged migration history unless the team explicitly coordinates a reset
- keep one logical database change per migration when possible
- mention database impact clearly in the PR
- if two branches change the schema at the same time, rebase or merge `main` and regenerate your migration before merging

## 6. API Testing Workflow

Start the backend first:

```powershell
cd server
npm run dev
```

### Create a queue

Endpoint:

```text
POST /api/queues
```

PowerShell example:

```powershell
$queueBody = @{
  name = "Billing"
  description = "Customer billing support queue"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:4000/api/queues `
  -ContentType "application/json" `
  -Body $queueBody
```

Sample request body:

```json
{
  "name": "Billing",
  "description": "Customer billing support queue"
}
```

Expected success response example:

```json
{
  "success": true,
  "data": {
    "id": "cmabcd1234567890",
    "name": "Billing",
    "description": "Customer billing support queue",
    "status": "ACTIVE",
    "createdAt": "2026-05-07T18:35:00.000Z",
    "updatedAt": "2026-05-07T18:35:00.000Z"
  }
}
```

### Generate a token

Endpoint:

```text
POST /api/tokens
```

PowerShell example:

```powershell
$tokenBody = @{
  queueId = "cmabcd1234567890"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:4000/api/tokens `
  -ContentType "application/json" `
  -Body $tokenBody
```

Sample request body:

```json
{
  "queueId": "cmabcd1234567890"
}
```

Expected success response example:

```json
{
  "success": true,
  "data": {
    "tokenNumber": 1
  }
}
```

### List queues

Endpoint:

```text
GET /api/queues
```

PowerShell example:

```powershell
Invoke-RestMethod http://localhost:4000/api/queues
```

### Common validation and business errors

Example validation error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      "Queue id is required."
    ]
  }
}
```

Example queue conflict error:

```json
{
  "success": false,
  "error": {
    "code": "QUEUE_NAME_CONFLICT",
    "message": "A queue with this name already exists."
  }
}
```

## 7. Collaboration Best Practices

### Branching strategy

- `main` stays deployable
- create short-lived feature branches from `main`
- use descriptive names like `feature/create-token-history` or `fix/queue-validation`

### Feature isolation

- one branch per task
- avoid mixing frontend refactors, backend logic, and schema changes in a single PR unless they are tightly related
- keep PRs reviewable and easy to test

### Avoid direct commits to `main`

- protect `main` in GitHub
- require PR review
- require checks before merge

### Migration coordination

- announce schema work early so branches do not drift
- if multiple people touch Prisma models, sync with `main` before finalizing your migration
- commit both `schema.prisma` and the generated migration directory together

### Backend and frontend sync

- if API request or response shapes change, update the frontend in the same branch or coordinate a dependent PR
- update `docs/api.md` when endpoint behavior changes
- share sample request and response payloads in the PR when contract changes happen

## 8. Optional Improvements

### Shared cloud PostgreSQL for team environments

For staging or shared QA, consider:

- Supabase PostgreSQL
- Neon PostgreSQL

These help with:

- shared integration testing
- easier onboarding when local PostgreSQL setup is a blocker
- preview environments using a real hosted database

### Suggested team workflow for shared cloud databases

- keep local PostgreSQL for daily development
- use a separate hosted database for staging or QA
- never point local development directly at production
- use different credentials and separate environment files per environment

### Deployment readiness

Before production deployment, standardize:

- a hosted PostgreSQL provider
- environment variable management
- migration execution during deploy
- health checks
- CI checks for linting, type-checking, and migration safety

For production, prefer applying migrations with a controlled deployment step instead of ad hoc local commands.

## 9. Troubleshooting

### Prisma not recognized

Problem:

- `prisma` command is not found

Fix:

```powershell
cd server
npm install
npx prisma generate
```

Use `npx prisma ...` instead of relying on a global Prisma install.

### PostgreSQL connection errors

Problem examples:

- `Can't reach database server`
- authentication failed
- connection refused on port `5432`

Fix:

- verify PostgreSQL service is running with `Get-Service *postgres*`
- confirm host, port, username, password, and database name
- test login with `psql`
- verify the database `queue_db` actually exists

### `DATABASE_URL` issues

Problem:

- Prisma fails to connect or parse the connection string

Use this format:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/queue_db?schema=public
```

Tips:

- do not wrap the value in quotes unless needed
- if your password contains special characters, URL-encode them
- make sure you edited `server/.env`, not the repository root `.env`

### Migration conflicts

Problem:

- your branch and `main` both changed Prisma schema

Fix:

```powershell
git checkout main
git pull origin main
git checkout feature/xyz
git merge main
cd server
npx prisma migrate dev
```

If migration history is already conflicting, coordinate with the teammate who merged first and regenerate your migration cleanly.

### Node version mismatch

Problem:

- install errors or unexpected runtime behavior

Fix:

- verify your version with `node -v`
- align to the team standard Node.js version
- reinstall dependencies after changing Node.js versions:

```powershell
cd server
npm install
```

### Missing dependencies

Problem:

- module not found errors after pulling latest code

Fix:

```powershell
cd server
npm install
```

Then regenerate Prisma Client:

```powershell
npx prisma generate
```

### Git merge conflicts

Problem:

- Git stops during `pull` or `merge`

Fix:

1. Open the conflicted files.
2. Resolve the conflict markers.
3. Re-test the backend if code or schema files changed.
4. Mark resolved files and commit:

```powershell
git add .
git commit -m "Resolve merge conflicts"
```

If the conflict touches `schema.prisma` or migrations, verify the database flow again before pushing.

## 10. Copy-Paste Quick Start

From a fresh clone:

```powershell
git checkout main
git pull origin main
cd server
npm install
Copy-Item .env.example .env
```

Update `server/.env`:

```env
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/queue_db?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
```

Then run:

```powershell
npx prisma generate
npx prisma migrate dev
npm run dev
```

Then test:

```powershell
Invoke-RestMethod http://localhost:4000/api/health
```

Success state for each teammate:

- repository is up to date with `main`
- local PostgreSQL is running
- `queue_db` exists
- Prisma Client is generated
- migrations are applied
- backend runs locally
- queue and token APIs can be tested
- new work happens in a feature branch through PRs
