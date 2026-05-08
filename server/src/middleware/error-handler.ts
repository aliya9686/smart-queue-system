import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";

interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: string;
  details?: string[];
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      response.status(409).json({
        success: false,
        error: {
          code: "DB_UNIQUE_CONSTRAINT",
          message: "A record with these values already exists.",
        },
      });
      return;
    }

    if (error.code === "P2003" || error.code === "P2025") {
      response.status(404).json({
        success: false,
        error: {
          code: "DB_RECORD_NOT_FOUND",
          message: "Referenced record was not found.",
        },
      });
      return;
    }
  }

  const typedError = error as ErrorWithStatus;
  const statusCode = typedError.statusCode || 500;

  response.status(statusCode).json({
    success: false,
    error: {
      code: typedError.code || "INTERNAL_SERVER_ERROR",
      message: typedError.message || "Something went wrong.",
      ...(typedError.details?.length ? { details: typedError.details } : {}),
    },
  });
};
