import { Router } from "express";
import { createQueueHandler, listQueues } from "../controllers/queue.controller";
import { validateBody } from "../middleware/validateBody";
import { createQueueSchema } from "../validators/queue";

export const queueRouter = Router();

queueRouter.post("/", validateBody(createQueueSchema), createQueueHandler);
queueRouter.get("/", listQueues);
