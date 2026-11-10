/* Local Flavor: offline field postcards. No network, student uploads or external services. */
var LocalFlavor = (function () {
  "use strict";
  function X() { return window.FTBX; }
  function state() { return X().S(); }
  function esc(t) { return X().esc(t); }
  function ensure() {
    var s = state();
    if (!s.localFlavor) s.localFlavor = { solved: {}, bonus: 0, clues: {} };
    return s.localFlavor;
  }
  var arrivals = { sa1: "staug", fm1: "mose", tl1: "sanluis", sl1: "sanluis" };
  var words = {
    tradition: ["tradition", "A way of doing something that people pass from one generation to the next."],
    boardwalk: ["boardwalk", "A path made of wooden boards. It lets people walk above wet or sandy ground."],
    river: ["river", "A large stream of water that flows across the land toward another river, a lake, or the sea."],
    habitat: ["habitat", "The place where a plant or animal lives and finds what it needs."],
    lighthouse: ["lighthouse", "A tall tower with a bright light that helps guide ships near the coast."],
    barrier: ["barrier island", "A long, narrow island near the coast. It helps protect the mainland from ocean waves."],
    harbor: ["harbor", "A sheltered area of water where boats can stop safely."],
    culture: ["culture", "The foods, art, languages, and ways of life shared by a group of people."],
    industry: ["industry", "Work that makes goods or provides services. Factories are part of many industries."],
    transportation: ["transportation", "The ways people and goods move from one place to another."],
    architecture: ["architecture", "The way buildings are designed and made."],
    community: ["community", "People who live in a place or share activities and help one another."],
    mangrove: ["mangrove", "A tree that grows along warm, salty coasts. Its roots give small animals places to hide."]
  };
  Object.keys(words).forEach(function (id) {
    VOCAB[id] = { word: words[id][0], match: [words[id][0]], def: words[id][1] };
  });
  Object.keys(LOCAL_FLAVOR).forEach(function (loc) {
    LOCAL_FLAVOR[loc].forEach(function (p) { if (!VOCAB[p.vocab].photo) VOCAB[p.vocab].photo = p.thumb; });
  });

  /* Only real chase destinations enter the case notebook. Decoy cities remain enrichment stops.
     Pool membership is per scene, not per wrong-answer attempt, so revisiting never rerolls an easier clue. */
  var pools = {
    mapToMose: [
      "The suspect asked for the marsh park just north of the Castillo, where a free Black community once stood guard.",
      "A witness heard: ‘I need the boardwalk at the site of the free Black settlement founded in 1738, north of St. Augustine.’",
      "The suspect wanted to see the salt marsh where families built a free community under Spanish rule in 1738. Look north of the Castillo."
    ],
    mapToSanLuis: [
      "The suspect sketched a huge round council house with a thatched roof. Then she asked for a westbound bus to Florida’s capital.",
      "A witness heard: ‘First the old and new capitol buildings, then the rebuilt Apalachee council house.’ The ticket was westbound.",
      "The suspect wanted to see a rebuilt Spanish mission where Apalachee leaders met. Her notes paired that round building with Florida’s state capital."
    ]
  };
  Object.keys(pools).forEach(function (id) {
    SCENES[id].flavorClues = pools[id].map(function (text, i) {
      var cid = "flavor_" + id + "_" + i;
      CLUES[cid] = { kind: "place", text: "Local Flavor witness: “" + text + "”", target: SCENES[id].target, level: SCENES[id].chapter };
      return cid;
    });
  });
  function clueFor(sc) {
    if (!sc.flavorClues) return null;
    var lf = ensure(), id = state().scene;
    if (!lf.clues[id]) lf.clues[id] = sc.flavorClues[X().hash(state().runId + id) % sc.flavorClues.length];
    return lf.clues[id];
  }
  function credit(p) {
    return '<details class="lf-credit no-vocab"><summary>ⓘ Photo: ' + esc(p.author) + ' · ' + esc(p.license) + '</summary><p>“' + esc(p.title) + '”<br>' + esc(p.changes) + '<br><a href="' + esc(p.sourceUrl) + '" target="_blank" rel="noopener">Original + author</a>' +
      (p.licenseUrl ? ' · <a href="' + esc(p.licenseUrl) + '" target="_blank" rel="noopener">' + esc(p.license) + '</a>' : ' · Public domain') + '. CC BY-SA photos and their resized copies keep the listed license.</p></details>';
  }
  function photo(p) {
    var v = VOCAB[p.vocab];
    return '<article class="lf-postcard"><div class="lf-tape" aria-hidden="true"></div><img src="' + esc(p.file) + '" alt="' + esc(p.caption) + ' — ' + esc(p.title) + '" loading="lazy" width="800" height="500"><div class="lf-photo-text"><h3>' + esc(p.caption) + '</h3><p>' + esc(p.fact) + '</p><div class="lf-word">Word to collect: <button type="button" class="vocab" data-v="' + p.vocab + '" aria-haspopup="dialog" aria-expanded="false">' + esc(v.word) + '</button></div>' + credit(p) + '</div></article>';
  }
  function spot(loc) {
    var solved = !!ensure().solved[loc], p = LOCAL_FLAVOR[loc][0], ids = Object.keys(LOCAL_FLAVOR), other = ids[(ids.indexOf(loc) + 3) % ids.length], wrong = LOCAL_FLAVOR[other][0];
    var options = [p, wrong];
    if (X().hash(loc + state().runId) % 2) options.reverse();
    return '<section class="lf-spot" data-loc="' + loc + '" aria-label="Spot it photo challenge"><h3>🔎 Spot it!</h3><p>Which postcard belongs in <b>' + esc(LOCATIONS[loc].name) + '</b>? Use the photos above. Earn <b>+2 exploration points</b> once per stop.</p><div class="lf-spot-options">' + options.map(function (o) {
      return '<button type="button" class="lf-spot-choice" data-good="' + (o.id === p.id) + '"' + (solved || state().v3.scored ? ' disabled' : '') + '><img src="' + esc(o.thumb) + '" alt="' + esc(o.caption) + '"><span>' + esc(o.caption) + '</span></button>';
    }).join('') + '</div><p class="lf-spot-feedback" role="status">' + (solved ? '✓ You collected these 2 points! Explore more places in the album.' : state().v3.scored ? 'Case complete — start a new case to earn points.' : 'No rush. Look closely, then tap a photo.') + '</p></section>';
  }
  function panel(loc, quiz) {
    if (!LOCAL_FLAVOR[loc]) return '';
    return '<section class="local-flavor no-vocab" data-loc="' + loc + '" aria-label="Local Flavor: ' + esc(LOCATIONS[loc].name) + '"><div class="lf-header"><div><div class="lf-eyebrow">FIELD POSTCARDS · ' + String(Object.keys(LOCAL_FLAVOR).indexOf(loc) + 1).padStart(2, '0') + ' / 07</div><h2>📷 Local Flavor</h2><p>' + esc(LOCATIONS[loc].name) + ' <span>• Look. Learn. Follow the clues.</span></p></div><span class="lf-stamp" aria-hidden="true">FLORIDA<br>FIELD FILE</span></div><p class="lf-instruction">Real places, past and present. Swipe the postcards. Tap a dotted word to collect its meaning.</p><div class="lf-gallery" tabindex="0" aria-label="Photo postcards; swipe or use arrow keys">' + LOCAL_FLAVOR[loc].map(photo).join('') + '</div>' +
      (quiz ? spot(loc) : '') + '<div class="lf-footer"><button type="button" class="btn sm ghost lf-all">🗺️ All 7 place albums</button><button type="button" class="btn sm ghost lf-credits">Photo credits</button></div></section>';
  }
  function wire(root) {
    if (!root) return;
    if (root.id === "modal") focusModalHeading();
    root.querySelectorAll('.lf-spot-choice').forEach(function (b) {
      b.onclick = function () {
        var area = b.closest('.lf-spot'), loc = area.getAttribute('data-loc'), lf = ensure(), msg = area.querySelector('.lf-spot-feedback');
        if (lf.solved[loc] || state().v3.scored) return;
        if (b.getAttribute('data-good') !== 'true') { msg.textContent = 'Try again! Compare this photo with the postcards above.'; b.disabled = true; return; }
        lf.solved[loc] = true; lf.bonus += 2; X().save();
        area.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
        msg.textContent = '✓ Great detective work! +2 exploration points. Total: ' + lf.bonus + '.';
        window.SFX && SFX.play('correct');
      };
    });
    root.querySelectorAll('.lf-all').forEach(function (b) { b.onclick = function () { album(); }; });
    root.querySelectorAll('.lf-credits').forEach(function (b) { b.onclick = function () { photoCredits(); }; });
  }
  function focusModalHeading() {
    var h = document.getElementById("modal-title"), box = h.closest(".modal");
    h.tabIndex = -1; h.focus({ preventScroll: true }); box.scrollTop = 0;
  }
  function album(loc) {
    loc = LOCAL_FLAVOR[loc] ? loc : (LOCAL_FLAVOR[state().loc] ? state().loc : 'staug');
    var nav = '<nav class="lf-album-nav" aria-label="Choose a place">' + Object.keys(LOCAL_FLAVOR).map(function (id) { return '<button type="button" class="btn sm' + (id === loc ? ' primary' : ' ghost') + '" data-album="' + id + '" aria-pressed="' + (id === loc) + '">' + esc(LOCATIONS[id].name) + '</button>'; }).join('') + '</nav>';
    X().modal('🗺️ Florida Place Album', '<p class="small">Explore freely — browsing does not spend travel days or change your case route. Spot it points are only offered when you arrive during the case.</p>' + nav + panel(loc, false), [{ label: 'Back to the case' }], { cls: 'wide', escClose: true, noFocus: true });
    focusModalHeading();
    var root = document.getElementById('modal'); wire(root);
    root.querySelectorAll('[data-album]').forEach(function (b) { b.onclick = function () { album(b.getAttribute('data-album')); }; });
  }
  function creditsHtml() {
    return '<section id="lf-photo-credits" class="no-vocab"><h2>Local Flavor photo credits (22)</h2><p class="small">Real photos, not generated images. Author and license checked on Wikimedia Commons, November 7, 2026. Public-domain and CC BY / CC BY-SA photographs only. Changes: resizing, WebP conversion and thumbnails; no content changes. CC BY-SA copies remain under their original license. Credits are stored offline in photo-credits.json.</p>' + Object.keys(LOCAL_FLAVOR).map(function (id) {
      return '<h3>' + esc(LOCATIONS[id].name) + '</h3><ul class="lf-credit-list">' + LOCAL_FLAVOR[id].map(function (p) { return '<li><img src="' + esc(p.thumb) + '" alt="" loading="lazy"><div><b>' + esc(p.caption) + '</b>' + credit(p) + '</div></li>'; }).join('') + '</ul>';
    }).join('') + '</section>';
  }
  function photoCredits() {
    X().modal('📷 Photo Credits', creditsHtml(), [{ label: 'Back to the album', fn: function () { album(); } }, { label: 'Back to the case', cls: 'ghost' }], { cls: 'wide', escClose: true, noFocus: true });
    focusModalHeading();
  }
  function afterFrame(sc) {
    var main = document.querySelector('main.scene'), target = main && main.querySelector('.panel');
    if (!target) return;
    var b = X().el('<button type="button" class="hud-btn lf-album-button" id="place-album" aria-label="Local Flavor place album">📷<span class="lbl"> Place Album</span></button>');
    document.querySelector('.hud-tools').appendChild(b); b.onclick = function () { album(); };
    if (arrivals[state().scene]) {
      var card = X().el(panel(arrivals[state().scene], true));
      var skip = X().el('<button type="button" class="btn sm lf-continue">Continue the case ↓</button>');
      var margin = document.querySelector(".hud").getBoundingClientRect().height + 12;
      card.style.scrollMarginTop = margin + "px"; target.style.scrollMarginTop = margin + "px";
      card.appendChild(skip); skip.onclick = function () { target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); document.getElementById('scene-title').focus({ preventScroll: true }); };
      main.insertBefore(card, target); wire(card);
    }
    var cid = clueFor(sc);
    if (cid) {
      X().addUnique(state().clues, cid); X().save();
      var clue = X().el('<aside class="lf-clue" aria-label="Local Flavor witness clue"><div class="lf-eyebrow">WITNESS FILE · LOCAL FLAVOR</div><p>“' + esc(pools[state().scene][sc.flavorClues.indexOf(cid)]) + '”</p><small>Saved in your Notebook. Match the place details with your map.</small></aside>');
      var banner = target.querySelector('.clue-banner'); banner.insertAdjacentElement('afterend', clue); X().decorate(clue);
    }
  }
  return { panel: panel, wire: wire, album: album, photoCredits: photoCredits, creditsHtml: creditsHtml, afterFrame: afterFrame, clueFor: clueFor, pools: pools, arrivals: arrivals };
})();
