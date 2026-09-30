import type { AppState, LeadershipStory, Settings } from '@/types';
import { DEFAULT_SCHEDULE } from '@/data/schedule';

export const SCHEMA_VERSION = 1;

export function defaultTopicConfidence(): Record<string, number> {
  return {
    diagnostic: 3,
    'angular-bridge': 3,
    'rxjs-state': 3,
    'testing-lab': 3,
    'coding-lab': 3,
    'system-design': 3,
    'devops-controls': 3,
    'risk-domain': 3,
    leadership: 3,
    'mock-interview': 3,
    'cheat-sheet': 3,
  };
}

export function defaultSettings(): Settings {
  return {
    darkMode: false,
    interviewTime: undefined,
    compressedMode: false,
  };
}

export function defaultStories(): LeadershipStory[] {
  const required = [
    ['production-incident', 'Production incident and root-cause prevention'],
    ['design-disagreement', 'Technical disagreement or design trade-off'],
    ['mentoring', 'Mentoring or raising engineering quality'],
    ['security-control', 'Security/control concern or stopping a risky release'],
  ].map(([id, title]) => ({
    id,
    title,
    required: true,
    situation: '',
    task: '',
    actions: '',
    result: '',
    learning: '',
  }));

  const optional = [
    ['rapid-reprioritization', 'Rapid reprioritization'],
    ['legacy-modernization', 'Legacy modernization'],
    ['ambiguous-requirements', 'Ambiguous business requirements'],
    ['cross-team-delivery', 'Cross-team delivery'],
    ['failure-learning', 'Personal failure and learning'],
  ].map(([id, title]) => ({
    id,
    title,
    required: false,
    situation: '',
    task: '',
    actions: '',
    result: '',
    learning: '',
  }));

  return [...required, ...optional];
}

export function createInitialState(): AppState {
  return {
    schemaVersion: SCHEMA_VERSION,
    schedule: DEFAULT_SCHEDULE.map((b) => ({ ...b })),
    topicConfidence: defaultTopicConfidence(),
    moduleProgress: {},
    questionResults: {},
    stories: defaultStories(),
    designNotes: '',
    codingNotes: '',
    whyCiti: '',
    selectedInterviewerQuestions: [],
    settings: defaultSettings(),
  };
}
