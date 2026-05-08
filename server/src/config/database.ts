import { prisma } from "../lib/prisma";
import { env } from "./env";

let databaseState = "disconnected";

export async function connectDatabase(): Promise<void> {
  databaseState = "connecting";

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    databaseState = "connected";
  } catch (error) {
    databaseState = "disconnected";
    throw error;
  }
}

export function getDatabaseState(): string {
  if (databaseState === "connected" && !env.databaseUrl) {
    return "disconnected";
  }

  return databaseState;
}
