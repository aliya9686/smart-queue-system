import type { ErrorRequestHandler } from "express";

interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: string;
  details?: string[];
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
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
