/* Florida Trailblazers v3 — game engine (v3 add-ons live in js/v3.js and plug in through the V3 hooks below) (plain JS, no build step, works offline). */
(function () {
  "use strict";
  var app, S;
  var RANKS = [
    { min: 0, name: "Rookie Trailblazer", icon: "🥾", msg: "You solved the case! Every detective starts somewhere." },
    { min: 45, name: "Junior Detective", icon: "🔎", msg: "Nice work! You followed the clues all the way." },
    { min: 60, name: "Detective", icon: "🕵️", msg: "Great thinking! You read closely and used evidence." },
    { min: 75, name: "Senior Detective", icon: "🎖️", msg: "Excellent! You solved most problems on your own." },
    { min: 90, name: "Chief Detective", icon: "🏆", msg: "Outstanding! You are a true Florida Trailblazer." }
  ];
  var BADGES = [
    { id: "firstclue", icon: "🔎", name: "First Clue", desc: "Found your first clue." },
    { id: "sharpeye", icon: "👁️", name: "Sharp Eye", desc: "Found the bonus green-straw clue." },
    { id: "words", icon: "📚", name: "Word Collector", desc: "Collected 10 words in your Glossary." },
    { id: "reader", icon: "📖", name: "Close Reader", desc: "Answered 5 reading-passage questions on the first try." },
    { id: "sources", icon: "📜", name: "Source Sleuth", desc: "Answered every primary/secondary source question on the first try." },
    { id: "mapper", icon: "🧭", name: "Map Master", desc: "Solved every map question on the first try with no wrong-way trips." },
    { id: "timeline", icon: "⏳", name: "Timeline Titan", desc: "Opened the Timeline Lock on the first try." },
    { id: "budget", icon: "🪙", name: "Budget Boss", desc: "Finished the case with 5 or more coins left." },
    { id: "ontime", icon: "⏰", name: "Right on Time", desc: "Caught the thief by Day 4." },
    { id: "independent", icon: "🧠", name: "Independent Thinker", desc: "Finished using 4 or fewer of Sam's hints." },
    { id: "persist", icon: "💪", name: "Never Give Up", desc: "Got a tough question right after 3 or more tries." }
  ];
  var SOURCE_QS = ["sa7", "sl5", "tl2"], MAP_QS = ["sa8", "mapToMose", "fm5", "fm6", "mapToSanLuis"];

  function fresh() {
    return { scene: "intro", coins: START.coins, energy: START.energy, day: START.day, items: {}, clues: [], facts: [], visited: ["staug"], trail: ["staug"],
      loc: "staug", spots: [], deduceTries: 0, shop: {}, oppChoice: null, travelChoice: null, timelineTries: 0, started: Date.now(), decoys: 0,
      log: {}, glossary: [], badges: [], hintsUsed: 0, name: "", runId: "r" + Date.now().toString(36) + Math.floor(Math.random() * 1e4) };
  }
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage may be blocked; the game still works */ } saveReport(); }
  function load() { try { var j = localStorage.getItem(SAVE_KEY); return j ? JSON.parse(j) : null; } catch (e) { return null; } }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
  function reports() { try { return JSON.parse(localStorage.getItem(REPORT_KEY) || "[]"); } catch (e) { return []; } }
  function saveReport(final) {
    if (!S || !S.runId) return;
    var all = reports(), r = all.filter(function (x) { return x.runId === S.runId; })[0];
    if (!r) { r = { runId: S.runId, started: S.started }; all.push(r); }
    r.name = S.name || ""; r.updated = Date.now(); r.scene = S.scene; r.day = S.day; r.coins = S.coins; r.hints = S.hintsUsed; r.badges = S.badges.slice();
    r.glossary = S.glossary.length; r.log = S.log; if (final) { r.finished = true; r.rank = final.rank; r.score = final.score; }
    while (all.length > 60) all.shift();
    try { localStorage.setItem(REPORT_KEY, JSON.stringify(all)); } catch (e) {}
  }

  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function strip(h) { var d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; }
  function addUnique(arr, v) { if (v && arr.indexOf(v) < 0) { arr.push(v); return true; } return false; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hash(str) { var h = 7; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 1000003; return h; }
  function shuffled(n, seed, avoidSorted) { var a = []; for (var i = 0; i < n; i++) a.push(i); var x = seed || 1;
    for (var j = n - 1; j > 0; j--) { x = (x * 9301 + 49297) % 233280; var k = Math.floor(x / 233280 * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; }
    if (avoidSorted && n > 1 && a.every(function (v, i) { return v === i; })) a.reverse();
    return a; }
  function img(key) { return IMAGES[key] ? "assets/img/" + IMAGES[key].file : ""; }
  function thumb(key) { return IMAGES[key] ? "assets/img/" + IMAGES[key].file.replace(".webp", "_s.webp") : ""; }

  /* ---------- read aloud ---------- */
  function speak(text) { if (!("speechSynthesis" in window)) { toast("Read-aloud isn't available on this computer."); return; }
    window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.rate = 0.92; window.speechSynthesis.speak(u); }
  function stopSpeak() { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }

  /* ---------- toast & modal ---------- */
  function toast(msg, cls) { var t = el('<div class="toast ' + (cls || "") + '" role="status">' + msg + '</div>'); document.body.appendChild(t);
    t.style.setProperty("--n", document.querySelectorAll(".toast").length - 1);
    setTimeout(function () { t.classList.add("show"); }, 10);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 2800); }
  var lastFocus = null;
  function modal(title, bodyHtml, buttons, opts) {
    opts = opts || {}; closeModal(true); closeVocab(true);
    lastFocus = document.activeElement;
    var m = el('<div class="modal-back" id="modal"><div class="modal ' + (opts.cls || "") + '" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">' + title + '</h2><div class="modal-body">' + bodyHtml + '</div><div class="modal-btns"></div></div></div>');
    var bb = m.querySelector(".modal-btns");
    (buttons || [{ label: "OK" }]).forEach(function (b) { var btn = el('<button class="btn ' + (b.cls || "") + '">' + b.label + '</button>');
      btn.onclick = function () { SFX.play("click"); closeModal(); if (b.fn) b.fn(); }; bb.appendChild(btn); });
    m.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && opts.escClose && !document.getElementById("vpop")) { e.preventDefault(); closeModal(); return; }
      if (e.key === "Tab") { var f = m.querySelectorAll("button:not(:disabled), [href], input, [tabindex]:not([tabindex='-1'])"); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } });
    document.body.appendChild(m); var fb0 = bb.querySelector("button"); if (fb0 && !opts.noFocus) fb0.focus();
    decorate(m.querySelector(".modal-body"));
    return m; }
  function closeModal(keepFocus) { var m = document.getElementById("modal"); if (m) { m.remove(); if (!keepFocus && lastFocus && document.body.contains(lastFocus)) lastFocus.focus(); } }

  /* ---------- logging (what the Teacher view shows) ---------- */
  function qlog(id) { return S.log[id] || (S.log[id] = { tries: 0, hints: 0, ok: false, first: null, wrong: [], stuck: false, t0: Date.now(), ms: 0 }); }
  function attempt(id, correct, wrongLabel) {
    var L = qlog(id); if (L.ok) return L;
    L.tries++; if (L.first === null) L.first = !!correct;
    if (correct) { L.ok = true; L.ms = Date.now() - L.t0; SFX.play("correct"); if (L.tries >= 3) award("persist"); }
    else { SFX.play("wrong"); if (wrongLabel && L.wrong.length < 8) L.wrong.push(strip(String(wrongLabel)).slice(0, 80)); }
    if (L.tries >= 3 && !L.ok) L.stuck = true;
    if (window.V3) V3.onAttempt(id, !!correct);
    checkBadges(); save(); return L; }
  function firstTry(id) { return S.log[id] && S.log[id].first === true; }

  /* ---------- badges ---------- */
  function award(id) { if (!S || S.badges.indexOf(id) >= 0) return; S.badges.push(id); var b = BADGES.filter(function (x) { return x.id === id; })[0];
    SFX.play("badge"); toast('<span class="toast-badge">' + b.icon + '</span> Badge earned: <b>' + b.name + '</b>', "badge"); if (window.V3) V3.onBadge(id); }
  function checkBadges(final) {
    if (S.clues.length) award("firstclue");
    if (S.clues.indexOf("c_greenhat") >= 0) award("sharpeye");
    if (S.glossary.length >= 10) award("words");
    var readFirst = Object.keys(S.log).filter(function (k) { return SCENES[k] && SCENES[k].passage && S.log[k].first === true; }).length;
    if (readFirst >= 5) award("reader");
    if (SOURCE_QS.every(function (k) { return firstTry(k); })) award("sources");
    if (MAP_QS.every(function (k) { return firstTry(k); }) && S.decoys === 0) award("mapper");
    if (S.log.timeline && S.log.timeline.first === true) award("timeline");
    if (final) { if (S.coins >= 5) award("budget"); if (S.day <= START.deadline) award("ontime"); if (S.hintsUsed <= 4) award("independent"); }
  }

  /* ---------- HUD ---------- */
  function soundBtn() { return '<button class="hud-btn icon" id="snd" aria-pressed="' + SFX.isOn() + '" aria-label="Sound effects ' + (SFX.isOn() ? "on" : "off") + '" title="Sound effects">' + (SFX.isOn() ? "🔊" : "🔇") + '</button>'; }
  function wireSound() { var b = document.getElementById("snd"); if (b) b.onclick = function () { var on = SFX.toggle(); b.innerHTML = on ? "🔊" : "🔇"; b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", "Sound effects " + (on ? "on" : "off")); if (on) SFX.play("pop"); toast(on ? "Sound effects on" : "Sound effects off"); }; }
  function hud(sc) {
    var snack = S.items.snack ? '<button class="hud-btn" id="eat" title="Eat a snack">🍎<span class="lbl"> Snack</span> ×' + S.items.snack + '</button>' : "";
    var late = S.day > START.deadline ? " late" : "";
    var ch = sc && CHAPTERS[sc.chapter] ? '<div class="chap-pill" title="' + esc(CHAPTERS[sc.chapter].name) + '">Ch. ' + sc.chapter + ' • ' + CHAPTERS[sc.chapter].level + '</div>' : "";
    return '<header class="hud"><button class="hud-title" id="menu" aria-label="Menu">☰ <span class="lbl">' + esc(GAME_TITLE) + '</span></button>' + ch +
      '<div class="stats"><div class="stat" title="Coins">🪙 <b id="coins">' + S.coins + '</b></div>' +
      '<div class="stat" title="Energy">⚡ <b>' + S.energy + '</b></div>' +
      (S.relaxed ? '<div class="stat" title="Day (relaxed mode: no deadline)">📅 <b>' + S.day + '</b></div></div>' : '<div class="stat' + late + '" title="Day">📅 <b>' + S.day + '</b>/' + START.deadline + '</div></div>') + snack + (window.V3 ? V3.hudExtra(sc) : "") +
      '<div class="hud-tools"><button class="hud-btn" id="nb" aria-label="Detective Notebook">📓<span class="lbl"> Notebook</span> <span class="count">' + S.clues.length + '</span></button>' +
      '<button class="hud-btn" id="mapbtn" aria-label="Case map">🗺️<span class="lbl"> Map</span></button>' +
      '<button class="hud-btn icon" id="read" aria-label="Read this page aloud" title="Read aloud">🗣️</button>' + soundBtn() + '</div></header>'; }
  function wireHud(readText) {
    var nb = document.getElementById("nb"); if (nb) nb.onclick = function () { notebook(); };
    var mb = document.getElementById("mapbtn"); if (mb) mb.onclick = caseMap;
    var r = document.getElementById("read"); if (r) r.onclick = function () { speak(readText || strip(document.querySelector("main .panel").innerHTML)); };
    var e = document.getElementById("eat"); if (e) e.onclick = function () { S.items.snack--; S.energy = clamp(S.energy + 3, 0, 10); SFX.play("pop"); toast("Yum! +3 energy"); save(); render(); };
    var m = document.getElementById("menu"); if (m) m.onclick = function () { modal("Menu", "<p>Your case is saved automatically on this device.</p>",
      [{ label: "Keep playing" }, { label: "📜 Credits", cls: "ghost", fn: function () { credits(render); } }, { label: "🏠 Title screen", cls: "ghost", fn: title }], { escClose: true }); };
    wireSound(); if (window.V3) V3.wireHudExtra();
  }
  function caseMap() {
    modal("🗺️ Case Map: Your Trail", '<div class="map-mini">' + ART.floridaMap({ current: S.loc, visited: S.visited, trail: S.trail, villain: window.V3 ? V3.pennyLoc() : null }) + '</div><p class="small">The gold line fills in as you travel. ✔ = places you have searched. Stops: ' +
      S.trail.map(function (id) { return LOCATIONS[id].name; }).join(" → ") + '</p>', [{ label: "Close map" }], { escClose: true, cls: "wide" }); }

  /* ---------- vocabulary pop-ups ---------- */
  var vocabRe = null, vpop = null, vTrig = null, vPinned = false, vTimer = null, hoverT = null;
  function buildVocabRe() { var forms = [];
    Object.keys(VOCAB).forEach(function (id) { VOCAB[id].match.forEach(function (m) { forms.push({ id: id, m: m }); }); });
    forms.sort(function (a, b) { return b.m.length - a.m.length; });
    var map = {}; forms.forEach(function (f) { map[f.m.toLowerCase()] = f.id; });
    vocabRe = { src: "\\b(" + forms.map(function (f) { return f.m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\\b", map: map }; }
  function decorate(root) {
    if (!root || typeof VOCAB === "undefined") return; if (!vocabRe) buildVocabRe();
    var used = {}; Array.prototype.forEach.call(root.querySelectorAll(".vocab"), function (v) { used[v.getAttribute("data-v")] = 1; });
    var cur = S && SCENES[S.scene]; ((cur && cur.noVocab) || []).forEach(function (id) { used[id] = 1; }); /* never define the word a question asks about */
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentNode; while (p && p !== root) { if (/^(BUTTON|A|INPUT|TEXTAREA|SELECT|LABEL|H1|H2|H3|SVG|TEXT)$/i.test(p.nodeName) || (p.classList && (p.classList.contains("vocab") || p.classList.contains("no-vocab")))) return NodeFilter.FILTER_REJECT; p = p.parentNode; }
      return NodeFilter.FILTER_ACCEPT; } });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue, re = new RegExp(vocabRe.src, "gi"), m, last = 0, parts = [];
      while ((m = re.exec(text))) { var id = vocabRe.map[m[1].toLowerCase()]; if (!id || used[id]) continue; used[id] = 1;
        parts.push(document.createTextNode(text.slice(last, m.index)));
        var b = document.createElement("button"); b.type = "button"; b.className = "vocab"; b.setAttribute("data-v", id); b.setAttribute("aria-haspopup", "dialog"); b.setAttribute("aria-expanded", "false");
        b.setAttribute("aria-label", m[0] + " (vocabulary word: show meaning)"); b.textContent = m[0]; parts.push(b); last = m.index + m[0].length; }
      if (parts.length) { parts.push(document.createTextNode(text.slice(last))); var frag = document.createDocumentFragment(); parts.forEach(function (p) { frag.appendChild(p); }); node.parentNode.replaceChild(frag, node); } });
  }
  function openVocab(trig, pinned) {
    var id = trig.getAttribute("data-v"), v = VOCAB[id]; if (!v) return;
    clearTimeout(vTimer); if (pinned) clearTimeout(hoverT); closeVocab(true); vTrig = trig; vPinned = pinned;
    var isNew = addUnique(S.glossary, id);
    vpop = el('<div class="vpop" id="vpop" role="dialog" aria-label="Meaning of ' + esc(v.word) + '">' +
      '<button class="vpop-x" aria-label="Close">✕</button>' + (v.img && IMAGES[v.img] ? '<img src="' + thumb(v.img) + '" alt="' + esc(IMAGES[v.img].alt) + '">' : "") +
      '<div class="vpop-txt"><b class="vpop-word">' + esc(v.word) + '</b><p>' + esc(v.def) + '</p><div class="vpop-note">📚 ' + (isNew ? "Added to your Glossary!" : "In your Glossary") + '</div></div></div>');
    if (!pinned) vpop.classList.add("preview");
    document.body.appendChild(vpop);
    var r = trig.getBoundingClientRect(), pw = vpop.offsetWidth, ph = vpop.offsetHeight, vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var left = clamp(r.left + r.width / 2 - pw / 2, 8, vw - pw - 8), top = r.bottom + 8;
    if (top + ph > vh - 8 && r.top - ph - 8 > 8) top = r.top - ph - 8;
    vpop.style.left = left + window.scrollX + "px"; vpop.style.top = top + window.scrollY + "px";
    trig.setAttribute("aria-expanded", "true"); trig.classList.add("open");
    vpop.querySelector(".vpop-x").onclick = function (e) { e.stopPropagation(); closeVocab(); };
    vpop.addEventListener("click", function (e) { e.stopPropagation(); if (window.matchMedia && !window.matchMedia("(hover: hover)").matches) closeVocab(); });
    vpop.addEventListener("mouseenter", function () { clearTimeout(vTimer); });
    vpop.addEventListener("mouseleave", function () { if (!vPinned) vTimer = setTimeout(closeVocab, 250); });
    vpop.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeVocab(); } if (e.key === "Tab") { e.preventDefault(); closeVocab(); } });
    if (pinned) vpop.querySelector(".vpop-x").focus({ preventScroll: true });
    if (isNew) { SFX.play("pop"); checkBadges(); save(); }
  }
  function closeVocab(silent) { clearTimeout(vTimer); if (vpop) { vpop.remove(); vpop = null; }
    if (vTrig) { vTrig.setAttribute("aria-expanded", "false"); vTrig.classList.remove("open"); if (!silent && vPinned && document.body.contains(vTrig)) vTrig.focus({ preventScroll: true }); vTrig = null; } }
  function wireVocabGlobal() {
    document.addEventListener("click", function (e) { var t = e.target.closest ? e.target.closest(".vocab") : null;
      if (t) { e.preventDefault(); if (vTrig === t && vPinned) closeVocab(); else openVocab(t, true); return; }
      if (vpop && !vpop.contains(e.target)) closeVocab(true); });
    /* hover = a quick, non-blocking preview (pointer-events: none); click or Enter pins it open */
    document.addEventListener("mouseover", function (e) { if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      var t = e.target.closest ? e.target.closest(".vocab") : null; if (!t) return; clearTimeout(vTimer);
      if (t !== vTrig && !(vPinned && vpop)) { clearTimeout(hoverT); hoverT = setTimeout(function () { if (document.body.contains(t) && !(vPinned && vpop)) openVocab(t, false); }, 300); } });
    document.addEventListener("mouseout", function (e) { var t = e.target.closest ? e.target.closest(".vocab") : null; if (!t) return; clearTimeout(hoverT); if (!vPinned) vTimer = setTimeout(function () { closeVocab(true); }, 150); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && vpop) closeVocab(); });
    window.addEventListener("resize", function () { closeVocab(true); });
  }

  /* ---------- detective partner (Socratic questions only, never answers) ---------- */
  var SAM_WRONG = ["Hmm, not yet. Want me to ask you a question to help? Tap Ask Sam.", "Good try! Detectives check the evidence again. What does the text say?",
    "That's okay. Mistakes help us learn. Let's look closer together."];
  function partnerHtml(sc) {
    if (!sc.hints || !sc.hints.length) return "";
    var L = S.log[S.scene], used = L ? L.hints : 0;
    return '<aside class="partner" aria-label="Detective ' + PARTNER_NAME + '"><div class="partner-face" aria-hidden="true">🔍</div><div class="partner-main">' +
      '<div class="partner-name">Detective ' + PARTNER_NAME + '</div><div class="partner-bubble" id="partner-bubble" aria-live="polite">' +
      (used ? esc(sc.hints[used - 1]) : "I'm right here if you get stuck. I'll ask you questions to help you think, but you'll find the answer!") + '</div>' +
      '<button class="btn sm partner-ask" id="ask"' + (used >= sc.hints.length ? " disabled" : "") + '>' + askLabel(used, sc.hints.length) + '</button></div></aside>'; }
  function askLabel(used, n) { return used >= n ? PARTNER_NAME + " asked all " + n + " questions. Re-read and try!" : "🔍 Ask " + PARTNER_NAME + " (question " + (used + 1) + " of " + n + ")"; }
  function wirePartner(sc) {
    var b = document.getElementById("ask"); if (!b) return;
    b.onclick = function () { var L = qlog(S.scene); if (L.hints >= sc.hints.length) return;
      L.hints++; S.hintsUsed++; SFX.play("hint");
      var bub = document.getElementById("partner-bubble"); bub.textContent = sc.hints[L.hints - 1]; bub.classList.remove("pop"); void bub.offsetWidth; bub.classList.add("pop");
      b.textContent = askLabel(L.hints, sc.hints.length); b.disabled = L.hints >= sc.hints.length; save(); }; }
  function partnerSay(msg) { var bub = document.getElementById("partner-bubble"); if (!bub) return; bub.textContent = msg; bub.classList.remove("pop"); void bub.offsetWidth; bub.classList.add("pop"); }
  function partnerWrong(L) { if (!L) return; if (L.tries === 3) partnerSay("This one is tricky! I'm writing it in our case notes so your teacher can help. Let's keep thinking. " + (L.hints < 3 ? "Tap Ask " + PARTNER_NAME + " for a question." : "Re-read slowly."));
    else partnerSay(SAM_WRONG[(L.tries - 1) % SAM_WRONG.length]); }

  /* ---------- page frame: real photo background with slow Ken Burns pan ---------- */
  var DEFAULT_BG = { office: "pelican", staug: "castillo_aerial", mose: "mose_pano", sanluis: "sl_grounds" };
  function photoBg(key, seed) { var I = IMAGES[key]; if (!I) return "";
    return '<div class="bg"><img class="kb kb' + (seed % 4) + '" src="' + img(key) + '" alt="' + esc(I.alt) + '" width="' + I.w + '" height="' + I.h + '"></div>'; }
  function captionChip(key) { var I = IMAGES[key]; if (!I) return "";
    return '<button class="cap-chip" data-img="' + key + '" aria-label="About this photo: ' + esc(I.caption) + '">📷 <span>' + esc(I.caption) + '</span><i> ' + esc(I.author.split(",")[0]) + ', ' + esc(I.license) + '</i></button>'; }
  function imageInfo(key) { var I = IMAGES[key];
    modal("📷 About this picture", '<img class="info-img" src="' + img(key) + '" alt="' + esc(I.alt) + '"><p>' + esc(I.caption) + '</p><p class="small"><b>Source:</b> ' + esc(I.title) + '<br><b>By:</b> ' + esc(I.author) +
      '<br><b>License:</b> ' + (I.licenseUrl ? '<a href="' + esc(I.licenseUrl) + '" target="_blank" rel="noopener">' + esc(I.license) + '</a>' : esc(I.license)) +
      '<br><b>From:</b> <a href="' + esc(I.page) + '" target="_blank" rel="noopener">' + esc(I.page.replace(/^https?:\/\//, "").slice(0, 60)) + '…</a><br><b>Changes:</b> ' + esc(I.changes) + '</p>', [{ label: "Close" }], { escClose: true }); }
  function frame(sc, inner, opts) {
    opts = opts || {};
    var key = opts.img || sc.img || DEFAULT_BG[sc.loc] || "castillo_aerial";
    var L = LOCATIONS[sc.loc];
    var place = L ? '<div class="place-tag">📍 ' + L.name + (L.sub ? '<span> — ' + L.sub + '</span>' : "") + '</div>' : (sc.loc === "office" ? '<div class="place-tag">📍 Florida History Detective Agency</div>' : "");
    app.innerHTML = hud(sc) + photoBg(key, hash(S.scene)) + '<main class="scene' + (opts.wide ? " wide" : "") + '"><div class="photo-gap">' + place + captionChip(key) + '</div>' +
      '<section class="panel" aria-labelledby="scene-title"><h2 id="scene-title" tabindex="-1">' + sc.title + '</h2>' + inner + partnerHtml(sc) + '</section></main>';
    var cc = app.querySelector(".cap-chip"); if (cc) cc.onclick = function () { imageInfo(cc.getAttribute("data-img")); };
    wirePartner(sc); decorate(app.querySelector(".panel"));
    if (window.V3) V3.afterFrame(sc);
  }
  function nextBtn(label, fn, where) { var c = where || document.getElementById("ch"); c.innerHTML = ""; var n = el('<button class="btn primary choice" id="next">' + label + '</button>');
    n.onclick = function () { SFX.play("click"); fn(); }; c.appendChild(n); n.focus({ preventScroll: true }); return n; }
  function fb(cls, html) { var f = document.getElementById("fb"); f.className = "feedback " + cls; f.innerHTML = html; decorate(f); }

  /* ---------- notebook ---------- */
  function notebook(tab) {
    var place = S.clues.filter(function (c) { return CLUES[c].kind === "place"; }).map(function (c) { return "<li>📍 " + CLUES[c].text + "</li>"; }).join("") || "<li><i>No place clues yet.</i></li>";
    var sus = S.clues.filter(function (c) { return CLUES[c].kind === "suspect"; }).map(function (c) { return "<li>🕵️ " + CLUES[c].text + "</li>"; }).join("") || "<li><i>No suspect clues yet.</i></li>";
    var facts = S.facts.map(function (f) { return "<li>" + FACTS[f].text + "</li>"; }).join("") || "<li><i>Facts you learn will appear here.</i></li>";
    var suspects = SUSPECTS.map(function (s) { return '<div class="sus-mini">' + ART.suspect(s, 70) + '<div><b>' + s.name + '</b><br>🎩 ' + s.hat + '<br>🎒 ' + s.carry + '<br>✒️ ' + s.ink + '</div></div>'; }).join("");
    var gl = S.glossary.slice().sort(function (a, b) { return VOCAB[a].word.localeCompare(VOCAB[b].word); }).map(function (id) { var v = VOCAB[id];
      return '<li class="gl-item">' + (v.img && IMAGES[v.img] ? '<img src="' + thumb(v.img) + '" alt="" loading="lazy">' : '<span class="gl-noimg" aria-hidden="true">📘</span>') + '<div><b>' + esc(v.word) + '</b><br>' + esc(v.def) + '</div></li>'; }).join("") ||
      "<li><i>Tap the <span class='vocab demo'>dotted words</span> in the story to collect them here.</i></li>";
    var bd = BADGES.map(function (b) { var got = S.badges.indexOf(b.id) >= 0; return '<li class="badge' + (got ? " got" : "") + '"><span class="b-ic" aria-hidden="true">' + (got ? b.icon : "🔒") + '</span><div><b>' + b.name + '</b>' + (got ? " ✔" : "") + '<br><span class="small">' + b.desc + '</span></div></li>'; }).join("");
    var tabs = [["clues", "Clues", S.clues.length], ["sus", "Dossiers"], ["facts", "Facts", S.facts.length], ["glossary", "Glossary", S.glossary.length], ["badges", "Badges", S.badges.length]];
    tab = tab || "clues";
    modal("📓 Detective Notebook",
      '<div class="nb-tabs" role="tablist">' + tabs.map(function (t) { return '<button class="tab" role="tab" data-t="' + t[0] + '">' + t[1] + (t[2] != null ? " (" + t[2] + ")" : "") + '</button>'; }).join("") + '</div>' +
      '<div class="nb-pane" data-p="clues"><h3>Where is the thief going?</h3><ul>' + place + '</ul><h3>Who is the thief?</h3><ul>' + sus + '</ul></div>' +
      '<div class="nb-pane" data-p="sus">' + (window.V3 ? V3.dossierHtml() : '<p>Compare these (made-up) suspects with your clues.</p><div class="sus-grid-mini">' + suspects + '</div>') + '</div>' +
      '<div class="nb-pane" data-p="facts"><ul class="facts">' + facts + '</ul></div>' +
      '<div class="nb-pane no-vocab" data-p="glossary"><ul class="glossary">' + gl + '</ul></div>' +
      '<div class="nb-pane no-vocab" data-p="badges"><ul class="badges">' + bd + '</ul></div>', [{ label: "Close notebook" }], { escClose: true, cls: "wide", noFocus: true });
    var show = function (t) { document.querySelectorAll("#modal .tab").forEach(function (x) { var on = x.getAttribute("data-t") === t; x.classList.toggle("on", on); x.setAttribute("aria-selected", on); });
      document.querySelectorAll("#modal .nb-pane").forEach(function (p) { p.classList.toggle("hidden", p.getAttribute("data-p") !== t); }); };
    if (window.V3) V3.wireDossiers(document.getElementById("modal"));
    show(tab); document.querySelectorAll("#modal .tab").forEach(function (t) { t.onclick = function () { show(t.getAttribute("data-t")); }; });
    var first = document.querySelector("#modal .tab.on"); if (first) first.focus();
  }

  /* ---------- energy / effects / navigation ---------- */
  function applyEffect(e) { if (!e) return; if (e.coins) S.coins = Math.max(0, S.coins + e.coins); if (e.energy) S.energy = clamp(S.energy + e.energy, 0, 10); if (e.days) S.day += e.days; }
  function checkTired(then) {
    if (S.energy > 0) { then(); return; }
    if (S.items.snack) { modal("😴 You're out of energy!", "<p>You eat a snack from your backpack. <b>+3 energy</b>.</p>", [{ label: "Keep going", fn: function () { S.items.snack--; S.energy = 3; save(); then(); } }]); return; }
    modal("😴 You're out of energy!", "<p>You have no energy and no snacks. You rest at a campground overnight.</p><p><b>+1 day, energy back to 3.</b></p><p class='tip'>Tip: snacks cost coins, but they can save you time!</p>",
      [{ label: "Rest and continue", fn: function () { S.day += 1; S.energy = 3; save(); then(); } }]);
  }
  function go(id) { stopSpeak(); closeVocab(true); var prev = SCENES[S.scene]; S.scene = id; var sc = SCENES[id]; enter(sc); save(); render(); window.scrollTo(0, 0);
    if (sc && prev && sc.chapter && sc.chapter !== prev.chapter && CHAPTERS[sc.chapter]) chapterBanner(sc.chapter);
    if (window.V3) V3.afterGo(prev, sc, id); }
  function chapterBanner(n) { SFX.play("travel"); document.querySelectorAll(".chapter-banner").forEach(function (x) { x.remove(); }); var b = el('<div class="chapter-banner" role="status"><div>' + CHAPTERS[n].name + '</div><small>Level: ' + CHAPTERS[n].level + '</small></div>');
    document.body.appendChild(b); setTimeout(function () { b.classList.add("show"); }, 20); setTimeout(function () { b.classList.remove("show"); setTimeout(function () { b.remove(); }, 500); }, 2200); }
  function enter(sc) { if (!sc) return; if (sc.loc && LOCATIONS[sc.loc]) S.loc = sc.loc;
    var got = 0; [sc.clue, sc.clue2].forEach(function (c) { if (addUnique(S.clues, c)) got++; });
    (sc.facts || []).forEach(function (f) { addUnique(S.facts, f); });
    if (sc.camera && S.items.camera && addUnique(S.clues, sc.camera.clue)) got++;
    if (sc.flashlight && S.items.flashlight && addUnique(S.clues, sc.flashlight.clue)) got++;
    if (got) SFX.play("clue"); if (sc.hints) qlog(S.scene); checkBadges(); }

  /* ---------- render dispatch ---------- */
  function render() {
    closeVocab(true); var sc = SCENES[S.scene]; if (!sc) { title(); return; }
    var t = sc.type || "story";
    if (window.V3 && V3.scenes[t]) return V3.scenes[t](sc);
    if (t === "story") return storyScene(sc);
    if (t === "q") return qScene(sc);
    if (t === "hub") return hubScene(sc);
    if (t === "shop") return shopScene(sc);
    if (t === "oppcost") return oppScene(sc);
    if (t === "inset") return insetScene(sc);
    if (t === "map") return mapScene(sc);
    if (t === "mapq") return mapQScene(sc);
    if (t === "scaleq") return scaleScene(sc);
    if (t === "travel") return travelScene(sc);
    if (t === "deduction") return deductionScene(sc);
    if (t === "timeline") return timelineScene(sc);
    if (t === "win") return winScene(sc);
  }
  function paras(sc) { return (sc.text || []).map(function (p) { return "<p>" + p + "</p>"; }).join(""); }
  function speakerHtml(sc) { return sc.speaker ? '<div class="speaker">' + sc.speaker + ' says:</div>' : ""; }

  function storyScene(sc) {
    var p = paras(sc);
    if (sc.camera) p += S.items.camera ? '<p class="bonus">' + sc.camera.text + '</p>' : '<p class="hint">💭 If you had a camera, you might spot tiny clues here…</p>';
    if (sc.flashlight) p += S.items.flashlight ? '<p class="bonus">' + sc.flashlight.text + '</p>' : '<p class="hint">💭 It\'s dark under the benches. A flashlight would help…</p>';
    frame(sc, speakerHtml(sc) + p + '<div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var ch = document.getElementById("ch");
    sc.choices.forEach(function (c) { var b = el('<button class="btn choice">' + c.label + '</button>');
      b.onclick = function () { SFX.play("click"); applyEffect(c.effect); checkTired(function () { go(c.next); }); }; ch.appendChild(b); });
    wireHud(strip(speakerHtml(sc) + p + sc.choices.map(function (c) { return c.label + ". "; }).join(" ")));
  }

  /* ---------- reading passages ---------- */
  function linkify(t) { return t.replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>'); }
  function passageHtml(P, asButtons) {
    var sent = function (list, base) { return list.map(function (t, i) { var k = base + i;
      return asButtons ? '<button class="ev-sent" data-i="' + k + '" aria-pressed="false"><span class="ev-n">' + (k + 1) + '</span> ' + esc(t) + '</button>' : '<span class="sent">' + esc(t) + '</span> '; }).join(""); };
    var body;
    if (P.texts) { var base = 0; body = '<div class="two-texts">' + P.texts.map(function (T) { var h = '<div class="text-col"><h4>' + esc(T.label) + '</h4>' + (T.note ? '<p class="small">' + esc(T.note) + '</p>' : "") +
        '<div class="ptext' + (asButtons ? " ev" : "") + '">' + sent(T.sentences, base) + '</div><p class="src">' + linkify(esc(T.from)) + '</p></div>'; base += T.sentences.length; return h; }).join("") + '</div>'; }
    else body = '<div class="ptext' + (asButtons ? " ev" : "") + '">' + sent(P.sentences, 0) + '</div><p class="src">Source: ' + linkify(esc(P.source)) + '</p>';
    return '<article class="passage" aria-label="Reading passage: ' + esc(P.title) + '"><div class="p-kind">📖 ' + esc(P.kind) + '</div><h3>' + esc(P.title) + '</h3>' + body + '</article>'; }

  /* ---------- typed answers: forgiving keyword check ---------- */
  function norm(t) { return String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean); }
  function lev(a, b) { var m = a.length, n = b.length, d = [], i, j; for (i = 0; i <= m; i++) d[i] = [i]; for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
  function wordHit(words, key) { return words.some(function (w) { if (w === key) return true; if (key.length >= 4 && w.indexOf(key) === 0 && w.length - key.length <= 3) return true;
    var tol = key.length >= 8 ? 2 : key.length >= 4 ? 1 : 0; return tol > 0 && Math.abs(w.length - key.length) <= tol && lev(w, key) <= tol; }); }
  function groupsHit(words, groups) { return (groups || []).some(function (g) { return g.every(function (k) { return wordHit(words, k); }); }); }
  function checkTyped(q, text) { var w = norm(text); if (!w.length) return "empty"; if (groupsHit(w, q.accept)) return "ok"; if (groupsHit(w, q.partial)) return "partial"; return "no"; }

  /* ---------- question scenes ---------- */
  function qScene(sc) {
    var q = sc.q, P = sc.passage ? PASSAGES[sc.passage] : null, id = S.scene, L = qlog(id);
    var ela = sc.ela ? '<div class="ela-tag">📖 Reading skill</div>' : "";
    var top = speakerHtml(sc) + paras(sc) + (P && q.kind !== "evidence" ? passageHtml(P, false) : "");
    var widget = q.kind === "evidence" ? '<div class="claim">🔎 <b>' + esc(q.claim) + '</b></div>' + passageHtml(P, true) : "";
    frame(sc, ela + top + '<div class="prompt" id="prompt">❓ ' + q.prompt + '</div>' + widget + '<div class="qwidget" id="qw"></div>' +
      '<div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div><div class="choices" id="ch2"></div>', { wide: !!P });
    var api = { sc: sc, q: q, id: id, L: L, done: false };
    api.success = function (msg) { api.done = true; attempt(id, true); fb("good", "✅ " + msg); partnerSay(L.hints === 0 && L.tries === 1 ? "Wow, you got it on your own! Great detective work." : "You figured it out! See? You just needed to look closer.");
      document.getElementById("ch2").innerHTML = ""; app.querySelectorAll(".qwidget button, .ev-sent, #typed").forEach(function (b) { b.disabled = true; });
      nextBtn("Continue ➜", function () { go(sc.next); }); };
    api.fail = function (msg, label) { attempt(id, false, label); fb("try", "🤔 " + msg); partnerWrong(L); if (L.tries >= 4 && api.reveal) offerReveal(api); };
    ({ mc: qMC, multi: qMulti, order: qOrder, match: qMatch, typed: qTyped, evidence: qEvidence })[q.kind](api);
    if (L.tries >= 4 && !L.ok && api.reveal) offerReveal(api);
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }
  function offerReveal(api) { var c = document.getElementById("ch2"); if (c.querySelector("#reveal")) return;
    var b = el('<button class="btn ghost" id="reveal">🧭 Show me how, so I can keep going</button>'); c.appendChild(b);
    b.onclick = function () { api.L.revealed = true; api.L.stuck = true; save(); api.reveal(); api.done = true; c.innerHTML = "";
      app.querySelectorAll(".qwidget button, .ev-sent, #typed").forEach(function (x) { x.disabled = true; });
      partnerSay("Now you've seen it. Read it once more so you remember it next time!"); nextBtn("Continue ➜", function () { go(api.sc.next); }); }; }

  function qMC(api) { var q = api.q, ch = document.getElementById("ch"), order = shuffled(q.choices.length, hash(api.id));
    order.forEach(function (i) { var c = q.choices[i]; var b = el('<button class="btn choice" data-i="' + i + '">' + c.label + '</button>');
      b.onclick = function () { if (c.correct) { api.success(c.feedback); return; } b.disabled = true; b.classList.add("wrong"); api.fail(c.feedback + " <b>Try again!</b>", c.label); }; ch.appendChild(b); }); }

  function qMulti(api) { var q = api.q, w = document.getElementById("qw"), order = shuffled(q.options.length, hash(api.id) + 3), sel = {};
    w.innerHTML = '<div class="opts" role="group" aria-label="Select all that apply">' + order.map(function (i) { return '<button class="opt" role="checkbox" aria-checked="false" data-i="' + i + '"><span class="box" aria-hidden="true"></span>' + q.options[i].label + '</button>'; }).join("") + '</div>' +
      '<div class="q-actions"><button class="btn primary" id="check" disabled>Check my answer</button><span class="small" id="selcount">0 selected</span></div>';
    var check = document.getElementById("check");
    var upd = function () { var n = Object.keys(sel).filter(function (k) { return sel[k]; }).length; check.disabled = n === 0 || api.done; document.getElementById("selcount").textContent = n + " selected"; };
    w.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { if (api.done) return; var i = b.getAttribute("data-i"); sel[i] = !sel[i]; b.setAttribute("aria-checked", !!sel[i]); b.classList.toggle("on", !!sel[i]); b.classList.remove("wrong"); SFX.play("click"); upd(); }; });
    check.onclick = function () { var right = 0, wrong = [], need = 0;
      q.options.forEach(function (o, i) { if (o.correct) { need++; if (sel[i]) right++; } else if (sel[i]) wrong.push(i); });
      if (right === need && !wrong.length) { w.querySelectorAll(".opt.on").forEach(function (b) { b.classList.add("right"); }); api.success(q.feedback); return; }
      var msg = "You found <b>" + right + "</b> correct answer" + (right === 1 ? "" : "s") + ". ";
      wrong.forEach(function (i) { var b = w.querySelector('.opt[data-i="' + i + '"]'); b.classList.add("wrong"); b.classList.remove("on"); b.setAttribute("aria-checked", "false"); sel[i] = false;
        msg += "<br>❌ <b>" + strip(q.options[i].label) + "</b>: " + (q.options[i].why || "That one doesn't fit. Re-read the text."); });
      if (right < need) msg += "<br>There " + (need - right === 1 ? "is still one more correct answer" : "are still more correct answers") + " to find.";
      upd(); api.fail(msg, wrong.map(function (i) { return strip(q.options[i].label); }).join(" + ") || "missed some"); };
    api.reveal = function () { q.options.forEach(function (o, i) { var b = w.querySelector('.opt[data-i="' + i + '"]'); b.classList.toggle("on", !!o.correct); b.classList.toggle("right", !!o.correct); b.classList.remove("wrong"); });
      fb("good", "🧭 The correct answers are checked in green. " + q.feedback); }; }

  /* drag-to-order list: pointer events work for mouse, pen and touch; ▲▼ buttons work for keyboards */
  function orderList(container, items, onChange) {
    var ol = el('<ol class="order-list"></ol>');
    items.forEach(function (it) { ol.appendChild(el('<li class="order-item" data-k="' + it.k + '"><span class="grip" aria-hidden="true">⠿</span><span class="o-txt">' + it.html + '</span>' +
      '<span class="o-btns"><button class="o-up" aria-label="Move up">▲</button><button class="o-down" aria-label="Move down">▼</button></span></li>')); });
    container.appendChild(ol);
    var announce = el('<div class="sr-only" aria-live="polite"></div>'); container.appendChild(announce);
    var labelOf = function (li) { return li.querySelector(".o-txt").textContent; };
    var posOf = function (li) { return Array.prototype.indexOf.call(ol.children, li) + 1; };
    var move = function (li, dir) { if (ol.classList.contains("locked")) return; var sib = dir < 0 ? li.previousElementSibling : li.nextElementSibling; if (!sib) return;
      if (dir < 0) ol.insertBefore(li, sib); else ol.insertBefore(sib, li); SFX.play("click");
      announce.textContent = labelOf(li) + " moved to position " + posOf(li); if (onChange) onChange(); };
    Array.prototype.forEach.call(ol.children, function (li) {
      li.querySelector(".o-up").onclick = function (e) { e.stopPropagation(); move(li, -1); li.querySelector(".o-up").focus(); };
      li.querySelector(".o-down").onclick = function (e) { e.stopPropagation(); move(li, 1); li.querySelector(".o-down").focus(); };
      li.addEventListener("pointerdown", function (e) {
        if (ol.classList.contains("locked") || e.target.closest("button") || (e.pointerType === "mouse" && e.button !== 0)) return;
        e.preventDefault(); var startY = e.clientY, pid = e.pointerId; try { li.setPointerCapture(pid); } catch (er) {}
        li.classList.add("dragging"); ol.classList.add("is-dragging");
        var onMove = function (ev) { if (ev.pointerId !== pid) return; ev.preventDefault();
          li.style.transform = "translateY(" + (ev.clientY - startY) + "px)";
          var prev = li.previousElementSibling, next = li.nextElementSibling, r = li.getBoundingClientRect(), mid = r.top + r.height / 2, before;
          if (prev) { var pr = prev.getBoundingClientRect(); if (mid < pr.top + pr.height / 2) { before = li.offsetTop; ol.insertBefore(li, prev); startY -= before - li.offsetTop; li.style.transform = "translateY(" + (ev.clientY - startY) + "px)"; return; } }
          if (next) { var nr = next.getBoundingClientRect(); if (mid > nr.top + nr.height / 2) { before = li.offsetTop; ol.insertBefore(next, li); startY += li.offsetTop - before; li.style.transform = "translateY(" + (ev.clientY - startY) + "px)"; } } };
        var onUp = function (ev) { if (ev.pointerId !== pid) return; li.style.transform = ""; li.classList.remove("dragging"); ol.classList.remove("is-dragging");
          li.removeEventListener("pointermove", onMove); li.removeEventListener("pointerup", onUp); li.removeEventListener("pointercancel", onUp);
          announce.textContent = labelOf(li) + " is now number " + posOf(li); SFX.play("pop"); if (onChange) onChange(); };
        li.addEventListener("pointermove", onMove); li.addEventListener("pointerup", onUp); li.addEventListener("pointercancel", onUp); }); });
    return { ol: ol, order: function () { return Array.prototype.map.call(ol.children, function (li) { return +li.getAttribute("data-k"); }); },
      set: function (keys) { keys.forEach(function (k) { ol.appendChild(ol.querySelector('[data-k="' + k + '"]')); }); },
      mark: function () { Array.prototype.forEach.call(ol.children, function (li, i) { li.classList.toggle("inplace", +li.getAttribute("data-k") === i); }); },
      unmark: function () { Array.prototype.forEach.call(ol.children, function (li) { li.classList.remove("inplace"); }); },
      lock: function () { ol.classList.add("locked"); ol.querySelectorAll("button").forEach(function (b) { b.disabled = true; }); } }; }

  function qOrder(api) { var q = api.q, w = document.getElementById("qw"), n = q.items.length, start = shuffled(n, hash(api.id) + 11, true), list;
    list = orderList(w, start.map(function (k) { return { k: k, html: esc(q.items[k]) }; }), function () { list.unmark(); });
    w.appendChild(el('<div class="q-actions"><button class="btn primary" id="check">Check my order</button></div>'));
    document.getElementById("check").onclick = function () { var o = list.order(), right = o.filter(function (v, i) { return v === i; }).length;
      if (right === n) { list.mark(); list.lock(); api.success("Perfect order! Earliest to latest: you read the years like a historian."); return; }
      list.mark(); api.fail("<b>" + right + " of " + n + "</b> cards are in the right spot (they turned green). Look at the years again and move the others.", "order: " + o.map(function (k) { return q.items[k].split(":")[0]; }).join(", ")); };
    api.reveal = function () { list.set(q.items.map(function (_, i) { return i; })); list.mark(); list.lock(); fb("good", "🧭 Here is the correct order, from earliest (top) to latest (bottom)."); }; }

  function qMatch(api) { var q = api.q, w = document.getElementById("qw"), n = q.pairs.length, poolOrder = shuffled(n, hash(api.id) + 5, true), assign = {}, locked = {}, selected = null;
    w.innerHTML = '<div class="match"><div class="match-pool" id="pool" aria-label="Clues"></div><div class="match-targets">' +
      q.pairs.map(function (p, k) { return '<div class="match-target" data-k="' + k + '" role="button" tabindex="0" aria-label="Place: ' + esc(p.place) + '"><div class="mt-name">📍 ' + esc(p.place) + '</div><div class="mt-slot"></div></div>'; }).join("") + '</div></div>' +
      '<div class="q-actions"><button class="btn primary" id="check" disabled>Check my matches</button></div>';
    var pool = document.getElementById("pool"), check = document.getElementById("check");
    var chip = function (k) { return '<button class="match-chip' + (selected === k ? " sel" : "") + (locked[k] ? " ok" : "") + '" data-k="' + k + '" aria-pressed="' + (selected === k) + '">' + esc(q.pairs[k].clue) + '</button>'; };
    var draw = function () {
      pool.innerHTML = poolOrder.filter(function (k) { return assign[k] == null; }).map(chip).join("") || '<p class="small">All clues placed. Tap a clue to take it back.</p>';
      w.querySelectorAll(".match-target").forEach(function (t) { var tk = +t.getAttribute("data-k"), here = Object.keys(assign).filter(function (k) { return assign[k] === tk; });
        t.querySelector(".mt-slot").innerHTML = here.map(function (k) { return chip(+k); }).join(""); t.classList.toggle("filled", here.length > 0); t.classList.toggle("ready", selected != null); });
      check.disabled = Object.keys(assign).length < n || api.done; wire(); };
    var place = function (k, tk) {
      if (Object.keys(assign).some(function (x) { return assign[x] === tk && locked[x]; })) { toast("That place is already solved!"); selected = null; draw(); return; }
      Object.keys(assign).filter(function (x) { return assign[x] === tk; }).forEach(function (x) { delete assign[x]; });
      assign[k] = tk; selected = null; SFX.play("pop"); draw(); };
    var wire = function () {
      w.querySelectorAll(".match-chip").forEach(function (c) { var k = +c.getAttribute("data-k");
        c.addEventListener("pointerdown", function (e) { if (api.done || locked[k] || (e.pointerType === "mouse" && e.button !== 0)) return;
          var sx = e.clientX, sy = e.clientY, ghost = null, pid = e.pointerId; try { c.setPointerCapture(pid); } catch (er) {}
          var mv = function (ev) { if (ev.pointerId !== pid) return; if (!ghost && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 8) {
              ghost = c.cloneNode(true); ghost.className = "match-chip ghost"; ghost.style.width = c.offsetWidth + "px"; document.body.appendChild(ghost); c.classList.add("lifted"); }
            if (ghost) { ev.preventDefault(); ghost.style.left = ev.clientX - c.offsetWidth / 2 + "px"; ghost.style.top = ev.clientY - 20 + "px";
              var under = document.elementFromPoint(ev.clientX, ev.clientY), tg = under && under.closest(".match-target");
              w.querySelectorAll(".match-target").forEach(function (t) { t.classList.toggle("over", t === tg); }); } };
          var up = function (ev) { if (ev.pointerId !== pid) return; c.removeEventListener("pointermove", mv); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up);
            if (ghost) { ghost.remove(); c.classList.remove("lifted"); c._dragged = true;
              var under = document.elementFromPoint(ev.clientX, ev.clientY), tg = under && under.closest(".match-target");
              w.querySelectorAll(".match-target").forEach(function (t) { t.classList.remove("over"); });
              if (tg) place(k, +tg.getAttribute("data-k")); else if (assign[k] != null) { delete assign[k]; draw(); } } };
          c.addEventListener("pointermove", mv); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up); });
        c.onclick = function (e) { e.stopPropagation(); if (c._dragged || api.done || locked[k]) return;
          if (assign[k] != null) { delete assign[k]; selected = k; } else selected = selected === k ? null : k; SFX.play("click"); draw();
          var again = w.querySelector('.match-chip[data-k="' + k + '"]'); if (again) again.focus(); }; });
      w.querySelectorAll(".match-target").forEach(function (t) { var act = function () { if (api.done) return; if (selected != null) place(selected, +t.getAttribute("data-k")); else toast("First tap a clue, then tap its place."); };
        t.onclick = act; t.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }; }); };
    check.onclick = function () { var right = 0, wrongL = [];
      Object.keys(assign).forEach(function (k) { if (+k === assign[k]) { locked[k] = true; right++; } else { wrongL.push(q.pairs[k].clue.slice(0, 28) + " → " + q.pairs[assign[k]].place); delete assign[k]; } });
      if (right === n) { api.done = true; draw(); w.querySelectorAll(".match-target").forEach(function (t) { t.classList.add("ok"); }); api.success("Every clue matches its place. Case board organized!"); return; }
      draw(); api.fail("<b>" + right + " of " + n + "</b> matches are right (they stay locked in green). The others went back to the clue pile. Try again!", wrongL.join("; ")); };
    api.reveal = function () { q.pairs.forEach(function (_, k) { assign[k] = k; locked[k] = true; }); api.done = true; draw(); fb("good", "🧭 Here are the correct matches."); };
    draw(); }

  function qTyped(api) { var q = api.q, w = document.getElementById("qw");
    w.innerHTML = '<label class="typed-lbl" for="typed">Your answer:</label><div class="typed-row"><input id="typed" type="text" autocomplete="off" autocapitalize="sentences" spellcheck="true" maxlength="160" placeholder="Type here…"><button class="btn primary" id="check">Check</button></div>' +
      '<p class="small">Spelling doesn\'t have to be perfect. Use words from the text!</p>';
    var inp = document.getElementById("typed"), check = document.getElementById("check");
    var submit = function () { if (api.done) return; var r = checkTyped(q, inp.value);
      if (r === "empty") { fb("try", "✏️ Type an answer first, detective!"); inp.focus(); return; }
      if (r === "ok") { api.success(q.feedback); return; }
      if (r === "partial") { api.fail(q.partialMsg, inp.value); inp.focus(); return; }
      api.fail("Hmm, I don't see the answer in that yet. Look back at the text, then try different words.", inp.value); inp.focus(); };
    check.onclick = submit; inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } };
    api.reveal = function () { inp.value = q.sample; fb("good", "🧭 Here is one good answer: <b>" + esc(q.sample) + "</b>"); }; }

  function qEvidence(api) { var q = api.q, sel = [], w = document.getElementById("qw"), sents = app.querySelectorAll(".ev-sent");
    w.innerHTML = '<div class="q-actions"><button class="btn primary" id="check" disabled>Check my evidence</button><span class="small" id="selcount">Pick ' + q.pick + '</span></div>';
    var check = document.getElementById("check");
    var upd = function () { check.disabled = sel.length !== q.pick || api.done; document.getElementById("selcount").textContent = sel.length + " of " + q.pick + " picked"; };
    var setOn = function (i, on) { var b = app.querySelector('.ev-sent[data-i="' + i + '"]'); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); };
    sents.forEach(function (b) { b.onclick = function () { if (api.done) return; var i = +b.getAttribute("data-i"), at = sel.indexOf(i);
      if (at >= 0) sel.splice(at, 1); else { if (sel.length >= q.pick) setOn(sel.shift(), false); sel.push(i); }
      setOn(i, sel.indexOf(i) >= 0); b.classList.remove("wrong"); SFX.play("click"); upd(); }; });
    check.onclick = function () { var good = sel.filter(function (i) { return q.correct.indexOf(i) >= 0; });
      if (good.length === q.correct.length) { sel.forEach(function (i) { app.querySelector('.ev-sent[data-i="' + i + '"]').classList.add("right"); }); api.success(q.feedback); return; }
      var bad = sel.filter(function (i) { return q.correct.indexOf(i) < 0; });
      bad.forEach(function (i) { setOn(i, false); app.querySelector('.ev-sent[data-i="' + i + '"]').classList.add("wrong"); });
      sel = good.slice(); upd();
      var msg = q.pick > 1 ? (good.length ? "One of your sentences is strong evidence (it stays picked). The other one is a true detail, but does it prove the claim? Pick a better one." : "Those sentences are true details, but they don't prove the claim. Read the claim again and look for sentences that match it.")
        : "That sentence is one detail. Look for the sentence that covers the WHOLE text.";
      api.fail(msg, "sentence " + bad.map(function (i) { return i + 1; }).join(" & ")); };
    api.reveal = function () { sents.forEach(function (b) { var i = +b.getAttribute("data-i"), ok = q.correct.indexOf(i) >= 0; b.classList.toggle("on", ok); b.classList.toggle("right", ok); b.classList.remove("wrong"); });
      fb("good", "🧭 The best evidence is shown in green. " + q.feedback); }; }

  /* ---------- explore hub ---------- */
  function hubScene(sc) {
    var done = S.spots, left = sc.min - done.length;
    var html = speakerHtml(sc) + paras(sc) +
      '<div class="spots">' + sc.spots.map(function (sp) { var d = done.indexOf(sp.id) >= 0; return '<button class="spot photo-card' + (d ? " done" : "") + '" data-id="' + sp.id + '"><img src="' + thumb(sp.img) + '" alt="" loading="lazy"><span>' + (d ? "✔ " : "🔎 ") + sp.label + '</span></button>'; }).join("") + '</div>' +
      '<div class="choices"><button class="btn primary" id="hubnext"' + (left > 0 ? " disabled" : "") + '>Back to Guide Tomás ➜ ' + (left > 0 ? "(visit " + left + " more)" : "") + '</button></div>';
    frame(sc, html);
    document.querySelectorAll(".spot").forEach(function (b) { b.onclick = function () { var sp = sc.spots.filter(function (x) { return x.id === b.getAttribute("data-id"); })[0];
      addUnique(S.spots, sp.id); (sp.facts || []).forEach(function (f) { addUnique(S.facts, f); }); SFX.play("clue"); save();
      var I = IMAGES[sp.img];
      modal(sp.label, '<figure class="modal-photo"><img src="' + img(sp.img) + '" alt="' + esc(I.alt) + '"><figcaption>' + esc(I.caption) + ' <span class="small">(' + esc(I.author.split(",")[0]) + ', ' + esc(I.license) + ')</span></figcaption></figure><p>' + sp.text + '</p>', [{ label: "Back to the mission", fn: render }]); }; });
    document.getElementById("hubnext").onclick = function () { go(sc.next); };
    wireHud(strip(html));
  }

  function shopScene(sc) {
    var cart = S.shop; var total = 0; SHOP_ITEMS.forEach(function (it) { total += (cart[it.id] || 0) * it.price; });
    var left = S.coins - total;
    var rows = SHOP_ITEMS.map(function (it) { var n = cart[it.id] || 0, max = it.max || 1, canAdd = n < max && left >= it.price;
      return '<div class="shop-row' + (n ? " in" : "") + '"><div class="shop-ic" aria-hidden="true">' + it.icon + '</div><div class="shop-name"><b>' + it.name + '</b> <span class="price">🪙 ' + it.price + '</span><div class="small">' + it.why + '</div></div>' +
        '<div class="shop-ctl"><button class="btn sm" data-a="minus" data-id="' + it.id + '"' + (n ? "" : " disabled") + ' aria-label="Remove ' + it.name + '">−</button><span class="qty">' + n + '</span>' +
        '<button class="btn sm" data-a="plus" data-id="' + it.id + '"' + (canAdd ? "" : " disabled") + ' aria-label="Add ' + it.name + '">+</button></div></div>'; }).join("");
    var all = SHOP_ITEMS.reduce(function (a, it) { return a + it.price * (it.max || 1); }, 0);
    frame(sc, '<div class="speaker">Shopkeeper says:</div><p>Before the trail, pack your backpack! Everything here would cost <b>' + all + ' coins</b>, but you only have <b>' + S.coins + '</b>. You <b>can\'t have everything</b>, so choose what matters most for catching the thief.</p>' +
      '<p class="tip">💡 Remember: you may need coins later to travel west!</p><div class="shop">' + rows + '</div>' +
      '<div class="budget">Spending: <b>' + total + '</b> • Coins left after shopping: <b id="left">' + left + '</b></div>' +
      '<div class="choices"><button class="btn primary" id="buy">Done shopping ➜</button></div>');
    document.querySelectorAll(".shop-ctl .btn").forEach(function (b) { b.onclick = function () { var id = b.getAttribute("data-id"), a = b.getAttribute("data-a");
      cart[id] = (cart[id] || 0) + (a === "plus" ? 1 : -1); SFX.play("click"); save(); shopScene(sc); var again = document.querySelector('.shop-ctl .btn[data-a="' + a + '"][data-id="' + id + '"]'); if (again && !again.disabled) again.focus(); }; });
    document.getElementById("buy").onclick = function () {
      var finish = function () { S.coins = left; SHOP_ITEMS.forEach(function (it) { if (cart[it.id]) S.items[it.id] = cart[it.id]; }); go(sc.next); };
      if (left < 6) modal("Are you sure?", "<p>You'll only have <b>" + left + " coins</b> left. Traveling west could cost coins. You can still finish the case, but it may take longer.</p>",
        [{ label: "Yes, I'm sure", fn: finish }, { label: "Let me change my list", cls: "ghost" }]);
      else finish(); };
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function oppScene(sc) {
    var unbought = SHOP_ITEMS.filter(function (it) { return !S.items[it.id] || (it.max && S.items[it.id] < it.max); });
    var bought = SHOP_ITEMS.filter(function (it) { return S.items[it.id]; }).map(function (it) { return it.icon + " " + it.name + (S.items[it.id] > 1 ? " ×" + S.items[it.id] : ""); });
    frame(sc, '<p>You bought: <b>' + (bought.length ? bought.join(", ") : "nothing") + '</b>. You have <b>' + S.coins + ' coins</b> left.</p>' +
      '<p>Every time you buy something, you give something else up. The <b>next best thing</b> you gave up is your <b>opportunity cost</b>.</p>' +
      '<div class="prompt">❓ If you\'d had more coins, which item would you have bought NEXT?</div><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var ch = document.getElementById("ch");
    unbought.forEach(function (it) { var b = el('<button class="btn choice">' + it.icon + " " + it.name + ' (🪙 ' + it.price + ')</button>'); b.onclick = function () {
      S.oppChoice = it.id; SFX.play("correct"); save();
      fb("good", "✅ So the <b>" + it.name + "</b> is your <b>opportunity cost</b>: the value of the next best choice you gave up. Good detectives think about trade-offs!");
      nextBtn("Head out ➜", function () { go(sc.next); }); }; ch.appendChild(b); });
    if (!unbought.length) nextBtn("Head out ➜", function () { go(sc.next); });
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function bindAct(g, act) { g.addEventListener("click", act); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }); }

  function insetScene(sc) {
    frame(sc, '<p>' + sc.text[0] + '</p><div class="map-wrap">' + ART.insetMap() + '</div><p class="small">Real aerial photo from the U.S. Geological Survey. North is up.</p><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>', { img: "castillo_aerial", wide: true });
    var msgs = { east: "That's EAST, across Matanzas Bay: Anastasia Island. (The coquina for the Castillo was quarried on this island, a few miles southeast.) The note says NORTH. Look at the N on the compass rose!",
      south: "That pin is SOUTH of the Castillo. On this map, north is UP. Try again!", west: "That's WEST. Find the N on the compass rose, then look that way from the Castillo." };
    var L = qlog("sa8");
    document.querySelectorAll(".inset-spot[data-spot]").forEach(function (g) { var spot = g.getAttribute("data-spot"); if (spot === "here") return;
      bindAct(g, function () { if (L.ok) return; if (spot === "north") { attempt("sa8", true); g.classList.add("right");
          fb("good", "✅ Yes! The <b>old fort site</b>, Fort Mose, is about 2 miles NORTH of the Castillo. The scale bar shows 2 miles."); partnerSay("You used the compass rose AND the scale bar. That's real map reading!");
          nextBtn("Pack supplies first ➜", function () { go(sc.next); }); }
        else { attempt("sa8", false, spot); g.classList.add("wrong"); fb("try", "🤔 " + msgs[spot]); partnerWrong(L); } }); });
    wireHud(strip(sc.text[0]));
  }

  function travelTo(sc, id, t, how) {
    applyEffect({ coins: -t.coins, days: t.days, energy: -t.energy }); addUnique(S.visited, id); S.trail.push(id); S.loc = id; SFX.play("travel"); save();
    modal("🧳 Traveling to " + LOCATIONS[id].name, '<div class="map-mini">' + ART.floridaMap({ current: id, trail: S.trail, visited: S.visited, animate: true, villain: window.V3 ? V3.pennyLoc() : null }) + '</div><p>' + how + '</p>',
      [{ label: "Arrive ➜", fn: function () { checkTired(function () { go(sc.next); }); } }], { cls: "wide" }); }
  function decoyTrip(sc, id) {
    var pay = Math.min(3, S.coins), L = LOCATIONS[id], from = S.loc; S.decoys++; applyEffect({ coins: -pay, days: 1, energy: -1 }); S.trail.push(id); S.trail.push(from); addUnique(S.visited, id); save();
    var I = L.img && IMAGES[L.img];
    var pic = I ? '<figure class="modal-photo"><img src="' + img(L.img) + '" alt="' + esc(I.alt) + '"><figcaption>' + esc(I.caption) + ' <span class="small">(' + esc(I.author.split(",")[0]) + ', ' + esc(I.license) + ')</span></figcaption></figure>' : "";
    var fact = L.fact && FACTS[L.fact] ? '<p class="bonus">📚 While you\'re here: ' + FACTS[L.fact].text + '</p>' : "";
    if (L.fact) addUnique(S.facts, L.fact);
    modal("🚫 No trail in " + L.name, pic + "<p>You spent a day and " + pay + " coins getting to " + L.name + " and back. Nobody here has seen a red umbrella or purple ink.</p>" + fact + "<p><b>Re-read your clue:</b> " + sc.text + "</p>",
      [{ label: "Back to the map", fn: function () { checkTired(render); } }]); }
  function mapScene(sc) {
    var tc = sc.target === "sanluis" && S.travelChoice ? TRAVEL_WEST.filter(function (t) { return t.id === S.travelChoice; })[0] : null;
    var hint = S.items.map ? '<button class="btn sm" id="hint">🗺️ Use your road map</button>' : '';
    frame(sc, '<p class="clue-banner">🔎 ' + sc.text + '</p>' + hint + '<div class="map-wrap">' + ART.floridaMap({ current: S.loc, clickable: true, visited: S.visited, trail: S.trail }) + '</div><div class="feedback" id="fb" aria-live="polite"></div>', { wide: true });
    qlog(S.scene);
    if (S.items.map) document.getElementById("hint").onclick = function () { SFX.play("hint");
      fb("try", sc.target === "mose" ? "🗺️ Your road map: Fort Mose is the fort symbol just NORTH of St. Augustine (joined by a dotted line)." : "🗺️ Your road map: the RED STAR is the state capital. Look WEST (left) in the Panhandle."); };
    document.querySelectorAll(".marker.clickable").forEach(function (g) { var id = g.getAttribute("data-loc");
      bindAct(g, function () {
        if (document.getElementById("modal")) return;
        if (id === S.loc) { fb("try", "📍 You're already here! Pick where to go NEXT."); return; }
        if (id === sc.target) { attempt(S.scene, true);
          var t = tc || sc.travel || { coins: 0, days: 0, energy: 0 };
          var how = tc ? "You take the <b>" + tc.name + "</b> (−" + tc.coins + " coins, +" + tc.days + " day" + (tc.days > 1 ? "s" : "") + ", −" + tc.energy + " energy). Watch your trail grow on the map!" : t.how;
          travelTo(sc, id, t, how); return; }
        if (S.visited.indexOf(id) >= 0) { fb("try", "🔁 You already searched " + LOCATIONS[id].name + ". Read your newest clue!"); return; }
        attempt(S.scene, false, LOCATIONS[id].name); decoyTrip(sc, id); }); });
    wireHud(sc.text);
  }

  function mapQScene(sc) {
    frame(sc, '<p class="clue-banner">🎫 ' + sc.text + '</p><div class="map-wrap">' + ART.floridaMap({ current: S.loc, clickable: true, visited: S.visited, trail: S.trail }) + '</div><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>', { wide: true });
    var L = qlog(S.scene);
    document.querySelectorAll(".marker.clickable").forEach(function (g) { var id = g.getAttribute("data-loc");
      bindAct(g, function () { if (L.ok) return; if (id === "sanluis") { attempt(S.scene, true);
          fb("good", "✅ Yes! The <b>red star</b> means state capital: <b>Tallahassee</b>. Mission San Luis is there too."); partnerSay("The legend unlocked it. Nice!");
          nextBtn("Continue ➜", function () { go(sc.next); }); }
        else { attempt(S.scene, false, LOCATIONS[id].name); fb("try", "🤔 " + LOCATIONS[id].name + " has a different symbol. Check the <b>legend</b>: which symbol means state capital?"); partnerWrong(L); } }); });
    wireHud(strip(sc.text));
  }

  function scaleScene(sc) {
    frame(sc, '<p class="clue-banner">📏 ' + sc.text + '</p><div class="map-wrap">' + ART.floridaMap({ current: S.loc, route: ["staug", "sanluis"], visited: S.visited, trail: S.trail }) + '</div><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>', { wide: true });
    var ch = document.getElementById("ch"), L = qlog(S.scene);
    sc.choices.forEach(function (c, i) { var b = el('<button class="btn choice" data-i="' + i + '">' + c.label + '</button>'); b.onclick = function () {
      if (c.correct) { attempt(S.scene, true); fb("good", "✅ " + c.feedback); nextBtn("Continue ➜", function () { go(c.next); }); }
      else { attempt(S.scene, false, c.label); fb("try", "🤔 " + c.feedback); b.disabled = true; b.classList.add("wrong"); partnerWrong(L); } }; ch.appendChild(b); });
    wireHud(strip(sc.text));
  }

  function travelScene(sc) {
    var cards = TRAVEL_WEST.map(function (t) { var ok = S.coins >= t.coins;
      return '<button class="travel-card" data-id="' + t.id + '"' + (ok ? "" : " disabled") + '><div class="tc-name">' + t.name + '</div>' +
        '<div class="tc-stats">🪙 ' + t.coins + ' coins • 📅 ' + t.days + ' day' + (t.days > 1 ? "s" : "") + ' • ⚡ −' + t.energy + ' energy</div>' +
        '<div class="tc-ben">👍 <b>Benefit:</b> ' + t.benefit + '</div><div class="tc-cost">👎 <b>Cost:</b> ' + t.cost + '</div>' + (ok ? "" : '<div class="tc-no">Not enough coins</div>') + '</button>'; }).join("");
    frame(sc, '<p>Tallahassee is about <b>180 miles</b> west in a straight line (farther by road). How will you get there? Compare the <b>costs</b> (what you give up) and the <b>benefits</b> (what you gain).</p>' +
      '<p>You have <b>🪙 ' + S.coins + '</b> coins, <b>⚡ ' + S.energy + '</b> energy, and it is <b>Day ' + S.day + '</b>. The thief leaves Florida after Day ' + START.deadline + '.</p><div class="travel-grid">' + cards + '</div>');
    document.querySelectorAll(".travel-card").forEach(function (b) { b.onclick = function () { var t = TRAVEL_WEST.filter(function (x) { return x.id === b.getAttribute("data-id"); })[0];
      var others = TRAVEL_WEST.filter(function (x) { return x.id !== t.id && S.coins >= x.coins; }); var next = others.length ? others[0] : null;
      modal("Your decision: " + t.name,
        "<p><b>Costs (what you give up):</b> " + t.coins + " coins, " + t.days + " day" + (t.days > 1 ? "s" : "") + " of travel, " + t.energy + " energy.</p><p><b>Benefits (what you gain):</b> " + t.benefit + "</p>" +
        (next ? "<p>Your <b>opportunity cost</b> is the next best choice you gave up, like the <b>" + next.name + "</b>.</p>" : "") + "<p>Is this your informed decision?</p>",
        [{ label: "Yes! Let's go", fn: function () { S.travelChoice = t.id; save(); go(sc.next); } }, { label: "Compare again", cls: "ghost" }]); }; });
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function deductionScene(sc) {
    var sel = S._sel || (S._sel = { sus: null, hide: null });
    var clues = S.clues.map(function (c) { return "<li>" + (CLUES[c].kind === "place" ? "📍 " : "🕵️ ") + CLUES[c].text + "</li>"; }).join("");
    var sus = SUSPECTS.map(function (s) { return '<button class="sus-card' + (sel.sus === s.id ? " sel" : "") + '" data-sus="' + s.id + '" aria-pressed="' + (sel.sus === s.id) + '">' + ART.suspect(s, 90) +
      '<div class="sus-name">' + s.name + '</div><div class="small">' + s.job + '</div><div class="traits">🎩 ' + s.hat + '<br>🎒 ' + s.carry + '<br>✒️ ' + s.ink + '</div></button>'; }).join("");
    var hides = HIDEOUTS.map(function (h) { return '<button class="btn hide-btn' + (sel.hide === h.id ? " sel" : "") + '" data-hide="' + h.id + '" aria-pressed="' + (sel.hide === h.id) + '">' + h.name + '</button>'; }).join("");
    frame(sc, '<p>Use your clues to decide <b>who</b> the thief is and <b>where</b> the Founding Stone is hidden at Mission San Luis. <span class="small">(Suspects are made-up characters, shown as case-file silhouettes.)</span></p>' +
      '<div class="deduce"><div class="deduce-clues"><h3>📓 Your clues</h3><ul>' + clues + '</ul></div>' +
      '<div><h3>1. Who is the thief?</h3><div class="sus-grid">' + sus + '</div><h3>2. Where is the Stone?</h3><div class="hide-grid">' + hides + '</div></div></div>' +
      '<div class="choices"><button class="btn primary big" id="accuse"' + (sel.sus && sel.hide ? "" : " disabled") + '>🔍 Make the accusation!</button></div>', { wide: true });
    document.querySelectorAll(".sus-card").forEach(function (b) { b.onclick = function () { sel.sus = b.getAttribute("data-sus"); SFX.play("click"); deductionScene(sc); var x = document.querySelector('.sus-card[data-sus="' + sel.sus + '"]'); if (x) x.focus({ preventScroll: true }); }; });
    document.querySelectorAll(".hide-btn").forEach(function (b) { b.onclick = function () { sel.hide = b.getAttribute("data-hide"); SFX.play("click"); deductionScene(sc); var x = document.querySelector('.hide-btn[data-hide="' + sel.hide + '"]'); if (x) x.focus({ preventScroll: true }); }; });
    document.getElementById("accuse").onclick = function () { S.deduceTries++; var s = SUSPECTS.filter(function (x) { return x.id === sel.sus; })[0];
      var okS = sel.sus === THIEF, okH = sel.hide === HIDEOUT; attempt("deduce", okS && okH, s.name + " / " + HIDEOUTS.filter(function (h) { return h.id === sel.hide; })[0].name); save();
      if (okS && okH) { SFX.play("win"); modal("🎉 You got it!", '<div class="center">' + ART.suspect(s, 120) + '</div><p><b>' + s.name + '</b> is caught red-umbrella-handed, right outside the <b>Apalachee Council House</b>!</p><p>"Drat! Foiled by a junior detective!"</p><p>But the Stone is locked in a case with a <b>Timeline Lock</b>…</p>',
          [{ label: "Open the Timeline Lock ➜", fn: function () { delete S._sel; go(sc.next); } }]); return; }
      var hints = [];
      if (!okS) { if (s.ink !== "purple ink") hints.push("Clue check: the thief writes in <b>purple ink</b>. " + s.name + " uses " + s.ink + ".");
        else if (s.carry !== "red umbrella") hints.push("Clue check: the thief carries a <b>red umbrella</b>. " + s.name + " carries a " + s.carry + "."); }
      if (!okH) hints.push("Re-read the last note: the Stone is in the building where <b>Apalachee leaders met every day</b> to discuss community business. Your notebook facts can help!");
      modal("Not quite, detective!", "<p>The thief is still hiding. No problem: good detectives check their evidence again.</p><ul>" + hints.map(function (h) { return "<li>" + h + "</li>"; }).join("") + "</ul>",
        [{ label: "Try again", fn: render }, { label: "📓 Open Notebook", cls: "ghost", fn: function () { render(); notebook("facts"); } }]); };
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function timelineScene(sc) {
    var n = TIMELINE.length, start = shuffled(n, 4242, true), list;
    frame(sc, '<p>The Founding Stone is locked inside a case. To open it, put all <b>' + n + ' events</b> in order from <b>EARLIEST</b> (top) to <b>LATEST</b> (bottom). Drag the cards, or use ▲ ▼.</p>' +
      '<div class="qwidget lock" id="qw"></div><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>', { wide: true });
    var w = document.getElementById("qw"), L = qlog("timeline");
    list = orderList(w, start.map(function (k) { return { k: k, html: '<b class="yr">' + TIMELINE[k].year + '</b> ' + esc(TIMELINE[k].text) }; }), function () { list.unmark(); });
    var ch = document.getElementById("ch"); var tryBtn = el('<button class="btn primary big" id="unlock">🔓 Try the lock</button>'); ch.appendChild(tryBtn);
    tryBtn.onclick = function () { var o = list.order(), right = o.filter(function (v, i) { return v === i; }).length; S.timelineTries++;
      if (right === n) { attempt("timeline", true); list.mark(); list.lock(); fb("good", "✅ <b>Click!</b> The lock opens. You did it!"); SFX.play("win");
        nextBtn("Recover the Founding Stone ➜", function () { go(sc.next); }).classList.add("big"); return; }
      attempt("timeline", false, o.map(function (k) { return TIMELINE[k].year; }).join(",")); list.mark(); partnerWrong(L);
      modal("The lock won't open yet", "<p><b>" + right + " of " + n + "</b> cards are in the right place (green). Look at the <b>years</b>: smaller numbers come first!</p>", [{ label: "Try again" }]); };
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  /* ---------- scoring, rank, win ---------- */
  function scoreRun(st) { var pts = 0, n = 0;
    Object.keys(st.log || {}).forEach(function (k) { var L = st.log[k]; if (!L.tries) return; n++;
      pts += L.revealed ? 0.2 : L.first && !L.hints ? 1 : L.first ? 0.8 : L.tries === 2 ? 0.6 : 0.4; });
    var s = n ? pts / n * 100 : 0; s -= (st.decoys || 0) * 3; if (st.day > START.deadline && !st.relaxed) s -= 10; if (st.deduceTries > 1) s -= 4 * (st.deduceTries - 1);
    return Math.round(clamp(s, 0, 100)); }
  function rankFor(score) { var r = RANKS[0]; RANKS.forEach(function (x) { if (score >= x.min) r = x; }); return r; }
  function winScene(sc) {
    checkBadges(true);
    var score = scoreRun(S), rank = rankFor(score), qs = Object.keys(S.log).filter(function (k) { return S.log[k].tries; });
    var first = qs.filter(function (k) { return S.log[k].first; }).length, stuck = qs.filter(function (k) { return S.log[k].stuck; }).length;
    var onTime = S.day <= START.deadline, mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
    saveReport({ rank: rank.name, score: score });
    var v3win = window.V3 ? V3.onWin(score, rank) : { html: "" };
    var learned = ["Ponce de León named <b>la Florida</b> in 1513, and explorers like de Soto searched for gold and silver.",
      "<b>St. Augustine</b> (1565) is the oldest permanent European settlement in the continental U.S. Spain, France, and England all wanted Florida.",
      "The <b>Timucua</b> and <b>Apalachee</b> both grew corn, beans, and squash. Colonization brought disease and hard changes to Native peoples.",
      "<b>Fort Mose</b> (1738) was the first legally sanctioned free Black settlement in what is now the U.S.",
      "<b>Mission San Luis</b> (1656–1704) was a church, a government center, and a fort, home to Apalachee and Spanish people.",
      "Spain ceded Florida to the United States in the 1819 treaty, which took effect in <b>1821</b>. Tallahassee became the capital in 1824.",
      "Readers find the central idea, use evidence to back up a claim, and compare primary and secondary sources.",
      "You can't buy everything. The next best thing you give up is your <b>opportunity cost</b>, and smart choices compare costs and benefits."];
    var badges = BADGES.map(function (b) { var got = S.badges.indexOf(b.id) >= 0; return '<div class="badge-tile' + (got ? " got" : "") + '" title="' + esc(b.desc) + '"><span aria-hidden="true">' + (got ? b.icon : "🔒") + '</span><b>' + b.name + '</b><small>' + b.desc + '</small></div>'; }).join("");
    app.innerHTML = photoBg("sl_council", 2) + '<main class="win scene"><div class="photo-gap">' + captionChip("sl_council") + '</div><section class="panel center" aria-labelledby="wint"><h1 id="wint">🏆 Case Closed!</h1>' +
      '<div class="rank" aria-label="Detective rank: ' + rank.name + '"><div class="rank-ic" aria-hidden="true">' + rank.icon + '</div><div><div class="rank-lbl">Your detective rank</div><div class="rank-name">' + rank.name + '</div><div class="small">' + rank.msg + ' (case score ' + score + '/100)</div></div></div>' +
      '<p>You recovered the <b>Founding Stone</b> and caught <b>Penny Pinch</b>!' + (onTime || S.relaxed ? "" : " (Phew, the thief was just about to leave Florida!)") + '</p>' + v3win.html +
      '<div class="win-stats"><div>📅 Finished on Day <b>' + S.day + '</b>' + (onTime ? " ⭐ on time" : "") + '</div><div>✅ First-try answers: <b>' + first + '/' + qs.length + '</b></div><div>🔍 ' + PARTNER_NAME + '\'s questions used: <b>' + S.hintsUsed + '</b></div>' +
      '<div>🔎 Accusations: <b>' + S.deduceTries + '</b></div><div>🪙 Coins left: <b>' + S.coins + '</b> • 🚫 Wrong-way trips: <b>' + S.decoys + '</b></div><div>📚 Glossary words: <b>' + S.glossary.length + '</b> • ⏱ About ' + mins + ' min</div></div>' +
      (stuck ? '<p class="small">' + PARTNER_NAME + ' noted ' + stuck + ' tricky question' + (stuck > 1 ? "s" : "") + ' for your teacher. That\'s how detectives get better!</p>' : "") +
      '<h2>Badges (' + S.badges.length + ' of ' + BADGES.length + ')</h2><div class="badge-grid">' + badges + '</div>' +
      '<h2>What you learned</h2><ul class="learned">' + learned.map(function (l) { return "<li>" + l + "</li>"; }).join("") + '</ul>' +
      '<div class="btn-row"><button class="btn primary big" id="again">▶ Play again</button><button class="btn" id="home">Title screen</button><button class="btn ghost" id="wcred">📜 Credits</button></div></section></main>';
    if (window.V3) V3.wireWin();
    document.getElementById("again").onclick = function () { newCase(); };
    document.getElementById("home").onclick = title; document.getElementById("wcred").onclick = function () { credits(title); };
    var cc = app.querySelector(".cap-chip"); if (cc) cc.onclick = function () { imageInfo("sl_council"); };
    clearSave();
  }

  /* ---------- title ---------- */
  function newCase() { if (window.V3) { V3.newCase(function (name, team) { clearSave(); S = fresh(); S.name = String(name || "").trim().slice(0, 40); V3.initState(S, team); enter(SCENES.intro); save(); render(); }); return; }
    var prev = S && S.name;
    modal("🕵️ New case", '<p>What should we call you, detective? <span class="small">(Optional. First name or a nickname only. It is saved only on this device so your teacher can see your progress.)</span></p>' +
      '<label class="typed-lbl" for="pname">Detective name</label><input id="pname" type="text" maxlength="24" autocomplete="off" value="' + esc(prev || "") + '">',
      [{ label: "▶ Start the case", cls: "primary", fn: function () { start(nm); } }, { label: "Cancel", cls: "ghost" }], { escClose: true, noFocus: true });
    var inp = document.getElementById("pname"), nm = inp.value;
    inp.oninput = function () { nm = inp.value; }; inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); nm = inp.value; closeModal(true); start(nm); } }; inp.focus();
    function start(name) { clearSave(); S = fresh(); S.name = String(name || "").trim().slice(0, 24); enter(SCENES.intro); save(); render(); } }
  function title() {
    stopSpeak(); closeModal(true); var sv = load(); var canContinue = sv && sv.scene && sv.scene !== "win" && sv.log;
    app.innerHTML = photoBg("castillo_aerial", 1) + '<main class="title-screen"><div class="title-card"><div class="title-kicker">🔎 A Florida history mystery</div><h1>' + esc(GAME_TITLE) + '</h1><h2>' + esc(GAME_SUBTITLE) + '</h2>' +
      '<p>A junior history detective adventure for 3rd and 4th graders. Travel to real places in early Florida, read real sources, collect clues, and catch the thief!</p>' +
      '<div class="btn-col"><button class="btn big primary" id="new">▶ New case</button>' + (canContinue ? '<button class="btn big" id="cont">⏯ Continue case' + (sv.name ? " (" + esc(sv.name) + ")" : "") + '</button>' : "") +
      (window.V3 ? V3.titleButtons() : "") + '<button class="btn" id="teacher">🍎 Teacher view</button><div class="btn-row2"><button class="btn ghost" id="about">About</button><button class="btn ghost" id="credits">📜 Credits</button>' + soundBtn() + '</div></div>' +
      '<p class="small">Version ' + esc(GAME_VERSION) + ' • Works offline • Sound is off until you turn it on</p></div>' + captionChip("castillo_aerial") + '</main>';
    document.getElementById("new").onclick = newCase;
    if (canContinue) document.getElementById("cont").onclick = function () { S = sv; render(); };
    document.getElementById("teacher").onclick = teacherView;
    document.getElementById("credits").onclick = function () { credits(title); };
    document.getElementById("about").onclick = function () { modal("About " + esc(GAME_TITLE), "<p>The Founding Stone, the thief, the suspects, Detective " + PARTNER_NAME + ", the rangers and the guides are <b>made up</b>.</p><p>The places are real, and so are the photos and old maps. The history and geography facts come from the National Park Service, Florida State Parks, the Florida Department of State, Mission San Luis, and the Florida Museum. See FACT_CHECK.md for sources and CREDITS.md (or the Credits screen) for every picture.</p><p>Everything is stored in the game folder, so no internet is needed.</p>", [{ label: "OK" }], { escClose: true }); };
    wireSound(); var cc = app.querySelector(".cap-chip"); if (cc) cc.onclick = function () { imageInfo("castillo_aerial"); };
    if (window.V3) V3.wireTitle();
  }

  /* ---------- credits ---------- */
  function credits(back) {
    stopSpeak(); closeModal(true);
    var keys = Object.keys(IMAGES), lic = {};
    keys.forEach(function (k) { var l = IMAGES[k].license.split(" (")[0]; lic[l] = (lic[l] || 0) + 1; });
    var rows = keys.map(function (k) { var I = IMAGES[k];
      return '<li class="cred"><img src="' + thumb(k) + '" alt="" loading="lazy" width="96" height="64"><div><b>' + esc(I.caption) + '</b><br><span class="small">“' + esc(I.title) + '” by ' + esc(I.author) +
        '. License: ' + (I.licenseUrl ? '<a href="' + esc(I.licenseUrl) + '" target="_blank" rel="noopener">' + esc(I.license) + '</a>' : esc(I.license)) + '. <a href="' + esc(I.page) + '" target="_blank" rel="noopener">Source</a>. ' + esc(I.changes) + '</span></div></li>'; }).join("");
    app.innerHTML = '<main class="teacher credits" id="credits-screen"><div class="teacher-head"><h1>📜 Credits</h1><button class="btn primary" id="back">← Back</button></div>' +
      '<p>' + esc(GAME_TITLE) + ' uses only public-domain and freely licensed pictures. Thank you to every photographer, archive and agency below! ' +
      'License summary: ' + Object.keys(lic).map(function (l) { return lic[l] + "× " + esc(l); }).join(", ") + '. Pictures under CC BY-SA are shared under that same license.</p>' +
      '<h2>Pictures and maps (' + keys.length + ')</h2><ul class="cred-list">' + rows + '</ul>' +
      '<h2>Map data</h2><p class="small">Florida outline: U.S. Census Bureau Cartographic Boundary File cb_2023_us_state_5m (public domain), simplified. Florida map image: NASA Blue Marble shaded relief via NASA GIBS (public domain). St. Augustine aerial photo: U.S. Geological Survey, The National Map orthoimagery (public domain).</p>' +
      '<h2>Texts</h2><p class="small">“Coquina” reading passage adapted from the National Park Service, Castillo de San Marcos National Monument (public domain). Treaty quotation: Adams-Onís Treaty of 1819, Article II, via The Avalon Project, Yale Law School (public domain text). Other passages were written for this game. Benchmark wording: Florida Department of Education (Rule 6A-1.09401, F.A.C.).</p>' +
      '<h2>Sound</h2><p class="small">All sound effects are made live by the game with the Web Audio API. No recorded audio files are used.</p>' +
      '<h2>Story</h2><p class="small">The Founding Stone, the thief, the suspects, Detective ' + PARTNER_NAME + ', Professor Pelican, Ranger Rosa, Ranger Dee and Guide Tomás are made up. Suspects appear only as silhouettes. No real people are shown as characters.</p></main>';
    document.getElementById("back").onclick = back || title; window.scrollTo(0, 0);
  }

  /* ---------- teacher view ---------- */
  function qType(sc) { return sc.type === "q" ? { mc: "Multiple choice", multi: "Select all", order: "Drag to order", match: "Match", typed: "Typed answer", evidence: "Choose the evidence" }[sc.q.kind] :
    { inset: "Map (aerial photo)", map: "Map travel", mapq: "Map legend", scaleq: "Map scale", deduction: "Deduction", timeline: "Timeline lock (7 cards)" }[sc.type] || sc.type; }
  function teacherView() {
    stopSpeak(); closeModal(true);
    var uses = {}, eUses = {};
    var locName = function (sc) { return sc.loc === "office" ? "Intro" : (LOCATIONS[sc.loc] ? LOCATIONS[sc.loc].name : ""); };
    Object.keys(SCENES).forEach(function (id) { var sc = SCENES[id]; (sc.teaches || []).forEach(function (c) { (uses[c] = uses[c] || []).push(sc); }); (sc.ela || []).forEach(function (c) { (eUses[c] = eUses[c] || []).push(sc); }); });
    var rows = Object.keys(BENCHMARKS).map(function (code) {
      var list = (uses[code] || []).map(function (sc) { return "<li><b>" + locName(sc) + ":</b> " + sc.title + (sc.ela ? " <span class='pill'>+ELA</span>" : "") + "</li>"; }).join("");
      var strand = code.indexOf(".FL.") > 0 ? "Financial Literacy (supplies)" : code.indexOf(".G.") > 0 ? "Geography (clues & maps)" : "American History (story chapters)";
      return "<tr><td class='code'>" + code + "</td><td>" + BENCHMARKS[code] + "<div class='strand'>" + strand + "</div></td><td><ul>" + list + "</ul></td></tr>"; }).join("");
    var erows = Object.keys(ELA_BENCHMARKS).map(function (code) { var B = ELA_BENCHMARKS[code];
      var list = (eUses[code] || []).map(function (sc) { var P = sc.passage ? PASSAGES[sc.passage] : null; return "<li><b>" + sc.title.replace("Reading Room: ", "") + "</b> (" + qType(sc) + ")" + (P ? " — passage: <i>" + P.title + "</i>" : "") + ((sc.teaches || []).length ? "; with " + sc.teaches.join(", ") : "") + "</li>"; }).join("");
      return "<tr><td class='code'>" + code + "</td><td>" + B.text + "<div class='strand'>Grade " + B.grade + " • " + B.strand + " • B.E.S.T. ELA 2025, PDF p. " + B.page + "</div></td><td><ul>" + list + "</ul></td></tr>"; }).join("");
    var R = reports(), qids = Object.keys(SCENES).filter(function (id) { return SCENES[id].hints && SCENES[id].hints.length; });
    var agg = qids.map(function (id) { var sc = SCENES[id], p = 0, f = 0, t = 0, h = 0, st = 0, wrong = {};
      R.forEach(function (r) { var L = r.log && r.log[id]; if (!L || !L.tries) return; p++; if (L.first) f++; t += L.tries; h += L.hints; if (L.stuck || L.revealed) st++; (L.wrong || []).forEach(function (w) { wrong[w] = (wrong[w] || 0) + 1; }); });
      var top = Object.keys(wrong).sort(function (a, b) { return wrong[b] - wrong[a]; }).slice(0, 2).map(function (w) { return esc(w) + (wrong[w] > 1 ? " ×" + wrong[w] : ""); }).join("; ");
      return { id: id, sc: sc, p: p, f: f, t: t, h: h, st: st, top: top }; });
    var aggRows = agg.map(function (a) { var codes = (a.sc.teaches || []).concat(a.sc.ela || []).join(", ");
      return '<tr class="' + (a.st ? "stuckrow" : "") + '" data-q="' + a.id + '"><td>' + (a.sc.chapter || "-") + '</td><td><b>' + a.sc.title + '</b><div class="strand">' + qType(a.sc) + ' • ' + codes + '</div></td><td>' + a.p + '</td><td>' + (a.p ? Math.round(a.f / a.p * 100) + "%" : "–") + '</td><td>' + (a.p ? (a.t / a.p).toFixed(1) : "–") + '</td><td>' + (a.p ? (a.h / a.p).toFixed(1) : "–") + '</td><td>' + (a.st ? "⚠️ " + a.st : "0") + '</td><td class="small">' + (a.top || "") + '</td></tr>'; }).join("");
    var runRows = R.slice().reverse().map(function (r) { var stuck = Object.keys(r.log || {}).filter(function (k) { return r.log[k].stuck || r.log[k].revealed; });
      return '<tr><td>' + esc(r.name || "(no name)") + '</td><td>' + new Date(r.started).toLocaleString() + '</td><td>' + (r.finished ? "✅ Finished" : "In progress: " + esc((SCENES[r.scene] || {}).title || r.scene)) + '</td><td>' + (r.rank ? esc(r.rank) + " (" + r.score + ")" : "–") + '</td><td>' + (r.hints || 0) + '</td><td>' +
        (stuck.length ? stuck.map(function (k) { var L = r.log[k]; return "<div>⚠️ <b>" + (SCENES[k] ? SCENES[k].title : k) + "</b>: " + L.tries + " tries, " + L.hints + " hints" + (L.revealed ? ", used “Show me”" : "") + (L.wrong && L.wrong.length ? "<br><span class='small'>Wrong answers: " + L.wrong.map(esc).join(" | ") + "</span>" : "") + "</div>"; }).join("") : "None 🎉") + '</td></tr>'; }).join("");
    var tl = TIMELINE.map(function (t) { return t.year; }).join(" → ");
    app.innerHTML = '<main class="teacher"><div class="teacher-head"><h1>🍎 Teacher View: ' + esc(GAME_SUBTITLE) + '</h1>' +
      '<div><button class="btn" id="print">🖨 Print</button> <button class="btn primary" id="back">← Back to title</button></div></div>' +
      '<p><b>Grades 3–4. Social Studies + ELA Reading.</b> Social Studies benchmark wording is copied exactly from <i>Florida\'s State Academic Standards – Social Studies, 2026</i> (Rule 6A-1.09401, F.A.C.). ELA wording is copied exactly from <a href="' + ELA_SOURCE.url + '" target="_blank" rel="noopener">' + esc(ELA_SOURCE.title) + '</a>. Play time: about 25–35 minutes.</p>' +
      (window.V3 ? V3.teacherHtml() : "") +
      '<nav class="t-nav"><a href="#t-class">Class, leaderboard &amp; share codes</a> • <a href="#t-stuck">Where students got stuck</a> • <a href="#t-ss">Social Studies</a> • <a href="#t-ela">ELA Reading</a> • <a href="#t-key">Answer key</a></nav>' +
      '<h2 id="t-stuck">🔍 Where students got stuck (records on this device)</h2>' +
      '<p class="small">Detective ' + PARTNER_NAME + ' logs every question: tries, partner questions (hints) used, wrong answers, and whether the student got stuck (3+ wrong tries, or used “Show me”). Records stay in this browser only (localStorage) and are not sent anywhere. ' + R.length + ' play record' + (R.length === 1 ? "" : "s") + ' on this device.</p>' +
      '<div class="btn-row left"><button class="btn" id="csv"' + (R.length ? "" : " disabled") + '>⬇ Export CSV</button><button class="btn ghost" id="clear"' + (R.length ? "" : " disabled") + '>🗑 Clear records</button></div>' +
      (R.length ? '<h3>By question</h3><div class="tscroll"><table class="bench stuck"><thead><tr><th>Ch.</th><th>Question</th><th>Players</th><th>First try</th><th>Avg tries</th><th>Avg hints</th><th>Stuck</th><th>Common wrong answers</th></tr></thead><tbody>' + aggRows + '</tbody></table></div>' +
        '<h3>By student</h3><div class="tscroll"><table class="bench runs"><thead><tr><th>Name</th><th>Started</th><th>Status</th><th>Rank</th><th>Hints</th><th>Stuck on</th></tr></thead><tbody>' + runRows + '</tbody></table></div>' : '<p><i>No play records yet. They appear here after students play on this device.</i></p>') +
      '<h2 id="t-ss">Social Studies benchmarks (Grade 4)</h2><div class="tscroll"><table class="bench ss"><thead><tr><th>Benchmark</th><th>Official wording</th><th>Where it is taught in the game</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<h2 id="t-ela">ELA B.E.S.T. Reading benchmarks (Grades 3 and 4)</h2><p class="small">Reading Room passages: “Coquina” (adapted NPS text), “Freedom at Fort Mose” and “Life at Mission San Luis” (written for this game from cited facts), and a two-text set pairing a primary source (Adams-Onís Treaty, Art. II) with a secondary text. Vocabulary words (dotted underline) open kid-friendly definitions and are collected in the Notebook Glossary.</p>' +
      '<div class="tscroll"><table class="bench ela"><thead><tr><th>Benchmark</th><th>Official wording</th><th>Where it is practiced (with Social Studies codes)</th></tr></thead><tbody>' + erows + '</tbody></table></div>' +
      '<h2>How the mechanics teach</h2><ul><li><b>Difficulty ramps by chapter.</b> Ch. 1 (warm-up): multiple choice, a 3-card order, select-all. Ch. 2: choose-the-evidence, typed answers, matching, map legend and scale. Ch. 3 (expert): comparing two texts, typed answers that need a reason, 5- and 7-card timelines, select-all with tricky distractors.</li>' +
      '<li><b>Detective ' + PARTNER_NAME + '</b> asks up to 3 guiding questions per problem and never gives the answer. After 4 wrong tries a “Show me” button appears so no one is stuck forever; that is logged as stuck.</li>' +
      '<li><b>Typed answers</b> are checked with a forgiving keyword match (ignores capitals, punctuation and small spelling slips).</li>' +
      '<li><b>Maps</b> use a real NASA image of Florida and a real USGS aerial photo of St. Augustine with a compass rose, legend and scale bars. Wrong stops cost a day and coins (no game over). The case map fills in the trail as students travel.</li>' +
      '<li><b>Supplies</b>: a 25-coin budget, opportunity cost, and comparing costs and benefits of three ways to travel west.</li>' +
      '<li><b>Badges and rank</b> reward first-try answers, few hints, close reading and staying on budget.</li><li><b>Sound effects</b> are off by default (🔇 button).</li></ul>' +
      '<h2>Sensitive topics</h2><p>Fort Mose (freedom seekers escaping slavery), colonization\'s effects on the Timucua (disease, forced labor), and the end of Mission San Luis in 1704 are told briefly and factually. Please preview these scenes. Native peoples are not depicted as characters; photos show places, rebuilt buildings and landscapes only.</p>' +
      '<details id="t-key"><summary><b>Answer key (click to show)</b></summary><ul><li>Thief: <b>Penny Pinch</b> (purple ink + red umbrella; bonus green straw hat)</li><li>Hideout: <b>Apalachee Council House</b></li><li>Timeline Lock: ' + tl + '</li>' +
      '<li>Travel: Castillo → Fort Mose (about 2 miles north) → Tallahassee / Mission San Luis (state capital, about 180 miles west in a straight line)</li>' +
      '<li>Evidence: Fort Mose claim = sentences 5 and 7; San Luis central idea = sentence 1</li><li>Typed: Fort Mose people went to <b>Cuba</b>; “cedes” = gives / hands over; Paiva = <b>primary</b> because he wrote it at the time</li>' +
      '<li>Compare two texts: “Spain gave Florida to the U.S.” and “East and West Florida”</li><li>Select-all (nations): Spain, France, England. Alike: corn/beans/squash, north Florida Native peoples, changed by colonization</li></ul></details>' +
      '<p class="small">Made-up parts: the Founding Stone, the thief and suspects, Detective ' + PARTNER_NAME + ', Ranger Rosa, Ranger Dee, Guide Tomás, Professor Pelican, shop prices and travel options. Historical claims and sources: FACT_CHECK.md. Pictures: CREDITS.md and the <a href="#" id="tcred">Credits screen</a>.</p></main>';
    document.getElementById("back").onclick = title; document.getElementById("print").onclick = function () { window.print(); };
    document.getElementById("tcred").onclick = function (e) { e.preventDefault(); credits(teacherView); };
    document.querySelectorAll(".t-nav a").forEach(function (a) { a.onclick = function (e) { e.preventDefault(); var t = document.querySelector(a.getAttribute("href")); if (t) { if (t.tagName === "DETAILS") t.open = true; t.scrollIntoView({ behavior: "smooth" }); } }; });
    var csv = document.getElementById("csv"); if (csv && R.length) csv.onclick = function () { downloadCsv(R); };
    var clr = document.getElementById("clear"); if (clr && R.length) clr.onclick = function () { modal("Clear all play records?", "<p>This removes every student record stored in this browser. It can't be undone.</p>",
      [{ label: "Yes, clear records", fn: function () { try { localStorage.removeItem(REPORT_KEY); } catch (e) {} teacherView(); } }, { label: "Cancel", cls: "ghost" }], { escClose: true }); };
    if (window.V3) V3.wireTeacher();
    window.scrollTo(0, 0);
  }
  function csvCell(v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function buildCsv(R) {
    var lines = [["student", "started", "finished", "rank", "score", "question_id", "question", "type", "chapter", "ss_benchmarks", "ela_benchmarks", "tries", "hints", "first_try", "stuck", "used_show_me", "seconds", "wrong_answers"].join(",")];
    R.forEach(function (r) { Object.keys(r.log || {}).forEach(function (k) { var L = r.log[k], sc = SCENES[k]; if (!sc || !L.tries) return;
      lines.push([r.name, new Date(r.started).toISOString(), r.finished ? "yes" : "no", r.rank || "", r.score == null ? "" : r.score, k, strip(sc.title), qType(sc), sc.chapter, (sc.teaches || []).join(" "), (sc.ela || []).join(" "),
        L.tries, L.hints, L.first ? "yes" : "no", L.stuck ? "yes" : "no", L.revealed ? "yes" : "no", Math.round((L.ms || 0) / 1000), (L.wrong || []).join(" | ")].map(csvCell).join(",")); }); });
    return lines.join("\n"); }
  function downloadCsv(R) { var blob = new Blob([buildCsv(R)], { type: "text/csv" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "florida-trailblazers-records.csv"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  /* expose a tiny API for automated play-testing */
  window.FTB = { state: function () { return S; }, go: go, title: title, teacher: teacherView, credits: credits, notebook: notebook, csv: function () { return buildCsv(reports()); },
    checkTyped: checkTyped, score: function () { return scoreRun(S); }, newCase: function (name, team) { clearSave(); S = fresh(); S.name = name || ""; if (window.V3) V3.initState(S, team); enter(SCENES.intro); save(); render(); } };
  /* internals for the v3 add-ons (js/v3.js) */
  window.FTBX = { S: function () { return S; }, setS: function (x) { S = x; }, app: function () { return app; }, el: el, esc: esc, strip: strip, modal: modal, closeModal: closeModal, toast: toast, frame: frame, go: go, render: render, save: save,
    award: award, attempt: attempt, qlog: qlog, nextBtn: nextBtn, fb: fb, decorate: decorate, img: img, thumb: thumb, wireHud: wireHud, partnerWrong: partnerWrong, notebook: notebook, title: title, teacher: teacherView,
    reports: reports, scoreRun: scoreRun, rankFor: rankFor, BADGES: BADGES, RANKS: RANKS, bindAct: bindAct, hash: hash, shuffled: shuffled, clamp: clamp, addUnique: addUnique, imageInfo: imageInfo, caseMap: caseMap, checkTired: checkTired };
  window.addEventListener("DOMContentLoaded", function () { app = document.getElementById("app"); document.title = GAME_TITLE + " — " + GAME_SUBTITLE; wireVocabGlobal(); title(); });
})();
