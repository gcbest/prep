import type { ReactNode } from 'react';
import { moduleForRoute } from '@/data/schedule';
import { useAppStore } from '@/store/useAppStore';
import { PriorityBadge } from './PriorityBadge';
import { ConfidenceRating } from './ConfidenceRating';
import { cls } from '@/lib/utils';

interface ModuleShellProps {
  route: string;
  children: ReactNode;
  headerExtra?: ReactNode;
}

export function ModuleShell({ route, children, headerExtra }: ModuleShellProps) {
  const meta = moduleForRoute(route);
  const progress = useAppStore((s) => s.moduleProgress[meta?.id ?? '']);
  const confidence = useAppStore((s) => s.topicConfidence[meta?.topicKey ?? ''] ?? 3);
  const setConfidence = useAppStore((s) => s.setConfidence);
  const markComplete = useAppStore((s) => s.markModuleComplete);
  const markSkipped = useAppStore((s) => s.markModuleSkipped);

  if (!meta) return <>{children}</>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{meta.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <PriorityBadge priority={meta.priority} />
              <span>≈ {meta.durationMinutes} min</span>
              {progress?.completed && (
                <span className="badge bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800">
                  Complete
                </span>
              )}
              {progress?.skipped && (
                <span className="badge bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                  Skipped
                </span>
              )}
            </div>
          </div>
          <div className="no-print flex gap-2">
            <button
              type="button"
              className={cls('btn-secondary', progress?.completed && 'ring-2 ring-green-500')}
              onClick={() => markComplete(meta.id)}
              aria-pressed={!!progress?.completed}
            >
              {progress?.completed ? '✓ Marked complete' : 'Mark complete'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => markSkipped(meta.id)} aria-pressed={!!progress?.skipped}>
              Skip
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h2 className="label">Learning objective</h2>
            <p className="text-sm">{meta.objective}</p>
          </div>
          <div className="card p-4">
            <h2 className="label">“Good enough for tomorrow” exit criteria</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {meta.exitCriteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card mt-4 p-4">
          <ConfidenceRating
            value={confidence}
            onChange={(v) => {
              setConfidence(meta.topicKey, v);
            }}
            label="Confidence in this topic"
          />
        </div>
        {headerExtra}
      </header>
      {children}
    </div>
  );
}
