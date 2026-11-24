/* Florida Trailblazers v11 — two-case shell.
   Case 1 keeps its original save key so old progress still loads. */
var CASE = (function () {
  "use strict";
  var LAST_KEY = "ftb_last_case_v11";
  var current = "case1";
  var pack1 = null;
  var METAS = {
    case1: {
      id: "case1",
      title: "The Stolen Founding Stone",
      subtitle: "St. Augustine, Fort Mose, and Mission San Luis",
      cover: "assets/img/title/hero.webp",
      blurb: "Chase a thief across Florida's early-history sites, from the Castillo to Fort Mose and Mission San Luis.",
      status: "playable",
      saveKey: "ftb_case1_save_v3",
      reportKey: "ftb_case1_reports_v3",
      introId: "intro",
      startLoc: "staug"
    },
    case2: {
      id: "case2",
      title: "The Cigar Box Code",
      subtitle: "Tampa Bay and Ybor City",
      cover: "assets/img/case2_cover.webp",
      blurb: "Penny Pinch has stolen a coded cigar-box label. Follow her clues from Weedon Island to Fort Brooke, the silver minarets, Ybor City, and the port.",
      status: "first-playable",
      note: "Chapters 1–2 are fully playable. Chapters 3–5 are coming soon.",
      saveKey: "ftb_case2_save_v11",
      reportKey: "ftb_case2_reports_v11",
      introId: "c2intro",
      startLoc: "weedon"
    }
  };

  function captureCase1() {
    if (pack1) return;
    pack1 = {
      LOCATIONS: LOCATIONS,
      CLUES: CLUES,
      CHAPTERS: CHAPTERS,
      SCENES: SCENES,
      PASSAGES: PASSAGES,
      VOCAB: VOCAB,
      FACTS: FACTS,
      START: START,
      TIMELINE: typeof TIMELINE !== "undefined" ? TIMELINE : null,
      LOCAL_FLAVOR: typeof LOCAL_FLAVOR !== "undefined" ? LOCAL_FLAVOR : null,
      SRC: typeof SRC !== "undefined" ? SRC : null
    };
  }

  function setGlobal(name, val) {
    try { window[name] = val; } catch (e) {}
  }

  function applyCase1() {
    if (!pack1) captureCase1();
    setGlobal("LOCATIONS", pack1.LOCATIONS);
    setGlobal("CLUES", pack1.CLUES);
    setGlobal("CHAPTERS", pack1.CHAPTERS);
    setGlobal("SCENES", pack1.SCENES);
    setGlobal("PASSAGES", pack1.PASSAGES);
    setGlobal("VOCAB", pack1.VOCAB);
    setGlobal("FACTS", pack1.FACTS);
    setGlobal("START", pack1.START);
    if (pack1.TIMELINE) setGlobal("TIMELINE", pack1.TIMELINE);
    if (pack1.LOCAL_FLAVOR) setGlobal("LOCAL_FLAVOR", pack1.LOCAL_FLAVOR);
    if (pack1.SRC) setGlobal("SRC", pack1.SRC);
  }

  function applyCase2() {
    if (!pack1) captureCase1();
    setGlobal("LOCATIONS", typeof CASE2_LOCATIONS !== "undefined" ? CASE2_LOCATIONS : pack1.LOCATIONS);
    setGlobal("CLUES", typeof CASE2_CLUES !== "undefined" ? CASE2_CLUES : {});
    setGlobal("CHAPTERS", typeof CASE2_CHAPTERS !== "undefined" ? CASE2_CHAPTERS : {});
    setGlobal("SCENES", typeof CASE2_SCENES !== "undefined" ? CASE2_SCENES : {});
    setGlobal("PASSAGES", typeof CASE2_PASSAGES !== "undefined" ? CASE2_PASSAGES : {});
    var v = {};
    if (pack1.VOCAB) Object.keys(pack1.VOCAB).forEach(function (k) { v[k] = pack1.VOCAB[k]; });
    if (typeof CASE2_VOCAB !== "undefined") Object.keys(CASE2_VOCAB).forEach(function (k) { v[k] = CASE2_VOCAB[k]; });
    setGlobal("VOCAB", v);
    var f = {};
    if (pack1.FACTS) Object.keys(pack1.FACTS).forEach(function (k) { f[k] = pack1.FACTS[k]; });
    if (typeof CASE2_FACTS !== "undefined") Object.keys(CASE2_FACTS).forEach(function (k) { f[k] = CASE2_FACTS[k]; });
    setGlobal("FACTS", f);
    setGlobal("START", typeof CASE2_START !== "undefined" ? CASE2_START : pack1.START);
    if (typeof CASE2_TIMELINE !== "undefined") setGlobal("TIMELINE", CASE2_TIMELINE);
    if (typeof LOCAL_FLAVOR_CASE2 !== "undefined") setGlobal("LOCAL_FLAVOR", LOCAL_FLAVOR_CASE2);
    if (typeof CASE2_SRC !== "undefined") {
      var src = {};
      if (pack1.SRC) Object.keys(pack1.SRC).forEach(function (k) { src[k] = pack1.SRC[k]; });
      Object.keys(CASE2_SRC).forEach(function (k) { src[k] = CASE2_SRC[k]; });
      setGlobal("SRC", src);
    }
  }

  function hookVocabPhotos() {
    if (typeof LOCAL_FLAVOR === "undefined" || typeof VOCAB === "undefined") return;
    Object.keys(LOCAL_FLAVOR).forEach(function (loc) {
      (LOCAL_FLAVOR[loc] || []).forEach(function (p) {
        if (p && p.vocab && VOCAB[p.vocab] && !VOCAB[p.vocab].photo) VOCAB[p.vocab].photo = p.thumb;
      });
    });
  }

  function remember(id) {
    try { localStorage.setItem(LAST_KEY, id); } catch (e) {}
  }

  function lastId() {
    try { return localStorage.getItem(LAST_KEY) || "case1"; } catch (e) { return "case1"; }
  }

  function activate(id) {
    captureCase1();
    if (id !== "case2") id = "case1";
    current = id;
    if (id === "case2") applyCase2();
    else applyCase1();
    if (typeof SAVE_KEY !== "undefined") setGlobal("SAVE_KEY", METAS[id].saveKey);
    if (typeof REPORT_KEY !== "undefined") setGlobal("REPORT_KEY", METAS[id].reportKey);
    hookVocabPhotos();
    remember(id);
    return current;
  }

  function meta(id) { return METAS[id || current]; }
  function saveKey(id) { return METAS[id || current].saveKey; }
  function reportKey(id) { return METAS[id || current].reportKey; }

  function readSave(id) {
    try {
      var j = localStorage.getItem(saveKey(id));
      return j ? JSON.parse(j) : null;
    } catch (e) { return null; }
  }

  function canContinue(sv) {
    return !!(sv && sv.scene && sv.scene !== "win" && sv.log);
  }

  function migrateSave(sv, id) {
    if (!sv || typeof sv !== "object") return sv;
    if (!sv.caseId) sv.caseId = id || "case1";
    return sv;
  }

  function continuable() {
    var out = [];
    ["case1", "case2"].forEach(function (id) {
      var sv = migrateSave(readSave(id), id);
      if (canContinue(sv)) {
        out.push({
          id: id,
          name: sv.name || "",
          title: METAS[id].title,
          scene: sv.scene,
          save: sv
        });
      }
    });
    return out;
  }

  function allReports() {
    var all = [];
    ["case1", "case2"].forEach(function (id) {
      var list = [];
      try { list = JSON.parse(localStorage.getItem(reportKey(id)) || "[]"); } catch (e) { list = []; }
      (list || []).forEach(function (r) {
        r.caseId = r.caseId || id;
        r.caseTitle = r.caseTitle || METAS[id].title;
        all.push(r);
      });
    });
    all.sort(function (a, b) { return (b.updated || b.started || 0) - (a.updated || a.started || 0); });
    return all;
  }

  function migrateProfile(p) {
    if (!p) return p;
    p.journals = p.journals || {};
    if (p.journal && !p.journals.case1) p.journals.case1 = p.journal;
    if (!p.journals.case1) p.journals.case1 = { cards: [] };
    if (!p.journals.case2) p.journals.case2 = { cards: [] };
    if (!Array.isArray(p.journals.case1.cards)) p.journals.case1.cards = [];
    if (!Array.isArray(p.journals.case2.cards)) p.journals.case2.cards = [];
    p.journal = p.journals.case1;
    return p;
  }

  function profileJournal(p, id) {
    migrateProfile(p);
    return p.journals[id || current] || { cards: [] };
  }

  function journalCards(id) {
    id = id || current;
    if (id === "case2" && typeof CASE2_JOURNAL !== "undefined") return CASE2_JOURNAL.cards || [];
    return null; /* journal.js uses its built-in Case 1 pack */
  }
  function journalRegions(id) {
    id = id || current;
    if (id === "case2" && typeof CASE2_JOURNAL !== "undefined") return CASE2_JOURNAL.regions || [];
    return null;
  }
  function journalTotal(id) {
    var cards = journalCards(id);
    if (cards) return cards.length;
    return 9;
  }

  function heistStops(id) {
    id = id || current;
    if (id === "case2" && typeof CASE2_HEIST !== "undefined") {
      var scenes = (typeof SCENES !== "undefined") ? SCENES : {};
      return (CASE2_HEIST.stops || []).filter(function (s) {
        return (s.at || []).some(function (sid) { return !!scenes[sid]; });
      });
    }
    return null;
  }

  function mapHtml(opts) {
    opts = opts || {};
    if (current === "case2" && window.ART && ART.tampaBayMap) return ART.tampaBayMap(opts);
    if (window.ART && ART.floridaMap) return ART.floridaMap(opts);
    return "";
  }

  /* First load: keep Case 1 globals, just snapshot and stamp keys. */
  function boot() {
    captureCase1();
    applyCase1();
    setGlobal("SAVE_KEY", METAS.case1.saveKey);
    setGlobal("REPORT_KEY", METAS.case1.reportKey);
    hookVocabPhotos();
  }

  function sceneOf(id) {
    if (typeof SCENES !== "undefined" && SCENES[id]) return SCENES[id];
    if (pack1 && pack1.SCENES && pack1.SCENES[id]) return pack1.SCENES[id];
    if (typeof CASE2_SCENES !== "undefined" && CASE2_SCENES[id]) return CASE2_SCENES[id];
    return null;
  }
  function locOf(id) {
    if (typeof LOCATIONS !== "undefined" && LOCATIONS[id]) return LOCATIONS[id];
    if (pack1 && pack1.LOCATIONS && pack1.LOCATIONS[id]) return pack1.LOCATIONS[id];
    if (typeof CASE2_LOCATIONS !== "undefined" && CASE2_LOCATIONS[id]) return CASE2_LOCATIONS[id];
    return null;
  }
  function allPlayableScenes() {
    var out = {}, k;
    if (pack1 && pack1.SCENES) for (k in pack1.SCENES) if (Object.prototype.hasOwnProperty.call(pack1.SCENES, k)) out[k] = pack1.SCENES[k];
    if (typeof CASE2_SCENES !== "undefined") for (k in CASE2_SCENES) if (Object.prototype.hasOwnProperty.call(CASE2_SCENES, k)) out[k] = CASE2_SCENES[k];
    return out;
  }

  boot();

  return {
    ids: function () { return ["case1", "case2"]; },
    id: function () { return current; },
    meta: meta,
    metas: function () { return METAS; },
    activate: activate,
    saveKey: saveKey,
    reportKey: reportKey,
    readSave: readSave,
    migrateSave: migrateSave,
    canContinue: canContinue,
    continuable: continuable,
    allReports: allReports,
    lastId: lastId,
    remember: remember,
    introId: function (id) { return meta(id).introId; },
    startLoc: function (id) { return meta(id).startLoc; },
    mapHtml: mapHtml,
    sceneOf: sceneOf,
    locOf: locOf,
    allPlayableScenes: allPlayableScenes,
    journalCards: journalCards,
    journalRegions: journalRegions,
    journalTotal: journalTotal,
    heistStops: heistStops,
    migrateProfile: migrateProfile,
    profileJournal: profileJournal,
    boot: boot
  };
})();
