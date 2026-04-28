import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { findAuthenticatedUserById } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";
import type { UserRole } from "../types/auth";
import { throwAppError } from "../utils/http";

interface DecodedToken extends JwtPayload {
  sub?: string;
  role?: UserRole;
}

export const protect: RequestHandler = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throwAppError(
      "UNAUTHORIZED",
      "Access denied. Authentication token is missing.",
      401,
    );
  }

  const token = authHeader.split(" ")[1];
  let decoded: DecodedToken;

  try {
    decoded = jwt.verify(token, env.jwtSecret) as DecodedToken;
  } catch (_error) {
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
