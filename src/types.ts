export type Priority = 'critical' | 'important' | 'optional';

export type SchedulePriority = Priority | 'break';

export interface ScheduleBlock {
  id: string;
  title: string;
  durationMinutes: number;
  priority: SchedulePriority;
  outcome: string;
  route: string;
  topicKey: string;
}

export type ModuleProgress = {
  completed: boolean;
  skipped: boolean;
  confidence: number;
  lastVisitedAt?: string;
  notes?: string;
};

export type QuestionCategory =
  | 'angular'
  | 'rxjs-state'
  | 'testing'
  | 'architecture'
  | 'devops'
  | 'security-risk'
  | 'leadership';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  priority: Priority;
  prompt: string;
  followUps: string[];
  strongAnswerPoints: string[];
  redFlags: string[];
  estimatedMinutes: number;
  reactBridge?: string;
}

export type QuestionStatus = 'missed' | 'partial' | 'strong';

export interface QuestionResult {
  status: QuestionStatus;
  confidence: number;
  answeredAt: string;
  notes?: string;
}

export interface LeadershipStory {
  id: string;
  title: string;
  required: boolean;
  situation: string;
  task: string;
  actions: string;
  result: string;
  learning: string;
}

export interface Settings {
  darkMode: boolean;
  interviewTime?: string;
  compressedMode: boolean;
}

export interface AppState {
  schemaVersion: number;
  schedule: ScheduleBlock[];
  topicConfidence: Record<string, number>;
  moduleProgress: Record<string, ModuleProgress>;
  questionResults: Record<string, QuestionResult>;
  stories: LeadershipStory[];
  designNotes: string;
  codingNotes: string;
  whyCiti: string;
  selectedInterviewerQuestions: string[];
  settings: Settings;
}

export type QuestionCategoryLabel = Record<QuestionCategory, string>;

export const QUESTION_CATEGORY_LABELS: QuestionCategoryLabel = {
  angular: 'Angular / TypeScript',
  'rxjs-state': 'RxJS / State',
  testing: 'Jasmine / Karma / Cypress',
  architecture: 'Architecture / Micro-frontends',
  devops: 'Docker / CI-CD',
  'security-risk': 'Security / Risk domain',
  leadership: 'Leadership / Behavioral',
};
