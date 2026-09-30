export interface SecurityCard {
  id: string;
  title: string;
  threat: string;
  uiMitigation: string;
  serverEnforcement: string;
  testMonitor: string;
}

export const SECURITY_CARDS: SecurityCard[] = [
  {
    id: 'xss',
    title: 'XSS prevention',
    threat: 'Attacker injects script that runs in a victim’s session.',
    uiMitigation: 'Angular auto-escapes interpolations; avoid bypassing it (e.g., [innerHTML] only with sanitized trusted content via DomSanitizer).',
    serverEnforcement: 'Validate/encode output; set CSP; never reflect untrusted input unsanitized.',
    testMonitor: 'Static analysis, security scans, CSP reporting, and code review of any innerHTML usage.',
  },
  {
    id: 'csp',
    title: 'Content Security Policy',
    threat: 'Injected or third-party script execution.',
    uiMitigation: 'Do not use inline scripts/styles that violate a strict policy; load from allowlisted origins.',
    serverEnforcement: 'Send a strict CSP header and monitor violation reports.',
    testMonitor: 'CSP report-only mode in staging; alert on violations; test in CI.',
  },
  {
    id: 'csrf',
    title: 'CSRF',
    threat: 'A malicious site triggers state-changing requests using the user’s session.',
    uiMitigation: 'Use framework-provided CSRF tokens and same-site cookies; do not accept state changes via GET.',
    serverEnforcement: 'Validate CSRF tokens and enforce SameSite; authorize every request.',
    testMonitor: 'Automated tests assert tokens; monitor for unexpected cross-origin mutations.',
  },
  {
    id: 'cookies-tokens',
    title: 'Secure cookies and token handling',
    threat: 'Session/token theft or replay.',
    uiMitigation: 'Keep tokens out of localStorage when avoidable; prefer HttpOnly, Secure, SameSite cookies; never log tokens.',
    serverEnforcement: 'Set cookie flags, short expiry, rotation, and revocation.',
    testMonitor: 'Header/cookie audits, session anomaly detection.',
  },
  {
    id: 'cors',
    title: 'CORS misconceptions',
    threat: 'Misconfiguring CORS can expose APIs to untrusted origins.',
    uiMitigation: 'Front-end just calls the API; CORS is a server concern, not a UI security control.',
    serverEnforcement: 'Allowlist exact origins/methods/headers; CORS does not replace authentication/authorization.',
    testMonitor: 'Config tests and periodic origin allowlist review.',
  },
  {
    id: 'server-authz',
    title: 'Server-side authorization',
    threat: 'Client-side hiding gives a false sense of security.',
    uiMitigation: 'Hide/disable unauthorized actions for UX and handle 401/403 gracefully.',
    serverEnforcement: 'Authenticate and authorize every protected operation and record audit evidence.',
    testMonitor: 'Negative entitlement tests against the API; audit log sampling.',
  },
  {
    id: 'roles',
    title: 'Role and entitlement checks',
    threat: 'Escalation or wrong data exposure when roles are stale or coarse.',
    uiMitigation: 'Derive UI state from server-provided entitlements; do not trust client role flags.',
    serverEnforcement: 'Evaluate entitlements per request against authoritative source.',
    testMonitor: 'Test role matrix; alert on unusual access patterns.',
  },
  {
    id: 'sensitive-logs',
    title: 'Sensitive data in logs and browser storage',
    threat: 'PII/regulated data leaks via logs or storage.',
    uiMitigation: 'Do not log payloads; prefer correlation IDs; minimize what is persisted locally.',
    serverEnforcement: 'Scrub/classify logs; enforce retention and access controls.',
    testMonitor: 'Log scanning and data-classification checks.',
  },
  {
    id: 'clickjacking',
    title: 'Clickjacking',
    threat: 'Invisible frames trick users into clicking.',
    uiMitigation: 'Avoid being framed; the mitigation is a header.',
    serverEnforcement: 'Send X-Frame-Options/CSP frame-ancestors.',
    testMonitor: 'Header tests; manual checks for embedded contexts.',
  },
  {
    id: 'supply-chain',
    title: 'Dependency/supply-chain risk',
    threat: 'Malicious or vulnerable third-party packages.',
    uiMitigation: 'Keep dependencies minimal and pinned; review additions.',
    serverEnforcement: 'Lockfiles, SBOM, scanning, and controlled artifact sources.',
    testMonitor: 'CI dependency/vulnerability/license scanning with blocking thresholds.',
  },
  {
    id: 'export',
    title: 'Safe file export',
    threat: 'CSV/Excel formula injection or unintended data disclosure.',
    uiMitigation: 'Generate exports from typed data; warn before large downloads.',
    serverEnforcement: 'Sanitize formulas, authorize exports, and audit who exported what.',
    testMonitor: 'Export format tests and audit log verification.',
  },
  {
    id: 'audit-events',
    title: 'Audit events',
    threat: 'Unauditable changes reduce accountability.',
    uiMitigation: 'Attach correlation IDs and user context to actions.',
    serverEnforcement: 'Emit tamper-evident audit events for important operations.',
    testMonitor: 'Verify audit events exist for critical flows.',
  },
  {
    id: 'correlation-ids',
    title: 'Correlation IDs',
    threat: 'Hard to trace failures across distributed systems.',
    uiMitigation: 'Pass a correlation ID from UI through every request and display it on errors.',
    serverEnforcement: 'Propagate and log the ID across services.',
    testMonitor: 'End-to-end trace tests; dashboard of error traces.',
  },
  {
    id: 'session-timeout',
    title: 'Session timeout and reauthentication',
    threat: 'Abandoned sessions are hijacked.',
    uiMitigation: 'Handle session-expiry responses with reauth flow, not a confusing error.',
    serverEnforcement: 'Enforce idle/absolute timeouts and step-up auth for sensitive actions.',
    testMonitor: 'Timeout tests and monitoring of reauth events.',
  },
];

export const RISK_VOCABULARY: { term: string; definition: string }[] = [
  { term: 'Exposure', definition: 'The amount at risk in a position or portfolio.' },
  { term: 'Limit', definition: 'A boundary/threshold on risk a business sets for control.' },
  { term: 'Utilization', definition: 'How much of a limit is used, often a percentage.' },
  { term: 'Threshold', definition: 'A point (e.g., 80%) where a warning or action triggers.' },
  { term: 'Breach', definition: 'Utilization exceeding the limit (100%+), an exception requiring attention.' },
  { term: 'Exception', definition: 'A deviation from expected/approved risk behavior that needs review.' },
  { term: 'Approval', definition: 'An authorized sign-off, often part of a workflow.' },
  { term: 'Reconciliation', definition: 'Comparing two data sources to ensure they agree.' },
  { term: 'Data lineage', definition: 'The origin and transformations of data — where it came from.' },
  { term: 'Data freshness', definition: 'How current the data is; communicated with "as of" timestamps.' },
  { term: 'Aggregation', definition: 'Rolling up positions/exposures to a higher level.' },
  { term: 'Legal entity', definition: 'A jurisdictional business unit that affects controls and reporting.' },
  { term: 'Risk category', definition: 'A class of risk (market, credit, operational, etc.).' },
  { term: 'Audit trail', definition: 'A tamper-evident record of who did what and when.' },
];

export const RISK_UI_IMPLICATIONS: string[] = [
  'Always show "as of" timestamps where freshness matters.',
  'Distinguish no data from zero.',
  'Make partial and stale data visually explicit.',
  'Preserve precision and state rounding rules.',
  'Support drill-down from an aggregate to its sources.',
  'Enforce entitlements on the server even if the UI hides actions.',
  'Ensure important acknowledgements and changes are auditable.',
  'Avoid color as the only breach indicator (add text, icons, or patterns).',
];
