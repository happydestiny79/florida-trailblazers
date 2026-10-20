/* Florida Trailblazers v3 — hands-on clue scenes (search hotspots + magnifier, torn map, dust), the suspect line-up,
   and the arrest-warrant builder. Every interaction works with touch, mouse and keyboard. */
(function () {
  "use strict";
  var X = function () { return window.FTBX; }, S = function () { return window.FTBX.S(); };
  function esc(t) { return X().esc(t); }

  /* ----- scene graph changes for v3 ----- */
  var c = SCENES.sa1case;
  SCENES.sa1case = { loc: c.loc, img: "castillo_room", chapter: 1, speaker: "You", title: c.title, type: "search", search: "sa1case", next: "sa_lineup", teaches: c.teaches };
  SCENES.sa_lineup = { loc: "staug", img: "castillo_wall", chapter: 1, speaker: "Ranger Rosa", title: "Four Visitors, Four Suspects", type: "lineup", next: "sa2",
    text: ["Ranger Rosa says four visitors were in the room this morning. Each one gets a <b>wanted poster</b> (a dossier). Interview at least <b>two</b> of them. What you ask decides what you learn!"] };
  SCENES.fm4.choices.forEach(function (ch) { if (ch.next === "fm5") ch.next = "fm4map"; });
  SCENES.fm4help.choices.forEach(function (ch) { if (ch.next === "fm5") ch.next = "fm4map"; });
  SCENES.fm4map = { loc: "mose", img: "gibson1763", chapter: 2, speaker: "You", title: "A Torn-Up Map!", type: "tornmap", puzzle: "fm4map", next: "fm5", teaches: ["SS.4.G.1.4"] };
  SCENES.deduce.type = "warrant"; SCENES.deduce.title = "Arrest Warrant";
  SCENES.timeline.next = "stone";
  SCENES.stone = { loc: "sanluis", img: "sl_council", chapter: 3, speaker: "You", title: "Clean the Founding Stone", type: "dust", dust: "stone", next: "win", teaches: ["SS.4.A.3.3"] };

  function done(id) { var st = S(); st.v3.tasks = st.v3.tasks || {}; st.v3.tasks[id] = true; X().save(); }

  /* ----- 1. search: tap-to-search hotspots + magnifying glass ----- */
  V3.scenes.search = function (sc) { var st = V3.ensure(), D = SEARCH[sc.search], I = IMAGES[D.img], found = st.clues.indexOf(D.lensTarget.clue) >= 0, lensOn = false, lx = 30, ly = 40;
    st.v3.searched = st.v3.searched || [];
    X().frame(sc, '<p>' + esc(D.intro) + '</p><div class="search-wrap" id="sw"><img class="search-img" src="' + X().img(D.img) + '" alt="' + esc(I.alt) + '" draggable="false">' +
      D.spots.map(function (p) { return '<button class="hotspot' + (st.v3.searched.indexOf(p.id) >= 0 ? " seen" : "") + '" data-spot="' + p.id + '" style="left:' + p.x + '%;top:' + p.y + '%" aria-label="Search: ' + esc(p.label) + '"><span></span></button>'; }).join("") +
      '<div class="smudge" style="left:' + D.lensTarget.x + '%;top:' + D.lensTarget.y + '%" aria-hidden="true"></div>' +
      '<div class="lens hidden" id="lens" role="slider" tabindex="0" aria-label="Magnifying glass. Use arrow keys to move it, Enter to look closely." aria-valuetext=""><div class="lens-in" id="lensin"></div></div></div>' +
      '<div class="lens-bar"><button class="btn" id="lensbtn" aria-pressed="false">🔍 Magnifying glass</button><span class="small" id="lenshelp">Drag the glass over the photo (or use the arrow keys).</span></div>' +
      '<div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var sw = document.getElementById("sw"), lens = document.getElementById("lens"), lin = document.getElementById("lensin"), ZOOM = 2.6;
    function place() { var W = sw.clientWidth, H = sw.clientHeight, R = lens.offsetWidth / 2; lens.style.left = (lx / 100 * W - R) + "px"; lens.style.top = (ly / 100 * H - R) + "px";
      lin.style.width = W * ZOOM + "px"; lin.style.height = H * ZOOM + "px"; lin.style.left = (R - lx / 100 * W * ZOOM) + "px"; lin.style.top = (R - ly / 100 * H * ZOOM) + "px";
      lens.setAttribute("aria-valuetext", "Glass at " + Math.round(lx) + "% across, " + Math.round(ly) + "% down"); check(false); }
    lin.innerHTML = '<img src="' + X().img(D.img) + '" alt=""><div class="smudge big" style="left:' + D.lensTarget.x + '%;top:' + D.lensTarget.y + '%"></div>';
    var hold = null;
    function near() { var T = D.lensTarget, dx = lx - T.x, dy = (ly - T.y) * sw.clientHeight / sw.clientWidth; return Math.sqrt(dx * dx + dy * dy) < T.r; }
    function check(now) { if (found) return; clearTimeout(hold); if (!near()) { lens.classList.remove("warm"); return; } lens.classList.add("warm");
      hold = setTimeout(win, now ? 0 : 450); }
    function win() { if (found) return; found = true; X().addUnique(st.clues, D.lensTarget.clue); X().attempt("search_" + S().scene, true); done("lens"); lens.classList.add("found");
      window.SFX && SFX.play("clue"); X().fb("good", "🔎 <b>Clue!</b> Under the glass you spot " + esc(D.lensTarget.label) + ". " + CLUES[D.lensTarget.clue].text); finish(); }
    function finish() { X().nextBtn("Talk to the visitors ➜", function () { X().go(sc.next); }); }
    function setLens(on) { lensOn = on; lens.classList.toggle("hidden", !on); var b = document.getElementById("lensbtn"); b.setAttribute("aria-pressed", on); b.textContent = on ? "✋ Put the glass away" : "🔍 Magnifying glass"; if (on) { place(); lens.focus({ preventScroll: true }); } }
    document.getElementById("lensbtn").onclick = function () { setLens(!lensOn); };
    sw.querySelectorAll(".hotspot").forEach(function (h) { h.onclick = function () { var p = D.spots.filter(function (x) { return x.id === h.getAttribute("data-spot"); })[0];
      X().addUnique(st.v3.searched, p.id); h.classList.add("seen"); window.SFX && SFX.play("pop"); X().save();
      if (found) { X().fb("good", "✔ " + esc(p.text.split(".")[0]) + ". You already found the clue here."); return; }
      X().fb(p.lens ? "try" : "", (p.lens ? "🔍 " : "👀 ") + esc(p.text)); if (p.lens) { lx = p.x - 12; ly = p.y - 14; setLens(true); } }; });
    var drag = null;
    lens.addEventListener("pointerdown", function (e) { drag = { id: e.pointerId }; try { lens.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); });
    lens.addEventListener("pointermove", function (e) { if (!drag || e.pointerId !== drag.id) return; var r = sw.getBoundingClientRect(); lx = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)); ly = Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)); place(); e.preventDefault(); });
    var up = function () { drag = null; }; lens.addEventListener("pointerup", up); lens.addEventListener("pointercancel", up);
    lens.addEventListener("keydown", function (e) { var k = e.key, st2 = e.shiftKey ? 1 : 4;
      if (k === "ArrowLeft") lx -= st2; else if (k === "ArrowRight") lx += st2; else if (k === "ArrowUp") ly -= st2; else if (k === "ArrowDown") ly += st2;
      else if (k === "Enter" || k === " ") { e.preventDefault(); if (near()) win(); else X().fb("try", "🔍 Nothing here. Keep moving the glass over the display case."); return; }
      else if (k === "Escape") { setLens(false); return; } else return;
      e.preventDefault(); lx = Math.max(0, Math.min(100, lx)); ly = Math.max(0, Math.min(100, ly)); place(); });
    window.addEventListener("resize", function () { if (lensOn && document.body.contains(lens)) place(); });
    if (found) { X().fb("good", "✔ You found the purple ink smudge here."); finish(); }
    X().wireHud(X().strip(D.intro));
    window.FTB.lensTo = function (x, y) { lx = x; ly = y; if (!lensOn) setLens(true); place(); };
  };

  /* ----- suspect line-up ----- */
  V3.scenes.lineup = function (sc) { var st = V3.ensure();
    function talked() { return SUSPECTS.filter(function (s) { return (st.v3.asked[s.id] || []).length; }).length; }
    X().frame(sc, '<p>' + sc.text[0] + '</p>' + V3.dossierHtml() + '<div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>', { wide: true });
    var redraw = function () { var y = window.scrollY; V3.scenes.lineup(sc); window.scrollTo(0, y); };
    V3.wireDossiers(document.querySelector("main .panel"), redraw);
    var n = talked(), ch = document.getElementById("ch");
    if (n >= 2) X().nextBtn("I've heard enough. Keep investigating ➜", function () { X().go(sc.next); });
    else ch.innerHTML = '<p class="small" id="need">Interview ' + (2 - n) + ' more suspect' + (2 - n > 1 ? "s" : "") + ' to continue.</p>';
    X().wireHud(X().strip(sc.text[0]));
  };

  /* ----- 2. torn map puzzle ----- */
  V3.scenes.tornmap = function (sc) { var st = V3.ensure(), P = TORNMAP[sc.puzzle], I = IMAGES[P.img], n = P.cols * P.rows, at = st.v3.torn || (st.v3.torn = {}), sel = null, solved = st.clues.indexOf(P.clue) >= 0;
    var order = X().shuffled(n, 77, true), ratio = I.h / I.w;
    function pieceStyle(k) { var cx = k % P.cols, cy = Math.floor(k / P.cols); return 'background-image:url(' + X().img(P.img) + ');background-size:' + (P.cols * 100) + '% ' + (P.rows * 100) + '%;background-position:' + (cx / (P.cols - 1) * 100) + '% ' + (cy / (P.rows - 1) * 100) + '%;'; }
    function rot(k) { return ((k * 37) % 13) - 6; }
    function draw() {
      var board = '<div class="torn-board" id="board" style="grid-template-columns:repeat(' + P.cols + ',1fr);aspect-ratio:' + I.w + '/' + I.h + '">';
      for (var slot = 0; slot < n; slot++) { var here = Object.keys(at).filter(function (k) { return at[k] === slot; })[0];
        board += '<div class="torn-slot' + (here != null ? " full" : "") + '" data-slot="' + slot + '" role="button" tabindex="0" aria-label="Map spot ' + (slot + 1) + (here != null ? ", filled" : ", empty") + '">' + (here != null ? '<div class="piece placed" style="' + pieceStyle(+here) + '"></div>' : '<span>' + (slot + 1) + '</span>') + '</div>'; }
      board += (solved ? '<svg class="torn-arrow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="ah" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#7b3fa0"/></marker></defs><path d="M' + P.arrow.x1 + ' ' + P.arrow.y1 + ' Q50 ' + (P.arrow.y1 - 14) + ' ' + P.arrow.x2 + ' ' + P.arrow.y2 + '" stroke="#7b3fa0" stroke-width="2.2" fill="none" stroke-dasharray="4 2" marker-end="url(#ah)"/></svg>' : "") + '</div>';
      var pool = '<div class="torn-pool" id="pool">' + order.filter(function (k) { return at[k] == null; }).map(function (k) { return '<button class="piece' + (sel === k ? " sel" : "") + '" data-k="' + k + '" style="' + pieceStyle(k) + 'transform:rotate(' + rot(k) + 'deg)" aria-label="Map piece ' + String.fromCharCode(65 + k) + '" aria-pressed="' + (sel === k) + '"><span class="pl">' + String.fromCharCode(65 + k) + '</span></button>'; }).join("") + '</div>';
      document.getElementById("qw").innerHTML = board + pool; wire(); }
    X().frame(sc, '<p>' + esc(P.intro) + '</p><p class="small">The map is John Gibson\'s 1763 map of East and West Florida (Library of Congress). Look at the coastlines to match the edges!</p><div class="qwidget" id="qw"></div><div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>', { wide: true });
    function placeK(k, slot) { if (solved) return; if (k === slot) { at[k] = slot; sel = null; window.SFX && SFX.play("pop"); X().save(); draw(); checkDone(); }
      else { sel = null; X().attempt(sc.id || "fm4map", false, "piece " + String.fromCharCode(65 + k) + " → spot " + (slot + 1)); X().fb("try", "🧩 That piece doesn't fit there. Look at the coastline and the shape of the land on its edges."); draw(); } }
    function checkDone() { if (Object.keys(at).length === n) { solved = true; X().addUnique(st.clues, P.clue); X().attempt("fm4map", true); done("tornmap"); window.SFX && SFX.play("clue"); draw();
      X().fb("good", "🗺️ <b>The map is whole again!</b> " + esc(CLUES[P.clue].text)); X().nextBtn("Keep going ➜", function () { X().go(sc.next); }); } }
    function wire() { var w = document.getElementById("qw");
      w.querySelectorAll("#pool .piece").forEach(function (pc) { var k = +pc.getAttribute("data-k");
        pc.onclick = function () { if (pc._dragged) { pc._dragged = false; return; } sel = sel === k ? null : k; window.SFX && SFX.play("click"); draw(); var a = document.querySelector('#pool .piece[data-k="' + k + '"]'); if (a) a.focus({ preventScroll: true }); };
        pc.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse" && e.button !== 0) return; var sx = e.clientX, sy = e.clientY, ghost = null, pid = e.pointerId; try { pc.setPointerCapture(pid); } catch (er) {}
          var mv = function (ev) { if (ev.pointerId !== pid) return; if (!ghost && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 8) { ghost = pc.cloneNode(true); ghost.classList.add("ghost"); ghost.style.width = pc.offsetWidth + "px"; ghost.style.height = pc.offsetHeight + "px"; document.body.appendChild(ghost); pc.classList.add("lifted"); }
            if (ghost) { ev.preventDefault(); ghost.style.left = ev.clientX - pc.offsetWidth / 2 + "px"; ghost.style.top = ev.clientY - pc.offsetHeight / 2 + "px"; var u = document.elementFromPoint(ev.clientX, ev.clientY), tg = u && u.closest(".torn-slot"); w.querySelectorAll(".torn-slot").forEach(function (t) { t.classList.toggle("over", t === tg); }); } };
          var up = function (ev) { if (ev.pointerId !== pid) return; pc.removeEventListener("pointermove", mv); pc.removeEventListener("pointerup", up); pc.removeEventListener("pointercancel", up);
            if (ghost) { ghost.remove(); pc._dragged = true; var u = document.elementFromPoint(ev.clientX, ev.clientY), tg = u && u.closest(".torn-slot"); if (tg && !tg.classList.contains("full")) placeK(k, +tg.getAttribute("data-slot")); else { pc.classList.remove("lifted"); } } };
          pc.addEventListener("pointermove", mv); pc.addEventListener("pointerup", up); pc.addEventListener("pointercancel", up); }); });
      w.querySelectorAll(".torn-slot").forEach(function (t) { var act = function () { if (t.classList.contains("full")) return; if (sel == null) { X().toast("First tap a map piece, then tap its spot."); return; } placeK(sel, +t.getAttribute("data-slot")); };
        t.onclick = act; t.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }; }); }
    draw(); if (solved) { X().fb("good", "🗺️ " + esc(CLUES[P.clue].text)); X().nextBtn("Keep going ➜", function () { X().go(sc.next); }); }
    X().wireHud(X().strip(P.intro));
  };

  /* ----- 3. dust off the Founding Stone ----- */
  V3.scenes.dust = function (sc) { var st = V3.ensure(), D = DUST[sc.dust], clean = !!(st.v3.tasks && st.v3.tasks.dust);
    X().frame(sc, '<p>' + esc(D.intro) + '</p><div class="dust-wrap" id="dw"><svg class="stone-svg" viewBox="0 0 400 260" role="img" aria-label="The Founding Stone">' +
      '<defs><radialGradient id="stg" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#efe1bf"/><stop offset="1" stop-color="#b99d6c"/></radialGradient><filter id="sttx"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .25 0 0 0 .5 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>' +
      '<path d="M30 40 Q40 18 80 20 L330 16 Q372 20 374 52 L380 210 Q376 242 340 244 L70 248 Q28 246 24 210 Z" fill="url(#stg)" stroke="#7d6640" stroke-width="3"/><path d="M30 40 Q40 18 80 20 L330 16 Q372 20 374 52 L380 210 Q376 242 340 244 L70 248 Q28 246 24 210 Z" fill="#000" filter="url(#sttx)"/>' +
      [[70, 70], [300, 60], [110, 200], [330, 200], [200, 40], [60, 150], [350, 130]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="none" stroke="#a48857" stroke-width="2"/><path d="M' + (p[0] - 6) + ' ' + (p[1] + 8) + ' q6 -6 12 0" stroke="#a48857" stroke-width="1.6" fill="none"/>'; }).join("") +
      '<text x="200" y="118" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#5b4526" letter-spacing="3">' + esc(D.words[0]) + '</text><text x="200" y="168" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#5b4526" letter-spacing="2">' + esc(D.words[1]) + '</text></svg>' +
      '<canvas id="dust" class="dust-canvas" aria-hidden="true"></canvas></div><div class="lens-bar"><button class="btn" id="brush">🖌️ Brush (Enter)</button><span class="small" id="dustpct" aria-live="polite"></span></div>' +
      '<div class="feedback" id="fb" aria-live="polite"></div><div class="choices" id="ch"></div>');
    var cv = document.getElementById("dust"), wrap = document.getElementById("dw"), ctx = cv.getContext("2d", { willReadFrequently: true }), W, H, total = 0, sweeps = 0;
    function size() { W = cv.width = wrap.clientWidth; H = cv.height = wrap.clientHeight; ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = "#9c8d78"; ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < 900; i++) { ctx.fillStyle = "rgba(" + (110 + Math.random() * 60 | 0) + "," + (100 + Math.random() * 50 | 0) + "," + (85 + Math.random() * 40 | 0) + ",.5)"; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 5, 0, 7); ctx.fill(); }
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000"; }
    function wipe(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
    function pct() { var d = ctx.getImageData(0, 0, W, H).data, on = 0, n = 0; for (var i = 3; i < d.length; i += 64) { n++; if (d[i] > 40) on++; } return 1 - on / n; }
    function report() { var p = pct(); document.getElementById("dustpct").textContent = Math.round(p * 100) + "% clean"; if (p > .6 && !clean) finish(); }
    function finish() { clean = true; done("dust"); X().addUnique(st.facts, D.fact); X().attempt("stone", true); cv.classList.add("gone"); window.SFX && SFX.play("win");
      X().fb("good", "✨ The Stone is clean! It reads <b>" + esc(D.words.join(" · ")) + "</b>. Pedro Menéndez de Avilés founded St. Augustine in 1565, which makes it the oldest permanent European settlement in the continental United States.");
      X().nextBtn("Case closed! ➜", function () { X().go(sc.next); }).classList.add("big"); }
    if (clean) { cv.classList.add("gone"); X().fb("good", "✨ The Stone reads <b>" + esc(D.words.join(" · ")) + "</b>."); X().nextBtn("Case closed! ➜", function () { X().go(sc.next); }); }
    else { size(); var down = null, last = 0;
      cv.addEventListener("pointerdown", function (e) { down = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (er) {} var r = cv.getBoundingClientRect(); wipe(e.clientX - r.left, e.clientY - r.top, W * .07); e.preventDefault(); });
      cv.addEventListener("pointermove", function (e) { if (down !== e.pointerId) return; var r = cv.getBoundingClientRect(); wipe(e.clientX - r.left, e.clientY - r.top, W * .07); e.preventDefault(); var t = Date.now(); if (t - last > 250) { last = t; report(); } });
      var up = function () { if (down != null) { down = null; report(); } }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      document.getElementById("brush").onclick = function () { var rows = 5, i = sweeps++ % rows; ctx.fillRect(0, i * H / rows - 2, W, H / rows + 4); window.SFX && SFX.play("pop"); report(); }; }
    X().wireHud(X().strip(D.intro));
  };

  /* ----- 4. the arrest warrant ----- */
  V3.scenes.warrant = function (sc) { var st = V3.ensure(), W = st.v3.warrant || (st.v3.warrant = { sus: null, hide: null, ev: [] });
    var mine = st.clues.filter(function (c) { return CLUES[c]; });
    var evBtns = mine.map(function (c) { var on = W.ev.indexOf(c) >= 0; return '<button class="ev-pick' + (on ? " on" : "") + '" data-c="' + c + '" aria-pressed="' + on + '">' + (CLUES[c].kind === "place" ? "📍 " : "🕵️ ") + CLUES[c].text + '</button>'; }).join("");
    var hides = HIDEOUTS.map(function (h) { return '<button class="btn hide-btn' + (W.hide === h.id ? " sel" : "") + '" data-hide="' + h.id + '" aria-pressed="' + (W.hide === h.id) + '">' + esc(h.name) + '</button>'; }).join("");
    X().frame(sc, '<p>Build an <b>arrest warrant</b>. A judge signs it only if your evidence proves it: choose the <b>suspect</b>, the <b>location</b>, and exactly <b>3 pieces of evidence</b>.</p>' +
      '<h3>1. Suspect</h3>' + V3.dossierHtml({ pick: true, noTalk: true }).replace(/<article class="dossier/g, function (m) { return m; }) +
      '<h3>2. Location of the Stone (Mission San Luis)</h3><div class="hide-grid">' + hides + '</div>' +
      '<h3>3. Evidence (pick 3) <span class="small" id="evn">' + W.ev.length + ' of 3</span></h3><div class="ev-list">' + evBtns + '</div>' +
      '<div class="warrant-doc" id="wdoc"></div><div class="choices"><button class="btn primary big" id="sign">⚖️ Ask the judge to sign the warrant</button></div><div class="feedback" id="fb" aria-live="polite"></div>', { wide: true });
    var panel = document.querySelector("main .panel");
    panel.querySelectorAll(".dossier").forEach(function (d) { var id = d.getAttribute("data-sus"); if (W.sus === id) { d.classList.add("sel"); var p = d.querySelector(".d-pick"); p.textContent = "✔ Chosen"; p.setAttribute("aria-pressed", "true"); } });
    function doc() { var s = SUSPECTS.filter(function (x) { return x.id === W.sus; })[0], h = HIDEOUTS.filter(function (x) { return x.id === W.hide; })[0];
      document.getElementById("wdoc").innerHTML = '<div class="wd-title">ARREST WARRANT</div>' + (s ? '<div class="wd-face">' + V3.face(s.id, "nervous", "med") + '</div>' : "") + '<div>Suspect: <b>' + (s ? esc(s.name) : "______") + '</b></div><div>Location: <b>' + (h ? esc(h.name) : "______") + '</b></div><div>Evidence: ' + (W.ev.length ? W.ev.length + " item" + (W.ev.length > 1 ? "s" : "") : "______") + '</div>';
      document.getElementById("sign").disabled = !(s && h && W.ev.length === 3); document.getElementById("evn").textContent = W.ev.length + " of 3"; }
    function rerender(focusSel) { var y = window.scrollY; V3.scenes.warrant(sc); window.scrollTo(0, y); var f = focusSel && document.querySelector(focusSel); if (f) f.focus({ preventScroll: true }); }
    V3.wireDossiers(panel, function () { rerender(); });
    panel.querySelectorAll(".d-pick").forEach(function (b) { b.onclick = function () { W.sus = b.getAttribute("data-sus"); window.SFX && SFX.play("click"); X().save(); rerender('.d-pick[data-sus="' + W.sus + '"]'); }; });
    panel.querySelectorAll(".hide-btn").forEach(function (b) { b.onclick = function () { W.hide = b.getAttribute("data-hide"); window.SFX && SFX.play("click"); X().save(); rerender('.hide-btn[data-hide="' + W.hide + '"]'); }; });
    panel.querySelectorAll(".ev-pick").forEach(function (b) { b.onclick = function () { var c2 = b.getAttribute("data-c"), i = W.ev.indexOf(c2); if (i >= 0) W.ev.splice(i, 1); else { if (W.ev.length >= 3) W.ev.shift(); W.ev.push(c2); } window.SFX && SFX.play("click"); X().save(); rerender('.ev-pick[data-c="' + c2 + '"]'); }; });
    doc();
    document.getElementById("sign").onclick = function () { st.deduceTries++; st.v3.warrantTries++;
      var s = SUSPECTS.filter(function (x) { return x.id === W.sus; })[0], okS = W.sus === THIEF, okH = W.hide === HIDEOUT;
      var miss = WARRANT_NEEDS.filter(function (g) { return !W.ev.some(function (c2) { return g.clues.indexOf(c2) >= 0; }); });
      var good = okS && okH && !miss.length;
      X().attempt("deduce", good, s.name + " / " + HIDEOUTS.filter(function (h) { return h.id === W.hide; })[0].name + " / " + W.ev.join("+"));
      if (good) { st.v3.caught = THIEF; X().save(); window.SFX && SFX.play("win");
        X().modal("⚖️ Warrant signed!", '<div class="center">' + V3.face("penny", "surprised", "big react") + '</div><p>The judge signs your warrant. <b>' + esc(s.name) + '</b> is caught red-umbrella-handed outside the <b>Apalachee Council House</b>!</p><p>"Drat! Foiled by a junior detective!"</p><p>But the Stone is locked in a case with a <b>Timeline Lock</b>…</p>',
          [{ label: "Open the Timeline Lock ➜", fn: function () { X().go(sc.next); } }]); return; }
      /* wrong: the suspect escapes, then a teaching check */
      var why = [];
      if (!okS) { if (s.ink !== "purple ink") why.push("Your evidence says the thief writes in <b>purple ink</b>, but " + esc(s.name) + " uses " + esc(s.ink) + ". Check the dossiers!");
        else if (s.carry !== "red umbrella") why.push("Your evidence says the thief carries a <b>red umbrella</b>, but " + esc(s.name) + " carries a " + esc(s.carry) + "."); }
      if (!okH) why.push("Re-read the last note: the Stone is in the building where <b>Apalachee leaders met every day</b> to talk about community business. Your Notebook facts can help.");
      miss.forEach(function (g) { why.push("The judge needs evidence that shows <b>" + g.label + "</b>. None of your 3 picks proves that."); });
      var esc2 = okS ? "penny" : W.sus;
      X().modal("💨 The suspect slipped away!", '<div class="escape"><div class="escape-run">' + V3.face(okS ? "penny" : esc2, "smug", "big") + '</div><div class="escape-dust">💨</div></div>' +
        '<p>The judge said your warrant didn\'t prove the case, and while you were waiting, the real thief slipped out the back! Good news: Penny dropped her umbrella and can\'t get far. Check your evidence and try again.</p><ul>' + why.map(function (w) { return "<li>" + w + "</li>"; }).join("") + '</ul>',
        [{ label: "Fix my warrant", fn: function () { X().render(); } }, { label: "📓 Open Notebook", cls: "ghost", fn: function () { X().render(); X().notebook("clues"); } }]);
      document.getElementById("modal").classList.add("escape-modal"); };
    X().wireHud(X().strip(panel.innerHTML));
  };
})();
