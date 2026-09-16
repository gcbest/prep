/* ============================================================
   ARC/PREP — Question bank
   Each card: { id, track, q, a, points[], code? }
   ============================================================ */

const TRACKS = [
  { id: "js",    num: "01", label: "JavaScript Core" },
  { id: "css",   num: "02", label: "CSS & Layout" },
  { id: "react", num: "03", label: "React & Frameworks" },
  { id: "ts",    num: "04", label: "TypeScript" },
  { id: "a11y",  num: "05", label: "A11y & Performance" },
  { id: "sys",   num: "06", label: "UI System Design" },
  { id: "arch",  num: "07", label: "Software Architecture" },
  { id: "citi",  num: "08", label: "Citi & Behavioral" },
];

const QUESTIONS = [
  /* ---------------- 01 · JAVASCRIPT CORE ---------------- */
  {
    id: "js-1", track: "js",
    q: "Walk me through the event loop. What order do things run in?",
    a: "JavaScript runs on a single call stack. When the stack empties, the event loop first drains the entire microtask queue (promise callbacks, queueMicrotask, MutationObserver), then runs one macrotask (timers, I/O, UI events), may render (rAF callbacks run just before paint), and repeats. This is why a resolved promise's .then always beats a setTimeout(0).",
    points: [
      "Microtasks drain completely between every macrotask — nested .then chains can starve rendering",
      "requestAnimationFrame fires before paint, after the current macrotask",
      "setTimeout(fn, 0) is really clamped to ~4ms minimum and is a macrotask",
      "Long synchronous work blocks everything — chunk it or move it to a worker",
    ],
    code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\n// 1, 3, 2  — microtasks beat macrotasks"
  },
  {
    id: "js-2", track: "js",
    q: "What is a closure and where have you actually used one?",
    a: "A closure is a function that keeps a live reference to the scope it was created in, even after that outer function has returned. It's the mechanism behind private state, memoization, partial application, and module patterns.",
    points: [
      "Encapsulation: counter/state hidden behind a returned API",
      "Memoize: cache keyed by arguments inside the closure",
      "Debounce/throttle: the timer id lives in the closure",
      "Classic gotcha: var in loops shares one binding — let creates a fresh binding per iteration",
    ],
    code: "function memoize(fn) {\n  const cache = new Map(); // lives in the closure\n  return (...args) => {\n    const k = JSON.stringify(args);\n    if (!cache.has(k)) cache.set(k, fn(...args));\n    return cache.get(k);\n  };\n}"
  },
  {
    id: "js-3", track: "js",
    q: "Debounce vs throttle — explain the difference and when you'd use each.",
    a: "Debounce delays invocation until the events stop firing for N ms — only the last call wins. Throttle guarantees at most one call per interval while events keep firing. Debounce is for 'wait until they're done', throttle is for 'rate-limit ongoing work'.",
    points: [
      "Debounce: search-as-you-type, autosave, resize handlers",
      "Throttle: scroll/pointermove handlers, analytics sampling, drag",
      "Mention leading vs trailing edge options",
      "In interviews, be ready to implement debounce from scratch in <10 lines",
    ],
    code: "function debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}"
  },
  {
    id: "js-4", track: "js",
    q: "Explain prototypal inheritance and how `this` gets bound.",
    a: "Every object has an internal [[Prototype]] link; property lookup walks that chain until found or null. class syntax is sugar over this mechanism. `this` is decided by how a function is CALLED, not where it's defined: as a method (the receiver), standalone (undefined in strict mode), with new (the fresh instance), or explicitly via call/apply/bind. Arrow functions take `this` lexically from their enclosing scope.",
    points: [
      "Lookup: own properties → [[Prototype]] chain → null",
      "Four `this` rules: implicit receiver, default/undefined, new, explicit bind/call/apply",
      "Arrow functions ignore all four — they capture lexical `this` (great for callbacks)",
      "class methods are non-enumerable and live on the prototype, not instances",
    ]
  },
  {
    id: "js-5", track: "js",
    q: "Compare Promise.all, allSettled, race, and any.",
    a: "all rejects fast on the first rejection (fail-fast, all-or-nothing). allSettled never rejects — you get {status, value/reason} for each. race settles with whichever promise settles first, success or failure. any resolves with the first success and only rejects if every input rejects (AggregateError).",
    points: [
      "all: parallel fetches where every result is required (e.g., dashboard widgets)",
      "allSettled: batch operations where partial success is fine",
      "race: timeouts — race the fetch against a rejecting timer",
      "any: fallbacks — try mirror 1, mirror 2, mirror 3",
      "Always mention passing promises into the array — they start executing immediately",
    ]
  },
  {
    id: "js-6", track: "js",
    q: "What's the difference between == and ===? When would either be correct?",
    a: "=== is strict equality: no type coercion, different types are never equal (Object.is refines NaN and ±0). == applies the abstract equality algorithm, coercing null/undefined to each other, primitives to numbers, and objects via ToPrimitive. Modern style: always ===, except `x == null` as a concise null-or-undefined check.",
    points: [
      "NaN !== NaN — use Number.isNaN or Object.is",
      "Objects compare by reference, not shape or value",
      "'0' == false is true (both coerce to 0) but '0' is truthy — a classic trap",
      "Default to ===; lint with eqeqeq, allow ['==null']",
    ]
  },
  {
    id: "js-7", track: "js",
    q: "What is event delegation and what are its trade-offs?",
    a: "Instead of attaching a listener to every child, attach one listener to a stable ancestor and use event.target/bubbling to dispatch. Fewer listeners, less memory, and it works for elements added later. Trade-offs: you pay a bubble phase check on every event, event.target may be a deep descendant (use closest()), and some events don't bubble.",
    points: [
      "Use e.target.closest('[data-action]') to find the real target",
      "Doesn't work for non-bubbling events (focus/blur — use focusin/focusout)",
      "Essential for large dynamic lists (rows, tables) — very relevant at enterprise scale",
      "stopPropagation breaks delegation — treat it as a smell",
    ],
    code: "list.addEventListener('click', (e) => {\n  const row = e.target.closest('tr[data-id]');\n  if (row) openAccount(row.dataset.id);\n});"
  },
  {
    id: "js-8", track: "js",
    q: "Shallow vs deep copy — what are the pitfalls?",
    a: "Spread and Object.assign copy one level; nested objects are still shared references, so 'mutations' leak between copies. structuredClone() does true deep copies (handles Dates, Maps, Sets, cycles) but can't clone functions or DOM nodes. JSON.parse(JSON.stringify()) silently destroys Dates, undefined, Infinity, and throws on cycles.",
    points: [
      "Spread is shallow — the #1 practical gotcha in React state updates",
      "structuredClone is the modern default for deep data",
      "JSON round-trip only for plain JSON-safe data",
      "For immutable updates, libraries like Immer handle nested paths ergonomically",
    ]
  },
  {
    id: "js-9", track: "js",
    q: "How does garbage collection work, and what leaks do you hunt in a UI app?",
    a: "Modern engines trace reachability from roots (GC isn't reference-counting), so anything still reachable lives. Leaks in UIs are almost always 'reachable but useless': forgotten timers, listeners on long-lived nodes, detached DOM subtrees held by closures or caches, and un-aborted fetches retaining scope.",
    points: [
      "Timers/intervals not cleared on unmount",
      "Event listeners on document/window never removed",
      "Detached nodes kept in arrays/caches — check heap snapshots for 'Detached'",
      "Un-aborted requests and growing Map caches — use WeakMap/WeakRef for associating data with DOM nodes",
      "Chrome DevTools → Memory → heap snapshot diff 3-way allocation",
    ]
  },
  {
    id: "js-10", track: "js",
    q: "ES modules vs CommonJS — what actually differs?",
    a: "ESM is static: imports are hoisted, resolved and linked before evaluation, which enables tree-shaking and top-level await. CommonJS is dynamic: require() runs at call time, conditionals allowed, but bundlers can't statically know the export graph. ESM is also async-loaded and strictly mode by default.",
    points: [
      "Imports are hoisted and live bindings — reassigning an export propagates",
      "Tree-shaking and code-splitting depend on static structure",
      "CJS circular deps give you partial objects; ESM gives live bindings (safer cycles)",
      "In the browser, ESM needs type=\"module\"; mention import maps for bare specifiers",
    ]
  },

  /* ---------------- 02 · CSS & LAYOUT ---------------- */
  {
    id: "css-1", track: "css",
    q: "Explain specificity and how cascade layers change the game.",
    a: "Specificity is the tuple (inline, id, class+attr+pseudo-class, type+pseudo-element). Higher tuple wins regardless of order. @layer adds a higher-order criterion: unlayered styles beat layered ones, and earlier layers lose to later ones — giving you deliberate 'reset < defaults < components < utilities' ordering without !important.",
    points: [
      ":where() = zero specificity; :is() takes the specificity of its most specific argument",
      "Inline style and !important still outrank layers — layers reduce the NEED for them",
      "Repeat the classic chain: inline > id > class > element, then source order",
      "Design systems use layers so consumer overrides always win predictably",
    ]
  },
  {
    id: "css-2", track: "css",
    q: "What creates a stacking context and why does it bite teams?",
    a: "A stacking context is an isolated z-axis unit: children can never escape it to compete with outside elements. Created by html root, position + z-index, transform, opacity < 1, filter, will-change, isolation: isolate, contain: paint, and more. The classic bug: a modal's z-index loses because a parent card has transform/opacity, quietly capping the modal inside that context.",
    points: [
      "z-index only competes WITHIN the same stacking context",
      "Debug by walking ancestors for transform/opacity/filter/will-change",
      "isolation: isolate deliberately creates a context (great for scoped overlays)",
      "Fix by removing the trigger or lifting the portal to <body>",
    ]
  },
  {
    id: "css-3", track: "css",
    q: "How would you speed up a page with thousands of cards? (containment & content-visibility)",
    a: "contain tells the browser it can skip work: layout/paint/size isolation per element. content-visibility: auto skips rendering of off-screen sections entirely while keeping their estimated size via contain-intrinsic-size. The result is dramatically cheaper initial render for long feeds and lists.",
    points: [
      "content-visibility: auto + contain-intrinsic-size: X px — near-instant for long pages",
      "contain: layout paint isolates reflows/repaints to the subtree",
      "Pair with virtualization for truly huge lists (10k+ rows)",
      "Caveat: find-in-page and anchors may behave oddly until items render",
    ]
  },
  {
    id: "css-4", track: "css",
    q: "Flexbox or Grid — how do you decide, and what are the power features?",
    a: "Flexbox distributes along one axis (content-out sizing); Grid places along two axes (layout-first, with explicit rows/columns). Default to Grid for page scaffolding and card layouts, Flex for toolbars and content-driven rows. Auto-placement, minmax(), auto-fill vs auto-fit, and subgrid are the differentiators.",
    points: [
      "repeat(auto-fill, minmax(240px, 1fr)) — responsive cards with zero media queries",
      "auto-fit collapses empty tracks (items stretch); auto-fill keeps empty tracks (items aligned)",
      "subgrid lets children align to the parent's tracks — killer for card footers",
      "Flex gotchas: min-width:auto overflow — fix with min-width: 0 on children",
    ]
  },
  {
    id: "css-5", track: "css",
    q: "Center a card both axes — name three modern ways and trade-offs.",
    a: "Grid: display:grid; place-items:center on the parent (cleanest, no child styles). Flex: display:flex; align-items:center; justify-content:center. Or grid + margin:auto on the child, which even works when the child overflows (scrolls instead of clipping — unlike the others).",
    points: [
      "place-items: center is the one-liner interviewers like",
      "margin:auto in flex/grid handles overflow gracefully",
      "Absolute + translate(-50%,-50%) still fine but clips on overflow",
      "Mention logical centering vs viewport centering (dvh vs vh for mobile)",
    ]
  },
  {
    id: "css-6", track: "css",
    q: "Build responsive design without media queries — how?",
    a: "Intrinsic + container-based design: fluid type with clamp(min, preferred, max), Grid auto-fill tracks, and container queries (@container) so components respond to THEIR box, not the viewport. Media queries become a fallback, not the backbone — this is how component libraries scale across pages and portals.",
    points: [
      "font-size: clamp(1rem, 0.9rem + 0.8vw, 1.25rem)",
      "@container (min-width: 480px) — needs container-type: inline-size on the parent",
      "Container queries make truly reusable widgets possible (sidebar vs full-width)",
      "Mention :has() for parent-selection patterns and gap-based spacing systems",
    ]
  },
  {
    id: "css-7", track: "css",
    q: "position: sticky vs fixed — mechanics and common failures.",
    a: "fixed is removed from flow and positions against the viewport (ignoring ancestors unless an ancestor creates a containing block via transform/filter). sticky stays in flow and sticks within its nearest scrolling ancestor — but only inside its parent's box. Sticky fails when any ancestor has overflow: hidden/auto (becomes the scroll container) or the parent is too short.",
    points: [
      "sticky needs a top/left/right/bottom value and a tall-enough parent",
      "overflow on ancestors silently breaks sticky — first thing to check",
      "transform on an ancestor makes THAT the containing block for fixed",
      "Use sticky for table headers and summary bars — cheap and layout-safe",
    ]
  },
  {
    id: "css-8", track: "css",
    q: "How would you implement theming/dark mode in a design system?",
    a: "Three layers: raw palette tokens, semantic tokens (--surface, --ink, --accent), and component styles that only consume semantics. Switch themes by flipping a data-theme attribute (or @media prefers-color-scheme), set color-scheme so form controls/scrollbars adapt, and persist the choice. Prevent FOUC with an inline pre-paint script that sets the attribute before first render.",
    points: [
      "Semantic token indirection = one switch flips everything",
      "color-scheme: dark fixes native inputs, selection, scrollbars",
      "Persist in localStorage; honor system when no explicit choice",
      "Respect prefers-contrast and force-colors for accessibility",
      "This site is a working example — toggle the theme and watch tokens flip",
    ]
  },

  /* ---------------- 03 · REACT & FRAMEWORKS ---------------- */
  {
    id: "react-1", track: "react",
    q: "How does reconciliation work, and why do keys matter so much?",
    a: "On render, React diffs the new element tree against the previous one, matching children by type and key. Keys are identity: same key = same component instance whose state/DOM is preserved. Index-as-key breaks this on reorder/insert: React pairs the wrong state with the wrong row (classic symptom — focus or input state 'jumping' rows).",
    points: [
      "Use stable domain ids (account number, txn id), never array index for dynamic lists",
      "Different type = unmount + remount subtree; same type = update in place",
      "key can force intentional remounts (e.g., key={userId} to reset a form)",
      "Reconciliation is per-subtree — memo boundaries shrink the diff",
    ]
  },
  {
    id: "react-2", track: "react",
    q: "Why are the Rules of Hooks the way they are?",
    a: "React stores hooks as an ordered list per component instance (per fiber). useState() call #1 must map to slot #1 every render — the mapping is by call order, not by name. Conditional/looped calls shift the mapping and corrupt state. Hence: top level only, same order every render.",
    points: [
      "Lint plugin (react-hooks/rules-of-hooks) enforces it — explain WHY it can",
      "Custom hooks are just compositions — same rules apply",
      "Need conditional logic? Put the condition INSIDE the hook call args",
      "This is also why you can't call hooks outside components",
    ]
  },
  {
    id: "react-3", track: "react",
    q: "useEffect vs useLayoutEffect vs event handlers — when does each belong?",
    a: "useEffect runs after paint (async, non-blocking) — data fetching, subscriptions, analytics. useLayoutEffect runs synchronously after DOM mutations before paint — measuring/adjusting layout to avoid flicker. Event handlers are for user-intent state changes; don't route them through effects (that causes double renders and laggy UI).",
    points: [
      "Effects that fetch need race-condition handling: AbortController or an ignore flag",
      "'You might not need an effect': derived data → compute in render; user action → handler",
      "useLayoutEffect warns on SSR — guard or use useInsertionEffect/media queries",
      "Cleanup functions are mandatory for subscriptions/timers/observers",
    ],
    code: "useEffect(() => {\n  const ac = new AbortController();\n  fetch(url, { signal: ac.signal })\n    .then(r => r.json()).then(setData).catch(e => {\n      if (e.name !== 'AbortError') setError(e);\n    });\n  return () => ac.abort();\n}, [url]);"
  },
  {
    id: "react-4", track: "react",
    q: "When is useMemo/useCallback/React.memo actually worth it?",
    a: "Only when referential equality matters: skipping expensive computations, or passing stable props to memoized children/effects deps. Memoizing everything adds overhead and noise. Measure first (Profiler, why-did-you-render), then wrap the specific hot subtree.",
    points: [
      "useCallback(fn, deps) === useMemo(() => fn, deps)",
      "Rules: expensive calculation, memo child receiving object/array props, or effect dependency",
      "Context value objects need useMemo or every consumer re-renders",
      "State colocation and lifting often beat memoization — restructure before optimizing",
    ]
  },
  {
    id: "react-5", track: "react",
    q: "How do you choose state management for a large app?",
    a: "Split state by kind. Server state (accounts, balances, transactions) belongs in a data layer like TanStack Query — caching, refetching, deduping solved. Shared client UI state → small stores (Zustand) or context. Local ephemeral state → useState where it lives. Derived data should be computed, never duplicated.",
    points: [
      "Biggest enterprise mistake: copying server data into Redux then sync-drifting",
      "URL is state too — filters/tabs/segments belong in the router",
      "Context re-renders all consumers: split contexts by change-frequency",
      "Normalized caches (React Query keys, entity stores) prevent stale-branch bugs",
    ]
  },
  {
    id: "react-6", track: "react",
    q: "What do Suspense and concurrent rendering buy you?",
    a: "Suspense lets components declare 'not ready yet' and show fallbacks without manual loading flags, enabling streaming SSR and code-split boundaries. Concurrent features (startTransition, useDeferredValue) mark updates as non-urgent so typing/staying responsive wins over heavy re-renders — React can interrupt and resume rendering.",
    points: [
      "startTransition for filter-against-big-list: input stays snappy, list updates after",
      "useDeferredValue — debouncing without the latency",
      "Route-level lazy() + Suspense is the standard splitting pattern",
      "Selective hydration: interact-with-before-hydrate for large pages",
    ]
  },
  {
    id: "react-7", track: "react",
    q: "Controlled vs uncontrolled inputs — trade-offs at scale?",
    a: "Controlled: React state is the source of truth — validation, formatting, conditional UI are trivial, but every keystroke re-renders. Uncontrolled: DOM owns the value (refs, FormData) — fast and zero re-render, good for huge forms. Hybrid: uncontrolled with onBlur validation is common at scale; format-as-you-type (currency!) usually justifies controlled.",
    points: [
      "Currency/IBAN fields: controlled with inputMode + careful formatting",
      "defaultValue vs value — mixing them is the classic warning",
      "Big forms: react-hook-form keeps them uncontrolled with declarative validation",
      "Re-rendering a 100-row table per keystroke = collocate the input state",
    ]
  },
  {
    id: "react-8", track: "react",
    q: "What do error boundaries catch, and what's the production pattern?",
    a: "Error boundaries catch render/lifecycle errors in the subtree below them — not event handlers, async callbacks, SSR, or errors thrown in the boundary itself. Pattern: per-route + per-critical-widget boundaries, fallback UI with a retry, and a hook to report to monitoring (Sentry-style) with release/version tags.",
    points: [
      "Async errors: catch in the handler/query layer, then set state or throw into a boundary",
      "React Query/SWR surfaces server errors as state — render them, don't crash",
      "Reset keys: boundary resets when route changes",
      "Log with component stack — ask for it in onCaughtError/errorInfo",
    ]
  },

  /* ---------------- 04 · TYPESCRIPT ---------------- */
  {
    id: "ts-1", track: "ts",
    q: "unknown vs any vs never — when is each the right tool?",
    a: "any disables checking (contagious, unsafe) — last resort at boundaries. unknown is 'could be anything, prove it first': you must narrow before use, making it the safe input type (JSON.parse, event payloads). never is the empty type: functions that never return (throw), and it powers exhaustiveness checks in switches.",
    points: [
      "unknown at API/JSON boundaries; narrow with guards",
      "never in the default branch of an exhaustive switch = compile-time safety",
      "any spreads: assigning any to anything silently unsafes the target",
      "Prefer generics over any when writing reusable utilities",
    ],
    code: "type Shape = Circle | Square;\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2;\n    case 'square': return s.side ** 2;\n    default: {\n      const _exhaustive: never = s;\n      return _exhaustive;\n    }\n  }\n}"
  },
  {
    id: "ts-2", track: "ts",
    q: "Show me generics doing real work — constraints, keyof, inference.",
    a: "Generics keep the relationship between input and output types. K extends keyof T constrains a key to actually exist; ReturnType/Pick style mapped types build new shapes. If TS can infer the type parameter from usage, don't write it explicitly — good generics feel invisible.",
    points: [
      "function pick<T, K extends keyof T>(obj: T, keys: K[]) → typed partial",
      "keyof typeof CONFIG gives a literal union of keys",
      "Conditional types (T extends U ? X : Y) for type-level branching",
      "Template literal types for event names like 'on${Capitalize<Domain>}'",
    ],
    code: "function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n  const out = {} as Pick<T, K>;\n  for (const k of keys) out[k] = obj[k];\n  return out;\n}"
  },
  {
    id: "ts-3", track: "ts",
    q: "Which utility types do you actually use weekly?",
    a: "Partial (patch/update payloads), Pick/Omit (narrow API DTOs), Readonly, Record<Keys, Value> (lookup maps), ReturnType/Awaited (pull types from functions/async), Parameters (wrap fns), and satisfies for checking literals without widening. Knowing how to WRITE one (mapped type + key remapping) is what separates senior answers.",
    points: [
      "satisfies: validate a literal against a type AND keep its narrow inferred type",
      "NonNullable<T> cleans (T | null | undefined) from unions",
      "Write Partial<T> = { [K in keyof T]?: T[K] } on the whiteboard if asked",
      "Omit<User, 'password'> for public projections — single source of truth",
    ]
  },
  {
    id: "ts-4", track: "ts",
    q: "How do discriminated unions make UI state bulletproof?",
    a: "Model state as a union with a discriminant tag ('status: idle | loading | success | error'), each variant carrying only the data that exists in that state. Narrowing via switch/if on the tag means TS won't let you read .data while loading or .error while successful — impossible states become unrepresentable.",
    points: [
      "Replaces boolean soup (isLoading && !isError && data?)",
      "Exhaustiveness + never checks catch new variants at compile time",
      "Fetch state = { status: 'idle' | 'loading' | 'success', data? } | { status: 'error', error }",
      "Pairs perfectly with React Query's own status/error models",
    ]
  },
  {
    id: "ts-5", track: "ts",
    q: "readonly and immutability — where does TS help, where does it lie?",
    a: "readonly on properties, Readonly<T>/ReadonlyArray<T>, and as const (deep literal freeze for tuples/config) encode intent and catch accidental mutation at compile time. But it's erased at runtime and shallow in some positions — a readonly array can hold mutable objects. Real immutability needs runtime enforcement (Object.freeze, Immer) or discipline.",
    points: [
      "as const for route tables, status maps, token scales",
      "Readonly props on React components document 'pure render'",
      "readonly is type-level only — no runtime guarantee",
      "NoTypeArguments... keep answers honest: mention the gap before the interviewer does",
    ]
  },
  {
    id: "ts-6", track: "ts",
    q: "Name some TS sharp edges you've been bitten by.",
    a: "Object.keys returns string[] (not keyof T) — needs a helper or cast. Truthiness narrowing doesn't understand .filter(Boolean) — needs a type guard. Arrays aren't tuple-checked; spreads widen literals without as const. And type assertions (as) bypass checks entirely — treat them as documented lies with a comment.",
    points: [
      "filter((x): x is T => x !== null) — predicate over Boolean shortcut",
      "satisfies checks without losing inference — prefer over as",
      "any in third-party .d.ts — wrap boundaries in typed adapters",
      "strict: true + noUncheckedIndexedAccess catches the real-world stuff",
    ]
  },

  /* ---------------- 05 · A11Y & PERFORMANCE ---------------- */
  {
    id: "a11y-1", track: "a11y",
    q: "What are Core Web Vitals, their thresholds, and one fix for each?",
    a: "LCP < 2.5s (largest element paint), INP < 200ms (interaction latency — replaced FID in March 2024), CLS < 0.1 (layout stability). They're field metrics (75th percentile of real users) — lab tools are proxies. Each has a signature fix: LCP → preload hero image + prioritize; INP → break long tasks; CLS → reserve dimensions.",
    points: [
      "LCP: fetchpriority=\"high\", preload, SSR, font-display + size-adjust fallbacks",
      "INP: chunk work (scheduler.yield), avoid layout thrash, trim long JS tasks >50ms",
      "CLS: width/height or aspect-ratio on media, reserve space for skeletons/banners",
      "Measure with CrUX/RUM, not just Lighthouse — real users on real devices",
    ]
  },
  {
    id: "a11y-2", track: "a11y",
    q: "Walk me through focus management for a modal dialog.",
    a: "On open: move focus into the dialog (first focusable or the header), trap Tab within it (cycle first↔last), hide background from AT (aria-modal + inert or aria-hidden on the rest), lock scroll. On close: return focus to the element that triggered. Escape closes. This is the single most-tested a11y flow in UI interviews.",
    points: [
      "Use <dialog> / show() — native focus trap + Esc for free, or inert polyfill",
      "Return focus on close — forgetting it is an instant fail in audits",
      "aria-labelledby pointing at the title; role defaults handled by <dialog>",
      "Nested dialogs need a stack; destroy listeners on unmount",
    ]
  },
  {
    id: "a11y-3", track: "a11y",
    q: "What's the first rule of ARIA, and when DO you need it?",
    a: "Don't use ARIA if a native element does the job — a <button> ships keyboard, focus, and role for free; a div with onClick ships none of it. You need ARIA for composite widgets (combobox, tabs, tree) and to wire semantics that HTML lacks (aria-live for async updates, aria-expanded on disclosure buttons).",
    points: [
      "Native first: button, a, select, dialog, details — restyle, don't rebuild",
      "aria-live=\"polite\" announces toasts/balance updates without stealing focus",
      "No role without behavior: adding role=\"tablist\" commits you to full keyboard support",
      "Test with an actual screen reader (VoiceOver/NVDA), not just axe",
    ]
  },
  {
    id: "a11y-4", track: "a11y",
    q: "How do you make a dense data table (transactions) screen-reader friendly?",
    a: "Real <table> with <th scope>, <caption>, and logical structure so AT can navigate cells↔headers. Sorting = buttons in th with aria-sort. Row actions inside cells need accessible names beyond an icon. For huge tables, keep virtualization accessible: correct row heights, keyboard-scrollable container with proper role.",
    points: [
      "scope=\"col/row\" + caption ('Last 90 days of transactions')",
      "aria-sort on the active th; announce row count changes via live region",
      "Icon-only buttons need aria-label ('View details for account …1234')",
      "Never use tables for layout; never fake tables with divs when semantics matter",
    ]
  },
  {
    id: "a11y-5", track: "a11y",
    q: "A marketing page's LCP is 4s. Diagnose it.",
    a: "Start from field data: is the LCP element the hero image or text? For images: unoptimized format/size, lazy-loading on the hero (a classic self-own), no preload, slow CDN. For text: render-blocking CSS/JS, webfont blocking paint, slow TTFB. Fix in order of impact: TTFB (CDN/caching) → resource priority → render path.",
    points: [
      "Check DevTools Performance + Lighthouse treemap for the actual element",
      "Hero image: preload + fetchpriority=\"high\", AVIF/WebP, sized srcset",
      "Kill render-blocking: critical CSS inline, defer non-critical JS, modulepreload",
      "Fonts: preload woff2, font-display: swap, metric-matched fallback (size-adjust)",
    ]
  },
  {
    id: "a11y-6", track: "a11y",
    q: "Layout shift is spiking on a banking dashboard. What's causing it and how do you fix it?",
    a: "CLS spikes come from content injected without reserved space: async widgets (rates banner, fraud alert), skeletons too short, webfont swap (FOUT), and images/ads without dimensions. Fix: explicit dimensions/aspect-ratio everywhere, reserve exact slot heights for async content, size-adjust font fallbacks, and never insert content above existing content.",
    points: [
      "Skeleton must match final height (or animate its own space, not push others)",
      "font-display: optional eliminates FOUT-caused CLS at cost of late fonts",
      "transform-based animations don't trigger CLS (top/left do)",
      "Measure: Layout Instability API / Web Vitals JS attribution",
    ]
  },
  {
    id: "a11y-7", track: "a11y",
    q: "INP is bad on a huge list page. Options?",
    a: "INP reflects the worst interaction latency — usually a click triggering a massive synchronous re-render/layout. Attacks: break long tasks with scheduler.yield()/setTimeout so input can interleave, virtualize the list, memoize rows, move pure computation to a worker, and use transitions to deprioritize non-urgent updates.",
    points: [
      "Profile the slow interaction: was it input delay, processing, or presentation delay?",
      "React: startTransition/useDeferredValue so typing stays urgent",
      "Virtualization (react-window/virtua) caps DOM size — also helps memory",
      "Yield to paint every ≤50ms of work; batch DOM writes/reads",
    ]
  },
  {
    id: "a11y-8", track: "a11y",
    q: "Design an image strategy for a global site.",
    a: "Ship modern formats (AVIF with WebP/JPEG fallback) via a CDN/resizer, let the browser choose with srcset + sizes for viewport-dependent widths, lazy-load below the fold with decoding=\"async\", and give every image aspect-ratio/dimensions. Above-the-fold heroes get priority hints and preload. Art direction via <picture> media when crops differ.",
    points: [
      "sizes is the hardest part — compute from layout, not guesswork",
      "loading=\"lazy\" on the LCP image is a bug, not an optimization",
      "Blur-up/LQIP placeholders improve perceived perf without CLS",
      "Set caching headers (immutable + content hash) — CDNs do the heavy lifting",
    ]
  },

  /* ---------------- 06 · UI SYSTEM DESIGN ---------------- */
  {
    id: "sys-1", track: "sys",
    q: "Design a component library for a 2,000-engineer org. How does it stay healthy?",
    a: "Layer it: design tokens (color/space/type as primitives → semantic aliases), headless primitives → styled components → composed patterns. Governance beats code: semantic versioning, codemods for breaking changes, a contribution RFC process, docs site with live examples, and adoption metrics. Success = people choosing it, not being forced.",
    points: [
      "Tokens as the contract between design and code (JSON → CSS/JS/Swift via pipeline)",
      "Headless core (behavior/a11y) + skin (branding) — bank brands change, behavior doesn't",
      "Codemods turn v4→v5 from a migration project into a background task",
      "Track adoption; deprecate with console.warn and timelines",
    ]
  },
  {
    id: "sys-2", track: "sys",
    q: "Design a typeahead/autocomplete for account search. What are the hard parts?",
    a: "Input layer: debounce ~200-300ms, min length 2, trim. Network layer: race control — only the latest request may render (AbortController or request-sequence token), plus a small LRU cache. UX layer: full combobox a11y pattern (aria-expanded, aria-activedescendant, ↑↓ navigate, Enter select, Esc dismiss), highlight matches, empty/no-results states, and mobile keyboard handling.",
    points: [
      "Out-of-order responses are THE interview trap — sequence-token your fetches",
      "Keyboard: ↑↓ wrap, Home/End, Esc, Enter; listbox roles + activedescendant",
      "Cache results per prefix; cancel in-flight on unmount",
      "Defer heavy matching with a transition; keep input latency <100ms",
    ]
  },
  {
    id: "sys-3", track: "sys",
    q: "Design a table that renders 100,000 transactions smoothly.",
    a: "Windowing: render only visible rows (~30) in a container of full computed height, update via scroll position (overscan 3-5 rows). Fixed row heights make the math trivial; variable heights need a measurement cache. Add sticky headers, keyboard navigable cells, and let sorting/filtering/paging run against the data layer — never against 100k DOM nodes.",
    points: [
      " scrollTop → startIndex = floor(scrollTop / rowH) — be ready to write this",
      "Overscan hides scroll jitter; absolutely position rows for cheap updates",
      "Sticky header + horizontal scroll + a11y grid roles",
      "Aggregation (totals) computed server-side or in a worker, not in render",
    ]
  },
  {
    id: "sys-4", track: "sys",
    q: "Design the modal system for an app where three dialogs can stack.",
    a: "A modal manager holding a stack: each entry gets focus trap, Esc = pop top only, background inert/aria-hidden, and scroll lock with scrollbar-gutter compensation (no layout jump). Render through a portal to <body> to escape stacking contexts. Consistent API: open(ModalComponent, props) returns a promise resolving on close — call sites stay clean.",
    points: [
      "Stack discipline: only the top modal is interactive; lower ones inert",
      "Focus returns one level per close, not to page top",
      "Scroll lock: overflow:hidden + padding-right = scrollbar width",
      "This site's 'known/again' flow — simple, but same lifecycle thinking",
    ]
  },
  {
    id: "sys-5", track: "sys",
    q: "Design a toast/notification system. What does production-grade mean here?",
    a: "A provider with a queue (cap ~5 visible, overflow stacked), stable ids for dedupe/update-in-place (banking: 'Transfer submitted' twice = one toast, updated), and per-toast timers that PAUSE on hover/focus. A11y: role=\"status\"/aria-live=\"polite\" for info, assertive for errors, never move focus. Position fixed so it never affects layout.",
    points: [
      "Dedupe key + update-in-place is the senior-level detail",
      "Pause timers on hover/focus; dismiss button + auto-dismiss ~5s",
      "Live region announcements must exist in DOM at load (AT quirk)",
      "Persist critical notices (fraud alerts) — don't let them auto-vanish",
    ]
  },
  {
    id: "sys-6", track: "sys",
    q: "Design runtime theming with zero flash of wrong theme.",
    a: "Token pipeline: raw palette → semantic tokens (--surface, --ink) in CSS custom properties; themes are attribute swaps (html[data-theme]) costing one style recalc. Pre-paint inline script reads localStorage/system preference and sets the attribute before CSS applies; color-scheme matches so native UI follows. CSR can inject a blocking script; SSR wants a cookie for server-rendered correctness.",
    points: [
      "Blocking pre-paint snippet (like this site's head script) kills FOUC",
      "Semantic layer means components never know a theme exists",
      "Respect prefers-color-scheme until the user explicitly chooses",
      "Test both themes for contrast — WCAG AA 4.5:1 for body text",
    ]
  },

  /* ---------------- 07 · SOFTWARE ARCHITECTURE ---------------- */
  {
    id: "arch-1", track: "arch",
    q: "Choose a rendering strategy for a bank: marketing site, account dashboard, and a public rates page. Justify each.",
    a: "Reason per page, not per app. Marketing site: SSR/ISR — SEO and TTFB are the goals, content is public. Dashboard: CSR SPA (or streaming SSR shell) — data is per-user and authenticated, so public CDN caching is impossible and SEO is irrelevant; the win is a fast app shell plus a rich client data layer. Public rates page: ISR/SSG with short revalidation — public data, cacheable at the edge, fresh enough.",
    points: [
      "Auth-gated pages can't be publicly cached — SSR's biggest benefit (edge caching) disappears",
      "Streaming SSR decouples TTFB from TTI — shell paints before data resolves",
      "Hydration is a real cost: the page is dead until JS lands — budget for it",
      "Name the deciding axes: audience, freshness budget, SEO, interactivity, caching rules",
    ]
  },
  {
    id: "arch-2", track: "arch",
    q: "Micro-frontends: when do they earn their complexity, and how would you structure one?",
    a: "They earn it when team scale makes a shared repo the bottleneck: dozens of squads needing independent deploys to the same surface (classic big-bank problem). Structure as vertical slices per business domain, composed by a thin platform shell that owns auth, routing, theming, and error tracking. Below ~10 teams, a modular monolith with clean package boundaries ships faster.",
    points: [
      "The driver is org structure (Conway's law), not technology fashion",
      "Share infrastructure, not business code — duplicated deps and design drift are the costs",
      "Module federation shares deps at runtime; watch version-skew and bundle duplication",
      "Cross-cutting consistency lives in the design system + shell contracts, not runtime magic",
      "Have a migration plan: strangler-fig, one domain at a time, behind router flags",
    ]
  },
  {
    id: "arch-3", track: "arch",
    q: "Why does a banking frontend want a BFF (backend-for-frontend) layer?",
    a: "A UI-owned aggregation tier (Node/GraphQL) between the browser and dozens of legacy banking services: it shapes one response per screen instead of five calls, normalizes error semantics, hides credential exchange server-side, and centralizes retries/logging/caching. Cost: one more deployable your team owns. The alternative — browser orchestrating 6 microservices — leaks backend sprawl into the client forever.",
    points: [
      "Frontend teams own it: UI requirements drive its API, not backend convenience",
      "Kills request waterfalls and over-fetching; shields the browser from internal APIs",
      "Token exchange happens here — bank APIs never see the browser directly",
      "Contract-test UI↔BFF (Pact-style) so both sides can deploy independently",
    ]
  },
  {
    id: "arch-4", track: "arch",
    q: "Design the auth architecture for a banking SPA. Where do tokens live?",
    a: "Two defensible shapes: (1) BFF session — OAuth code flow completes server-side, the browser holds only an httpOnly SameSite cookie, tokens never touch JS; (2) pure SPA — authorization code flow with PKCE, access token in memory, refresh token in an httpOnly cookie. Never localStorage. Add step-up re-auth for high-risk actions (transfers), session timeouts, and CSRF defenses on every state-changing route.",
    points: [
      "httpOnly cookies survive XSS that localStorage never will — banking default",
      "PKCE is mandatory for public clients; the implicit flow is dead — say why (token in URL fragment)",
      "Step-up MFA before transfers/payments — regulators and fraud teams expect it",
      "Correlation/session IDs must flow into audit logs on every money-moving call",
    ]
  },
  {
    id: "arch-5", track: "arch",
    q: "Architect a real-time rates/notifications feed. WebSockets, SSE, or polling?",
    a: "Layer the design: transport (SSE for server→client simplicity with auto-reconnect; WebSockets only if the client must send), protocol (typed JSON envelopes with monotonic sequence numbers), and state (snapshot + deltas). Reconnect with exponential backoff + jitter, then resync from a fresh snapshot before reapplying deltas — sequence gaps tell you the stream broke.",
    points: [
      "SSE rides plain HTTP (proxies, load balancers) and reconnects for free",
      "Buffer ticks and render at rAF cadence — never push 50 msgs/sec into React state",
      "Snapshot-on-reconnect + seq-gap detection = correctness under flaky networks",
      "Backpressure: drop stale intermediate ticks, keep the latest — traders care about now",
    ]
  },
  {
    id: "arch-6", track: "arch",
    q: "What resilience patterns belong in a money-moving frontend?",
    a: "Assume every dependency fails: timeouts on all calls, bounded retries with exponential backoff + jitter for idempotent reads, idempotency keys on POSTs so a retry can't double a transfer, and a circuit breaker that fails fast instead of piling up timeouts. Contain blast radius with per-widget error boundaries and degrade to stale-but-labeled data rather than blank screens.",
    points: [
      "Double-submit protection: idempotency key generated at action start, reused on retry",
      "Circuit breaker: closed → open → half-open; protects users from a dying dependency",
      "Stale data with an 'as of 10:42' timestamp beats an empty dashboard",
      "Optimistic UI only with a server-confirmed rollback path",
    ],
    code: "// idempotent submit\nconst key = crypto.randomUUID();\nawait withRetry(() => api.post('/transfers',\n  { payload, 'Idempotency-Key': key },\n  { signal }));"
  },
  {
    id: "arch-7", track: "arch",
    q: "Lay out the caching layers for a banking UI and the policy for each.",
    a: "Five layers, different rules: CDN (hashed public assets — immutable, a year), browser HTTP cache (static shell), app memory cache (React Query — stale-while-revalidate with per-data TTLs), service worker (offline shell, never account data), and request de-duplication (single flight per key). Personal data is the exception: balances/transactions are network-first, never persisted — freshness is a compliance requirement, not a nicety.",
    points: [
      "Account data: no-cache/no-store semantics — a wrong balance in a cache is a bug report",
      "Reference data (branches, FX symbols): stale-while-revalidate for minutes — fast and correct enough",
      "Cache keys must include user context; never share personal data across profiles",
      "Mutation strategy: invalidate linked queries, or revalidate tags server-side",
    ]
  },
  {
    id: "arch-8", track: "arch",
    q: "Design the state architecture for a large trading dashboard.",
    a: "Classify by ownership: server data in a normalized query cache keyed per resource; URL as the shareable state (filters, tab, date range — deep-linkable and restorable); the live feed in a small reducer/ring buffer outside React, synced into components at rAF cadence; ephemeral UI state colocated; every derived metric a memoized selector. One rule above all: exactly one owner per datum.",
    points: [
      "'Who owns this datum' beats 'which state library' — duplication is the root bug",
      "URL state gives shareable, restorable, testable deep links (support and QA love it)",
      "Hot streams live in refs/buffers; React state only sees throttled snapshots",
      "DevTools time-travel on actions = incident forensics for 'what did the user see?'",
    ]
  },
  {
    id: "arch-9", track: "arch",
    q: "Define the frontend testing strategy for an app where money is on the line.",
    a: "Weight the pyramid toward what fails expensively: exhaustive unit tests for pure logic (formatters, reducers, money math — property-based tests catch rounding bugs), behavior-level component tests with Testing Library plus a11y assertions, a handful of E2E tests on golden money paths (login, transfer, statement), visual regression for the design system, and contract tests guarding the UI↔BFF seam. Quarantine flaky tests within days — a red pipeline people ignore is worse than none.",
    points: [
      "Money math (rounding, currency, tax): property-based testing finds real monetary bugs",
      "E2E budget: only critical paths — each one costs minutes and flakes",
      "Contract tests catch BFF drift without full-stack E2E",
      "axe automated in CI + scheduled manual screen-reader passes",
    ]
  },
  {
    id: "arch-10", track: "arch",
    q: "What does a safe CI/CD pipeline look like for a regulated frontend?",
    a: "Every PR: typecheck, lint, unit suite, build with bundle-budget gates, component/E2E smoke, and a preview environment reviewers actually open. Merge produces a semver'd immutable artifact; release is decoupled from deploy via feature flags, rolled out progressively (canary %), with automated rollback when error/vitals monitors trip. In banking: approvals and audit trails on production releases are part of the design, not friction.",
    points: [
      "Bundle budget failures block merge — treat size as a contract",
      "Flags decouple deploy from release; every flag carries an expiry date",
      "Canary + error-rate watch → auto-rollback beats human reaction time",
      "Preview environments make 'review my change' demonstrable, not describable",
    ]
  },
  {
    id: "arch-11", track: "arch",
    q: "How would you know your frontend is broken before users tweet about it?",
    a: "Instrumentation as a first-class feature: RUM web-vitals per page and release, error tracking with source-mapped stack traces tagged by version, structured logs and traces carrying a correlation ID from the browser through BFF to services, and business funnel events (transfer started/failed). Alert on user-facing symptoms — error rate, INP, funnel conversion — with SLOs and error budgets, not on deploy counts.",
    points: [
      "Correlation ID generated at the UI ties one journey across every backend hop",
      "Release-tagged dashboards: compare v4.2 against v4.1 before full rollout",
      "Instrument business funnels — a 500 on '/transfer' is only half the story",
      "Error budget policy: burn it down and feature work pauses — agreed with the EM in advance",
    ]
  },

  /* ---------------- 08 · CITI & BEHAVIORAL ---------------- */
  {
    id: "citi-1", track: "citi",
    q: "Why Citi? Why banking UI instead of a product startup?",
    a: "Anchor on scale + craft + consequence: Citi's front-ends serve millions of users across ~180 countries, in a domain where accessibility, security, and correctness are legal obligations — engineering discipline actually shows up in the product. Add a personal hook (global transaction banking touches real businesses; or you want design-system work at true enterprise scale) and connect to the specific team's charter.",
    points: [
      "Specificity wins: name the platform/team/business area you interviewed for",
      "Regulated domain = higher bar for UI craft (a11y audits, security reviews) — say you like that",
      "Avoid 'stability' alone — pair it with the pace of Citi's digital investment",
      "Have ONE sentence on what you'd want to learn/grow into in 2 years",
    ]
  },
  {
    id: "citi-2", track: "citi",
    q: "How does compliance show up in front-end work at a bank?",
    a: "Everywhere, concretely: WCAG 2.1/2.2 AA is both law (ADA/Section 508/EAA) and bank policy; disclosures and rate displays have presentation rules; user actions need audit trails; data on screen is sensitive (mask account numbers, auto-logout, no sensitive data in logs or localStorage). Good engineers treat these as requirements, not blockers.",
    points: [
      "Accessibility is legally required for banking — audits are routine",
      "PII masking, session timeouts, and no secrets/tokens in client storage",
      "Every screen state may need to be reproducible (audit/compliance review)",
      "Feature flags + approvals for financial-logic changes; versioned releases",
    ]
  },
  {
    id: "citi-3", track: "citi",
    q: "What are the frontend security must-knows for a bank app?",
    a: "XSS: never inject untrusted HTML (dangerouslySetInnerHTML with sanitization at best; Trusted Types as policy), add a CSP. CSRF: token headers on state-changing requests, SameSite cookies. Sessions: short-lived access tokens, secure/httpOnly cookies, no PII in localStorage. And supply chain: lockfile audits, SRI on third-party scripts, dependency review.",
    points: [
      "CSP + Trusted Types kill whole XSS classes — mention both",
      "localStorage is readable by any XSS — treat as hostile storage",
      "Third-party analytics = supply-chain risk: SRI, strict allowlists",
      "Dependency scanning in CI (npm audit/Dependabot) is table stakes",
    ]
  },
  {
    id: "citi-4", track: "citi",
    q: "The app must support older enterprise browsers. How do you ship modern UI?",
    a: "Progressive enhancement + build targeting: browserslist with baseline (ES modules where supported, transpile/differential loading where not), feature detection over UA sniffing, polyfills loaded conditionally (nomodule), and a runtime guard for critical paths. Crucially: new tabs/features can demand modern browsers; existing flows degrade gracefully.",
    points: [
      "browserslist + @babel/preset-env + core-js — one source of truth for targets",
      "Feature-detect (in operator / CSS @supports), never UA-parse",
      "Test matrix: last 2 versions of evergreen + the corporate standard browser",
      "Budget the cost: every polyfill is bytes every legacy user pays",
    ]
  },
  {
    id: "citi-5", track: "citi",
    q: "STAR: Tell me about a production issue you owned end-to-end.",
    a: "Pick one real story with numbers and structure it: Situation (scope/impact, e.g., 'checkout conversions dropping on Safari'), Task (your role — you owned diagnosis), Action (instrumented RUM, bisected, found a polyfill breaking Promise.finally ordering / etc., shipped fix behind flag within hours), Result (metric recovered, added regression test + canary alerting). Close with the systemic lesson.",
    points: [
      "Have TWO of these rehearsed: one frontend perf, one correctness/bug",
      "Include the monitoring/alerting you added — 'it can never surprise us again'",
      "Blameless tone: systems failed, you improved the system",
      "Numbers: error rate %, minutes to detect, users affected",
    ]
  },
  {
    id: "citi-6", track: "citi",
    q: "STAR: Tell me about disagreeing with a designer or product manager.",
    a: "Show data-driven collaboration, not ego. Situation: conflicting directions (e.g., PM wanted a 5-step application form; you argued for progressive disclosure). Task: find truth, not win. Action: prototyped both, pulled drop-off analytics/ usability signals, proposed a compromise with a measurable hypothesis. Result: shipped compromise, metric improved, relationship strengthened — 'disagree on the problem, align on the metric'.",
    points: [
      "Frame as shared goals — you both serve the user",
      "Prototype + data beats opinion in the room",
      "Disagree-and-commit as the fallback shows maturity",
      "Never disparage the other party in the telling",
    ]
  },
  {
    id: "citi-7", track: "citi",
    q: "How do you keep a huge codebase healthy while delivering features?",
    a: "Tie hygiene to delivery: Boy Scout refactors inside features you touch, typed API boundaries, component tests + a11y checks in CI, and a visible tech-debt register with slim time allocation (e.g., 10-15%) agreed with your EM. Architecture decision records so decisions survive team rotation. 'Make the right thing easy' — codemods, generators, lint rules.",
    points: [
      "Quantify: flaky test rate, bundle budget adherence, a11y violation trend",
      "Show you can convince EMs with cost-of-delay framing",
      "Mention strangler-fig for gradual legacy migration",
      "Naming/consistency lowers onboarding cost — cite an example",
    ]
  },
  {
    id: "citi-8", track: "citi",
    q: "What questions should YOU ask at the end?",
    a: "Ask questions that show systems thinking and genuine interest: 'What does the UI testing pyramid look like here?' / 'How do design and engineering share ownership of the design system?' / 'What's the current biggest constraint on shipping — process, tech, or people?' / 'How is accessibility audited — automated, manual, both?' / 'What does success in 6 months look like for this role?'",
    points: [
      "Pick 3 — one team-specific, one technical, one growth",
      "Reference something from the interview itself ('you mentioned migration…')",
      "Never ask anything answered on the careers page",
      "End with logistics only if not already covered",
    ]
  },
  {
    id: "citi-9", track: "citi",
    q: "What are Citi's five core businesses — and where would your UI work sit?",
    a: "Citi runs five core businesses — Services, Markets, Banking, Wealth, and U.S. Consumer Cards (USCC). Each is a reportable segment; after the November 2025 changes, retail banking and Citigold sit inside Wealth, and Cards became a standalone business. UI work spans client-facing platforms (CitiDirect for institutional clients, the Citi Mobile app, wealth dashboards) plus the internal systems the Transformation program modernizes. Know which segment you're interviewing for and name one platform in it.",
    points: [
      "Services = Treasury & Trade Solutions + Securities Services: payments, cash management, trade, custody — the cross-border core",
      "Banking = investment/corporate/commercial (led by Vis Raghavan); record 2025, best M&A year in Citi's history",
      "Wealth = private bank + Citigold (Andy Sieg); USCC = Citi-branded + co-brand cards (Pam Habner)",
      "The five leaders report directly to the CEO — a 2023 simplification that investors track closely",
    ]
  },
  {
    id: "citi-10", track: "citi",
    q: "What is Citi's Transformation, and why should a UI engineer care?",
    a: "It's Citi's multiyear, regulator-driven modernization program, born from the October 2020 OCC/Fed enforcement actions over data governance, risk management and internal controls (the OCC's original order came with a $400M penalty; amended July 2024 with ~$135.6M in combined new penalties for insufficient progress; the OCC removed its amendment in December 2025 as programs reached target state). A UI engineer is not a bystander: the deficiency at the core is data quality — meaning correct, consistent, auditable data on every screen — and Transformation is the budget line funding cloud, AI and platform modernization.",
    points: [
      "Regulators: Federal Reserve (holding co), OCC (Citibank N.A.), CFPB, FDIC",
      "Frame your frontend craft as part of the fix: validation, state correctness, error states, auditability",
      "By 2026 Investor Day: ~90% of programs at/near target state, target 100% — say the current status, not the 2020 story",
      "Safe soundbite: 'Transformation is the bank's number-one priority — modernization of systems and controls.'",
    ]
  }
];

/* Ticker content */
const TICKER = [
  "MICROTASKS DRAIN FIRST ▲", "KEYS ≠ INDEXES ▲", "LCP < 2.5s", "INP < 200ms", "CLS < 0.1",
  "WCAG 2.2 AA MANDATORY", "CSP ARMED", "FOCUS TRAP ENGAGED", "DEBOUNCE 300ms",
  "structuredClone > JSON.parse", "strict: true", "SUSPENSE STREAMING", "ARIA: NATIVE FIRST",
  "min-width: 0", "ABORT IN FLIGHT", "color-scheme: dark", "STICKY NEEDS A PARENT", "YIELD EVERY 50ms",
  "MODULE FEDERATION LIVE", "CIRCUIT BREAKER: HALF-OPEN", "PKCE, NOT IMPLICIT", "IDEMPOTENCY KEYS ARMED",
  "BACKOFF + JITTER", "BFF AGGREGATING", "SNAPSHOT RESYNC", "STALE-WHILE-REVALIDATE"
];

/* Day-of checklist */
const CHECKLIST = {
  "Night before": [
    "Re-read this deck's unknown cards once",
    "Rehearse both STAR stories out loud",
    "Skim Citi's latest digital/banking news (one talking point)",
    "Prepare 3 questions to ask them",
    "Charge everything; test camera, mic, lighting",
  ],
  "Day of": [
    "Glass of water + notepad + printed resume",
    "Quiet room, phone silenced, headphones checked",
    "Open: this site, your STAR notes, the job description",
    "Arrive 5 minutes early; breathe, shoulders down",
    "First answer: slow start, clear structure, smile",
  ]
};

/* 7-day plan */
const PLAN = [
  ["Day 1", "JavaScript core — event loop, closures, async. Code debounce + memoize from memory."],
  ["Day 2", "CSS deep-dive — specificity, stacking contexts, grid/flex drills. Rebuild a card layout blind."],
  ["Day 3", "React — reconciliation, hooks rules, effects. Whiteboard the typeahead design."],
  ["Day 4", "TypeScript + testing — generics drill, discriminated unions, write one component test."],
  ["Day 5", "A11y + performance — vitals thresholds, modal focus flow, LCP/INP fixes."],
  ["Day 6", "Architecture day — rendering strategy, micro-frontends, BFF, resilience, caching, state. Out loud, timed."],
  ["Day 7", "Citi + behavioral — read 'Know the firm' twice, STAR polish, questions for them, full unknown-card review. Rest early."],
];
