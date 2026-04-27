import { SectionCard } from '../components/ui/SectionCard';

export function AdminLoginPage() {
  return (
    <SectionCard
      eyebrow="Admin"
      title="Admin login page"
      description="This page is the place for staff authentication, form validation, and token handling for protected queue operations."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
          Email field
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-200">
          Password field
        </div>
      </div>
    </SectionCard>
  );
}
