/* ============================================================
   ARC/PREP — app logic
   Deck engine, theme toggle, persistence. No dependencies.
   ============================================================ */
(() => {
  "use strict";

  const KEY = "arcprep-v1";
  const $ = (sel) => document.querySelector(sel);

  /* ---------------- state ---------------- */
  const blank = () => ({
    theme: null,
    known: {},
    unknown: {},
    checks: {},
    stars: {},
    hidden: {},
    track: "ng",
    reviewOnly: false,
    shuffled: false,
  });

  let state;
  try {
    state = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    state = blank();
  }
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
  };

  /* ---------------- optional GitHub Gist sync ----------------
     GitHub Pages cannot safely hold a server-side token. The user supplies
     a fine-grained token with Gists permission; it is kept only in this
     browser, while the private Gist contains study state only. */
  const GIST_CONFIG = "arcprep-gist-v1";
  const gistConfig = (() => {
    try { return JSON.parse(localStorage.getItem(GIST_CONFIG) || "{}"); } catch { return {}; }
  })();
  const gistToken = $("#gistToken");
  const gistId = $("#gistId");
  const syncStatus = $("#syncStatus");
  const setSyncStatus = (text) => { if (syncStatus) syncStatus.textContent = text; };
  if (gistToken) gistToken.value = gistConfig.token || "";
  if (gistId) gistId.value = gistConfig.id || "";

  function rememberGistConfig() {
    const id = (gistId.value || "").trim().replace(/^.*\\/g, "");
    gistId.value = id;
    localStorage.setItem(GIST_CONFIG, JSON.stringify({ token: gistToken.value.trim(), id }));
    return { token: gistToken.value.trim(), id };
  }

  async function gistRequest(method, id, token, body) {
    const response = await fetch(`https://api.github.com/gists${id ? `/${id}` : ""}`, {
      method,
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  async function pushToGist() {
    const { token, id } = rememberGistConfig();
    if (!token) { setSyncStatus("Enter a GitHub token first"); gistToken.focus(); return; }
    setSyncStatus("Saving…");
    try {
      const body = { description: "ARC/PREP private study progress", public: false,
        files: { "arcprep-state.json": { content: JSON.stringify(state, null, 2) } } };
      const result = await gistRequest(id ? "PATCH" : "POST", id, token, body);
      gistId.value = result.id;
      localStorage.setItem(GIST_CONFIG, JSON.stringify({ token, id: result.id }));
      setSyncStatus(`Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
    } catch (error) { setSyncStatus(`Save failed: ${error.message}`); }
  }

  async function pullFromGist() {
    const { token, id } = rememberGistConfig();
    if (!token || !id) { setSyncStatus("Enter both token and Gist ID"); return; }
    if (!confirm("Replace this device's local progress with the Gist copy?")) return;
    setSyncStatus("Loading…");
    try {
      const result = await gistRequest("GET", id, token);
      const file = result.files?.["arcprep-state.json"];
      if (!file) throw new Error("arcprep-state.json not found");
      const remote = JSON.parse(file.content);
      localStorage.setItem(KEY, JSON.stringify({ ...blank(), ...remote }));
      setSyncStatus("Loaded — refreshing");
      location.reload();
    } catch (error) { setSyncStatus(`Load failed: ${error.message}`); }
  }
  $("#syncPush")?.addEventListener("click", pushToGist);
  $("#syncPull")?.addEventListener("click", pullFromGist);

  /* ---------------- theme ---------------- */
  const themeToggle = $("#themeToggle");

  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0a1420" : "#f4f0e8");
  }
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    state.theme = next;
    applyTheme(next);
    save();
  });
  if (!state.theme) {
    // No explicit choice yet: follow the system live
    const mq = matchMedia("(prefers-color-scheme: light)");
    const follow = (e) => {
      if (state.theme) { mq.removeEventListener("change", follow); return; }
      applyTheme(e.matches ? "light" : "dark");
    };
    mq.addEventListener("change", follow);
  }

  /* ---------------- ticker ---------------- */
  const tickerTrack = $("#tickerTrack");
  const tickerHTML = TICKER.map((t) => `<span>${t}</span>`).join("");
  tickerTrack.innerHTML = tickerHTML + tickerHTML; // seamless loop

  /* ---------------- tabs ---------------- */
  const tablist = $("#tablist");
  TRACKS.forEach((tr) => {
    const b = document.createElement("button");
    b.className = "tab";
    b.setAttribute("role", "tab");
    b.dataset.track = tr.id;
    b.innerHTML = `<span class="t-num">${tr.num}</span><span class="t-lab">${tr.label}</span><span class="t-count"></span>`;
    b.addEventListener("click", () => selectTrack(tr.id));
    tablist.appendChild(b);
  });
  tablist.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = [...tablist.querySelectorAll("[role=tab]")];
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    selectTrack(next.dataset.track);
  });

  /* ---------------- deck engine ---------------- */
  let track = TRACKS.some((t) => t.id === state.track) ? state.track : TRACKS[0].id;
  let queue = [];
  let index = 0;
  let revealed = false;
  let shuffledOrder = null; // id order when shuffle is on

  const els = {
    tag: $("#cardTag"), count: $("#cardCount"), q: $("#cardQ"),
    a: $("#cardA"), reveal: $("#revealBtn"), prev: $("#prevBtn"), next: $("#nextBtn"),
    know: $("#knowBtn"), again: $("#againBtn"),
    dpKnown: $("#dpKnown"), dpUnknown: $("#dpUnknown"),
    note: $("#deckNote"), live: $("#liveStatus"),
  };

  const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
  const baseQueue = () => QUESTIONS.filter((q) => q.track === track);

  function buildQueue() {
    let ids = baseQueue().map((q) => q.id);
    if (shuffledOrder && shuffledOrder.track === track) {
      ids = ids.slice().sort((a, b) => shuffledOrder.order.indexOf(a) - shuffledOrder.order.indexOf(b));
    }
    if (state.reviewOnly) ids = ids.filter((id) => !state.known[id]);
    return ids;
  }

  function status(id) {
    if (state.known[id]) return "known";
    if (state.unknown[id]) return "unknown";
    return "unseen";
  }

  function setStatus(id, st) {
    delete state.known[id];
    delete state.unknown[id];
    if (st) state[st][id] = true;
    save();
  }

  function selectTrack(id) {
    track = id;
    state.track = id;
    shuffledOrder = null;
    index = 0;
    save();
    renderTabs();
    renderDeck();
  }

  function renderTabs() {
    tablist.querySelectorAll("[role=tab]").forEach((b) => {
      const sel = b.dataset.track === track;
      b.setAttribute("aria-selected", String(sel));
      b.tabIndex = sel ? 0 : -1;
      const total = QUESTIONS.filter((q) => q.track === b.dataset.track).length;
      const known = QUESTIONS.filter((q) => q.track === b.dataset.track && state.known[q.id]).length;
      b.querySelector(".t-count").textContent = `${known}/${total}`;
    });
  }

  function renderCard() {
    const tr = TRACKS.find((t) => t.id === track);
    if (!queue.length) {
      els.tag.textContent = tr.label;
      els.count.textContent = "00 / 00";
      els.q.textContent = state.reviewOnly
        ? "Nothing left here — every card in this track is marked known."
        : "No cards in this track.";
      els.a.hidden = true;
      els.a.innerHTML = "";
      els.reveal.hidden = true;
      els.know.disabled = els.again.disabled = els.prev.disabled = els.next.disabled = true;
      return;
    }
    index = Math.min(index, queue.length - 1);
    const q = byId.get(queue[index]);
    revealed = false;

    els.tag.textContent = `${tr.num} · ${tr.label}`;
    els.count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(queue.length).padStart(2, "0")}`;
    els.q.textContent = q.q;
    els.reveal.hidden = false;
    els.reveal.textContent = "Reveal answer";
    els.reveal.setAttribute("aria-expanded", "false");
    els.a.hidden = true;
    els.a.innerHTML = "";
    els.know.disabled = els.again.disabled = els.prev.disabled = els.next.disabled = false;

    const st = status(q.id);
    els.know.setAttribute("aria-pressed", String(st === "known"));
    els.again.setAttribute("aria-pressed", String(st === "unknown"));
    renderProgress();
  }

  function answerHTML(q) {
    const points = q.points.map((p) => `<li>${p}</li>`).join("");
    const code = q.code ? `<pre><code>${escapeHTML(q.code)}</code></pre>` : "";
    return `
      <div class="model"><span class="lab">Model answer</span>${q.a}</div>
      <p class="a-lab">Key points</p>
      <ul class="points">${points}</ul>
      ${code}`;
  }
  const escapeHTML = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function reveal() {
    if (revealed || !queue.length) return;
    const q = byId.get(queue[index]);
    els.a.innerHTML = answerHTML(q);
    els.a.hidden = false;
    revealed = true;
    els.reveal.textContent = "Hide answer";
    els.reveal.setAttribute("aria-expanded", "true");
    announce(`Answer revealed: ${q.q}`);
  }

  function move(delta) {
    if (!queue.length) return;
    const next = index + delta;
    if (next < 0 || next >= queue.length) return;
    index = next;
    renderCard();
  }

  function mark(st) {
    if (!queue.length) return;
    const id = queue[index];
    const current = status(id);
    setStatus(id, current === st ? null : st);
    els.know.setAttribute("aria-pressed", String(status(id) === "known"));
    els.again.setAttribute("aria-pressed", String(status(id) === "unknown"));
    renderTabs();
    updateHero();
    renderProgress();
    if (state.reviewOnly) {
      queue = buildQueue();
      index = Math.min(index, Math.max(queue.length - 1, 0));
    }
    renderCard();
  }

  function renderProgress() {
    const total = baseQueue().length;
    const known = baseQueue().filter((q) => state.known[q.id]).length;
    const unknown = baseQueue().filter((q) => state.unknown[q.id]).length;
    els.dpKnown.style.width = `${(known / total) * 100}%`;
    els.dpUnknown.style.width = `${(unknown / total) * 100}%`;
    els.note.textContent = `${known}/${total} known in ${TRACKS.find((t) => t.id === track).label.toLowerCase()}`;
  }

  function renderDeck() {
    queue = buildQueue();
    index = Math.min(index, Math.max(queue.length - 1, 0));
    renderCard();
    renderTabs();
  }

  const announce = (msg) => { els.live.textContent = msg; };

  /* ---------------- hero stats & arc ---------------- */
  const arcFill = $("#arcFill"), arcRed = $("#arcRed");
  const arcPct = $("#arcPct"), statCards = $("#statCards"), statKnown = $("#statKnown"), statLeft = $("#statLeft");

  function updateHero() {
    const total = QUESTIONS.length;
    const known = Object.keys(state.known).filter((id) => byId.has(id)).length;
    const unknown = Object.keys(state.unknown).filter((id) => byId.has(id)).length;
    const pct = Math.round((known / total) * 100);

    statCards.textContent = String(total).padStart(2, "0");
    statKnown.textContent = String(known).padStart(2, "0");
    statLeft.textContent = String(total - known).padStart(2, "0");
    arcPct.textContent = `${pct}%`;

    // azure = known, red = marked-unknown, rest = line
    arcFill.setAttribute("style", `stroke-dasharray: ${pct} 100`);
    const unknownPct = Math.round((unknown / total) * 100);
    arcRed.setAttribute("style", `stroke-dasharray: 0 0; stroke-dashoffset: 0`);
    if (unknownPct > 0) {
      arcRed.setAttribute("style", `stroke-dasharray: ${unknownPct} 100; stroke-dashoffset: ${-pct}`);
    }
  }

  /* ---------------- controls ---------------- */
  els.reveal.addEventListener("click", () => {
    if (revealed) {
      els.a.hidden = true;
      els.a.innerHTML = "";
      revealed = false;
      els.reveal.textContent = "Reveal answer";
      els.reveal.setAttribute("aria-expanded", "false");
    } else reveal();
  });
  els.prev.addEventListener("click", () => move(-1));
  els.next.addEventListener("click", () => move(1));
  els.know.addEventListener("click", () => mark("known"));
  els.again.addEventListener("click", () => mark("unknown"));

  $("#reviewToggle").addEventListener("click", (e) => {
    state.reviewOnly = !state.reviewOnly;
    e.currentTarget.setAttribute("aria-pressed", String(state.reviewOnly));
    index = 0;
    save();
    renderDeck();
  });
  $("#shuffleBtn").addEventListener("click", (e) => {
    const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
    e.currentTarget.setAttribute("aria-pressed", String(on));
    if (on) {
      const ids = queue.slice();
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      shuffledOrder = { track, order: ids };
      queue = ids;
      index = 0;
      renderCard();
    } else {
      shuffledOrder = null;
      index = 0;
      renderDeck();
    }
  });
  $("#jumpUnknown").addEventListener("click", () => {
    const first = baseQueue().findIndex((q) => status(q.id) !== "known");
    if (first < 0) { announce("Every card in this track is marked known."); return; }
    const qi = queue.indexOf(baseQueue()[first].id);
    if (qi >= 0) { index = qi; renderCard(); }
  });
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Clear all progress on this site?")) return;
    state.known = {};
    state.unknown = {};
    state.checks = {};
    save();
    renderTabs();
    renderDeck();
    updateHero();
    document.querySelectorAll("#plan .check-card input").forEach((c) => (c.checked = false));
  });

  /* keyboard */
  const deckEl = $("#deck");
  const deckInView = () => {
    const r = deckEl.getBoundingClientRect();
    return r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.25;
  };
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t && (t.matches("input, textarea, select") || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === " " || e.key === "Enter") {
      if (!deckInView() || (t && t.closest("button, a"))) return;
      e.preventDefault();
      if (revealed) {
        els.a.hidden = true;
        els.a.innerHTML = "";
        els.reveal.textContent = "Reveal answer";
        els.reveal.setAttribute("aria-expanded", "false");
      } else reveal();
    } else if (e.key === "ArrowRight") {
      if (!deckInView()) return;
      e.preventDefault(); move(1);
    } else if (e.key === "ArrowLeft") {
      if (!deckInView()) return;
      e.preventDefault(); move(-1);
    } else if (e.key === "k" || e.key === "K") { if (deckInView()) mark("known"); }
    else if (e.key === "u" || e.key === "U") { if (deckInView()) mark("unknown"); }
  });

  /* ---------------- checklist ---------------- */
  const checkDefs = [
    ["checkNight", "Night before", CHECKLIST["Night before"]],
    ["checkDay", "Day of", CHECKLIST["Day of"]],
  ];
  checkDefs.forEach(([mount, title, items]) => {
    const box = document.getElementById(mount);
    items.forEach((item, i) => {
      const id = `${mount}-${i}`;
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(state.checks[id]);
      input.addEventListener("change", () => {
        if (input.checked) state.checks[id] = true;
        else delete state.checks[id];
        save();
      });
      const span = document.createElement("span");
      span.textContent = item;
      label.append(input, span);
      box.appendChild(label);
    });
  });

  /* ---------------- plan ---------------- */
  $("#planList").innerHTML = PLAN.map(
    ([day, txt]) => `<li><span class="plan-day">${day}</span><span class="plan-txt">${txt}</span></li>`
  ).join("");

  /* ---------------- STAR autosave ---------------- */
  ["star1", "star2", "star3"].forEach((id) => {
    const ta = document.getElementById(id);
    ta.value = state.stars[id] || "";
    let t;
    ta.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.stars[id] = ta.value;
        save();
      }, 350);
    });
  });

  /* ---------------- section visibility ---------------- */
  if (!state.hidden || typeof state.hidden !== "object") state.hidden = {};
  const HIDEABLE = ["role", "star", "reference", "plan", "firm", "sources"];

  function applyHidden() {
    HIDEABLE.forEach((id) => {
      const sec = document.getElementById(id);
      const isHidden = Boolean(state.hidden[id]);
      if (sec) sec.classList.toggle("is-hidden", isHidden);
      document.querySelectorAll(`[data-section-toggle="${id}"]`).forEach((btn) => {
        btn.setAttribute("aria-pressed", String(!isHidden));
        btn.textContent = btn.textContent.replace(/^Show |^Hide /, "");
        if (isHidden) btn.textContent = `Show ${btn.textContent}`;
      });
    });
  }

  function setHidden(id, hide) {
    if (!HIDEABLE.includes(id)) return;
    if (hide) state.hidden[id] = true;
    else delete state.hidden[id];
    save();
    applyHidden();
  }

  document.querySelectorAll("[data-hide-section]").forEach((btn) => {
    btn.addEventListener("click", () => setHidden(btn.dataset.hideSection, true));
  });
  document.querySelectorAll("[data-section-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.sectionToggle;
      setHidden(id, !state.hidden[id]);
    });
  });
  $("#showAllSections")?.addEventListener("click", () => {
    state.hidden = {};
    save();
    applyHidden();
  });
  // Navigating to a hidden section unhides it first
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("href").slice(1);
      if (state.hidden[id]) setHidden(id, false);
    });
  });

  /* ---------------- boot ---------------- */
  applyTheme(document.documentElement.dataset.theme || "dark");
  $("#reviewToggle").setAttribute("aria-pressed", String(state.reviewOnly));
  applyHidden();
  renderTabs();
  renderDeck();
  updateHero();
})();
