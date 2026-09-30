import { cls } from '@/lib/utils';

interface ConfidenceRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  compact?: boolean;
}

const LABELS = ['', 'Very low', 'Low', 'Medium', 'High', 'Very high'];

export function ConfidenceRating({ value, onChange, label = 'Confidence', compact = false }: ConfidenceRatingProps) {
  return (
    <div>
      <span className="label" id={`confidence-${label.replace(/\s/g, '-').toLowerCase()}`}>
        {label}: {LABELS[value] ?? '—'} ({value}/5)
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`confidence-${label.replace(/\s/g, '-').toLowerCase()}`}
        className="flex items-center gap-1"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} — ${LABELS[n]}`}
            onClick={() => onChange(n)}
            className={cls(
              'h-8 w-8 rounded border text-sm font-semibold transition-colors',
              compact && 'h-7 w-7',
              value >= n
                ? 'border-navy-700 bg-navy-700 text-white dark:border-navy-500 dark:bg-navy-600'
                : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
