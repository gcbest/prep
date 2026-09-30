export const DEVOPS_STAGES: { step: number; title: string; detail: string; why: string }[] = [
  { step: 1, title: 'Branch and commit through Git', detail: 'Developer creates a feature branch and commits small, reviewable changes.', why: 'Traceability and isolation.' },
  { step: 2, title: 'PR triggers lint, type check, unit tests, static analysis', detail: 'Automated gates run on every pull request.', why: 'Fast feedback and repeatability.' },
  { step: 3, title: 'Review includes code, design, tests, and controls', detail: 'Reviewers consider correctness, security, maintainability, and operational risk.', why: 'Risk reduction before merge.' },
  { step: 4, title: 'CI creates a production Angular build', detail: 'AOT compilation, minification, source maps, and release identifiers.', why: 'A deterministic artifact.' },
  { step: 5, title: 'Multi-stage Docker build', detail: 'Build in one stage, package static assets (or a BFF/containerized server) in a minimal runtime stage.', why: 'Small, reproducible images.' },
  { step: 6, title: 'Dependency, license, secret, and image scanning', detail: 'Scanners run against dependencies and the image.', why: 'Supply-chain and control risk.' },
  { step: 7, title: 'Immutable artifact promotion', detail: 'The same artifact is promoted through dev → staging → production.', why: 'You test exactly what you ship.' },
  { step: 8, title: 'Automated smoke/Cypress tests', detail: 'Critical browser journeys run against each environment.', why: 'Catch integration regressions.' },
  { step: 9, title: 'Approval gates', detail: 'Deployments require environment-appropriate approvals.', why: 'Separation of duties.' },
  { step: 10, title: 'Monitoring, flags, rollback', detail: 'Health checks validate the release; feature flags and rollback limit impact.', why: 'Contain and recover from failures.' },
];

export const DEVOPS_TEACHING_POINTS: string[] = [
  'Browser-delivered Angular configuration is visible to users — never put secrets in it.',
  'Prefer promoting one immutable artifact over rebuilding separately in every environment.',
  'TeamCity or Jenkins can run the pipeline; do not memorize tool-specific syntax — explain the stages and feedback loops.',
  'uDeploy is deployment orchestration: it manages environment promotion, approvals, and audit of what went where.',
  'Include source maps (handled carefully), release identifiers, health checks, and rollback considerations.',
  'Every stage maps to fast feedback, repeatability, traceability, or risk reduction.',
];

export const DEVOPS_RAPID_FIRE: { question: string; answer: string }[] = [
  {
    question: 'What belongs in the Docker image?',
    answer: 'The built static assets (or containerized BFF/server), runtime dependencies, and a health endpoint. Not secrets, not source maps exposed publicly, not dev tooling.',
  },
  {
    question: 'How are environment-specific API URLs supplied?',
    answer: 'At deploy time via environment variables, a config endpoint, or per-environment config injected at container start — never baked into the build with secrets.',
  },
  {
    question: 'How do you handle failed database/API compatibility after a UI deployment?',
    answer: 'Contract tests and versioned APIs prevent most of it. If it happens: detect via health/smoke checks, roll back the UI (or flag off), and keep the API backward compatible.',
  },
  {
    question: 'How do you prevent dependency drift?',
    answer: 'Lockfiles, reproducible installs, dependency scanning, scheduled upgrades, and shared-library version governance.',
  },
  {
    question: 'What blocks a release?',
    answer: 'Failed tests/scans, security findings, unmet approval gates, failed smoke tests, or unresolved production-impacting bugs. Blocking criteria should be explicit.',
  },
  {
    question: 'How do feature flags affect testing and cleanup?',
    answer: 'Test both on and off paths, add telemetry for flag states, and plan removal so flags do not accumulate into dead configuration.',
  },
];
