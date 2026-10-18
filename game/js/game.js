/* Florida Trailblazers — game engine (plain JS, no build step). */
(function () {
  "use strict";
  var app, S;

  function fresh() {
    return { scene: "intro", coins: START.coins, energy: START.energy, day: START.day, items: {}, clues: [], facts: [], visited: ["staug"],
      loc: "staug", quiz: {}, spots: [], deduceTries: 0, shop: {}, oppChoice: null, travelChoice: null, timelineTries: 0, started: Date.now(), decoys: 0 };
  }
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage may be blocked; game still works */ } }
  function load() { try { var j = localStorage.getItem(SAVE_KEY); return j ? JSON.parse(j) : null; } catch (e) { return null; } }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  function el(html) { var d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function strip(h) { var d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; }
  function addUnique(arr, v) { if (v && arr.indexOf(v) < 0) arr.push(v); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- read aloud ---------- */
  function speak(text) { if (!("speechSynthesis" in window)) { toast("Read-aloud isn't available on this computer."); return; }
    window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.rate = 0.92; window.speechSynthesis.speak(u); }
  function stopSpeak() { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }

  /* ---------- toast & modal ---------- */
  function toast(msg) { var t = el('<div class="toast" role="status">' + msg + '</div>'); document.body.appendChild(t); setTimeout(function () { t.classList.add("show"); }, 10);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 2600); }
  function modal(title, bodyHtml, buttons) {
    closeModal();
    var m = el('<div class="modal-back" id="modal"><div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><h2>' + title + '</h2><div class="modal-body">' + bodyHtml + '</div><div class="modal-btns"></div></div></div>');
    var bb = m.querySelector(".modal-btns");
    (buttons || [{ label: "OK" }]).forEach(function (b) { var btn = el('<button class="btn ' + (b.cls || "") + '">' + b.label + '</button>'); btn.onclick = function () { closeModal(); if (b.fn) b.fn(); }; bb.appendChild(btn); });
    document.body.appendChild(m); var f = bb.querySelector("button"); if (f) f.focus(); }
  function closeModal() { var m = document.getElementById("modal"); if (m) m.remove(); }

  /* ---------- HUD ---------- */
  function hud() {
    var snack = S.items.snack ? '<button class="hud-btn" id="eat">🍎 Eat snack (' + S.items.snack + ')</button>' : "";
    var late = S.day > START.deadline ? " late" : "";
    return '<header class="hud"><div class="hud-title">' + esc(GAME_TITLE) + '</div>' +
      '<div class="stat" title="Coins">🪙 <b id="coins">' + S.coins + '</b> coins</div>' +
      '<div class="stat" title="Energy">⚡ <b>' + S.energy + '</b> energy</div>' +
      '<div class="stat' + late + '" title="Day">📅 Day <b>' + S.day + '</b> of ' + START.deadline + '</div>' + snack +
      '<button class="hud-btn" id="nb">📓 Notebook (' + S.clues.length + ')</button>' +
      '<button class="hud-btn" id="read" aria-label="Read this page aloud">🔊 Read</button></header>'; }
  function wireHud(readText) {
    var nb = document.getElementById("nb"); if (nb) nb.onclick = notebook;
    var r = document.getElementById("read"); if (r) r.onclick = function () { speak(readText || strip(document.querySelector("main").innerHTML)); };
    var e = document.getElementById("eat"); if (e) e.onclick = function () { S.items.snack--; S.energy = clamp(S.energy + 3, 0, 10); toast("Yum! +3 energy"); save(); render(); };
  }

  /* ---------- notebook ---------- */
  function notebook() {
    var place = S.clues.filter(function (c) { return CLUES[c].kind === "place"; }).map(function (c) { return "<li>📍 " + CLUES[c].text + "</li>"; }).join("") || "<li><i>No place clues yet.</i></li>";
    var sus = S.clues.filter(function (c) { return CLUES[c].kind === "suspect"; }).map(function (c) { return "<li>🕵️ " + CLUES[c].text + "</li>"; }).join("") || "<li><i>No suspect clues yet.</i></li>";
    var facts = S.facts.map(function (f) { return "<li>" + FACTS[f].text + "</li>"; }).join("") || "<li><i>Facts you learn will appear here.</i></li>";
    var suspects = SUSPECTS.map(function (s) { return '<div class="sus-mini">' + ART.suspect(s, 80) + '<div><b>' + s.name + '</b><br>' + s.hat + '<br>' + s.carry + '<br>' + s.ink + '</div></div>'; }).join("");
    modal("📓 Detective Notebook",
      '<div class="nb-tabs"><button class="tab on" data-t="clues">Clues</button><button class="tab" data-t="sus">Suspects</button><button class="tab" data-t="facts">Facts learned (' + S.facts.length + ')</button></div>' +
      '<div class="nb-pane" data-p="clues"><h3>Where is the thief going?</h3><ul>' + place + '</ul><h3>Who is the thief?</h3><ul>' + sus + '</ul></div>' +
      '<div class="nb-pane hidden" data-p="sus"><p>Compare these suspects with your clues.</p><div class="sus-grid-mini">' + suspects + '</div></div>' +
      '<div class="nb-pane hidden" data-p="facts"><ul class="facts">' + facts + '</ul></div>', [{ label: "Close notebook" }]);
    document.querySelectorAll(".tab").forEach(function (t) { t.onclick = function () {
      document.querySelectorAll(".tab").forEach(function (x) { x.classList.toggle("on", x === t); });
      document.querySelectorAll(".nb-pane").forEach(function (p) { p.classList.toggle("hidden", p.getAttribute("data-p") !== t.getAttribute("data-t")); }); }; });
  }

  /* ---------- energy / effects ---------- */
  function applyEffect(e) { if (!e) return; if (e.coins) S.coins = Math.max(0, S.coins + e.coins); if (e.energy) S.energy = clamp(S.energy + e.energy, 0, 10); if (e.days) S.day += e.days; }
  function checkTired(then) {
    if (S.energy > 0) { then(); return; }
    if (S.items.snack) { modal("😴 You're out of energy!", "<p>You eat a snack from your backpack. <b>+3 energy</b>.</p>", [{ label: "Keep going", fn: function () { S.items.snack--; S.energy = 3; save(); then(); } }]); return; }
    modal("😴 You're out of energy!", "<p>You have no energy and no snacks. You rest at a campground overnight.</p><p><b>+1 day, energy back to 3.</b></p><p class='tip'>Tip: snacks cost coins, but they can save you time!</p>",
      [{ label: "Rest and continue", fn: function () { S.day += 1; S.energy = 3; save(); then(); } }]);
  }
  function go(id) { stopSpeak(); S.scene = id; enter(SCENES[id]); save(); render(); window.scrollTo(0, 0); }
  function enter(sc) { if (!sc) return; if (sc.loc && LOCATIONS[sc.loc]) S.loc = sc.loc; addUnique(S.clues, sc.clue); addUnique(S.clues, sc.clue2);
    (sc.facts || []).forEach(function (f) { addUnique(S.facts, f); });
    if (sc.camera && S.items.camera) addUnique(S.clues, sc.camera.clue);
    if (sc.flashlight && S.items.flashlight) addUnique(S.clues, sc.flashlight.clue); }

  /* ---------- screens ---------- */
  function title() {
    stopSpeak(); var sv = load(); var canContinue = sv && sv.scene && sv.scene !== "win";
    app.innerHTML = '<main class="title-screen">' + ART.scene("castillo").replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" ') +
      '<div class="title-card"><h1>' + esc(GAME_TITLE) + '</h1><h2>' + esc(GAME_SUBTITLE) + '</h2>' +
      '<p>A junior history detective adventure for 4th graders. Travel early Florida, collect clues, and catch the thief!</p>' +
      '<div class="btn-col"><button class="btn big primary" id="new">▶ New case</button>' + (canContinue ? '<button class="btn big" id="cont">⏯ Continue case</button>' : "") +
      '<button class="btn" id="teacher">🍎 Teacher view</button><button class="btn ghost" id="about">About this game</button></div>' +
      '<p class="small">Version ' + esc(GAME_VERSION) + ' • Works offline</p></div></main>';
    document.getElementById("new").onclick = function () { clearSave(); S = fresh(); enter(SCENES.intro); render(); };
    if (canContinue) document.getElementById("cont").onclick = function () { S = sv; render(); };
    document.getElementById("teacher").onclick = teacherView;
    document.getElementById("about").onclick = function () { modal("About " + esc(GAME_TITLE), "<p>The Founding Stone, the thief, the suspects, the rangers and the detectives are <b>made up</b>.</p><p>The history and geography facts are real and come from the National Park Service, Florida State Parks, the Florida Department of State, Mission San Luis, and the Florida Museum. See FACT_CHECK.md for sources.</p><p>All art is drawn with code. No internet needed.</p>"); };
  }

  function teacherView() {
    stopSpeak();
    var uses = {};
    Object.keys(SCENES).forEach(function (id) { var sc = SCENES[id]; (sc.teaches || []).forEach(function (c) { (uses[c] = uses[c] || []).push(sc); }); });
    var locName = function (sc) { return sc.loc === "office" ? "Intro" : (LOCATIONS[sc.loc] ? LOCATIONS[sc.loc].name : ""); };
    var rows = Object.keys(BENCHMARKS).map(function (code) {
      var list = (uses[code] || []).map(function (sc) { return "<li><b>" + locName(sc) + ":</b> " + sc.title + "</li>"; }).join("");
      var strand = code.indexOf(".FL.") > 0 ? "Financial Literacy (supplies)" : code.indexOf(".G.") > 0 ? "Geography (clues & maps)" : "American History (story chapters)";
      return "<tr><td class='code'>" + code + "</td><td>" + BENCHMARKS[code] + "<div class='strand'>" + strand + "</div></td><td><ul>" + list + "</ul></td></tr>"; }).join("");
    app.innerHTML = '<main class="teacher"><div class="teacher-head"><h1>🍎 Teacher View: ' + esc(GAME_SUBTITLE) + '</h1>' +
      '<div><button class="btn" id="print">🖨 Print</button> <button class="btn primary" id="back">← Back to title</button></div></div>' +
      '<p><b>Grade 4 Social Studies.</b> Benchmark wording is copied exactly from <i>Florida\'s State Academic Standards – Social Studies, 2026</i> (Rule 6A-1.09401, F.A.C.). Play time: about 10–15 minutes.</p>' +
      '<table class="bench"><thead><tr><th>Benchmark</th><th>Official wording</th><th>Where it is taught in the game</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<h2>How the mechanics teach</h2><ul><li><b>Story chapters</b> (choose-your-path scenes and check-for-understanding questions) teach the history benchmarks. Wrong answers get a gentle hint and another try.</li>' +
      '<li><b>Clues and maps</b>: students read a compass rose, intermediate directions, a legend symbol, and a scale bar, then pick the next stop. Wrong stops cost a day and coins (no game over).</li>' +
      '<li><b>Supplies</b>: a 25-coin budget. Students can\'t buy everything (prioritizing wants), name the next-best item they gave up (opportunity cost), and compare the costs and benefits of three ways to travel west.</li>' +
      '<li><b>Timeline lock</b>: students put five events in order to recover the Stone.</li></ul>' +
      '<h2>Sensitive topics</h2><p>Fort Mose (freedom seekers escaping slavery), colonization\'s effects on the Timucua (disease, forced labor), and the end of Mission San Luis in 1704 are told briefly and factually. Please preview these scenes. Native peoples are not drawn as characters; only places, foods and buildings are illustrated.</p>' +
      '<details><summary><b>Answer key (click to show)</b></summary><ul><li>Thief: <b>Penny Pinch</b> (purple ink + red umbrella; bonus green straw hat)</li><li>Hideout: <b>Apalachee Council House</b></li><li>Timeline: 1513 → 1565 → 1656 → 1704 → 1738</li><li>Travel: Castillo → Fort Mose (2 miles north) → Tallahassee / Mission San Luis (state capital, about 180 miles west)</li></ul></details>' +
      '<p class="small">Made-up parts: the Founding Stone, the thief and suspects, Ranger Rosa, Ranger Dee, Guide Tomás, Professor Pelican, shop prices and travel options. Historical claims and sources: see FACT_CHECK.md in the game folder.</p></main>';
    document.getElementById("back").onclick = title; document.getElementById("print").onclick = function () { window.print(); };
  }

  function render() {
    var sc = SCENES[S.scene]; if (!sc) { title(); return; }
    var t = sc.type || "story";
    if (t === "story" || t === "quiz") return storyScene(sc);
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
  function frame(sc, artKey, inner) {
    var place = sc.loc && LOCATIONS[sc.loc] ? '<div class="place-tag">📍 ' + LOCATIONS[sc.loc].name + (LOCATIONS[sc.loc].sub ? " — " + LOCATIONS[sc.loc].sub : "") + '</div>' : "";
    app.innerHTML = hud() + '<main class="scene">' + (artKey && artKey !== "none" ? '<div class="art">' + ART.scene(artKey) + place + '</div>' : place) +
      '<section class="panel"><h2>' + sc.title + '</h2>' + inner + '</section></main>'; }

  function storyScene(sc) {
    var paras = sc.text.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    if (sc.camera) paras += S.items.camera ? '<p class="bonus">' + sc.camera.text + '</p>' : '<p class="hint">💭 If you had a camera, you might spot tiny clues here…</p>';
    if (sc.flashlight) paras += S.items.flashlight ? '<p class="bonus">' + sc.flashlight.text + '</p>' : '<p class="hint">💭 It\'s dark under the benches. A flashlight would help…</p>';
    var speaker = sc.speaker ? '<div class="speaker">' + sc.speaker + ' says:</div>' : "";
    frame(sc, sc.art, speaker + paras + '<div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var ch = document.getElementById("ch"), fb = document.getElementById("fb");
    sc.choices.forEach(function (c, i) {
      var b = el('<button class="btn choice">' + c.label + '</button>');
      b.onclick = function () {
        if (sc.type === "quiz") {
          if (!(S.scene in S.quiz)) S.quiz[S.scene] = !!c.correct;
          if (c.correct) { fb.className = "feedback good"; fb.innerHTML = "✅ " + c.feedback;
            ch.innerHTML = ""; var n = el('<button class="btn primary choice">Continue ➜</button>'); n.onclick = function () { go(c.next); }; ch.appendChild(n); n.focus(); save(); }
          else { fb.className = "feedback try"; fb.innerHTML = "🤔 " + c.feedback + " <b>Try again!</b>"; b.disabled = true; b.classList.add("wrong"); save(); }
          return; }
        applyEffect(c.effect); checkTired(function () { go(c.next); });
      };
      ch.appendChild(b); });
    wireHud(strip(speaker + paras + sc.choices.map(function (c) { return c.label + ". "; }).join(" ")));
  }

  function hubScene(sc) {
    var done = S.spots;
    var html = '<div class="speaker">' + sc.speaker + ' says:</div>' + sc.text.map(function (p) { return "<p>" + p + "</p>"; }).join("") +
      '<div class="spots">' + sc.spots.map(function (sp) { return '<button class="btn spot' + (done.indexOf(sp.id) >= 0 ? " done" : "") + '" data-id="' + sp.id + '">' + (done.indexOf(sp.id) >= 0 ? "✔ " : "🔎 ") + sp.label + '</button>'; }).join("") + '</div>' +
      '<div class="choices"><button class="btn primary" id="hubnext"' + (done.length < sc.min ? " disabled" : "") + '>Back to Guide Tomás ➜ ' + (done.length < sc.min ? "(visit " + (sc.min - done.length) + " more)" : "") + '</button></div>';
    frame(sc, sc.art, html);
    document.querySelectorAll(".spot").forEach(function (b) { b.onclick = function () { var sp = sc.spots.filter(function (x) { return x.id === b.getAttribute("data-id"); })[0];
      addUnique(S.spots, sp.id); (sp.facts || []).forEach(function (f) { addUnique(S.facts, f); }); save();
      modal(sp.label, '<div class="modal-art">' + ART.scene(sp.art) + '</div><p>' + sp.text + '</p>', [{ label: "Back to the mission", fn: render }]); }; });
    document.getElementById("hubnext").onclick = function () { go(sc.next); };
    wireHud(strip(html));
  }

  function shopScene(sc) {
    var cart = S.shop; var total = 0; SHOP_ITEMS.forEach(function (it) { total += (cart[it.id] || 0) * it.price; });
    var left = S.coins - total;
    var rows = SHOP_ITEMS.map(function (it) { var n = cart[it.id] || 0, max = it.max || 1, canAdd = n < max && left >= it.price;
      return '<div class="shop-row' + (n ? " in" : "") + '"><div class="shop-name"><b>' + it.name + '</b> — 🪙 ' + it.price + '<div class="small">' + it.why + '</div></div>' +
        '<div class="shop-ctl"><button class="btn sm" data-a="minus" data-id="' + it.id + '"' + (n ? "" : " disabled") + ' aria-label="Remove ' + it.name + '">−</button><span class="qty">' + n + '</span>' +
        '<button class="btn sm" data-a="plus" data-id="' + it.id + '"' + (canAdd ? "" : " disabled") + ' aria-label="Add ' + it.name + '">+</button></div></div>'; }).join("");
    var all = SHOP_ITEMS.reduce(function (a, it) { return a + it.price * (it.max || 1); }, 0);
    frame(sc, "shop", '<div class="speaker">Shopkeeper says:</div><p>Before the trail, pack your backpack! Everything here would cost <b>' + all + ' coins</b>, but you only have <b>' + S.coins + '</b>. You <b>can\'t have everything</b>, so choose what matters most for catching the thief.</p>' +
      '<p class="tip">💡 Remember: you may need coins later to travel west!</p><div class="shop">' + rows + '</div>' +
      '<div class="budget">Spending: <b>' + total + '</b> • Coins left after shopping: <b id="left">' + left + '</b></div>' +
      '<div class="choices"><button class="btn primary" id="buy">Done shopping ➜</button></div>');
    document.querySelectorAll(".shop-ctl .btn").forEach(function (b) { b.onclick = function () { var id = b.getAttribute("data-id");
      cart[id] = (cart[id] || 0) + (b.getAttribute("data-a") === "plus" ? 1 : -1); save(); shopScene(sc); }; });
    document.getElementById("buy").onclick = function () {
      var finish = function () { S.coins = left; SHOP_ITEMS.forEach(function (it) { if (cart[it.id]) S.items[it.id] = cart[it.id]; }); go(sc.next); };
      if (left < 6) modal("Are you sure?", "<p>You'll only have <b>" + left + " coins</b> left. Traveling west could cost coins. You can still finish the case, but it may take longer.</p>",
        [{ label: "Yes, I'm sure", fn: finish }, { label: "Let me change my list", cls: "ghost" }]);
      else finish(); };
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function oppScene(sc) {
    var unbought = SHOP_ITEMS.filter(function (it) { return !S.items[it.id] || (it.max && S.items[it.id] < it.max); });
    var bought = SHOP_ITEMS.filter(function (it) { return S.items[it.id]; }).map(function (it) { return it.name + (S.items[it.id] > 1 ? " ×" + S.items[it.id] : ""); });
    frame(sc, "shop", '<p>You bought: <b>' + (bought.length ? bought.join(", ") : "nothing") + '</b>. You have <b>' + S.coins + ' coins</b> left.</p>' +
      '<p>Every time you buy something, you give something else up. The <b>next best thing</b> you gave up is your <b>opportunity cost</b>.</p>' +
      '<p><b>Question:</b> If you\'d had more coins, which item would you have bought NEXT?</p><div class="choices" id="ch"></div><div class="feedback" id="fb" aria-live="polite"></div>');
    var ch = document.getElementById("ch");
    unbought.forEach(function (it) { var b = el('<button class="btn choice">' + it.name + ' (🪙 ' + it.price + ')</button>'); b.onclick = function () {
      S.oppChoice = it.id; save(); var fb = document.getElementById("fb"); fb.className = "feedback good";
      fb.innerHTML = "✅ So the <b>" + it.name + "</b> is your <b>opportunity cost</b>: the value of the next best choice you gave up. Good detectives think about trade-offs!";
      ch.innerHTML = ""; var n = el('<button class="btn primary choice">Head out ➜</button>'); n.onclick = function () { go(sc.next); }; ch.appendChild(n); n.focus(); }; ch.appendChild(b); });
    if (!unbought.length) { var n = el('<button class="btn primary choice">Head out ➜</button>'); n.onclick = function () { go(sc.next); }; ch.appendChild(n); }
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  /* On a phone the map is drawn large enough to tap, inside a frame. Scroll that frame so the important part starts on screen. */
  function focusMap(selector) {
    if (!window.matchMedia("(max-width: 700px)").matches) return;
    requestAnimationFrame(function () {
      var wrap = document.querySelector(".map-wrap");
      if (!wrap) return;
      var el = selector ? wrap.querySelector(selector) : null;
      if (!el) return;
      var wr = wrap.getBoundingClientRect();
      var er = el.getBoundingClientRect();
      wrap.scrollLeft += (er.left + er.width / 2) - (wr.left + wr.width / 2);
      wrap.scrollTop += (er.top + er.height / 2) - (wr.top + wr.height / 2);
    });
  }

  function insetScene(sc) {
    frame(sc, "none", '<p>' + sc.text[0] + '</p><div class="map-wrap">' + ART.insetMap() + '</div><p class="small">Close-up map, not exactly to scale.</p><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var fb = document.getElementById("fb"), ch = document.getElementById("ch");
    var msgs = { east: "That's EAST, across the water: Anastasia Island, where coquina stone for the Castillo was cut. The note says NORTH. Look at the N on the compass rose!",
      south: "That arrow points SOUTH. On this map, north is UP. Try again!", west: "That's WEST. Find the N on the compass rose, then look that way from the Castillo." };
    document.querySelectorAll(".inset-spot[data-spot]").forEach(function (g) { var spot = g.getAttribute("data-spot"); if (spot === "here") return;
      var act = function () { if (spot === "north") { if (!("sa8" in S.quiz)) S.quiz.sa8 = true; fb.className = "feedback good";
          fb.innerHTML = "✅ Yes! <b>Fort Mose</b> is about 2 miles NORTH of the Castillo. The scale bar shows 2 miles."; ch.innerHTML = "";
          var n = el('<button class="btn primary choice">Pack supplies first ➜</button>'); n.onclick = function () { go(sc.next); }; ch.appendChild(n); n.focus(); save(); }
        else { if (!("sa8" in S.quiz)) S.quiz.sa8 = false; fb.className = "feedback try"; fb.innerHTML = "🤔 " + msgs[spot]; save(); } };
      g.addEventListener("click", act); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }); });
    focusMap(".compass");
    wireHud(strip(sc.text[0]));
  }

  function mapScene(sc) {
    var tc = sc.target === "sanluis" && S.travelChoice ? TRAVEL_WEST.filter(function (t) { return t.id === S.travelChoice; })[0] : null;
    var hint = S.items.map ? '<button class="btn sm" id="hint">🗺️ Hint (your road map)</button>' : '';
    frame(sc, "none", '<p class="clue-banner">🔎 ' + sc.text + '</p>' + hint + '<div class="map-wrap">' + ART.floridaMap({ current: S.loc, clickable: true, visited: S.visited }) + '</div><div class="feedback" id="fb" aria-live="polite"></div>');
    var fb = document.getElementById("fb");
    if (S.items.map) document.getElementById("hint").onclick = function () {
      fb.className = "feedback try"; fb.innerHTML = sc.target === "mose" ? "🗺️ Your road map: Fort Mose is the fort symbol just NORTH of St. Augustine (connected by a dotted line)." : "🗺️ Your road map: the RED STAR is the state capital. Look WEST (left) in the Panhandle."; };
    document.querySelectorAll(".marker.clickable").forEach(function (g) { var id = g.getAttribute("data-loc");
      var act = function () {
        if (id === S.loc) { fb.className = "feedback try"; fb.innerHTML = "📍 You're already here! Pick where to go NEXT."; return; }
        if (id === sc.target) {
          var t = tc || sc.travel || { coins: 0, days: 0, energy: 0 };
          var how = tc ? "You take the <b>" + tc.name + "</b> (−" + tc.coins + " coins, +" + tc.days + " day" + (tc.days > 1 ? "s" : "") + ", −" + tc.energy + " energy)." : t.how;
          applyEffect({ coins: -t.coins, days: t.days, energy: -t.energy }); addUnique(S.visited, id); S.loc = id; save();
          modal("🧳 Traveling to " + LOCATIONS[id].name, '<div class="map-mini">' + ART.floridaMap({ current: id, route: [sc.loc, id], visited: S.visited }) + '</div><p>' + how + '</p>',
            [{ label: "Arrive ➜", fn: function () { checkTired(function () { go(sc.next); }); } }]);
          return; }
        if (S.visited.indexOf(id) >= 0) { fb.className = "feedback try"; fb.innerHTML = "🔁 You already searched " + LOCATIONS[id].name + ". Read your newest clue!"; return; }
        var pay = Math.min(3, S.coins); S.decoys++;
        applyEffect({ coins: -pay, days: 1, energy: -1 }); save();
        modal("🚫 No trail in " + LOCATIONS[id].name, "<p>You spent a day and " + pay + " coins getting to " + LOCATIONS[id].name + " and back. Nobody here has seen a red umbrella or purple ink.</p><p><b>Re-read your clue:</b> " + sc.text + "</p>",
          [{ label: "Back to the map", fn: function () { checkTired(render); } }]);
      };
      g.addEventListener("click", act); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }); });
    focusMap('.marker[data-loc="' + sc.target + '"]');
    wireHud(sc.text);
  }

  function mapQScene(sc) {
    frame(sc, "none", '<p class="clue-banner">🎫 ' + sc.text + '</p><div class="map-wrap">' + ART.floridaMap({ current: S.loc, clickable: true, visited: S.visited }) + '</div><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var fb = document.getElementById("fb"), ch = document.getElementById("ch");
    document.querySelectorAll(".marker.clickable").forEach(function (g) { var id = g.getAttribute("data-loc");
      var act = function () { if (id === "sanluis") { if (!("fm5" in S.quiz)) S.quiz.fm5 = true; fb.className = "feedback good";
          fb.innerHTML = "✅ Yes! The <b>red star</b> means state capital: <b>Tallahassee</b>. Mission San Luis is there too."; ch.innerHTML = "";
          var n = el('<button class="btn primary choice">Continue ➜</button>'); n.onclick = function () { go(sc.next); }; ch.appendChild(n); n.focus(); save(); }
        else { if (!("fm5" in S.quiz)) S.quiz.fm5 = false; fb.className = "feedback try"; fb.innerHTML = "🤔 " + LOCATIONS[id].name + " has a different symbol. Check the <b>legend</b>: which symbol means state capital?"; save(); } };
      g.addEventListener("click", act); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }); });
    focusMap(".legend");
    wireHud(strip(sc.text));
  }

  function scaleScene(sc) {
    frame(sc, "none", '<p class="clue-banner">📏 ' + sc.text + '</p><div class="map-wrap">' + ART.floridaMap({ current: S.loc, route: ["staug", "sanluis"], visited: S.visited }) + '</div><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var ch = document.getElementById("ch"), fb = document.getElementById("fb");
    sc.choices.forEach(function (c) { var b = el('<button class="btn choice">' + c.label + '</button>'); b.onclick = function () {
      if (!(S.scene in S.quiz)) S.quiz[S.scene] = !!c.correct;
      if (c.correct) { fb.className = "feedback good"; fb.innerHTML = "✅ " + c.feedback; ch.innerHTML = ""; var n = el('<button class="btn primary choice">Plan the trip ➜</button>'); n.onclick = function () { go(c.next); }; ch.appendChild(n); n.focus(); }
      else { fb.className = "feedback try"; fb.innerHTML = "🤔 " + c.feedback; b.disabled = true; b.classList.add("wrong"); } save(); }; ch.appendChild(b); });
    focusMap(".scalebar");
    wireHud(strip(sc.text));
  }

  function travelScene(sc) {
    var cards = TRAVEL_WEST.map(function (t) { var ok = S.coins >= t.coins;
      return '<button class="travel-card" data-id="' + t.id + '"' + (ok ? "" : " disabled") + '><div class="tc-name">' + t.name + '</div>' +
        '<div class="tc-stats">🪙 ' + t.coins + ' coins • 📅 ' + t.days + ' day' + (t.days > 1 ? "s" : "") + ' • ⚡ −' + t.energy + ' energy</div>' +
        '<div class="tc-ben">👍 <b>Benefit:</b> ' + t.benefit + '</div><div class="tc-cost">👎 <b>Cost:</b> ' + t.cost + '</div>' + (ok ? "" : '<div class="tc-no">Not enough coins</div>') + '</button>'; }).join("");
    frame(sc, "bus", '<p>Tallahassee is about <b>180 miles</b> west. How will you get there? Compare the <b>costs</b> (what you give up) and the <b>benefits</b> (what you gain).</p>' +
      '<p>You have <b>🪙 ' + S.coins + '</b> coins, <b>⚡ ' + S.energy + '</b> energy, and it is <b>Day ' + S.day + '</b>. The thief leaves Florida after Day ' + START.deadline + '.</p><div class="travel-grid">' + cards + '</div>');
    document.querySelectorAll(".travel-card").forEach(function (b) { b.onclick = function () { var t = TRAVEL_WEST.filter(function (x) { return x.id === b.getAttribute("data-id"); })[0];
      var others = TRAVEL_WEST.filter(function (x) { return x.id !== t.id && S.coins >= x.coins; });
      var next = others.length ? others[0] : null;
      modal("Your decision: " + t.name,
        "<p><b>Costs (what you give up):</b> " + t.coins + " coins, " + t.days + " day" + (t.days > 1 ? "s" : "") + " of travel, " + t.energy + " energy.</p><p><b>Benefits (what you gain):</b> " + t.benefit + "</p>" +
        (next ? "<p>Your <b>opportunity cost</b> is the next best choice you gave up, like the <b>" + next.name + "</b>.</p>" : "") + "<p>Is this your informed decision?</p>",
        [{ label: "Yes! Let's go", fn: function () { S.travelChoice = t.id; save(); go(sc.next); } }, { label: "Compare again", cls: "ghost" }]); }; });
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function deductionScene(sc) {
    var sel = S._sel || (S._sel = { sus: null, hide: null });
    var clues = S.clues.map(function (c) { return "<li>" + (CLUES[c].kind === "place" ? "📍 " : "🕵️ ") + CLUES[c].text + "</li>"; }).join("");
    var sus = SUSPECTS.map(function (s) { return '<button class="sus-card' + (sel.sus === s.id ? " sel" : "") + '" data-sus="' + s.id + '" aria-pressed="' + (sel.sus === s.id) + '">' + ART.suspect(s, 110) +
      '<div class="sus-name">' + s.name + '</div><div class="small">' + s.job + '</div><div class="traits">🎩 ' + s.hat + '<br>🎒 ' + s.carry + '<br>✒️ ' + s.ink + '</div></button>'; }).join("");
    var hides = HIDEOUTS.map(function (h) { return '<button class="btn hide-btn' + (sel.hide === h.id ? " sel" : "") + '" data-hide="' + h.id + '" aria-pressed="' + (sel.hide === h.id) + '">' + h.name + '</button>'; }).join("");
    frame(sc, "none", '<p>Use your clues to decide <b>who</b> the thief is and <b>where</b> the Founding Stone is hidden at Mission San Luis.</p>' +
      '<div class="deduce"><div class="deduce-clues"><h3>📓 Your clues</h3><ul>' + clues + '</ul></div>' +
      '<div><h3>1. Who is the thief?</h3><div class="sus-grid">' + sus + '</div><h3>2. Where is the Stone?</h3><div class="hide-grid">' + hides + '</div></div></div>' +
      '<div class="choices"><button class="btn primary big" id="accuse"' + (sel.sus && sel.hide ? "" : " disabled") + '>🔍 Make the accusation!</button></div>');
    document.querySelectorAll(".sus-card").forEach(function (b) { b.onclick = function () { sel.sus = b.getAttribute("data-sus"); deductionScene(sc); }; });
    document.querySelectorAll(".hide-btn").forEach(function (b) { b.onclick = function () { sel.hide = b.getAttribute("data-hide"); deductionScene(sc); }; });
    document.getElementById("accuse").onclick = function () { S.deduceTries++; var s = SUSPECTS.filter(function (x) { return x.id === sel.sus; })[0];
      var okS = sel.sus === THIEF, okH = sel.hide === HIDEOUT; save();
      if (okS && okH) { modal("🎉 You got it!", '<div class="center">' + ART.suspect(s, 140) + '</div><p><b>' + s.name + '</b> is caught red-umbrella-handed, right outside the <b>Apalachee Council House</b>!</p><p>"Drat! Foiled by a junior detective!"</p><p>But the Stone is locked in a case with a <b>Timeline Lock</b>…</p>',
          [{ label: "Open the Timeline Lock ➜", fn: function () { delete S._sel; go(sc.next); } }]); return; }
      var hints = [];
      if (!okS) { if (s.ink !== "purple ink") hints.push("Clue check: the thief writes in <b>purple ink</b>. " + s.name + " uses " + s.ink + ".");
        else if (s.carry !== "red umbrella") hints.push("Clue check: the thief carries a <b>red umbrella</b>. " + s.name + " carries a " + s.carry + "."); }
      if (!okH) hints.push("Re-read the last note: the Stone is in the building where <b>Apalachee leaders met every day</b> to discuss community business. Your notebook facts can help!");
      modal("Not quite, detective!", "<p>The thief is still hiding. No problem: good detectives check their evidence again.</p><ul>" + hints.map(function (h) { return "<li>" + h + "</li>"; }).join("") + "</ul>",
        [{ label: "Try again", fn: render }, { label: "📓 Open Notebook", cls: "ghost", fn: notebook }]); };
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function timelineScene(sc) {
    var st = S._tl || (S._tl = { placed: [], order: [3, 0, 4, 1, 2] });
    var slots = TIMELINE.map(function (_, i) { var ev = st.placed[i] != null ? TIMELINE[st.placed[i]] : null;
      return '<div class="tl-slot' + (ev ? " full" : "") + '"><div class="tl-num">' + (i + 1) + '</div>' + (ev ? '<b>' + ev.year + '</b> ' + ev.text : '<span class="small">tap an event</span>') + '</div>'; }).join('<div class="tl-arrow">➜</div>');
    var cards = st.order.filter(function (i) { return st.placed.indexOf(i) < 0; }).map(function (i) { return '<button class="btn tl-card" data-i="' + i + '"><b>' + TIMELINE[i].year + '</b><br>' + TIMELINE[i].text + '</button>'; }).join("");
    frame(sc, "none", '<p>The Founding Stone is locked inside a case. To open it, put these events in order from <b>EARLIEST to LATEST</b>. Tap the events one at a time.</p>' +
      '<div class="timeline">' + slots + '</div><div class="tl-cards">' + cards + '</div><div class="feedback" id="fb" aria-live="polite"></div>' +
      '<div class="choices"><button class="btn ghost" id="undo"' + (st.placed.length ? "" : " disabled") + '>↩ Undo</button></div>');
    document.querySelectorAll(".tl-card").forEach(function (b) { b.onclick = function () { st.placed.push(+b.getAttribute("data-i"));
      if (st.placed.length === TIMELINE.length) { var ok = st.placed.every(function (v, i) { return v === i; }); S.timelineTries++;
        if (ok) { timelineScene(sc); var fb = document.getElementById("fb"); fb.className = "feedback good"; fb.innerHTML = "✅ <b>Click!</b> The lock opens. You did it!";
          var c = document.querySelector(".choices"); c.innerHTML = ""; var n = el('<button class="btn primary big">Recover the Founding Stone ➜</button>'); n.onclick = function () { delete S._tl; go(sc.next); }; c.appendChild(n); n.focus(); save(); return; }
        save(); modal("The lock won't open yet", "<p>Some events are out of order. Look at the <b>years</b>: smaller numbers come first!</p>", [{ label: "Try again", fn: function () { st.placed = []; timelineScene(sc); } }]); return; }
      timelineScene(sc); }; });
    document.getElementById("undo").onclick = function () { st.placed.pop(); timelineScene(sc); };
    wireHud(strip(app.querySelector(".panel").innerHTML));
  }

  function winScene(sc) {
    var qs = Object.keys(S.quiz), first = qs.filter(function (k) { return S.quiz[k]; }).length;
    var onTime = S.day <= START.deadline, sharp = qs.length && first / qs.length >= 0.7, firstGuess = S.deduceTries <= 1;
    var stars = (onTime ? 1 : 0) + (sharp ? 1 : 0) + (firstGuess ? 1 : 0);
    var mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
    var learned = ["Ponce de León named <b>la Florida</b> in 1513, and explorers like de Soto searched for gold and silver.",
      "<b>St. Augustine</b> (1565) is the oldest permanent European settlement in the continental U.S. Spain, France, and England all wanted Florida.",
      "The <b>Timucua</b> and <b>Apalachee</b> both grew corn, beans, and squash. Colonization brought disease and hard changes to Native peoples.",
      "<b>Fort Mose</b> (1738) was the first legally sanctioned free Black settlement in what is now the U.S.",
      "<b>Mission San Luis</b> (1656–1704) was a church, a government center, and a fort, home to Apalachee and Spanish people.",
      "Primary sources are first-hand; secondary sources come later. Maps use compass roses, legends, and scale bars.",
      "You can't buy everything. The next best thing you give up is your <b>opportunity cost</b>, and smart choices compare costs and benefits."];
    app.innerHTML = '<main class="win"><div class="art">' + ART.scene("council").replace("<svg ", '<svg preserveAspectRatio="xMidYMax slice" ') + '</div><section class="panel center"><h1>🏆 Case Closed!</h1>' +
      '<div class="stars" aria-label="' + stars + ' of 3 stars">' + [0, 1, 2].map(function (i) { return '<span class="' + (i < stars ? "on" : "") + '">★</span>'; }).join("") + '</div>' +
      '<p>You recovered the <b>Founding Stone</b> and caught <b>Penny Pinch</b>!' + (onTime ? "" : " (Phew, the thief was just about to leave Florida!)") + '</p>' +
      '<div class="win-stats"><div>📅 Finished on Day <b>' + S.day + '</b>' + (onTime ? " ⭐ on time" : "") + '</div><div>✅ First-try answers: <b>' + first + '/' + qs.length + '</b>' + (sharp ? " ⭐" : "") + '</div><div>🔍 Accusations: <b>' + S.deduceTries + '</b>' + (firstGuess ? " ⭐" : "") + '</div><div>🪙 Coins left: <b>' + S.coins + '</b> • 🚫 Wrong-way trips: <b>' + S.decoys + '</b></div><div>⏱ About ' + mins + ' min</div></div>' +
      '<h2>What you learned</h2><ul class="learned">' + learned.map(function (l) { return "<li>" + l + "</li>"; }).join("") + '</ul>' +
      '<div class="btn-row"><button class="btn primary big" id="again">▶ Play again</button><button class="btn" id="home">Title screen</button></div></section></main>';
    document.getElementById("again").onclick = function () { clearSave(); S = fresh(); enter(SCENES.intro); render(); };
    document.getElementById("home").onclick = title; clearSave();
  }

  /* expose a tiny API for automated play-testing */
  window.FTB = { state: function () { return S; }, go: go, title: title };
  window.addEventListener("DOMContentLoaded", function () { app = document.getElementById("app"); document.title = GAME_TITLE + " — " + GAME_SUBTITLE; title(); });
})();
