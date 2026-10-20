/* Florida Trailblazers v2 — maps and small UI icons.
   Maps sit on real imagery: NASA Blue Marble (Florida map) and USGS aerial photos (St. Augustine close-up), both public domain.
   The Florida outline is the US Census Bureau boundary (js/geo.js). Markers use real latitude/longitude. */
var ART = (function () {
  "use strict";
  /* Florida map projection (simple equirectangular). The NASA image was requested for exactly this box:
     lat 24.75..31.95 N, lon 88.2429..77.9571 W  ->  viewBox 0 0 900 720. */
  function P(lat, lon) { return [Math.round((lon + 87.9) * 87.5 + 30), Math.round((31.25 - lat) * 100 + 70)]; }
  var PX_PER_100MI = 100 * 100 / 69; /* 100 miles in pixels (1 degree of latitude ≈ 69 miles) */
  /* St. Augustine close-up projection. USGS image box: lon 81.365..81.265 W, lat 29.865..29.945 N -> 900 x 830. */
  function Q(lat, lon) { return [Math.round((lon + 81.365) / 0.1 * 900), Math.round((29.945 - lat) / 0.08 * 830)]; }
  var PX_PER_MI_INSET = 150; /* 1 mile = 1/(69.17*cos 29.9°) degrees of longitude = 0.01667° -> 150 px */

  function compass(x, y, s) { return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" class="compass" aria-hidden="true"><circle r="54" fill="rgba(255,255,255,.88)" stroke="#1d3557" stroke-width="2"/>' +
      '<path d="M0 -46 L9 -9 L0 0 L-9 -9Z" fill="#d62828"/><path d="M0 46 L9 9 L0 0 L-9 9Z" fill="#1d3557"/><path d="M46 0 L9 9 L0 0 L9 -9Z" fill="#1d3557"/><path d="M-46 0 L-9 9 L0 0 L-9 -9Z" fill="#1d3557"/>' +
      '<g fill="#457b9d"><path d="M30 -30 l-14 4 l4 -14z"/><path d="M-30 -30 l14 4 l-4 -14z"/><path d="M30 30 l-14 -4 l4 14z"/><path d="M-30 30 l14 -4 l-4 14z"/></g>' +
      '<g font-size="17" font-weight="800" text-anchor="middle" fill="#1d3557" paint-order="stroke" stroke="#fff" stroke-width="4"><text y="-60">N</text><text y="75">S</text><text x="68" y="6">E</text><text x="-68" y="6">W</text></g>' +
      '<g font-size="11" font-weight="700" text-anchor="middle" fill="#457b9d"><text x="42" y="-38">NE</text><text x="-42" y="-38">NW</text><text x="42" y="48">SE</text><text x="-42" y="48">SW</text></g></g>'; }
  function symbol(type, x, y, big) { var r = big ? 15 : 11;
    if (type === "capital") { var pts = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push((x + rr * Math.cos(a)).toFixed(1) + "," + (y + rr * Math.sin(a)).toFixed(1)); }
      return '<polygon points="' + pts.join(" ") + '" fill="#d62828" stroke="#fff" stroke-width="2.5"/>'; }
    if (type === "fort") return '<rect x="' + (x - r * 0.8) + '" y="' + (y - r * 0.8) + '" width="' + (r * 1.6) + '" height="' + (r * 1.6) + '" fill="#8d5a2b" stroke="#fff" stroke-width="2.5"/>';
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.7) + '" fill="#1d6fd6" stroke="#fff" stroke-width="2.5"/>'; }
  function label(x, y, txt, anchor, size, cls) { return '<text class="' + (cls || "map-label") + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") + '" font-size="' + (size || 21) + '">' + txt + '</text>'; }
  function locPt(id) { var L = LOCATIONS[id], c = P(L.lat, L.lon); return L.offset ? [c[0] + L.offset[0], c[1] + L.offset[1]] : c; }

  /* opts: current, clickable, visited [ids], trail [ids in travel order], route [from,to], animate (last leg) */
  function floridaMap(opts) { opts = opts || {}; var uid = "m" + Math.floor(Math.random() * 1e6);
    var s = '<svg class="map-svg" viewBox="0 0 900 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of Florida">' +
      '<defs><mask id="' + uid + '"><rect width="900" height="720" fill="#fff"/><path d="' + FL_PATH + '" fill="#000"/></mask></defs>' +
      '<image href="assets/img/' + IMAGES.map_fl.file + '" x="0" y="0" width="900" height="720" preserveAspectRatio="none"/>' +
      '<rect width="900" height="720" fill="rgba(10,25,45,.42)" mask="url(#' + uid + ')"/>' +
      '<path d="' + FL_PATH + '" fill="rgba(255,255,255,.08)" stroke="#fffbe6" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<rect x="0" y="0" width="900" height="56" fill="rgba(10,25,45,.55)"/>' + label(450, 38, "Map of Florida", "middle", 28, "map-title") +
      label(210, 102, "ALABAMA", "middle", 15, "map-region") + label(560, 98, "GEORGIA", "middle", 15, "map-region") +
      (function () { var c = P(27.6, -79.4); return '<text class="map-water" x="' + c[0] + '" y="' + c[1] + '" text-anchor="middle" font-size="19" transform="rotate(70 ' + c.join(" ") + ')">Atlantic Ocean</text>'; })();
    /* the trail fills in as you travel */
    var trail = opts.trail || [];
    for (var i = 1; i < trail.length; i++) { var a = locPt(trail[i - 1]), b = locPt(trail[i]), last = i === trail.length - 1 && opts.animate;
      s += '<line class="trail' + (last ? " draw" : "") + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; }
    if (opts.route) { var r0 = locPt(opts.route[0]), r1 = locPt(opts.route[1]);
      s += '<line class="route" x1="' + r0[0] + '" y1="' + r0[1] + '" x2="' + r1[0] + '" y2="' + r1[1] + '"/>'; }
    Object.keys(LOCATIONS).forEach(function (id) { var L = LOCATIONS[id], c = P(L.lat, L.lon), m = locPt(id), mx = m[0], my = m[1];
      if (L.offset) s += '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + mx + '" y2="' + my + '" stroke="#fffbe6" stroke-width="2" stroke-dasharray="4 3"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="3" fill="#fffbe6"/>';
      var vis = opts.visited && opts.visited.indexOf(id) >= 0;
      var cls = "marker" + (opts.current === id ? " current" : "") + (opts.clickable ? " clickable" : "") + (vis ? " visited" : "");
      var lx = mx + 18, anchor = "start";
      if (id === "staug" || id === "jax" || id === "miami") { lx = mx - 18; anchor = "end"; }
      s += '<g class="' + cls + '" data-loc="' + id + '" tabindex="' + (opts.clickable ? 0 : -1) + '" role="' + (opts.clickable ? "button" : "img") + '" aria-label="' + L.label + (vis ? " (visited)" : "") + '">' +
        '<circle cx="' + mx + '" cy="' + my + '" r="30" fill="transparent"/>' + symbol(L.symbol, mx, my, true) +
        (vis ? '<circle cx="' + (mx + 13) + '" cy="' + (my - 13) + '" r="9" fill="#2a9d8f" stroke="#fff" stroke-width="2"/><path d="M' + (mx + 9) + ' ' + (my - 13) + ' l3 3 l6 -6" stroke="#fff" stroke-width="2.5" fill="none"/>' : "") +
        (opts.current === id ? '<circle cx="' + mx + '" cy="' + my + '" r="22" fill="none" stroke="#ffb703" stroke-width="4" class="pulse"/>' : "") +
        (id === "sanluis" ? '<text class="map-label" x="' + mx + '" y="' + (my + 36) + '" text-anchor="middle" font-size="21">Tallahassee<tspan x="' + mx + '" dy="20" font-size="16">(Mission San Luis)</tspan></text>' : label(lx, my + 7, L.label, anchor)) + '</g>'; });
    /* v3: Penny's escape marker (only on non-clickable maps, so it never gives away a map answer) */
    if (opts.villain && !opts.clickable && LOCATIONS[opts.villain]) { var vp = locPt(opts.villain), cur = locPt(opts.current || "staug");
      s += '<g class="villain-mark" aria-label="Penny Pinch escaped toward ' + LOCATIONS[opts.villain].name + '"><line x1="' + cur[0] + '" y1="' + cur[1] + '" x2="' + vp[0] + '" y2="' + vp[1] + '" stroke="#d62828" stroke-width="4" stroke-dasharray="3 9" stroke-linecap="round"/>' +
        '<circle cx="' + vp[0] + '" cy="' + (vp[1] - 44) + '" r="20" fill="#7b3fa0" stroke="#fff" stroke-width="3"/><text x="' + vp[0] + '" y="' + (vp[1] - 37) + '" font-size="20" text-anchor="middle">☂️</text>' +
        '<text class="map-label" x="' + vp[0] + '" y="' + (vp[1] - 72) + '" text-anchor="middle" font-size="17" fill="#ffd6e0">Penny escaped here!</text></g>'; }
    s += compass(815, 300);
    var sx = 60, sy = 462, w = PX_PER_100MI;
    s += '<g class="scalebar" aria-hidden="true"><rect x="' + (sx - 14) + '" y="' + (sy - 40) + '" width="' + (2 * w + 56) + '" height="68" rx="10" fill="rgba(255,255,255,.9)"/>' +
      '<rect x="' + sx + '" y="' + sy + '" width="' + w + '" height="10" fill="#1d3557"/><rect x="' + (sx + w) + '" y="' + sy + '" width="' + w + '" height="10" fill="#fff" stroke="#1d3557" stroke-width="2"/>' +
      '<g font-size="14" font-weight="700" fill="#1d3557" text-anchor="middle"><text x="' + sx + '" y="' + (sy - 9) + '">0</text><text x="' + (sx + w) + '" y="' + (sy - 9) + '">100</text><text x="' + (sx + 2 * w) + '" y="' + (sy - 9) + '">200 miles</text></g>' +
      '<text x="' + (sx + w) + '" y="' + (sy + 25) + '" font-size="12" text-anchor="middle" fill="#1d3557">SCALE</text></g>';
    s += '<g class="legend" transform="translate(30,500) scale(1.2)"><rect width="250" height="170" rx="12" fill="rgba(255,255,255,.92)"/><text x="125" y="28" text-anchor="middle" font-size="18" font-weight="800" fill="#1d3557">LEGEND</text>' +
      '<g class="legend-capital">' + symbol("capital", 30, 56, true) + '<text x="54" y="62" font-size="16" fill="#1d3557">State capital</text></g>' + symbol("fort", 30, 92, true) + '<text x="54" y="98" font-size="16" fill="#1d3557">Historic fort</text>' +
      symbol("city", 30, 126, true) + '<text x="54" y="132" font-size="16" fill="#1d3557">City</text><line x1="18" y1="156" x2="44" y2="156" stroke="#ffb703" stroke-width="5" stroke-linecap="round"/><text x="54" y="162" font-size="16" fill="#1d3557">Your trail</text></g>';
    s += '<text class="map-credit" x="892" y="712" text-anchor="end" font-size="12">Image: NASA Blue Marble • Outline: U.S. Census Bureau</text>';
    return s + '</svg>'; }

  /* St. Augustine close-up on a real USGS aerial photo */
  var INSET = {
    here:  { lat: 29.8979, lon: -81.3115, label: "Castillo (you are here)" },
    north: { lat: 29.9272, lon: -81.3247, label: "Old fort site" },
    east:  { lat: 29.8979, lon: -81.2840, label: "Anastasia Island" },
    south: { lat: 29.8740, lon: -81.3150, label: "South of town" },
    west:  { lat: 29.8979, lon: -81.3450, label: "Inland woods" }
  };
  function insetMap() {
    var s = '<svg class="map-svg inset" viewBox="0 0 900 830" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Aerial photo map of the St. Augustine area">' +
      '<image href="assets/img/' + IMAGES.map_sa.file + '" x="0" y="0" width="900" height="830" preserveAspectRatio="none"/><rect width="900" height="830" fill="rgba(0,0,0,.12)"/>' +
      '<rect x="0" y="0" width="900" height="54" fill="rgba(10,25,45,.6)"/>' + label(450, 37, "St. Augustine Area (aerial photo)", "middle", 26, "map-title");
    var w = Q(29.893, -81.300), o = Q(29.925, -81.262), an = Q(29.887, -81.279);
    s += '<text class="map-water" x="' + w[0] + '" y="' + w[1] + '" text-anchor="middle" font-size="17" transform="rotate(-70 ' + w.join(" ") + ')">Matanzas Bay</text>' +
      '<text class="map-water" x="' + (o[0] - 40) + '" y="' + o[1] + '" text-anchor="middle" font-size="19">Atlantic</text><text class="map-water" x="' + (o[0] - 40) + '" y="' + (o[1] + 22) + '" text-anchor="middle" font-size="19">Ocean</text>';
    ["north", "east", "south", "west"].forEach(function (k) { var p = INSET[k], c = Q(p.lat, p.lon);
      s += '<g class="inset-spot" data-spot="' + k + '" tabindex="0" role="button" aria-label="' + p.label + '"><circle cx="' + c[0] + '" cy="' + c[1] + '" r="36" fill="transparent"/>' +
        '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="16" fill="#1d6fd6" stroke="#fff" stroke-width="3"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="5" fill="#fff"/>' +
        (k === "south" ? label(c[0] + 26, c[1] + 8, p.label, "start", 20) : label(c[0], c[1] + (k === "west" ? 44 : -26), p.label, "middle", 20)) + '</g>'; });
    var h = Q(INSET.here.lat, INSET.here.lon);
    s += '<g class="inset-here">' + symbol("fort", h[0], h[1], true) + '<circle cx="' + h[0] + '" cy="' + h[1] + '" r="22" fill="none" stroke="#ffb703" stroke-width="4" class="pulse"/>' + label(h[0], h[1] + 50, "Castillo (you are here)", "middle", 20) + '</g>';
    s += compass(80, 140, 0.9);
    var bx = 40, by = 770, mi = PX_PER_MI_INSET;
    s += '<g aria-hidden="true"><rect x="' + (bx - 14) + '" y="' + (by - 40) + '" width="' + (2 * mi + 60) + '" height="64" rx="10" fill="rgba(255,255,255,.92)"/>' +
      '<rect x="' + bx + '" y="' + by + '" width="' + mi + '" height="10" fill="#1d3557"/><rect x="' + (bx + mi) + '" y="' + by + '" width="' + mi + '" height="10" fill="#fff" stroke="#1d3557" stroke-width="2"/>' +
      '<g font-size="15" font-weight="700" fill="#1d3557" text-anchor="middle"><text x="' + bx + '" y="' + (by - 10) + '">0</text><text x="' + (bx + mi) + '" y="' + (by - 10) + '">1</text><text x="' + (bx + 2 * mi) + '" y="' + (by - 10) + '">2 miles</text></g></g>';
    s += '<text class="map-credit" x="892" y="822" text-anchor="end" font-size="12">Aerial photo: U.S. Geological Survey, The National Map</text>';
    return s + '</svg>'; }

  /* Fictional suspects are shown as simple "case file" silhouettes (no real people). */
  function suspect(s, size) { size = size || 110; var c = s.colors;
    var hat = c.hatType === "straw" ? '<path d="M-34 -52 h68 l-10 -6 h-48z" fill="' + c.hat + '"/><path d="M-22 -58 q22 -26 44 0z" fill="' + c.hat + '"/>' :
      '<path d="M-24 -56 q24 -26 48 0z" fill="' + c.hat + '"/><path d="M14 -58 h26 v6 h-26z" fill="' + c.hat + '"/>';
    var carry = c.carry === "umbrella" ? '<g transform="translate(40,4)"><path d="M-22 0 q22 -30 44 0z" fill="#e63946"/><path d="M0 0 v30 q0 5 -5 5" stroke="#333" stroke-width="3" fill="none"/></g>'
      : '<rect x="26" y="8" width="22" height="30" rx="6" fill="#8d5a2b"/>';
    return '<svg class="sus-svg" viewBox="-60 -90 120 140" width="' + size + '" height="' + size + '" aria-hidden="true"><circle cx="0" cy="-40" r="20" fill="#4a5568"/>' +
      '<path d="M-34 48 q0 -60 34 -60 q34 0 34 60z" fill="#4a5568"/>' + hat + carry +
      '<g transform="translate(-44,16)"><rect x="-7" y="0" width="14" height="20" rx="3" fill="' + c.ink + '"/><rect x="-4" y="-6" width="8" height="7" fill="#777"/></g></svg>'; }

  return { P: P, Q: Q, PX_PER_100MI: PX_PER_100MI, PX_PER_MI_INSET: PX_PER_MI_INSET, INSET: INSET, floridaMap: floridaMap, insetMap: insetMap, suspect: suspect, symbol: symbol };
})();
