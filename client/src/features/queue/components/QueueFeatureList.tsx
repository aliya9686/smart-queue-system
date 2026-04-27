const queueFeatures = [
  'Customer join form with queue selection',
  'Live queue status view powered by Socket.IO updates',
  'Admin login and queue control dashboard',
  'Typed API layer for queue and ticket operations',
];

export function QueueFeatureList() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {queueFeatures.map((feature) => (
        <li
          key={feature}
          className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-4 py-4 text-sm text-slate-200"
        >
          {feature}
        </li>
      ))}
    </ul>
  );
}
