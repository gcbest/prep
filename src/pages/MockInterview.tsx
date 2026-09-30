import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleShell } from '@/components/ModuleShell';
import { MOCK_SECTIONS, MOCK_RED_FLAGS, type MockSection } from '@/data/mockInterview';
import { QUESTION_BANK } from '@/data/questions';
import type { InterviewQuestion } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { ConfidenceRating } from '@/components/ConfidenceRating';
import { Reveal } from '@/components/Reveal';
import { useTimer, formatClock } from '@/lib/useTimer';
import { cls } from '@/lib/utils';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(section: MockSection, avoid: string[]): string[] {
  let chosen = shuffle(section.questionIds).slice(0, section.count);
  for (let attempt = 0; attempt < 8; attempt++) {
    const same = chosen.length === avoid.length && chosen.every((id, i) => id === avoid[i]);
    if (!same) break;
    chosen = shuffle(section.questionIds).slice(0, section.count);
  }
  return chosen;
}

function MockQuestion({ question, section }: { question: InterviewQuestion; section: MockSection }) {
  const record = useAppStore((s) => s.recordQuestionResult);
  const [complete, setComplete] = useState(false);
  const [confidence, setConfidence] = useState(3);
  const [status, setStatus] = useState<'missed' | 'partial' | 'strong'>('partial');
  const [saved, setSaved] = useState(false);

  return (
    <div className="card p-4">
      <p className="font-semibold">{question.prompt}</p>
      {question.reactBridge && <p className="mt-1 text-sm text-slate-500">React bridge: {question.reactBridge}</p>}
      <p className="mt-2 text-xs text-slate-400">≈ {question.estimatedMinutes} min · {question.category}</p>

      {!complete ? (
        <button type="button" className="btn-primary mt-3" onClick={() => setComplete(true)}>
          Mark response complete
        </button>
      ) : (
        <div className="mt-3">
          <Reveal label="Reveal strong-answer outline and rubric">
            <p className="mb-1 font-medium">Section rubric</p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {section.rubric.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mb-1 mt-3 font-medium">Strong answer points</p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {question.strongAnswerPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {question.redFlags.length > 0 && (
              <>
                <p className="mb-1 mt-3 font-medium text-red-700 dark:text-red-300">Red flags</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-red-800 dark:text-red-200">
                  {question.redFlags.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <ConfidenceRating value={confidence} onChange={setConfidence} label="Confidence" />
            <div>
              <span className="label">Self-score</span>
              <div className="flex gap-2">
                {(['missed', 'partial', 'strong'] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setStatus(s)} aria-pressed={status === s} className={cls('btn-secondary capitalize', status === s && 'ring-2 ring-navy-500')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary mt-3"
            disabled={saved}
            onClick={() => {
              record(question.id, { status, confidence, answeredAt: new Date().toISOString(), notes: `mock:${section.id}` });
              setSaved(true);
            }}
          >
            {saved ? 'Saved to review queue' : 'Save to review queue'}
          </button>
        </div>
      )}
    </div>
  );
}

function MockSectionView({
  section,
  selection,
  onRegenerate,
}: {
  section: MockSection;
  selection: string[];
  onRegenerate: () => void;
}) {
  const timer = useTimer(section.minutes * 60, true);
  const questions = selection
    .map((id) => QUESTION_BANK.find((q) => q.id === id))
    .filter((q): q is InterviewQuestion => Boolean(q));

  return (
    <section className="card mb-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <p className="text-sm text-slate-500">{section.instruction}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{section.minutes} min</span>
          <span className="font-mono text-lg tabular-nums" role="timer">{formatClock(timer.seconds)}</span>
          <button type="button" onClick={timer.toggle} className="btn-secondary !px-2 !py-1">{timer.running ? 'Pause' : 'Start'}</button>
          <button type="button" onClick={timer.reset} className="btn-secondary !px-2 !py-1">Reset</button>
          <button type="button" onClick={onRegenerate} className="btn-secondary !px-2 !py-1">↻ Shuffle</button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {questions.map((q) => (
          <MockQuestion key={q.id} question={q} section={section} />
        ))}
      </div>
    </section>
  );
}

export function MockInterview() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(MOCK_SECTIONS.map((s) => [s.id, pick(s, [])])),
  );
  const [previous, setPrevious] = useState<Record<string, string[]>>({});

  const regenerate = (section: MockSection) => {
    const avoid = previous[section.id] ?? [];
    const next = pick(section, avoid);
    setPrevious((prev) => ({ ...prev, [section.id]: selections[section.id] ?? [] }));
    setSelections((prev) => ({ ...prev, [section.id]: next }));
  };

  return (
    <ModuleShell route="/mock-interview">
      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Before you start — red flags</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {MOCK_RED_FLAGS.map((r) => (
            <li key={r} className="rounded bg-red-50 px-2 py-1 text-red-800 dark:bg-red-900/30 dark:text-red-200">{r}</li>
          ))}
        </ul>
      </section>

      {MOCK_SECTIONS.map((section) => (
        <MockSectionView
          key={section.id}
          section={section}
          selection={selections[section.id] ?? []}
          onRegenerate={() => regenerate(section)}
        />
      ))}

      <section className="card p-4">
        <h2 className="mb-2 text-lg font-semibold">Finish the mock</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          Weak responses were saved to your review queue. Do not rely on automatic grading — the rubric is for honest
          self-assessment.
        </p>
        <button type="button" className="btn-primary" onClick={() => navigate('/review')}>
          Open final review queue
        </button>
      </section>
    </ModuleShell>
  );
}
