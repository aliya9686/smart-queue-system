import { Router } from "express";
import { listQueues } from "../controllers/queue.controller";

export const queueRouter = Router();

queueRouter.get("/", listQueues);
