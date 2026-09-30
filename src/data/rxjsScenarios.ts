export interface RxjsScenario {
  id: string;
  title: string;
  scenario: string;
  options: string[];
  correctOperator: string;
  cancellation: string;
  ordering: string;
  errorBoundary: string;
  cleanup: string;
  explanation: string;
}

export const RXJS_SCENARIOS: RxjsScenario[] = [
  {
    id: 'risk-search',
    title: 'Risk search',
    scenario:
      'A risk manager types in a filter box and the app fetches matching risk records. Slow responses can arrive out of order. When the filter changes, the previous request must be cancelled.',
    options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
    correctOperator: 'switchMap',
    cancellation: 'Cancels the previous inner observable when a new value arrives.',
    ordering: 'Only the latest inner observable emits; stale responses are dropped.',
    errorBoundary: 'An inner error propagates unless caught with catchError (usually inside the inner stream).',
    cleanup: 'Unsubscribe via takeUntilDestroyed/async pipe so the outer stream stops on destroy.',
    explanation:
      'switchMap unsubscribes from the in-flight request when the search term changes. That guarantees only the latest response renders — essential for typeahead and filter-driven tables.',
  },
  {
    id: 'save-button',
    title: 'Save button',
    scenario:
      'A "Submit risk acknowledgement" button can be double-clicked. While a save is in flight, repeated clicks must be ignored.',
    options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
    correctOperator: 'exhaustMap',
    cancellation: 'Does not cancel the in-flight request; it ignores new emissions while active.',
    ordering: 'Preserves whatever is already running; queued emissions are dropped.',
    errorBoundary: 'Catch inside the inner stream to keep the outer stream alive for future clicks.',
    cleanup: 'Disable the button while pending and unsubscribe on destroy.',
    explanation:
      'exhaustMap ignores clicks until the current save completes, which is exactly the double-submit protection you want. Combine it with a disabled/pending UI state for accessibility.',
  },
  {
    id: 'ordered-updates',
    title: 'Ordered dependent writes',
    scenario:
      'A workflow must write A, then write B only after A succeeds, then write C after B. Order and dependency matter.',
    options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
    correctOperator: 'concatMap',
    cancellation: 'Does not cancel; it queues inner observables and runs them one at a time.',
    ordering: 'Strictly preserves source order; each inner runs to completion before the next starts.',
    errorBoundary: 'An inner error stops the queue unless caught and handled per step.',
    cleanup: 'Unsubscribe to abandon the remaining queued work.',
    explanation:
      'concatMap serializes dependent writes. Use it when later operations depend on earlier success, and be explicit that throughput is one-at-a-time.',
  },
  {
    id: 'independent-enrichment',
    title: 'Independent enrichment',
    scenario:
      'After loading a portfolio, the app must fetch three independent enrichment datasets concurrently, but with bounded concurrency (max 3) to avoid flooding the server.',
    options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
    correctOperator: 'mergeMap',
    cancellation: 'Does not cancel on new source values; you control cancellation of inner streams separately.',
    ordering: 'Results may arrive out of order — combine or index them if order matters.',
    errorBoundary: 'Catch per inner request so one failure does not lose the others.',
    cleanup: 'Use takeUntil/takeUntilDestroyed; consider switchMap/finalize for cancellation.',
    explanation:
      'mergeMap runs inner observables concurrently and can take a concurrency limit (mergeMap(fn, 3)). This is ideal for independent enrichment where latency, not order, is the goal.',
  },
  {
    id: 'dashboard-composition',
    title: 'Dashboard composition',
    scenario:
      'A dashboard must render only when the latest filter, date range, and portfolio selections have all emitted a value.',
    options: ['combineLatest', 'forkJoin', 'zip', 'withLatestFrom'],
    correctOperator: 'combineLatest',
    cancellation: 'Emits whenever any source emits; the latest values combine.',
    ordering: 'Combines current values, not sequence alignment.',
    errorBoundary: 'An error in any source terminates the combined stream unless handled.',
    cleanup: 'Combine with startWith for initial values and unsubscribe on destroy.',
    explanation:
      'combineLatest emits whenever any input changes, making it the right fit for "always render the latest selection state". forkJoin waits for completion (one-shot); zip pairs by index.',
  },
  {
    id: 'shared-stream',
    title: 'Shared stream without duplicate calls',
    scenario:
      'Two components on the same page need the same risk-limit data. Naively subscribing twice would fire two HTTP requests.',
    options: ['shareReplay(1)', 'share()', 'publish() + connect', 'ReplaySubject'],
    correctOperator: 'shareReplay({ bufferSize: 1, refCount: true })',
    cancellation: 'Keeps the last value; with refCount it tears down when subscribers drop to zero.',
    ordering: 'Late subscribers get the cached latest value.',
    errorBoundary: 'If the source errors, the shared stream can become unusable; reset or catchError accordingly.',
    cleanup: 'refCount releases the underlying subscription when all subscribers unsubscribe.',
    explanation:
      'shareReplay(1) multicasts the HTTP observable so late subscribers receive the cached response instead of triggering a new request. Beware cache lifetime: a refCount=false shareReplay holds the value forever.',
  },
  {
    id: 'failure-handling',
    title: 'Recover one inner failure',
    scenario:
      'A long-lived dashboard stream polls several feeds. One feed occasionally fails, but that must not kill the other feeds or the outer stream.',
    options: ['catchError inside each inner stream', 'retry at the outer level', 'finalize', 'takeUntil'],
    correctOperator: 'catchError inside each inner stream (with retry)',
    cancellation: 'catchError replaces the failed inner with a fallback, keeping the outer alive.',
    ordering: 'Other inner streams continue independently.',
    errorBoundary: 'Place catchError at the boundary whose failure should be contained — usually per inner request.',
    cleanup: 'Combine with takeUntil for component lifetime.',
    explanation:
      'Put catchError (and a bounded retry) inside the failing request so a single 500 becomes a fallback/default value instead of a terminal error for the whole dashboard.',
  },
  {
    id: 'cleanup',
    title: 'Stop work on destroy',
    scenario:
      'A component subscribes to a real-time risk feed. When the user navigates away, the subscription and any in-flight request must stop.',
    options: ['takeUntilDestroyed', 'async pipe', 'unsubscribe in ngOnDestroy', 'all of the above'],
    correctOperator: 'all of the above (prefer async pipe / takeUntilDestroyed)',
    cancellation: 'Stops the outer subscription and, with switchMap, cancels the in-flight inner request.',
    ordering: 'Irrelevant after teardown.',
    errorBoundary: 'finalize can run teardown/audit logic on completion or unsubscription.',
    cleanup: 'This scenario is cleanup: tie the stream to component lifecycle.',
    explanation:
      'Prefer the async pipe (auto-subscribe/unsubscribe) or takeUntilDestroyed/DestroyRef. Manual ngOnDestroy unsubscribe works but is easy to forget when streams grow.',
  },
];

export interface StateCategory {
  id: string;
  label: string;
  examples: string;
  home: string;
}

export const STATE_CATEGORIES: StateCategory[] = [
  {
    id: 'ephemeral',
    label: 'Ephemeral component state',
    examples: 'Open/closed accordions, hover, a transient "loading" flag, local selection.',
    home: 'Component field or signal.',
  },
  {
    id: 'form',
    label: 'Form state',
    examples: 'Draft values, validation, touched/dirty status.',
    home: 'Reactive form model in the component (or feature form service).',
  },
  {
    id: 'url',
    label: 'URL / router state',
    examples: 'Filters, selected id, view mode — anything bookmarkable.',
    home: 'Router params/query params.',
  },
  {
    id: 'shared',
    label: 'Shared client state',
    examples: 'Current session entitlements, a shared workspace selection used across features.',
    home: 'Scoped service, signals, or a store if eventful.',
  },
  {
    id: 'server',
    label: 'Server state / cache',
    examples: 'Risk records, limits, reference data with freshness.',
    home: 'Typed API service + observable/signal cache, or NgRx if complexity demands.',
  },
  {
    id: 'streaming',
    label: 'Streaming state',
    examples: 'Real-time feeds, WebSocket updates, long-lived subscriptions.',
    home: 'RxJS streams with explicit lifecycle/cleanup.',
  },
  {
    id: 'preference',
    label: 'User preference state',
    examples: 'Theme, column layout, language.',
    home: 'Local storage or a preference service.',
  },
];

export const NGRX_CONCEPTS: { name: string; description: string }[] = [
  { name: 'Store', description: 'A single observable state container backed by RxJS.' },
  { name: 'Actions', description: 'Typed events describing what happened and carrying a payload.' },
  { name: 'Reducers', description: 'Pure functions that produce the next state from the current state and an action.' },
  { name: 'Selectors', description: 'Memoized functions deriving slices/views of state.' },
  { name: 'Effects', description: 'RxJS pipelines listening to actions to run side effects and dispatch new actions.' },
  { name: 'Entity normalization', description: 'Store records by id in an entities map with an ordered ids array.' },
  { name: 'Facade pattern', description: 'A thin service exposing selectors and action methods to components.' },
  {
    name: 'When NgRx is excessive',
    description: 'Local form state, one-component data, or simple server cache. Start small and add a store when many features share eventful state.',
  },
];
