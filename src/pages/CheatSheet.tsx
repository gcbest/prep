import { useMemo } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import {
  CHEAT_SHEET_SECTIONS, RAPID_FIRE_ANSWERS, WHY_CITI_TEMPLATE, WHY_CITI_WARNINGS, QUESTIONS_TO_ASK,
} from '@/data/cheatSheet';
import { useAppStore } from '@/store/useAppStore';
import { lowestConfidenceQuestions } from '@/store/selectors';
import { Reveal } from '@/components/Reveal';
import { cls } from '@/lib/utils';

export function CheatSheet() {
  const questionResults = useAppStore((s) => s.questionResults);
  const stories = useAppStore((s) => s.stories);
  const whyCiti = useAppStore((s) => s.whyCiti);
  const setWhyCiti = useAppStore((s) => s.setWhyCiti);
  const selectedQuestions = useAppStore((s) => s.selectedInterviewerQuestions);
  const toggleQuestion = useAppStore((s) => s.toggleInterviewerQuestion);

  const weakest = useMemo(() => lowestConfidenceQuestions(questionResults, 5), [questionResults]);

  const copyMarkdown = async () => {
    const lines: string[] = ['# Risk UI Interview Sprint — Cheat Sheet', ''];
    for (const section of CHEAT_SHEET_SECTIONS) {
      lines.push(`## ${section.title}`);
      for (const b of section.bullets) lines.push(`- ${b.replace(/\*\*/g, '')}`);
      lines.push('');
    }
    lines.push('## My stories');
    stories
      .filter((s) => s.required && s.result)
      .forEach((s) => lines.push(`- ${s.title}: ${s.result.slice(0, 140)}`));
    lines.push('');
    lines.push('## Why Citi ERT?');
    lines.push(whyCiti || '(not written yet)');
    lines.push('');
    lines.push('## Questions to ask');
    selectedQuestions.forEach((q) => lines.push(`- ${q}`));
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      window.alert('Copied as Markdown.');
    } catch {
      window.alert('Copy failed — your browser blocked clipboard access.');
    }
  };

  return (
    <ModuleShell route="/cheat-sheet">
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => window.print()}>Print</button>
        <button type="button" className="btn-secondary" onClick={copyMarkdown}>Copy as Markdown</button>
      </div>

      <div className="print-area space-y-6">
        <section>
          <h2 className="mb-3 text-xl font-bold">Fixed high-value content</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CHEAT_SHEET_SECTIONS.map((section) => (
              <div key={section.id} className="card p-3">
                <h3 className="mb-1 font-semibold">{section.title}</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {section.bullets.map((b) => (
                    <li key={b}>{b.replace(/\*\*/g, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Rapid-fire answer outlines</h2>
          <div className="space-y-3">
            {RAPID_FIRE_ANSWERS.map((item) => (
              <div key={item.title}>
                <p className="font-medium">{item.title}</p>
                <ul className="list-disc space-y-0.5 pl-5 text-sm">
                  {item.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">My STAR-L stories</h2>
          <ul className="space-y-1 text-sm">
            {stories.filter((s) => s.required).map((s) => (
              <li key={s.id}>
                <span className="font-medium">{s.title}</span>
                {s.result ? ` — ${s.result.slice(0, 140)}${s.result.length > 140 ? '…' : ''}` : ' — (not written)'}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Five lowest-confidence questions</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {weakest.map(({ question, result }) => (
              <li key={question.id}>
                <span className="font-medium">{question.prompt}</span>
                <span className="text-slate-500"> · {result ? `${result.status} (${result.confidence}/5)` : 'not answered'}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Why Citi ERT?</h2>
          <div className="no-print mb-2">
            <Reveal label="Show fill-in framework">
              <pre className="overflow-x-auto rounded bg-slate-900 p-3 font-mono text-xs text-slate-100">{WHY_CITI_TEMPLATE}</pre>
            </Reveal>
          </div>
          <textarea
            className="input min-h-[120px]"
            value={whyCiti}
            onChange={(e) => setWhyCiti(e.target.value)}
            placeholder="Write your honest, specific answer…"
            aria-label="Why Citi ERT answer"
          />
          <div className="no-print mt-2">
            <p className="mb-1 text-sm font-medium text-red-700 dark:text-red-300">Avoid</p>
            <ul className="list-disc space-y-0.5 pl-5 text-sm text-red-800 dark:text-red-200">
              {WHY_CITI_WARNINGS.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Questions to ask Citi</h2>
          <p className="mb-2 text-sm text-slate-500 no-print">Select the questions you plan to ask.</p>
          <ul className="space-y-1 text-sm">
            {QUESTIONS_TO_ASK.map((q) => (
              <li key={q.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={q.id}
                  checked={selectedQuestions.includes(q.text)}
                  onChange={() => toggleQuestion(q.text)}
                  className="mt-0.5"
                />
                <label htmlFor={q.id} className={cls(selectedQuestions.includes(q.text) && 'font-medium')}>
                  {q.text} <span className="text-xs uppercase text-slate-400">[{q.category}]</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ModuleShell>
  );
}
