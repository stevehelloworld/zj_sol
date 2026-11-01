(function () {
  const K = () => window.IfKit;

  function hud(parts) {
    return `<div class="hud">${parts.map((p) => `<span>${p}</span>`).join("")}</div>`;
  }

  function note(s) {
    return `<p class="py-note">${s}</p>`;
  }

  function rot180(B) {
    const R = B.length;
    const C = B[0].length;
    return B.map((_, i) => B[0].map((__, j) => B[R - 1 - i][C - 1 - j]));
  }

  function rot90(B) {
    const R = B.length;
    return B.map((_, i) => B[0].map((__, j) => B[R - 1 - j][i]));
  }

  function rot270(B) {
    const R = B.length;
    return B.map((_, i) => B[0].map((__, j) => B[j][R - 1 - i]));
  }

  function countSame(A, T) {
    let n = 0;
    A.forEach((row, i) => {
      row.forEach((v, j) => {
        if (v === T[i][j]) n += 1;
      });
    });
    return n;
  }

  function percent(same, cells) {
    return Math.floor((same * 100) / cells);
  }

  function photo(rows, same, label) {
    const body = rows.map((row, i) => {
      const cells = row.map((v, j) => {
        const on = same && same[i][j];
        return `<div class="shot-cell${on ? " is-same" : ""}"><b>${v}</b></div>`;
      }).join("");
      return `<div class="shot-row">${cells}</div>`;
    }).join("");
    return `<div class="shot" role="img" aria-label="${label}">${body}</div>`;
  }

  function pair(items) {
    return `<div class="pair">${items.map((it) => `<div><h3>${it.title}</h3>${photo(it.rows, it.same, it.label || it.title)}</div>`).join("")}</div>`;
  }

  function marks(A, T) {
    return A.map((row, i) => row.map((v, j) => v === T[i][j]));
  }

  const A = [
    [0, 1, 1, 1, 1],
    [0, 2, 2, 2, 2],
    [0, 3, 3, 3, 3],
    [0, 4, 4, 4, 4],
    [0, 5, 5, 5, 5],
    [0, 6, 6, 6, 6],
  ];
  const B = [
    [6, 6, 6, 6, 6],
    [5, 5, 5, 5, 5],
    [4, 4, 4, 4, 4],
    [7, 7, 7, 7, 0],
    [8, 8, 8, 8, 0],
    [9, 9, 9, 9, 0],
  ];
  const B180 = rot180(B);
  const same0 = countSame(A, B);
  const same180 = countSame(A, B180);
  if (same0 !== 0 || same180 !== 15 || percent(same180, 30) !== 50) {
    throw new Error("r489 範例應為 50%");
  }

  const SA = [[1, 2], [3, 4]];
  const SB = [[2, 4], [1, 3]];
  const SB90 = rot90(SB);
  if (countSame(SA, SB) !== 0 || countSame(SA, SB90) !== 4 || countSame(SA, rot180(SB)) !== 0 || countSame(SA, rot270(SB)) !== 0) {
    throw new Error("r489 正方形小圖應只有順時針 90 度全對");
  }

  const CODE = [
    "R, C = map(int, input().split())",
    "A = [list(map(int, input().split())) for _ in range(R)]",
    "B = [list(map(int, input().split())) for _ in range(R)]",
    "s0 = s180 = s90 = s270 = 0",
    "for i in range(R):",
    "    for j in range(C):",
    "        if A[i][j] == B[i][j]:",
    "            s0 += 1",
    "        if A[i][j] == B[R - 1 - i][C - 1 - j]:",
    "            s180 += 1",
    "        if R == C:",
    "            if A[i][j] == B[R - 1 - j][i]:",
    "                s90 += 1",
    "            if A[i][j] == B[j][R - 1 - i]:",
    "                s270 += 1",
    "best = max(s0, s180, s90, s270)",
    "print(f\"{best * 100 // (R * C)}%\")",
  ];

  const SMALL_IN = ["2 2", "1 2", "3 4", "2 4", "1 3"];

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
    id: "r489",
    title: "航空拍照圖",
    steps: [
      {
        id: "story",
        title: "轉到最像的那個角度",
        teach: `<p>兩張灰階照片一樣大，都是 R 行 C 列。可以轉 0°、90°、180°、270°，看哪一種對得上的格子最多。</p>
          <p>同一位置數字相同，那一格才算對上。相似度是對上的格數占總格數的百分比，無條件捨去，最後印出最高的那一個，後面加上 %。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">挑最像的角度</span>`);
          canvas.innerHTML = pair([
            { title: "照片 A", rows: A, label: "照片 A，6 行 5 列" },
            { title: "照片 B", rows: B, label: "照片 B，6 行 5 列" },
          ]) + note("範例是 6×5。左邊第一直行都是 0，右邊第一直行是 6、5、4、7、8、9。");
        },
      },
      {
        id: "floor",
        title: "百分比要無條件捨去",
        teach: `<p>公式是 <code>對上的格數 × 100 // 總格數</code>。<code>//</code> 是整數除法，小數直接丟掉，不四捨五入。</p>
          <p>下面三格對上兩格：<code>2 × 100 // 3 = 66</code>。若寫成四捨五入，會變成 67，就錯了。印出來是 <code>66%</code>，百分號貼在數字後面。</p>`,
        draw(stage) {
          const rowsA = [[8, 8, 1]];
          const rowsB = [[8, 8, 9]];
          const canvas = K().toolbar(stage, `<span class="chip">66%</span>`);
          canvas.innerHTML = pair([
            { title: "A", rows: rowsA, same: [[true, true, false]], label: "8 8 1，前兩格對上" },
            { title: "B", rows: rowsB, same: [[true, true, false]], label: "8 8 9，第三格不同" },
          ]) + hud(["對上 2 格", "共 3 格", "2×100 // 3 = 66%"]);
        },
      },
      {
        id: "turn",
        title: "讓 A 不動，只轉 B",
        teach: `<p>兩張都轉，差的角度跟只轉其中一張一樣。所以 A 固定，B 轉四種，取對上最多的那一種。</p>
          <p>180° 最好想：上下對調，再左右對調。新照片的 (i, j)，就是舊照片的 (R−1−i, C−1−j)。</p>
          <p>順時針 90° 和 270° 會把形狀從 R×C 轉成 C×R。不是正方形時，轉完對不齊，那兩種相似度就是 0，不要去拿超出邊界的格子。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">只轉 B</span>`);
          const corner = B[5][4];
          canvas.innerHTML = pair([
            { title: "B 原樣", rows: B, label: "B 的右下角是 0" },
            { title: "B 轉 180°", rows: B180, label: "轉半圈後，右下角的 0 跑到左上角" },
          ]) + note(`右下角是 ${corner}。轉半圈之後，它出現在左上角。`);
        },
      },
      {
        id: "sample",
        title: "範例轉半圈，對上 15 格",
        teach: `<p>不轉的時候，A 和 B 一格都沒有相同。轉 180° 之後，對上 15 格。總格數 6×5 = 30。</p>
          <p><code>15 × 100 // 30 = 50</code>。輸出 <strong>50%</strong>。</p>
          <p>金色是數字相同的格子。上面三列只對到最左邊的 0；下面三列對到右邊四格，最左邊那格 A 是 0、轉完的 B 是 4、5、6。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            pair([
              { title: "A", rows: A, same: marks(A, B), label: "不轉，沒有相同的格子" },
              { title: "B 不轉", rows: B, same: marks(A, B), label: "不轉的 B" },
            ]) + hud(["不轉 0 格", "0%"]),
            pair([
              { title: "A", rows: A, same: marks(A, B180), label: "A 與轉半圈的 B，金色是對上的 15 格" },
              { title: "B 轉 180°", rows: B180, same: marks(A, B180), label: "轉半圈的 B" },
            ]) + hud(["180° 對上 15 格", "15×100 // 30 = 50%"]),
          ]);
        },
      },
      {
        id: "wide",
        title: "6×5 轉 90 度對不齊",
        teach: `<p>範例有 6 行 5 列。順時針轉 90° 會變成 5 行 6 列，沒辦法跟另一張 6×5 一格一格對。</p>
          <p>所以這一題的 90° 和 270° 相似度是 0，根本不用算。60 分的測資是只有 1 行，同樣不是正方形，也只要比不轉和轉半圈。</p>
          <p>程式裡要先問 <code>R == C</code>，成立才去讀轉 90° 的那一格。順序反過來，列號會超出 B 的寬度。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">不是正方形</span>`);
          canvas.innerHTML = hud(["不轉：6×5 可比較", "180°：6×5 可比較", "90°：變成 5×6", "270°：變成 5×6"]) +
            note("對不齊的角度，相似度假設成 0。範例的最高仍是轉半圈的 50%。");
        },
      },
      {
        id: "square",
        title: "正方形才要看 90 度和 270 度",
        teach: `<p>下面兩張都是 2×2。不轉、轉半圈、順時針 270° 都是 0 格。順時針轉 90° 之後，B 變得跟 A 一模一樣，4 格全對，相似度 100%。</p>
          <p>轉完之後，位置 (i, j) 的數字來自原來的 <code>B[R - 1 - j][i]</code>。例如新的左上角是 1，它來自舊 B 的左下角 <code>B[1][0]</code>。</p>
          <p>四種都算完，取最大的格數再換算百分比。這一組要印 <code>100%</code>，不能停在不轉的 0%。</p>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, [
            pair([
              { title: "A", rows: SA, label: "A 是 1 2 / 3 4" },
              { title: "B 原樣", rows: SB, same: marks(SA, SB), label: "B 原樣跟 A 沒有一格相同" },
            ]) + hud(["不轉 0 格"]),
            pair([
              { title: "A", rows: SA, same: marks(SA, SB90), label: "A 與順時針 90 度的 B 四格全同" },
              { title: "B 順時針 90°", rows: SB90, same: marks(SA, SB90), label: "轉 90 度後就是 1 2 / 3 4" },
            ]) + hud(["90° 對上 4 格", "4×100 // 4 = 100%"]),
          ]);
        },
      },
      {
        id: "pyin",
        title: "讀進兩張表",
        teach: `<p>第一行是 R 和 C。後面 R 行是照片 A，再 R 行是照片 B。每一行有 C 個整數。</p>
          <p>這裡用 2×2 小圖，行數少，看得到每一行被吃掉。範例那張 6×5 讀法相同，算出來是 50%。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: CODE.slice(0, 3), hi: 0, stdin: SMALL_IN, stdinAt: 0, vars: { R: "", C: "" }, note: "等第一行。" },
            { lines: CODE.slice(0, 3), hi: 0, stdin: SMALL_IN, stdinAt: 1, vars: { R: 2, C: 2 }, glow: "C", note: "正方形。90 度轉完還是 2×2，可以比。" },
            { lines: CODE.slice(0, 3), hi: 1, stdin: SMALL_IN, stdinAt: 3, vars: { A: "[[1, 2], [3, 4]]" }, glow: "A", visual: photo(SA, null, "照片 A"), note: "吃掉兩行，A 讀完。" },
            { lines: CODE.slice(0, 3), hi: 2, stdin: SMALL_IN, stdinAt: 5, vars: { B: "[[2, 4], [1, 3]]" }, glow: "B", visual: photo(SB, null, "照片 B"), note: "再吃兩行，B 讀完。" },
          ]);
        },
      },
      {
        id: "pycmp",
        title: "四個計數器一起加",
        teach: `<p>同一圈雙重迴圈裡，可以同時問四種轉法。不轉看 <code>B[i][j]</code>。轉半圈看 <code>B[R - 1 - i][C - 1 - j]</code>。</p>
          <p>90° 和 270° 包在 <code>if R == C</code> 裡面。小圖是正方形，順時針 90° 加到 4。範例是 6×5，這層不進去，兩個計數器維持 0，最高來自轉半圈的 15。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: CODE.slice(3, 15), hi: 9, vars: { s0: 0, s180: 0, s90: 4, s270: 0 }, glow: "s90", visual: photo(SB90, marks(SA, SB90), "轉 90 度後四格都相同"), note: "2×2 這組。四格都在順時針 90 度對上。" },
            { lines: CODE.slice(6, 15), hi: 4, vars: { R: 6, C: 5, s0: 0, s180: 15, s90: 0, s270: 0 }, glow: "s180", note: "範例不是正方形。90 度那兩行不執行，15 來自轉半圈。" },
          ]);
        },
      },
      {
        id: "pyprint",
        title: "取最大，再整數除法",
        teach: `<p><code>best = max(s0, s180, s90, s270)</code>。不是正方形時，後面兩個是 0，不會贏過真正比過的角度。</p>
          <pre class="eq">print(f"{best * 100 // (R * C)}%")</pre>
          <p>先乘 100 再整除，小數才會被丟掉。範例 15×100 // 30 得到 50，印出 <code>50%</code>。小圖 4×100 // 4 印出 <code>100%</code>。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            { lines: CODE.slice(15), hi: 0, vars: { s0: 0, s180: 15, s90: 0, s270: 0, best: 15 }, glow: "best", note: "範例四個數裡 15 最大。" },
            { lines: CODE.slice(16), hi: 0, vars: { best: 15, R: 6, C: 5, 輸出: "50%" }, glow: "輸出", note: "百分號貼在數字後面，中間沒有空格。" },
            { lines: CODE.slice(16), hi: 0, vars: { best: 4, R: 2, C: 2, 輸出: "100%" }, glow: "輸出", note: "正方形小圖印 100%。" },
          ]);
        },
      },
      {
        id: "full",
        title: "把程式拼起來",
        teach: `<p>讀兩張表，同一圈裡數四種轉法，不是正方形就跳過 90° 和 270°。最大格數換算成百分比再印出。</p>`,
        draw(stage) {
          K().full(stage, CODE);
        },
      },
      {
        id: "recap",
        title: "交卷前再看一次",
        teach: `<p>範例不轉是 0 格，轉半圈是 15 格，6×5 不能轉 90°。15×100 // 30 = 50，輸出 <strong>50%</strong>。</p>
          <p>正方形才要另外比順時針 90° 和 270°，四種裡取最高。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">50%</span>`);
          canvas.innerHTML = pair([
            { title: "A", rows: A, same: marks(A, B180), label: "範例對上 15 格" },
            { title: "B 轉 180°", rows: B180, same: marks(A, B180), label: "轉半圈的 B" },
          ]) + hud(["15 格", "30 格", "50%"]);
        },
      },
      {
        id: "play",
        title: "自己改 2×2",
        teach: `<p>四種轉法都會算，畫面畫出對上最多的那一種。金色是數字相同的格子。</p>
          <p>預設這組只有順時針 90° 全對。把 B 改成跟 A 一樣，不轉就會變成 100%。</p>
          <p>想清楚這件事就可以交卷：<strong>A 不動，B 轉四種；不是正方形就不要轉 90°；百分比用整數除法，再貼上 %。</strong></p>`,
        draw(stage) {
          K().live(stage, `<span class="chip">試旋轉</span>`, {
            a00: 1, a01: 2, a10: 3, a11: 4,
            b00: 2, b01: 4, b10: 1, b11: 3,
          }, (s) => {
            const fields = K().fieldRow(
              K().numField("a00", "A 左上", s.a00) +
              K().numField("a01", "A 右上", s.a01) +
              K().numField("a10", "A 左下", s.a10) +
              K().numField("a11", "A 右下", s.a11)
            ) + K().fieldRow(
              K().numField("b00", "B 左上", s.b00) +
              K().numField("b01", "B 右上", s.b01) +
              K().numField("b10", "B 左下", s.b10) +
              K().numField("b11", "B 右下", s.b11)
            );
            const AA = [[s.a00, s.a01], [s.a10, s.a11]];
            const BB = [[s.b00, s.b01], [s.b10, s.b11]];
            const options = [
              { name: "不轉", grid: BB },
              { name: "順時針 90°", grid: rot90(BB) },
              { name: "180°", grid: rot180(BB) },
              { name: "順時針 270°", grid: rot270(BB) },
            ];
            options.forEach((o) => { o.same = countSame(AA, o.grid); });
            let best = options[0];
            options.forEach((o) => { if (o.same > best.same) best = o; });
            const pct = percent(best.same, 4);
            const scores = options.map((o) => `${o.name} ${o.same}`).join("　");
            return fields + pair([
              { title: "A", rows: AA, same: marks(AA, best.grid), label: "照片 A" },
              { title: best.name, rows: best.grid, same: marks(AA, best.grid), label: best.name },
            ]) + hud([`最高 ${best.name}`, `${best.same} / 4`, `${pct}%`]) + note(scores);
          });
        },
      },
    ],
  });
})();
