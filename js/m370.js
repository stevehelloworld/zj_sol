(function () {
  const SAMPLE1 = { x: 10, foods: [1, 5, 13] };
  const SAMPLE2 = { x: 10, foods: [-1, 13, 12, 16, 100, -9, 7, 8, 25] };

  const steps = [
    {
      id: "story",
      title: "數線上的機械鼠",
      teach: `
        <p>數線上站著一隻機械鼠，起點在 <strong>x</strong>。另外散落 <strong>n</strong> 塊食物，每塊都有自己的位置。</p>
        <p>今天牠出發前必須先決定：<strong>整晚只往左，或整晚只往右</strong>。中途不能回頭。</p>
        <p>經過食物就能吃。題目要兩個答案：最多能吃幾塊，以及最後停下來吃的那塊在哪裡。</p>
      `,
    },
    {
      id: "oneway",
      title: "只能選一個方向",
      teach: `
        <p>這是整題最重要的限制。往左出發，右邊那些就全部放棄；往右也一樣。</p>
        <p>所以不必設計路線，只要問：<strong>左邊有幾塊？右邊有幾塊？</strong>選比較多的那邊走到底。</p>
        <p>按播放，看一次「想回頭」會怎樣：題目不允許，程式也不該模擬轉彎。</p>
      `,
    },
    {
      id: "count",
      title: "左邊幾塊、右邊幾塊",
      teach: `
        <p>比 x 小的在左邊，比 x 大的在右邊。題目保證食物不會剛好在 x 上。</p>
        <p>範例一：起點 10，食物 1、5、13。</p>
        <ul>
          <li>1 和 5 在左，共 2 塊</li>
          <li>13 在右，共 1 塊</li>
        </ul>
        <p>2 &gt; 1，所以今天往左走比較划算。</p>
      `,
    },
    {
      id: "farthest",
      title: "最後停在最遠那塊",
      teach: `
        <p>選定方向之後，會一路吃到該方向最遠的食物才停。</p>
        <ul>
          <li>往左：最遠就是<strong>最小的位置</strong></li>
          <li>往右：最遠就是<strong>最大的位置</strong></li>
        </ul>
        <p>左邊的食物全部比 x 小，右邊全部比 x 大。所以「左邊最小」其實就是整排的 <code>min</code>，「右邊最大」就是整排的 <code>max</code>。不必分開再找一次。</p>
      `,
    },
    {
      id: "notie",
      title: "為什麼不會平手",
      teach: `
        <p>題目寫了兩件保證：</p>
        <ul>
          <li>n 是奇數</li>
          <li>沒有食物剛好在老鼠腳下</li>
        </ul>
        <p>奇數個食物，又不在中間，左右就不可能一樣多。程式用 <code>if right &gt; left</code> 即可，不用處理平手。</p>
      `,
    },
    {
      id: "sample1",
      title: "範例一，往左吃 2 塊",
      teach: `
        <p>輸入：</p>
        <pre class="eq">10 3
1 5 13</pre>
        <p>往左吃 1、5，最後停在 1。輸出 <strong>2 1</strong>。</p>
        <p>按播放，看老鼠從 10 往左走、一塊一塊吃。</p>
      `,
    },
    {
      id: "sample2",
      title: "範例二，往右吃 5 塊",
      teach: `
        <p>輸入：</p>
        <pre class="eq">10 9
-1 13 12 16 100 -9 7 8 25</pre>
        <p>左 4 塊（最遠 -9），右 5 塊（最遠 100）。往右比較多。輸出 <strong>5 100</strong>。</p>
      `,
    },
    {
      id: "pyin",
      title: "讀起點、數量、位置",
      teach: `
        <p>第一行兩個數：起點 x、食物數量 n。跟紅綠燈一樣，<code>split</code> 再變成整數。</p>
        <p>第二行 n 個位置，收成一排 p。交卷時 n 其實可以不用，但還是要讀進來，否則會跟下一行對不齊。</p>
      `,
    },
    {
      id: "pyif",
      title: "if t > x：在左邊還是右邊",
      teach: `
        <p>對每一塊食物只問一件事：它的位置有沒有比老鼠大。</p>
        <p><code>t &gt; x</code> 就是右邊。<code>else</code> 就是左邊（題目保證不會相等）。</p>
        <p>不要算距離、不要取絕對值。這題比的是數線左右，不是遠近。</p>
      `,
    },
    {
      id: "pycnt",
      title: "left 加一，或 right 加一",
      teach: `
        <p>兩個盒子從 0 開始。迴圈每看到一塊，就往對應的盒子加 1。</p>
        <p>走完整排，左邊幾塊、右邊幾塊就數完了。這就是「最多能吃幾個」的兩個候選人。</p>
      `,
    },
    {
      id: "pymax",
      title: "為什麼直接用 min 和 max",
      teach: `
        <p>往右走，最後一站是右邊最遠，也就是最大的那個位置。因為右邊都比 x 大、左邊都比 x 小，<strong>整排的最大值一定在右邊</strong>。</p>
        <p>同理，整排的最小值一定在左邊。所以：</p>
        <ul>
          <li>選右邊：<code>print(right, max(p))</code></li>
          <li>選左邊：<code>print(left, min(p))</code></li>
        </ul>
        <p>不必再寫一次迴圈去找「右邊的最大」。Python 的 <code>min</code> / <code>max</code> 會看整份清單。</p>
      `,
    },
    {
      id: "pyfull",
      title: "把程式拼起來",
      teach: `
        <p>讀入 → 迴圈分類左右 → 比較兩邊 → 印出數量和終點。按「下一步程式」從上看到下，看熟再複製。</p>
        <p><code>print(a, b)</code> 中間會自動空一格，剛好符合題目格式。</p>
      `,
    },
    {
      id: "play",
      title: "自己放食物試試看",
      teach: `
        <p>改起點或載入範例，金色是選中的那一側。先數左右，再核對終點是不是最遠那塊。</p>
        <p>想清楚這件事就可以交卷：<strong>選食物比較多的那邊，走到該邊最遠的一塊停。</strong></p>
      `,
    },
  ];

  function splitSides(x, foods) {
    const left = foods.filter((p) => p < x).sort((a, b) => b - a);
    const right = foods.filter((p) => p > x).sort((a, b) => a - b);
    return {
      left,
      right,
      l: left.length,
      r: right.length,
      min: Math.min(...foods),
      max: Math.max(...foods),
      pick: right.length > left.length ? "right" : "left",
    };
  }

  function nline(x, foods, opts) {
    const { eaten, mouseAt, glow, dimOther } = opts || {};
    const points = Array.from(new Set([x, ...foods])).sort((a, b) => a - b);
    const pct = (v) => {
      const i = points.indexOf(v);
      if (points.length === 1) return 50;
      return 6 + (i / (points.length - 1)) * 88;
    };
    const ticks = points.map((t) =>
      `<span class="tick" style="left:${pct(t)}%"><i></i>${t}</span>`
    );
    const foodEls = foods.map((p) => {
      const side = p < x ? "is-left" : "is-right";
      const isEaten = eaten && eaten.indexOf(p) !== -1;
      const isGlow = glow && glow.indexOf(p) !== -1;
      const dim = dimOther && !isGlow && !isEaten;
      return `<button type="button" class="food ${side}${isEaten ? " is-eaten" : ""}${isGlow ? " is-glow" : ""}${dim ? " is-dim" : ""}" style="left:${pct(p)}%" disabled><b>${p}</b></button>`;
    }).join("");
    const mx = mouseAt == null ? x : mouseAt;
    return `<div class="nline" role="img" aria-label="數線，老鼠在 ${x}">
      <div class="nline-rail"></div>
      ${ticks.join("")}
      ${foodEls}
      <div class="nest" style="left:${pct(x)}%"></div>
      <div class="mouse" style="left:${pct(mx)}%" aria-hidden="true">
        <svg viewBox="0 0 40 28"><ellipse cx="18" cy="18" rx="12" ry="8" fill="oklch(0.45 0.04 294)"/><circle cx="28" cy="14" r="6" fill="oklch(0.5 0.05 294)"/><circle cx="30" cy="13" r="1.4" fill="oklch(0.22 0.05 294)"/><circle cx="22" cy="8" r="3.2" fill="oklch(0.42 0.04 294)"/></svg>
      </div>
    </div>`;
  }

  const Lesson = {
    id: "m370",
    title: "機械鼠",
    problem: "m370",
    url: "https://zerojudge.tw/ShowProblem?problemid=m370",
    steps,
    mount(stage, step, runtime) {
      const id = steps[step].id;
      const draw = {
        story: renderStory,
        oneway: renderOneway,
        count: renderCount,
        farthest: renderFarthest,
        notie: renderNotie,
        sample1: renderSample1,
        sample2: renderSample2,
        pyin: renderPyIn,
        pyif: renderPyIf,
        pycnt: renderPyCnt,
        pymax: renderPyMax,
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
      <div style="display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:1rem;align-items:center">
        <img src="assets/m370-hero.jpg" alt="剪紙：數線上的機械鼠與起司" width="800" height="600" style="width:100%;height:230px;object-fit:cover">
        ${nline(SAMPLE1.x, SAMPLE1.foods, {})}
      </div>
      <p style="margin:.6rem 0 0;color:var(--muted)">右圖：老鼠在 10，左邊兩塊食物、右邊一塊。</p>`;
  }

  function renderOneway(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">不能回頭</span><div class="grow"></div><button class="accent" id="play" type="button">播放往左</button>`);
    canvas.innerHTML = nline(10, [1, 5, 13], {}) +
      `<p style="margin:.6rem 0 0;color:var(--muted)">若往左出發，13 那塊就吃不到了。</p>`;
    walk(stage, canvas, 10, [1, 5, 13], "left", runtime);
  }

  function renderCount(stage) {
    const s = splitSides(10, [1, 5, 13]);
    const canvas = toolbar(stage, `<span class="chip">左 ${s.l}　右 ${s.r}</span>`);
    canvas.innerHTML = `
      <div class="hud"><span>左 <b>${s.l}</b></span><span>右 <b>${s.r}</b></span><span>選 <b>左</b></span></div>
      ${nline(10, [1, 5, 13], { glow: s.left, dimOther: true })}
      <p style="margin:.6rem 0 0">金色在左邊。今天走左邊。</p>`;
  }

  function renderFarthest(stage) {
    const canvas = toolbar(stage, `<span class="chip">最遠 = min 或 max</span>`);
    canvas.innerHTML = `
      <div class="hud"><span>往左終點 <b>1</b>（min）</span><span>往右終點 <b>13</b>（max）</span></div>
      ${nline(10, [1, 5, 13], { glow: [1], dimOther: true })}
      <p style="margin:.6rem 0 0">選左邊的話，最後停在 1，不是 5。因為還會繼續往左走。</p>`;
  }

  function renderNotie(stage) {
    const canvas = toolbar(stage, `<span class="chip">n 是奇數</span>`);
    canvas.innerHTML = `
      ${nline(10, [1, 5, 13], {})}
      <p style="margin:.6rem 0 0">3 塊食物，奇數。左右不可能 1.5 對 1.5，也不會有食物踩在 10 上。所以一定分得出勝負。</p>`;
  }

  function walk(stage, canvas, x, foods, dir, runtime) {
    const s = splitSides(x, foods);
    const seq = dir === "right" ? [x, ...s.right] : [x, ...s.left];
    const eatenFinal = dir === "right" ? s.right : s.left;
    let i = 0;
    const btn = stage.querySelector("#play");
    function paint() {
      const at = seq[i];
      const eaten = seq.slice(1, i + 1);
      canvas.innerHTML = `
        <div class="hud"><span>走到 <b>${at}</b></span><span>已吃 <b>${eaten.length}</b></span></div>
        ${nline(x, foods, { mouseAt: at, eaten, glow: eatenFinal, dimOther: true })}
        <p style="margin:.5rem 0 0">${i === 0 ? "從起點出發。" : eaten.length === eatenFinal.length ? `停在 ${at}，一共 ${eaten.length} 塊。` : `吃掉 ${at}，繼續同一方向。`}</p>`;
    }
    if (btn) {
      btn.onclick = () => {
        if (runtime.reduced) {
          i = seq.length - 1;
          paint();
          return;
        }
        i = i >= seq.length - 1 ? 0 : i + 1;
        paint();
        btn.textContent = i >= seq.length - 1 ? "從頭再走" : "下一步走";
      };
    }
  }

  function renderSample1(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">輸出 2 1</span><div class="grow"></div><button class="accent" id="play" type="button">往左走</button>`);
    canvas.innerHTML = nline(10, [1, 5, 13], {});
    walk(stage, canvas, 10, [1, 5, 13], "left", runtime);
  }

  function renderSample2(stage, runtime) {
    const s = splitSides(SAMPLE2.x, SAMPLE2.foods);
    const canvas = toolbar(stage, `<span class="chip">輸出 5 100</span><div class="grow"></div><button class="accent" id="play" type="button">往右走</button>`);
    canvas.innerHTML = `
      <div class="hud"><span>左 ${s.l}</span><span>右 <b>${s.r}</b></span></div>
      ${nline(SAMPLE2.x, SAMPLE2.foods, { glow: s.right, dimOther: true })}`;
    walk(stage, canvas, SAMPLE2.x, SAMPLE2.foods, "right", runtime);
  }

  function renderPyIn(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 3</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "x, n = map(int, input().split())",
      "p = list(map(int, input().split()))",
    ];
    const stdin = ["10 3", "1 5 13"];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 0, stdin, stdinAt: 0, vars: { x: "", n: "" },
        note: "第一行兩個數：起點、食物數量。",
      },
      {
        lines, hi: 0, stdin, stdinAt: 1, vars: { x: 10, n: 3 }, glow: "x",
        note: "x = 10，n = 3。n 等一下其實不用來算，但還是要讀掉。",
      },
      {
        lines, hi: 1, stdin, stdinAt: 2, vars: { x: 10, n: 3, p: [1, 5, 13] }, glow: "p",
        visual: nline(10, [1, 5, 13], {}),
        note: "第二行三個位置，收進清單 p。",
      },
    ], runtime);
  }

  function renderPyIf(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "for t in p:",
      "    if t > x:",
      "        right += 1      # 在右邊",
      "    else:",
      "        left += 1       # 在左邊",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 1, vars: { t: 1, x: 10 },
        visual: nline(10, [1, 5, 13], { glow: [1], dimOther: true }),
        note: "1 > 10？不是。走 else，算左邊。",
      },
      {
        lines, hi: 4, vars: { t: 1, left: 1, right: 0 }, glow: "left",
        note: "left 變成 1。",
      },
      {
        lines, hi: 1, vars: { t: 13, x: 10 },
        visual: nline(10, [1, 5, 13], { glow: [13], dimOther: true }),
        note: "13 > 10？是。走 if，算右邊。",
      },
      {
        lines, hi: 2, vars: { t: 13, left: 2, right: 1 }, glow: "right",
        note: "三塊都問完：左 2、右 1。",
      },
    ], runtime);
  }

  function renderPyCnt(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "left = right = 0",
      "for t in p:",
      "    if t > x: right += 1",
      "    else: left += 1",
    ];
    const foods = SAMPLE2.foods;
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 0, vars: { left: 0, right: 0 }, glow: "left",
        note: "兩個盒子先清成 0。",
      },
      {
        lines, hi: 2, vars: { left: 4, right: 5 }, glow: "right",
        visual: nline(10, foods, { glow: foods.filter((p) => p > 10), dimOther: true }),
        note: "範例二走完：左 4、右 5。右邊比較多。",
      },
      {
        lines, hi: 3, vars: { left: 2, right: 1 }, glow: "left",
        visual: nline(10, [1, 5, 13], { glow: [1, 5], dimOther: true }),
        note: "範例一走完：左 2、右 1。左邊比較多。",
      },
      {
        lines, hi: 0, vars: { left: 2, right: 1 },
        note: "數完就可以比大小。不必把食物排序。",
      },
    ], runtime);
  }

  function renderPyMax(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 3</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "if right > left:",
      "    print(right, max(p))   # 往右，停在最大",
      "else:",
      "    print(left, min(p))    # 往左，停在最小",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines, hi: 1, vars: { right: 5, left: 4, "max(p)": 100 }, glow: "max(p)",
        visual: nline(SAMPLE2.x, SAMPLE2.foods, { glow: [100], dimOther: true }),
        note: "範例二右邊較多。整排最大是 100，一定在右邊，就是終點。",
      },
      {
        lines, hi: 3, vars: { right: 1, left: 2, "min(p)": 1 }, glow: "min(p)",
        visual: nline(10, [1, 5, 13], { glow: [1], dimOther: true }),
        note: "範例一左邊較多。整排最小是 1，一定在左邊。",
      },
      {
        lines, hi: 0, vars: {},
        note: "平手不會發生。right > left 不成立時，走 else 選左邊即可。",
      },
    ], runtime);
  }

  function renderPyFull(stage) {
    const canvas = toolbar(stage, `<span class="chip">可提交</span><div class="grow"></div><button class="ghost" id="copy" type="button">複製程式</button>`);
    const code = `x, n = map(int, input().split())
p = list(map(int, input().split()))

left = right = 0
for t in p:
    if t > x:
        right += 1
    else:
        left += 1

if right > left:
    print(right, max(p))
else:
    print(left, min(p))`;
    canvas.innerHTML = `${PyTeach.codeBlock(code.split("\n"), -1)}
      <p class="py-note">分類左右 → 選比較多的那邊 → 終點用 min 或 max。n 讀了可以不用。</p>`;
    PyTeach.copyBtn(stage, code);
  }

  function renderPlay(stage) {
    let x = SAMPLE1.x;
    let foods = SAMPLE1.foods.slice();
    const canvas = toolbar(stage, `
      <button class="ghost" type="button" id="s1">範例一</button>
      <button class="ghost" type="button" id="s2">範例二</button>
      <label class="field"><span>起點 x</span><input id="xx" type="number" value="10"></label>
      <div class="grow"></div>
      <span class="chip" id="ans">2 1</span>
    `);
    function refresh() {
      const s = splitSides(x, foods);
      const pick = s.pick;
      const count = pick === "right" ? s.r : s.l;
      const stop = pick === "right" ? s.max : s.min;
      const glow = pick === "right" ? foods.filter((p) => p > x) : foods.filter((p) => p < x);
      canvas.querySelector(".sky-out").innerHTML =
        nline(x, foods, { glow, dimOther: true }) +
        `<p style="margin:.5rem 0 0">往${pick === "right" ? "右" : "左"}吃 ${count} 塊，停在 ${stop}。</p>`;
      stage.querySelector("#ans").textContent = `${count} ${stop}`;
    }
    canvas.innerHTML = `<div class="sky-out"></div>
      <p class="py-note">食物位置（空格隔開）</p>
      <input id="ff" type="text" value="${foods.join(" ")}" style="width:100%;padding:.4rem .5rem;border:1px solid var(--line);font-family:var(--font-mono)">`;
    function applyFoods() {
      const raw = canvas.querySelector("#ff").value.trim().split(/\s+/).map(Number).filter((n) => !Number.isNaN(n));
      if (raw.length) foods = raw;
      refresh();
    }
    canvas.querySelector("#ff").addEventListener("change", applyFoods);
    stage.querySelector("#xx").addEventListener("change", (e) => {
      x = +e.target.value || 0;
      refresh();
    });
    stage.querySelector("#s1").onclick = () => {
      x = SAMPLE1.x; foods = SAMPLE1.foods.slice();
      stage.querySelector("#xx").value = x;
      canvas.querySelector("#ff").value = foods.join(" ");
      refresh();
    };
    stage.querySelector("#s2").onclick = () => {
      x = SAMPLE2.x; foods = SAMPLE2.foods.slice();
      stage.querySelector("#xx").value = x;
      canvas.querySelector("#ff").value = foods.join(" ");
      refresh();
    };
    refresh();
  }

  window.Lessons = window.Lessons || {};
  window.Lessons.m370 = Lesson;
})();
