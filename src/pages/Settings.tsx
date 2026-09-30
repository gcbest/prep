import { useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { createInitialState, defaultTopicConfidence, defaultSettings } from '@/store/defaults';
import { DEFAULT_SCHEDULE, COMPRESSED_SCHEDULE } from '@/data/schedule';
import type { AppState } from '@/types';
import { ModuleShell } from '@/components/ModuleShell';

export function Settings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setSchedule = useAppStore((s) => s.setSchedule);
  const resetAll = useAppStore((s) => s.resetAll);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const exportData = () => {
    const state = useAppStore.getState();
    const data: AppState = {
      schemaVersion: state.schemaVersion,
      schedule: state.schedule,
      topicConfidence: state.topicConfidence,
      moduleProgress: state.moduleProgress,
      questionResults: state.questionResults,
      stories: state.stories,
      designNotes: state.designNotes,
      codingNotes: state.codingNotes,
      whyCiti: state.whyCiti,
      selectedInterviewerQuestions: state.selectedInterviewerQuestions,
      settings: state.settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-ui-interview-sprint-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Exported your data as JSON.');
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<AppState>;
        const merged: AppState = {
          ...createInitialState(),
          ...parsed,
          topicConfidence: { ...defaultTopicConfidence(), ...(parsed.topicConfidence ?? {}) },
          settings: { ...defaultSettings(), ...(parsed.settings ?? {}) },
          schemaVersion: 1,
        };
        useAppStore.setState(merged);
        setMessage('Imported your data.');
      } catch {
        setMessage('Import failed: that file is not valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (window.confirm('Reset all progress, stories, notes, and settings? This cannot be undone.')) {
      resetAll();
      setMessage('All data reset.');
    }
  };

  const setCompressed = (on: boolean) => {
    updateSettings({ compressedMode: on });
    setSchedule(on ? COMPRESSED_SCHEDULE.map((b) => ({ ...b })) : DEFAULT_SCHEDULE.map((b) => ({ ...b })));
  };

  return (
    <ModuleShell route="/settings">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      <div className="space-y-4">
        <section className="card p-4">
          <h2 className="mb-3 text-lg font-semibold">Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-2">
              <span>Dark mode</span>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Interview start time</span>
              <input
                type="time"
                className="input !w-auto"
                value={settings.interviewTime ?? ''}
                onChange={(e) => updateSettings({ interviewTime: e.target.value })}
              />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span>Compressed 4-hour mode</span>
              <input
                type="checkbox"
                checked={settings.compressedMode}
                onChange={(e) => setCompressed(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-lg font-semibold">Data</h2>
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
            Everything is stored in this browser only. Export JSON to move it to another device, then import there.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={exportData}>Export JSON</button>
            <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>Import JSON</button>
            <button type="button" className="btn-danger" onClick={reset}>Reset all data</button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importData(file);
                e.target.value = '';
              }}
            />
          </div>
          {message && <p className="mt-3 text-sm text-green-700 dark:text-green-300" role="status">{message}</p>}
        </section>

        <section className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Why this app is accessible</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Semantic landmarks (header, nav, main) and a skip-to-content link.</li>
            <li>Full keyboard navigation with visible focus outlines.</li>
            <li>Labels, roles, and aria-pressed/aria-checked states on interactive controls.</li>
            <li>No color-only status indicators — text and symbols accompany color.</li>
            <li>Sufficient contrast in light and dark themes.</li>
            <li>aria-live used sparingly for status messages and timer completion.</li>
            <li>Reduced-motion support via prefers-reduced-motion.</li>
            <li>Tables have captions and correct headers.</li>
            <li>Print styles preserve structure for the cheat sheet.</li>
          </ul>
        </section>
      </div>
    </ModuleShell>
  );
}
