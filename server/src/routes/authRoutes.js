const express = require("express");

const {
  getAdminOverview,
  getCurrentUser,
  login,
  register,
} = require("../controllers/authController");
const { authorizeRoles, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.get("/admin/overview", protect, authorizeRoles("admin"), getAdminOverview);

module.exports = router;
