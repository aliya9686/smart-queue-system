import { Prisma, type Token } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { throwAppError } from "../utils/http";

const MAX_TOKEN_GENERATION_ATTEMPTS = 3;

export interface GeneratedTokenResult {
  id: string;
  queueId: string;
  tokenNumber: number;
  serviceDate: Date;
  status: Token["status"];
}

function getServiceDate(now = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isRetryableTransactionError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2034" || error.code === "P2002")
  );
}

export async function generateQueueToken(queueId: string): Promise<GeneratedTokenResult> {
  const serviceDate = getServiceDate();

  for (let attempt = 1; attempt <= MAX_TOKEN_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const queue = await tx.queue.findUnique({
            where: {
              id: queueId,
            },
            select: {
              id: true,
              status: true,
            },
          });

          if (!queue) {
            throwAppError("QUEUE_NOT_FOUND", "Queue not found.", 404);
          }

          if (queue.status !== "ACTIVE") {
            throwAppError("QUEUE_INACTIVE", "Cannot generate token for an inactive queue.", 409);
          }

          const sequence = await tx.sequence.upsert({
            where: {
              queueId_serviceDate: {
                queueId,
                serviceDate,
              },
            },
            create: {
              queueId,
              serviceDate,
              currentValue: 1,
            },
            update: {
              currentValue: {
                increment: 1,
              },
            },
            select: {
              currentValue: true,
            },
          });

          const token = await tx.token.create({
            data: {
              queueId,
              serviceDate,
              tokenNumber: sequence.currentValue,
            },
            select: {
              id: true,
              queueId: true,
              tokenNumber: true,
              serviceDate: true,
              status: true,
            },
          });

          return token;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (isRetryableTransactionError(error) && attempt < MAX_TOKEN_GENERATION_ATTEMPTS) {
        continue;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throwAppError("QUEUE_NOT_FOUND", "Queue not found.", 404);
      }

      throw error;
    }
  }

  throwAppError("TOKEN_GENERATION_FAILED", "Could not generate token.", 500);
}
