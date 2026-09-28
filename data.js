/* ============================================================
   ARC/PREP — Question bank
   Tuned for: Citi ERT · Lead UI Engineer / Senior UI Developer
   (Angular 16+ · Rutherford, NJ · Zoom panel)
   Each card: { id, track, q, a, points[], code? }
   ============================================================ */

const TRACKS = [
  { id: "ng",    num: "01", label: "Angular 16+ Core" },
  { id: "ngd",   num: "02", label: "Angular In Depth" },
  { id: "web",   num: "03", label: "JS · TypeScript · Ajax" },
  { id: "css",   num: "04", label: "HTML5 · CSS · Bootstrap" },
  { id: "test",  num: "05", label: "Testing: Jasmine · Karma · Cypress" },
  { id: "sys",   num: "06", label: "UI Design · A11y · Perf" },
  { id: "ops",   num: "07", label: "DevOps · MFE · Agile" },
  { id: "risk",  num: "08", label: "Risk Domain · ERT" },
  { id: "lead",  num: "09", label: "Leadership · Behavioral" },
];

const QUESTIONS = [
  /* ---------------- 01 · ANGULAR 16+ CORE ---------------- */
  {
    id: "ng-1", track: "ng",
    q: "What changed in Angular 15→18 that changes how you build apps day to day?",
    a: "Five things matter: standalone components (no NgModule required, the default for new apps), signals (fine-grained reactive state, stable by 17), the new built-in control flow (@if/@for/@defer) which replaced structural directives in templates, the inject() function and functional route guards/interceptors, and the esbuild + Vite builder. Say you build new apps on standalone + signals + @if/@for, and that these are incremental — old code keeps working.",
    points: [
      "Standalone: imports live on the component; bootstrapApplication replaces bootstrapModule",
      "Signals (16 dev preview → 17 stable): signal(), computed(), effect(); toSignal()/toObservable() for RxJS interop",
      "New control flow is compiler-level — faster than *ngIf/*ngFor and no CommonModule import",
      "@defer lets you lazy-render heavy widgets (charts, editors) with @placeholder/@loading/@error blocks",
      "Functional inject() / guards / interceptors replace decorator classes (class versions deprecated)",
    ],
    code: "@if (user(); as u) {\n  <app-profile [user]=\"u\" />\n} @else {\n  <app-login />\n}\n@for (txn of transactions(); track txn.id; let i = $index) {\n  <app-txn-row [txn]=\"txn\" [odd]=\"$odd\" />\n}"
  },
  {
    id: "ng-2", track: "ng",
    q: "Standalone components — what are they and why do they matter at scale?",
    a: "A standalone component declares its own template dependencies in its imports array instead of belonging to an NgModule. Dependencies become explicit and per-component, which makes tree-shaking honest and lazy-loading trivial: a route can loadComponent() with no module ceremony. For a large org it means smaller feature teams ship independently, and SCAM-style single-component modules disappear.",
    points: [
      "bootstrapApplication(App, { providers: [...] }) — the modern bootstrap path",
      "Route-level: { path: 'risk', loadComponent: () => import('./risk/risk.page') }",
      "Migrations exist: ng generate @angular/core:standalone converts NgModule apps",
      "Use provideRouter / provideHttpClient / provideAnimations in app config providers",
      "Standalone ≠ no modules forever — libraries can still ship modules for compatibility",
    ],
    code: "export const routes: Routes = [\n  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.page') },\n  { path: 'risk',\n    loadChildren: () => import('./risk/routes').then(m => m.RISK_ROUTES) },\n];"
  },
  {
    id: "ng-3", track: "ng",
    q: "Signals — what are they, and when do you reach for signals vs RxJS?",
    a: "A signal is a synchronous, observable value with automatic dependency tracking: reading it inside a computed/effect/template subscribes you implicitly, so there are no manual subscriptions to leak. Use signals for state (values over time), computed() for derived state, effect() for side effects. Keep RxJS for what it's best at: event streams, HTTP composition, anything with cancellation semantics — and bridge with toSignal()/toObservable().",
    points: [
      "signal(0) / s.set(1) / s.update(n => n + 1); computed() memoizes until deps change",
      "Signal inputs: input(), input.required(); outputs: output() — no decorators needed (17.1+)",
      "Effects run after change detection flushes; async ops belong in RxJS, not effects",
      "Equivalence: set an object only when identity should change — use custom equal fn for primitives",
      "Signals + OnPush (or zoneless) is the modern performance story — views update precisely",
    ],
    code: "readonly amount = signal(0);\nreadonly fee = computed(() => this.amount() * 0.002);\nreadonly total = computed(() => this.amount() + this.fee());\n\n// RxJS → signals\nreadonly rates = toSignal(this.rates$.pipe(\n  switchMap(id => this.api.rates(id)),\n), { initialValue: [] });"
  },
  {
    id: "ng-4", track: "ng",
    q: "Explain change detection in Angular. What is OnPush and when does it actually update?",
    a: "By default, zone.js patches async APIs and triggers a tree-wide check from the root after every macrotask — every component's bindings are re-evaluated. OnPush marks a subtree dirty only when: an @Input reference changes, an event handler bound in its template fires, an async pipe receives a value, or markForCheck()/set() on a signal consumed by its template runs. Anything else skips the subtree, which is why immutable inputs or signals are the discipline that makes OnPush correct.",
    points: [
      "Default CD is correctness-first, performance-last — fine until the dashboard gets big",
      "OnPush + mutated array push = the classic 'my UI didn't update' bug (same reference)",
      "Signals work with ANY change detection strategy — reading a signal marks the view for check",
      "detach() / runOutsideAngular escape hatches exist, but reach for OnPush + signals first",
      "Zoneless (provideZonelessChangeDetection, 18+) drops zone.js — requires signals/AsyncPipe/markForCheck",
    ]
  },
  {
    id: "ng-5", track: "ng",
    q: "Walk me through Angular dependency injection: providers, inject(), and the injector tree.",
    a: "DI is hierarchical: a component-level provider creates an instance per component instance; providedIn: 'root' registers a tree-shakable singleton in the root EnvironmentInjector. inject() resolves from the current injection context (component, route data, factory). There are two trees — EnvironmentInjector (module/config level) and ElementInjector (component tree) — and resolution walks up both. Non-class deps get an InjectionToken, and multi: true providers collect arrays (e.g., HTTP_INTERCEPTORS-style tokens).",
    points: [
      "useClass / useValue / useExisting / useFactory + deps — know all four",
      "provideIn: 'root' is the default choice; 'any'/'platform' are rare",
      "Scoped services: provide a service on a routed component to get a per-feature instance",
      "Testing: TestBed.inject(Service) and TestBed.overrideProvider for seams",
      "InjectionToken<T> avoids circular imports and gives you typed non-class values",
    ],
    code: "export const API_BASE = new InjectionToken<string>('API_BASE');\n\n@Injectable({ providedIn: 'root' })\nexport class RatesService {\n  private readonly http = inject(HttpClient);\n  private readonly base = inject(API_BASE);\n}"
  },
  {
    id: "ng-6", track: "ng",
    q: "Why does @for require a track expression — and what breaks without a good one?",
    a: "track tells the framework object identity: with a correct key (track txn.id) Angular reuses DOM nodes and component instances when the list reorders, and only creates/destroys what actually changed. track $index re-creates every row after the change point — stateful rows (open menus, focus, form values) appear to 'jump' between records. Angular 17's @for made this mandatory because identity bugs were the #1 list defect, plus the built-in loop variables ($index, $first, $last, $odd, $even) replaced let-i = index.",
    points: [
      "track by unique domain id; fall back to $index only for static lists",
      "@for has @empty { } built in for the no-results state",
      "Same identity rule applies to ngForOf's trackBy and CDK virtual scroll",
      "@defer blocks inside @for let heavy cells (charts per row) render lazily",
      "Be ready to explain this on a whiteboard — it's the 'keys' question of Angular",
    ],
    code: "@for (row of rows(); track row.accountId) {\n  <app-account-row [row]=\"row\" />\n} @empty {\n  <p class=\"empty\">No accounts match this filter.</p>\n}"
  },
  {
    id: "ng-7", track: "ng",
    q: "Reactive forms vs template-driven — and how would you validate a transfer form?",
    a: "Reactive forms put the model in the component: FormGroup/FormControl with validators as functions, testable without a DOM and the right default for enterprise forms. Template-driven is fine for tiny forms. For a transfer: typed forms (typed FormControl<number|null>), sync validators (required, min, pattern for IBAN), async validator for server-side checks (balance), and a cross-field validator (amount ≤ available balance) attached at the FormGroup level. Errors surface via a single display helper, and submission is disabled until valid + confirmed.",
    points: [
      "Cross-field: pass control.get('amount') into the validator closure, or use toObservable on signals",
      "valueChanges/statusChanges — pipe debounceTime for live validation, avoid heavy work per keystroke",
      "markAllAsTouched() on submit so errors show; focus the first invalid control for a11y",
      "valueAccessor: implement ControlValueAccessor to make ANY custom component form-friendly",
      "Money: use integer minor units + a currency-aware validator — never float math",
    ],
    code: "readonly form = new FormGroup({\n  amount: new FormControl<number|null>(null, [Validators.required, Validators.min(1)]),\n  balance: new FormControl<number|null>({ value: 0, disabled: true }),\n}, (c) => c.controls.amount.value! > c.controls.balance.value!\n  ? { exceedsBalance: true } : null);"
  },
  {
    id: "ng-8", track: "ng",
    q: "How do you handle HTTP in Angular — interceptors, errors, and cancellation?",
    a: "HttpClient plus functional interceptors (provideHttpClient(withInterceptors([...]))): a logging/correlation-ID interceptor, an auth interceptor that attaches the token and refreshes on 401, and an error interceptor that maps HttpErrorResponse to user-meaningful messages. Cancellation is RxJS's job — switchMap unsubscribes the previous request, and you can also pass an AbortSignal. Never leave a subscribe without cleanup or takeUntilDestroyed, and centralize retry/backoff for idempotent reads only.",
    points: [
      "withInterceptorsFromDi() keeps old class interceptors alive during migration",
      "Retry idempotent GETs with retry({ count, delay }) — never auto-retry POSTs (money moves)",
      "Statuses: 401 → refresh/redirect, 403 → permission state, 409 → conflict copy, 422 → field errors",
      "shareReplay(1) to de-duplicate concurrent calls for the same reference data",
      "Surface loading/error/empty as distinct UI states — the screen must never just spin forever",
    ],
    code: "readonly results = this.search$.pipe(\n  debounceTime(250),\n  distinctUntilChanged(),\n  switchMap(term => this.api.search(term).pipe(\n    catchError(() => of({ items: [], failed: true })),\n  )),\n);"
  },
  {
    id: "ng-9", track: "ng",
    q: "Routing in a large enterprise app — lazy loading, guards, and deep links.",
    a: "Split by feature with loadComponent/loadChildren so each business area is its own chunk; pick a preloading strategy (PreloadAllModules or a custom one for likely-next routes). Guards are functional now (canMatch/canActivate with inject()) — and remember guards are UX, not security: real authorization happens server-side. Bind route params to inputs with withComponentInputBinding, keep filters/tabs in the URL so deep links restore full state, and set titles + breadcrumbs from route data.",
    points: [
      "canMatch blocks loading the chunk at all; canActivate checks after matching",
      "resolvers/preload data for small essential data; never block the shell on big fetches",
      "Empty path + wildcard handling; 404 inside the authenticated shell",
      "Route-level error pages and a global ErrorHandler that reports with route context",
      "Session timeout + step-up re-auth for high-risk routes (transfers, payments)",
    ],
    code: "bootstrapApplication(App, {\n  providers: [\n    provideRouter(routes, withPreloading(PreloadAllModules),\n      withComponentInputBinding()),\n    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),\n  ],\n});"
  },
  {
    id: "ng-10", track: "ng",
    q: "How do you design the public API of a reusable Angular component?",
    a: "Treat inputs/outputs as a contract: minimal, typed, semantic (value/labelChange — not data2/onClicked). Prefer signal inputs with transforms for coercion, expose state via outputs or content projection slots (ng-content with template refs for complex cells), and make the component ControlValueAccessor-compatible if it holds form value. OnPush by default, no direct DOM access, documented defaults, and behavior (a11y, keyboard) owned by the component — styling owned by the consumer via tokens/host class.",
    points: [
      "Dumb components: inputs in, outputs up; smart containers fetch and own state",
      "ContentChildren / content projection for slots (header, toolbar, empty state)",
      "Multi-slot projection: <ng-content select=\"[toolbar]\" />",
      "host: {} metadata for host bindings/listeners (16+) over @HostBinding decorators",
      "Version the API semver; breaking input changes need codemods or deprecation warnings",
    ]
  },

  /* ---------------- 02 · ANGULAR IN DEPTH ---------------- */
  {
    id: "ngd-1", track: "ngd",
    q: "Which RxJS operators do you actually use daily in Angular?",
    a: "switchMap for anything user-driven where only the latest result matters (search, route params), mergeMap for parallel non-cancelling work, concatMap for ordered writes, exhaustMap to ignore re-entrant triggers (submit button). combineLatest for dependent filters, debounceTime + distinctUntilChanged before network calls, shareReplay(1) for reference data, takeUntilDestroyed() for component-scoped subscriptions, and catchError/retry for resilience. The operator choice IS the concurrency semantics — interviewers probe exactly that.",
    points: [
      "switchMap cancels in-flight — that's the typeahead race-condition answer",
      "exhaustMap on 'submit' prevents double transfers — say it in a banking interview",
      "combineLatest doesn't emit until every source has; startWith gives initial values",
      "toPromise() is dead — use firstValueFrom/lastValueFrom at imperative boundaries",
      "AsyncPipe subscribes AND unsubscribes for you — it's a leak-prevention tool",
    ],
    code: "readonly results = toSignal(this.searchCtrl.valueChanges.pipe(\n  debounceTime(250),\n  distinctUntilChanged(),\n  switchMap(term => this.api.search(term)),\n), { initialValue: [] });"
  },
  {
    id: "ngd-2", track: "ngd",
    q: "Angular lifecycle & cleanup — what runs when, and how do leaks happen?",
    a: "ngOnChanges (inputs change) → ngOnInit (one-time init, safe to fetch) → ngDoCheck → ngAfterContentInit → ngAfterViewInit (ViewChild ready — DOM measurement here, and beware ExpressionChangedAfterChecked in dev) → ngOnDestroy. With signals, computed/effects replace most of this. Leaks come from manual subscriptions, addEventListener on window/document, and timers that outlive the component: fix with DestroyRef + takeUntilDestroyed(), DestroyRef.onDestroy callbacks, and effect cleanup functions. AsyncPipe/takeUntilDestroyed handle the common cases.",
    points: [
      "takeUntilDestroyed() outside a constructor/injection context → pass DestroyRef",
      "effect((onCleanup) => { const t = ...; onCleanup(() => clearInterval(t)); })",
      "Never touch the DOM in ngOnInit — the view doesn't exist yet",
      "Host listeners via host: {} are auto-cleaned; manual listeners are not",
      "Grandparent-created services with component-scoped providers = per-instance cleanup obligations",
    ]
  },
  {
    id: "ngd-3", track: "ngd",
    q: "An Angular dashboard is slow — walk through your performance playbook.",
    a: "Measure first (Angular DevTools profiler, Performance tab): is it change detection churn, big templates, or bundle weight? Fixes in order: OnPush everywhere + signals for precise updates; track functions in @for; never call methods/functions in templates (they re-run every CD cycle — pipe or computed them); CDK virtual scrolling for long tables; @defer for below-the-fold widgets; pure pipes over formatting functions; and bundle work — lazy routes, drop unused libs, budget gates. Then runtime: Web Vitals (LCP/INP/CLS) to prove user impact.",
    points: [
      "Template method calls are the #1 Angular CD perf bug — log inside one to prove it",
      "@angular/cdk/scrolling: <cdk-virtual-scroll-viewport> caps DOM size for 100k rows",
      "Zone coalescing / zoneless removes blanket CD; signals give fine-grained updates",
      "TrackBy/track + immutable data with OnPush; avoid re-creating objects per CD (pipe → pure pipe)",
      "Set bundle budgets in angular.json so the build fails when size regresses",
    ]
  },
  {
    id: "ngd-4", track: "ngd",
    q: "Zone.js vs zoneless — what's the trade-off?",
    a: "zone.js monkey-patches async APIs so Angular knows when to run change detection — reliable but costs payload, patching overhead, and over-firing CD. Zoneless (provideZonelessChangeDetection, stable-line from 18/19) removes that: updates are driven by signals, AsyncPipe, or markForCheck. Migration means auditing for code that silently relied on zone triggers. In a bank: smaller bundles and fewer surprises in patched environments (secure browsers, wrappers), but only adopt when the codebase is signal-ready.",
    points: [
      "Zone.js patching can conflict with other libraries and secure enterprise browser tooling",
      "Zoneless makes tests and SSR more predictable (no fakeAsync zone needed in some cases)",
      "Hydration (provideClientHydration) pairs well with zoneless + signals",
      "Rule: if it renders without an explicit signal/event, it will break under zoneless — audit first",
      "fakeAsync/tick belong to zone-based testing — know the migration story",
    ]
  },
  {
    id: "ngd-5", track: "ngd",
    q: "State management in Angular — signals store, NgRx, or plain services?",
    a: "Default to layered plain services with signals (or NgRx SignalStore) — a store per feature with exposed computed state and action methods. Reach for full NgRx (actions + reducers + effects) when you need event sourcing, auditability of every transition, or cross-team contracts on state changes (common in trading/risk UIs). Keep server state separate from UI state; one owner per datum; URL for shareable state. Don't copy backend data into three places — stale-drift bugs follow.",
    points: [
      "SignalStore / signalState: minimal ceremony, great for 80% of apps",
      "NgRx pays off with complex workflows, time-travel debugging, strict action logging (audit!)",
      "Component-scoped service for wizard state; root store for session/user",
      "Effects = side-effect boundary; components never call HttpClient from templates",
      "Selectors = memoized derived state; never subscribe-and-copy in components",
    ]
  },
  {
    id: "ngd-6", track: "ngd",
    q: "Directives and pipes — the deep-dive version.",
    a: "Attribute directives extend host behavior (ngClass, custom validators); structural directives change DOM shape — now mostly replaced by @if/@for, but the mechanism is a TemplateRef + ViewContainerRef. Standalone directives/pipes declare themselves and are imported where used. Pipes: pure by default (recompute only when input reference changes) — that makes them the correct fix for method calls in templates. Custom form validators ship as directives providing NG_VALIDATORS. Host behavior goes in the host: {} metadata block (16+).",
    points: [
      "ElementRef is a typed handle — Renderer2/attribute APIs for anything style/DOM-touching",
      "Impure pipes re-run every CD cycle — justify them or memoize",
      "Directive selectors: [appTooltip], :not(), [attr='value'] — compose without DOM noise",
      "AsyncPipe is the canonical 'subscribe safely' pipe",
      "Inject the host element into a directive to measure/animate without touching components",
    ]
  },
  {
    id: "ngd-7", track: "ngd",
    q: "What does Angular protect you from — security-wise — and what is still on you?",
    a: "Angular templates don't interpolate into executable code (no eval), and its sanitization strips dangerous HTML/URLs from [innerHTML] and style bindings by default; DomSanitizer lets you explicitly trust content (audit every bypassSecurityTrust* call). Still on you: CSP (and Trusted Types where possible), auth token handling (httpOnly cookies or memory + interceptor, never localStorage), XSS in third-party scripts, and remembering that route guards are not authorization. Angular's own security guide is the source — read it before the panel.",
    points: [
      "Every bypassSecurityTrustHtml/Url is a review flag — document WHY",
      "Template injection-safe ≠ safe: [innerHTML] still needs sanitization awareness",
      "PII handling: mask account numbers, never log sensitive payloads (interceptors!)",
      "Dependencies: npm audit/Dependabot + lockfile review — supply chain is a bank concern",
      "CSRF: SameSite cookies + token headers on state-changing calls",
    ]
  },
  {
    id: "ngd-8", track: "ngd",
    q: "You inherit an Angular 9-era app. How do you get it to 16+ without a freeze?",
    a: "Incremental, always shippable: ng update through majors one at a time (each version's migration schematics handle most mechanical work), keep the test suite green at every step, and branch by abstraction where APIs changed (class guards/interceptors → functional, Modules → standalone via schematics). Turn on strict mode + typed forms as separate PRs, adopt signals in new code first (strangler pattern per feature), and switch to the esbuild builder early — it's low-risk and pays for the migration time.",
    points: [
      "Never skip majors — migrations are version-sequenced",
      "CI is the safety net: unit + smoke E2E must pass at every intermediate tag",
      "Material migrations (MDC) are their own project — plan them separately",
      "Feature-by-feature modernization keeps shipping; big-bang rewrites die in banks",
      "Track the migration as JIRA epics with exit criteria — stakeholders love visible progress",
    ]
  },

  /* ---------------- 03 · JS · TYPESCRIPT · AJAX ---------------- */
  {
    id: "web-1", track: "web",
    q: "Walk me through the event loop. What order do things run in?",
    a: "JavaScript runs on a single call stack. When the stack empties, the event loop first drains the entire microtask queue (promise callbacks, queueMicrotask), then runs one macrotask (timers, I/O, UI events), may render (rAF just before paint), and repeats. This is why a resolved promise's .then always beats a setTimeout(0).",
    points: [
      "Microtasks drain completely between every macrotask — nested .then chains can starve rendering",
      "requestAnimationFrame fires before paint, after the current macrotask",
      "setTimeout(fn, 0) is really clamped to ~4ms minimum and is a macrotask",
      "Long synchronous work blocks everything — chunk it or move it to a worker",
    ],
    code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\n// 1, 3, 2  — microtasks beat macrotasks"
  },
  {
    id: "web-2", track: "web",
    q: "Closures — what are they and where have you actually used one?",
    a: "A closure is a function that keeps a live reference to the scope it was created in, even after that outer function returned. It's the mechanism behind private state, memoization, partial application, debounce timers, and module patterns. In Angular they show up in validator factories and every operator pipeline.",
    points: [
      "Encapsulation: counter/state hidden behind a returned API",
      "Memoize: cache keyed by arguments inside the closure",
      "Debounce/throttle: the timer id lives in the closure",
      "Classic gotcha: var in loops shares one binding — let creates a fresh binding per iteration",
    ],
    code: "function memoize(fn) {\n  const cache = new Map(); // lives in the closure\n  return (...args) => {\n    const k = JSON.stringify(args);\n    if (!cache.has(k)) cache.set(k, fn(...args));\n    return cache.get(k);\n  };\n}"
  },
  {
    id: "web-3", track: "web",
    q: "Debounce vs throttle — the difference and when to use each.",
    a: "Debounce delays invocation until events stop firing for N ms — only the last call wins. Throttle guarantees at most one call per interval while events keep firing. Debounce is 'wait until they're done' (search-as-you-type, autosave); throttle is 'rate-limit ongoing work' (scroll, drag, analytics). In Angular you normally get this via RxJS debounceTime/throttleTime — but be ready to write debounce by hand.",
    points: [
      "Leading vs trailing edge options change the feel — mention them",
      "Angular's reactive forms + debounceTime(250) is the typeahead default",
      "Remember trailing execution and cancel on destroy (takeUntilDestroyed)",
      "Implementing debounce in <10 lines is a common live-coding warm-up",
    ],
    code: "function debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}"
  },
  {
    id: "web-4", track: "web",
    q: "The JD says Ajax and JSON — compare XHR-era Ajax, fetch, and Angular's HttpClient.",
    a: "Classic Ajax was XMLHttpRequest + callbacks + JSON.parse of responseText. fetch replaced it with promises, but you must check response.ok yourself and handle CORS preflights for non-simple requests. Angular's HttpClient wraps fetch/XHR: JSON parsed automatically, typed responses, RxJS cancellation (switchMap), and a pluggable interceptor chain — which is why the modern answer inside Angular is always HttpClient + RxJS.",
    points: [
      "JSON is the wire format everywhere: serialize with JSON.stringify, DTO types on the client",
      "CORS: preflighted for custom headers (Authorization) — server must allow it",
      "AbortController cancels fetch; in Angular, unsubscribing the observable cancels",
      "Never trust client-side validation alone — 422 field errors must render in the form",
    ],
    code: "// Classic Ajax-era idea, modern fetch form\nconst res = await fetch('/api/rates', { signal });\nif (!res.ok) throw new Error(`${res.status}`);\nconst rates: Rate[] = await res.json();"
  },
  {
    id: "web-5", track: "web",
    q: "Show me generics doing real work — constraints, keyof, inference.",
    a: "Generics keep the relationship between input and output types. K extends keyof T constrains a key to actually exist; ReturnType/Pick-style mapped types build new shapes. If TS can infer the type parameter from usage, don't write it explicitly — good generics feel invisible. Angular's signal inputs, HttpClient.get<T>, and typed forms are generics you use daily.",
    points: [
      "function pick<T, K extends keyof T>(obj: T, keys: K[]) → typed partial",
      "Conditional types (T extends U ? X : Y) for type-level branching",
      "Template literal types for typed event/status maps",
      "strict: true + noUncheckedIndexedAccess catch the real-world bugs",
    ],
    code: "function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n  const out = {} as Pick<T, K>;\n  for (const k of keys) out[k] = obj[k];\n  return out;\n}"
  },
  {
    id: "web-6", track: "web",
    q: "unknown vs any vs never — when is each right?",
    a: "any disables checking (contagious, unsafe) — last resort at boundaries. unknown is 'could be anything, prove it first': you must narrow before use, making it the safe type for JSON.parse and third-party payloads. never is the empty type: functions that never return, and the exhaustiveness anchor in switch statements.",
    points: [
      "unknown at API/JSON boundaries; narrow with type guards",
      "never in the default branch of an exhaustive switch = compile-time safety",
      "any spreads silently: assigning any to anything unsafes the target",
      "Discriminated unions ('status' tag) make UI states impossible to misuse",
    ],
    code: "type Shape = Circle | Square;\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2;\n    case 'square': return s.side ** 2;\n    default: {\n      const _exhaustive: never = s;\n      return _exhaustive;\n    }\n  }\n}"
  },
  {
    id: "web-7", track: "web",
    q: "TypeScript sharp edges you've been bitten by?",
    a: "Object.keys returns string[] (not keyof T). Truthiness narrowing doesn't understand .filter(Boolean) — it needs a type guard. Spreads widen literals without as const. Type assertions (as) bypass checks entirely — treat them as documented lies. And structural typing means two same-shaped domain types are interchangeable — branded types fix money-vs-quantity bugs.",
    points: [
      "filter((x): x is T => x !== null) — predicate over the Boolean shortcut",
      "satisfies checks without losing inference — prefer over as",
      "Branded types: type Dollars = number & { __brand: 'usd' } for money math",
      "readonly / ReadonlyArray encode intent; runtime still needs discipline",
    ]
  },

  /* ---------------- 04 · HTML5 · CSS · BOOTSTRAP ---------------- */
  {
    id: "css-1", track: "css",
    q: "Explain specificity and how cascade layers change the game.",
    a: "Specificity is the tuple (inline, id, class+attr+pseudo-class, type+pseudo-element). Higher tuple wins regardless of order. @layer adds a higher-order criterion: unlayered styles beat layered ones, and earlier layers lose to later ones — deliberate 'reset < framework < components < utilities' ordering without !important. That last part is exactly how you coexist with Bootstrap.",
    points: [
      ":where() = zero specificity; :is() takes the specificity of its most specific argument",
      "Inline style and !important still outrank layers — layers reduce the NEED for them",
      "Chain to recite: inline > id > class > element, then source order",
      "Enterprise rule: your overrides must not need !important against Bootstrap",
    ]
  },
  {
    id: "css-2", track: "css",
    q: "What creates a stacking context and why does it bite teams?",
    a: "A stacking context is an isolated z-axis unit: children can never escape it to compete with outside elements. Created by html root, position + z-index, transform, opacity < 1, filter, will-change, isolation: isolate, contain: paint. The classic bug: a modal's z-index loses because a parent card has transform/opacity, quietly capping the modal inside that context.",
    points: [
      "z-index only competes WITHIN the same stacking context",
      "Debug by walking ancestors for transform/opacity/filter/will-change",
      "Angular overlays (CDK Overlay) portal to <body> precisely to dodge this",
      "isolation: isolate deliberately creates a context (great for scoped widgets)",
    ]
  },
  {
    id: "css-3", track: "css",
    q: "Flexbox or Grid — how do you decide, and what are the power features?",
    a: "Flexbox distributes along one axis (content-out sizing); Grid places along two axes (layout-first). Default to Grid for page scaffolding and dashboard/card layouts, Flex for toolbars and content-driven rows. Auto-placement, minmax(), auto-fill vs auto-fit, and subgrid are the differentiators — and every one of them shows up in a portal layout.",
    points: [
      "repeat(auto-fill, minmax(240px, 1fr)) — responsive cards with zero media queries",
      "auto-fit collapses empty tracks; auto-fill keeps them",
      "subgrid aligns children to parent tracks — killer for card footers",
      "Flex gotcha: min-width:auto overflow — fix with min-width: 0 on children",
    ]
  },
  {
    id: "css-4", track: "css",
    q: "Bootstrap 5 — how does it work, and how do you override it safely?",
    a: "Bootstrap is Sass-token-driven: customize via its variable system (colors, spacers, breakpoints) rather than fighting generated classes. The grid is flexbox with container/row/col-* and responsive tiers (sm 576, md 768, lg 992, xl 1200, xxl 1400). Override strategy: scoped wrapper classes or CSS layers around your app's styles, extend with your own component classes, and reserve utility-class soup for one-offs. In Angular, prefer ng-bootstrap/ngx-bootstrap (no jQuery) or Bootstrap + your own components.",
    points: [
      "Compile Bootstrap's Sass with your token overrides — don't patch CSS after the fact",
      "Utility classes in templates couple markup to styling — wrap repeated patterns in components",
      "Bootstrap's JS behaviors (dropdown, modal) vs Angular equivalents — pick one owner",
      "Know the breakpoints and the container/row/col nesting rules cold",
      "Accessibility: Bootstrap gives structure, you still owe labels/focus/contrast",
    ]
  },
  {
    id: "css-5", track: "css",
    q: "Build responsive layouts without media queries — how?",
    a: "Intrinsic, container-based design: fluid type with clamp(min, preferred, max), Grid auto-fill tracks, and container queries (@container) so components respond to THEIR box, not the viewport. Media queries become a fallback. This is how a component library scales across a portal where the same widget appears in a sidebar and full-width.",
    points: [
      "font-size: clamp(1rem, 0.9rem + 0.8vw, 1.25rem)",
      "@container (min-width: 480px) — needs container-type: inline-size on the parent",
      ":has() for parent-state styling; gap-based spacing systems",
      "Enterprise constraint: dense data views need min-widths + horizontal scroll strategies",
    ]
  },
  {
    id: "css-6", track: "css",
    q: "position: sticky vs fixed — mechanics and common failures.",
    a: "fixed is removed from flow and positions against the viewport (unless an ancestor with transform/filter becomes its containing block). sticky stays in flow and sticks within its nearest scrolling ancestor — but only inside its parent's box. Sticky fails when any ancestor has overflow: hidden/auto (it becomes the scroll container) or the parent is too short.",
    points: [
      "sticky needs a top/left/right/bottom value and a tall-enough parent",
      "overflow on ancestors silently breaks sticky — first thing to check",
      "transform on an ancestor makes THAT the containing block for fixed",
      "Sticky table headers + summary bars are cheap, layout-safe wins",
    ]
  },
  {
    id: "css-7", track: "css",
    q: "HTML5 semantics and forms — what actually matters in an enterprise app?",
    a: "Semantic elements (main, nav, table with th scope, button vs div) give keyboard and screen-reader behavior for free — the first rule of ARIA is don't use ARIA when HTML already does it. Native form features (label/for, required, inputmode, autocomplete, :invalid) are the base; Angular forms layer validation UX on top. Dense tables need real table semantics, caption, and accessible sort buttons.",
    points: [
      "button inside a clickable row — never a div with click",
      "inputmode='decimal' + pattern for money/IBAN fields on mobile",
      "label association is the cheapest a11y win and the most common miss",
      "Dialog: native <dialog> or CDK Dialog — never hand-rolled div modals",
    ]
  },

  /* ---------------- 05 · TESTING: JASMINE · KARMA · CYPRESS ---------------- */
  {
    id: "test-1", track: "test",
    q: "Explain the Angular testing stack: TestBed, Jasmine, Karma — how do they fit together?",
    a: "Jasmine is the assertion/spec framework (describe/it/expect, spies), Karma is the browser test runner (launches a browser, runs the specs, reports results to the console/CI), and TestBed is Angular's testing harness: it configures a dynamic testing module with the component's imports/providers, creates the component, and gives you a ComponentFixture to detectChanges and query the DOM. Unit tests run in a real browser — that's Karma's value (real DOM, real events) and its cost (slower than node runners).",
    points: [
      "TestBed.configureTestingModule({ imports: [ComponentUnderTest], providers: [...] })",
      "TestBed.createComponent → fixture.detectChanges() → fixture.nativeElement / debugElement",
      "TestBed.inject(Service) resolves from the testing injector — override with TestBed.overrideProvider",
      "Karma config: browsers (ChromeHeadless), reporters, coverage (karma-coverage/istanbul)",
      "beforeEach resets TestBed automatically; configureTestingModule must run before create/inject",
    ],
    code: "describe('RatesTable', () => {\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      imports: [RatesTable],\n      providers: [{ provide: RatesService, useValue: jasmine.createSpyObj('RatesService', ['load']) }],\n    }).compileComponents();\n  });"
  },
  {
    id: "test-2", track: "test",
    q: "Jasmine spies and async — fakeAsync, tick, whenStable. Explain each.",
    a: "Spies replace collaborators: spyOn(obj, 'method'), jasmine.createSpyObj('Name', ['a','b']), and .and.returnValue / .and.callFake / .and.throwError. Async handling: fakeAsync() zones let you run timers deterministically with tick(ms) and flush() — no real waiting; waitForAsync() handles promise-based async with fixture.whenStable(); done callbacks for non-Angular async. Prefer fakeAsync for debounce/timer logic (search boxes!) and whenStable for HTTP flushes.",
    points: [
      "fakeAsync + tick(250) tests debounce timing deterministically — zero flake",
      "tick() throws if timers remain pending — flush() runs them all",
      "jasmine.clock().install for pure-JS timers outside Angular zones",
      "Expect collaborator interactions: expect(spy.calls.count()).toBe(1) — behavior, not just output",
      "Spy on the service boundary, never on HttpClient internals",
    ]
  },
  {
    id: "test-3", track: "test",
    q: "How do you test an Angular component's behavior (not its implementation)?",
    a: "Drive it through its public API: setInput() on signal inputs or componentRef.setInput(), dispatch real DOM events (click, input, keydown) on elements users touch, and assert on rendered output — text, attributes, aria states, emitted outputs. Query with By.css/data-testids or (better) by role/label. If a test breaks when you refactor internals but behavior is unchanged, it's testing implementation — rewrite it.",
    points: [
      "fixture.componentRef.setInput('user', u) — works for signal and decorator inputs",
      "Output testing: subscribe to component.outputEmitted or spy on the bound handler",
      "Query by accessibility semantics where possible — it doubles as an a11y check",
      "One behavior per spec; Arrange-Act-Assert; meaningful spec names ('shows empty state when no rows')",
      "Don't snapshot everything — assert what the requirement demands",
    ],
    code: "it('disables submit until the form is valid', () => {\n  const btn: HTMLButtonElement = fixture.nativeElement.querySelector('[data-test=submit]');\n  expect(btn.disabled).toBeTrue();\n  fillForm(fixture, VALID_TRANSFER);\n  fixture.detectChanges();\n  expect(btn.disabled).toBeFalse();\n});"
  },
  {
    id: "test-4", track: "test",
    q: "How do you test HTTP calls and interceptors?",
    a: "HttpTestingController: after the act, expectOne(url/method) asserts EXACTLY one request (catching duplicate fires from bad subscriptions), flush(body) supplies the response (or errorFlush to simulate failures), and verify() at the end asserts no unexpected requests. To test interceptors, configure provideHttpClient(withInterceptors([myInterceptor]), withInterceptorsFromDi()) in TestBed and inspect the outgoing request headers.",
    points: [
      "expectOne fails on BOTH zero and two matching requests — that's the point",
      "Test the error paths: errorFlush({}, { status: 422, statusText: 'Unprocessable' })",
      "verify() in afterEach — leaks show up as random cross-test pollution",
      "Test cancellation: assert the request was cancelled when the component destroyed",
    ],
    code: "const http = TestBed.inject(HttpTestingController);\nsvc.load().subscribe(r => (result = r));\nconst req = http.expectOne('/api/rates');\nexpect(req.request.method).toBe('GET');\nreq.flush([{ id: 'eur', price: 1.08 }]);\nhttp.verify();"
  },
  {
    id: "test-5", track: "test",
    q: "Testing signals and the new APIs — anything special?",
    a: "Signal inputs: fixture.componentRef.setInput() then detectChanges. Effects: run them explicitly with TestBed.flushEffects() (or the current testing API) so assertions are deterministic — never rely on scheduling. Computed values can be asserted directly (pure functions). For @defer blocks, use the DeferBlockFixture to render specific states (placeholder/loading/error/complete) so lazy content is testable without waiting on real timers.",
    points: [
      "Treat computed() as pure logic — unit test without any TestBed at all",
      "flushEffects keeps effect tests synchronous and flake-free",
      "deferBlock.render(DeferBlockState.Loading) proves your placeholder UX",
      "Signal-based state stores: test the store API directly, components thin",
    ]
  },
  {
    id: "test-6", track: "test",
    q: "Cypress — how do you write E2E tests that don't rot?",
    a: "Cypress runs real browser flows: cy.intercept() stubs or spies on network calls (alias them, then cy.wait('@alias') — never arbitrary cy.wait(300)), stable selectors like [data-cy] or roles (not CSS classes or XPaths), fixtures for data, and custom commands for login/setup. Keep E2E to golden paths (login, transfer, statement export) — each test costs minutes in CI. For banking: stub money-moving endpoints in UI tests; run true integration against a stable test environment sparingly.",
    points: [
      "cy.intercept('POST', '/api/transfers', { fixture: 'transfer-ok.json' }).as('transfer')",
      "Page-object / app-action patterns keep specs readable as they grow",
      "Flake policy: retry-once in CI but open a ticket immediately — flake compounds",
      "Run headless + parallel via CI (Docker image cypress/included), record on failure",
      "Complement with component tests (Cypress CT or TestBed) for edge cases — cheaper",
    ]
  },
  {
    id: "test-7", track: "test",
    q: "What does a sensible test strategy look like when money is on the line?",
    a: "Weight the pyramid toward what fails expensively: exhaustive unit tests for pure logic (formatters, reducers, money math — property-based tests catch rounding bugs), behavior-level component tests via TestBed with a11y assertions, a handful of E2E tests on golden money paths (login, transfer, statement), and contract tests guarding the UI↔API seam. Coverage thresholds (istanbul/Sonar gate) block merges; flaky tests get quarantined within days — a red pipeline people ignore is worse than none.",
    points: [
      "Money math (rounding, currency, tax): property-based testing finds real monetary bugs",
      "E2E budget: only critical paths — each one costs minutes and flakes",
      "Coverage is a floor (gate at ~80%), not a goal — assert BEHAVIOR in the meaningful specs",
      "Test case reviews are a senior responsibility (per the JD) — treat specs as deliverables",
    ]
  },
  {
    id: "test-8", track: "test",
    q: "A test is red in CI but green locally. Diagnose it.",
    a: "Classify first: environment (timezone, locale, browser version, fonts), timing (race conditions, unstubbed network, real timers vs fakeAsync), or order-dependence (leaked state: http.verify() missing, localStorage, TestBed providers shared). Reproduce in the CI environment (same Docker image), run the suite in random order, and check for parallel-run collisions. Fix the root cause — never just add a retry and walk away.",
    points: [
      "Force TZ=UTC and a fixed locale in CI config to kill date-flakes",
      "Leaked HTTP requests and open subscriptions are the top order-dependence causes",
      "Run the exact CI image locally: docker run cypress/included …",
      "Retries mask bugs; quarantine + ticket beats silent green",
    ]
  },

  /* ---------------- 06 · UI DESIGN · A11Y · PERF ---------------- */
  {
    id: "sys-1", track: "sys",
    q: "Design a component library for a 2,000-engineer org. How does it stay healthy?",
    a: "Layer it: design tokens (color/space/type as primitives → semantic aliases), headless/behavioral primitives → styled components → composed patterns. For Angular: publishable libraries via ng-packagr, standalone components, and Angular CDK for behaviors (overlay, a11y, virtual scroll) with your bank's skin on top. Governance beats code: semver, codemods for breaking changes, an RFC contribution process, docs with live examples, and adoption metrics. Success = people choosing it, not being forced.",
    points: [
      "Tokens as the contract between design and code (JSON → CSS themes via pipeline)",
      "CDK = behavior/a11y layer; brand skins change, behavior doesn't",
      "Codemods turn v4→v5 from a migration project into a background task",
      "Track adoption; deprecate with console.warn and timelines",
    ]
  },
  {
    id: "sys-2", track: "sys",
    q: "Design a typeahead/autocomplete for account search. What's hard?",
    a: "Input layer: debounce 250ms, min length 2, trim. Network layer: switchMap so only the latest request may render (out-of-order responses are THE trap), plus a small cache per prefix. UX layer: full combobox a11y (aria-expanded, aria-activedescendant, ↑↓ navigate, Enter select, Esc dismiss), highlight matches, empty/no-results states, and mobile keyboard handling. In Angular the RxJS pipeline is half the design — say so.",
    points: [
      "Sequence: valueChanges → debounceTime → distinctUntilChanged → switchMap → catchError",
      "Keyboard: ↑↓ wrap, Home/End, Esc, Enter; listbox roles + activedescendant",
      "Cache per prefix; cancel in-flight on destroy (takeUntilDestroyed)",
      "Keep input latency <100ms; heavy matching can go to @defer'd panel or worker",
    ],
    code: "readonly results = toSignal(this.term.valueChanges.pipe(\n  debounceTime(250),\n  distinctUntilChanged(),\n  switchMap(t => t.length < 2 ? of([]) : this.api.search(t)),\n), { initialValue: [] });"
  },
  {
    id: "sys-3", track: "sys",
    q: "Design a table that renders 100,000 transactions smoothly — and accessibly.",
    a: "Windowing: <cdk-virtual-scroll-viewport> renders only visible rows (~30) in a container of full computed height with overscan. Fixed row heights make the math trivial. Semantics stay a real table where possible (or an accessible grid with rowindex/cellindex + proper headers). Sorting/filtering run against the data layer (server-side or a worker), never against 100k DOM nodes; totals are computed server-side. Sticky headers, keyboard-navigable cells, and a live-region row-count announcement.",
    points: [
      "startIndex = floor(scrollTop / rowH) — the windowing math to know",
      "track by identity in @for / trackBy — re-creating 30 rows per scroll frame kills it",
      "aria-rowcount + aria-sort on a grid; announce 'showing 50 of 100,000'",
      "Aggregation (totals) server-side or in a worker — not in the render path",
    ]
  },
  {
    id: "sys-4", track: "sys",
    q: "Design the modal system for an app where dialogs stack.",
    a: "Use CDK Overlay/Dialog: each dialog portals to <body> (escaping stacking contexts), gets a focus trap (a11y FocusTrap), scroll strategy block with scrollbar compensation (no layout jump), and Esc closes only the top one. A small dialog service keeps a stack so focus returns one level per close. API: dialog.open(Component, { data }) returns a MatDialogRef whose afterClosed() is an observable — call sites stay clean.",
    points: [
      "Stack discipline: only the top dialog is interactive; lower ones inert/aria-hidden",
      "Return focus to the trigger on close — forgetting it fails audits",
      "aria-labelledby → dialog title; role=dialog + aria-modal",
      "Data in via MAT_DIALOG_DATA / @Input from config — results out via afterClosed()",
    ]
  },
  {
    id: "sys-5", track: "sys",
    q: "Design a toast/notification system for a banking app.",
    a: "A service with a queue (cap ~5 visible, overflow stacked), stable ids for dedupe/update-in-place ('Transfer submitted' twice = one toast, updated), and timers that PAUSE on hover/focus. A11y: role=status/aria-live=polite for info, assertive for errors, never move focus. Position fixed so it never affects layout. In Angular: CDK Overlay + LiveAnnouncer, or MatSnackBar wrapped behind your own service so the UX is consistent and testable.",
    points: [
      "Dedupe key + update-in-place is the senior-level detail",
      "Persist critical notices (fraud alerts) — don't let them auto-vanish",
      "Live regions must exist in DOM at load (AT quirk)",
      "One notification service — components never call snackbar directly",
    ]
  },
  {
    id: "sys-6", track: "sys",
    q: "Design the shell for a large risk-management web portal.",
    a: "An app shell (header, nav, breadcrumbs, user/session controls) that renders fast and owns cross-cutting concerns: auth/session (timeout warning modal, step-up re-auth), routing (lazy feature areas, deep links, permission-driven nav), error handling (global ErrorHandler + per-widget fallbacks), and consistent states (loading/empty/error/no-permission). Feature teams plug into the shell contract and never re-implement any of it. The shell is where a 2,000-engineer org's consistency lives.",
    points: [
      "Permissions drive BOTH nav visibility and route guards — one source of truth",
      "Every widget needs four states designed: empty, loading, error, no-permission",
      "Session timeout warning with countdown + extend — mandatory in banking UIs",
      "Correlation ID created at the shell and attached to all API calls",
    ]
  },
  {
    id: "sys-7", track: "sys",
    q: "What does WCAG 2.2 AA demand of the components you build?",
    a: "Banking UIs are legally required to meet WCAG 2.1/2.2 AA (ADA/Section 508/EAA) — audits are routine. Concretely: keyboard operability for everything, visible focus (2.4.7/2.4.11 focus appearance), non-text contrast 3:1, text contrast 4.5:1, labels + error identification (3.3.1), status messages via live regions, target size (2.5.8), and no keyboard traps. Build it into components so feature teams inherit compliance — and verify with axe + real screen readers (NVDA/VoiceOver), not just automated scans.",
    points: [
      "Native first: <button>, <a>, <dialog> ship keyboard/role for free",
      "No role without behavior: role=\"tablist\" commits you to full keyboard support",
      "Accessible name on icon-only buttons ('View details for account …1234')",
      "Automated axe in CI catches ~30-40% — schedule manual screen-reader passes",
    ]
  },
  {
    id: "sys-8", track: "sys",
    q: "The dashboard's LCP is 4s and INP is bad. Diagnose both.",
    a: "LCP: identify the element (DevTools Performance/Lighthouse) — hero image (lazy-loaded by mistake, unoptimized format, no priority), webfont blocking paint, render-blocking JS/CSS, or slow TTFB. Fix: preload + fetchpriority on the LCP element, AVIF/WebP with sizes, font-display swap, defer non-critical code (Angular lazy routes + @defer). INP: worst interaction — usually a click causing a huge synchronous re-render. Fix: OnPush + signals, virtualize, chunk long tasks (scheduler.yield), memoize rows. In Angular, profile change detection first.",
    points: [
      "Field data (75th percentile), not lab scores — measure with Web Vitals JS/RUM",
      "CLS: reserve space for async widgets, sized images, font fallback (size-adjust)",
      "Vitals thresholds to recite: LCP < 2.5s, INP < 200ms, CLS < 0.1",
      "loading=\"lazy\" on the LCP image is a bug, not an optimization",
    ]
  },

  /* ---------------- 07 · DEVOPS · MFE · AGILE ---------------- */
  {
    id: "ops-1", track: "ops",
    q: "Micro-frontends: when do they earn their complexity — and how in Angular?",
    a: "They earn it when team scale makes one repo the bottleneck: many squads deploying independently into one surface (a classic big-bank setup). In Angular: Module Federation (webpack) or Angular's native federation (esbuild-friendly) to load remote feature bundles at runtime, composed by a thin shell owning auth, routing, theming, and error tracking. Below ~10 teams, a modular monolith with clean library boundaries ships faster — say that, it shows judgment.",
    points: [
      "Driver is org structure (Conway's law), not technology fashion",
      "Share infrastructure (shell contracts, tokens, CDK), not business code",
      "Version skew & duplicated dependencies are the real costs — plan shared deps",
      "Independent deploy cadence is the payoff; shell ↔ remote contracts need semver",
      "Migration: strangler-fig, one domain at a time, behind router flags",
    ]
  },
  {
    id: "ops-2", track: "ops",
    q: "How do you Dockerize a frontend for hosting? (The JD literally asks.)",
    a: "Multi-stage build: node image compiles (npm ci → ng build --configuration production), then a tiny nginx (or distroless) stage copies dist/ only — final image has no toolchain or source. Add an SPA fallback (try_files → /index.html), gzip/brotli + cache headers (hashed assets immutable, index no-cache), healthcheck endpoint, and runtime config injection (config.json fetched at startup) so one image serves dev/QA/UAT/prod. Scan images in CI; tag immutably with the build number.",
    points: [
      "Layer caching: copy package*.json → npm ci → then copy source — rebuilds stay fast",
      "Non-root user in the runtime stage; read-only filesystem where possible",
      "Env config at RUNTIME (not build time) = promote the same artifact through environments",
      "nginx serves statics; the API stays elsewhere (BFF) — don't bake secrets into the image",
    ],
    code: "FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build -- --configuration production\n\nFROM nginx:alpine\nCOPY --from=build /app/dist/app/browser /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf"
  },
  {
    id: "ops-3", track: "ops",
    q: "Walk me through your ideal CI/CD pipeline for an Angular app — TeamCity, Jenkins, uDeploy.",
    a: "Every PR: install from lockfile, lint, typecheck, unit suite (Karma/ChromeHeadless), coverage gate, production build with bundle-budget checks, and a preview environment reviewers actually open. Merge produces a semver'd immutable artifact (the Docker image). TeamCity or Jenkins orchestrate the build chain/artifacts; uDeploy (IBM UrbanCode Deploy) handles environment promotion (dev→QA→UAT→prod) with approvals and audit trails — standard in banks. Release is decoupled from deploy via feature flags, rolled out progressively with automated rollback on error-rate/vitals alarms.",
    points: [
      "TeamCity: build chains + artifact dependencies; Jenkins: declarative pipeline in-repo",
      "uDeploy: component-based deploys, environment inventory, approvals — know the vocabulary",
      "Bundle budget failures block merge — treat size as a contract",
      "In regulated environments, approvals and audit trails ARE the design, not friction",
    ]
  },
  {
    id: "ops-4", track: "ops",
    q: "Git at enterprise scale — branching, reviews, and the sharp edges.",
    a: "Trunk-based with short-lived branches beats long-lived gitflow for CI health: small PRs, rebase before merge, squash for a clean history (or merge commits if the org requires traceability — know both). Protected branches + required reviews + status checks. Sharp edges: resolving conflicts (understand both sides, never 'ours' blindly), git bisect to find a regression, git blame as archaeology not accusation, and tags/releases mapping to JIRA versions.",
    points: [
      "git bisect run <test> finds the guilty commit mechanically",
      "Rebase feature branches before review; never rebase shared history",
      "Conventional commits / semantic versioning make release notes free",
      "Large binary artifacts don't belong in Git — use the artifact repository",
    ]
  },
  {
    id: "ops-5", track: "ops",
    q: "Agile/Scrum in practice — what do you actually do as the UI lead?",
    a: "Own refinement: break epics into vertical slices, surface technical risk early, and size stories with the team (points are for planning, cycle time is the metric). Definition of Done must include tests, code + design review, a11y check, and docs — not just 'code merged'. In JIRA: clean workflow states, blockers visible on the board, tickets that state acceptance criteria testably. Run the demo with the stakeholder's language; drive the retro to at least one committed improvement. Banks often run Scrum-of-Scrums/SAFe — know the vocabulary without pretending process is the point.",
    points: [
      "JD keywords to mirror: 'Agile operating models', 'test case reviews', 'continual improvement'",
      "Protect the team from mid-sprint scope changes — negotiate, don't absorb",
      "Tech-debt work gets tickets and capacity (10-15%), agreed with the EM",
      "JIRA hygiene is visibility: if it's not on the board, leadership thinks it isn't happening",
    ]
  },
  {
    id: "ops-6", track: "ops",
    q: "MongoDB/NoSQL — what does a UI engineer need to know? (JD 'added advantage')",
    a: "MongoDB stores JSON-like documents (BSON) with flexible schemas and horizontal scaling — great for evolving catalogs, event/log data, and read-heavy feeds. Know the mental model: collections ≈ tables, documents ≈ rows (but nested/variable), ObjectId ≈ generated key, indexes are still what make queries fast, and the aggregation pipeline does group/sum/join-like work. As a UI dev, your practical job is: shape the REST/GraphQL API well (documents map naturally to view-models), know when NOT to denormalize money data, and handle _id serialization.",
    points: [
      "Documents map cleanly to UI view-models — fewer joins for a dashboard read",
      "Relational still wins for ledgers/transactions needing strict integrity",
      "Indexes matter: a collection scan on 10M docs is a slow UI no matter how good the front end is",
      "_id is an ObjectId — serialize as string at the API boundary",
    ]
  },
  {
    id: "ops-7", track: "ops",
    q: "Environments, feature flags, and releases — how does a build reach production?",
    a: "One immutable artifact flows dev → QA → UAT → prod; only configuration changes per environment (runtime config, not rebuilds). Feature flags decouple deploy from release: code ships dark, then turns on per cohort/percentage with an expiry date attached. Progressive delivery: canary or percentage rollout with error-rate/vitals monitors that auto-rollback faster than humans. Smoke tests post-deploy; every step logged for audit — a bank will ask about this.",
    points: [
      "Never rebuild for an environment promotion — same binary, different config",
      "Flags carry owners AND expiry dates, or they become permanent shadow code",
      "Auto-rollback on error budget burn beats a 2 a.m. war room",
      "Runtime config endpoint + fail-safe defaults if config can't load",
    ]
  },
  {
    id: "ops-8", track: "ops",
    q: "What do you actually look for in code reviews? (The JD asks for code & design reviews.)",
    a: "Correctness against the requirement first — does the code do what the story asked, including error states? Then: tests that assert behavior (and exist at all), readability/naming/structure, security (XSS, PII in logs, authz checks), a11y (labels, focus, keyboard), performance red flags (template method calls, N+1 requests), and API/contract consistency. Keep PRs small (<400 lines reviewable), respond within a day, and review the SPEC as a deliverable — good reviews prevent defects far cheaper than testing does.",
    points: [
      "Review checklist > memory: requirements, tests, security, a11y, perf, docs",
      "Ask questions ('what happens when this list is empty?') instead of decreeing",
      "Design reviews: sequence diagrams for flows, class diagrams for structure — per the JD",
      "Model the culture: how you receive review feedback is how your team will give it",
    ]
  },

  /* ---------------- 08 · RISK DOMAIN · ERT ---------------- */
  {
    id: "risk-1", track: "risk",
    q: "What does Citi's Enterprise Risk Technology (ERT) actually do — and who are its clients?",
    a: "ERT is the technology arm serving Citi's risk and control functions. It sits within Functions Technology and builds platforms for global partners: Enterprise Risk Management (ERM), Independent Compliance Risk Management (ICRM), Retail Credit Risk, Operational Risk, and Model Risk. Its 'clients' are risk managers across the firm — which is exactly why the JD says 'global risk clients' and 'solving our Risk Managers' biggest pain points'. The Rutherford, NJ hub is the center of gravity for this work: risk data platforms, dashboards, workflow tools, and regulatory-reporting systems.",
    points: [
      "Functions Technology → ERT supports ERM, ICRM, Retail Credit Risk, Operational Risk, Model Risk",
      "'Global risk clients' = internal risk managers worldwide, not external customers",
      "Rutherford hosts risk-tech teams incl. the Stress Testing Platform and Credit Risk Technology",
      "Citi's risk org is led by CRO Zdenek Turek (since Feb 2021) — all risks 'measured, reviewed and monitored on an ongoing basis'",
    ]
  },
  {
    id: "risk-2", track: "risk",
    q: "Name the main risk types — and what each means for a UI you build.",
    a: "Market risk (prices move: rates, FX, equities — fast, intraday views), credit risk (counterparties fail: exposure, limits, concentration — deep drill-downs), operational risk (process failures, fraud, outages — case workflows), model risk (models wrong: SR 11-7-style governance and validation trails), and compliance risk (ICRM: KYC/AML/sanctions). Each has a different data cadence, permission model, and audit expectation — which is why one generic table never serves them all.",
    points: [
      "Market risk UIs are time-sensitive: ticks, snapshots, as-of timestamps everywhere",
      "Credit risk UIs are relationship-shaped: counterparty → facility → position drill-downs",
      "Operational risk = case management: statuses, owners, evidence, SLAs, sign-off",
      "Model risk: model inventory, validation status, documented limitations",
    ]
  },
  {
    id: "risk-3", track: "risk",
    q: "What is stress testing (CCAR/DFAST) — and where does a UI team fit?",
    a: "Banks must prove they can survive bad economies. The Fed's annual CCAR/DFAST exercise applies supervisory scenarios (baseline, severely adverse) and each bank projects losses, P&L, and capital over roughly nine quarters. Citi runs an internal Stress Testing Platform covering scenario capture/translation, projection runs, results review, and submissions. UI work: scenario configuration forms, run-monitoring boards, results grids with drill-down, reviewer annotations, and maker-checker approvals — all strictly auditable.",
    points: [
      "Flow: scenario → projections (PPNR, losses, RWA) → capital ratios → Fed submission",
      "Rutherford posts roles like 'Technical Lead Stress Testing Platform' — scenario translator modules are core",
      "UI requirements: reproducibility (re-create an exact snapshot), lineage, sign-off workflow",
      "Vocabulary to know: severely adverse scenario, PPNR, capital action, CECL",
    ]
  },
  {
    id: "risk-4", track: "risk",
    q: "Explain BCBS 239 — and why it lands on the frontend.",
    a: "The Basel Committee's 'Principles for effective risk data aggregation and risk reporting' (2013) — 14 principles for how banks must aggregate and report risk data accurately and quickly. G-SIBs like Citi are supervised against it. For a UI engineer it is concrete: every number on screen must be traceable, timely, complete, and consistent across screens. That means as-of timestamps, lineage drill-downs, explicit missing-data states, reconciliation views — and never silently rounding or dropping data.",
    points: [
      "Principles map to UI: accuracy & integrity, completeness, timeliness, adaptability, clarity",
      "Granularity: data must aggregate up AND drill down — your grid design IS the requirement",
      "Data-quality dashboards (exceptions, stale feeds) are first-class product surfaces here",
      "Ties to Citi's consent-order history: data quality is a board-level topic at this bank",
    ]
  },
  {
    id: "risk-5", track: "risk",
    q: "Market risk 101: VaR vs Expected Shortfall — and what the Basel reforms change.",
    a: "VaR answers 'what is the worst loss at 99% confidence over 10 days' — but says nothing about how bad the tail beyond that point gets. Expected Shortfall averages the losses in that tail, capturing catastrophe better; FRTB (Fundamental Review of the Trading Book) makes ES the standard, with liquidity horizons per asset class. In the US, the Basel III endgame was re-proposed on March 19, 2026 (Fed/OCC/FDIC) — recalibrating credit, market, and operational risk and collapsing dual calculations. Risk managers compare these measures daily and have to explain moves.",
    points: [
      "VaR is a percentile; ES is a tail average — explain both to a non-technical stakeholder",
      "Trading book vs banking book treatment drives different limits and screens",
      "Risk managers live on 'explain the move': attribution views showing which positions drove the change",
      "Capital rules are actively changing (Mar 2026 NPRs) — platforms must adapt; show you follow this",
    ]
  },
  {
    id: "risk-6", track: "risk",
    q: "Credit risk 101: PD, LGD, EAD, RWA — and the views a risk manager needs.",
    a: "PD = probability a counterparty defaults; LGD = loss given default (recovery haircut); EAD = exposure at default (current + potential draw); RWA = risk-weighted assets (exposure × risk weight) feeding capital ratios; PFE = potential future exposure on derivatives. The views: exposure by counterparty/sector/geography, limit utilization, concentration heat maps, and drill-downs to underlying positions — with what-if scenario overlays.",
    points: [
      "EAD × PD × LGD ≈ expected loss — the math behind credit provisioning",
      "Counterparty hierarchies (group → legal entity → facility) must be navigable in the UI",
      "Surface dirty states: pending ratings, stale financials — show them, never hide them",
      "Collateral, settlement, and exposure views usually live side by side",
    ]
  },
  {
    id: "risk-7", track: "risk",
    q: "Design a limit-monitoring and breach workflow for risk managers.",
    a: "The core screen is a dense grid of limits: utilization (bar + exact number), as-of timestamp, trend — sortable, filterable, virtualized. The breach flow is a state machine: threshold crossing → alert → breach record with severity → assigned owner → mitigation notes → maker-checker approval → close, every transition audited. Intraday vs end-of-day views must be visibly distinguished. Announce alerts via the notification service and live region; drill from limit → position → trade so the number is always explicable.",
    points: [
      "Soft limit (warning) vs hard limit (breach) — different escalation paths",
      "Keyboard-first: risk managers live in these grids all day (arrows, Enter, shortcuts)",
      "Show the inputs the limit is computed from — trust is the product",
      "Never show a stale number without its timestamp",
    ]
  },
  {
    id: "risk-8", track: "risk",
    q: "How do you gather requirements from risk managers — your 'clients'?",
    a: "The JD literally asks you to solve 'Risk Managers' biggest pain points'. Do it by shadowing their day: watch how they actually work (spreadsheets open beside your app?), learn their vocabulary (limits, runs, sign-off), prototype with production-shaped data, and ship quick wins to earn trust. Translate pain into product — 'I spend 40 minutes reconciling two screens' becomes one merged view with lineage. Then measure adoption. Enterprise software fails on usefulness, not features.",
    points: [
      "Ask for their worst hour of the week — that is your backlog",
      "Prototype with real data shapes (volume, timestamps, bad rows) — demos with 3 rows lie",
      "Speak in their nouns (exposure, run, sign-off), not frontend nouns (state, hook, component)",
      "Small releases build credibility; big-bang portals lose users back to spreadsheets",
    ]
  },

  /* ---------------- 09 · LEADERSHIP · BEHAVIORAL ---------------- */
  {
    id: "lead-1", track: "lead",
    q: "Tell me about yourself — the 90-second opening for THIS role.",
    a: "Three beats: now ('I lead UI engineering for enterprise web applications — Angular, large-scale portals'), proof (one sentence of scope: team size, scale of the apps, a result with a number), and why here ('Citi's Enterprise Risk Technology builds platforms for risk managers worldwide — I want to do UI craft at that scale and in a domain where correctness matters'). Rehearse it until it's conversational, not memorized. This is your first impression on Zoom — slow start, camera on, structured.",
    points: [
      "Mirror the JD language: 'enterprise applications', 'Angular 16+', 'Agile/DevOps'",
      "One number, one result, one reason — anything more is forgettable",
      "End with a bridge that invites their questions ('...which is why this ERT role stood out')",
      "Practice on Zoom with recording — check pacing, eye line, audio quality",
    ]
  },
  {
    id: "lead-2", track: "lead",
    q: "What do you know about Enterprise Risk Technology (ERT) — and why risk?",
    a: "ERT is Citi's Enterprise Risk Technology — the tech arm within Functions Technology that builds platforms for the firm's risk and control functions: Enterprise Risk Management, ICRM, Retail Credit Risk, Operational Risk, and Model Risk. Its users are risk managers globally, and Rutherford, NJ is a hub for this work (stress testing, credit risk, risk data). Why risk UI: the hardest problems are making complex, high-stakes data usable and correct — and after the 2020 OCC/Fed consent orders, data quality and auditable UIs are a firmwide priority, which raises the bar for frontend craft.",
    points: [
      "Risk UI = dense data, real-time updates, strict correctness — your favorite kind of hard",
      "Name the JD framing: 'solving our Risk Managers' biggest pain points'",
      "Connect your experience: portals, design systems, testing discipline at scale",
      "Know the regulatory arc (2020 consent order → Transformation) — it explains the investment",
    ]
  },
  {
    id: "lead-3", track: "lead",
    q: "STAR: Tell me about a production issue you owned end-to-end.",
    a: "One real story with numbers, structured: Situation (scope/impact — 'transfer submissions dropping on Safari'), Task (you owned diagnosis), Action (instrumented RUM, bisected releases, found the defect, shipped the fix behind a flag within hours), Result (metric recovered, added regression test + canary alerting). Close with the systemic lesson. For a Lead panel, add how you communicated status to stakeholders WHILE fixing it.",
    points: [
      "Have TWO ready: one frontend performance, one correctness/bug",
      "Include the guardrail you added — 'it can never surprise us again'",
      "Blameless tone: systems failed, you improved the system",
      "Numbers: error rate %, minutes to detect, users affected, MTTR",
    ]
  },
  {
    id: "lead-4", track: "lead",
    q: "STAR: Tell me about disagreeing with a designer or product manager.",
    a: "Show data-driven collaboration, not ego. Situation: conflicting directions (PM wanted a 5-step form; you argued for progressive disclosure). Task: find truth, not win. Action: prototyped both, pulled drop-off analytics and usability signals, proposed a measurable compromise. Result: shipped, metric improved, relationship strengthened — 'disagree on the problem, align on the metric'. The JD wants stakeholder communication: show you can translate, negotiate, and still ship.",
    points: [
      "Frame as shared goals — you both serve the risk manager using the screen",
      "Prototype + data beats opinion in the room",
      "Disagree-and-commit as the fallback shows maturity",
      "Never disparage the other party in the telling",
    ]
  },
  {
    id: "lead-5", track: "lead",
    q: "STAR: Tell me about mentoring a junior developer or raising a team's bar.",
    a: "Situation: a team member (or the team) with a concrete gap — weak test discipline, say. Task: as the senior, close it without becoming a bottleneck. Action: paired on their next feature, set a review standard (a checklist), ran a brown-bag on TestBed patterns, made good examples the easy path. Result: their next PRs needed fewer iterations; team adopted the checklist; quality metric moved (review cycles down, coverage up). The JD explicitly wants mentoring and acting as technical coach — have this story polished.",
    points: [
      "Show method, not just goodwill: standards, pairing, review rubrics, knowledge sharing",
      "Quantify: review turnaround, defect rate, coverage, onboarding time",
      "Mention organizing design/code/document reviews — it's verbatim from the JD",
      "'Owned success' framing: their win was your deliverable",
    ]
  },
  {
    id: "lead-6", track: "lead",
    q: "How do you design and document a technical solution for a large feature?",
    a: "Start from requirements and constraints (functional + non-functional: scale, a11y, security), then produce a short design doc: high-level architecture (boxes/arrows, sequence diagram for the critical flows, class/interface diagram for core models), alternatives considered with trade-offs, an incremental delivery plan, and risks. Review it — design review with the team, then a walkthrough for stakeholders. Record decisions as ADRs so they survive team rotation. The JD names sequence/class diagrams explicitly — have examples ready to describe.",
    points: [
      "Sequence diagram = 'what calls what, in what order' — perfect for money flows",
      "Class/interface diagrams = module contracts, not UML ceremony",
      "Document the WHY; code already records the what",
      "Keep docs living: link them in the repo, review them when the system changes",
    ]
  },
  {
    id: "lead-7", track: "lead",
    q: "How do you communicate progress and problems to business stakeholders?",
    a: "Continually and in their language: demos over status adjectives, risk surfaced early with options (not surprises at the end), and a clear 'what this means for the deadline'. Translate tech to consequence: 'the caching fix means balances refresh instantly' beats 'we refactored the store'. When negotiating scope, bring data (velocity, defect trends) and always arrive with a recommendation, not just a problem. The JD asks for communicating with the client and project teams throughout — treat it as a core duty, not overhead.",
    points: [
      "Status template: done / next / risks / decisions needed",
      "Bad news early, with options and a recommendation",
      "Match the audience: risk managers care about correctness and auditability",
      "Written clarity matters too — 'clear and concise written and verbal communication' is a JD qualification",
    ]
  },
  {
    id: "lead-8", track: "lead",
    q: "What questions should YOU ask this panel?",
    a: "Show systems thinking and genuine interest: 'How is the Angular codebase organized — monorepo, micro frontends?' / 'What does the testing pyramid look like today, and where do you want it?' / 'How does ERT decide what to build for risk managers — is there embedded product design?' / 'What's the biggest constraint on shipping right now: process, tech, or people?' / 'What does success look like at 6 months for this role?' Pick three: one team-specific, one technical, one growth.",
    points: [
      "Reference something from the interview ('you mentioned the migration to 16...')",
      "Never ask anything answered on the careers page",
      "For a Lead role: ask how technical decisions are made and how you'd influence them",
      "Panel logistics: confirm next steps at the end — Zoom panels often end abruptly",
    ]
  },
];

/* Ticker content */
const TICKER = [
  "STANDALONE COMPONENTS", "SIGNALS > STRINGS", "track BY ID, NOT $index", "@defer FOR HEAVY WIDGETS",
  "OnPush EVERYWHERE", "switchMap CANCELS", "fakeAsync + tick()", "HttpTestingController.expectOne",
  "JASMINE + KARMA GREEN", "CYPRESS: cy.intercept() NOT cy.wait(300)", "ng update ONE MAJOR AT A TIME",
  "DOCKER: MULTI-STAGE BUILD", "MODULE FEDERATION LIVE", "TEAMCITY → uDEPLOY", "JIRA: DONE = TESTED + REVIEWED",
  "WCAG 2.2 AA MANDATORY", "LCP < 2.5s", "INP < 200ms", "CLS < 0.1", "min-width: 0",
  "BCBS 239: TRACE EVERY NUMBER", "CCAR: SCENARIO → CAPITAL", "VaR 99% / 10-DAY", "EOD SNAPSHOT ≠ INTRADAY",
  "LIMIT BREACH = WORKFLOW", "AS-OF TIMESTAMPS EVERYWHERE", "SEQUENCE DIAGRAM FIRST", "CODE REVIEW = REQUIREMENTS CHECK"
];

/* Day-of checklist */
const CHECKLIST = {
  "Night before": [
    "Re-read this deck's unknown cards — start with the Angular tracks",
    "Rehearse all three STAR stories out loud",
    "Test Zoom end-to-end: internet, camera, mic, lighting, screen share",
    "Skim Citi risk/tech news — one talking point",
    "Prepare 3 questions for the panel",
  ],
  "Day of": [
    "Zoom updated; join 5 min early; camera ON (video expected for this panel)",
    "Hardwired internet or strong Wi-Fi; phone hotspot as backup",
    "Quiet room, phone silenced, headphones checked, eye-level camera",
    "Open: this deck, your STAR notes, the job description",
    "Water + notepad + printed resume; slow, structured first answer",
  ]
};

/* 7-day plan */
const PLAN = [
  ["Day 1", "Angular fundamentals — standalone components, DI, signals, new control flow. Rebuild a small feature from memory using signal state."],
  ["Day 2", "Change detection + RxJS — OnPush drills, switchMap/debounceTime typeahead written blind; zone.js vs zoneless."],
  ["Day 3", "Forms + HTTP — reactive transfer form with cross-field validation; functional interceptors, error states, cancellation."],
  ["Day 4", "Testing day — one TestBed component spec, one HttpTestingController spec, one Cypress golden-path test. Review them like a lead would."],
  ["Day 5", "A11y + performance — modal focus flow, CDK virtual scroll, WCAG 2.2 AA checklist, LCP/INP/CLS diagnosis."],
  ["Day 6", "Architecture + DevOps + risk domain — micro frontends, Docker, TeamCity/uDeploy, then drill the Risk Domain track out loud (BCBS 239, CCAR, limits)."],
  ["Day 7", "ERT + leadership — 'Know the firm' twice, STAR polish (all three), design-review story, questions for the panel, Zoom setup check. Rest early."],
];
