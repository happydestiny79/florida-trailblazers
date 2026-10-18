/* All art is drawn in code (SVG). No external images or fonts. */
var ART = (function () {
  var C = { sky: "#bfe6f5", sky2: "#fde9c8", sea: "#4fa3c7", sea2: "#2f7fa6", sand: "#f2d7a0", coquina: "#d9b97e", coquinaDark: "#b8955a",
            grass: "#6db36d", grassDark: "#3d8b4f", sun: "#ffcf4a", wood: "#9c6b3c", thatch: "#c9a15a", red: "#c0392b", ink: "#7b3fa0", white: "#fffaf0", text: "#3b2a1a" };

  function svg(inner, w, h) { w = w || 800; h = h || 360;
    return '<svg class="scene-svg" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + inner + '</svg>'; }
  function sky(warm) { return '<rect width="800" height="360" fill="' + (warm ? C.sky2 : C.sky) + '"/><circle cx="700" cy="60" r="34" fill="' + C.sun + '"/>' +
    '<g fill="#fff" opacity=".85"><ellipse cx="160" cy="60" rx="60" ry="18"/><ellipse cx="200" cy="50" rx="40" ry="16"/><ellipse cx="480" cy="80" rx="50" ry="14"/></g>'; }
  function ground(col, y) { return '<rect y="' + (y || 270) + '" width="800" height="' + (360 - (y || 270)) + '" fill="' + (col || C.grass) + '"/>'; }
  function water(y) { y = y || 260; return '<rect y="' + y + '" width="800" height="' + (360 - y) + '" fill="' + C.sea + '"/>' +
    '<g stroke="#e8f6fb" stroke-width="3" fill="none" opacity=".7"><path d="M40 ' + (y + 30) + ' q20 -10 40 0 t40 0"/><path d="M500 ' + (y + 50) + ' q20 -10 40 0 t40 0"/><path d="M260 ' + (y + 70) + ' q20 -10 40 0 t40 0"/></g>'; }
  function palm(x, y, s) { s = s || 1; return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M0 0 q6 -60 -4 -110" stroke="#8a6a3a" stroke-width="9" fill="none"/>' +
    '<g fill="' + C.grassDark + '"><path d="M-4 -110 q-50 -10 -70 20 q40 -30 70 -20z"/><path d="M-4 -110 q50 -10 70 22 q-40 -30 -70 -22z"/><path d="M-4 -110 q-20 -40 -60 -40 q40 10 60 40z"/><path d="M-4 -110 q20 -40 60 -38 q-40 10 -60 38z"/></g></g>'; }
  function person(x, y, shirt, hatCol, hatType, s) { s = s || 1; var hat = "";
    if (hatType === "straw") hat = '<ellipse cx="0" cy="-58" rx="26" ry="6" fill="' + hatCol + '"/><rect x="-14" y="-74" width="28" height="16" rx="6" fill="' + hatCol + '"/>';
    else if (hatType === "cap") hat = '<path d="M-16 -60 q16 -22 32 0z" fill="' + hatCol + '"/><rect x="10" y="-62" width="18" height="5" rx="2" fill="' + hatCol + '"/>';
    else if (hatType === "ranger") hat = '<ellipse cx="0" cy="-60" rx="28" ry="6" fill="#7a5a2f"/><path d="M-14 -60 l4 -16 h20 l4 16z" fill="#8b6a3a"/>';
    else if (hatType === "pirate") hat = '<path d="M-26 -58 q26 -30 52 0 q-26 -8 -52 0z" fill="#222"/><circle cx="0" cy="-66" r="3" fill="#fff"/>';
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><rect x="-18" y="-30" width="36" height="46" rx="12" fill="' + shirt + '"/>' +
      '<circle cx="0" cy="-46" r="16" fill="#e0ac7e"/><circle cx="-5" cy="-48" r="2" fill="#333"/><circle cx="5" cy="-48" r="2" fill="#333"/><path d="M-5 -40 q5 4 10 0" stroke="#333" stroke-width="2" fill="none"/>' + hat +
      '<rect x="-14" y="16" width="10" height="22" fill="#4a3b2a"/><rect x="4" y="16" width="10" height="22" fill="#4a3b2a"/></g>'; }
  function umbrella(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><path d="M-30 0 q30 -40 60 0z" fill="' + C.red + '"/><path d="M0 0 v34 q0 6 -6 6" stroke="#333" stroke-width="3" fill="none"/></g>'; }
  function sign(x, y, txt, w) { w = w || 200; return '<g transform="translate(' + x + ',' + y + ')"><rect x="-4" y="30" width="8" height="50" fill="' + C.wood + '"/><rect x="' + (-w / 2) + '" y="-14" width="' + w + '" height="48" rx="8" fill="#5b3f22"/>' +
    '<text x="0" y="16" text-anchor="middle" font-size="16" font-weight="700" fill="#fff6dc">' + txt + '</text></g>'; }
  function castillo(x, y, s) { s = s || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<path d="M-200 0 L-160 -70 L-110 -60 L-110 -100 L110 -100 L110 -60 L160 -70 L200 0 Z" fill="' + C.coquina + '" stroke="' + C.coquinaDark + '" stroke-width="4"/>' +
      '<g fill="' + C.coquinaDark + '">' + [-90, -50, -10, 30, 70].map(function (cx) { return '<rect x="' + cx + '" y="-112" width="20" height="14"/>'; }).join("") + '</g>' +
      '<rect x="-24" y="-56" width="48" height="56" rx="24" fill="#5b3f22"/><rect x="145" y="-110" width="26" height="42" fill="' + C.coquina + '" stroke="' + C.coquinaDark + '" stroke-width="3"/>' +
      '<path d="M145 -110 h26 l-13 -14z" fill="' + C.coquinaDark + '"/>' +
      '<g fill="' + C.coquinaDark + '" opacity=".5"><circle cx="-140" cy="-20" r="3"/><circle cx="-70" cy="-40" r="2"/><circle cx="60" cy="-30" r="3"/><circle cx="120" cy="-15" r="2"/><circle cx="-30" cy="-80" r="2"/></g></g>'; }
  function councilHouse(x, y, s) { s = s || 1; return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-150 0 Q-150 -120 0 -150 Q150 -120 150 0 Z" fill="' + C.thatch + '" stroke="#9b7a3a" stroke-width="4"/>' +
    '<g stroke="#a8843f" stroke-width="2" fill="none">' + [-110, -70, -30, 10, 50, 90].map(function (dx) { return '<path d="M' + dx + ' -' + (90 - Math.abs(dx) / 4) + ' q10 40 0 80"/>'; }).join("") + '</g>' +
    '<rect x="-20" y="-50" width="40" height="50" rx="8" fill="#5b3f22"/><circle cx="0" cy="-150" r="12" fill="#9b7a3a"/></g>'; }
  function church(x, y, s) { s = s || 1; return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><rect x="-70" y="-90" width="140" height="90" fill="#efe1c2" stroke="#b39463" stroke-width="3"/>' +
    '<path d="M-82 -88 L0 -150 L82 -88 Z" fill="' + C.thatch + '" stroke="#9b7a3a" stroke-width="3"/><rect x="-16" y="-50" width="32" height="50" rx="14" fill="#5b3f22"/>' +
    '<rect x="44" y="-150" width="30" height="50" fill="#efe1c2" stroke="#b39463" stroke-width="3"/><path d="M52 -128 q7 -14 14 0 v6 h-14z" fill="#c8a03a"/></g>'; }
  function bell(x, y, s) { s = s || 1; return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-40 0 q0 -70 40 -80 q40 10 40 80 z" fill="#c8a03a" stroke="#8a6a1f" stroke-width="4"/><rect x="-48" y="-4" width="96" height="10" rx="5" fill="#8a6a1f"/><circle cx="0" cy="14" r="9" fill="#8a6a1f"/></g>'; }
  function busArt(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><rect x="-120" y="-70" width="240" height="80" rx="16" fill="#f0a830" stroke="#b3741a" stroke-width="4"/>' +
    [-95, -50, -5, 40].map(function (wx) { return '<rect x="' + wx + '" y="-58" width="36" height="26" rx="4" fill="#cfeefa"/>'; }).join("") +
    '<rect x="88" y="-58" width="22" height="44" rx="3" fill="#cfeefa"/><circle cx="-70" cy="12" r="16" fill="#333"/><circle cx="70" cy="12" r="16" fill="#333"/><text x="0" y="-6" text-anchor="middle" font-size="14" font-weight="700" fill="#5b3f22">WESTBOUND</text></g>'; }
  function pelican(x, y) { return '<g transform="translate(' + x + ',' + y + ')"><ellipse cx="0" cy="0" rx="46" ry="56" fill="#f4f1ea" stroke="#a89c86" stroke-width="3"/>' +
    '<circle cx="0" cy="-70" r="28" fill="#f4f1ea" stroke="#a89c86" stroke-width="3"/><circle cx="8" cy="-76" r="4" fill="#333"/>' +
    '<path d="M22 -70 L110 -60 Q60 -30 18 -56 Z" fill="#f2b53a" stroke="#c88a1a" stroke-width="3"/><circle cx="2" cy="-76" r="11" fill="none" stroke="#333" stroke-width="3"/>' +
    '<path d="M-18 -98 l18 -16 l18 16 z" fill="#2d5fa8"/></g>'; }
  function grassTufts(y) { var s = ""; for (var i = 0; i < 24; i++) { var x = 10 + i * 34; s += '<path d="M' + x + ' ' + y + ' l-6 -34 M' + (x + 6) + ' ' + y + ' l2 -42 M' + (x + 12) + ' ' + y + ' l8 -30" stroke="' + C.grassDark + '" stroke-width="4" fill="none" stroke-linecap="round"/>'; } return s; }

  var scenes = {
    office: function () { return svg(sky(true) + '<rect y="250" width="800" height="110" fill="#c79a63"/><rect x="420" y="200" width="300" height="70" fill="#8b5e34"/>' +
      '<rect x="80" y="60" width="200" height="140" rx="6" fill="#fff6dc" stroke="#8b5e34" stroke-width="6"/><text x="180" y="100" text-anchor="middle" font-size="20" font-weight="700" fill="#8b5e34">WANTED</text>' +
      '<text x="180" y="150" text-anchor="middle" font-size="60">?</text><text x="180" y="185" text-anchor="middle" font-size="14" fill="#8b5e34">Founding Stone Thief</text>' +
      pelican(560, 160) + '<ellipse cx="660" cy="196" rx="34" ry="10" fill="#9c6b3c"/><rect x="636" y="170" width="48" height="26" rx="8" fill="#a8a29a"/>'); },
    castillo: function () { return svg(sky() + water(250) + '<rect y="236" width="800" height="24" fill="' + C.sand + '"/>' + castillo(400, 248, 1.1) + palm(80, 260, 1) + palm(720, 262, 0.9)); },
    case: function () { return svg('<rect width="800" height="360" fill="#e9d8b8"/><rect y="280" width="800" height="80" fill="#c79a63"/>' +
      '<rect x="300" y="200" width="200" height="90" fill="#8b5e34"/><rect x="310" y="90" width="180" height="112" fill="#d9f1fa" opacity=".6" stroke="#6aa9c2" stroke-width="5"/>' +
      '<ellipse cx="400" cy="190" rx="50" ry="10" fill="#b39463" opacity=".5"/><text x="400" y="160" text-anchor="middle" font-size="22" fill="#5b3f22">EMPTY!</text>' +
      '<path d="M470 196 q10 -6 18 2 q-6 8 -16 4z" fill="' + C.ink + '"/><circle cx="476" cy="186" r="3" fill="' + C.ink + '"/>' +
      '<g transform="translate(580,150)"><circle r="40" fill="none" stroke="#5b3f22" stroke-width="10"/><rect x="26" y="26" width="60" height="16" rx="6" transform="rotate(45 26 26)" fill="#5b3f22"/></g>'); },
    ship: function () { return svg(sky() + water(240) + '<g transform="translate(400,250)"><path d="M-150 0 h300 l-40 50 h-220 z" fill="#8b5e34"/><rect x="-6" y="-170" width="10" height="170" fill="#5b3f22"/>' +
      '<path d="M4 -160 q90 60 0 140 z" fill="' + C.white + '"/><path d="M-6 -150 q-80 50 0 120 z" fill="' + C.white + '"/><rect x="-6" y="-185" width="40" height="18" fill="' + C.red + '"/></g>' +
      '<path d="M0 230 q120 -60 260 -20 v40 h-260z" fill="' + C.grass + '"/>' + palm(80, 236, 0.8)); },
    town: function () { var houses = ""; [80, 230, 380, 530, 680].forEach(function (x, i) { var col = ["#f3d9a4", "#f6e7c8", "#e9c48a", "#f3d9a4", "#f6e7c8"][i];
        houses += '<rect x="' + (x - 60) + '" y="150" width="120" height="120" fill="' + col + '" stroke="#b39463" stroke-width="3"/><rect x="' + (x - 18) + '" y="210" width="36" height="60" fill="#5b3f22"/>' +
          '<rect x="' + (x - 50) + '" y="168" width="24" height="24" fill="#5b3f22" opacity=".7"/><rect x="' + (x + 26) + '" y="168" width="24" height="24" fill="#5b3f22" opacity=".7"/>' +
          '<rect x="' + (x - 66) + '" y="140" width="132" height="14" fill="#a8743f"/>'; });
      return svg(sky(true) + '<rect y="270" width="800" height="90" fill="#cdb48a"/>' + houses + '<text x="400" y="330" text-anchor="middle" font-size="22" font-weight="700" fill="#5b3f22">St. Augustine, founded 1565</text>'); },
    village: function () { return svg(sky() + ground(C.grass, 250) + '<path d="M0 250 q200 -30 400 0 t400 0 v40 h-800z" fill="' + C.sea + '"/>' +
      [140, 200, 260].map(function (x) { return '<g transform="translate(' + x + ',300)"><rect x="-3" y="-80" width="6" height="80" fill="#5f9e3f"/><ellipse cx="10" cy="-50" rx="8" ry="18" fill="#f2d24a"/><path d="M0 -60 q-20 -10 -26 6" stroke="#5f9e3f" stroke-width="5" fill="none"/></g>'; }).join("") +
      '<ellipse cx="520" cy="310" rx="40" ry="26" fill="#f0a830"/><path d="M500 300 q20 -16 40 0" stroke="#5f9e3f" stroke-width="5" fill="none"/>' +
      '<ellipse cx="620" cy="318" rx="22" ry="12" fill="#6b8e3a"/><ellipse cx="650" cy="322" rx="22" ry="12" fill="#6b8e3a"/>' + palm(720, 260, 0.9) +
      '<g transform="translate(380,270)"><path d="M-30 0 q30 -20 60 0 q-30 14 -60 0z" fill="#7fb7d9"/><path d="M30 0 l14 -10 v20z" fill="#7fb7d9"/></g>' +
      '<text x="400" y="40" text-anchor="middle" font-size="20" font-weight="700" fill="#5b3f22">Corn • Beans • Squash • Fish</text>'); },
    gate: function () { return svg(sky() + ground(C.sand, 270) + '<rect x="250" y="80" width="300" height="200" fill="' + C.coquina + '" stroke="' + C.coquinaDark + '" stroke-width="4"/>' +
      '<path d="M330 280 v-110 q70 -70 140 0 v110z" fill="#bfe6f5"/>' + person(430, 250, "#7b3fa0", "#3f8f3f", "straw", 0.7) + umbrella(440, 190)); },
    bay: function () { return svg(sky() + water(220) + '<rect y="200" width="800" height="26" fill="' + C.sand + '"/>' +
      [150, 230, 310, 390].map(function (x, i) { return person(x, 210, ["#e67e22", "#16a085", "#2980b9", "#d35400"][i], "#7a5a2f", i % 2 ? "cap" : "", 0.75); }).join("") + umbrella(640, 160) +
      '<text x="640" y="120" text-anchor="middle" font-size="30">💨</text>'); },
    note: function () { return svg('<rect width="800" height="360" fill="#e9d8b8"/><g transform="rotate(-4 400 180)"><rect x="220" y="60" width="360" height="240" fill="#fffaf0" stroke="#c8b48f" stroke-width="3"/>' +
      [110, 150, 190, 230].map(function (y) { return '<path d="M250 ' + y + ' q75 -8 150 0 t150 0" stroke="' + C.ink + '" stroke-width="5" fill="none" stroke-linecap="round"/>'; }).join("") + '</g>'); },
    marsh: function () { return svg(sky() + '<rect y="210" width="800" height="150" fill="#8fc7a1"/><path d="M0 260 q200 -20 400 0 t400 0 v30 h-800z" fill="' + C.sea + '" opacity=".8"/>' +
      grassTufts(330) + grassTufts(250) + sign(170, 200, "Fort Mose Historic State Park", 280) + '<g transform="translate(640,150)" fill="#fff"><path d="M0 0 q20 -10 40 0 q-20 -4 -40 0z"/><path d="M60 -30 q14 -8 28 0 q-14 -3 -28 0z"/></g>'); },
    museum: function () { return svg('<rect width="800" height="360" fill="#f3e6cc"/><rect y="290" width="800" height="70" fill="#b98a55"/>' +
      [140, 400, 660].map(function (x, i) { return '<rect x="' + (x - 100) + '" y="70" width="200" height="190" rx="10" fill="#fffaf0" stroke="#8b5e34" stroke-width="5"/>' +
        '<text x="' + x + '" y="110" text-anchor="middle" font-size="20" font-weight="700" fill="#8b5e34">' + ["FREEDOM", "1738", "MILITIA"][i] + '</text>' +
        '<rect x="' + (x - 70) + '" y="130" width="140" height="10" rx="5" fill="#d9c49e"/><rect x="' + (x - 70) + '" y="155" width="110" height="10" rx="5" fill="#d9c49e"/><rect x="' + (x - 70) + '" y="180" width="130" height="10" rx="5" fill="#d9c49e"/>'; }).join("")); },
    volunteer: function () { return svg(sky() + ground(C.grass, 260) + busArt(600, 240) + '<rect x="80" y="230" width="180" height="16" rx="6" fill="' + C.wood + '"/><rect x="95" y="246" width="10" height="30" fill="' + C.wood + '"/><rect x="235" y="246" width="10" height="30" fill="' + C.wood + '"/>' +
      person(360, 270, "#2e86c1", "#7a5a2f", "ranger", 0.9) + '<rect x="330" y="196" width="40" height="26" rx="4" fill="#fffaf0" stroke="#999"/><text x="350" y="214" text-anchor="middle" font-size="10">TICKET</text>'); },
    bus: function () { return svg(sky(true) + '<rect y="250" width="800" height="110" fill="#8a8a8a"/><path d="M0 300 h800" stroke="#fff" stroke-width="6" stroke-dasharray="40 30"/>' + busArt(300, 250) +
      '<g transform="translate(620,240)"><rect x="-70" y="-60" width="140" height="70" rx="10" fill="#e9e3d3" stroke="#777" stroke-width="3"/><rect x="40" y="-46" width="24" height="56" fill="#777"/><circle cx="-40" cy="14" r="14" fill="#333"/><circle cx="40" cy="14" r="14" fill="#333"/><text x="-10" y="-20" text-anchor="middle" font-size="12" font-weight="700">PARK</text></g>'); },
    mission: function () { return svg(sky() + '<path d="M0 360 V250 Q400 150 800 250 V360z" fill="' + C.grass + '"/>' + councilHouse(260, 260, 0.9) + church(560, 250, 0.9) +
      '<g transform="translate(700,232)"><rect x="-30" y="-50" width="60" height="50" fill="' + C.wood + '"/><path d="M-36 -50 h72 l-36 -24z" fill="#7a5530"/></g>'); },
    church: function () { return svg(sky() + ground(C.grass, 270) + church(400, 280, 1.3)); },
    council: function () { return svg(sky() + ground(C.grass, 280) + councilHouse(400, 290, 1.4)); },
    plaza: function () { return svg(sky() + '<ellipse cx="400" cy="300" rx="380" ry="70" fill="#d8b98a"/><rect x="396" y="90" width="8" height="200" fill="' + C.wood + '"/><ellipse cx="400" cy="86" rx="22" ry="10" fill="#7a5530"/>' +
      '<g transform="translate(110,250)">' + [0, 26, 52].map(function (dx) { return '<rect x="' + dx + '" y="-60" width="6" height="60" fill="#5f9e3f"/><ellipse cx="' + (dx + 10) + '" cy="-34" rx="6" ry="14" fill="#f2d24a"/>'; }).join("") + '</g>' +
      '<ellipse cx="680" cy="260" rx="34" ry="22" fill="#f0a830"/>'); },
    friary: function () { return svg(sky() + ground(C.grass, 270) + '<rect x="240" y="150" width="320" height="130" fill="#efe1c2" stroke="#b39463" stroke-width="4"/><path d="M226 152 L400 90 L574 152z" fill="' + C.thatch + '"/>' +
      [280, 360, 440, 520].map(function (x) { return '<rect x="' + (x - 18) + '" y="180" width="36" height="40" fill="#5b3f22" opacity=".7"/>'; }).join("") +
      '<g transform="translate(120,300)">' + [0, 40, 80].map(function (dx) { return '<ellipse cx="' + dx + '" cy="0" rx="16" ry="10" fill="#6b8e3a"/>'; }).join("") + '</g>' +
      '<text x="650" y="230" font-size="40">📜</text>'); },
    scroll: function () { return svg('<rect width="800" height="360" fill="#e9d8b8"/><g transform="translate(400,180)"><rect x="-200" y="-110" width="400" height="220" fill="#f6e7c4" stroke="#b39463" stroke-width="4"/>' +
      '<ellipse cx="-200" cy="0" rx="18" ry="114" fill="#e3cfa0" stroke="#b39463" stroke-width="4"/><ellipse cx="200" cy="0" rx="18" ry="114" fill="#e3cfa0" stroke="#b39463" stroke-width="4"/>' +
      [-60, -25, 10, 45].map(function (y) { return '<path d="M-150 ' + y + ' q75 -6 150 0 t150 0" stroke="#5b3f22" stroke-width="4" fill="none"/>'; }).join("") +
      '<text x="0" y="-80" text-anchor="middle" font-size="22" font-weight="700" fill="#5b3f22">1676</text></g>'); },
    bells: function () { return svg(sky(true) + ground("#a87c4f", 270) + bell(300, 280, 1.2) + bell(520, 285, 0.9) + '<path d="M160 300 h480" stroke="#7a5530" stroke-width="6"/>'); },
    flags: function () { var names = ["Spain", "Britain", "Spain", "U.S."], years = ["1565", "1763", "1784", "1821"], cols = ["#e8b33a", "#c0392b", "#e8b33a", "#2d5fa8"];
      return svg(sky() + ground(C.sand, 280) + names.map(function (n, i) { var x = 130 + i * 180;
        return '<rect x="' + (x - 3) + '" y="80" width="6" height="200" fill="#5b3f22"/><path d="M' + x + ' 84 h110 l-16 34 l16 34 h-110z" fill="' + cols[i] + '" stroke="#5b3f22" stroke-width="2"/>' +
          '<text x="' + (x + 46) + '" y="124" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">' + n + '</text><text x="' + x + '" y="310" text-anchor="middle" font-size="20" font-weight="700" fill="#5b3f22">' + years[i] + '</text>'; }).join("") +
        '<text x="400" y="40" text-anchor="middle" font-size="16" fill="#5b3f22">(Pennants show names only, not real flag designs)</text>'); },
    shop: function () { return svg('<rect width="800" height="360" fill="#f6e1b8"/><rect y="290" width="800" height="70" fill="#b98a55"/><rect x="60" y="110" width="680" height="16" fill="#8b5e34"/><rect x="60" y="210" width="680" height="16" fill="#8b5e34"/>' +
      '<text x="140" y="100" font-size="48">🗺️</text><text x="280" y="100" font-size="48">🍎</text><text x="420" y="100" font-size="48">🔦</text><text x="560" y="100" font-size="48">📷</text><text x="300" y="200" font-size="48">🏴‍☠️</text>' +
      '<text x="400" y="270" text-anchor="middle" font-size="24" font-weight="700" fill="#5b3f22">TRAIL OUTFITTERS</text>'); },
    none: function () { return ""; }
  };
  scenes.default = scenes.castillo;

  function suspectSVG(s, size) { size = size || 140; var c = s.colors;
    var carry = c.carry === "umbrella" ? '<g transform="translate(46,30) scale(.7)">' + '<path d="M-30 0 q30 -40 60 0z" fill="' + C.red + '"/><path d="M0 0 v34" stroke="#333" stroke-width="3"/></g>'
      : '<rect x="24" y="44" width="30" height="36" rx="8" fill="#8b5e34" stroke="#5b3f22" stroke-width="2"/>';
    return '<svg viewBox="-70 -90 140 160" width="' + size + '" height="' + size + '" aria-hidden="true">' + person(0, 30, "#e8d5b5", c.hat, c.hatType, 1) + carry +
      '<g transform="translate(-50,40)"><rect x="-8" y="0" width="16" height="22" rx="3" fill="' + c.ink + '"/><rect x="-5" y="-6" width="10" height="7" fill="#555"/></g></svg>'; }
  function detectiveSVG(hasHat) { return '<svg viewBox="-40 -90 80 140" width="60" height="100" aria-hidden="true">' + person(0, 30, "#e67e22", hasHat ? "#222" : "#6b4b2a", hasHat ? "pirate" : "cap", 1) + '</svg>'; }

  /* ----------- Florida map ----------- */
  var OUTLINE = [[31.0,-87.6],[31.0,-85.0],[30.7,-84.86],[30.6,-82.2],[30.75,-81.95],[30.72,-81.45],[30.3,-81.39],[29.9,-81.29],[29.2,-81.0],[28.6,-80.6],[28.45,-80.53],
    [27.8,-80.38],[27.0,-80.1],[26.7,-80.03],[26.1,-80.1],[25.77,-80.13],[25.4,-80.3],[25.2,-80.42],[25.15,-80.9],[25.13,-81.1],[25.35,-81.15],[25.9,-81.7],[26.45,-81.95],
    [26.7,-82.25],[27.0,-82.42],[27.5,-82.72],[27.95,-82.82],[28.2,-82.76],[28.8,-82.68],[29.15,-83.05],[29.7,-83.45],[30.05,-83.95],[30.1,-84.35],[29.9,-84.6],[29.68,-85.1],
    [29.67,-85.35],[30.0,-85.6],[30.18,-85.82],[30.4,-86.5],[30.36,-87.2],[30.28,-87.55],[30.4,-87.6]];
  function P(lat, lon) { return [Math.round((lon + 87.9) * 87.5 + 30), Math.round((31.25 - lat) * 100 + 70)]; }
  var PX_PER_100MI = 100 * 100 / 69; /* 100 miles in pixels (1 degree latitude ≈ 69 miles) */

  function compass(x, y) { return '<g transform="translate(' + x + ',' + y + ')" class="compass"><circle r="52" fill="#fffaf0" stroke="#8b5e34" stroke-width="3"/>' +
      '<path d="M0 -46 L9 -9 L0 0 L-9 -9Z" fill="#c0392b"/><path d="M0 46 L9 9 L0 0 L-9 9Z" fill="#5b3f22"/><path d="M46 0 L9 9 L0 0 L9 -9Z" fill="#5b3f22"/><path d="M-46 0 L-9 9 L0 0 L-9 -9Z" fill="#5b3f22"/>' +
      '<g fill="#8b5e34"><path d="M30 -30 l-14 4 l4 -14z"/><path d="M-30 -30 l14 4 l-4 -14z"/><path d="M30 30 l-14 -4 l4 14z"/><path d="M-30 30 l14 -4 l-4 14z"/></g>' +
      '<g font-size="16" font-weight="800" text-anchor="middle" fill="#3b2a1a"><text y="-58">N</text><text y="72">S</text><text x="66" y="6">E</text><text x="-66" y="6">W</text></g>' +
      '<g font-size="11" font-weight="700" text-anchor="middle" fill="#8b5e34"><text x="42" y="-38">NE</text><text x="-42" y="-38">NW</text><text x="42" y="48">SE</text><text x="-42" y="48">SW</text></g></g>'; }
  function symbol(type, x, y, big) { var r = big ? 15 : 11;
    if (type === "capital") { var pts = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push((x + rr * Math.cos(a)).toFixed(1) + "," + (y + rr * Math.sin(a)).toFixed(1)); }
      return '<polygon points="' + pts.join(" ") + '" fill="#c0392b" stroke="#fff" stroke-width="2"/>'; }
    if (type === "fort") return '<rect x="' + (x - r * 0.8) + '" y="' + (y - r * 0.8) + '" width="' + (r * 1.6) + '" height="' + (r * 1.6) + '" fill="#8b5e34" stroke="#fff" stroke-width="2"/>';
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.7) + '" fill="#2d5fa8" stroke="#fff" stroke-width="2"/>'; }

  function floridaMap(opts) { opts = opts || {};
    var pts = OUTLINE.map(function (p) { return P(p[0], p[1]).join(","); }).join(" ");
    var s = '<svg class="map-svg" viewBox="0 0 900 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of Florida">' +
      '<rect width="900" height="720" fill="#9fd3ea"/><path d="M0 0 H900 V45 H0Z" fill="#9fd3ea"/>' +
      '<polygon points="0,0 900,0 900,70 690,70 ' + P(31.0, -85.0).join(",") + ' ' + P(31.0, -87.6).join(",") + ' 0,70" fill="#d7e8b5"/>' +
      '<text x="450" y="40" text-anchor="middle" font-size="30" font-weight="800" fill="#3b2a1a">Map of Florida</text>' +
      '<text x="210" y="100" text-anchor="middle" font-size="15" fill="#5c6b3a">ALABAMA</text><text x="560" y="96" text-anchor="middle" font-size="15" fill="#5c6b3a">GEORGIA</text>' +
      '<polygon points="' + pts + '" fill="#f7e3b0" stroke="#8b5e34" stroke-width="3" stroke-linejoin="round"/>' +
      (function () { var c = P(26.95, -80.83); return '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="22" ry="18" fill="#7fc0de" stroke="#5a9dbd"/>'; })() +
      '<g fill="#f7e3b0" stroke="#8b5e34" stroke-width="2">' + [[24.95,-80.6],[24.75,-81.0],[24.66,-81.4],[24.56,-81.78]].map(function (k) { var c = P(k[0], k[1]); return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="4"/>'; }).join("") + '</g>' +
      '<text x="' + (P(27.6, -79.4)[0]) + '" y="' + (P(27.6, -79.4)[1]) + '" text-anchor="middle" font-size="18" font-style="italic" fill="#2f6f8f" transform="rotate(70 ' + P(27.6, -79.4).join(" ") + ')">Atlantic Ocean</text>';
    /* markers */
    Object.keys(LOCATIONS).forEach(function (id) { var L = LOCATIONS[id], c = P(L.lat, L.lon), mx = c[0], my = c[1];
      if (L.offset) { mx += L.offset[0]; my += L.offset[1]; s += '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + mx + '" y2="' + my + '" stroke="#8b5e34" stroke-width="2" stroke-dasharray="4 3"/>'; }
      var cls = "marker" + (opts.current === id ? " current" : "") + (opts.clickable ? " clickable" : "") + (opts.visited && opts.visited.indexOf(id) >= 0 ? " visited" : "");
      var showSym = !(opts.hideCapital && L.symbol === "capital");
      var lab = L.label, lx = mx + 18, anchor = "start";
      if (id === "staug" || id === "jax") { lx = mx - 18; anchor = "end"; }
      if (id === "miami") { lx = mx - 16; anchor = "end"; }
      s += '<g class="' + cls + '" data-loc="' + id + '" tabindex="' + (opts.clickable ? 0 : -1) + '" role="' + (opts.clickable ? "button" : "img") + '" aria-label="' + lab + '">' +
        '<circle cx="' + mx + '" cy="' + my + '" r="30" fill="transparent"/>' + (showSym ? symbol(L.symbol, mx, my, true) : '<circle cx="' + mx + '" cy="' + my + '" r="8" fill="#999"/>') +
        (opts.current === id ? '<circle cx="' + mx + '" cy="' + my + '" r="22" fill="none" stroke="#e67e22" stroke-width="4" class="pulse"/>' : "") +
        (id === "sanluis" ? '<text x="' + mx + '" y="' + (my + 34) + '" text-anchor="middle" font-size="21" font-weight="700" fill="#3b2a1a" paint-order="stroke" stroke="#fffaf0" stroke-width="4">Tallahassee<tspan x="' + mx + '" dy="20" font-size="16">(Mission San Luis)</tspan></text></g>' :
        '<text x="' + lx + '" y="' + (my + 6) + '" text-anchor="' + anchor + '" font-size="21" font-weight="700" fill="#3b2a1a" paint-order="stroke" stroke="#fffaf0" stroke-width="4">' + lab + '</text></g>'); });
    s += compass(815, 270);
    /* scale bar */
    var sx = 60, sy = 462, w = PX_PER_100MI;
    s += '<g class="scalebar"><rect x="' + (sx - 12) + '" y="' + (sy - 38) + '" width="' + (2 * w + 50) + '" height="64" rx="8" fill="#fffaf0" stroke="#8b5e34" stroke-width="2"/>' +
      '<rect x="' + sx + '" y="' + sy + '" width="' + w + '" height="10" fill="#3b2a1a"/><rect x="' + (sx + w) + '" y="' + sy + '" width="' + w + '" height="10" fill="#fffaf0" stroke="#3b2a1a" stroke-width="2"/>' +
      '<g font-size="14" font-weight="700" fill="#3b2a1a" text-anchor="middle"><text x="' + sx + '" y="' + (sy - 8) + '">0</text><text x="' + (sx + w) + '" y="' + (sy - 8) + '">100</text><text x="' + (sx + 2 * w) + '" y="' + (sy - 8) + '">200 miles</text></g>' +
      '<text x="' + (sx + w) + '" y="' + (sy + 24) + '" font-size="12" text-anchor="middle" fill="#3b2a1a">SCALE</text></g>';
    /* legend */
    s += '<g class="legend" transform="translate(30,498) scale(1.2)"><rect width="250" height="170" rx="10" fill="#fffaf0" stroke="#8b5e34" stroke-width="2"/><text x="125" y="28" text-anchor="middle" font-size="18" font-weight="800" fill="#3b2a1a">LEGEND</text>' +
      '<g class="legend-capital">' + symbol("capital", 30, 56, true) + '<text x="54" y="62" font-size="16" fill="#3b2a1a">State capital</text></g>' + symbol("fort", 30, 92, true) + '<text x="54" y="98" font-size="16" fill="#3b2a1a">Historic fort</text>' +
      symbol("city", 30, 126, true) + '<text x="54" y="132" font-size="16" fill="#3b2a1a">City</text><ellipse cx="30" cy="156" rx="12" ry="8" fill="#7fc0de" stroke="#5a9dbd"/><text x="54" y="162" font-size="16" fill="#3b2a1a">Lake / water</text></g>';
    if (opts.route) { var a = P(LOCATIONS[opts.route[0]].lat, LOCATIONS[opts.route[0]].lon), b = P(LOCATIONS[opts.route[1]].lat, LOCATIONS[opts.route[1]].lon);
      s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#e67e22" stroke-width="4" stroke-dasharray="10 8"/>'; }
    return s + '</svg>'; }

  function insetMap() { /* St. Augustine close-up, not exactly to scale */
    return '<svg class="map-svg inset" viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Close-up map of the St. Augustine area">' +
      '<rect width="800" height="520" fill="#f7e3b0"/><path d="M470 0 C440 120 470 260 450 520 L560 520 C590 300 560 120 580 0Z" fill="#9fd3ea"/>' +
      '<path d="M580 0 C600 140 600 320 620 520 L800 520 L800 0Z" fill="#9fd3ea"/><path d="M560 60 C590 200 585 360 610 500 L640 500 C620 340 625 180 600 60Z" fill="#f2d7a0" stroke="#8b5e34" stroke-width="2"/>' +
      '<path d="M200 70 q80 -10 150 30 q40 30 120 10" stroke="#7fc0de" stroke-width="18" fill="none"/>' +
      '<text x="400" y="34" text-anchor="middle" font-size="24" font-weight="800" fill="#3b2a1a">St. Augustine Area (close-up)</text>' +
      '<g class="inset-spot" data-spot="north" tabindex="0" role="button" aria-label="North spot"><circle cx="420" cy="120" r="34" fill="transparent"/>' + symbol("fort", 420, 120, true) + '<text x="400" y="164" text-anchor="end" font-size="18" font-weight="700" fill="#3b2a1a">Old fort ruins</text></g>' +
      '<g class="inset-here"><g>' + symbol("fort", 430, 290, true) + '</g><text x="410" y="296" text-anchor="end" font-size="18" font-weight="800" fill="#3b2a1a">Castillo (you are here)</text></g>' +
      '<g class="inset-spot" data-spot="east" tabindex="0" role="button" aria-label="East spot"><circle cx="604" cy="300" r="34" fill="transparent"/><circle cx="604" cy="300" r="12" fill="#2d5fa8" stroke="#fff" stroke-width="2"/><text x="604" y="250" text-anchor="middle" font-size="16" font-weight="700" fill="#3b2a1a" paint-order="stroke" stroke="#f2d7a0" stroke-width="4">Anastasia Island</text></g>' +
      '<g class="inset-spot" data-spot="south" tabindex="0" role="button" aria-label="South spot"><circle cx="560" cy="480" r="34" fill="transparent"/><path d="M540 456 l20 34 l20 -34z" fill="#2d5fa8"/><text x="530" y="480" text-anchor="end" font-size="16" font-weight="700" fill="#3b2a1a">Road south (off the map)</text></g>' +
      '<g class="inset-spot" data-spot="west" tabindex="0" role="button" aria-label="West spot"><circle cx="110" cy="300" r="34" fill="transparent"/><circle cx="110" cy="300" r="12" fill="#2d5fa8" stroke="#fff" stroke-width="2"/><text x="110" y="344" text-anchor="middle" font-size="16" font-weight="700" fill="#3b2a1a">Inland woods</text></g>' +
      compass(110, 120).replace('translate(110,120)', 'translate(110,120) scale(.9)') +
      '<g transform="translate(160,470)"><rect x="-10" y="-30" width="210" height="52" rx="6" fill="#fffaf0" stroke="#8b5e34"/><rect x="0" y="0" width="180" height="8" fill="#3b2a1a"/><text x="0" y="-10" font-size="13" font-weight="700">0</text><text x="90" y="-10" font-size="13" font-weight="700" text-anchor="middle">1</text><text x="180" y="-10" font-size="13" font-weight="700" text-anchor="end">2 miles</text><text x="90" y="20" font-size="11" text-anchor="middle">(about)</text></g>' +
      '</svg>'; }

  return { scene: function (k) { return (scenes[k] || scenes.default)(); }, suspect: suspectSVG, detective: detectiveSVG, floridaMap: floridaMap, insetMap: insetMap, P: P, PX_PER_100MI: PX_PER_100MI };
})();
