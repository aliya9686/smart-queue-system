import { Router } from "express";
import authRouter from "./authRoutes";
import { healthRouter } from "./health.routes";
import { queueRouter } from "./queue.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/queues", queueRouter);
apiRouter.use("/auth", authRouter);
