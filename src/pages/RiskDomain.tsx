import { useState } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import { SECURITY_CARDS, RISK_VOCABULARY, RISK_UI_IMPLICATIONS } from '@/data/securityRisk';
import { Reveal } from '@/components/Reveal';
import { cls } from '@/lib/utils';

export function RiskDomain() {
  const [openCard, setOpenCard] = useState<string | null>(null);

  return (
    <ModuleShell route="/risk-domain">
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Security checklist (active recall)</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          For each card, answer four questions before revealing: threat, UI mitigation, server enforcement, test/monitor.
        </p>
        <div className="space-y-3">
          {SECURITY_CARDS.map((card) => (
            <div key={card.id} className="card p-4">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenCard(openCard === card.id ? null : card.id)}
                aria-expanded={openCard === card.id}
              >
                <span className="text-base font-semibold">{card.title}</span>
                <span aria-hidden>{openCard === card.id ? '▾' : '▸'}</span>
              </button>
              {openCard === card.id && (
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="font-medium">Threat</dt><dd>{card.threat}</dd></div>
                  <div><dt className="font-medium">Browser/UI mitigation</dt><dd>{card.uiMitigation}</dd></div>
                  <div><dt className="font-medium">Server enforcement</dt><dd>{card.serverEnforcement}</dd></div>
                  <div><dt className="font-medium">Test/monitor</dt><dd>{card.testMonitor}</dd></div>
                </dl>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Risk-domain primer</h2>
          <ul className="space-y-1 text-sm">
            {RISK_VOCABULARY.map((v) => (
              <li key={v.term}>
                <span className="font-medium">{v.term}</span> — {v.definition}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">UI implications</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {RISK_UI_IMPLICATIONS.map((i) => (
              <li key={i} className={cls('leading-relaxed')}>{i}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="card mt-6 p-4">
        <Reveal label="Reveal the four-question security drill">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>What is the threat?</li>
            <li>What is the browser/UI mitigation?</li>
            <li>What must the server enforce?</li>
            <li>How would the control be tested or monitored?</li>
          </ol>
        </Reveal>
      </div>
    </ModuleShell>
  );
}
