import { ModuleShell } from '@/components/ModuleShell';
import { DEVOPS_STAGES, DEVOPS_TEACHING_POINTS, DEVOPS_RAPID_FIRE } from '@/data/devopsControls';
import { Reveal } from '@/components/Reveal';

export function DevOpsControls() {
  return (
    <ModuleShell route="/devops-controls">
      <section className="card mb-6 p-4">
        <h2 className="mb-3 text-lg font-semibold">Build to production</h2>
        <ol className="space-y-2">
          {DEVOPS_STAGES.map((stage) => (
            <li key={stage.step} className="flex gap-3 rounded border border-slate-200 p-2 dark:border-slate-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">{stage.step}</span>
              <div>
                <p className="font-medium">{stage.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{stage.detail}</p>
                <p className="text-xs text-slate-500">Why: {stage.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Important teaching points</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {DEVOPS_TEACHING_POINTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="card p-4">
        <h2 className="mb-2 text-lg font-semibold">Rapid-fire prompts</h2>
        <div className="space-y-3">
          {DEVOPS_RAPID_FIRE.map((item) => (
            <div key={item.question} className="rounded border border-slate-200 p-3 dark:border-slate-700">
              <p className="font-medium">{item.question}</p>
              <Reveal label="Reveal answer">
                <p className="text-sm">{item.answer}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </ModuleShell>
  );
}
