(function () {
  const K = () => window.IfKit;
  const P = () => window.PyTeach;

  function open(stage, chip, id, alt, extra) {
    const canvas = K().toolbar(stage, `<span class="chip">${chip}</span>`);
    canvas.innerHTML = K().hero(id, alt, extra);
  }

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

  /* ——— b964 成績指標 ——— */
  const B964_S1 = [0, 11, 22, 33, 55, 66, 77, 99, 88, 44];
  const B964_S1S = [0, 11, 22, 33, 44, 55, 66, 77, 88, 99];
  reg({
    id: "b964",
    title: "成績指標",
    steps: [
      {
        id: "story",
        title: "成績單上有一條 60 分線",
        teach: `<p>這題在看一次考試的分數。先把分數由小排到大，再在 60 分那條線切開。</p>
          <ul>
            <li>線下面：不及格。裡面最高的叫<strong>最佳不及格</strong></li>
            <li>線上面：及格。裡面最低的叫<strong>最差及格</strong></li>
          </ul>
          <p>題目要三行：排序後的分數、最佳不及格、最差及格。</p>`,
        draw(stage) {
          open(stage, "題目在說什麼", "b964", "剪紙：分數長條與蓋章考卷",
            K().scores([0, 59, 60, 100], { line: 60, markHigh: 1, markLow: 2 }) +
            note("金色框是 59 和 60，剛好站在線的兩邊。"));
        },
      },
      {
        id: "line",
        title: "60 分是及格線，含 60",
        teach: `<p>判斷很死板：<code>&lt; 60</code> 不及格，<code>&gt;= 60</code> 及格。60 分算過。</p>
          <p>所以線下最後一個、線上第一個，就是兩個指標。不必再比來比去。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().scores([0, 59, 60, 100], { line: 60 }) + `<p>先看成一排。60 分那條是刀。</p>`,
            K().fork({ q: "59 < 60？", yes: "不及格", no: "及格", take: "yes" }),
            K().fork({ q: "60 >= 60？", yes: "及格", no: "不及格", take: "yes" }),
          ]);
        },
      },
      {
        id: "sort",
        title: "先排再切",
        teach: `<p>不排序，線下最高、線上最低會找錯位置。排完由小到大，不及格全擠在左邊，及格全在右邊。</p>
          <p>左邊最後一個 = 最佳不及格。右邊第一個 = 最差及格。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().scores([0, 59, 60, 100], { line: 60 }) + `<p>先全部排好。</p>`,
            K().scores([0, 59, 60, 100], { line: 60, markHigh: 1 }) + `<p>不及格最後一個：59</p>`,
            K().scores([0, 59, 60, 100], { line: 60, markLow: 2 }) + `<p>及格第一個：60</p>`,
          ]);
        },
      },
      {
        id: "edge",
        title: "全過或全當",
        teach: `<p>沒有不及格 → 第二行印 <code>best case</code>。沒有及格 → 第三行印 <code>worst case</code>。句子要一字不差，大小寫也要對。</p>
          <p>第一行排序還是要印。全當也要把那一排分數印出來。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().scores([60, 70, 80], { line: 60 }) + `<p>線下沒人 → best case</p>`,
            K().scores([0, 10, 59], { line: 60 }) + `<p>線上沒人 → worst case</p>`,
            K().scores([13], { line: 60, markHigh: 0 }) + `<p>只有 13：最佳不及格是 13，沒有及格。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "把範例一逐步對一次",
        teach: `<p>輸入：</p>
          <pre class="eq">10
0 11 22 33 55 66 77 99 88 44</pre>
          <p>排完是 0 11 22 33 44 55 66 77 88 99。線下最後一個 55，線上第一個 66。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().scores(B964_S1, { line: 60 }) + `<p>還沒排。88 和 44 還亂著。</p>`,
            K().scores(B964_S1S, { line: 60 }) + `<p>排完。第一行就印這一排。</p>`,
            K().scores(B964_S1S, { line: 60, markHigh: 5 }) + `<p>不及格最後一個：55</p>`,
            K().scores(B964_S1S, { line: 60, markLow: 6 }) + `<p>及格第一個：66。輸出三行。</p>`,
          ]);
        },
      },
      {
        id: "sample2",
        title: "範例二只有一個人當掉",
        teach: `<p>輸入：</p>
          <pre class="eq">1
13</pre>
          <p>排序還是 13。沒有及格，第三行 <code>worst case</code>。第二行仍要印 13。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">worst case</span>`);
          canvas.innerHTML = K().scores([13], { line: 60, markHigh: 0 }) +
            hud(["第一行 13", "第二行 13", "第三行 worst case"]);
        },
      },
      {
        id: "sample3",
        title: "範例三全班都過",
        teach: `<p>輸入：</p>
          <pre class="eq">2
73 65</pre>
          <p>排完 65 73。沒有不及格，第二行 <code>best case</code>，第三行 65。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">best case</span>`);
          canvas.innerHTML = K().scores([65, 73], { line: 60, markLow: 0 }) +
            hud(["第一行 65 73", "第二行 best case", "第三行 65"]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>第一行是人數 n。第二行才是分數，中間用空格隔開。</p>
          <p><code>input()</code> 每次吃掉一行，得到的是字串。人數只有一個數，<code>int(input())</code> 就夠。分數那行要用 split。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "a = list(map(int, input().split()))"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["4", "0 59 60 100"], stdinAt: 0, vars: { n: "" }, note: "程式停在第一個 input()，等第 1 行。" },
            { lines, hi: 0, stdin: ["4", "0 59 60 100"], stdinAt: 1, vars: { n: 4 }, glow: "n", note: "吃掉「4」，變成整數 4。" },
            { lines, hi: 1, stdin: ["4", "0 59 60 100"], stdinAt: 2, vars: { n: 4, a: [0, 59, 60, 100] }, glow: "a", note: "第二行剪開再變整數，收成一排。" },
          ]);
        },
      },
      {
        id: "pysort",
        title: "sort 之後用 * 印一排",
        teach: `<p><code>a.sort()</code> 會把清單從小排到大，直接改原本那一排。</p>
          <p><code>print(*a)</code> 的星號是「把一排拆開印」，中間自動空一格，最後沒有多餘空白。剛好符合題目第一行。</p>`,
        draw(stage, runtime) {
          const lines = ["a.sort()", "print(*a)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a: [0, 59, 60, 100] }, visual: K().scores([0, 59, 60, 100], { line: 60 }), note: "這組剛好已經有序。亂的話 sort 會排好。" },
            { lines, hi: 1, vars: { 輸出: "0 59 60 100" }, glow: "輸出", note: "第一行先印完，再去找兩個指標。" },
          ]);
        },
      },
      {
        id: "pysplit",
        title: "用兩個清單切開",
        teach: `<p>排完之後切兩刀：</p>
          <pre class="eq">fail = [x for x in a if x &lt; 60]
ok = [x for x in a if x &gt;= 60]</pre>
          <p><code>fail[-1]</code> 是左邊最後一個。<code>ok[0]</code> 是右邊第一個。</p>`,
        draw(stage, runtime) {
          const lines = ["fail = [x for x in a if x < 60]", "ok = [x for x in a if x >= 60]"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { fail: [0, 59] }, visual: K().scores([0, 59, 60, 100], { line: 60, markHigh: 1 }), note: "線下兩個人。" },
            { lines, hi: 1, vars: { ok: [60, 100] }, visual: K().scores([0, 59, 60, 100], { line: 60, markLow: 2 }), note: "線上兩個人。" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "空清單就改印句子",
        teach: `<p>清單是空的，不能拿 <code>fail[-1]</code>，會當掉。所以先問有沒有人：</p>
          <pre class="eq">print(fail[-1] if fail else "best case")
print(ok[0] if ok else "worst case")</pre>
          <p>空的才換句子。有人就印數字。</p>`,
        draw(stage, runtime) {
          const lines = ["print(fail[-1] if fail else \"best case\")", "print(ok[0] if ok else \"worst case\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { fail: [0, 59], 輸出: 59 }, glow: "輸出", note: "fail 不是空的，印最後一個 59。" },
            { lines, hi: 1, vars: { ok: [60, 100], 輸出: 60 }, glow: "輸出", note: "ok 不是空的，印第一個 60。" },
            { lines, hi: 0, vars: { fail: [], 輸出: "best case" }, visual: K().scores([65, 73], { line: 60 }), note: "全過時 fail 是空的，改印句子。" },
          ]);
        },
      },
      {
        id: "py60",
        title: "60 分算及格，不能放進 fail",
        teach: `<p>條件是 <code>x &lt; 60</code> 才當掉。<code>x &lt;= 60</code> 會把剛好 60 放進 fail。</p>
          <p>範例 0 59 60 100 就會印成 60 和 100，少了真正的最佳不及格 59。</p>`,
        draw(stage, runtime) {
          const lines = ["fail = [x for x in a if x < 60]", "ok = [x for x in a if x >= 60]", "print(fail[-1] if fail else \"best case\")", "print(ok[0] if ok else \"worst case\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a: [0, 59, 60, 100], fail: [0, 59] }, visual: K().scores([0, 59, 60, 100], { line: 60, markHigh: 1 }), note: "60 沒有小於 60，不進 fail。" },
            { lines, hi: 1, vars: { ok: [60, 100] }, visual: K().scores([0, 59, 60, 100], { line: 60, markLow: 2 }), note: "60 在 ok 的第一個。" },
            { lines, hi: 3, vars: { 輸出: "59 / 60" }, glow: "輸出", note: "若把 60 當掉，第二行會變成 60，第三行變成 100。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀入 → 排序印第一行 → 切開 → 空的印句子。三行輸出，一個也不少。</p>`,
        draw(stage) {
          K().full(stage, ["n = int(input())", "a = list(map(int, input().split()))", "a.sort()", "print(*a)", "fail = [x for x in a if x < 60]", "ok = [x for x in a if x >= 60]", "print(fail[-1] if fail else \"best case\")", "print(ok[0] if ok else \"worst case\")"]);
        },
      },
      {
        id: "play",
        title: "自己改分數試試看",
        teach: `<p>改四個分數，看線上線下怎麼切。先猜兩個指標，再對金色框。</p>
          <p>想清楚這件事就可以交卷：<strong>先排，再沿 60 切開；缺一邊就印指定句子。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試分數</span>`, { a: 0, b: 59, c: 60, d: 100 }, (s) => {
            const arr = [s.a, s.b, s.c, s.d].slice().sort((x, y) => x - y);
            const fail = arr.filter((x) => x < 60);
            const ok = arr.filter((x) => x >= 60);
            const hi = fail.length ? arr.lastIndexOf(fail[fail.length - 1]) : -1;
            const lo = ok.length ? arr.indexOf(ok[0]) : -1;
            return K().fieldRow(K().numField("a", "A", s.a) + K().numField("b", "B", s.b) + K().numField("c", "C", s.c) + K().numField("d", "D", s.d)) +
              K().scores(arr, { line: 60, markHigh: hi, markLow: lo }) +
              `<p>${fail.length ? fail[fail.length - 1] : "best case"}　／　${ok.length ? ok[0] : "worst case"}</p>`;
          });
        },
      },
    ],
  });

  /* ——— c290 數字龍捲風 / 秘密差 ——— */
  function oddEven(s) {
    let odd = 0, even = 0;
    for (let i = 0; i < s.length; i++) (i % 2 === 0 ? (odd += +s[i]) : (even += +s[i]));
    return { odd, even, d: Math.abs(odd - even) };
  }
  reg({
    id: "c290",
    title: "數字龍捲風",
    steps: [
      {
        id: "story",
        title: "數字像一條龍捲風",
        teach: `<p>這串數字不要當成「一萬兩千三百四十五」。把它當字，從<strong>左邊</strong>數格子：</p>
          <ul>
            <li>第 1、3、5 格是<strong>奇數位</strong></li>
            <li>第 2、4、6 格是<strong>偶數位</strong></li>
          </ul>
          <p>兩組各自加總，再相減取絕對值。這就是秘密差。</p>`,
        draw(stage) {
          open(stage, "當字看，不要當整數", "c290", "剪紙：數字從筆記本捲成龍捲風",
            K().digits("12345") + `<p>奇 1+3+5=9，偶 2+4=6，|9−6|=<b>3</b></p>`);
        },
      },
      {
        id: "place",
        title: "從 1 開始數，不要從 0",
        teach: `<p>人類數位置從 1 開始。Python 的下標從 0 開始。所以第 1 位是 <code>s[0]</code>，但它是奇數位。</p>
          <p>寫迴圈時用 <code>enumerate(s, 1)</code>，讓 i 從 1 起跳，問 <code>i % 2</code> 就跟題目同一套語言。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().digits("12345", 0) + `<p>格子 1，下標 0，奇數位。</p>`,
            K().digits("12345", 1) + `<p>格子 2，下標 1，偶數位。</p>`,
            note("不要把「下標是偶數」直接當成偶數位。先對齊從 1 數。"),
          ]);
        },
      },
      {
        id: "walk",
        title: "一位一位加",
        teach: `<p>兩個盒子 odd、even 從 0 開始。走到哪一位，就把那個數字加進對應的盒子。</p>
          <p>字元 <code>"1"</code> 要先 <code>int(ch)</code> 才是 1，否則會變成字串相加。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().digits("12345", 0) + `<p>第 1 位奇，odd=1</p>`,
            K().digits("12345", 1) + `<p>第 2 位偶，even=2</p>`,
            K().digits("12345", 2) + `<p>第 3 位奇，odd=1+3=4</p>`,
            K().digits("12345", 3) + `<p>第 4 位偶，even=2+4=6</p>`,
            K().digits("12345", 4) + `<p>第 5 位奇，odd=4+5=9。差 |9−6|=3</p>`,
          ]);
        },
      },
      {
        id: "abs",
        title: "差可能是負的，取絕對值",
        teach: `<p>奇數位和不一定比較大。例如 21：奇 2、偶 1，差 1；反過來 12：奇 1、偶 2，差也是 1。</p>
          <p><code>abs(odd - even)</code> 保證答案是正的。題目要的是差距，不是誰減誰。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().digits("12345") + `<p>9 − 6 = 3，已經是正的。</p>`,
            K().digits("21") + `<p>奇 2、偶 1，差 1。</p>`,
            K().digits("12") + `<p>奇 1、偶 2，1−2=−1，abs 之後還是 1。</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "為什麼不能當成一個整數",
        teach: `<p>數字可能長到一千位。 <code>int(input())</code> 會爆或很難取每一位。</p>
          <p>當字串從左邊數，每一位 <code>int(ch)</code> 再加進盒子。這才是題目要的「位」。</p>
          <div class="note"><strong>整題就這一個轉折</strong>從左邊數格子，不要從個位數開始數。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">當字看</span>`);
          canvas.innerHTML = K().fork({ q: "int(input())？", yes: "太長會出事", no: "當字串一位一位走", take: "yes" });
        },
      },
      {
        id: "sample1",
        title: "把範例 12345 逐步對一次",
        teach: `<p>輸入一行 <code>12345</code>。奇 1+3+5=9，偶 2+4=6，|9−6|=3。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().digits("12345") + `<p>五個字。</p>`,
            hud(["odd=9", "even=6", "輸出 3"]) + K().digits("12345"),
          ]);
        },
      },
      {
        id: "sample2",
        title: "偶數位比較大時，abs 仍是正的",
        teach: `<p>12：奇 1、偶 2，1−2=−1，abs 之後 1。21：奇 2、偶 1，差也是 1。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().digits("12") + `<p>輸出 1</p>`,
            K().digits("21") + `<p>輸出 1</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>ZeroJudge 把範例當成鍵盤打進來的文字。這題只有一行。</p>
          <p><code>s = input().strip()</code>：吃掉那一行，再把兩頭空白和換行拔掉。得到的是字串 <code>"12345"</code>，還不是整數 12345。</p>`,
        draw(stage, runtime) {
          const lines = ["s = input().strip()"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["12345"], stdinAt: 0, vars: { s: "" }, note: "等評測機把那一行送進來。" },
            { lines, hi: 0, stdin: ["12345"], stdinAt: 1, vars: { s: "12345" }, glow: "s", visual: K().digits("12345"), note: "現在 s 是五個字。可以開始一位一位走。" },
          ]);
        },
      },
      {
        id: "pyenum",
        title: "enumerate 從 1 開始數",
        teach: `<p><code>for i, ch in enumerate(s, 1):</code> 每一次把「位置 i」和「那個字 ch」一起拿出來。</p>
          <p>第二個參數 1 是起點。不寫的話 i 從 0 開始，奇數位和偶數位兩個盒子會對調。這題最後取絕對值，數字碰巧一樣，但就不是題目說的「從左邊第 1 位算奇數位」。</p>`,
        draw(stage, runtime) {
          const lines = ["odd = even = 0", "for i, ch in enumerate(s, 1):", "    if i % 2:", "        odd += int(ch)", "    else:", "        even += int(ch)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { odd: 0, even: 0 }, note: "兩個盒子先清成 0。" },
            { lines, hi: 3, vars: { i: 1, ch: "1", odd: 1 }, visual: K().digits("12345", 0), glow: "odd", note: "i=1 是奇數，加進 odd。" },
            { lines, hi: 5, vars: { i: 2, ch: "2", even: 2 }, visual: K().digits("12345", 1), glow: "even", note: "i=2 是偶數，加進 even。" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "if i % 2：奇數位",
        teach: `<p>在 Python 裡，奇數當 True，偶數當 False。所以 <code>if i % 2:</code> 就是「如果是奇數位」。</p>
          <p>寫成 <code>if i % 2 == 1:</code> 也可以，意思一樣。</p>`,
        draw(stage, runtime) {
          const lines = ["if i % 2:", "    odd += int(ch)", "else:", "    even += int(ch)", "print(abs(odd - even))"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { i: 5, ch: "5", odd: 9, even: 6 }, visual: K().digits("12345", 4), note: "最後一位也是奇數。走完 odd=9 even=6。" },
            { lines, hi: 4, vars: { 輸出: 3 }, glow: "輸出", visual: K().digits("12345"), note: "abs(9-6)=3。這就是答案。" },
          ]);
        },
      },
      {
        id: "pyrun",
        title: "剩下三位再加一次",
        teach: `<p>1 和 2 加完之後，odd=1、even=2。繼續走 3、4、5。</p>
          <p>3 和 5 是奇數位，4 是偶數位。最後 odd=9、even=6，絕對值 3。</p>`,
        draw(stage, runtime) {
          const lines = ["if i % 2:", "    odd += int(ch)", "else:", "    even += int(ch)", "print(abs(odd - even))"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { i: 3, ch: "3", odd: 4, even: 2 }, visual: K().digits("12345", 2), glow: "odd", note: "第 3 位加進 odd。" },
            { lines, hi: 3, vars: { i: 4, ch: "4", odd: 4, even: 6 }, visual: K().digits("12345", 3), glow: "even", note: "第 4 位加進 even。" },
            { lines, hi: 4, vars: { i: 5, odd: 9, even: 6, 輸出: 3 }, glow: "輸出", visual: K().digits("12345", 4), note: "第 5 位加完，abs(9−6)=3。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀字串 → 兩個盒子 → 迴圈裡看位置奇偶 → 印絕對值。比賽從第一行開始跑，不要包 main()。</p>`,
        draw(stage) {
          K().full(stage, ["s = input().strip()", "odd = even = 0", "for i, ch in enumerate(s, 1):", "    if i % 2:", "        odd += int(ch)", "    else:", "        even += int(ch)", "print(abs(odd - even))"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>當字從左邊數，奇位一組、偶位一組，差取絕對值。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().digits("12345") + hud(["odd=9", "even=6", "3"]);
        },
      },
      {
        id: "play",
        title: "自己改數字試試看",
        teach: `<p>換一串數字，看奇偶位怎麼分。先自己加一次，再對畫面。</p>
          <p>想清楚這件事就可以交卷：<strong>當字從左邊數，奇位一組、偶位一組，差取絕對值。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">試字串</span>`);
          const state = { s: "12345" };
          function paint() {
            const s = String(state.s || "0").replace(/\D/g, "") || "0";
            const o = oddEven(s);
            canvas.innerHTML = `<label class="field"><span>數字</span><input data-k="s" value="${P().esc(s)}"></label>` +
              K().digits(s) + `<p>奇 ${o.odd}　偶 ${o.even}　差 <b>${o.d}</b></p>`;
            const inp = canvas.querySelector("input");
            inp.oninput = () => { state.s = inp.value; paint(); };
          }
          paint();
        },
      },
    ],
  });

  /* ——— c294 三角形辨別 ——— */
  function triKind(a, b, c) {
    const [x, y, z] = [a, b, c].slice().sort((p, q) => p - q);
    if (x + y <= z) return "No";
    const t = x * x + y * y, zz = z * z;
    return t === zz ? "Right" : t < zz ? "Obtuse" : "Acute";
  }
  reg({
    id: "c294",
    title: "三角形辨別",
    steps: [
      {
        id: "story",
        title: "三根木棒能不能圍起來",
        teach: `<p>給三邊長。先由小到大印出來，最長的當 c。再問兩件事：</p>
          <ul>
            <li>a+b ≤ c → 圍不起來，印 No</li>
            <li>圍得起來，再用 a²+b² 對 c²：相等 Right，比較小 Obtuse，比較大 Acute</li>
          </ul>
          <p>3、4、5 是教室裡最熟的直角三角形。</p>`,
        draw(stage) {
          open(stage, "3 4 5", "c294", "剪紙：三角尺與量角器", K().triangle(3, 4, 5));
        },
      },
      {
        id: "sort",
        title: "一定要把最長的放 c",
        teach: `<p>直角、鈍角、銳角比的是「最大角」，最大角對面就是最長邊。不排的話，平方會拿錯邊，直角會判成別的。</p>
          <p><code>a, b, c = sorted(...)</code> 一行做完：最小 a、中間 b、最大 c。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            `<p>輸入如果是 5 3 4，不排會把 4 當斜邊，9+25 對 16，全錯。</p>`,
            K().triangle(5, 3, 4) + `<p>排完還是 3 4 5。圖上的 c 永遠是最長邊。</p>`,
          ]);
        },
      },
      {
        id: "no",
        title: "先問圍不圍得起來",
        teach: `<p>兩短邊加起來必須<strong>大於</strong>最長邊。等於也不行：那是貼成一條直線，沒有面積。</p>
          <p>所以判斷寫 <code>a + b &lt;= c</code> 就印 No，後面的角都不必問。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().triangle(10, 10, 100) + `<p>10+10=20 ≤ 100，圍不起來。</p>`,
            K().fork({ q: "a + b <= c？", yes: "No", no: "再看角", take: "yes" }),
          ]);
        },
      },
      {
        id: "angle",
        title: "圍得起來，再用平方看角",
        teach: `<p>勾股定理：a²+b² = c² 是直角。比 c² 小是鈍角（最大角超過 90°），比 c² 大是銳角（三個角都小於 90°）。</p>
          <pre class="eq">if a*a + b*b == c*c: Right
elif a*a + b*b &lt; c*c: Obtuse
else: Acute</pre>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().triangle(3, 4, 5) + `<p>9+16=25，Right。</p>`,
            K().triangle(2, 3, 4) + `<p>4+9=13 &lt; 16，Obtuse。</p>`,
            K().triangle(5, 5, 6) + `<p>25+25=50 &gt; 36，Acute。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例一：3 4 5 是直角",
        teach: `<p>輸入 <code>3 4 5</code>。已經由小到大。9+16=25。兩行輸出：</p>
          <pre class="eq">3 4 5
Right</pre>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">Right</span>`);
          canvas.innerHTML = K().triangle(3, 4, 5) + hud(["a²+b²=25", "c²=25", "Right"]);
        },
      },
      {
        id: "sample2",
        title: "範例二要先排序",
        teach: `<p>輸入 <code>101 100 99</code>。先印 <code>99 100 101</code>。</p>
          <p>99²+100² = 9801+10000=19801，101²=10201。19801 &gt; 10201，Acute。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            `<p>拿到的順序是 101、100、99。先排。</p>`,
            K().triangle(99, 100, 101) + `<p>兩短邊平方和比較大，三個角都銳。</p>`,
          ]);
        },
      },
      {
        id: "sample3",
        title: "範例三圍不起來",
        teach: `<p>輸入 <code>10 10 100</code>。排序後還是這樣。10+10 ≤ 100，第二行 No。不要再算平方。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">No</span>`);
          canvas.innerHTML = K().triangle(10, 10, 100) + hud(["10+10=20", "20 ≤ 100", "No"]);
        },
      },
      {
        id: "why",
        title: "為什麼一定要先排序",
        teach: `<p>直角公式用的 c 必須是最長邊。5 3 4 如果不排，會拿 4 當斜邊，判斷全錯。</p>
          <p>第一行輸出也要求由小到大。排一次，兩件事一起做完。</p>
          <div class="note"><strong>整題就這一個轉折</strong>先排，再問圍不圍得起來，最後才看角。</div>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().triangle(5, 3, 4) + `<p>還沒排，最長不是最後一個。</p>`,
            K().triangle(3, 4, 5) + `<p>排完 3 4 5，c=5。</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>三個數在同一行。<code>sorted(map(int, input().split()))</code> 先變整數再排序，回傳一份新清單。</p>
          <p>左邊 <code>a, b, c = ...</code> 依序解開。之後先 <code>print(a, b, c)</code>，這是第一行輸出。</p>`,
        draw(stage, runtime) {
          const lines = ["a, b, c = sorted(map(int, input().split()))", "print(a, b, c)"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["101 100 99"], stdinAt: 0, vars: { a: "", b: "", c: "" }, note: "還是字串「101 100 99」。" },
            { lines, hi: 0, stdin: ["101 100 99"], stdinAt: 1, vars: { a: 99, b: 100, c: 101 }, glow: "c", note: "排完最大的 101 在 c。" },
            { lines, hi: 1, vars: { 輸出: "99 100 101" }, note: "無論後面是 No 還是角，第一行都要印。" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "if / elif：先 No 再看角",
        teach: `<p>順序不能倒。先問圍不圍得起來，否則 10 10 100 也會去比平方，印出 Obtuse，就錯了。</p>
          <p>三個 elif 互斥，最後 else 收銳角。</p>`,
        draw(stage, runtime) {
          const lines = ["if a + b <= c:", "    print(\"No\")", "elif a * a + b * b == c * c:", "    print(\"Right\")", "elif a * a + b * b < c * c:", "    print(\"Obtuse\")", "else:", "    print(\"Acute\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a: 10, b: 10, c: 100 }, visual: K().triangle(10, 10, 100), note: "20 ≤ 100，進第一個 if。" },
            { lines, hi: 3, vars: { a: 3, b: 4, c: 5, 輸出: "Right" }, visual: K().triangle(3, 4, 5), note: "圍得起來且平方相等。" },
            { lines, hi: 7, vars: { a: 99, b: 100, c: 101, 輸出: "Acute" }, note: "平方和比較大，落到 else。" },
          ]);
        },
      },
      {
        id: "pyobtuse",
        title: "鈍角是平方和比較小",
        teach: `<p>自己代 2 3 4。先排好已經是 2 3 4。2+3 &gt; 4，圍得起來。</p>
          <p>4+9=13，4×4=16。13 &lt; 16，走到印 Obtuse 的那一行。不要先看角、後看能不能圍。</p>`,
        draw(stage, runtime) {
          const lines = ["if a + b <= c:", "    print(\"No\")", "elif a * a + b * b == c * c:", "    print(\"Right\")", "elif a * a + b * b < c * c:", "    print(\"Obtuse\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a: 2, b: 3, c: 4 }, visual: K().triangle(2, 3, 4), note: "5 &gt; 4，第一個 if 不進。" },
            { lines, hi: 2, vars: { a: 2, b: 3, c: 4 }, note: "13 不等於 16，直角也不進。" },
            { lines, hi: 5, vars: { 輸出: "Obtuse" }, glow: "輸出", visual: K().triangle(2, 3, 4), note: "13 &lt; 16，印 Obtuse。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>兩行輸出：排序後的三邊，以及種類英文。No / Right / Obtuse / Acute 大小寫要跟題目一樣。</p>`,
        draw(stage) {
          K().full(stage, ["a, b, c = sorted(map(int, input().split()))", "print(a, b, c)", "if a + b <= c:", "    print(\"No\")", "elif a * a + b * b == c * c:", "    print(\"Right\")", "elif a * a + b * b < c * c:", "    print(\"Obtuse\")", "else:", "    print(\"Acute\")"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>先排，再問 a+b≤c，最後用平方看角。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().triangle(3, 4, 5) + note("Right。");
        },
      },
      {
        id: "play",
        title: "自己改三邊試試看",
        teach: `<p>把一邊拉長，看什麼時候變成 No。先猜角，再對圖。</p>
          <p>想清楚這件事就可以交卷：<strong>先排，先問圍不圍得起來，再拿兩短邊平方去對最長邊。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試三邊</span>`, { a: 3, b: 4, c: 5 }, (s) =>
            K().fieldRow(K().numField("a", "a", s.a) + K().numField("b", "b", s.b) + K().numField("c", "c", s.c)) +
            K().triangle(s.a, s.b, s.c) + `<p>${triKind(s.a, s.b, s.c)}</p>`
          );
        },
      },
    ],
  });

  /* ——— c295 最大和 ——— */
  function chosenOf(rows) {
    return rows.map((r) => {
      const mx = Math.max(...r);
      return { mx, j: r.indexOf(mx) };
    });
  }
  function c295Div(chosen, s) {
    return chosen.filter((x) => s % x === 0);
  }
  const C295A = [[1, 5], [6, 4], [1, 1]];
  const C295B = [[6, 3, 2], [2, 7, 9], [4, 7, 1], [9, 5, 3]];
  reg({
    id: "c295",
    title: "最大和",
    steps: [
      {
        id: "story",
        title: "每列只准拿一個最大的",
        teach: `<p>一張數字表，每一列選最大的那個，全部加起來叫 S。先印 S。</p>
          <p>第二行不是「S 的全部因數」。只看<strong>你選出來的那幾個數</strong>，哪些能整除 S，依列的順序印。一個都不能整除就印 -1。</p>`,
        draw(stage) {
          open(stage, "金色是選到的", "c295", "剪紙：四格數字，金色是選到的",
            K().grid(C295A, [1, 0, 0]) + `<p>選 5、6、1，S=12。能整除 12 的是 6 和 1。</p>`);
        },
      },
      {
        id: "pick",
        title: "金色是這一列選的",
        teach: `<p>每一列各自 <code>max</code>。不要跨列比。選完就定了，後面只會用這幾個數。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().grid(C295A, [1, null, null]) + `<p>第一列最大 5</p>`,
            K().grid(C295A, [1, 0, null]) + `<p>第二列最大 6</p>`,
            K().grid(C295A, [1, 0, 0]) + `<p>第三列兩個都是 1，選 1。S=12</p>`,
          ]);
        },
      },
      {
        id: "div",
        title: "只問被選的數能不能整除 S",
        teach: `<p>12 的因數有 1、2、3、4、6。但 2、3、4 不是我們選的，不要印。</p>
          <p>選的是 5、6、1。5 不能整除 12，6 和 1 可以。順序照列：先 6 再 1。</p>
          <p>注意：1 也出現在第一列，但第一列選的是 5，所以第一列不印 1。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().gates([
              { cond: "12 % 5 == 0", say: "不是", out: "—", state: "is-no" },
              { cond: "12 % 6 == 0", say: "是", out: "6", state: "is-yes" },
              { cond: "12 % 1 == 0", say: "是", out: "1", state: "is-yes" },
            ]) + `<p>第二行印 <code>6 1</code>。</p>`,
          ]);
        },
      },
      {
        id: "none",
        title: "一個都不能整除，印 -1",
        teach: `<p>不是印空行，是印一個 <code>-1</code>。S 自己不必拿去找質因數，題目沒要。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">第二行 -1</span>`);
          canvas.innerHTML = K().grid(C295B, [0, 2, 1, 0]) +
            `<p>選 6、9、7、9，S=31。四個都不能整除 31。</p>`;
        },
      },
      {
        id: "sample1",
        title: "把範例一對一次",
        teach: `<p>輸入：</p>
          <pre class="eq">3 2
1 5
6 4
1 1</pre>
          <p>輸出：</p>
          <pre class="eq">12
6 1</pre>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().grid(C295A, [1, 0, 0]) + `<p>S = 5+6+1 = 12，先印 12。</p>`,
            `<p>再掃被選的：5 否、6 是、1 是 → <code>6 1</code></p>`,
          ]);
        },
      },
      {
        id: "sample2",
        title: "範例二找不到",
        teach: `<p>四列最大值 6、9、7、9 加起來 31。31 是質數，被選的數裡沒有 1，所以第二行 -1。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">31　-1</span>`);
          canvas.innerHTML = K().grid(C295B, [0, 2, 1, 0]) + hud(["S=31", "沒有人選能整除", "-1"]);
        },
      },
      {
        id: "why",
        title: "第二行不是 S 的全部因數",
        teach: `<p>只問「被選出來的那幾個數」誰能整除 S。S=12 時，4 能整除 12，但 4 沒被選，不要印。</p>
          <p>範例選了 5、6、1。5 不能整除 12，所以只印 6 和 1。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">只問被選的</span>`);
          canvas.innerHTML = K().fork({ q: "印 12 的所有因數？", yes: "會多印 2、3、4", no: "只掃 chosen", take: "yes" });
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>第一行兩個數：列數 n、每列幾個 m。接著有 n 行，每行 m 個數。</p>
          <p>用清單推 n 次：<code>rows = [list(map(int, input().split())) for _ in range(n)]</code>。</p>`,
        draw(stage, runtime) {
          const lines = ["n, m = map(int, input().split())", "rows = [list(map(int, input().split())) for _ in range(n)]"];
          const stdin = ["3 2", "1 5", "6 4", "1 1"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin, stdinAt: 0, vars: { n: "", m: "" }, note: "第一行還在等。" },
            { lines, hi: 0, stdin, stdinAt: 1, vars: { n: 3, m: 2 }, glow: "n", note: "3 列、每列 2 個。" },
            { lines, hi: 1, stdin, stdinAt: 4, vars: { rows: ["[1, 5]", "[6, 4]", "[1, 1]"] }, note: "三行都讀完。m 其實後面用不到，但還是要讀對格式。" },
          ]);
        },
      },
      {
        id: "pymax",
        title: "每列 max，再加總",
        teach: `<p><code>chosen = [max(r) for r in rows]</code> 得到一排被選的數。<code>s = sum(chosen)</code> 就是第一行輸出。</p>`,
        draw(stage, runtime) {
          const lines = ["chosen = [max(r) for r in rows]", "s = sum(chosen)", "print(s)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { chosen: [5, 6, 1] }, visual: K().grid(C295A, [1, 0, 0]), glow: "chosen" },
            { lines, hi: 1, vars: { s: 12 }, glow: "s" },
            { lines, hi: 2, vars: { 輸出: 12 }, note: "第一行先印 S。" },
          ]);
        },
      },
      {
        id: "pydiv",
        title: "再掃一遍被選的數",
        teach: `<p><code>div = [x for x in chosen if s % x == 0]</code>。有就 <code>print(*div)</code>，沒有就 <code>print(-1)</code>。</p>
          <p>不要寫成 <code>range(1, s)</code> 去找全部因數，那是另一題。</p>`,
        draw(stage, runtime) {
          const lines = ["div = [x for x in chosen if s % x == 0]", "print(*div if div else [-1])"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { chosen: [5, 6, 1], s: 12, div: [6, 1] }, glow: "div", note: "5 被丟掉，6 和 1 留下。" },
            { lines, hi: 1, vars: { 輸出: "6 1" } },
            { lines, hi: 1, vars: { chosen: [6, 9, 7, 9], s: 31, div: [], 輸出: -1 }, note: "空清單時印 -1。" },
          ]);
        },
      },
      {
        id: "pyone",
        title: "被選的數一個一個問",
        teach: `<p>S=12。5 去除 12 剩 2，丟掉。6 去除剩 0，留下。1 去除任何數都剩 0，留下。</p>
          <p>順序跟選出來的順序一樣，所以是 6 1，不是 1 6。</p>`,
        draw(stage, runtime) {
          const lines = ["div = [x for x in chosen if s % x == 0]"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { x: 5, s: 12, 餘數: 2 }, visual: K().grid(C295A, [1, 0, 0]), note: "5 不能整除 12。" },
            { lines, hi: 0, vars: { x: 6, 餘數: 0, div: [6] }, glow: "div", note: "6 留下。" },
            { lines, hi: 0, vars: { x: 1, div: [6, 1] }, glow: "div", note: "1 也留下。5 不在裡面。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>兩行輸出：S，以及能整除 S 的被選數字（或 -1）。</p>`,
        draw(stage) {
          K().full(stage, ["n, m = map(int, input().split())", "rows = [list(map(int, input().split())) for _ in range(n)]", "chosen = [max(r) for r in rows]", "s = sum(chosen)", "print(s)", "div = [x for x in chosen if s % x == 0]", "print(*div if div else [-1])"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>每列取 max 加總得 S，再問被選的數誰能整除 S。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = note("第二行不是 S 的全部因數。");
        },
      },
      {
        id: "play",
        title: "自己改兩列數字",
        teach: `<p>改四個格子，看選誰、S 是多少、第二行印什麼。</p>
          <p>想清楚這件事就可以交卷：<strong>每列最大相加得 S；第二行只印「被選且能整除 S」的那些。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試 2×2</span>`, { a: 1, b: 5, c: 6, d: 4 }, (s) => {
            const rows = [[s.a, s.b], [s.c, s.d]];
            const pick = chosenOf(rows);
            const chosen = pick.map((p) => p.mx);
            const tot = chosen.reduce((x, y) => x + y, 0);
            const div = c295Div(chosen, tot);
            return K().fieldRow(["a", "b", "c", "d"].map((k, i) => K().numField(k, ["A1", "A2", "B1", "B2"][i], [s.a, s.b, s.c, s.d][i])).join("")) +
              K().grid(rows, pick.map((p) => p.j)) +
              `<p>S=<b>${tot}</b>　第二行 <b>${div.length ? div.join(" ") : -1}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— c461 邏輯運算子 ——— */
  reg({
    id: "c461",
    title: "邏輯運算子",
    steps: [
      {
        id: "story",
        title: "三扇邏輯門",
        teach: `<p>a、b 先變成 0 或 1：不是 0 就當 1。然後問三扇門 AND、OR、XOR，哪扇算出來等於 c。</p>
          <p>合的就印名字，一行一個，順序固定 AND → OR → XOR。三扇都不合，印 IMPOSSIBLE。</p>`,
        draw(stage) {
          open(stage, "1 1 1", "c461", "剪紙：AND OR XOR 與兩盞燈", K().logic(1, 1, 1));
        },
      },
      {
        id: "bool",
        title: "不是 0 就當 1",
        teach: `<p>題目給的 a、b 可能是 2、5、100。邏輯門只認「有／沒有」：0 是沒有，其他都是有。</p>
          <p>所以先 <code>A = 1 if a else 0</code>。不要直接拿 5 去做 <code>5 & 1</code>，位元運算會跟「邏輯 0/1」不一樣。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().fork({ q: "a 是 0？", yes: "A=0", no: "A=1", take: "no" }) + `<p>a=5 → A=1</p>`,
            K().fork({ q: "b 是 0？", yes: "B=0", no: "B=1", take: "yes" }) + `<p>b=0 → B=0</p>`,
          ]);
        },
      },
      {
        id: "ops",
        title: "三種運算",
        teach: `<p>AND 兩個都 1 才 1。OR 有一個 1 就是 1。XOR 兩個不一樣才 1。</p>
          <p>Python 寫成 <code>A & B</code>、<code>A | B</code>、<code>A ^ B</code>。對 0 和 1 來說，這就是邏輯門。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().logic(1, 1, 1) + `<p>AND=1、OR=1、XOR=0。要 1，所以 AND 和 OR。</p>`,
            K().logic(1, 0, 1) + `<p>AND=0、OR=1、XOR=1。要 1，所以 OR 和 XOR。</p>`,
            K().logic(0, 0, 1) + `<p>三種都是 0，要 1 → IMPOSSIBLE</p>`,
          ]);
        },
      },
      {
        id: "many",
        title: "可以同時合兩扇，不要寫 elif",
        teach: `<p>1 1 1 時 AND 和 OR 都是 1。如果寫 elif，問完 AND 就停，OR 會漏印。</p>
          <p>三個 if 分開寫。合的就推進清單。最後再一次印出來。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().logic(1, 1, 1) + `<p>AND 合。繼續問，不要停。</p>`,
            `<p>OR 也合。XOR 是 0，不合。輸出兩行：AND、OR。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例 1 1 1",
        teach: `<p>輸入 <code>1 1 1</code>。A=1 B=1，要得到 1。輸出：</p>
          <pre class="eq">AND
OR</pre>
          <p>XOR 是 0，不印。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">AND　OR</span>`);
          canvas.innerHTML = K().logic(1, 1, 1);
        },
      },
      {
        id: "edge",
        title: "a、b 不是 0 就當 1",
        teach: `<p>2 和 5 都當成 1。不要用原來的數字做 AND。先 <code>A = 1 if a else 0</code>。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().logic(1, 1, 1) + `<p>2 5 1 跟 1 1 1 同一組門。</p>`,
            note("先變成 0/1，再問三扇門。"),
          ]);
        },
      },
      {
        id: "sample2",
        title: "三扇都不合",
        teach: `<p>0 0 1：兩個都沒亮，三種運算都是 0，要 1，做不到。印一行 <code>IMPOSSIBLE</code>。</p>
          <p>拼字是 IMPOSSIBLE，中間沒有空白。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">IMPOSSIBLE</span>`);
          canvas.innerHTML = K().logic(0, 0, 1);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p><code>a, b, c = map(int, input().split())</code>。c 是「想得到的答案」，還不是 0/1 以外的奇怪值時，題目保證是 0 或 1。</p>`,
        draw(stage, runtime) {
          const lines = ["a, b, c = map(int, input().split())", "A = 1 if a else 0", "B = 1 if b else 0"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["1 1 1"], stdinAt: 1, vars: { a: 1, b: 1, c: 1 }, note: "三個都讀進來。" },
            { lines, hi: 1, vars: { a: 1, A: 1 }, glow: "A", note: "1 不是 0，A=1。" },
            { lines, hi: 2, vars: { B: 1 }, note: "B 同理。" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "三個 if 分開寫",
        teach: `<p>每問完一扇，合的就把名字放進 out。最後 out 是空的才印 IMPOSSIBLE。</p>
          <p><code>"\\n".join(out)</code> 會用換行把名字接起來，一行一個。</p>`,
        draw(stage, runtime) {
          const lines = ["out = []", "if (A & B) == c: out.append(\"AND\")", "if (A | B) == c: out.append(\"OR\")", "if (A ^ B) == c: out.append(\"XOR\")", "print(\"\\n\".join(out) if out else \"IMPOSSIBLE\")"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { A: 1, B: 1, c: 1, out: ["AND"] }, visual: K().logic(1, 1, 1), note: "AND 合。繼續問 OR。" },
            { lines, hi: 2, vars: { out: ["AND", "OR"] }, note: "OR 也合。" },
            { lines, hi: 3, vars: { out: ["AND", "OR"] }, note: "XOR=0，不合，out 不變。" },
            { lines, hi: 4, vars: { 輸出: "AND\\nOR" }, note: "用換行印兩行。" },
          ]);
        },
      },
      {
        id: "pyelif",
        title: "不要把三扇門寫成 elif",
        teach: `<p>1 1 1 時 AND 和 OR 都成立。寫成 elif，第一扇成立之後就不會再問 OR，輸出只剩 AND。</p>
          <p>0 0 1 三扇都不合，out 是空的，印 IMPOSSIBLE。</p>`,
        draw(stage, runtime) {
          const lines = ["if (A & B) == c:", "    out.append(\"AND\")", "elif (A | B) == c:", "    out.append(\"OR\")", "print(\"\\n\".join(out) if out else \"IMPOSSIBLE\")"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { A: 1, B: 1, c: 1, out: ["AND"] }, visual: K().logic(1, 1, 1), note: "AND 成立。若這裡是 elif，OR 被跳過。" },
            { lines, hi: 4, vars: { out: [], 輸出: "IMPOSSIBLE" }, visual: K().logic(0, 0, 1), note: "三扇都不合。空清單才印這句。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>先變成 0/1，再三扇門逐一問，最後決定印名字還是 IMPOSSIBLE。</p>`,
        draw(stage) {
          K().full(stage, ["a, b, c = map(int, input().split())", "A = 1 if a else 0", "B = 1 if b else 0", "out = []", "if (A & B) == c:", "    out.append(\"AND\")", "if (A | B) == c:", "    out.append(\"OR\")", "if (A ^ B) == c:", "    out.append(\"XOR\")", "print(\"\\n\".join(out) if out else \"IMPOSSIBLE\")"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>先變成 0/1。三扇門分開問，可以同時成立。都不合才印 IMPOSSIBLE。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().logic(1, 1, 1) + note("AND 和 OR 都可以合。");
        },
      },
      {
        id: "play",
        title: "自己改 a b c",
        teach: `<p>a、b 不是 0 就當 1。看哪幾扇門合。試 2 5 1，應該跟 1 1 1 一樣。</p>
          <p>想清楚這件事就可以交卷：<strong>先變成 0/1，三扇門分開問，可以同時成立。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試邏輯</span>`, { a: 1, b: 1, c: 1 }, (s) => {
            const A = s.a ? 1 : 0, B = s.b ? 1 : 0;
            return K().fieldRow(K().numField("a", "a", s.a) + K().numField("b", "b", s.b) + K().numField("c", "c", s.c)) +
              K().logic(A, B, s.c ? 1 : 0);
          });
        },
      },
    ],
  });

  /* ——— e286 籃球比賽 ——— */
  function fourSum(a, b, c, d) { return a + b + c + d; }
  function series(a1, b1, a2, b2) {
    const aw = (a1 > b1) + (a2 > b2);
    const bw = (b1 > a1) + (b2 > a2);
    return aw > bw ? "Win" : aw < bw ? "Lose" : "Tie";
  }
  reg({
    id: "e286",
    title: "籃球比賽",
    steps: [
      {
        id: "story",
        title: "兩場籃球，先比單場",
        teach: `<p>一共兩場，每場四節。先把四節加總，印出 <code>主隊:客隊</code>。再數我們贏幾場、對手贏幾場。</p>
          <ul>
            <li>主隊贏兩場 → Win</li>
            <li>客隊贏兩場 → Lose</li>
            <li>各贏一場 → Tie</li>
          </ul>
          <p>題目保證單場不會平手。平手只可能發生在「系列賽」。</p>`,
        draw(stage) {
          open(stage, "348:312", "e286", "剪紙：籃球場與兩塊計分板",
            K().board(348, 312, "第一場") + K().board(348, 312, "第二場") + `<p>2 勝 0 負 → Win</p>`);
        },
      },
      {
        id: "sum",
        title: "四節加起來才是一場",
        teach: `<p>不要一節一節比。87 四次是 348。四個數字加總，才是這場的分數。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            `<p>主隊第一場：87 87 87 87 → 348</p>`,
            `<p>客隊第一場：78 78 78 78 → 312</p>`,
            K().board(348, 312, "第一場") + `<p>348:312，主隊贏。</p>`,
          ]);
        },
      },
      {
        id: "series",
        title: "系列賽比的是贏幾場，不是總分",
        teach: `<p>兩場都贏才是 Win。就算總分加起來比較多，若各贏一場仍是 Tie。</p>
          <p>單場平手題目保證不會出現，所以每一場一定有一邊勝場 +1。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().board(348, 312, "第一場") + K().board(348, 312, "第二場") + `<p>2:0 → Win</p>`,
            K().board(40, 41, "第一場") + K().board(50, 30, "第二場") + `<p>各贏一場 → Tie。不要被總分騙。</p>`,
            K().board(10, 20, "第一場") + K().board(11, 22, "第二場") + `<p>0:2 → Lose</p>`,
          ]);
        },
      },
      {
        id: "edge",
        title: "比數格式是 A:B，中間沒有空格",
        teach: `<p>用 f-string：<code>print(f"{a1}:{b1}")</code>。不要印成 348 : 312。</p>
          <p>先印兩場比數，最後才印 Win / Lose / Tie。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">348:312</span>`);
          canvas.innerHTML = K().board(348, 312, "第一場") + note("冒號貼在兩個數字中間。");
        },
      },
      {
        id: "sample1",
        title: "把範例一逐步對一次",
        teach: `<p>輸入四行，每行四節。兩場都是 348:312。輸出：</p>
          <pre class="eq">348:312
348:312
Win</pre>
          <p>中間是冒號，兩邊不要空格。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">Win</span>`);
          canvas.innerHTML = K().board(348, 312, "第一場") + K().board(348, 312, "第二場") +
            hud(["主隊勝場 2", "客隊勝場 0", "Win"]);
        },
      },
      {
        id: "sample2",
        title: "各贏一場是 Tie",
        teach: `<p>第一場客隊贏、第二場主隊贏，系列賽平手。最後一行 Tie。</p>
          <p>前兩行還是要先把單場比數印出來。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">Tie</span>`);
          canvas.innerHTML = K().board(40, 41, "第一場") + K().board(50, 30, "第二場") +
            hud(["主隊勝場 1", "客隊勝場 1", "Tie"]);
        },
      },
      {
        id: "pyin",
        title: "讀四次，每次加四節",
        teach: `<p>四行輸入。寫一個小函式，避免複製貼上四次：</p>
          <pre class="eq">def four():
    return sum(map(int, input().split()))</pre>
          <p>然後 <code>a1, b1 = four(), four()</code> 讀完第一場。</p>`,
        draw(stage, runtime) {
          const lines = ["def four():", "    return sum(map(int, input().split()))", "a1, b1 = four(), four()", "a2, b2 = four(), four()"];
          const stdin = ["87 87 87 87", "78 78 78 78", "87 87 87 87", "78 78 78 78"];
          K().py(stage, runtime, [
            { lines, hi: 2, stdin, stdinAt: 2, vars: { a1: 348, b1: 312 }, glow: "a1", note: "前兩行吃掉，第一場 348:312。" },
            { lines, hi: 3, stdin, stdinAt: 4, vars: { a2: 348, b2: 312 }, note: "後兩行是第二場。" },
          ]);
        },
      },
      {
        id: "pysplit",
        title: "一行裡有四個數字",
        teach: `<p>每一行是四節分數，中間有空格。<code>split()</code> 剪開，<code>map(int, ...)</code> 變成整數，<code>sum(...)</code> 加總。</p>
          <p>這就是 <code>four()</code> 裡面那一行。比賽可以寫小函式，不要包 main()。</p>`,
        draw(stage, runtime) {
          const lines = ["def four():", "    return sum(map(int, input().split()))"];
          K().py(stage, runtime, [
            { lines, hi: 1, stdin: ["87 87 87 87"], stdinAt: 1, vars: { 加總: 348 }, note: "四節加起來才是一場。" },
          ]);
        },
      },
      {
        id: "pywin",
        title: "True 當 1，數勝場",
        teach: `<p>在 Python 裡，<code>True</code> 可以當 1 用。<code>(a1 &gt; b1) + (a2 &gt; b2)</code> 就是主隊贏幾場。</p>
          <p>客隊同理。不要去加總分再比，那是另一種題。</p>`,
        draw(stage, runtime) {
          const lines = ["print(f\"{a1}:{b1}\")", "print(f\"{a2}:{b2}\")", "aw = (a1 > b1) + (a2 > b2)", "bw = (b1 > a1) + (b2 > a2)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { a1: 348, b1: 312, 輸出: "348:312" }, note: "f-string 中間放冒號。" },
            { lines, hi: 2, vars: { aw: 2 }, glow: "aw", note: "兩場都是 True，2。" },
            { lines, hi: 3, vars: { bw: 0 }, note: "客隊一場都沒贏。" },
          ]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>四行輸入、三行輸出。先加總印比數，再數贏幾場。</p>
          <p>想清楚這件事就可以交卷：<strong>四節加總印比數，再數贏幾場。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().board(348, 312, "第一場") + K().board(348, 312, "第二場") + note("Win。");
        },
      },
      {
        id: "pyif",
        title: "Win / Lose / Tie",
        teach: `<p>比的是 aw 和 bw。主隊勝場多就是 Win，少就是 Lose，一樣是 Tie。</p>`,
        draw(stage, runtime) {
          const lines = ["if aw > bw:", "    print(\"Win\")", "elif aw < bw:", "    print(\"Lose\")", "else:", "    print(\"Tie\")"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { aw: 2, bw: 0, 輸出: "Win" } },
            { lines, hi: 5, vars: { aw: 1, bw: 1, 輸出: "Tie" }, note: "各贏一場落到 else。" },
          ]);
        },
      },
      {
        id: "pytie",
        title: "各贏一場印 Tie",
        teach: `<p>aw 和 bw 都是 1 時，兩個 if 都不進，落到 else 印 Tie。</p>
          <p>不要改去比兩場分數加總。各贏一場就是平手，就算其中一場贏很多分。</p>`,
        draw(stage, runtime) {
          const lines = ["if aw > bw:", "    print(\"Win\")", "elif aw < bw:", "    print(\"Lose\")", "else:", "    print(\"Tie\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { aw: 1, bw: 1 }, note: "1 &gt; 1？沒有。" },
            { lines, hi: 2, vars: { aw: 1, bw: 1 }, note: "1 &lt; 1？也沒有。" },
            { lines, hi: 5, vars: { 輸出: "Tie" }, glow: "輸出", note: "勝場相同，印 Tie。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>四行輸入，三行輸出：兩場比數，再來勝負。</p>`,
        draw(stage) {
          K().full(stage, ["def four():", "    return sum(map(int, input().split()))", "a1, b1 = four(), four()", "a2, b2 = four(), four()", "print(f\"{a1}:{b1}\")", "print(f\"{a2}:{b2}\")", "aw = (a1 > b1) + (a2 > b2)", "bw = (b1 > a1) + (b2 > a2)", "if aw > bw:", "    print(\"Win\")", "elif aw < bw:", "    print(\"Lose\")", "else:", "    print(\"Tie\")"]);
        },
      },
      {
        id: "play",
        title: "自己改兩場比數",
        teach: `<p>這裡直接填兩場加總後的分數，看 Win / Lose / Tie。課堂上記得真實輸入是四節。</p>
          <p>想清楚這件事就可以交卷：<strong>四節加總印比數，再數贏幾場。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試系列賽</span>`, { a1: 348, b1: 312, a2: 348, b2: 312 }, (s) =>
            K().fieldRow(K().numField("a1", "一主", s.a1) + K().numField("b1", "一客", s.b1) + K().numField("a2", "二主", s.a2) + K().numField("b2", "二客", s.b2)) +
            K().board(s.a1, s.b1, "第一場") + K().board(s.a2, s.b2, "第二場") +
            `<p>${series(s.a1, s.b1, s.a2, s.b2)}</p>`
          );
        },
      },
    ],
  });

  /* ——— f312 人力分配 ——— */
  function pay(a, b, c, x) {
    return a * x * x + b * x + c;
  }
  function plantBest(a1, b1, c1, a2, b2, c2, n) {
    let ans = pay(a1, b1, c1, 0) + pay(a2, b2, c2, n);
    for (let x = 0; x <= n; x++) {
      const v = pay(a1, b1, c1, x) + pay(a2, b2, c2, n - x);
      if (v > ans) ans = v;
    }
    return ans;
  }
  const F1 = [2, -1, 3], F2 = [4, -5, 2];
  const F312_FULL = [
    "a1, b1, c1 = map(int, input().split())",
    "a2, b2, c2 = map(int, input().split())",
    "n = int(input())",
    "ans = None",
    "for x in range(n + 1):",
    "    y = n - x",
    "    v = a1 * x * x + b1 * x + c1 + a2 * y * y + b2 * y + c2",
    "    if ans is None or v > ans:",
    "        ans = v",
    "print(ans)",
  ];
  reg({
    id: "f312",
    title: "人力分配",
    steps: [
      {
        id: "story",
        title: "n 個人，兩間工廠",
        teach: `<p>公司有 n 個員工，一定全部分出去：一號工廠 X<sub>1</sub> 人，二號工廠 X<sub>2</sub> 人，而且 X<sub>1</sub>+X<sub>2</sub>=n。</p>
          <p>每間工廠的收益是二次式 A·X² + B·X + C。兩間加起來越大越好。</p>
          <p>範例：一號 2、−1、3，二號 4、−5、2，一共 2 人。答案是 11。</p>`,
        draw(stage) {
          open(stage, "n = 2", "f312", "剪紙：兩間工廠與紙人員工",
            K().plants(0, 2, pay(...F1, 0), pay(...F2, 2), "sum") + `<p>0 人給一號、2 人給二號 → 11</p>`);
        },
      },
      {
        id: "formula",
        title: "收益是二次式，不是人數乘單價",
        teach: `<p>一號工廠 X 人：<code>2·X² + (−1)·X + 3</code>。二號同理。</p>
          <p>X=0 時一號還是有常數項 3。不是「沒派人就沒錢」，公式怎麼寫就怎麼算。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            hud(["X=0", "2·0+0+3=3"]) + note("沒派人，常數項還在。"),
            hud(["X=1", "2·1 − 1 + 3 = 4"]),
            hud(["X=2", "2·4 − 2 + 3 = 9"]),
          ]);
        },
      },
      {
        id: "all",
        title: "人一定要分完",
        teach: `<p>不能留人在家。所以只要決定一號幾個人，二號就是剩下的。</p>
          <p>n=2 只有三種：0 和 2、1 和 1、2 和 0。三種都算一遍，取最大。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().plants(0, 2, 3, 8) + `<p>3+8=11</p>`,
            K().plants(1, 2, 4, 1) + `<p>4+1=5，比較差</p>`,
            K().plants(2, 2, 9, 2, "sum") + `<p>9+2=11，跟第一種一樣好</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "為什麼可以全部試一遍",
        teach: `<p>n 最大 100。一號從 0 人試到 100 人，一共 101 種。電腦一下就跑完。</p>
          <div class="note"><strong>整題就這一個轉折</strong>不要對二次式微分。枚舉 x，y=n−x，代公式，記住最大的那個。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">x 從 0 走到 n</span>`);
          canvas.innerHTML = hud(["x = 一號人數", "y = n − x"]) +
            note("每走一個 x，就算一次兩間收益的和。");
        },
      },
      {
        id: "neg",
        title: "收益可能是負的",
        teach: `<p>A、B、C 可以是負數。全部員工丟去某一間，總收益也可能是負的。答案仍要印那個負數，不要預設從 0 開始比。</p>
          <p>所以一開始的 ans 不要設 0。設成「還沒看過」或一個夠小的數。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">不要從 0 起跳</span>`);
          canvas.innerHTML = K().fork({ q: "ans 一開始設 0？", yes: "負的最佳會被吃掉", no: "用 None 或很小的數", take: "no" });
        },
      },
      {
        id: "sample1",
        title: "範例一，三種都算",
        teach: `<p>輸入：</p>
          <pre class="eq">2 -1 3
4 -5 2
2</pre>
          <p>x=0 → 11。x=1 → 5。x=2 → 11。答案 11。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            hud(["還沒分"]) + K().plants(0, 2, 3, 8),
            hud(["x=0", "合計 11"]) + K().plants(0, 2, 3, 8, "sum"),
            hud(["x=1", "合計 5"]) + K().plants(1, 2, 4, 1),
            hud(["x=2", "答案 11"]) + K().plants(2, 2, 9, 2, "sum"),
          ]);
        },
      },
      {
        id: "sample2",
        title: "n=1 只有兩種分法",
        teach: `<p>只有一個人時：全給一號，或全給二號。仍要兩種都算，取較大。</p>
          <p>x 從 0 走到 n，含 0 也含 n。漏掉一邊，最佳可能剛好在那裡。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().plants(0, 1, pay(...F1, 0), pay(...F2, 1)) + `<p>全給二號</p>`,
            K().plants(1, 1, pay(...F1, 1), pay(...F2, 0), "sum") + `<p>全給一號。兩種都要試。</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>三行輸入。每次 input 吃掉一行。</p>
          <p>第一行一號工廠的 A B C。第二行二號。第三行員工總數 n。都是 split、map、int。</p>`,
        draw(stage, runtime) {
          const lines = ["a1, b1, c1 = map(int, input().split())", "a2, b2, c2 = map(int, input().split())", "n = int(input())"];
          const stdin = ["2 -1 3", "4 -5 2", "2"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin, stdinAt: 1, vars: { a1: 2, b1: -1, c1: 3 }, glow: "a1" },
            { lines, hi: 1, stdin, stdinAt: 2, vars: { a2: 4, b2: -5, c2: 2 } },
            { lines, hi: 2, stdin, stdinAt: 3, vars: { n: 2 }, glow: "n", note: "一共兩個人。" },
          ]);
        },
      },
      {
        id: "pyx",
        title: "y = n − x，人一定分完",
        teach: `<p>決定一號 x 人，二號就是剩下的。不要再寫一個迴圈去分二號。</p>
          <p>二次式用 <code>a1 * x * x</code>，不要寫 x^2，Python 的 ^ 是 XOR。</p>`,
        draw(stage, runtime) {
          const lines = ["for x in range(n + 1):", "    y = n - x", "    v = a1 * x * x + b1 * x + c1 + a2 * y * y + b2 * y + c2"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { x: 0, y: 2 }, visual: K().plants(0, 2, 3, 8), note: "x=0，二號拿 2 人。" },
            { lines, hi: 2, vars: { v: 11 }, glow: "v" },
          ]);
        },
      },
      {
        id: "pyloop",
        title: "for x in range(n + 1)",
        teach: `<p>x 從 0 走到 n，含兩邊。看到比較大的就更新 ans。第一次用 <code>ans is None</code> 當「還沒有值」，避免收益是負的時候被 0 吃掉。</p>`,
        draw(stage, runtime) {
          const lines = ["ans = None", "for x in range(n + 1):", "    y = n - x", "    v = a1 * x * x + b1 * x + c1 + a2 * y * y + b2 * y + c2", "    if ans is None or v > ans:", "        ans = v", "print(ans)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { ans: "None" }, note: "還沒看過任何一種分法。" },
            { lines, hi: 3, vars: { x: 0, y: 2, v: 11 }, visual: K().plants(0, 2, 3, 8, "sum") },
            { lines, hi: 3, vars: { x: 1, y: 1, v: 5 }, visual: K().plants(1, 2, 4, 1), note: "5 比 11 小，不換。" },
            { lines, hi: 6, vars: { 輸出: 11 }, glow: "輸出" },
          ]);
        },
      },
      {
        id: "pyend",
        title: "0 個人和全部的人那兩端都要試",
        teach: `<p><code>range(n + 1)</code> 會走到 n。n=2 時 x 是 0、1、2。</p>
          <p>若寫成 <code>range(1, n)</code>，n=2 時只試中間的 1 人，收益 5。兩端合計都是 11，會被跳過。</p>`,
        draw(stage, runtime) {
          const lines = ["for x in range(n + 1):", "    y = n - x"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { x: 0, y: 2, v: 11 }, visual: K().plants(0, 2, 3, 8, "sum"), note: "一號 0 人。這一種收益 11，是最大。" },
            { lines, hi: 1, vars: { x: 2, y: 0, v: 11 }, visual: K().plants(2, 2, 9, 2), note: "一號 2 人收益 9、二號 0 人收益 2，合計也是 11。range(1, n) 會把這兩端都跳過。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀兩間工廠的係數和 n → 枚舉一號人數 → 印最大收益。</p>
          <p>比賽就這樣交：程式從第一行開始跑，不要包 <code>def main()</code>。</p>`,
        draw(stage) {
          K().full(stage, F312_FULL);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>枚舉一號人數，二號拿剩下的，代二次式，取最大。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().plants(0, 2, 3, 8, "sum") + note("答案 11。");
        },
      },
      {
        id: "play",
        title: "自己改人數和係數",
        teach: `<p>改 n 和兩間工廠的 A B C，看最佳收益。n 變大時，迴圈就多跑幾次。</p>
          <p>想清楚這件事就可以交卷：<strong>枚舉一號人數，二號拿剩下的，代二次式，取最大。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試人力</span>`, { a1: 2, b1: -1, c1: 3, a2: 4, b2: -5, c2: 2, n: 2 }, (s) => {
            const n = Math.max(0, s.n | 0);
            const best = plantBest(s.a1, s.b1, s.c1, s.a2, s.b2, s.c2, n);
            let bestX = 0;
            for (let x = 0; x <= n; x++) {
              if (pay(s.a1, s.b1, s.c1, x) + pay(s.a2, s.b2, s.c2, n - x) === best) {
                bestX = x;
                break;
              }
            }
            return K().fieldRow(
              K().numField("a1", "一A", s.a1) + K().numField("b1", "一B", s.b1) + K().numField("c1", "一C", s.c1) +
              K().numField("a2", "二A", s.a2) + K().numField("b2", "二B", s.b2) + K().numField("c2", "二C", s.c2) +
              K().numField("n", "n", s.n)
            ) + K().plants(bestX, n, pay(s.a1, s.b1, s.c1, bestX), pay(s.a2, s.b2, s.c2, n - bestX), "sum") +
            `<p>最佳 <b>${best}</b>（一號 ${bestX} 人）</p>`;
          });
        },
      },
    ],
  });

  /* ——— g275 七言對聯 ——— */
  function coupletCheck(a, b) {
    const r1 = a[1] !== a[3] && a[1] === a[5] && b[1] !== b[3] && b[1] === b[5];
    const r2 = a[6] === 1 && b[6] === 0;
    const r3 = a[1] !== b[1] && a[3] !== b[3] && a[5] !== b[5];
    let s = "";
    if (!r1) s += "A";
    if (!r2) s += "B";
    if (!r3) s += "C";
    return s || "None";
  }
  const G1a = [1, 1, 0, 0, 0, 1, 1], G1b = [1, 0, 0, 0, 1, 1, 0];
  const G2a = [0, 1, 1, 0, 1, 1, 1], G2b = [1, 0, 1, 1, 0, 0, 0];
  const G3a = [0, 1, 1, 0, 0, 0, 1], G3b = [1, 0, 1, 1, 0, 1, 1];
  const G4a = [0, 1, 0, 0, 0, 0, 1], G4b = [0, 0, 0, 0, 0, 1, 1];
  reg({
    id: "g275",
    title: "七言對聯",
    steps: [
      {
        id: "story",
        title: "一副對聯三條規則",
        teach: `<p>兩句各 7 個 0/1。0 是平聲，1 是仄聲。一三五不論，盯第 2、4、6、7 字。</p>
          <p>題目要的是<strong>違反了哪些規則</strong>。過了不印，違了才把 A、B、C 接起來。三條都過，印 <code>None</code>。</p>
          <ol>
            <li>A　二四不同、二六同（兩句都要）</li>
            <li>B　上聯尾仄、下聯尾平</li>
            <li>C　兩句第 2、4、6 字兩兩相反</li>
          </ol>`,
        draw(stage) {
          open(stage, coupletCheck(G1a, G1b), "g275", "剪紙：門框上的紅紙對聯",
            K().couplet(G1a, G1b) + `<p>這副違反 A 和 C，輸出 AC。</p>`);
        },
      },
      {
        id: "keys",
        title: "盯 2、4、6、7",
        teach: `<p>金色底線的格子是規則會用到的位置。第 1、3、5 字完全不管。</p>
          <p>Python 下標從 0 數，所以第 2 字是 <code>a[1]</code>，第 7 字是 <code>a[6]</code>。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().couplet(G1a, G1b, "r1") + `<p>規則 A：每句的 2、4、6。</p>`,
            K().couplet(G1a, G1b, "r2") + `<p>規則 B：兩句第 7 字。</p>`,
            K().couplet(G1a, G1b, "r3") + `<p>規則 C：兩句 2、4、6 要相反。</p>`,
          ]);
        },
      },
      {
        id: "ruleA",
        title: "A：二四不同，二六同",
        teach: `<p>每一句自己看：第 2 字 ≠ 第 4 字，而且第 2 字 = 第 6 字。上下兩句都要成立，A 才過。</p>
          <p>注意是<strong>二六同</strong>，不是四六同。2 和 6 一樣、2 和 4 不一樣，4 自然跟 6 也不一樣。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().couplet(G2a, G2b, "r1") + `<p>上 1,0,1：2≠4 且 2=6。下 0,1,0：也對。A 過。</p>`,
            K().couplet(G1a, G1b, "r1") + `<p>下聯第 2、4 都是 0，二四相同。A 違。</p>`,
          ]);
        },
      },
      {
        id: "ruleB",
        title: "B：仄起平收",
        teach: `<p>上聯最後一個字必須是 1（仄），下聯最後一個字必須是 0（平）。</p>
          <p>不是「兩個結尾不一樣」就好。上聯若收平、下聯收仄，雖然不一樣，B 仍算違反。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().couplet(G1a, G1b, "r2") + `<p>上 1、下 0。B 過。</p>`,
            K().couplet(G3a, G3b, "r2") + `<p>下聯結尾是 1，該平卻仄。B 違。</p>`,
          ]);
        },
      },
      {
        id: "ruleC",
        title: "C：上下相對",
        teach: `<p>第 2、4、6 字，上下聯都要不同。三個位置有一個相同，C 就違。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().couplet(G2a, G2b, "r3") + `<p>1≠0、0≠1、1≠0。C 過。</p>`,
            K().couplet(G1a, G1b, "r3") + `<p>第 4 字上下都是 0。C 違。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例一輸出 AC",
        teach: `<p>輸入：</p>
          <pre class="eq">1
1 1 0 0 0 1 1
1 0 0 0 1 1 0</pre>
          <p>A 違、B 過、C 違。連起來 <code>AC</code>。不要印 BAC，順序固定 A 再 B 再 C。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">AC</span>`);
          canvas.innerHTML = K().couplet(G1a, G1b) + hud(["A 違", "B 過", "C 違", "AC"]);
        },
      },
      {
        id: "sample2",
        title: "範例二全過，印 None",
        teach: `<p>三條都過，印 <code>None</code>。不是印空白，也不是印 AAA。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">None</span>`);
          canvas.innerHTML = K().couplet(G2a, G2b) + hud(["A 過", "B 過", "C 過", "None"]);
        },
      },
      {
        id: "sample3",
        title: "範例三有兩副",
        teach: `<p>第一行 n=2，後面兩副各兩行。每一副印一行。</p>
          <p>第一副 AB，第二副 ABC。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().couplet(G3a, G3b) + `<p>第一副 ${coupletCheck(G3a, G3b)}</p>`,
            K().couplet(G4a, G4b) + `<p>第二副 ${coupletCheck(G4a, G4b)}</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "違了才把字母接上去，全過印 None",
        teach: `<p>A、B、C 三條都過，輸出 None，不是空行、也不是 0。</p>
          <p>違兩條就把兩個字母依序接起來，例如 AC。不要用空格隔開。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">None / AC</span>`);
          canvas.innerHTML = note("過的規則保持安靜。只有違規的字母會出現。");
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>不必一次讀完全部。n 次迴圈，每次讀兩行當一副，算完就印，換下一副。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "for _ in range(n):", "    a = list(map(int, input().split()))", "    b = list(map(int, input().split()))", "    print(check(a, b))"];
          const stdin = ["1", "1 1 0 0 0 1 1", "1 0 0 0 1 1 0"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin, stdinAt: 1, vars: { n: 1 }, note: "只有一副。" },
            { lines, hi: 2, stdin, stdinAt: 2, vars: { a: G1a }, visual: K().couplet(G1a, G1b) },
            { lines, hi: 3, stdin, stdinAt: 3, vars: { b: G1b } },
          ]);
        },
      },
      {
        id: "pyif",
        title: "違了才把字母接上去",
        teach: `<p>三個條件寫成布林。成立代表「規則過了」，所以要接字母時是 <code>if not r1</code>。</p>
          <p>最後 ans 還是空字串，改成 None。</p>`,
        draw(stage, runtime) {
          const lines = ["r1 = a[1] != a[3] and a[1] == a[5] and b[1] != b[3] and b[1] == b[5]", "r2 = a[6] == 1 and b[6] == 0", "r3 = a[1] != b[1] and a[3] != b[3] and a[5] != b[5]", "ans = (\"\" if r1 else \"A\") + (\"\" if r2 else \"B\") + (\"\" if r3 else \"C\")", "print(ans if ans else \"None\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { r1: false }, visual: K().couplet(G1a, G1b, "r1"), note: "下聯二四相同，r1 失敗。" },
            { lines, hi: 1, vars: { r2: true }, note: "仄起平收，r2 過。" },
            { lines, hi: 2, vars: { r3: false }, note: "第 4 字相同，r3 失敗。" },
            { lines, hi: 4, vars: { 輸出: "AC" }, glow: "輸出" },
          ]);
        },
      },
      {
        id: "pynone",
        title: "三條都過就印 None",
        teach: `<p>空字串不能直接印，否則那一行是空白。改成 None。</p>
          <p>字母是「沒過才接」。若寫反，範例一會印出過了的 B，而不是 AC。</p>`,
        draw(stage, runtime) {
          const lines = ["ans = (\"\" if r1 else \"A\") + (\"\" if r2 else \"B\") + (\"\" if r3 else \"C\")", "print(ans if ans else \"None\")"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { r1: true, r2: true, r3: true, ans: "" }, note: "三條都過，ans 是空的。" },
            { lines, hi: 1, vars: { 輸出: "None" }, glow: "輸出", note: "空的改印 None。" },
            { lines, hi: 1, vars: { r1: false, r2: true, r3: false, 輸出: "AC" }, glow: "輸出", note: "沒過的才出現。不要印過了的 B。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>check 回傳違規字母或 None。主程式讀 n 副、每副印一行。</p>`,
        draw(stage) {
          K().full(stage, ["def check(a, b):", "    r1 = a[1] != a[3] and a[1] == a[5] and b[1] != b[3] and b[1] == b[5]", "    r2 = a[6] == 1 and b[6] == 0", "    r3 = a[1] != b[1] and a[3] != b[3] and a[5] != b[5]", "    ans = (\"\" if r1 else \"A\") + (\"\" if r2 else \"B\") + (\"\" if r3 else \"C\")", "    return ans if ans else \"None\"", "n = int(input())", "for _ in range(n):", "    a = list(map(int, input().split()))", "    b = list(map(int, input().split()))", "    print(check(a, b))"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>違 A/B/C 就把字母接起來，全過印 None。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = note("過的規則保持安靜。");
        },
      },
      {
        id: "play",
        title: "自己改上下聯",
        teach: `<p>七個格子填 0 或 1。先猜違了哪幾條，再對答案。</p>
          <p>想清楚這件事就可以交卷：<strong>輸出的是違反的規則，全過才印 None。</strong></p>`,
        draw(stage) {
          const init = { a1: 1, a2: 1, a3: 0, a4: 0, a5: 0, a6: 1, a7: 1, b1: 1, b2: 0, b3: 0, b4: 0, b5: 1, b6: 1, b7: 0 };
          K().live(stage, `<span class="chip">試對聯</span>`, init, (s) => {
            const a = [s.a1, s.a2, s.a3, s.a4, s.a5, s.a6, s.a7].map((x) => x ? 1 : 0);
            const b = [s.b1, s.b2, s.b3, s.b4, s.b5, s.b6, s.b7].map((x) => x ? 1 : 0);
            const fields = ["a", "b"].map((who) =>
              [1, 2, 3, 4, 5, 6, 7].map((i) => K().numField(who + i, who + i, s[who + i])).join("")
            ).join("");
            return K().fieldRow(fields) + K().couplet(a, b) + `<p>輸出 <b>${coupletCheck(a, b)}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— g595 修補圍籬 ——— */
  const fence = [2, 0, 3, 0, 4];
  function fenceFill(h) {
    const fill = {};
    let ans = 0;
    h.forEach((v, i) => {
      if (v === 0) {
        const left = i > 0 ? h[i - 1] : 1e9;
        const right = i < h.length - 1 ? h[i + 1] : 1e9;
        fill[i] = Math.min(left, right);
        ans += fill[i];
      }
    });
    return { fill, ans };
  }
  reg({
    id: "g595",
    title: "修補圍籬",
    steps: [
      {
        id: "story",
        title: "籬笆缺了兩根",
        teach: `<p>一排柱子，0 是缺的。每個缺口補成「左鄰和右鄰裡面比較矮的那個」。最邊上缺人，就只看僅有的那邊。</p>
          <p>題目保證缺口不會相鄰，所以左右一定還站著柱子（除非你在最邊）。</p>`,
        draw(stage) {
          open(stage, "補 5", "g595", "剪紙：缺了一根的木籬笆", K().posts(fence) + `<p>兩根標著「缺」。</p>`);
        },
      },
      {
        id: "fill",
        title: "一根一根補 min(左, 右)",
        teach: `<p>第一個缺口左右是 2 和 3，補 2。第二個左右是 3 和 4，補 3。一共 5。</p>
          <p>補的高度就是要花的木頭。全部缺口加起來就是答案。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().posts(fence) + `<p>先找到 0。</p>`,
            K().posts(fence, { 1: 2 }) + `<p>min(2,3)=2</p>`,
            K().posts(fence, { 1: 2, 3: 3 }) + `<p>min(3,4)=3，總和 5</p>`,
          ]);
        },
      },
      {
        id: "edge",
        title: "最邊上缺，只看僅有的那邊",
        teach: `<p>最左邊沒有左鄰，就用右邊那根。最右邊同理。</p>
          <p>程式裡把「沒有的那邊」設成一個很大的數，<code>min</code> 就會自動選僅有的那邊。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().posts([0, 4, 5]) + `<p>最左邊缺。只能看 4，補 4。</p>`,
            K().posts([5, 4, 0]) + `<p>最右邊缺。只能看 4，補 4。</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "為什麼補較矮的那邊",
        teach: `<p>題目規定補成左右較矮的那個，不是較高、也不是平均。木頭長度就是這個高度，全部缺口加起來就是答案。</p>
          <p>題目保證缺口不相鄰，所以左右一定還站著柱子（除非你在最邊）。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">min(左, 右)</span>`);
          canvas.innerHTML = K().posts(fence, { 1: 2 }) + note("左右是 2 和 3，補 2，不是 3。");
        },
      },
      {
        id: "sample1",
        title: "把範例一逐步對一次",
        teach: `<p>輸入：</p>
          <pre class="eq">5
2 0 3 0 4</pre>
          <p>第一個缺口 min(2,3)=2。第二個 min(3,4)=3。輸出 5。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().posts(fence) + `<p>先找到 0。</p>`,
            K().posts(fence, { 1: 2 }) + hud(["第一個缺口 2"]),
            K().posts(fence, { 1: 2, 3: 3 }) + hud(["第二個缺口 3", "合計 5"]),
          ]);
        },
      },
      {
        id: "sample2",
        title: "最左邊缺，只看右邊",
        teach: `<p>如果輸入是 <code>0 4 5</code>，缺口在最邊。沒有左鄰，補 4。</p>
          <p>程式把左邊當成一個很大的數，min(很大, 4) 自然得到 4。不必另寫一個 if 專管邊界，不過分開寫也可以。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().posts([0, 4, 5]) + `<p>左邊沒人。</p>`,
            K().posts([0, 4, 5], { 0: 4 }) + `<p>補 4。答案 4。</p>`,
          ]);
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>第一行 n，第二行 n 個高度。每次 input 吃掉一行。</p>
          <p>第二行有好幾個數，要用 split、map、list 收成一排。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "h = list(map(int, input().split()))"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["5", "2 0 3 0 4"], stdinAt: 0, vars: { n: "" }, note: "第一行還沒吃。" },
            { lines, hi: 0, stdin: ["5", "2 0 3 0 4"], stdinAt: 1, vars: { n: 5 }, glow: "n" },
            { lines, hi: 1, stdin: ["5", "2 0 3 0 4"], stdinAt: 2, vars: { h: fence }, visual: K().posts(fence) },
          ]);
        },
      },
      {
        id: "pyans",
        title: "ans = 0，只加缺口",
        teach: `<p>開始前 <code>ans = 0</code> 一定要寫，不然沒有盒子可以往裡加。不是 0 的柱子不要動。</p>`,
        draw(stage, runtime) {
          const lines = ["ans = 0", "for i in range(n):", "    if h[i] == 0:", "        left = h[i - 1] if i > 0 else 10 ** 9", "        right = h[i + 1] if i < n - 1 else 10 ** 9", "        ans += min(left, right)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { ans: 0 }, note: "先準備盒子。" },
            { lines, hi: 1, vars: { i: 0, h: fence }, note: "i=0 是 2，不是缺口，跳過。" },
          ]);
        },
      },
      {
        id: "pyif",
        title: "只處理 h[i] == 0",
        teach: `<p>不是 0 的柱子不要動。迴圈裡先問是不是缺口，是才看左右。</p>`,
        draw(stage, runtime) {
          const lines = ["for i in range(n):", "    if h[i] == 0:", "        left = h[i - 1] if i > 0 else 10 ** 9", "        right = h[i + 1] if i < n - 1 else 10 ** 9", "        ans += min(left, right)"];
          K().py(stage, runtime, [
            { lines, hi: 1, vars: { i: 1, h: fence }, visual: K().posts(fence), note: "i=1 是 0，進去補。" },
            { lines, hi: 4, vars: { left: 2, right: 3, ans: 2 }, visual: K().posts(fence, { 1: 2 }), glow: "ans" },
            { lines, hi: 4, vars: { i: 3, left: 3, right: 4, ans: 5 }, visual: K().posts(fence, { 1: 2, 3: 3 }), note: "第二個缺口再加 3。" },
          ]);
        },
      },
      {
        id: "pyprint",
        title: "迴圈結束才印一次",
        teach: `<p><code>print(ans)</code> 寫在 for 的外面。範例兩個缺口加完是 5，只印一行。</p>
          <p>若印在迴圈裡，會先印 2 再印 5，多了一行。</p>`,
        draw(stage, runtime) {
          const lines = ["ans += min(left, right)", "print(ans)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { ans: 5 }, visual: K().posts(fence, { 1: 2, 3: 3 }), note: "兩個缺口都加完。" },
            { lines, hi: 1, vars: { 輸出: 5 }, glow: "輸出", note: "只印最後的 5。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>只加缺口。邊界用一個很大的數當「沒有的那邊」。比賽從第一行開始跑。</p>`,
        draw(stage) {
          K().full(stage, ["n = int(input())", "h = list(map(int, input().split()))", "ans = 0", "for i in range(n):", "    if h[i] == 0:", "        left = h[i - 1] if i > 0 else 10 ** 9", "        right = h[i + 1] if i < n - 1 else 10 ** 9", "        ans += min(left, right)", "print(ans)"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>缺口補成左右較矮的那個，邊上看僅有的一邊。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().posts(fence, { 1: 2, 3: 3 }) + note("合計 5。");
        },
      },
      {
        id: "play",
        title: "自己改柱高",
        teach: `<p>把其中一根改成 0，看會補多少。不要把兩個 0 放隔壁，題目保證不會這樣。</p>
          <p>想清楚這件事就可以交卷：<strong>缺口補成左右較矮的那個，邊上看僅有的一邊。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試柱子</span>`, { a: 2, b: 0, c: 3, d: 0, e: 4 }, (s) => {
            const h = [s.a, s.b, s.c, s.d, s.e];
            const { fill, ans } = fenceFill(h);
            return K().fieldRow(["a", "b", "c", "d", "e"].map((k, i) => K().numField(k, String(i + 1), h[i])).join("")) +
              K().posts(h, fill) + `<p>要補 <b>${ans}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— h081 程式交易 ——— */
  function trade(p, D) {
    let hold = true, last = p[0], profit = 0;
    const marks = { 0: "is-buy" };
    for (let i = 1; i < p.length; i++) {
      const x = p[i];
      if (hold && x >= last + D) {
        profit += x - last;
        last = x;
        hold = false;
        marks[i] = "is-sell";
      } else if (!hold && x <= last - D) {
        last = x;
        hold = true;
        marks[i] = "is-buy";
      }
    }
    return { profit, marks };
  }
  const PX = [1, 4, 2, 5];
  const PX2 = [30, 20, 45, 38, 10, 20];
  const H081 = [
    "n, D = map(int, input().split())",
    "p = list(map(int, input().split()))",
    "hold = True",
    "last = p[0]",
    "profit = 0",
    "for x in p[1:]:",
    "    if hold and x >= last + D:",
    "        profit += x - last",
    "        last = x",
    "        hold = False",
    "    elif (not hold) and x <= last - D:",
    "        last = x",
    "        hold = True",
    "print(profit)",
  ];
  reg({
    id: "h081",
    title: "程式交易",
    steps: [
      {
        id: "story",
        title: "漲夠才賣，跌夠再買",
        teach: `<p>第一天先買進。之後只看今天跟「上次成交價」差多少：</p>
          <ul>
            <li>手上有股票，而且今天 ≥ last + D → 賣掉，賺差價</li>
            <li>空手，而且今天 ≤ last − D → 再買</li>
          </ul>
          <p>中間不夠格的日子什麼都不做。最後沒賣掉的，也不算。</p>`,
        draw(stage) {
          const t = trade(PX, 2);
          open(stage, "D=2 獲利 " + t.profit, "h081", "剪紙：上漲的紙行情與金幣", K().price(PX, t.marks));
        },
      },
      {
        id: "first",
        title: "第一天一定買",
        teach: `<p>不管第一天貴不貴，規則就是先買，last 設成第一天價格。迴圈從第二天開始。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">先買</span>`);
          canvas.innerHTML = K().price(PX, { 0: "is-buy" }) + `<p>last=1，手上有股票。</p>`;
        },
      },
      {
        id: "sim",
        title: "一天一天走",
        teach: `<p>記住 last。不要看未來，只看今天跟 last 差多少。</p>
          <p>D=2，價格 1 4 2 5：1 買、4 賣賺 3，2 買、5 賣賺 3，一共 6。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().price(PX, { 0: "is-buy" }) + `<p>第 1 天買，last=1</p>`,
            K().price(PX, { 0: "is-buy", 1: "is-sell" }) + `<p>4 ≥ 1+2，賣，賺 3，last=4</p>`,
            K().price(PX, { 0: "is-buy", 1: "is-sell", 2: "is-buy" }) + `<p>2 ≤ 4−2，再買，last=2</p>`,
            K().price(PX, trade(PX, 2).marks) + `<p>5 ≥ 2+2，賣，再賺 3。總計 6</p>`,
          ]);
        },
      },
      {
        id: "edge",
        title: "剛好等於門檻也算",
        teach: `<p>判斷寫 <code>&gt;= last + D</code> 和 <code>&lt;= last − D</code>。等於也成交。</p>
          <p>賣出之後 last 改成賣價，下一筆買回要比這個賣價再低 D。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().fork({ q: "今天 >= last + D？", yes: "賣掉", no: "繼續拿著", take: "yes" }),
            K().fork({ q: "空手且今天 <= last − D？", yes: "買回", no: "繼續等", take: "yes" }),
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例一獲利 6",
        teach: `<p>輸入：</p>
          <pre class="eq">4 2
1 4 2 5</pre>
          <p>兩次買賣，3+3=6。</p>`,
        draw(stage) {
          const t = trade(PX, 2);
          const canvas = K().toolbar(stage, `<span class="chip">輸出 6</span>`);
          canvas.innerHTML = K().price(PX, t.marks) + hud(["買 1 賣 4", "買 2 賣 5", "獲利 6"]);
        },
      },
      {
        id: "sample2",
        title: "範例二門檻比較大",
        teach: `<p>D=10，價格 30 20 45 38 10 20。</p>
          <p>30 買，20 不夠賣；45 ≥ 40 賣，賺 15。38 不夠買；10 ≤ 35 買；20 ≥ 20 賣，賺 10。一共 25。</p>`,
        draw(stage, runtime) {
          const t = trade(PX2, 10);
          K().walk(stage, runtime, [
            K().price(PX2, { 0: "is-buy" }) + `<p>30 買。20 沒漲夠。</p>`,
            K().price(PX2, { 0: "is-buy", 2: "is-sell" }) + `<p>45 賣，賺 15。</p>`,
            K().price(PX2, t.marks) + `<p>10 買、20 賣，再賺 10。總計 25。</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "最後沒賣掉的不算",
        teach: `<p>如果拿到最後還持有，那一筆差價不計入。題目只要「已經成交的獲利」。</p>
          <p>所以不要在迴圈結束後再假裝賣一次。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">沒賣就不賺</span>`);
          canvas.innerHTML = note("手上還有股票，等於這筆交易還沒完成。");
        },
      },
      {
        id: "pyin",
        title: "第一行讀 n 和 D",
        teach: `<p>第一行有兩個整數，中間空一格：天數 n、門檻 D。</p>
          <p><code>input()</code> 先得到整行文字。<code>split()</code> 切開，<code>map(int, ...)</code> 把兩段都變成數字，再一次交給 n 和 D。</p>`,
        draw(stage, runtime) {
          const lines = ["n, D = map(int, input().split())"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["4 2", "1 4 2 5"], stdinAt: 0, vars: { n: "", D: "" }, note: "程式停在 input()，等第 1 行。" },
            { lines, hi: 0, stdin: ["4 2", "1 4 2 5"], stdinAt: 1, vars: { n: 4, D: 2 }, glow: "D", note: "「4 2」切開。n 是 4，D 是 2。" },
          ]);
        },
      },
      {
        id: "pylist",
        title: "第二行收成價格",
        teach: `<p>第二行有 n 個價格。同樣切開、變成數字，再用 <code>list</code> 收成一排，叫做 p。</p>
          <p>p[0] 是第一天。後面的迴圈會用到這一整排。</p>`,
        draw(stage, runtime) {
          const lines = ["p = list(map(int, input().split()))"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["4 2", "1 4 2 5"], stdinAt: 1, vars: { n: 4, D: 2 }, note: "第一行已經讀完，等第二行。" },
            { lines, hi: 0, stdin: ["4 2", "1 4 2 5"], stdinAt: 2, vars: { p: PX }, glow: "p", visual: K().price(PX), note: "四個價格收成一排。還沒買賣。" },
          ]);
        },
      },
      {
        id: "pyinit",
        title: "第一天寫成三行",
        teach: `<p>規則「第一天一定買」就是這三行，寫在迴圈前面：</p>
          <pre class="eq">hold = True
last = p[0]
profit = 0</pre>
          <p><code>hold</code> 表示手上有股票。<code>last</code> 是上次成交價。<code>profit</code> 先是 0，因為還沒賣。</p>`,
        draw(stage, runtime) {
          const lines = ["hold = True", "last = p[0]", "profit = 0"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { hold: true }, glow: "hold", note: "先買，所以手上有股票。" },
            { lines, hi: 1, vars: { hold: true, last: 1 }, glow: "last", visual: K().price(PX, { 0: "is-buy" }), note: "成交價是第一天的 1。" },
            { lines, hi: 2, vars: { hold: true, last: 1, profit: 0 }, glow: "profit", note: "還沒賣出，獲利是 0。" },
          ]);
        },
      },
      {
        id: "pyfor",
        title: "從第二天開始走",
        teach: `<p><code>p[1:]</code> 是拿掉第一天之後剩下的價格。第一天已經買過，不要再放進迴圈。</p>
          <p>每一圈的 <code>x</code> 就是今天的價格。範例一會依序變成 4、2、5。</p>`,
        draw(stage, runtime) {
          const lines = ["for x in p[1:]:"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { x: 4, p: PX }, glow: "x", visual: K().price(PX, { 0: "is-buy" }), note: "第一圈。1 已經買了，x 是 4。" },
            { lines, hi: 0, vars: { x: 2 }, glow: "x", note: "第二圈，x 是 2。" },
            { lines, hi: 0, vars: { x: 5 }, glow: "x", note: "第三圈，x 是 5。走完就離開迴圈。" },
          ]);
        },
      },
      {
        id: "pysell",
        title: "先寫賣出的 if",
        teach: `<p>手上有股票，而且今天不低于 last + D，就賣。範例一第一圈：4 ≥ 1+2。</p>
          <pre class="eq">if hold and x &gt;= last + D:
    profit += x - last
    last = x
    hold = False</pre>
          <p>三行都要寫。少一行，下次就會用錯成交價，或以為還拿著股票。</p>`,
        draw(stage, runtime) {
          const lines = ["if hold and x >= last + D:", "    profit += x - last", "    last = x", "    hold = False"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { hold: true, x: 4, last: 1, D: 2 }, glow: "x", note: "4 ≥ 3，條件成立，走進 if。" },
            { lines, hi: 1, vars: { profit: 3 }, glow: "profit", note: "差價 4−1=3，加進獲利。" },
            { lines, hi: 2, vars: { last: 4 }, glow: "last", note: "上次成交價改成今天的賣價。" },
            { lines, hi: 3, vars: { hold: false }, glow: "hold", visual: K().price(PX, { 0: "is-buy", 1: "is-sell" }), note: "賣掉了，手上沒有股票。" },
          ]);
        },
      },
      {
        id: "pybuy",
        title: "再用 elif 寫買回",
        teach: `<p>賣和買不會發生在同一天，所以用 <code>elif</code>，不要再寫一個 <code>if</code>。</p>
          <pre class="eq">elif (not hold) and x &lt;= last - D:
    last = x
    hold = True</pre>
          <p>買回不用改 profit。範例一第二圈：空手，2 ≤ 4−2，剛好等於，也買。</p>`,
        draw(stage, runtime) {
          const lines = ["elif (not hold) and x <= last - D:", "    last = x", "    hold = True"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { hold: false, x: 2, last: 4, D: 2 }, glow: "x", note: "2 ≤ 2，條件成立。" },
            { lines, hi: 1, vars: { last: 2, profit: 3 }, glow: "last", note: "成交價改成 2。獲利還是 3，買入不加錢。" },
            { lines, hi: 2, vars: { hold: true }, glow: "hold", visual: K().price(PX, { 0: "is-buy", 1: "is-sell", 2: "is-buy" }), note: "又拿著股票了。" },
          ]);
        },
      },
      {
        id: "pyskip",
        title: "兩個都不成立就跳過",
        teach: `<p>條件不成立時，if 和 elif 下面的行都不會跑。last、hold、profit 維持原樣。</p>
          <p>範例二 D=10。30 買進之後，20 沒有 ≥ 40，所以第二天什麼都不做。45 賣掉之後，38 沒有 ≤ 35，繼續空手。</p>`,
        draw(stage, runtime) {
          const lines = ["if hold and x >= last + D:", "    profit += x - last", "elif (not hold) and x <= last - D:", "    last = x"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { hold: true, x: 20, last: 30, D: 10, profit: 0 }, glow: "x", visual: K().price(PX2, { 0: "is-buy" }), note: "20 ≥ 40？沒有。獲利仍是 0，last 仍是 30。" },
            { lines, hi: 2, vars: { hold: false, x: 38, last: 45, D: 10, profit: 15 }, glow: "x", visual: K().price(PX2, { 0: "is-buy", 2: "is-sell" }), note: "38 ≤ 35？沒有。繼續空手，last 仍是 45。" },
          ]);
        },
      },
      {
        id: "pyrun",
        title: "把範例一四天代進去",
        teach: `<p>同一段 if，換三個 x。看 profit、last、hold 怎麼接下去。</p>
          <p>4 賣掉賺 3。2 買回，獲利不變。5 再賣，獲利變成 6。</p>`,
        draw(stage, runtime) {
          const lines = H081.slice(5, 13);
          K().py(stage, runtime, [
            { lines, hi: 2, vars: { x: 4, profit: 3, last: 4, hold: false }, glow: "profit", visual: K().price(PX, { 0: "is-buy", 1: "is-sell" }), note: "第一圈賣出。" },
            { lines, hi: 6, vars: { x: 2, profit: 3, last: 2, hold: true }, glow: "last", visual: K().price(PX, { 0: "is-buy", 1: "is-sell", 2: "is-buy" }), note: "第二圈買回。profit 還是 3。" },
            { lines, hi: 2, vars: { x: 5, profit: 6, last: 5, hold: false }, glow: "profit", visual: K().price(PX, trade(PX, 2).marks), note: "第三圈再賣。3+3=6。" },
          ]);
        },
      },
      {
        id: "pyprint",
        title: "迴圈結束只印 profit",
        teach: `<p>迴圈走完，<code>print(profit)</code> 就是答案。範例一印 6，範例二印 25。</p>
          <p>如果這時 hold 還是 True，代表最後還拿著股票。不要再加一行把它賣掉。</p>`,
        draw(stage, runtime) {
          const lines = ["print(profit)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { profit: 6, hold: false }, glow: "profit", visual: K().price(PX, trade(PX, 2).marks), note: "範例一。已經賣光，印 6。" },
            { lines, hi: 0, vars: { profit: 25, hold: false }, glow: "profit", visual: K().price(PX2, trade(PX2, 10).marks), note: "範例二。印 25。" },
            { lines, hi: 0, vars: { profit: 0, hold: true }, glow: "hold", note: "若收盤還拿著，profit 維持 0，不要再賣一次。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀入 → 第一天買 → 迴圈裡先問賣、再問買 → 印獲利。跳過的日子不用寫 else。</p>`,
        draw(stage) {
          K().full(stage, H081);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>第一天買，漲夠才賣，跌夠再買，沒賣就不賺。</strong></p>`,
        draw(stage) {
          const t = trade(PX, 2);
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().price(PX, t.marks) + note("獲利 6。");
        },
      },
      {
        id: "play",
        title: "自己改四天行情",
        teach: `<p>改價格和 D，看買賣點。綠柱寫著買，紅柱寫著賣。</p>
          <p>想清楚這件事就可以交卷：<strong>漲過門檻才賣，跌過門檻才買，中間的日子略過。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試行情</span>`, { a: 1, b: 4, c: 2, d: 5, D: 2 }, (s) => {
            const p = [s.a, s.b, s.c, s.d];
            const t = trade(p, s.D);
            return K().fieldRow(K().numField("a", "D1", s.a) + K().numField("b", "D2", s.b) + K().numField("c", "D3", s.c) + K().numField("d", "D4", s.d) + K().numField("D", "D", s.D)) +
              K().price(p, t.marks) + `<p>獲利 <b>${t.profit}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— i399 數字遊戲 ——— */
  function diceOut(a, b, c) {
    const cnt = Array(10).fill(0);
    [a, b, c].forEach((x) => { if (x >= 1 && x <= 9) cnt[x]++; });
    const mx = Math.max(...cnt);
    const vals = [];
    for (let i = 9; i >= 1; i--) if (cnt[i]) vals.push(i);
    return { mx, vals, cnt };
  }
  reg({
    id: "i399",
    title: "數字遊戲",
    steps: [
      {
        id: "story",
        title: "三顆骰子，先數次數",
        teach: `<p>三個 1 到 9 的數字。先數哪個出現最多次，那個次數叫 P。</p>
          <p>再把出現過的數字<strong>去掉重複、由大到小</strong>印出來。不是只印眾數，是所有出現過的數。</p>
          <p>6 6 6 → <code>3 6</code>。7 9 7 → <code>2 9 7</code>（9 也要印）。</p>`,
        draw(stage) {
          open(stage, "6 6 6", "i399", "剪紙：三顆骰子與數字牌",
            K().dice([6, 6, 6]) + `<p>豹子。輸出 3 6</p>`);
        },
      },
      {
        id: "count",
        title: "先數 1 到 9 各出現幾次",
        teach: `<p>開一個長度 10 的盒子 <code>cnt</code>。看到 7 就 <code>cnt[7] += 1</code>。</p>
          <p>P 就是 <code>max(cnt)</code>。三顆全一樣 P=3，一對 P=2，三個都不同 P=1。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().dice([6, 6, 6]) + K().freq([0, 0, 0, 0, 0, 0, 3, 0, 0, 0], 3) + `<p>P=3</p>`,
            K().dice([7, 9, 7]) + K().freq([0, 0, 0, 0, 0, 0, 0, 2, 0, 1], 2) + `<p>P=2</p>`,
            K().dice([4, 1, 8]) + K().freq([0, 1, 0, 0, 1, 0, 0, 0, 1, 0], 1) + `<p>P=1</p>`,
          ]);
        },
      },
      {
        id: "unique",
        title: "再從 9 掃到 1，出現過的都印",
        teach: `<p>7 9 7 出現過 9 和 7。由大到小是 9 7。即使 9 只出現一次，也要印。</p>
          <p>常見錯誤：只印「出現最多次的那些」。那樣 7 9 7 會變成 <code>2 7</code>，少了 9。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().dice([7, 9, 7]) + `<p>不重複：9、7。輸出 <code>2 9 7</code></p>`,
            K().dice([4, 1, 8]) + `<p>不重複：8、4、1。輸出 <code>1 8 4 1</code></p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例一豹子",
        teach: `<p>輸入 <code>6 6 6</code>。P=3，只出現 6。輸出 <code>3 6</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">3 6</span>`);
          canvas.innerHTML = K().dice([6, 6, 6]) + hud(["P=3", "不重複 6"]);
        },
      },
      {
        id: "sample2",
        title: "範例二有一對",
        teach: `<p>輸入 <code>7 9 7</code>。7 出現兩次所以 P=2，但 9 也出現過。由大到小 9 7。</p>
          <pre class="eq">2 9 7</pre>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">2 9 7</span>`);
          canvas.innerHTML = K().dice([7, 9, 7]) + hud(["P=2", "不重複 9 7"]);
        },
      },
      {
        id: "sample3",
        title: "範例三三個都不同",
        teach: `<p>輸入 <code>4 1 8</code>。大家都一次，P=1，由大到小 8 4 1。</p>
          <pre class="eq">1 8 4 1</pre>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">1 8 4 1</span>`);
          canvas.innerHTML = K().dice([4, 1, 8]) + hud(["P=1", "不重複 8 4 1"]);
        },
      },
      {
        id: "why",
        title: "從 9 掃到 1，出現過的都印",
        teach: `<p>不是只印眾數。7 出現兩次、9 出現一次，兩個都要印，而且大的在前：<code>2 9 7</code>。</p>
          <p>P 是最多次數，後面是「出現過的數字由大到小」。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">先 P 再由大到小</span>`);
          canvas.innerHTML = K().dice([7, 9, 7]) + `<p>2 是次數，9 和 7 都出現過。</p>`;
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p><code>a = list(map(int, input().split()))</code>。然後準備 <code>cnt = [0] * 10</code>，下標 1 到 9 才會用到。</p>`,
        draw(stage, runtime) {
          const lines = ["a = list(map(int, input().split()))", "cnt = [0] * 10", "for x in a:", "    cnt[x] += 1"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin: ["7 9 7"], stdinAt: 1, vars: { a: [7, 9, 7] }, visual: K().dice([7, 9, 7]) },
            { lines, hi: 3, vars: { cnt7: 2, cnt9: 1 }, note: "看到 7 就往 cnt[7] 加。走完 7 有兩次、9 有一次。" },
          ]);
        },
      },
      {
        id: "pyprint",
        title: "先印 P，再從 9 掃到 1",
        teach: `<p><code>mx = max(cnt)</code> 是 P。然後：</p>
          <pre class="eq">vals = [i for i in range(9, 0, -1) if cnt[i]]
print(mx, *vals)</pre>
          <p><code>if cnt[i]</code> 表示出現過（次數不是 0）。不要寫成 <code>cnt[i] == mx</code>。</p>`,
        draw(stage, runtime) {
          const lines = ["mx = max(cnt)", "vals = [i for i in range(9, 0, -1) if cnt[i]]", "print(mx, *vals)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { mx: 2 }, glow: "mx" },
            { lines, hi: 1, vars: { vals: [9, 7] }, note: "9 在前，因為從大掃到小。" },
            { lines, hi: 2, vars: { 輸出: "2 9 7" }, glow: "輸出" },
          ]);
        },
      },
      {
        id: "pyonly",
        title: "不要只印出現最多次的",
        teach: `<p><code>if cnt[i] == mx</code> 會把只出現一次的 9 丟掉，7 9 7 變成 <code>2 7</code>。</p>
          <p>條件是 <code>if cnt[i]</code>：出現過就印。P 仍然是最多次數，放在最前面。</p>`,
        draw(stage, runtime) {
          const lines = ["vals = [i for i in range(9, 0, -1) if cnt[i]]", "print(mx, *vals)"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { mx: 2, vals: [9, 7] }, visual: K().dice([7, 9, 7]), note: "9 的次數是 1，不是 0，所以留下。" },
            { lines, hi: 1, vars: { 輸出: "2 9 7" }, glow: "輸出", note: "若寫成次數等於 2 才印，9 會不見。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>一行輸出：次數在最前面，後面是不重複的數字大到小。</p>`,
        draw(stage) {
          K().full(stage, ["a = list(map(int, input().split()))", "cnt = [0] * 10", "for x in a:", "    cnt[x] += 1", "mx = max(cnt)", "vals = [i for i in range(9, 0, -1) if cnt[i]]", "print(mx, *vals)"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>先數次數 P，再從 9 掃到 1 把出現過的都印出來。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().dice([7, 9, 7]) + note("2 9 7");
        },
      },
      {
        id: "play",
        title: "自己改三個數",
        teach: `<p>填 1 到 9。先數 P，再把出現過的由大排到小。</p>
          <p>想清楚這件事就可以交卷：<strong>第一個數是最多次數，後面是不重複的數字大到小。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試三數</span>`, { a: 7, b: 9, c: 7 }, (s) => {
            const o = diceOut(s.a, s.b, s.c);
            return K().fieldRow(K().numField("a", "A", s.a) + K().numField("b", "B", s.b) + K().numField("c", "C", s.c)) +
              K().dice([s.a, s.b, s.c]) + K().freq(o.cnt, o.mx) +
              `<p>輸出 <b>${o.mx} ${o.vals.join(" ")}</b></p>`;
          });
        },
      },
    ],
  });

  /* ——— k731 路徑偵測 ——— */
  function dirOf(a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    if (dx > 0) return 0;
    if (dy < 0) return 1;
    if (dx < 0) return 2;
    return 3;
  }
  function countTurns(pts) {
    let left = 0, right = 0, uturn = 0;
    for (let i = 0; i < pts.length - 2; i++) {
      const d1 = dirOf(pts[i], pts[i + 1]);
      const d2 = dirOf(pts[i + 1], pts[i + 2]);
      const t = (d2 - d1 + 4) % 4;
      if (t === 3) left += 1;
      else if (t === 1) right += 1;
      else if (t === 2) uturn += 1;
    }
    return { left, right, uturn };
  }
  const PATH1 = [[0, 0], [2, 0], [2, 1]];
  const PATH2 = [[0, 0], [4, 0], [4, 9], [4, 8], [4, 10], [4, 2], [4, 3], [6, 3], [6, 10], [6, 9]];
  const DIRN = ["東", "南", "西", "北"];
  function turnName(d1, d2) {
    const t = (d2 - d1 + 4) % 4;
    return t === 0 ? "直走（不計）" : t === 1 ? "右轉" : t === 2 ? "迴轉" : "左轉";
  }
  reg({
    id: "k731",
    title: "路徑偵測",
    steps: [
      {
        id: "story",
        title: "從原點走出一條折線",
        teach: `<p>起點 (0,0)，後面給 n 個座標。保證只走東、西、南、北，第一段一定向東。</p>
          <p>每走完兩段，看轉彎：左轉、右轉、迴轉。直走不計。</p>
          <p>輸出三個數：<code>左轉 右轉 迴轉</code>。</p>`,
        draw(stage) {
          open(stage, "1 0 0", "k731", "剪紙：地圖上轉彎的黃箭頭",
            K().path(PATH1, 2) + K().compass(1, 0, 0) + `<p>向東再向北，左轉一次。</p>`);
        },
      },
      {
        id: "dirs",
        title: "四個方向用 0 1 2 3",
        teach: `<p>順時針編號：東 0、南 1、西 2、北 3。這樣「新方向 − 舊方向」對 4 取餘數就能看出轉了多少：</p>
          <ul>
            <li>0 → 直走，不計</li>
            <li>1 → 右轉</li>
            <li>2 → 迴轉</li>
            <li>3 → 左轉（等於逆時針一格）</li>
          </ul>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            `<p>東→北：0 到 3，(3−0+4)%4=3，左轉。</p>` + K().path(PATH1, 2),
            `<p>東→南：0 到 1，右轉。</p>`,
            `<p>東→西：0 到 2，迴轉。</p>`,
          ]);
        },
      },
      {
        id: "vec",
        title: "向量相減看出這一截往哪",
        teach: `<p>後一個點減前一個點。x 變大是東，y 變大是北，x 變小是西，y 變小是南。</p>
          <p>題目保證不會斜走，所以四種裡只會中一種。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().path(PATH1, 1) + `<p>(0,0)→(2,0)，x 增加，向東。</p>`,
            K().path(PATH1, 2) + `<p>(2,0)→(2,1)，y 增加，向北。</p>`,
          ]);
        },
      },
      {
        id: "straight",
        title: "直走不計",
        teach: `<p>同一方向連走兩段，差值是 0。這不是轉彎，三個計數都不加。</p>
          <p>所以輸出只有三個數，沒有「直走幾次」。範例一只有兩段、一次左轉，不會出現第四個數字。</p>`,
        draw(stage, runtime) {
          const line = [[0, 0], [1, 0], [2, 0]];
          K().walk(stage, runtime, [
            K().path(line, 2) + K().compass(0, 0, 0) + `<p>東再東。直走，0 0 0。</p>`,
            K().path(PATH1, 2) + K().compass(1, 0, 0) + `<p>東再北。這才是左轉。</p>`,
          ]);
        },
      },
      {
        id: "sample1",
        title: "範例一左轉一次",
        teach: `<p>輸入：</p>
          <pre class="eq">2
2 0
2 1</pre>
          <p>兩段：東、北。一個左轉。輸出 <code>1 0 0</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">1 0 0</span>`);
          canvas.innerHTML = K().path(PATH1, 2) + K().compass(1, 0, 0) +
            `<p>${DIRN[0]} → ${DIRN[3]}，${turnName(0, 3)}</p>`;
        },
      },
      {
        id: "sample2",
        title: "範例二九個點",
        teach: `<p>九段路，轉彎發生在相鄰兩段之間，一共問 8 次。其中直走不計。</p>
          <p>輸出 <code>2 1 5</code>：左轉 2、右轉 1、迴轉 5。</p>`,
        draw(stage, runtime) {
          const t = countTurns(PATH2);
          K().walk(stage, runtime, [
            K().path(PATH2, 2) + `<p>先向東，再向北。</p>`,
            K().path(PATH2, PATH2.length - 1) + K().compass(t.left, t.right, t.uturn),
          ]);
        },
      },
      {
        id: "why",
        title: "第一段規定向東，但轉彎從第二段才開始數",
        teach: `<p>起點 (0,0)。第一個點決定第一段方向。轉彎發生在「兩段方向不一樣」的地方，所以迴圈走 n−1 次轉折。</p>
          <p>t=0 直走，不計。t=1 右轉，t=3 左轉，t=2 迴轉。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">直走不計</span>`);
          canvas.innerHTML = K().compass(0, 0, 0) + note("方向差對 4 取餘數。");
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>先把 (0,0) 放進去，再讀 n 個點。後面算方向時，每一截都是「後一個減前一個」。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "pts = [(0, 0)]", "for _ in range(n):", "    x, y = map(int, input().split())", "    pts.append((x, y))"];
          const stdin = ["2", "2 0", "2 1"];
          K().py(stage, runtime, [
            { lines, hi: 1, stdin, stdinAt: 1, vars: { n: 2, pts: ["(0, 0)"] }, note: "原點先在。" },
            { lines, hi: 4, stdin, stdinAt: 3, vars: { pts: ["(0, 0)", "(2, 0)", "(2, 1)"] }, visual: K().path(PATH1, 2) },
          ]);
        },
      },
      {
        id: "pydir",
        title: "兩段方向相減，對 4 取餘數",
        teach: `<p>方向編號順時針。差值加 4 再 % 4，避免負數。</p>
          <p>3 是左轉、1 是右轉、2 是迴轉、0 略過。</p>`,
        draw(stage, runtime) {
          const lines = ["d1 = dir_of(pts[i], pts[i + 1])", "d2 = dir_of(pts[i + 1], pts[i + 2])", "t = (d2 - d1 + 4) % 4", "if t == 3: left += 1", "elif t == 1: right += 1", "elif t == 2: uturn += 1"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { d1: 0 }, visual: K().path(PATH1, 1), note: "第一段向東。" },
            { lines, hi: 1, vars: { d2: 3 }, note: "第二段向北。" },
            { lines, hi: 3, vars: { t: 3, left: 1 }, glow: "left", note: "(3−0+4)%4=3，左轉。" },
          ]);
        },
      },
      {
        id: "pyskip",
        title: "t 是 0 就什麼都不加",
        teach: `<p>三個 if 都不寫 t==0。直走時 left、right、uturn 維持原樣。</p>
          <p>東再東：(0−0+4)%4 = 0。三個計數都還是 0，不要多一個「直走」的輸出。</p>`,
        draw(stage, runtime) {
          const line = [[0, 0], [1, 0], [2, 0]];
          const lines = ["t = (d2 - d1 + 4) % 4", "if t == 3: left += 1", "elif t == 1: right += 1", "elif t == 2: uturn += 1"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { d1: 0, d2: 0, t: 0, left: 0, right: 0, uturn: 0 }, glow: "t", visual: K().path(line, 2), note: "方向沒變。三個 if 都不進。" },
            { lines, hi: 1, vars: { t: 0, left: 0, right: 0, uturn: 0 }, note: "計數維持 0 0 0。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>輸出三個數：左轉、右轉、迴轉。直走不要加進去。</p>`,
        draw(stage) {
          K().full(stage, [
            "n = int(input())",
            "pts = [(0, 0)]",
            "for _ in range(n):",
            "    x, y = map(int, input().split())",
            "    pts.append((x, y))",
            "def dir_of(p, q):",
            "    dx, dy = q[0] - p[0], q[1] - p[1]",
            "    if dx > 0: return 0",
            "    if dy < 0: return 1",
            "    if dx < 0: return 2",
            "    return 3",
            "left = right = uturn = 0",
            "for i in range(n - 1):",
            "    d1 = dir_of(pts[i], pts[i + 1])",
            "    d2 = dir_of(pts[i + 1], pts[i + 2])",
            "    t = (d2 - d1 + 4) % 4",
            "    if t == 3: left += 1",
            "    elif t == 1: right += 1",
            "    elif t == 2: uturn += 1",
            "print(left, right, uturn)",
          ]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>方向差對 4 取餘數：3 左、1 右、2 迴轉、0 直走不計。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = K().compass(1, 0, 0) + note("範例一左轉一次。");
        },
      },
      {
        id: "play",
        title: "兩個範例對一下",
        teach: `<p>短的那條是範例一，長的是範例二。直走不會改變三個數字。</p>
          <p>想清楚這件事就可以交卷：<strong>只數轉彎，輸出左轉、右轉、迴轉。</strong></p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().path(PATH1, 2) + K().compass(1, 0, 0) + `<p>範例一：1 0 0</p>`,
            K().path(PATH2, PATH2.length - 1) + (() => {
              const t = countTurns(PATH2);
              return K().compass(t.left, t.right, t.uturn) + `<p>範例二：${t.left} ${t.right} ${t.uturn}</p>`;
            })(),
          ]);
        },
      },
    ],
  });

  /* ——— m931 遊戲選角 ——— */
  const CH1 = [
    { a: 3, d: 1, p: 10 },
    { a: 5, d: 2, p: 29 },
    { a: 1, d: 4, p: 17 },
  ];
  const CH2 = [
    { a: 6, d: 6, p: 72 },
    { a: 1, d: 3, p: 10 },
    { a: 8, d: 6, p: 100 },
    { a: 5, d: 4, p: 41 },
    { a: 2, d: 8, p: 68 },
    { a: 7, d: 2, p: 53 },
  ];
  function power(a, d) { return a * a + d * d; }
  function secondOf(list) {
    const s = list.slice().sort((x, y) => power(x.a, x.d) - power(y.a, y.d));
    return s[s.length - 2];
  }
  reg({
    id: "m931",
    title: "遊戲選角",
    steps: [
      {
        id: "story",
        title: "只要第二強的那一位",
        teach: `<p>每個角色有攻擊和防禦。戰力 = 攻×攻 + 防×防。題目只要<strong>戰力第二大</strong>的那一位，印他的攻擊和防禦，不是印戰力那個數字。</p>
          <p>保證大家戰力都不一樣，不會平手。</p>`,
        draw(stage) {
          open(stage, "攻²+防²", "m931", "剪紙：三張角色卡與金色星星",
            K().chars(CH1, 2) + `<p>最強是 5 2（29），第二是 1 4（17）。輸出 1 4。</p>`);
        },
      },
      {
        id: "power",
        title: "戰力是平方和",
        teach: `<p>3 1 → 9+1=10。5 2 → 25+4=29。1 4 → 1+16=17。</p>
          <p>不要比攻擊、也不要比防禦。只比這個平方和。印出去的卻是原來的攻防。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().chars(CH1, 0) + `<p>3 1 → 10</p>`,
            K().chars(CH1, 1) + `<p>5 2 → 29，目前最大。</p>`,
            K().chars(CH1, 2) + `<p>1 4 → 17，夾在中間，就是第二。</p>`,
          ]);
        },
      },
      {
        id: "notie",
        title: "戰力保證不一樣",
        teach: `<p>題目寫了：每個角色的能力值相異。所以不必處理平手，也不必再比攻擊當決勝。</p>
          <p>sort 元組時只會用到第一個數（戰力），後面的攻防只是跟著走、最後拿來印。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">不會平手</span>`);
          canvas.innerHTML = K().chars(CH1, 2) + note("10、17、29 三個都不一樣。第二就是 17。");
        },
      },
      {
        id: "second",
        title: "排序後倒數第二個",
        teach: `<p>把 (戰力, 攻, 防) 放進清單再 sort。小的在前，所以：</p>
          <ul>
            <li><code>chars[-1]</code> 最強</li>
            <li><code>chars[-2]</code> 第二強 ← 只要這個</li>
          </ul>
          <p>印 <code>chars[-2][1], chars[-2][2]</code>，不要印戰力。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">只要第二</span>`);
          canvas.innerHTML = K().chars(CH1, 2) + hud(["最強 5 2 丟掉", "第二 1 4 留下"]);
        },
      },
      {
        id: "sample1",
        title: "範例一輸出 1 4",
        teach: `<p>輸入：</p>
          <pre class="eq">3
3 1
5 2
1 4</pre>
          <p>戰力 10、29、17。第二是 17，對應 1 4。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">1 4</span>`);
          canvas.innerHTML = K().chars(CH1, 2) + `<p>輸出 <b>1 4</b></p>`;
        },
      },
      {
        id: "sample2",
        title: "範例二第二是 6 6",
        teach: `<p>六個角色。最強 8 6（100），第二 6 6（72）。輸出 <code>6 6</code>。</p>
          <p>不要被「看起來很平均」騙過，平方和 72 確實是第二。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            K().chars(CH2, 2) + `<p>8 6 戰力 100，最大。</p>`,
            K().chars(CH2, 0) + `<p>6 6 戰力 72，第二。輸出 6 6。</p>`,
          ]);
        },
      },
      {
        id: "why",
        title: "印的是攻防，不是戰力數字",
        teach: `<p>第二強的戰力可能是 17，但輸出是他的攻擊和防禦 <code>1 4</code>。不要印 17。</p>
          <p>排序時把戰力放第一個，sort 完拿倒數第二個的攻防。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">第二強的攻防</span>`);
          canvas.innerHTML = K().fork({ q: "印 chars[-2] 的戰力？", yes: "會印錯成一個數", no: "印攻擊和防禦", take: "yes" });
        },
      },
      {
        id: "pyin",
        title: "input() 一次只讀一行",
        teach: `<p>每一行兩個數。讀進來立刻算平方和，三個數字綁在一起放進清單，後面排序才不會對錯人。</p>`,
        draw(stage, runtime) {
          const lines = ["n = int(input())", "chars = []", "for _ in range(n):", "    a, d = map(int, input().split())", "    chars.append((a * a + d * d, a, d))"];
          const stdin = ["3", "3 1", "5 2", "1 4"];
          K().py(stage, runtime, [
            { lines, hi: 0, stdin, stdinAt: 1, vars: { n: 3 } },
            { lines, hi: 4, stdin, stdinAt: 2, vars: { a: 3, d: 1, 戰力: 10 }, visual: K().chars(CH1, 0) },
            { lines, hi: 4, stdin, stdinAt: 4, vars: { chars: ["(10,3,1)", "(29,5,2)", "(17,1,4)"] }, note: "三個人都裝好了。" },
          ]);
        },
      },
      {
        id: "pysort",
        title: "sort 之後拿 [-2]",
        teach: `<p>元組比較時先比第一個數，也就是戰力。戰力保證不一樣，不會再比到攻防。</p>
          <p><code>print(chars[-2][1], chars[-2][2])</code> 一行兩個數。</p>`,
        draw(stage, runtime) {
          const lines = ["chars.sort()", "print(chars[-2][1], chars[-2][2])"];
          K().py(stage, runtime, [
            { lines, hi: 0, note: "小的在前：10、17、29。" },
            { lines, hi: 1, vars: { 輸出: "1 4" }, glow: "輸出", visual: K().chars(CH1, 2), note: "倒數第二個是 (17, 1, 4)。" },
          ]);
        },
      },
      {
        id: "pytop",
        title: "[-1] 會印成最強的那個",
        teach: `<p>排完是 10、17、29。最後一個 <code>chars[-1]</code> 是 5 2，那是最強，不是題目要的。</p>
          <p>第二強是倒數第二個 <code>[-2]</code>，印攻擊和防禦，不要印戰力 17。</p>`,
        draw(stage, runtime) {
          const lines = ["print(chars[-1][1], chars[-1][2])", "print(chars[-2][1], chars[-2][2])"];
          K().py(stage, runtime, [
            { lines, hi: 0, vars: { 輸出: "5 2" }, visual: K().chars(CH1, 1), note: "這是最強。範例會錯。" },
            { lines, hi: 1, vars: { 輸出: "1 4" }, glow: "輸出", visual: K().chars(CH1, 2), note: "改成 -2，才是 1 4。" },
          ]);
        },
      },
      {
        id: "pyfull",
        title: "把程式拼起來",
        teach: `<p>讀入並算戰力 → 排序 → 印第二強的攻防。只要一行輸出。</p>`,
        draw(stage) {
          K().full(stage, ["n = int(input())", "chars = []", "for _ in range(n):", "    a, d = map(int, input().split())", "    chars.append((a * a + d * d, a, d))", "chars.sort()", "print(chars[-2][1], chars[-2][2])"]);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>想清楚這件事就可以交卷：<strong>戰力平方和排序，印倒數第二個的攻防。</strong></p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = note("不要印戰力數字，印攻擊和防禦。");
        },
      },
      {
        id: "play",
        title: "自己改三個角色",
        teach: `<p>改攻防，金色是目前第二強。戰力一樣時題目保證不會發生，這裡若撞在一起，排序仍會分出先後，但交卷時不用處理。</p>
          <p>想清楚這件事就可以交卷：<strong>比平方和，印第二強的攻擊和防禦。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試角色</span>`, { a1: 3, d1: 1, a2: 5, d2: 2, a3: 1, d3: 4 }, (s) => {
            const list = [
              { a: s.a1, d: s.d1, p: power(s.a1, s.d1) },
              { a: s.a2, d: s.d2, p: power(s.a2, s.d2) },
              { a: s.a3, d: s.d3, p: power(s.a3, s.d3) },
            ];
            const snd = secondOf(list);
            const hi = list.findIndex((c) => c.a === snd.a && c.d === snd.d);
            return K().fieldRow(
              K().numField("a1", "攻1", s.a1) + K().numField("d1", "防1", s.d1) +
              K().numField("a2", "攻2", s.a2) + K().numField("d2", "防2", s.d2) +
              K().numField("a3", "攻3", s.a3) + K().numField("d3", "防3", s.d3)
            ) + K().chars(list, hi) + `<p>第二強 <b>${snd.a} ${snd.d}</b></p>`;
          });
        },
      },
    ],
  });
})();
