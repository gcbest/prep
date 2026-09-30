export interface MockSection {
  id: string;
  title: string;
  minutes: number;
  instruction: string;
  questionIds: string[];
  count: number;
  rubric: string[];
}

export const MOCK_SECTIONS: MockSection[] = [
  {
    id: 'angular-depth',
    title: 'Angular depth',
    minutes: 15,
    instruction: 'Answer aloud, then self-score against the rubric.',
    questionIds: [
      'ang-onpush',
      'ang-signals-vs-rxjs',
      'ang-di-scopes',
      'ang-leaks',
      'ang-forms',
      'ang-interceptors',
      'ang-unnecessary-updates',
      'ang-lazy-guards',
      'ang-feature-structure',
    ],
    count: 5,
    rubric: ['Mechanism, not definition', 'Trade-offs', 'Production implications', 'Honest about limits'],
  },
  {
    id: 'testing-coding',
    title: 'Testing and coding',
    minutes: 15,
    instruction: 'For coding prompts, talk through your approach or write notes.',
    questionIds: ['test-service', 'test-http-retry', 'test-nested-sub', 'test-flattening', 'test-snapshot-delta'],
    count: 2,
    rubric: ['Correct boundaries', 'Deterministic tests', 'Explains cleanup/races', 'Clear communication'],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    minutes: 15,
    instruction:
      'Design a scalable enterprise risk-management portal. Discuss micro-frontends, security, data freshness, observability, and deployment.',
    questionIds: ['arch-portal'],
    count: 1,
    rubric: ['Requirements first', 'Server-side authorization', 'Freshness/partial failure', 'Observability & rollback', 'Trade-offs'],
  },
  {
    id: 'leadership',
    title: 'Leadership',
    minutes: 15,
    instruction: 'Use STAR-L: Situation, Task, Actions, Result, Learning.',
    questionIds: ['lead-incident', 'lead-mentoring', 'lead-disagreement', 'lead-reprioritization', 'lead-risk-release', 'lead-business-comms'],
    count: 3,
    rubric: ['Personal ownership', 'Under two minutes', 'Measurable result', 'Trade-offs', 'What changed afterward'],
  },
];

export const MOCK_RED_FLAGS = [
  '"I am mostly an architect now and do not code much."',
  'Treating Angular as React with different syntax.',
  'Recommending NgRx for every state problem.',
  'Recommending micro-frontends without organizational justification.',
  'Ignoring Jasmine/Karma because newer tools exist.',
  'Discussing Docker without immutable artifacts, scanning, configuration, or rollback.',
  'Treating UI role checks as security enforcement.',
  'Ignoring stale, missing, or partially loaded risk data.',
  'Giving incident stories centered on heroics or blame.',
  'Giving code-review feedback without prioritizing material risk.',
  'Drawing architecture before clarifying users, scale, freshness, and controls.',
  'Claiming optimization without profiling or measurements.',
];
