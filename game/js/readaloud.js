/* Florida Trailblazers v6 — read-aloud using the browser's built-in Web Speech API only.
   No audio files, no network, no extra libraries. Hidden entirely if speechSynthesis is missing. */
var READALOUD = (function () {
  "use strict";
  var PREF_KEY = "ftb_readaloud_v6";
  var RATE = { slow: 0.75, normal: 1 };
  var job = null, speakTimer = null, chosenVoice = null, voicesBound = false, lastAutoKey = null, spokenLog = [];

  function hasSynth() {
    try { return typeof window !== "undefined" && "speechSynthesis" in window && !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === "function"; }
    catch (e) { return false; }
  }
  function synth() { return hasSynth() ? window.speechSynthesis : null; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) { s = s || {}; return { auto: !!s.auto, speed: s.speed === "slow" ? "slow" : "normal" }; }

  function devicePref() {
    try { var j = localStorage.getItem(PREF_KEY); return j ? norm(JSON.parse(j)) : null; } catch (e) { return null; }
  }
  function saveDevicePref(s) { try { localStorage.setItem(PREF_KEY, JSON.stringify(norm(s))); } catch (e) {} }

  function currentName() {
    try {
      if (window.V3 && typeof V3.current === "function") { var n = V3.current(); if (n) return n; }
      var st = window.FTB && FTB.state && FTB.state();
      return (st && st.name) || "";
    } catch (e) { return ""; }
  }
  function profileOf(name) {
    if (!name || !window.V3 || typeof V3.profile !== "function") return null;
    try { return V3.profile(name); } catch (e) { return null; }
  }

  function settings() {
    var p = profileOf(currentName());
    if (p && p.readAloud) return norm(p.readAloud);
    try { var st = window.FTB && FTB.state && FTB.state(); if (st && st.readAloud) return norm(st.readAloud); } catch (e) {}
    var d = devicePref();
    return d || { auto: false, speed: "normal" };
  }

  function setSettings(patch) {
    var cur = settings();
    var next = norm({ auto: patch.auto != null ? patch.auto : cur.auto, speed: patch.speed != null ? patch.speed : cur.speed });
    try {
      var st = window.FTB && FTB.state && FTB.state();
      if (st) { st.readAloud = { auto: next.auto, speed: next.speed }; if (window.FTBX && FTBX.save) FTBX.save(); }
    } catch (e) {}
    var p = profileOf(currentName());
    if (p && p.name && window.V3 && V3.saveProfile) { p.readAloud = { auto: next.auto, speed: next.speed }; V3.saveProfile(p); }
    saveDevicePref(next);
    refreshChrome();
    return next;
  }

  /* Used when a named player starts a new case. Never overwrites a saved per-student setting.
     Order for a first-time profile: class default for auto, then this device's last speed/auto if the teacher or student already set one here. */
  function applyToNewPlayer(name) {
    var p = name ? profileOf(name) : null;
    if (p && p.readAloud) return norm(p.readAloud);
    var cls = (window.V3 && V3.cls) ? V3.cls() : {};
    var d = devicePref();
    var next = norm({
      auto: !!(d && d.auto) || !!cls.readAloudAuto,
      speed: (d && d.speed) || "normal"
    });
    if (p && p.name && V3.saveProfile) { p.readAloud = { auto: next.auto, speed: next.speed }; V3.saveProfile(p); }
    return next;
  }

  function profileSettings(name) {
    var p = profileOf(name);
    return (p && p.readAloud) ? norm(p.readAloud) : { auto: false, speed: "normal" };
  }
  function setProfileSettings(name, patch) {
    var p = profileOf(name); if (!p || !p.name) return null;
    var cur = profileSettings(name);
    var next = norm({ auto: patch.auto != null ? patch.auto : cur.auto, speed: patch.speed != null ? patch.speed : cur.speed });
    p.readAloud = { auto: next.auto, speed: next.speed }; V3.saveProfile(p);
    try {
      var who = currentName();
      if (who && who.toLowerCase() === String(name).toLowerCase()) {
        var st = window.FTB && FTB.state && FTB.state();
        if (st) { st.readAloud = { auto: next.auto, speed: next.speed }; if (window.FTBX && FTBX.save) FTBX.save(); }
      }
    } catch (e) {}
    return next;
  }

  function rate() { return RATE[settings().speed] || 1; }

  function pickVoice() {
    var s = synth(); if (!s) return;
    var voices = [];
    try { voices = s.getVoices() || []; } catch (e) { voices = []; }
    if (!voices.length) return;
    var prefer = ["Google US English", "Microsoft Aria Online (Natural) - English (United States)", "Microsoft Zira - English (United States)", "Samantha", "Samantha (Enhanced)", "Alex"];
    var i, v;
    for (i = 0; i < prefer.length; i++) {
      for (v = 0; v < voices.length; v++) { if (voices[v].name === prefer[i]) { chosenVoice = voices[v]; return; } }
    }
    for (v = 0; v < voices.length; v++) { if (/^en-US/i.test(voices[v].lang)) { chosenVoice = voices[v]; return; } }
    for (v = 0; v < voices.length; v++) { if (/^en/i.test(voices[v].lang)) { chosenVoice = voices[v]; return; } }
    chosenVoice = voices[0];
  }
  function loadVoices() {
    var s = synth(); if (!s) return;
    pickVoice();
    if (voicesBound) return;
    voicesBound = true;
    try {
      if (typeof s.addEventListener === "function") s.addEventListener("voiceschanged", pickVoice);
      else s.onvoiceschanged = pickVoice;
    } catch (e) {}
  }


  var ICON_SPEAK = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
  var ICON_STOP = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><rect fill="currentColor" x="6" y="6" width="12" height="12" rx="2"/></svg>';
  var tapBound = false;

  function fabEl() { return document.getElementById("ra-fab"); }

  function syncFab() {
    var b = fabEl();
    if (!b) return;
    var on = shouldShowFab();
    b.hidden = !on;
    document.body.classList.toggle("ra-fab-on", on);
    document.body.classList.toggle("ra-on", !!(hasSynth() && settings().auto));
    var playing = !!(job && on);
    b.classList.toggle("is-playing", playing);
    b.setAttribute("aria-pressed", playing ? "true" : "false");
    b.setAttribute("aria-label", playing ? "Stop reading" : "Read to me");
    b.title = playing ? "Stop reading" : "Read to me";
    var icon = b.querySelector(".ra-fab-icon");
    if (icon) icon.innerHTML = playing ? ICON_STOP : ICON_SPEAK;
  }

  function shouldShowFab() {
    if (!hasSynth() || !settings().auto) return false;
    if (document.querySelector(".title-screen")) return false;
    if (document.querySelector(".teacher") && !document.querySelector("main .panel")) return false;
    return true;
  }

  function ensureFab() {
    if (!hasSynth()) return null;
    var b = fabEl();
    if (b) { syncFab(); return b; }
    b = document.createElement("button");
    b.type = "button";
    b.id = "ra-fab";
    b.className = "ra-fab";
    b.hidden = true;
    b.innerHTML = '<span class="ra-fab-icon" aria-hidden="true">' + ICON_SPEAK + '</span>';
    b.setAttribute("aria-label", "Read to me");
    b.title = "Read to me";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (job) { cancel(); return; }
      speakScreen();
    });
    document.body.appendChild(b);
    bindTap();
    syncFab();
    return b;
  }

  function bindTap() {
    if (tapBound) return;
    tapBound = true;
    document.addEventListener("click", function (e) {
      if (!hasSynth() || !settings().auto) return;
      var t = e.target && e.target.closest ? e.target : null;
      if (!t || !t.closest) return;
      if (t.closest("#ra-fab, #vpop, .vocab, .hud, .modal-btns, button, a, input, select, textarea, .choice, .opt, .iq, .ev-sent, .lf-spot-choice, .spot, .j-card, .o-btns, .lf-gallery")) return;
      var el = t.closest(".ra-tap");
      if (!el) return;
      speakElement(el);
    });
  }

  function clearHighlight() {
    document.querySelectorAll(".ra-on").forEach(function (n) { n.classList.remove("ra-on"); });
    document.querySelectorAll(".ra-playing").forEach(function (n) { n.classList.remove("ra-playing"); });
  }
  function unwrap(root) {
    if (!root) return;
    var list = [];
    if (root.nodeType === 1 && root.classList.contains("ra-w")) list.push(root);
    if (root.querySelectorAll) root.querySelectorAll(".ra-w").forEach(function (n) { list.push(n); });
    list.forEach(function (sp) {
      var p = sp.parentNode; if (!p) return;
      while (sp.firstChild) p.insertBefore(sp.firstChild, sp);
      p.removeChild(sp);
      p.normalize();
    });
  }
  function cancel() {
    if (speakTimer) { clearTimeout(speakTimer); speakTimer = null; }
    if (job && job.timer) { clearTimeout(job.timer); }
    if (job && job.roots) job.roots.forEach(unwrap);
    clearHighlight();
    job = null;
    var s = synth();
    if (s) { try { s.cancel(); } catch (e) {} }
    if (window.SFX && SFX.unduck) SFX.unduck();
    syncFab();
  }

  function textOf(el) {
    if (!el) return "";
    var clone = el.cloneNode(true);
    clone.querySelectorAll(".ra-btn, .sr-only, .grip, .o-btns, .ev-n, .box, script, style, .p-kind, .ra-fab").forEach(function (n) { n.remove(); });
    return (clone.innerText || clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function skipNode(n) {
    if (n.nodeType !== 1) return false;
    if (/^(SCRIPT|STYLE|SVG|TEXTAREA|INPUT|SELECT)$/i.test(n.nodeName)) return true;
    return n.classList && (n.classList.contains("ra-btn") || n.classList.contains("sr-only") || n.classList.contains("grip") || n.classList.contains("o-btns") || n.classList.contains("ev-n") || n.classList.contains("box") || n.classList.contains("p-kind") || n.classList.contains("ra-fab"));
  }
  function wrapWords(root) {
    unwrap(root);
    var words = [];
    function walk(node) {
      if (skipNode(node)) return;
      if (node.nodeType === 3) {
        var text = node.nodeValue, re = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)?|(\s+)|([^\s])/g, m, parts = document.createDocumentFragment(), changed = false;
        while ((m = re.exec(text))) {
          if (m[1]) { parts.appendChild(document.createTextNode(m[0])); continue; }
          var sp = document.createElement("span");
          sp.className = "ra-w";
          sp.textContent = m[0];
          words.push({ el: sp, text: m[0] });
          parts.appendChild(sp);
          changed = true;
        }
        if (changed && node.parentNode) node.parentNode.replaceChild(parts, node);
        return;
      }
      if (node.nodeType === 1) Array.prototype.slice.call(node.childNodes).forEach(walk);
    }
    walk(root);
    return words;
  }

  function speakNow(text, opts) {
    opts = opts || {};
    var s = synth();
    if (!s || !text) { if (opts.onend) opts.onend(); return; }
    loadVoices();
    var U = window.SpeechSynthesisUtterance;
    var u = new U(text);
    u.rate = rate();
    u.pitch = 1;
    u.lang = "en-US";
    try { if (chosenVoice) u.voice = chosenVoice; } catch (e) {}
    var roots = opts.roots || (opts.el ? [opts.el] : []);
    var btn = opts.btn || fabEl();
    spokenLog.push(text);
    job = { utt: u, btn: btn, roots: roots, words: opts.words || [], usedBoundary: false, timer: null, text: text, map: null, kind: opts.kind || "item" };
    roots.forEach(function (r) { if (r && r.classList) r.classList.add("ra-playing"); });
    syncFab();

    if (window.SFX && SFX.duck) SFX.duck();
    function finish() {
      if (!job || job.utt !== u) return;
      if (job.timer) clearTimeout(job.timer);
      job.roots.forEach(unwrap);
      clearHighlight();
      job = null;
      if (window.SFX && SFX.unduck) SFX.unduck();
      syncFab();
      if (opts.onend) opts.onend();
    }
    u.onend = finish;
    u.onerror = function () { finish(); };

    function highlightAt(idx) {
      if (!job || job.utt !== u) return;
      var w = job.words, i;
      if (!w.length) return;
      if (!job.map) {
        job.map = [];
        var t = job.text, cursor = 0;
        for (i = 0; i < w.length; i++) {
          var at = t.indexOf(w[i].text, cursor);
          if (at < 0) at = cursor;
          job.map.push({ start: at, end: at + w[i].text.length, el: w[i].el });
          cursor = at + w[i].text.length;
        }
      }
      var hit = null;
      for (i = job.map.length - 1; i >= 0; i--) { if (idx >= job.map[i].start) { hit = job.map[i].el; break; } }
      if (!hit) hit = w[0].el;
      document.querySelectorAll(".ra-on").forEach(function (n) { n.classList.remove("ra-on"); });
      if (hit && hit.parentNode) {
        hit.classList.add("ra-on");
        try { hit.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (e) {}
      }
    }
    u.onboundary = function (ev) {
      if (!job || job.utt !== u) return;
      if (ev.name && ev.name !== "word") return;
      job.usedBoundary = true;
      if (job.timer) { clearTimeout(job.timer); job.timer = null; }
      highlightAt(typeof ev.charIndex === "number" ? ev.charIndex : 0);
    };
    /* No word events (common on some iPads): leave the whole block highlighted. */
    job.timer = setTimeout(function () { if (job && job.utt === u && !job.usedBoundary) { /* block highlight already on */ } }, 450);

    try { s.cancel(); } catch (e) {}
    speakTimer = setTimeout(function () {
      speakTimer = null;
      try { s.speak(u); } catch (e) { finish(); }
    }, 60);
  }

  function speakElement(el, btn) {
    if (!hasSynth() || !el) return;
    if (job && job.roots && job.roots.length === 1 && job.roots[0] === el) { cancel(); return; }
    cancel();
    var words = wrapWords(el);
    speakNow(textOf(el), { el: el, roots: [el], btn: btn || fabEl(), words: words, kind: "item" });
  }
  function speakText(text, btn, onend) {
    if (!hasSynth()) return;
    if (job && btn && job.btn === btn) { cancel(); return; }
    cancel();
    speakNow(String(text || ""), { btn: btn || fabEl(), onend: onend, kind: "text" });
  }
  function speakQueue(items, kind) {
    var i = 0;
    function next() {
      if (i >= items.length) { syncFab(); return; }
      var it = items[i++];
      if (!it || (it.el && !document.body.contains(it.el))) { next(); return; }
      var el = it.el;
      var text = it.text || (el ? textOf(el) : "");
      if (!text) { next(); return; }
      var words = el ? wrapWords(el) : [];
      speakNow(text, { el: el, roots: el ? [el] : [], btn: fabEl(), words: words, onend: next, kind: kind || "queue" });
    }
    cancel();
    next();
  }

  function isAnswerChoice(el) {
    if (!el) return false;
    if (el.id === "next" || el.id === "check" || el.id === "reveal" || el.id === "buy" || el.id === "hubnext" || el.id === "ask") return false;
    if (el.classList.contains("partner-ask") || el.classList.contains("lf-continue")) return false;
    return true;
  }

  function markTappable(el) {
    if (!el) return null;
    el.setAttribute("data-ra", "1");
    el.classList.add("ra-tap");
    return el;
  }
  function attachBlock(el, label) {
    /* Kept as a hook for journal/calling-card callers; no per-item speaker buttons. */
    return markTappable(el);
  }

  function enhance(root) {
    if (!hasSynth() || !root || !root.querySelectorAll) return;
    root.querySelectorAll(".fox-note, .fox-intro-text, .fox-capture-text, .passage, .prompt").forEach(function (el) { markTappable(el); });
    root.querySelectorAll("section.panel > p, .modal-body > p, .iv-a, #partner-bubble, .partner-bubble, .lf-instruction, .lf-clue, .lf-photo-text, .lf-spot > p, .j-facts, .j-detail").forEach(function (el) {
      if (el.classList.contains("small") || el.classList.contains("hint") || el.classList.contains("tip") || el.classList.contains("src")) return;
      if (el.closest && el.closest(".shop, .budget, .win-stats, .t-class, .privacy, .credits, .ra-settings")) return;
      markTappable(el);
    });
  }

  function autoBlocks(root) {
    var out = [], seen = [];
    function add(el, text) {
      if (!el || !document.body.contains(el)) return;
      if (seen.indexOf(el) >= 0) return;
      seen.push(el);
      var item = { el: el };
      if (text) item.text = text;
      out.push(item);
    }
    if (!root) return out;
    if (root.querySelector) {
      var lf = root.querySelector(".local-flavor");
      if (lf) {
        add(lf.querySelector(".lf-instruction"));
        var card = lf.querySelector(".lf-photo-text");
        if (card) add(card);
        var spot = lf.querySelector(".lf-spot > p");
        if (spot) add(spot);
      }
      var clue = root.querySelector(".lf-clue");
      if (clue) add(clue);
      root.querySelectorAll("section.panel > p").forEach(function (p) {
        if (p.classList.contains("small") || p.classList.contains("hint") || p.classList.contains("tip")) return;
        add(p);
      });
      add(root.querySelector(".fox-note"));
      add(root.querySelector(".fox-intro-text"));
      add(root.querySelector(".passage"));
      add(root.querySelector(".prompt"));
    }
    var modal = (root.id === "modal") ? root : document.getElementById("modal");
    if (modal && (root === modal || (root.contains && root.contains(modal)) || root.id === "modal")) {
      var mt = modal.querySelector("#modal-title, .modal h2");
      if (mt) add(mt);
      var body = modal.querySelector(".modal-body");
      if (body) body.querySelectorAll("p, .iv-a, .j-facts, .fox-note").forEach(function (p) { if (!p.classList.contains("small")) add(p); });
    }
    return out;
  }

  function choiceItems(root) {
    if (!root || !root.querySelectorAll) return [];
    var out = [], n = 0;
    root.querySelectorAll("#ch .choice, #rch .choice, #qw .opt, #ivq .iq, .lf-spot-choice").forEach(function (el) {
      if (!isAnswerChoice(el)) return;
      var letter = String.fromCharCode(65 + n);
      n += 1;
      out.push({ el: el, text: "Choice " + letter + ". " + textOf(el) });
    });
    return out;
  }

  function screenItems(root) {
    var items = [], seen = [];
    function add(el, text) {
      if (!el || !document.body.contains(el)) return;
      if (seen.indexOf(el) >= 0) return;
      seen.push(el);
      var item = { el: el };
      if (text) item.text = text;
      items.push(item);
    }
    if (root && root.querySelector) add(root.querySelector("section.panel > h2"));
    autoBlocks(root).forEach(function (it) { add(it.el, it.text); });
    return items.concat(choiceItems(root));
  }

  function speakScreen(root) {
    if (!hasSynth()) return;
    if (job && job.kind === "screen") { cancel(); return; }
    root = root || activeRoot();
    var items = screenItems(root);
    if (!items.length) {
      var panel = (root && root.querySelector && (root.querySelector("main .panel") || root.querySelector(".modal") || root.querySelector(".panel"))) || document.querySelector("main .panel");
      if (panel) items = [{ el: panel }];
    }
    if (!items.length) return;
    speakQueue(items, "screen");
  }

  function activeRoot() {
    var modal = document.getElementById("modal");
    if (modal && modal.querySelector && modal.querySelector(".modal")) {
      var cs = window.getComputedStyle ? getComputedStyle(modal) : null;
      if (!cs || cs.display !== "none") {
        var titleEl = modal.querySelector("#modal-title");
        var modalTitle = titleEl ? titleEl.textContent : "";
        if (modalTitle !== "Menu" && modalTitle !== "🔊 Read aloud") return modal;
      }
    }
    return document.getElementById("app") || document.body;
  }

  function screenKey() {
    var st = window.FTB && FTB.state && FTB.state();
    var modal = document.getElementById("modal");
    var mt = modal && modal.querySelector("#modal-title") ? modal.querySelector("#modal-title").textContent : "";
    return (st && st.scene ? st.scene : "none") + "|" + (st && st.turn != null ? st.turn : "") + "|" + mt;
  }

  function afterScreen(root) {
    if (!hasSynth()) { hideChrome(); return; }
    root = root || document.getElementById("app") || document.body;
    enhance(root);
    ensureFab();
    refreshChrome();
    var titleEl = document.getElementById("modal-title");
    var modalTitle = titleEl ? titleEl.textContent : "";
    if (modalTitle === "Menu" || modalTitle === "🔊 Read aloud") return;
    if (!settings().auto) { lastAutoKey = screenKey(); return; }
    var key = screenKey();
    if (key === lastAutoKey) return;
    lastAutoKey = key;
    var items = autoBlocks(root);
    if (items.length) speakQueue(items, "auto");
  }

  function hideChrome() {
    document.querySelectorAll(".ra-btn, .ra-settings, #ra-open, #read, #ra-fab").forEach(function (n) {
      n.hidden = true; n.classList.add("ra-hidden");
    });
    document.body.classList.remove("ra-fab-on", "ra-on");
  }
  function refreshChrome() {
    if (!hasSynth()) { hideChrome(); return; }
    document.querySelectorAll(".ra-hidden").forEach(function (n) {
      if (n.id === "ra-fab") return;
      n.hidden = false; n.classList.remove("ra-hidden");
    });
    var s = settings();
    document.querySelectorAll("#ra-auto").forEach(function (b) { b.checked = !!s.auto; });
    document.querySelectorAll("[data-ra-speed]").forEach(function (b) {
      if (b.getAttribute("data-ra-name")) return;
      var on = b.getAttribute("data-ra-speed") === s.speed;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("on", on);
    });
    ensureFab();
    syncFab();
  }

  function settingsHtml() {
    if (!hasSynth()) return "";
    var s = settings();
    return '<div class="ra-settings" id="ra-settings">' +
      '<p class="small">The game can read the story and questions out loud using this device\'s built-in voice. No extra files are needed. Voice quality depends on the device.</p>' +
      '<label class="switch"><input type="checkbox" id="ra-auto"' + (s.auto ? " checked" : "") + '> <span><b>Read to me</b>: automatically read each new screen (the story, then the question). A Read to me button appears so you can hear the page again (including answer choices). Tap a paragraph or clue to hear just that part. Tapping an answer still chooses it.</span></label>' +
      '<div class="ra-speed" role="group" aria-label="Reading speed">' +
      '<span class="ra-speed-lbl">Speed</span>' +
      '<button type="button" class="btn sm ra-speed-btn' + (s.speed === "slow" ? " on" : "") + '" data-ra-speed="slow" aria-pressed="' + (s.speed === "slow") + '">Slow</button>' +
      '<button type="button" class="btn sm ra-speed-btn' + (s.speed === "normal" ? " on" : "") + '" data-ra-speed="normal" aria-pressed="' + (s.speed === "normal") + '">Normal</button>' +
      '</div></div>';
  }
  function wireSettings(root) {
    if (!root || !hasSynth()) return;
    var auto = root.querySelector("#ra-auto");
    if (auto) auto.onchange = function () {
      setSettings({ auto: auto.checked });
      if (window.FTBX && FTBX.toast) FTBX.toast(auto.checked ? "Read to me is on. Tap the button to hear the page, or tap a paragraph to hear just that part." : "Read to me is off");
    };
    root.querySelectorAll("[data-ra-speed]").forEach(function (b) {
      if (b.getAttribute("data-ra-name")) return;
      b.onclick = function (e) {
        e.preventDefault(); e.stopPropagation();
        setSettings({ speed: b.getAttribute("data-ra-speed") });
      };
    });
  }
  function openSettings() {
    if (!hasSynth() || !window.FTBX) return;
    FTBX.modal("🔊 Read aloud", settingsHtml(), [{ label: "Done" }], { escClose: true });
    wireSettings(document.getElementById("modal"));
  }

  function wireHud(readText) {
    var r = document.getElementById("read");
    if (r) r.hidden = true;
    if (!hasSynth()) { hideChrome(); return; }
    ensureFab();
    afterScreen(document.getElementById("app") || document.body);
  }

  function onVocab(word, def) {
    if (!hasSynth() || !word) return;
    speakText(word + ". " + (def || ""));
  }

  function teacherHtml() {
    if (!window.V3) return "";
    var c = V3.cls(), roster = c.roster || [];
    var rows = roster.length ? roster.map(function (n) {
      var s = profileSettings(n);
      return '<div class="ra-stu" data-name="' + esc(n) + '"><span class="ra-stu-name">' + esc(n) + '</span>' +
        '<label class="switch"><input type="checkbox" class="ra-stu-auto" data-ra-name="' + esc(n) + '"' + (s.auto ? " checked" : "") + '> Read to me</label>' +
        '<div class="ra-speed" role="group" aria-label="Reading speed for ' + esc(n) + '">' +
        '<button type="button" class="btn sm ra-speed-btn' + (s.speed === "slow" ? " on" : "") + '" data-ra-name="' + esc(n) + '" data-ra-speed="slow" aria-pressed="' + (s.speed === "slow") + '">Slow</button>' +
        '<button type="button" class="btn sm ra-speed-btn' + (s.speed === "normal" ? " on" : "") + '" data-ra-name="' + esc(n) + '" data-ra-speed="normal" aria-pressed="' + (s.speed === "normal") + '">Normal</button>' +
        '</div></div>';
    }).join("") : '<p class="small"><i>Add students to the class list to set Read to me for each one.</i></p>';
    return '<section id="t-readaloud-panel"><h2 id="t-readaloud">🔊 Read aloud</h2>' +
      '<label class="switch"><input type="checkbox" id="ra-class-auto"' + (c.readAloudAuto ? " checked" : "") + '> <span><b>Read to me</b> default for new students on this device. Students can also change this in the game Menu.</span></label>' +
      '<h3>Per student</h3><div class="ra-roster" id="ra-roster">' + rows + '</div></section>';
  }
  function wireTeacher() {
    var box = document.getElementById("ra-class-auto");
    if (box && window.V3) box.onchange = function () {
      var c = V3.cls(); c.readAloudAuto = box.checked; V3.saveCls(c);
      if (window.FTBX && FTBX.toast) FTBX.toast(box.checked ? "New students will have Read to me on" : "New students will have Read to me off");
    };
    document.querySelectorAll("#ra-roster .ra-stu-auto").forEach(function (inp) {
      inp.onchange = function () { setProfileSettings(inp.getAttribute("data-ra-name"), { auto: inp.checked }); };
    });
    document.querySelectorAll("#ra-roster [data-ra-speed]").forEach(function (b) {
      b.onclick = function () {
        var name = b.getAttribute("data-ra-name"), speed = b.getAttribute("data-ra-speed");
        setProfileSettings(name, { speed: speed });
        var row = b.closest(".ra-stu");
        if (!row) return;
        row.querySelectorAll("[data-ra-speed]").forEach(function (x) {
          var on = x.getAttribute("data-ra-speed") === speed;
          x.setAttribute("aria-pressed", on ? "true" : "false"); x.classList.toggle("on", on);
        });
      };
    });
  }

  if (hasSynth()) { try { loadVoices(); } catch (e) {} }

  return {
    available: hasSynth,
    settings: settings,
    setSettings: setSettings,
    applyToNewPlayer: applyToNewPlayer,
    profileSettings: profileSettings,
    setProfileSettings: setProfileSettings,
    cancel: cancel,
    speakElement: speakElement,
    speakText: speakText,
    speakScreen: speakScreen,
    screenTexts: function (root) { return screenItems(root || activeRoot()).map(function (it) { return it.text || textOf(it.el); }); },
    enhance: enhance,
    afterScreen: afterScreen,
    attachBlock: attachBlock,
    settingsHtml: settingsHtml,
    wireSettings: wireSettings,
    openSettings: openSettings,
    wireHud: wireHud,
    onVocab: onVocab,
    refreshChrome: refreshChrome,
    teacherHtml: teacherHtml,
    wireTeacher: wireTeacher,
    textOf: textOf,
    isSpeaking: function () { return !!job; },
    spoken: function () { return spokenLog.slice(); },
    resetLog: function () { spokenLog = []; },
    lastSpoken: function () { return spokenLog.length ? spokenLog[spokenLog.length - 1] : ""; }
  };
})();
