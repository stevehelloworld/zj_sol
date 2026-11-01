(function () {
  const K = () => window.IfKit;

  function hud(parts) {
    return `<div class="hud">${parts.map((p) => `<span>${p}</span>`).join("")}</div>`;
  }

  function note(s) {
    return `<p class="py-note">${s}</p>`;
  }

  function reg(spec) {
    window.Lessons = window.Lessons || {};
    window.Lessons[spec.id] = {
      id: spec.id,
      title: spec.title,
      problem: spec.id,
      url: "https://zerojudge.tw/ShowProblem?problemid=" + spec.id,
      steps: spec.steps.map((s) => ({ id: s.id, title: s.title, teach: s.teach })),
      mount(stage, i, runtime) {
        spec.steps[i].draw(stage, runtime);
      },
    };
  }

  /* ——— r937 分糖果 ——— */
  const BAGS = [5, 9, 13, 13, 6, 8, 10, 8, 12, 11];

  function candy(a, m) {
    const k = Math.max(...a);
    const keep = a.indexOf(k);
    const left = a.reduce((s, x) => s + x, 0) - k;
    const share = Math.floor(left / m);
    let r = left % m;
    const over = r * 2 > m;
    if (over) r = m - r;
    return { k, keep, left, share, r, over };
  }

  function bags(a, keep) {
    const mx = Math.max(1, ...a);
    const bits = a.map((n, i) => `第${i + 1}包 ${n}${i === keep ? " 老師留下" : ""}`);
    return `<div class="ap-price" role="img" aria-label="${bits.join("，")}">
      ${a.map((n, i) => `<div class="ap-px ${i === keep ? "is-buy" : ""}"><div class="ap-px-bar" style="height:${20 + (n / mx) * 100}px">${n}</div><small>${i + 1}${i === keep ? " 留" : ""}</small></div>`).join("")}
    </div>`;
  }

  const R937 = [
    "n, m = map(int, input().split())",
    "a = list(map(int, input().split()))",
    "k = max(a)",
    "left = sum(a) - k",
    "share = left // m",
    "r = left % m",
    "if r * 2 > m:",
    "    r = m - r",
    "print(k, share, r)",
  ];

  reg({
    id: "r937",
    title: "分糖果",
    steps: [
      {
        id: "story",
        title: "最多的一包留給老師",
        teach: `<p>n 包糖果，m 個學生。老師先把糖果最多的那 1 包留下來自己用。</p>
          <p>剩下的倒在一起，每人拿一樣多。輸出三個數：老師留下的顆數 K、每人拿到的顆數 A、最後那個餘數 R。</p>`,
        draw(stage) {
          const t = candy(BAGS, 8);
          const canvas = K().toolbar(stage, `<span class="chip">留一包</span>`);
          canvas.innerHTML = bags(BAGS, t.keep) + hud(["K=" + t.k, "學生共 " + t.left, "8 人"]);
        },
      },
      {
        id: "one",
        title: "最多有兩包，只留一包",
        teach: `<p>範例裡有兩包都是 13。老師只留其中 1 包，另一包 13 仍然倒給學生。</p>
          <p>所以學生的糖果 = 全部加總 − 最大值。不是把每一包 13 都扣掉。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">只扣一包</span>`);
          canvas.innerHTML = bags(BAGS, 2) + note("兩包都寫著 13。留下第一包，另一包還在。");
        },
      },
      {
        id: "mix",
        title: "其餘加起來再分",
        teach: `<p>5+9+13+6+8+10+8+12+11 = 82。這 82 顆才是要分的。</p>
          <p>整除的商是每人拿到的 A，除不盡的是餘數。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            bags(BAGS, 2) + `<p>全部 95，扣掉留下的 13，剩下 82。</p>`,
            `<p>82 ÷ 8 = 10 餘 2。每人 10 顆，桌上還剩 2 顆。</p>`,
          ]);
        },
      },
      {
        id: "half",
        title: "餘數超過一半就改算法",
        teach: `<p>若剩下的顆數<strong>超過</strong>學生人數的一半，R 不要印餘數，改印「再補幾顆，每人就能再多 1 顆」。</p>
          <p>也就是 <code>m - 餘數</code>。超過用「餘數的兩倍比 m 大」，剛好一半不算超過。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().fork({ q: "餘數 × 2 > 學生人數？", yes: "R 改成還差幾顆", no: "R 就是餘數", take: "no" }) + `<p>範例一：2×2=4，沒有大於 8。R=2。</p>`,
            K().fork({ q: "餘數 × 2 > 學生人數？", yes: "R 改成還差幾顆", no: "R 就是餘數", take: "yes" }) + `<p>範例二：4×2=8，大於 6。還差 6−4=2。R=2。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例一輸出 13 10 2",
        teach: `<p>10 包、8 個學生。留下 13，可分 82。</p>
          <p>82÷8 = 10 餘 2。2 沒有超過 8 的一半，所以三個數是 13 10 2。</p>`,
        draw(stage) {
          const t = candy(BAGS, 8);
          const canvas = K().toolbar(stage, `<span class="chip">13 10 2</span>`);
          canvas.innerHTML = bags(BAGS, t.keep) + hud(["K 13", "A 10", "R 2"]);
        },
      },
      {
        id: "sample2",
        title: "範例二餘數超過一半",
        teach: `<p>同一排糖果，學生改成 6 人。82÷6 = 13 餘 4。</p>
          <p>4 超過 6 的一半。再補 2 顆，每人就能從 13 變成 14。輸出 13 13 2。</p>`,
        draw(stage) {
          const t = candy(BAGS, 6);
          const canvas = K().toolbar(stage, `<span class="chip">13 13 2</span>`);
          canvas.innerHTML = bags(BAGS, t.keep) + hud(["餘 4", "超過一半", "R 改成 " + t.r]);
        },
      },
      {
        id: "edge",
        title: "剛好一半不要改",
        teach: `<p>學生 8 人，一半是 4。餘數如果正好是 4，4×2 等於 8，不是大於 8。</p>
          <p>題目寫「超過」，所以 R 維持 4。判斷要寫 <code>&gt;</code>，不要寫 <code>&gt;=</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">等於一半</span>`);
          canvas.innerHTML = K().fork({ q: "4 × 2 > 8？", yes: "改成還差幾顆", no: "R 維持 4", take: "no" });
        },
      },
      {
        id: "pyin",
        title: "第一行讀 n 和 m",
        teach: `<p>第一行兩個整數：包數 n、學生 m。</p>
          <p><code>split()</code> 切開，<code>map(int, ...)</code> 變成數字，一次交給 n 和 m。</p>`,
        draw(stage, runtime) {
          const lines = ["n, m = map(int, input().split())"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["10 8", "5 9 13 13 6 8 10 8 12 11"], stdinAt: 0, vars: { n: "", m: "" }, note: "等第 1 行。" },
            { lines, hi: 0, stdin: ["10 8", "5 9 13 13 6 8 10 8 12 11"], stdinAt: 1, vars: { n: 10, m: 8 }, glow: "m", note: "10 包，8 個學生。" },
          ]);
        },
      },
      {
        id: "pylist",
        title: "第二行收成每一包",
        teach: `<p>第二行有 n 個數，是每一包的顆數。收成清單 a。</p>
          <p>a[0] 是第一包。後面用 max 和 sum，不必自己寫迴圈找最大。</p>`,
        draw(stage, runtime) {
          const lines = ["a = list(map(int, input().split()))"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["10 8", "5 9 13 13 6 8 10 8 12 11"], stdinAt: 1, vars: { n: 10, m: 8 }, note: "第一行讀完了。" },
            { lines, hi: 0, stdin: ["10 8", "5 9 13 13 6 8 10 8 12 11"], stdinAt: 2, vars: { a: BAGS }, glow: "a", visual: bags(BAGS, -1), note: "十包都在清單裡。還沒決定留哪一包。" },
          ]);
        },
      },
      {
        id: "pymax",
        title: "最大值留下，其餘加總",
        teach: `<p><code>k = max(a)</code> 是老師留下的顆數。兩包都是 13 時，max 仍是 13，只代表留下一包的數量。</p>
          <pre class="eq">left = sum(a) - k</pre>
          <p>全部減掉這一包，就是學生要分的顆數。範例是 95−13=82。</p>`,
        draw(stage, runtime) {
          const lines = ["k = max(a)", "left = sum(a) - k"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { k: 13 }, glow: "k", visual: bags(BAGS, 2), note: "最大是 13。" },
            { lines, hi: 1, vars: { k: 13, left: 82 }, glow: "left", note: "95−13=82。另一包 13 還在這 82 裡面。" },
          ]);
        },
      },
      {
        id: "pydiv",
        title: "商是每人顆數，餘數先算出來",
        teach: `<p><code>//</code> 是整除，<code>%</code> 是剩下的顆數。</p>
          <pre class="eq">share = left // m
r = left % m</pre>
          <p>這時的 r 還是真正剩下的顆數。下一行才決定要不要改寫。</p>`,
        draw(stage, runtime) {
          const lines = ["share = left // m", "r = left % m"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { left: 82, m: 8, share: 10 }, glow: "share", note: "範例一。82÷8，每人 10。" },
            { lines, hi: 1, vars: { r: 2 }, glow: "r", note: "剩下 2。還沒看有沒有超過一半。" },
            { lines, hi: 1, vars: { left: 82, m: 6, share: 13, r: 4 }, glow: "r", note: "範例二。82÷6 = 13 餘 4。" },
          ]);
        },
      },
      {
        id: "pyhalf",
        title: "超過一半才改成還差幾顆",
        teach: `<p>條件是 <code>r * 2 &gt; m</code>。成立時 <code>r = m - r</code>。</p>
          <p>範例二：4×2 &gt; 6，r 從 4 改成 2。範例一：2×2 沒有大於 8，這兩行不跑，r 維持 2。</p>`,
        draw(stage, runtime) {
          const lines = ["if r * 2 > m:", "    r = m - r"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { r: 4, m: 6 }, glow: "r", note: "8 &gt; 6，走進 if。" },
            { lines, hi: 1, vars: { r: 2 }, glow: "r", note: "6−4=2。這才是要印的 R。" },
            { lines, hi: 0, vars: { r: 2, m: 8 }, glow: "m", note: "4 &gt; 8？沒有。r 停在 2。" },
          ]);
        },
      },
      {
        id: "pyrun",
        title: "兩組範例代進去",
        teach: `<p>同一段程式，只換 m。糖果都是那十包，K 都是 13，left 都是 82。</p>
          <p>m=8 時 R 維持餘數。m=6 時 R 改成還差的顆數。</p>`,
        draw(stage, runtime) {
          const lines = R937.slice(4, 8);
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { m: 8, share: 10, r: 2 }, glow: "r", note: "範例一走到餘數，if 不成立。" },
            { lines, hi: 3, vars: { m: 6, share: 13, r: 2 }, glow: "r", note: "範例二進了 if，r 變成 2。" },
          ]);
        },
      },
      {
        id: "pyprint",
        title: "一行印出 K A R",
        teach: `<p><code>print(k, share, r)</code> 中間自動空一格。範例一印 <code>13 10 2</code>，範例二印 <code>13 13 2</code>。</p>
          <p>不要換行印三行，也不要多印剩下的原始餘數。</p>`,
        draw(stage, runtime) {
          const lines = ["print(k, share, r)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { k: 13, share: 10, r: 2, 輸出: "13 10 2" }, glow: "輸出", note: "範例一。" },
            { lines, hi: 0, vars: { k: 13, share: 13, r: 2, 輸出: "13 13 2" }, glow: "輸出", note: "範例二。第二個 13 是每人顆數，不是第二包糖。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀兩行 → 留下最大值 → 其餘整除 → 餘數超過一半才改寫 → 印三個數。</p>`,
        draw(stage) {
          K().full(stage, R937);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>只留一包最大的，其餘平均分；餘數超過一半，就改印還差幾顆。</strong></p>`,
        draw(stage) {
          const t = candy(BAGS, 6);
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = bags(BAGS, t.keep) + note("範例二：13 13 2。");
        },
      },
      {
        id: "play",
        title: "自己改四包糖",
        teach: `<p>這是縮小的四包。綠色柱寫著「留」，是顆數最多的那一包；若有兩包一樣多，留前面那包，數量仍然一樣。</p>
          <p>想清楚這件事就可以交卷：<strong>全部減掉一個最大值，再看餘數有沒有超過人數的一半。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試分糖</span>`, { a: 5, b: 13, c: 13, d: 6, m: 6 }, (s) => {
            const arr = [s.a, s.b, s.c, s.d];
            const fields = K().fieldRow(K().numField("a", "包1", s.a) + K().numField("b", "包2", s.b) + K().numField("c", "包3", s.c) + K().numField("d", "包4", s.d) + K().numField("m", "學生", s.m));
            if (s.m < 1) return fields + `<p>學生至少要 1 人。</p>`;
            const t = candy(arr, s.m);
            return fields + bags(arr, t.keep) + `<p>輸出 <b>${t.k} ${t.share} ${t.r}</b>　可分 ${t.left} 顆${t.over ? "，餘數超過一半" : ""}</p>`;
          });
        },
      },
    ],
  });

  /* ——— r938 學習計劃 ——— */
  const PLAN = [1, 6, 2, 3, 5, 4, 7];
  const ACT = {
    1: "學 +25疲勞 +10成效",
    2: "學 +10疲勞 +20成效",
    3: "學 +5疲勞 +15成效",
    4: "學 +4疲勞 +20成效",
    5: "休 −10疲勞 −15成效",
    6: "休 −35疲勞 成效歸零",
    7: "休 疲勞歸零 成效九折",
  };

  function nine(s) {
    return s >= 0 ? Math.floor((s * 9) / 10) : -Math.floor(((-s) * 9) / 10);
  }

  function study(acts) {
    let f = 0;
    let s = 0;
    const trace = [];
    acts.forEach((a) => {
      if (a === 1) { f += 25; s += 10; }
      else if (a === 2) { f += 10; s += 20; }
      else if (a === 3) { f += 5; s += 15; }
      else if (a === 4) { f += 4; s += 20; }
      else if (a === 5) { f -= 10; s -= 15; }
      else if (a === 6) { f -= 35; s = 0; }
      else if (a === 7) { f = 0; s = nine(s); }
      if (f < 0) f = 0;
      if (f > 100) { f = 0; s = 0; }
      trace.push({ a, f, s });
    });
    return trace;
  }

  function acts(list, hi, f, s) {
    const bits = list.map((n, i) => `第${i + 1}個活動 ${n}`);
    return `<div class="ap-digits" role="img" aria-label="${bits.join("，")}">
      ${list.map((n, i) => `<div class="ap-d${i === hi ? " is-on" : ""}"><small>${i + 1}</small>${n}</div>`).join("")}
    </div><p>疲勞 ${f}　成效 ${s}</p>`;
  }

  const R938 = [
    "n = int(input())",
    "plan = list(map(int, input().split()))",
    "fatigue = 0",
    "score = 0",
    "for a in plan:",
    "    if a == 1:",
    "        fatigue += 25",
    "        score += 10",
    "    elif a == 2:",
    "        fatigue += 10",
    "        score += 20",
    "    elif a == 3:",
    "        fatigue += 5",
    "        score += 15",
    "    elif a == 4:",
    "        fatigue += 4",
    "        score += 20",
    "    elif a == 5:",
    "        fatigue -= 10",
    "        score -= 15",
    "    elif a == 6:",
    "        fatigue -= 35",
    "        score = 0",
    "    elif a == 7:",
    "        fatigue = 0",
    "        if score >= 0:",
    "            score = score * 9 // 10",
    "        else:",
    "            score = -((-score) * 9 // 10)",
    "    if fatigue < 0:",
    "        fatigue = 0",
    "    if fatigue > 100:",
    "        fatigue = 0",
    "        score = 0",
    "print(score)",
  ];

  reg({
    id: "r938",
    title: "學習計劃",
    steps: [
      {
        id: "story",
        title: "七種活動，最後只問成效",
        teach: `<p>活動 1 到 4 是學習，疲勞和成效都增加。5 到 7 是休息，疲勞下降，成效也會變少。</p>
          <p>一開始兩個都是 0。做完 n 個活動，只輸出最後的學習成效。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">最後印成效</span>`);
          canvas.innerHTML = `<ul>
            <li>1：疲勞 +25，成效 +10</li>
            <li>2：疲勞 +10，成效 +20</li>
            <li>3：疲勞 +5，成效 +15</li>
            <li>4：疲勞 +4，成效 +20</li>
            <li>5：疲勞 −10，成效 −15</li>
            <li>6：疲勞 −35，成效歸零</li>
            <li>7：疲勞歸零，成效變成九折，小數去掉</li>
          </ul>`;
        },
      },
      {
        id: "floor",
        title: "疲勞最小是 0",
        teach: `<p>減完如果變成負的，就改回 0。成效照樣減，不會因為疲勞到底而取消。</p>
          <p>例如疲勞 5、成效 20，做活動 5：疲勞先變 −5，再改成 0；成效變成 5。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">不會負疲勞</span>`);
          canvas.innerHTML = hud(["疲勞 5→0", "成效 20→5"]) + note("先做活動 2 再做活動 5，就是這個情況。");
        },
      },
      {
        id: "over",
        title: "疲勞超過 100 就請假",
        teach: `<p>做完一個活動後，若疲勞<strong>大於</strong> 100，疲勞和成效一起歸零，再做下一個活動。</p>
          <p>等於 100 還不用請假。這一格活動剛加上的成效也會被清掉。</p>`,
        draw(stage, runtime) {
          const tr = study([1, 1, 1, 1, 1]);
          K().walk(stage, runtime, [
            acts([1, 1, 1, 1, 1], 3, tr[3].f, tr[3].s) + `<p>第四次活動 1：疲勞 100，成效 40。還沒超過。</p>`,
            acts([1, 1, 1, 1, 1], 4, tr[4].f, tr[4].s) + `<p>第五次變成 125，超過 100，兩個都歸零。</p>`,
          ]);
        },
      },
      {
        id: "six",
        title: "活動 6 把成效歸零",
        teach: `<p>活動 6：疲勞減 35，學習成效直接變成 0。不是減 35 分。</p>
          <p>減完疲勞若小於 0，再改成 0。範例第二格就是這樣：25−35 不够，疲勞變 0，成效也是 0。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">成效歸零</span>`);
          canvas.innerHTML = acts(PLAN, 1, 0, 0) + note(ACT[6]);
        },
      },
      {
        id: "seven",
        title: "活動 7 是九折，去掉小數",
        teach: `<p>活動 7：疲勞變成 0。成效變成原來的 0.9，小數直接丟掉。</p>
          <p>40 的九折是 36。正數時寫 <code>score * 9 // 10</code>。若成效已經是負的，先取正再乘回來，小數仍然丟掉，不是四捨五入。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">40 → 36</span>`);
          canvas.innerHTML = hud(["成效 40", "×0.9", "36"]) + note("36.0 沒有小數。15 的九折是 13，0.5 不要進位。");
        },
      },
      {
        id: "sample",
        title: "範例七個活動，最後 36",
        teach: `<p>1、6、2、3、5、4、7。</p>
          <p>活動 6 先把成效清成 0。後面再累到 40，活動 7 打九折，輸出 36。</p>`,
        draw(stage, runtime) {
          const tr = study(PLAN);
          K().walk(stage, runtime, [
            acts(PLAN, 0, tr[0].f, tr[0].s) + `<p>活動 1：疲勞 25，成效 10。</p>`,
            acts(PLAN, 1, tr[1].f, tr[1].s) + `<p>活動 6：兩個都變 0。</p>`,
            acts(PLAN, 5, tr[5].f, tr[5].s) + `<p>活動 4 之後：疲勞 9，成效 40。</p>`,
            acts(PLAN, 6, tr[6].f, tr[6].s) + `<p>活動 7：疲勞 0，成效 36。</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "第一行只讀有幾個活動",
        teach: `<p>第一行一個整數 n。<code>int(input())</code> 就夠，這一行沒有第二個數。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["7", "1 6 2 3 5 4 7"], stdinAt: 0, vars: { n: "" }, note: "等第 1 行。" },
            { lines, hi: 0, stdin: ["7", "1 6 2 3 5 4 7"], stdinAt: 1, vars: { n: 7 }, glow: "n", note: "有 7 個活動。" },
          ]);
        },
      },
      {
        id: "pylist",
        title: "第二行是活動編號",
        teach: `<p>第二行 n 個 1 到 7 的編號，照從左到右的順序做。</p>`,
        draw(stage, runtime) {
          const lines = ["plan = list(map(int, input().split()))"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["7", "1 6 2 3 5 4 7"], stdinAt: 1, vars: { n: 7 }, note: "等活動那一行。" },
            { lines, hi: 0, stdin: ["7", "1 6 2 3 5 4 7"], stdinAt: 2, vars: { plan: PLAN }, glow: "plan", visual: acts(PLAN, -1, 0, 0), note: "七個編號收成一排。" },
          ]);
        },
      },
      {
        id: "pyinit",
        title: "兩個盒子先放 0",
        teach: `<p>寫在迴圈前面。fatigue 是疲勞，score 是成效。</p>
          <pre class="eq">fatigue = 0
score = 0</pre>`,
        draw(stage, runtime) {
          const lines = ["fatigue = 0", "score = 0"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { fatigue: 0 }, glow: "fatigue", note: "還沒開始。" },
            { lines, hi: 1, vars: { fatigue: 0, score: 0 }, glow: "score", note: "成效也是 0。" },
          ]);
        },
      },
      {
        id: "pystudy",
        title: "先寫四種學習",
        teach: `<p>活動 1 到 4 都是兩行：疲勞加一點、成效加一點。用 if / elif，同一格只會中一種。</p>
          <p>範例第一格是活動 1：疲勞 25，成效 10。</p>`,
        draw(stage, runtime) {
          const lines = ["if a == 1:", "    fatigue += 25", "    score += 10", "elif a == 2:", "    fatigue += 10", "    score += 20"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a: 1, fatigue: 0, score: 0 }, glow: "a", note: "編號是 1，走進第一個 if。" },
            { lines, hi: 1, vars: { fatigue: 25 }, glow: "fatigue", note: "疲勞 +25。" },
            { lines, hi: 2, vars: { score: 10 }, glow: "score", visual: acts(PLAN, 0, 25, 10), note: "成效 +10。" },
          ]);
        },
      },
      {
        id: "pyrest",
        title: "活動 5 兩個都減",
        teach: `<p>休息 5：疲勞 −10，成效 −15。減完先不要在這裡改負數，等整個 if 結束再統一檢查。</p>`,
        draw(stage, runtime) {
          const lines = ["elif a == 5:", "    fatigue -= 10", "    score -= 15"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a: 5, fatigue: 15, score: 35 }, glow: "a", note: "範例第五格。15 和 35 是做到這裡之前的數。" },
            { lines, hi: 2, vars: { fatigue: 5, score: 20 }, glow: "score", visual: acts(PLAN, 4, 5, 20), note: "兩個都減完。疲勞還是正的。" },
          ]);
        },
      },
      {
        id: "pysix",
        title: "活動 6 成效改成 0",
        teach: `<p>這兩行都要寫。少了 <code>score = 0</code>，只是疲勞下降，成效還留著，範例會錯。</p>
          <pre class="eq">elif a == 6:
    fatigue -= 35
    score = 0</pre>`,
        draw(stage, runtime) {
          const lines = ["elif a == 6:", "    fatigue -= 35", "    score = 0"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { a: 6, fatigue: -10, score: 10 }, glow: "fatigue", note: "25−35=−10。下一格才會把負的改成 0。" },
            { lines, hi: 2, vars: { score: 0 }, glow: "score", visual: acts(PLAN, 1, 0, 0), note: "成效先歸零。" },
          ]);
        },
      },
      {
        id: "pyseven",
        title: "活動 7 打九折",
        teach: `<p>疲勞直接設成 0。成效用整數去掉小數：正數 <code>score * 9 // 10</code>。</p>
          <p>40×9//10 = 36。負數先去掉負號再乘，小數仍是丟掉。</p>`,
        draw(stage, runtime) {
          const lines = ["elif a == 7:", "    fatigue = 0", "    score = score * 9 // 10"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { a: 7, fatigue: 0, score: 40 }, glow: "fatigue", note: "疲勞歸零。成效還是 40。" },
            { lines, hi: 2, vars: { score: 36 }, glow: "score", visual: acts(PLAN, 6, 0, 36), note: "九折去掉小數，得到 36。" },
          ]);
        },
      },
      {
        id: "pyclamp",
        title: "if 結束後再檢查疲勞",
        teach: `<p>這兩段寫在整個 if / elif 的後面，跟活動幾號無關。縮排要和 if 對齊，不要縮進 elif 裡面。</p>
          <pre class="eq">if fatigue &lt; 0:
    fatigue = 0
if fatigue &gt; 100:
    fatigue = 0
    score = 0</pre>
          <p>先處理負的，再處理超過 100。等於 100 兩段都不進。</p>`,
        draw(stage, runtime) {
          const lines = ["if fatigue < 0:", "    fatigue = 0", "if fatigue > 100:", "    fatigue = 0", "    score = 0"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { fatigue: 0, score: 0 }, glow: "fatigue", note: "活動 6 之後疲勞是負的，改成 0。成效已經是 0。" },
            { lines, hi: 2, vars: { fatigue: 125, score: 50 }, glow: "fatigue", note: "125 &gt; 100，兩個都要清。" },
            { lines, hi: 4, vars: { fatigue: 0, score: 0 }, glow: "score", note: "請假休息。這一格加上的成效也不算。" },
          ]);
        },
      },
      {
        id: "pyrun",
        title: "範例七格接下去",
        teach: `<p>活動 6 清成 0 之後，2、3、5、4 把成效補到 40，活動 7 變成 36。</p>`,
        draw(stage, runtime) {
          const tr = study(PLAN);
          const lines = ["for a in plan:", "    elif a == 7:", "        score = score * 9 // 10", "print(score)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a: 6, fatigue: 0, score: 0 }, visual: acts(PLAN, 1, tr[1].f, tr[1].s), note: "第二格結束。" },
            { lines, hi: 0, vars: { a: 4, fatigue: 9, score: 40 }, visual: acts(PLAN, 5, tr[5].f, tr[5].s), note: "活動 4 結束，成效 40。" },
            { lines, hi: 3, vars: { score: 36 }, glow: "score", visual: acts(PLAN, 6, 0, 36), note: "印出 36。" },
          ]);
        },
      },
      {
        id: "pyprint",
        title: "迴圈結束只印成效",
        teach: `<p><code>print(score)</code>。不要印疲勞。範例是 36。</p>
          <p>若中途請過假，印的是請假之後又做完剩下活動的成效，不是請假前的最高分。</p>`,
        draw(stage, runtime) {
          const lines = ["print(score)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { score: 36, fatigue: 0 }, glow: "score", note: "範例。印 36。" },
            { lines, hi: 0, vars: { score: 0, fatigue: 0 }, glow: "score", note: "五次活動 1 之後超過 100，成效是 0。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀入 → 兩個 0 → 每一格先改數字，再把疲勞拉回 0 到 100 → 印成效。</p>`,
        draw(stage) {
          K().full(stage, R938);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>照編號改疲勞和成效，疲勞不準負、超過 100 就兩個歸零，最後只印成效。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = acts(PLAN, 6, 0, 36) + note("範例輸出 36。");
        },
      },
      {
        id: "play",
        title: "自己排四個活動",
        teach: `<p>填 1 到 7。看疲勞會不會被壓成 0，或超過 100 後成效被清掉。</p>
          <p>想清楚這件事就可以交卷：<strong>每一格做完才檢查疲勞，最後印的是成效。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試活動</span>`, { a: 1, b: 6, c: 2, d: 7 }, (s) => {
            const plan = [s.a, s.b, s.c, s.d];
            const tr = study(plan);
            const last = tr[tr.length - 1];
            return K().fieldRow(K().numField("a", "1", s.a) + K().numField("b", "2", s.b) + K().numField("c", "3", s.c) + K().numField("d", "4", s.d)) +
              acts(plan, 3, last.f, last.s) + `<p>成效 <b>${last.s}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— r939 猜拳 ——— */
  const ROUNDS = [[5, 0], [2, 0], [5, 2], [2, 2]];

  function add(me, other) {
    if (me === other) return me === 2 ? -2 : 0;
    const win = (me === 0 && other === 2) || (me === 2 && other === 5) || (me === 5 && other === 0);
    if (me === 2) return win ? 2 : -2;
    return win ? 1 : -1;
  }

  function roundScore(a, b) {
    return { a: add(a, b), b: add(b, a) };
  }

  const R939 = [
    "def add(me, other):",
    "    if me == other:",
    "        return -2 if me == 2 else 0",
    "    win = (me == 0 and other == 2) or (me == 2 and other == 5) or (me == 5 and other == 0)",
    "    if me == 2:",
    "        return 2 if win else -2",
    "    return 1 if win else -1",
    "n = int(input())",
    "sa = sb = 0",
    "for _ in range(n):",
    "    a, b = map(int, input().split())",
    "    sa += add(a, b)",
    "    sb += add(b, a)",
    "print(sa, sb)",
  ];

  reg({
    id: "r939",
    title: "猜拳",
    steps: [
      {
        id: "story",
        title: "分數看你自己出什麼",
        teach: `<p>0 石頭、2 剪刀、5 布。石頭贏剪刀，剪刀贏布，布贏石頭。</p>
          <p>平手時，只有雙方都出剪刀才各扣 2，其他平手不加不減。分出勝負時，出剪刀的人勝 +2、敗 −2；出石頭或布的人勝 +1、敗 −1。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">0 石 2 剪 5 布</span>`);
          canvas.innerHTML = K().rps(5, 0) + note("布贏石頭。A 出布得 1 分，B 出石頭扣 1 分。");
        },
      },
      {
        id: "own",
        title: "兩個人分開算",
        teach: `<p>同一回合，A 的加減看 A 出的拳，B 的加減看 B 出的拳。</p>
          <p>A 出剪刀輸給石頭：A 扣 2。B 出石頭贏了：B 只加 1，不是加 2。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().rps(2, 0) + `<p>剪刀輸。A −2，B 出石頭所以 +1。</p>`,
            K().rps(5, 2) + `<p>布輸給剪刀。A −1，B 出剪刀所以 +2。</p>`,
          ]);
        },
      },
      {
        id: "tie",
        title: "只有剪刀平手才扣分",
        teach: `<p>兩邊一樣，先當平手。出剪刀，各 −2。出石頭或布，這一回合是 0。</p>
          <p>不要把平手再送進勝負的加分。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().rps(2, 2) + `<p>剪刀平手。A −2，B −2。</p>`,
            K().rps(0, 0) + `<p>石頭平手。兩邊都不動。</p>`,
          ]);
        },
      },
      {
        id: "sample",
        title: "範例四回合，輸出 -4 0",
        teach: `<p>5 0、2 0、5 2、2 2。</p>
          <p>A：+1、−2、−1、−2，加起來 −4。B：−1、+1、+2、−2，加起來 0。</p>`,
        draw(stage, runtime) {
          let sa = 0;
          let sb = 0;
          const frames = ROUNDS.map((pair) => {
            const d = roundScore(pair[0], pair[1]);
            sa += d.a;
            sb += d.b;
            return K().rps(pair[0], pair[1]) + `<p>這一回合 A ${d.a}、B ${d.b}。目前 ${sa} ${sb}</p>`;
          });
          K().walk(stage, runtime, frames);
        },
      },
      {
        id: "pytie",
        title: "函式先處理平手",
        teach: `<p>A 和 B 用同一套規則，所以寫成 <code>add(me, other)</code>，回傳這個人該加的分數。</p>
          <pre class="eq">if me == other:
    return -2 if me == 2 else 0</pre>
          <p>剪刀平手回 −2。其他平手回 0，函式在這裡就結束。</p>`,
        draw(stage, runtime) {
          const lines = ["def add(me, other):", "    if me == other:", "        return -2 if me == 2 else 0"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { me: 2, other: 2 }, glow: "me", visual: K().rps(2, 2), note: "一樣，而且是剪刀。" },
            { lines, hi: 2, vars: { 回傳: -2 }, glow: "回傳", note: "這個人扣 2。對方也會再呼叫一次，同樣扣 2。" },
            { lines, hi: 2, vars: { me: 0, other: 0, 回傳: 0 }, visual: K().rps(0, 0), note: "石頭平手，回傳 0。" },
          ]);
        },
      },
      {
        id: "pywin",
        title: "再判斷有沒有贏",
        teach: `<p>三種贏法寫在同一個布林：</p>
          <pre class="eq">win = (me == 0 and other == 2) or (me == 2 and other == 5) or (me == 5 and other == 0)</pre>
          <p>0 贏 2，2 贏 5，5 贏 0。數字不是 0、1、2，不要用相減來猜。</p>`,
        draw(stage, runtime) {
          const lines = ["win = (me == 0 and other == 2) or (me == 2 and other == 5) or (me == 5 and other == 0)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { me: 5, other: 0, win: true }, glow: "win", visual: K().rps(5, 0), note: "布對石頭，第三段成立。" },
            { lines, hi: 0, vars: { me: 2, other: 0, win: false }, glow: "win", visual: K().rps(2, 0), note: "剪刀對石頭，三段都不成立。" },
          ]);
        },
      },
      {
        id: "pypoint",
        title: "剪刀是 2 分，其他是 1 分",
        teach: `<p>贏或輸看 win。分數大小看自己出什麼。</p>
          <pre class="eq">if me == 2:
    return 2 if win else -2
return 1 if win else -1</pre>
          <p>範例第二回合：A 出 2 且沒贏，回 −2。B 出 0 且贏了，回 1。</p>`,
        draw(stage, runtime) {
          const lines = ["if me == 2:", "    return 2 if win else -2", "return 1 if win else -1"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { me: 2, win: false, 回傳: -2 }, glow: "回傳", visual: K().rps(2, 0), note: "A 這一次。" },
            { lines, hi: 2, vars: { me: 0, win: true, 回傳: 1 }, glow: "回傳", note: "B 出石頭而且贏，加 1，不是加 2。" },
          ]);
        },
      },
      {
        id: "pyin",
        title: "先讀回合數，再一回合一行",
        teach: `<p>第一行是 n。後面有 n 行，每行是 A 的拳和 B 的拳。</p>
          <p><code>sa</code>、<code>sb</code> 從 0 開始加。每一行呼叫兩次 add，參數對調。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "sa = sb = 0", "a, b = map(int, input().split())", "sa += add(a, b)", "sb += add(b, a)"];
          const stdin = ["4", "5 0", "2 0", "5 2", "2 2"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin, stdinAt: 1, vars: { n: 4 }, glow: "n", note: "四回合。" },
            { lines, hi: 1, vars: { sa: 0, sb: 0 }, glow: "sa", note: "兩個分數先是 0。" },
            { lines, hi: 2, stdin, stdinAt: 2, vars: { a: 5, b: 0 }, glow: "a", visual: K().rps(5, 0), note: "第一回合讀進來。" },
            { lines, hi: 4, vars: { sa: 1, sb: -1 }, glow: "sb", note: "A +1，B −1。" },
          ]);
        },
      },
      {
        id: "pyrun",
        title: "四回合加總",
        teach: `<p>不要每一回合就印。四次加完才是答案。</p>
          <p>1 與 −1、再 −2 與 +1、再 −1 與 +2、最後剪刀平手各 −2。A 是 −4，B 是 0。</p>`,
        draw(stage, runtime) {
          const lines = ["sa += add(a, b)", "sb += add(b, a)"];
          let sa = 0;
          let sb = 0;
          const frames = ROUNDS.map((pair) => {
            const d = roundScore(pair[0], pair[1]);
            sa += d.a;
            sb += d.b;
            return { lines, hi: 1, vars: { a: pair[0], b: pair[1], sa, sb }, glow: "sa", visual: K().rps(pair[0], pair[1]), note: `這一回合後 sa=${sa}，sb=${sb}。` };
          });
          K().py(stage, runtime, frames);
        },
      },
      {
        id: "pyprint",
        title: "印 A 的分數和 B 的分數",
        teach: `<p><code>print(sa, sb)</code>。範例印 <code>-4 0</code>。負號貼著數字，中間一個空格。</p>`,
        draw(stage, runtime) {
          const lines = ["print(sa, sb)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { sa: -4, sb: 0, 輸出: "-4 0" }, glow: "輸出", note: "範例。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>先寫 add：平手、贏了沒、剪刀還是 1 分。再讀 n 行，每行兩邊各加一次，最後印兩個分數。</p>`,
        draw(stage) {
          K().full(stage, R939);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>平手只有剪刀扣 2；分勝負時，剪刀加減 2，石頭和布加減 1。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().rps(2, 2) + note("範例最後是 −4 0。");
        },
      },
      {
        id: "play",
        title: "自己打兩回合",
        teach: `<p>只能填 0、2、5。看每一個人加的是 2 分還是 1 分。</p>
          <p>想清楚這件事就可以交卷：<strong>先看平手，再看誰贏，最後用自己出的拳決定加減幾分。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試兩回合</span>`, { a: 5, b: 0, c: 2, d: 0 }, (s) => {
            const pairs = [[s.a, s.b], [s.c, s.d]];
            let sa = 0;
            let sb = 0;
            const bits = pairs.map((pair) => {
              const d = roundScore(pair[0], pair[1]);
              sa += d.a;
              sb += d.b;
              return K().rps(pair[0], pair[1]);
            }).join("");
            return K().fieldRow(K().numField("a", "A1", s.a) + K().numField("b", "B1", s.b) + K().numField("c", "A2", s.c) + K().numField("d", "B2", s.d)) +
              bits + `<p>目前 <b>${sa} ${sb}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— r490 商品包裝地（2025-10 中級題，初級難度） ——— */
  const CODES = [
    "4710018000102",
    "0309876543216",
    "4711234560012",
    "3001111111118",
  ];
  const OWN = ["4710018000102", "3001111111110", "3001111111110"];

  function parts(code) {
    let odd = 0;
    let even = 0;
    for (let i = 0; i < 12; i++) {
      const digit = +code[i];
      if (i % 2 === 0) odd += digit;
      else even += digit;
    }
    const check = +code[12];
    const mod = (odd + 3 * even) % 10;
    const total = mod + check;
    return {
      code,
      odd,
      even,
      check,
      mod,
      total,
      ok: total === 0 || total === 10,
      origin: String(code).slice(0, 3),
    };
  }

  function tally(codes) {
    const count = {};
    const rows = codes.map(parts);
    rows.forEach((p) => {
      if (!p.ok) return;
      count[p.origin] = (count[p.origin] || 0) + 1;
    });
    let best = "";
    let most = 0;
    Object.keys(count).forEach((origin) => {
      if (count[origin] > most) {
        best = origin;
        most = count[origin];
      }
    });
    return { rows, count, best, most };
  }

  function barcode(code, hi) {
    const s = String(code);
    const cells = s.slice(0, 12).split("").map((ch, i) => {
      const odd = i % 2 === 0;
      const on = i === hi ? " is-on" : "";
      return `<div class="ap-d ${odd ? "is-odd" : "is-even"}${on}"><small>${i + 1}${odd ? "奇×1" : "偶×3"}</small>${ch}</div>`;
    }).join("");
    const on = hi === 12 ? " is-on" : "";
    return `<div class="ap-digits" role="img" aria-label="條碼 ${s}。奇數位加一次，偶數位加三次，第 13 碼 ${s[12] || ""} 是檢驗碼，不加進總和">
      ${cells}<div class="ap-d${on}"><small>檢驗</small>${s[12] || ""}</div>
    </div>`;
  }

  function originRow(rows) {
    return `<div class="ap-digits" role="img" aria-label="${rows.map((p) => `${p.origin} ${p.ok ? "計入" : "跳過"}`).join("，")}">
      ${rows.map((p) => `<div class="ap-d${p.ok ? " is-on" : ""}"><small>${p.ok ? "計入" : "跳過"}</small>${p.origin}</div>`).join("")}
    </div>`;
  }

  const R490 = [
    "n = int(input())",
    "count = {}",
    "for _ in range(n):",
    "    code = input().strip()",
    "    odd = 0",
    "    even = 0",
    "    for i in range(12):",
    "        digit = int(code[i])",
    "        if i % 2 == 0:",
    "            odd += digit",
    "        else:",
    "            even += digit",
    "    check = int(code[12])",
    "    total = (odd + 3 * even) % 10 + check",
    "    if total == 0 or total == 10:",
    "        origin = code[:3]",
    "        if origin not in count:",
    "            count[origin] = 0",
    "        count[origin] += 1",
    "best = \"\"",
    "most = 0",
    "for origin in count:",
    "    if count[origin] > most:",
    "        best = origin",
    "        most = count[origin]",
    "print(best, most)",
  ];

  reg({
    id: "r490",
    title: "商品包裝地",
    steps: [
      {
        id: "story",
        title: "前三碼是產地，最後一碼是檢驗",
        teach: `<p>每條條碼 13 個數字。前 3 碼是產地，第 13 碼是檢驗碼，中間那些用來檢查這條碼有沒有印錯。</p>
          <p>只統計合法條碼。合法的裡面，哪個產地出現最多次，就印那個產地和次數。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">13 碼</span>`);
          canvas.innerHTML = barcode(CODES[0]) + note("前三碼 471 是產地。最後的 2 是檢驗碼，不拿去跟產地比較。");
        },
      },
      {
        id: "odd",
        title: "奇數位從第 1 位開始加",
        teach: `<p>位置從左邊第 1 位算起，不是從 0。奇數位是第 1、3、5、7、9、11 位，每個數字加一次。</p>
          <p>第一條 4+1+0+8+0+1 = 14。第 13 碼先不要加。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">奇數位 14</span>`);
          canvas.innerHTML = barcode(CODES[0], 0) + hud(["奇數位 14", "第 13 碼先留著"]);
        },
      },
      {
        id: "even",
        title: "偶數位要加三次",
        teach: `<p>偶數位是第 2、4、6、8、10、12 位。第一條是 7、0、1、0、0、0，加起來 8。</p>
          <p>這 8 要乘 3，變成 24。奇數位的 14 不用乘。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">偶數位 ×3</span>`);
          canvas.innerHTML = barcode(CODES[0], 1) + hud(["偶數位 8", "8×3 = 24", "奇數位 14"]);
        },
      },
      {
        id: "rule",
        title: "個位數再加檢驗碼",
        teach: `<p>把「奇數位 + 偶數位的三倍」除掉 10 的餘數，加上第 13 碼。結果是 0 或 10，這條才合法。</p>
          <p>第一條 14+24 = 38，餘數 8。8+2 = 10，所以合法。</p>`,
        draw(stage) {
          const p = parts(CODES[0]);
          const canvas = K().toolbar(stage, `<span class="chip">0 或 10</span>`);
          canvas.innerHTML = barcode(CODES[0], 12) +
            K().fork({ q: "餘數 + 檢驗碼是 0 或 10？", yes: "合法，產地可以計", no: "不合法，這條跳過", take: "yes" }) +
            note(`${p.odd}+${p.even * 3} 的餘數是 ${p.mod}，再加檢驗碼 ${p.check}，得到 ${p.total}。`);
        },
      },
      {
        id: "sample",
        title: "範例四條，輸出 471 2",
        teach: `<p>範例四條的檢驗都過。產地是 471、030、471、300。</p>
          <p>471 有 2 條，另外兩個各 1 條。輸出 <code>471 2</code>。</p>`,
        draw(stage, runtime) {
          const frames = CODES.map((code, i) => {
            const p = parts(code);
            return barcode(code, 12) + `<p>第 ${i + 1} 條產地 ${p.origin}，餘數加檢驗碼是 ${p.total}，合法。</p>`;
          });
          frames.push(originRow(tally(CODES).rows) + `<p>471 兩條，030 一條，300 一條。輸出 <b>471 2</b>。</p>`);
          K().walk(stage, runtime, frames);
        },
      },
      {
        id: "skip",
        title: "不合法的產地不計",
        teach: `<p>下面這組是自己代的，不是官方範例。第一條仍是合法的 471。後兩條把檢驗碼改成 0，餘數 2 加 0 等於 2，不合法。</p>
          <p>只計合法的，輸出 <code>471 1</code>。若壞掉的也算，300 有 2 條，會印成 <code>300 2</code>。</p>`,
        draw(stage, runtime) {
          const rows = OWN.map(parts);
          K().walk(stage, runtime, [
            barcode(OWN[1], 12) + K().fork({ q: "餘數 + 檢驗碼是 0 或 10？", yes: "合法，產地可以計", no: "不合法，這條跳過", take: "no" }) +
              note("3001111111110：餘數 2，檢驗碼 0，加起來 2。"),
            originRow(rows) + `<p>計入的只有 471。輸出 <b>471 1</b>。兩條 300 都跳過。</p>`,
          ]);
        },
      },
      {
        id: "zero",
        title: "產地 030 要留住那個 0",
        teach: `<p>第二條的產地是三個字元 <code>030</code>，不是數字 30。</p>
          <p>範例的答案剛好是 471，所以把產地轉成數字，在這組範例看不出錯。題目要的是 3 位字串。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">030</span>`);
          canvas.innerHTML = barcode(CODES[1]) + note("前三碼是 0、3、0。印出來要是 030，不能是 30。");
        },
      },
      {
        id: "pyin",
        title: "先讀幾條，再一條一條讀",
        teach: `<p>第一行是 n。後面 n 行，每行一條 13 碼。</p>
          <p><code>count</code> 先是空的字典，等一下用產地當鑰匙，記下出現幾次。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "count = {}", "code = input().strip()"];
          const stdin = ["4"].concat(CODES);
          K().py(stage, runtime, [
            { lines, hi: 0, stdin, stdinAt: 0, vars: { n: 4 }, glow: "n", note: "四條。" },
            { lines, hi: 1, vars: { count: "{}" }, glow: "count", note: "還沒有任何產地。" },
            { lines, hi: 2, stdin, stdinAt: 1, vars: { code: CODES[0] }, glow: "code", visual: barcode(CODES[0]), note: "讀進第一條。strip 只是去掉行尾空白。" },
          ]);
        },
      },
      {
        id: "pyodd",
        title: "i 從 0 開始，餘 0 才是奇數位",
        teach: `<p>迴圈的 i 是 0 到 11。第 1 位的 i 是 0，所以 <code>i % 2 == 0</code> 的那些才是奇數位。</p>
          <pre class="eq">if i % 2 == 0:
    odd += digit
else:
    even += digit</pre>
          <p>若寫成 <code>i % 2 == 1</code>，奇偶對調，乘 3 也乘錯邊。第一條會算出 total = 2，合法條碼被丟掉。</p>`,
        draw(stage, runtime) {
          const lines = ["for i in range(12):", "    digit = int(code[i])", "    if i % 2 == 0:", "        odd += digit", "    else:", "        even += digit"];
          K().py(stage, runtime, [
            { lines, hi: 3, vars: { i: 0, digit: 4, odd: 4, even: 0 }, glow: "odd", visual: barcode(CODES[0], 0), note: "i 是 0，位置是第 1 位，加進 odd。" },
            { lines, hi: 5, vars: { i: 1, digit: 7, odd: 4, even: 7 }, glow: "even", visual: barcode(CODES[0], 1), note: "i 是 1，位置是第 2 位，加進 even。等一下 even 還要乘 3。" },
            { lines, hi: 2, vars: { odd: 14, even: 8 }, glow: "odd", note: "十二位加完。odd 14、even 8。這組才乘得對。" },
          ]);
        },
      },
      {
        id: "py12",
        title: "檢驗碼不要放進迴圈",
        teach: `<p><code>range(12)</code> 只加前 12 碼。第 13 碼單獨放進 <code>check</code>。</p>
          <pre class="eq">check = int(code[12])
total = (odd + 3 * even) % 10 + check</pre>
          <p>若迴圈寫成 range(13)，檢驗碼又被加進奇數位，第一條的 total 會變成 2，合法的也被丟掉。</p>`,
        draw(stage, runtime) {
          const lines = ["for i in range(12):", "check = int(code[12])", "total = (odd + 3 * even) % 10 + check"];
          const p = parts(CODES[0]);
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { odd: p.odd, even: p.even }, glow: "odd", visual: barcode(CODES[0]), note: "迴圈停在第 12 碼。最後一格還沒加。" },
            { lines, hi: 2, vars: { odd: p.odd, even: p.even, check: p.check, total: p.total }, glow: "total", visual: barcode(CODES[0], 12), note: "(14 + 24) % 10 + 2 = 10。" },
          ]);
        },
      },
      {
        id: "pyok",
        title: "0 或 10 才放進字典",
        teach: `<p>兩個都要寫出來：<code>total == 0 or total == 10</code>。</p>
          <p>若寫成 <code>total == 0 or 10</code>，右邊的 10 永遠成立，不合法的也會被計入。範例四條剛好都合法，這個錯在範例上看不出來。</p>`,
        draw(stage, runtime) {
          const lines = ["total = (odd + 3 * even) % 10 + check", "if total == 0 or total == 10:", "    origin = code[:3]"];
          const bad = parts(OWN[1]);
          const good = parts(CODES[0]);
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { total: good.total, origin: good.origin }, glow: "origin", visual: barcode(CODES[0], 12), note: "範例第一條是 10，進得去。" },
            { lines, hi: 1, vars: { total: bad.total }, glow: "total", visual: barcode(OWN[1], 12), note: "自己代的那條是 2。條件不成立，產地不記。" },
          ]);
        },
      },
      {
        id: "pystr",
        title: "前三碼保持字串",
        teach: `<p><code>origin = code[:3]</code> 切出來仍是文字。</p>
          <p>第二條會得到 <code>030</code>。寫成 <code>int(code[:3])</code> 會變成 30，輸出就少一個 0。</p>`,
        draw(stage, runtime) {
          const lines = ["origin = code[:3]", "if origin not in count:", "    count[origin] = 0", "count[origin] += 1"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { code: CODES[1], origin: "030" }, glow: "origin", visual: barcode(CODES[1]), note: "三個字元，前面的 0 還在。" },
            { lines, hi: 3, vars: { origin: "030", count: "{030: 1}" }, glow: "count", note: "這個產地第一次出現，先放 0 再加 1。" },
          ]);
        },
      },
      {
        id: "pymax",
        title: "找次數最大的產地",
        teach: `<p>題目保證最多的產地只有一個。從 0 開始比，誰的次數比較大就換成誰。</p>
          <pre class="eq">if count[origin] &gt; most:
    best = origin
    most = count[origin]</pre>
          <p>範例先看到 471 的 2，後面 030 和 300 都是 1，換不掉。</p>`,
        draw(stage, runtime) {
          const lines = ["for origin in count:", "    if count[origin] > most:", "        best = origin", "        most = count[origin]"];
          K().py(stage, runtime, [
            { lines, hi: 3, vars: { origin: "471", most: 2, best: "471" }, glow: "best", note: "2 比 0 大，先記下 471。" },
            { lines, hi: 1, vars: { origin: "030", "count[origin]": 1, most: 2, best: "471" }, glow: "most", note: "1 沒有大於 2，best 不變。" },
            { lines, hi: 1, vars: { origin: "300", "count[origin]": 1, most: 2, best: "471" }, glow: "best", note: "300 也是 1。答案仍是 471。" },
          ]);
        },
      },
      {
        id: "pyrun",
        title: "四條跑完是 471 2",
        teach: `<p>每一條先算 total。是 0 或 10，才把前三碼的次數加 1。</p>
          <p>四條都進得去：471 變 1，030 變 1，471 變 2，300 變 1。</p>`,
        draw(stage, runtime) {
          const lines = ["if total == 0 or total == 10:", "    origin = code[:3]", "    if origin not in count:", "        count[origin] = 0", "    count[origin] += 1"];
          const count = {};
          const frames = CODES.map((code) => {
            const p = parts(code);
            count[p.origin] = (count[p.origin] || 0) + 1;
            const seen = Object.keys(count).map((k) => `${k} ${count[k]}`).join("、");
            return {
              lines,
              hi: 4,
              vars: { total: p.total, origin: p.origin, [p.origin]: count[p.origin] },
              glow: p.origin,
              visual: barcode(code, 12),
              note: `這條 total=${p.total}。目前 ${seen}。`,
            };
          });
          K().py(stage, runtime, frames);
        },
      },
      {
        id: "pyprint",
        title: "印產地和次數",
        teach: `<p><code>print(best, most)</code>。範例印 <code>471 2</code>。中間一個空格。</p>`,
        draw(stage, runtime) {
          const lines = ["print(best, most)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { best: "471", most: 2, 輸出: "471 2" }, glow: "輸出", note: "範例。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>前 12 碼分成奇數位和偶數位，偶數位乘 3，餘數加檢驗碼。0 或 10 才把前三碼計次，最後印次數最多的產地。</p>`,
        draw(stage) {
          K().full(stage, R490);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>奇數位加一次、偶數位加三次，餘數加檢驗碼要是 0 或 10。只有合法條碼的前三碼才計次。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = barcode(CODES[0], 12) + note("範例輸出 471 2。");
        },
      },
      {
        id: "play",
        title: "自己改一個檢驗碼",
        teach: `<p>範例四條都留著。下面再多加一條，前 12 碼跟第一條一樣，檢驗碼可以改。</p>
          <p>想清楚這件事就可以交卷：<strong>檢驗不過的不計入；產地是三個字元。</strong>檢驗碼維持 2 時多的那條也合法，471 會變成 3 次。改成別的數字，它就被跳過，答案回到範例的 471 2。</p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">改檢驗碼</span>`, { c: 2 }, (s) => {
            const fields = K().fieldRow(K().numField("c", "多一條的檢驗碼", s.c));
            if (!Number.isInteger(s.c) || s.c < 0 || s.c > 9) {
              return fields + `<p>檢驗碼是 0 到 9 的一個數字。</p>`;
            }
            const extra = "471001800010" + s.c;
            const p = parts(extra);
            const t = tally(CODES.concat([extra]));
            return fields + barcode(extra, 12) +
              `<p>這條餘數 ${p.mod} 加檢驗碼 ${p.check} 等於 ${p.total}，${p.ok ? "合法，產地 " + p.origin + " 計入" : "不合法，跳過"}。</p>` +
              `<p>加上範例四條，輸出 <b>${t.best} ${t.most}</b></p>`;
          });
        },
      },
    ],
  });
})();
