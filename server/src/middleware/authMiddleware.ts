import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { findAuthenticatedUserById } from "../services/auth.service";
import type { UserRole } from "../types/auth";
import { throwAppError } from "../utils/http";
import asyncHandler from "../utils/asyncHandler";

interface DecodedToken extends JwtPayload {
  sub?: string;
  role?: UserRole;
}

/**
 * Reads the JWT from the `access_token` httpOnly cookie first.
 * Falls back to the `Authorization: Bearer <token>` header so that
 * API clients (for example Postman or mobile apps) still work during migration.
 */
export const protect: RequestHandler = asyncHandler(async (req, _res, next) => {
  // 1. Cookie (preferred - set by the server, not readable by JS)
  let token: string | undefined = req.cookies?.access_token;

  // 2. Bearer header fallback (migration / non-browser clients)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    throwAppError(
      "UNAUTHORIZED",
      "Access denied. Authentication token is missing.",
      401,
    );
  }

  let decoded: DecodedToken;

  try {
    decoded = jwt.verify(token, env.jwtSecret) as DecodedToken;
  } catch {
    throwAppError("UNAUTHORIZED", "Invalid or expired token.", 401);
  }

  if (!decoded.sub) {
    throwAppError("UNAUTHORIZED", "Invalid or expired token.", 401);
  }

  const user = await findAuthenticatedUserById(decoded.sub);

  if (!user) {
    throwAppError(
      "UNAUTHORIZED",
      "The token is valid but the user no longer exists.",
      401,
    );
  }

  req.user = user;
  next();
});

export function authorizeRoles(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      throwAppError("UNAUTHORIZED", "Authentication is required.", 401);
    }

    if (!roles.includes(req.user.role)) {
      throwAppError(
        "FORBIDDEN",
        "You do not have permission to access this resource.",
        403,
      );
    }

    next();
  };
}
