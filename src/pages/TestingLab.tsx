import { ModuleShell } from '@/components/ModuleShell';
import { TEST_MAPPINGS, TESTING_ROLES, TEST_CASES, RISK_LIMIT_COMPONENT_CODE, MODEL_ANSWER_CODE, TEST_COMMENTARY, TESTING_PROMPTS, TESTING_PROMPT_ANSWERS } from '@/data/testingLab';
import { Reveal } from '@/components/Reveal';

export function TestingLab() {
  return (
    <ModuleShell route="/testing-lab">
      <section className="card mb-6 overflow-hidden">
        <h2 className="border-b border-slate-200 px-4 py-3 text-lg font-semibold dark:border-slate-700">React-to-Angular test mapping</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Mapping between React and Angular testing ecosystems</caption>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th scope="col" className="px-4 py-2 font-semibold">React ecosystem</th>
                <th scope="col" className="px-4 py-2 font-semibold">Angular ecosystem</th>
                <th scope="col" className="px-4 py-2 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {TEST_MAPPINGS.map((m) => (
                <tr key={m.react} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-2">{m.react}</td>
                  <td className="px-4 py-2 font-medium">{m.angular}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Roles, clearly separated</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {TESTING_ROLES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Required exercise: RiskLimitComponent + RiskLimitService</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          Behavior: load a risk limit by portfolio ID, show loading, render utilization %, warn at 80% and breach at 100%,
          handle zero/missing/stale/malformed data, show error + retry, and restrict acknowledgement by entitlement.
        </p>
        <Reveal label="Show the component to test">
          <pre className="overflow-x-auto rounded bg-slate-900 p-3 font-mono text-xs text-slate-100">{RISK_LIMIT_COMPONENT_CODE}</pre>
        </Reveal>

        <h3 className="mb-2 mt-4 font-semibold">Test cases to write or review</h3>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {TEST_CASES.map((t) => (
            <li key={t.id} className="rounded border border-slate-200 p-2 dark:border-slate-700">
              <p className="font-medium">{t.label}</p>
              <p className="text-xs text-slate-500">{t.hint}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Reveal label="Reveal model answer">
            <pre className="overflow-x-auto rounded bg-slate-900 p-3 font-mono text-xs text-slate-100">{MODEL_ANSWER_CODE}</pre>
          </Reveal>
        </div>

        <div className="mt-4">
          <Reveal label="Reveal commentary on test quality">
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {TEST_COMMENTARY.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-lg font-semibold">Testing interview prompts</h2>
        <div className="space-y-3">
          {TESTING_PROMPTS.map((prompt) => (
            <div key={prompt} className="rounded border border-slate-200 p-3 dark:border-slate-700">
              <p className="font-medium">{prompt}</p>
              <Reveal label="Reveal answer outline">
                <p className="text-sm">{TESTING_PROMPT_ANSWERS[prompt]}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  );
}
