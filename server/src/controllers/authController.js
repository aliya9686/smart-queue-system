const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const {
  validateLoginInput,
  validateRegisterInput,
} = require("../utils/validators");

function buildAuthResponse(user) {
  return {
    token: generateToken(user._id, user.role),
    user: user.toSafeObject(),
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const errors = validateRegisterInput({ name, email, password, role });

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: "An account with that email already exists." });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: role || "customer",
  });

  return res.status(201).json({
    message: "Registration successful.",
    ...buildAuthResponse(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = validateLoginInput({ email, password });

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  user.lastLoginAt = new Date();
  await user.save();

  return res.status(200).json({
    message: "Login successful.",
    ...buildAuthResponse(user),
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user.toSafeObject(),
  });
});

const getAdminOverview = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Admin access granted.",
    queueSummary: {
      activeCounters: 4,
      waitingCustomers: 18,
      currentWindow: "Counter 2",
    },
    user: req.user.toSafeObject(),
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
  getAdminOverview,
};
