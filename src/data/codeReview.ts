export interface ReviewFinding {
  id: string;
  category: 'correctness' | 'security' | 'performance' | 'testability' | 'maintainability' | 'operational';
  severity: 'block' | 'fix' | 'schedule' | 'optional';
  title: string;
  detail: string;
  fix: string;
}

export const FLAWED_CODE = `// risk-dashboard.component.ts — deliberately flawed for review
@Component({
  selector: 'app-risk-dashboard',
  template: \`
    <div *ngFor="let row of data">
      <h3>{{ row.name }}</h3>
      <p>{{ formatExposure(row) }}</p>
      <button *ngIf="canAcknowledge(row)" (click)="ack(row)">Ack</button>
    </div>
  \`
})
export class RiskDashboardComponent implements OnInit {
  data: any[] = [];
  private rows: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.http.get('/api/exposures').subscribe((res: any) => {
      this.rows = res.rows;
      this.data = this.rows.filter((r: any) => r.active);
    });

    this.http.get('/api/limits').subscribe((res: any) => {
      this.data.forEach((row) => {
        this.http.get('/api/limits/' + row.id).subscribe((limit: any) => {
          row.limit = limit;
          console.log('Loaded limit for', row.name, 'ssn=', row.ssn);
        });
      });
    });

    window.addEventListener('resize', () => {
      this.recalculate();
    });
  }

  formatExposure(row: any) {
    const total = row.exposures.reduce((a: any, b: any) => a + b.notional, 0);
    return 'USD ' + total.toFixed(2);
  }

  canAcknowledge(row: any) {
    return this.auth.currentUser.roles.includes('ack');
  }

  ack(row: any) {
    this.http.post('/api/ack', { id: row.id }).subscribe({
      error: () => {}
    });
  }

  recalculate() {
    // expensive layout math over this.data
  }
}`;

export const REVIEW_FINDINGS: ReviewFinding[] = [
  {
    id: 'any-types',
    category: 'maintainability',
    severity: 'schedule',
    title: 'any everywhere',
    detail: '`any` types throughout erode compile-time safety and hide contract drift.',
    fix: 'Introduce RiskRow/Limit interfaces and type the API responses.',
  },
  {
    id: 'business-in-template',
    category: 'maintainability',
    severity: 'schedule',
    title: 'Business logic in the template',
    detail: 'formatExposure and canAcknowledge run inside the template, mixing logic with markup.',
    fix: 'Move formatting and permission checks to the class (or pure pipe/selector).',
  },
  {
    id: 'nested-subscriptions',
    category: 'correctness',
    severity: 'block',
    title: 'Nested subscriptions and race conditions',
    detail: 'A subscription inside a loop over mutable `this.data` mutates rows that may not exist yet; late responses can overwrite each other.',
    fix: 'Compose with RxJS (e.g., switchMap/mergeMap/forkJoin) into a single observable, or normalize state via a service.',
  },
  {
    id: 'no-cancellation',
    category: 'correctness',
    severity: 'block',
    title: 'No cancellation or unsubscribe',
    detail: 'All subscriptions and the window resize listener leak after navigation and keep running.',
    fix: 'Use async pipe, takeUntilDestroyed/DestroyRef, or ngOnDestroy cleanup.',
  },
  {
    id: 'mutable-shared-state',
    category: 'correctness',
    severity: 'fix',
    title: 'Mutable shared state',
    detail: 'Rows are mutated in place (row.limit = limit), which breaks OnPush reference identity and makes history/debugging hard.',
    fix: 'Treat state as immutable; produce new objects on update.',
  },
  {
    id: 'expensive-template-method',
    category: 'performance',
    severity: 'fix',
    title: 'Expensive template method',
    detail: 'formatExposure recomputes on every change detection cycle for every row.',
    fix: 'Precompute totals, use a pure pipe, or a computed value; consider OnPush + trackBy.',
  },
  {
    id: 'missing-track',
    category: 'performance',
    severity: 'schedule',
    title: 'Missing row identity tracking',
    detail: '*ngFor has no trackBy, so Angular re-creates DOM nodes unnecessarily.',
    fix: 'Add trackBy (or `track` with @for).',
  },
  {
    id: 'client-permission',
    category: 'security',
    severity: 'block',
    title: 'Client-only permission check',
    detail: 'canAcknowledge relies solely on client-side roles. The server must authorize every action; the UI check is only UX.',
    fix: 'Enforce entitlement on the API and handle 401/403 safely in the UI.',
  },
  {
    id: 'silent-swallow',
    category: 'operational',
    severity: 'fix',
    title: 'Silent error swallowing',
    detail: 'The acknowledge call swallows errors, so users believe an action succeeded when it failed.',
    fix: 'Surface failures, keep audit evidence, and offer retry with a clear status.',
  },
  {
    id: 'sensitive-logs',
    category: 'security',
    severity: 'block',
    title: 'Sensitive data in logs',
    detail: 'Logging `ssn=` writes regulated personal data to the console.',
    fix: 'Remove it; log non-sensitive correlation IDs, not payload fields.',
  },
  {
    id: 'oversized-component',
    category: 'maintainability',
    severity: 'schedule',
    title: 'One oversized component',
    detail: 'Data loading, permissions, formatting, and layout math live in one component.',
    fix: 'Extract a service/facade, presentational row component, and pure formatting helpers.',
  },
  {
    id: 'weak-tests',
    category: 'testability',
    severity: 'schedule',
    title: 'Weak tests coupled to implementation',
    detail: 'Tests that assert internal fields/method calls will break on refactor and miss user-visible behavior.',
    fix: 'Assert rendered states, roles, and behavior through the template.',
  },
];

export const REVIEW_CATEGORIES = [
  'Correctness',
  'Security/control',
  'Performance',
  'Testability',
  'Maintainability',
  'Operational risk',
] as const;

export const REVIEW_SEVERITIES = [
  { id: 'block', label: 'Block merge', color: 'red' },
  { id: 'fix', label: 'Fix before release', color: 'amber' },
  { id: 'schedule', label: 'Schedule follow-up', color: 'sky' },
  { id: 'optional', label: 'Optional improvement', color: 'slate' },
] as const;

export const REVIEW_MODEL_ANSWER = [
  'A strong lead does not dump a long style list on the author. They identify material risk first, explain why it matters, suggest a practical correction, and separate blocking issues from coaching suggestions.',
  'Blocking: nested subscriptions with race conditions, no cleanup (leak), client-only authorization, and sensitive data in logs. These can produce wrong data, memory leaks, or control failures.',
  'Fix before release: silent error swallowing and expensive/mutable template patterns — they degrade correctness and performance in production.',
  'Coaching/schedule: `any` types, missing trackBy, oversized component, and weak tests — important but not release-blocking if the material risks are handled.',
  'Deliver the review as: "Here are the two things we must change, here is the control/security concern, and here are follow-ups I would not block on." Then offer to pair on the fix.',
];
