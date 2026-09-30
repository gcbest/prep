import type { ReactNode } from 'react';

interface RevealProps {
  label?: string;
  children: ReactNode;
}

/** Active-recall pattern: hide the answer until the candidate retrieves it. */
export function Reveal({ label = 'Reveal answer', children }: RevealProps) {
  return (
    <details className="group my-2 rounded-md border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-navy-700 dark:text-navy-300">
        <span className="group-open:hidden">▸ {label}</span>
        <span className="hidden group-open:inline">▾ Hide</span>
      </summary>
      <div className="border-t border-slate-300 px-3 py-2 text-sm dark:border-slate-700">{children}</div>
    </details>
  );
}
