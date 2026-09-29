# What to expect: Senior / Lead UI Software Engineer interview at Citi

Web research, retrieved **2026-09-29**. Unofficial study aid, not affiliated with Citigroup.

Two kinds of source are mixed here and marked as such:

- **[reported]** — self-reported candidate accounts (PracHub aggregation, Aced/Exponent, Glassdoor
  and Nodeflair snippets). Not an official process; treat as a strong hint, confirm with your recruiter.
- **[official]** — Citi's own live job postings and careers site.

> Access note: Glassdoor, Reddit and most search engines blocked automated retrieval. Glassdoor and
> Nodeflair figures below come from search-result snippets, so re-check them in a browser if you care
> about the exact numbers.

---

## 1. The process [reported]

Roughly **3 rounds over 3–5 weeks**:

| Stage | What candidates describe |
| --- | --- |
| **1. Screen** | HR/recruiter call + an online assessment (data structures, algorithms, logical reasoning). For many SWE roles a **live technical screen run by Karat**, Citi's third-party interview vendor, follows. |
| **2. Technical** | Series of interviews: coding challenges + system design, with hiring managers, engineering leads and technical architects. Includes **resume deep-dives** (they pick tools off your CV and ask how you built them). |
| **3. Final** | "Superday"-style techno-managerial + HR round: cultural fit, team alignment, behavioral stories, **compensation discussion** (reports say comp is settled here). |

- **Seniority matters:** reports put **more weight on system design at mid/senior levels (AVP, VP, SVP)**.
- **Karat screen format** (verified account, Senior/L5, [Aced/Exponent][exponent]): ~5 language/framework
  theory questions (~10 min) then a **~50 min pair-programming/debugging session** — fix failing tests in an
  unfamiliar multi-class repository, plus algorithmic problems. Candidate rated it *moderate*.
  Ask your recruiter whether the reported "redo" option applies to your screen.
- **Difficulty data [reported]:** Glassdoor — senior SWE interview **~3.1/5 difficulty, ~52% positive**
  experience (company average ~64%); SWE overall ~2.8–3/5. Nodeflair hosts **1,351 Citi interview write-ups**.

## 2. What the role actually is [official]

Live postings pulled from [jobs.citi.com](https://jobs.citi.com) (search with `?k=…`, e.g.
`https://jobs.citi.com/search-jobs?k=UI%20Engineer`). Relevant job families: **Digital Software Engineering**,
**Digital Design Engineering**. Citi levels run Analyst → AVP → VP → SVP; "senior UI engineer" usually maps
to **AVP or VP**.

**Senior Frontend Engineer, AVP — Equity Derivatives, Singapore** ([posting][sg])

- React + TypeScript; Redux / Redux Toolkit state management
- **Vitest unit + Cypress integration tests, explicit TDD focus**
- Build a **reusable UI component library** shared across trade-management web apps
- Advanced TS (complex types, interfaces, generics), responsive CSS, REST/JSON
- Code reviews, architecture input, **coaching new analysts**; 5–6 yrs React/TS expected

**UI Technical Lead (Angular, React, TypeScript), VP — Lightspeed CI/CD platform, Dublin** ([posting][dublin])

- Modern **Angular (v21)**, expert TypeScript, SOLID / design patterns / clean architecture
- **Micro-frontends, Module Federation, Nx, monorepos, scalable state management**
- **Owns the component library and design-system integration**
- Git expertise, CI/CD, Jira/Kanban ownership, mentoring
- **"Champion effective use of AI-assisted development"** — generated code must be understood, tested,
  secure, maintainable

Other live UI postings worth skimming: [senior full-stack React/Angular/Java, Jersey City][jc],
[front-end developer, VP, New York][ny], [frontend developer React, AVP, Irving][irving],
[senior frontend engineer, AVP ×2][sg].

**Cross-cutting signals**

- **Accessibility is company-visible** (Citi runs a dedicated Accessibility at Citi program and posts
  accommodations guidance on every job). Expect WCAG / accessible-component questions on a UI role.
- **Testing is not optional** — TDD, coverage and Cypress/Karma-class tooling appear in requirements,
  not nice-to-haves.
- **Everything-as-code**: pipelines, API contracts, security standards and controls live in repos.

## 3. What this means for you, concretely

1. **Live coding** — JS/TS/Angular-React internals plus easy–medium algorithms. Answer with *mechanism*,
   not definition ("how does change detection run", not "Angular has change detection").
2. **Debugging round (Karat-style)** — read the failing test first, make the smallest fix, re-run the
   suite, narrate as you go. Rewriting code you haven't fully read is the classic failure.
3. **UI system design** — design-system strategy, micro-frontends vs. monolith, state management at
   scale, performance budgets, accessibility, test strategy. This is the senior-weighted round.
4. **Resume deep-dive** — for every tool on the CV: one thing you built, one decision, one thing that
   went wrong. Drop anything you only watched someone else use.
5. **Behavioral (STAR)** — ambiguity/tight deadline, disagreement with a senior architect, a tough
   production incident, critical feedback; plus **working under regulatory constraints** (delivery speed
   vs. risk controls) and **safe use of AI coding tools in a regulated bank** (what code/data you would
   *not* feed a tool, how you review output).
6. **Final/HR** — motivation for Citi and this team, team alignment, compensation expectations settled
   in advance.

## 4. Where candidates lose points [reported]

- Editing code in the debugging round before reading the failing tests.
- Defining terms without mechanism or consequence ("HashMap uses hashing").
- Claiming global ordering / exactly-once without stating the conditions.
- Listing tools on the resume that can't survive a deep dive.
- Generic "why Citi" answers — tie it to the team's actual work.

---

## Sources

**Interview reports / aggregators**

- [Aced/Exponent — Citi Group senior SWE interview experience][exponent] — verified Karat account
- [PracHub — Citi software engineer interview guide, 2026][prachub] — round-by-round aggregation,
  "where candidates lose points", practice prompts
- [Nodeflair — Citi senior software engineer interviews][nodeflair] — 1,351 Citi interview entries
- [Glassdoor — Citi senior SWE interview questions][glassdoor] · 217 SWE reviews, difficulty ratings
  *(bot-blocked; snippet data only)*

**Official Citi**

- [jobs.citi.com](https://jobs.citi.com) · keyword search: `https://jobs.citi.com/search-jobs?k=UI%20Engineer`
- [Senior Frontend Engineer, AVP — Singapore][sg] · React/TS/Vitest/Cypress/Storybook
- [UI Technical Lead (Angular, React, TypeScript), VP — Dublin][dublin] · Angular 21, micro-frontends
- [Senior Full-Stack Engineer (React/Angular/Java), VP — Jersey City][jc]
- [Front-End Developer, VP — New York][ny] · [Frontend Developer React, AVP — Irving][irving]
- [Citi Workday board](https://citi.wd5.myworkdayjobs.com/2) · external applications land here

[exponent]: https://www.tryexponent.com/experiences/citi-group-senior-software-engineer-interview-39ca67
[prachub]: https://prachub.com/interview-guide/citi-software-engineer-interview-questions-guide-2026
[nodeflair]: https://nodeflair.com/companies/citi/interviews/senior-software-engineer
[glassdoor]: https://www.glassdoor.com/Interview/Citi-Senior-Software-Engineer-Interview-Questions-EI_IE8843.0,4_KO5,29.htm
[sg]: https://jobs.citi.com/job/singapore/senior-frontend-engineer-assistant-vice-president/287/101029326032
[dublin]: https://jobs.citi.com/job/dublin/ui-technical-lead-angular-react-typescript-vp/287/100756238496
[jc]: https://jobs.citi.com/job/jersey-city/senior-full-stack-engineer-react-angular-java-prime-brokerage-vp/287/101138732160
[ny]: https://jobs.citi.com/job/new-york/credit-and-systematic-trading-front-end-developer-vice-president/287/93654911424
[irving]: https://jobs.citi.com/job/irving/frontend-developer-react-assistant-vice-president/287/101282697264
