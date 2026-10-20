/* Florida Trailblazers v3 — avatar builder, solo/team start, class roster, weekly leaderboard, share codes,
   win-screen rewards and the Teacher view class section. No accounts, no server, no network calls. */
(function () {
  "use strict";
  var X = function () { return window.FTBX; }, S = function () { return window.FTBX.S(); };
  function esc(t) { return X().esc(t); }
  function app() { return X().app(); }

  /* ---------- scores ---------- */
  function weekStart(d) { d = new Date(d || Date.now()); var day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d.getTime(); }
  function rankIdx(name) { var R = X().RANKS; for (var i = 0; i < R.length; i++) if (R[i].name === name) return i; return 0; }
  function board(weekOnly) { var all = V3.scores(), ws = weekStart(); return all.filter(function (e) { return !weekOnly || e.at >= ws; }).sort(function (a, b) { return b.total - a.total || a.day - b.day || a.at - b.at; }); }
  function boardHtml(weekOnly, limit) { var rows = board(weekOnly).slice(0, limit || 20);
    if (!rows.length) return '<p class="small"><i>No finished cases ' + (weekOnly ? "this week" : "yet") + '. Finish a case to get on the board!</i></p>';
    return '<div class="tscroll"><table class="bench lb"><thead><tr><th>#</th><th>Detective(s)</th><th>Total</th><th>Case score</th><th>Speed bonus</th><th>Rank</th><th>Finished</th></tr></thead><tbody>' + rows.map(function (e, i) {
      var who = e.who.map(function (n) { return '<span class="lb-who">' + V3.avatarFace(n, i === 0 ? "happy" : "neutral", "mini") + esc(n) + '</span>'; }).join(" ");
      return '<tr' + (i < 3 ? ' class="top' + (i + 1) + '"' : "") + '><td>' + (["🥇", "🥈", "🥉"][i] || i + 1) + '</td><td>' + (e.team ? "👥 " : "") + who + (e.dev !== V3.deviceId() ? ' <span class="pill">imported</span>' : "") + '</td><td><b>' + e.total + '</b></td><td>' + e.score + '</td><td>' + (e.relaxed ? "relaxed" : "+" + e.bonus) + '</td><td>' + esc(X().RANKS[e.rank || 0].name) + '</td><td class="small">' + new Date(e.at).toLocaleDateString() + '</td></tr>'; }).join("") + '</tbody></table></div>'; }

  /* ---------- share codes (compact text, made on this device; nothing is sent anywhere) ---------- */
  function b64u(str) { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function unb64u(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return decodeURIComponent(escape(atob(s))); }
  function sum(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0; return (h % 1679616).toString(36); }
  function exportCode() { var mine = V3.scores();
    var payload = JSON.stringify({ v: 3, d: V3.deviceId(), e: mine.map(function (e) { return [e.id, e.who.join("|"), e.team ? 1 : 0, e.score, e.bonus, e.rank || 0, Math.round(e.at / 60000), e.day || 0, e.relaxed ? 1 : 0, e.dev]; }) });
    var body = b64u(payload); return "FTB3." + body + "." + sum(body); }
  function importCode(code) { code = String(code || "").replace(/\s+/g, ""); var parts = code.split(".");
    if (parts.length !== 3 || parts[0] !== "FTB3") return { ok: false, msg: "That doesn't look like a Florida Trailblazers share code (it should start with FTB3.)." };
    if (sum(parts[1]) !== parts[2]) return { ok: false, msg: "This code is incomplete or has a typo (the check letters don't match). Copy the whole code again." };
    var data; try { data = JSON.parse(unb64u(parts[1])); } catch (e) { return { ok: false, msg: "This code could not be read." }; }
    if (!data || data.v !== 3 || !Array.isArray(data.e)) return { ok: false, msg: "This code is from a different version." };
    var all = V3.scores(), have = {}, added = 0, skipped = 0; all.forEach(function (e) { have[e.id] = 1; });
    data.e.forEach(function (r) { if (!Array.isArray(r) || have[r[0]]) { skipped++; return; }
      var who = String(r[1] || "").split("|").map(function (n) { var c = V3.checkName(n); return c.ok ? c.name : null; }).filter(Boolean).slice(0, 3);
      var sc = +r[3], bo = +r[4]; if (!who.length || !(sc >= 0 && sc <= 100) || !(bo >= 0 && bo <= 30)) { skipped++; return; }
      all.push({ id: String(r[0]).slice(0, 40), who: who, team: !!r[2], score: sc, bonus: bo, total: sc + bo, rank: Math.max(0, Math.min(4, +r[5] || 0)), at: (+r[6] || 0) * 60000, day: +r[7] || 0, relaxed: !!r[8], dev: String(r[9] || data.d).slice(0, 12) }); have[r[0]] = 1; added++; });
    V3.saveScores(all); var c = V3.cls(); all.forEach(function (e) { e.who.forEach(function (n) { if (c.roster.map(function (x) { return x.toLowerCase(); }).indexOf(n.toLowerCase()) < 0 && c.roster.length < 40) c.roster.push(n); }); }); V3.saveCls(c);
    return { ok: true, added: added, skipped: skipped }; }

  /* ---------- win: race bonus, rewards, leaderboard entry ---------- */
  V3.onWin = function (score, rank) { var st = V3.ensure(), R = st.v3.riddles, firsts = Object.keys(R).filter(function (k) { return R[k].first; }).length;
    var speed = st.relaxed ? 0 : (st.day <= 3 ? 10 : st.day <= START.deadline ? 5 : 0), bonus = st.relaxed ? 0 : speed + firsts * 5, total = score + bonus;
    var who = V3.players().length ? V3.players() : ["Guest"], newGear = [];
    if (!st.v3.scored) { st.v3.scored = true; var all = V3.scores();
      all.push({ id: st.runId, who: who, team: !!st.team, score: score, bonus: bonus, total: total, rank: rankIdx(rank.name), at: Date.now(), day: st.day, relaxed: !!st.relaxed, dev: V3.deviceId() }); V3.saveScores(all);
      who.forEach(function (n) { if (n === "Guest") return; var p = V3.profile(n); p.cases++; p.bestScore = Math.max(p.bestScore || 0, score);
        if (p.bestRank == null || rankIdx(rank.name) > p.bestRank) p.bestRank = rankIdx(rank.name);
        st.badges.forEach(function (b) { if (p.badgesEver.indexOf(b) < 0) p.badgesEver.push(b); UNLOCKS.forEach(function (u) { if (u.badge === b && p.unlocked.indexOf(u.id) < 0) { p.unlocked.push(u.id); newGear.push(u.name); } }); });
        V3.saveProfile(p); }); st.v3.newGear = newGear; }
    newGear = st.v3.newGear || [];
    var team = st.team ? '<div class="team-sum"><h3>👥 Team results</h3>' + st.team.map(function (n) { var T = st.teamStats[n] || {}; return '<div class="tm">' + V3.avatarFace(n, "happy", "mini") + '<b>' + esc(n) + '</b>: solved ' + (T.right || 0) + ' • first-try ' + (T.first || 0) + '</div>'; }).join("") + '</div>' : "";
    var html = '<div class="race-sum">' + (st.relaxed ? '<p>🌴 Relaxed mode: no race. Your case score is <b>' + score + '</b>.</p>' :
      '<p>🏁 <b>Race against Penny:</b> speed bonus <b>+' + speed + '</b> (Day ' + st.day + ') • riddles on the first try <b>' + firsts + '/3</b> (+' + firsts * 5 + ')</p><p class="total">Leaderboard total: <b>' + total + '</b> = ' + score + ' + ' + bonus + '</p>') +
      '<div class="win-avatars">' + who.filter(function (n) { return n !== "Guest"; }).map(function (n) { return '<div>' + V3.avatarFace(n, "happy", "med") + '<div class="small">' + esc(n) + '</div></div>'; }).join("") + '</div>' +
      (newGear.length ? '<p class="unlock">🎁 New costume pieces: <b>' + newGear.map(esc).join(", ") + '</b>. Try them on in 🧑 My Detective!</p>' : "") + team +
      '<div class="btn-row"><button class="btn" id="wlb">🏆 Class leaderboard</button><button class="btn ghost" id="wav">🧑 My Detective</button></div></div>';
    return { html: html, bonus: bonus, total: total }; };
  V3.wireWin = function () { var a = document.getElementById("wlb"); if (a) a.onclick = function () { classScreen(X().title); }; var b = document.getElementById("wav"); if (b) b.onclick = function () { avatarBuilder(V3.players()[0], X().title); }; };

  /* ---------- title ---------- */
  V3.titleButtons = function () { return '<div class="btn-row2"><button class="btn" id="avatar">🧑 My Detective</button><button class="btn" id="classbtn">🏆 Class &amp; Leaderboard</button></div>'; };
  V3.wireTitle = function () { document.getElementById("avatar").onclick = function () { avatarBuilder(null, X().title); }; document.getElementById("classbtn").onclick = function () { classScreen(X().title); }; };

  /* ---------- who's playing? (solo or team) ---------- */
  V3.newCase = function (start) { var c = V3.cls(), mode = "solo", picked = [];
    function chips() { var c2 = V3.cls(); return c2.roster.length ? c2.roster.map(function (n) { var on = picked.indexOf(n) >= 0; return '<button class="chip' + (on ? " on" : "") + '" data-n="' + esc(n) + '" aria-pressed="' + on + '">' + V3.avatarFace(n, "neutral", "mini") + esc(n) + '</button>'; }).join("") : '<p class="small"><i>No class list yet. Type a name below to add one.</i></p>'; }
    function draw(msg) {
      X().modal("🕵️ Who's playing?", '<div class="seg" role="tablist"><button class="tab' + (mode === "solo" ? " on" : "") + '" id="m-solo" role="tab" aria-selected="' + (mode === "solo") + '">🧍 Solo</button><button class="tab' + (mode === "team" ? " on" : "") + '" id="m-team" role="tab" aria-selected="' + (mode === "team") + '">👥 Team (2–3 partners)</button></div>' +
        '<p>' + (mode === "solo" ? "Pick your name, or add a new one." : "Pick 2 or 3 partners. You'll share one case and take turns: the turn passes after each solved problem.") + ' <span class="small">First names or nicknames only. Names stay on this device.</span></p>' +
        '<div class="chips" id="chips">' + chips() + '</div><label class="typed-lbl" for="pname">Add a name</label><div class="typed-row"><input id="pname" type="text" maxlength="14" autocomplete="off" placeholder="First name or nickname"><button class="btn" id="addn">＋ Add</button></div>' +
        '<div class="feedback ' + (msg ? "try" : "") + '" id="nmsg" aria-live="polite">' + (msg || "") + '</div>',
        [{ label: "▶ Start the case", cls: "primary", fn: go }, { label: "Play as a guest", cls: "ghost", fn: function () { start("", null); } }, { label: "Cancel", cls: "ghost" }], { escClose: true, noFocus: true });
      var m = document.getElementById("modal"), startBtn = m.querySelector(".modal-btns .primary");
      var valid = mode === "solo" ? picked.length === 1 : picked.length >= 2 && picked.length <= 3; startBtn.disabled = !valid;
      m.querySelector("#m-solo").onclick = function () { mode = "solo"; picked = picked.slice(0, 1); draw(); };
      m.querySelector("#m-team").onclick = function () { mode = "team"; draw(); };
      m.querySelectorAll(".chip").forEach(function (b) { b.onclick = function () { var n = b.getAttribute("data-n"), i = picked.indexOf(n);
        if (i >= 0) picked.splice(i, 1); else if (mode === "solo") picked = [n]; else if (picked.length < 3) picked.push(n); else { draw("A team can have up to 3 partners."); return; }
        draw(); var f = document.querySelector('.chip[data-n="' + n + '"]'); if (f) f.focus(); }; });
      var inp = m.querySelector("#pname"), add = function () { var r = V3.addToRoster(inp.value); if (!r.ok) { draw(r.msg); var i2 = document.getElementById("pname"); i2.value = inp.value; i2.focus(); return; }
        if (mode === "solo") picked = [r.name]; else if (picked.indexOf(r.name) < 0 && picked.length < 3) picked.push(r.name); draw(); document.getElementById("pname").focus(); };
      m.querySelector("#addn").onclick = add; inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); if (inp.value.trim()) add(); else if (!startBtn.disabled) { X().closeModal(true); go(); } } };
      (m.querySelector(".chip") || inp).focus(); }
    function go() { if (mode === "solo") start(picked[0], null); else start(picked.join(" & "), picked.slice()); }
    if (S() && S().name && !S().team) { var r0 = V3.checkName(S().name); if (r0.ok && c.roster.indexOf(r0.name) >= 0) picked = [r0.name]; }
    draw(); };

  /* ---------- avatar builder ---------- */
  var LABELS = { skin: "Skin tone", hair: "Hair style", hairColor: "Hair color", hijab: "Hijab color", eyes: "Eye color", outfit: "Outfit", outfitColor: "Outfit color", glasses: "Glasses", hat: "Hat" };
  var HAIRN = { short: "Short", curly: "Curly", afro: "Afro", puffs: "Puffs", long: "Long", wavy: "Wavy", ponytail: "Ponytail", braids: "Braids", locs: "Locs", bun: "Bun", buzz: "Buzz cut", hijab: "Hijab", none: "Bald" };
  function avatarBuilder(name, back) { var c = V3.cls(); name = name || (c.roster[0] || null); var p = name ? V3.profile(name) : null, a = p ? p.avatar : V3.clone(AVATAR_DEFAULT), mood = "happy";
    function locked(kind, v) { var u = UNLOCKS.filter(function (x) { return x.id === v; })[0]; return u && (!p || p.unlocked.indexOf(v) < 0) ? u : null; }
    function group(key) { var vals = AVATAR_OPTS[key], isColor = /^#/.test(vals[0]);
      return '<fieldset class="av-group"><legend>' + LABELS[key] + '</legend><div class="av-opts" role="radiogroup" aria-label="' + LABELS[key] + '">' + vals.map(function (v) { var on = a[key] === v, L = locked(key, v);
        return '<button class="av-opt' + (isColor ? " sw" : "") + (on ? " on" : "") + (L ? " locked" : "") + '" role="radio" aria-checked="' + on + '" data-k="' + key + '" data-v="' + v + '"' + (L ? ' aria-disabled="true" title="Earn the badge to unlock"' : "") + ' aria-label="' + LABELS[key] + ': ' + (isColor ? v : (HAIRN[v] || v)) + (L ? " (locked)" : "") + '"' + (isColor ? ' style="background:' + v + '"' : "") + '>' + (isColor ? "" : (L ? "🔒 " : "") + esc(HAIRN[v] || v.charAt(0).toUpperCase() + v.slice(1))) + '</button>'; }).join("") + '</div></fieldset>'; }
    function draw() {
      var career = p ? '<div class="career"><h3>🎖️ Career (saved on this device)</h3><div>Cases solved: <b>' + p.cases + '</b></div><div>Best rank: <b>' + (p.bestRank != null ? esc(X().RANKS[p.bestRank].icon + " " + X().RANKS[p.bestRank].name) : "–") + '</b></div><div>Badges earned ever: <b>' + p.badgesEver.length + ' / ' + X().BADGES.length + '</b></div>' +
        '<div class="gear-list"><b>Costume pieces:</b> ' + UNLOCKS.map(function (u) { var got = p.unlocked.indexOf(u.id) >= 0, b = X().BADGES.filter(function (x) { return x.id === u.badge; })[0];
          return '<span class="gear' + (got ? " got" : "") + '" title="' + (got ? "Unlocked" : "Earn the " + esc(b.name) + " badge") + '">' + (got ? "✔ " : "🔒 ") + esc(u.name) + (got ? "" : ' <i class="small">(' + esc(b.name) + ')</i>') + '</span>'; }).join("") + '</div></div>' : "";
      var gearOpts = p ? '<fieldset class="av-group"><legend>Gear (from badges)</legend><div class="av-opts">' + UNLOCKS.filter(function (u) { return u.kind === "gear"; }).map(function (u) { var got = p.unlocked.indexOf(u.id) >= 0, on = (a.gear || []).indexOf(u.id) >= 0;
        return '<button class="av-opt' + (on ? " on" : "") + (got ? "" : " locked") + '" data-gear="' + u.id + '" aria-pressed="' + on + '"' + (got ? "" : ' aria-disabled="true"') + '>' + (got ? "" : "🔒 ") + esc(u.name) + '</button>'; }).join("") + '</div></fieldset>' : "";
      app().innerHTML = '<main class="builder"><div class="builder-head"><h1>🧑 My Detective</h1><button class="btn primary" id="avback">✔ Done</button></div>' +
        '<div class="who-row">' + (c.roster.length ? c.roster.map(function (n) { return '<button class="chip' + (n === name ? " on" : "") + '" data-n="' + esc(n) + '" aria-pressed="' + (n === name) + '">' + V3.avatarFace(n, "neutral", "mini") + esc(n) + '</button>'; }).join("") : "") +
        '<span class="add-who"><input id="avname" maxlength="14" placeholder="New name or nickname" aria-label="New detective name"><button class="btn sm" id="avadd">＋</button></span></div><div class="feedback" id="avmsg" aria-live="polite"></div>' +
        (name ? '<div class="builder-grid"><div class="av-preview"><div id="avprev">' + PORTRAIT.svg(V3.avatarSpec(a, name), mood, { label: name + "'s detective, " + mood }) + '</div><div class="mood-row" role="group" aria-label="Try an expression">' +
          PORTRAIT.MOODS.map(function (md) { return '<button class="btn sm moodb' + (md === mood ? " on" : "") + '" data-m="' + md + '" aria-pressed="' + (md === mood) + '">' + { neutral: "😐", nervous: "😰", smug: "😏", surprised: "😮", happy: "😊" }[md] + '<span class="lbl"> ' + md + '</span></button>'; }).join("") + '</div>' + career + '</div>' +
          '<div class="av-controls">' + ["skin", "hair"].map(group).join("") + (a.hair === "hijab" ? group("hijab") : group("hairColor")) + ["eyes", "outfit", "outfitColor", "glasses", "hat"].map(group).join("") +
          '<fieldset class="av-group"><legend>Extras</legend><div class="av-opts"><button class="av-opt' + (a.freckles ? " on" : "") + '" data-tog="freckles" aria-pressed="' + !!a.freckles + '">Freckles</button><button class="av-opt' + (a.hearingAid ? " on" : "") + '" data-tog="hearingAid" aria-pressed="' + !!a.hearingAid + '">Hearing aid</button></div></fieldset>' + gearOpts + '</div></div>'
          : '<p>Add your first name or a nickname to build your detective. <span class="small">(Names and looks are saved only on this device.)</span></p>') + '</main>';
      var save = function () { if (p) { p.avatar = a; V3.saveProfile(p); } };
      document.getElementById("avback").onclick = function () { save(); back(); };
      app().querySelectorAll(".who-row .chip").forEach(function (b) { b.onclick = function () { save(); name = b.getAttribute("data-n"); p = V3.profile(name); a = p.avatar; draw(); }; });
      var addN = function () { var r = V3.addToRoster(document.getElementById("avname").value); if (!r.ok) { var m2 = document.getElementById("avmsg"); m2.className = "feedback try"; m2.textContent = r.msg; return; } save(); c = V3.cls(); name = r.name; p = V3.profile(name); a = p.avatar; V3.saveProfile(p); draw(); };
      document.getElementById("avadd").onclick = addN; document.getElementById("avname").onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); addN(); } };
      app().querySelectorAll(".av-opt[data-k]").forEach(function (b) { b.onclick = function () { var k = b.getAttribute("data-k"), v = b.getAttribute("data-v"), L = locked(k, v);
        if (L) { var bd = X().BADGES.filter(function (x) { return x.id === L.badge; })[0]; X().toast("🔒 Earn the <b>" + esc(bd.name) + "</b> badge to unlock the " + esc(L.name) + "."); return; }
        a[k] = v; window.SFX && SFX.play("pop"); save(); var y = window.scrollY; draw(); window.scrollTo(0, y); var f = document.querySelector('.av-opt[data-k="' + k + '"][data-v="' + v + '"]'); if (f) f.focus({ preventScroll: true }); }; });
      app().querySelectorAll(".av-opt[data-tog]").forEach(function (b) { b.onclick = function () { var k = b.getAttribute("data-tog"); a[k] = !a[k]; save(); var y = window.scrollY; draw(); window.scrollTo(0, y); }; });
      app().querySelectorAll(".av-opt[data-gear]").forEach(function (b) { b.onclick = function () { var g = b.getAttribute("data-gear"); if (p.unlocked.indexOf(g) < 0) { var u = UNLOCKS.filter(function (x) { return x.id === g; })[0], bd = X().BADGES.filter(function (x) { return x.id === u.badge; })[0]; X().toast("🔒 Earn the <b>" + esc(bd.name) + "</b> badge first."); return; }
        a.gear = a.gear || []; var i = a.gear.indexOf(g); if (i >= 0) a.gear.splice(i, 1); else a.gear.push(g); save(); var y = window.scrollY; draw(); window.scrollTo(0, y); }; });
      app().querySelectorAll(".moodb").forEach(function (b) { b.onclick = function () { mood = b.getAttribute("data-m"); var y = window.scrollY; draw(); window.scrollTo(0, y); }; });
      window.scrollTo(0, 0); }
    draw(); }
  V3.avatarBuilder = avatarBuilder;

  /* ---------- class screen (for students) ---------- */
  function classScreen(back) { var week = true;
    function draw() { app().innerHTML = '<main class="teacher classroom"><div class="teacher-head"><h1>🏆 Class Leaderboard</h1><button class="btn primary" id="cback">← Back</button></div>' +
      '<div class="seg"><button class="tab' + (week ? " on" : "") + '" id="wk" aria-pressed="' + week + '">This week</button><button class="tab' + (!week ? " on" : "") + '" id="all" aria-pressed="' + !week + '">All time</button></div>' + boardHtml(week) +
      '<p class="small">Total = case score (how well you solved problems) + speed bonus (racing Penny). Ranks come from the case score only. 🔒 Scores stay on this device unless your teacher shares a code.</p>' + teamHelp() + '</main>';
      document.getElementById("cback").onclick = back; document.getElementById("wk").onclick = function () { week = true; draw(); }; document.getElementById("all").onclick = function () { week = false; draw(); }; window.scrollTo(0, 0); }
    draw(); }
  function teamHelp() { return '<h2>👥 Team mode</h2><p>Start a <b>New case</b> and choose <b>Team</b>. Pick 2 or 3 partners. Everyone shares one case on one device and takes turns. A banner shows whose turn it is, and the turn passes after each solved problem. Team scores count for every partner.</p>'; }
  V3.classScreen = classScreen;

  /* ---------- Teacher view: class section ---------- */
  V3.teacherHtml = function () { var c = V3.cls(), n = V3.scores().length;
    return '<section class="t-class" id="t-class"><div class="privacy" role="note"><b>🔒 Privacy:</b> No accounts. No server. This game makes <b>no network calls</b>, and <b>no student data leaves this device</b>. Names, scores, avatars and records are kept only in this browser (localStorage). Share codes move scores only when <i>you</i> copy and paste them. Use first names or nicknames only.</div>' +
      '<h2>🏫 Class roster (this device)</h2><div class="chips" id="troster">' + (c.roster.length ? c.roster.map(function (r) { return '<span class="chip">' + V3.avatarFace(r, "neutral", "mini") + esc(r) + ' <button class="x" data-del="' + esc(r) + '" aria-label="Remove ' + esc(r) + '">✕</button></span>'; }).join("") : '<i class="small">No names yet.</i>') + '</div>' +
      '<div class="typed-row"><input id="tname" maxlength="14" placeholder="First name or nickname" aria-label="Add a student (first name or nickname)"><button class="btn" id="tadd">＋ Add student</button></div><div class="feedback" id="tmsg" aria-live="polite"></div>' +
      '<h2>⚙️ Settings</h2><label class="switch"><input type="checkbox" id="relaxed"' + (c.relaxed ? " checked" : "") + '> <b>Relaxed mode</b>: no race against Penny, no Day-4 deadline, no speed bonus. (Applies to new cases on this device.)</label>' +
      '<h2>🏆 Weekly leaderboard</h2>' + boardHtml(true, 30) +
      '<h2>🔗 Share codes: merge scores from several devices</h2><p class="small">On each device, press <b>Make share code</b> and copy the code (for example into a document or by typing it on the teacher device). On the device that collects scores, paste it into <b>Import</b>. Codes contain only first names/nicknames, scores, ranks and dates. Duplicates are skipped.</p>' +
      '<div class="btn-row left"><button class="btn" id="mkcode"' + (n ? "" : " disabled") + '>📤 Make share code (' + n + ' score' + (n === 1 ? "" : "s") + ')</button><button class="btn ghost" id="copycode" disabled>📋 Copy</button><button class="btn ghost" id="clrscores"' + (n ? "" : " disabled") + '>🗑 Clear leaderboard</button></div>' +
      '<textarea id="codeout" class="code-box" readonly rows="3" aria-label="Share code from this device" placeholder="Your share code appears here."></textarea>' +
      '<label class="typed-lbl" for="codein">Import a share code</label><textarea id="codein" class="code-box" rows="3" placeholder="Paste a code that starts with FTB3."></textarea><div class="btn-row left"><button class="btn primary" id="impcode">📥 Import</button></div><div class="feedback" id="impmsg" aria-live="polite"></div>' +
      teamHelp() + '</section>'; };
  V3.wireTeacher = function () { var T = X().teacher;
    document.querySelectorAll("#troster [data-del]").forEach(function (b) { b.onclick = function () { var c = V3.cls(), n = b.getAttribute("data-del"); c.roster = c.roster.filter(function (x) { return x !== n; }); V3.saveCls(c); T(); setTimeout(function () { var s = document.getElementById("t-class"); if (s) s.scrollIntoView(); }, 0); }; });
    var add = function () { var r = V3.addToRoster(document.getElementById("tname").value), m = document.getElementById("tmsg"); if (!r.ok) { m.className = "feedback try"; m.textContent = r.msg; return; } T(); setTimeout(function () { document.getElementById("tname").focus(); }, 0); };
    document.getElementById("tadd").onclick = add; document.getElementById("tname").onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); add(); } };
    document.getElementById("relaxed").onchange = function (e) { var c = V3.cls(); c.relaxed = e.target.checked; V3.saveCls(c); X().toast(c.relaxed ? "🌴 Relaxed mode ON for new cases" : "🏁 Race mode ON for new cases"); };
    document.getElementById("mkcode").onclick = function () { var o = document.getElementById("codeout"); o.value = exportCode(); document.getElementById("copycode").disabled = false; o.focus(); o.select(); };
    document.getElementById("copycode").onclick = function () { var o = document.getElementById("codeout"); o.select(); var okc = function () { X().toast("📋 Copied!"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(o.value).then(okc, function () { document.execCommand("copy"); okc(); }); else { document.execCommand("copy"); okc(); } };
    document.getElementById("clrscores").onclick = function () { X().modal("Clear the leaderboard?", "<p>This removes all scores on this device (including imported ones).</p>", [{ label: "Yes, clear", fn: function () { V3.saveScores([]); T(); } }, { label: "Cancel", cls: "ghost" }], { escClose: true }); };
    document.getElementById("impcode").onclick = function () { var r = importCode(document.getElementById("codein").value), m = document.getElementById("impmsg");
      if (!r.ok) { m.className = "feedback try"; m.textContent = r.msg; return; } T(); setTimeout(function () { var m2 = document.getElementById("impmsg"); m2.className = "feedback good"; m2.textContent = "✅ Imported " + r.added + " score" + (r.added === 1 ? "" : "s") + (r.skipped ? " (" + r.skipped + " already here or unreadable, skipped)" : "") + "."; document.getElementById("t-class").scrollIntoView(); }, 0); }; };
  V3.exportCode = exportCode; V3.importCode = importCode; V3.board = board; V3.weekStart = weekStart;
})();
