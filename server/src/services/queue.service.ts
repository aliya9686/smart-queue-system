import { Prisma, type Queue } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { throwAppError } from "../utils/http";
import type { CreateQueueInput } from "../validators/queue";

export async function getQueues(): Promise<Queue[]> {
  return prisma.queue.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createQueue(input: CreateQueueInput): Promise<Queue> {
  try {
    return await prisma.queue.create({
      data: {
        name: input.name,
        description: input.description,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throwAppError("QUEUE_NAME_CONFLICT", "A queue with this name already exists.", 409);
    }

    throw error;
  }
}
