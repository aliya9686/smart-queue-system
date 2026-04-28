import type { RequestHandler } from "express";
import { throwAppError } from "../utils/http";

export const notFoundHandler: RequestHandler = (request) => {
  throwAppError(
    "NOT_FOUND",
    `Route not found: ${request.method} ${request.originalUrl}`,
    404,
  );
};
