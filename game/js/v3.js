/* Florida Trailblazers v3 — add-ons: storage, team turns, interviews, dossiers, Penny's riddles and race.
   Plugs into game.js through window.V3 hooks. Everything stays in this browser (localStorage). No network. */
var V3 = (function () {
  "use strict";
  var X = function () { return window.FTBX; }, S = function () { return window.FTBX.S(); };
  var K = { profiles: "ftb_profiles_v3", cls: "ftb_class_v3", scores: "ftb_scores_v3", dev: "ftb_device_v3" };
  function jget(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(t) { return X().esc(t); }
  function nameKey(n) { return String(n || "").trim().toLowerCase(); }

  /* ---------- class settings, roster, profiles, scores ---------- */
  function cls() { var c = jget(K.cls, null) || {}; c.roster = c.roster || []; c.relaxed = !!c.relaxed; return c; }
  function saveCls(c) { jset(K.cls, c); }
  function deviceId() { var d = jget(K.dev, null); if (!d) { d = "d" + Math.random().toString(36).slice(2, 7); jset(K.dev, d); } return d; }
  /* first names or nicknames only: one word, letters (plus - or '), up to 14 characters */
  function checkName(n) { n = String(n || "").trim();
    if (!n) return { ok: false, msg: "Type a first name or nickname." };
    if (/\s/.test(n)) return { ok: false, msg: "Use ONE word: a first name or a nickname (no last names)." };
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'\-]{0,13}$/.test(n)) return { ok: false, msg: "Use letters only (a dash or apostrophe is OK), up to 14 letters." };
    return { ok: true, name: n.charAt(0).toUpperCase() + n.slice(1) }; }
  function addToRoster(n) { var c = cls(), r = checkName(n); if (!r.ok) return r; if (c.roster.map(nameKey).indexOf(nameKey(r.name)) < 0) { if (c.roster.length >= 40) return { ok: false, msg: "The class list is full (40 names)." }; c.roster.push(r.name); saveCls(c); } return r; }
  function profiles() { return jget(K.profiles, {}); }
  function profile(name) { var p = profiles()[nameKey(name)];
    if (!p) p = { name: name, avatar: clone(AVATAR_DEFAULT), badgesEver: [], cases: 0, bestRank: null, bestScore: 0, unlocked: [] };
    p.avatar = Object.assign(clone(AVATAR_DEFAULT), p.avatar || {}); p.unlocked = p.unlocked || []; p.badgesEver = p.badgesEver || []; return p; }
  function saveProfile(p) { var P = profiles(); P[nameKey(p.name)] = p; jset(K.profiles, P); }
  function scores() { return jget(K.scores, []); }
  function saveScores(a) { jset(K.scores, a.slice(-500)); }

  /* ---------- state ---------- */
  var DOSSIER_START = function () { var d = {}; SUSPECTS.forEach(function (s) { d[s.id] = { hat: true }; }); return d; };
  function initState(st, team) {
    st.v3 = { asked: {}, ended: {}, dossier: DOSSIER_START(), riddles: {}, turns: 0, fileReveals: 0, met: {}, warrantTries: 0 };
    st.relaxed = cls().relaxed;
    st.team = team && team.length > 1 ? team.slice(0, 3) : null; st.turn = 0; st.teamStats = {};
    if (st.team) { st.name = st.team.join(" & "); st.team.forEach(function (n) { st.teamStats[n] = { tries: 0, right: 0, first: 0 }; }); }
  }
  function ensure() { var st = S(); if (st && !st.v3) initState(st, st.team); return st; }
  function players() { var st = S(); return st.team ? st.team : (st.name ? [st.name] : []); }
  function current() { var st = S(); return st.team ? st.team[st.turn % st.team.length] : st.name; }

  /* ---------- portraits ---------- */
  /* Painted portraits (original AI-generated art, fictional people) live in assets/img/chars/<id>_<mood>.webp.
     If a file is missing or fails to load, svgFallback() swaps in the self-made SVG portrait for that mood. */
  var PAINTED = { pelican: 1, rosa: 1, dee: 1, volunteer: 1, tomas: 1, sam: 1, penny: 1, rusty: 1, fog: 1, lulu: 1 };
  function svgFace(id, mood) { var c = CHARS[id]; return PORTRAIT.svg(Object.assign({ bg: c.bg, name: c.name }, c.spec), mood, { label: c.name + " looks " + mood }); }
  function charImg(id, mood, small) { return "assets/img/chars/" + id + "_" + mood + (small ? "_s" : "") + ".webp"; }
  function face(id, mood, cls2) { var c = CHARS[id]; mood = mood || "neutral"; var small = /\b(mini|talk|med)\b/.test(cls2 || "");
    var inner = PAINTED[id] && !window.FTB_SVG_ONLY ? '<img class="painted" src="' + charImg(id, mood, small) + '" alt="' + esc(c.name) + ' looks ' + mood + '" draggable="false" onerror="V3.svgFallback(this)">' : svgFace(id, mood);
    return '<div class="portrait ' + (cls2 || "") + (inner.charAt(1) === "i" ? " is-painted" : "") + '" data-char="' + id + '" data-mood="' + mood + '">' + inner + '</div>'; }
  function svgFallback(img) { var d = img.parentNode; if (!d) return; d.classList.remove("is-painted"); d.classList.add("svg-fallback"); d.innerHTML = svgFace(d.getAttribute("data-char"), d.getAttribute("data-mood") || "neutral"); }
  function preloadMoods(id) { if (!PAINTED[id]) return; PORTRAIT.MOODS.forEach(function (m) { var i = new Image(); i.src = charImg(id, m); }); }
  function avatarSpec(a, name) { a = Object.assign(clone(AVATAR_DEFAULT), a || {});
    var sp = { kid: true, name: name || "Detective", bg: "#cfe0ea", skin: a.skin, hair: a.hair === "hijab" ? "none" : a.hair, hairColor: a.hairColor, eyes: a.eyes, freckles: a.freckles, hearingAid: a.hearingAid ? "#e9b949" : null,
      outfit: { type: a.outfit === "vest" ? "vest" : a.outfit, color: a.outfitColor, color2: PORTRAIT.shade(a.outfitColor, -.3), inner: "#f4efe4" }, gear: [], props: [] };
    if (a.hair === "hijab") sp.hijab = a.hijab;
    if (a.glasses !== "none") { sp.glasses = "#2b2b33"; sp.glassesShape = a.glasses; }
    var hatC = { cap: a.outfitColor, beret: "#b5446e", deerstalker: "#8a6a45", ranger: "#7d6b45", explorer: "#cdb889" };
    if (a.hat !== "none") sp.hat = { type: a.hat, color: hatC[a.hat] || "#666" };
    (a.gear || []).forEach(function (g) { if (g === "scarf") sp.outfit.scarf = "#d62828"; else if (g === "magnifier") sp.props.push("magnifier"); else sp.gear.push(g); });
    return sp; }
  function avatarFace(name, mood, extra) { var p = profile(name); return '<div class="portrait avatar ' + (extra || "") + '">' + PORTRAIT.svg(avatarSpec(p.avatar, name), mood || "neutral", { label: name + "'s detective" }) + '</div>'; }

  /* ---------- HUD: current detective + Penny race ---------- */
  var SCENE_ORDER = null;
  function order() { if (SCENE_ORDER) return SCENE_ORDER; var seen = {}, out = [], q = ["intro"];
    while (q.length) { var id = q.shift(); if (seen[id] || !SCENES[id]) continue; seen[id] = 1; out.push(id); var sc = SCENES[id];
      var nx = [].concat((sc.choices || []).map(function (c) { return c.next; }), sc.next ? [sc.next] : []); nx.forEach(function (n) { if (n && !seen[n]) q.push(n); }); }
    return (SCENE_ORDER = out); }
  function progress() { var o = order(), i = o.indexOf(S().scene); return i < 0 ? 0 : i / (o.length - 1); }
  function pennyProgress() { var st = S(), p = progress(); if (st.v3 && st.v3.caught) return p; var won = Object.keys(st.v3.riddles).filter(function (k) { return st.v3.riddles[k].first; }).length;
    return Math.min(1, p + .14 - won * .03); }
  function hudExtra(sc) { var st = ensure(), who = current(), out = "";
    if (who) out += '<button class="hud-btn avatar-btn" id="me" aria-label="' + esc(who) + (st.team ? "'s turn" : "'s detective") + '" title="' + esc(who) + '">' + avatarFace(who, "neutral", "mini") + (st.team ? '<span class="lbl"> ' + esc(who) + '</span>' : "") + '</button>';
    if (!st.relaxed && sc && sc.chapter) { var me = Math.round(progress() * 100), pe = Math.round(pennyProgress() * 100);
      out += '<div class="race" title="The race: you vs. Penny Pinch" aria-label="Race: you are at ' + me + ' percent, Penny is at ' + pe + ' percent"><span class="race-track"><span class="race-me" style="left:' + me + '%">🕵️</span><span class="race-pe" style="left:' + pe + '%">☂️</span></span></div>'; }
    return out; }
  function wireHudExtra() { var b = document.getElementById("me"); if (b) b.onclick = function () { var st = S();
    X().modal("🕵️ " + esc(current()), '<div class="center">' + avatarFace(current(), "happy", "big") + '</div>' + (st.team ? '<p>Team: <b>' + st.team.map(esc).join(", ") + '</b>. It is <b>' + esc(current()) + '</b>\'s turn. The turn passes after each solved problem.</p>' : '<p>Your detective. Change the look on the title screen (🧑 My Detective).</p>') +
      (st.relaxed ? '<p class="small">Relaxed mode is on: no race and no deadline.</p>' : '<p class="small">🏁 Race: get to the end fast for a speed bonus. Riddles answered on the first try help you catch up!</p>'), [{ label: "Back to the case" }], { escClose: true }); }; }

  /* ---------- after each page renders ---------- */
  var TURN_TYPES = { q: 1, map: 1, mapq: 1, scaleq: 1, inset: 1, timeline: 1, warrant: 1, search: 1, tornmap: 1, dust: 1, oppcost: 1, travel: 1 };
  function afterFrame(sc) { var st = ensure(), panel = document.querySelector("main .panel"); if (!panel) return;
    var cid = sc.speaker && SPEAKER_CHAR[sc.speaker];
    if (cid && INTERVIEWS[cid]) { var ended = st.v3.ended[cid], card = X().el('<button class="talk-card" id="talk" data-char="' + cid + '" aria-label="Interview ' + esc(CHARS[cid].name) + '">' + face(cid, ended ? "nervous" : "neutral", "talk") +
        '<span><b>' + esc(CHARS[cid].name) + '</b><br><span class="small">' + (ended ? "Doesn't want to talk now" : "💬 Tap to interview") + '</span></span></button>');
      var t = panel.querySelector("h2"); t.parentNode.insertBefore(card, t.nextSibling); card.onclick = function () { interview(cid); }; }
    if (st.team && TURN_TYPES[sc.type]) { var who = current(), tb = X().el('<div class="turn-banner" role="status">' + avatarFace(who, "happy", "mini") + '<span>🎯 <b>' + esc(who) + '</b>\'s turn!</span></div>');
      var h = panel.querySelector("h2"); h.parentNode.insertBefore(tb, h); }
  }
  function onAttempt(id, correct) { var st = S(); if (!st.team) return; var who = current(), L = st.log[id], T = st.teamStats[who] || (st.teamStats[who] = { tries: 0, right: 0, first: 0 });
    T.tries++; if (correct) { T.right++; if (L && L.tries === 1) T.first++; st.turn = (st.turn + 1) % st.team.length; X().toast("👏 Nice, " + esc(who) + "! Pass the device to <b>" + esc(current()) + "</b>."); } }
  function onBadge(bid) { var u = UNLOCKS.filter(function (x) { return x.badge === bid; })[0]; if (!u) return; var got = false;
    players().forEach(function (n) { var p = profile(n); if (p.unlocked.indexOf(u.id) < 0) { p.unlocked.push(u.id); got = true; } if (p.badgesEver.indexOf(bid) < 0) p.badgesEver.push(bid); saveProfile(p); });
    if (got) setTimeout(function () { X().toast("🎁 Costume unlocked: <b>" + esc(u.name) + "</b>!", "badge"); }, 700); }

  /* ---------- Penny: where she is, riddles ---------- */
  function pennyLoc() { var st = S(); if (!st || !st.v3 || st.v3.caught) return null; var loc = null;
    PENNY_PATH.forEach(function (p) { if (st.clues.indexOf(p.after) >= 0) loc = p.loc; }); return loc; }
  function afterGo(prev, sc, id) { var st = ensure(); st.v3.turns++;
    Object.keys(RIDDLES).forEach(function (rid) { var R = RIDDLES[rid]; if (R.at === id && !st.v3.riddles[rid]) taunt(rid); }); }
  function taunt(rid) { var st = S(), R = RIDDLES[rid], rec = st.v3.riddles[rid] || (st.v3.riddles[rid] = { tries: 0, first: null, ok: false }); X().save();
    var opts = R.choices.map(function (c, i) { return '<button class="btn choice" data-i="' + i + '">' + esc(c.label) + '</button>'; }).join("");
    var vl = pennyLoc();
    preloadMoods("penny"); X().modal("☂️ A note from Penny Pinch!", '<div class="taunt"><div class="taunt-face">' + face("penny", "smug", "big") + '</div><div class="note-paper"><p class="note-text">' + esc(R.note) + '</p><p class="small">— P.P. (in purple ink, of course)</p></div></div>' +
      (vl ? '<div class="map-mini taunt-map">' + ART.floridaMap({ current: st.loc, visited: st.visited, trail: st.trail, villain: vl }) + '</div>' : "") +
      '<div class="choices" id="rch">' + opts + '</div><div class="feedback" id="rfb" aria-live="polite"></div>', [{ label: "Answer later ➜", cls: "ghost" }], { cls: "wide", noFocus: true });
    var m = document.getElementById("modal"); m.classList.add("taunt-modal");
    m.querySelectorAll("#rch .choice").forEach(function (b) { b.onclick = function () { if (rec.ok) return; var c = R.choices[+b.getAttribute("data-i")]; rec.tries++; if (rec.first === null) rec.first = !!c.correct;
      var f = document.getElementById("rfb");
      if (c.correct) { rec.ok = true; b.classList.add("right"); window.SFX && SFX.play("correct"); if (R.fact) X().addUnique(st.facts, R.fact);
        m.querySelector(".taunt-face").innerHTML = face("penny", "surprised", "big react");
        f.className = "feedback good"; f.innerHTML = "✅ " + esc(R.win) + (rec.first && !st.relaxed ? " <b>+5 race points!</b> You gained ground on Penny." : "");
        onAttempt("riddle_" + rid, true); var btn = m.querySelector(".modal-btns button"); if (btn) { btn.textContent = "Keep chasing ➜"; btn.classList.remove("ghost"); btn.classList.add("primary"); btn.focus(); } }
      else { b.classList.add("wrong"); b.disabled = true; window.SFX && SFX.play("wrong"); m.querySelector(".taunt-face").innerHTML = face("penny", "happy", "big react");
        f.className = "feedback try"; f.innerHTML = "😏 Penny laughs. <b>" + esc(PARTNER_NAME) + " asks:</b> " + esc(R.hint); }
      X().save(); }; });
    var first = m.querySelector("#rch .choice"); if (first) first.focus();
  }

  /* ---------- interviews ---------- */
  function interview(cid, onClose) { var st = ensure(), IV = INTERVIEWS[cid], C = CHARS[cid], asked = st.v3.asked[cid] || (st.v3.asked[cid] = []);
    st.v3.met[cid] = true;
    var mood = asked.length ? (IV.qs.filter(function (q) { return q.id === asked[asked.length - 1]; })[0] || {}).mood || "neutral" : "neutral";
    var bubble = asked.length ? (IV.qs.filter(function (q) { return q.id === asked[asked.length - 1]; })[0] || {}).a : IV.start;
    function qList() { var ended = st.v3.ended[cid];
      return IV.qs.filter(function (q) { return !q.needs || q.needs.every(function (n) { return asked.indexOf(n) >= 0; }); }).map(function (q) { var done = asked.indexOf(q.id) >= 0, locked = ended && !done;
        return '<button class="btn iq' + (done ? " done" : "") + (q.rude ? " rude" : "") + '" data-q="' + q.id + '"' + (done || locked ? " disabled" : "") + '>' + (done ? "✔ " : locked ? "🔒 " : "❓ ") + esc(q.q) + '</button>'; }).join(""); }
    function draw(note) {
      preloadMoods(cid); X().modal("💬 Interview: " + esc(C.name), '<div class="iv"><div class="iv-face" id="ivface">' + face(cid, mood, "big react") + '<div class="mood-tag">' + moodWord(mood) + '</div></div>' +
        '<div class="iv-talk"><div class="small iv-role">' + esc(C.role) + (C.suspect ? " • suspect" : "") + '</div><div class="speech" id="ivsay">' + esc(bubble) + '</div>' + (note || "") +
        '<div class="iv-qs" id="ivq">' + qList() + '</div>' + (st.v3.ended[cid] ? '<p class="small">🔒 ' + esc(C.name.split(" ")[0]) + ' ended the interview. Polite, specific questions get more clues!</p>' : '<p class="small">Tip: polite, specific questions get more clues. Accusing someone ends the interview.</p>') + '</div></div>',
        [{ label: "Done talking", fn: function () { X().save(); if (onClose) onClose(); } }], { cls: "wide", noFocus: true, escClose: true });
      document.querySelectorAll("#ivq .iq").forEach(function (b) { b.onclick = function () { ask(b.getAttribute("data-q")); }; });
      var nb = document.querySelector("#ivq .iq:not([disabled])") || document.querySelector("#modal .modal-btns button"); if (nb) nb.focus({ preventScroll: true }); }
    function ask(qid) { var q = IV.qs.filter(function (x) { return x.id === qid; })[0]; if (!q || asked.indexOf(qid) >= 0 || st.v3.ended[cid]) return;
      asked.push(qid); mood = q.mood || "neutral"; bubble = q.a; var notes = [];
      if (q.clue && X().addUnique(st.clues, q.clue)) { notes.push("🔎 <b>New clue</b> added to your notebook!"); window.SFX && SFX.play("clue"); }
      if (q.reveal) { var d = st.v3.dossier[q.reveal[0]]; if (!d[q.reveal[1]]) { d[q.reveal[1]] = true; notes.push("📇 Dossier updated: <b>" + esc(CHARS[q.reveal[0]].name) + "</b>"); } }
      if (q.fact && X().addUnique(st.facts, q.fact)) notes.push("📚 New fact in your notebook.");
      if (q.rude) { st.v3.ended[cid] = true; notes.push("😬 That question was rude, so the interview ended. The other questions are locked."); window.SFX && SFX.play("wrong"); }
      else window.SFX && SFX.play("pop");
      X().save(); draw(notes.length ? '<div class="iv-note" role="status">' + notes.join("<br>") + '</div>' : ""); }
    draw(""); }
  function moodWord(m) { return { neutral: "😐 calm", nervous: "😰 nervous", smug: "😏 smug", surprised: "😮 surprised", happy: "😊 happy" }[m] || m; }

  /* ---------- dossiers ---------- */
  function fieldVal(s, f) { return f === "hat" ? s.hat : f === "carry" ? s.carry : f === "ink" ? s.ink : ALIBIS[s.id]; }
  function dossierCard(s, opts) { var st = ensure(), d = st.v3.dossier[s.id], opts2 = opts || {}, caught = st.v3.caught === s.id;
    var next = DOSSIER_FIELDS.filter(function (f) { return !d[f.id]; })[0];
    return '<article class="dossier' + (opts2.sel ? " sel" : "") + (caught ? " caught" : "") + '" data-sus="' + s.id + '"><div class="wanted">' + (caught ? "CAUGHT!" : "WANTED for questioning") + '</div>' + face(s.id, caught ? "surprised" : "neutral", "poster") +
      '<h4>' + esc(s.name) + '</h4><div class="small">' + esc(s.job) + '</div><ul class="dfields">' + DOSSIER_FIELDS.map(function (f) { var on = d[f.id];
        return '<li class="' + (on ? "on" : "off") + '"><span aria-hidden="true">' + f.icon + '</span> <b>' + f.label + ':</b> ' + (on ? esc(fieldVal(s, f.id)) : '<span class="unk">???</span>') + '</li>'; }).join("") + '</ul>' +
      '<div class="dbtns">' + (opts2.noTalk ? "" : '<button class="btn sm d-talk" data-sus="' + s.id + '"' + (st.v3.ended[s.id] ? " disabled" : "") + '>💬 ' + (st.v3.ended[s.id] ? "Won't talk" : "Interview") + '</button>') +
      (next ? '<button class="btn sm ghost d-rev" data-sus="' + s.id + '" aria-label="Open the next file page for ' + esc(s.name) + '">📂 Next clue</button>' : '<span class="small">✔ File complete</span>') + '</div>' + (opts2.pick ? '<button class="btn primary sm d-pick" data-sus="' + s.id + '" aria-pressed="' + !!opts2.sel + '">' + (opts2.sel ? "✔ Chosen" : "Choose") + '</button>' : "") + '</article>'; }
  function dossierHtml(opts) { ensure(); return '<p class="small">Wanted posters for the (made-up) suspects. Interview them to fill in their files, or open the next file page one clue at a time.</p><div class="dossiers">' +
    SUSPECTS.map(function (s) { return dossierCard(s, opts); }).join("") + '</div>'; }
  function wireDossiers(root, redraw) { var st = S(); if (!root) return;
    root.querySelectorAll(".d-talk").forEach(function (b) { b.onclick = function () { var id = b.getAttribute("data-sus"); interview(id, redraw || function () { X().notebook("sus"); }); }; });
    root.querySelectorAll(".d-rev").forEach(function (b) { b.onclick = function () { var id = b.getAttribute("data-sus"), d = st.v3.dossier[id], f = DOSSIER_FIELDS.filter(function (x) { return !d[x.id]; })[0]; if (!f) return;
      d[f.id] = true; st.v3.fileReveals++; X().save(); window.SFX && SFX.play("pop");
      var card = root.querySelector('.dossier[data-sus="' + id + '"]'), s = SUSPECTS.filter(function (x) { return x.id === id; })[0];
      if (card) { var tmp = X().el(dossierCard(s, { pick: !!card.querySelector(".d-pick"), sel: card.classList.contains("sel"), noTalk: !card.querySelector(".d-talk") })); card.replaceWith(tmp); tmp.querySelector(".dfields li.on:nth-child(" + (DOSSIER_FIELDS.indexOf(f) + 1) + ")").classList.add("flash"); wireDossiers(tmp.parentNode, redraw); var nb = tmp.querySelector(".d-rev"); (nb || tmp.querySelector("button")).focus({ preventScroll: true }); }
    }; }); }

  return { svgFallback: svgFallback, svgFace: svgFace, preloadMoods: preloadMoods, PAINTED: PAINTED, K: K, jget: jget, jset: jset, cls: cls, saveCls: saveCls, deviceId: deviceId, checkName: checkName, addToRoster: addToRoster, profiles: profiles, profile: profile, saveProfile: saveProfile,
    scores: scores, saveScores: saveScores, initState: initState, ensure: ensure, players: players, current: current, face: face, avatarSpec: avatarSpec, avatarFace: avatarFace,
    hudExtra: hudExtra, wireHudExtra: wireHudExtra, afterFrame: afterFrame, onAttempt: onAttempt, onBadge: onBadge, pennyLoc: pennyLoc, afterGo: afterGo, taunt: taunt,
    interview: interview, dossierHtml: dossierHtml, dossierCard: dossierCard, wireDossiers: wireDossiers, fieldVal: fieldVal, order: order, scenes: {}, clone: clone };
})();
Object.keys(V3_CLUES).forEach(function (k) { CLUES[k] = V3_CLUES[k]; });
