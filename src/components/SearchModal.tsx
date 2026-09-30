import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTION_BANK } from '@/data/questions';
import { CONCEPT_CARDS } from '@/data/angularBridge';
import { RXJS_SCENARIOS } from '@/data/rxjsScenarios';
import { SECURITY_CARDS } from '@/data/securityRisk';
import { MODULES } from '@/data/schedule';
import { cls } from '@/lib/utils';

interface SearchItem {
  id: string;
  title: string;
  snippet: string;
  route: string;
  kind: string;
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  MODULES.forEach((m) =>
    items.push({ id: `mod-${m.id}`, title: m.title, snippet: m.objective, route: m.route, kind: 'Module' }),
  );
  QUESTION_BANK.forEach((q) =>
    items.push({ id: q.id, title: q.prompt, snippet: q.strongAnswerPoints.join(' '), route: '/angular-bridge', kind: 'Question' }),
  );
  CONCEPT_CARDS.forEach((c) =>
    items.push({
      id: `card-${c.id}`,
      title: `${c.react} → ${c.angular}`,
      snippet: c.explanation,
      route: '/angular-bridge',
      kind: 'Concept card',
    }),
  );
  RXJS_SCENARIOS.forEach((s) =>
    items.push({ id: `rxjs-${s.id}`, title: s.title, snippet: s.scenario, route: '/rxjs-state', kind: 'RxJS scenario' }),
  );
  SECURITY_CARDS.forEach((s) =>
    items.push({ id: `sec-${s.id}`, title: s.title, snippet: s.threat, route: '/risk-domain', kind: 'Security card' }),
  );
  return items;
}

const INDEX = buildIndex();

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return INDEX.filter(
      (item) => item.title.toLowerCase().includes(q) || item.snippet.toLowerCase().includes(q),
    ).slice(0, 20);
  }, [query]);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-[10vh]" onMouseDown={onClose}>
      <div
        className="card w-full max-w-xl p-0"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-200 px-3 dark:border-slate-700">
          <span aria-hidden>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, cards, scenarios…"
            className="w-full bg-transparent px-2 py-3 text-sm outline-none"
            aria-label="Search query"
          />
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800" aria-label="Close search">
            Esc
          </button>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto py-2">
          {query.trim() === '' && (
            <li className="px-4 py-2 text-sm text-slate-500">Start typing to search across cards and questions.</li>
          )}
          {query.trim() !== '' && results.length === 0 && (
            <li className="px-4 py-2 text-sm text-slate-500">No matches.</li>
          )}
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  navigate(item.route);
                  onClose();
                }}
                className={cls('block w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800')}
              >
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="block truncate text-xs text-slate-500">{item.kind} — {item.snippet}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
