export interface CodingExercise {
  id: string;
  title: string;
  timeMinutes: number;
  summary: string;
  requirements: string[];
  hints: string[];
  starter?: string;
  modelSolution?: string;
  fallback?: boolean;
}

export const CODING_EXERCISES: CodingExercise[] = [
  {
    id: 'risk-record-explorer',
    title: 'Primary: risk-record explorer',
    timeMinutes: 45,
    summary:
      'Implement (or finish) an Angular feature that fetches paginated risk records with debounced filtering, stale-request cancellation, sorting, and full loading/empty/stale/error states.',
    requirements: [
      'Fetch paginated risk records from a typed RiskRecordService.',
      'Debounce the text filter (e.g., 300ms) before each request.',
      'Cancel stale in-flight requests when the filter or page changes.',
      'Support sorting by a column.',
      'Render loading, empty, stale, and error states distinctly.',
      'Use strict TypeScript types — no `any`.',
      'Use OnPush change detection.',
      'Avoid leaked subscriptions (async pipe or takeUntilDestroyed).',
      'Include at least three unit tests.',
      'Provide accessible labels and keyboard-operable controls.',
    ],
    hints: [
      'Model the query as an observable stream: filter$ (debounced), page$, sort$ — then switchMap into the HTTP call.',
      'A "stale" state means data is shown but a refresh is in progress; do not hide the table while refetching.',
      'Cancel the previous request with switchMap; remember HttpClient is a cold observable.',
      'Use `track` for row identity and aria-sort on sortable headers.',
      'Think about what belongs in the component vs a service: the service owns the request, the component owns presentation state.',
    ],
    starter: `@Component({
  selector: 'app-risk-records',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<!-- your accessible table, states, and controls here -->\`
})
export class RiskRecordsComponent {
  private readonly service = inject(RiskRecordService);
  // Build filter/page/sort streams, combineLatest, switchMap…
}`,
    modelSolution: `// RiskRecordService: owns the HTTP contract and returns typed observables.
@Injectable({ providedIn: 'root' })
export class RiskRecordService {
  private http = inject(HttpClient);
  query(params: RiskRecordQuery): Observable<RiskRecordPage> {
    return this.http.get<RiskRecordPage>('/api/risk-records', { params });
  }
}

// RiskRecordsComponent: owns presentation state; the async pipe owns the subscription.
@Component({
  selector: 'app-risk-records',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <input #filter aria-label="Filter risk records" (input)="filter$.next(filter.value)" />
    <button (click)="sort$.next('utilization')" aria-sort="ascending">Sort</button>

    <div *ngIf="vm$ | async as vm">
      <p *ngIf="vm.loading && !vm.page" role="status">Loading…</p>
      <p *ngIf="vm.error" role="alert">{{ vm.error }}</p>
      <p *ngIf="vm.page && vm.page.items.length === 0">No records match.</p>
      <p *ngIf="vm.stale" role="status" class="sr-only">Refreshing…</p>
      <table *ngIf="vm.page && vm.page.items.length">
        <tr *ngFor="let r of vm.page.items; trackBy: trackById">
          <td>{{ r.exposure }}</td><td>{{ r.utilization }}%</td>
        </tr>
      </table>
    </div>
  \`
})
export class RiskRecordsComponent {
  readonly filter$ = new Subject<string>();
  readonly page$ = new BehaviorSubject<number>(1);
  readonly sort$ = new BehaviorSubject<SortKey>('exposure');

  private readonly query$ = combineLatest([
    this.filter$.pipe(debounceTime(300), distinctUntilChanged(), startWith('')),
    this.page$,
    this.sort$,
  ]).pipe(map(([filter, page, sort]) => ({ filter, page, sort })));

  readonly vm$ = this.query$.pipe(
    switchMap((query) =>
      this.service.query(query).pipe(
        map((page) => ({ page, loading: false, stale: false, error: undefined })),
        startWith({ page: undefined, loading: true, stale: false, error: undefined }),
        catchError((err) => of({ page: undefined, loading: false, stale: false, error: 'Load failed' })),
      ),
    ),
    scan((acc, curr) => ({ ...acc, ...curr, stale: curr.loading && !!acc.page }), {} as Vm),
  );

  trackById(_: number, r: RiskRecord): string { return r.id; }
}`,
  },
  {
    id: 'snapshot-deltas',
    title: 'Fallback A: snapshot plus deltas',
    timeMinutes: 15,
    fallback: true,
    summary:
      'Given an initial array of risk records and a stream of create/update/delete events, merge them correctly.',
    requirements: [
      'Merge events by record ID.',
      'Ignore stale versions (an update with an older version must not overwrite a newer one).',
      'Detect a sequence gap in event versions.',
      'Preserve deterministic ordering.',
      'Discuss time and space complexity.',
    ],
    hints: [
      'Use a Map<id, Record> for O(1) merge, then sort deterministically (by id or sequence).',
      'Track last-seen version per id; skip events whose version <= last-seen.',
      'A sequence gap means a missing event between versions — surface it rather than silently dropping data.',
    ],
    modelSolution: `type Event = CreateEvent | UpdateEvent | DeleteEvent;

function mergeDeltas(initial: RiskRecord[], events: Event[]): MergeResult {
  const byId = new Map(initial.map((r) => [r.id, r]));
  const lastVersion = new Map(initial.map((r) => [r.id, r.version]));
  const gaps: string[] = [];

  for (const e of events) {
    const current = lastVersion.get(e.id) ?? 0;
    if (e.version <= current) continue;        // stale or duplicate
    if (e.version !== current + 1) gaps.push(e.id); // sequence gap
    lastVersion.set(e.id, e.version);
    if (e.type === 'delete') byId.delete(e.id);
    else byId.set(e.id, { id: e.id, version: e.version, ...e.payload });
  }

  return { records: [...byId.values()].sort((a, b) => a.id.localeCompare(b.id)), gaps };
}`,
  },
  {
    id: 'code-transformation',
    title: 'Fallback B: exposure transformation',
    timeMinutes: 15,
    fallback: true,
    summary:
      'Transform nested exposure data into grouped table rows with totals while handling missing values and duplicate identifiers.',
    requirements: [
      'Group nested exposure records by category.',
      'Compute per-group totals and a grand total.',
      'Handle missing values (treat as zero but flag them).',
      'Handle duplicate identifiers without silently overwriting.',
      'Return deterministic row order.',
    ],
    hints: [
      'Normalize into a Map<category, { total, missing, duplicateIds }>.',
      'Preserve precision; do not round intermediate values unless a rule says so.',
      'Decide explicitly how duplicates are reported (sum, first-wins, or error).',
    ],
    modelSolution: `function groupExposures(input: Exposure[]): ExposureRow[] {
  const groups = new Map<string, { total: number; missing: string[]; duplicates: string[] }>();
  const seen = new Set<string>();

  for (const item of input) {
    const g = groups.get(item.category) ?? { total: 0, missing: [], duplicates: [] };
    if (seen.has(item.id)) g.duplicates.push(item.id);
    seen.add(item.id);
    if (item.value == null) g.missing.push(item.id);
    else g.total += item.value;
    groups.set(item.category, g);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, g]) => ({ category, total: g.total, missing: g.missing, duplicates: g.duplicates }));
}`,
  },
];

export const CODING_RUBRIC: string[] = [
  'Clarifies requirements',
  'Correctness',
  'Type safety',
  'RxJS semantics',
  'Angular structure',
  'Error/empty/loading handling',
  'Tests',
  'Accessibility',
  'Complexity/performance',
  'Communication',
];
