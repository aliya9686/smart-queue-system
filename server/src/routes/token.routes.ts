import { Router } from "express";
import { generateTokenHandler } from "../controllers/token.controller";
import { validateBody } from "../middleware/validateBody";
import { generateTokenSchema } from "../validators/token";

export const tokenRouter = Router();

tokenRouter.post("/", validateBody(generateTokenSchema), generateTokenHandler);
