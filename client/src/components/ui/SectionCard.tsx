import type { PropsWithChildren } from 'react';

type SectionCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export function SectionCard({
  children,
  eyebrow,
  title,
  description,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
