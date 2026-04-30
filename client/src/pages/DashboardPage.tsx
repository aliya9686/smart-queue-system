import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { logout, user } = useAuth();

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Authenticated session</span>
          <h1>Queue dashboard</h1>
        </div>
        <div className="topbar-actions">
          {user?.role === "admin" ? (
            <Link className="ghost-button" to="/admin">
              Admin panel
            </Link>
          ) : null}
          <button className="ghost-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="glass-card spotlight-card">
          <span className="eyebrow">Signed in as</span>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <div className="role-chip">{user?.role}</div>
        </article>

        <article className="glass-card">
          <span className="eyebrow">Queue status</span>
          <h3>Live line health</h3>
          <ul className="metric-list">
            <li>
              <strong>12</strong>
              <span>Customers currently waiting</span>
            </li>
            <li>
              <strong>07 min</strong>
              <span>Estimated next call window</span>
            </li>
            <li>
              <strong>C-104</strong>
              <span>Current token being served</span>
            </li>
          </ul>
        </article>

        <article className="glass-card">
          <span className="eyebrow">Session details</span>
          <h3>Security snapshot</h3>
          <ul className="detail-list">
            <li>Role-aware route access is enforced in the client and API.</li>
            <li>JWT tokens expire after one hour by default.</li>
            <li>Passwords are stored as bcrypt hashes in PostgreSQL via Prisma.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
