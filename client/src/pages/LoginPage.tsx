import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { LoginPayload } from "../types/auth";

const defaultValues: LoginPayload = {
  email: "",
  password: "",
};

function validateLoginForm({ email, password }: LoginPayload): string {
  if (!email.trim() || !password.trim()) {
    return "Email and password are required.";
  }

  return "";
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginPayload>(defaultValues);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value } as LoginPayload));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    const validationError = validateLoginForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel auth-panel-brand">
        <span className="eyebrow">Smart Queue System</span>
        <h1>Queue access for staff and customers.</h1>
        <p>
          Sign in to manage counters, issue tokens, or monitor your place in the
          line with real-time role-aware access.
        </p>
        <div className="info-grid">
          <article>
            <strong>Admin</strong>
            <span>Manage service desks, monitor queue load, and coordinate flow.</span>
          </article>
          <article>
            <strong>Customer</strong>
            <span>Track token progress, wait estimates, and queue visibility.</span>
          </article>
        </div>
      </section>

      <section className="auth-panel auth-panel-form">
        <div className="panel-header">
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="inline-note">
          Need an account? <Link to="/register">Create one here</Link>.
        </p>
      </section>
    </div>
  );
}
