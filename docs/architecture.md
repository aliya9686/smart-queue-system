# Architecture

## Backend

The backend follows a simple MVC structure:

- `models/User.js`: Mongoose schema, password hashing, and model methods
- `controllers/authController.js`: registration, login, profile lookup, and admin-only sample action
- `routes/authRoutes.js`: auth endpoint definitions
- `middleware/authMiddleware.js`: JWT verification and role checks
- `middleware/errorMiddleware.js`: 404 and centralized error handling
- `utils/`: token creation, async wrapper, and validation helpers
- `config/db.js`: MongoDB connection bootstrap

## Frontend

The React client is organized by responsibility:

- `api/axios.js`: shared Axios instance and auth interceptors
- `context/AuthContext.jsx`: auth session state and login/register/logout actions
- `components/ProtectedRoute.jsx`: route guard and role-aware redirect logic
- `pages/`: login, register, dashboard, admin, and 404 screens
- `styles/index.css`: application styling

## Auth flow

1. User registers or logs in from the React client.
2. Express validates input and looks up the user in MongoDB.
3. Passwords are verified with `bcrypt`.
4. A JWT is signed with `JWT_SECRET` and returned to the client.
5. The client stores the token and attaches it through the Axios interceptor.
6. Protected Express middleware verifies the token and attaches the user to `req.user`.
7. Role-based middleware blocks users from routes outside their role.
