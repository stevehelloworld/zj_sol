(function () {
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function unentity(s) {
    return String(s ?? "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'");
  }

  function text(s) {
    return esc(unentity(s));
  }

  function codeBlock(lines, hi) {
    return `<pre class="eq py-code" tabindex="0">${lines.map((ln, i) => {
      const body = ln.length ? esc(ln) : " ";
      return `<span class="py-ln${i === hi ? " is-hi" : ""}">${body}</span>`;
    }).join("")}</pre>`;
  }

  function stdinBlock(lines, active) {
    if (!lines || !lines.length) return "";
    return `<div class="stdin">
      <div class="stdin-label">評測機送來的輸入</div>
      ${lines.map((ln, i) => {
        const state = active == null ? "" : i === active ? " is-on" : i < active ? " is-done" : "";
        return `<div class="stdin-ln${state}"><span class="ln-no">${i + 1}</span><code>${esc(ln)}</code></div>`;
      }).join("")}
    </div>`;
  }

  function varBlock(vars, glow) {
    const keys = Object.keys(vars || {});
    if (!keys.length) return "";
    return `<div class="vars">${keys.map((k) => {
      const v = vars[k];
      let show = "?";
      if (v !== undefined && v !== null && v !== "") {
        show = Array.isArray(v) ? `[${v.join(", ")}]` : String(v);
      }
      return `<div class="var${k === glow ? " is-on" : ""}"><span>${esc(k)}</span><b>${esc(show)}</b></div>`;
    }).join("")}</div>`;
  }

  function remainderDots(n, d) {
    const q = Math.floor(n / d);
    const r = n % d;
    let html = `<div class="bags" role="img" aria-label="${n} 除以 ${d} 餘 ${r}">`;
    for (let b = 0; b < q; b++) {
      html += `<div class="bag-box"><div class="dots">`;
      for (let i = 0; i < d; i++) html += `<i class="bag"></i>`;
      html += `</div><em>第 ${b + 1} 袋（${d}）</em></div>`;
    }
    html += `<div class="bag-box leftover"><div class="dots">`;
    for (let i = 0; i < r; i++) html += `<i class="left"></i>`;
    if (r === 0) html += `<span class="empty-rem">沒剩</span>`;
    html += `</div><em>剩下 ${r}</em></div></div>
      <p class="dot-cap">${n} ÷ ${d} = ${q} 袋，剩下 <b>${r}</b>。所以 <code>${n} % ${d}</code> = <b>${r}</b>。</p>`;
    return html;
  }

  function mountFrames(stage, canvas, frames, runtime) {
    let i = 0;
    const btn = stage.querySelector("#play");
    const chip = stage.querySelector("#py-chip");
    function paint() {
      const f = frames[i];
      if (chip) chip.textContent = `${i + 1} / ${frames.length}`;
      if (btn) btn.textContent = i >= frames.length - 1 ? "從頭再看" : "下一步程式";
      canvas.innerHTML = `<div class="py-grid">
        <div>
          ${codeBlock(f.lines, f.hi)}
          ${f.note ? `<p class="py-note">${f.note}</p>` : ""}
        </div>
        <div class="py-side">
          ${stdinBlock(f.stdin, f.stdinAt)}
          ${varBlock(f.vars, f.glow)}
          ${f.visual || ""}
        </div>
      </div>`;
    }
    function stop() {}
    runtime.onStop.push(stop);
    if (btn) {
      btn.onclick = () => {
        i = i >= frames.length - 1 ? 0 : i + 1;
        paint();
      };
    }
    paint();
  }

  function copyBtn(stage, code) {
    const btn = stage.querySelector("#copy");
    if (!btn) return;
    btn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = "已複製";
      } catch {
        btn.textContent = "請手動複製";
      }
    };
  }

  window.PyTeach = {
    esc,
    unentity,
    text,
    codeBlock,
    stdinBlock,
    varBlock,
    remainderDots,
    mountFrames,
    copyBtn,
  };
})();
