/* Florida Trailblazers v8 — short optional mini-games (touch + keyboard, skippable). */
window.MINI = (function () {
  var DURATION = 30; /* seconds */
  var root = null, raf = 0, mode = null, running = false, ended = false;
  var keys = {}, pointerX = null, onEndCb = null;
  var ART = {
    water: "assets/img/minigames/water.webp",
    canoe: "assets/img/minigames/canoe.webp",
    gator: "assets/img/minigames/gator.webp",
    log: "assets/img/minigames/log.webp",
    shell: "assets/img/minigames/shell.webp",
    map: "assets/img/minigames/map.webp"
  };
  var IM = {}, artReady = false, artWaiters = [], faceImg = null, faceSrc = "";

  function loadImg(src, store, key, done) {
    var im = new Image();
    im.onload = function () { if (store) store[key] = im; if (done) done(im); };
    im.onerror = function () { if (done) done(null); };
    im.src = src;
    return im;
  }
  function preloadArt(cb) {
    if (artReady) { if (cb) cb(); return; }
    if (cb) artWaiters.push(cb);
    if (preloadArt._on) return;
    preloadArt._on = true;
    var keys = Object.keys(ART), left = keys.length;
    keys.forEach(function (k) {
      loadImg(ART[k], IM, k, function () {
        left--;
        if (left <= 0) {
          artReady = true;
          var w = artWaiters.slice(); artWaiters = [];
          w.forEach(function (fn) { fn(); });
        }
      });
    });
  }
  function currentFaceSrc() {
    try {
      var id = "ava";
      if (window.V3 && V3.current && V3.profile) {
        var who = V3.current();
        var p = who ? V3.profile(who) : null;
        if (p && p.avatar && p.avatar.detective) id = p.avatar.detective;
      }
      if (typeof detectiveImg === "function") return detectiveImg(id, "happy", true);
      return "assets/img/avatars/thumbs/" + id + "_happy.webp";
    } catch (e) {
      return "assets/img/avatars/thumbs/ava_happy.webp";
    }
  }
  function preloadFace(cb) {
    var src = currentFaceSrc();
    if (faceImg && faceSrc === src && faceImg.complete && faceImg.naturalWidth) { if (cb) cb(); return; }
    faceSrc = src;
    faceImg = loadImg(src, null, null, function (im) { faceImg = im; if (cb) cb(); });
  }

  function X() { return window.FTBX; }
  function esc(s) { return X() ? X().esc(s) : String(s); }
  function play(n) { if (window.SFX) SFX.play(n); }

  function ensureJournal() { return window.JOURNAL ? JOURNAL.ensure() : null; }

  function markOffered(id) {
    var st = ensureJournal(); if (!st) return;
    st.journal.minisOffered[id] = true;
    if (X() && X().save) X().save();
  }
  function markDone(id) {
    var st = ensureJournal(); if (!st) return;
    st.journal.minisDone[id] = true;
    if (X() && X().save) X().save();
  }
  function wasOffered(id) { var st = ensureJournal(); return !!(st && st.journal.minisOffered[id]); }
  function wasDone(id) { var st = ensureJournal(); return !!(st && st.journal.minisDone[id]); }

  /* Offer after the scene's journal reveal has closed (or immediately if none). */
  function onSceneReady(sid) {
    var which = null;
    if (sid === "fm1marsh" || sid === "fm1museum") which = "canoe";
    else if (sid === "tl1") which = "sort";
    if (!which || wasOffered(which) || wasDone(which)) return;
    if (document.getElementById("modal") || document.getElementById("mini-root") || document.getElementById("journal-screen")) {
      waitThenOffer(which);
      return;
    }
    offer(which);
  }

  function waitThenOffer(which) {
    if (waitThenOffer._which === which && waitThenOffer._on) return;
    waitThenOffer._which = which;
    waitThenOffer._on = true;
    var kick = function () {
      if (document.getElementById("modal") || document.getElementById("journal-screen") || document.getElementById("mini-root")) return false;
      waitThenOffer._on = false; waitThenOffer._which = null;
      if (obs) obs.disconnect();
      if (timer) clearInterval(timer);
      offer(which);
      return true;
    };
    var obs = null;
    if (window.MutationObserver) {
      obs = new MutationObserver(function () { kick(); });
      obs.observe(document.body, { childList: true, subtree: true });
    }
    var timer = setInterval(kick, 200);
    setTimeout(function () {
      waitThenOffer._on = false; waitThenOffer._which = null;
      if (obs) obs.disconnect();
      if (timer) clearInterval(timer);
    }, 15000);
  }

  function offer(which) {
    if (!X() || wasOffered(which) || document.getElementById("mini-root")) return;
    if (document.getElementById("modal")) { waitThenOffer(which); return; }
    markOffered(which);
    var copy = which === "canoe"
      ? { title: "🛶 Bonus: Marsh Canoe Dash",
          body: "<p>Want a short bonus paddle through the salt marsh near Fort Mose? Steer the canoe, collect shells, and dodge floating logs and a comic gator (he's goofy, not scary).</p><p class='small'>About 30 seconds. You can skip it and keep the main case going.</p>",
          play: "Paddle! ➜" }
      : { title: "🗺️ Bonus: Place the landmarks",
          body: "<p>Want a short bonus map game? Put each landmark in the right part of Florida: the northeast coast, or the capital region around Tallahassee.</p><p class='small'>About 30 seconds. You can skip it and keep the main case going.</p>",
          play: "Sort the map ➜" };
    /* Skip MUST be the first button so playtest does not enter the mini-game. */
    X().modal(copy.title, '<div id="mini-offer" data-mini="' + which + '">' + copy.body + "</div>",
      [
        { label: "Skip", cls: "ghost", fn: function () { /* already marked offered */ } },
        { label: copy.play, cls: "primary", fn: function () { start(which); } }
      ], { cls: "wide mini-offer-modal", escClose: true });
    if (window.READALOUD && READALOUD.afterScreen) {
      var m = document.getElementById("modal");
      if (m) READALOUD.afterScreen(m);
    }
  }

  function closeRoot() {
    running = false; ended = false; mode = null; onEndCb = null;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    keys = {}; pointerX = null;
    window.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("keyup", onKeyUp, true);
    if (root && root.parentNode) root.remove();
    root = null;
  }

  function skip() {
    closeRoot();
  }

  function onKeyDown(e) {
    keys[e.key] = true;
    if (e.key === "Escape") { e.preventDefault(); skip(); }
    if (mode === "canoe" && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " " || e.key === "a" || e.key === "A" || e.key === "d" || e.key === "D")) e.preventDefault();
  }
  function onKeyUp(e) { keys[e.key] = false; }

  function start(which, opts) {
    opts = opts || {};
    closeRoot();
    mode = which; running = true; ended = false; onEndCb = opts.onEnd || null;
    root = document.createElement("div");
    root.id = "mini-root";
    root.className = "mini-root";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", which === "canoe" ? "Marsh Canoe Dash" : "Place the landmarks");
    root.innerHTML = '<div class="mini-bar"><h2>' + (which === "canoe" ? "🛶 Marsh Canoe Dash" : "🗺️ Place the landmarks") + '</h2>' +
      '<button type="button" class="btn ghost" id="mini-skip">Skip</button></div>' +
      '<p class="mini-inst" id="mini-inst"></p>' +
      '<div class="mini-stage" id="mini-stage"></div>' +
      '<div class="mini-controls" id="mini-controls"></div>';
    document.body.appendChild(root);
    document.getElementById("mini-skip").onclick = skip;
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    if (which === "canoe") startCanoe(opts);
    else startSort(opts);
    if (window.READALOUD && READALOUD.attachBlock) {
      var inst = document.getElementById("mini-inst");
      if (inst) READALOUD.attachBlock(inst, "Read the mini-game instructions aloud");
    }
  }

  /* ---------- Canoe Dash ---------- */
  var canoe = null;
  function startCanoe(opts) {
    document.getElementById("mini-inst").textContent = "Steer left and right. Collect seashells. Dodge logs and the goofy gator. You have 30 seconds.";
    var stage = document.getElementById("mini-stage");
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-label", "Canoe dash game");
    stage.appendChild(canvas);
    var hud = document.createElement("div");
    hud.className = "mini-hud";
    hud.innerHTML = '<span id="mini-time">30s</span><span id="mini-score">Shells: 0</span>';
    stage.appendChild(hud);
    var ctr = document.getElementById("mini-controls");
    ctr.innerHTML = '<button type="button" class="btn" id="mini-left" aria-label="Paddle left">◀ Left</button>' +
      '<button type="button" class="btn" id="mini-right" aria-label="Paddle right">Right ▶</button>';

    var leftHeld = false, rightHeld = false;
    function hold(btn, flag, val) {
      btn.addEventListener("pointerdown", function (e) { e.preventDefault(); flag(val); });
      btn.addEventListener("pointerup", function () { flag(false); });
      btn.addEventListener("pointerleave", function () { flag(false); });
    }
    hold(document.getElementById("mini-left"), function (v) { if (v !== false) leftHeld = true; else leftHeld = false; }, true);
    hold(document.getElementById("mini-right"), function (v) { if (v !== false) rightHeld = true; else rightHeld = false; }, true);

    var ctx = canvas.getContext("2d");
    var W, H;
    function resize() {
      var r = stage.getBoundingClientRect();
      W = canvas.width = Math.max(280, Math.floor(r.width));
      H = canvas.height = Math.max(320, Math.floor(r.height));
    }
    resize();

    canoe = {
      x: 0.5, y: 0.82, w: 0.18, h: 0.14, vx: 0,
      shells: 0, bumps: 0, invuln: 0,
      t0: performance.now(), last: performance.now(),
      objs: [], spawn: 0, water: 0
    };
    canoe.objs.push({ kind: "shell", x: 0.38, y: 0.22, s: 0.07, v: 0.2 });
    canoe.objs.push({ kind: "log", x: 0.62, y: 0.18, s: 0.1, v: 0.2 });
    canoe.objs.push({ kind: "gator", x: 0.28, y: 0.08, s: 0.11, v: 0.16 });

    function spawn(kind) {
      canoe.objs.push({
        kind: kind,
        x: 0.12 + Math.random() * 0.76,
        y: -0.08,
        s: kind === "gator" ? 0.11 : kind === "shell" ? 0.07 : 0.1,
        v: (kind === "shell" ? 0.18 : 0.22) + Math.random() * 0.08
      });
    }

    canvas.addEventListener("pointerdown", function (e) {
      var r = canvas.getBoundingClientRect();
      pointerX = (e.clientX - r.left) / r.width;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    canvas.addEventListener("pointermove", function (e) {
      if (pointerX == null) return;
      var r = canvas.getBoundingClientRect();
      pointerX = (e.clientX - r.left) / r.width;
    });
    canvas.addEventListener("pointerup", function () { pointerX = null; });
    canvas.addEventListener("pointercancel", function () { pointerX = null; });

    function hit(a, b) {
      var dx = a.x - b.x, dy = a.y - b.y;
      var rr = (a.s || a.w) * 0.45 + b.s * 0.45;
      return dx * dx + dy * dy < rr * rr;
    }

    function tick(now) {
      if (!running || mode !== "canoe") return;
      resize();
      var dt = Math.min(0.05, (now - canoe.last) / 1000);
      canoe.last = now;
      canoe.water += dt;
      var left = 30 - (now - canoe.t0) / 1000;
      if (left < 0) left = 0;
      var timeEl = document.getElementById("mini-time");
      var scoreEl = document.getElementById("mini-score");
      if (timeEl) timeEl.textContent = Math.ceil(left) + "s";
      if (scoreEl) scoreEl.textContent = "Shells: " + canoe.shells;

      var dir = 0;
      if (leftHeld || keys.ArrowLeft || keys.a || keys.A) dir -= 1;
      if (rightHeld || keys.ArrowRight || keys.d || keys.D) dir += 1;
      if (pointerX != null) {
        var target = pointerX;
        dir = target < canoe.x - 0.02 ? -1 : target > canoe.x + 0.02 ? 1 : 0;
        canoe.x += (target - canoe.x) * Math.min(1, dt * 8);
      } else {
        canoe.x += dir * dt * 0.7;
      }
      canoe.x = Math.max(0.1, Math.min(0.9, canoe.x));
      if (canoe.invuln > 0) canoe.invuln -= dt;

      canoe.spawn -= dt;
      if (canoe.spawn <= 0 && left > 1.5) {
        var r = Math.random();
        spawn(r < 0.45 ? "shell" : r < 0.8 ? "log" : "gator");
        canoe.spawn = 0.7 + Math.random() * 0.5;
      }
      var i, o;
      for (i = canoe.objs.length - 1; i >= 0; i--) {
        o = canoe.objs[i];
        o.y += o.v * dt;
        if (o.y > 1.15) { canoe.objs.splice(i, 1); continue; }
        if (hit({ x: canoe.x, y: canoe.y, w: canoe.w, s: canoe.w }, o)) {
          if (o.kind === "shell") {
            canoe.shells += 1; canoe.objs.splice(i, 1); play("pickup");
          } else if (canoe.invuln <= 0) {
            canoe.bumps += 1; canoe.invuln = 1.1; play("splash");
            canoe.objs.splice(i, 1);
          }
        }
      }

      drawCanoe(ctx, W, H, canoe);

      if (left <= 0) { finishCanoe(true); return; }
      raf = requestAnimationFrame(tick);
    }

    function begin() {
      if (opts.forceComplete) {
        canoe.shells = Math.max(canoe.shells, 4);
        finishCanoe(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    preloadArt(function () { preloadFace(begin); });
  }

  function ready(im) { return im && im.complete && im.naturalWidth > 0; }

  function drawSprite(ctx, im, x, y, dw, dh, rot) {
    if (!ready(im)) return false;
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    ctx.drawImage(im, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
    return true;
  }

  function drawCanoe(ctx, W, H, g) {
    var t = g.water;
    /* painted salt-marsh water, scrolling/tiling */
    if (ready(IM.water)) {
      var tile = IM.water, scale = W / tile.naturalWidth, tw = W, th = tile.naturalHeight * scale;
      var off = (t * 70) % th;
      var y;
      for (y = off - th; y < H + th; y += th) ctx.drawImage(tile, 0, y, tw, th);
    } else {
      ctx.fillStyle = "#1b6a86";
      ctx.fillRect(0, 0, W, H);
    }
    /* objects */
    g.objs.forEach(function (o) {
      var x = o.x * W, y = o.y * H, s = o.s * W, drawn = false;
      if (o.kind === "log") {
        drawn = drawSprite(ctx, IM.log, x, y, s * 2.4, s * 2.4 * (ready(IM.log) ? IM.log.naturalHeight / IM.log.naturalWidth : 0.5), -0.15);
      } else if (o.kind === "gator") {
        drawn = drawSprite(ctx, IM.gator, x, y, s * 2.5, s * 2.5 * (ready(IM.gator) ? IM.gator.naturalHeight / IM.gator.naturalWidth : 1), 0);
      } else {
        drawn = drawSprite(ctx, IM.shell, x, y, s * 1.8, s * 1.8 * (ready(IM.shell) ? IM.shell.naturalHeight / IM.shell.naturalWidth : 1), t * 0.4 + o.x);
      }
      if (drawn) return;
      /* fallback if a sprite failed to load */
      if (o.kind === "log") {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.2);
        ctx.fillStyle = "#7a4a22";
        round(ctx, -s, -s * 0.28, s * 2, s * 0.55, 8); ctx.fill();
        ctx.restore();
      } else if (o.kind === "gator") {
        ctx.save(); ctx.translate(x, y);
        ctx.fillStyle = "#3d8a3a";
        round(ctx, -s * 1.1, -s * 0.35, s * 2.2, s * 0.7, 12); ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = "#e8c39a";
        ctx.beginPath(); ctx.ellipse(x, y, s * 0.7, s * 0.5, 0.4, 0, Math.PI * 2); ctx.fill();
      }
    });
    /* painted canoe + the player's detective portrait in the cockpit */
    var cx = g.x * W, cy = g.y * H, cw = g.w * W;
    ctx.save();
    if (g.invuln > 0 && Math.floor(g.invuln * 10) % 2 === 0) ctx.globalAlpha = 0.45;
    if (ready(IM.canoe)) {
      var aspect = IM.canoe.naturalHeight / IM.canoe.naturalWidth;
      var dw = cw * 1.15, dh = dw * aspect;
      ctx.drawImage(IM.canoe, cx - dw / 2, cy - dh / 2, dw, dh);
      if (ready(faceImg)) {
        var fr = dw * 0.32, fx = cx, fy = cy - dh * 0.02;
        ctx.save();
        ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.clip();
        var fs = fr * 2.35;
        ctx.drawImage(faceImg, fx - fs / 2, fy - fs * 0.42, fs, fs);
        ctx.restore();
        ctx.strokeStyle = "rgba(90,61,28,.85)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.stroke();
      }
    } else {
      ctx.fillStyle = "#8b3a1a";
      ctx.beginPath();
      ctx.ellipse(cx, cy, cw * 0.7, g.h * H * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function round(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function finishCanoe(ok) {
    if (ended) return;
    running = false; ended = true;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    var shells = canoe ? canoe.shells : 0;
    var success = !!ok; /* finishing the dash earns the card; shells are a bonus score */
    var fact = "The salt marsh around Fort Mose is home to fish, crabs, and wading birds. No buildings from the original fort remain today — visitors see the marsh land where it stood.";
    showEnd("canoe", success, success ? "You paddled the marsh!" : "Nice try on the marsh!", fact, success ? "manatee" : null, "Game fact moseToday (Florida State Parks / Fort Mose Historic State Park).");
  }

  /* ---------- Map sort ---------- */
  var sortState = null;
  var SORT_ITEMS = [
    { id: "castillo", name: "Castillo de San Marcos", zone: "ne", img: "assets/img/journal/card_castillo_s.webp" },
    { id: "mose", name: "Fort Mose", zone: "ne", img: "assets/img/journal/card_mose_s.webp" },
    { id: "capitol", name: "Historic Capitol", zone: "cap", img: "assets/img/journal/card_capitol_s.webp" },
    { id: "council", name: "Council house", zone: "cap", img: "assets/img/journal/card_council_s.webp" }
  ];

  function startSort(opts) {
    document.getElementById("mini-inst").textContent = "Drag or tap a card, then drop it on the right region of the map. Northeast coast, or the capital region.";
    document.getElementById("mini-controls").innerHTML = "";
    var stage = document.getElementById("mini-stage");
    stage.innerHTML = "";
    var board = document.createElement("div");
    board.className = "sort-board";
    board.innerHTML =
      '<div class="mini-hud" style="position:relative;color:#14213d;text-shadow:none"><span id="mini-time">30s</span><span id="mini-score">Placed: 0 / 4</span></div>' +
      '<div class="sort-map" id="sort-map" style="background-image:url(\'assets/img/minigames/map.webp\')">' +
        '<div class="sort-zone" id="zone-ne" data-zone="ne" style="left:58%;top:8%;height:42%"><h3>Northeast coast</h3></div>' +
        '<div class="sort-zone" id="zone-cap" data-zone="cap" style="left:8%;top:4%;height:40%"><h3>Capital region</h3></div>' +
      "</div>" +
      '<div class="sort-tray" id="sort-tray"></div>';
    stage.appendChild(board);

    sortState = { t0: performance.now(), placed: {}, picked: null, drag: null, done: false };

    function makeItem(it) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sort-item";
      b.setAttribute("data-id", it.id);
      b.setAttribute("aria-label", it.name);
      b.innerHTML = '<img src="' + it.img + '" alt=""><span>' + esc(it.name) + "</span>";
      b.addEventListener("pointerdown", function (e) { beginDrag(e, it, b); });
      b.addEventListener("click", function (e) {
        if (sortState.drag) return;
        e.preventDefault();
        pick(it.id, b);
      });
      return b;
    }
    SORT_ITEMS.forEach(function (it) { document.getElementById("sort-tray").appendChild(makeItem(it)); });

    function pick(id, el) {
      sortState.picked = id;
      board.querySelectorAll(".sort-item").forEach(function (n) { n.classList.toggle("picked", n.getAttribute("data-id") === id); });
    }
    function beginDrag(e, it, el) {
      if (ended) return;
      e.preventDefault();
      pick(it.id, el);
      sortState.drag = { id: it.id, el: el };
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      el.classList.add("dragging");
      moveDrag(e);
      el.addEventListener("pointermove", moveDrag);
      el.addEventListener("pointerup", endDrag);
      el.addEventListener("pointercancel", endDrag);
    }
    function moveDrag(e) {
      var d = sortState.drag; if (!d) return;
      d.el.style.left = (e.clientX - 40) + "px";
      d.el.style.top = (e.clientY - 40) + "px";
      var z = zoneAt(e.clientX, e.clientY);
      board.querySelectorAll(".sort-zone").forEach(function (n) { n.classList.toggle("on", z && n.getAttribute("data-zone") === z); });
    }
    function endDrag(e) {
      var d = sortState.drag;
      if (d) {
        d.el.classList.remove("dragging");
        d.el.style.left = ""; d.el.style.top = "";
        d.el.removeEventListener("pointermove", moveDrag);
        d.el.removeEventListener("pointerup", endDrag);
        d.el.removeEventListener("pointercancel", endDrag);
        var z = zoneAt(e.clientX, e.clientY);
        if (z) place(d.id, z);
      }
      sortState.drag = null;
      board.querySelectorAll(".sort-zone").forEach(function (n) { n.classList.remove("on"); });
    }
    function zoneAt(x, y) {
      var el = document.elementFromPoint(x, y);
      while (el && el !== board) {
        if (el.classList && el.classList.contains("sort-zone")) return el.getAttribute("data-zone");
        el = el.parentNode;
      }
      return null;
    }
    board.querySelectorAll(".sort-zone").forEach(function (z) {
      z.addEventListener("click", function () {
        if (sortState.picked) place(sortState.picked, z.getAttribute("data-zone"));
      });
    });

    function place(id, zone) {
      var it = null;
      SORT_ITEMS.forEach(function (x) { if (x.id === id) it = x; });
      if (!it || sortState.placed[id] || ended) return;
      var zel = document.getElementById(zone === "ne" ? "zone-ne" : "zone-cap");
      if (it.zone === zone) {
        sortState.placed[id] = zone;
        play("correct");
        zel.classList.add("ok");
        var btn = board.querySelector('.sort-item[data-id="' + id + '"]');
        if (btn) { btn.classList.add("in-zone"); btn.classList.remove("picked"); zel.appendChild(btn); }
        sortState.picked = null;
        var n = Object.keys(sortState.placed).length;
        var se = document.getElementById("mini-score");
        if (se) se.textContent = "Placed: " + n + " / 4";
        if (n >= 4) finishSort(true);
      } else {
        play("wrong");
        zel.classList.add("bad");
        setTimeout(function () { zel.classList.remove("bad"); }, 400);
      }
    }
    sortState.place = place;

    function tick(now) {
      if (!running || mode !== "sort" || ended) return;
      var left = 30 - (now - sortState.t0) / 1000;
      if (left < 0) left = 0;
      var te = document.getElementById("mini-time");
      if (te) te.textContent = Math.ceil(left) + "s";
      if (left <= 0) { finishSort(Object.keys(sortState.placed).length >= 4); return; }
      raf = requestAnimationFrame(tick);
    }
    if (opts.forceComplete) {
      SORT_ITEMS.forEach(function (it) { place(it.id, it.zone); });
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function finishSort(ok) {
    if (ended) return;
    running = false; ended = true;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    var fact = "In 1824, Tallahassee was chosen as Florida's capital, mostly because it was about halfway between St. Augustine and Pensacola, the two main cities.";
    showEnd("sort", ok, ok ? "You placed every landmark!" : "Nice try on the map!", fact, ok ? "fmap" : null, "Game fact capital1824 (Florida Department of State).");
  }

  function showEnd(which, success, title, fact, rewardId, srcLine) {
    markDone(which);
    var awarded = [];
    if (success && rewardId && window.JOURNAL) {
      awarded = JOURNAL.award(rewardId, { silent: true });
    }
    var stage = document.getElementById("mini-stage");
    if (!stage) { closeRoot(); return; }
    var card = rewardId && window.JOURNAL ? JOURNAL.cardById(rewardId) : null;
    var end = document.createElement("div");
    if (root) root.classList.add("is-ended");
    end.className = "mini-end";
    end.id = "mini-end";
    end.innerHTML = "<h3>" + esc(title) + "</h3>" +
      (success && card && awarded.length ? '<p>You earned a Field Journal card!</p><img src="assets/img/journal/' + card.img + '" alt="' + esc(card.name) + '"><p><b>' + esc(card.name) + "</b></p>" : (success ? "<p>You already have this card — well paddled!</p>" : "<p>Skip is always OK. You can try this bonus again in a later case.</p>")) +
      "<p>" + esc(fact) + "</p>" +
      '<p class="small">' + esc(srcLine) + "</p>" +
      '<button type="button" class="btn primary" id="mini-done">Continue</button>';
    stage.appendChild(end);
    var ctr = document.getElementById("mini-controls");
    if (ctr) ctr.style.display = "none";
    document.querySelectorAll("#mini-root .mini-hud").forEach(function (n) { n.style.display = "none"; });
    if (success && awarded.length && window.SFX) SFX.play("reveal");
    else if (success && window.SFX) SFX.play("correct");
    document.getElementById("mini-done").onclick = function () {
      var cb = onEndCb; closeRoot(); if (cb) cb({ which: which, success: success, awarded: awarded });
    };
    if (window.READALOUD && READALOUD.afterScreen) READALOUD.afterScreen(end);
  }

  function forceComplete(which) {
    if (!root || mode !== which) start(which, { forceComplete: true });
    else if (which === "canoe") { if (canoe) canoe.shells = Math.max(canoe.shells, 4); finishCanoe(true); }
    else if (which === "sort" && sortState && sortState.place) {
      SORT_ITEMS.forEach(function (it) { sortState.place(it.id, it.zone); });
    }
  }


  function creditsHtml() {
    return '<h2>Mini-game painted art</h2>' +
      '<p class="small">Marsh Canoe Dash and Place the Landmarks use original painted sprites created for this game (graphic-novel style), stored as WebP in <code>assets/img/minigames/</code>. The canoe shows the player\'s chosen detective using their existing painted portrait. Landmark tokens use Field Journal card thumbnails. License: original work for this game (not photographs of real people or places).</p>';
  }

  function hook() {
    /* offers are triggered from JOURNAL.afterFrame via onSceneReady */
  }
  hook();

  return {
    DURATION: DURATION, offer: offer, start: start, skip: skip, close: closeRoot,
    onSceneReady: onSceneReady, forceComplete: forceComplete, wasOffered: wasOffered, wasDone: wasDone,
    isOpen: function () { return !!root; }, mode: function () { return mode; },
    ended: function () { return ended; }, creditsHtml: creditsHtml, preloadArt: preloadArt
  };
})();
