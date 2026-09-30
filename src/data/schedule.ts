import type { Priority, ScheduleBlock } from '@/types';

export interface ModuleMeta {
  id: string;
  title: string;
  shortTitle: string;
  durationMinutes: number;
  priority: Priority;
  objective: string;
  exitCriteria: string[];
  route: string;
  /** Confidence key. Several modules may share one topic (e.g., coding + code review). */
  topicKey: string;
}

export const DEFAULT_SCHEDULE: ScheduleBlock[] = [
  {
    id: 'orientation-diagnostic',
    title: 'Orientation and diagnostic',
    durationMinutes: 20,
    priority: 'critical',
    outcome: 'Identify the three highest-risk gaps',
    route: '/diagnostic',
    topicKey: 'diagnostic',
  },
  {
    id: 'angular-bridge',
    title: 'Angular mental model through React',
    durationMinutes: 70,
    priority: 'critical',
    outcome: 'Explain Angular architecture and lifecycle confidently',
    route: '/angular-bridge',
    topicKey: 'angular-bridge',
  },
  {
    id: 'rxjs-state',
    title: 'RxJS and state management',
    durationMinutes: 55,
    priority: 'critical',
    outcome: 'Choose operators and state boundaries for realistic cases',
    route: '/rxjs-state',
    topicKey: 'rxjs-state',
  },
  {
    id: 'break-1',
    title: 'Break',
    durationMinutes: 10,
    priority: 'break',
    outcome: 'Reset',
    route: '/',
    topicKey: 'break-1',
  },
  {
    id: 'testing-lab',
    title: 'Jasmine/Karma testing lab',
    durationMinutes: 60,
    priority: 'critical',
    outcome: 'Write and explain component/service tests',
    route: '/testing-lab',
    topicKey: 'testing-lab',
  },
  {
    id: 'coding-review',
    title: 'Angular coding and code review',
    durationMinutes: 70,
    priority: 'critical',
    outcome: 'Complete one practical exercise and review flawed code',
    route: '/coding-lab',
    topicKey: 'coding-lab',
  },
  {
    id: 'lunch',
    title: 'Lunch',
    durationMinutes: 30,
    priority: 'break',
    outcome: 'Reset',
    route: '/',
    topicKey: 'lunch',
  },
  {
    id: 'system-design',
    title: 'Micro-frontend/system-design lab',
    durationMinutes: 75,
    priority: 'critical',
    outcome: 'Design a risk portal and defend trade-offs',
    route: '/system-design',
    topicKey: 'system-design',
  },
  {
    id: 'devops-controls',
    title: 'Docker, CI/CD, and controls',
    durationMinutes: 35,
    priority: 'important',
    outcome: 'Explain build-to-production flow',
    route: '/devops-controls',
    topicKey: 'devops-controls',
  },
  {
    id: 'risk-domain',
    title: 'Risk-domain and security primer',
    durationMinutes: 30,
    priority: 'important',
    outcome: 'Speak credibly about risk-user needs and controls',
    route: '/risk-domain',
    topicKey: 'risk-domain',
  },
  {
    id: 'leadership',
    title: 'Leadership story builder',
    durationMinutes: 45,
    priority: 'critical',
    outcome: 'Prepare four concise STAR-L stories',
    route: '/leadership',
    topicKey: 'leadership',
  },
  {
    id: 'mock-interview',
    title: 'Timed mock interview',
    durationMinutes: 60,
    priority: 'critical',
    outcome: 'Complete technical, design, and behavioral simulation',
    route: '/mock-interview',
    topicKey: 'mock-interview',
  },
  {
    id: 'final-review',
    title: 'Final review and cheat sheet',
    durationMinutes: 30,
    priority: 'critical',
    outcome: 'Review misses and print last-minute notes',
    route: '/cheat-sheet',
    topicKey: 'cheat-sheet',
  },
];

export const COMPRESSED_SCHEDULE: ScheduleBlock[] = [
  DEFAULT_SCHEDULE[1],
  DEFAULT_SCHEDULE[2],
  DEFAULT_SCHEDULE[4],
  DEFAULT_SCHEDULE[5],
  DEFAULT_SCHEDULE[7],
  DEFAULT_SCHEDULE[10],
  {
    id: 'rapid-mock',
    title: 'Rapid-fire mock (20 min)',
    durationMinutes: 20,
    priority: 'critical',
    outcome: 'Twenty-minute rapid-fire simulation',
    route: '/mock-interview',
    topicKey: 'mock-interview',
  },
];

export const MODULES: ModuleMeta[] = [
  {
    id: 'diagnostic',
    title: 'Orientation and diagnostic',
    shortTitle: 'Diagnostic',
    durationMinutes: 20,
    priority: 'critical',
    objective: 'Identify your three highest-risk Angular gaps before you spend time studying.',
    exitCriteria: [
      'Answered the diagnostic and self-scored every short answer against its rubric.',
      'You can name your three weakest topic areas.',
      'Your review queue is populated with missed and partial items.',
    ],
    route: '/diagnostic',
    topicKey: 'diagnostic',
  },
  {
    id: 'angular-bridge',
    title: 'Angular mental model through React',
    shortTitle: 'Angular Bridge',
    durationMinutes: 70,
    priority: 'critical',
    objective: 'Translate your React knowledge into accurate Angular terminology and lifecycle understanding.',
    exitCriteria: [
      'You can explain components, templates, DI, and change detection without saying "same as React".',
      'You know where each React-to-Angular analogy breaks down.',
      'You can diagnose a sluggish large risk table update.',
    ],
    route: '/angular-bridge',
    topicKey: 'angular-bridge',
  },
  {
    id: 'rxjs-state',
    title: 'RxJS and state management',
    shortTitle: 'RxJS & State',
    durationMinutes: 55,
    priority: 'critical',
    objective: 'Choose the right flattening operator and state boundary for realistic enterprise scenarios.',
    exitCriteria: [
      'You can pick switchMap/mergeMap/concatMap/exhaustMap from cancellation and ordering needs.',
      'You can classify state into ephemeral, form, URL, shared, server, streaming, and preference.',
      'You can say when NgRx is excessive.',
    ],
    route: '/rxjs-state',
    topicKey: 'rxjs-state',
  },
  {
    id: 'testing-lab',
    title: 'Jasmine/Karma testing lab',
    shortTitle: 'Testing Lab',
    durationMinutes: 60,
    priority: 'critical',
    objective: 'Separate Jasmine, Karma, TestBed, and Cypress roles and write the RiskLimitComponent tests.',
    exitCriteria: [
      'You can map the React test ecosystem to Angular terms.',
      'You wrote or reviewed tests for the required load/threshold/error/cleanup cases.',
      'You can explain what belongs in unit vs. Cypress tests.',
    ],
    route: '/testing-lab',
    topicKey: 'testing-lab',
  },
  {
    id: 'coding-lab',
    title: 'Angular coding lab',
    shortTitle: 'Coding Lab',
    durationMinutes: 45,
    priority: 'critical',
    objective: 'Complete one realistic Angular feature exercise (risk-record explorer) with tests.',
    exitCriteria: [
      'You produced a plan or code covering fetch, debounce, cancellation, states, and cleanup.',
      'You included OnPush, strict types, and at least three test cases.',
      'You self-scored against the coding rubric.',
    ],
    route: '/coding-lab',
    topicKey: 'coding-lab',
  },
  {
    id: 'code-review',
    title: 'Code-review lab',
    shortTitle: 'Code Review',
    durationMinutes: 25,
    priority: 'critical',
    objective: 'Review a deliberately flawed component as a senior lead would — material risk first.',
    exitCriteria: [
      'You categorized findings by correctness, security, performance, testability, maintainability, and ops.',
      'You separated blocking issues from coaching suggestions.',
      'You did not dump a long style list on the author.',
    ],
    route: '/code-review',
    topicKey: 'coding-lab',
  },
  {
    id: 'system-design',
    title: 'Micro-frontend/system-design lab',
    shortTitle: 'System Design',
    durationMinutes: 75,
    priority: 'critical',
    objective: 'Design a scalable, auditable enterprise risk portal and defend trade-offs.',
    exitCriteria: [
      'You walked the full requirement checklist before drawing boxes.',
      'You addressed security, data freshness, partial failure, observability, and rollback.',
      'You can justify or reject micro-frontends from organizational ownership and release needs.',
    ],
    route: '/system-design',
    topicKey: 'system-design',
  },
  {
    id: 'devops-controls',
    title: 'Docker, CI/CD, and controls',
    shortTitle: 'DevOps & Controls',
    durationMinutes: 35,
    priority: 'important',
    objective: 'Explain the build-to-production flow and where each control reduces risk.',
    exitCriteria: [
      'You can describe the immutable-artifact promotion flow.',
      'You know what belongs in the Docker image and how env config is injected.',
      'You can answer the rapid-fire prompts without tool-specific trivia.',
    ],
    route: '/devops-controls',
    topicKey: 'devops-controls',
  },
  {
    id: 'risk-domain',
    title: 'Risk-domain and security primer',
    shortTitle: 'Risk & Security',
    durationMinutes: 30,
    priority: 'important',
    objective: 'Speak credibly about risk-user needs, controls, and security responsibilities.',
    exitCriteria: [
      'You can use the risk vocabulary in UI answers.',
      'You can answer the four security questions for each control.',
      'You remember: zero is not no data, freshness must be visible, server enforces entitlements.',
    ],
    route: '/risk-domain',
    topicKey: 'risk-domain',
  },
  {
    id: 'leadership',
    title: 'Leadership story builder',
    shortTitle: 'Leadership',
    durationMinutes: 45,
    priority: 'critical',
    objective: 'Draft four concise STAR-L stories with measurable outcomes.',
    exitCriteria: [
      'Four required stories have all STAR-L fields filled.',
      'Each passes the quality checks (ownership, <2 min, evidence, trade-offs, change afterward).',
      'You practiced each aloud once.',
    ],
    route: '/leadership',
    topicKey: 'leadership',
  },
  {
    id: 'mock-interview',
    title: 'Timed mock interview',
    shortTitle: 'Mock Interview',
    durationMinutes: 60,
    priority: 'critical',
    objective: 'Rehearse a full technical, design, and behavioral simulation under time pressure.',
    exitCriteria: [
      'You completed all four sections with timers.',
      'You self-scored every response against a rubric.',
      'Weak areas were added to the final review queue.',
    ],
    route: '/mock-interview',
    topicKey: 'mock-interview',
  },
  {
    id: 'cheat-sheet',
    title: 'Final review and cheat sheet',
    shortTitle: 'Cheat Sheet',
    durationMinutes: 30,
    priority: 'critical',
    objective: 'Review misses and print a one-page last-minute summary.',
    exitCriteria: [
      'You reviewed missed/partial questions and low-confidence topics.',
      'Your cheat sheet includes stories, weak questions, and your "Why Citi ERT?" answer.',
      'You printed or exported it.',
    ],
    route: '/cheat-sheet',
    topicKey: 'cheat-sheet',
  },
];

export function moduleForRoute(route: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.route === route);
}

export function moduleForId(id: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.id === id);
}

export const TOPIC_LABELS: Record<string, string> = {
  diagnostic: 'Diagnostic',
  'angular-bridge': 'Angular model',
  'rxjs-state': 'RxJS & state',
  'testing-lab': 'Testing',
  'coding-lab': 'Coding & review',
  'system-design': 'System design',
  'devops-controls': 'DevOps & controls',
  'risk-domain': 'Risk & security',
  leadership: 'Leadership',
  'mock-interview': 'Mock interview',
  'cheat-sheet': 'Final review',
};

export const STUDY_TOPIC_KEYS = Object.keys(TOPIC_LABELS);
