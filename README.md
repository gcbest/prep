# Risk UI Interview Sprint

One focused day to prepare for **Citi Enterprise Risk Technology's Senior Angular UI Developer** interview.

> Unofficial, independent study tool. Not affiliated with Citigroup.

The interview content is about **Angular 16+** (Jasmine/Karma, RxJS, micro-frontends, Docker/CI-CD, risk-domain
controls), while the prep website itself is implemented in **React + TypeScript** on purpose: Angular concepts are
shown next to their closest React equivalents, with the places the analogy breaks down called out explicitly.

## Prerequisites

- Node.js 18+ (20 recommended)
- npm

## Install and run

```bash
npm install
npm run dev
```

Open the printed local URL (Vite dev server). All progress is stored in your browser's localStorage — no account, no
backend, no analytics.

## Test and build

```bash
npm test          # Vitest + React Testing Library
npm run typecheck # TypeScript strict mode
npm run build     # production build into dist/
npm run preview   # preview the production build
```

## Architecture overview

- **Vite + React 18 + TypeScript (strict) + React Router (HashRouter)** — static, deployable to any static host.
- **Tailwind CSS** — restrained enterprise aesthetic with dark mode.
- **Zustand + localStorage persist** — versioned schema, auto-saved, import/export/reset.
- **react-markdown + remark-gfm** — lightweight study-content rendering.
- **Mermaid** (lazy-loaded) — editable architecture and sequence diagrams.

Routes: `/`, `/diagnostic`, `/angular-bridge`, `/rxjs-state`, `/testing-lab`, `/coding-lab`, `/code-review`,
`/system-design`, `/devops-controls`, `/risk-domain`, `/leadership`, `/mock-interview`, `/cheat-sheet`, `/review`,
`/settings`.

## Data / privacy statement

- No data leaves your browser.
- Progress, notes, STAR stories, and confidence scores persist in localStorage.
- You can **export** everything as JSON and **import** it on another device (Settings → Data).
- The schema is versioned and migrations are defensive.

## How to edit the question/content data

All seeded content lives in `src/data/`:

- `questions.ts` — the interview question bank (category, priority, prompt, follow-ups, strong points, red flags).
- `angularBridge.ts` — React → Angular concept cards and required Angular depth sections.
- `rxjsScenarios.ts` — operator scenario drills and state classification.
- `testingLab.ts` — test mappings and the RiskLimitComponent exercise.
- `codingLab.ts` — coding exercises and rubric.
- `codeReview.ts` — the flawed component and review findings.
- `systemDesign.ts` — the risk-portal prompt, phases, matrix, and Mermaid templates.
- `devopsControls.ts`, `securityRisk.ts`, `leadership.ts`, `mockInterview.ts`, `cheatSheet.ts` — remaining modules.

Edit the arrays and the UI updates automatically. Question objects follow the `InterviewQuestion` type in `src/types.ts`.

## Known limitations

- The site does **not** run an Angular compiler; coding exercises use syntax-highlighted code panels and candidate notes.
- Free-form answers are **self-scored** against rubrics — there is no semantic auto-grading.
- Voice recording was intentionally omitted to keep the MVP simple; an "answer aloud" timer is provided instead.
- The deterministic "priority recommendation" is a weighted formula, not AI.

## One-day usage guide

1. Open the app and set your interview start time on the dashboard.
2. Run the **diagnostic** (≈20 min) to find your three weakest topics.
3. Follow the **recommended next activity** through the day's schedule.
4. Drill the **Angular-through-React cards** and **RxJS scenarios**.
5. Do the **testing**, **coding**, and **code-review** labs.
6. Design the **risk portal** and edit the Mermaid diagrams.
7. Draft four **STAR-L stories** and practice aloud.
8. Run the timed **mock interview**.
9. Review the **low-confidence queue**, then print/copy the **cheat sheet**.

## Deployment

GitHub Pages deploys from `main` (and the `feat/risk-ui-interview-sprint` branch) via
`.github/workflows/pages.yml`: install → test → build → publish `dist/`. The Vite build uses a relative base
(`./`) and HashRouter, so it works under `https://<user>.github.io/<repo>/` with no server configuration.
