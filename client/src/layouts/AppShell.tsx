import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10">
        <header className="mb-10 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
              Smart Queue System
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              React + TypeScript frontend scaffold
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-300">
            A starter workspace for customer queue flows, live status tracking,
            and future admin operations.
          </p>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
