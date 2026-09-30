import { useMemo, useState } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import {
  SYSTEM_DESIGN_PROMPT, DESIGN_PHASES, REQUIREMENT_CHECKLIST, ARCHITECTURE_AREAS,
  MF_OPTIONS, MF_AXES, MF_MATRIX, MF_TEACHING_POINT, MERMAID_HIGH_LEVEL, MERMAID_SEQUENCE,
  SEQUENCE_ADDITIONS, DESIGN_RUBRIC,
} from '@/data/systemDesign';
import { useAppStore } from '@/store/useAppStore';
import { Mermaid } from '@/lib/Mermaid';
import { Reveal } from '@/components/Reveal';
import { useTimer, formatClock } from '@/lib/useTimer';
import { cls } from '@/lib/utils';

export function SystemDesign() {
  const designNotes = useAppStore((s) => s.designNotes);
  const setDesignNotes = useAppStore((s) => s.setDesignNotes);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [matrix, setMatrix] = useState(MF_MATRIX);
  const [highLevel, setHighLevel] = useState(MERMAID_HIGH_LEVEL);
  const [sequence, setSequence] = useState(MERMAID_SEQUENCE);

  const timer = useTimer(45 * 60, true);
  const elapsed = 45 * 60 - timer.seconds;
  const currentPhase = useMemo(() => {
    let acc = 0;
    for (const p of DESIGN_PHASES) {
      acc += p.minutes * 60;
      if (elapsed < acc) return p.phase;
    }
    return DESIGN_PHASES[DESIGN_PHASES.length - 1].phase;
  }, [elapsed]);

  const cycleCell = (optionId: string, axisId: string) => {
    setMatrix((prev) => {
      const next = { ...prev, [optionId]: { ...prev[optionId] } };
      next[optionId][axisId] = (next[optionId][axisId] % 5) + 1;
      return next;
    });
  };

  return (
    <ModuleShell route="/system-design">
      <section className="card mb-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Main prompt</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Phase timer</span>
            <span className="font-mono text-lg tabular-nums" role="timer">{formatClock(timer.seconds)}</span>
            <button type="button" onClick={timer.toggle} className="btn-secondary !px-2 !py-1">{timer.running ? 'Pause' : 'Start'}</button>
            <button type="button" onClick={timer.reset} className="btn-secondary !px-2 !py-1">Reset</button>
          </div>
        </div>
        <p className="mt-3 text-base font-medium">{SYSTEM_DESIGN_PROMPT}</p>

        <div className="mt-4 grid gap-1 sm:grid-cols-2">
          {DESIGN_PHASES.map((p) => (
            <div key={p.phase} className={cls('flex justify-between rounded px-2 py-1 text-sm', currentPhase === p.phase ? 'bg-navy-700 font-medium text-white' : 'bg-slate-100 dark:bg-slate-800')}>
              <span>{p.phase}</span>
              <span className="tabular-nums">{p.minutes} min</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Requirement checklist</h2>
        <p className="mb-2 text-sm text-slate-500">Ask about these before drawing boxes.</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {REQUIREMENT_CHECKLIST.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5" checked={checked.has(r)} onChange={() => setChecked((prev) => { const n = new Set(prev); if (n.has(r)) n.delete(r); else n.add(r); return n; })} aria-label={r} />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Expected architecture areas</h2>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {ARCHITECTURE_AREAS.map((a) => (
            <li key={a.area}>
              <p className="font-medium">{a.area}</p>
              <p className="text-slate-500">{a.notes}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Micro-frontend decision matrix</h2>
        <p className="mb-2 text-sm text-slate-500">Click a cell to rate 1 (low) – 5 (high). Defaults are teaching opinions, not dogma.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Micro-frontend options compared across decision axes</caption>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th scope="col" className="px-2 py-2">Option</th>
                {MF_AXES.map((a) => (
                  <th key={a.id} scope="col" className="px-2 py-2 text-xs font-medium">{a.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MF_OPTIONS.map((opt) => (
                <tr key={opt.id} className="border-t border-slate-200 dark:border-slate-700">
                  <th scope="row" className="px-2 py-2 text-left font-medium">{opt.label}</th>
                  {MF_AXES.map((axis) => {
                    const value = matrix[opt.id]?.[axis.id] ?? 1;
                    return (
                      <td key={axis.id} className="px-1 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => cycleCell(opt.id, axis.id)}
                          className={cls(
                            'h-8 w-8 rounded text-xs font-semibold',
                            value >= 5 ? 'bg-red-500 text-white' :
                            value === 4 ? 'bg-amber-400 text-white' :
                            value === 3 ? 'bg-amber-200 text-slate-800' :
                            value === 2 ? 'bg-sky-200 text-slate-800' :
                            'bg-slate-200 text-slate-600',
                          )}
                          aria-label={`${opt.label} ${axis.label}: ${value} of 5`}
                        >
                          {value}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
          {MF_TEACHING_POINT}
        </p>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Mermaid diagrams (editable)</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="label" htmlFor="mermaid-high-level">High-level components</label>
            <textarea id="mermaid-high-level" className="input min-h-[180px] font-mono text-xs" value={highLevel} onChange={(e) => setHighLevel(e.target.value)} />
            <div className="mt-2"><Mermaid code={highLevel} /></div>
          </div>
          <div>
            <label className="label" htmlFor="mermaid-sequence">Sequence</label>
            <textarea id="mermaid-sequence" className="input min-h-[220px] font-mono text-xs" value={sequence} onChange={(e) => setSequence(e.target.value)} />
            <div className="mt-2"><Mermaid code={sequence} /></div>
          </div>
        </div>
        <div className="mt-3">
          <p className="mb-1 font-medium">Add to the sequence diagram:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {SEQUENCE_ADDITIONS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Candidate notes</h2>
        <textarea className="input min-h-[140px]" value={designNotes} onChange={(e) => setDesignNotes(e.target.value)} placeholder="Your architecture sketch and trade-off notes…" aria-label="Design notes" />
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-lg font-semibold">Design rubric (score 0–2 each)</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {DESIGN_RUBRIC.map((r) => (
            <li key={r} className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">{r}</li>
          ))}
        </ul>
        <div className="mt-3">
          <Reveal label="Reveal what a strong answer covers">
            <p className="text-sm">
              Clarify personas and freshness first, draw domain-aligned features behind an Angular shell and BFF, place
              authorization on the server, show "as of" timestamps and partial-failure states, add correlation IDs and
              observability, deploy immutable artifacts with flags and rollback, and close by justifying (or rejecting)
              micro-frontends from team ownership and release independence.
            </p>
          </Reveal>
        </div>
      </section>
    </ModuleShell>
  );
}
