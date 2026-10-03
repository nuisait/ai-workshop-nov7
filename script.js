/* Copy Core Prompt to clipboard — Clipboard API with execCommand fallback */
(function () {
  "use strict";
  var btn = document.getElementById("copy-btn");
  if (!btn) return;
  var target = document.getElementById(btn.getAttribute("data-target"));
  var status = document.getElementById("copy-status");
  var label = btn.querySelector(".copy-label");
  var timer;

  function getText() {
    return (target.innerText || target.textContent || "").replace(/\u00a0/g, " ").trim();
  }

  function feedback(ok) {
    clearTimeout(timer);
    if (ok) {
      label.textContent = "คัดลอกแล้ว ✓";
      btn.classList.add("is-copied");
      status.classList.remove("is-error");
      status.textContent = "คัดลอกแล้ว — นำไปวางใน Description ของ Bot ได้เลย";
    } else {
      label.textContent = "คัดลอก";
      status.classList.add("is-error");
      status.textContent = "คัดลอกอัตโนมัติไม่ได้ — เลือกข้อความไว้ให้แล้ว กด Ctrl+C (หรือ ⌘+C) เพื่อคัดลอก";
      selectTarget();
    }
    timer = setTimeout(function () {
      label.textContent = "คัดลอก";
      btn.classList.remove("is-copied");
    }, 2500);
  }

  function selectTarget() {
    var range = document.createRange();
    range.selectNodeContents(target);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    btn.focus();
    return ok;
  }

  btn.addEventListener("click", function () {
    var text = getText();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { feedback(true); },
        function () { feedback(legacyCopy(text)); }
      );
    } else {
      feedback(legacyCopy(text));
    }
  });
})();
