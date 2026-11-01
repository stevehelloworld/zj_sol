(function () {
  const P = () => window.PyTeach;

  function plate(p, extra) {
    const tags = (p.tags || []).map((t) => `<span class="chip">${P().esc(t)}</span>`).join("");
    return `<div class="plate">
      <div class="plate-id">${P().esc(p.id)}</div>
      <div class="plate-body">
        <p class="plate-kicker">${P().esc(window.Catalog.unitName[p.unit] || "題本")}</p>
        <h3>${P().esc(p.title)}</h3>
        <p>${P().esc(p.blurb || p.ask || "")}</p>
        <div class="plate-tags">${tags}</div>
        ${extra || ""}
      </div>
    </div>`;
  }

  function ioVisual(p) {
    const inn = p.sampleIn ? p.sampleIn.split("\n") : [];
    const outs = p.sampleOut ? p.sampleOut.split("\n") : ["（打開原題看範例）"];
    const outHtml = outs.map((line) =>
      `<div class="stdin-ln"><span class="ln-no">→</span><code>${P().esc(line)}</code></div>`
    ).join("");
    return `<div class="io-boards">
      ${inn.length ? P().stdinBlock(inn, null) : `<div class="stdin"><div class="stdin-label">範例輸入</div><div class="stdin-ln"><span class="ln-no">·</span><code>打開原題看樣例</code></div></div>`}
      <div class="stdin out">
        <div class="stdin-label">範例輸出</div>
        ${outHtml}
      </div>
    </div>`;
  }

  function ideaVisual(p) {
    const idea = P().esc(p.idea || "先把規則講成一句人話，再對到一行 Python。");
    let extra = "";
    const tags = p.tags || [];
    if (tags.includes("餘數") && p.sampleIn) {
      const nums = p.sampleIn.split(/\s+/).map(Number).filter((n) => !Number.isNaN(n) && n > 0);
      if (nums.length >= 2) extra = P().remainderDots(nums[0], nums[1] || 24);
      else if (p.id === "d050") extra = P().remainderDots(9 + 15, 24);
      else if (p.id === "q181") extra = P().remainderDots(14, 20);
    }
    return `<div class="idea-stage">
      <p class="idea-line">${idea}</p>
      ${extra}
    </div>`;
  }

  function autoFrames(p) {
    const lines = p.python || [];
    const stdin = p.sampleIn ? p.sampleIn.split("\n") : [];
    if (!lines.length) {
      return [{
        lines: ["# 先把規則講成一句話", "# 再對範例，最後才寫程式"],
        hi: 0,
        stdin,
        note: "先看題意。規則清楚了，再寫下面這幾行。",
      }];
    }
    const frames = lines.map((ln, i) => {
      const isIn = /\binput\s*\(/.test(ln) || /\bsys\.stdin/.test(ln);
      return {
        lines,
        hi: i,
        stdin,
        stdinAt: isIn ? 0 : (i === 0 ? null : 0),
        note: i === 0 ? "左邊一行一行走。黃色那行是現在講的。" : "",
      };
    });
    frames.push({
      lines,
      hi: -1,
      stdin,
      stdinAt: stdin.length ? stdin.length - 1 : null,
      vars: p.sampleOut ? { 範例輸出: p.sampleOut } : {},
      note: "跑完。把右邊輸出跟範例對一下。",
    });
    return frames;
  }

  function mountCode(stage, p, runtime, mode) {
    const lines = p.python || ["# 先對完範例再寫"];
    const code = lines.join("\n") + "\n";
    stage.innerHTML = `<div class="stage-toolbar">
        <strong>${mode === "walk" ? "程式怎麼走" : "完整程式"}</strong>
        <span class="chip" id="py-chip">Python</span>
        <div class="grow"></div>
        ${mode === "walk" ? `<button class="accent" type="button" id="play">下一步程式</button>` : `<button class="accent" type="button" id="copy">複製程式</button>`}
      </div>
      <div class="stage-canvas" id="py-mount"></div>`;
    const canvas = stage.querySelector("#py-mount");
    if (mode === "walk") {
      P().mountFrames(stage, canvas, autoFrames(p), runtime);
    } else {
      canvas.innerHTML = P().codeBlock(lines, -1) +
        (p.sampleOut ? `<p class="py-note">對完範例再交。輸出應為 <code>${P().esc(p.sampleOut)}</code></p>` : "");
      P().copyBtn(stage, code);
    }
  }

  function stepsOf(p) {
    return [
      {
        id: "story",
        title: "這題在問什麼",
        teach: `
          <p>${P().esc(p.ask || p.blurb || "")}</p>
          <p>先不要寫程式。用一句話講完規則：<strong>${P().esc(p.blurb || "")}</strong></p>
          ${(p.tags || []).length ? `<p>這題會用到：${p.tags.map((t) => "「" + P().esc(t) + "」").join("、")}。</p>` : ""}
        `,
      },
      {
        id: "io",
        title: "輸入長什麼樣子",
        teach: `
          <p>評測機把資料從標準輸入塞進來。我們用 <code>input()</code> 一次讀一行。</p>
          <p>下面左邊是範例輸入，右邊是這筆應該印出的答案。先用手算對一次。</p>
          ${p.sampleIn ? "" : "<p>這題還沒放範例，打開原題看官方樣例。</p>"}
        `,
      },
      {
        id: "idea",
        title: "關鍵想法",
        teach: `
          <p>${P().esc(p.idea || "把規則寫成一句人話，再對到一行 Python。")}</p>
          <div class="note"><strong>記住</strong>一次只盯一個轉折。想通了，程式只是把剛剛那句話寫下來。</div>
        `,
      },
      {
        id: "walk",
        title: "對應到 Python",
        teach: `
          <p>按「下一步程式」，一行一行看。黃色那行是現在講的。</p>
          <p>右邊放著範例輸入。讀到 <code>input()</code> 的時候，對一下它拿走哪一行。</p>
        `,
      },
      {
        id: "code",
        title: "完整程式",
        teach: `
          <p>可以複製交到 ZeroJudge。交之前用範例對一次輸出。</p>
          <p>輸出格式以 <a href="https://zerojudge.tw/ShowProblem?problemid=${encodeURIComponent(p.id)}" rel="noopener" target="_blank">原題</a> 為準。</p>
        `,
      },
    ];
  }

  function from(p) {
    const steps = stepsOf(p);
    return {
      id: p.id,
      title: p.title,
      problem: p.id,
      url: "https://zerojudge.tw/ShowProblem?problemid=" + encodeURIComponent(p.id),
      generic: true,
      steps,
      mount(stage, step, runtime) {
        const id = steps[step].id;
        if (id === "walk") return mountCode(stage, p, runtime, "walk");
        if (id === "code") return mountCode(stage, p, runtime, "code");
        if (id === "io") {
          stage.innerHTML = `<div class="stage-canvas">${ioVisual(p)}</div>`;
          return;
        }
        if (id === "idea") {
          stage.innerHTML = `<div class="stage-canvas">${ideaVisual(p)}</div>`;
          return;
        }
        stage.innerHTML = `<div class="stage-canvas">${plate(p)}</div>`;
      },
    };
  }

  function stub(id) {
    const p = {
      id,
      title: id,
      unit: "io",
      tags: ["解題"],
      blurb: "先看題意，再對範例，最後才寫程式。",
      ask: `ZeroJudge ${id}。先用一句話講完規則，再對範例。`,
      idea: "先講規則，再對範例，最後才寫程式。不要一開始就對著原題逐字翻。",
      python: [
        "# 1. 用一句話講完規則",
        "# 2. 在紙上走完範例",
        "# 3. 再寫 input / 迴圈 / print",
        "s = input()",
        "print(s)",
      ],
    };
    const lesson = from(p);
    lesson.title = id;
    lesson.stub = true;
    return lesson;
  }

  window.GenericLesson = { from, stub };
})();
