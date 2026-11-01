(function () {
  const K = () => window.IfKit;
  const P = () => window.PyTeach;

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

  function hud(parts) {
    return `<div class="hud">${parts.map((p) => `<span>${p}</span>`).join("")}</div>`;
  }
  function note(s) {
    return `<p class="py-note">${s}</p>`;
  }

  function leapOf(y) {
    if (y % 400 === 0) {
      return { leap: true, gates: [
        { cond: "y % 400 == 0", say: "能被 400 整除", out: "閏年", state: "is-yes" },
        { cond: "y % 100 == 0", say: "不用再問", out: "—", state: "is-skip" },
        { cond: "y % 4 == 0", say: "不用再問", out: "—", state: "is-skip" },
      ]};
    }
    if (y % 100 === 0) {
      return { leap: false, gates: [
        { cond: "y % 400 == 0", say: "不能", out: "往下", state: "is-no" },
        { cond: "y % 100 == 0", say: "能被 100 整除", out: "平年", state: "is-yes" },
        { cond: "y % 4 == 0", say: "不用再問", out: "—", state: "is-skip" },
      ]};
    }
    if (y % 4 === 0) {
      return { leap: true, gates: [
        { cond: "y % 400 == 0", say: "不能", out: "往下", state: "is-no" },
        { cond: "y % 100 == 0", say: "不能", out: "往下", state: "is-no" },
        { cond: "y % 4 == 0", say: "能被 4 整除", out: "閏年", state: "is-yes" },
      ]};
    }
    return { leap: false, gates: [
      { cond: "y % 400 == 0", say: "不能", out: "往下", state: "is-no" },
      { cond: "y % 100 == 0", say: "不能", out: "往下", state: "is-no" },
      { cond: "y % 4 == 0", say: "不能", out: "平年", state: "is-no" },
    ]};
  }

  /* ——— a003 ——— */
  const A003 = ["M, D = map(int, input().split())", "s = (M * 2 + D) % 3", "print([\"普通\", \"吉\", \"大吉\"][s])"];
  function fortuneOf(M, D) {
    const r = ((M * 2 + D) % 3 + 3) % 3;
    return { r, word: ["普通", "吉", "大吉"][r], n: M * 2 + D };
  }
  reg({
    id: "a003",
    title: "兩光法師占卜術",
    steps: [
      {
        id: "story",
        title: "用日期抽一張籤",
        teach: `<p>兩光法師不看星座，只看月份 M 和日期 D。先算出一個編號，再對三張籤：</p>
          <ul><li>0 → 普通</li><li>1 → 吉</li><li>2 → 大吉</li></ul>
          <p>規則只有一句：<strong>S = (M × 2 + D) % 3</strong>。餘數只有三種，答案也只有三種。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">三張籤</span>`);
          canvas.innerHTML = K().fortune(0) + `<p class="py-note">先算出 0、1、2，再對到其中一張。不要直接猜吉凶。</p>`;
        },
      },
      {
        id: "formula",
        title: "先算 M×2+D，還沒取餘數",
        teach: `<p>範例一是 1 月 1 日。月份先乘 2，再加日期：1×2+1=3。</p>
          <p>這一步還不是答案。3 可能比 2 大，要再折進 0、1、2 裡。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">1×2+1 = 3</span>`);
          canvas.innerHTML = hud(["M=1", "D=1", "M×2+D=3"]) + note("先得到一個整數，下一步才對 3 取餘數。");
        },
      },
      {
        id: "mod",
        title: "對 3 取餘數，折成 0、1、2",
        teach: `<p>% 不是百分比。它叫<strong>取餘數</strong>：能裝幾整袋就裝幾整袋，看袋子外面還剩幾顆。</p>
          <p>3 % 3 = 0：剛好裝走 1 袋，外面一顆都不剩。所以 1 月 1 日是普通。</p>
          <div class="note"><strong>記住一個詞：餘數</strong>不管日期多大，對 3 取餘數之後一定落在 0、1、2。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">3 % 3 = 0</span>`);
          canvas.innerHTML = P().remainderDots(3, 3) + K().fortune(0);
        },
      },
      {
        id: "table",
        title: "編號對中文，不要寫三個 print",
        teach: `<p>s 是 0 拿「普通」，1 拿「吉」，2 拿「大吉」。清單的第 0 格、第 1 格、第 2 格剛好對上。</p>
          <pre class="eq">print(["普通", "吉", "大吉"][s])</pre>
          <p>不要寫三層幾乎一樣的 if。編號已經算好了，直接去拿。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().fortune(0) + `<p>s = 0 → 普通</p>`,
            K().fortune(1) + `<p>s = 1 → 吉</p>`,
            K().fortune(2) + `<p>s = 2 → 大吉</p>`,
          ], "換下一張");
        },
      },
      {
        id: "why",
        title: "為什麼先乘 2 再加",
        teach: `<p>題目把公式寫死了，不必問為什麼乘 2。課堂上只要會算：月份的權重比較大，差一個月等於差兩天。</p>
          <p>1 月 2 日是 (2+2)%3=1，吉。1 月 1 日是 0，普通。差一天，籤就換一張。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            P().remainderDots(3, 3) + K().fortune(0) + `<p>1 1 → 普通</p>`,
            P().remainderDots(4, 3) + K().fortune(1) + `<p>1 2 → 吉。日期加 1，餘數也加 1。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例一逐步對一次",
        teach: `<p>輸入一行：</p>
          <pre class="eq">1 1</pre>
          <p>M=1，D=1。1×2+1=3。3%3=0。清單第 0 格是普通。輸出 <code>普通</code>。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            hud(["讀進來", "M=1 D=1"]),
            hud(["M×2+D=3"]) + P().remainderDots(3, 3),
            hud(["s=0", "輸出 普通"]) + K().fortune(0),
          ]);
        },
      },
      {
        id: "sample2",
        title: "換一個日期再算一次",
        teach: `<p>10 月 10 日：10×2+10=30。30 % 3 = 0，又是普通。</p>
          <p>12 月 31 日：12×2+31=55。55 = 18×3 + 1，餘數 1，吉。</p>
          <p>同一個餘數就同一張籤。不必把所有日期背起來。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            hud(["10×2+10=30", "30 % 3 = 0"]) + K().fortune(0) + `<p>10 10 → 普通</p>`,
            hud(["12×2+31=55", "55 % 3 = 1"]) + K().fortune(1) + `<p>12 31 → 吉</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>ZeroJudge 把範例當成鍵盤打進來的文字。這題只有一行 <code>1 1</code>。</p>
          <p><code>input()</code> 很死板：每次呼叫，吃掉目前還沒讀的那一行，得到的是字串 <code>"1 1"</code>，還不是兩個整數。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: ["M, D = map(int, input().split())"], hi: 0, stdin: ["1 1"], stdinAt: 0, vars: { 讀到: "" }, note: "評測機那一行還沒吃進來。" },
            { lines: ["M, D = map(int, input().split())"], hi: 0, stdin: ["1 1"], stdinAt: 1, vars: { 讀到: "1 1" }, note: "現在手上是字串，中間有空格。" },
          ]);
        },
      },
      {
        id: "pysplit",
        title: "一行裡有兩個數字",
        teach: `<p><code>1 1</code> 要拆成月份和日期。</p>
          <ul>
            <li><code>split()</code>：看到空格就剪開，變成 <code>["1", "1"]</code></li>
            <li><code>map(int, ...)</code>：每一段都變成真正的整數</li>
            <li><code>M, D = ...</code>：左邊第一個給 M，第二個給 D</li>
          </ul>
          <div class="note"><strong>這三行請當口訣</strong>一行兩個數，APCS 幾乎每題都這樣讀。</div>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: A003, hi: 0, stdin: ["1 1"], stdinAt: 1, vars: { M: 1, D: 1 }, glow: "M", note: "同一行兩個整數，對到 M 和 D。" },
          ]);
        },
      },
      {
        id: "pymod",
        title: "為什麼要用 %",
        teach: `<p>燈那題用 % 把時間折進一個週期。這題用 % 把日期折進 0、1、2。</p>
          <p><code>s = (M * 2 + D) % 3</code>。括號先算加減乘，再取餘數。不要先 % 再加，順序會錯。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: A003, hi: 1, vars: { M: 1, D: 1, s: 0 }, glow: "s", visual: P().remainderDots(3, 3), note: "3 % 3 = 0。" },
            { lines: A003, hi: 1, vars: { M: 12, D: 31, s: 1 }, visual: K().fortune(1), note: "55 % 3 = 1。" },
          ]);
        },
      },
      {
        id: "pylist",
        title: "用 s 去清單裡拿中文",
        teach: `<p>清單從 0 開始數。<code>["普通", "吉", "大吉"][s]</code>：s=0 拿普通，s=1 拿吉。</p>
          <p>最後 <code>print(...)</code> 把那個詞印出來。後面不要多空格。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: A003, hi: 2, vars: { s: 0, 輸出: "普通" }, visual: K().fortune(0), note: "清單第 0 格。" },
            { lines: A003, hi: 2, vars: { s: 1, 輸出: "吉" }, visual: K().fortune(1), note: "清單第 1 格。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀兩個數 → 算 s → 用清單印中文。三行就交卷。</p>
          <p>比賽從第一行開始跑，不要包 <code>def main()</code>。</p>`,
        draw(stage) {
          K().full(stage, A003);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>先算出 0、1、2，再對表。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = P().remainderDots(3, 3) + K().fortune(0) + note("1 1 → 普通。");
        },
      },
      {
        id: "play",
        title: "自己改日期試試看",
        teach: `<p>改 M 和 D，先自己算餘數，再對籤。想清楚這件事就可以交卷：<strong>先算出 0、1、2，再對表。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試日期</span>`, { M: 1, D: 1 }, (s) => {
            const f = fortuneOf(s.M, s.D);
            return K().fieldRow(K().numField("M", "月 M", s.M) + K().numField("D", "日 D", s.D)) +
              (Math.abs(f.n) <= 18 ? P().remainderDots(Math.abs(f.n), 3) : hud([`${s.M}×2+${s.D}=${f.n}`, `${f.n} % 3 = ${f.r}`])) + K().fortune(f.r) +
              `<p>(${s.M}×2+${s.D}) % 3 = <b>${f.r}</b> → ${f.word}</p>`;
          });
        },
      },
    ],
  });

  /* ——— a004 ——— */
  function leapDraw(y) {
    const L = leapOf(y);
    return `<p class="if-year">${y}</p>${K().gates(L.gates)}<p>${L.leap ? "閏年" : "平年"}</p>`;
  }
  reg({
    id: "a004",
    title: "文文的求婚",
    steps: [
      {
        id: "story",
        title: "閏年還是平年",
        teach: `<p>多行年份，每行判斷閏年或平年，讀到檔案結束。</p>
          <p>規則要照這個順序問，不能跳：能被 400 整除 → 閏；其餘能被 100 整除 → 平；其餘能被 4 整除 → 閏。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">先 400，再 100，再 4</span>`);
          canvas.innerHTML = leapDraw(2000);
        },
      },
      {
        id: "order",
        title: "三道門，依序走",
        teach: `<p>2000 能被 400 整除，第一道門就出去，答案閏年。</p>
          <p>1900 不能被 400、能被 100，第二道門出去，平年。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            leapDraw(2000) + `<p>2000：第一道門就過。</p>`,
            leapDraw(1900) + `<p>1900：被 100 擋下來，平年。</p>`,
            leapDraw(2004) + `<p>2004：走到第三道門，閏年。</p>`,
            leapDraw(1999) + `<p>1999：三道門都不過，平年。</p>`,
          ]);
        },
      },
      {
        id: "trap",
        title: "不要先問能不能被 4 整除",
        teach: `<p>1900 也能被 4 整除。如果先寫 <code>if y % 4 == 0</code>，會誤判成閏年。</p>
          <p>世紀年（00 結尾）要先被 400 那道門過濾。能被 100 整除但不能被 400 整除的，是平年。</p>
          <div class="note"><strong>整題就這一個轉折</strong>門的順序是 400 → 100 → 4，不能跳。</div>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            leapDraw(1900) + `<p>正確：停在 100，平年。</p>`,
            K().fork({ q: "先問 1900 % 4 == 0？", yes: "會誤判閏年", no: "先問 400 和 100", take: "yes" }) +
              note("所以 if / elif 的順序要跟門一樣。"),
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例逐步對一次",
        teach: `<p>輸入三行：</p>
          <pre class="eq">2000
1999
2004</pre>
          <p>2000 閏年、1999 平年、2004 閏年。每一行獨立判斷，前一行不會改到後一行。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            leapDraw(2000) + `<p>第一行 → 閏年</p>`,
            leapDraw(1999) + `<p>第二行 → 平年</p>`,
            leapDraw(2004) + `<p>第三行 → 閏年</p>`,
          ]);
        },
      },
      {
        id: "eof",
        title: "讀到檔案結束",
        teach: `<p>不知道有幾行。用 <code>for line in sys.stdin</code>，評測機送完就停。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: ["import sys", "for line in sys.stdin:", "    y = int(line)"], hi: 1, stdin: ["2000", "1999", "2004"], stdinAt: 0, note: "一行一行進來，沒有先告訴你有幾年。" },
            { lines: ["import sys", "for line in sys.stdin:", "    y = int(line)"], hi: 2, stdin: ["2000", "1999", "2004"], stdinAt: 0, vars: { y: 2000 }, glow: "y" },
            { lines: ["import sys", "for line in sys.stdin:", "    y = int(line)"], hi: 2, stdin: ["2000", "1999", "2004"], stdinAt: 2, vars: { y: 2004 }, glow: "y", note: "第三行。後面沒了就結束。" },
          ]);
        },
      },
      {
        id: "pyin",
        title: "不知道有幾行，就一行一行吃",
        teach: `<p>這題沒有先告訴你 n。評測機把年份一行一行送進來，送完就停。</p>
          <p><code>import sys</code> 之後 <code>for line in sys.stdin:</code>：每次把目前那一行叫做 line，沒有下一行就結束。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: ["import sys", "for line in sys.stdin:", "    y = int(line)"], hi: 0, stdin: ["2000", "1999", "2004"], stdinAt: 0, note: "先把 sys 請來。沒有它，stdin 這條河不認得。" },
            { lines: ["import sys", "for line in sys.stdin:", "    y = int(line)"], hi: 1, stdin: ["2000", "1999", "2004"], stdinAt: 0, note: "迴圈還沒吃第一行。" },
            { lines: ["import sys", "for line in sys.stdin:", "    y = int(line)"], hi: 2, stdin: ["2000", "1999", "2004"], stdinAt: 1, vars: { y: 2000 }, glow: "y" },
          ]);
        },
      },
      {
        id: "py400",
        title: "第一道門：y % 400 == 0",
        teach: `<p>能被 400 整除，立刻印閏年，後面的 elif 都不看。2000 走這裡。</p>`,
        draw(stage, runtime) {
          const lines = ["if y % 400 == 0:", "    print(\"閏年\")", "elif y % 100 == 0:", "    print(\"平年\")", "elif y % 4 == 0:", "    print(\"閏年\")", "else:", "    print(\"平年\")"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { y: 2000, 輸出: "閏年" }, visual: leapDraw(2000), note: "第一道門就出去。" },
          ]);
        },
      },
      {
        id: "py100",
        title: "第二道門：其餘能被 100 整除",
        teach: `<p>elif 的意思是「上面那題沒成立，才問我」。1900 過不了 400，但過得了 100，印平年。</p>`,
        draw(stage, runtime) {
          const lines = ["if y % 400 == 0:", "    print(\"閏年\")", "elif y % 100 == 0:", "    print(\"平年\")", "elif y % 4 == 0:", "    print(\"閏年\")", "else:", "    print(\"平年\")"];
          K().py(stage, runtime, [
            { lines, hi: 3, vars: { y: 1900, 輸出: "平年" }, visual: leapDraw(1900), note: "世紀年、不是 400 的倍數。" },
          ]);
        },
      },
      {
        id: "py4",
        title: "第三道門，過不了就平年",
        teach: `<p>2004 能被 4 整除，閏年。1999 三道門都不過，else 印平年。</p>
          <p>輸出是中文「閏年」「平年」，不要印 leap。</p>`,
        draw(stage, runtime) {
          const lines = ["if y % 400 == 0:", "    print(\"閏年\")", "elif y % 100 == 0:", "    print(\"平年\")", "elif y % 4 == 0:", "    print(\"閏年\")", "else:", "    print(\"平年\")"];
          K().py(stage, runtime, [
            { lines, hi: 5, vars: { y: 2004, 輸出: "閏年" }, visual: leapDraw(2004) },
            { lines, hi: 7, vars: { y: 1999, 輸出: "平年" }, visual: leapDraw(1999) },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>多行測資記得 import sys。迴圈裡面把三道門寫完。比賽從第一行開始跑。</p>`,
        draw(stage) {
          K().full(stage, ["import sys", "for line in sys.stdin:", "    y = int(line)", "    if y % 400 == 0:", "        print(\"閏年\")", "    elif y % 100 == 0:", "        print(\"平年\")", "    elif y % 4 == 0:", "        print(\"閏年\")", "    else:", "        print(\"平年\")"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>先 400，再 100，再 4。多行用 sys.stdin。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = leapDraw(2000) + note("閏年。");
        },
      },
      {
        id: "play",
        title: "自己改年份試試看",
        teach: `<p>換一個年份，看它停在哪一道門。想清楚這件事就可以交卷：<strong>先 400，再 100，再 4。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試年份</span>`, { y: 2000 }, (s) => {
            const L = leapOf(s.y);
            return K().fieldRow(K().numField("y", "年份", s.y)) + leapDraw(s.y) +
              `<p>答案：<b>${L.leap ? "閏年" : "平年"}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— d058 ——— */
  reg({
    id: "d058",
    title: "BASIC 的 SGN 函數",
    steps: [
      {
        id: "story",
        title: "正、負、還是零",
        teach: `<p>輸入一個整數 n。正的印 1，負的印 −1，剛好 0 印 0。</p>
          <p>這是三路判斷的原型：先問是不是 0，再問正負。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">n = −10</span>`);
          canvas.innerHTML = K().sgnLine(-10);
        },
      },
      {
        id: "three",
        title: "數線上的三區",
        teach: `<p>0 是中間那一點。左邊全部是負，右邊全部是正。</p>
          <p>不要只寫兩個 if，零會沒人理。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().sgnLine(-10) + `<p>−10 在左邊，答案 −1。</p>`,
            K().sgnLine(0) + `<p>剛好踩在 0。</p>`,
            K().sgnLine(7) + `<p>7 在右邊，答案 1。</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "為什麼不能只寫兩個 if",
        teach: `<p>如果只問正、再問負，0 兩邊都不進，程式沒輸出。ZeroJudge 會判錯。</p>
          <p>三路判斷一定要有 else（或第三個 if n==0）。0 是中間那一點，不是「剩下不管」。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">0 也要有路</span>`);
          canvas.innerHTML = K().sgnLine(0) + K().fork({ q: "漏掉 else？", yes: "輸入 0 沒輸出", no: "三路都寫到", take: "yes" });
        },
      },
      {
        id: "see",
        title: "先指出現在站在哪一區",
        teach: `<p>不要急著寫 if。先在數線上指：左邊、原點、還是右邊。</p>
          <p>指到哪一區，答案就是那一區上面寫的 −1、0、1。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().sgnLine(-3) + `<p>左邊。</p>`,
            K().sgnLine(0) + `<p>原點。</p>`,
            K().sgnLine(4) + `<p>右邊。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例 −10 對一次",
        teach: `<p>輸入 <code>-10</code>。在數線左邊，輸出 <code>-1</code>。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().sgnLine(-10) + `<p>先問 &gt; 0？不是。</p>`,
            K().sgnLine(-10) + `<p>再問 &lt; 0？是。印 −1。</p>`,
          ]);
        },
      },
      {
        id: "sample0",
        title: "剛好 0，印 0",
        teach: `<p>0 不是正也不是負。兩道門都不過，走 else。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">輸出 0</span>`);
          canvas.innerHTML = K().sgnLine(0) + `<p>踩在原點。</p>`;
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>這題只有一個整數。 <code>n = int(input())</code>：吃掉那一行，再變成整數。負號會一起讀進來。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["-10"], stdinAt: 0, vars: { n: "" }, note: "評測機把 −10 打進來。" },
            { lines, hi: 0, stdin: ["-10"], stdinAt: 1, vars: { n: -10 }, glow: "n" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "if / elif / else 三路",
        teach: `<p>先 <code>n &gt; 0</code> 印 1，再 <code>n &lt; 0</code> 印 −1，剩下一定是 0。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "if n > 0:", "    print(1)", "elif n < 0:", "    print(-1)", "else:", "    print(0)"];
          K().py(stage, runtime, [
            { lines, hi: 3, vars: { n: -10 }, visual: K().sgnLine(-10), note: "−10 &gt; 0？不是。−10 &lt; 0？是。" },
            { lines, hi: 4, vars: { n: -10, 輸出: -1 }, glow: "輸出" },
            { lines, hi: 1, vars: { n: 7, 輸出: 1 }, visual: K().sgnLine(7) },
            { lines, hi: 6, vars: { n: 0, 輸出: 0 }, visual: K().sgnLine(0) },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>三路都要寫到。漏掉 else，輸入 0 就沒輸出。</p>`,
        draw(stage) {
          K().full(stage, ["n = int(input())", "if n > 0:", "    print(1)", "elif n < 0:", "    print(-1)", "else:", "    print(0)"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>正 1、負 −1、零 0。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().sgnLine(-10) + note("輸出 −1。");
        },
      },
      {
        id: "play",
        title: "自己改數字試試看",
        teach: `<p>換成正的、負的、0，看停在哪一區。想清楚這件事就可以交卷：<strong>正 1、負 −1、零 0。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試 n</span>`, { n: -10 }, (s) => {
            const out = s.n > 0 ? 1 : s.n < 0 ? -1 : 0;
            return K().fieldRow(K().numField("n", "n", s.n)) + K().sgnLine(s.n) + `<p>輸出 <b>${out}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— d060 ——— */
  function wait25(m) {
    return ((25 - m) % 60 + 60) % 60;
  }
  reg({
    id: "d060",
    title: "還要等多久啊？",
    steps: [
      {
        id: "story",
        title: "等到 xx:25 再打電話",
        teach: `<p>珊珊下課都在整點過後 25 分。現在這一小時的第 m 分，還要幾分才到 25？</p>
          <p>剛好 25 分就印 0，不用再等。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">目標 :25</span>`);
          canvas.innerHTML = K().clock(10, 4, 10 * 60 + 25) + `<p>現在 10:04，還要 <b>21</b> 分才到 10:25。</p>`;
        },
      },
      {
        id: "wrap",
        title: "過了 25 分就繞到下一小時",
        teach: `<p>26 分已經過了這次的 25，要等到下一小時的 25 分：再 59 分。</p>
          <p><code>(25 − m) % 60</code> 會自動折回來。Python 的負數餘數仍是非負，26 得到 59。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().clock(10, 25, 10 * 60 + 25) + `<p>剛好 25，等 0 分。</p>`,
            K().clock(10, 4, 10 * 60 + 25) + `<p>4 到 25，等 21 分。範例答案 21。</p>`,
            K().clock(10, 26, 11 * 60 + 25) + `<p>26 已過，繞到下一圈，等 59 分。</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "為什麼用 % 60，不要寫兩段 if",
        teach: `<p>可以寫「如果 m≤25 就 25−m，否則繞到下一小時」。但 <code>(25 − m) % 60</code> 一次做完。</p>
          <p>Python 的負數餘數仍是非負：25−26=−1，−1 % 60 = 59。剛好是「再 59 分」。</p>
          <div class="note"><strong>記住一個詞：週期</strong>一小時 60 分。超過 25 就折到下一圈。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">(25 − m) % 60</span>`);
          canvas.innerHTML = P().remainderDots(21, 60) + note("4 到 25 差 21，還沒滿 60，餘數就是 21。");
        },
      },
      {
        id: "see",
        title: "先在鐘面上指出 25 分",
        teach: `<p>不管現在幾點，目標永遠是這一小時或下一小時的 25 分。</p>
          <p>現在比 25 早，往前數；已經過了，繞一圈再數。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().clock(10, 0, 10 * 60 + 25) + `<p>0 分，還要 25 分。</p>`,
            K().clock(10, 40, 11 * 60 + 25) + `<p>40 分已過，繞到 11:25，還要 45 分。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例 4 分對一次",
        teach: `<p>輸入 <code>4</code>。目標 25。25−4=21。21 % 60=21。輸出 21。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().clock(10, 4, 10 * 60 + 25) + `<p>現在 4 分。</p>`,
            hud(["25 − 4 = 21", "輸出 21"]) + `<p>還沒過 25，不用繞圈。</p>`,
          ]);
        },
      },
      {
        id: "sample2",
        title: "26 分要繞到下一小時",
        teach: `<p>26 已經過了這次的 25。再等 59 分才到下一小時的 25。</p>
          <p>剛好 25 分：差 0，印 0。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().clock(10, 26, 11 * 60 + 25) + `<p>26 → 59</p>`,
            K().clock(10, 25, 10 * 60 + 25) + `<p>剛好 25 → 0</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>輸入只有「分」，沒有小時。<code>m = int(input())</code> 吃掉那一行。</p>`,
        draw(stage, runtime) {
          const lines = ["m = int(input())", "print((25 - m) % 60)"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["4"], stdinAt: 0, vars: { m: "" } },
            { lines, hi: 0, stdin: ["4"], stdinAt: 1, vars: { m: 4 }, glow: "m" },
          ]);
        },
      },
      {
        id: "pymod",
        title: "print((25 − m) % 60)",
        teach: `<p>括號先減，再對 60 取餘數。不要寫成 25 − m % 60，% 會先算，答案就歪了。</p>`,
        draw(stage, runtime) {
          const lines = ["m = int(input())", "print((25 - m) % 60)"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { m: 4, 輸出: 21 }, note: "(25−4) % 60 = 21。" },
            { lines, hi: 1, vars: { m: 26, 輸出: 59 }, note: "(25−26) % 60 = 59。" },
            { lines, hi: 1, vars: { m: 25, 輸出: 0 }, note: "剛好，餘數 0。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>兩行。對一下範例 4 → 21。</p>`,
        draw(stage) { K().full(stage, ["m = int(input())", "print((25 - m) % 60)"]); },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>目標 25，對 60 折回來。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().clock(10, 4, 10 * 60 + 25) + note("4 → 21。");
        },
      },
      {
        id: "play",
        title: "自己改現在的分",
        teach: `<p>m 填 0 到 59。先猜還要幾分，再對答案。想清楚這件事就可以交卷：<strong>目標 25，對 60 折回來。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試分鐘</span>`, { m: 4 }, (s) => {
            const m = Math.max(0, Math.min(59, s.m));
            const w = wait25(m);
            return K().fieldRow(K().numField("m", "現在 m 分", m)) +
              `<p>目標 :25　還要 <b>${w}</b> 分</p>`;
          });
        },
      },
    ],
  });

  /* ——— d063 ——— */
  reg({
    id: "d063",
    title: "0 與 1",
    steps: [
      {
        id: "story",
        title: "翻到另一面",
        teach: `<p>輸入只有 0 或 1。0 要印 1，1 要印 0。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">翻面</span>`);
          canvas.innerHTML = K().flip(0) + K().fork({ q: "n == 0？", yes: "印 1", no: "印 0", take: "yes" });
        },
      },
      {
        id: "if",
        title: "兩條路",
        teach: `<p>先寫 if 看清楚兩條路，再發現 <code>1 − n</code> 一次翻過來。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().flip(0) + K().fork({ q: "n == 0？", yes: "印 1", no: "印 0", take: "yes" }) + `<p>輸入 0，走成立。</p>`,
            K().flip(1) + K().fork({ q: "n == 0？", yes: "印 1", no: "印 0", take: "no" }) + `<p>輸入 1，走不成立。</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "1 − n 為什麼能翻面",
        teach: `<p>1−0=1，1−1=0。兩條路收成一行減法。</p>
          <p>課堂先寫 if 讓兩條路看得見。交卷用 1−n 比較短，答案要一樣。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            hud(["n=0", "1−0=1"]) + K().flip(0),
            hud(["n=1", "1−1=0"]) + K().flip(1),
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例 0 → 1",
        teach: `<p>輸入 <code>0</code>，輸出 <code>1</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">翻面</span>`);
          canvas.innerHTML = K().flip(0) + `<p>輸出 1</p>`;
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p><code>n = int(input())</code> 吃掉 0 或 1。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "print(1 - n)"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["0"], stdinAt: 0, vars: { n: "" } },
            { lines, hi: 0, stdin: ["0"], stdinAt: 1, vars: { n: 0 }, glow: "n" },
          ]);
        },
      },
      {
        id: "pysub",
        title: "print(1 − n)",
        teach: `<p>減完直接印。不要再寫 if，除非老師要你練習分支。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "print(1 - n)"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { n: 0, 輸出: 1 }, visual: K().flip(0), note: "1 − 0 = 1。" },
            { lines, hi: 1, vars: { n: 1, 輸出: 0 }, visual: K().flip(1), note: "1 − 1 = 0。" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "想寫 if 也可以",
        teach: `<p>課堂上可以先寫：</p>
          <pre class="eq">if n == 0:
    print(1)
else:
    print(0)</pre>
          <p>跟 1−n 答案相同。交卷用哪一種都行。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "if n == 0:", "    print(1)", "else:", "    print(0)"];
          K().py(stage, runtime, [
            { lines, hi: 2, vars: { n: 0, 輸出: 1 }, visual: K().flip(0) },
            { lines, hi: 4, vars: { n: 1, 輸出: 0 }, visual: K().flip(1) },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>兩行。想寫 if 也可以，答案要一樣。</p>`,
        draw(stage) { K().full(stage, ["n = int(input())", "print(1 - n)"]); },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>0 變 1，1 變 0。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().flip(0) + note("1 − n。");
        },
      },
      {
        id: "play",
        title: "自己翻試試看",
        teach: `<p>n 填 0 或 1。想清楚這件事就可以交卷：<strong>0 變 1，1 變 0。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試 0 / 1</span>`, { n: 0 }, (s) => {
            const n = s.n ? 1 : 0;
            return K().fieldRow(K().numField("n", "n", n)) + K().flip(n) + `<p>輸出 <b>${1 - n}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— d064 ——— */
  reg({
    id: "d064",
    title: "ㄑㄧˊ 數？",
    steps: [
      {
        id: "story",
        title: "奇數還是偶數",
        teach: `<p>輸入一個整數。偶數印 Even，奇數印 Odd。</p>
          <p>看除以 2 的餘數：0 是偶，1 是奇。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">3 % 2 = 1</span>`);
          canvas.innerHTML = P().remainderDots(3, 2) + K().fork({ q: "n % 2 == 0？", yes: "Even", no: "Odd", take: "no" });
        },
      },
      {
        id: "mod",
        title: "% 2 只會剩 0 或 1",
        teach: `<p>4 = 2+2，剩 0，Even。5 = 2+2+1，剩 1，Odd。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            P().remainderDots(4, 2) + K().fork({ q: "4 % 2 == 0？", yes: "Even", no: "Odd", take: "yes" }),
            P().remainderDots(3, 2) + K().fork({ q: "3 % 2 == 0？", yes: "Even", no: "Odd", take: "no" }),
          ]);
        },
      },
      {
        id: "edge",
        title: "負數在 Python 也適用",
        teach: `<p>−3 % 2 在 Python 是 1，仍是奇數。題目測資通常是正的，但用 % 2 不用先 abs。</p>
          <p>0 是偶數：0 % 2 = 0，Even。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            P().remainderDots(0, 2) + K().fork({ q: "0 % 2 == 0？", yes: "Even", no: "Odd", take: "yes" }),
            P().remainderDots(4, 2) + `<p>4 剩 0，Even。</p>`,
          ]);
        },
      },
      {
        id: "see",
        title: "先用眼睛數剩幾顆",
        teach: `<p>不要急著寫程式。把 n 顆糖，每 2 顆裝一袋，看袋子外面剩幾顆。</p>
          <p>剩 0 就是 Even。剩 1 就是 Odd。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            P().remainderDots(6, 2) + `<p>6 裝 3 袋，沒剩 → Even</p>`,
            P().remainderDots(5, 2) + `<p>5 裝 2 袋，剩 1 → Odd</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例 3 對一次",
        teach: `<p>輸入 <code>3</code>。3=2+1，剩 1。不是 0，印 Odd。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">Odd</span>`);
          canvas.innerHTML = P().remainderDots(3, 2) + K().fork({ q: "3 % 2 == 0？", yes: "Even", no: "Odd", take: "no" });
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p><code>n = int(input())</code> 吃掉那一個整數。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "print(\"Even\" if n % 2 == 0 else \"Odd\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["3"], stdinAt: 0, vars: { n: "" } },
            { lines, hi: 0, stdin: ["3"], stdinAt: 1, vars: { n: 3 }, glow: "n" },
          ]);
        },
      },
      {
        id: "pymod",
        title: "n % 2 == 0 就是偶數",
        teach: `<p><code>print("Even" if n % 2 == 0 else "Odd")</code> 是一行版的 if。英文 Even / Odd，第一個字母大寫。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "print(\"Even\" if n % 2 == 0 else \"Odd\")"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { n: 3, 餘數: 1, 輸出: "Odd" }, visual: P().remainderDots(3, 2), note: "3 % 2 = 1，不是 0，走 else。" },
            { lines, hi: 1, vars: { n: 4, 餘數: 0, 輸出: "Even" }, visual: P().remainderDots(4, 2) },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>兩行。想拆成 if / else 也可以。</p>`,
        draw(stage) { K().full(stage, ["n = int(input())", "print(\"Even\" if n % 2 == 0 else \"Odd\")"]); },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>餘數 0 是 Even，1 是 Odd。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = P().remainderDots(3, 2) + note("Odd。");
        },
      },
      {
        id: "play",
        title: "自己改數字試試看",
        teach: `<p>換成偶數看袋子有沒有剩。想清楚這件事就可以交卷：<strong>餘數 0 是 Even，1 是 Odd。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試 n</span>`, { n: 3 }, (s) => {
            const n = Math.abs(s.n | 0);
            const even = n % 2 === 0;
            return K().fieldRow(K().numField("n", "n", n)) + P().remainderDots(n || 0, 2) +
              K().fork({ q: "n % 2 == 0？", yes: "Even", no: "Odd", take: even ? "yes" : "no" });
          });
        },
      },
    ],
  });

  /* ——— d065 ——— */
  reg({
    id: "d065",
    title: "三人行必有我師",
    steps: [
      {
        id: "story",
        title: "三個數誰最大",
        teach: `<p>一行三個整數，輸出最大的那個。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">1 3 2</span>`);
          canvas.innerHTML = K().bars([1, 3, 2], 1) + `<p>中間那根最高，答案 3。</p>`;
        },
      },
      {
        id: "cmp",
        title: "兩兩比",
        teach: `<p>可以先比 a 和 b，贏家再跟 c 比。Python 也可以 <code>max(a, b, c)</code> 一次比完。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().bars([1, 3, 2], 0) + `<p>先看 a=1。</p>`,
            K().bars([1, 3, 2], 1) + `<p>b=3 比較大。</p>`,
            K().bars([1, 3, 2], 1) + `<p>c=2 沒有比較大。最大是 3。</p>`,
          ]);
        },
      },
      {
        id: "edge",
        title: "三個都是負的，最大是比較不負的",
        teach: `<p>−5、−1、−9 的最大是 −1，不是 0。max 看的是數線最右邊，不是絕對值。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().bars([-5, -1, -9], 1) + `<p>最大是 −1。</p>`,
            K().bars([1, 1, 1], 0) + `<p>三個一樣，印 1 即可。</p>`,
          ]);
        },
      },
      {
        id: "ifway",
        title: "先寫 if 兩兩比也可以",
        teach: `<p>先比 a 和 b，贏家叫 ans，再跟 c 比。三個 if 也能過。</p>
          <p>交卷用 max 比較短。兩種答案要一樣。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().bars([1, 3, 2], 0) + K().bars([1, 3, 2], 1) + `<p>a 和 b，3 贏。</p>`,
            K().bars([1, 3, 2], 1) + `<p>3 再跟 2 比，仍是 3。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例 1 3 2 對一次",
        teach: `<p>輸入 <code>1 3 2</code>。中間最高，輸出 3。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().bars([1, 3, 2], 0) + `<p>a=1</p>`,
            K().bars([1, 3, 2], 1) + `<p>b=3 比較大</p>`,
            K().bars([1, 3, 2], 1) + `<p>c=2 沒贏過。答案 3</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "一行裡有三個數字",
        teach: `<p><code>a, b, c = map(int, input().split())</code>。空格剪開，三個整數對到 a、b、c。</p>
          <div class="note"><strong>這三行請當口訣</strong>一行兩個數、一行三個數，都是 split、map、int。</div>`,
        draw(stage, runtime) {
          const lines = ["a, b, c = map(int, input().split())", "print(max(a, b, c))"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["1 3 2"], stdinAt: 0, vars: { a: "", b: "", c: "" } },
            { lines, hi: 0, stdin: ["1 3 2"], stdinAt: 1, vars: { a: 1, b: 3, c: 2 }, glow: "b" },
          ]);
        },
      },
      {
        id: "pymax",
        title: "print(max(a, b, c))",
        teach: `<p>課堂可以先寫 if 兩兩比，交卷用 max 比較不容易寫錯。</p>`,
        draw(stage, runtime) {
          const lines = ["a, b, c = map(int, input().split())", "print(max(a, b, c))"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { a: 1, b: 3, c: 2, 輸出: 3 }, visual: K().bars([1, 3, 2], 1) },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>兩行。</p>`,
        draw(stage) { K().full(stage, ["a, b, c = map(int, input().split())", "print(max(a, b, c))"]); },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>三個數取 max。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().bars([1, 3, 2], 1) + note("答案 3。");
        },
      },
      {
        id: "play",
        title: "自己改三個數試試看",
        teach: `<p>改 a、b、c，金色是目前最大。想清楚這件事就可以交卷：<strong>三個數取 max。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試三數</span>`, { a: 1, b: 3, c: 2 }, (s) => {
            const mx = Math.max(s.a, s.b, s.c);
            const hi = [s.a, s.b, s.c].indexOf(mx);
            return K().fieldRow(K().numField("a", "a", s.a) + K().numField("b", "b", s.b) + K().numField("c", "c", s.c)) +
              K().bars([s.a, s.b, s.c], hi) + `<p>最大 <b>${mx}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— d066 ——— */
  function atSchool(h, m) {
    const t = h * 60 + m;
    return t >= 7 * 60 + 30 && t < 17 * 60;
  }
  reg({
    id: "d066",
    title: "上學去吧！",
    steps: [
      {
        id: "story",
        title: "7:30 到校，17:00 下課",
        teach: `<p>板橋高中 7:30 早自習，17:00 下課。現在時刻在這個區間（含 7:30，不含 17:00）印 At School，否則 Off School。</p>
          <p>兩個數字要一起看，不能只看小時。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">17:00 下課</span>`);
          canvas.innerHTML = K().clock(17, 0, 17 * 60) + K().fork({ q: "7:30 ≤ 現在 < 17:00？", yes: "At School", no: "Off School", take: "no" });
        },
      },
      {
        id: "min",
        title: "折成分鐘再夾在兩端中間",
        teach: `<p>H×60+M 變成「從 0:00 走了幾分」。7:30 = 450，17:00 = 1020。</p>
          <p>7:29 太早。7:30 開始上學。16:59 還在。17:00 已經放學。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().clock(7, 29, 17 * 60) + `<p>7:29 = 449 &lt; 450，Off School。</p>`,
            K().clock(7, 30, 17 * 60) + `<p>剛好 450，At School。</p>`,
            K().clock(16, 59, 17 * 60) + `<p>1019 &lt; 1020，還在學校。</p>`,
            K().clock(17, 0, 17 * 60) + `<p>剛好 1020，Off School。</p>`,
          ]);
        },
      },
      {
        id: "edge",
        title: "7:30 含，17:00 不含",
        teach: `<p>左邊有等號，右邊沒有。<code>450 ≤ t &lt; 1020</code>。</p>
          <p>寫成 t ≤ 1020 會把 17:00 算成還在學校，範例就錯。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().clock(7, 30, 17 * 60) + K().fork({ q: "剛好 7:30？", yes: "At School", no: "Off School", take: "yes" }),
            K().clock(17, 0, 17 * 60) + K().fork({ q: "剛好 17:00？", yes: "At School", no: "Off School", take: "no" }),
          ]);
        },
      },
      {
        id: "see",
        title: "先畫一天的時間軸",
        teach: `<p>從 0:00 數到 23:59。上學區間是 7:30 到 17:00 前。把它看成數線上的一段。</p>
          <p>現在這一刻落在這一段裡面，才是 At School。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().clock(8, 0, 17 * 60) + `<p>8:00 在區間裡。</p>`,
            K().clock(18, 0, 17 * 60) + `<p>18:00 在區間外。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例 17 00 對一次",
        teach: `<p>輸入 <code>17 00</code>。t=1020。1020 &lt; 1020 不成立。輸出 Off School。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            hud(["h=17", "m=0", "t=1020"]),
            K().clock(17, 0, 17 * 60) + `<p>已經下課。</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "一行兩個數：時、分",
        teach: `<p><code>h, m = map(int, input().split())</code>。00 讀進來仍是整數 0。</p>`,
        draw(stage, runtime) {
          const lines = ["h, m = map(int, input().split())", "t = h * 60 + m", "if 7 * 60 + 30 <= t < 17 * 60:", "    print(\"At School\")", "else:", "    print(\"Off School\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["17 00"], stdinAt: 0, vars: { h: "", m: "" } },
            { lines, hi: 0, stdin: ["17 00"], stdinAt: 1, vars: { h: 17, m: 0 }, glow: "h" },
          ]);
        },
      },
      {
        id: "pyt",
        title: "先折成分鐘，再夾在兩端中間",
        teach: `<p><code>t = h * 60 + m</code>。7:30 寫成 <code>7 * 60 + 30</code>，不要先算出 450 再寫死，以後改時間比較好找。</p>
          <p>輸出 At School / Off School，空白和大小寫都要對。</p>`,
        draw(stage, runtime) {
          const lines = ["h, m = map(int, input().split())", "t = h * 60 + m", "if 7 * 60 + 30 <= t < 17 * 60:", "    print(\"At School\")", "else:", "    print(\"Off School\")"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { h: 17, m: 0, t: 1020 }, visual: K().clock(17, 0, 1020), note: "折成分鐘。" },
            { lines, hi: 2, vars: { t: 1020 }, note: "1020 &lt; 1020？不成立。" },
            { lines, hi: 5, vars: { 輸出: "Off School" } },
            { lines, hi: 3, vars: { h: 7, m: 30, t: 450, 輸出: "At School" }, visual: K().clock(7, 30, 17 * 60) },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀時分 → 折成分鐘 → 夾在 7:30 和 17:00 中間。</p>`,
        draw(stage) {
          K().full(stage, ["h, m = map(int, input().split())", "t = h * 60 + m", "if 7 * 60 + 30 <= t < 17 * 60:", "    print(\"At School\")", "else:", "    print(\"Off School\")"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>折成分鐘，含 7:30 不含 17:00。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().clock(17, 0, 17 * 60) + note("Off School。");
        },
      },
      {
        id: "play",
        title: "自己改時間試試看",
        teach: `<p>試試 7:29、7:30、17:00。邊界最容易寫錯。想清楚這件事就可以交卷：<strong>折成分鐘，含起點不含終點。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試時刻</span>`, { h: 17, m: 0 }, (s) => {
            const at = atSchool(s.h, s.m);
            return K().fieldRow(K().numField("h", "時", s.h) + K().numField("m", "分", s.m)) +
              K().clock(s.h, s.m, 17 * 60) +
              K().fork({ q: "7:30 ≤ 現在 < 17:00？", yes: "At School", no: "Off School", take: at ? "yes" : "no" });
          });
        },
      },
    ],
  });

  /* ——— d067 ——— */
  reg({
    id: "d067",
    title: "格瑞哥里的煩惱（一行）",
    steps: [
      {
        id: "story",
        title: "閏年，換成英文",
        teach: `<p>規則跟「文文的求婚」一樣，只是只讀一年，而且印 <code>a leap year</code> 或 <code>a normal year</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">2000</span>`);
          canvas.innerHTML = leapDraw(2000) + `<p>輸出 a leap year。</p>`;
        },
      },
      {
        id: "one",
        title: "一行就結束",
        teach: `<p>這裡沒有多行。讀一次 y 就判斷。不必 sys.stdin。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            leapDraw(2000) + `<p>2000 → a leap year</p>`,
            leapDraw(1999) + `<p>1999 → a normal year</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例 2000 對一次",
        teach: `<p>輸入 <code>2000</code>。能被 400 整除，leap 是 True。輸出 <code>a leap year</code>。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            leapDraw(2000) + `<p>第一道門就出去。</p>`,
            hud(["輸出 a leap year"]),
          ]);
        },
      },
      {
        id: "sample2",
        title: "1999 是平年",
        teach: `<p>1999 不能被 4 整除。三道門都不過。輸出 <code>a normal year</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">a normal year</span>`);
          canvas.innerHTML = leapDraw(1999);
        },
      },
      {
        id: "trap",
        title: "1900 仍是平年",
        teach: `<p>公式裡 <code>y % 4 == 0 and y % 100 != 0</code> 會把世紀年擋掉。1900 能被 4 整除，但不能被 400 整除，所以是 a normal year。</p>
          <p>2000 走前面那半：<code>y % 400 == 0</code> 已經是閏年。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            leapDraw(2000) + `<p>2000 → a leap year</p>`,
            leapDraw(1900) + `<p>1900 → a normal year</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>這裡沒有多行。讀一次 y 就判斷。不必 sys.stdin。</p>`,
        draw(stage, runtime) {
          const lines = ["y = int(input())", "leap = y % 400 == 0 or (y % 4 == 0 and y % 100 != 0)", "print(\"a leap year\" if leap else \"a normal year\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["2000"], stdinAt: 0, vars: { y: "" } },
            { lines, hi: 0, stdin: ["2000"], stdinAt: 1, vars: { y: 2000 }, glow: "y" },
          ]);
        },
      },
      {
        id: "pyleap",
        title: "合成一個 leap",
        teach: `<p><code>leap = y % 400 == 0 or (y % 4 == 0 and y % 100 != 0)</code> 把三道門收成一句。括號要包住 and，不然 or / and 的順序會亂。</p>
          <p>空白、leap / normal 不要拼錯。</p>`,
        draw(stage, runtime) {
          const lines = ["y = int(input())", "leap = y % 400 == 0 or (y % 4 == 0 and y % 100 != 0)", "print(\"a leap year\" if leap else \"a normal year\")"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { y: 2000, leap: true }, visual: leapDraw(2000) },
            { lines, hi: 2, vars: { 輸出: "a leap year" } },
            { lines, hi: 2, vars: { y: 1999, leap: false, 輸出: "a normal year" }, visual: leapDraw(1999) },
          ]);
        },
      },
      {
        id: "vs",
        title: "跟「文文的求婚」差在哪",
        teach: `<p>規則一樣。a004 多行、印中文；這一題一行、印英文。不要用 sys.stdin，也不要印「閏年」。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一行英文</span>`);
          canvas.innerHTML = hud(["a004：多行、閏年/平年", "d067：一行、a leap year"]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>三行。跟 a004 同一套規則，輸出改英文。</p>`,
        draw(stage) {
          K().full(stage, ["y = int(input())", "leap = y % 400 == 0 or (y % 4 == 0 and y % 100 != 0)", "print(\"a leap year\" if leap else \"a normal year\")"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>400 或（能被 4 且不能被 100），印英文。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = leapDraw(2000) + note("a leap year。");
        },
      },
      {
        id: "play",
        title: "自己改年份試試看",
        teach: `<p>跟 a004 同一套門。想清楚這件事就可以交卷：<strong>400 或（能被 4 且不能被 100）。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試年份</span>`, { y: 2000 }, (s) => {
            const L = leapOf(s.y);
            return K().fieldRow(K().numField("y", "年", s.y)) + leapDraw(s.y) +
              `<p><b>${L.leap ? "a leap year" : "a normal year"}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— d068 ——— */
  reg({
    id: "d068",
    title: "該減肥了！",
    steps: [
      {
        id: "story",
        title: "大於 50 才減 1",
        teach: `<p>體重 w。如果 w &gt; 50，輸出 w−1，否則原樣印出。</p>
          <p>50 剛好，不減。51 才減成 50。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">51 → 50</span>`);
          canvas.innerHTML = K().scale(51, 50) + K().fork({ q: "w > 50？", yes: "w − 1", no: "維持 w", take: "yes" });
        },
      },
      {
        id: "edge",
        title: "剛好 50 不減",
        teach: `<p>條件是大於，不是大於等於。50 停在 50。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().scale(51, 50) + K().fork({ q: "51 > 50？", yes: "50", no: "51", take: "yes" }),
            K().scale(50, 50) + K().fork({ q: "50 > 50？", yes: "49", no: "50", take: "no" }),
            K().scale(40, 50) + K().fork({ q: "40 > 50？", yes: "39", no: "40", take: "no" }),
          ]);
        },
      },
      {
        id: "why",
        title: "print 寫在 if 外面",
        teach: `<p>不管有沒有減，最後都要印 w。所以 <code>print(w)</code> 不要縮進到 if 裡面，否則 w≤50 會沒輸出。</p>
          <p>也不要無條件 <code>w -= 1</code>，50 會被誤減成 49。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">有條件才改</span>`);
          canvas.innerHTML = K().fork({ q: "print 放進 if 裡？", yes: "50 沒輸出", no: "if 外面一律印", take: "yes" });
        },
      },
      {
        id: "see",
        title: "先看體重計有沒有過 50",
        teach: `<p>50 是一條線。指針超過才減 1。剛好壓在線上，不減。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().scale(49, 50) + `<p>線下，維持 49。</p>`,
            K().scale(50, 50) + `<p>壓線，維持 50。</p>`,
            K().scale(51, 50) + `<p>超過，變成 50。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例 51 對一次",
        teach: `<p>輸入 <code>51</code>。51&gt;50，減 1，輸出 50。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().scale(51, 50) + `<p>進去減。</p>`,
            hud(["w=50", "輸出 50"]),
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p><code>w = int(input())</code> 吃掉體重。</p>`,
        draw(stage, runtime) {
          const lines = ["w = int(input())", "if w > 50:", "    w -= 1", "print(w)"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["51"], stdinAt: 0, vars: { w: "" } },
            { lines, hi: 0, stdin: ["51"], stdinAt: 1, vars: { w: 51 }, glow: "w" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "if w > 50: w -= 1",
        teach: `<p>條件是大於，不是大於等於。減完無論有沒有進 if，都 print(w)。</p>`,
        draw(stage, runtime) {
          const lines = ["w = int(input())", "if w > 50:", "    w -= 1", "print(w)"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { w: 51 }, visual: K().scale(51, 50), note: "51 &gt; 50，進去減 1。" },
            { lines, hi: 3, vars: { w: 50, 輸出: 50 }, glow: "w" },
            { lines, hi: 3, vars: { w: 50, 輸出: 50 }, visual: K().scale(50, 50), note: "剛好 50，不進 if，仍印 50。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀進來 → 有條件才減 → 印。</p>`,
        draw(stage) { K().full(stage, ["w = int(input())", "if w > 50:", "    w -= 1", "print(w)"]); },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>大於 50 才減 1，print 在 if 外面。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().scale(51, 50) + note("51 → 50。");
        },
      },
      {
        id: "play",
        title: "自己改體重試試看",
        teach: `<p>在 50 兩邊各試一次。想清楚這件事就可以交卷：<strong>大於 50 才減 1，print 在 if 外面。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試 w</span>`, { w: 51 }, (s) => {
            const over = s.w > 50;
            return K().fieldRow(K().numField("w", "體重", s.w)) + K().scale(s.w, 50) +
              K().fork({ q: "w > 50？", yes: String(s.w - 1), no: String(s.w), take: over ? "yes" : "no" });
          });
        },
      },
    ],
  });

  /* ——— a148 ——— */
  reg({
    id: "a148",
    title: "You Cannot Pass?!",
    steps: [
      {
        id: "story",
        title: "平均過不過 59",
        teach: `<p>第一個數 n，後面 n 個分數。平均 &gt; 59 印 no，否則印 yes。</p>
          <p>題目在問「會不會被當」：yes 代表被當，no 代表沒被當。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">60 60 60</span>`);
          canvas.innerHTML = K().avgTrack([60, 60, 60], 59);
        },
      },
      {
        id: "avg",
        title: "先加總再除",
        teach: `<p>平均 = 總分 ÷ n。跟 59 比的是平均，不是每一科。</p>
          <p>範例 60、60、60，平均 60，大於 59，印 no。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().avgTrack([60, 60, 60], 59) + `<p>60 &gt; 59，沒被當 → no</p>`,
            K().avgTrack([50, 50, 50], 59) + `<p>50 沒過線 → yes（被當）</p>`,
          ]);
        },
      },
      {
        id: "edge",
        title: "平均剛好 59 算被當",
        teach: `<p>條件是 <code>avg &gt; 59</code>。等於 59 沒有大於，印 yes（被當）。</p>
          <p>yes / no 全小寫。yes 代表被當，不要印「及格」。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().avgTrack([59], 59) + `<p>59 沒過線 → yes</p>`,
            K().avgTrack([60], 59) + `<p>60 &gt; 59 → no</p>`,
          ]);
        },
      },
      {
        id: "see",
        title: "先加總，不要一科一科比",
        teach: `<p>不是每一科都要過 59。三科 0、80、75，有一科 0 仍可能被當，因為平均不夠。</p>
          <p>先全部加起來，再除以 n，再跟 59 比。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().avgTrack([0, 80, 75], 59) + `<p>平均 51.6，被當。</p>`,
            K().avgTrack([59, 59, 59], 59) + `<p>平均剛好 59，仍是 yes。</p>`,
          ]);
        },
      },
      {
        id: "many",
        title: "多行就一行一行算",
        teach: `<p>範例有兩行：<code>1 60</code> 平均 60 → no；<code>3 0 80 75</code> 平均 51.6 → yes。</p>
          <p>每一行獨立。用 <code>for line in sys.stdin</code> 包起來。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().avgTrack([60], 59) + `<p>第一行 n=1，分數 60 → no</p>`,
            K().avgTrack([0, 80, 75], 59) + `<p>第二行三科，平均 51.6 → yes</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "第一個數是 n，後面才是分數",
        teach: `<p><code>nums = list(map(int, input().split()))</code>。nums[0] 是科目數，<code>nums[1:]</code> 才是分數。</p>
          <p>不要把 n 拿去加進平均。</p>`,
        draw(stage, runtime) {
          const lines = ["nums = list(map(int, input().split()))", "n = nums[0]", "avg = sum(nums[1:]) / n", "print(\"no\" if avg > 59 else \"yes\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["3 60 60 60"], stdinAt: 0, vars: { nums: [] } },
            { lines, hi: 0, stdin: ["3 60 60 60"], stdinAt: 1, vars: { nums: [3, 60, 60, 60] } },
            { lines, hi: 1, vars: { n: 3 }, glow: "n", note: "n 是個數，不是分數。" },
          ]);
        },
      },
      {
        id: "pyavg",
        title: "sum 再除 n",
        teach: `<p><code>avg = sum(nums[1:]) / n</code>。跟 59 比的是平均。多行測資時外面再套 for line in sys.stdin。</p>`,
        draw(stage, runtime) {
          const lines = ["nums = list(map(int, input().split()))", "n = nums[0]", "avg = sum(nums[1:]) / n", "print(\"no\" if avg > 59 else \"yes\")"];
          K().py(stage, runtime, [
            { lines, hi: 2, vars: { avg: 60 }, visual: K().avgTrack([60, 60, 60], 59) },
            { lines, hi: 3, vars: { 輸出: "no" }, note: "60 &gt; 59，印 no。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>範例是兩行，完整交卷用 sys.stdin 比較保險。</p>`,
        draw(stage) {
          K().full(stage, ["import sys", "for line in sys.stdin:", "    nums = list(map(int, line.split()))", "    n = nums[0]", "    avg = sum(nums[1:]) / n", "    print(\"no\" if avg > 59 else \"yes\")"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>平均 &gt; 59 印 no，否則 yes。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().avgTrack([60], 59) + note("yes 代表被當。");
        },
      },
      {
        id: "play",
        title: "自己改分數試試看",
        teach: `<p>把其中一科拉低，看平均會不會掉到線下。想清楚這件事就可以交卷：<strong>平均 &gt; 59 印 no，否則 yes。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試分數</span>`, { s0: 60, s1: 60, s2: 60 }, (s) =>
            K().fieldRow(K().numField("s0", "第 1 科", s.s0) + K().numField("s1", "第 2 科", s.s1) + K().numField("s2", "第 3 科", s.s2)) +
            K().avgTrack([s.s0, s.s1, s.s2], 59)
          );
        },
      },
    ],
  });

  /* ——— h026 ——— */
  reg({
    id: "h026",
    title: "猜拳",
    steps: [
      {
        id: "story",
        title: "哥哥第一拳，妹妹出 n 拳",
        teach: `<p>0 石頭、2 剪刀、5 布。哥哥第一拳是 F。妹妹預先出好 n 拳。</p>
          <p>每一輪先印哥哥這拳。分出勝負就停，後面印 Won 或 Lost。整場都平手才印 Drew。</p>
          <p>範例一：F=0，妹妹第一拳 2，石頭贏剪刀，<code>0 : Won at round 1</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">Won at round 1</span>`);
          canvas.innerHTML = K().rps(0, 2) + `<p>哥哥 0 對妹妹 2，贏了。</p>`;
        },
      },
      {
        id: "table",
        title: "先畫誰贏誰",
        teach: `<p>0 贏 2、2 贏 5、5 贏 0。反過來就輸。相同是平手，才會去改下一拳。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().rps(0, 2) + `<p>石頭贏剪刀。</p>`,
            K().rps(2, 2) + `<p>一樣，平手，繼續。</p>`,
            K().rps(2, 0) + `<p>剪刀對石頭，哥哥輸。</p>`,
          ]);
        },
      },
      {
        id: "next",
        title: "平手才改下一拳",
        teach: `<p>平手時看妹妹：</p>
          <ul>
            <li>她連續兩拳相同 → 下一拳改出<strong>能贏她</strong>的</li>
            <li>否則下一拳<strong>抄她這一拳</strong></li>
          </ul>
          <p>範例二：F=2，妹妹 2 0。第一輪平手，下一拳抄 2；第二輪 2 對 0，輸掉。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().rps(2, 2) + `<p>第 1 輪平手。下一拳抄妹妹的 2。</p>`,
            K().rps(2, 0) + `<p>第 2 輪剪刀對石頭，Lost at round 2。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例一對一次",
        teach: `<p>輸入：</p>
          <pre class="eq">0
4
2 5 0 2</pre>
          <p>哥哥 0 對妹妹第一拳 2，石頭贏剪刀。後面三拳不用出。輸出 <code>0 : Won at round 1</code>。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().rps(0, 2) + `<p>先記下 0。</p>`,
            hud(["Won at round 1"]) + `<p>分出勝負就停。</p>`,
          ]);
        },
      },
      {
        id: "sample2",
        title: "範例二：先平後輸",
        teach: `<p>F=2，妹妹 2 0。第一輪平手，下一拳抄 2；第二輪 2 對 0，輸掉。</p>
          <p>輸出 <code>2 2 : Lost at round 2</code>。冒號前後有空格。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().rps(2, 2) + `<p>輸出先寫 2。</p>`,
            K().rps(2, 0) + `<p>再寫一個 2。Lost at round 2。</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "三行輸入：F、n、妹妹的拳",
        teach: `<p>第一行哥哥第一拳。第二行人數 n。第三行 n 個數字。</p>
          <p><code>input()</code> 呼叫三次。第三行用 split 收成清單 y。</p>`,
        draw(stage, runtime) {
          const lines = ["F = int(input())", "n = int(input())", "y = list(map(int, input().split()))"];
          const stdin = ["0", "4", "2 5 0 2"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin, stdinAt: 1, vars: { F: 0 }, glow: "F" },
            { lines, hi: 1, stdin, stdinAt: 2, vars: { n: 4 } },
            { lines, hi: 2, stdin, stdinAt: 3, vars: { y: [2, 5, 0, 2] } },
          ]);
        },
      },
      {
        id: "pywin",
        title: "先比這一拳，贏或輸就停",
        teach: `<p>每一輪先把 F 放進輸出。 <code>(F, yi) in win</code> 就是哥哥贏。反過來 <code>(yi, F) in win</code> 是哥哥輸。</p>
          <p>贏或輸就 print 完 break。平手才更新 F。</p>`,
        draw(stage, runtime) {
          const lines = ["out.append(str(F))", "if (F, yi) in win:", "    print(*out, \":\", \"Won at round\", i + 1)", "    break", "if (yi, F) in win:", "    print(*out, \":\", \"Lost at round\", i + 1)", "    break"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { F: 0, yi: 2 }, visual: K().rps(0, 2), note: "先記下這一拳 0。" },
            { lines, hi: 2, vars: { 輸出: "0 : Won at round 1" }, note: "(0, 2) 在贏的表裡，這一輪結束。" },
          ]);
        },
      },
      {
        id: "pynext",
        title: "平手才改下一拳",
        teach: `<p>妹妹連續兩拳相同：<code>F = beats[yi]</code>，改出能贏她的。否則 <code>F = yi</code>，抄她這一拳。</p>
          <p>for 的 else：迴圈沒被 break，整場平手，印 Drew at round n。</p>`,
        draw(stage, runtime) {
          const lines = ["if i >= 1 and y[i] == y[i - 1]:", "    F = beats[yi]", "else:", "    F = yi"];
          K().py(stage, runtime, [
            { lines, hi: 3, vars: { yi: 2, F: 2 }, visual: K().rps(2, 2), note: "第一輪平手，抄她的 2。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>冒號前後有空格。Won / Lost / Drew 大小寫要跟題目一樣。不要包 main()。</p>`,
        draw(stage) {
          K().full(stage, ["win = {(0, 2), (2, 5), (5, 0)}", "beats = {0: 5, 2: 0, 5: 2}", "F = int(input())", "n = int(input())", "y = list(map(int, input().split()))", "out = []", "for i, yi in enumerate(y):", "    out.append(str(F))", "    if (F, yi) in win:", "        print(*out, \":\", \"Won at round\", i + 1)", "        break", "    if (yi, F) in win:", "        print(*out, \":\", \"Lost at round\", i + 1)", "        break", "    if i >= 1 and y[i] == y[i - 1]:", "        F = beats[yi]", "    else:", "        F = yi", "else:", "    print(*out, \":\", \"Drew at round\", n)"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>每一輪先比，分出勝負就停；平手才改下一拳。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().rps(0, 2) + note("Won at round 1。");
        },
      },
      {
        id: "play",
        title: "兩個範例再走一遍",
        teach: `<p>想清楚這件事就可以交卷：<strong>每一輪先比，分出勝負就停；平手才改下一拳。</strong></p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().rps(0, 2) + `<p>範例一：Won at round 1</p>`,
            K().rps(2, 2) + `<p>範例二第 1 輪平手</p>`,
            K().rps(2, 0) + `<p>第 2 輪 Lost at round 2</p>`,
          ]);
        },
      },
    ],
  });
})();
