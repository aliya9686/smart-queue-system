import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { logout } = useAuth();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOverview() {
      try {
        const response = await api.get("/auth/admin/overview");
        setOverview(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load admin overview.");
      }
    }

    loadOverview();
  }, []);

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Admin workspace</span>
          <h1>Queue operations panel</h1>
        </div>
        <div className="topbar-actions">
          <Link className="ghost-button" to="/dashboard">
            Back to dashboard
          </Link>
          <button className="ghost-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="dashboard-grid">
        <article className="glass-card spotlight-card">
          <span className="eyebrow">Protected API result</span>
          <h2>{overview?.message || "Loading..."}</h2>
          <p>Only authenticated admins can reach this view and the matching backend route.</p>
        </article>

        <article className="glass-card">
          <span className="eyebrow">Counters</span>
          <h3>{overview?.queueSummary?.activeCounters ?? "--"}</h3>
          <p>Active service counters</p>
        </article>

        <article className="glass-card">
          <span className="eyebrow">Waiting</span>
          <h3>{overview?.queueSummary?.waitingCustomers ?? "--"}</h3>
          <p>Customers currently waiting</p>
        </article>

        <article className="glass-card">
          <span className="eyebrow">Current window</span>
          <h3>{overview?.queueSummary?.currentWindow ?? "--"}</h3>
          <p>Desk serving the live queue token</p>
        </article>
      </section>
    </main>
  );
}
