# ARC/PREP

A no-build Citi interview study deck for the **Lead UI Engineer / Senior UI Developer**
role in Citi's **Enterprise Risk Technology (ERT)** — Rutherford, NJ, Zoom panel.

The drill deck is tuned to the job description and team research: **Angular 16+**,
JavaScript/TypeScript, HTML5/CSS/Bootstrap, **Jasmine & Karma** and Cypress testing,
UI system design with a11y/performance, DevOps (Git, JIRA, Agile/Scrum,
TeamCity/uDeploy/Jenkins, Micro Frontends, Docker), **risk domain** (stress testing /
CCAR, BCBS 239, VaR/ES, limit monitoring), and the systems-analysis + leadership
material a senior hire is probed on — 80 flashcards across 10 tracks.

The page is organized as a guided flow: drill deck → **React → Angular translation** → role &
team brief → 7-day countdown → STAR stories → **UI system design**, with the last-hour reference, Citi intel, and sources
colapsed behind one-tap folds so nothing overwhelms.

The **UI system design** section (06) prepares the senior-weighted round: a five-step method, a
non-functional checklist (a11y · perf · auditability), three worked designs (shared design system,
micro-frontend shell vs monolith, live limit-breach dashboard), ten prompts to rehearse out loud, and a
45-minute pacing table. The role brief also folds in the reported **interview process** (HR/assessment →
Karat screen → technical panels → Superday/HR) with what each stage actually tests.

The **React → Angular** section (02) teaches the mental conversion for React developers joining an
Angular shop: a JSX→template crib sheet, a 19-row concept map (`useState` → `signal()`,
`useEffect` → `effect()`/`takeUntilDestroyed()`, `key` → `track`, React Router → guards), a
limit-breach monitor written in both frameworks side by side, six more real-world translations
(context→service, private routes→guards, controlled forms→reactive forms, `React.memo`→OnPush,
RTL→TestBed, custom hooks→services/directives), plus a week-1 gotchas list and a ten-step
conversion checklist folded away at the end.

## Research notes

[`research/what-to-expect.md`](research/what-to-expect.md) collects web research on what the interview
itself looks like: the reported 3-round process (HR/assessment → Karat live screen → technical panels →
Superday/HR), the Karat debug-in-a-repo format, live Citi UI/frontend job postings that show the real
stack expectations, and where candidates lose points — each claim marked `[reported]` or `[official]`
with source links (retrieved 2026-09-29).

## Run locally

Open `index.html` in a browser, or serve the folder with any static server:

```sh
python3 -m http.server
```

## Cross-device sync

Progress and STAR notes are saved locally by default. To sync them between devices:

1. Create a **fine-grained GitHub personal access token** with only the **Gists: Read and write** permission. Do not commit or share this token.
2. Open the app and enter the token in the sync panel.
3. Click **Save to Gist**. The first save creates a private Gist and fills in its ID.
4. On another device, enter the same token and Gist ID, then click **Load from Gist**.

The token is stored only in that browser's local storage. The private Gist contains `arcprep-state.json`, not the token. GitHub API access is made directly from the browser; if a token is revoked, use a new one.

## GitHub Pages

This repository includes `.github/workflows/pages.yml`. After pushing `main`, enable **Settings → Pages → Source: GitHub Actions** if GitHub has not enabled it automatically. The workflow publishes the repository as a static site.
