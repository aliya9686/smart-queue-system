import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "../types/api";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const details = error.response?.data?.error?.details;

    if (details?.length) {
      return details.join(" ");
    }

    return error.response?.data?.error?.message || error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
}
