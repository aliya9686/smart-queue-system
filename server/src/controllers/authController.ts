import asyncHandler from "../utils/asyncHandler";
import generateToken from "../utils/generateToken";
import {
  createUser,
  findUserRecordByEmail,
  toSafeUser,
  updateLastLogin,
  verifyPassword,
} from "../services/auth.service";
import type { AuthenticatedUser } from "../types/auth";
import type { LoginInput, RegisterInput } from "../validators/auth";
import { sendSuccess, throwAppError } from "../utils/http";
import { env } from "../config/env";
import type { Response } from "express";

/** Cookie TTL must stay in sync with JWT expiry.  Default: 1 hour. */
const COOKIE_MAX_AGE_MS = parseDurationMs(env.jwtExpiresIn) ?? 60 * 60 * 1000;

function parseDurationMs(value: string): number | null {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return null;
  const n = Number(match[1]);
  const map: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (map[match[2]] ?? 0);
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

function buildUser(user: AuthenticatedUser) {
  return toSafeUser(user);
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body as RegisterInput;
  const existingUser = await findUserRecordByEmail(email);

  if (existingUser) {
    throwAppError("CONFLICT", "An account with that email already exists.", 409);
  }

  const user = await createUser({ name, email, password, role });
  const token = generateToken(user.id, user.role);
  setAuthCookie(res, token);

  return sendSuccess(res, { user: buildUser(user) }, 201);
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

  const token = generateToken(user.id, user.role);
  setAuthCookie(res, token);

  return sendSuccess(res, { user: buildUser(user) });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
  });
  return sendSuccess(res, { message: "Logged out successfully." });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user! });
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
