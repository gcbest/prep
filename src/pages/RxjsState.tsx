import { useState } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import { RXJS_SCENARIOS, STATE_CATEGORIES, NGRX_CONCEPTS } from '@/data/rxjsScenarios';
import { Reveal } from '@/components/Reveal';
import { cls } from '@/lib/utils';

function ScenarioDrill({ id }: { id: string }) {
  const scenario = RXJS_SCENARIOS.find((s) => s.id === id)!;
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected != null;

  return (
    <div className="card p-4">
      <h3 className="text-base font-semibold">{scenario.title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{scenario.scenario}</p>
      <p className="mt-2 text-xs text-slate-500">Select the operator before revealing the trade-offs.</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={`${scenario.title} operator options`}>
        {scenario.options.map((opt) => {
          const isCorrect = opt === scenario.correctOperator;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(opt)}
              disabled={answered}
              aria-pressed={selected === opt}
              className={cls(
                'btn-secondary font-mono text-xs',
                answered && isCorrect && '!border-green-500 !bg-green-50 ring-2 ring-green-500 dark:!bg-green-900/30',
                answered && selected === opt && !isCorrect && '!border-red-500 !bg-red-50 ring-2 ring-red-500 dark:!bg-red-900/30',
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3">
          {selected === scenario.correctOperator ? (
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">Correct.</p>
          ) : (
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Not quite — the answer is {scenario.correctOperator}.
            </p>
          )}
          <Reveal label="Reveal answer and trade-offs">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="font-medium">Cancellation</dt><dd>{scenario.cancellation}</dd></div>
              <div><dt className="font-medium">Ordering</dt><dd>{scenario.ordering}</dd></div>
              <div><dt className="font-medium">Error boundary</dt><dd>{scenario.errorBoundary}</dd></div>
              <div><dt className="font-medium">Cleanup</dt><dd>{scenario.cleanup}</dd></div>
            </dl>
            <p className="mt-2">{scenario.explanation}</p>
          </Reveal>
        </div>
      )}
    </div>
  );
}

export function RxjsState() {
  return (
    <ModuleShell route="/rxjs-state">
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Operator scenario drills</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          For each drill, pick the operator, then check cancellation, ordering, error boundary, and cleanup.
        </p>
      </section>
      <div className="space-y-4">
        {RXJS_SCENARIOS.map((s) => (
          <ScenarioDrill key={s.id} id={s.id} />
        ))}
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">State classification</h2>
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
            Classify state before choosing a tool. There is no single right store for everything.
          </p>
          <ul className="space-y-2 text-sm">
            {STATE_CATEGORIES.map((c) => (
              <li key={c.id}>
                <p className="font-medium">{c.label}</p>
                <p className="text-slate-500">Examples: {c.examples}</p>
                <p className="text-slate-500">Home: {c.home}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">NgRx mini-module</h2>
          <ul className="space-y-2 text-sm">
            {NGRX_CONCEPTS.map((c) => (
              <li key={c.name}>
                <p className="font-medium">{c.name}</p>
                <p className="text-slate-500">{c.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100">
            Rule of thumb: ephemeral UI and form state stay local; reach for NgRx when many features share eventful,
            auditable state with real side effects.
          </div>
        </div>
      </section>
    </ModuleShell>
  );
}
