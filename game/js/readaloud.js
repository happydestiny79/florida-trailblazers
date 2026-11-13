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

  function clearHighlight() {
    document.querySelectorAll(".ra-on").forEach(function (n) { n.classList.remove("ra-on"); });
    document.querySelectorAll(".ra-playing").forEach(function (n) { n.classList.remove("ra-playing"); });
    document.querySelectorAll(".ra-btn[aria-pressed='true']").forEach(function (b) {
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-label", b.getAttribute("data-ra-label") || "Read aloud");
      b.textContent = "🔊";
    });
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
  }

  function textOf(el) {
    if (!el) return "";
    var clone = el.cloneNode(true);
    clone.querySelectorAll(".ra-btn, .sr-only, .grip, .o-btns, .ev-n, .box, script, style, .p-kind").forEach(function (n) { n.remove(); });
    return (clone.innerText || clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function skipNode(n) {
    if (n.nodeType !== 1) return false;
    if (/^(SCRIPT|STYLE|SVG|TEXTAREA|INPUT|SELECT)$/i.test(n.nodeName)) return true;
    return n.classList && (n.classList.contains("ra-btn") || n.classList.contains("sr-only") || n.classList.contains("grip") || n.classList.contains("o-btns") || n.classList.contains("ev-n") || n.classList.contains("box") || n.classList.contains("p-kind"));
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
    var btn = opts.btn || null;
    spokenLog.push(text);
    job = { utt: u, btn: btn, roots: roots, words: opts.words || [], usedBoundary: false, timer: null, text: text, map: null };
    if (btn) {
      btn.setAttribute("aria-pressed", "true");
      if (!btn.getAttribute("data-ra-label")) btn.setAttribute("data-ra-label", btn.getAttribute("aria-label") || "Read aloud");
      btn.setAttribute("aria-label", "Stop reading");
      btn.textContent = "⏹️";
    }
    roots.forEach(function (r) { r.classList.add("ra-playing"); });

    function finish() {
      if (!job || job.utt !== u) return;
      if (job.timer) clearTimeout(job.timer);
      job.roots.forEach(unwrap);
      clearHighlight();
      job = null;
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
    if (job && job.btn && btn && job.btn === btn) { cancel(); return; }
    cancel();
    var words = wrapWords(el);
    speakNow(textOf(el), { el: el, roots: [el], btn: btn, words: words });
  }
  function speakText(text, btn, onend) {
    if (!hasSynth()) return;
    if (job && btn && job.btn === btn) { cancel(); return; }
    cancel();
    speakNow(String(text || ""), { btn: btn, onend: onend });
  }
  function speakQueue(items) {
    var i = 0;
    function next() {
      if (i >= items.length) return;
      var it = items[i++];
      if (!it || !it.el || !document.body.contains(it.el)) { next(); return; }
      var words = wrapWords(it.el);
      var text = textOf(it.el);
      if (!text) { next(); return; }
      speakNow(text, { el: it.el, roots: [it.el], btn: it.btn || (it.el.querySelector && it.el.querySelector(".ra-btn")), words: words, onend: next });
    }
    cancel();
    next();
  }

  function makeBtn(label) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "ra-btn";
    b.setAttribute("aria-label", label);
    b.setAttribute("aria-pressed", "false");
    b.setAttribute("data-ra-label", label);
    b.title = "Read aloud";
    b.textContent = "🔊";
    return b;
  }
  function wrapRow(el, btn) {
    if (el.parentNode && el.parentNode.classList && el.parentNode.classList.contains("ra-row")) {
      if (!el.parentNode.querySelector(".ra-btn")) el.parentNode.appendChild(btn);
      return;
    }
    var row = document.createElement("div");
    row.className = "ra-row";
    el.parentNode.insertBefore(row, el);
    row.appendChild(el);
    row.appendChild(btn);
  }
  function attachBlock(el, label) {
    if (!el || el.getAttribute("data-ra") === "1") return el && el.querySelector ? el.querySelector(".ra-btn") : null;
    el.setAttribute("data-ra", "1");
    el.classList.add("ra-block");
    var btn = makeBtn(label);
    el.insertBefore(btn, el.firstChild);
    btn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); speakElement(el, btn); });
    return btn;
  }
  function attachRow(el, label) {
    if (!el || el.getAttribute("data-ra") === "1") return el && el.parentNode && el.parentNode.querySelector ? el.parentNode.querySelector(".ra-btn") : null;
    el.setAttribute("data-ra", "1");
    var btn = makeBtn(label);
    wrapRow(el, btn);
    btn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); speakElement(el, btn); });
    return btn;
  }
  function isAnswerChoice(el) {
    if (!el) return false;
    if (el.id === "next" || el.id === "check" || el.id === "reveal" || el.id === "buy" || el.id === "hubnext" || el.id === "ask") return false;
    if (el.classList.contains("partner-ask") || el.classList.contains("lf-continue")) return false;
    return true;
  }

  function enhance(root) {
    if (!hasSynth() || !root || !root.querySelectorAll) return;
    root.querySelectorAll(".passage").forEach(function (el) { attachBlock(el, "Read this passage aloud"); });
    root.querySelectorAll(".prompt").forEach(function (el) { attachBlock(el, "Read this question aloud"); });
    root.querySelectorAll("section.panel > p, .modal-body > p, .iv-a, #partner-bubble, .partner-bubble, .lf-instruction, .lf-clue, .lf-photo-text, .lf-spot > p").forEach(function (el) {
      if (el.classList.contains("small") || el.classList.contains("hint") || el.classList.contains("tip") || el.classList.contains("src")) return;
      if (el.closest && el.closest(".shop, .budget, .win-stats, .t-class, .privacy, .credits")) return;
      attachBlock(el, "Read this aloud");
    });
    root.querySelectorAll("#ch .choice, #rch .choice, #qw .opt, #ivq .iq, .ev-sent, .lf-spot-choice").forEach(function (el) {
      if (!isAnswerChoice(el)) return;
      var kind = el.classList.contains("iq") ? "Read this interview question aloud" : (el.classList.contains("ev-sent") ? "Read this sentence aloud" : (el.classList.contains("lf-spot-choice") ? "Read this photo choice aloud" : "Read this answer aloud"));
      attachRow(el, kind);
    });
  }

  function autoBlocks(root) {
    var out = [], seen = [];
    function add(el) {
      if (!el || !document.body.contains(el)) return;
      if (seen.indexOf(el) >= 0) return;
      seen.push(el);
      out.push({ el: el, btn: el.querySelector && el.querySelector(".ra-btn") });
    }
    if (!root) return out;
    var lf = root.querySelector && root.querySelector(".local-flavor");
    if (lf) {
      add(lf.querySelector(".lf-instruction"));
      var card = lf.querySelector(".lf-photo-text");
      if (card) add(card);
      var spot = lf.querySelector(".lf-spot > p");
      if (spot) add(spot);
    }
    if (root.querySelector) {
      var clue = root.querySelector(".lf-clue");
      if (clue) add(clue);
      root.querySelectorAll("section.panel > p").forEach(function (p) {
        if (p.classList.contains("small") || p.classList.contains("hint") || p.classList.contains("tip")) return;
        add(p);
      });
      add(root.querySelector(".passage"));
      add(root.querySelector(".prompt"));
    }
    var modal = (root.id === "modal") ? root : document.getElementById("modal");
    if (modal && (root === modal || (root.contains && root.contains(modal)) || root.id === "modal")) {
      var body = modal.querySelector(".modal-body");
      if (body) body.querySelectorAll("p, .iv-a").forEach(function (p) { if (!p.classList.contains("small")) add(p); });
    }
    return out;
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
    refreshChrome();
    var titleEl = document.getElementById("modal-title");
    var modalTitle = titleEl ? titleEl.textContent : "";
    if (modalTitle === "Menu" || modalTitle === "🔊 Read aloud") return;
    if (!settings().auto) { lastAutoKey = screenKey(); return; }
    var key = screenKey();
    if (key === lastAutoKey) return;
    lastAutoKey = key;
    var items = autoBlocks(root);
    if (items.length) speakQueue(items);
  }

  function hideChrome() {
    document.querySelectorAll(".ra-btn, .ra-settings, #ra-open, #read").forEach(function (n) {
      n.hidden = true; n.classList.add("ra-hidden");
    });
  }
  function refreshChrome() {
    if (!hasSynth()) { hideChrome(); return; }
    document.querySelectorAll(".ra-hidden").forEach(function (n) { n.hidden = false; n.classList.remove("ra-hidden"); });
    var s = settings();
    document.querySelectorAll("#ra-auto").forEach(function (b) { b.checked = !!s.auto; });
    document.querySelectorAll("[data-ra-speed]").forEach(function (b) {
      if (b.getAttribute("data-ra-name")) return;
      var on = b.getAttribute("data-ra-speed") === s.speed;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("on", on);
    });
    var hud = document.getElementById("read");
    if (hud) {
      hud.hidden = false;
      hud.classList.toggle("ra-auto-on", !!s.auto);
      hud.title = s.auto ? "Read this page aloud (Read to me is on)" : "Read this page aloud";
    }
  }

  function settingsHtml() {
    if (!hasSynth()) return "";
    var s = settings();
    return '<div class="ra-settings" id="ra-settings">' +
      '<p class="small">The game can read the story and questions out loud using this device\'s built-in voice. No extra files are needed. Voice quality depends on the device.</p>' +
      '<label class="switch"><input type="checkbox" id="ra-auto"' + (s.auto ? " checked" : "") + '> <span><b>Read to me</b>: automatically read each new screen (the story, then the question). Tap a speaker button to hear an answer choice.</span></label>' +
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
      if (window.FTBX && FTBX.toast) FTBX.toast(auto.checked ? "🔊 Read to me is on" : "Read to me is off");
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
    if (!hasSynth()) { if (r) r.hidden = true; return; }
    if (r) {
      r.hidden = false;
      r.onclick = function () {
        var panel = document.querySelector("main .panel");
        if (job && job.btn === r) { cancel(); return; }
        if (panel) speakElement(panel, r);
        else speakText(readText || "", r);
      };
    }
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
    enhance: enhance,
    afterScreen: afterScreen,
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
