(function () {
  const steps = [
    {
      id: "story",
      title: "操場上有一盞燈",
      teach: `
        <p>想像操場起跑線上，立著一盞紅綠燈。它不會亂亮：</p>
        <ul>
          <li>先亮<strong>綠燈 a 秒</strong></li>
          <li>再亮<strong>紅燈 b 秒</strong></li>
          <li>然後又綠、又紅，一直循環</li>
        </ul>
        <p>有 n 個小朋友，綠燈一開始就一起騎腳踏車。每個人騎完一圈的時間不一樣。</p>
        <p>規則只有一句：<strong>騎到終點時如果是紅燈，不能停，要等到變回綠燈才算結束。</strong></p>
        <p>題目要的答案是：大家加起來，一共等了幾秒紅燈。</p>
      `,
    },
    {
      id: "cycle",
      title: "燈是一段一段循環的",
      teach: `
        <p>先不要想小朋友。只看燈。</p>
        <p>下面這條色帶，每一小格是 1 秒。綠色格子是綠燈，紅色格子是紅燈。</p>
        <p>按播放，看燈怎麼一段綠、一段紅地走。你可以改 a 和 b，色帶會跟著變。</p>
        <div class="note"><strong>記住一個詞：週期</strong>週期 = 綠燈秒數 + 紅燈秒數 = a + b。走完一個週期，燈又從頭開始。</div>
      `,
    },
    {
      id: "ride",
      title: "一個小朋友騎到終點",
      teach: `
        <p>現在放進一個人。範例一：綠 10 秒、紅 10 秒，他騎一圈要 14 秒。</p>
        <p>車子從左邊出發，終點在右邊那盞燈下面。時間走到 14 秒時，看燈是什麼顏色。</p>
        <p>14 秒落在紅燈裡，所以他還不能停，要等到綠燈再亮。</p>
        <p>從第 14 秒等到第 20 秒，一共等 <strong>6 秒</strong>。這就是範例一的答案。</p>
      `,
    },
    {
      id: "modulo",
      title: "時間太長時，把它折起來",
      teach: `
        <p>如果有人騎了 34 秒呢？難道要畫 34 格來對燈嗎？不用。</p>
        <p>燈每 20 秒重複一次。34 = 20 + 14，等於「繞完一圈週期，又走到第 14 秒那個位置」。</p>
        <p>所以 34 秒看到的燈，跟 14 秒一模一樣。</p>
        <div class="note"><strong>餘數就是「折起來之後剩幾秒」</strong>
        Python 寫成 <code>r = t % (a + b)</code>。<code>%</code> 讀作「取餘數」：拿騎車秒數去除以週期，看剩下多少。</div>
        <p>不管騎多久，只要算出 r，就回到「第一個週期」裡看燈。</p>
      `,
    },
    {
      id: "judge",
      title: "怎麼判斷要不要等",
      teach: `
        <p>把一個週期攤開，從 0 數到 a+b−1：</p>
        <ul>
          <li>r 在 0、1、2 … 一直到 a−1 → 綠燈 → 等 0 秒</li>
          <li>r 在 a、a+1 … 一直到週期結束 → 紅燈 → 還要等「週期 − r」秒</li>
        </ul>
        <p>等「週期 − r」是什麼意思？因為下一次綠燈會在這個週期的盡頭出現。現在站在 r，走到盡頭還有週期減 r 步。</p>
        <pre class="eq"><span class="kw">if</span> r &lt; a:
    wait = <span class="num">0</span>      <span class="cm"># 綠燈，直接停</span>
<span class="kw">else</span>:
    wait = period - r  <span class="cm"># 紅燈，等到這一輪結束</span></pre>
      `,
    },
    {
      id: "edge",
      title: "剛好踩到紅燈開始",
      teach: `
        <p>題目特別寫了一句：騎到終點時如果紅燈剛好開始，就要再等 b 秒。</p>
        <p>那就是 r 剛好等於 a 的時候。燈從綠轉紅的那一瞬間，算紅燈。</p>
        <p>所以判斷要寫 <code>r &gt;= a</code>，等於也算進去。不要寫成 <code>r &gt; a</code>，會少算這個邊界。</p>
        <p>另外兩個常見位置：</p>
        <ul>
          <li>r = 0：剛好處在新的綠燈開始，等 0</li>
          <li>r = a+b−1：紅燈最後一秒，再等 1 秒就綠了</li>
        </ul>
      `,
    },
    {
      id: "many",
      title: "很多人就加起來",
      teach: `
        <p>每個小朋友的等待時間互不相干。甲等 2 秒不會讓乙少等。</p>
        <p>所以程式的工作很單純：對每一個騎車時間算一次等待，再全部加總。</p>
        <p>範例二有三個人，綠 4 秒、紅 3 秒，週期 7 秒。下面把三個人分開算，最後加起來是 5。</p>
      `,
    },
    {
      id: "sample1",
      title: "把範例一逐步對一次",
      teach: `
        <p>輸入長這樣：</p>
        <pre class="eq">10 10
1
14</pre>
        <p>第一行是綠、紅。第二行是人數。第三行是每個人的秒數。</p>
        <p>右邊動畫會一秒一秒走。走到 14 停在紅燈，再補 6 秒等到 20。輸出 6。</p>
      `,
    },
    {
      id: "sample2",
      title: "把範例二三個人拆開",
      teach: `
        <p>輸入：</p>
        <pre class="eq">4 3
3
12 16 25</pre>
        <p>週期 = 7。點「下一位」看每一個人的餘數落在哪裡。</p>
        <ul>
          <li>12 % 7 = 5，5 ≥ 4，等 2 秒</li>
          <li>16 % 7 = 2，2 &lt; 4，等 0 秒</li>
          <li>25 % 7 = 4，4 ≥ 4，等 3 秒</li>
        </ul>
        <p>2 + 0 + 3 = <strong>5</strong>。</p>
      `,
    },
    {
      id: "pyin",
      title: "input() 一次只讀一行",
      teach: `
        <p>ZeroJudge 不會讓你用滑鼠點數字。它把範例當成「鍵盤打進來的文字」，一次給你一行。</p>
        <p><code>input()</code> 的工作很死板：<strong>每次呼叫，吃掉目前還沒讀的那一行</strong>，得到的是字串，例如 <code>"10 10"</code>，還不是兩個整數。</p>
        <p>範例一有三行，所以後面會呼叫三次 input。按「下一步程式」，看評測機的紙一張一張被吃掉。</p>
      `,
    },
    {
      id: "pysplit",
      title: "一行裡有好幾個數字",
      teach: `
        <p>第一行是 <code>10 10</code>，中間有空格。我們要把它拆成綠燈 a、紅燈 b。</p>
        <ul>
          <li><code>split()</code>：看到空格就剪開，變成 <code>["10", "10"]</code></li>
          <li><code>map(int, ...)</code>：每一段都變成真正的整數 10</li>
          <li><code>a, b = ...</code>：左邊第一個給 a，第二個給 b</li>
        </ul>
        <p>人數只有一個數字，所以 <code>n = int(input())</code> 就夠了。第三行有好幾個時間，要用 <code>list(...)</code> 收成一排，後面才能用迴圈走。</p>
        <div class="note"><strong>這三行請當口訣</strong>一行兩個數、一行一個數、一行很多數，APCS 幾乎每題都這樣讀。</div>
      `,
    },
    {
      id: "pymod",
      title: "為什麼要用 %",
      teach: `
        <p><code>%</code> 不是百分比。它叫<strong>取餘數</strong>：能裝幾整袋就裝幾整袋，看袋子外面還剩幾顆。</p>
        <p>燈每 <code>period = a + b</code> 秒重複一次。騎了 t 秒，我們不在乎繞了幾圈，只在乎「這一圈走到第幾秒」。那正好就是 <code>t % period</code>。</p>
        <p>14 % 20 = 14（還沒滿一袋）。34 % 20 = 14（裝走 1 袋，剩下 14）。兩個人看到的燈一樣，所以程式只要寫一行 <code>r = t % period</code>。</p>
      `,
    },
    {
      id: "pyif",
      title: "if：這次要不要等",
      teach: `
        <p>餘數 r 算好以後，只要問一件事：它有沒有走到紅燈區？</p>
        <p>綠燈佔 0 到 a−1。所以 <code>r &gt;= a</code> 就是紅燈（連「剛好等於 a、紅燈剛亮」也算進去）。</p>
        <p>紅燈的話，等到這一輪結束還要 <code>period - r</code> 秒。綠燈就什麼都不加。</p>
        <p>為什麼不寫 <code>wait = ...</code> 再加？可以直接 <code>total += period - r</code>，少一個變數，意思一樣。</p>
      `,
    },
    {
      id: "pyfor",
      title: "for：對每一個人算一次",
      teach: `
        <p><code>for t in times:</code> 的意思是：把那一排時間，從左到右，每一次把其中一個叫做 t。</p>
        <p>迴圈裡面只做三件事：取餘數 → 若是紅燈就累加 → 換下一個人。甲的等待不會改到乙的 t。</p>
        <p>開始前 <code>total = 0</code> 一定要寫，不然沒有盒子可以往裡加。最後 <code>print(total)</code> 把加總印出來，後面不要多空格或多行。</p>
      `,
    },
    {
      id: "pyfull",
      title: "把程式拼起來",
      teach: `
        <p>上面每一段對到一行，就是完整答案。先讀資料，再算週期，再迴圈，最後印。</p>
        <p>按「下一步程式」從上看到下。看熟以後按複製，貼到 ZeroJudge 即可。</p>
      `,
    },
    {
      id: "play",
      title: "自己改數字試試看",
      teach: `
        <p>改綠燈、紅燈、騎車秒數，看動畫和答案一起變。先猜「會不會等」，再按播放核對。</p>
        <p>想清楚這件事就可以交卷：<strong>先把時間折進一個週期，再看折完後站在綠帶還是紅帶。</strong></p>
      `,
    },
  ];

  function waitOf(t, a, b) {
    const period = a + b;
    const r = t % period;
    return r >= a ? period - r : 0;
  }

  function colorAt(sec, a, b) {
    const r = sec % (a + b);
    return r < a ? "green" : "red";
  }

  function tapeHTML(a, b, cycles, now) {
    const period = a + b;
    const total = Math.min(period * cycles, 40);
    let html = `<div class="tape" role="img" aria-label="綠燈 ${a} 秒、紅燈 ${b} 秒的時間帶">`;
    for (let i = 0; i < total; i++) {
      const cls = colorAt(i, a, b) === "green" ? "g" : "r";
      const nowCls = now === i ? " now" : "";
      html += `<div class="cell ${cls}${nowCls}">${i + 1 <= 24 ? i : ""}</div>`;
    }
    html += `</div>`;
    return html;
  }

  function lightHTML(color) {
    return `<div class="light" aria-hidden="true">
      <div class="bulb ${color === "red" ? "on-red" : ""}"></div>
      <div class="bulb ${color === "green" ? "on-green" : ""}"></div>
    </div>`;
  }

  function bikeSVG() {
    return `<svg class="bike" viewBox="0 0 70 44" aria-hidden="true">
      <circle cx="16" cy="32" r="10" fill="none" stroke="oklch(0.38 0.14 294)" stroke-width="3"/>
      <circle cx="52" cy="32" r="10" fill="none" stroke="oklch(0.38 0.14 294)" stroke-width="3"/>
      <path d="M16 32 L30 18 H46 L52 32 M30 18 L24 32 M38 18 V10" fill="none" stroke="oklch(0.72 0.15 85)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  function clockSVG(a, b, r, showNeedle) {
    const period = a + b;
    const gAng = (a / period) * 360;
    const R = 42;
    const toXY = (ang, rad) => {
      const t = ((ang - 90) * Math.PI) / 180;
      return [50 + rad * Math.cos(t), 50 + rad * Math.sin(t)];
    };
    const [gx, gy] = toXY(gAng, R);
    const large = gAng > 180 ? 1 : 0;
    const needleAng = (r / period) * 360;
    const [nx, ny] = toXY(needleAng, 34);
    return `<svg class="clock" viewBox="0 0 100 100" role="img" aria-label="一個週期的圓盤">
      <circle cx="50" cy="50" r="42" fill="oklch(0.58 0.19 25)"/>
      <path d="M50 50 L50 8 A42 42 0 ${large} 1 ${gx} ${gy} Z" fill="oklch(0.62 0.16 145)"/>
      <circle cx="50" cy="50" r="18" fill="oklch(1 0 0)"/>
      ${showNeedle ? `<line x1="50" y1="50" x2="${nx}" y2="${ny}" stroke="oklch(0.22 0.05 294)" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${nx}" cy="${ny}" r="4" fill="oklch(0.72 0.15 85)"/>` : ""}
      <text x="50" y="54" text-anchor="middle" font-size="9" fill="oklch(0.22 0.05 294)" font-family="Martian Mono, monospace">r=${r}</text>
    </svg>`;
  }

  const Lesson = {
    id: "q181",
    title: "等紅綠燈",
    problem: "q181",
    url: "https://zerojudge.tw/ShowProblem?problemid=q181",
    steps,
    mount(stage, step, runtime) {
      const id = steps[step].id;
      const draw = {
        story: renderStory,
        cycle: renderCycle,
        ride: renderRide,
        modulo: renderModulo,
        judge: renderJudge,
        edge: renderEdge,
        many: renderMany,
        sample1: renderSample1,
        sample2: renderSample2,
        pyin: renderPyIn,
        pysplit: renderPySplit,
        pymod: renderPyMod,
        pyif: renderPyIf,
        pyfor: renderPyFor,
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
      <div style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(180px,.8fr);gap:1rem;align-items:center">
        <img src="assets/q181-hero.jpg" alt="剪紙：操場起跑線上的紅綠燈與腳踏車" width="800" height="600" style="width:100%;height:min(280px,36vh);object-fit:cover">
        <div>
          ${lightHTML("green")}
          <p style="margin:.8rem 0 0;color:var(--muted);font-size:.95rem">綠燈開始時一起出發。終點遇到紅燈，就要繼續等到綠。</p>
        </div>
      </div>`;
  }

  function renderCycle(stage, runtime) {
    let a = 4, b = 3, now = 0, playing = false, timer;
    const canvas = toolbar(stage, `
      <div class="controls">
        <label class="field"><span>綠燈 a 秒</span><input id="a" type="number" min="1" max="12" value="4"></label>
        <label class="field"><span>紅燈 b 秒</span><input id="b" type="number" min="1" max="12" value="3"></label>
      </div>
      <div class="grow"></div>
      <button class="accent" type="button" id="play">播放</button>
    `);

    function paint() {
      const color = colorAt(now, a, b);
      canvas.innerHTML = `
        <div class="hud">
          <span>現在第 <b>${now}</b> 秒</span>
          <span>燈：<b>${color === "green" ? "綠燈" : "紅燈"}</b></span>
          <span>週期 <b>${a + b}</b> 秒</span>
        </div>
        <div style="display:flex;gap:1.2rem;align-items:center;margin:1rem 0">
          ${lightHTML(color)}
          <div style="flex:1">${tapeHTML(a, b, 3, now)}</div>
        </div>
        <div class="legend"><span><i class="swatch g"></i>綠燈（可停）</span><span><i class="swatch r"></i>紅燈（要等）</span></div>
      `;
    }

    function stop() {
      playing = false;
      clearInterval(timer);
      const btn = stage.querySelector("#play");
      if (btn) btn.textContent = "播放";
    }

    stage.querySelector("#play").onclick = () => {
      if (playing) { stop(); return; }
      playing = true;
      stage.querySelector("#play").textContent = "暫停";
      timer = setInterval(() => {
        now = (now + 1) % ((a + b) * 3);
        paint();
      }, runtime.reduced ? 10000 : 380);
    };
    stage.querySelector("#a").oninput = (e) => { a = Math.max(1, +e.target.value || 1); now = 0; paint(); };
    stage.querySelector("#b").oninput = (e) => { b = Math.max(1, +e.target.value || 1); now = 0; paint(); };
    runtime.onStop.push(stop);
    paint();
  }

  function rideScene(a, b, t, time) {
    const period = a + b;
    const wait = waitOf(t, a, b);
    const clamped = Math.min(time, t + wait);
    const moving = Math.min(clamped, t);
    const pct = (moving / t) * 92;
    const color = colorAt(clamped, a, b);
    const waiting = clamped >= t && wait > 0 && clamped < t + wait;
    return `
      <div class="hud">
        <span>時間 <b>${clamped}</b> / ${t + wait}</span>
        <span>燈：<b>${color === "green" ? "綠燈" : "紅燈"}</b></span>
        <span>等待 <b>${wait}</b> 秒</span>
      </div>
      <div class="track-scene">
        ${bikeSVG()}
        <div class="road"></div>
        <div class="finish-light">${lightHTML(color)}</div>
        <div style="position:absolute;left:4%;bottom:8px;font-size:.8rem;color:var(--muted)">起點</div>
        <div style="position:absolute;right:4%;bottom:8px;font-size:.8rem;color:var(--muted)">${waiting ? "終點等待中" : "終點"}</div>
      </div>
      ${tapeHTML(a, b, Math.ceil((t + wait + 1) / period) || 1, clamped)}
    `;
  }

  function playRide(stage, canvas, a, b, t, runtime) {
    let time = 0;
    const wait = waitOf(t, a, b);
    const bike = () => canvas.querySelector(".bike");
    function paint() {
      canvas.innerHTML = rideScene(a, b, t, time);
      const el = bike();
      if (el) el.style.left = 4 + (Math.min(time, t) / Math.max(t, 1)) * 84 + "%";
    }
    function stop() { clearInterval(stage._rideTimer); }
    runtime.onStop.push(stop);
    stop();
    paint();
    const playBtn = stage.querySelector("#play");
    if (playBtn) {
      playBtn.onclick = () => {
        stop();
        time = 0;
        paint();
        if (runtime.reduced) {
          time = t + wait;
          paint();
          return;
        }
        stage._rideTimer = setInterval(() => {
          time += 1;
          paint();
          if (time >= t + wait) stop();
        }, 280);
      };
    }
  }

  function renderRide(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">a=10　b=10　t=14</span><div class="grow"></div><button class="accent" id="play" type="button">播放騎車</button>`);
    playRide(stage, canvas, 10, 10, 14, runtime);
  }

  function renderModulo(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">34 % 20 = 14</span><div class="grow"></div><button class="accent" id="play" type="button">看折疊</button>`);
    const a = 10, b = 10, period = 20;
    function paint(mode) {
      const long = tapeHTML(a, b, 2, mode === "folded" ? 14 : 34 % 40);
      canvas.innerHTML = `
        <p style="margin:0 0 .6rem;color:var(--muted)">上面是 0 到 39 秒。34 秒那一格，折進第一個週期後，會跟 14 秒重疊。</p>
        ${long}
        <div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:center">
          ${clockSVG(a, b, 14, true)}
          <p style="margin:0">圓盤只畫一個週期。指針停在 r = 14，已經進入紅帶，所以要等 6 秒走到圓盤頂端（下一次綠燈）。</p>
        </div>
      `;
      if (mode === "folded") {
        const cells = canvas.querySelectorAll(".cell");
        [14, 34].forEach((i) => { if (cells[i]) cells[i].classList.add("now"); });
      }
    }
    paint("long");
    stage.querySelector("#play").onclick = () => paint("folded");
  }

  function renderJudge(stage) {
    const canvas = toolbar(stage, `<span class="chip">一個週期切成兩段</span>`);
    const a = 10, b = 10, r = 14, period = 20;
    canvas.innerHTML = `
      <div style="display:grid;grid-template-columns:220px 1fr;gap:1.2rem;align-items:center">
        ${clockSVG(a, b, r, true)}
        <div>
          ${tapeHTML(a, b, 1, r)}
          <div class="hud" style="margin-top:.8rem">
            <span>r = <b>${r}</b></span>
            <span>${r} ≥ ${a} → 紅燈</span>
            <span>wait = ${period} − ${r} = <b>${period - r}</b></span>
          </div>
        </div>
      </div>`;
  }

  function renderEdge(stage) {
    const canvas = toolbar(stage, `<span class="chip">a=10　b=10　週期 20</span>`);
    const cases = [
      { t: 20, name: "r = 0　綠燈剛開始" },
      { t: 9, name: "r = 9　綠燈最後一秒" },
      { t: 10, name: "r = 10　紅燈剛開始（要等 10）" },
      { t: 19, name: "r = 19　紅燈最後一秒（要等 1）" },
    ];
    canvas.innerHTML = cases.map((c) => {
      const a = 10, b = 10;
      const r = c.t % 20;
      const w = waitOf(c.t, a, b);
      return `<div class="kid-row">
        <div>${c.name.split("　")[0]}</div>
        <div>${tapeHTML(a, b, 1, r)}</div>
        <div>等 ${w} 秒<br><small style="color:var(--muted)">${c.name.split("　")[1] || ""}</small></div>
      </div>`;
    }).join("");
  }

  function renderMany(stage) {
    const canvas = toolbar(stage, `<span class="chip">範例二　4 3　12 16 25</span>`);
    const a = 4, b = 3, times = [12, 16, 25];
    const period = 7;
    canvas.innerHTML = `<div class="kids">${times.map((t, i) => {
      const r = t % period;
      const w = waitOf(t, a, b);
      return `<div class="kid-row">
        <div>第 ${i + 1} 人<br><small>${t} 秒</small></div>
        <div>
          ${tapeHTML(a, b, 1, r)}
          <small style="color:var(--muted)">${t} % 7 = ${r}　${r >= a ? "紅燈" : "綠燈"}</small>
        </div>
        <div>等 <b>${w}</b> 秒</div>
      </div>`;
    }).join("")}</div>
    <p style="margin:.8rem 0 0">總等待 = 2 + 0 + 3 = <b>5</b></p>`;
  }

  function renderSample1(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip">範例輸出 6</span><div class="grow"></div><button class="accent" id="play" type="button">一秒一秒看</button>`);
    playRide(stage, canvas, 10, 10, 14, runtime);
  }

  function renderSample2(stage) {
    let i = 0;
    const times = [12, 16, 25];
    const canvas = toolbar(stage, `<span class="chip" id="who">第 1 人</span><div class="grow"></div><button class="accent" id="play" type="button">下一位</button>`);
    function paint() {
      const t = times[i];
      const r = t % 7;
      const w = waitOf(t, 4, 3);
      canvas.innerHTML = `
        <div class="hud"><span>t=<b>${t}</b></span><span>r=<b>${r}</b></span><span>wait=<b>${w}</b></span></div>
        <div style="display:grid;grid-template-columns:200px 1fr;gap:1rem;align-items:center;margin-top:.8rem">
          ${clockSVG(4, 3, r, true)}
          ${tapeHTML(4, 3, 1, r)}
        </div>`;
      stage.querySelector("#who").textContent = `第 ${i + 1} 人　t=${t}`;
    }
    stage.querySelector("#play").onclick = () => { i = (i + 1) % 3; paint(); };
    paint();
  }

  const PY_IN = ["10 10", "1", "14"];
  const PY_LINES_IN = [
    "line1 = input()          # 先只讀字串",
    "n_text = input()",
    "times_text = input()",
  ];

  function renderPyIn(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    PyTeach.mountFrames(stage, canvas, [
      {
        lines: PY_LINES_IN,
        hi: 0,
        stdin: PY_IN,
        stdinAt: 0,
        vars: { line1: "" },
        glow: "line1",
        note: "程式停在 input()，等評測機把第 1 行送進來。",
      },
      {
        lines: PY_LINES_IN,
        hi: 0,
        stdin: PY_IN,
        stdinAt: 1,
        vars: { line1: "10 10" },
        glow: "line1",
        note: "第 1 行被吃掉了。得到的是字串 \"10 10\"，中間那個空格還在，還不是兩個整數。",
      },
      {
        lines: PY_LINES_IN,
        hi: 1,
        stdin: PY_IN,
        stdinAt: 2,
        vars: { line1: "10 10", n_text: "1" },
        glow: "n_text",
        note: "再呼叫一次 input()，吃掉第 2 行。每次都只吃一行，不會一次讀完全部。",
      },
      {
        lines: PY_LINES_IN,
        hi: 2,
        stdin: PY_IN,
        stdinAt: 3,
        vars: { line1: "10 10", n_text: "1", times_text: "14" },
        glow: "times_text",
        note: "三行都讀完。真正交卷時不會 print 這些字串，下一步才會把它們變成數字。",
      },
    ], runtime);
  }

  function renderPySplit(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 5</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "a, b = map(int, input().split())",
      "n = int(input())",
      "times = list(map(int, input().split()))",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines,
        hi: 0,
        stdin: PY_IN,
        stdinAt: 0,
        vars: { a: "", b: "" },
        visual: `<div class="split-row"><span class="split-tok">"10 10"</span><span class="split-arrow">split</span><span class="split-tok">"10"</span><span class="split-tok">"10"</span></div>`,
        note: "split() 先把字串沿空格剪開。現在還是文字，不能拿來加減。",
      },
      {
        lines,
        hi: 0,
        stdin: PY_IN,
        stdinAt: 1,
        vars: { a: 10, b: 10 },
        glow: "a",
        visual: `<div class="split-row"><span class="split-tok">int("10") → 10</span><span class="split-tok">int("10") → 10</span><span class="split-arrow">=</span><span class="split-tok">a</span><span class="split-tok">b</span></div>`,
        note: "map(int, ...) 把每一段變成整數，再依序裝進 a 和 b。",
      },
      {
        lines,
        hi: 1,
        stdin: PY_IN,
        stdinAt: 2,
        vars: { a: 10, b: 10, n: 1 },
        glow: "n",
        note: "第 2 行只有一個人數，直接 int(input())，不必 split。",
      },
      {
        lines,
        hi: 2,
        stdin: PY_IN,
        stdinAt: 2,
        vars: { a: 10, b: 10, n: 1, times: "" },
        visual: `<div class="split-row"><span class="split-tok">"14"</span><span class="split-arrow">list(map(int,…))</span></div>`,
        note: "第三行可能有很多個時間。list(...) 把它們收成一排，即使現在只有一個 14。",
      },
      {
        lines,
        hi: 2,
        stdin: PY_IN,
        stdinAt: 3,
        vars: { a: 10, b: 10, n: 1, times: [14] },
        glow: "times",
        note: "讀入結束。a、b、n、times 都是數字了，可以開始算。",
      },
    ], runtime);
  }

  function renderPyMod(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "period = a + b          # 10 + 10 = 20",
      "r = t % period          # 餘數",
      "# 14 % 20 → 14",
      "# 34 % 20 → 14   同一盞燈",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines,
        hi: 0,
        vars: { a: 10, b: 10, period: 20 },
        glow: "period",
        note: "週期先算好，放進盒子。後面取餘數都用同一個數字，不要每次重寫 a+b。",
      },
      {
        lines,
        hi: 1,
        vars: { t: 14, period: 20, r: 14 },
        glow: "r",
        visual: PyTeach.remainderDots(14, 20),
        note: "14 還裝不滿一袋 20，剩下全部 14。所以落在第一圈的第 14 秒。",
      },
      {
        lines,
        hi: 3,
        vars: { t: 34, period: 20, r: 14 },
        glow: "r",
        visual: PyTeach.remainderDots(34, 20),
        note: "34 可以裝走 1 袋（20），剩下 14。燈跟騎 14 秒時一模一樣。",
      },
      {
        lines,
        hi: 1,
        vars: { t: 34, period: 20, r: 14 },
        glow: "r",
        visual: clockSVG(10, 10, 14, true),
        note: "所以程式不必畫 34 格，只要 r = t % period，再拿 r 去對第一圈的燈。",
      },
    ], runtime);
  }

  function renderPyIf(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 4</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "if r >= a:",
      "    total += period - r     # 紅燈，要等",
      "# r < a 時什麼都不做         # 綠燈，等 0",
    ];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines,
        hi: 0,
        vars: { a: 10, period: 20, r: 14 },
        glow: "r",
        visual: tapeHTML(10, 10, 1, 14),
        note: "14 ≥ 10？是。站在紅帶裡（連剛好 10 也算紅燈）。",
      },
      {
        lines,
        hi: 1,
        vars: { r: 14, period: 20, wait: 6, total: 6 },
        glow: "total",
        visual: tapeHTML(10, 10, 1, 14),
        note: "等到這一輪結束：20 − 14 = 6。把 6 加進 total。",
      },
      {
        lines,
        hi: 2,
        vars: { r: 2, a: 4, wait: 0, total: 0 },
        glow: "wait",
        visual: tapeHTML(4, 3, 1, 2),
        note: "換範例二第二個人：16 % 7 = 2，2 ≥ 4？不是。綠燈，if 不進去，total 不加。",
      },
      {
        lines,
        hi: 0,
        vars: { r: 10, a: 10, wait: 10 },
        glow: "r",
        visual: tapeHTML(10, 10, 1, 10),
        note: "邊界：r 剛好等於 a。要用 >= 不是 >，否則紅燈剛亮會被誤判成綠燈。",
      },
    ], runtime);
  }

  function renderPyFor(stage, runtime) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / 5</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    const lines = [
      "total = 0",
      "for t in times:          # 12, 然後 16, 然後 25",
      "    r = t % period",
      "    if r >= a:",
      "        total += period - r",
      "print(total)",
    ];
    const stdin = ["4 3", "3", "12 16 25"];
    PyTeach.mountFrames(stage, canvas, [
      {
        lines,
        hi: 0,
        stdin,
        stdinAt: 3,
        vars: { a: 4, b: 3, period: 7, times: [12, 16, 25], total: 0 },
        glow: "total",
        note: "加總盒先清成 0。忘記這行，後面 += 會出錯。",
      },
      {
        lines,
        hi: 4,
        vars: { t: 12, r: 5, total: 2 },
        glow: "total",
        visual: tapeHTML(4, 3, 1, 5),
        note: "第一人 12 % 7 = 5，紅燈，加 2。total 變成 2。",
      },
      {
        lines,
        hi: 3,
        vars: { t: 16, r: 2, total: 2 },
        glow: "t",
        visual: tapeHTML(4, 3, 1, 2),
        note: "第二人 16 % 7 = 2，綠燈，if 不進去。total 仍是 2。",
      },
      {
        lines,
        hi: 4,
        vars: { t: 25, r: 4, total: 5 },
        glow: "total",
        visual: tapeHTML(4, 3, 1, 4),
        note: "第三人 25 % 7 = 4，剛好紅燈開始，加 3。total 變成 5。",
      },
      {
        lines,
        hi: 5,
        vars: { total: 5 },
        glow: "total",
        note: "迴圈結束，印出 5。這就是範例二的輸出。",
      },
    ], runtime);
  }

  function renderPyFull(stage) {
    const canvas = toolbar(stage, `<span class="chip">可提交</span><div class="grow"></div><button class="ghost" id="copy" type="button">複製程式</button>`);
    const code = `a, b = map(int, input().split())
n = int(input())
times = list(map(int, input().split()))

period = a + b
total = 0

for t in times:
    r = t % period
    if r >= a:
        total += period - r

print(total)`;
    canvas.innerHTML = `${PyTeach.codeBlock(code.split("\n"), -1)}
      <p class="py-note">讀入 → 週期 → 迴圈裡取餘數、遇紅燈就加 → 印出。沒有用到的 n 也要讀掉，否則下一行會讀錯。</p>`;
    PyTeach.copyBtn(stage, code);
  }

  function renderPlay(stage, runtime) {
    const canvas = toolbar(stage, `
      <div class="controls">
        <label class="field"><span>綠 a</span><input id="a" type="number" min="1" max="20" value="10"></label>
        <label class="field"><span>紅 b</span><input id="b" type="number" min="1" max="20" value="10"></label>
        <label class="field"><span>騎車 t</span><input id="t" type="number" min="1" max="80" value="14"></label>
      </div>
      <div class="grow"></div>
      <button class="accent" id="play" type="button">播放</button>
    `);
    const read = () => ({
      a: Math.max(1, +stage.querySelector("#a").value || 1),
      b: Math.max(1, +stage.querySelector("#b").value || 1),
      t: Math.max(1, +stage.querySelector("#t").value || 1),
    });
    function bind() {
      const { a, b, t } = read();
      playRide(stage, canvas, a, b, t, runtime);
    }
    ["a", "b", "t"].forEach((id) => {
      stage.querySelector("#" + id).onchange = bind;
    });
    bind();
  }

  window.Lessons = window.Lessons || {};
  window.Lessons.q181 = Lesson;
})();
