import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedUser, SafeUser, UserRecord, UserRole } from "../types/auth";

const SALT_ROUNDS = 12;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function toSafeUser(
  user: Pick<User, "id" | "name" | "email" | "role" | "lastLoginAt" | "createdAt" | "updatedAt">,
): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function findUserRecordByEmail(email: string): Promise<UserRecord | null> {
  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
  });

  return user ? { ...toSafeUser(user), passwordHash: user.passwordHash } : null;
}

export async function findAuthenticatedUserById(
  userId: string,
): Promise<AuthenticatedUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user ? toSafeUser(user) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<AuthenticatedUser> {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: normalizeEmail(input.email),
      passwordHash,
      role: input.role || "customer",
    },
  });

  return toSafeUser(user);
}

export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
