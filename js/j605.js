(function () {
  const SAMPLE1 = [
    { t: 3, s: 89 },
    { t: 5, s: -1 },
    { t: 10, s: 90 },
    { t: 15, s: 0 },
    { t: 20, s: 90 },
  ];
  const SAMPLE2 = [
    { t: 3, s: 0 },
    { t: 5, s: -1 },
    { t: 6, s: -1 },
  ];

  const steps = [
    {
      id: "story",
      title: "程式考試怎麼計分",
      teach: `
        <p>這題在模擬一次程式考試。你可以交很多次，每次留下兩個數字：<strong>時間 t</strong> 和<strong>分數 s</strong>。</p>
        <p>最後的成績不是把每次分數加起來，而是：</p>
        <ul>
          <li>只看提交紀錄裡的<strong>最高分</strong></li>
          <li>再扣掉「交了幾次」</li>
          <li>嚴重錯誤還要再多扣</li>
        </ul>
        <p>另外要輸出：最高分<strong>第一次</strong>出現的時間。</p>
      `,
    },
    {
      id: "record",
      title: "每一筆是時間加分數",
      teach: `
        <p>範例一共交 5 次。時間保證越來越大，不會打亂。</p>
        <p>下面每一根柱子是一次提交。高度是分數。把滑鼠想像成評審：從左看到右。</p>
      `,
    },
    {
      id: "error",
      title: "−1 是嚴重錯誤，不是負分最高",
      teach: `
        <p>分數寫 <code>-1</code> 代表這次編譯或執行爆掉，叫做嚴重錯誤。</p>
        <p>它<strong>不會</strong>拿來當最高分（題目保證第一筆不是 −1，後面的 −1 也比真正的分數小）。但它會被拿去罰款。</p>
        <p>按播放，看紅色那筆被標成「錯」，不算進最高分。</p>
      `,
    },
    {
      id: "best",
      title: "最高分要記第一次",
      teach: `
        <p>範例一有兩次 90：時間 10 和時間 20。題目要的是<strong>第一次</strong>拿到最高分的時間，所以是 10，不是 20。</p>
        <p>寫程式時用「嚴格大於」：<code>if s &gt; best</code>。相等就不要改時間，這樣會自然留下第一次。</p>
      `,
    },
    {
      id: "formula",
      title: "公式：最高分 − 次數 − 2×錯誤",
      teach: `
        <p>總分 = 最高分 − 總提交次數 − 嚴重錯誤次數 × 2。</p>
        <p>範例一：最高 90，交了 5 次，錯 1 次。</p>
        <p>90 − 5 − 2 = <strong>83</strong>。</p>
        <p>為什麼扣提交次數？鼓勵少交、一次寫對。錯一次再多扣 2 分。</p>
      `,
    },
    {
      id: "floor",
      title: "算出來是負的，就記 0",
      teach: `
        <p>範例二：最高分 0，交 3 次，錯 2 次。</p>
        <p>0 − 3 − 4 = −7。成績不能是負的，輸出 <strong>0</strong>。</p>
        <p>最高分第一次在時間 3。所以答案是 <code>0 3</code>。</p>
      `,
    },
    {
      id: "sample1",
      title: "把範例一逐步對一次",
      teach: `
        <p>輸入：</p>
        <pre class="eq">5
3 89
5 -1
10 90
15 0
20 90</pre>
        <p>按「下一筆」從左看到右：更新最高分、累計錯誤，最後套公式。</p>
      `,
    },
    {
      id: "sample2",
      title: "範例二會扣到 0",
      teach: `
        <p>輸入：</p>
        <pre class="eq">3
3 0
5 -1
6 -1</pre>
        <p>最高分是第一筆的 0。扣完變成負數，輸出 0，時間仍是 3。</p>
      `,
    },
    {
      id: "pyin",
      title: "先讀 k，再讀 k 行",
      teach: `
        <p>這題的輸入跟前面幾題不一樣：不是一行塞完所有數字。</p>
        <p>第一行只有次數 k。接下來<strong>有 k 行</strong>，每一行兩個數：時間、分數。</p>
        <p>所以先 <code>k = int(input())</code>，再用 <code>for i in range(k)</code> 把每一行讀進來。</p>
      `,
    },
    {
      id: "pymax",
      title: "if s > best：只在更高時更新",
      teach: `
        <p>best 一開始設成 −1。題目保證第一筆不是嚴重錯誤，分數至少 0，所以第一筆一定會寫進去。</p>
        <p>之後只有「比現在更高」才更新。第二次 90 等於第一次 90，<code>90 &gt; 90</code> 不成立，時間停在 10。</p>
        <p>如果寫成 <code>&gt;=</code>，時間會被改成 20，就錯了。</p>
      `,
    },
    {
      id: "pyerr",
      title: "if s == -1：錯誤另算",
      teach: `
        <p>更新最高分、計算錯誤，是兩件分開的事。一筆資料兩個 if 都要問。</p>
        <p>嚴重錯誤那筆：<code>s &gt; best</code> 通常不成立（−1 很小），但 <code>s == -1</code> 成立，err 加 1。</p>
      `,
    },
    {
      id: "pyform",
      title: "套公式，負的改成 0",
      teach: `
        <p>迴圈結束後才算總分，不要在迴圈裡減。</p>
        <pre class="eq">ans = best - k - err * 2
if ans &lt; 0:
    ans = 0
print(ans, best_t)</pre>
        <p>也可以寫成 <code>print(max(0, ans), best_t)</code>。兩種都行。</p>
      `,
    },
    {
      id: "pyfull",
      title: "把程式拼起來",
      teach: `
        <p>讀 k → 迴圈裡更新最高分與錯誤 → 套公式 → 負的變 0 → 印出總分和時間。</p>
      `,
    },
    {
      id: "play",
      title: "自己改提交紀錄",
      teach: `
        <p>改分數或載入範例，金色外框是第一次最高分。先算公式，再看會不會被壓成 0。</p>
      `,
    },
  ];

  function stats(rows) {
    let best = -1, bestT = 0, err = 0;
    let first = -1;
    rows.forEach((r, i) => {
      if (r.s > best) {
        best = r.s;
        bestT = r.t;
        first = i;
      }
      if (r.s === -1) err += 1;
    });
    const raw = best - rows.length - err * 2;
    return { best, bestT, first, err, k: rows.length, raw, ans: Math.max(0, raw) };
  }

  function chart(rows, opts) {
    const { hi, markErr, showBest, bestIndex } = opts || {};
    const st = stats(rows);
    const first = bestIndex != null ? bestIndex : st.first;
    const maxS = Math.max(1, ...rows.map((r) => (r.s < 0 ? 0 : r.s)));
    return `<div class="subs" role="img" aria-label="提交紀錄">
      ${rows.map((r, i) => {
        const err = r.s === -1;
        const h = err ? 18 : 24 + (r.s / maxS) * 120;
        const cls = [
          "sub",
          err ? "is-err" : "",
          hi === i ? "is-on" : "",
          showBest && i === first ? "is-best" : "",
          markErr && err ? "is-err-on" : "",
        ].filter(Boolean).join(" ");
        return `<div class="${cls}">
          <div class="sub-bar" style="height:${h}px">${err ? "錯" : r.s}</div>
          <span>t=${r.t}</span>
        </div>`;
      }).join("")}
    </div>`;
  }

  function formulaBox(st, phase) {
    const unit = (n, label, extra) =>
      `<div class="f-unit"><b class="${extra || ""}">${n}</b><small>${label}</small></div>`;
    const bits = [
      unit(st.best, "最高分"),
      `<span>−</span>`,
      unit(st.k, `交 ${st.k} 次`),
      `<span>−</span>`,
      unit(st.err * 2, `${st.err} 錯 × 2`),
      `<span>=</span>`,
      unit(st.raw, "先算", st.raw < 0 ? "is-neg" : ""),
    ];
    if (phase >= 2 || st.raw < 0) {
      bits.push(`<span>→</span>`, unit(st.ans, "成績"));
    }
    return `<div class="formula">${bits.join("")}</div>`;
  }

  const Lesson = {
    id: "j605",
    title: "程式考試",
    problem: "j605",
    url: "https://zerojudge.tw/ShowProblem?problemid=j605",
    steps,
    mount(stage, step, runtime) {
      const id = steps[step].id;
      const draw = {
        story: renderStory,
        record: renderRecord,
        error: renderError,
        best: renderBest,
        formula: renderFormula,
        floor: renderFloor,
        sample1: renderSample1,
        sample2: renderSample2,
        pyin: renderPyIn,
        pymax: renderPyMax,
        pyerr: renderPyErr,
        pyform: renderPyForm,
        pyfull: renderPyFull,
        play: renderPlay,
      };
      (draw[id] || renderStory)(stage, runtime);
    },
  };

  function toolbar(stage, extras) {
    const bar = document.createElement("div");
    bar.className = "stage-toolbar";
    bar.innerHTML = extras;
    stage.appendChild(bar);
    const canvas = document.createElement("div");
    canvas.className = "stage-canvas";
    stage.appendChild(canvas);
    return canvas;
  }

  function renderStory(stage) {
    const canvas = toolbar(stage, `<span class="chip">題目在說什麼</span>`);
    canvas.innerHTML = `
      <div style="display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:1rem;align-items:center">
        <img src="assets/j605-hero.jpg" alt="剪紙：螢幕上的成績長條與蓋章考卷" width="800" height="600" style="width:100%;height:230px;object-fit:cover">
        ${chart(SAMPLE1, { showBest: true, markErr: true })}
      </div>
      <p style="margin:.6rem 0 0;color:var(--muted)">右圖金色是第一次 90 分。紅色「錯」是嚴重錯誤。</p>`;
  }

  function renderRecord(stage) {
    const canvas = toolbar(stage, `<span class="chip">5 筆提交</span>`);
    canvas.innerHTML = chart(SAMPLE1, {}) +
      `<p style="margin:.6rem 0 0">時間 3、5、10、15、20，一路變大。分數各自獨立。</p>`;
  }

  function renderError(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">s = −1</span><div class="grow"></div><button class="accent" id="play" type="button">標出錯誤</button>`);
    canvas.innerHTML = chart(SAMPLE1, {});
    stage.querySelector("#play").onclick = () => {
      canvas.innerHTML = chart(SAMPLE1, { markErr: true, hi: 1 }) +
        `<p style="margin:.6rem 0 0">第 2 筆時間 5、分數 −1。最高分還是看 89 和 90，但錯誤次數 +1。</p>`;
    };
  }

  function renderBest(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">第一次 90</span><div class="grow"></div><button class="accent" id="play" type="button">找出最高分</button>`);
    canvas.innerHTML = chart(SAMPLE1, { markErr: true });
    stage.querySelector("#play").onclick = () => {
      canvas.innerHTML = chart(SAMPLE1, { markErr: true, showBest: true }) +
        `<p style="margin:.6rem 0 0">兩次 90，金色停在時間 10。時間 20 那次一樣高，不改。</p>`;
    };
  }

  function renderFormula(stage, runtime) {
    const st = stats(SAMPLE1);
    const canvas = toolbar(stage, `<span class="chip">90 − 5 − 2</span><div class="grow"></div><button class="accent" id="play" type="button">一步一步減</button>`);
    let phase = 0;
    function paint() {
      canvas.innerHTML = chart(SAMPLE1, { markErr: true, showBest: true }) + formulaBox(st, phase);
    }
    paint();
    stage.querySelector("#play").onclick = () => {
      phase = Math.min(2, phase + 1);
      paint();
    };
  }

  function renderFloor(stage) {
    const st = stats(SAMPLE2);
    const canvas = toolbar(stage, `<span class="chip">−7 → 0</span>`);
    canvas.innerHTML = chart(SAMPLE2, { markErr: true, showBest: true }) + formulaBox(st, 2) +
      `<p style="margin:.6rem 0 0">負的成績記成 0。時間仍輸出第一次最高分的 3。</p>`;
  }

  function walkRows(stage, canvas, rows, runtime) {
    let i = -1;
    const btn = stage.querySelector("#play");
    function paint() {
      const seen = rows.slice(0, Math.max(0, i + 1));
      const st = seen.length ? stats(seen) : { best: -1, bestT: "—", err: 0, k: 0, raw: 0, ans: 0, first: -1 };
      canvas.innerHTML = `
        <div class="hud"><span>看到第 <b>${i + 1}</b> 筆</span><span>最高 <b>${st.best}</b></span><span>時間 <b>${st.bestT}</b></span><span>錯 <b>${st.err}</b></span></div>
        ${chart(rows, { hi: i, markErr: true, showBest: i >= 0, bestIndex: st.first })}
        ${i >= 0 ? `<p style="margin:.5rem 0 0">${rows[i].s === -1 ? "這筆是嚴重錯誤，err + 1。" : rows[i].s === st.best && i === st.first ? `新高！best = ${st.best}，時間改成 ${st.bestT}。` : `沒有更高，時間維持 ${st.bestT}。`}</p>` : `<p style="margin:.5rem 0 0;color:var(--muted)">按下一步，一筆一筆看。</p>`}`;
    }
    paint();
    if (btn) {
      btn.onclick = () => {
        if (runtime.reduced) { i = rows.length - 1; paint(); return; }
        i = i >= rows.length - 1 ? -1 : i + 1;
        paint();
        btn.textContent = i >= rows.length - 1 ? "從頭再看" : "下一筆";
      };
    }
  }

  function renderSample1(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">輸出 83 10</span><div class="grow"></div><button class="accent" id="play" type="button">下一筆</button>`);
    walkRows(stage, canvas, SAMPLE1, runtime);
  }

  function renderSample2(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">輸出 0 3</span><div class="grow"></div><button class="accent" id="play" type="button">下一筆</button>`);
    walkRows(stage, canvas, SAMPLE2, runtime);
  }

  function renderPyIn(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "k = int(input())",
      "for i in range(k):",
      "    t, s = map(int, input().split())",
    ];
    const stdin = ["5", "3 89", "5 -1", "10 90", "15 0", "20 90"];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 0, stdin, stdinAt: 0, vars: { k: "" },
        note: "第一行只有次數。這題接下來會有 k 行，不是再讀一行就結束。",
      },
      {
        lines, hi: 0, stdin, stdinAt: 1, vars: { k: 5 }, glow: "k",
        note: "k = 5，迴圈要跑 5 次。",
      },
      {
        lines, hi: 2, stdin, stdinAt: 2, vars: { i: 0, t: 3, s: 89 }, glow: "s",
        note: "第 1 次迴圈吃掉「3 89」。t 是時間，s 是分數。",
      },
      {
        lines, hi: 2, stdin, stdinAt: 3, vars: { i: 1, t: 5, s: -1 }, glow: "s",
        note: "第 2 次吃掉「5 -1」。每一行都要再呼叫一次 input()。",
      },
    ], runtime);
  }

  function renderPyMax(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "best, best_t = -1, 0",
      "if s > best:",
      "    best = s",
      "    best_t = t",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 0, vars: { best: -1, best_t: 0 },
        note: "還沒看過任何分數。設成 −1，第一筆（一定 ≥ 0）就會寫進來。",
      },
      {
        lines, hi: 1, vars: { s: 89, best: -1 },
        visual: chart(SAMPLE1.slice(0, 1), { showBest: true }),
        note: "89 > −1？是。更新。",
      },
      {
        lines, hi: 3, vars: { best: 90, best_t: 10, s: 90, t: 10 }, glow: "best_t",
        visual: chart(SAMPLE1.slice(0, 3), { showBest: true, markErr: true }),
        note: "時間 10 出現 90，比 89 高。best_t 改成 10。",
      },
      {
        lines, hi: 1, vars: { s: 90, best: 90, best_t: 10, t: 20 }, glow: "best_t",
        visual: chart(SAMPLE1, { showBest: true, markErr: true }),
        note: "時間 20 又是 90。90 > 90？不是。時間維持 10。所以要用 > 不是 >=。",
      },
    ], runtime);
  }

  function renderPyErr(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 3</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "if s > best:",
      "    best, best_t = s, t",
      "if s == -1:",
      "    err += 1",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 2, vars: { s: -1, best: 89, err: 0 },
        visual: chart(SAMPLE1.slice(0, 2), { markErr: true, hi: 1 }),
        note: "這筆是 −1。第一個 if 通常不進去（−1 不會比 89 高）。",
      },
      {
        lines, hi: 3, vars: { s: -1, err: 1 }, glow: "err",
        note: "第二個 if 進去，err 加 1。兩個 if 都要寫，不要合成一個。",
      },
      {
        lines, hi: 3, vars: { err: 2, k: 3 }, glow: "err",
        visual: chart(SAMPLE2, { markErr: true }),
        note: "範例二有兩筆 −1，err = 2。後面公式會用到。",
      },
    ], runtime);
  }

  function renderPyForm(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 3</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "ans = best - k - err * 2",
      "if ans < 0:",
      "    ans = 0",
      "print(ans, best_t)",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 0, vars: { best: 90, k: 5, err: 1, ans: 83 }, glow: "ans",
        visual: formulaBox(stats(SAMPLE1), 1),
        note: "90 − 5 − 2 = 83。正的，不用改。",
      },
      {
        lines, hi: 2, vars: { best: 0, k: 3, err: 2, ans: -7 }, glow: "ans",
        visual: formulaBox(stats(SAMPLE2), 1),
        note: "0 − 3 − 4 = −7。進去 if，改成 0。",
      },
      {
        lines, hi: 3, vars: { ans: 0, best_t: 3 }, glow: "ans",
        note: "印出兩個數：總分、第一次最高分的時間。中間自動空一格。",
      },
    ], runtime);
  }

  function renderPyFull(stage) {
    const canvas = toolbar(stage, `<span class="chip">可提交</span><div class="grow"></div><button class="ghost" id="copy" type="button">複製程式</button>`);
    const code = `k = int(input())
best, best_t = -1, 0
err = 0

for i in range(k):
    t, s = map(int, input().split())
    if s > best:
        best = s
        best_t = t
    if s == -1:
        err += 1

ans = best - k - err * 2
if ans < 0:
    ans = 0
print(ans, best_t)`;
    canvas.innerHTML = `${PyTeach.codeBlock(code.split("\n"), -1)}
      <p class="py-note">k 行迴圈 → 更高才更新時間 → 另外數 −1 → 套公式，負的變 0。</p>`;
    PyTeach.copyBtn(stage, code);
  }

  function renderPlay(stage) {
    let rows = SAMPLE1.map((r) => ({ ...r }));
    const canvas = toolbar(stage, `
      <button class="ghost" type="button" id="s1">範例一</button>
      <button class="ghost" type="button" id="s2">範例二</button>
      <div class="grow"></div>
      <span class="chip" id="ans">83 10</span>
    `);
    function paint() {
      const st = stats(rows);
      canvas.querySelector(".sky-out").innerHTML =
        chart(rows, { markErr: true, showBest: true }) + formulaBox(st, 2);
      stage.querySelector("#ans").textContent = `${st.ans} ${st.bestT}`;
      canvas.querySelectorAll("[data-i]").forEach((inp) => {
        inp.oninput = () => {
          const i = +inp.dataset.i;
          const field = inp.dataset.f;
          rows[i][field] = +inp.value;
          paint();
        };
      });
    }
    function form() {
      canvas.innerHTML = `<div class="sky-out"></div>
        <div class="play-heights" style="margin-top:.8rem">${rows.map((r, i) => `
          <label>t
            <input type="number" data-i="${i}" data-f="t" value="${r.t}" aria-label="第 ${i + 1} 筆時間">
            s
            <input type="number" data-i="${i}" data-f="s" value="${r.s}" aria-label="第 ${i + 1} 筆分數">
          </label>`).join("")}</div>`;
      paint();
    }
    stage.querySelector("#s1").onclick = () => { rows = SAMPLE1.map((r) => ({ ...r })); form(); };
    stage.querySelector("#s2").onclick = () => { rows = SAMPLE2.map((r) => ({ ...r })); form(); };
    form();
  }

  window.Lessons = window.Lessons || {};
  window.Lessons.j605 = Lesson;
})();
