export interface TestMapping {
  react: string;
  angular: string;
  note: string;
}

export const TEST_MAPPINGS: TestMapping[] = [
  { react: 'Vitest/Jest runner', angular: 'Karma runner in this target stack', note: 'Karma launches browsers, executes specs, and reports results.' },
  { react: 'Jest/Vitest assertion and mocks', angular: 'Jasmine assertions and spies', note: 'describe/it/expect, spyOn, jasmine.createSpyObj.' },
  { react: 'React Testing Library render', angular: 'Angular TestBed and fixture', note: 'TestBed configures components, providers, and templates.' },
  { react: 'screen queries', angular: 'Native element or Angular testing-library queries', note: 'Test from the user perspective, not selector internals.' },
  { react: 'Mock Service Worker', angular: 'HttpTestingController for unit-level HTTP tests', note: 'Mock at the HttpClient transport and assert request/response.' },
  { react: 'act/async utilities', angular: 'fixture change detection, fakeAsync, tick, waitForAsync', note: 'Control async timing deterministically.' },
];

export const TESTING_ROLES: string[] = [
  '**Jasmine** supplies specs (describe/it), expectations (expect), and spies (spyOn) — the assertion and mock layer.',
  '**Karma** launches real browsers, runs the Jasmine specs, and produces reports/coverage. In CI it usually runs headless (e.g., ChromeHeadless).',
  '**TestBed** creates and configures an Angular environment: dependency injection, templates, change detection, and fixtures.',
  '**Cypress** should focus on critical, integrated browser journeys (the happy path and the highest-value flows), not duplicating every unit case.',
];

export interface TestCaseRequirement {
  id: string;
  label: string;
  hint: string;
}

export const TEST_CASES: TestCaseRequirement[] = [
  { id: 'success', label: 'Successful load', hint: 'Mock the service to emit a limit; assert utilization renders and loading clears.' },
  { id: 'thresholds', label: 'Threshold boundaries at 79.99%, 80%, 99.99%, and 100%', hint: 'Parametrize a Jasmine it.each-style loop or four specs; assert warning vs breach classes/messages.' },
  { id: 'http-error', label: 'HTTP error', hint: 'Use HttpTestingController to flush a 500; assert error state and message.' },
  { id: 'retry', label: 'Retry action', hint: 'Click retry; assert a second request is issued and success re-renders.' },
  { id: 'missing', label: 'Missing data', hint: 'null/undefined payload should render "no data" — distinct from zero.' },
  { id: 'permission', label: 'Permission-disabled action', hint: 'With entitlement false, the acknowledge button is disabled or hidden and not clickable.' },
  { id: 'cleanup', label: 'Observable cleanup', hint: 'Use fakeAsync to destroy the component and assert no leak (or that a spy unsubscribe runs).' },
  { id: 'a11y', label: 'Accessible status message', hint: 'Assert role=status or aria-live is present and announces warning/breach.' },
];

export const RISK_LIMIT_COMPONENT_CODE = `// risk-limit.component.ts (Angular-like sample for test planning)
@Component({
  selector: 'app-risk-limit',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div *ngIf="loading" role="status">Loading limit…</div>

    <div *ngIf="error" role="alert">
      <p>{{ error }}</p>
      <button (click)="load()">Retry</button>
    </div>

    <div *ngIf="!loading && !error && !limit">
      <p role="status">No limit available for this portfolio.</p>
    </div>

    <div *ngIf="!loading && !error && limit">
      <p role="status"
         [class.warning]="isWarning"
         [class.breach]="isBreach">
        Utilization: {{ utilization }}%
      </p>
      <button [disabled]="!canAcknowledge" (click)="acknowledge()">Acknowledge</button>
    </div>
  \`
})
export class RiskLimitComponent implements OnInit, OnDestroy {
  @Input() portfolioId!: string;
  @Input() canAcknowledge = false;

  limit?: RiskLimit;
  error?: string;
  loading = false;
  private destroyRef = inject(DestroyRef);

  constructor(private service: RiskLimitService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;
    this.service
      .getLimit(this.portfolioId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (limit) => { this.limit = limit; this.loading = false; },
        error: (err) => {
          this.error = 'Unable to load limit.';
          this.loading = false;
        },
      });
  }

  get utilization(): number | undefined {
    return this.limit?.utilization;
  }

  get isWarning(): boolean {
    const u = this.utilization;
    return u != null && u >= 80 && u < 100;
  }

  get isBreach(): boolean {
    const u = this.utilization;
    return u != null && u >= 100;
  }

  acknowledge(): void {
    // would call service with audit context in a real app
  }
}`;

export const MODEL_ANSWER_CODE = `describe('RiskLimitComponent', () => {
  let service: jasmine.SpyObj<RiskLimitService>;
  let fixture: ComponentFixture<RiskLimitComponent>;

  beforeEach(async () => {
    service = jasmine.createSpyObj('RiskLimitService', ['getLimit']);
    await TestBed.configureTestingModule({
      imports: [RiskLimitComponent],
      providers: [{ provide: RiskLimitService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskLimitComponent);
    fixture.componentRef.setInput('portfolioId', 'p1');
  });

  it('renders utilization and clears loading on success', () => {
    service.getLimit.and.returnValue(of({ utilization: 42 }));
    fixture.detectChanges();
    expect(service.getLimit).toHaveBeenCalledWith('p1');
    expect(fixture.nativeElement.textContent).toContain('42');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent)
      .toContain('42');
  });

  [79.99, 80, 99.99, 100].forEach((value) => {
    it(\`applies the right class at \${value}%\`, () => {
      service.getLimit.and.returnValue(of({ utilization: value }));
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[role="status"]');
      if (value >= 100) expect(el.classList).toContain('breach');
      else if (value >= 80) expect(el.classList).toContain('warning');
      else { expect(el.classList).not.toContain('warning'); expect(el.classList).not.toContain('breach'); }
    });
  });

  it('shows a distinct message for missing data', () => {
    service.getLimit.and.returnValue(of(null));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No limit available');
  });

  it('disables acknowledge without entitlement', () => {
    fixture.componentRef.setInput('canAcknowledge', false);
    service.getLimit.and.returnValue(of({ utilization: 50 }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').disabled).toBeTrue();
  });

  it('retries after an error', () => {
    service.getLimit.and.returnValues(throwError(() => new Error('500')), of({ utilization: 10 }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Unable to load limit');
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(service.getLimit).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('10');
  });
});`;

export const TEST_COMMENTARY: string[] = [
  'Mock the service (the boundary), not the component internals. Keep the template integration real via TestBed.',
  'Threshold boundaries are data-driven; looping over values avoids copy-pasted specs and captures off-by-one bugs.',
  'Missing data and zero are different states with different messages — test both.',
  'Permission is asserted via the disabled state, and would also be enforced server-side in production.',
  'takeUntilDestroyed is the cleanup mechanism; in tests, destroying the fixture should not leave timers/subscriptions.',
  'The status message carries role="status" so assistive tech announces warning/breach changes.',
];

export const TESTING_PROMPTS: string[] = [
  'What should be mocked and what should remain integrated?',
  'How do you avoid brittle component tests?',
  'How do you test timers and RxJS streams deterministically?',
  'How do you prevent flaky Cypress tests?',
  'What tests run on every pull request versus before deployment?',
  'Is coverage percentage enough? Why not?',
  'How do contract tests protect a micro-frontend/API boundary?',
];

export const TESTING_PROMPT_ANSWERS: Record<string, string> = {
  'What should be mocked and what should remain integrated?':
    'Mock external boundaries (HTTP, storage, third-party APIs) and slow/nondeterministic services. Keep the component, template, change detection, and pure logic integrated. The more real the environment, the more meaningful the test — until flakiness or cost forces a seam.',
  'How do you avoid brittle component tests?':
    'Assert on user-visible behavior (text, roles, states) rather than internal fields or selector paths. Use stable queries, avoid implementation details, and keep mocks minimal. If a refactor breaks many tests without changing behavior, the tests are too coupled.',
  'How do you test timers and RxJS streams deterministically?':
    'Use fakeAsync/tick to advance virtual time, jasmine.clock() for timers, and TestScheduler (rxjs) for marble-based stream assertions. Avoid real setTimeout or wall-clock waits in unit tests.',
  'How do you prevent flaky Cypress tests?':
    'Make tests independent, use deterministic fixtures/seeds, wait on real UI conditions (intercept + visible elements) instead of fixed sleeps, avoid external dependencies, and isolate shared state. Run them in a stable environment and quarantine genuine flakes quickly.',
  'What tests run on every pull request versus before deployment?':
    'Every PR: lint, type checking, fast unit tests, and targeted component tests. Pre-deployment: the full suite, coverage gates, static/security/dependency scans, and critical Cypress journeys plus smoke tests against a staging environment.',
  'Is coverage percentage enough? Why not?':
    'No. Coverage shows which lines execute, not whether assertions are meaningful or boundaries are tested. High coverage with weak assertions gives false confidence. Review the test cases, not just the number.',
  'How do contract tests protect a micro-frontend/API boundary?':
    'Contract tests pin the agreed request/response shapes and semantics between a frontend and its API (or between micro-frontends). They catch breaking changes early, allow independent deployment, and document the compatibility contract.',
};
