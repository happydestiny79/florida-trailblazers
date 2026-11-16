/* Optional sound: effects and gentle music, made live with the Web Audio API (no audio files, nothing to license).
   Sound starts OFF. The 🔇/🔊 button is a master on/off. Music and Effects have separate volume sliders.
   A teacher "Classroom quiet" mute (class-wide, and optional per student) overrides the player toggle.
   Music starts only after a first tap (browser autoplay rules) and ducks while read-aloud is speaking. */
var SOUND_SETTINGS_KEY = "ftb_sound_v7";
var SFX = (function () {
  "use strict";
  var ctx = null, masterOn = false, musicVol = 0.45, sfxVol = 0.7, unlocked = false;
  var ducking = 0, musicGain = null, sfxOut = null, musicTimer = null, musicMode = null, musicStep = 0;
  var PAT = {
    title:        { ms: 520, notes: [196, 247, 294, 247, 220, 247, 196, 0] },
    map:          { ms: 380, notes: [220, 262, 330, 294, 262, 330, 392, 330] },
    investigate:  { ms: 560, notes: [165, 196, 220, 196, 247, 220, 196, 165] },
    capture:      { ms: 420, notes: [262, 330, 392, 523, 392, 330, 262, 196] }
  };

  function loadSettings() {
    var raw = null, v2 = null;
    try { raw = localStorage.getItem(SOUND_SETTINGS_KEY); } catch (e) {}
    try { v2 = localStorage.getItem(SOUND_KEY); } catch (e) {}
    if (raw) {
      try {
        var o = JSON.parse(raw);
        if (typeof o.on === "boolean") masterOn = o.on;
        if (typeof o.music === "number") musicVol = clamp01(o.music);
        if (typeof o.sfx === "number") sfxVol = clamp01(o.sfx);
        return;
      } catch (e) {}
    }
    if (v2 === "on" || v2 === "off") masterOn = v2 === "on";
  }
  function persist() {
    try { localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify({ on: masterOn, music: musicVol, sfx: sfxVol })); } catch (e) {}
    try { localStorage.setItem(SOUND_KEY, masterOn ? "on" : "off"); } catch (e) {}
  }
  function clamp01(v) { v = Number(v); if (isNaN(v)) return 0; return Math.max(0, Math.min(1, v)); }
  loadSettings();

  function ac() {
    if (!ctx) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; try { ctx = new A(); } catch (e) { return null; } }
    if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
    if (ctx && !sfxOut) {
      sfxOut = ctx.createGain(); sfxOut.gain.value = 1; sfxOut.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.gain.value = 0; musicGain.connect(ctx.destination);
    }
    return ctx;
  }
  function unlock() {
    if (unlocked) { ac(); return; }
    unlocked = true;
    ac();
    if (canMusic() && musicMode) startMusic(musicMode, true);
  }
  function classQuiet() {
    try { return !!(window.V3 && V3.cls && V3.cls().classroomQuiet); } catch (e) { return false; }
  }
  function studentQuiet(name) {
    if (!name) return false;
    try {
      var c = window.V3 && V3.cls && V3.cls();
      if (c && c.studentQuiet && c.studentQuiet[name]) return true;
    } catch (e) {}
    return false;
  }
  function currentQuiet() {
    if (classQuiet()) return true;
    try { var who = window.V3 && V3.current && V3.current(); if (who && studentQuiet(who)) return true; } catch (e) {}
    return false;
  }
  function muted() { return !masterOn || currentQuiet(); }
  function canSfx() { return !muted() && sfxVol > 0.001 && !!ac(); }
  function canMusic() { return !muted() && musicVol > 0.001 && unlocked && !!ac(); }

  function applyMusicGain() {
    if (!musicGain || !ctx) return;
    var target = canMusic() ? musicVol * 0.11 * (ducking ? 0.18 : 1) : 0.0001;
    try { musicGain.gain.cancelScheduledValues(ctx.currentTime); musicGain.gain.setTargetAtTime(target, ctx.currentTime, 0.08); } catch (e) {}
  }
  function tone(freq, start, dur, type, vol, slideTo, dest) {
    var c = ac(); if (!c || !canSfx()) return;
    var t = c.currentTime + start, o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    var v = (vol || 0.12) * sfxVol;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, v), t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || sfxOut || c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(start, dur, vol, fromHz, toHz) {
    var c = ac(); if (!c || !canSfx()) return;
    var t = c.currentTime + start, n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b; f.type = "bandpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(fromHz, t); f.frequency.exponentialRampToValueAtTime(toHz, t + dur);
    g.gain.setValueAtTime(vol * sfxVol, t); s.connect(f); f.connect(g); g.connect(sfxOut || c.destination); s.start(t);
  }

  var FX = {
    click:   function () { tone(660, 0, 0.05, "triangle", 0.05); },
    tap:     function () { tone(660, 0, 0.05, "triangle", 0.05); },
    correct: function () { tone(880, 0, 0.09, "sine", 0.11); tone(1174, 0.08, 0.16, "sine", 0.12); tone(1568, 0.18, 0.28, "triangle", 0.1); },
    wrong:   function () { tone(280, 0, 0.22, "triangle", 0.06, 210); tone(210, 0.08, 0.2, "sine", 0.04); },
    clue:    function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, i * 0.07, 0.18, "sine", 0.07); }); },
    badge:   function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.1, 0.3, "triangle", 0.09); }); tone(1047, 0.42, 0.5, "sine", 0.06); },
    levelup: function () { FX.badge(); },
    stamp:   function () { noise(0, 0.12, 0.1, 180, 90); tone(196, 0.02, 0.18, "triangle", 0.08); tone(523, 0.12, 0.2, "sine", 0.05); },
    hint:    function () { tone(880, 0, 0.12, "sine", 0.06); tone(740, 0.1, 0.16, "sine", 0.05); },
    travel:  function () { noise(0, 0.7, 0.18, 300, 2400); },
    pop:     function () { tone(520, 0, 0.07, "sine", 0.07, 780); },
    win:     function () { [523, 659, 784, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.32, "triangle", 0.09); }); },
    fanfare: function () {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * 0.11, 0.36, "triangle", 0.1); });
      tone(1568, 0.78, 0.55, "sine", 0.07);
    },
    reveal: function () {
      [392, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.08, 0.28, "triangle", 0.08); });
      tone(1319, 0.42, 0.4, "sine", 0.06);
    },
    splash: function () { noise(0, 0.22, 0.12, 900, 220); tone(196, 0.02, 0.16, "sine", 0.05, 110); },
    pickup: function () { tone(880, 0, 0.07, "sine", 0.07, 1320); tone(1320, 0.07, 0.12, "triangle", 0.06); },
    paddle: function () { noise(0, 0.08, 0.05, 400, 180); tone(180, 0, 0.1, "sine", 0.03); }
  };

  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (musicGain && ctx) { try { musicGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06); } catch (e) {} }
  }
  function tickMusic() {
    if (!canMusic() || !musicMode || !PAT[musicMode]) { applyMusicGain(); return; }
    var c = ac(); if (!c || !musicGain) return;
    applyMusicGain();
    var pat = PAT[musicMode], freq = pat.notes[musicStep % pat.notes.length];
    musicStep++;
    if (!freq) return;
    var t = c.currentTime, o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    o.type = musicMode === "map" ? "triangle" : "sine";
    o.frequency.setValueAtTime(freq, t);
    f.type = "lowpass"; f.frequency.setValueAtTime(musicMode === "map" ? 1800 : 1200, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + (pat.ms / 1000) * 0.9);
    o.connect(f); f.connect(g); g.connect(musicGain); o.start(t); o.stop(t + pat.ms / 1000 + 0.05);
  }
  function startMusic(mode, force) {
    if (!force && musicMode === mode && musicTimer) { applyMusicGain(); return; }
    stopMusic();
    musicMode = mode;
    musicStep = 0;
    if (!canMusic() || !PAT[mode]) return;
    ac(); applyMusicGain(); tickMusic();
    musicTimer = setInterval(tickMusic, PAT[mode].ms);
  }
  function setMode(mode) {
    if (mode === "off" || !mode) { musicMode = null; stopMusic(); return; }
    if (mode === "capture" && musicMode !== "capture") {
      if (canSfx()) { try { FX.fanfare(); } catch (e) {} }
    }
    startMusic(mode);
  }

  function refreshHud() {
    document.querySelectorAll("#snd").forEach(function (b) {
      b.innerHTML = isOn() ? "🔊" : "🔇";
      b.setAttribute("aria-pressed", isOn());
      b.setAttribute("aria-label", "Sound " + (isOn() ? "on" : "off"));
    });
    document.querySelectorAll("#snd-master").forEach(function (b) { b.checked = isOn(); });
    document.querySelectorAll("#snd-music").forEach(function (b) { b.value = String(Math.round(musicVol * 100)); });
    document.querySelectorAll("#snd-sfx").forEach(function (b) { b.value = String(Math.round(sfxVol * 100)); });
    document.querySelectorAll("[data-snd-music-val]").forEach(function (n) { n.textContent = Math.round(musicVol * 100) + "%"; });
    document.querySelectorAll("[data-snd-sfx-val]").forEach(function (n) { n.textContent = Math.round(sfxVol * 100) + "%"; });
    document.querySelectorAll(".snd-quiet-note").forEach(function (n) { n.hidden = !currentQuiet(); });
  }
  function isOn() { return masterOn && !currentQuiet(); }

  function settingsHtml() {
    return '<div class="snd-settings" id="snd-settings">' +
      '<p class="small snd-quiet-note"' + (currentQuiet() ? "" : " hidden") + '>Classroom quiet is on, so music and effects are muted.</p>' +
      '<label class="switch"><input type="checkbox" id="snd-master"' + (masterOn ? " checked" : "") + '> <span><b>Sound on</b>: music and effects (starts off so a classroom stays quiet until you choose).</span></label>' +
      '<label class="snd-slider">Music <input type="range" id="snd-music" min="0" max="100" value="' + Math.round(musicVol * 100) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(musicVol * 100) + '"> <span data-snd-music-val>' + Math.round(musicVol * 100) + '%</span></label>' +
      '<label class="snd-slider">Effects <input type="range" id="snd-sfx" min="0" max="100" value="' + Math.round(sfxVol * 100) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(sfxVol * 100) + '"> <span data-snd-sfx-val>' + Math.round(sfxVol * 100) + '%</span></label>' +
      '<p class="small">Music and effects are made live by this device (no audio files). Some browsers wait for a tap before music can start.</p>' +
    '</div>';
  }
  function wireSettings(root) {
    root = root || document;
    var m = root.querySelector("#snd-master");
    if (m) m.onchange = function () { setOn(m.checked); if (masterOn) { unlock(); try { FX.pop(); } catch (e) {} } refreshHud(); };
    var mu = root.querySelector("#snd-music");
    if (mu) mu.oninput = mu.onchange = function () { musicVol = clamp01(mu.value / 100); persist(); applyMusicGain(); if (masterOn && !musicTimer && musicMode) startMusic(musicMode, true); refreshHud(); };
    var sx = root.querySelector("#snd-sfx");
    if (sx) sx.oninput = sx.onchange = function () { sfxVol = clamp01(sx.value / 100); persist(); refreshHud(); };
  }
  function openSettings() {
    if (!window.FTBX) return;
    FTBX.modal("🔊 Sound", settingsHtml(), [{ label: "Done" }], { escClose: true });
    wireSettings(document.getElementById("modal"));
  }
  function teacherHtml() {
    var c = (window.V3 && V3.cls) ? V3.cls() : { classroomQuiet: false, roster: [], studentQuiet: {} };
    c.studentQuiet = c.studentQuiet || {};
    var roster = (c.roster || []).map(function (n) {
      var on = !!c.studentQuiet[n];
      return '<div class="snd-stu"><span>' + (window.V3 ? V3.avatarFace(n, "neutral", "mini") : "") + " " + esc(n) + '</span>' +
        '<label class="switch"><input type="checkbox" class="snd-stu-quiet" data-snd-name="' + esc(n) + '"' + (on ? " checked" : "") + '> Quiet</label></div>';
    }).join("");
    return '<div class="snd-teacher" id="snd-teacher">' +
      '<h2>🔇 Classroom quiet</h2>' +
      '<label class="switch"><input type="checkbox" id="snd-class-quiet"' + (c.classroomQuiet ? " checked" : "") + '> <span><b>Classroom quiet</b>: mute music and sound effects for every student on this device (they cannot turn sound back on until you uncheck this).</span></label>' +
      '<h3>Per student</h3>' +
      (roster ? '<div class="snd-stu-list">' + roster + '</div>' : '<p class="small"><i>Add students to the class list to mute sound for one child (for example, if loud sounds are hard for them).</i></p>') +
    '</div>';
  }
  function wireTeacher() {
    var box = document.getElementById("snd-class-quiet");
    if (box) box.onchange = function () {
      var c = V3.cls(); c.classroomQuiet = box.checked; V3.saveCls(c);
      if (window.FTBX && FTBX.toast) FTBX.toast(box.checked ? "🔇 Classroom quiet is on" : "Sound can be turned on again");
      if (box.checked) stopMusic(); else if (musicMode) startMusic(musicMode, true);
      refreshHud(); applyMusicGain();
    };
    document.querySelectorAll(".snd-stu-quiet").forEach(function (inp) {
      inp.onchange = function () {
        var c = V3.cls(); c.studentQuiet = c.studentQuiet || {};
        var name = inp.getAttribute("data-snd-name");
        if (inp.checked) c.studentQuiet[name] = true; else delete c.studentQuiet[name];
        V3.saveCls(c);
        if (window.FTBX && FTBX.toast) FTBX.toast(inp.checked ? "🔇 Sound muted for " + name : "Sound unmuted for " + name);
        if (currentQuiet()) stopMusic(); else if (musicMode) startMusic(musicMode, true);
        refreshHud(); applyMusicGain();
      };
    });
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function setOn(on) { masterOn = !!on; persist(); if (!masterOn) stopMusic(); else { unlock(); if (musicMode) startMusic(musicMode, true); } applyMusicGain(); refreshHud(); }

  if (typeof document !== "undefined") {
    var unlockOnce = function () { unlock(); document.removeEventListener("pointerdown", unlockOnce, true); document.removeEventListener("keydown", unlockOnce, true); document.removeEventListener("touchstart", unlockOnce, true); };
    document.addEventListener("pointerdown", unlockOnce, true);
    document.addEventListener("keydown", unlockOnce, true);
    document.addEventListener("touchstart", unlockOnce, true);
  }

  return {
    play: function (name) { if (!canSfx() || !FX[name]) return; try { ac(); FX[name](); } catch (e) { /* never break the game for a sound */ } },
    isOn: function () { return isOn(); },
    toggle: function () { setOn(!masterOn); if (masterOn) { unlock(); if (canSfx()) { try { FX.pop(); } catch (e) {} } } return isOn(); },
    setOn: setOn,
    setMode: setMode,
    mode: function () { return musicMode; },
    setMusicVol: function (v) { musicVol = clamp01(v); persist(); applyMusicGain(); refreshHud(); },
    setSfxVol: function (v) { sfxVol = clamp01(v); persist(); refreshHud(); },
    musicVol: function () { return musicVol; },
    sfxVol: function () { return sfxVol; },
    duck: function () { ducking++; applyMusicGain(); },
    unduck: function () { ducking = Math.max(0, ducking - 1); applyMusicGain(); },
    unlock: unlock,
    muted: muted,
    isQuiet: currentQuiet,
    isClassQuiet: classQuiet,
    isStudentQuiet: studentQuiet,
    settings: function () { return { on: masterOn, music: musicVol, sfx: sfxVol, quiet: currentQuiet() }; },
    settingsHtml: settingsHtml,
    wireSettings: wireSettings,
    openSettings: openSettings,
    teacherHtml: teacherHtml,
    wireTeacher: wireTeacher,
    refreshHud: refreshHud
  };
})();
