export function HomePage() {
  return (
    <section className="panel">
      <h2>Frontend Structure</h2>
      <p>
        This React app is intentionally minimal but production-oriented. It now
        has a clear routing shell, page folders, layout separation, and a place
        for API and feature modules.
      </p>
      <pre>{`src/
  app/        app composition
  api/        HTTP clients and request helpers
  components/ reusable UI building blocks
  features/   business-specific UI and logic
  hooks/      shared React hooks
  layouts/    shared page shells
  pages/      route-level screens
  routes/     router configuration
  styles/     global styling
  utils/      shared helpers`}</pre>
    </section>
  );
}
