import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { throwAppError } from "../utils/http";

export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (request, _response, next) => {
    const parsed = schema.safeParse(request.body);

    if (!parsed.success) {
      throwAppError(
        "VALIDATION_ERROR",
        "Validation failed.",
        400,
        parsed.error.issues.map((issue) => issue.message),
      );
    }

    request.body = parsed.data;
    next();
  };
}
