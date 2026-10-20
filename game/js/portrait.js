/* Florida Trailblazers v3 — layered SVG portrait engine (self-made, no outside art).
   One engine draws every character, every suspect, and the player's own detective avatar,
   so they all share one semi-realistic painted style. Moods: neutral, nervous, smug, surprised, happy. */
var PORTRAIT = (function () {
  "use strict";
  var uidN = 0;
  var MOODS = ["neutral", "nervous", "smug", "surprised", "happy"];
  function hex2rgb(h) { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join(""); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgb2hex(r) { return "#" + r.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  function shade(h, p) { var r = hex2rgb(h); return rgb2hex(r.map(function (v) { return p < 0 ? v * (1 + p) : v + (255 - v) * p; })); }
  function mix(a, b, t) { var x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x.map(function (v, i) { return v + (y[i] - v) * t; })); }

  /* mood → face settings */
  var M = {
    neutral:   { open: 1.0, low: 1.0, gaze: [0, 0], brow: { lift: 0, inner: 0, outer: 0, arch: 1 }, browR: null, blush: .14, mouth: "neutral" },
    happy:     { open: .78, low: .55, gaze: [0, 0], brow: { lift: 3, inner: 1, outer: 0, arch: 1.4 }, browR: null, blush: .32, mouth: "happy" },
    surprised: { open: 1.4, low: 1.15, gaze: [0, 0], iris: .86, brow: { lift: 8, inner: 1, outer: 1, arch: 2.2 }, browR: null, blush: .14, mouth: "surprised" },
    nervous:   { open: 1.12, low: 1.0, gaze: [3, 1], brow: { lift: 3, inner: 5, outer: -2, arch: .6 }, browR: null, blush: .1, mouth: "nervous", sweat: true },
    smug:      { open: .62, low: .9, gaze: [-2.5, 0], brow: { lift: 5, inner: -1, outer: 2, arch: 1.8 }, browR: { lift: -2, inner: -3, outer: 1, arch: .6 }, blush: .12, mouth: "smug" }
  };

  function svg(spec, mood, opts) {
    opts = opts || {}; mood = M[mood] ? mood : "neutral"; var m = M[mood];
    var id = "pt" + (++uidN), cx = 100, kid = !!spec.kid, cy = kid ? 100 : 96, w = (spec.faceW || 1) * (kid ? 41 : 40), chin = kid ? 47 : 52;
    var skin = spec.skin || "#c68c5a", sk1 = shade(skin, .16), sk2 = shade(skin, -.2), sk3 = shade(skin, -.36);
    var hairC = spec.hairColor || "#2b1d14", browC = spec.browColor || shade(hairC === "#e9e4dc" || hairC === "#bdb7ae" ? "#8d8a85" : hairC, -.1);
    var lip = mix(shade(skin, -.18), "#b34a4a", .28);
    var s = '<svg class="portrait-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (opts.label || spec.name || "Portrait") + ' (' + mood + ')">';
    /* defs */
    s += '<defs>' +
      '<radialGradient id="' + id + 'bg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="' + shade(spec.bg || "#e9d8b4", .25) + '"/><stop offset="1" stop-color="' + shade(spec.bg || "#e9d8b4", -.12) + '"/></radialGradient>' +
      '<radialGradient id="' + id + 'sk" cx="42%" cy="36%" r="70%"><stop offset="0" stop-color="' + sk1 + '"/><stop offset=".55" stop-color="' + skin + '"/><stop offset="1" stop-color="' + sk2 + '"/></radialGradient>' +
      '<linearGradient id="' + id + 'nk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sk3 + '"/><stop offset=".45" stop-color="' + sk2 + '"/><stop offset="1" stop-color="' + skin + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'hr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shade(hairC, .22) + '"/><stop offset=".5" stop-color="' + hairC + '"/><stop offset="1" stop-color="' + shade(hairC, -.3) + '"/></linearGradient>' +
      '<radialGradient id="' + id + 'ir" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="' + shade(spec.eyes || "#5a3a22", .35) + '"/><stop offset="1" stop-color="' + shade(spec.eyes || "#5a3a22", -.35) + '"/></radialGradient>' +
      '<linearGradient id="' + id + 'cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + shade((spec.outfit && spec.outfit.color) || "#557", .12) + '"/><stop offset="1" stop-color="' + shade((spec.outfit && spec.outfit.color) || "#557", -.25) + '"/></linearGradient>' +
      '<filter id="' + id + 'soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>' +
      '<filter id="' + id + 'tex"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="' + (spec.seed || 3) + '"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 .07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>' +
      '</defs>';
    if (!opts.noBg) s += '<rect width="200" height="220" fill="url(#' + id + 'bg)"/><rect width="200" height="220" fill="#000" filter="url(#' + id + 'tex)" opacity=".9"/>';
    s += hairBack(spec, id, cx, cy, w, hairC);
    /* neck + clothes */
    s += '<path d="M' + (cx - 15) + ' ' + (cy + 28) + ' L' + (cx - 16) + ' ' + (cy + 78) + ' L' + (cx + 16) + ' ' + (cy + 78) + ' L' + (cx + 15) + ' ' + (cy + 28) + ' Z" fill="url(#' + id + 'nk)"/>';
    s += clothes(spec, id, cx, cy, skin);
    if (spec.hijab) s += hijabDrape(spec, cx, cy, w);
    /* ears */
    [-1, 1].forEach(function (d) { var ex = cx + d * (w - 1);
      s += '<ellipse cx="' + ex + '" cy="' + (cy + 4) + '" rx="7" ry="11.5" fill="' + skin + '"/><path d="M' + (ex + d * 1.5) + ' ' + (cy - 3) + ' q' + (d * 3.5) + ' 6 0 13" stroke="' + sk3 + '" stroke-width="1.6" fill="none" opacity=".6"/>';
      if (spec.earrings && !spec.hijab) s += '<circle cx="' + ex + '" cy="' + (cy + 17) + '" r="2.6" fill="' + spec.earrings + '" stroke="' + shade(spec.earrings, -.35) + '" stroke-width=".8"/>';
      if (spec.hearingAid && d === -1 && !spec.hijab) s += '<path d="M' + (ex - 2) + ' ' + (cy - 8) + ' q-7 6 -2 16" stroke="' + spec.hearingAid + '" stroke-width="4.2" fill="none" stroke-linecap="round"/>'; });
    /* face */
    var face = 'M' + (cx - w) + ' ' + (cy - 8) + ' C' + (cx - w) + ' ' + (cy - 62) + ' ' + (cx + w) + ' ' + (cy - 62) + ' ' + (cx + w) + ' ' + (cy - 8) +
      ' C' + (cx + w) + ' ' + (cy + 24) + ' ' + (cx + w * .62) + ' ' + (cy + chin - 3) + ' ' + cx + ' ' + (cy + chin) + ' C' + (cx - w * .62) + ' ' + (cy + chin - 3) + ' ' + (cx - w) + ' ' + (cy + 24) + ' ' + (cx - w) + ' ' + (cy - 8) + ' Z';
    s += '<path d="' + face + '" fill="url(#' + id + 'sk)"/>';
    /* soft modelling: temple + jaw shadows, forehead light */
    s += '<g filter="url(#' + id + 'soft)" opacity=".55"><ellipse cx="' + (cx - w + 6) + '" cy="' + (cy + 10) + '" rx="7" ry="22" fill="' + sk2 + '"/><ellipse cx="' + (cx + w - 6) + '" cy="' + (cy + 10) + '" rx="7" ry="22" fill="' + sk2 + '"/>' +
      '<ellipse cx="' + (cx - 6) + '" cy="' + (cy - 30) + '" rx="20" ry="9" fill="' + sk1 + '"/><ellipse cx="' + cx + '" cy="' + (cy + chin - 4) + '" rx="14" ry="4" fill="' + sk1 + '"/></g>';
    /* cheeks */
    var blush = m.blush + (spec.blush || 0);
    s += '<g filter="url(#' + id + 'soft)"><ellipse cx="' + (cx - 23) + '" cy="' + (cy + (mood === "happy" ? 16 : 19)) + '" rx="9" ry="5.5" fill="#e0675f" opacity="' + blush + '"/><ellipse cx="' + (cx + 23) + '" cy="' + (cy + (mood === "happy" ? 16 : 19)) + '" rx="9" ry="5.5" fill="#e0675f" opacity="' + blush + '"/></g>';
    if (spec.freckles) { var fr = ""; [[-24, 14], [-20, 18], [-27, 19], [-17, 13], [24, 14], [20, 18], [27, 19], [17, 13], [-6, 12], [6, 12]].forEach(function (p) { fr += '<circle cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" r=".9"/>'; }); s += '<g fill="' + shade(skin, -.4) + '" opacity=".6">' + fr + '</g>'; }
    if (spec.age >= 2) s += '<g stroke="' + sk3 + '" stroke-width="1" fill="none" opacity=".35" stroke-linecap="round"><path d="M' + (cx - 16) + ' ' + (cy - 30) + ' q16 -4 32 0"/><path d="M' + (cx - 12) + ' ' + (cy - 25) + ' q12 -3 24 0"/>' +
      '<path d="M' + (cx - 30) + ' ' + (cy + 1) + ' l-4 -2 M' + (cx - 30) + ' ' + (cy + 4) + ' l-4 1 M' + (cx + 30) + ' ' + (cy + 1) + ' l4 -2 M' + (cx + 30) + ' ' + (cy + 4) + ' l4 1"/></g>';
    if (spec.age >= 1) s += '<g stroke="' + sk3 + '" stroke-width="1.1" fill="none" opacity=".3"><path d="M' + (cx - 12) + ' ' + (cy + 20) + ' q-6 9 -3 18"/><path d="M' + (cx + 12) + ' ' + (cy + 20) + ' q6 9 3 18"/></g>';
    /* eyes */
    var es = kid ? 1.12 : 1;
    [-1, 1].forEach(function (d) { s += eye(id, cx + d * 16.5, cy + 2, es, m, d, skin, sk2, spec); });
    /* brows */
    [-1, 1].forEach(function (d) { var b = d === 1 && m.browR ? m.browR : m.brow; s += brow(cx + d * 16.5, cy - 11 - (spec.browHigh || 0), d, b, browC, spec.browW || 3.2); });
    /* nose */
    s += '<g fill="none" stroke-linecap="round"><path d="M' + (cx - 3) + ' ' + (cy + 4) + ' C' + (cx - 4) + ' ' + (cy + 12) + ' ' + (cx - 7) + ' ' + (cy + 16) + ' ' + (cx - 6) + ' ' + (cy + 20) + '" stroke="' + sk2 + '" stroke-width="1.6" opacity=".55"/>' +
      '<path d="M' + (cx - 8) + ' ' + (cy + 20.5) + ' Q' + cx + ' ' + (cy + 26) + ' ' + (cx + 8) + ' ' + (cy + 20.5) + '" stroke="' + sk3 + '" stroke-width="1.7" opacity=".6"/></g>' +
      '<ellipse cx="' + (cx - 4) + '" cy="' + (cy + 22) + '" rx="2" ry="1.2" fill="' + sk3 + '" opacity=".55"/><ellipse cx="' + (cx + 4) + '" cy="' + (cy + 22) + '" rx="2" ry="1.2" fill="' + sk3 + '" opacity=".55"/>' +
      '<ellipse cx="' + (cx + 1) + '" cy="' + (cy + 17) + '" rx="3" ry="2" fill="#fff" opacity=".16"/>';
    /* facial hair under mouth layer */
    if (spec.beard) s += '<path d="M' + (cx - w + 2) + ' ' + (cy + 12) + ' C' + (cx - w + 4) + ' ' + (cy + 44) + ' ' + (cx - 18) + ' ' + (cy + chin + 9) + ' ' + cx + ' ' + (cy + chin + 9) + ' C' + (cx + 18) + ' ' + (cy + chin + 9) + ' ' + (cx + w - 4) + ' ' + (cy + 44) + ' ' + (cx + w - 2) + ' ' + (cy + 12) +
      ' C' + (cx + w - 8) + ' ' + (cy + 24) + ' ' + (cx + 18) + ' ' + (cy + 26) + ' ' + (cx + 15) + ' ' + (cy + 33) + ' C' + (cx + 12) + ' ' + (cy + 44) + ' ' + (cx - 12) + ' ' + (cy + 44) + ' ' + (cx - 15) + ' ' + (cy + 33) + ' C' + (cx - 18) + ' ' + (cy + 26) + ' ' + (cx - w + 8) + ' ' + (cy + 24) + ' ' + (cx - w + 2) + ' ' + (cy + 12) + ' Z" fill="' + (spec.beardColor || hairC) + '" opacity=".95"/>' +
      '<g stroke="' + shade(spec.beardColor || hairC, -.25) + '" stroke-width=".8" opacity=".4" fill="none"><path d="M' + (cx - 26) + ' ' + (cy + 30) + ' q2 8 6 12 M' + (cx + 26) + ' ' + (cy + 30) + ' q-2 8 -6 12 M' + (cx - 4) + ' ' + (cy + 46) + ' q2 4 0 8 M' + (cx + 6) + ' ' + (cy + 46) + ' q1 4 -1 7"/></g>';
    s += mouth(cx, cy + 33, m.mouth, lip, sk3, kid);
    if (spec.mustache || spec.beard) s += '<path d="M' + (cx - 17) + ' ' + (cy + 31) + ' Q' + (cx - 9) + ' ' + (cy + 23) + ' ' + cx + ' ' + (cy + 27) + ' Q' + (cx + 9) + ' ' + (cy + 23) + ' ' + (cx + 17) + ' ' + (cy + 31) + ' Q' + (cx + 8) + ' ' + (cy + 29) + ' ' + cx + ' ' + (cy + 30) + ' Q' + (cx - 8) + ' ' + (cy + 29) + ' ' + (cx - 17) + ' ' + (cy + 31) + ' Z" fill="' + (spec.beardColor || hairC) + '"/>';
    s += hairFront(spec, id, cx, cy, w, hairC);
    if (spec.hijab) s += hijabFront(spec, cx, cy, w, chin);
    if (spec.glasses) s += glasses(cx, cy + 2, spec.glasses, spec.glassesShape);
    if (m.sweat) s += '<path d="M' + (cx + w - 6) + ' ' + (cy - 24) + ' q4 7 0 10 q-4 -3 0 -10 Z" fill="#bfe6ff" stroke="#6fb3dd" stroke-width=".8"/>';
    if (spec.hat) s += hat(spec.hat, cx, cy, w, id);
    if (spec.props) spec.props.forEach(function (p) { s += prop(p, cx, cy); });
    if (spec.gear) spec.gear.forEach(function (g) { s += gearPiece(g, cx, cy, w); });
    return s + '</svg>';
  }

  function eye(id, ex, ey, es, m, d, skin, sk2, spec) {
    var o = m.open, lo = m.low, W = 9.5 * es, H = 6.2 * es, k = id + "e" + (d < 0 ? "l" : "r");
    var top = ey - H * o, bot = ey + H * .62 * lo;
    var shape = 'M' + (ex - W) + ' ' + ey + ' C' + (ex - W * .55) + ' ' + top + ' ' + (ex + W * .55) + ' ' + top + ' ' + (ex + W) + ' ' + (ey - .5) + ' C' + (ex + W * .55) + ' ' + bot + ' ' + (ex - W * .55) + ' ' + bot + ' ' + (ex - W) + ' ' + ey + ' Z';
    var ir = 4.9 * es * (m.iris || 1), gx = ex + m.gaze[0], gy = ey + m.gaze[1] + .3;
    var s = '<clipPath id="' + k + '"><path d="' + shape + '"/></clipPath>' +
      '<path d="M' + (ex - W - 2) + ' ' + (ey - 1) + ' C' + (ex - W * .5) + ' ' + (top - 5) + ' ' + (ex + W * .5) + ' ' + (top - 5) + ' ' + (ex + W + 2) + ' ' + (ey - 1.5) + '" fill="' + sk2 + '" opacity=".22"/>' +
      '<path d="' + shape + '" fill="#f7f3ee"/>' +
      '<g clip-path="url(#' + k + ')"><circle cx="' + gx + '" cy="' + gy + '" r="' + ir + '" fill="url(#' + id + 'ir)"/><circle cx="' + gx + '" cy="' + gy + '" r="' + ir + '" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>' +
      '<circle cx="' + gx + '" cy="' + gy + '" r="' + (ir * .46) + '" fill="#120c08"/><circle cx="' + (gx - ir * .35) + '" cy="' + (gy - ir * .4) + '" r="' + (ir * .27) + '" fill="#fff" opacity=".95"/><circle cx="' + (gx + ir * .4) + '" cy="' + (gy + ir * .3) + '" r="' + (ir * .12) + '" fill="#fff" opacity=".7"/>' +
      '<rect x="' + (ex - W - 1) + '" y="' + (top - 1) + '" width="' + (2 * W + 2) + '" height="3.2" fill="#000" opacity=".12"/></g>' +
      '<path d="M' + (ex - W) + ' ' + ey + ' C' + (ex - W * .55) + ' ' + top + ' ' + (ex + W * .55) + ' ' + top + ' ' + (ex + W) + ' ' + (ey - .5) + '" fill="none" stroke="#1d130d" stroke-width="' + (2.1 * es) + '" stroke-linecap="round"/>' +
      '<path d="M' + (ex + d * W * .82) + ' ' + (ey - .8) + ' l' + (d * 2.6) + ' -1.6" stroke="#1d130d" stroke-width="1.2" stroke-linecap="round"/>' +
      '<path d="M' + (ex - W * .8) + ' ' + (ey + 1) + ' C' + (ex - W * .4) + ' ' + bot + ' ' + (ex + W * .4) + ' ' + bot + ' ' + (ex + W * .8) + ' ' + (ey + .6) + '" fill="none" stroke="' + sk2 + '" stroke-width="1" opacity=".8"/>' +
      '<path d="M' + (ex - W * .7) + ' ' + (top - 3.4) + ' Q' + ex + ' ' + (top - 6.2) + ' ' + (ex + W * .75) + ' ' + (top - 3) + '" fill="none" stroke="' + sk2 + '" stroke-width="1" opacity=".7"/>';
    return s;
  }
  function brow(bx, by, d, b, col, sw) {
    var y = by - b.lift, inX = bx - d * 9, outX = bx + d * 10.5;
    var inY = y - b.inner + 1, outY = y - b.outer + 2.2, midY = y - 2.4 * b.arch - (b.inner + b.outer) * .3;
    return '<path d="M' + inX + ' ' + inY + ' Q' + (bx + d * 1) + ' ' + (midY - 1.5) + ' ' + outX + ' ' + outY + '" stroke="' + col + '" stroke-width="' + sw + '" fill="none" stroke-linecap="round"/>' +
      '<path d="M' + inX + ' ' + (inY + .6) + ' Q' + (bx - d * 4) + ' ' + (midY + .5) + ' ' + (bx + d * 2) + ' ' + (midY - .2) + '" stroke="' + col + '" stroke-width="' + (sw + 1.2) + '" fill="none" stroke-linecap="round" opacity=".85"/>';
  }
  function mouth(cx, my, kind, lip, dk, kid) {
    var s = "";
    if (kind === "happy") {
      s += '<path d="M' + (cx - 16) + ' ' + (my - 3) + ' Q' + cx + ' ' + (my + 15) + ' ' + (cx + 16) + ' ' + (my - 3) + ' Q' + cx + ' ' + (my + 1) + ' ' + (cx - 16) + ' ' + (my - 3) + ' Z" fill="#5a1f1f"/>' +
        '<path d="M' + (cx - 13) + ' ' + (my - 1.4) + ' Q' + cx + ' ' + (my + 2.6) + ' ' + (cx + 13) + ' ' + (my - 1.4) + ' L' + (cx + 11) + ' ' + (my + 2.4) + ' Q' + cx + ' ' + (my + 5) + ' ' + (cx - 11) + ' ' + (my + 2.4) + ' Z" fill="#fbfaf6"/>' +
        '<ellipse cx="' + cx + '" cy="' + (my + 8.5) + '" rx="6" ry="2.6" fill="#c45a5a" opacity=".85"/>' +
        '<path d="M' + (cx - 16) + ' ' + (my - 3) + ' Q' + cx + ' ' + (my + 15) + ' ' + (cx + 16) + ' ' + (my - 3) + '" fill="none" stroke="' + lip + '" stroke-width="2.2"/>' +
        '<path d="M' + (cx - 19) + ' ' + (my - 5) + ' q2 2 3 2 M' + (cx + 19) + ' ' + (my - 5) + ' q-2 2 -3 2" stroke="' + dk + '" stroke-width="1.2" fill="none" opacity=".5"/>';
    } else if (kind === "surprised") {
      s += '<ellipse cx="' + cx + '" cy="' + (my + 3) + '" rx="6.5" ry="8.5" fill="#4a1919" stroke="' + lip + '" stroke-width="2.6"/><ellipse cx="' + cx + '" cy="' + (my + 7.5) + '" rx="4" ry="2.4" fill="#c45a5a" opacity=".8"/>';
    } else if (kind === "nervous") {
      s += '<path d="M' + (cx - 14) + ' ' + (my + 1) + ' Q' + (cx - 7) + ' ' + (my - 3) + ' ' + cx + ' ' + (my + 1) + ' Q' + (cx + 7) + ' ' + (my - 3) + ' ' + (cx + 14) + ' ' + (my + 1.5) + ' L' + (cx + 13) + ' ' + (my + 5.5) + ' Q' + cx + ' ' + (my + 4) + ' ' + (cx - 13) + ' ' + (my + 5.5) + ' Z" fill="#fbfaf6" stroke="' + mix(lip, "#000", .25) + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M' + (cx - 7) + ' ' + (my) + ' v4.6 M' + cx + ' ' + (my + .8) + ' v3.8 M' + (cx + 7) + ' ' + (my) + ' v4.6" stroke="#b9b2a6" stroke-width=".8"/>';
    } else if (kind === "smug") {
      s += '<path d="M' + (cx - 12) + ' ' + (my + 2) + ' Q' + (cx + 1) + ' ' + (my + 5.5) + ' ' + (cx + 14) + ' ' + (my - 4.5) + '" fill="none" stroke="' + mix(lip, "#000", .3) + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M' + (cx - 9) + ' ' + (my + 4.5) + ' Q' + (cx + 1) + ' ' + (my + 9) + ' ' + (cx + 10) + ' ' + (my + 2) + '" fill="none" stroke="' + lip + '" stroke-width="2.6" opacity=".75" stroke-linecap="round"/>' +
        '<path d="M' + (cx + 15.5) + ' ' + (my - 6.5) + ' q1.5 2.5 -.5 4" stroke="' + dk + '" stroke-width="1.2" fill="none" opacity=".6"/>';
    } else {
      s += '<path d="M' + (cx - 12) + ' ' + (my) + ' Q' + (cx - 4) + ' ' + (my - 2.2) + ' ' + cx + ' ' + (my - .6) + ' Q' + (cx + 4) + ' ' + (my - 2.2) + ' ' + (cx + 12) + ' ' + my + ' Q' + cx + ' ' + (my + 2.2) + ' ' + (cx - 12) + ' ' + my + ' Z" fill="' + mix(lip, "#000", .12) + '"/>' +
        '<path d="M' + (cx - 10) + ' ' + (my + 1.2) + ' Q' + cx + ' ' + (my + 7.5) + ' ' + (cx + 10) + ' ' + (my + 1.2) + ' Q' + cx + ' ' + (my + 2.6) + ' ' + (cx - 10) + ' ' + (my + 1.2) + ' Z" fill="' + lip + '"/>' +
        '<path d="M' + (cx - 13) + ' ' + (my - .3) + ' Q' + cx + ' ' + (my + 2.6) + ' ' + (cx + 13) + ' ' + (my - .8) + '" fill="none" stroke="' + mix(lip, "#000", .45) + '" stroke-width="1.3" stroke-linecap="round"/>' +
        '<ellipse cx="' + (cx + 1) + '" cy="' + (my + 4) + '" rx="3.5" ry="1" fill="#fff" opacity=".2"/>';
    }
    return s;
  }
  function glasses(cx, ey, col, shape) {
    var r = shape === "round" ? 'rx="9" ry="9"' : 'rx="4" ry="4"', s = '<g fill="rgba(255,255,255,.12)" stroke="' + col + '" stroke-width="2.2">';
    [-1, 1].forEach(function (d) { var x = cx + d * 16.5; s += shape === "round" ? '<circle cx="' + x + '" cy="' + ey + '" r="10.5"/>' : '<rect x="' + (x - 12) + '" y="' + (ey - 8.5) + '" width="24" height="17" ' + r + '/>'; });
    return s + '<path d="M' + (cx - 5) + ' ' + (ey - 1) + ' Q' + cx + ' ' + (ey - 4) + ' ' + (cx + 5) + ' ' + (ey - 1) + '" fill="none"/><path d="M' + (cx - 28.5) + ' ' + (ey - 2) + ' l-9 -2 M' + (cx + 28.5) + ' ' + (ey - 2) + ' l9 -2" fill="none"/></g>' +
      '<path d="M' + (cx - 22) + ' ' + (ey - 5) + ' l5 -2 M' + (cx + 11) + ' ' + (ey - 5) + ' l5 -2" stroke="#fff" stroke-width="1.4" opacity=".55"/>';
  }

  /* ---------- hair ---------- */
  function cap(cx, cy, w, part) {
    var p = part || 0;
    return 'M' + (cx - w - 2) + ' ' + (cy - 2) + ' C' + (cx - w - 5) + ' ' + (cy - 52) + ' ' + (cx - 22) + ' ' + (cy - 68) + ' ' + cx + ' ' + (cy - 66) + ' C' + (cx + 24) + ' ' + (cy - 68) + ' ' + (cx + w + 5) + ' ' + (cy - 52) + ' ' + (cx + w + 2) + ' ' + (cy - 2) +
      ' C' + (cx + w - 3) + ' ' + (cy - 20) + ' ' + (cx + w - 8) + ' ' + (cy - 32) + ' ' + (cx + 12 + p) + ' ' + (cy - 37) + ' C' + (cx + p) + ' ' + (cy - 31) + ' ' + (cx - 18) + ' ' + (cy - 41) + ' ' + (cx - w + 7) + ' ' + (cy - 29) +
      ' C' + (cx - w + 2) + ' ' + (cy - 22) + ' ' + (cx - w + 1) + ' ' + (cy - 12) + ' ' + (cx - w - 2) + ' ' + (cy - 2) + ' Z'; }
  function strands(cx, cy, col, n) { var s = '<g stroke="' + shade(col, .35) + '" stroke-width="1.1" fill="none" opacity=".45" stroke-linecap="round">';
    for (var i = 0; i < (n || 6); i++) { var x = cx - 26 + i * 10; s += '<path d="M' + x + ' ' + (cy - 60 + Math.abs(i - 2.5) * 2) + ' q' + (8 - i * 2) + ' 10 ' + (4 - i) + ' 24"/>'; } return s + '</g>'; }
  function bumps(cx, cy, rx, ry, r, n, col, id) { var s = ""; for (var i = 0; i < n; i++) { var a = Math.PI * 2 * i / n; s += '<circle cx="' + (cx + Math.cos(a) * rx).toFixed(1) + '" cy="' + (cy + Math.sin(a) * ry).toFixed(1) + '" r="' + r + '"/>'; }
    return '<g fill="url(#' + id + 'hr)">' + s + '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/></g>'; }
  function curls(cx, cy, rx, ry, col) { var s = '<g fill="none" stroke="' + shade(col, .3) + '" stroke-width="1.2" opacity=".5">'; for (var i = 0; i < 16; i++) { var a = i * 2.39, rr = .35 + (i % 4) * .17;
    s += '<path d="M' + (cx + Math.cos(a) * rx * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * rr).toFixed(1) + ' a3 3 0 1 1 4 1"/>'; } return s + '</g>'; }
  function hairBack(sp, id, cx, cy, w, col) {
    var st = sp.hair, f = 'fill="url(#' + id + 'hr)"';
    if (sp.hijab) return '<path d="M' + (cx - w - 11) + ' ' + (cy + 8) + ' C' + (cx - w - 16) + ' ' + (cy - 76) + ' ' + (cx + w + 16) + ' ' + (cy - 76) + ' ' + (cx + w + 11) + ' ' + (cy + 8) + ' C' + (cx + w + 16) + ' ' + (cy + 46) + ' ' + (cx + w + 26) + ' ' + (cy + 70) + ' ' + (cx + 62) + ' ' + (cy + 92) +
      ' L' + (cx - 62) + ' ' + (cy + 92) + ' C' + (cx - w - 26) + ' ' + (cy + 70) + ' ' + (cx - w - 16) + ' ' + (cy + 46) + ' ' + (cx - w - 11) + ' ' + (cy + 8) + ' Z" fill="' + sp.hijab + '"/>';
    if (st === "long" || st === "wavy" || st === "braids" || st === "locs") {
      var s = '<path d="M' + (cx - w - 6) + ' ' + (cy - 22) + ' C' + (cx - w - 15) + ' ' + (cy + 30) + ' ' + (cx - w - 14) + ' ' + (cy + 78) + ' ' + (cx - w + 2) + ' ' + (cy + 92) + ' L' + (cx + w - 2) + ' ' + (cy + 92) + ' C' + (cx + w + 14) + ' ' + (cy + 78) + ' ' + (cx + w + 15) + ' ' + (cy + 30) + ' ' + (cx + w + 6) + ' ' + (cy - 22) + ' Z" ' + f + '/>';
      if (st === "wavy") s += '<g fill="none" stroke="' + shade(col, .3) + '" stroke-width="1.3" opacity=".5"><path d="M' + (cx - w - 8) + ' ' + (cy + 10) + ' q6 12 -2 24 q-6 12 2 26"/><path d="M' + (cx + w + 8) + ' ' + (cy + 10) + ' q-6 12 2 24 q6 12 -2 26"/></g>';
      if (st === "braids" || st === "locs") { s = ""; [-1, 1].forEach(function (d) { for (var j = 0; j < (st === "locs" ? 3 : 1); j++) { var x = cx + d * (w + 1 - j * 6);
        s += '<path d="M' + x + ' ' + (cy - 10) + ' C' + (x + d * 6) + ' ' + (cy + 30) + ' ' + (x + d * 4) + ' ' + (cy + 60) + ' ' + (x + d * 2) + ' ' + (cy + 88) + '" stroke="' + col + '" stroke-width="' + (st === "locs" ? 7 : 11) + '" fill="none" stroke-linecap="round"/>';
        if (st === "braids") for (var y = 0; y < 8; y++) s += '<path d="M' + (x + d * (3 + y * .5) - 4) + ' ' + (cy - 2 + y * 11) + ' q4 4 8 0" stroke="' + shade(col, .3) + '" stroke-width="1.2" fill="none"/>';
        else s += '<path d="M' + x + ' ' + (cy - 6) + ' C' + (x + d * 6) + ' ' + (cy + 30) + ' ' + (x + d * 4) + ' ' + (cy + 60) + ' ' + (x + d * 2) + ' ' + (cy + 86) + '" stroke="' + shade(col, .3) + '" stroke-width="1.2" fill="none" stroke-dasharray="3 4"/>'; } }); }
      return s; }
    if (st === "ponytail") return '<path d="M' + (cx + w - 6) + ' ' + (cy - 16) + ' C' + (cx + w + 22) + ' ' + (cy + 2) + ' ' + (cx + w + 16) + ' ' + (cy + 52) + ' ' + (cx + w - 2) + ' ' + (cy + 74) + ' C' + (cx + w + 2) + ' ' + (cy + 44) + ' ' + (cx + w - 6) + ' ' + (cy + 18) + ' ' + (cx + w - 14) + ' ' + (cy - 2) + ' Z" ' + f + '/>' +
      '<path d="M' + (cx + w + 6) + ' ' + (cy + 8) + ' q8 20 -2 50" stroke="' + shade(col, .3) + '" stroke-width="1.2" fill="none" opacity=".5"/>';
    if (st === "afro") return bumps(cx, cy - 22, w + 14, 50, 13, 18, col, id) + curls(cx, cy - 22, w + 10, 46, col);
    if (st === "puffs") return bumps(cx - w - 2, cy - 44, 14, 14, 8, 9, col, id) + bumps(cx + w + 2, cy - 44, 14, 14, 8, 9, col, id);
    if (st === "bun") return bumps(cx, cy - 72, 13, 11, 6, 10, col, id);
    return "";
  }
  function hairFront(sp, id, cx, cy, w, col) {
    var st = sp.hair, f = 'fill="url(#' + id + 'hr)"';
    if (sp.hijab || st === "none") return "";
    if (st === "bald") return '<path d="M' + (cx - w - 1) + ' ' + (cy + 4) + ' C' + (cx - w - 4) + ' ' + (cy - 14) + ' ' + (cx - w + 2) + ' ' + (cy - 28) + ' ' + (cx - w + 8) + ' ' + (cy - 32) + ' C' + (cx - w + 4) + ' ' + (cy - 18) + ' ' + (cx - w + 4) + ' ' + (cy - 6) + ' ' + (cx - w + 3) + ' ' + (cy + 4) + ' Z" ' + f + '/>' +
      '<path d="M' + (cx + w + 1) + ' ' + (cy + 4) + ' C' + (cx + w + 4) + ' ' + (cy - 14) + ' ' + (cx + w - 2) + ' ' + (cy - 28) + ' ' + (cx + w - 8) + ' ' + (cy - 32) + ' C' + (cx + w - 4) + ' ' + (cy - 18) + ' ' + (cx + w - 4) + ' ' + (cy - 6) + ' ' + (cx + w - 3) + ' ' + (cy + 4) + ' Z" ' + f + '/>' +
      '<ellipse cx="' + (cx - 8) + '" cy="' + (cy - 44) + '" rx="16" ry="7" fill="#fff" opacity=".13"/>';
    if (st === "buzz") return '<path d="' + cap(cx, cy, w, 0) + '" ' + f + ' opacity=".82"/>';
    if (st === "afro" || st === "puffs" || st === "curly") {
      var s = '<path d="' + cap(cx, cy, w, 0) + '" ' + f + '/>';
      if (st === "curly") s += bumps(cx, cy - 44, w - 2, 20, 9, 14, col, id) + curls(cx, cy - 44, w - 4, 18, col);
      return s; }
    var s2 = '<path d="' + cap(cx, cy, w, st === "long" || st === "wavy" ? -8 : 2) + '" ' + f + '/>' + strands(cx, cy, col);
    if (st === "long" || st === "wavy" || st === "ponytail") s2 += '<path d="M' + (cx - w - 2) + ' ' + (cy - 4) + ' C' + (cx - w - 6) + ' ' + (cy + 14) + ' ' + (cx - w - 2) + ' ' + (cy + 26) + ' ' + (cx - w + 3) + ' ' + (cy + 34) + ' C' + (cx - w + 1) + ' ' + (cy + 16) + ' ' + (cx - w + 4) + ' ' + (cy - 10) + ' ' + (cx - w + 9) + ' ' + (cy - 26) + ' Z" ' + f + '/>';
    if (st === "long" || st === "wavy") s2 += '<path d="M' + (cx + w + 2) + ' ' + (cy - 4) + ' C' + (cx + w + 6) + ' ' + (cy + 14) + ' ' + (cx + w + 2) + ' ' + (cy + 26) + ' ' + (cx + w - 3) + ' ' + (cy + 34) + ' C' + (cx + w - 1) + ' ' + (cy + 16) + ' ' + (cx + w - 4) + ' ' + (cy - 10) + ' ' + (cx + w - 9) + ' ' + (cy - 26) + ' Z" ' + f + '/>';
    if (st === "short" || st === "side") s2 += '<path d="M' + (cx - 14) + ' ' + (cy - 38) + ' q18 -8 34 4 q-14 -2 -34 -4 Z" fill="' + shade(col, .15) + '" opacity=".6"/>';
    return s2;
  }
  function hijabDrape(sp, cx, cy, w) { return '<path d="M' + (cx - 36) + ' ' + (cy + 30) + ' C' + (cx - 30) + ' ' + (cy + 60) + ' ' + (cx + 30) + ' ' + (cy + 60) + ' ' + (cx + 36) + ' ' + (cy + 30) + ' L' + (cx + 58) + ' ' + (cy + 94) + ' L' + (cx - 58) + ' ' + (cy + 94) + ' Z" fill="' + shade(sp.hijab, -.08) + '"/>'; }
  function hijabFront(sp, cx, cy, w, chin) { var c = sp.hijab;
    return '<path d="M' + (cx - w + 1) + ' ' + (cy + 10) + ' C' + (cx - w - 2) + ' ' + (cy - 58) + ' ' + (cx + w + 2) + ' ' + (cy - 58) + ' ' + (cx + w - 1) + ' ' + (cy + 10) + ' C' + (cx + w - 3) + ' ' + (cy + 30) + ' ' + (cx + 22) + ' ' + (cy + chin + 2) + ' ' + cx + ' ' + (cy + chin + 3) +
      ' C' + (cx - 22) + ' ' + (cy + chin + 2) + ' ' + (cx - w + 3) + ' ' + (cy + 30) + ' ' + (cx - w + 1) + ' ' + (cy + 10) + ' Z" fill="none" stroke="' + c + '" stroke-width="13"/>' +
      '<path d="M' + (cx - w + 4) + ' ' + (cy - 26) + ' C' + (cx - 14) + ' ' + (cy - 48) + ' ' + (cx + 14) + ' ' + (cy - 48) + ' ' + (cx + w - 4) + ' ' + (cy - 26) + '" fill="none" stroke="' + shade(c, .25) + '" stroke-width="2" opacity=".6"/>' +
      '<path d="M' + (cx - w - 6) + ' ' + (cy + 8) + ' q-4 30 14 50 M' + (cx + w + 6) + ' ' + (cy + 8) + ' q4 30 -14 50" stroke="' + shade(c, -.2) + '" stroke-width="1.6" fill="none" opacity=".6"/>'; }

  /* ---------- clothes ---------- */
  function clothes(sp, id, cx, cy, skin) {
    var o = sp.outfit || { type: "sweater", color: "#567" }, c = o.color, c2 = o.color2 || shade(c, -.25), base = cy + 72;
    var body = 'M14 222 C18 ' + (base + 18) + ' 50 ' + (base + 2) + ' 100 ' + base + ' C150 ' + (base + 2) + ' 182 ' + (base + 18) + ' 186 222 Z';
    var s = '<path d="' + body + '" fill="url(#' + id + 'cl)"/>';
    var collar = function (col) { return '<path d="M' + (cx - 18) + ' ' + (base - 2) + ' L' + (cx - 4) + ' ' + (base + 24) + ' L' + (cx - 26) + ' ' + (base + 18) + ' Z M' + (cx + 18) + ' ' + (base - 2) + ' L' + (cx + 4) + ' ' + (base + 24) + ' L' + (cx + 26) + ' ' + (base + 18) + ' Z" fill="' + col + '" stroke="' + shade(col, -.3) + '" stroke-width="1"/>'; };
    var vneck = function (col) { return '<path d="M' + (cx - 16) + ' ' + (base - 1) + ' L' + cx + ' ' + (base + 26) + ' L' + (cx + 16) + ' ' + (base - 1) + ' Z" fill="' + col + '"/>'; };
    if (o.type === "ranger" || o.type === "parkshirt") { s += vneck(skin) + collar(shade(c, .08)) + '<path d="M' + cx + ' ' + (base + 26) + ' V222" stroke="' + shade(c, -.35) + '" stroke-width="1.2"/>' +
      '<circle cx="' + cx + '" cy="' + (base + 36) + '" r="1.6" fill="' + shade(c, -.4) + '"/><rect x="' + (cx + 22) + '" y="' + (base + 26) + '" width="22" height="14" rx="2" fill="' + (o.patch || "#4f7a3a") + '" stroke="' + shade(o.patch || "#4f7a3a", -.3) + '"/>' +
      '<path d="M' + (cx - 46) + ' ' + (base + 30) + ' h20 v12 h-20 Z" fill="none" stroke="' + shade(c, -.3) + '" stroke-width="1.2"/>'; }
    else if (o.type === "tweed") { s += vneck("#f2efe6") + '<path d="M' + (cx - 8) + ' ' + (base + 4) + ' l8 4 l8 -4 v8 l-8 -4 l-8 4 Z" fill="' + (o.tie || "#a33") + '"/>' +
      '<path d="M' + (cx - 17) + ' ' + (base - 1) + ' L' + (cx - 2) + ' ' + (base + 40) + ' L' + (cx - 30) + ' ' + (base + 22) + ' Z M' + (cx + 17) + ' ' + (base - 1) + ' L' + (cx + 2) + ' ' + (base + 40) + ' L' + (cx + 30) + ' ' + (base + 22) + ' Z" fill="' + shade(c, -.15) + '"/>' +
      '<g stroke="' + shade(c, .2) + '" stroke-width=".7" opacity=".35">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<path d="M' + (20 + i * 22) + ' ' + (base + 10) + ' l10 60"/>'; }).join("") + '</g>'; }
    else if (o.type === "vest") { s += vneck(skin) + '<path d="M14 222 C18 ' + (base + 18) + ' 50 ' + (base + 2) + ' 80 ' + base + ' L' + (cx - 8) + ' 222 Z M186 222 C182 ' + (base + 18) + ' 150 ' + (base + 2) + ' 120 ' + base + ' L' + (cx + 8) + ' 222 Z" fill="' + c2 + '"/>' +
      '<rect x="' + (cx + 22) + '" y="' + (base + 24) + '" width="26" height="12" rx="3" fill="#fff" stroke="#999"/><path d="M38 ' + (base + 26) + ' l12 60 M162 ' + (base + 26) + ' l-12 60" stroke="#e8e26a" stroke-width="3" opacity=".8"/>'; }
    else if (o.type === "polo") { s += '<path d="M' + (cx - 16) + ' ' + (base - 1) + ' L' + cx + ' ' + (base + 16) + ' L' + (cx + 16) + ' ' + (base - 1) + ' Z" fill="' + skin + '"/>' + collar(shade(c, .1)) +
      '<path d="M' + (cx - 20) + ' ' + base + ' Q' + (cx - 6) + ' ' + (base + 50) + ' ' + (cx - 2) + ' ' + (base + 60) + ' M' + (cx + 20) + ' ' + base + ' Q' + (cx + 6) + ' ' + (base + 50) + ' ' + (cx + 2) + ' ' + (base + 60) + '" stroke="' + (o.lanyard || "#e9b949") + '" stroke-width="3" fill="none"/>' +
      '<rect x="' + (cx - 9) + '" y="' + (base + 58) + '" width="18" height="24" rx="2" fill="#fff" stroke="#888"/><rect x="' + (cx - 6) + '" y="' + (base + 62) + '" width="12" height="7" fill="' + c + '"/>'; }
    else if (o.type === "trench") { s += vneck(o.inner || "#f4efe4") + '<path d="M' + (cx - 18) + ' ' + (base - 3) + ' L' + (cx - 4) + ' ' + (base + 44) + ' L' + (cx - 40) + ' ' + (base + 26) + ' L' + (cx - 30) + ' ' + (base + 6) + ' Z M' + (cx + 18) + ' ' + (base - 3) + ' L' + (cx + 4) + ' ' + (base + 44) + ' L' + (cx + 40) + ' ' + (base + 26) + ' L' + (cx + 30) + ' ' + (base + 6) + ' Z" fill="' + shade(c, .1) + '" stroke="' + shade(c, -.3) + '"/>' +
      '<circle cx="' + (cx - 18) + '" cy="' + (base + 50) + '" r="2.4" fill="' + shade(c, -.45) + '"/><circle cx="' + (cx + 18) + '" cy="' + (base + 50) + '" r="2.4" fill="' + shade(c, -.45) + '"/>'; }
    else if (o.type === "hoodie") { s += '<path d="M' + (cx - 36) + ' ' + (base + 2) + ' C' + (cx - 30) + ' ' + (base - 16) + ' ' + (cx + 30) + ' ' + (base - 16) + ' ' + (cx + 36) + ' ' + (base + 2) + ' C' + (cx + 20) + ' ' + (base + 14) + ' ' + (cx - 20) + ' ' + (base + 14) + ' ' + (cx - 36) + ' ' + (base + 2) + ' Z" fill="' + shade(c, -.15) + '"/>' +
      '<path d="M' + (cx - 8) + ' ' + (base + 10) + ' v26 M' + (cx + 8) + ' ' + (base + 10) + ' v26" stroke="#f5f0e6" stroke-width="2" stroke-linecap="round"/><path d="M' + (cx - 34) + ' ' + (base + 66) + ' h68" stroke="' + shade(c, -.3) + '" stroke-width="1.4"/>'; }
    else if (o.type === "captain") { s += vneck("#fbfbf8") + '<path d="M' + (cx - 5) + ' ' + (base + 2) + ' h10 l-2 24 h-6 Z" fill="#1f2d4d"/>' + '<path d="M' + (cx - 17) + ' ' + (base - 1) + ' L' + (cx - 3) + ' ' + (base + 40) + ' L' + (cx - 32) + ' ' + (base + 22) + ' Z M' + (cx + 17) + ' ' + (base - 1) + ' L' + (cx + 3) + ' ' + (base + 40) + ' L' + (cx + 32) + ' ' + (base + 22) + ' Z" fill="' + shade(c, -.15) + '"/>' +
      [0, 1].map(function (i) { return '<circle cx="' + (cx - 14) + '" cy="' + (base + 48 + i * 14) + '" r="2.6" fill="#e3b448"/><circle cx="' + (cx + 14) + '" cy="' + (base + 48 + i * 14) + '" r="2.6" fill="#e3b448"/>'; }).join("") +
      '<path d="M22 ' + (base + 22) + ' l20 -6 M178 ' + (base + 22) + ' l-20 -6" stroke="#e3b448" stroke-width="3"/>'; }
    else if (o.type === "sequin") { s += vneck(o.inner || "#1d1d24") + '<path d="M14 222 C18 ' + (base + 18) + ' 50 ' + (base + 2) + ' 82 ' + base + ' L' + (cx - 6) + ' 222 Z M186 222 C182 ' + (base + 18) + ' 150 ' + (base + 2) + ' 118 ' + base + ' L' + (cx + 6) + ' 222 Z" fill="' + c2 + '"/>' +
      '<g fill="#fff" opacity=".75">' + [[40, 20], [58, 34], [46, 46], [70, 18], [150, 22], [140, 38], [158, 44], [128, 16], [62, 56], [138, 56]].map(function (p) { return '<path d="M' + p[0] + ' ' + (base + p[1]) + ' l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z"/>'; }).join("") + '</g>'; }
    else if (o.type === "floral") { s += vneck(skin) + collar(shade(c, .1)) + '<g opacity=".8">' + [[40, 30], [70, 48], [130, 30], [160, 52], [52, 64], [148, 74], [100, 70]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + (base + p[1]) + '" r="5" fill="' + (o.dots || "#ffd166") + '"/><circle cx="' + p[0] + '" cy="' + (base + p[1]) + '" r="1.8" fill="#fff"/>'; }).join("") + '</g>'; }
    else if (o.type === "cardigan") { s += vneck(o.inner || "#f3e9d8") + '<path d="M' + (cx - 16) + ' ' + (base - 1) + ' L' + (cx - 2) + ' 222 M' + (cx + 16) + ' ' + (base - 1) + ' L' + (cx + 2) + ' 222" stroke="' + shade(c, -.3) + '" stroke-width="2"/>' +
      '<path d="M' + (cx - 14) + ' ' + (base + 2) + ' Q' + cx + ' ' + (base + 22) + ' ' + (cx + 14) + ' ' + (base + 2) + '" fill="none" stroke="#d9b13b" stroke-width="1.3"/><circle cx="' + cx + '" cy="' + (base + 15) + '" r="5" fill="#e8c14f" stroke="#a8832a"/><text x="' + cx + '" y="' + (base + 17.5) + '" font-size="7" text-anchor="middle" fill="#7a5c14" font-family="serif">¢</text>'; }
    else { s += '<path d="M' + (cx - 18) + ' ' + (base - 1) + ' Q' + cx + ' ' + (base + 12) + ' ' + (cx + 18) + ' ' + (base - 1) + '" fill="' + skin + '" stroke="' + shade(c, -.3) + '" stroke-width="3"/>' +
      (o.stripe ? '<path d="M18 ' + (base + 40) + ' Q100 ' + (base + 30) + ' 182 ' + (base + 40) + '" stroke="' + o.stripe + '" stroke-width="6" fill="none"/>' : ""); }
    if (o.scarf) s += '<path d="M' + (cx - 24) + ' ' + (base - 4) + ' Q' + cx + ' ' + (base + 14) + ' ' + (cx + 24) + ' ' + (base - 4) + ' L' + (cx + 26) + ' ' + (base + 6) + ' Q' + cx + ' ' + (base + 24) + ' ' + (cx - 26) + ' ' + (base + 6) + ' Z" fill="' + o.scarf + '"/><path d="M' + (cx + 10) + ' ' + (base + 12) + ' l6 36 l8 -3 l-4 -34 Z" fill="' + shade(o.scarf, -.12) + '"/>';
    return s;
  }

  /* ---------- hats, props, gear ---------- */
  function hat(h, cx, cy, w, id) {
    var t = h.type, c = h.color || "#6b5a3a", top = cy - 50;
    if (t === "ranger") return '<ellipse cx="' + cx + '" cy="' + (top + 6) + '" rx="' + (w + 34) + '" ry="13" fill="' + shade(c, -.1) + '" stroke="' + shade(c, -.35) + '"/>' +
      '<path d="M' + (cx - 28) + ' ' + (top + 4) + ' C' + (cx - 30) + ' ' + (top - 30) + ' ' + (cx - 12) + ' ' + (top - 46) + ' ' + cx + ' ' + (top - 40) + ' C' + (cx + 12) + ' ' + (top - 46) + ' ' + (cx + 30) + ' ' + (top - 30) + ' ' + (cx + 28) + ' ' + (top + 4) + ' Z" fill="' + c + '" stroke="' + shade(c, -.3) + '"/>' +
      '<path d="M' + (cx - 6) + ' ' + (top - 38) + ' L' + (cx - 2) + ' ' + (top - 10) + ' M' + (cx + 6) + ' ' + (top - 38) + ' L' + (cx + 2) + ' ' + (top - 10) + '" stroke="' + shade(c, -.25) + '" stroke-width="1.5"/>' +
      '<rect x="' + (cx - 28) + '" y="' + (top - 4) + '" width="56" height="7" fill="' + (h.band || shade(c, -.3)) + '"/>';
    if (t === "straw") { var s = '<ellipse cx="' + cx + '" cy="' + (top + 8) + '" rx="' + (w + 30) + '" ry="14" fill="' + c + '" stroke="' + shade(c, -.35) + '"/>' +
      '<path d="M' + (cx - 30) + ' ' + (top + 6) + ' C' + (cx - 30) + ' ' + (top - 30) + ' ' + (cx + 30) + ' ' + (top - 30) + ' ' + (cx + 30) + ' ' + (top + 6) + ' Z" fill="' + shade(c, .08) + '" stroke="' + shade(c, -.35) + '"/>' +
      '<rect x="' + (cx - 30) + '" y="' + (top - 4) + '" width="60" height="7" fill="' + (h.band || "#7b3fa0") + '"/><g stroke="' + shade(c, .35) + '" stroke-width=".9" opacity=".7">';
      for (var i = -5; i <= 5; i++) s += '<path d="M' + (cx + i * 12) + ' ' + (top + 2 + Math.abs(i)) + ' l' + (i * 1.5) + ' 12"/>'; return s + '</g><path d="M' + (cx + w + 14) + ' ' + (top + 10) + ' l8 6 l-4 -10 Z" fill="' + shade(c, .2) + '"/>'; }
    if (t === "cap") return '<path d="M' + (cx - w - 2) + ' ' + (top + 14) + ' C' + (cx - w - 4) + ' ' + (top - 26) + ' ' + (cx + w + 4) + ' ' + (top - 26) + ' ' + (cx + w + 2) + ' ' + (top + 14) + ' Z" fill="' + c + '" stroke="' + shade(c, -.3) + '"/>' +
      '<path d="M' + (cx - w + 2) + ' ' + (top + 13) + ' Q' + cx + ' ' + (top + 32) + ' ' + (cx + w - 2) + ' ' + (top + 13) + ' Q' + cx + ' ' + (top + 18) + ' ' + (cx - w + 2) + ' ' + (top + 13) + ' Z" fill="' + shade(c, -.25) + '"/>' +
      '<circle cx="' + cx + '" cy="' + (top - 15) + '" r="3" fill="' + shade(c, -.2) + '"/><path d="M' + cx + ' ' + (top - 14) + ' V' + (top + 13) + '" stroke="' + shade(c, -.3) + '" stroke-width="1"/>' + (h.emblem ? '<circle cx="' + cx + '" cy="' + (top + 2) + '" r="6" fill="' + h.emblem + '"/>' : "");
    if (t === "captain") return '<path d="M' + (cx - w - 6) + ' ' + (top + 4) + ' L' + (cx - w + 2) + ' ' + (top - 16) + ' L' + (cx + w - 2) + ' ' + (top - 16) + ' L' + (cx + w + 6) + ' ' + (top + 4) + ' Z" fill="#fbfbf8" stroke="#bbb"/>' +
      '<rect x="' + (cx - w - 4) + '" y="' + (top + 2) + '" width="' + (2 * w + 8) + '" height="10" fill="' + c + '"/><path d="M' + (cx - w + 2) + ' ' + (top + 11) + ' Q' + cx + ' ' + (top + 28) + ' ' + (cx + w - 2) + ' ' + (top + 11) + ' Z" fill="#111"/>' +
      '<path d="M' + (cx - 9) + ' ' + (top + 5) + ' q9 -12 18 0 q-9 6 -18 0 Z" fill="#e3b448"/><path d="M' + (cx - w + 4) + ' ' + (top + 12) + ' h' + (2 * w - 8) + '" stroke="#e3b448" stroke-width="2"/>';
    if (t === "deerstalker") return '<path d="M' + (cx - w - 4) + ' ' + (top + 14) + ' C' + (cx - w - 6) + ' ' + (top - 28) + ' ' + (cx + w + 6) + ' ' + (top - 28) + ' ' + (cx + w + 4) + ' ' + (top + 14) + ' Z" fill="' + c + '" stroke="' + shade(c, -.35) + '"/>' +
      '<g stroke="' + shade(c, -.3) + '" stroke-width="1.3" opacity=".7"><path d="M' + (cx - 30) + ' ' + (top - 6) + ' h60 M' + (cx - 34) + ' ' + (top + 6) + ' h68 M' + (cx - 12) + ' ' + (top - 18) + ' v30 M' + (cx + 12) + ' ' + (top - 18) + ' v30"/></g>' +
      '<path d="M' + (cx - w + 4) + ' ' + (top + 12) + ' Q' + cx + ' ' + (top + 26) + ' ' + (cx + w - 4) + ' ' + (top + 12) + ' Z" fill="' + shade(c, -.15) + '"/><path d="M' + (cx - w - 2) + ' ' + (top + 10) + ' q-6 14 2 22 l8 -18 Z M' + (cx + w + 2) + ' ' + (top + 10) + ' q6 14 -2 22 l-8 -18 Z" fill="' + shade(c, -.1) + '"/>' +
      '<path d="M' + (cx - 4) + ' ' + (top - 22) + ' q4 -6 8 0" stroke="' + shade(c, -.35) + '" stroke-width="3" fill="none"/>';
    if (t === "beret") return '<ellipse cx="' + (cx + 6) + '" cy="' + (top - 6) + '" rx="' + (w + 10) + '" ry="16" fill="' + c + '" stroke="' + shade(c, -.3) + '" transform="rotate(-8 ' + cx + ' ' + top + ')"/><circle cx="' + (cx + 4) + '" cy="' + (top - 22) + '" r="3" fill="' + shade(c, -.3) + '"/>';
    if (t === "explorer") return '<ellipse cx="' + cx + '" cy="' + (top + 6) + '" rx="' + (w + 22) + '" ry="10" fill="' + shade(c, -.1) + '"/><path d="M' + (cx - 30) + ' ' + (top + 5) + ' C' + (cx - 32) + ' ' + (top - 34) + ' ' + (cx + 32) + ' ' + (top - 34) + ' ' + (cx + 30) + ' ' + (top + 5) + ' Z" fill="' + c + '"/><rect x="' + (cx - 30) + '" y="' + (top - 4) + '" width="60" height="6" fill="#5b3a1e"/>';
    return "";
  }
  function prop(p, cx, cy) {
    if (p === "umbrella") return '<g><path d="M168 132 L150 222" stroke="#4a2a1a" stroke-width="4" stroke-linecap="round"/><path d="M168 132 q8 -14 -2 -18 q-8 -2 -8 6" stroke="#4a2a1a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M150 160 L134 222 L176 222 Z" fill="#d62828" stroke="#8d1919"/><path d="M152 168 l-6 54 M158 166 l6 56" stroke="#8d1919" stroke-width="1"/></g>';
    if (p === "backpack") return '<path d="M58 ' + (cy + 70) + ' C62 ' + (cy + 90) + ' 66 ' + (cy + 110) + ' 64 222 M142 ' + (cy + 70) + ' C138 ' + (cy + 90) + ' 134 ' + (cy + 110) + ' 136 222" stroke="#3b3b3b" stroke-width="9" fill="none"/><rect x="58" y="' + (cy + 100) + '" width="10" height="7" rx="2" fill="#999"/><rect x="132" y="' + (cy + 100) + '" width="10" height="7" rx="2" fill="#999"/>';
    if (p === "pen") return '<path d="M52 ' + (cy + 100) + ' l6 -26" stroke="#7b3fa0" stroke-width="4" stroke-linecap="round"/><path d="M58 ' + (cy + 74) + ' l1 -4" stroke="#e3b448" stroke-width="3"/>';
    if (p === "notebook") return '<rect x="132" y="' + (cy + 92) + '" width="34" height="40" rx="3" fill="#8a5a2b" stroke="#5b3a1e" transform="rotate(-8 150 ' + (cy + 110) + ')"/><rect x="137" y="' + (cy + 98) + '" width="24" height="5" fill="#f4e7c6" transform="rotate(-8 150 ' + (cy + 110) + ')"/>';
    if (p === "magnifier") return '<g transform="rotate(-30 40 ' + (cy + 100) + ')"><rect x="36" y="' + (cy + 106) + '" width="8" height="30" rx="3" fill="#6b3f1f"/><circle cx="40" cy="' + (cy + 92) + '" r="15" fill="rgba(200,230,255,.35)" stroke="#c9a227" stroke-width="5"/></g>';
    return "";
  }
  function gearPiece(g, cx, cy, w) {
    if (g === "medal") return '<path d="M' + (cx - 30) + ' ' + (cy + 74) + ' l8 22 h8 l-8 -22 Z" fill="#2a6fdb"/><circle cx="' + (cx - 23) + '" cy="' + (cy + 102) + '" r="8" fill="#e8c14f" stroke="#a8832a" stroke-width="1.5"/><path d="M' + (cx - 23) + ' ' + (cy + 97) + ' l1.6 3.4 3.6 .4 -2.7 2.4 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.7 -2.4 3.6 -.4 Z" fill="#fff6c8"/>';
    if (g === "watch") return '<path d="M' + (cx + 24) + ' ' + (cy + 92) + ' q10 8 20 0" stroke="#d9b13b" stroke-width="1.5" fill="none"/><circle cx="' + (cx + 44) + '" cy="' + (cy + 96) + '" r="7" fill="#fff8e1" stroke="#d9b13b" stroke-width="2"/><path d="M' + (cx + 44) + ' ' + (cy + 96) + ' v-4 M' + (cx + 44) + ' ' + (cy + 96) + ' h3" stroke="#333" stroke-width="1"/>';
    if (g === "coinpin") return '<circle cx="' + (cx + 34) + '" cy="' + (cy + 92) + '" r="7" fill="#e8c14f" stroke="#a8832a" stroke-width="1.5"/><text x="' + (cx + 34) + '" y="' + (cy + 95) + '" font-size="8" text-anchor="middle" fill="#7a5c14">$</text>';
    if (g === "compasspin") return '<circle cx="' + (cx + 34) + '" cy="' + (cy + 108) + '" r="8" fill="#f4efe4" stroke="#1d3557" stroke-width="1.6"/><path d="M' + (cx + 34) + ' ' + (cy + 101) + ' l2.4 7 -2.4 7 -2.4 -7 Z" fill="#d62828"/>';
    if (g === "bookbadge") return '<rect x="' + (cx - 44) + '" y="' + (cy + 100) + '" width="16" height="12" rx="1.5" fill="#457b9d" stroke="#1d3557"/><path d="M' + (cx - 36) + ' ' + (cy + 100) + ' v12" stroke="#fff" stroke-width="1"/>';
    if (g === "scroll") return '<rect x="' + (cx + 26) + '" y="' + (cy + 116) + '" width="22" height="10" rx="4" fill="#f1e2b8" stroke="#a8832a"/>';
    return "";
  }
  return { svg: svg, MOODS: MOODS, shade: shade };
})();
