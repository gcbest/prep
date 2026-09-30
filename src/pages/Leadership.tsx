import { useState } from 'react';
import { ModuleShell } from '@/components/ModuleShell';
import { useAppStore } from '@/store/useAppStore';
import type { LeadershipStory } from '@/types';
import { STAR_L_FIELDS, STORY_QUALITY_CHECKS, type StarFieldKey } from '@/data/leadership';
import { useTimer, formatClock } from '@/lib/useTimer';
import { cls } from '@/lib/utils';

function StoryEditor({ story }: { story: LeadershipStory }) {
  const upsert = useAppStore((s) => s.upsertStory);
  const [checks, setChecks] = useState<Set<string>>(new Set());
  const timer = useTimer(120, true);

  const set = (key: StarFieldKey, value: string) => upsert({ ...story, [key]: value });

  const filledCount = STAR_L_FIELDS.filter((f) => story[f.key].trim().length > 0).length;

  return (
    <article className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{story.title}</h3>
          <span className={`badge ${story.required ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800' : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'}`}>
            {story.required ? 'Required' : 'Optional'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{filledCount}/{STAR_L_FIELDS.length} fields</span>
          <div className="flex items-center gap-1 rounded border border-slate-200 px-2 py-1 dark:border-slate-700">
            <span className="text-xs font-medium">Answer aloud</span>
            <span className="font-mono text-sm tabular-nums" role="timer">{formatClock(timer.seconds)}</span>
            <button type="button" onClick={timer.toggle} className="rounded border border-slate-300 px-1.5 py-0.5 text-xs" aria-label={timer.running ? 'Pause' : 'Start'}>{timer.running ? '⏸' : '▶'}</button>
            <button type="button" onClick={timer.reset} className="rounded border border-slate-300 px-1.5 py-0.5 text-xs" aria-label="Reset">↺</button>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {STAR_L_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="label" htmlFor={`${story.id}-${field.key}`}>
              {field.label} <span className="font-normal text-slate-400">— {field.hint}</span>
            </label>
            <textarea
              id={`${story.id}-${field.key}`}
              className="input min-h-[64px]"
              value={String(story[field.key])}
              onChange={(e) => set(field.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <p className="label">Quality checks</p>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {STORY_QUALITY_CHECKS.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`${story.id}-${c}`}
                checked={checks.has(c)}
                onChange={() => setChecks((prev) => { const n = new Set(prev); if (n.has(c)) n.delete(c); else n.add(c); return n; })}
                className="mt-0.5"
              />
              <label htmlFor={`${story.id}-${c}`} className={cls(checks.has(c) && 'text-green-700 dark:text-green-300')}>{c}</label>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Leadership() {
  const stories = useAppStore((s) => s.stories);
  const required = stories.filter((s) => s.required);
  const optional = stories.filter((s) => !s.required);

  return (
    <ModuleShell route="/leadership">
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Build four required STAR-L stories. Optional ones cover the most likely follow-up prompts. Practice each aloud
        in under two minutes.
      </p>
      <div className="space-y-4">
        {required.map((story) => (
          <StoryEditor key={story.id} story={story} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Optional stories</h2>
      <div className="space-y-4">
        {optional.map((story) => (
          <StoryEditor key={story.id} story={story} />
        ))}
      </div>
    </ModuleShell>
  );
}
