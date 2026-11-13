/* Florida Trailblazers v5 — painted kid-detective lineup, migration, and ID-card markup.
   Original AI-generated art of fictional children. No network calls. */
var DETECTIVES = [
  { id: "ava", name: "Ava", hair: "braids", glasses: "round", tags: ["glasses", "braids"] },
  { id: "zora", name: "Zora", hair: "afro", tags: ["afro"] },
  { id: "nia", name: "Nia", hair: "puffs", tags: ["puffs"] },
  { id: "imani", name: "Imani", hair: "locs", tags: ["locs"] },
  { id: "noor", name: "Noor", hair: "hijab", hijab: "teal", tags: ["hijab"] },
  { id: "aisha", name: "Aisha", hair: "hijab", hijab: "burgundy", tags: ["hijab"] },
  { id: "sofia", name: "Sofia", hair: "wavy", tags: ["wavy"] },
  { id: "elena", name: "Elena", hair: "curly", glasses: "round", tags: ["glasses"] },
  { id: "priya", name: "Priya", hair: "ponytail", tags: ["ponytail"] },
  { id: "mei", name: "Mei", hair: "straight", tags: ["straight"] },
  { id: "hazel", name: "Hazel", hair: "ponytail", tags: ["ponytail", "freckles"] },
  { id: "willa", name: "Willa", hair: "bun", tags: ["bun"] },
  { id: "marco", name: "Marco", hair: "curly", tags: ["hearingAid"] },
  { id: "malik", name: "Malik", hair: "afro", tags: ["afro"] },
  { id: "darius", name: "Darius", hair: "twists", tags: ["twists"] },
  { id: "luis", name: "Luis", hair: "buzz", tags: ["buzz"] },
  { id: "samir", name: "Samir", hair: "wavy", glasses: "round", tags: ["glasses"] },
  { id: "kenji", name: "Kenji", hair: "straight", tags: ["straight"] },
  { id: "reed", name: "Reed", hair: "short", tags: ["freckles", "wheelchair"] },
  { id: "finn", name: "Finn", hair: "wavy", tags: ["freckles"] },
  { id: "theo", name: "Theo", hair: "short", glasses: "square", tags: ["glasses"] },
  { id: "kai", name: "Kai", hair: "curly", tags: ["curly"] },
  { id: "jordan", name: "Jordan", hair: "braids", tags: ["braids"] },
  { id: "omar", name: "Omar", hair: "wavy", tags: ["wavy"] }
];
var AVATAR_BACKDROPS = [
  { id: "studio", name: "Studio cream", file: "" },
  { id: "coquina", name: "Coquina wall", file: "bg_coquina.webp" },
  { id: "mangroves", name: "Mangroves", file: "bg_mangroves.webp" },
  { id: "oaks", name: "Spanish moss oaks", file: "bg_oaks.webp" },
  { id: "beach", name: "Florida beach", file: "bg_beach.webp" }
];
var AVATAR_EXPR = ["neutral", "happy", "surprised"];

function detectiveById(id) {
  id = String(id || "").toLowerCase();
  for (var i = 0; i < DETECTIVES.length; i++) if (DETECTIVES[i].id === id) return DETECTIVES[i];
  return null;
}
function backdropById(id) {
  for (var i = 0; i < AVATAR_BACKDROPS.length; i++) if (AVATAR_BACKDROPS[i].id === id) return AVATAR_BACKDROPS[i];
  return null;
}
function avatarMood(mood) {
  if (mood === "nervous") return "surprised";
  if (mood === "smug") return "happy";
  if (mood === "happy" || mood === "surprised" || mood === "neutral") return mood;
  return "neutral";
}
function detectiveImg(id, mood, thumb) {
  return "assets/img/avatars/" + (thumb ? "thumbs/" : "") + id + "_" + avatarMood(mood || "neutral") + ".webp";
}
function backdropUrl(id) {
  var b = backdropById(id);
  return b && b.file ? "assets/img/avatars/" + b.file : "";
}
function pickDetectiveFromLegacy(a, name) {
  var nm = String(name || "").trim().toLowerCase();
  if (detectiveById(nm)) return nm;
  a = a || {};
  var hair = a.hair || "", glasses = a.glasses && a.glasses !== "none", hijabC = String(a.hijab || "");
  if (hair === "hijab") return /#b5446e|#8e7cc3|#d0508f|#d62828|#222222/i.test(hijabC) ? "aisha" : "noor";
  if (a.hearingAid) return "marco";
  if (hair === "puffs") return "nia";
  if (hair === "locs") return "imani";
  if (hair === "afro") return "zora";
  if (hair === "bun") return "willa";
  if (hair === "buzz" || hair === "none") return "luis";
  if (hair === "ponytail") return a.freckles ? "hazel" : "priya";
  if (hair === "braids") return glasses ? "ava" : "jordan";
  if (a.freckles) return "finn";
  if (glasses) return a.glasses === "square" ? "theo" : "elena";
  if (hair === "wavy" || hair === "long") return "sofia";
  if (hair === "short") return "kenji";
  if (hair === "curly") return "kai";
  return "ava";
}
function migrateAvatar(a, name) {
  a = a || {};
  var hadDetective = !!(a.detective && detectiveById(a.detective));
  a = Object.assign(JSON.parse(JSON.stringify(AVATAR_DEFAULT)), a);
  if (!hadDetective) a.detective = pickDetectiveFromLegacy(a, name);
  if (!backdropById(a.backdrop) || !a.backdrop) a.backdrop = "coquina";
  return a;
}

/* Tasteful circular badge icons for earned costume pieces (shown on the ID card, not pasted on heads). */
var BADGE_ICON = {
  deerstalker: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="16.2" rx="9" ry="2.2" fill="#1a1a1a"/><path d="M6.5 15.4c.4-4 2.2-6.6 5.5-6.6s5.1 2.6 5.5 6.6" fill="#14213d"/><rect x="8.2" y="7.2" width="7.6" height="2.2" rx="1" fill="#ffb703"/><path d="M7 15.6h10" stroke="#ffb703" stroke-width="1.2"/></svg>',
  ranger: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="16.4" rx="9" ry="2" fill="#3a2a12"/><path d="M6 15.6c.5-4.2 2.4-7 6-7s5.5 2.8 6 7" fill="#7d6b45"/><path d="M9 8.8h6l-.6 2.2H9.6z" fill="#3a2a12"/><circle cx="12" cy="13.2" r="1.3" fill="#ffb703"/></svg>',
  explorer: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="16.5" rx="9.2" ry="2" fill="#6b5428"/><path d="M5.8 15.6c.4-4.4 2.6-7.4 6.2-7.4s5.8 3 6.2 7.4" fill="#cdb889"/><path d="M8 9.2h8v1.6H8z" fill="#6b5428"/><path d="M12 10.8v4" stroke="#6b5428" stroke-width="1.2"/></svg>',
  medal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l4 5 4-5" fill="#1d6fd6"/><path d="M8 4l4 5-1.5-5z" fill="#134e9c"/><circle cx="12" cy="15" r="5.2" fill="#ffb703" stroke="#7a4e00" stroke-width="1.4"/><path d="M12 12.2l.9 1.8 2 .3-1.5 1.4.4 2L12 16.7 10.2 17.7l.4-2-1.5-1.4 2-.3z" fill="#7a4e00"/></svg>',
  watch: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9.2" y="3.2" width="5.6" height="3.2" rx="1" fill="#8a6a45"/><rect x="9.2" y="17.6" width="5.6" height="3.2" rx="1" fill="#8a6a45"/><circle cx="12" cy="12" r="6.2" fill="#fff6d8" stroke="#3a2a12" stroke-width="1.6"/><path d="M12 8.4V12l3 2" stroke="#3a2a12" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
  coinpin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="#fff4c4" stroke="#7a4e00" stroke-width="1.6"/><circle cx="12" cy="12" r="6.1" fill="none" stroke="#7a4e00" stroke-width=".8"/><text x="12" y="16" text-anchor="middle" font-size="11" font-family="Georgia, serif" font-weight="700" fill="#7a4e00">$</text></svg>',
  compasspin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="#f4fff8" stroke="#0d3b28" stroke-width="1.4"/><path d="M12 5.6v1.6M12 16.8v1.6M5.6 12h1.6M16.8 12h1.6" stroke="#0d3b28" stroke-width="1.2" stroke-linecap="round"/><path d="M12 7.4l2.8 8-2.8-1.6-2.8 1.6z" fill="#c0392b"/><circle cx="12" cy="12" r="1.2" fill="#0d3b28"/></svg>',
  bookbadge: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 6.2c2.2-.8 4.4.2 6.5 1.6 2.1-1.4 4.3-2.4 6.5-1.6v11.2c-2.2-.8-4.4.1-6.5 1.5-2.1-1.4-4.3-2.3-6.5-1.5V6.2z" fill="#fff8e6" stroke="#2e1065" stroke-width="1.2"/><path d="M12 7.8v11" stroke="#2e1065" stroke-width="1.2"/></svg>',
  scroll: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6.5c0-1.4 1.2-2.5 2.6-2.5H18v13.2c0 1.2-1 2.2-2.2 2.2H8.8" fill="#fff6d8" stroke="#5a3d1c" stroke-width="1.3"/><path d="M7 6.5v12.2c0 1.2-.9 2-2 1.6s-1.2-1.4-1.2-2.4V8.2C3.8 7 5 6.2 7 6.5z" fill="#f1e0b0" stroke="#5a3d1c" stroke-width="1.2"/><path d="M9.5 9.5h6.5M9.5 12.5h6.5M9.5 15.5h4.5" stroke="#5a3d1c" stroke-width="1.1" stroke-linecap="round"/></svg>',
  scarf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5c2-3.2 9-3.2 11 0-1.2 1.4-3.4 2.2-5.5 2.2S7.7 9.9 6.5 8.5z" fill="#d62828"/><path d="M13.5 10.2l1.3 9.2 2.4-1.2-1.2-8" fill="#b71c1c"/><path d="M10.8 10.2l.6 5.5 1.8-.4-.4-5.1" fill="#d62828"/></svg>',
  magnifier: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.2" cy="10.2" r="6" fill="none" stroke="#ffb703" stroke-width="2.2"/><circle cx="10.2" cy="10.2" r="4.2" fill="#e7f0ff" fill-opacity=".45"/><path d="M14.6 14.6L20 20" stroke="#c48402" stroke-width="2.4" stroke-linecap="round"/></svg>'
};
var BADGE_TINT = {
  deerstalker: "hat", ranger: "hat", explorer: "hat",
  medal: "coin", watch: "compass", coinpin: "coin",
  compasspin: "compass", bookbadge: "book", scroll: "book",
  scarf: "hat", magnifier: "coin"
};

function idCardHtml(o) {
  o = o || {};
  var bg = o.backdropUrl ? ' style="background-image:linear-gradient(180deg,rgba(253,246,231,.88),rgba(247,236,214,.92)),url(\'' + o.backdropUrl + '\')"' : "";
  var stageBg = o.backdropUrl ? ' style="background-image:linear-gradient(180deg,rgba(13,27,42,.28),rgba(13,27,42,.55)),url(\'' + o.backdropUrl + '\')"' : "";
  var badges = (o.badges || []).map(function (b) {
    return '<div class="id-badge ' + (b.cls || "") + '" data-id="' + b.id + '" title="' + b.name + '" aria-label="' + b.name + '">' + (b.icon || "") + '</div>';
  }).join("");
  if (!badges) badges = '<p class="id-empty">Solve cases to earn badges for this card.</p>';
  var stamp = o.stamp ? '<div class="id-stamp' + (o.stampAnimate ? " animate" : "") + '" aria-hidden="true"><span class="ring"></span><span class="s-top">Certified</span><span class="s-mid">' + (o.stampLabel || "Junior<br>Detective") + '</span><span class="star">★</span></div>' : "";
  return '<div class="id-stage"' + stageBg + '>' +
    '<div class="id-kicker">Your detective ID</div>' +
    '<article class="id-card" aria-label="Florida Trailblazers Detective ID for ' + o.name + '"' + bg + '>' +
      '<div class="id-inner">' +
        '<header class="id-banner">' +
          '<svg class="id-seal" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="16" fill="#ffb703" stroke="#5a3d1c" stroke-width="1.5"/><circle cx="18" cy="18" r="12.5" fill="none" stroke="#5a3d1c" stroke-width="1"/><path d="M18 8.5l2.1 5.3 5.6.3-4.3 3.6 1.5 5.4L18 19.8l-4.9 3.3 1.5-5.4-4.3-3.6 5.6-.3z" fill="#14213d"/></svg>' +
          '<h2>Florida Trailblazers<span>Detective ID</span></h2>' +
        '</header>' +
        '<div class="id-body">' +
          '<div class="id-photo"><img src="' + o.portraitSrc + '" alt="' + (o.portraitAlt || (o.name + "\'s detective portrait")) + '" draggable="false"></div>' +
          '<div class="id-meta">' +
            '<p class="id-label">Detective</p>' +
            '<p class="id-name">' + o.name + '</p>' +
            '<p class="id-rank">' + (o.rankIcon ? o.rankIcon + " " : "") + o.rank + '</p>' +
            '<p class="id-field"><b>Case no.</b> ' + o.caseNo + '</p>' +
            '<p class="id-field"><b>Post</b> ' + (o.post || "St. Augustine") + '</p>' +
            '<p class="id-field"><b>Issued</b> ' + (o.year || "") + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="id-rule"></div>' +
        '<div class="id-badges-wrap"><p class="id-label">Badges earned</p><div class="id-badges">' + badges + '</div></div>' +
        stamp +
        '<footer class="id-foot">Keep this card with your case file</footer>' +
      '</div>' +
    '</article></div>';
}
