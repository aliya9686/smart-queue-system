# Smart Queue System

A full-stack Smart Queue Management System authentication starter built with:

- React + Context API + Axios
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt

## Folder structure

```text
smart-queue-system/
|-- client/
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   `-- src/
|       |-- api/
|       |-- components/
|       |-- context/
|       |-- pages/
|       |-- styles/
|       |-- App.jsx
|       `-- main.jsx
|-- docs/
|   |-- api.md
|   `-- architecture.md
|-- server/
|   |-- .env.example
|   |-- package.json
|   `-- src/
|       |-- config/
|       |-- controllers/
|       |-- middleware/
|       |-- models/
|       |-- routes/
|       |-- utils/
|       `-- server.js
```

## Features

- Registration and login for `admin` and `customer`
- Password hashing with `bcrypt`
- JWT authentication with one-hour expiry
- Protected API routes with role-based middleware
- React auth context with route guards and Axios interceptor
- Basic request validation and centralized error handling

## Quick start

1. Install dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

2. Create env files:

```bash
cd server && copy .env.example .env
cd ../client && copy .env.example .env
```

3. Start MongoDB locally, or point `MONGODB_URI` to your remote cluster.

4. Run the apps in separate terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

5. Open `http://localhost:5173`.

## JWT storage tradeoff

This implementation stores the JWT in `localStorage` because it is simple for SPA flows and works cleanly with Axios interceptors. The tradeoff is that tokens in `localStorage` are accessible to JavaScript, which makes them more exposed if the app ever suffers an XSS bug.

For higher-security production deployments, consider switching to `httpOnly`, `secure`, `sameSite` cookies. That reduces XSS token theft risk, but it also means you should add CSRF protection and adjust how the frontend sends authenticated requests.
