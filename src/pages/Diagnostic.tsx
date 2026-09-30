import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { ModuleShell } from '@/components/ModuleShell';
import { DIAGNOSTIC_QUESTIONS, DIAGNOSTIC_SELF_RATING } from '@/data/cheatSheet';
import { TOPIC_LABELS } from '@/data/schedule';
import { ConfidenceRating } from '@/components/ConfidenceRating';
import { Reveal } from '@/components/Reveal';
import { cls } from '@/lib/utils';

type ShortScore = 'strong' | 'partial' | 'missed';

export function Diagnostic() {
  const navigate = useNavigate();
  const confidence = useAppStore((s) => s.topicConfidence);
  const setConfidence = useAppStore((s) => s.setConfidence);
  const markComplete = useAppStore((s) => s.markModuleComplete);

  const [mcAnswers, setMcAnswers] = useState<Record<string, number>>({});
  const [shortScores, setShortScores] = useState<Record<string, ShortScore>>({});
  const [applied, setApplied] = useState(false);

  const mcStats = useMemo(() => {
    let correct = 0;
    let answered = 0;
    for (const q of DIAGNOSTIC_QUESTIONS) {
      if (q.type !== 'multiple') continue;
      if (mcAnswers[q.id] != null) {
        answered++;
        if (mcAnswers[q.id] === q.correct) correct++;
      }
    }
    return { correct, answered, total: DIAGNOSTIC_QUESTIONS.filter((q) => q.type === 'multiple').length };
  }, [mcAnswers]);

  const weakest = useMemo(() => {
    return Object.entries(confidence)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([key, value]) => ({ key, label: TOPIC_LABELS[key] ?? key, value }));
  }, [confidence]);

  const applyResults = () => {
    const decrements: Record<string, number> = {};
    for (const q of DIAGNOSTIC_QUESTIONS) {
      if (q.type === 'multiple') {
        if (mcAnswers[q.id] != null && mcAnswers[q.id] !== q.correct) {
          decrements[q.topicKey] = (decrements[q.topicKey] ?? 0) + 1;
        }
      } else {
        const score = shortScores[q.id];
        if (score === 'missed') decrements[q.topicKey] = (decrements[q.topicKey] ?? 0) + 1;
        if (score === 'partial') decrements[q.topicKey] = (decrements[q.topicKey] ?? 0) + 1;
      }
    }
    for (const [topicKey, dec] of Object.entries(decrements)) {
      const current = confidence[topicKey] ?? 3;
      setConfidence(topicKey, Math.max(1, current - dec));
    }
    markComplete('diagnostic');
    setApplied(true);
  };

  return (
    <ModuleShell route="/diagnostic">
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        15–20 minutes. Mix of self-rating, multiple choice, and short answers. This calibrates your weakest topics.
      </p>

      <section className="card mb-6 p-4" aria-labelledby="self-rating">
        <h2 id="self-rating" className="mb-3 text-lg font-semibold">1 · Self-rating</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {DIAGNOSTIC_SELF_RATING.map((item) => (
            <div key={item.topicKey} className="card p-3">
              <p className="mb-2 text-sm font-medium">{item.prompt}</p>
              <ConfidenceRating
                value={confidence[item.topicKey] ?? 3}
                onChange={(v) => setConfidence(item.topicKey, v)}
                label={item.topic}
                compact
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card mb-6 p-4" aria-labelledby="questions">
        <h2 id="questions" className="mb-3 text-lg font-semibold">2 · Questions</h2>
        <div className="space-y-4">
          {DIAGNOSTIC_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="card p-3">
              <p className="text-sm font-semibold">
                {idx + 1}. {q.prompt}
              </p>

              {q.type === 'multiple' && q.options && (
                <div className="mt-2 space-y-1">
                  {q.options.map((opt, oi) => {
                    const selected = mcAnswers[q.id] === oi;
                    const showCorrect = mcAnswers[q.id] != null;
                    const isCorrect = oi === q.correct;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMcAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                        disabled={showCorrect}
                        className={cls(
                          'block w-full rounded border px-3 py-1.5 text-left text-sm',
                          showCorrect && isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : '',
                          showCorrect && selected && !isCorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : '',
                          !showCorrect ? 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800' : '',
                          showCorrect && !selected && !isCorrect ? 'border-slate-200 opacity-60' : '',
                        )}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                        {showCorrect && isCorrect && ' ✓'}
                        {showCorrect && selected && !isCorrect && ' ✗'}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'short' && (
                <div className="mt-2">
                  <Reveal label="Show self-score rubric">
                    <ul className="list-disc space-y-1 pl-5">
                      {q.rubric?.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    {q.answerNote && <p className="mt-2 text-sm text-slate-500">Model note: {q.answerNote}</p>}
                  </Reveal>
                  <div className="mt-2 flex gap-2">
                    {(['strong', 'partial', 'missed'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setShortScores((prev) => ({ ...prev, [q.id]: s }))}
                        aria-pressed={shortScores[q.id] === s}
                        className={cls('btn-secondary capitalize', shortScores[q.id] === s && 'ring-2 ring-navy-500')}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card mb-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">3 · Apply results</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Multiple choice: {mcStats.correct}/{mcStats.answered} correct so far ({mcStats.total} total). Wrong answers lower the
          corresponding topic confidence by one. Short answers are self-scored — no fake automated grading.
        </p>
        <button type="button" className="btn-primary mt-3" onClick={applyResults} disabled={applied}>
          {applied ? 'Applied' : 'Apply to my confidence and finish'}
        </button>
      </section>

      {applied && (
        <section className="card mb-6 border-navy-300 p-4" aria-labelledby="result">
          <h2 id="result" className="mb-2 text-lg font-semibold">Your three highest-risk gaps</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {weakest.map((w) => (
              <li key={w.key}>
                <strong>{w.label}</strong> — confidence {w.value}/5
              </li>
            ))}
          </ol>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn-primary" onClick={() => navigate('/review')}>
              Open review queue
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/angular-bridge')}>
              Start with Angular bridge
            </button>
          </div>
        </section>
      )}
    </ModuleShell>
  );
}
