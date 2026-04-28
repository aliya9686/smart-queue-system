import type { RequestHandler } from "express";
import { env } from "../config/env";
import { getDatabaseState } from "../config/database";
import { sendSuccess } from "../utils/http";

export const getHealth: RequestHandler = (_request, response) => {
  sendSuccess(response, {
    status: "ok",
    environment: env.nodeEnv,
    database: getDatabaseState(),
    timestamp: new Date().toISOString(),
  });
};
