(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RECENT_KEY = "zj-teach-recent";
  const HERO = {
    q181: { src: "assets/q181-hero.jpg", alt: "剪紙操場：起跑線、紅綠燈與黃色腳踏車" },
    o076: { src: "assets/o076-hero.jpg", alt: "剪紙城市：高低不同的大樓與滑翔翼" },
    m370: { src: "assets/m370-hero.jpg", alt: "剪紙：數線上的機械鼠與起司" },
    j605: { src: "assets/j605-hero.jpg", alt: "剪紙：成績長條圖的螢幕與蓋章考卷" },
    b964: { src: "assets/b964-hero.jpg", alt: "剪紙：分數長條與蓋章考卷" },
    c290: { src: "assets/c290-hero.jpg", alt: "剪紙：數字從筆記本捲成龍捲風" },
    c294: { src: "assets/c294-hero.jpg", alt: "剪紙：三角尺與量角器" },
    c295: { src: "assets/c295-hero.jpg", alt: "剪紙：四格數字，金色是選到的" },
    c461: { src: "assets/c461-hero.jpg", alt: "剪紙：AND OR XOR 與兩盞燈" },
    e286: { src: "assets/e286-hero.jpg", alt: "剪紙：籃球場與兩塊計分板" },
    f312: { src: "assets/f312-hero.jpg", alt: "剪紙：兩間工廠與紙人員工" },
    g275: { src: "assets/g275-hero.jpg", alt: "剪紙：門框上的紅紙對聯" },
    g595: { src: "assets/g595-hero.jpg", alt: "剪紙：缺了一根的木籬笆" },
    h081: { src: "assets/h081-hero.jpg", alt: "剪紙：上漲的紙行情與金幣" },
    i399: { src: "assets/i399-hero.jpg", alt: "剪紙：三顆骰子與數字牌" },
    k731: { src: "assets/k731-hero.jpg", alt: "剪紙：地圖上轉彎的黃箭頭" },
    m931: { src: "assets/m931-hero.jpg", alt: "剪紙：三張角色卡與金色星星" },
  };

  const els = {
    home: document.getElementById("view-home"),
    lesson: document.getElementById("view-lesson"),
    rail: document.getElementById("rail"),
    stage: document.getElementById("stage"),
    teach: document.getElementById("teach"),
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    lessonTitle: document.getElementById("lesson-title"),
    stepLabel: document.getElementById("step-label"),
    problemLink: document.getElementById("problem-link"),
    pagerPos: document.getElementById("pager-pos"),
    q: document.getElementById("q"),
    findMeta: document.getElementById("find-meta"),
    filters: document.getElementById("filters"),
    method: document.getElementById("method"),
    featured: document.getElementById("featured"),
    recent: document.getElementById("recent"),
    list: document.getElementById("catalog-list"),
    empty: document.getElementById("catalog-empty"),
    brandSub: document.getElementById("brand-sub"),
    headerNote: document.getElementById("header-note"),
  };

  let currentId = null;
  let step = 0;
  let runtime = null;
  let query = "";
  let filter = "all";
  let rowIds = [];

  function lessonFor(id) {
    if (window.Lessons && window.Lessons[id]) return window.Lessons[id];
    const p = window.Catalog.get(id);
    if (p) return window.GenericLesson.from(p);
    if (window.Catalog.isProblemId(id)) return window.GenericLesson.stub(id);
    return null;
  }

  function stopRuntime() {
    if (!runtime) return;
    runtime.onStop.forEach((fn) => {
      try { fn(); } catch (_) {}
    });
    runtime = null;
  }

  function show(view) {
    els.home.classList.toggle("is-on", view === "home");
    els.lesson.classList.toggle("is-on", view === "lesson");
    if (els.headerNote) {
      els.headerNote.hidden = view === "home";
      els.headerNote.textContent = "左右鍵翻頁　空白鍵下一步";
    }
  }

  function parseHash() {
    const raw = (location.hash || "#home").slice(1);
    if (!raw || raw === "home" || raw === "catalog") return { view: "home" };
    const parts = raw.split("/");
    const head = (parts[0] || "").toLowerCase();
    if (head === "find") {
      return { view: "home", q: decodeURIComponent(parts.slice(1).join("/") || ""), resetFilter: true };
    }
    const lesson = lessonFor(head);
    if (lesson) {
      return { view: "lesson", id: head, step: Math.max(0, (+parts[1] || 1) - 1) };
    }
    return { view: "home", q: decodeURIComponent(raw) };
  }

  function go(id, s) {
    location.hash = s == null ? id : `${id}/${s + 1}`;
  }

  function readRecent() {
    try {
      const v = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      return Array.isArray(v) ? v.map(String) : [];
    } catch {
      return [];
    }
  }

  function pushRecent(id) {
    const ids = readRecent().filter((x) => x !== id);
    ids.unshift(id);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, 8))); } catch (_) {}
  }

  function mark(text, toks) {
    const esc = window.PyTeach.esc;
    const src = String(text ?? "");
    if (!toks.length) return esc(src);
    const re = new RegExp("(" + toks.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
    let out = "";
    let last = 0;
    src.replace(re, (m, _g, i) => {
      out += esc(src.slice(last, i)) + "<mark>" + esc(m) + "</mark>";
      last = i + m.length;
      return m;
    });
    out += esc(src.slice(last));
    return out;
  }

  function renderFilters() {
    els.filters.innerHTML = window.Catalog.FILTERS.map((f) =>
      `<button type="button" class="filter" data-filter="${f.id}" aria-pressed="${f.id === filter ? "true" : "false"}">${window.PyTeach.esc(f.label)}</button>`
    ).join("");
  }

  function featuredProblems() {
    const order = ["q181", "o076", "m370", "j605"];
    const have = [];
    const seen = new Set();
    order.forEach((id) => {
      if (!window.Catalog.illustrated(id) || seen.has(id)) return;
      seen.add(id);
      have.push(window.Catalog.get(id) || { id, title: window.Lessons[id].title, tags: ["圖解"] });
    });
    window.Catalog.PROBLEMS.forEach((p) => {
      if (p.unit === "how") return;
      if (window.Catalog.illustrated(p.id) && !seen.has(p.id)) {
        seen.add(p.id);
        have.push(p);
      }
    });
    if (window.Lessons) {
      Object.keys(window.Lessons).forEach((id) => {
        if (seen.has(id)) return;
        const meta = window.Catalog.get(id);
        if (meta && meta.unit === "how") return;
        const L = window.Lessons[id];
        have.push({ id, title: L.title, blurb: "", tags: ["圖解"] });
      });
    }
    return have;
  }

  function renderFeatured(matches) {
    const toks = window.Catalog.tokensOf(query);
    let items = featuredProblems();
    if (query.trim()) {
      els.featured.hidden = true;
      els.featured.innerHTML = "";
      return;
    }
    if (filter !== "all" && filter !== "illustrated") {
      const allow = new Set(matches.map((p) => p.id));
      items = items.filter((p) => allow.has(p.id));
    }
    if (!items.length) {
      els.featured.hidden = true;
      els.featured.innerHTML = "";
      return;
    }
    els.featured.hidden = false;
    els.featured.innerHTML = `<h2 class="block-title">圖解課</h2>
      <div class="stamps">${items.map((p) => {
        const hero = HERO[p.id];
        const img = hero
          ? `<img src="${hero.src}" width="480" height="360" alt="${window.PyTeach.esc(hero.alt)}" />`
          : `<div class="stamp-fallback">${window.PyTeach.esc(p.id)}</div>`;
        return `<a class="stamp" href="#${p.id}/1">
          <div class="stamp-art">${img}</div>
          <div class="stamp-copy">
            <small>${window.PyTeach.esc(p.id)} · 圖解</small>
            <strong>${mark(p.title, toks)}</strong>
          </div>
        </a>`;
      }).join("")}</div>`;
  }

  function renderRecent() {
    if (query.trim() || filter !== "all") {
      els.recent.hidden = true;
      els.recent.innerHTML = "";
      return;
    }
    const ids = readRecent().filter((id) => window.Catalog.get(id) || (window.Lessons && window.Lessons[id]));
    if (!ids.length) {
      els.recent.hidden = true;
      els.recent.innerHTML = "";
      return;
    }
    els.recent.hidden = false;
    els.recent.innerHTML = `<h2 class="block-title">最近打開</h2>
      <div class="recent-row">${ids.map((id) => {
        const p = window.Catalog.get(id);
        const title = p ? p.title : (window.Lessons[id] && window.Lessons[id].title) || id;
        const flag = window.Catalog.illustrated(id) ? `<span class="pill">圖解</span>` : "";
        return `<a class="recent-link" href="#${id}/1"><code>${window.PyTeach.esc(id)}</code> ${window.PyTeach.esc(title)} ${flag}</a>`;
      }).join("")}</div>`;
  }

  function rowHtml(p, toks) {
    const illus = window.Catalog.illustrated(p.id);
    const tags = (p.tags || []).slice(0, 3).map((t) => mark(t, toks)).join(" · ");
    return `<a class="toc-row" href="#${p.id}/1" data-id="${p.id}" role="option">
      <code>${mark(p.id, toks)}</code>
      <span class="toc-title">${mark(p.title, toks)}</span>
      <span class="toc-tags">${tags}</span>
      ${illus ? `<span class="pill">圖解</span>` : ""}
    </a>`;
  }

  function renderList(matches) {
    const toks = window.Catalog.tokensOf(query);
    rowIds = matches.map((p) => p.id);
    const qTrim = query.trim();
    const unknownId = window.Catalog.isProblemId(qTrim) && !window.Catalog.get(qTrim.toLowerCase());

    if (!matches.length) {
      els.list.innerHTML = "";
      els.empty.hidden = false;
      if (unknownId) {
        const id = qTrim.toLowerCase();
        els.empty.innerHTML = `<strong>題本裡還沒有 ${window.PyTeach.esc(id)}</strong>
          <p>可以先看原題，或用同一套步驟把它走一遍。</p>
          <p class="empty-actions">
            <a class="solid" href="#${id}/1">開始這題</a>
            <a class="ghost" href="https://zerojudge.tw/ShowProblem?problemid=${encodeURIComponent(id)}" rel="noopener" target="_blank">原題</a>
          </p>`;
      } else {
        els.empty.innerHTML = `<strong>沒有符合的題</strong>
          <p>試試題號 <code>q181</code>、題名「紅綠燈」，或「餘數」「APCS」。</p>`;
      }
      return;
    }

    els.empty.hidden = true;
    els.empty.innerHTML = "";
    const groups = qTrim ? [{ unit: { name: "搜尋結果", hint: "" }, items: matches }] : window.Catalog.grouped(matches);
    const html = groups.map((g) => {
      const hint = g.unit.hint ? `<span class="unit-hint">${window.PyTeach.esc(g.unit.hint)}</span>` : "";
      return `<section class="toc-unit">
        <h2 class="unit-head">${window.PyTeach.esc(g.unit.name)} <span>${g.items.length}</span> ${hint}</h2>
        <div class="toc-rows" role="listbox">${g.items.map((p) => rowHtml(p, toks)).join("")}</div>
      </section>`;
    }).join("");
    els.list.innerHTML = html;
  }

  function renderMethod() {
    if (!els.method) return;
    if (query.trim() || (filter !== "all" && filter !== "how")) {
      els.method.hidden = true;
      els.method.innerHTML = "";
      return;
    }
    els.method.hidden = false;
    els.method.innerHTML = `<a class="method-banner" href="#how/1">
      <div>
        <small>先上這一課</small>
        <strong>怎麼把題目寫成 Python</strong>
        <p>圈出題目給什麼、要什麼。收成一句人話。用手對範例。再一行一行寫下來。</p>
      </div>
      <span class="go">開始第一課</span>
    </a>`;
  }

  function renderCatalog() {
    if (els.q && els.q.value !== query) els.q.value = query;
    const matches = window.Catalog.search(query, filter);
    const total = window.Catalog.size;
    const illus = featuredProblems().length;
    if (!query.trim() && filter === "all") {
      els.findMeta.textContent = `目錄 ${total} 題 · ${illus} 題有圖解`;
    } else {
      els.findMeta.textContent = `找到 ${matches.length} 題（共 ${total}）`;
    }
    if (els.brandSub) els.brandSub.textContent = `題本 · ${total} 題`;
    renderMethod();
    renderFeatured(matches);
    renderRecent();
    renderList(matches);
    els.filters.querySelectorAll(".filter").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.filter === filter ? "true" : "false");
    });
  }

  function renderRail(lesson) {
    const text = window.PyTeach.text;
    els.rail.innerHTML =
      `<p class="rail-id">${text(lesson.problem)}</p>` +
      `<p class="rail-label">${text(lesson.title)}</p>` +
      lesson.steps.map((st, i) =>
        `<button type="button" data-step="${i}" ${i === step ? 'aria-current="step"' : ""}><span class="rail-n">${i + 1}</span>${text(st.title)}</button>`
      ).join("");
    els.rail.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => go(lesson.id, +btn.dataset.step);
    });
  }

  function renderLesson() {
    const lesson = lessonFor(currentId);
    if (!lesson) {
      show("home");
      return;
    }
    show("lesson");
    pushRecent(lesson.id);
    step = Math.min(Math.max(0, step), lesson.steps.length - 1);
    const st = lesson.steps[step];
    els.lessonTitle.textContent = lesson.title;
    const pos = `${step + 1} / ${lesson.steps.length}`;
    els.stepLabel.textContent = pos;
    if (els.pagerPos) els.pagerPos.textContent = pos;
    if (els.brandSub) els.brandSub.textContent = lesson.problem;
    els.problemLink.href = lesson.url;
    els.problemLink.textContent = lesson.linkLabel || `原題 ${lesson.problem}`;
    els.teach.innerHTML = `<h2 id="step-heading">${window.PyTeach.text(st.title)}</h2>${st.teach}`;
    els.prev.disabled = step === 0;
    els.next.textContent = step === lesson.steps.length - 1 ? (lesson.nextLabel || "回到目錄") : "下一步";
    renderRail(lesson);
    stopRuntime();
    els.stage.innerHTML = "";
    runtime = { reduced, onStop: [] };
    lesson.mount(els.stage, step, runtime);
    const heading = document.getElementById("step-heading");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      try { heading.focus({ preventScroll: true, focusVisible: false }); }
      catch (_) { heading.focus({ preventScroll: true }); }
    }
  }

  function render() {
    const state = parseHash();
    if (state.view === "home") {
      stopRuntime();
      currentId = null;
      if (state.q != null) query = state.q;
      if (state.resetFilter) filter = "all";
      show("home");
      renderCatalog();
      return;
    }
    currentId = state.id;
    step = state.step;
    renderLesson();
  }

  els.prev.onclick = () => {
    if (step > 0) go(currentId, step - 1);
  };
  els.next.onclick = () => {
    const lesson = lessonFor(currentId);
    if (!lesson) return;
    if (step >= lesson.steps.length - 1) location.hash = lesson.next ? `${lesson.next}/1` : "home";
    else go(currentId, step + 1);
  };

  els.filters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    filter = btn.dataset.filter;
    renderCatalog();
    els.q.focus();
  });

  let tQ = 0;
  els.q.addEventListener("input", () => {
    query = els.q.value;
    window.clearTimeout(tQ);
    tQ = window.setTimeout(renderCatalog, 40);
  });

  els.q.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = rowIds[0];
      const qTrim = query.trim();
      if (first) go(first, 0);
      else if (window.Catalog.isProblemId(qTrim)) go(qTrim.toLowerCase(), 0);
    } else if (e.key === "ArrowDown") {
      const row = els.list.querySelector(".toc-row");
      if (row) {
        e.preventDefault();
        row.focus();
      }
    } else if (e.key === "Escape") {
      if (query) {
        query = "";
        els.q.value = "";
        renderCatalog();
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !e.target.matches("input, textarea, button")) {
      e.preventDefault();
      if (!currentId) {
        els.q.focus();
        els.q.select();
      } else {
        location.hash = "home";
        requestAnimationFrame(() => { els.q.focus(); els.q.select(); });
      }
      return;
    }
    if (e.target.matches("input, textarea")) return;
    if (!currentId) return;
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      els.next.click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      els.prev.click();
    }
  });

  window.addEventListener("hashchange", render);
  renderFilters();
  render();
})();
