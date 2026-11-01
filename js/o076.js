(function () {
  const SAMPLE1 = [6, 2, 5, 3, 1];
  const SAMPLE2 = [31, 41, 97, 93, 23, 89, 59, 26, 15, 58];
  const COLORS = 5;

  const steps = [
    {
      id: "story",
      title: "從某一棟往右滑翔",
      teach: `
        <p>鎮上有 n 棟高樓排成一排。特技人員要選一棟當起點，<strong>只能往右</strong>滑翔到地面。</p>
        <p>為了安全，經過的樓必須<strong>一棟比一棟低</strong>。題目要的是：最長可以連幾棟。</p>
        <p>範例一的樓高是 6, 2, 5, 3, 1。最長的一條是 5 → 3 → 1，長度 3。</p>
      `,
    },
    {
      id: "right",
      title: "只能往右，而且不能跳",
      teach: `
        <p>滑翔不是「想踩哪棟就踩哪棟」。人是往右貼著飛，中間那棟樓會擋路。</p>
        <p>所以路徑一定是<strong>連續的好幾棟</strong>。6 到 5 中間隔著 2，不能跳過 2 去接 5。</p>
        <p>按播放，看一次「想跳過去」會怎樣：2 這棟卡住了。</p>
      `,
    },
    {
      id: "lower",
      title: "下一棟必須更矮",
      teach: `
        <p>「越來越低」是嚴格的：下一棟的高度要 <strong>小於</strong> 這一棟。一樣高也不行。</p>
        <p>左邊動畫把每一對鄰居比一次。綠勾是可以繼續飛，紅叉是這條路在這裡斷掉。</p>
      `,
    },
    {
      id: "eyes",
      title: "先用眼睛找出最長的",
      teach: `
        <p>範例一很短，可以一條一條數：</p>
        <ul>
          <li>6 → 2　長度 2</li>
          <li>2 → 5　2 沒有比 5 高，斷了</li>
          <li>5 → 3 → 1　長度 3</li>
        </ul>
        <p>最長是 3。金色那三棟就是答案路徑。</p>
      `,
    },
    {
      id: "scan",
      title: "讓電腦從左掃到右",
      teach: `
        <p>n 最大只有 100，但我們不需要把所有起點都試一遍。有一個更省事的走法：</p>
        <p>帶兩個數字往右走：</p>
        <ul>
          <li><strong>目前長度 cur</strong>：現在這條連續下降路已經有幾棟</li>
          <li><strong>最長紀錄 best</strong>：到目前為止看過最長的是幾棟</li>
        </ul>
        <p>從左邊第二棟開始，一棟一棟問：它有沒有比左邊那棟矮？</p>
      `,
    },
    {
      id: "reset",
      title: "升高（或一樣高）就重新開始",
      teach: `
        <p>如果下一棟更矮：cur 加 1，然後看要不要更新 best。</p>
        <p>如果下一棟比較高或一樣高：這條路斷了。從這一棟當新的起點，cur 回到 1。</p>
        <p>為什麼回到 1？因為新路徑至少包含「現在站的這一棟」。</p>
        <div class="note"><strong>整題就這一個轉折</strong>連續下降就累加；一旦不下降，長度歸一，但最長紀錄先收好。</div>
      `,
    },
    {
      id: "sample1",
      title: "範例一，一棟一棟走",
      teach: `
        <p>樓高 6, 2, 5, 3, 1。按播放，看 cur 和 best 怎麼變：</p>
        <ul>
          <li>6→2 下降，cur=2，best=2</li>
          <li>2→5 升高，cur 回到 1</li>
          <li>5→3 下降，cur=2</li>
          <li>3→1 下降，cur=3，best=3</li>
        </ul>
        <p>走完，best 是 3。輸出 3。</p>
      `,
    },
    {
      id: "sample2",
      title: "範例二，最長是 4",
      teach: `
        <p>10 棟：31 41 97 93 23 89 59 26 15 58</p>
        <p>眼睛會被最高的 97 吸走，但 97→93→23 只有 3 棟。更長的是後面：<strong>89 → 59 → 26 → 15</strong>。</p>
        <p>掃描不會漏：升高就重來，下降就加長，best 會在 15 那裡變成 4。</p>
      `,
    },
    {
      id: "pyin",
      title: "讀 n 跟一整行樓高",
      teach: `
        <p>輸入有兩行。第一行只有棟數 n，所以 <code>n = int(input())</code>。</p>
        <p>第二行是 n 個高度，中間用空格隔開。跟紅綠燈那題的「一行很多人」一樣：<code>split</code> 剪開，<code>map(int, ...)</code> 變整數，<code>list(...)</code> 收成一排，放進 h。</p>
        <p>之後 h[0] 是最左邊那棟，h[n-1] 是最右邊。按「下一步程式」看兩行怎麼被吃進去。</p>
      `,
    },
    {
      id: "pyidx",
      title: "h[i] 是第幾棟",
      teach: `
        <p>Python 的下標從 0 起算。第 1 棟是 <code>h[0]</code>，第 2 棟是 <code>h[1]</code>。</p>
        <p>我們要從「第二棟」開始，每一棟跟左邊鄰居比，所以迴圈寫 <code>for i in range(1, n)</code>：i 走 1、2、3……到 n-1，不會碰到 n（沒有 h[n]）。</p>
        <p>左邊鄰居永遠是 <code>h[i - 1]</code>。不要寫成 h[i + 1]，那是右邊，這題是往右走但每次只回頭看一棟。</p>
      `,
    },
    {
      id: "pyif",
      title: "if：有沒有變矮",
      teach: `
        <p>電腦一次只問一對鄰居：<code>if h[i] &lt; h[i - 1]</code>。</p>
        <p>小於才算下降。等於或大於都算這條路斷了。沒有「差不多矮也行」。</p>
        <p>這個 if 就是圖上「下一棟必須更矮」那一句話，沒有別的魔法。</p>
      `,
    },
    {
      id: "pycur",
      title: "cur 加一，或回到 1",
      teach: `
        <p>兩個盒子：</p>
        <ul>
          <li><code>cur</code>：現在這條下降路已經連了幾棟</li>
          <li><code>best</code>：到目前看過最長的是幾棟</li>
        </ul>
        <p>兩盒一開始都是 1，因為單獨一棟也算長度 1。</p>
        <p>下降：<code>cur += 1</code>，若 cur 比 best 大，就更新 best。沒下降：<code>cur = 1</code>，人站在這一棟當新起點。best 不要清掉。</p>
      `,
    },
    {
      id: "pyfull",
      title: "把程式拼起來",
      teach: `
        <p>讀入、設初值、迴圈裡比鄰居、最後印 best。按「下一步程式」從上看到下，看熟再複製。</p>
      `,
    },
    {
      id: "play",
      title: "自己蓋一排樓",
      teach: `
        <p>改下面每一棟的樓高，金色外框會標出目前最長的下降路徑。也可以載入兩個官方範例。</p>
        <p>想清楚這件事就可以交卷：<strong>答案是「連續往右、嚴格變矮」的最長段，不是整排裡隨便挑最矮的幾棟。</strong></p>
      `,
    },
  ];

  function longest(h) {
    let best = 1, cur = 1, bestL = 0, bestR = 0, curL = 0;
    for (let i = 1; i < h.length; i++) {
      if (h[i] < h[i - 1]) {
        cur += 1;
        if (cur > best) {
          best = cur;
          bestL = curL;
          bestR = i;
        }
      } else {
        cur = 1;
        curL = i;
      }
    }
    if (h.length === 1) return { best: 1, bestL: 0, bestR: 0 };
    return { best, bestL, bestR };
  }

  function skyline(h, opts) {
    const max = Math.max(8, ...h);
    const { curL, curR, bestL, bestR, block, dimOthers } = opts || {};
    return `<div class="skyline" role="img" aria-label="樓高 ${h.join("、")}">
      ${h.map((v, i) => {
        const height = 28 + (v / max) * 200;
        const cls = [
          "bldg",
          curL != null && i >= curL && i <= curR ? "is-cur" : "",
          bestL != null && i >= bestL && i <= bestR ? "is-best" : "",
          block === i ? "is-block" : "",
          dimOthers && !(bestL != null && i >= bestL && i <= bestR) && !(curL != null && i >= curL && i <= curR) ? "is-dim" : "",
        ].filter(Boolean).join(" ");
        return `<div class="${cls}" style="height:${height}px" data-i="${i}"><span>${v}</span></div>`;
      }).join("")}
    </div>`;
  }

  const Lesson = {
    id: "o076",
    title: "特技表演",
    problem: "o076",
    url: "https://zerojudge.tw/ShowProblem?problemid=o076",
    steps,
    mount(stage, step, runtime) {
      const id = steps[step].id;
      const draw = {
        story: renderStory,
        right: renderRight,
        lower: renderLower,
        eyes: renderEyes,
        scan: renderScan,
        reset: renderReset,
        sample1: renderSample1,
        sample2: renderSample2,
        pyin: renderPyIn,
        pyidx: renderPyIdx,
        pyif: renderPyIf,
        pycur: renderPyCur,
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
        <img src="assets/o076-hero.jpg" alt="剪紙：高樓間的滑翔翼" width="800" height="600" style="width:100%;height:230px;object-fit:cover">
        ${skyline(SAMPLE1, { bestL: 2, bestR: 4 })}
      </div>
      <p style="margin:.6rem 0 0;color:var(--muted)">右圖金色那三棟：5、3、1，就是範例一的最長滑翔。</p>`;
  }

  function renderRight(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">不能跳過中間的樓</span><div class="grow"></div><button class="accent" id="play" type="button">播放撞擊</button>`);
    canvas.innerHTML = `${skyline(SAMPLE1, {})}
      <p style="margin:.4rem 0 0;color:var(--muted)">虛線想從 6 直接飛到 5，會撞上中間的 2。</p>`;
    stage.querySelector("#play").onclick = () => {
      canvas.innerHTML = `${skyline(SAMPLE1, { block: 1, curL: 0, curR: 0 })}
        <p style="margin:.4rem 0 0">2 比 6 矮，6→2 可以。但 2 之後是 5，升高了，不能再連。更不能「跳過 2」。</p>`;
    };
  }

  function renderLower(stage) {
    const canvas = toolbar(stage, `<span class="chip">只跟右邊鄰居比</span>`);
    const pairs = SAMPLE1.slice(0, -1).map((v, i) => {
      const ok = SAMPLE1[i + 1] < v;
      return `<div class="kid-row">
        <div>${v} → ${SAMPLE1[i + 1]}</div>
        <div>${ok ? "右邊更矮，可以繼續飛" : "右邊沒有更矮，這條路斷了"}</div>
        <div>${ok ? "連下去" : "中斷"}</div>
      </div>`;
    }).join("");
    canvas.innerHTML = `${skyline(SAMPLE1, {})}<div class="kids" style="margin-top:.8rem">${pairs}</div>`;
  }

  function renderEyes(stage) {
    const canvas = toolbar(stage, `<span class="chip">最長 = 3</span>`);
    canvas.innerHTML = skyline(SAMPLE1, { bestL: 2, bestR: 4, dimOthers: true });
  }

  function renderScan(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">cur 從 1 開始</span><div class="grow"></div><button class="accent" id="play" type="button">走一步</button>`);
    let i = 0;
    let cur = 1, best = 1, curL = 0, bestL = 0, bestR = 0;
    function paint(msg) {
      canvas.innerHTML = `
        <div class="hud"><span>走到第 <b>${i + 1}</b> 棟</span><span>cur=<b>${cur}</b></span><span>best=<b>${best}</b></span></div>
        ${skyline(SAMPLE1, { curL, curR: i, bestL, bestR })}
        <p style="margin:.5rem 0 0">${msg}</p>`;
    }
    paint("先站在第 1 棟。目前路徑長度 1，最長也是 1。");
    stage.querySelector("#play").onclick = () => {
      if (i >= SAMPLE1.length - 1) {
        i = 0; cur = 1; best = 1; curL = 0; bestL = 0; bestR = 0;
        paint("先站在第 1 棟。目前路徑長度 1，最長也是 1。");
        return;
      }
      i += 1;
      if (SAMPLE1[i] < SAMPLE1[i - 1]) {
        cur += 1;
        if (cur > best) { best = cur; bestL = curL; bestR = i; }
        paint(`${SAMPLE1[i - 1]} → ${SAMPLE1[i]} 下降，cur 變成 ${cur}。`);
      } else {
        cur = 1;
        curL = i;
        paint(`${SAMPLE1[i - 1]} → ${SAMPLE1[i]} 沒有下降，從這棟當新起點，cur = 1。`);
      }
    };
  }

  function renderReset(stage) {
    const canvas = toolbar(stage, `<span class="chip">升高 = 新的起點</span>`);
    canvas.innerHTML = `
      ${skyline(SAMPLE1, { curL: 2, curR: 2, bestL: 0, bestR: 1 })}
      <p>剛走完 6→2（長度 2）。下一棟是 5，比 2 高，所以金色舊路徑收進 best，人站到 5 上重新開始。</p>`;
  }

  function animateScan(stage, canvas, h, runtime) {
    let timer;
    function stop() { clearInterval(timer); }
    runtime.onStop.push(stop);
    function run() {
      stop();
      let i = 0, cur = 1, best = 1, curL = 0, bestL = 0, bestR = 0;
      const paint = (msg) => {
        canvas.innerHTML = `
          <div class="hud"><span>走到第 <b>${i + 1}</b> 棟</span><span>cur=<b>${cur}</b></span><span>best=<b>${best}</b></span></div>
          ${skyline(h, { curL, curR: i, bestL, bestR })}
          <p style="margin:.5rem 0 0">${msg}</p>`;
        const sky = canvas.querySelector(".skyline");
        const bldg = canvas.querySelectorAll(".bldg")[i];
        if (sky && bldg) {
          const g = document.createElement("div");
          g.className = "glider";
          g.innerHTML = `<svg viewBox="0 0 28 18" aria-hidden="true"><polygon points="1,16 14,1 27,16 14,9" fill="oklch(0.86 0.14 145)"/></svg>`;
          g.style.left = `${bldg.offsetLeft + bldg.offsetWidth / 2 - 14}px`;
          g.style.top = `${Math.max(0, bldg.offsetTop - 20)}px`;
          sky.appendChild(g);
        }
      };
      paint("從左邊出發");
      if (runtime.reduced) {
        const res = longest(h);
        i = h.length - 1;
        cur = res.best;
        best = res.best;
        curL = res.bestL;
        bestL = res.bestL;
        bestR = res.bestR;
        paint(`走完了，最長 ${best} 棟。`);
        return;
      }
      timer = setInterval(() => {
        if (i >= h.length - 1) {
          stop();
          paint(`走完了，最長 ${best} 棟。`);
          return;
        }
        i += 1;
        if (h[i] < h[i - 1]) {
          cur += 1;
          if (cur > best) { best = cur; bestL = curL; bestR = i; }
          paint(`下降：${h[i - 1]} → ${h[i]}，cur=${cur}，best=${best}`);
        } else {
          cur = 1;
          curL = i;
          paint(`中斷：${h[i - 1]} → ${h[i]}，cur 回到 1`);
        }
      }, 700);
    }
    const btn = stage.querySelector("#play");
    if (btn) btn.onclick = run;
    canvas.innerHTML = `<div class="hud"><span>best=1</span><span>cur=1</span></div>${skyline(h, {})}
      <p style="margin:.5rem 0 0;color:var(--muted)">按播放，看掃描一步一步走。</p>`;
  }

  function renderSample1(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">輸出 3</span><div class="grow"></div><button class="accent" id="play" type="button">播放掃描</button>`);
    animateScan(stage, canvas, SAMPLE1, runtime);
  }

  function renderSample2(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">輸出 4　89 59 26 15</span><div class="grow"></div><button class="accent" id="play" type="button">播放掃描</button>`);
    animateScan(stage, canvas, SAMPLE2, runtime);
  }

  const O_IN = ["5", "6 2 5 3 1"];

  function idxBar(h, on) {
    return `<div class="idx-row">${h.map((_, i) => `<span class="${i === on ? "is-on" : ""}">h[${i}]</span>`).join("")}</div>`;
  }

  function renderPyIn(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "n = int(input())",
      "h = list(map(int, input().split()))",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines,
        hi: 0,
        stdin: O_IN,
        stdinAt: 0,
        vars: { n: "" },
        note: "第一行只有棟數。input() 吃到 \"5\"，int(...) 變成數字 5。",
      },
      {
        lines,
        hi: 0,
        stdin: O_IN,
        stdinAt: 1,
        vars: { n: 5 },
        glow: "n",
        note: "n 進盒子了。下一行才是樓高。",
      },
      {
        lines,
        hi: 1,
        stdin: O_IN,
        stdinAt: 1,
        vars: { n: 5, h: "" },
        visual: `<div class="split-row"><span class="split-tok">"6 2 5 3 1"</span><span class="split-arrow">split</span><span class="split-tok">"6"</span><span class="split-tok">"2"</span><span class="split-tok">"5"</span><span class="split-tok">"3"</span><span class="split-tok">"1"</span></div>`,
        note: "第二行有 5 個數字。先剪開，還是文字。",
      },
      {
        lines,
        hi: 1,
        stdin: O_IN,
        stdinAt: 2,
        vars: { n: 5, h: SAMPLE1 },
        glow: "h",
        visual: skyline(SAMPLE1, {}) + idxBar(SAMPLE1, 0),
        note: "list(map(int, ...)) 之後，h 就是 [6, 2, 5, 3, 1]。可以開始從左掃到右。",
      },
    ], runtime);
  }

  function renderPyIdx(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "for i in range(1, n):    # i = 1, 2, 3, 4",
      "    # 看 h[i] 跟 h[i-1]",
    ];
    const frames = [1, 2, 3, 4].map((i) => ({
      lines,
      hi: 0,
      vars: { i, "h[i]": SAMPLE1[i], "h[i-1]": SAMPLE1[i - 1] },
      glow: "i",
      visual: skyline(SAMPLE1, { curL: i - 1, curR: i }) + idxBar(SAMPLE1, i),
      note: i === 1
        ? "range(1, n) 從 1 開始，所以第一棟 h[0] 當起點，不進迴圈當「現在這棟」。"
        : `現在 i = ${i}，比較 h[${i}] = ${SAMPLE1[i]} 和左邊 h[${i - 1}] = ${SAMPLE1[i - 1]}。`,
    }));
    PyTeach.mountFrames(stage, canvas, frames, runtime);
  }

  function renderPyIf(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "if h[i] < h[i - 1]:",
      "    cur += 1            # 變矮，路可以延長",
      "else:",
      "    cur = 1             # 沒變矮，這條路斷了",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines,
        hi: 0,
        vars: { i: 1, "h[1]": 2, "h[0]": 6 },
        visual: skyline(SAMPLE1, { curL: 0, curR: 1 }),
        note: "2 < 6？是。下降，走進 if。",
      },
      {
        lines,
        hi: 1,
        vars: { cur: 2 },
        glow: "cur",
        visual: skyline(SAMPLE1, { curL: 0, curR: 1, bestL: 0, bestR: 1 }),
        note: "cur 從 1 變成 2。6→2 這條路現在長度 2。",
      },
      {
        lines,
        hi: 0,
        vars: { i: 2, "h[2]": 5, "h[1]": 2 },
        visual: skyline(SAMPLE1, { curL: 1, curR: 2, block: 2 }),
        note: "下一對：5 < 2？不是。升高，if 不成立。",
      },
      {
        lines,
        hi: 3,
        vars: { cur: 1 },
        glow: "cur",
        visual: skyline(SAMPLE1, { curL: 2, curR: 2, bestL: 0, bestR: 1 }),
        note: "走 else：cur 回到 1。best 還記得剛才的 2，不要清掉。",
      },
    ], runtime);
  }

  function renderPyCur(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 5</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "best = 1",
      "cur = 1",
      "for i in range(1, n):",
      "    if h[i] < h[i - 1]:",
      "        cur += 1",
      "        if cur > best:",
      "            best = cur",
      "    else:",
      "        cur = 1",
      "print(best)",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines,
        hi: 1,
        vars: { best: 1, cur: 1 },
        glow: "cur",
        visual: skyline(SAMPLE1, { curL: 0, curR: 0 }),
        note: "兩盒都從 1 開始。還沒比較以前，最長至少是「一棟」。",
      },
      {
        lines,
        hi: 6,
        vars: { i: 1, cur: 2, best: 2 },
        glow: "best",
        visual: skyline(SAMPLE1, { curL: 0, curR: 1, bestL: 0, bestR: 1 }),
        note: "6→2 下降，cur=2，比 best 大，best 更新成 2。",
      },
      {
        lines,
        hi: 8,
        vars: { i: 2, cur: 1, best: 2 },
        glow: "cur",
        visual: skyline(SAMPLE1, { curL: 2, curR: 2, bestL: 0, bestR: 1 }),
        note: "2→5 升高。cur 回到 1，best 仍是 2。",
      },
      {
        lines,
        hi: 6,
        vars: { i: 4, cur: 3, best: 3 },
        glow: "best",
        visual: skyline(SAMPLE1, { curL: 2, curR: 4, bestL: 2, bestR: 4 }),
        note: "5→3→1 連降兩次，cur=3，best 改成 3。這就是答案路徑。",
      },
      {
        lines,
        hi: 9,
        vars: { best: 3 },
        glow: "best",
        note: "迴圈結束，印出 best。輸出 3。",
      },
    ], runtime);
  }

  function renderPyFull(stage) {
    const canvas = toolbar(stage, `<span class="chip">可提交</span><div class="grow"></div><button class="ghost" id="copy" type="button">複製程式</button>`);
    const code = `n = int(input())
h = list(map(int, input().split()))

best = 1
cur = 1

for i in range(1, n):
    if h[i] < h[i - 1]:
        cur += 1
        if cur > best:
            best = cur
    else:
        cur = 1

print(best)`;
    canvas.innerHTML = `${PyTeach.codeBlock(code.split("\n"), -1)}
      <p class="py-note">讀入 → 兩個盒子從 1 起跳 → 只跟左邊比 → 變矮就加長，否則回到 1 → 印 best。</p>`;
    PyTeach.copyBtn(stage, code);
  }

  function renderPlay(stage) {
    let h = SAMPLE1.slice();
    const canvas = toolbar(stage, `
      <button class="ghost" type="button" id="s1">範例一</button>
      <button class="ghost" type="button" id="s2">範例二</button>
      <div class="grow"></div>
      <span class="chip" id="ans">最長 3</span>
    `);
    function layout() {
      canvas.innerHTML = `<div class="sky-out"></div>
        <div class="play-heights">${h.map((v, i) => `
          <label>第 ${i + 1} 棟
            <input type="number" min="1" max="1000" value="${v}" data-i="${i}" aria-label="第 ${i + 1} 棟高度">
          </label>`).join("")}</div>`;
      canvas.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("change", () => {
          const n = Math.max(1, Math.min(1000, +inp.value || 1));
          h[+inp.dataset.i] = n;
          inp.value = n;
          refresh();
        });
      });
      refresh();
    }
    function refresh() {
      const res = longest(h);
      canvas.querySelector(".sky-out").innerHTML = skyline(h, { bestL: res.bestL, bestR: res.bestR, dimOthers: true });
      stage.querySelector("#ans").textContent = `最長 ${res.best}`;
    }
    stage.querySelector("#s1").onclick = () => { h = SAMPLE1.slice(); layout(); };
    stage.querySelector("#s2").onclick = () => { h = SAMPLE2.slice(); layout(); };
    layout();
  }

  window.Lessons = window.Lessons || {};
  window.Lessons.o076 = Lesson;
})();
