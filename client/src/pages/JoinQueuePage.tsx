import { useParams } from 'react-router-dom';
import { SectionCard } from '../components/ui/SectionCard';

export function JoinQueuePage() {
  const { queueId } = useParams();

  return (
    <SectionCard
      eyebrow="Customer"
      title="Join Queue page"
      description="Use this page for the customer intake form, queue details, and validation before creating a ticket."
    >
      <p className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
        Active queue id: <span className="font-semibold text-cyan-300">{queueId}</span>
      </p>
    </SectionCard>
  );
}
