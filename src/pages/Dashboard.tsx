import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { recommendNext } from '@/store/recommendation';
import { missedCount, lowConfidenceTopics, reviewQueue } from '@/store/selectors';
import { TOPIC_LABELS } from '@/data/schedule';
import { PriorityBadge } from '@/components/PriorityBadge';
import { formatDuration } from '@/lib/useTimer';
import { cls } from '@/lib/utils';

export function Dashboard() {
  const navigate = useNavigate();
  const schedule = useAppStore((s) => s.schedule);
  const confidence = useAppStore((s) => s.topicConfidence);
  const moduleProgress = useAppStore((s) => s.moduleProgress);
  const questionResults = useAppStore((s) => s.questionResults);
  const stories = useAppStore((s) => s.stories);
  const settings = useAppStore((s) => s.settings);
  const setSchedule = useAppStore((s) => s.setSchedule);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const completed = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const [id, p] of Object.entries(moduleProgress)) map[id] = p.completed;
    return map;
  }, [moduleProgress]);

  const recommendations = useMemo(() => recommendNext(schedule, confidence, completed), [schedule, confidence, completed]);
  const next = recommendations[0];
  const studyBlocks = schedule.filter((b) => b.priority !== 'break');
  const doneCount = studyBlocks.filter((b) => completed[b.topicKey]).length;
  const percent = studyBlocks.length === 0 ? 0 : Math.round((doneCount / studyBlocks.length) * 100);
  const remainingMinutes = studyBlocks.filter((b) => !completed[b.topicKey]).reduce((sum, b) => sum + b.durationMinutes, 0);
  const low = lowConfidenceTopics(confidence, TOPIC_LABELS);
  const misses = missedCount(questionResults);
  const queue = reviewQueue(questionResults);
  const requiredStories = stories.filter((s) => s.required);
  const readyStories = requiredStories.filter((s) => s.situation && s.task && s.actions && s.result && s.learning).length;

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= schedule.length) return;
    const nextSchedule = [...schedule];
    const [item] = nextSchedule.splice(index, 1);
    nextSchedule.splice(target, 0, item);
    setSchedule(nextSchedule);
  };

  const updateDuration = (index: number, minutes: number) => {
    const nextSchedule = [...schedule];
    nextSchedule[index] = { ...nextSchedule[index], durationMinutes: Math.max(5, minutes) };
    setSchedule(nextSchedule);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">One-day plan</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          One focused day to prepare for Citi ERT’s Senior Angular UI Developer interview.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span>Interview start time</span>
            <input
              type="time"
              className="input !w-auto"
              value={settings.interviewTime ?? ''}
              onChange={(e) => updateSettings({ interviewTime: e.target.value })}
            />
          </label>
          <div className="h-3 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Overall completion">
            <div className="h-full bg-green-600" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-sm font-semibold">{percent}% complete</span>
          <span className="text-sm text-slate-500">{formatDuration(remainingMinutes * 60)} of focused time remains</span>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Status summary">
        <div className="card p-4">
          <h2 className="label">Study next</h2>
          {next ? (
            <div>
              <p className="font-semibold">{next.block.title}</p>
              <p className="mt-1 text-sm text-slate-500">Priority score: {next.score.toFixed(1)}</p>
              <p className="mt-1 text-xs text-slate-400">Deterministic priority recommendation (not AI).</p>
              <Link to={next.block.route} className="btn-primary mt-3">Start focus session</Link>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Nothing left — review your cheat sheet.</p>
          )}
        </div>
        <div className="card p-4">
          <h2 className="label">Least confident</h2>
          {low.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {low.slice(0, 3).map((t) => (
                <li key={t.key} className="flex justify-between">
                  <span>{t.label}</span>
                  <span className="font-semibold">{t.value}/5</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No topic below 3/5.</p>
          )}
          <Link to="/review" className="btn-secondary mt-3">Open review queue</Link>
        </div>
        <div className="card p-4">
          <h2 className="label">Readiness</h2>
          <ul className="space-y-1 text-sm">
            <li>Missed questions: <strong>{misses}</strong></li>
            <li>Review queue: <strong>{queue.length}</strong> items</li>
            <li>STAR stories ready: <strong>{readyStories}/{requiredStories.length}</strong></li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => navigate('/mock-interview')}>Start mock now</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/review')}>Final review queue</button>
          </div>
        </div>
      </section>

      <section className="card mt-6 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Today’s schedule</h2>
          <p className="text-xs text-slate-500">Use ↑/↓ to reorder, edit minutes inline. Breaks stay put.</p>
        </div>
        <ol className="space-y-2">
          {schedule.map((block, index) => {
            const isBreak = block.priority === 'break';
            const isDone = !isBreak && completed[block.topicKey];
            return (
              <li key={block.id} className={cls('flex items-center gap-2 rounded-md border p-2', isBreak ? 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40' : 'border-slate-200 dark:border-slate-800')}>
                <span className="w-6 text-center text-sm font-semibold text-slate-400">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cls('font-medium', isDone && 'text-green-700 dark:text-green-300')}>{block.title}</span>
                    {!isBreak && <PriorityBadge priority={block.priority} />}
                    {isDone && <span className="text-xs text-green-600">✓</span>}
                  </div>
                  <p className="truncate text-xs text-slate-500">{block.outcome}</p>
                </div>
                {!isBreak ? (
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="number"
                      min={5}
                      className="input !w-16 !px-1 !py-0.5 text-right"
                      value={block.durationMinutes}
                      onChange={(e) => updateDuration(index, Number(e.target.value))}
                      aria-label={`${block.title} duration in minutes`}
                    />
                    <span>min</span>
                  </label>
                ) : (
                  <span className="text-xs text-slate-500">{block.durationMinutes} min</span>
                )}
                <div className="flex gap-1">
                  <button type="button" className="btn-secondary !px-2 !py-1" onClick={() => move(index, -1)} aria-label={`Move ${block.title} up`}>↑</button>
                  <button type="button" className="btn-secondary !px-2 !py-1" onClick={() => move(index, 1)} aria-label={`Move ${block.title} down`}>↓</button>
                  {!isBreak && (
                    <Link to={block.route} className="btn-secondary !px-2 !py-1">Open</Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="card mt-6 p-4">
        <h2 className="mb-2 text-lg font-semibold">Topic confidence heat map</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(TOPIC_LABELS).map(([key, label]) => {
            const value = confidence[key] ?? 3;
            const color =
              value <= 2 ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' :
              value === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' :
              'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200';
            return (
              <div key={key} className={cls('flex items-center justify-between rounded-md border px-3 py-2', color)}>
                <span className="text-sm">{label}</span>
                <span className="font-semibold">{value}/5</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
