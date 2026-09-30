import { useState } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import { FLAWED_CODE, REVIEW_FINDINGS, REVIEW_CATEGORIES, REVIEW_SEVERITIES, REVIEW_MODEL_ANSWER } from '@/data/codeReview';
import { Reveal } from '@/components/Reveal';
import { cls } from '@/lib/utils';

const severityStyles: Record<string, string> = {
  block: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800',
  fix: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800',
  schedule: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-800',
  optional: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
};

export function CodeReview() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');

  const toggle = (id: string) => {
    setFound((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visible = REVIEW_FINDINGS.filter((f) => filter === 'all' || f.severity === filter);

  return (
    <ModuleShell route="/code-review">
      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">The code to review</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          Review this deliberately flawed component as a senior lead. Find material risk first; do not dump a style list.
        </p>
        <pre className="overflow-x-auto rounded bg-slate-900 p-3 font-mono text-xs text-slate-100">{FLAWED_CODE}</pre>
      </section>

      <section className="card mb-6 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Findings ({found.size}/{REVIEW_FINDINGS.length} found)</h2>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Filter findings by severity">
            <button type="button" onClick={() => setFilter('all')} className={cls('btn-secondary !px-2 !py-1 text-xs', filter === 'all' && 'ring-2 ring-navy-500')}>All</button>
            {REVIEW_SEVERITIES.map((s) => (
              <button key={s.id} type="button" onClick={() => setFilter(s.id)} className={cls('btn-secondary !px-2 !py-1 text-xs', filter === s.id && 'ring-2 ring-navy-500')}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {visible.map((f) => (
            <div key={f.id} className={cls('rounded border p-3', found.has(f.id) ? 'border-green-300 bg-green-50/60 dark:border-green-800 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700')}>
              <div className="flex flex-wrap items-start gap-2">
                <input
                  type="checkbox"
                  id={`finding-${f.id}`}
                  checked={found.has(f.id)}
                  onChange={() => toggle(f.id)}
                  className="mt-1"
                  aria-label={`Mark ${f.title} as found`}
                />
                <div className="min-w-0 flex-1">
                  <label htmlFor={`finding-${f.id}`} className="font-medium">{f.title}</label>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span className={`badge ${severityStyles[f.severity]}`}>{REVIEW_SEVERITIES.find((s) => s.id === f.severity)?.label}</span>
                    <span className="badge bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">{f.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{f.detail}</p>
                  <p className="mt-1 text-sm">
                    <span className="font-medium text-green-700 dark:text-green-300">Fix:</span> {f.fix}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-lg font-semibold">Categories and priorities</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {REVIEW_CATEGORIES.map((c) => (
            <span key={c} className="badge bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">{c}</span>
          ))}
        </div>
        <Reveal label="Reveal model review answer">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {REVIEW_MODEL_ANSWER.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Reveal>
      </section>
    </ModuleShell>
  );
}
