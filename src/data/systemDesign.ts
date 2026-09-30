export const SYSTEM_DESIGN_PROMPT =
  'Design a scalable enterprise risk-management portal for global risk managers. It aggregates several risk categories, provides dashboards and drill-down views, enforces role-based access, supports multiple globally distributed development teams, and must be auditable and operationally resilient.';

export const DESIGN_PHASES: { phase: string; minutes: number }[] = [
  { phase: 'Clarify requirements', minutes: 5 },
  { phase: 'Scale, risk, and nonfunctional requirements', minutes: 5 },
  { phase: 'High-level architecture', minutes: 10 },
  { phase: 'Front-end and data-flow details', minutes: 10 },
  { phase: 'Security, controls, and resilience', minutes: 7 },
  { phase: 'Delivery, testing, and observability', minutes: 5 },
  { phase: 'Trade-offs and recap', minutes: 3 },
];

export const REQUIREMENT_CHECKLIST: string[] = [
  'User personas (risk managers, approvers, ops, auditors).',
  'Read vs write workflows and their relative volume.',
  'Real-time, near-real-time, or batch freshness.',
  'Dataset and user scale.',
  'Availability and latency targets.',
  'Regional/legal-entity boundaries.',
  'Entitlements and role-based access.',
  'Audit and approval requirements.',
  'Export behavior and formats.',
  'Data lineage and reconciliation.',
  'Recovery objectives (RTO/RPO).',
];

export const ARCHITECTURE_AREAS: { area: string; notes: string }[] = [
  { area: 'Angular shell', notes: 'Hosts routing, auth bootstrap, design system, telemetry, and feature mounting.' },
  { area: 'Domain-aligned feature boundaries', notes: 'Split by risk capability (limits, exposures, reporting), not by layer.' },
  { area: 'Shared design system', notes: 'Versioned, accessible component library with a clear contract.' },
  { area: 'Typed API clients', notes: 'Generated or hand-written clients pin the API contract.' },
  { area: 'State boundaries', notes: 'Separate ephemeral, form, URL, server, shared, and streaming state.' },
  { area: 'REST and optional streaming flows', notes: 'REST for CRUD/reporting; WebSocket/SSE only where freshness justifies it.' },
  { area: 'API gateway or BFF', notes: 'Aggregation, auth, correlation IDs, and per-client shaping.' },
  { area: 'Authentication and server-enforced authorization', notes: 'The server authorizes every operation; the UI hides but does not secure.' },
  { area: 'Observability and correlation IDs', notes: 'Trace a request from UI through gateway to service and back.' },
  { area: 'Deployment and rollback', notes: 'Immutable artifacts, feature flags, canary/rollback, versioned assets.' },
  { area: 'Stale-data and partial-failure behavior', notes: 'Show "as of" timestamps, distinguish zero/no data, degrade one panel without losing the page.' },
];

export interface MfOption {
  id: string;
  label: string;
  description: string;
}

export const MF_OPTIONS: MfOption[] = [
  { id: 'modular-monolith', label: 'Modular monolith', description: 'One deployable with strict internal boundaries and shared libraries.' },
  { id: 'build-time', label: 'Build-time packages (monorepo)', description: 'Shared packages composed at build time; independent library versioning, one app deploy.' },
  { id: 'module-federation', label: 'Module Federation / runtime MFs', description: 'Separately built and deployed features composed in the browser at runtime.' },
  { id: 'web-components', label: 'Web components', description: 'Framework-agnostic custom elements with runtime isolation at the component level.' },
  { id: 'iframe', label: 'iframe isolation', description: 'Maximum runtime isolation via full document boundaries.' },
];

export const MF_AXES: { id: string; label: string }[] = [
  { id: 'team-autonomy', label: 'Team autonomy' },
  { id: 'independent-deploy', label: 'Independent deployment' },
  { id: 'runtime-isolation', label: 'Runtime isolation' },
  { id: 'framework-flex', label: 'Framework/version flexibility' },
  { id: 'dependency-complexity', label: 'Shared dependency complexity' },
  { id: 'ux-consistency', label: 'UX consistency' },
  { id: 'testing-complexity', label: 'Testing complexity' },
  { id: 'operational-overhead', label: 'Operational overhead' },
];

// Ratings: 1 = low/cost, 5 = high/benefit. Values are opinionated teaching defaults.
export const MF_MATRIX: Record<string, Record<string, number>> = {
  'modular-monolith': { 'team-autonomy': 1, 'independent-deploy': 1, 'runtime-isolation': 1, 'framework-flex': 1, 'dependency-complexity': 1, 'ux-consistency': 5, 'testing-complexity': 1, 'operational-overhead': 1 },
  'build-time': { 'team-autonomy': 3, 'independent-deploy': 2, 'runtime-isolation': 1, 'framework-flex': 2, 'dependency-complexity': 3, 'ux-consistency': 5, 'testing-complexity': 2, 'operational-overhead': 2 },
  'module-federation': { 'team-autonomy': 5, 'independent-deploy': 5, 'runtime-isolation': 3, 'framework-flex': 4, 'dependency-complexity': 4, 'ux-consistency': 3, 'testing-complexity': 4, 'operational-overhead': 5 },
  'web-components': { 'team-autonomy': 3, 'independent-deploy': 3, 'runtime-isolation': 3, 'framework-flex': 5, 'dependency-complexity': 3, 'ux-consistency': 3, 'testing-complexity': 3, 'operational-overhead': 3 },
  iframe: { 'team-autonomy': 2, 'independent-deploy': 2, 'runtime-isolation': 5, 'framework-flex': 5, 'dependency-complexity': 1, 'ux-consistency': 1, 'testing-complexity': 5, 'operational-overhead': 4 },
};

export const MF_TEACHING_POINT =
  'The correct answer is not "micro-frontends are best." Justify them through team ownership and release independence, then address their costs (version skew, duplicated dependencies, integration testing, runtime failures, UX inconsistency). If teams can ship a modular monolith safely, that is often the cheaper starting point.';

export const MERMAID_HIGH_LEVEL = `flowchart LR
    User[Risk Manager] --> Shell[Angular Application Shell]
    Shell --> Auth[Authentication and Entitlements]
    Shell --> Dashboard[Risk Dashboard Feature]
    Shell --> Limits[Limits and Breaches Feature]
    Shell --> Reports[Reporting Feature]
    Dashboard --> BFF[API Gateway or BFF]
    Limits --> BFF
    Reports --> BFF
    BFF --> RiskAPI[Risk Services]
    BFF --> Audit[Audit Service]
    RiskAPI --> Data[(Risk Data Stores)]
    Shell --> Telemetry[Logs Metrics Traces]`;

export const MERMAID_SEQUENCE = `sequenceDiagram
    actor User as Risk Manager
    participant UI as Angular UI
    participant Facade as Feature Facade/Store
    participant API as API Client
    participant Gateway as Gateway/BFF
    participant Risk as Risk Service

    User->>UI: Change portfolio filter
    UI->>Facade: Update filter
    Facade->>API: Request portfolio risk
    API->>Gateway: GET risk data + auth + correlation ID
    Gateway->>Risk: Validate entitlement and query
    Risk-->>Gateway: Data + freshness metadata
    Gateway-->>API: Typed response
    API-->>Facade: Update success state
    Facade-->>UI: Render dashboard and freshness`;

export const SEQUENCE_ADDITIONS: string[] = [
  'Cancellation or superseded request (switchMap on filter changes).',
  'Unauthorized response (401/403) and safe UI handling.',
  'Timeout / partial failure for a panel.',
  'Retry policy with bounded backoff.',
  'Audit/telemetry event with correlation ID.',
];

export const DESIGN_RUBRIC: string[] = [
  'Requirements clarification',
  'Domain boundaries',
  'Angular architecture',
  'Data/state design',
  'Performance',
  'Security and entitlements',
  'Auditability/data freshness',
  'Resilience',
  'Testing/deployment/observability',
  'Trade-off communication',
];
