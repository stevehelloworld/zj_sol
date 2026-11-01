(function () {
  const K = () => window.IfKit;

  function hud(parts) {
    return `<div class="hud">${parts.map((p) => `<span>${p}</span>`).join("")}</div>`;
  }

  function note(s) {
    return `<p class="py-note">${s}</p>`;
  }

  function fill(R, C, v) {
    return Array.from({ length: R }, () => Array(C).fill(v));
  }

  function cover(R, C, a, b, S) {
    const half = Math.floor(S / 2);
    const range = [];
    for (let r = a - half; r <= a + half; r++) {
      for (let c = b - half; c <= b + half; c++) {
        if (r >= 0 && r < R && c >= 0 && c < C) range.push([r, c]);
      }
    }
    return range;
  }

  function apply(height, dino, a, b, S, depth) {
    const R = height.length;
    const C = height[0].length;
    const range = cover(R, C, a, b, S);
    let awake = false;
    range.forEach(([r, c]) => {
      if (dino[r][c] > 0) awake = true;
    });
    const nh = height.map((row) => row.slice());
    const nd = dino.map((row) => row.slice());
    const dizzy = [];
    if (awake) {
      range.forEach(([r, c]) => {
        if (nd[r][c] > 0) dizzy.push(r + "," + c);
        nd[r][c] = 0;
      });
    } else {
      range.forEach(([r, c]) => {
        nh[r][c] -= depth;
      });
    }
    return { height: nh, dino: nd, range, awake, dizzy };
  }

  function summarize(height, dino) {
    let hi = height[0][0];
    let lo = height[0][0];
    let left = 0;
    height.forEach((row, r) => {
      row.forEach((v, c) => {
        if (v > hi) hi = v;
        if (v < lo) lo = v;
        left += dino[r][c];
      });
    });
    return { hi, lo, left };
  }

  function board(height, dino, opt) {
    opt = opt || {};
    const range = new Set((opt.range || []).map(([r, c]) => r + "," + c));
    const dizzy = new Set(opt.dizzy || []);
    const center = opt.center;
    const C = height[0].length;
    const head = `<div class="comet-row"><span class="comet-idx is-row"></span>${
      Array.from({ length: C }, (_, c) => `<span class="comet-idx">${c}</span>`).join("")
    }</div>`;
    const rows = height.map((row, r) => {
      const cells = row.map((v, c) => {
        const key = r + "," + c;
        const inn = range.has(key);
        const cls = ["comet-cell"];
        if (inn && opt.dig) cls.push("is-dig");
        else if (inn) cls.push("is-range");
        let sub = "";
        if (dizzy.has(key)) sub = "暈";
        else if (dino[r][c] > 0) sub = "龍" + dino[r][c];
        else if (inn && opt.dig) sub = "挖";
        else if (center && center[0] === r && center[1] === c) sub = "中心";
        else if (inn) sub = "空";
        const label = `第${r}行第${c}列，高度${v}${sub ? "，" + sub : ""}`;
        return `<div class="${cls.join(" ")}" aria-label="${label}"><b>${v}</b>${sub ? `<small>${sub}</small>` : ""}</div>`;
      }).join("");
      return `<div class="comet-row"><span class="comet-idx is-row">${r}</span>${cells}</div>`;
    }).join("");
    const label = opt.label || "地面高度。有龍的格子標著隻數。";
    return `<div class="comet-scroll"><div class="comet" role="img" aria-label="${label}">${head}${rows}</div></div>`;
  }

  const SAMPLE_H = fill(1, 10, 5);
  const SAMPLE_D = fill(1, 10, 0);
  SAMPLE_D[0][1] = 2;
  SAMPLE_D[0][4] = 2;
  SAMPLE_D[0][5] = 1;

  const DEMO_H = fill(3, 4, 4);
  const DEMO_D = fill(3, 4, 0);
  DEMO_D[0][0] = 1;
  DEMO_D[1][3] = 2;
  DEMO_D[2][2] = 1;

  const hit1 = apply(SAMPLE_H, SAMPLE_D, 0, 0, 1, 4);
  const hit2 = apply(hit1.height, hit1.dino, 0, 3, 3, 1);
  const official = summarize(hit2.height, hit2.dino);
  if (official.hi !== 5 || official.lo !== 1 || official.left !== 3) {
    throw new Error("r488 範例應為 5 1 3");
  }

  const CODE = [
    "R, C, D = map(int, input().split())",
    "height = [[D] * C for _ in range(R)]",
    "dino = [[0] * C for _ in range(R)]",
    "K = int(input())",
    "for _ in range(K):",
    "    r, c = map(int, input().split())",
    "    dino[r][c] += 1",
    "M = int(input())",
    "for _ in range(M):",
    "    a, b, S, d = map(int, input().split())",
    "    half = S // 2",
    "    awake = False",
    "    for r in range(a - half, a + half + 1):",
    "        for c in range(b - half, b + half + 1):",
    "            if 0 <= r < R and 0 <= c < C and dino[r][c] > 0:",
    "                awake = True",
    "    for r in range(a - half, a + half + 1):",
    "        for c in range(b - half, b + half + 1):",
    "            if 0 <= r < R and 0 <= c < C:",
    "                if awake:",
    "                    dino[r][c] = 0",
    "                else:",
    "                    height[r][c] -= d",
    "hi = height[0][0]",
    "lo = height[0][0]",
    "left = 0",
    "for r in range(R):",
    "    for c in range(C):",
    "        if height[r][c] > hi:",
    "            hi = height[r][c]",
    "        if height[r][c] < lo:",
    "            lo = height[r][c]",
    "        left += dino[r][c]",
    "print(hi, lo, left)",
  ];

  const STDIN = [
    "1 10 5",
    "5",
    "0 5",
    "0 4",
    "0 4",
    "0 1",
    "0 1",
    "2",
    "0 0 1 4",
    "0 3 3 1",
  ];

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

  reg({
    id: "r488",
    title: "彗星撞擊",
    steps: [
      {
        id: "story",
        title: "有龍就擋住，沒龍才挖",
        teach: `<p>地圖每一格一開始都是高度 D。格子上可能站著恐龍，同一格可以有好幾隻。</p>
          <p>彗星砸下一個正方形。正方形裡只要還有一隻醒著的龍，這一次就不挖，裡面醒著的龍全部暈倒。一隻都沒有，每一格高度就減掉深度 d。高度可以變成負的。</p>
          <p>全部砸完，輸出三個數：最高、最低、還醒著的恐龍有幾隻。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">擋住或挖深</span>`);
          canvas.innerHTML = board(SAMPLE_H, SAMPLE_D, { label: "範例地圖，高度都是 5。第 1 列 2 隻，第 4 列 2 隻，第 5 列 1 隻。" }) +
            note("上面的數字是第幾列。這一題只有 1 行，所以行號都是 0。");
        },
      },
      {
        id: "map",
        title: "範例是一排十格",
        teach: `<p>輸入第一行 <code>1 10 5</code>：1 行、10 列、高度 5。</p>
          <p>5 隻龍的座標是 <code>(0,5) (0,4) (0,4) (0,1) (0,1)</code>。第一個數是行，要小於 R。第二個數是列，要小於 C。同一格出現兩次，就疊成 2 隻。</p>
          <p>座標從 0 開始。最左邊是第 0 列，不是第 1 列。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">5 隻龍</span>`);
          canvas.innerHTML = board(SAMPLE_H, SAMPLE_D, { label: "十格高度都是 5，恐龍共 5 隻。" }) +
            hud(["第 1 列 龍2", "第 4 列 龍2", "第 5 列 龍1"]);
        },
      },
      {
        id: "square",
        title: "邊長是奇數，中心在一格",
        teach: `<p>邊長 S 一定是奇數。中心往上下左右各延伸 <code>S // 2</code> 格，含中心自己。</p>
          <ul>
            <li>S = 1：只有中心那一格</li>
            <li>S = 3：中心再加一圈，一共 3×3，貼到邊界就少幾格</li>
          </ul>
          <p>下面這張是示意，不是範例。中心在 (1, 1)，邊長 3。金色九格才算。最右邊那 2 隻在正方形外面，不擋這一次，也不會暈。</p>`,
        draw(stage, runtime) {
          const range = cover(3, 4, 1, 1, 3);
          const after = apply(DEMO_H, DEMO_D, 1, 1, 3, 2);
          K().walk(stage, runtime, [
            board(DEMO_H, DEMO_D, { range, center: [1, 1], label: "3 乘 4 的示意。金色是邊長 3 的正方形。" }) +
              note("正方形裡有兩格有龍，所以這一次不挖。外面那 2 隻不動。"),
            board(after.height, after.dino, { range: after.range, dizzy: after.dizzy, center: [1, 1], label: "正方形裡的兩隻暈了，高度仍是 4。外面還有 2 隻。" }) +
              hud(["高度仍是 4", "暈了 2 隻", "外面還醒著 2 隻"]),
          ]);
        },
      },
      {
        id: "dig",
        title: "範例第一次：空格就挖",
        teach: `<p>第一次撞擊是 <code>0 0 1 4</code>。中心 (0, 0)，邊長 1，深度 4。只有最左邊那一格。</p>
          <p>那裡沒有龍，所以高度 5 減 4，變成 1。其他格不動，龍也不動。</p>`,
        draw(stage, runtime) {
          const range = cover(1, 10, 0, 0, 1);
          K().walk(stage, runtime, [
            board(SAMPLE_H, SAMPLE_D, { range, center: [0, 0], label: "第一次只砸到第 0 列，那裡是空的。" }) +
              note("邊長 1，金色只有中心。"),
            board(hit1.height, hit1.dino, { range: hit1.range, dig: true, center: [0, 0], label: "第 0 列從 5 挖成 1。" }) +
              hud(["第 0 列 5→1", "龍還是 5 隻"]),
          ]);
        },
      },
      {
        id: "block",
        title: "先看完正方形，再決定挖不挖",
        teach: `<p>第二次是 <code>0 3 3 1</code>。中心在第 3 列，邊長 3，所以打到第 2、3、4 列。</p>
          <p>第 2、3 列是空的，第 4 列有 2 隻。若邊掃邊挖，空格會先被挖掉，後面才發現有龍。題目不是這樣：範圍裡有一隻醒著的，整次都不挖。</p>
          <p>所以要先走完正方形，記住有沒有龍。有，才把範圍裡的龍全部清成 0。沒有，才每格減 d。</p>`,
        draw(stage, runtime) {
          const range = cover(1, 10, 0, 3, 3);
          K().walk(stage, runtime, [
            board(hit1.height, hit1.dino, { range, center: [0, 3], label: "第二次打到第 2、3、4 列。第 4 列有 2 隻龍。" }) +
              note("第 2、3 列雖然是空的，也不能先挖。"),
            board(hit2.height, hit2.dino, { range: hit2.range, dizzy: hit2.dizzy, center: [0, 3], label: "第 4 列的龍暈了，三格高度都沒變。" }) +
              hud(["高度沒減", "第 4 列 2 隻暈倒"]),
          ]);
        },
      },
      {
        id: "count",
        title: "第三個數是隻數",
        teach: `<p>砸完兩次：第 0 列高度 1，其餘還是 5。最高 5，最低 1。</p>
          <p>還醒著的是第 1 列 2 隻、第 5 列 1 隻，一共 3 隻。第 4 列那 2 隻已經暈了，不算。</p>
          <p>同一格的 2 隻要算 2。若只數「還有龍的格子」，會得到 2，範例就會錯。輸出 <strong>5 1 3</strong>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">5 1 3</span>`);
          canvas.innerHTML = board(hit2.height, hit2.dino, { label: "砸完兩次。最高 5，最低 1，還醒著 3 隻。" }) +
            hud(["最高 5", "最低 1", "清醒 3 隻"]);
        },
      },
      {
        id: "clip",
        title: "伸出地圖的部分不算",
        teach: `<p>正方形若超出邊界，只留下地圖裡的格子。中心在第 0 列、邊長 3 時，左邊那一格的列號是 −1，地圖沒有它。</p>
          <p>實際打到的是第 0 列和第 1 列。第 1 列有龍，所以這一次擋住，不挖。這張是另舉的邊界，不是範例那兩次。</p>`,
        draw(stage) {
          const edge = apply(SAMPLE_H, SAMPLE_D, 0, 0, 3, 1);
          const canvas = K().toolbar(stage, `<span class="chip">切掉地圖外</span>`);
          canvas.innerHTML = board(edge.height, edge.dino, {
            range: edge.range,
            dizzy: edge.dizzy,
            center: [0, 0],
            label: "邊長 3 的中心在第 0 列，地圖內只剩第 0 列和第 1 列。",
          }) + note("左邊出界的那格不存在，也不會去讀它。");
        },
      },
      {
        id: "later",
        title: "暈過的龍不再擋，高度可以是負的",
        teach: `<p>暈倒的龍之後都算不存在。範例砸完後，若再對第 4 列來一次邊長 1、深度 2，那裡已經沒有醒著的龍，高度會從 5 變成 3。</p>
          <p>另一個極端：1 格、高度 1、沒有龍，深度 4，高度變成 −3。最高和最低都是 −3。若一開始把最高設成 0，負的高度會被漏掉。要從真正的一格出發。</p>`,
        draw(stage, runtime) {
          const again = apply(hit2.height, hit2.dino, 0, 4, 1, 2);
          const neg = apply(fill(1, 1, 1), fill(1, 1, 0), 0, 0, 1, 4);
          const negSum = summarize(neg.height, neg.dino);
          K().walk(stage, runtime, [
            board(again.height, again.dino, { range: again.range, dig: true, center: [0, 4], label: "第 4 列的龍已經暈了，再砸就挖成 3。" }) +
              note("這一次不是範例裡的輸入，用來看出暈過就不再擋。"),
            board(neg.height, neg.dino, { range: neg.range, dig: true, label: "高度變成 -3。" }) +
              hud([`最高 ${negSum.hi}`, `最低 ${negSum.lo}`, "清醒 0"]),
          ]);
        },
      },
      {
        id: "pyin",
        title: "兩張表：高度、恐龍隻數",
        teach: `<p>高度表每一格先放 D。恐龍表先放 0，讀到一隻就在那格加 1。</p>
          <pre class="eq">height = [[D] * C for _ in range(R)]
dino = [[0] * C for _ in range(R)]</pre>
          <p>裡面那層 <code>* C</code> 可以，數字複製沒關係。外面不要寫成 <code>* R</code>，否則每一行是同一條清單，改一格會整排一起變。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: CODE.slice(0, 3), hi: 0, stdin: STDIN, stdinAt: 0, vars: { R: "", C: "", D: "" }, note: "等第一行。" },
            { lines: CODE.slice(0, 3), hi: 1, stdin: STDIN, stdinAt: 1, vars: { R: 1, C: 10, D: 5 }, glow: "D", visual: board(SAMPLE_H, fill(1, 10, 0), { label: "高度都填 5，龍還沒讀。" }), note: "十格都是 5。龍的表還是 0。" },
            { lines: CODE.slice(3, 7), hi: 3, stdin: STDIN, stdinAt: 7, vars: { "dino[0][1]": 2, "dino[0][4]": 2, "dino[0][5]": 1 }, glow: "dino[0][1]", visual: board(SAMPLE_H, SAMPLE_D), note: "(0,1) 和 (0,4) 各出現兩次，所以是 2。" },
          ]);
        },
      },
      {
        id: "pyhit",
        title: "第一圈只做記號，第二圈才改",
        teach: `<p><code>half = S // 2</code>。列號從 <code>b - half</code> 走到 <code>b + half</code>，行也一樣。出界的格子直接跳過。</p>
          <p>第一圈只問有沒有醒著的龍，先不要改高度。第二圈才分兩條路：有龍就把範圍裡的隻數清成 0；沒有才減 d。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: CODE.slice(10, 16), hi: 1, vars: { a: 0, b: 3, S: 3, half: 1, awake: false }, glow: "awake", visual: board(hit1.height, hit1.dino, { range: hit2.range, center: [0, 3] }), note: "第二次撞擊。先把記號設成沒有龍。" },
            { lines: CODE.slice(12, 16), hi: 3, vars: { awake: true }, glow: "awake", note: "掃到第 4 列，那裡有 2 隻。記號改成真。" },
            { lines: CODE.slice(16, 23), hi: 4, vars: { "dino[0][4]": 0 }, glow: "dino[0][4]", visual: board(hit2.height, hit2.dino, { range: hit2.range, dizzy: hit2.dizzy, center: [0, 3] }), note: "有龍，所以走清成 0 的那條。高度那行不跑。" },
            { lines: CODE.slice(16, 23), hi: 6, vars: { a: 0, b: 0, awake: false, "height[0][0]": 1 }, glow: "height[0][0]", visual: board(hit1.height, hit1.dino, { range: hit1.range, dig: true }), note: "第一次撞擊沒有龍，改走減 d。5−4=1。" },
          ]);
        },
      },
      {
        id: "pyans",
        title: "最高最低從第一格開始",
        teach: `<p>掃完所有撞擊，再走一次整張表。<code>hi</code> 和 <code>lo</code> 的起點是 <code>height[0][0]</code>，不是 0。恐龍隻數把每一格加進去，暈過的格子已經是 0。</p>
          <p>範例印出 <code>5 1 3</code>。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: CODE.slice(23, 26), hi: 0, vars: { hi: 1, lo: 1 }, glow: "hi", visual: board(hit2.height, hit2.dino), note: "第一格現在是 1。最高先放 1，才有機會被後面的 5 換掉；若放 0，負高度會錯。" },
            { lines: CODE.slice(26, 33), hi: 6, vars: { hi: 5, lo: 1, left: 3 }, glow: "left", note: "2+1=3。暈掉的那格加到的是 0。" },
            { lines: CODE.slice(33), hi: 0, vars: { 輸出: "5 1 3" }, glow: "輸出", note: "三個數同一行，中間空一格。" },
          ]);
        },
      },
      {
        id: "full",
        title: "把程式拼起來",
        teach: `<p>建兩張表，讀龍，然後每次撞擊先判斷、再修改。最後掃出最高、最低、還醒著的隻數。</p>`,
        draw(stage) {
          K().full(stage, CODE);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>正方形先整塊看完。有醒著的龍就不挖，並把塊裡的龍清成 0。沒有才每格減 d。</p>
          <p>範例走完是最高 5、最低 1、還剩 3 隻。第三個數是隻數，同一格兩隻算兩隻。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">5 1 3</span>`);
          canvas.innerHTML = board(hit2.height, hit2.dino, { label: "範例結果 5 1 3" }) +
            hud(["最高 5", "最低 1", "清醒 3"]);
        },
      },
      {
        id: "play",
        title: "自己砸一次",
        teach: `<p>這是範例一開始的那一排，只砸一次。第二次範例是中心第 3 列、邊長 3、深度 1，會被龍擋住。第一次是中心第 0 列、邊長 1、深度 4，會把高度挖成 1。</p>
          <p>邊長要是奇數。想清楚這件事就可以交卷：<strong>先確認正方形裡有沒有醒著的龍，再決定是清龍還是挖地。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試一次撞擊</span>`, { b: 3, S: 3, d: 1 }, (s) => {
            const fields = K().fieldRow(
              K().numField("b", "中心列", s.b) +
              K().numField("S", "邊長", s.S) +
              K().numField("d", "深度", s.d)
            );
            if (s.S % 2 === 0 || s.S < 1) {
              return fields + board(SAMPLE_H, SAMPLE_D) + note("邊長要是正的奇數，中心才會落在一格上。");
            }
            if (s.b < 0 || s.b > 9) {
              return fields + board(SAMPLE_H, SAMPLE_D) + note("這一排的中心列要在 0 到 9。行固定是 0。");
            }
            const hit = apply(SAMPLE_H, SAMPLE_D, 0, s.b, s.S, s.d);
            const sum = summarize(hit.height, hit.dino);
            const say = hit.awake ? "範圍裡有龍，這一次不挖" : `沒有醒著的龍，範圍裡每格減 ${s.d}`;
            return fields + board(hit.height, hit.dino, {
              range: hit.range,
              dig: !hit.awake,
              dizzy: hit.dizzy,
              center: [0, s.b],
              label: say,
            }) + hud([say, `最高 ${sum.hi}`, `最低 ${sum.lo}`, `清醒 ${sum.left}`]);
          });
        },
      },
    ],
  });
})();
