import type { TimerApi } from '@/lib/useTimer';
import { formatClock } from '@/lib/useTimer';
import { cls } from '@/lib/utils';

interface TimerProps {
  timer: TimerApi;
  label?: string;
  compact?: boolean;
}

export function Timer({ timer, label, compact = false }: TimerProps) {
  return (
    <div
      className={cls(
        'flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800',
        compact && 'px-1.5 py-0.5',
      )}
      role="group"
      aria-label={label ?? 'Timer'}
    >
      {label && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>}
      <span
        className={cls('font-mono tabular-nums', compact ? 'text-xs' : 'text-sm font-semibold')}
        role="timer"
        aria-live={timer.running ? 'off' : 'polite'}
      >
        {formatClock(timer.seconds)}
      </span>
      <button
        type="button"
        onClick={timer.toggle}
        className={cls('rounded border px-1.5 text-xs', compact ? 'py-0.5' : 'py-1', 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700')}
        aria-label={timer.running ? 'Pause timer' : 'Start timer'}
      >
        {timer.running ? '⏸' : '▶'}
      </button>
      <button
        type="button"
        onClick={timer.reset}
        className={cls('rounded border px-1.5 text-xs', compact ? 'py-0.5' : 'py-1', 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700')}
        aria-label="Reset timer"
      >
        ↺
      </button>
    </div>
  );
}
