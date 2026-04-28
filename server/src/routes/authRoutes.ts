import { Router } from "express";
import {
  getAdminOverview,
  getCurrentUser,
  login,
  register,
} from "../controllers/authController";
import { authorizeRoles, protect } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateBody";
import { loginSchema, registerSchema } from "../validators/auth";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", protect, getCurrentUser);
router.get("/admin/overview", protect, authorizeRoles("admin"), getAdminOverview);

export default router;
