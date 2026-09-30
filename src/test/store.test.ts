import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/store/useAppStore';

describe('app store', () => {
  beforeEach(() => {
    useAppStore.getState().resetAll();
  });

  it('starts with a full schedule and neutral confidence', () => {
    const state = useAppStore.getState();
    expect(state.schedule.length).toBeGreaterThan(0);
    expect(state.topicConfidence['angular-bridge']).toBe(3);
    expect(state.stories.filter((s) => s.required)).toHaveLength(4);
  });

  it('updates confidence and clamps to 1..5', () => {
    useAppStore.getState().setConfidence('angular-bridge', 99);
    expect(useAppStore.getState().topicConfidence['angular-bridge']).toBe(5);
    useAppStore.getState().setConfidence('angular-bridge', -5);
    expect(useAppStore.getState().topicConfidence['angular-bridge']).toBe(1);
  });

  it('marks a module complete', () => {
    useAppStore.getState().markModuleComplete('angular-bridge');
    expect(useAppStore.getState().moduleProgress['angular-bridge'].completed).toBe(true);
  });

  it('records question results', () => {
    useAppStore.getState().recordQuestionResult('q1', {
      status: 'missed',
      confidence: 2,
      answeredAt: new Date().toISOString(),
    });
    expect(useAppStore.getState().questionResults['q1'].status).toBe('missed');
  });

  it('resets to defaults', () => {
    useAppStore.getState().setWhyCiti('hello');
    useAppStore.getState().resetAll();
    expect(useAppStore.getState().whyCiti).toBe('');
  });
});
