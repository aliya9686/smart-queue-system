import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="page-shell not-found-shell">
      <span className="eyebrow">404</span>
      <h1>That page stepped out of the queue.</h1>
      <p>The route you requested does not exist or you may have been redirected.</p>
      <Link className="primary-button" to="/dashboard">
        Return to dashboard
      </Link>
    </main>
  );
}
