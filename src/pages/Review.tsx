import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { reviewQueue, lowConfidenceTopics } from '@/store/selectors';
import { TOPIC_LABELS } from '@/data/schedule';
import { QuestionCard } from '@/components/QuestionCard';
import { Link } from 'react-router-dom';

export function Review() {
  const questionResults = useAppStore((s) => s.questionResults);
  const confidence = useAppStore((s) => s.topicConfidence);
  const [filter, setFilter] = useState<'all' | 'missed' | 'partial'>('all');

  const queue = useMemo(() => reviewQueue(questionResults), [questionResults]);
  const low = useMemo(() => lowConfidenceTopics(confidence, TOPIC_LABELS), [confidence]);

  const visible = queue.filter((item) => (filter === 'all' ? true : item.result.status === filter));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Low-confidence review queue</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Questions you marked missed or partial, plus your lowest-confidence topics. Re-drill until they feel strong.
        </p>
      </header>

      {low.length > 0 && (
        <section className="card mb-4 p-4" aria-labelledby="low-topics">
          <h2 id="low-topics" className="label">Lowest-confidence topics</h2>
          <ul className="flex flex-wrap gap-2">
            {low.map((t) => (
              <li key={t.key} className="badge bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800">
                {t.label} · {t.value}/5
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Revisit these modules and raise confidence to at least 3 before the interview.
          </p>
        </section>
      )}

      <div className="mb-3 flex items-center gap-2">
        <span className="label !mb-0">Filter:</span>
        {(['all', 'missed', 'partial'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`btn-secondary capitalize ${filter === f ? 'ring-2 ring-navy-500' : ''}`}
          >
            {f} ({f === 'all' ? queue.length : queue.filter((i) => i.result.status === f).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-500">
          {queue.length === 0
            ? 'No missed or partial questions yet. Practice questions in a module and self-score to build this queue.'
            : 'Nothing matches this filter.'}{' '}
          <Link to="/angular-bridge" className="text-navy-700 underline dark:text-navy-300">
            Go practice
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(({ question, result }) => (
            <QuestionCard key={question.id} question={question} initialNotes={result.notes ?? ''} />
          ))}
        </div>
      )}
    </div>
  );
}
