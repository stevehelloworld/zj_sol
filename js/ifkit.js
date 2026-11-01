(function () {
  const esc = (s) => window.PyTeach.esc(s);

  function hero(id, alt, extra) {
    return `<div class="ap-hero">
      <img src="assets/${esc(id)}-hero.jpg" alt="${esc(alt)}" width="1200" height="900">
      <div class="ap-hero-side">${extra || ""}</div>
    </div>`;
  }

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

  function fork(opts) {
    const { q, yes, no, take } = opts;
    return `<div class="if-fork" role="img" aria-label="${esc(q)}">
      <p class="if-q">${esc(q)}</p>
      <div class="if-arms">
        <div class="if-arm is-yes${take === "yes" ? " is-on" : ""}">
          <small>成立</small>
          <b>${esc(yes)}</b>
        </div>
        <div class="if-arm is-no${take === "no" ? " is-on" : ""}">
          <small>不成立</small>
          <b>${esc(no)}</b>
        </div>
      </div>
    </div>`;
  }

  function tri(opts) {
    const { q, items, take } = opts;
    return `<div class="if-fork">
      <p class="if-q">${esc(q)}</p>
      <div class="if-arms if-tri">
        ${items.map((it, i) => `<div class="if-arm${take === i ? " is-on" : ""}"><small>${esc(it.k)}</small><b>${esc(it.v)}</b></div>`).join("")}
      </div>
    </div>`;
  }

  function gates(rows) {
    return `<div class="if-gates" role="list">
      ${rows.map((r) => `<div class="if-gate ${r.state || ""}" role="listitem">
        <code>${esc(r.cond)}</code>
        <span>${esc(r.say)}</span>
        <b>${esc(r.out)}</b>
      </div>`).join("")}
    </div>`;
  }

  function fortune(s) {
    const words = ["普通", "吉", "大吉"];
    return `<div class="if-fortune" role="img" aria-label="${words[s]}">
      ${words.map((w, i) => `<div class="if-token${i === s ? " is-on" : ""}">${esc(w)}</div>`).join("")}
    </div>`;
  }

  function week(n, wait) {
    const names = ["日", "一", "二", "三", "四", "五", "六"];
    const sat = 6;
    return `<div class="if-week" role="img" aria-label="星期${names[n]}">
      ${names.map((name, i) => {
        const cls = [
          "if-day",
          i === n ? "is-now" : "",
          i === sat ? "is-sat" : "",
          wait != null && ((i - n + 7) % 7) <= wait && i !== n ? "is-path" : "",
        ].filter(Boolean).join(" ");
        return `<div class="${cls}"><small>週</small>${name}</div>`;
      }).join("")}
    </div>`;
  }

  function clock(h, m, cut) {
    const now = h * 60 + m;
    const at = now < cut;
    return `<div class="if-clock">
      <div class="if-clock-face">
        <strong>${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}</strong>
        <span>放學 ${String(Math.floor(cut / 60)).padStart(2, "0")}:${String(cut % 60).padStart(2, "0")}</span>
      </div>
      <div class="if-clock-tag ${at ? "is-in" : "is-out"}">${at ? "還在學校" : "已經放學"}</div>
    </div>`;
  }

  function sgnLine(n) {
    const take = n > 0 ? 2 : n < 0 ? 0 : 1;
    return `<div class="if-sgn">
      <div class="if-sgn-rail"></div>
      <div class="if-sgn-zero"></div>
      <div class="if-sgn-dot" style="left:${n === 0 ? 50 : n < 0 ? 18 : 82}%"></div>
      <div class="if-arms if-tri">
        <div class="if-arm${take === 0 ? " is-on" : ""}"><small>n &lt; 0</small><b>−1</b></div>
        <div class="if-arm${take === 1 ? " is-on" : ""}"><small>n == 0</small><b>0</b></div>
        <div class="if-arm${take === 2 ? " is-on" : ""}"><small>n &gt; 0</small><b>1</b></div>
      </div>
    </div>`;
  }

  function bars(nums, hi) {
    const mx = Math.max(1, ...nums.map(Math.abs));
    return `<div class="if-bars">
      ${nums.map((n, i) => `<div class="if-bar${i === hi ? " is-on" : ""}">
        <div class="if-bar-fill" style="height:${24 + (Math.abs(n) / mx) * 110}px">${n}</div>
        <span>${i === 0 ? "a" : i === 1 ? "b" : "c"}</span>
      </div>`).join("")}
    </div>`;
  }

  function scale(w, limit) {
    const over = w > limit;
    return `<div class="if-scale">
      <div class="if-scale-read"><b>${w}</b><small>公斤</small></div>
      <div class="if-scale-line"><i style="width:${Math.min(100, (w / (limit + 20)) * 100)}%"></i></div>
      <p>${over ? `${w} &gt; ${limit}，減 1 變成 ${w - 1}` : `${w} 沒有大於 ${limit}，維持 ${w}`}</p>
    </div>`;
  }

  function avgTrack(scores, line) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const pass = avg > line;
    return `<div class="if-avg">
      <div class="if-avg-scores">${scores.map((s) => `<span>${s}</span>`).join("")}</div>
      <div class="if-avg-rail">
        <i class="if-avg-mark" style="left:${Math.min(96, (avg / 100) * 100)}%"></i>
        <em style="left:${line}%"></em>
      </div>
      <p>平均 ${avg.toFixed(1)}　${line} 分那條是及格線　→　<strong>${pass ? "no（過了）" : "yes（被當）"}</strong></p>
    </div>`;
  }

  function rps(a, b) {
    const name = { 0: "石頭", 2: "剪刀", 5: "布" };
    const win = { "0,2": 1, "2,5": 1, "5,0": 1 };
    const key = a + "," + b;
    let say = "平手";
    let who = 0;
    if (a !== b) {
      who = win[key] ? 1 : 2;
      say = who === 1 ? "左邊贏" : "右邊贏";
    }
    return `<div class="if-rps">
      <div class="if-token${who === 1 ? " is-on" : ""}">${esc(name[a] || a)}<small>${a}</small></div>
      <span>對</span>
      <div class="if-token${who === 2 ? " is-on" : ""}">${esc(name[b] || b)}<small>${b}</small></div>
      <strong>${esc(say)}</strong>
    </div>`;
  }

  function flip(n) {
    return `<div class="if-flip">
      <div class="if-token${n === 0 ? " is-on" : ""}">0</div>
      <span>⇄</span>
      <div class="if-token${n === 1 ? " is-on" : ""}">1</div>
    </div>`;
  }

  function py(stage, runtime, frames) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / ${frames.length}</span><div class="grow"></div><button class="accent" id="play" type="button">下一步程式</button>`);
    window.PyTeach.mountFrames(stage, canvas, frames, runtime);
  }

  function full(stage, lines) {
    const canvas = toolbar(stage, `<span class="chip">完整程式</span><div class="grow"></div><button class="accent" id="copy" type="button">複製程式</button>`);
    canvas.innerHTML = window.PyTeach.codeBlock(lines, -1);
    window.PyTeach.copyBtn(stage, lines.join("\n") + "\n");
  }

  function fieldRow(fields) {
    return `<div class="controls">${fields}</div>`;
  }

  function numField(key, label, value) {
    return `<label class="field"><span>${esc(label)}</span><input data-k="${esc(key)}" type="number" value="${value}"></label>`;
  }

  function live(stage, extras, init, render) {
    const canvas = toolbar(stage, extras);
    const state = Object.assign({}, init);
    function paint() {
      canvas.innerHTML = render(state);
      canvas.querySelectorAll("input[data-k]").forEach((el) => {
        el.oninput = () => {
          state[el.dataset.k] = +el.value;
          paint();
        };
      });
    }
    paint();
  }

  function walk(stage, runtime, frames, label) {
    const canvas = toolbar(stage, `<span class="chip" id="py-chip">1 / ${frames.length}</span><div class="grow"></div><button class="accent" id="play" type="button">${esc(label || "下一步")}</button>`);
    let i = 0;
    const btn = stage.querySelector("#play");
    const chip = stage.querySelector("#py-chip");
    function paint() {
      if (chip) chip.textContent = `${i + 1} / ${frames.length}`;
      if (btn) btn.textContent = i >= frames.length - 1 ? "從頭再看" : (label || "下一步");
      canvas.innerHTML = frames[i];
    }
    btn.onclick = () => {
      if (runtime.reduced) { i = frames.length - 1; paint(); return; }
      i = i >= frames.length - 1 ? 0 : i + 1;
      paint();
    };
    paint();
  }

  function digits(s, hi) {
    return `<div class="ap-digits" role="img" aria-label="${esc(s)}">
      ${String(s).split("").map((ch, i) => {
        const odd = i % 2 === 0;
        return `<div class="ap-d ${odd ? "is-odd" : "is-even"}${i === hi ? " is-on" : ""}"><small>${i + 1}${odd ? "奇" : "偶"}</small>${esc(ch)}</div>`;
      }).join("")}
    </div>`;
  }

  function scores(arr, opts) {
    const { line, hi, markLow, markHigh } = opts || {};
    return `<div class="ap-scores">
      ${arr.map((n, i) => {
        const fail = n < 60;
        const cls = [
          "ap-sc",
          fail ? "is-fail" : "is-ok",
          i === hi ? "is-on" : "",
          i === markLow ? "is-low" : "",
          i === markHigh ? "is-high" : "",
        ].filter(Boolean).join(" ");
        return `<div class="${cls}"><b>${n}</b><small>${fail ? "不及格" : "及格"}</small></div>`;
      }).join("")}
      ${line != null ? `<p class="py-note">60 分是及格線</p>` : ""}
    </div>`;
  }

  function triangle(a, b, c) {
    const [x, y, z] = [a, b, c].slice().sort((p, q) => p - q);
    let kind = "No";
    if (x + y > z) {
      const t = x * x + y * y;
      const zz = z * z;
      kind = t === zz ? "Right" : t < zz ? "Obtuse" : "Acute";
    }
    const w = 220, h = 130;
    const base = 200;
    const scale = base / z;
    const side = y * scale;
    const bx = (w - base) / 2;
    const topX = bx + (x * x - y * y + z * z) / (2 * z) * scale;
    const topY = 18;
    return `<div class="ap-tri">
      <svg viewBox="0 0 ${w} ${h}" width="220" height="130" aria-hidden="true">
        <polygon points="${bx},${h - 12} ${bx + base},${h - 12} ${Math.max(bx, Math.min(bx + base, topX))},${topY}" fill="var(--surface)" stroke="var(--primary)" stroke-width="3"/>
      </svg>
      <div class="ap-tri-len"><span>a=${x}</span><span>b=${y}</span><span>c=${z}</span></div>
      <strong>${kind}</strong>
    </div>`;
  }

  function grid(rows, pick) {
    return `<div class="ap-grid">
      ${rows.map((row, i) => `<div class="ap-grow">${row.map((n, j) => {
        const on = pick && pick[i] === j;
        return `<div class="ap-cell${on ? " is-on" : ""}">${n}</div>`;
      }).join("")}</div>`).join("")}
    </div>`;
  }

  function logic(A, B, c) {
    const rows = [
      ["AND", A & B],
      ["OR", A | B],
      ["XOR", A ^ B],
    ];
    return `<div class="ap-logic">
      <p>A=${A}　B=${B}　要得到 ${c}</p>
      ${rows.map(([name, v]) => `<div class="if-gate ${v === c ? "is-yes" : "is-no"}"><code>${name}</code><span>${A} ${name === "AND" ? "&" : name === "OR" ? "|" : "^"} ${B} = ${v}</span><b>${v === c ? "合" : "不合"}</b></div>`).join("")}
    </div>`;
  }

  function board(a, b, label) {
    return `<div class="ap-board">
      <div><small>${esc(label || "這一場")}</small><strong>${a}:${b}</strong></div>
    </div>`;
  }

  function posts(h, fillAt) {
    const mx = Math.max(1, ...h);
    return `<div class="ap-posts">
      ${h.map((v, i) => {
        const miss = v === 0;
        const shown = miss && fillAt && fillAt[i] != null ? fillAt[i] : v;
        const ht = miss && !fillAt ? 18 : 24 + (shown / mx) * 110;
        return `<div class="ap-post${miss ? " is-miss" : ""}${fillAt && fillAt[i] != null ? " is-fill" : ""}">
          <div class="ap-post-bar" style="height:${ht}px">${miss && !fillAt ? "缺" : shown}</div>
        </div>`;
      }).join("")}
    </div>`;
  }

  function price(p, marks) {
    const mx = Math.max(1, ...p);
    marks = marks || {};
    const word = { "is-buy": "買", "is-sell": "賣" };
    const bits = p.map((n, i) => `第${i + 1}天 ${n}${word[marks[i]] ? word[marks[i]] : ""}`);
    return `<div class="ap-price" role="img" aria-label="${esc(bits.join("，"))}">
      ${p.map((n, i) => `<div class="ap-px ${marks[i] || ""}"><div class="ap-px-bar" style="height:${20 + (n / mx) * 100}px">${n}</div><small>${i + 1}${word[marks[i]] ? " " + word[marks[i]] : ""}</small></div>`).join("")}
    </div>`;
  }

  function couplet(a, b, hi) {
    const marks = new Set();
    if (Array.isArray(hi)) hi.forEach((k) => marks.add(k));
    else if (hi === "r1") ["a1", "a3", "a5", "b1", "b3", "b5"].forEach((k) => marks.add(k));
    else if (hi === "r2") ["a6", "b6"].forEach((k) => marks.add(k));
    else if (hi === "r3") ["a1", "a3", "a5", "b1", "b3", "b5"].forEach((k) => marks.add(k));
    else if (hi) marks.add(hi);
    const row = (arr, who) => arr.map((n, i) => {
      const key = `${who}${i}`;
      const special = i === 1 || i === 3 || i === 5 || i === 6;
      return `<div class="ap-ch ${special ? "is-key" : ""}${marks.has(key) ? " is-on" : ""}">${n}<small>${i + 1}</small></div>`;
    }).join("");
    return `<div class="ap-couplet">
      <div class="ap-cline"><span>上</span>${row(a, "a")}</div>
      <div class="ap-cline"><span>下</span>${row(b, "b")}</div>
    </div>`;
  }

  function boxes(up, dn, chosen) {
    return `<div class="ap-box">
      <div class="ap-box-row">${up.map((n, i) => `<div class="ap-cell${chosen && chosen[i] === 0 ? " is-on" : ""}">${n}</div>`).join("")}</div>
      <div class="ap-box-row">${dn.map((n, i) => `<div class="ap-cell${chosen && chosen[i] === 1 ? " is-on" : ""}">${n}</div>`).join("")}</div>
    </div>`;
  }

  function plants(x1, n, p1, p2, hi) {
    const y = n - x1;
    return `<div class="ap-plants">
      <div class="ap-plant${hi === 1 ? " is-on" : ""}"><small>一號工廠</small><b>${x1} 人</b><span>收益 ${p1}</span></div>
      <div class="ap-plant${hi === 2 ? " is-on" : ""}"><small>二號工廠</small><b>${y} 人</b><span>收益 ${p2}</span></div>
      <div class="ap-plant is-sum${hi === "sum" ? " is-on" : ""}"><small>合計</small><b>${p1 + p2}</b></div>
    </div>`;
  }

  function path(pts, hi) {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const pad = 18;
    const w = 280, h = 160;
    const sx = (x) => pad + ((x - minX) / Math.max(1, maxX - minX)) * (w - pad * 2);
    const sy = (y) => h - pad - ((y - minY) / Math.max(1, maxY - minY)) * (h - pad * 2);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ");
    const dots = pts.map((p, i) => `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="${i === hi ? 7 : 4}" fill="${i === hi ? "var(--accent)" : "var(--primary)"}"/>`).join("");
    return `<svg class="ap-path" viewBox="0 0 ${w} ${h}" width="280" height="160">${`<path d="${d}" fill="none" stroke="var(--primary)" stroke-width="3"/>`}${dots}</svg>`;
  }

  function chars(list, hi) {
    return `<div class="ap-chars">
      ${list.map((c, i) => `<div class="ap-char${i === hi ? " is-on" : ""}"><b>${c.a} / ${c.d}</b><small>戰力 ${c.p}</small></div>`).join("")}
    </div>`;
  }

  function dice(nums, hi) {
    return `<div class="ap-digits" role="img" aria-label="${nums.join("、")}">
      ${nums.map((n, i) => `<div class="ap-d${i === hi ? " is-on" : ""}"><small>第 ${i + 1} 顆</small>${n}</div>`).join("")}
    </div>`;
  }

  function compass(left, right, uturn) {
    return `<div class="hud">
      <span>左轉 <b>${left}</b></span>
      <span>右轉 <b>${right}</b></span>
      <span>迴轉 <b>${uturn}</b></span>
    </div>`;
  }

  function freq(cnt, mx) {
    const cells = [];
    for (let i = 1; i <= 9; i++) {
      if (!cnt[i]) continue;
      cells.push(`<div class="ap-d${cnt[i] === mx ? " is-on" : ""}"><small>${i} 出現</small>${cnt[i]}</div>`);
    }
    return `<div class="ap-digits">${cells.join("")}</div>`;
  }

  window.IfKit = {
    toolbar, hero, fork, tri, gates, fortune, week, clock, sgnLine, bars,
    scale, avgTrack, rps, flip, py, full, fieldRow, numField, live, walk, esc,
    digits, scores, triangle, grid, logic, board, posts, price, couplet, boxes, plants, path, chars,
    dice, compass, freq,
  };
})();
