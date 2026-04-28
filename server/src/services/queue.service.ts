import type { Queue } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function getQueues(): Promise<Queue[]> {
  return prisma.queue.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
