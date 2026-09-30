import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { MODULES } from '@/data/schedule';
import { SearchModal } from './SearchModal';
import { Timer } from './Timer';
import { useTimer } from '@/lib/useTimer';
import { cls } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  ...MODULES.map((m) => ({ to: m.route, label: m.shortTitle, end: false })),
  { to: '/review', label: 'Low-confidence queue', end: false },
  { to: '/settings', label: 'Settings', end: false },
];

function overallProgress(state: ReturnType<typeof useAppStore.getState>): number {
  const study = state.schedule.filter((b) => b.priority !== 'break');
  if (study.length === 0) return 0;
  const done = study.filter((b) => state.moduleProgress[b.topicKey]?.completed).length;
  return Math.round((done / study.length) * 100);
}

export function Layout() {
  const darkMode = useAppStore((s) => s.settings.darkMode);
  const setDarkMode = (v: boolean) => useAppStore.getState().updateSettings({ darkMode: v });
  const [searchOpen, setSearchOpen] = useState(false);
  const timer = useTimer(0, false);
  const location = useLocation();
  const schedule = useAppStore((s) => s.schedule);
  const moduleProgress = useAppStore((s) => s.moduleProgress);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const progress = overallProgress({ schedule, moduleProgress } as ReturnType<typeof useAppStore.getState>);

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <p className="text-lg font-bold leading-tight text-navy-800 dark:text-navy-200">Risk UI Interview Sprint</p>
          <p className="mt-1 text-xs text-slate-500">Citi ERT · Senior Angular UI</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2" aria-label="Primary">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cls(
                      'block rounded-md px-3 py-1.5 text-sm',
                      isActive
                        ? 'bg-navy-700 font-medium text-white dark:bg-navy-600'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-slate-200 p-3 text-xs text-slate-500 dark:border-slate-800">
          <p>Local-first · no account · your data stays in this browser.</p>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2 md:hidden">
              <p className="text-sm font-bold text-navy-800 dark:text-navy-200">Risk UI Sprint</p>
            </div>
            <div className="hidden items-center gap-2 text-sm md:flex">
              <span className="text-slate-500">Day progress</span>
              <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Overall day progress">
                <div className="h-full bg-navy-700 dark:bg-navy-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-semibold tabular-nums">{progress}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="btn-secondary !px-2 !py-1 text-xs"
                aria-label="Search (Ctrl+K)"
              >
                <span aria-hidden>⌕</span> Search
              </button>
              <Timer timer={timer} label="Focus" compact />
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="btn-secondary !px-2 !py-1 text-xs"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? '☀' : '☾'}
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className="min-h-[calc(100vh-8rem)]">
          <Outlet />
        </main>
      </div>

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden"
        aria-label="Mobile"
      >
        <div className="flex overflow-x-auto">
          {[
            { to: '/', label: 'Home' },
            ...MODULES.filter((m) => ['angular-bridge', 'rxjs-state', 'testing-lab', 'coding-lab', 'system-design', 'leadership', 'mock-interview', 'cheat-sheet'].includes(m.id)).map((m) => ({
              to: m.route,
              label: m.shortTitle,
            })),
            { to: '/review', label: 'Queue' },
            { to: '/settings', label: 'Settings' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cls(
                  'whitespace-nowrap px-3 py-2 text-xs',
                  isActive ? 'border-b-2 border-navy-700 font-semibold text-navy-800 dark:border-navy-400 dark:text-navy-200' : 'text-slate-600 dark:text-slate-300',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <span className="sr-only" aria-live="polite">{location.pathname}</span>
    </div>
  );
}
