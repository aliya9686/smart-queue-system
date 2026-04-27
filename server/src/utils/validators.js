const allowedRoles = ["admin", "customer"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterInput({ name, email, password, role }) {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  if (!email || !emailPattern.test(email.trim().toLowerCase())) {
    errors.push("A valid email address is required.");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (password && !/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }

  if (password && !/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter.");
  }

  if (password && !/[0-9]/.test(password)) {
    errors.push("Password must include at least one number.");
  }

  if (role && !allowedRoles.includes(role)) {
    errors.push("Role must be either admin or customer.");
  }

  return errors;
}

function validateLoginInput({ email, password }) {
  const errors = [];

  if (!email || !emailPattern.test(email.trim().toLowerCase())) {
    errors.push("A valid email address is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return errors;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
