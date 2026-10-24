/* Temporary teacher debug: screen capture + report (?debug in URL). */
(function () {
  "use strict";

  function isDebugMode() {
    try {
      return new URLSearchParams(location.search).has("debug");
    } catch (e) {
      return /(?:^|[?&])debug(?:[=&]|$)/.test(location.search);
    }
  }

  if (!isDebugMode()) return;

  var html2canvasPromise = null;
  var panelEl = null;
  var btnEl = null;
  var currentBlob = null;
  var currentFilename = "";

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function formatTimestamp(d) {
    return (
      d.getFullYear() +
      "-" +
      pad2(d.getMonth() + 1) +
      "-" +
      pad2(d.getDate()) +
      " " +
      pad2(d.getHours()) +
      ":" +
      pad2(d.getMinutes()) +
      ":" +
      pad2(d.getSeconds())
    );
  }

  function formatFilenameStamp(d) {
    return (
      d.getFullYear() +
      pad2(d.getMonth() + 1) +
      pad2(d.getDate()) +
      "-" +
      pad2(d.getHours()) +
      pad2(d.getMinutes()) +
      pad2(d.getSeconds())
    );
  }

  function getSceneId() {
    try {
      if (window.FTB && FTB.state) {
        var st = FTB.state();
        if (st && st.scene) return st.scene;
      }
      if (window.FTBX && FTBX.S) {
        var s = FTBX.S();
        if (s && s.scene) return s.scene;
      }
      var key = typeof SAVE_KEY !== "undefined" ? SAVE_KEY : "ftb_case1_save_v3";
      var raw = localStorage.getItem(key);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.scene) return parsed.scene;
      }
    } catch (err) { /* ignore */ }
    return "unknown";
  }

  function injectStyles() {
    if (document.getElementById("dbg-report-styles")) return;
    var css =
      ".dbg-report-btn{position:fixed;left:10px;bottom:10px;z-index:88;padding:8px 12px;font-size:14px;font-weight:600;" +
      "border-radius:999px;border:2px solid #6d28d9;background:#fff;color:#1e1b4b;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;-webkit-tap-highlight-color:transparent}" +
      ".dbg-report-btn:active{transform:scale(.97)}" +
      ".dbg-report-btn.busy{opacity:.65;pointer-events:none}" +
      ".dbg-report-backdrop{position:fixed;inset:0;z-index:95;background:rgba(5,12,24,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px;box-sizing:border-box}" +
      ".dbg-report-panel{position:relative;z-index:96;width:min(420px,100%);max-height:min(88vh,720px);overflow:auto;background:#fff;border-radius:16px 16px 12px 12px;" +
      "box-shadow:0 16px 40px rgba(0,0,0,.35);padding:14px 14px 12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}" +
      ".dbg-report-panel h3{margin:0 0 8px;font-size:17px}" +
      ".dbg-report-preview{width:100%;border-radius:8px;border:1px solid #cbd5e1;background:#f1f5f9;display:block;max-height:42vh;object-fit:contain}" +
      ".dbg-report-note{width:100%;min-height:72px;margin:10px 0 8px;padding:10px;border-radius:10px;border:1px solid #94a3b8;font-size:16px;box-sizing:border-box;resize:vertical}" +
      ".dbg-report-actions{display:flex;flex-wrap:wrap;gap:8px}" +
      ".dbg-report-actions button{flex:1 1 auto;min-width:90px;padding:10px 12px;border-radius:10px;border:none;font-size:15px;font-weight:600;cursor:pointer}" +
      ".dbg-report-save{background:#2563eb;color:#fff}" +
      ".dbg-report-share{background:#059669;color:#fff}" +
      ".dbg-report-close{background:#e2e8f0;color:#0f172a}";
    var style = document.createElement("style");
    style.id = "dbg-report-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (html2canvasPromise) return html2canvasPromise;
    html2canvasPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "js/vendor/html2canvas.min.js";
      script.async = true;
      script.onload = function () {
        if (window.html2canvas) resolve(window.html2canvas);
        else reject(new Error("html2canvas missing after load"));
      };
      script.onerror = function () {
        reject(new Error("html2canvas load failed"));
      };
      document.head.appendChild(script);
    });
    return html2canvasPromise;
  }

  function wrapLines(ctx, text, maxWidth) {
    var lines = [];
    var paragraphs = String(text || "").split(/\n/);
    paragraphs.forEach(function (para) {
      var words = para.split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        return;
      }
      var line = words[0];
      for (var i = 1; i < words.length; i++) {
        var test = line + " " + words[i];
        if (ctx.measureText(test).width <= maxWidth) line = test;
        else {
          lines.push(line);
          line = words[i];
        }
      }
      lines.push(line);
    });
    return lines.length ? lines : [""];
  }

  function buildCaptionLines(note, sceneId, when) {
    var lines = [];
    if (note) lines.push("Note: " + note);
    lines.push("Scene: " + sceneId);
    lines.push("Captured: " + formatTimestamp(when));
    lines.push("URL: " + location.pathname + location.search);
    return lines;
  }

  function drawCaptionStrip(ctx, w, captionLines, fontSize) {
    var pad = 12;
    var lineHeight = Math.round(fontSize * 1.35);
    var maxText = w - pad * 2;
    ctx.font = fontSize + "px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    var wrapped = [];
    captionLines.forEach(function (line) {
      wrapLines(ctx, line, maxText).forEach(function (wl) {
        wrapped.push(wl);
      });
    });
    var stripH = pad * 2 + wrapped.length * lineHeight;
    return { lines: wrapped, stripH: stripH, pad: pad, lineHeight: lineHeight, fontSize: fontSize };
  }

  function compositeWithCaption(sourceCanvas, note, sceneId, when) {
    var w = sourceCanvas.width;
    var h = sourceCanvas.height;
    var scale = w > 1200 ? 1200 / w : 1;
    if (scale < 1) {
      var scaled = document.createElement("canvas");
      scaled.width = Math.round(w * scale);
      scaled.height = Math.round(h * scale);
      scaled.getContext("2d").drawImage(sourceCanvas, 0, 0, scaled.width, scaled.height);
      sourceCanvas = scaled;
      w = sourceCanvas.width;
      h = sourceCanvas.height;
    }
    var measure = document.createElement("canvas").getContext("2d");
    var fontSize = Math.max(12, Math.round(w * 0.028));
    var cap = drawCaptionStrip(measure, w, buildCaptionLines(note, sceneId, when), fontSize);
    var out = document.createElement("canvas");
    out.width = w;
    out.height = h + cap.stripH;
    var ctx = out.getContext("2d");
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, h, w, cap.stripH);
    ctx.fillStyle = "#f8fafc";
    ctx.font = fontSize + "px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    cap.lines.forEach(function (line, i) {
      ctx.fillText(line, cap.pad, h + cap.pad + (i + 1) * cap.lineHeight - Math.round(fontSize * 0.25));
    });
    return out;
  }

  function textOnlyReportCanvas() {
    var w = Math.min(390, Math.max(320, document.documentElement.clientWidth || 390));
    var fontSize = 14;
    var bodyH = 120;
    var out = document.createElement("canvas");
    out.width = w;
    out.height = bodyH;
    var ctx = out.getContext("2d");
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, w, bodyH);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText("Trailblazers debug report", 12, 28);
    ctx.font = fontSize + "px system-ui, sans-serif";
    ctx.fillText("Screen capture failed — text report only.", 12, 56);
    ctx.fillText("Add details in the note below, then save.", 12, 78);
    return out;
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve, reject) {
      if (canvas.toBlob) {
        canvas.toBlob(function (b) {
          if (b) resolve(b);
          else reject(new Error("toBlob failed"));
        }, "image/png");
      } else {
        try {
          var data = atob(canvas.toDataURL("image/png").split(",")[1]);
          var arr = new Uint8Array(data.length);
          for (var i = 0; i < data.length; i++) arr[i] = data.charCodeAt(i);
          resolve(new Blob([arr], { type: "image/png" }));
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  function setBusy(busy) {
    if (!btnEl) return;
    btnEl.classList.toggle("busy", busy);
    btnEl.textContent = busy ? "⏳ Capturing…" : "🐞 Report";
  }

  function hideReportUi() {
    if (btnEl) btnEl.style.display = "none";
    if (panelEl && panelEl.parentNode) panelEl.parentNode.style.display = "none";
  }

  function showReportUi() {
    if (btnEl) btnEl.style.display = "";
    if (panelEl && panelEl.parentNode) panelEl.parentNode.style.display = "";
  }

  function closePanel() {
    if (panelEl && panelEl.parentNode) panelEl.parentNode.remove();
    panelEl = null;
    currentBlob = null;
  }

  function canShareFiles(blob) {
    if (!navigator.share || !navigator.canShare) return false;
    try {
      var f = new File([blob], currentFilename || "report.png", { type: "image/png" });
      return navigator.canShare({ files: [f] });
    } catch (e) {
      return false;
    }
  }

  function openPanel(rawCanvas, sceneId, capturedAt) {
    closePanel();
    var backdrop = document.createElement("div");
    backdrop.className = "dbg-report-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-label", "Report a problem");

    panelEl = document.createElement("div");
    panelEl.className = "dbg-report-panel";
    panelEl.innerHTML =
      "<h3>Report a problem</h3>" +
      '<img class="dbg-report-preview" alt="Screenshot preview">' +
      '<label for="dbg-report-note">What\'s wrong?</label>' +
      '<textarea id="dbg-report-note" class="dbg-report-note" placeholder="Describe what you saw…"></textarea>' +
      '<div class="dbg-report-actions">' +
      '<button type="button" class="dbg-report-save">Save image</button>' +
      '<button type="button" class="dbg-report-share" hidden>Share</button>' +
      '<button type="button" class="dbg-report-close">Close</button>' +
      "</div>";

    backdrop.appendChild(panelEl);
    document.body.appendChild(backdrop);

    var previewImg = panelEl.querySelector(".dbg-report-preview");
    var noteEl = panelEl.querySelector("#dbg-report-note");
    var saveBtn = panelEl.querySelector(".dbg-report-save");
    var shareBtn = panelEl.querySelector(".dbg-report-share");
    var closeBtn = panelEl.querySelector(".dbg-report-close");
    var previewObjectUrl = null;

    function refreshPreview() {
      var note = noteEl.value.trim();
      var canvas = compositeWithCaption(rawCanvas, note, sceneId, capturedAt);
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
      return canvasToBlob(canvas).then(function (blob) {
        previewObjectUrl = URL.createObjectURL(blob);
        previewImg.src = previewObjectUrl;
        if (canShareFiles(blob)) shareBtn.hidden = false;
      });
    }

    refreshPreview();
    noteEl.addEventListener("input", function () {
      refreshPreview();
    });

    closeBtn.onclick = function () {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
      closePanel();
    };
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeBtn.onclick();
    });

    function finalCanvas() {
      return compositeWithCaption(rawCanvas, noteEl.value.trim(), sceneId, capturedAt);
    }

    saveBtn.onclick = function () {
      currentFilename = "trailblazers-report-" + formatFilenameStamp(capturedAt) + ".png";
      canvasToBlob(finalCanvas()).then(function (blobOut) {
        currentBlob = blobOut;
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blobOut);
        a.download = currentFilename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 500);
      });
    };

    shareBtn.onclick = function () {
      currentFilename = "trailblazers-report-" + formatFilenameStamp(capturedAt) + ".png";
      canvasToBlob(finalCanvas()).then(function (blobOut) {
        currentBlob = blobOut;
        var file = new File([blobOut], currentFilename, { type: "image/png" });
        return navigator.share({
          title: "Trailblazers report",
          text: noteEl.value.trim() || "Problem report",
          files: [file],
        });
      }).catch(function () { /* user cancelled */ });
    };
  }

  function captureAndShow() {
    var sceneId = getSceneId();
    var when = new Date();
    setBusy(true);
    hideReportUi();

    loadHtml2Canvas()
      .then(function (h2c) {
        return h2c(document.body, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          scale: Math.min(window.devicePixelRatio || 1, 2),
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
          ignoreElements: function (el) {
            return el.classList && (el.classList.contains("dbg-report-btn") || el.classList.contains("dbg-report-backdrop"));
          },
        });
      })
      .catch(function () {
        return null;
      })
      .then(function (canvas) {
        var raw = canvas;
        if (!raw) raw = textOnlyReportCanvas();
        showReportUi();
        setBusy(false);
        openPanel(raw, sceneId, when);
      })
      .catch(function () {
        showReportUi();
        setBusy(false);
        openPanel(textOnlyReportCanvas(), sceneId, when);
      });
  }

  function init() {
    injectStyles();
    btnEl = document.createElement("button");
    btnEl.type = "button";
    btnEl.className = "dbg-report-btn";
    btnEl.textContent = "🐞 Report";
    btnEl.setAttribute("aria-label", "Report a problem (debug)");
    btnEl.onclick = function () {
      if (panelEl) return;
      captureAndShow();
    };
    document.body.appendChild(btnEl);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
