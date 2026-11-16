/* Florida Trailblazers v8 — Collectible Field Journal (local only). */
window.JOURNAL = (function () {
  var IMG = "assets/img/journal/";
  var TOTAL = 9;

  /* Facts are paraphrased from the game's already-sourced FACTS / Local Flavor,
     plus two wildlife cards sourced to USFWS (see FACT_CHECK.md). */
  var CARDS = [
    { id: "castillo", name: "Castillo de San Marcos", region: "St. Augustine", regionId: "staug",
      awardAt: ["sa1"], img: "card_castillo.webp", thumb: "card_castillo_s.webp",
      facts: ["The Castillo de San Marcos was built from 1672 to 1695 to protect St. Augustine.", "It is made of coquina, a stone formed from tiny seashells."],
      src: "Game facts castilloBuilt, coquina (NPS Castillo / coquina pages).", srcIds: ["castilloBuilt", "coquina"] },
    { id: "coquina", name: "Coquina stone", region: "St. Augustine", regionId: "staug",
      awardAt: ["sa1", "sa1wall"], img: "card_coquina.webp", thumb: "card_coquina_s.webp",
      facts: ["Coquina formed over thousands of years as the shells of tiny coquina clams piled up and were naturally glued together into a kind of limestone.", "\"Coquina\" is Spanish for \"tiny shell.\""],
      src: "Game fact coquinaFormed (NPS coquina page).", srcIds: ["coquinaFormed"] },
    { id: "datil", name: "Datil pepper", region: "St. Augustine", regionId: "staug",
      awardAt: [], flavorPhoto: "datil", img: "card_datil.webp", thumb: "card_datil_s.webp",
      facts: ["Datil peppers are part of St. Augustine's food traditions.", "They taste very hot!"],
      src: "Game Local Flavor caption for St. Augustine (already in the case).", srcIds: [] },
    { id: "mose", name: "Fort Mose", region: "Fort Mose", regionId: "mose",
      awardAt: ["fm1"], img: "card_mose.webp", thumb: "card_mose_s.webp",
      facts: ["In 1738, the Spanish governor of Florida set aside land about 2 miles north of St. Augustine for Fort Mose (say \"moh-SAY\").", "It was the first legally sanctioned free African settlement in what is now the United States."],
      src: "Game facts mose1738, moseFirst (Florida State Parks / Florida Museum).", srcIds: ["mose1738", "moseFirst"] },
    { id: "egret", name: "Great egret", region: "Fort Mose", regionId: "mose",
      awardAt: ["fm1marsh"], img: "card_egret.webp", thumb: "card_egret_s.webp",
      facts: ["The great egret is a tall white wading bird with a long yellow bill and black legs.", "It hunts for fish in shallow Florida waters, including salt marshes like the ones around Fort Mose."],
      src: "U.S. Fish and Wildlife Service, Great Egret; marsh setting from game fact moseToday.", srcIds: ["moseToday"] },
    { id: "capitol", name: "Florida's Historic Capitol", region: "Tallahassee", regionId: "tallahassee",
      awardAt: ["tl1"], img: "card_capitol.webp", thumb: "card_capitol_s.webp",
      facts: ["In 1824, Tallahassee was chosen as Florida's capital, mostly because it was about halfway between St. Augustine and Pensacola.", "Florida's brick Capitol was finished in 1845 and is now the Historic Capitol museum."],
      src: "Game facts capital1824, historicCapitol (Florida Department of State).", srcIds: ["capital1824", "historicCapitol"] },
    { id: "council", name: "Apalachee council house", region: "Tallahassee", regionId: "tallahassee",
      awardAt: ["sl1"], img: "card_council.webp", thumb: "card_council_s.webp",
      facts: ["The Apalachee council house at San Luis was a huge round building about 120 feet across.", "Apalachee leaders met there every day to discuss community business."],
      src: "Game fact councilHouse (Mission San Luis visitor guide).", srcIds: ["councilHouse"] },
    { id: "manatee", name: "Florida manatee", region: "Waterways", regionId: "water",
      awardAt: [], rewardOf: "canoe", img: "card_manatee.webp", thumb: "card_manatee_s.webp",
      facts: ["The Florida manatee is a kind of West Indian manatee.", "These gentle sea cows live in Florida's warm rivers, springs, and coastal waters and eat water plants."],
      src: "U.S. Fish and Wildlife Service, Florida manatee (Trichechus manatus latirostris).", srcIds: [] },
    { id: "fmap", name: "A map of Florida", region: "Geography", regionId: "geo",
      awardAt: [], rewardOf: "sort", img: "card_map.webp", thumb: "card_map_s.webp",
      facts: ["Florida is a peninsula — land with water on three sides.", "St. Augustine and Fort Mose are on the northeast Atlantic coast, and Tallahassee, the capital since 1824, is in the panhandle."],
      src: "Game facts capital1824, geoMoseNorth, geoWest (Florida Department of State; game geography).", srcIds: ["capital1824", "geoMoseNorth", "geoWest"] }
  ];

  var REGIONS = [
    { id: "staug", name: "St. Augustine" },
    { id: "mose", name: "Fort Mose" },
    { id: "tallahassee", name: "Tallahassee" },
    { id: "water", name: "Waterways" },
    { id: "geo", name: "Geography" }
  ];

  function X() { return window.FTBX; }
  function esc(s) { return X() ? X().esc(s) : String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[c]; }); }
  function cardById(id) { for (var i = 0; i < CARDS.length; i++) if (CARDS[i].id === id) return CARDS[i]; return null; }
  function src(c, thumb) { return IMG + (thumb ? c.thumb : c.img); }

  function empty() { return { cards: [], minisOffered: {}, minisDone: {} }; }
  function ensure() {
    var st = X() && X().S ? X().S() : (window.FTB && FTB.state ? FTB.state() : null);
    if (!st) return null;
    if (!st.journal) st.journal = empty();
    if (!Array.isArray(st.journal.cards)) st.journal.cards = [];
    if (!st.journal.minisOffered) st.journal.minisOffered = {};
    if (!st.journal.minisDone) st.journal.minisDone = {};
    return st;
  }
  function collected() { var st = ensure(); return st ? st.journal.cards.slice() : []; }
  function has(id) { return collected().indexOf(id) >= 0; }
  function count() { return collected().length; }
  function countHtml() { return count() + " / " + TOTAL; }

  function persistCard(id) {
    var st = ensure(); if (!st) return false;
    if (st.journal.cards.indexOf(id) >= 0) return false;
    st.journal.cards.push(id);
    if (X() && X().save) X().save();
    if (window.V3 && V3.players) {
      V3.players().forEach(function (n) {
        if (!n || n === "Guest") return;
        var p = V3.profile(n);
        p.journal = p.journal || { cards: [] };
        if (!Array.isArray(p.journal.cards)) p.journal.cards = [];
        if (p.journal.cards.indexOf(id) < 0) p.journal.cards.push(id);
        V3.saveProfile(p);
      });
    }
    return true;
  }

  /* Award one or more cards. silent: skip the reveal modal (tests / already showing). */
  function refreshHudCount() {
    var el = document.querySelector("#journalbtn .count");
    if (el) el.textContent = count() + "/" + TOTAL;
  }

  function award(ids, opts) {
    opts = opts || {};
    if (typeof ids === "string") ids = [ids];
    var fresh = [];
    (ids || []).forEach(function (id) { if (cardById(id) && persistCard(id)) fresh.push(id); });
    if (fresh.length) refreshHudCount();
    if (fresh.length && !opts.silent) showReveal(fresh, opts.onDone);
    else if (opts.onDone) opts.onDone(fresh);
    return fresh;
  }

  function cardsForScene(sid) {
    return CARDS.filter(function (c) { return (c.awardAt || []).indexOf(sid) >= 0; });
  }

  function showReveal(ids, onDone) {
    if (!X() || !ids.length) { if (onDone) onDone(ids); return; }
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var body = '<div class="j-reveal" id="journal-reveal">' + ids.map(function (id) {
      var c = cardById(id);
      return '<div class="j-flip"><div class="j-flip-inner' + (reduce ? " reduced" : "") + '">' +
        '<div class="j-flip-face j-flip-back"><img class="j-sil" src="' + src(c) + '" alt=""></div>' +
        '<div class="j-flip-face j-flip-front"><img src="' + src(c) + '" alt="' + esc(c.name) + '"></div>' +
        '</div><p class="j-flip-name">' + esc(c.name) + '</p></div>';
    }).join("") +
      '<p>Added to your Florida Field Journal! Open the Journal anytime from the menu or the 📒 button.</p></div>';
    var title = ids.length === 1 ? "📒 New Field Journal card!" : "📒 New Field Journal cards!";
    X().modal(title, body, [{ label: "Got it", fn: function () { if (onDone) onDone(ids); } }], { cls: "wide journal-reveal-modal", escClose: true });
    if (window.SFX) SFX.play("reveal");
    if (window.READALOUD && READALOUD.afterScreen) {
      var m = document.getElementById("modal");
      if (m) READALOUD.afterScreen(m);
    }
  }

  function detailHtml(c, unlocked) {
    if (!unlocked) {
      return '<div class="j-detail"><p>Keep exploring Florida to unlock this card.</p></div>';
    }
    return '<div class="j-detail">' +
      '<span class="j-region-pill">' + esc(c.region) + '</span>' +
      '<img src="' + src(c) + '" alt="Painted collectible card: ' + esc(c.name) + '">' +
      '<div class="j-facts">' + c.facts.map(function (f) { return "<p>" + esc(f) + "</p>"; }).join("") + "</div>" +
      '<p class="j-src">Source: ' + esc(c.src) + "</p></div>";
  }

  function openCard(id, back) {
    var c = cardById(id); if (!c || !X()) return;
    var unlocked = has(id);
    X().modal(esc(c.name), detailHtml(c, unlocked), [{ label: "Close", fn: back }], { cls: "wide journal-detail-modal", escClose: true });
    if (unlocked && window.READALOUD) {
      var m = document.getElementById("modal");
      var facts = m && m.querySelector(".j-facts");
      if (facts && READALOUD.attachBlock) READALOUD.attachBlock(facts, "Read this Field Journal card aloud");
      else if (m && READALOUD.afterScreen) READALOUD.afterScreen(m);
    }
  }

  function gridHtml() {
    var n = count();
    var html = '<div class="j-wrap" id="journal-panel">' +
      '<div class="j-head"><button type="button" class="btn" id="j-back">← Back</button>' +
      "<h1>📒 Florida Field Journal</h1>" +
      '<span class="j-count" id="j-count">' + n + " / " + TOTAL + " collected</span></div>" +
      '<p class="j-lead">Collect painted cards of real Florida places, wildlife, food, and history as you travel. Locked cards stay in silhouette until you find them.</p>';
    REGIONS.forEach(function (r) {
      var list = CARDS.filter(function (c) { return c.regionId === r.id; });
      if (!list.length) return;
      html += '<section class="j-region" data-region="' + r.id + '"><h2>' + esc(r.name) + "</h2><div class=\"j-grid\">";
      list.forEach(function (c) {
        var on = has(c.id);
        html += '<button type="button" class="j-card' + (on ? "" : " is-locked") + '" data-card="' + c.id + '" aria-label="' +
          (on ? esc(c.name) : "Locked card in " + esc(r.name)) + '">' +
          (on ? '<img src="' + src(c, true) + '" alt="">' : '<img class="j-sil" src="' + src(c, true) + '" alt="">') +
          "<figcaption>" + (on ? esc(c.name) : '<span class="j-locked-lab">Locked</span>') + "</figcaption></button>";
      });
      html += "</div></section>";
    });
    return html + "</div>";
  }

  var openedFrom = null;
  function closeScreen() {
    var el = document.getElementById("journal-screen");
    if (el) el.remove();
    var back = openedFrom; openedFrom = null;
    if (back === "title" && window.FTB && FTB.title) FTB.title();
    else if (X() && X().render) X().render();
  }

  function open(opts) {
    opts = opts || {};
    ensure();
    openedFrom = opts.from || (document.querySelector(".title-screen") ? "title" : "game");
    var existing = document.getElementById("journal-screen");
    if (existing) existing.remove();
    var root = document.createElement("div");
    root.id = "journal-screen";
    root.className = "j-screen";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Florida Field Journal");
    root.innerHTML = gridHtml();
    document.body.appendChild(root);
    document.getElementById("j-back").onclick = closeScreen;
    root.querySelectorAll(".j-card").forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute("data-card");
        if (!has(id)) return;
        openCard(id, function () { /* stay on journal */ });
      };
    });
    if (window.READALOUD && READALOUD.afterScreen) READALOUD.afterScreen(root);
    window.scrollTo(0, 0);
  }

  function showInlineReveal(ids, onDone, opts) {
    var panel = document.querySelector("main .panel");
    if (!ids || !ids.length) { if (onDone) onDone(ids || []); return; }
    opts = opts || {};
    if (!panel && !opts.after) { if (onDone) onDone(ids); return; }
    var old = document.querySelector(".j-inline-reveal");
    if (old) old.remove();
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var kicker = opts.kicker || ("📒 New Field Journal card" + (ids.length > 1 ? "s" : ""));
    var html = '<aside class="j-inline-reveal" id="journal-reveal" aria-label="New Field Journal cards">' +
      '<p class="j-inline-kicker">' + kicker + "</p>" +
      '<div class="j-reveal">' + ids.map(function (id) {
        var c = cardById(id);
        return '<div class="j-flip"><div class="j-flip-inner' + (reduce ? " reduced" : "") + '">' +
          '<div class="j-flip-face j-flip-back"><img class="j-sil" src="' + src(c) + '" alt=""></div>' +
          '<div class="j-flip-face j-flip-front"><img src="' + src(c) + '" alt="' + (c ? esc(c.name) : "") + '"></div>' +
          '</div><p class="j-flip-name">' + (c ? esc(c.name) : "") + "</p></div>";
      }).join("") +
      (opts.note ? '<p>' + opts.note + '</p>' : '') +
      '<p class="small">Saved in your Florida Field Journal. Open 📒 Journal anytime from the menu.</p>' +
      '<button type="button" class="btn primary j-got">Got it</button></div></aside>';
    var el = X().el(html);
    if (opts.after && opts.after.parentNode) {
      /* Keep Local Flavor finds on screen: put the reveal at the top of the
         flavor card (not after the tall postcard stack, which is below the fold). */
      if (opts.after.classList && opts.after.classList.contains("local-flavor")) {
        opts.after.insertBefore(el, opts.after.firstChild);
      } else {
        opts.after.parentNode.insertBefore(el, opts.after.nextSibling);
      }
    } else {
      var after = panel.querySelector(".turn-banner") || panel.querySelector("h2");
      if (after && after.parentNode) after.parentNode.insertBefore(el, after.nextSibling);
      else panel.insertBefore(el, panel.firstChild);
    }
    var hud = document.querySelector(".hud");
    var margin = 12;
    if (hud) margin = Math.ceil(hud.getBoundingClientRect().height) + 12;
    if (opts.after) {
      document.querySelectorAll(".chapter-banner").forEach(function (x) { x.remove(); });
    }
    el.style.scrollMarginTop = margin + "px";
    try {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start", inline: "nearest" });
    } catch (err) {
      try { el.scrollIntoView(true); } catch (err2) {}
    }
    var doneOnce = false;
    var finish = function () {
      if (doneOnce) return; doneOnce = true;
      if (el && el.parentNode) el.remove();
      if (onDone) onDone(ids);
    };
    el.querySelector(".j-got").onclick = finish;
    if (window.SFX) SFX.play("reveal");
    if (window.READALOUD && READALOUD.afterScreen) READALOUD.afterScreen(el);
  }


  function tryFlavorAwards(root) {
    root = root || document;
    if (!root.querySelectorAll) return;
    CARDS.forEach(function (c) {
      if (!c.flavorPhoto || has(c.id)) return;
      var nodes = root.querySelectorAll('.lf-postcard[data-photo="' + c.flavorPhoto + '"]');
      if (!nodes.length) return;
      var check = function () {
        if (has(c.id)) return;
        Array.prototype.forEach.call(nodes, function (el) {
          if (has(c.id)) return;
          var r = el.getBoundingClientRect();
          if (r.width < 40 || r.height < 40) return;
          var visW = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
          var visH = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
          if (visW < r.width * 0.35 || visH < 80) return;
          award([c.id], { silent: true });
          var gal = el.closest(".local-flavor") || el.closest(".lf-gallery") || el;
          showInlineReveal([c.id], null, {
            after: gal,
            kicker: "📒 Local Flavor find!",
            note: "You spotted this on a St. Augustine food postcard."
          });
        });
      };
      Array.prototype.forEach.call(nodes, function (el) {
        var gal = el.closest(".lf-gallery");
        if (gal && !gal.getAttribute("data-j-wired")) {
          gal.setAttribute("data-j-wired", "1");
          gal.addEventListener("scroll", check, { passive: true });
        }
        if (window.IntersectionObserver && !el.getAttribute("data-j-obs")) {
          el.setAttribute("data-j-obs", "1");
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting && en.intersectionRatio >= 0.35) check();
            });
          }, { threshold: [0.35, 0.5, 0.75] });
          io.observe(el);
        }
      });
      setTimeout(check, 60);
      setTimeout(check, 400);
    });
  }

  function afterFrame(sc) {
    var st = ensure(); if (!st || !sc) return;
    tryFlavorAwards(document);
    var due = CARDS.filter(function (c) { return (c.awardAt || []).indexOf(st.scene) >= 0 && !has(c.id); });
    function ready() { if (window.MINI && MINI.onSceneReady) MINI.onSceneReady(st.scene); }
    if (!due.length) { ready(); return; }
    /* Persist always. Use an inline reveal (not #modal) so we never steal Penny's riddle/taunt or block the page. */
    var ids = due.map(function (c) { return c.id; });
    award(ids, { silent: true });
    showInlineReveal(ids);
    ready();
  }

  function teacherHtml() {
    var rows = "";
    if (window.V3 && V3.cls) {
      var roster = (V3.cls().roster || []).slice();
      var seen = {};
      roster.forEach(function (n) { seen[n] = true; });
      /* also include named profiles that have journal data */
      if (V3.profiles) {
        var P = V3.profiles();
        Object.keys(P).forEach(function (k) {
          var p = P[k];
          if (p && p.name && p.name !== "Guest" && !seen[p.name] && p.journal && p.journal.cards && p.journal.cards.length) roster.push(p.name);
        });
      }
      if (!roster.length) rows = "<p class='small'>No student journal progress on this device yet.</p>";
      else {
        rows = "<table><thead><tr><th>Student</th><th>Field Journal</th></tr></thead><tbody>" + roster.map(function (n) {
          var p = V3.profile(n);
          var k = (p && p.journal && p.journal.cards) ? p.journal.cards.length : 0;
          return "<tr><td>" + esc(n) + "</td><td>" + k + " / " + TOTAL + " collected</td></tr>";
        }).join("") + "</tbody></table>";
      }
    } else {
      rows = "<p class='small'>" + countHtml() + " on this device.</p>";
    }
    return '<section class="t-journal" id="t-journal"><h2>📒 Field Journal</h2>' +
      "<p class='small'>Cards of real Florida places, wildlife, food, and history that students collect as they play. Saved on this device only.</p>" +
      rows + "</section>";
  }

  function creditsHtml() {
    return '<h2>Florida Field Journal (original painted art)</h2>' +
      '<p class="small">These collectible cards were painted for this game in a graphic-novel style. Landmark and food cards used the game\'s already-licensed photographs as likeness references. Wildlife and map cards were painted from careful descriptions of the real plants, animals, and geography. They are original game art, not photographs. Facts on each card are sourced in FACT_CHECK.md.</p>' +
      '<ul class="cred-list fox-creds">' + CARDS.map(function (c) {
        return '<li class="cred"><img src="' + src(c, true) + '" alt="" width="72" height="96" loading="lazy"><div><b>' + esc(c.name) +
          '</b><br><span class="small">' + c.img + " — original painted collectible card created for Florida Trailblazers. License: original work for this game.</span></div></li>";
      }).join("") + "</ul>";
  }

  function hook() {
    if (!window.V3) return;
    var _init = V3.initState, _af = V3.afterFrame, _th = V3.teacherHtml, _tw = V3.wireTeacher;
    var _tb = V3.titleButtons, _wt = V3.wireTitle, _he = V3.hudExtra, _wh = V3.wireHudExtra;
    V3.initState = function (st, team) { _init(st, team); if (st && !st.journal) st.journal = empty(); };
    V3.afterFrame = function (sc) { _af(sc); afterFrame(sc); };
    if (_th) V3.teacherHtml = function () { return _th() + teacherHtml(); };
    if (_tw) V3.wireTeacher = function () { _tw(); };
    if (_tb) V3.titleButtons = function () { return _tb() + '<button class="btn" id="journal">📒 Field Journal</button>'; };
    if (_wt) V3.wireTitle = function () { _wt(); var j = document.getElementById("journal"); if (j) j.onclick = function () { open({ from: "title" }); }; };
    if (_he) V3.hudExtra = function (sc) { return _he(sc); };
    if (_wh) V3.wireHudExtra = function () { _wh(); };
    /* LocalFlavor.afterFrame / album call their internal wire(), not the
       public LocalFlavor.wire, so wrap those entry points too. Otherwise the
       datil food-postcard award never sees the arrival gallery or Place Album. */
    if (window.LocalFlavor && LocalFlavor.wire) {
      var _lw = LocalFlavor.wire;
      LocalFlavor.wire = function (root) { _lw(root); tryFlavorAwards(root || document); };
    }
    if (window.LocalFlavor && LocalFlavor.afterFrame) {
      var _laf = LocalFlavor.afterFrame;
      LocalFlavor.afterFrame = function (sc) { _laf(sc); tryFlavorAwards(document); };
    }
    if (window.LocalFlavor && LocalFlavor.album) {
      var _alb = LocalFlavor.album;
      LocalFlavor.album = function (loc) { _alb(loc); tryFlavorAwards((document.getElementById("modal") || document)); };
    }
  }
  hook();

  return {
    CARDS: CARDS, REGIONS: REGIONS, TOTAL: TOTAL,
    ensure: ensure, collected: collected, has: has, count: count, countHtml: countHtml,
    award: award, persistCard: persistCard, cardById: cardById, cardsForScene: cardsForScene,
    open: open, close: closeScreen, openCard: openCard, showReveal: showReveal, showInlineReveal: showInlineReveal,
    teacherHtml: teacherHtml, creditsHtml: creditsHtml, afterFrame: afterFrame, src: src, tryFlavorAwards: tryFlavorAwards
  };
})();
