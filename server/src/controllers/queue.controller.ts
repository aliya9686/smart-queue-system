import type { RequestHandler } from "express";
import { getQueues } from "../services/queue.service";
import { sendSuccess } from "../utils/http";

export const listQueues: RequestHandler = async (_request, response, next) => {
  try {
    const queues = await getQueues();
    sendSuccess(response, queues);
  } catch (error) {
    next(error);
  }
};
