export interface ConceptCard {
  id: string;
  react: string;
  angular: string;
  similarity: string;
  criticalDifference: string;
  explanation: string;
  example: string;
  trap: string;
}

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'component',
    react: 'Function component',
    angular: 'Component class + template + metadata',
    similarity: 'Both decompose the UI into reusable, testable units with inputs and outputs.',
    criticalDifference:
      'Angular components are classes decorated with @Component metadata and have framework-managed lifecycle, dependency injection, and a separate template. React components are functions whose render output is the component.',
    explanation:
      'An Angular component is a TypeScript class with a @Component decorator pointing to a template and styles. The framework instantiates the class, runs change detection, and wires inputs and outputs. State lives on the class, but the framework decides when the view re-evaluates. In React, the function body re-runs on render; in Angular the class is created once and the template is evaluated against it.',
    example:
      '@Component({ selector: "app-limit", standalone: true, template: `<p>{{ limit.utilization }}%</p>` }) export class LimitComponent { @Input() limit?: RiskLimit; }',
    trap: 'If someone says "an Angular component is like a React function component with a render method", they miss DI, template compilation, and lifecycle. The class body is not the render function.',
  },
  {
    id: 'props',
    react: 'Props',
    angular: '@Input() / signal inputs',
    similarity: 'Both pass data from a parent to a child.',
    criticalDifference:
      'React re-renders the child when parent render output changes. Angular evaluates bindings during change detection; with OnPush, a new input reference (or signal value) is one of the triggers.',
    explanation:
      'Props are declarative data passed down the tree. Angular inputs are class properties decorated with @Input(), or signal inputs with input(). Bindings are checked by change detection. With OnPush, Angular skips re-checking unless a bound input reference changes (or a signal/async emission triggers it).',
    example:
      'React: <RiskTable rows={rows} />. Angular: <app-risk-table [rows]="rows" /> with @Input() rows: RiskRow[];',
    trap: 'Treating Angular inputs as "re-render props" hides the fact that Angular does not re-run the class body; it re-evaluates template bindings on a schedule.',
  },
  {
    id: 'callback',
    react: 'Callback prop',
    angular: '@Output() / EventEmitter',
    similarity: 'Both let a child notify a parent that something happened.',
    criticalDifference:
      'Angular uses explicit event binding in the template: (selectionChange)="onSelect($event)". Outputs are observable-like EventEmitters, and the event name is part of the component API.',
    explanation:
      'React passes a function and the child calls it. Angular declares an @Output() property typed as EventEmitter<T> and emits events; the parent binds to the event name. This makes the child-to-parent contract explicit and discoverable in tooling.',
    example:
      'React: <Select onPick={handlePick} />. Angular: <app-select (picked)="handlePick($event)" /> with @Output() picked = new EventEmitter<string>();',
    trap: 'EventEmitter is not a generic callback. It has subscription semantics and, in older Angular, was an RxJS Subject. Do not describe it as "just a callback prop with different syntax".',
  },
  {
    id: 'state',
    react: 'useState',
    angular: 'Signal or component field',
    similarity: 'Both hold local state that drives the view.',
    criticalDifference:
      'A plain Angular field only updates the view when change detection runs; a signal notifies its consumers and can drive fine-grained updates. React state triggers a re-render of the component function.',
    explanation:
      'React useState returns a value and a setter that schedules a re-render. Angular signals are reactive primitives: reading a signal in a template registers a dependency, and writing a new value updates only consumers. A plain class field is fine for one-time data, but it will not update the view by itself.',
    example:
      'React: const [q, setQ] = useState("");. Angular: query = signal(""); then update query.set(v); or for static data query = "";',
    trap: 'Assuming every Angular field is automatically "reactive" like React state. Only signal writes (or change detection triggers) cause view updates.',
  },
  {
    id: 'memo',
    react: 'useMemo',
    angular: 'computed() or pure pipe',
    similarity: 'Both derive a value and avoid recomputation when inputs are unchanged.',
    criticalDifference:
      'computed() is dependency-tracked and lazy; pure pipes are memoized across change detection runs with identical inputs. useMemo is tied to React re-renders.',
    explanation:
      'A computed() signal re-evaluates only when its dependent signals change. Angular pure pipes re-run only when their input references change. Both provide caching, but Angular pipes live in templates and are only pure if you keep them free of side effects.',
    example:
      'React: const total = useMemo(() => sum(rows), [rows]). Angular: total = computed(() => sum(this.rows())); or {{ rows | sum }} with a pure pipe.',
    trap: 'An impure pipe (pure: false) runs every change detection cycle — do not put expensive work there. Also computed() must stay synchronous and side-effect free.',
  },
  {
    id: 'effect',
    react: 'useEffect',
    angular: 'Lifecycle hooks, effect(), or an RxJS pipeline',
    similarity: 'Both express "do something in reaction to a change or lifecycle moment".',
    criticalDifference:
      'ngOnInit is not useEffect. It runs once after the first input bindings are set, not after every render. For reactive side effects Angular uses effect(), ngOnChanges, or RxJS subscriptions; for cleanup use ngOnDestroy, DestroyRef, or takeUntilDestroyed.',
    explanation:
      'React useEffect re-runs based on a dependency array. Angular has distinct lifecycle hooks (ngOnInit, ngOnChanges, ngAfterViewInit, ngOnDestroy) plus effect() for signal-driven side effects. Map the specific need to the specific hook instead of a single effect hook.',
    example:
      'Load-once data goes in ngOnInit; input-change reactions go in ngOnChanges or a setter; signal side effects go in effect(); teardown goes in ngOnDestroy or takeUntilDestroyed.',
    trap: 'Saying "ngOnInit is Angular\'s useEffect" is a common red flag. ngOnInit runs once; useEffect with an empty array is closer, but even that has different timing and cleanup semantics.',
  },
  {
    id: 'context',
    react: 'Context',
    angular: 'Hierarchical dependency injection',
    similarity: 'Both share configuration/services across a subtree without prop drilling.',
    criticalDifference:
      'Angular DI is a constructor-injected, scoped, lazily-instantiated service graph with provider resolution from the injection point upward. React Context is shared render state that triggers re-renders.',
    explanation:
      'Angular providers are registered at root, route, component, or environment scope, and a service instance is created by the injector that owns it. This controls lifetime and identity. React Context primarily distributes values and causes consumers to re-render.',
    example:
      'Providing RiskApiService in the RiskFeatureComponent gives all descendants the same instance; a different instance can be provided at a lower level for isolation.',
    trap: 'Describing DI as "just React Context" hides injector hierarchy, provider scope, and the fact that DI is about object composition, not rendering.',
  },
  {
    id: 'redux',
    react: 'Redux',
    angular: 'NgRx Store / Effects / Selectors',
    similarity: 'Both centralize shared state and make updates predictable.',
    criticalDifference:
      'NgRx is RxJS-centric: actions are dispatched, reducers produce new state, selectors derive views, and effects listen to actions to run side effects and dispatch new actions. There is no middleware chain like Redux middleware in the same sense.',
    explanation:
      'NgRx Store is built on RxJS BehaviorSubject-style state. Effects model asynchronous side effects explicitly (HTTP calls, router events) and can retry/cancel with operators. Selectors are memoized. Use it for genuinely shared, eventful state — not every form field.',
    example:
      'Dispatch loadLimits action → LimitsEffects calls the API with switchMap and catchError → dispatches loadLimitsSuccess or loadLimitsFailure → reducer updates entities.',
    trap: 'Recommending NgRx for every state problem is a red flag. Ephemeral UI state and local form state usually belong in components/services.',
  },
  {
    id: 'router',
    react: 'React Router',
    angular: 'Angular Router',
    similarity: 'Both map URLs to views and support nested routes and params.',
    criticalDifference:
      'Angular Router is deeply integrated with DI: guards and resolvers are injected services, lazy routes are loadChildren/loadComponent bundles, and data is resolved before the component renders.',
    explanation:
      'Angular routes define components, guards (canActivate, canDeactivate), resolvers that pre-fetch data, and lazy-loaded bundles. Guards are injectable classes, which makes them easy to test and share. Resolvers avoid rendering a half-loaded component.',
    example:
      '{ path: "limits/:id", component: LimitDetailComponent, canActivate: [EntitlementGuard], resolve: { limit: LimitResolver } }',
    trap: 'Treating Angular guards as just "route-level if checks" misses their DI integration, ordering, and testability.',
  },
  {
    id: 'forms',
    react: 'Controlled form',
    angular: 'Reactive FormControl / FormGroup',
    similarity: 'Both keep form state as an explicit, programmatic source of truth.',
    criticalDifference:
      'Angular reactive forms expose observable status/value streams (valueChanges, statusChanges) and typed FormControl/FormGroup/FormArray models. Template-driven forms instead lean on directives and two-way binding.',
    explanation:
      'Reactive forms build a model tree in the class, bind to controls with formControlName, and derive validation and status reactively. This suits complex, dynamic, enterprise forms. Template-driven forms are simpler and rely on ngModel and directives.',
    example:
      'form = new FormGroup({ threshold: new FormControl<number>(80, [Validators.required, Validators.min(0), Validators.max(100)]) });',
    trap: 'Calling reactive forms "controlled inputs" is directionally fine, but note the observable streams, typed controls, and explicit validation model.',
  },
  {
    id: 'http',
    react: 'Fetch / Axios',
    angular: 'HttpClient',
    similarity: 'Both make HTTP requests and return data.',
    criticalDifference:
      'HttpClient returns a cold Observable, not a Promise, and its responses are typed and parsed via interceptors. It is the natural place for auth headers, correlation IDs, retry, and error normalization.',
    explanation:
      'Because HttpClient returns an Observable, you compose it with RxJS operators (switchMap, retry, catchError, shareReplay). Interceptors run on every request/response and are injectable and testable. Unsubscribe/cleanup still matters.',
    example:
      'this.http.get<RiskLimit>(`/api/limits/${id}`).pipe(retry(1), catchError(...))',
    trap: 'Forgetting that the observable is cold: nothing is sent until subscribe, and late subscribers can trigger duplicate requests unless the stream is shared.',
  },
  {
    id: 'error-boundary',
    react: 'Error boundary',
    angular: 'ErrorHandler + router/error UI patterns',
    similarity: 'Both handle unexpected errors so the whole app does not crash.',
    criticalDifference:
      'Angular has no direct per-component error boundary. You use a global ErrorHandler, route-level guards/resolvers, defensive templates, and null-safe bindings to contain failures.',
    explanation:
      'Angular templates are null-safe with the optional chaining-ish safe navigation (older syntax) and modern @if guards. A global ErrorHandler can log and route to a friendly error page, but it cannot render a fallback for an arbitrary subtree like React boundaries.',
    example:
      'class GlobalErrorHandler implements ErrorHandler { handleError(error) { log(error); injector.get(Router).navigate(["/error"]); } }',
    trap: 'Do not claim Angular has error boundaries. Explain the alternatives and their limitations honestly.',
  },
  {
    id: 'lazy',
    react: 'React.lazy',
    angular: 'Lazy-loaded routes / features',
    similarity: 'Both split code so users download only what they need.',
    criticalDifference:
      'Angular lazy loading is route-centric: loadChildren/loadComponent loads an NgModule (legacy) or standalone component bundle. The DI and change detection context are part of what gets loaded.',
    explanation:
      'Lazy Angular routes create separate bundles loaded on navigation. Standalone components simplify this. Budgets, prefetching strategies, and shared dependencies all affect bundle size and runtime.',
    example:
      'loadComponent: () => import("./risk/risk.component").then(m => m.RiskComponent)',
    trap: 'Confusing React.lazy (component-level) with Angular route-level code splitting and DI boundaries.',
  },
  {
    id: 'testing',
    react: 'React Testing Library',
    angular: 'Angular TestBed + DOM-oriented assertions',
    similarity: 'Both encourage testing behavior from a user perspective.',
    criticalDifference:
      'TestBed configures a real Angular environment (declarations, providers, templates, change detection). Fixtures and async utilities (fakeAsync, tick, waitForAsync) replace React act() and event utilities.',
    explanation:
      'Angular tests use TestBed.configureTestingModule to set up the injector and compile the component. fixture.detectChanges() runs change detection. HttpTestingController mocks HttpClient at the transport level. Jasmine provides describe/it/expect/spyOn.',
    example:
      'TestBed.configureTestingModule({ imports: [LimitComponent], providers: [{ provide: RiskLimitService, useValue: mockService }] });',
    trap: 'Assuming Angular tests are "just React Testing Library with different queries". TestBed and change detection are the hard parts.',
  },
];

export interface AngularSection {
  id: string;
  title: string;
  bullets: string[];
  prompt?: string;
  promptGuidance?: string[];
}

export const ANGULAR_SECTIONS: AngularSection[] = [
  {
    id: 'components-templates',
    title: 'Components and templates',
    bullets: [
      '**Component metadata**: selector, template/templateUrl, styles, standalone, changeDetection, imports.',
      '**Binding syntax**: property `[value]`, event `(click)`, two-way `[(ngModel)]`, interpolation `{{ expr }}`.',
      '**Structural control flow**: modern `@if`, `@for`, `@switch` (or legacy `*ngIf`/`*ngFor`/`*ngSwitch`). Use `track` with `@for` for stable identity.',
      '**Content projection**: `<ng-content>` (and named slots with `select`) lets a parent supply content into a child layout.',
      '**Standalone components**: no NgModule required; import dependencies directly. This is the current default pattern.',
      '**Smart/container vs presentational**: containers own services/state and orchestrate; presentational components take inputs/emit outputs and stay easy to test.',
    ],
  },
  {
    id: 'di',
    title: 'Dependency injection',
    bullets: [
      '**Scopes**: root, route/feature, component, and environment providers. The injector hierarchy decides instance identity and lifetime.',
      '**Lifetime**: root-provided services are singletons for the injector lifetime; component-provided services live and die with the component.',
      '**Injection tokens**: use `InjectionToken<T>` for non-class values and to decouple interfaces from implementations.',
      '**Usage**: constructor injection or the `inject()` function (usable in functions/guards and safer for inheritance).',
      '**Accidental multi-instance bug**: providing a stateful service at a leaf component (or in lazy modules) can create a second instance and split state. Provide at the scope you intend.',
      '**Why it matters**: provider placement is an architectural decision affecting shared state, caching, and testability.',
    ],
  },
  {
    id: 'change-detection',
    title: 'Change detection',
    bullets: [
      '**Default strategy**: Angular checks the component tree on events, async completions, and other triggers. It is correct but can be expensive.',
      '**OnPush**: skips checking unless a bound input reference changes, an event fires in the component, an observable emits through `async`, a signal read in the template changes, or you explicitly call `markForCheck`/`detectChanges`.',
      '**Signals and views**: reading a signal in a template makes that view (or binding) a reactive consumer; only affected parts update.',
      '**Immutable state**: with OnPush, replace references (`rows = [...rows, next]`) rather than mutating in place, otherwise bindings may not refresh.',
      '**Expensive template expressions**: move pure derivations to `computed()`, pure pipes, or precomputed fields; never put function calls with side effects in templates.',
      '**Identity handling**: use `track` in `@for` (or `trackBy`) to preserve DOM nodes and avoid needless re-creation.',
      '**Profile first**: use Angular DevTools profiler and `ngDevMode` checks; measure before optimizing.',
    ],
    prompt:
      'A large risk table updates every second and the entire page becomes sluggish. Explain how you would determine whether the problem is network volume, state updates, change detection, DOM size, or rendering.',
    promptGuidance: [
      'Check network: payload size, polling frequency, and whether updates are pushed vs pulled.',
      'Check state: is every tick replacing large arrays and re-triggering downstream computations?',
      'Profile change detection: Angular DevTools flame graph / profiler, count change detection cycles and component checks.',
      'Measure DOM size: thousands of unvirtualized rows with heavy bindings; add virtualization and stable `track`.',
      'Measure rendering: expensive template expressions, layout thrash, missing `OnPush`, impure pipes.',
      'Fix by evidence: reduce frequency, batch updates, virtualize, OnPush + immutable references, and memoize pure derivations.',
    ],
  },
  {
    id: 'lifecycle',
    title: 'Lifecycle and cleanup',
    bullets: [
      '**Construction vs initialization**: constructor runs first (DI wiring only); `ngOnInit` runs once after first input binding — do data fetching there.',
      '**Input changes**: `ngOnChanges` (with `SimpleChanges`) or signal-input computed effects handle changing inputs.',
      '**View/content initialization**: `ngAfterViewInit` / `ngAfterContentInit` run after view/transcluded content is set up.',
      '**Destruction**: `ngOnDestroy` runs when the component is removed; release subscriptions and global listeners.',
      '**Modern cleanup**: `DestroyRef` + `takeUntilDestroyed()` (or an injected `DestroyRef.onDestroy`) tie teardown to the component lifecycle without a manual subject.',
      '**Danger**: nested subscriptions and unmanaged `window`/`document` listeners leak memory and keep firing after navigation.',
    ],
  },
  {
    id: 'signals-rxjs',
    title: 'Signals and RxJS',
    bullets: [
      '**Signals** are strong for synchronous reactive state and derived values (`signal`, `computed`, `effect`).',
      '**RxJS** remains right for asynchronous streams: cancellation, concurrency, combination, retry, backpressure, and event pipelines.',
      '**Interop**: `toSignal()` converts an observable to a signal; `toObservable()` converts a signal to an observable. Prefer a signal at the UI boundary and RxJS for the async pipeline.',
      '**The choice is not ideological**: state ownership, lifecycle, error behavior, and readability drive the decision.',
      '**Interview answer shape**: name who owns the state, when it is created/destroyed, and what happens on error/completion — then justify the abstraction.',
    ],
  },
];
