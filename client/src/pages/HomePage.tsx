import { Link } from 'react-router-dom';
import { SectionCard } from '../components/ui/SectionCard';
import { QueueFeatureList } from '../features/queue/components/QueueFeatureList';
import { useHealth } from '../hooks/useHealth';
import { formatRelativeTime } from '../utils/formatRelativeTime';

const starterRoutes = [
  { label: 'Join queue', path: '/join/general-service' },
  { label: 'Track ticket', path: '/status/sample-entry' },
  { label: 'Admin login', path: '/admin/login' },
  { label: 'Admin dashboard', path: '/admin/queues/general-service' },
];

export function HomePage() {
  const { data, error, loading } = useHealth();

  return (
    <div className="grid gap-8">
      <SectionCard
        eyebrow="Starter"
        title="A typed client scaffold that can grow with the queue system"
        description="React remains the UI library, and TypeScript adds safer components, hooks, API calls, and route params. That combination is the most common setup for production React apps."
      >
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm font-medium text-slate-200">
              Suggested frontend folders
            </p>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300">
{`src/
  app/
  api/
  components/
  features/
  hooks/
  layouts/
  pages/
  routes/
  types/
  utils/`}
            </pre>
          </div>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
              API check
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-100">
              <p>
                Client health function: <code>useHealth()</code>
              </p>
              <p>
                Request target: <code>/api/health</code>
              </p>
              <p>
                Status:{' '}
                {loading
                  ? 'Checking server...'
                  : error
                    ? `Unavailable (${error})`
                    : data?.status}
              </p>
              <p>
                Last response:{' '}
                {data ? formatRelativeTime(data.timestamp) : 'Waiting for response'}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Features"
        title="Folders are ready for customer and admin flows"
        description="The routes below are wired now, so we can start building real pages on top of this scaffold without reshuffling the project later."
      >
        <QueueFeatureList />
        <div className="mt-6 flex flex-wrap gap-3">
          {starterRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:border-cyan-300 hover:bg-cyan-400/10"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
