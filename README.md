# ARC/PREP

A no-build Citi interview study deck for the **Lead UI Engineer / Senior UI Developer**
role in Citi's **Enterprise Risk Technology (ERT)** — Rutherford, NJ, Zoom panel.

The drill deck is tuned to the job description and team research: **Angular 16+**,
JavaScript/TypeScript, HTML5/CSS/Bootstrap, **Jasmine & Karma** and Cypress testing,
UI system design with a11y/performance, DevOps (Git, JIRA, Agile/Scrum,
TeamCity/uDeploy/Jenkins, Micro Frontends, Docker), **risk domain** (stress testing /
CCAR, BCBS 239, VaR/ES, limit monitoring), and the systems-analysis + leadership
material a senior hire is probed on — 72 flashcards across 9 tracks.

The page is organized as a guided flow: drill deck → role & team brief → 7-day
countdown → STAR stories, with the last-hour reference, Citi intel, and sources
colapsed behind one-tap folds so nothing overwhelms.

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
