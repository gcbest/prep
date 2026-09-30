import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimerApi {
  seconds: number;
  running: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void;
  setSeconds: (s: number) => void;
}

export function useTimer(initialSeconds = 0, countDown = false): TimerApi {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (countDown) {
            if (prev <= 0) {
              setRunning(false);
              clear();
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clear();
    }
    return clear;
  }, [running, countDown, clear]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);
  const toggle = useCallback(() => setRunning((r) => !r), []);
  const setSecondsDirect = useCallback((s: number) => setSeconds(s), []);

  return { seconds, running, start, pause, reset, toggle, setSeconds: setSecondsDirect };
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}:${sec.toString().padStart(2, '0')}`;
  return `${sec}s`;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => n.toString().padStart(2, '0')).join(':');
}
