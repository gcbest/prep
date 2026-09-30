import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  LeadershipStory,
  ModuleProgress,
  QuestionResult,
  ScheduleBlock,
  Settings,
} from '@/types';
import { createInitialState, defaultSettings, defaultTopicConfidence, SCHEMA_VERSION } from './defaults';

export interface AppStore extends AppState {
  setConfidence: (topicKey: string, value: number) => void;
  setModuleProgress: (moduleId: string, patch: Partial<ModuleProgress>) => void;
  markModuleComplete: (moduleId: string) => void;
  markModuleSkipped: (moduleId: string) => void;
  recordQuestionResult: (questionId: string, result: QuestionResult) => void;
  upsertStory: (story: LeadershipStory) => void;
  setDesignNotes: (notes: string) => void;
  setCodingNotes: (notes: string) => void;
  setWhyCiti: (text: string) => void;
  toggleInterviewerQuestion: (question: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setSchedule: (schedule: ScheduleBlock[]) => void;
  resetAll: () => void;
}

const initial = createInitialState();

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initial,

      setConfidence: (topicKey, value) =>
        set((state) => ({
          topicConfidence: { ...state.topicConfidence, [topicKey]: clamp(value, 1, 5) },
        })),

      setModuleProgress: (moduleId, patch) =>
        set((state) => {
          const prev = state.moduleProgress[moduleId] ?? {
            completed: false,
            skipped: false,
            confidence: state.topicConfidence[moduleId] ?? 3,
          };
          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: { ...prev, ...patch, lastVisitedAt: new Date().toISOString() },
            },
          };
        }),

      markModuleComplete: (moduleId) =>
        set((state) => {
          const prev = state.moduleProgress[moduleId] ?? {
            completed: false,
            skipped: false,
            confidence: state.topicConfidence[moduleId] ?? 3,
          };
          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: { ...prev, completed: true, skipped: false, lastVisitedAt: new Date().toISOString() },
            },
          };
        }),

      markModuleSkipped: (moduleId) =>
        set((state) => {
          const prev = state.moduleProgress[moduleId] ?? {
            completed: false,
            skipped: false,
            confidence: state.topicConfidence[moduleId] ?? 3,
          };
          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: { ...prev, completed: false, skipped: true, lastVisitedAt: new Date().toISOString() },
            },
          };
        }),

      recordQuestionResult: (questionId, result) =>
        set((state) => ({
          questionResults: {
            ...state.questionResults,
            [questionId]: result,
          },
        })),

      upsertStory: (story) =>
        set((state) => ({
          stories: state.stories.map((s) => (s.id === story.id ? story : s)),
        })),

      setDesignNotes: (designNotes) => set({ designNotes }),
      setCodingNotes: (codingNotes) => set({ codingNotes }),
      setWhyCiti: (whyCiti) => set({ whyCiti }),

      toggleInterviewerQuestion: (question) =>
        set((state) => ({
          selectedInterviewerQuestions: state.selectedInterviewerQuestions.includes(question)
            ? state.selectedInterviewerQuestions.filter((q) => q !== question)
            : [...state.selectedInterviewerQuestions, question],
        })),

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      setSchedule: (schedule) => set({ schedule }),

      resetAll: () => set({ ...createInitialState() }),
    }),
    {
      name: 'risk-ui-interview-sprint',
      version: SCHEMA_VERSION,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => typeof (state as unknown as Record<string, unknown>)[key] !== 'function'),
        ) as AppState,
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<AppState>;
        // Defensive merge: fill anything missing from newer/older schemas.
        const merged: AppState = {
          ...createInitialState(),
          ...state,
          topicConfidence: { ...defaultTopicConfidence(), ...(state.topicConfidence ?? {}) },
          settings: { ...defaultSettings(), ...(state.settings ?? {}) },
          schemaVersion: SCHEMA_VERSION,
        };
        void version;
        return merged;
      },
    },
  ),
);

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
