import { useState } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import { CONCEPT_CARDS, ANGULAR_SECTIONS, type ConceptCard } from '@/data/angularBridge';
import { Markdown } from '@/lib/markdown';
import { useTimer, formatClock } from '@/lib/useTimer';
import { Reveal } from '@/components/Reveal';

function ExplainAloud() {
  const timer = useTimer(90, true);
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
      <span className="text-xs font-medium text-slate-500">Explain aloud</span>
      <span className="font-mono text-sm tabular-nums" role="timer" aria-live="off">
        {formatClock(timer.seconds)}
      </span>
      <button type="button" onClick={timer.toggle} className="rounded border border-slate-300 px-1.5 py-0.5 text-xs" aria-label={timer.running ? 'Pause' : 'Start'}>
        {timer.running ? '⏸' : '▶'}
      </button>
      <button type="button" onClick={timer.reset} className="rounded border border-slate-300 px-1.5 py-0.5 text-xs" aria-label="Reset">
        ↺
      </button>
    </div>
  );
}

function ConceptCardView({ card }: { card: ConceptCard }) {
  return (
    <article className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="grid flex-1 gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">React</p>
            <p className="font-semibold">{card.react}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">Angular</p>
            <p className="font-semibold">{card.angular}</p>
          </div>
        </div>
        <ExplainAloud />
      </div>

      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-500">Similarity</dt>
          <dd>{card.similarity}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Critical difference</dt>
          <dd className="text-slate-700 dark:text-slate-200">{card.criticalDifference}</dd>
        </div>
      </dl>

      <div className="mt-3">
        <Reveal label="Reveal interview-ready explanation, example, and trap">
          <div className="space-y-3">
            <p>{card.explanation}</p>
            <div>
              <p className="font-medium">Example</p>
              <pre className="mt-1 overflow-x-auto rounded bg-slate-900 p-3 font-mono text-xs text-slate-100">{card.example}</pre>
            </div>
            <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
              <p className="font-semibold">Trap question</p>
              <p>{card.trap}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export function AngularBridge() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <ModuleShell route="/angular-bridge">
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">React → Angular concept cards</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Use React as a bridge, but treat each analogy as a translation with known breakdowns — not an identity.
        </p>
      </div>

      <div className="space-y-4">
        {CONCEPT_CARDS.map((card) => (
          <ConceptCardView key={card.id} card={card} />
        ))}
      </div>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-semibold">Required Angular depth</h2>
        <div className="space-y-3">
          {ANGULAR_SECTIONS.map((section) => (
            <div key={section.id} className="card p-4">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                aria-expanded={openSection === section.id}
              >
                <span className="text-base font-semibold">{section.title}</span>
                <span aria-hidden>{openSection === section.id ? '▾' : '▸'}</span>
              </button>
              {openSection === section.id && (
                <div className="mt-3">
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {section.bullets.map((b) => (
                      <li key={b}>
                        <Markdown>{b}</Markdown>
                      </li>
                    ))}
                  </ul>
                  {section.prompt && (
                    <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/30">
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Prompt</p>
                      <p className="text-sm">{section.prompt}</p>
                      {section.promptGuidance && (
                        <Reveal label="Reveal diagnostic approach">
                          <ul className="list-disc space-y-1 pl-5 text-sm">
                            {section.promptGuidance.map((g) => (
                              <li key={g}>{g}</li>
                            ))}
                          </ul>
                        </Reveal>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  );
}
