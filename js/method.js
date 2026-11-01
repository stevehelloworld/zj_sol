(function () {
  const P = () => window.PyTeach;
  const K = () => window.IfKit;

  function reg(spec) {
    window.Lessons = window.Lessons || {};
    window.Lessons[spec.id] = {
      id: spec.id,
      title: spec.title,
      problem: spec.problem,
      url: spec.url,
      linkLabel: spec.linkLabel,
      next: spec.next || null,
      nextLabel: spec.nextLabel || "",
      steps: spec.steps.map((s) => ({ id: s.id, title: s.title, teach: s.teach })),
      mount(stage, i, runtime) {
        spec.steps[i].draw(stage, runtime);
      },
    };
  }

  function ladder(on) {
    const steps = [
      ["圈三樣", "給什麼、要什麼、規則"],
      ["一句話", "規則用自己的話講完"],
      ["對範例", "用手算，對上輸出"],
      ["寫程式", "一句話對到一行 Python"],
    ];
    return `<ol class="ladder">${steps.map((s, i) => {
      const cls = i === on ? "is-on" : i < on ? "is-done" : "";
      return `<li class="${cls}"><small>${i + 1}</small><b>${s[0]}</b><span>${s[1]}</span></li>`;
    }).join("")}</ol>`;
  }

  function marks(items) {
    return `<div class="marks">${items.map((it) =>
      `<div class="mark-card${it.on ? " is-on" : ""}"><small>${P().esc(it.k)}</small><b>${P().esc(it.v)}</b></div>`
    ).join("")}</div>`;
  }

  function xlates(rows, hi) {
    return `<div class="xlates" role="table" aria-label="中文對 Python">${rows.map((r, i) =>
      `<div class="xlate${i === hi ? " is-on" : ""}" role="row"><p>${P().esc(r.zh)}</p><code>${P().esc(r.py)}</code></div>`
    ).join("")}</div>`;
  }

  function moneyOf(n) {
    const dozen = Math.floor(n / 12);
    const rest = n % 12;
    return { dozen, rest, pay: dozen * 50 + rest * 5 };
  }

  function moneyCards(n) {
    const m = moneyOf(n);
    return `<div class="pencil-sum" role="group" aria-label="${n} 枝要 ${m.pay} 元">
      <div><small>打數　n // 12</small><b>${m.dozen}</b><span>${m.dozen} × 50 = ${m.dozen * 50} 元</span></div>
      <div><small>剩下　n % 12</small><b>${m.rest}</b><span>${m.rest} × 5 = ${m.rest * 5} 元</span></div>
      <div class="is-on"><small>一共</small><b>${m.pay}</b><span>元</span></div>
    </div>`;
  }

  function pencilStage(stage) {
    const canvas = K().toolbar(stage, `<span class="chip">買鉛筆</span>`);
    const presets = [42, 12, 13, 1];
    let n = 42;
    function paint() {
      const m = moneyOf(n);
      canvas.innerHTML = `<div class="presets">${presets.map((v) =>
        `<button type="button" class="ghost" data-n="${v}" aria-pressed="${v === n ? "true" : "false"}">${v} 枝</button>`
      ).join("")}</div>
        ${moneyCards(n)}
        ${P().remainderDots(n, 12)}
        <p class="py-note">${n} 枝：${m.dozen} 打又 ${m.rest} 枝，${m.pay} 元。範例 42 枝是 180 元。</p>`;
      canvas.querySelectorAll("[data-n]").forEach((btn) => {
        btn.onclick = () => {
          n = +btn.dataset.n;
          paint();
        };
      });
    }
    paint();
  }

  const PENCIL = [
    "n = int(input())",
    "dozen = n // 12",
    "rest = n % 12",
    "print(dozen * 50 + rest * 5)",
  ];

  function groupOf(n) {
    return Math.floor((n - 1) / 3) + 1;
  }

  function seats(ask) {
    const shown = !ask || ask <= 6 ? 6 : 9;
    const g = ask ? groupOf(ask) : 0;
    const label = ask ? `座號 ${ask} 在第 ${g} 組` : "1 到 6 號，每 3 人一組";
    let html = `<div class="seats" role="img" aria-label="${label}">`;
    for (let i = 1; i <= shown; i++) {
      const gi = groupOf(i);
      html += `<div class="seat is-g${gi}${i === ask ? " is-ask" : ""}"><small>第 ${gi} 組</small><b>${i}</b></div>`;
    }
    html += `</div>`;
    return html;
  }

  function cmp(n) {
    const wrong = Math.floor(n / 3);
    const right = groupOf(n);
    const same = wrong === right;
    return `<div class="cmp">
      <div><small>n // 3</small><b>${wrong}</b><span>${same ? "這一個數字碰巧相同" : "跟座位圖不同"}</span></div>
      <div class="is-on"><small>(n − 1) // 3 + 1</small><b>${right}</b><span>座位圖上的組別</span></div>
    </div>`;
  }

  function groupStage(stage) {
    const canvas = K().toolbar(stage, `<span class="chip">分組報告</span>`);
    const presets = [3, 4, 6, 7];
    let n = 4;
    function paint() {
      canvas.innerHTML = `<div class="presets">${presets.map((v) =>
        `<button type="button" class="ghost" data-n="${v}" aria-pressed="${v === n ? "true" : "false"}">${v} 號</button>`
      ).join("")}</div>
        ${seats(n)}
        ${cmp(n)}
        <p class="py-note">亮框是現在這個座號。範例座號 3 是第 1 組。</p>`;
      canvas.querySelectorAll("[data-n]").forEach((btn) => {
        btn.onclick = () => {
          n = +btn.dataset.n;
          paint();
        };
      });
    }
    paint();
  }

  const PHRASES = [
    {
      title: "讀進來",
      rows: [
        { zh: "輸入一個整數 n", py: "n = int(input())" },
        { zh: "同一行兩個整數 a、b", py: "a, b = map(int, input().split())" },
        { zh: "後面還有 n 行", py: "for _ in range(n):" },
      ],
    },
    {
      title: "如果",
      rows: [
        { zh: "成立就印 A，否則印 B", py: "print(\"A\" if ok else \"B\")" },
        { zh: "正、負、零三條路", py: "if / elif / else" },
        { zh: "兩個條件都要", py: "if a and b:" },
      ],
    },
    {
      title: "重複",
      rows: [
        { zh: "做 n 次", py: "for _ in range(n):" },
        { zh: "從 1 數到 n，含 n", py: "for i in range(1, n + 1):" },
        { zh: "每一個數字都看過", py: "for x in nums:" },
      ],
    },
    {
      title: "算出去",
      rows: [
        { zh: "能裝幾整袋", py: "n // d" },
        { zh: "袋子外面剩幾顆", py: "n % d" },
        { zh: "從 1 開始，每 k 個一組", py: "(n - 1) // k + 1" },
      ],
    },
  ];

  reg({
    id: "how",
    title: "翻譯的四步",
    problem: "第一課",
    url: "https://zerojudge.tw/ShowProblem?problemid=d827",
    linkLabel: "範例 d827",
    next: "how2",
    nextLabel: "下一課：自己翻",
    steps: [
      {
        id: "ladder",
        title: "先講完，再寫程式",
        teach: `<p>題目是中文。Python 是你把想通的那句話寫下來。這一課用「買鉛筆」走完四步，之後每一題都用同一張梯子。</p>
          <ol>
            <li>圈出三樣：題目給什麼、要你交什麼、規則是什麼。</li>
            <li>把規則收成一句自己的話。</li>
            <li>拿範例用手算，對上輸出。</li>
            <li>一句話對到一行 Python。</li>
          </ol>
          <div class="note"><strong>這一課的順序</strong>輸入、算式、程式都排在規則講完之後。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">四步</span>`);
          canvas.innerHTML = ladder(0);
        },
      },
      {
        id: "marks",
        title: "圈出三樣",
        teach: `<p>買鉛筆：要 n 枝。一打 12 枝賣 50 元，不滿一打的每枝 5 元。問最少要付多少錢。</p>
          <p>先在題目上圈這三樣，再往下看。範例是 42 枝，輸出 180。</p>
          <div class="note"><strong>圈完才算開始</strong>三樣都講得清，再打開編輯器。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">d827 買鉛筆</span>`);
          canvas.innerHTML = marks([
            { k: "給什麼", v: "一個整數 n，要買幾枝", on: true },
            { k: "要什麼", v: "最少要付多少錢", on: true },
            { k: "規則", v: "一打 12 枝 50 元，單枝 5 元", on: true },
          ]);
        },
      },
      {
        id: "input",
        title: "輸入那一句怎麼讀",
        teach: `<p>「輸入一個整數」翻成兩件事：<code>input()</code> 讀一行文字，<code>int</code> 把它變成數字。</p>
          <pre class="eq">n = int(input())</pre>
          <p>42 這一行進來之後，n 就是數字 42。後面的加法、整除都靠它是數字。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">輸入</span>`);
          canvas.innerHTML = xlates([
            { zh: "輸入一個整數 n", py: "n = int(input())" },
            { zh: "範例那一行", py: "42" },
            { zh: "讀完之後", py: "n = 42" },
          ], 0) + `<p class="py-note">左邊是題目的話，右邊是程式。先對這一對。</p>`;
        },
      },
      {
        id: "sentence",
        title: "規則收成一句話",
        teach: `<p>規則有兩種價錢。先把能湊成一打的湊走，剩下的才用單價。</p>
          <p>一句話就夠：<strong>先盡量買打，剩下的單枝再買。</strong></p>
          <p>這句話裡有兩個數量：打數，和剩下的枝數。兩個數量出來了，錢才算得出來。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = `<p class="idea-line">先盡量買打，剩下的單枝再買。</p>` + ladder(1);
        },
      },
      {
        id: "math",
        title: "一句話對成兩行算式",
        teach: `<p>「盡量買打」是整除：<code>n // 12</code>。一打 50 元。</p>
          <p>「剩下的單枝」是餘數：<code>n % 12</code>。一枝 5 元。</p>
          <pre class="eq">打數 = n // 12
剩下 = n % 12
錢 = 打數 × 50 + 剩下 × 5</pre>
          <p>名字用打數、剩下、錢。名字就是剛剛那句話裡的詞。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">算式</span>`);
          canvas.innerHTML = xlates([
            { zh: "先盡量買打", py: "dozen = n // 12" },
            { zh: "剩下的單枝再買", py: "rest = n % 12" },
            { zh: "兩種價錢加起來", py: "dozen * 50 + rest * 5" },
          ], 0);
        },
      },
      {
        id: "sample",
        title: "用手走範例",
        teach: `<p>42 枝：42 ÷ 12 = 3 打又 6 枝。3×50 + 6×5 = 150 + 30 = 180。跟範例輸出一樣。</p>
          <p>再按三個邊界。12 枝剛好一打，剩下 0，付 50。13 枝是 55。1 枝沒有打，付 5。</p>
          <div class="note"><strong>範例過了再試邊界</strong>剛好整除、多一枝、只買一枝。三個都跟你的句子一致，才寫程式。</div>`,
        draw: pencilStage,
      },
      {
        id: "walk",
        title: "一句話寫成 Python",
        teach: `<p>按「下一步程式」。黃色那行是現在寫下來的那半句。</p>
          <p>右邊的 42 是評測機送來的。讀到 <code>input()</code>，n 變成 42，打數 3、剩下 6、錢 180。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            {
              lines: PENCIL, hi: 0, stdin: ["42"], stdinAt: 0,
              vars: { n: 42 }, glow: "n",
              note: "一個整數。input 讀文字，int 變成數字。",
            },
            {
              lines: PENCIL, hi: 1, stdin: ["42"], stdinAt: 0,
              vars: { n: 42, 打數: 3 }, glow: "打數",
              note: "先盡量買打。42 // 12 = 3。",
            },
            {
              lines: PENCIL, hi: 2, stdin: ["42"], stdinAt: 0,
              vars: { n: 42, 打數: 3, 剩下: 6 }, glow: "剩下",
              note: "剩下的單枝。42 % 12 = 6。",
            },
            {
              lines: PENCIL, hi: 3, stdin: ["42"], stdinAt: 0,
              vars: { n: 42, 打數: 3, 剩下: 6, 錢: 180 }, glow: "錢",
              note: "3×50 + 6×5 = 180。跟範例一樣。",
            },
          ]);
        },
      },
      {
        id: "code",
        title: "完整程式",
        teach: `<p>這四行可以交。目錄裡的 d827 把後三行收成一行，算的是同一件事：</p>
          <pre class="eq">print((n // 12) * 50 + (n % 12) * 5)</pre>
          <p>課堂上先留著打數和剩下。你指得出每一行在說哪半句，再把它收短。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">完整程式</span><div class="grow"></div><button class="accent" id="copy" type="button">複製程式</button>`);
          canvas.innerHTML = P().codeBlock(PENCIL, -1) +
            `<p class="py-note">42 印出 180。12 印出 50。13 印出 55。1 印出 5。</p>`;
          P().copyBtn(stage, PENCIL.join("\n") + "\n");
        },
      },
      {
        id: "sheet",
        title: "常用句對照",
        teach: `<p>換題的時候，先在這張表找題目那句話，再寫右邊。表上沒有的句子，就用自己的話補一行，再對範例。</p>
          <p>按「下一種句子」看讀進來、如果、重複、算出去。</p>
          <div class="note"><strong>表是草稿，不是答案</strong>每一行都還要拿這題的範例算過。</div>`,
        draw(stage, runtime) {
          K().walk(stage, runtime, PHRASES.map((f) =>
            `<p class="idea-line">${f.title}</p>${xlates(f.rows, -1)}`
          ), "下一種句子");
        },
      },
      {
        id: "check",
        title: "交卷前對三件事",
        teach: `<p>程式寫完，交之前停一下。</p>
          <ol>
            <li>範例輸出跟題目一樣，不多一個空格、不多一行說明。</li>
            <li>邊界再用手算一次：剛好整除、最小的那個數。</li>
            <li>題目有很多筆時，每一筆都有自己的一行輸出。</li>
          </ol>
          <p>下一課換「分組報告」。題目沒有把算式寫出來，要你自己把句子變成 <code>(n - 1) // 3 + 1</code>。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">交卷前</span>`);
          canvas.innerHTML = `<div class="checks">
            <div class="check"><b>1</b><span>範例輸出一字不差。42 枝印 180，前後沒有別的字。</span></div>
            <div class="check"><b>2</b><span>12、13、1 三個邊界，錢跟句子一致。</span></div>
            <div class="check"><b>3</b><span>多筆輸入時，每一筆各印一行。</span></div>
          </div>` + ladder(3);
        },
      },
    ],
  });

  const GROUP = [
    "n = int(input())",
    "group = (n - 1) // 3 + 1",
    "print(group)",
  ];

  reg({
    id: "how2",
    title: "自己翻一題",
    problem: "第二課",
    url: "https://zerojudge.tw/ShowProblem?problemid=d073",
    linkLabel: "練習 d073",
    next: "h081",
    nextLabel: "下一課：程式交易",
    steps: [
      {
        id: "same",
        title: "還是這四步",
        teach: `<p>分組報告：輸入座號 n，每 3 人一組，輸出他是第幾組。1、2、3 號是第 1 組，4、5、6 號是第 2 組。</p>
          <p>題目沒有給公式。還是先圈、再講一句話、再對範例、最後才寫 Python。範例座號 3，輸出 1。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">d073</span>`);
          canvas.innerHTML = ladder(-1);
        },
      },
      {
        id: "marks",
        title: "圈出三樣",
        teach: `<p>這三樣圈完，你就知道程式大概長什麼樣：讀一個整數，算一個組別，印出那個組別。</p>
          <p>規則這格要留著。等一下的句子從這裡長出來。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">三樣</span>`);
          canvas.innerHTML = marks([
            { k: "給什麼", v: "一個座號 n", on: true },
            { k: "要什麼", v: "他是第幾組", on: true },
            { k: "規則", v: "每 3 人一組，1 號開始", on: true },
          ]);
        },
      },
      {
        id: "sentence",
        title: "收成一句話",
        teach: `<p>座號從 1 開始，組別也從 1 開始。直接拿 n 除以 3，1 號會變成 0 組。</p>
          <p>先把座號往左挪一格，讓 1 號變成 0。0、1、2 是第 1 組，3、4、5 是第 2 組。分完再把組別加回 1。</p>
          <div class="note"><strong>一句話</strong>先減 1，每 3 個人一組，再加回 1。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">一句話</span>`);
          canvas.innerHTML = `<p class="idea-line">先減 1，每 3 個人一組，再加回 1。</p>${seats(0)}`;
        },
      },
      {
        id: "three",
        title: "第 3 號，兩種算法相同",
        teach: `<p>範例是座號 3。兩種算法都得到 1。</p>
          <pre class="eq">3 // 3 = 1
(3 - 1) // 3 + 1 = 1</pre>
          <p>只拿範例對，會以為 <code>n // 3</code> 就是答案。範例太乖的時候，要再拿下一個邊界。</p>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">座號 3</span>`);
          canvas.innerHTML = seats(3) + cmp(3);
        },
      },
      {
        id: "four",
        title: "第 4 號對座位圖",
        teach: `<p>第 4 號跟 1、2、3 號不同組。座位圖上他是第 2 組。</p>
          <pre class="eq">4 // 3 = 1
(4 - 1) // 3 + 1 = 2</pre>
          <p><code>n // 3</code> 還停在第 1 組。句子「先減 1，每 3 個人一組，再加回 1」得到 2，跟座位圖一樣。</p>
          <div class="note"><strong>以圖為準</strong>算式跟座位圖不一致，就改算式。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">座號 4</span>`);
          canvas.innerHTML = seats(4) + cmp(4);
        },
      },
      {
        id: "walk",
        title: "寫成 Python",
        teach: `<p>輸入還是一個整數。中間那行就是剛剛的句子。<code>//</code> 先做，再加 1。</p>
          <pre class="eq">group = (n - 1) // 3 + 1</pre>
          <p>括號一定要留著。<code>//</code> 比減號先做，所以 <code>n - 1 // 3 + 1</code> 會先算 <code>1 // 3</code>，結果是 0。座號 4 會變成 4 − 0 + 1 = 5。寫成 <code>(n - 1) // 3 + 1</code>，才是先減 1 再分組，座號 4 得到 2。</p>`,
        draw(stage, runtime) {
          K().py(stage, runtime, [
            {
              lines: GROUP, hi: 0, stdin: ["4"], stdinAt: 0,
              vars: { n: 4 }, glow: "n",
              note: "座號是一個整數。",
            },
            {
              lines: GROUP, hi: 1, stdin: ["4"], stdinAt: 0,
              vars: { n: 4, 組別: 2 }, glow: "組別",
              note: "先減 1 得 3，3 // 3 得 1，加回 1 得 2。",
            },
            {
              lines: GROUP, hi: 2, stdin: ["4"], stdinAt: 0,
              vars: { n: 4, 組別: 2 }, glow: "組別",
              note: "印出組別。座號 3 會印 1，座號 4 會印 2。",
            },
          ]);
        },
      },
      {
        id: "try",
        title: "換座號再算一次",
        teach: `<p>按 3、4、6、7。6 號是第 2 組的最後一個，7 號開第 3 組。</p>
          <p>6 的時候兩種算法又相同，7 再次分開。所以交之前至少要有一個「剛好換組」的數。</p>
          <pre class="eq">n = int(input())
print((n - 1) // 3 + 1)</pre>`,
        draw: groupStage,
      },
      {
        id: "after",
        title: "之後每題都這樣",
        teach: `<p>打開目錄裡任何一題，頁面都是這幾步：這題在問什麼、輸入長什麼樣子、關鍵想法、對到 Python、完整程式。</p>
          <p>你的工作是把「關鍵想法」講成一句話，並且指著範例說出那個數字怎麼來的。程式只是把那句話抄進去。</p>
          <div class="note"><strong>卡關時回到梯子</strong>先問三樣圈完了沒有。再問那句話能不能用手把範例算出來。算出來了，才看 Python 怎麼寫。</div>`,
        draw(stage) {
          const canvas = K().toolbar(stage, `<span class="chip">每題</span>`);
          canvas.innerHTML = ladder(3) + `<div class="checks">
            <div class="check"><b>1</b><span>圈出給什麼、要什麼、規則。</span></div>
            <div class="check"><b>2</b><span>規則用一句話講完，句子裡的詞就是變數名字。</span></div>
            <div class="check"><b>3</b><span>範例用手算過，再找一個會換答案的邊界。</span></div>
            <div class="check"><b>4</b><span>一行 Python 對半句話。對完再交。</span></div>
          </div>`;
        },
      },
    ],
  });
})();
