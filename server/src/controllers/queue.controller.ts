import { createQueue, getQueues } from "../services/queue.service";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess } from "../utils/http";
import type { CreateQueueInput } from "../validators/queue";

export const createQueueHandler = asyncHandler(async (request, response) => {
  const queue = await createQueue(request.body as CreateQueueInput);
  return sendSuccess(response, queue, 201);
});

export const listQueues = asyncHandler(async (_request, response) => {
  const queues = await getQueues();
  return sendSuccess(response, queues);
});
