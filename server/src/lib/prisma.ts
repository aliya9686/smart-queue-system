import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

declare global {
  var __smartQueuePrisma__: PrismaClient | undefined;
}

export const prisma =
  global.__smartQueuePrisma__ ||
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.databaseUrl }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__smartQueuePrisma__ = prisma;
}
