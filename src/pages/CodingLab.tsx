import { useState } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import { CODING_EXERCISES, CODING_RUBRIC } from '@/data/codingLab';
import { useAppStore } from '@/store/useAppStore';
import { Reveal } from '@/components/Reveal';
import { useTimer, formatClock } from '@/lib/useTimer';
import { cls } from '@/lib/utils';

function PrimaryTimer() {
  const timer = useTimer(45 * 60, true);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Primary exercise timer</span>
      <span className="font-mono text-lg tabular-nums" role="timer">{formatClock(timer.seconds)}</span>
      <button type="button" onClick={timer.toggle} className="btn-secondary !px-2 !py-1">{timer.running ? 'Pause' : 'Start'}</button>
      <button type="button" onClick={timer.reset} className="btn-secondary !px-2 !py-1">Reset</button>
    </div>
  );
}

export function CodingLab() {
  const notes = useAppStore((s) => s.codingNotes);
  const setNotes = useAppStore((s) => s.setCodingNotes);
  const [scores, setScores] = useState<Record<string, number>>({});

  return (
    <ModuleShell route="/coding-lab" headerExtra={<div className="mt-4 card p-3"><PrimaryTimer /></div>}>
      <div className="space-y-6">
        {CODING_EXERCISES.map((ex) => (
          <section key={ex.id} className="card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{ex.title}</h2>
              <span className="badge bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                ≈ {ex.timeMinutes} min
              </span>
              {ex.fallback && <span className="badge bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-800">Fallback</span>}
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{ex.summary}</p>

            <h3 className="mt-3 font-medium">Requirements</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {ex.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            <div className="mt-3">
              <Reveal label="Reveal hints">
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {ex.hints.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {ex.starter && (
              <div className="mt-3">
                <Reveal label="Show starter code">
                  <pre className="overflow-x-auto rounded bg-slate-900 p-3 font-mono text-xs text-slate-100">{ex.starter}</pre>
                </Reveal>
              </div>
            )}

            {ex.modelSolution && (
              <div className="mt-3">
                <Reveal label="Show model solution">
                  <pre className="overflow-x-auto rounded bg-slate-900 p-3 font-mono text-xs text-slate-100">{ex.modelSolution}</pre>
                </Reveal>
              </div>
            )}
          </section>
        ))}
      </div>

      <section className="card mt-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Candidate notes</h2>
        <p className="mb-2 text-sm text-slate-500">Sketch your approach, code, or questions. Saved locally.</p>
        <textarea
          className="input min-h-[160px] font-mono text-sm"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Your plan / code / open questions…"
          aria-label="Coding notes"
        />
      </section>

      <section className="card mt-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Coding rubric (self-score 0–2)</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CODING_RUBRIC.map((cat) => (
            <li key={cat} className="flex items-center justify-between gap-2 rounded border border-slate-200 p-2 dark:border-slate-700">
              <span className="text-sm">{cat}</span>
              <div className="flex gap-1" role="group" aria-label={`${cat} score`}>
                {[0, 1, 2].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScores((prev) => ({ ...prev, [cat]: n }))}
                    aria-pressed={scores[cat] === n}
                    className={cls('h-7 w-7 rounded border text-sm', scores[cat] === n ? 'border-navy-700 bg-navy-700 text-white' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800')}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </ModuleShell>
  );
}
