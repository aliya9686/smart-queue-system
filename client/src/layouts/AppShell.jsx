import { Link, Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Smart Queue System</p>
          <h1>Day 1-4 frontend foundation</h1>
        </div>
        <nav className="app-nav">
          <Link to="/">Home</Link>
          <Link to="/status/sample-token">Token Status</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
