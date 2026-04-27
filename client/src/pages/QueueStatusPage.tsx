import { useParams } from 'react-router-dom';
import { SectionCard } from '../components/ui/SectionCard';

export function QueueStatusPage() {
  const { entryId } = useParams();

  return (
    <SectionCard
      eyebrow="Customer"
      title="Queue status page"
      description="This route is ready for the live ticket screen where customers will see queue position, estimated wait, and realtime updates."
    >
      <p className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
        Tracking entry id: <span className="font-semibold text-cyan-300">{entryId}</span>
      </p>
    </SectionCard>
  );
}
