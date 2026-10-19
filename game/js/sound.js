/* Optional sound effects, made live with the Web Audio API (no audio files, nothing to license).
   Sound starts OFF. The 🔇/🔊 button in the top bar (and on the title screen) turns it on or off. */
var SFX = (function () {
  "use strict";
  var ctx = null, on = false;
  try { on = localStorage.getItem(SOUND_KEY) === "on"; } catch (e) {}
  function ac() {
    if (!ctx) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; try { ctx = new A(); } catch (e) { return null; } }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type, vol, slideTo) {
    var c = ac(); if (!c) return;
    var t = c.currentTime + start, o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(start, dur, vol, fromHz, toHz) {
    var c = ac(); if (!c) return;
    var t = c.currentTime + start, n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b; f.type = "bandpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(fromHz, t); f.frequency.exponentialRampToValueAtTime(toHz, t + dur);
    g.gain.setValueAtTime(vol, t); s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  }
  var FX = {
    click:   function () { tone(660, 0, 0.05, "triangle", 0.05); },
    correct: function () { tone(659, 0, 0.14, "sine", 0.12); tone(988, 0.11, 0.26, "sine", 0.12); },
    wrong:   function () { tone(330, 0, 0.16, "triangle", 0.08, 250); },
    clue:    function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, i * 0.07, 0.18, "sine", 0.07); }); },
    badge:   function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.1, 0.3, "triangle", 0.09); }); tone(1047, 0.42, 0.5, "sine", 0.06); },
    hint:    function () { tone(880, 0, 0.12, "sine", 0.06); tone(740, 0.1, 0.16, "sine", 0.05); },
    travel:  function () { noise(0, 0.7, 0.18, 300, 2400); },
    pop:     function () { tone(520, 0, 0.07, "sine", 0.07, 780); },
    win:     function () { [523, 659, 784, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.32, "triangle", 0.09); }); }
  };
  return {
    play: function (name) { if (!on || !FX[name]) return; try { FX[name](); } catch (e) { /* never break the game for a sound */ } },
    isOn: function () { return on; },
    toggle: function () { on = !on; try { localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch (e) {} if (on) { ac(); FX.pop(); } return on; }
  };
})();
