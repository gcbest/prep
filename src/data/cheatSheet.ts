export const CHEAT_SHEET_SECTIONS: { id: string; title: string; bullets: string[] }[] = [
  {
    id: 'angular',
    title: 'Angular',
    bullets: [
      '**OnPush**: reference/input changes, events, observable/signal updates, explicit marking; profile before optimizing.',
      '**DI**: understand provider scope and service lifetime.',
      '**Cleanup**: `DestroyRef` / `takeUntilDestroyed`; avoid nested subscriptions.',
      '**Forms**: typed reactive forms for complex enterprise workflows.',
      '**Performance**: measurement, identity tracking, virtualization, pure computations, lazy loading.',
    ],
  },
  {
    id: 'rxjs',
    title: 'RxJS',
    bullets: [
      '**switchMap**: replace/cancel.',
      '**mergeMap**: concurrent.',
      '**concatMap**: ordered.',
      '**exhaustMap**: ignore while active.',
      'Place **catchError** at the boundary whose failure should be contained.',
    ],
  },
  {
    id: 'testing',
    title: 'Testing',
    bullets: [
      '**Jasmine** = specs/assertions/spies.',
      '**Karma** = browser runner/reporting in this stack.',
      '**TestBed** = Angular component/DI/template environment.',
      'Test behavior, boundaries, errors, and accessibility.',
      '**Cypress** = critical integrated browser journeys.',
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    bullets: [
      'Requirements before boxes.',
      'Separate ephemeral, form, URL, server, shared, and streaming state.',
      'Justify micro-frontends through organizational boundaries.',
      'Include security, freshness, partial failure, observability, deployment, and rollback.',
    ],
  },
  {
    id: 'risk',
    title: 'Risk',
    bullets: [
      'Zero is not no data.',
      'Show freshness and partial-data status.',
      'Server enforces entitlements.',
      'Preserve auditability and lineage.',
    ],
  },
  {
    id: 'leadership',
    title: 'Leadership',
    bullets: [
      'Ownership.',
      'Alternatives and trade-offs.',
      'Communication.',
      'Measurable result.',
      'Root-cause prevention.',
    ],
  },
];

export const RAPID_FIRE_ANSWERS: { title: string; points: string[] }[] = [
  {
    title: 'Explain OnPush',
    points: [
      'Reduces unnecessary checking by relying on explicit update triggers and stable boundaries.',
      'Triggers: changed input references, in-component events, async observable emissions, signal updates, explicit markForCheck/detectChanges.',
      'Best with immutable state, stable identities, pure view computations, and measured performance.',
      'Not a magic switch: large DOMs, grids, and excessive stream emissions still need virtualization, batching, profiling.',
    ],
  },
  {
    title: 'Signals vs RxJS',
    points: [
      'Signals: synchronous local/shared state and derived values.',
      'RxJS: async pipelines, cancellation, concurrency, combination, retry, event streams.',
      'Interoperate where appropriate; do not force one abstraction everywhere.',
      'State ownership, lifecycle, error behavior, and readability drive the choice.',
    ],
  },
  {
    title: 'Why micro-frontends?',
    points: [
      'Use when independently owned domains need meaningful release autonomy.',
      'Define shell, routing, auth, design system, telemetry, and dependency contracts centrally.',
      'Accept costs: version skew, duplicated dependencies, integration testing, runtime failures, UX inconsistency.',
      'Prefer modular monolith or build-time packages when independent runtime deployment is not valuable.',
    ],
  },
  {
    title: 'Jasmine vs Karma',
    points: [
      'Jasmine provides specs, assertions, and spies.',
      'Karma runs tests in browsers and reports results.',
      'TestBed configures components, templates, DI, and fixtures.',
      'CI commonly runs headless browser tests with coverage and machine-readable results.',
    ],
  },
  {
    title: 'Client-side authorization',
    points: [
      'Hiding a button improves UX but does not enforce access control.',
      'The server must authenticate the caller and authorize every protected operation.',
      'The UI handles unauthorized responses safely and avoids exposing unnecessary sensitive data.',
      'Important actions create appropriate audit evidence.',
    ],
  },
  {
    title: 'Production incident',
    points: [
      'Establish impact and contain harm first.',
      'Assign incident ownership and communicate clearly.',
      'Diagnose using evidence and correlation across UI, API, and data layers.',
      'Recover safely and verify business correctness.',
      'Separate root cause from contributing factors.',
      'Add tests, monitoring, controls, ownership, and deadlines that prevent recurrence.',
    ],
  },
];

export const MOCK_RED_FLAGS: string[] = [
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

export const WHY_CITI_TEMPLATE = `I'm interested in this role because it combines [hands-on Angular/front-end strength]
with [enterprise architecture/technical leadership] in a domain where
[correctness, controls, and data clarity] directly matter to users.

My experience with [specific project] maps well because I [specific ownership/action]
and achieved [result]. I'm particularly interested in helping ERT
[modernize/build scalable risk platforms] while remaining hands-on and
raising engineering standards across the team.`;

export const WHY_CITI_WARNINGS: string[] = [
  'Generic prestige statements ("Citi is a great bank").',
  'Claiming deep risk expertise without evidence.',
  'Talking only about management.',
  'Saying the role is attractive merely because it uses Angular.',
];

export interface InterviewerQuestion {
  id: string;
  text: string;
  category: 'technical' | 'role' | 'product';
}

export const QUESTIONS_TO_ASK: InterviewerQuestion[] = [
  { id: 'q-angular-version', text: 'What Angular version and upgrade cadence does the team currently use?', category: 'technical' },
  { id: 'q-state', text: 'How is state managed today — NgRx, signals, services, or a combination?', category: 'technical' },
  { id: 'q-mf', text: 'What micro-frontend implementation is in production, and what problems led to that choice?', category: 'technical' },
  { id: 'q-shell-governance', text: 'How are the shell, design system, shared dependencies, and release compatibility governed?', category: 'technical' },
  { id: 'q-perf', text: 'What are the largest current performance or maintainability constraints?', category: 'technical' },
  { id: 'q-test-split', text: 'How are unit, contract, Cypress, and environment tests divided?', category: 'technical' },
  { id: 'q-role-split', text: 'What percentage of this role is coding, architecture, reviews, and mentoring?', category: 'role' },
  { id: 'q-ownership', text: 'Which technical decisions would this person own?', category: 'role' },
  { id: 'q-six-months', text: 'What would excellent performance look like after six months?', category: 'role' },
  { id: 'q-distributed', text: 'How is work split across the globally distributed team?', category: 'role' },
  { id: 'q-support', text: 'What production-support responsibilities exist?', category: 'role' },
  { id: 'q-workflows', text: 'Which risk-management workflows and user personas does the team support?', category: 'product' },
  { id: 'q-correctness', text: 'What are the most important correctness, freshness, and control requirements?', category: 'product' },
  { id: 'q-feedback', text: 'How is feedback collected from risk managers?', category: 'product' },
  { id: 'q-modernize', text: 'Which parts of the platform are being modernized versus maintained?', category: 'product' },
];

export const DIAGNOSTIC_SELF_RATING: { topic: string; topicKey: string; prompt: string }[] = [
  { topic: 'Angular components, DI, and change detection', topicKey: 'angular-bridge', prompt: 'Rate your confidence in Angular component model, DI scopes, and OnPush.' },
  { topic: 'RxJS operators and state boundaries', topicKey: 'rxjs-state', prompt: 'Rate your confidence in RxJS flattening operators and state classification.' },
  { topic: 'Jasmine/Karma/TestBed testing', topicKey: 'testing-lab', prompt: 'Rate your confidence writing Angular tests.' },
  { topic: 'Coding and code review', topicKey: 'coding-lab', prompt: 'Rate your confidence in Angular coding exercises and leading reviews.' },
  { topic: 'Micro-frontends and system design', topicKey: 'system-design', prompt: 'Rate your confidence in enterprise front-end architecture.' },
  { topic: 'DevOps and CI/CD controls', topicKey: 'devops-controls', prompt: 'Rate your confidence in Docker, CI/CD, and controls.' },
  { topic: 'Security and risk domain', topicKey: 'risk-domain', prompt: 'Rate your confidence in security and risk-domain vocabulary.' },
  { topic: 'Leadership stories', topicKey: 'leadership', prompt: 'Rate your readiness with STAR-L leadership stories.' },
];

export const DIAGNOSTIC_QUESTIONS: {
  id: string;
  type: 'multiple' | 'short';
  prompt: string;
  options?: string[];
  correct?: number;
  topicKey: string;
  rubric?: string[];
  answerNote?: string;
}[] = [
  {
    id: 'diag-1',
    type: 'multiple',
    prompt: 'Which Angular decorator marks a class as a component?',
    options: ['@Injectable', '@Component', '@Directive', '@NgModule'],
    correct: 1,
    topicKey: 'angular-bridge',
  },
  {
    id: 'diag-2',
    type: 'multiple',
    prompt: 'What triggers OnPush change detection? (select the best answer)',
    options: [
      'A timer anywhere in the app',
      'A new input reference, an event in the component, an async/signal update, or explicit marking',
      'Any browser paint',
      'Only route navigation',
    ],
    correct: 1,
    topicKey: 'angular-bridge',
  },
  {
    id: 'diag-3',
    type: 'multiple',
    prompt: 'Which operator cancels the previous inner observable on a new emission?',
    options: ['mergeMap', 'concatMap', 'exhaustMap', 'switchMap'],
    correct: 3,
    topicKey: 'rxjs-state',
  },
  {
    id: 'diag-4',
    type: 'multiple',
    prompt: 'Which operator ignores new emissions while an inner observable is active?',
    options: ['switchMap', 'exhaustMap', 'mergeMap', 'combineLatest'],
    correct: 1,
    topicKey: 'rxjs-state',
  },
  {
    id: 'diag-5',
    type: 'multiple',
    prompt: 'In the target stack, which tool runs tests in browsers?',
    options: ['Jasmine', 'Karma', 'TestBed', 'Cypress'],
    correct: 1,
    topicKey: 'testing-lab',
  },
  {
    id: 'diag-6',
    type: 'multiple',
    prompt: 'Where must authorization be enforced?',
    options: ['In the UI only', 'On the server for every protected operation', 'In the router guard only', 'In localStorage'],
    correct: 1,
    topicKey: 'risk-domain',
  },
  {
    id: 'diag-7',
    type: 'multiple',
    prompt: 'What best distinguishes zero from missing risk data in the UI?',
    options: [
      'Render both as "—"',
      'Show a timestamp only for zero',
      'Treat zero as a valid value and missing as unknown, with explicit states',
      'Ignore the difference',
    ],
    correct: 2,
    topicKey: 'risk-domain',
  },
  {
    id: 'diag-8',
    type: 'short',
    prompt: 'In two sentences, explain when you would choose NgRx over a scoped service.',
    topicKey: 'rxjs-state',
    rubric: [
      'NgRx for shared, eventful state with many features and side effects.',
      'Service for local/simple server cache or component state.',
      'Mentions not forcing a store everywhere.',
    ],
    answerNote: 'Shared, eventful state with clear actions/effects; service for local or simple cases.',
  },
  {
    id: 'diag-9',
    type: 'short',
    prompt: 'How do you decide between switchMap and mergeMap for a filter-driven HTTP call?',
    topicKey: 'rxjs-state',
    rubric: [
      'switchMap cancels stale requests when the filter changes.',
      'mergeMap allows concurrency and out-of-order responses.',
      'Prefer switchMap for "latest wins" search/filter.',
    ],
    answerNote: 'switchMap for latest-wins cancellation; mergeMap for independent concurrent work.',
  },
  {
    id: 'diag-10',
    type: 'short',
    prompt: 'Name two cleanup mechanisms for Angular subscriptions.',
    topicKey: 'angular-bridge',
    rubric: ['async pipe', 'takeUntilDestroyed/DestroyRef (or ngOnDestroy unsubscribe).'],
    answerNote: 'async pipe; takeUntilDestroyed/DestroyRef; ngOnDestroy.',
  },
  {
    id: 'diag-11',
    type: 'short',
    prompt: 'Why is client-side role hiding not security?',
    topicKey: 'risk-domain',
    rubric: ['UI hiding is UX only', 'server must authenticate/authorize every operation', 'unauthorized data must not reach the client.'],
    answerNote: 'The server must enforce; the client only improves UX.',
  },
  {
    id: 'diag-12',
    type: 'short',
    prompt: 'What would you check first when a large risk table is slow?',
    topicKey: 'system-design',
    rubric: ['Measure before optimizing', 'network vs state vs change detection vs DOM vs rendering', 'profile with DevTools.'],
    answerNote: 'Profile first: network, state, change detection, DOM size, rendering.',
  },
  {
    id: 'diag-13',
    type: 'short',
    prompt: 'Describe the cost of micro-frontends in one or two sentences.',
    topicKey: 'system-design',
    rubric: ['version skew', 'duplicated deps', 'integration testing/runtime failures/UX inconsistency.'],
    answerNote: 'Version skew, duplicated dependencies, integration testing, runtime failures, UX inconsistency.',
  },
  {
    id: 'diag-14',
    type: 'short',
    prompt: 'What belongs in a production Docker image for an Angular app?',
    topicKey: 'devops-controls',
    rubric: ['built static assets or BFF', 'runtime deps and health endpoint', 'no secrets/source maps exposed.'],
    answerNote: 'Built assets/BFF, runtime deps, health endpoint — no secrets.',
  },
  {
    id: 'diag-15',
    type: 'short',
    prompt: 'What makes a production-incident story strong?',
    topicKey: 'leadership',
    rubric: ['contain and communicate', 'evidence-based diagnosis', 'root cause vs contributing factors', 'preventive follow-up with ownership.'],
    answerNote: 'Contain, communicate, diagnose with evidence, prevent recurrence.',
  },
  {
    id: 'diag-16',
    type: 'short',
    prompt: 'How do you give code-review feedback as a lead?',
    topicKey: 'leadership',
    rubric: ['material risk first', 'separate blocking vs coaching', 'explain why and offer to pair.'],
    answerNote: 'Material risk first; block vs coach; explain why.',
  },
  {
    id: 'diag-17',
    type: 'multiple',
    prompt: 'Which statement about ngOnInit vs useEffect is accurate?',
    options: [
      'They are identical',
      'ngOnInit runs once after first input binding; useEffect can re-run with deps',
      'ngOnInit re-runs on every render',
      'useEffect runs only once',
    ],
    correct: 1,
    topicKey: 'angular-bridge',
  },
  {
    id: 'diag-18',
    type: 'multiple',
    prompt: 'What does a route resolver do in Angular?',
    options: [
      'Blocks navigation',
      'Pre-fetches data before the component renders',
      'Lazy-loads styles',
      'Manages CSS classes',
    ],
    correct: 1,
    topicKey: 'angular-bridge',
  },
  {
    id: 'diag-19',
    type: 'multiple',
    prompt: 'Which state belongs in the URL?',
    options: ['Hover state', 'Shareable filters/selection', 'A transient loading flag', 'Theme preference'],
    correct: 1,
    topicKey: 'rxjs-state',
  },
  {
    id: 'diag-20',
    type: 'multiple',
    prompt: 'How do you promote an Angular build through environments?',
    options: [
      'Rebuild in each environment',
      'Promote one immutable artifact with injected config',
      'Copy files manually',
      'Deploy source maps only',
    ],
    correct: 1,
    topicKey: 'devops-controls',
  },
];
