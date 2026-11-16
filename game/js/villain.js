/* Florida Trailblazers v7 — The Swamp Fox Heist.
   A parallel, kid-safe chase layered on Case 1 (Penny Pinch and the Founding Stone stay the same).
   All characters are fictional. Treasures taken in the story are made-up exhibit items, tied to real places and facts. */
var HEIST = (function () {
  "use strict";
  var X = function () { return window.FTBX; };
  var IMG = "assets/img/villain/";
  var METER_MAX = 10;
  var FOX = { name: "The Swamp Fox", short: "Swamp Fox" };
  var STOPS = [
    { id: "staug", at: ["sa1"], loc: "staug", pose: "taunt", hench: null,
      treasure: "a historic Spanish cannon from the Castillo gun deck",
      treasureShort: "a Castillo cannon",
      note: "Too slow, Detective! I rolled a historic cannon right off the Castillo's gun deck. Catch me if you can!",
      fact: "The real cannons still stand at the Castillo de San Marcos. This theft is just part of our story." },
    { id: "mose", at: ["fm1"], loc: "mose", pose: "run", hench: "gil",
      treasure: "a replica militia drum from the Fort Mose visitor exhibit",
      treasureShort: "a replica militia drum",
      note: "I borrowed a replica militia drum from the visitor exhibit. My helper Gator Gil almost dropped it in the marsh!",
      fact: "Fort Mose's free Black militia really did help defend St. Augustine. The drum in this story is a made-up exhibit replica." },
    { id: "sanluis", at: ["sl1"], loc: "sanluis", pose: "taunt", hench: "minnow",
      treasure: "a replica church bell from Mission San Luis",
      treasureShort: "a replica church bell",
      note: "A replica church bell is coming with me. The people here once buried the real bells — I just had to take a copy!",
      fact: "In 1704 the people of San Luis really did bury church bells, hoping to return. The bell in this story is a made-up replica." }
  ];
  var CLUES = {
    2:  { id: "c2",  text: "A muddy paw print points north, toward Fort Mose." },
    4:  { id: "c4",  text: "Someone asked a ranger for a westbound bus to the state capital." },
    6:  { id: "c6",  text: "Gator Gil dropped a crate near the marsh. Hay and a drum beater were inside." },
    8:  { id: "c8",  text: "Minnow was seen watching the path to Mission San Luis." },
    10: { id: "c10", text: "She's close! Search the council house grounds at the end of the case." }
  };

  function esc(t) { return X() ? X().esc(t) : String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function src(name, small) { return IMG + name + (small ? "_s" : "") + ".webp"; }
  function foxImg(pose, small) { return src("fox_" + (pose || "taunt"), small); }
  function henchImg(id, mood, small) {
    if (id === "gil") return src(mood === "oops" ? "gil_oops" : "gil_neutral", small);
    if (id === "minnow") return src(mood === "nervous" ? "minnow_nervous" : "minnow_lookout", small);
    return "";
  }
  function emptyHeist() { return { introShown: false, meter: 0, answered: [], cards: [], clues: [], captured: false }; }
  function init(st) { if (st && !st.heist) st.heist = emptyHeist(); return st; }
  function ensure() {
    var st = X() ? X().S() : null;
    if (!st) return null;
    if (!st.heist) { st.heist = emptyHeist(); if (X().save) X().save(); }
    st.heist.answered = st.heist.answered || [];
    st.heist.cards = st.heist.cards || [];
    st.heist.clues = st.heist.clues || [];
    if (typeof st.heist.meter !== "number") st.heist.meter = 0;
    return st;
  }
  function stopForScene(id) {
    var i, s;
    for (i = 0; i < STOPS.length; i++) { s = STOPS[i]; if (s.at.indexOf(id) >= 0) return s; }
    return null;
  }
  function markCard(id) {
    var st = ensure(); if (!st) return;
    if (st.heist.cards.indexOf(id) < 0) { st.heist.cards.push(id); if (X().save) X().save(); }
  }

  function cardHtml(stop) {
    var hench = "";
    if (stop.hench === "gil") hench = '<figure class="fox-hench"><img src="' + henchImg("gil", "oops") + '" alt="Gator Gil, a clumsy henchman, dropping a crate" draggable="false"><figcaption>Gator Gil, her clumsy helper</figcaption></figure>';
    if (stop.hench === "minnow") hench = '<figure class="fox-hench"><img src="' + henchImg("minnow", "lookout") + '" alt="Minnow, a nervous lookout, peeking from behind a tree" draggable="false"><figcaption>Minnow, her nervous lookout</figcaption></figure>';
    return '<section class="fox-card" data-stop="' + stop.id + '" aria-label="Calling card from the Swamp Fox at ' + esc((LOCATIONS[stop.loc] || {}).name || stop.id) + '">' +
      '<div class="fox-card-kicker">🦝 Bonus chase · Calling card</div>' +
      '<div class="fox-card-row">' +
        '<div class="fox-card-art" style="background-image:url(\'' + src("fox_card") + '\')">' +
          '<p class="fox-note">' + esc(stop.note) + '</p>' +
          '<p class="fox-sign">— The Swamp Fox</p>' +
        '</div>' +
        '<div class="fox-card-side">' +
          '<img class="fox-pose" src="' + foxImg(stop.pose) + '" alt="The Swamp Fox ' + (stop.pose === "run" ? "running away with a cannon" : "smirking and holding a calling card") + '" draggable="false">' +
          hench +
          '<p class="fox-treasure"><b>She took:</b> ' + esc(stop.treasure) + '</p>' +
          '<p class="small fox-fact">' + esc(stop.fact) + '</p>' +
        '</div>' +
      '</div>' +
    '</section>';
  }
  function introHtml() {
    return '<div class="fox-intro" id="fox-intro">' +
      '<img class="fox-pose big" src="' + foxImg("taunt") + '" alt="The Swamp Fox, a sly thief in a raccoon mask and a gator-scale vest, smirking and holding a calling card" draggable="false">' +
      '<div class="fox-intro-text">' +
        '<p class="fox-bonus-tag">Bonus case thread</p>' +
        '<p>Your <b>main case</b> is still the Founding Stone — and catching <b>Penny Pinch</b>.</p>' +
        '<p>This is a separate <b>bonus chase</b>: while you work that main case, a second made-up thief called <b>the Swamp Fox</b> is snatching exhibit treasures at every stop.</p>' +
        '<p>Look for her painted calling cards. Each right answer helps you close in on this bonus case. Catch her at the end — and get her mugshot for your Detective ID!</p>' +
        '<p class="small">(The Swamp Fox, Gator Gil and Minnow are made up, just like Penny Pinch. The places and history facts are real.)</p>' +
      '</div></div>';
  }
  function showIntro() {
    var st = ensure(); if (!st || !X()) return;
    st.heist.introShown = true; X().save();
    X().modal("🦝 Bonus chase: The Swamp Fox", introHtml(), [{ label: "I'll watch for her cards ➜", cls: "primary" }], { cls: "wide fox-intro-modal", escClose: true });
    if (window.SFX) SFX.play("pop");
    if (window.READALOUD) { var m = document.getElementById("modal"); if (m && READALOUD.afterScreen) READALOUD.afterScreen(m); }
  }
  function meterHud(sc) {
    var st = ensure();
    if (!st || !sc || !sc.chapter) return "";
    var n = st.heist.meter, pct = Math.round((n / METER_MAX) * 100);
    var label = n >= METER_MAX ? "Bonus chase: you are right on her heels!" : "Bonus chase: closing in on the Swamp Fox";
    return '<div class="fox-meter" id="fox-meter" title="' + esc(label) + '" aria-label="' + esc(label) + ': ' + n + ' of ' + METER_MAX + '">' +
      '<span class="fox-meter-lbl">🦝 Bonus chase</span>' +
      '<span class="fox-meter-track"><span class="fox-meter-fill" style="width:' + pct + '%"></span></span>' +
      '<span class="fox-meter-n">' + n + '/' + METER_MAX + '</span>' +
    '</div>';
  }
  function updateMeterDom() {
    var st = ensure(), el = document.getElementById("fox-meter");
    if (!st || !el) return;
    var n = st.heist.meter, pct = Math.round((n / METER_MAX) * 100);
    var fill = el.querySelector(".fox-meter-fill"), num = el.querySelector(".fox-meter-n");
    if (fill) fill.style.width = pct + "%";
    if (num) num.textContent = n + "/" + METER_MAX;
    var label = n >= METER_MAX ? "Bonus chase: you are right on her heels!" : "Bonus chase: closing in on the Swamp Fox";
    el.setAttribute("aria-label", label + ": " + n + " of " + METER_MAX);
    el.title = label;
    el.classList.toggle("hot", n >= METER_MAX);
  }
  function confettiHtml() {
    var bits = [], i, em = ["✦", "★", "•", "◆"];
    for (i = 0; i < 24; i++) bits.push('<span class="fox-bit" style="left:' + (4 + (i * 4) % 96) + '%;animation-delay:' + ((i % 8) * 0.08) + 's">' + em[i % em.length] + '</span>');
    return '<div class="fox-confetti" aria-hidden="true">' + bits.join("") + '</div>';
  }
  function captureHtml() {
    return '<section class="fox-capture" id="fox-capture" aria-label="You caught the Swamp Fox">' +
      confettiHtml() +
      '<img class="fox-pose big" src="' + foxImg("caught") + '" alt="The Swamp Fox, surprised and caught, dropping a small sack" draggable="false">' +
      '<div class="fox-capture-text">' +
        '<h2>🦝 Bonus chase complete: you caught the Swamp Fox!</h2>' +
        '<p>You closed in, and she tried to sneak off with the treasures. You caught her! The cannon, the drum, and the bell are going back to their exhibits.</p>' +
        '<p>"Drat!" she laughs. "Foiled by a junior detective!"</p>' +
      '</div>' +
      '<figure class="fox-mug">' +
        '<img src="' + src("fox_mugshot") + '" alt="Mugshot of the Swamp Fox standing in front of a height chart, holding a sign that says Swamp Fox" draggable="false">' +
        '<figcaption>Captured (bonus case): The Swamp Fox — added to your Detective ID</figcaption>' +
      '</figure>' +
    '</section>';
  }
  function captureNow() {
    var st = ensure(); if (!st) return;
    if (!st.heist.captured) {
      st.heist.captured = true; st.heist.capturedAt = Date.now();
      if (st.heist.meter < METER_MAX) st.heist.meter = METER_MAX;
      if (window.V3 && V3.players) {
        V3.players().forEach(function (n) {
          if (!n || n === "Guest") return;
          var p = V3.profile(n);
          p.captured = p.captured || [];
          var has = p.captured.some(function (c) { return c.id === "fox"; });
          if (!has) p.captured.push({ id: "fox", name: "The Swamp Fox", at: Date.now(), caseTitle: "Case 1: The Stolen Founding Stone" });
          V3.saveProfile(p);
        });
      }
      if (X() && X().save) X().save();
    }
    if (window.SFX) { SFX.setMode("capture"); }
  }
  function decorateWin(r) {
    r = r || { html: "" };
    captureNow();
    r.html = captureHtml() + (r.html || "");
    return r;
  }
  function capturedFor(name) {
    if (!window.V3 || !name) return [];
    var p = V3.profile(name);
    return (p && p.captured) ? p.captured : [];
  }
  function decorateIdCard(html, name) {
    var list = capturedFor(name);
    if (!list.length) return html;
    var gal = '<div class="id-wanted" aria-label="Captured villains">' +
      '<p class="id-label">Bonus chase — Most Wanted / Captured</p>' +
      '<div class="id-wanted-row">' + list.map(function (c) {
        var img = c.id === "fox" ? src("fox_mugshot", true) : "";
        return '<figure class="id-mug"><img src="' + img + '" alt="Mugshot of ' + esc(c.name) + '" draggable="false"><figcaption>' + esc(c.name) + '</figcaption></figure>';
      }).join("") + '</div></div>';
    if (html.indexOf('<footer class="id-foot">') >= 0) return html.replace('<footer class="id-foot">', gal + '<footer class="id-foot">');
    if (html.indexOf("</article>") >= 0) return html.replace("</article>", gal + "</article>");
    return html + gal;
  }
  function creditsHtml() {
    return '<h2>The Swamp Fox Heist (original painted art)</h2>' +
      '<p class="small">The Swamp Fox, Gator Gil and Minnow are original, made-up characters. Their painted portraits were created for this game (AI-generated original art of fictional people, not pictures of real persons). Stored as WebP in <code>assets/img/villain/</code>.</p>' +
      '<ul class="cred-list fox-creds">' +
        [['fox_taunt.webp', 'The Swamp Fox, smirking with a calling card'],
         ['fox_run.webp', 'The Swamp Fox running away with a cannon'],
         ['fox_caught.webp', 'The Swamp Fox, surprised and caught'],
         ['fox_mugshot.webp', 'The Swamp Fox mugshot with a height chart'],
         ['fox_card.webp', 'Blank painted calling-card template'],
         ['gil_neutral.webp', 'Gator Gil, her clumsy helper'],
         ['gil_oops.webp', 'Gator Gil dropping a crate'],
         ['minnow_lookout.webp', 'Minnow, her nervous lookout, peeking from a tree'],
         ['minnow_nervous.webp', 'Minnow looking nervous']].map(function (row) {
           return '<li class="cred"><img src="' + IMG + row[0].replace(".webp", "_s.webp") + '" alt="" width="72" height="96" loading="lazy"><div><b>' + esc(row[1]) + '</b><br><span class="small">' + row[0] + ' — original painted character art created for Florida Trailblazers. License: original work for this game (not a real person).</span></div></li>';
         }).join("") +
      '</ul>' +
      '<p class="small">Story treasures (the Castillo cannon, the Fort Mose replica drum, and the San Luis replica bell) are made up for the chase. The places and the history around them are real: the Castillo really has historic cannons; Fort Mose\'s militia helped defend St. Augustine; in 1704 the people of San Luis buried church bells, hoping to return.</p>';
  }
  function followScene(sc) {
    if (!window.SFX || !SFX.setMode) return;
    if (!sc) { SFX.setMode("title"); return; }
    var t = sc.type || "story";
    if (t === "win") SFX.setMode("capture");
    else if (t === "map" || t === "mapq" || t === "scaleq" || t === "travel" || t === "inset") SFX.setMode("map");
    else SFX.setMode("investigate");
  }
  function afterFrame(sc) {
    var st = ensure();
    followScene(sc);
    if (!st) return;
    var panel = document.querySelector("main .panel");
    var stop = stopForScene(st.scene);
    if (panel && stop && !panel.querySelector(".fox-card")) {
      var el = X().el(cardHtml(stop));
      var after = panel.querySelector(".talk-card") || panel.querySelector(".turn-banner") || panel.querySelector("h2");
      if (after && after.parentNode) after.parentNode.insertBefore(el, after.nextSibling);
      else panel.appendChild(el);
      markCard(stop.id);
      if (window.READALOUD && READALOUD.afterScreen) {
        var note = el.querySelector(".fox-note");
        if (note && READALOUD.attachBlock) READALOUD.attachBlock(note, "Read this calling card aloud");
        else READALOUD.afterScreen(el);
      }
    }
    if (panel && st.scene === "intro" && !panel.querySelector(".fox-intro")) {
      var intro = X().el(introHtml());
      var h = panel.querySelector("h2");
      if (h && h.parentNode) h.parentNode.insertBefore(intro, h.nextSibling);
      else panel.insertBefore(intro, panel.firstChild);
      st.heist.introShown = true;
      if (X().save) X().save();
      if (window.READALOUD && READALOUD.afterScreen) READALOUD.afterScreen(intro);
    }
    updateMeterDom();
  }
  function afterGo(/* prev, sc, id */) { /* cards and intro are handled in afterFrame */ }
  function onAttempt(id, correct) {
    if (!correct) return;
    var st = ensure(); if (!st) return;
    if (st.heist.answered.indexOf(id) >= 0) return;
    st.heist.answered.push(id);
    if (st.heist.meter < METER_MAX) st.heist.meter += 1;
    var clue = CLUES[st.heist.meter];
    if (clue && st.heist.clues.indexOf(clue.id) < 0) {
      st.heist.clues.push(clue.id);
      if (X() && X().toast) X().toast("🦝 Bonus chase clue: " + clue.text);
      if (window.SFX) SFX.play("clue");
    }
    if (X() && X().save) X().save();
    updateMeterDom();
  }

  function hook() {
    if (!window.V3) return;
    var _init = V3.initState, _af = V3.afterFrame, _ag = V3.afterGo, _oa = V3.onAttempt;
    var _ow = V3.onWin, _ww = V3.wireWin, _dc = V3.detectiveCard, _th = V3.teacherHtml, _tw = V3.wireTeacher, _he = V3.hudExtra;
    V3.initState = function (st, team) { _init(st, team); init(st); };
    V3.afterFrame = function (sc) { _af(sc); afterFrame(sc); };
    V3.afterGo = function (prev, sc, id) { _ag(prev, sc, id); afterGo(prev, sc, id); };
    V3.onAttempt = function (id, correct) { _oa(id, correct); onAttempt(id, correct); };
    if (_ow) V3.onWin = function (score, rank) { return decorateWin(_ow(score, rank)); };
    if (_ww) V3.wireWin = function () { _ww(); if (window.SFX) SFX.setMode("capture"); };
    if (_dc) V3.detectiveCard = function (name, opts) { return decorateIdCard(_dc(name, opts), name); };
    if (_he) V3.hudExtra = function (sc) { return _he(sc) + meterHud(sc); };
    if (_th) V3.teacherHtml = function () { return _th() + (window.SFX && SFX.teacherHtml ? SFX.teacherHtml() : ""); };
    if (_tw) V3.wireTeacher = function () { _tw(); if (window.SFX && SFX.wireTeacher) SFX.wireTeacher(); };
  }
  hook();

  return {
    STOPS: STOPS, FOX: FOX, METER_MAX: METER_MAX, CLUES: CLUES,
    ensure: ensure, init: init, stopForScene: stopForScene,
    cardHtml: cardHtml, introHtml: introHtml, showIntro: showIntro,
    meterHud: meterHud, captureHtml: captureHtml, captureNow: captureNow,
    decorateWin: decorateWin, decorateIdCard: decorateIdCard, creditsHtml: creditsHtml,
    onAttempt: onAttempt, afterFrame: afterFrame, capturedFor: capturedFor,
    meter: function () { var st = ensure(); return st && st.heist ? st.heist.meter : 0; },
    captured: function () { var st = ensure(); return !!(st && st.heist && st.heist.captured); }
  };
})();
