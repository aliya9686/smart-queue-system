import asyncHandler from "../utils/asyncHandler";
import generateToken from "../utils/generateToken";
import {
  createUser,
  findUserRecordByEmail,
  toSafeUser,
  updateLastLogin,
  verifyPassword,
} from "../services/auth.service";
import type { AuthenticatedUser, SafeUser } from "../types/auth";
import type { LoginInput, RegisterInput } from "../validators/auth";
import { sendSuccess, throwAppError } from "../utils/http";

function buildAuthResponse(user: AuthenticatedUser): { token: string; user: SafeUser } {
  return {
    token: generateToken(user.id, user.role),
    user: toSafeUser(user),
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body as RegisterInput;
  const existingUser = await findUserRecordByEmail(email);

  if (existingUser) {
    throwAppError("CONFLICT", "An account with that email already exists.", 409);
  }

  const user = await createUser({
    name,
    email,
    password,
    role,
  });

  return sendSuccess(res, buildAuthResponse(user), 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as LoginInput;
  const user = await findUserRecordByEmail(email);

  if (!user) {
    throwAppError("UNAUTHORIZED", "Invalid email or password.", 401);
  }

  const isMatch = await verifyPassword(password, user.passwordHash);

  if (!isMatch) {
    throwAppError("UNAUTHORIZED", "Invalid email or password.", 401);
  }

  await updateLastLogin(user.id);
  user.lastLoginAt = new Date();

  return sendSuccess(res, buildAuthResponse(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    user: req.user!,
  });
});

export const getAdminOverview = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    message: "Admin access granted.",
    queueSummary: {
      activeCounters: 4,
      waitingCustomers: 18,
      currentWindow: "Counter 2",
    },
    user: req.user!,
  });
});
