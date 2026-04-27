import { useParams } from 'react-router-dom';
import { SectionCard } from '../components/ui/SectionCard';

export function AdminQueueDashboardPage() {
  const { queueId } = useParams();

  return (
    <SectionCard
      eyebrow="Admin"
      title="Admin dashboard page"
      description="This route is ready for queue controls, ticket state transitions, live metrics, and socket-driven updates."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
          Queue: <span className="font-semibold text-cyan-300">{queueId}</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
          Waiting tickets panel
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
          Metrics and actions panel
        </div>
      </div>
    </SectionCard>
  );
}
