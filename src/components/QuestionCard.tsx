import { useState } from 'react';
import type { InterviewQuestion } from '@/types';
import { QUESTION_CATEGORY_LABELS } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { ConfidenceRating } from './ConfidenceRating';
import { Reveal } from './Reveal';
import { PriorityBadge } from './PriorityBadge';
import { statusColor } from '@/lib/utils';

export function QuestionCard({ question, initialNotes = '' }: { question: InterviewQuestion; initialNotes?: string }) {
  const record = useAppStore((s) => s.recordQuestionResult);
  const existing = useAppStore((s) => s.questionResults[question.id]);
  const [status, setStatus] = useState<'missed' | 'partial' | 'strong'>(existing?.status ?? 'missed');
  const [confidence, setConfidence] = useState(existing?.confidence ?? 3);
  const [notes, setNotes] = useState(initialNotes);

  const save = () => {
    record(question.id, {
      status,
      confidence,
      answeredAt: new Date().toISOString(),
      notes,
    });
  };

  return (
    <article className="card p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <PriorityBadge priority={question.priority} />
        <span>{QUESTION_CATEGORY_LABELS[question.category]}</span>
        <span>≈ {question.estimatedMinutes} min</span>
        {existing && (
          <span className={`badge ${statusColor(existing.status)}`}>
            {existing.status} · {existing.confidence}/5
          </span>
        )}
      </div>

      <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{question.prompt}</h3>
      {question.reactBridge && (
        <p className="mt-1 text-sm text-slate-500">
          <span className="font-medium">React bridge:</span> {question.reactBridge}
        </p>
      )}

      <div className="mt-3">
        <p className="text-sm text-slate-500">Answer aloud or in your notes before revealing.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input mt-2 min-h-[80px]"
          placeholder="Optional notes…"
          aria-label="Answer notes"
        />
      </div>

      <div className="mt-3">
        <Reveal label="Reveal strong-answer points">
          <ul className="list-disc space-y-1 pl-5">
            {question.strongAnswerPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          {question.followUps.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Likely follow-ups</p>
              <ul className="list-disc space-y-1 pl-5">
                {question.followUps.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {question.redFlags.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-red-700 dark:text-red-300">Red flags to avoid</p>
              <ul className="list-disc space-y-1 pl-5 text-red-800 dark:text-red-200">
                {question.redFlags.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ConfidenceRating value={confidence} onChange={setConfidence} label="Confidence" />
        <div>
          <span className="label">Self-score this answer</span>
          <div className="flex gap-2" role="group" aria-label="Self-score">
            {(['missed', 'partial', 'strong'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={`btn-secondary capitalize ${status === s ? 'ring-2 ring-navy-500' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" className="btn-primary" onClick={save}>
          {existing ? 'Update result' : 'Save result'}
        </button>
      </div>
    </article>
  );
}
