import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { RegisterPayload } from "../types/auth";

const defaultValues: RegisterPayload = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

function validateRegisterForm({
  name,
  email,
  password,
  role,
}: RegisterPayload): string {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return "Name, email, and password are required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!["admin", "customer"].includes(role)) {
    return "Please choose a valid role.";
  }

  return "";
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterPayload>(defaultValues);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value } as RegisterPayload));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    const validationError = validateRegisterForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate("/dashboard", { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel auth-panel-brand">
        <span className="eyebrow">Role-based onboarding</span>
        <h1>Create a secure queue account.</h1>
        <p>
          New accounts are protected with hashed passwords, JWT access tokens,
          and role-aware routing from the first session.
        </p>
        <ul className="bullet-list">
          <li>Minimum 8-character password with uppercase, lowercase, and number.</li>
          <li>Admin accounts can access staff-only queue views.</li>
          <li>Customer accounts land on the queue tracking dashboard.</li>
        </ul>
      </section>

      <section className="auth-panel auth-panel-form">
        <div className="panel-header">
          <span className="eyebrow">Join the system</span>
          <h2>Register</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Use a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Role</span>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="inline-note">
          Already registered? <Link to="/login">Login instead</Link>.
        </p>
      </section>
    </div>
  );
}
