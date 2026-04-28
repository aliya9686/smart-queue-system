import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../types/auth";

export default function generateToken(userId: string, role: UserRole): string {
  return jwt.sign({ sub: userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}
