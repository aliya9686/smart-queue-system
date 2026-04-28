import type { Response } from "express";
import type { ApiSuccess } from "../types/api";
import { AppError } from "./app-error";

export function sendSuccess<T>(
  response: Response,
  data: T,
  statusCode = 200,
): Response<ApiSuccess<T>> {
  return response.status(statusCode).json({
    success: true,
    data,
  });
}

export function throwAppError(
  code: string,
  message: string,
  statusCode = 500,
  details?: string[],
): never {
  throw new AppError(message, statusCode, code, details);
}
