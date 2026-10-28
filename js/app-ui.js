/* ---------- Context menu ---------- */
function showContextMenu(x, y, items) {
  hideContextMenu();
  const menu = document.createElement("div");
  menu.className = "ctx-menu";

  // ── ✕ Close-Bar — nur außerhalb Piano Roll ──
  if (!prEditor) {
    const closeBar = document.createElement("div");
    closeBar.style.cssText =
      "display:flex;justify-content:flex-end;align-items:center;" +
      "padding:2px 4px 2px 8px;border-bottom:1px solid #333;";
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.title = "Close (Esc)";
    closeBtn.setAttribute("aria-label", "Close menu");
    closeBtn.style.cssText =
      "background:transparent;color:#aaa;border:none;cursor:pointer;" +
      "font-size:11px;padding:2px 6px;border-radius:3px;line-height:1;";
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.background = "#c62828";
      closeBtn.style.color = "#fff";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.background = "transparent";
      closeBtn.style.color = "#aaa";
    });
    closeBtn.addEventListener("mousedown", (ev) => ev.stopPropagation());
    closeBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      hideContextMenu();
    });
    closeBar.appendChild(closeBtn);
    menu.appendChild(closeBar);
  }

  items.forEach((item) => {
    if (item === "---") {
      const s = document.createElement("div");
      s.className = "ctx-sep";
      menu.appendChild(s);
      return;
    }
    if (item.header) {
      const h = document.createElement("div");
      h.className = "ctx-header";
      h.textContent = item.header;
      menu.appendChild(h);
      return;
    }
    const el = document.createElement("div");
    el.className = "ctx-item" + (item.disabled ? " disabled" : "");
    const lbl = document.createElement("span");
    lbl.textContent = item.label;
    el.appendChild(lbl);
    if (item.shortcut) {
      const sc = document.createElement("span");
      sc.className = "ctx-shortcut";
      sc.textContent = item.shortcut;
      el.appendChild(sc);
    }
    if (!item.disabled) {
      el.addEventListener("mousedown", (ev) => ev.stopPropagation());
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        hideContextMenu();
        try {
          item.action();
        } catch (err) {
          toast("Error: " + err.message, "error");
        }
      });
    }
    menu.appendChild(el);
  });
  document.body.appendChild(menu);
  const r = menu.getBoundingClientRect();
  let nx = x,
    ny = y;
  // Flip left if the menu would overflow the right edge
  if (x + r.width > window.innerWidth - 4) nx = x - r.width;
  // Flip UP if the menu would overflow the bottom edge
  if (y + r.height > window.innerHeight - 4) ny = y - r.height;
  // Clamp into the viewport
  if (nx < 4) nx = 4;
  if (ny < 4) ny = 4;
  menu.style.left = nx + "px";
  menu.style.top = ny + "px";
}
function hideContextMenu() {
  document.querySelectorAll(".ctx-menu").forEach((m) => m.remove());
}
document.addEventListener("click", hideContextMenu, true);
document.addEventListener(
  "contextmenu",
  (e) => {
    if (e.target.closest(".ctx-menu")) e.preventDefault();
  },
  true
);
window.addEventListener("blur", hideContextMenu);

/* ---------- Toast / Modal ---------- */
function toast(msg, type) {
  const c = document.getElementById("toastContainer");
  const el = document.createElement("div");
  el.className = "toast" + (type ? " " + type : "");
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .3s";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 320);
  }, 2400);
}
const modalOverlay = document.getElementById("modalOverlay");
let micCaptureSession = null;
function showModal(title, content, actions) {
  modalOverlay.innerHTML = "";
  const m = document.createElement("div");
  m.className = "modal";

  // ── Header mit Titel + ✕ ──
  const header = document.createElement("div");
  header.style.cssText =
    "display:flex;align-items:center;gap:10px;margin:0 0 4px 0;";

  const h = document.createElement("h3");
  h.textContent = title;
  h.style.margin = "0";
  h.style.flex = "1";
  h.style.overflow = "hidden";
  h.style.textOverflow = "ellipsis";
  h.style.whiteSpace = "nowrap";
  header.appendChild(h);

  // Cancel-Handler bestimmen: bevorzuge expliziten "Cancel"/"Close"-Action-Handler
  const cancelAction = actions.find(
    (a) => (a.label === "Cancel" || a.label === "Close") && !a.className
  );
  const onClose = cancelAction ? cancelAction.onClick : hideModal;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.title = "Close (Esc)";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.style.cssText =
    "background:#3a3a3a;color:#ddd;border:1px solid #000;border-radius:4px;" +
    "width:28px;height:28px;padding:0;cursor:pointer;font-size:14px;line-height:1;" +
    "display:flex;align-items:center;justify-content:center;flex-shrink:0;" +
    "transition:background .12s;";
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "#c62828";
    closeBtn.style.color = "#fff";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "#3a3a3a";
    closeBtn.style.color = "#ddd";
  });
  closeBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    try {
      onClose();
    } catch (e) {
      console.warn("Modal close failed:", e);
      hideModal();
    }
  });
  header.appendChild(closeBtn);

  m.appendChild(header);
  m.appendChild(content);

  const w = document.createElement("div");
  w.className = "modal-actions";
  actions.forEach((a) => {
    const b = document.createElement("button");
    b.textContent = a.label;
    if (a.className) b.className = a.className;
    b.addEventListener("click", a.onClick);
    w.appendChild(b);
  });
  m.appendChild(w);
  modalOverlay.appendChild(m);
  modalOverlay.classList.remove("hidden");

  // Close-Handler am Overlay merken, damit ESC auch den richtigen nimmt
  modalOverlay._closeHandler = onClose;
}
function releaseMicCaptureSession() {
  const session = micCaptureSession;
  if (!session) return;
  micCaptureSession = null;
  session.isRecording = false;

  if (session.workletNode) {
    try {
      session.workletNode.port.postMessage("stop");
    } catch (e) {}
    try {
      session.workletNode.port.onmessage = null;
    } catch (e) {}
    try {
      session.workletNode.disconnect();
    } catch (e) {}
    session.workletNode = null;
  }
  if (session.source) {
    try {
      session.source.disconnect();
    } catch (e) {}
    session.source = null;
  }
  if (session.silentGain) {
    try {
      session.silentGain.disconnect();
    } catch (e) {}
    session.silentGain = null;
  }
  if (session.stream) {
    try {
      session.stream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch (e) {}
      });
    } catch (e) {}
    session.stream = null;
  }
  if (session.previewSource) {
    try {
      session.previewSource.stop();
    } catch (e) {}
    session.previewSource = null;
  }
}
function hideModal() {
  releaseMicCaptureSession();
  modalOverlay._closeHandler = null;
  modalOverlay.classList.add("hidden");
  modalOverlay.innerHTML = "";
}

/* ---------- AutoSave ---------- */
const STORAGE_KEY = "flclone_v15";
const BACKUP_KEY = "flclone_v15_backup";
function autoSave() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) localStorage.setItem(BACKUP_KEY, current);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize()));
  } catch (e) {}
}
async function tryLoadAutoSave() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (!r) return false;
    return apply(JSON.parse(r)).ok;
  } catch (e) {
    return false;
  }
}

/* ---------- Rack ---------- */
const tracksContainer = document.getElementById("tracks");
const stepEls = {},
  ledEls = {};

let stepSelectedKeys = new Set();
function stepKey(trackId, step) {
  return trackId + ":" + step;
}
function isStepSelected(trackId, step) {
  return stepSelectedKeys.has(stepKey(trackId, step));
}
function clearStepSelection() {
  stepSelectedKeys.clear();
  document
    .querySelectorAll(".step.selected")
    .forEach((el) => el.classList.remove("selected"));
}
function updateStepSelectionVisual() {
  document.querySelectorAll(".step").forEach((el) => {
    const sel = isStepSelected(el.dataset.trackId, parseInt(el.dataset.step));
    el.classList.toggle("selected", sel);
  });
}
function deleteSelectedSteps() {
  if (!stepSelectedKeys.size) return;
  pushHistory();
  const pat = patterns[currentPattern];
  stepSelectedKeys.forEach((key) => {
    const [tid, st] = key.split(":");
    const step = parseInt(st);
    const t = TRACKS.find((x) => x.id === tid);
    if (!t) return;
    if (t.type === "melodic") {
      pat.pianoRoll[tid] = pat.pianoRoll[tid].filter(
        (n) => Math.floor(n.start) !== step
      );
    } else {
      pat.steps[tid][step] = null;
    }
  });
  syncMelodicSteps(pat);
  clearStepSelection();
  rebuildRack();
  autoSave();
  toast("Deleted selected steps", "success");
}

function rebuildRack() {
  if (!tracksContainer) return;
  tracksContainer.innerHTML = "";
  Object.keys(stepEls).forEach((k) => delete stepEls[k]);
  Object.keys(ledEls).forEach((k) => delete ledEls[k]);
  const pat = patterns[currentPattern];

  TRACKS.forEach((track) => {
    const row = document.createElement("div");
    row.className = "track" + (track.type === "sample" ? " sample-track" : "");
    row.dataset.trackId = track.id;

    const nameCell = document.createElement("div");
    nameCell.className = "track-name";
    const led = document.createElement("div");
    led.className = "led";
    led.style.background = track.color;
    led.style.opacity = 1;
    ledEls[track.id] = led;
    const label = document.createElement("span");
    label.className = "name";
    label.textContent = track.name;
    nameCell.appendChild(led);
    // Preset-Tag: nur bei melodischen Tracks mit gesetztem Preset
    if (track.type === "melodic" && track.presetName) {
      const presetSpan = document.createElement("span");
      presetSpan.textContent = "(" + track.presetName + ")";
      presetSpan.title = "Active preset: " + track.presetName;
      presetSpan.style.cssText =
        "color:var(--accent2);font-size:9px;font-style:italic;" +
        "flex-shrink:0;opacity:0.85;";
      nameCell.appendChild(presetSpan);
    }
    nameCell.appendChild(label);

    if (track.type === "melodic") {
      const pr = document.createElement("button");
      pr.className = "mini-btn";
      pr.textContent = "🎹";
      pr.title = "Open piano roll";
      pr.addEventListener("click", () => openPianoRoll(track.id));
      nameCell.appendChild(pr);

      const synthBtn = document.createElement("button");
      synthBtn.className = "mini-btn";
      synthBtn.textContent = "⚙️";
      synthBtn.title = "Open synth editor";
      synthBtn.addEventListener("click", () => openSynthEditor(track.id));
      nameCell.appendChild(synthBtn);
    }
    if (track.type === "sample") {
      const s = samples[track.id];
      const fn = document.createElement("span");
      fn.className = "sample-name";
      fn.textContent = s ? (s.missing ? "⚠ " + s.name : s.name) : "(empty)";
      if (s && s.missing) fn.style.color = "#c62828";
      nameCell.appendChild(fn);
      const imp = document.createElement("button");
      imp.className = "mini-btn";
      imp.textContent = "📁";
      imp.title = "Import audio file";
      imp.setAttribute("aria-label", "Import audio file");
      imp.addEventListener("click", () => importSample(track.id));
      nameCell.appendChild(imp);
      const rec = document.createElement("button");
      rec.className = "mini-btn";
      rec.textContent = "🎙";
      rec.title = "Record with microphone";
      rec.setAttribute("aria-label", "Record with microphone");
      rec.addEventListener("click", () => showMicRecordModal(track.id));
      nameCell.appendChild(rec);
      if (s && !s.missing) {
        const edit = document.createElement("button");
        edit.className = "mini-btn";
        edit.textContent = "✂️";
        edit.title = "Edit sample (trim, reverse, gain, fade, slice)";
        edit.setAttribute("aria-label", "Edit sample");
        edit.addEventListener("click", () => showSampleEditor(track.id));
        nameCell.appendChild(edit);

        // 🎹 Piano-Roll-Button (chromatic play)
        const prBtn = document.createElement("button");
        prBtn.className = "mini-btn";
        prBtn.textContent = "🎹";
        prBtn.title = "Open sample piano roll (chromatic pitch-shift)";
        prBtn.addEventListener("click", () => openPianoRoll(track.id));
        nameCell.appendChild(prBtn);

        // Noten-Indikator
        const prNotes = (pat.pianoRoll && pat.pianoRoll[track.id]) || [];
        if (prNotes.length > 0) {
          const ind = document.createElement("span");
          ind.style.cssText =
            "font-size:9px;color:var(--accent);margin-left:2px;font-family:monospace;";
          ind.textContent = "🎹 " + prNotes.length;
          ind.title =
            prNotes.length +
            " piano-roll notes (root: " +
            midiToName(track.rootMidi || 60) +
            ")";
          nameCell.appendChild(ind);
        }
      }
    }
    // ── v17.1: Drum-Track-Preset-Anzeige + Selector ──
    if (track.type === "drum") {
      // Preset-Name (falls gesetzt) — vor dem Label, damit's wie bei melodic aussieht
      const dpresets =
        typeof DRUM_PRESETS !== "undefined" ? DRUM_PRESETS[track.id] : null;
      if (track.drumPresetId && dpresets && dpresets[track.drumPresetId]) {
        const pName = dpresets[track.drumPresetId].name;
        const presetSpan = document.createElement("span");
        presetSpan.textContent = "(" + pName + ")";
        presetSpan.style.cssText =
          "color:var(--accent2);font-size:9px;font-style:italic;cursor:pointer;" +
          "flex-shrink:0;opacity:0.85;";
        presetSpan.title = "Active preset: " + pName + " — click to change";
        presetSpan.addEventListener("click", (e) => {
          e.stopPropagation();
          showDrumPresetSelector(track.id);
        });
        // Vor dem Label einfügen
        nameCell.insertBefore(presetSpan, label);
      }

      // Selector-Button
      const drumSelBtn = document.createElement("button");
      drumSelBtn.className = "mini-btn";
      drumSelBtn.textContent = "🥁";
      drumSelBtn.title = "Change " + track.name + " preset";
      drumSelBtn.addEventListener("click", () =>
        showDrumPresetSelector(track.id)
      );
      nameCell.appendChild(drumSelBtn);
    }

    nameCell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, [
        { header: track.name },
        {
          label: "Reset filter",
          action: () => {
            pushHistory();
            track.filter.cutoff = 20000;
            track.filter.q = 0.7;
            if (buses[track.id]?.filter) {
              buses[track.id].filter.frequency.value = 20000;
              buses[track.id].filter.Q.value = 0.7;
            }
            toast("Filter reset", "success");
            autoSave();
          },
        },
        {
          label: "Clear all steps in Pattern " + currentPattern,
          action: () => {
            pushHistory();
            const p = patterns[currentPattern];
            if (track.type === "melodic") p.pianoRoll[track.id] = [];
            else p.steps[track.id] = new Array(64).fill(null);
            syncMelodicSteps(p);
            rebuildRack();
            autoSave();
          },
        },
        "---",
        {
          label: "Reverse Pattern",
          action: () => {
            reversePattern();
          },
        },
        {
          label: "Shift Pattern Right",
          action: () => {
            shiftPattern(1);
          },
        },
        {
          label: "Shift Pattern Left",
          action: () => {
            shiftPattern(-1);
          },
        },
        "---",
        {
          label: "Open effect chain…",
          action: () => {
            setView("mixer");
            openFxPanel(track.id);
          },
        },
        {
          label: "Export sample as WAV",
          disabled: !samples[track.id] || samples[track.id].missing,
          action: () => exportSampleAsWav(track.id),
        },
        {
          label: "Drum Kit wählen… (alle)",
          disabled: track.type !== "drum",
          action: () => showDrumKitSelector(),
        },
        {
          label: track.name + " Preset wählen…",
          disabled: track.type !== "drum",
          action: () => showDrumPresetSelector(track.id),
        },
        {
          label: "↺ Reset to Kit Default",
          disabled: track.type !== "drum" || !track.drumPresetId,
          action: () => {
            pushHistory();
            if (typeof setTrackDrumPreset === "function")
              setTrackDrumPreset(track.id, null);
            else track.drumPresetId = null;
            autoSave();
            rebuildRack();
            toast(track.name + " preset reset", "success");
          },
        },
        {
          label: "Chord Progression…",
          disabled: track.type !== "melodic",
          action: () => showChordProgressionDialog(track.id),
        },
        "---",
        "---",
        {
          label: "Mute " + (track.mute ? "off" : "on"),
          action: () => {
            pushHistory();
            track.mute = !track.mute;
            refreshAllGains();
            if (currentView === "mixer") rebuildMixer();
            autoSave();
          },
        },
        {
          label: "Solo " + (track.solo ? "off" : "on"),
          action: () => {
            pushHistory();
            track.solo = !track.solo;
            refreshAllGains();
            if (currentView === "mixer") rebuildMixer();
            autoSave();
          },
        },
        {
          label: "Reset volume",
          action: () => {
            pushHistory();
            track.volume = 0.8;
            applyTrackGain(track);
            if (currentView === "rack") rebuildRack();
            if (currentView === "mixer") rebuildMixer();
            autoSave();
          },
        },
      ]);
    });

    const wrap = document.createElement("div");
    wrap.className = "steps-wrap";
    const stepsCell = document.createElement("div");
    stepsCell.className = "steps";
    stepsCell.style.gridTemplateColumns = `repeat(${stepCount}, minmax(14px,1fr))`;
    stepsCell.style.gridAutoRows = "1fr";
    stepsCell.dataset.trackId = track.id;
    const arr = [];
    const noSample =
      track.type === "sample" &&
      (!samples[track.id] || samples[track.id].missing);
    const hasPR =
      track.type === "sample" &&
      pat.pianoRoll &&
      pat.pianoRoll[track.id] &&
      pat.pianoRoll[track.id].length > 0;
    for (let i = 0; i < stepCount; i++) {
      const s = document.createElement("div");
      s.className =
        "step" + (i % 4 === 0 ? " beat" : "") + (noSample ? " empty" : "");
      s.dataset.step = i;
      s.dataset.trackId = track.id;

      let sd;
      if (hasPR) {
        sd = pat.pianoRoll[track.id].some((n) => Math.floor(n.start) === i)
          ? defaultStep()
          : null;
      } else {
        sd = getStepData(pat, track.id, i);
      }

      if (sd) {
        s.classList.add("on");
        if (sd.accent) s.classList.add("accent");
        if (sd.ratchet > 1) s.classList.add("ratchet");
        if (sd.prob < 1) s.classList.add("prob");
        const vr = (sd.vel || 100) / 127;
        s.style.opacity = (0.5 + 0.5 * vr).toFixed(2);
        if (sd.ratchet > 1) {
          const t = document.createElement("span");
          t.className = "ratchet-tag";
          t.textContent = "x" + sd.ratchet;
          s.appendChild(t);
        }
        if (sd.prob < 1) {
          const t = document.createElement("span");
          t.className = "prob-tag";
          t.textContent = Math.round(sd.prob * 100) + "%";
          s.appendChild(t);
        }
      }
      if (isStepSelected(track.id, i)) s.classList.add("selected");
      if (!noSample) {
        s.addEventListener("mousedown", onStepMouseDown);
        s.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          if (track.type === "melodic") return;
          openStepEditor(track, i, e.clientX, e.clientY);
        });
      }
      stepsCell.appendChild(s);
      arr.push(s);
    }
    stepEls[track.id] = arr;
    wrap.appendChild(stepsCell);

    const volCell = document.createElement("div");
    volCell.className = "vol";
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1.2";
    slider.step = "0.01";
    slider.value = track.volume;
    slider.addEventListener("input", () => {
      track.volume = parseFloat(slider.value);
      applyTrackGain(track);
      const m = document.querySelector(
        `.strip[data-track="${track.id}"] .fader`
      );
      if (m) m.value = track.volume;
      autoSave();
    });
    volCell.appendChild(slider);

    row.appendChild(nameCell);
    row.appendChild(wrap);
    row.appendChild(volCell);
    tracksContainer.appendChild(row);
  });
  document
    .querySelectorAll(".step-count")
    .forEach((b) =>
      b.classList.toggle("active", parseInt(b.dataset.count) === stepCount)
    );
  document.querySelectorAll(".pattern").forEach((b) => {
    b.classList.toggle("active", b.dataset.pattern === currentPattern);
    // v19: Farbe
    const pid = b.dataset.pattern;
    if (patternMeta[pid]) {
      if (b.classList.contains("active")) {
        b.style.background = patternMeta[pid].color;
        b.style.color = "#111";
      } else {
        b.style.background = "";
        b.style.color = "";
      }
    }
  });
  // v19: Rechtsklick-Kontextmenü
  document.querySelectorAll(".pattern").forEach((btn) => {
    if (btn.dataset.ctxBound) return;
    btn.dataset.ctxBound = "1";
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showPatternContextMenu(btn.dataset.pattern, e.clientX, e.clientY);
    });
  });
  // v19: Rechtsklick-Kontextmenü an Pattern-Buttons
  document.querySelectorAll(".pattern").forEach((btn) => {
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showPatternContextMenu(btn.dataset.pattern, e.clientX, e.clientY);
    });
    // Farbe anwenden
    const pid = btn.dataset.pattern;
    if (patternMeta[pid]) {
      btn.style.background = patternMeta[pid].color;
      btn.style.color = "#111";
      if (patternMeta[pid].name && patternMeta[pid].name !== "Pattern " + pid) {
        btn.title = patternMeta[pid].name;
      }
    }
  });
}

function toggleMainStep(track, step, el) {
  const pat = patterns[currentPattern];

  // Piano-Roll-Modus für melodische UND Sample-Tracks (wenn bereits Noten vorhanden)
  const hasPR =
    pat.pianoRoll &&
    pat.pianoRoll[track.id] &&
    pat.pianoRoll[track.id].length > 0;
  const isPianoMode =
    track.type === "melodic" || (track.type === "sample" && hasPR);

  if (isPianoMode) {
    if (!pat.pianoRoll[track.id]) pat.pianoRoll[track.id] = [];
    const ex = pat.pianoRoll[track.id].filter(
      (n) => Math.floor(n.start) === step
    );
    if (ex.length) {
      pat.pianoRoll[track.id] = pat.pianoRoll[track.id].filter(
        (n) => Math.floor(n.start) !== step
      );
    } else {
      const dm =
        track.type === "melodic"
          ? track.id === "bass"
            ? 36
            : 60
          : track.rootMidi || 60;
      pat.pianoRoll[track.id].push({
        id: genId("n"),
        start: step,
        len: 1,
        midi: dm,
        vel: 100,
      });
    }
    if (track.type === "melodic") syncMelodicSteps(pat);
  } else {
    if (isStepOn(pat, track.id, step)) pat.steps[track.id][step] = null;
    else pat.steps[track.id][step] = defaultStep();
  }
  rebuildRack();
  autoSave();
}

/* --- Pattern Tools --- */
function reversePattern() {
  pushHistory();
  const pat = patterns[currentPattern];
  TRACKS.forEach((track) => {
    if (track.type === "melodic") {
      pat.pianoRoll[track.id].forEach((n) => {
        n.start = Math.max(0, stepCount - 1 - n.start - n.len + 1);
      });
    } else {
      const newSteps = new Array(64).fill(null);
      for (let i = 0; i < stepCount; i++) {
        newSteps[stepCount - 1 - i] = pat.steps[track.id][i];
      }
      pat.steps[track.id] = newSteps;
    }
  });
  rebuildRack();
  autoSave();
  toast("Pattern reversed", "success");
}

function shiftPattern(dir) {
  pushHistory();
  const pat = patterns[currentPattern];
  TRACKS.forEach((track) => {
    if (track.type === "melodic") {
      pat.pianoRoll[track.id].forEach((n) => {
        n.start = (n.start + dir + stepCount) % stepCount;
      });
    } else {
      const arr = pat.steps[track.id];
      if (dir > 0) {
        const last = arr[stepCount - 1];
        for (let i = stepCount - 1; i > 0; i--) {
          arr[i] = arr[i - 1];
        }
        arr[0] = last;
      } else {
        const first = arr[0];
        for (let i = 0; i < stepCount - 1; i++) {
          arr[i] = arr[i + 1];
        }
        arr[stepCount - 1] = first;
      }
    }
  });
  rebuildRack();
  autoSave();
  toast("Pattern shifted", "success");
}

function generateBeat() {
  pushHistory();
  const pat = patterns[currentPattern];
  const genres = ["house", "techno", "breakbeat"];
  const genre = genres[Math.floor(Math.random() * genres.length)];
  const seed = Math.random().toString(36).slice(2, 8);

  const rand = (s) => hashToUnit(seed + s);

  ["kick", "snare", "hat", "openhat", "clap", "tom"].forEach((tid) => {
    pat.steps[tid] = new Array(64).fill(null);
  });

  for (let i = 0; i < stepCount; i++) {
    if (genre === "house") {
      if (i % 4 === 0) pat.steps.kick[i] = defaultStep();
    } else if (genre === "techno") {
      if (i % 4 === 0 || rand("k" + i) > 0.85)
        pat.steps.kick[i] = defaultStep();
    } else {
      if (i % 4 === 0 || i === 10 || i === 14)
        pat.steps.kick[i] = defaultStep();
    }

    if (i === 4 || i === 12) {
      pat.steps.snare[i] = defaultStep();
    } else if (genre === "breakbeat" && rand("s" + i) > 0.8) {
      pat.steps.snare[i] = defaultStep();
    }

    if (genre === "techno" || genre === "house") {
      if (i % 2 === 0) pat.steps.hat[i] = defaultStep();
      else if (rand("h" + i) > 0.6) pat.steps.hat[i] = defaultStep();
    } else {
      if (rand("h" + i) > 0.3) pat.steps.hat[i] = defaultStep();
    }

    if (genre === "house" && i % 8 === 6) pat.steps.openhat[i] = defaultStep();
    if ((genre === "house" || genre === "techno") && i === 4)
      pat.steps.clap[i] = defaultStep();
    if (rand("t" + i) > 0.92) pat.steps.tom[i] = defaultStep();
  }

  /* v18.1: Bass-Groove zuerst generieren, DANN rendern */
  if (pat.steps.bass && pat.pianoRoll.bass) {
    pat.pianoRoll.bass = [];
    const rootMidi = 36;
    for (let i = 0; i < stepCount; i += 4) {
      if (rand("b" + i) > 0.35) {
        pat.pianoRoll.bass.push({
          id: genId("n"),
          start: i,
          len: 2,
          midi: rootMidi + (rand("bp" + i) > 0.5 ? 7 : 0),
          vel: 100,
        });
      }
    }
    syncMelodicSteps(pat);
  }

  /* v18.3: rebuildRack MUSS nach allen State-Änderungen kommen */
  rebuildRack();
  autoSave();
  toast("Generated " + genre + " beat (seed " + seed + ")", "success");
}

/* --- Step mouse handling --- */
let stepDrag = null;
function onStepMouseDown(e) {
  if (e.button !== 0) return;
  const el = e.target.closest(".step");
  if (!el) return;
  const trackId = el.dataset.trackId;
  const stepIndex = parseInt(el.dataset.step);
  const ctrl = e.ctrlKey || e.metaKey;

  if (ctrl) {
    const r = document.createElement("div");
    r.className = "pr-rubber";
    r.style.cssText = "position:fixed;z-index:9997;display:none;";
    document.body.appendChild(r);
    stepDrag = {
      mode: "marquee",
      startX: e.clientX,
      startY: e.clientY,
      rubberEl: r,
      moved: false,
      baseSelection: new Set(stepSelectedKeys),
      additive: e.shiftKey,
      subtract: e.altKey,
      originTrackId: trackId,
      originStep: stepIndex,
    };
    document.addEventListener("mousemove", onStepMouseMove);
    document.addEventListener("mouseup", onStepMouseUp);
    e.preventDefault();
    return;
  }

  clearStepSelection();
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track) return;
  pushHistory();
  toggleMainStep(track, stepIndex, el);
  e.preventDefault();
}
function onStepMouseMove(e) {
  if (!stepDrag) return;
  const d = stepDrag;
  const dx = e.clientX - d.startX,
    dy = e.clientY - d.startY;
  if (!d.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
    d.moved = true;
    d.rubberEl.style.display = "block";
  }
  if (!d.moved) return;
  const r = d.rubberEl;
  const x1 = Math.min(d.startX, e.clientX),
    y1 = Math.min(d.startY, e.clientY);
  const x2 = Math.max(d.startX, e.clientX),
    y2 = Math.max(d.startY, e.clientY);
  r.style.left = x1 + "px";
  r.style.top = y1 + "px";
  r.style.width = x2 - x1 + "px";
  r.style.height = y2 - y1 + "px";

  const hits = new Set();
  document.querySelectorAll(".step").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (
      rect.left + rect.width > x1 &&
      rect.left < x2 &&
      rect.top + rect.height > y1 &&
      rect.top < y2
    ) {
      hits.add(stepKey(el.dataset.trackId, parseInt(el.dataset.step)));
    }
  });
  let next;
  if (d.subtract) {
    next = new Set([...d.baseSelection].filter((k) => !hits.has(k)));
  } else if (d.additive) {
    next = new Set([...d.baseSelection, ...hits]);
  } else {
    next = new Set(hits);
  }
  stepSelectedKeys = next;
  updateStepSelectionVisual();
}
function onStepMouseUp(e) {
  if (!stepDrag) return;
  const d = stepDrag;
  document.removeEventListener("mousemove", onStepMouseMove);
  document.removeEventListener("mouseup", onStepMouseUp);
  stepDrag = null;
  if (d.rubberEl) d.rubberEl.remove();

  if (!d.moved) {
    const key = stepKey(d.originTrackId, d.originStep);
    const next = new Set(d.baseSelection);
    if (d.subtract) next.delete(key);
    else if (next.has(key)) next.delete(key);
    else next.add(key);
    stepSelectedKeys = next;
    updateStepSelectionVisual();
  }
}

/* --- Synth Editor --- */
function openSynthEditor(trackId) {
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track || !track.synth) return;

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex; flex-direction:column; gap:12px;";

  const presetRow = document.createElement("div");
  presetRow.style.cssText =
    "display:flex; gap:8px; align-items:center; margin-bottom:8px;";

  const presetSel = document.createElement("select");
  presetSel.style.cssText =
    "flex:1; background:#111; color:#ddd; border:1px solid #000; padding:6px;";
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Load Preset --";
  presetSel.appendChild(defaultOpt);

  const factoryPresets = [
    // ── Bass ──
    {
      id: "f_bass_sub",
      name: "Bass: Sub",
      type: "bass",
      synth: {
        a: 0.01,
        d: 0.15,
        s: 0.9,
        r: 0.15,
        cutoff: 400,
        q: 1,
        waveform: "sine",
        pitchEnv: 0,
      },
    },
    {
      id: "f_bass_808",
      name: "Bass: 808",
      type: "bass",
      synth: {
        a: 0.005,
        d: 1.2,
        s: 0.5,
        r: 0.3,
        cutoff: 600,
        q: 2,
        waveform: "sine",
        pitchEnv: 24,
      },
    },
    {
      id: "f_bass_303",
      name: "Bass: 303 Acid",
      type: "bass",
      synth: {
        a: 0.01,
        d: 0.2,
        s: 0.3,
        r: 0.1,
        cutoff: 2500,
        q: 12,
        waveform: "sawtooth",
        pitchEnv: 0,
      },
    },
    {
      id: "f_bass_fingered",
      name: "Bass: Fingered",
      type: "bass",
      synth: {
        a: 0.005,
        d: 0.25,
        s: 0.4,
        r: 0.15,
        cutoff: 1200,
        q: 4,
        waveform: "triangle",
        pitchEnv: 0,
      },
    },
    {
      id: "f_bass_saw",
      name: "Bass: Saw",
      type: "bass",
      synth: {
        a: 0.01,
        d: 0.2,
        s: 0.6,
        r: 0.2,
        cutoff: 2000,
        q: 6,
        waveform: "sawtooth",
        pitchEnv: 0,
      },
    },

    // ── Lead ──
    {
      id: "f_lead_sq",
      name: "Lead: Square",
      type: "lead",
      synth: {
        a: 0.01,
        d: 0.1,
        s: 0.5,
        r: 0.1,
        cutoff: 4000,
        q: 2,
        waveform: "square",
      },
    },
    {
      id: "f_lead_saw",
      name: "Lead: Fat Saw",
      type: "lead",
      synth: {
        a: 0.05,
        d: 0.3,
        s: 0.7,
        r: 0.3,
        cutoff: 6000,
        q: 4,
        waveform: "sawtooth",
      },
    },
    {
      id: "f_lead_supersaw",
      name: "Lead: Supersaw",
      type: "lead",
      synth: {
        a: 0.02,
        d: 0.15,
        s: 0.6,
        r: 0.2,
        cutoff: 8000,
        q: 3,
        waveform: "sawtooth",
      },
    },

    // ── Pad ──
    {
      id: "f_pad_warm",
      name: "Pad: Warm",
      type: "pad",
      synth: {
        a: 0.5,
        d: 0.5,
        s: 0.9,
        r: 1.5,
        cutoff: 1500,
        q: 1,
        waveform: "sawtooth",
      },
    },
    {
      id: "f_pad_glass",
      name: "Pad: Glass",
      type: "pad",
      synth: {
        a: 0.2,
        d: 0.8,
        s: 0.6,
        r: 2.0,
        cutoff: 10000,
        q: 3,
        waveform: "triangle",
      },
    },

    // ── Pluck ──
    {
      id: "f_pluck_soft",
      name: "Pluck: Soft",
      type: "pluck",
      synth: {
        a: 0.01,
        d: 0.2,
        s: 0.0,
        r: 0.1,
        cutoff: 3000,
        q: 1,
        waveform: "triangle",
      },
    },
    {
      id: "f_pluck_bright",
      name: "Pluck: Bright",
      type: "pluck",
      synth: {
        a: 0.005,
        d: 0.1,
        s: 0.0,
        r: 0.08,
        cutoff: 8000,
        q: 2,
        waveform: "square",
      },
    },

    // ── Piano (nutzt harmonics-Array) ──
    {
      id: "f_piano_organ",
      name: "Piano: Organ",
      type: "piano",
      synth: {
        a: 0.005,
        d: 0.05,
        s: 0.9,
        r: 0.15,
        cutoff: 6000,
        q: 1,
        harmonics: [1, 0.6, 0.8, 0.3, 0.4, 0.15, 0.2],
      },
    },
    {
      id: "f_piano_80s",
      name: "Piano: 80s",
      type: "piano",
      synth: {
        a: 0.01,
        d: 0.4,
        s: 0.3,
        r: 0.6,
        cutoff: 8000,
        q: 2,
        harmonics: [1, 0.5, 0.8, 0.2, 0.1],
      },
    },
    {
      id: "f_piano_jazz",
      name: "Piano: Jazz",
      type: "piano",
      synth: {
        a: 0.005,
        d: 0.6,
        s: 0.15,
        r: 0.8,
        cutoff: 5000,
        q: 1,
        harmonics: [1, 0.4, 0.3, 0.1, 0.05],
      },
    },
    {
      id: "f_piano_synth",
      name: "Piano: Synth Bell",
      type: "piano",
      synth: {
        a: 0.001,
        d: 1.0,
        s: 0.05,
        r: 1.5,
        cutoff: 12000,
        q: 3,
        harmonics: [1, 0.1, 0.4, 0.05, 0.3, 0.02, 0.1],
      },
    },
    {
      id: "f_piano_bright",
      name: "Piano: Bright",
      type: "piano",
      synth: {
        a: 0.003,
        d: 0.4,
        s: 0.25,
        r: 0.4,
        cutoff: 14000,
        q: 1,
        harmonics: [1, 0.7, 0.4, 0.3, 0.15, 0.1],
      },
    },

    // ── Guitar ──
    {
      id: "f_guitar_acoustic",
      name: "Guitar: Acoustic",
      type: "guitar",
      synth: {
        a: 0.005,
        d: 0.3,
        s: 0.15,
        r: 0.4,
        cutoff: 4000,
        q: 1,
        waveform: "triangle",
      },
    },
    {
      id: "f_guitar_clean",
      name: "Guitar: Clean",
      type: "guitar",
      synth: {
        a: 0.01,
        d: 0.25,
        s: 0.3,
        r: 0.3,
        cutoff: 6000,
        q: 2,
        waveform: "sawtooth",
      },
    },
    {
      id: "f_guitar_dist",
      name: "Guitar: Distorted",
      type: "guitar",
      synth: {
        a: 0.001,
        d: 0.1,
        s: 0.8,
        r: 0.2,
        cutoff: 3000,
        q: 6,
        waveform: "square",
      },
    },
  ];

  const allPresets = factoryPresets.concat(userPresets);

  allPresets.forEach((p) => {
    const o = document.createElement("option");
    o.value = p.id;
    o.textContent = p.name + (p.id.startsWith("u_") ? " (User)" : "");
    presetSel.appendChild(o);
  });

  const saveNameInp = document.createElement("input");
  saveNameInp.placeholder = "New preset name…";
  saveNameInp.style.cssText =
    "width:140px; background:#111; color:#ddd; border:1px solid #000; padding:6px;";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";

  presetRow.append(presetSel, saveNameInp, saveBtn);
  wrap.appendChild(presetRow);

  const createSlider = (label, min, max, step, val, onChange) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex; align-items:center; gap:8px;";
    const l = document.createElement("span");
    l.textContent = label;
    l.style.cssText = "color:var(--muted); width:60px; font-size:12px;";
    const inp = document.createElement("input");
    inp.type = "range";
    inp.min = min;
    inp.max = max;
    inp.step = step;
    inp.value = val;
    inp.style.flex = 1;
    const v = document.createElement("span");
    v.textContent = val;
    v.style.cssText =
      "font-family:monospace; color:var(--accent2); width:40px; text-align:right; font-size:11px;";
    inp.addEventListener("input", () => {
      const p = parseFloat(inp.value);
      v.textContent = p;
      onChange(p);
      autoSave();
    });
    row.append(l, inp, v);
    return row;
  };

  const adsrGroup = document.createElement("div");
  adsrGroup.innerHTML =
    '<h4 style="margin:0 0 8px 0; color:var(--accent); font-size:12px;">Envelope (ADSR)</h4>';
  adsrGroup.appendChild(
    createSlider(
      "Attack",
      0.01,
      2.0,
      0.01,
      track.synth.a,
      (v) => (track.synth.a = v)
    )
  );
  adsrGroup.appendChild(
    createSlider(
      "Decay",
      0.01,
      2.0,
      0.01,
      track.synth.d,
      (v) => (track.synth.d = v)
    )
  );
  adsrGroup.appendChild(
    createSlider(
      "Sustain",
      0.0,
      1.0,
      0.01,
      track.synth.s,
      (v) => (track.synth.s = v)
    )
  );
  adsrGroup.appendChild(
    createSlider(
      "Release",
      0.01,
      3.0,
      0.01,
      track.synth.r,
      (v) => (track.synth.r = v)
    )
  );

  const filterGroup = document.createElement("div");
  filterGroup.innerHTML =
    '<h4 style="margin:16px 0 8px 0; color:var(--accent); font-size:12px;">Filter</h4>';
  filterGroup.appendChild(
    createSlider(
      "Cutoff",
      100,
      20000,
      100,
      track.synth.cutoff,
      (v) => (track.synth.cutoff = v)
    )
  );
  filterGroup.appendChild(
    createSlider(
      "Reso(Q)",
      0.1,
      20.0,
      0.1,
      track.synth.q,
      (v) => (track.synth.q = v)
    )
  );

  // ── Arpeggiator ──
  const arpGroup = document.createElement("div");
  arpGroup.innerHTML =
    '<h4 style="margin:16px 0 8px 0; color:var(--accent); font-size:12px;">Arpeggiator</h4>';

  if (!track.arp)
    track.arp = { enabled: false, rate: 4, mode: "up", octaves: 1 };

  const arpRow = document.createElement("div");
  arpRow.style.cssText =
    "display:flex;align-items:center;gap:8px;margin-bottom:6px;";

  const arpToggle = document.createElement("button");
  arpToggle.className = "mini-btn";
  arpToggle.textContent = "Arp: " + (track.arp.enabled ? "ON" : "OFF");
  if (track.arp.enabled) arpToggle.style.background = "var(--accent)";
  arpToggle.addEventListener("click", () => {
    pushHistory();
    track.arp.enabled = !track.arp.enabled;
    arpToggle.textContent = "Arp: " + (track.arp.enabled ? "ON" : "OFF");
    arpToggle.style.background = track.arp.enabled ? "var(--accent)" : "";
    if (typeof setArp === "function")
      setArp(track.id, { enabled: track.arp.enabled });
    autoSave();
  });
  arpRow.appendChild(arpToggle);

  const arpRateLbl = document.createElement("span");
  arpRateLbl.textContent = "Rate:";
  arpRateLbl.style.cssText = "font-size:11px;color:var(--muted);";
  const arpRateSel = document.createElement("select");
  arpRateSel.style.cssText =
    "background:#111;color:#ddd;border:1px solid #000;border-radius:3px;padding:2px 4px;font-size:11px;";
  [1, 2, 3, 4, 6, 8].forEach((r) => {
    const o = document.createElement("option");
    o.value = r;
    o.textContent = r + "×";
    if (track.arp.rate === r) o.selected = true;
    arpRateSel.appendChild(o);
  });
  arpRateSel.addEventListener("change", () => {
    pushHistory();
    if (typeof setArp === "function")
      setArp(track.id, { rate: parseInt(arpRateSel.value) });
    else track.arp.rate = parseInt(arpRateSel.value);
    autoSave();
  });
  arpRow.appendChild(arpRateLbl);
  arpRow.appendChild(arpRateSel);

  const arpModeLbl = document.createElement("span");
  arpModeLbl.textContent = "Mode:";
  arpModeLbl.style.cssText =
    "font-size:11px;color:var(--muted);margin-left:8px;";
  const arpModeSel = document.createElement("select");
  arpModeSel.style.cssText =
    "background:#111;color:#ddd;border:1px solid #000;border-radius:3px;padding:2px 4px;font-size:11px;";
  [
    ["up", "Up"],
    ["down", "Down"],
    ["updown", "Up-Down"],
  ].forEach(([v, l]) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = l;
    if (track.arp.mode === v) o.selected = true;
    arpModeSel.appendChild(o);
  });
  arpModeSel.addEventListener("change", () => {
    pushHistory();
    if (typeof setArp === "function")
      setArp(track.id, { mode: arpModeSel.value });
    else track.arp.mode = arpModeSel.value;
    autoSave();
  });
  arpRow.appendChild(arpModeLbl);
  arpRow.appendChild(arpModeSel);

  const arpOctLbl = document.createElement("span");
  arpOctLbl.textContent = "Octaves:";
  arpOctLbl.style.cssText =
    "font-size:11px;color:var(--muted);margin-left:8px;";
  const arpOctSel = document.createElement("select");
  arpOctSel.style.cssText =
    "background:#111;color:#ddd;border:1px solid #000;border-radius:3px;padding:2px 4px;font-size:11px;";
  [1, 2, 3, 4].forEach((n) => {
    const o = document.createElement("option");
    o.value = n;
    o.textContent = n;
    if (track.arp.octaves === n) o.selected = true;
    arpOctSel.appendChild(o);
  });
  arpOctSel.addEventListener("change", () => {
    pushHistory();
    if (typeof setArp === "function")
      setArp(track.id, { octaves: parseInt(arpOctSel.value) });
    else track.arp.octaves = parseInt(arpOctSel.value);
    autoSave();
  });
  arpRow.appendChild(arpOctLbl);
  arpRow.appendChild(arpOctSel);

  arpGroup.appendChild(arpRow);

  wrap.append(adsrGroup, filterGroup, arpGroup);

  presetSel.addEventListener("change", () => {
    const id = presetSel.value;
    if (!id) return;
    const p = allPresets.find((x) => x.id === id);
    if (!p) return;

    pushHistory();
    // komplette synth-Struktur übernehmen (inkl. harmonics, waveform, pitchEnv)
    const freshSynth = JSON.parse(JSON.stringify(p.synth));
    Object.keys(track.synth).forEach((k) => {
      delete track.synth[k];
    });
    Object.assign(track.synth, freshSynth);

    // Preset-Zuordnung merken
    track.presetName = p.name;
    track.presetId = p.id;

    // ADSR / Filter-Slider aktualisieren
    const inputs = wrap.querySelectorAll("input[type=range]");
    const syncRange = (inp, val) => {
      if (inp && typeof val === "number") {
        inp.value = val;
        inp.dispatchEvent(new Event("input"));
      }
    };
    syncRange(inputs[0], track.synth.a);
    syncRange(inputs[1], track.synth.d);
    syncRange(inputs[2], track.synth.s);
    syncRange(inputs[3], track.synth.r);
    syncRange(inputs[4], track.synth.cutoff);
    syncRange(inputs[5], track.synth.q);
    presetSel.value = "";
    toast("Preset loaded: " + p.name, "success");
  });

  saveBtn.addEventListener("click", () => {
    const name = saveNameInp.value.trim();
    if (!name) {
      toast("Please enter a name", "error");
      return;
    }

    pushHistory();
    const newPreset = {
      id: "u_" + Date.now().toString(36),
      name: name,
      type: track.id,
      synth: JSON.parse(JSON.stringify(track.synth)),
    };

    userPresets.push(newPreset);
    track.presetName = newPreset.name;
    track.presetId = newPreset.id;
    autoSave();
    // Rack-Anzeige sofort aktualisieren
    if (currentView === "rack") rebuildRack();

    const o = document.createElement("option");
    o.value = newPreset.id;
    o.textContent = newPreset.name + " (User)";
    presetSel.appendChild(o);

    saveNameInp.value = "";
    toast("Preset saved", "success");
  });

  showModal("⚙️ Synth Editor · " + track.name, wrap, [
    { label: "Close", onClick: hideModal },
  ]);
}
/* ---------- Chord Progression Dialog ---------- */
function showChordProgressionDialog(trackId) {
  const track = TRACKS.find((t) => t.id === trackId && t.type === "melodic");
  if (!track) {
    toast("Chord progression only works on melodic tracks", "error");
    return;
  }
  if (typeof CHORD_PROGRESSIONS === "undefined") {
    toast("Chord progressions unavailable", "error");
    return;
  }

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:10px;";

  const info = document.createElement("div");
  info.style.cssText = "font-size:11px;color:var(--muted);line-height:1.5;";
  info.innerHTML =
    "Generates a chord progression in <b>" +
    track.name +
    "</b> starting at step 0.<br>" +
    '<span style="color:#c62828">Note: this will replace all notes in the generated range.</span>';
  wrap.appendChild(info);

  const mkRow = (labelText, child) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px;";
    const lbl = document.createElement("span");
    lbl.textContent = labelText;
    lbl.style.cssText =
      "font-size:12px;color:var(--muted);width:110px;flex-shrink:0;";
    row.append(lbl, child);
    return row;
  };

  // Progression
  const progSel = document.createElement("select");
  progSel.style.cssText =
    "flex:1;background:#111;color:#ddd;border:1px solid #000;padding:5px;border-radius:3px;font-size:12px;";
  Object.entries(CHORD_PROGRESSIONS).forEach(([id, p]) => {
    const o = document.createElement("option");
    o.value = id;
    o.textContent = p.name;
    progSel.appendChild(o);
  });

  // Key
  const keySel = document.createElement("select");
  keySel.style.cssText =
    "flex:1;background:#111;color:#ddd;border:1px solid #000;padding:5px;border-radius:3px;font-size:12px;";
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach(
    (n, i) => {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = n;
      keySel.appendChild(o);
    }
  );
  if (typeof currentRoot === "number") keySel.value = currentRoot;

  // Mode
  const modeSel = document.createElement("select");
  modeSel.style.cssText =
    "flex:1;background:#111;color:#ddd;border:1px solid #000;padding:5px;border-radius:3px;font-size:12px;";
  ["maj", "min"].forEach((m) => {
    const o = document.createElement("option");
    o.value = m;
    o.textContent = m === "maj" ? "Major" : "Minor";
    modeSel.appendChild(o);
  });

  // Octave
  const octSel = document.createElement("select");
  octSel.style.cssText =
    "flex:1;background:#111;color:#ddd;border:1px solid #000;padding:5px;border-radius:3px;font-size:12px;";
  [1, 2, 3, 4, 5, 6].forEach((n) => {
    const o = document.createElement("option");
    o.value = n;
    o.textContent = "Octave " + n;
    if (n === 3) o.selected = true;
    octSel.appendChild(o);
  });

  // Chord length in steps
  const lenInp = document.createElement("input");
  lenInp.type = "number";
  lenInp.min = 1;
  lenInp.max = 32;
  lenInp.value = 8;
  lenInp.style.cssText =
    "width:80px;background:#111;color:#ddd;border:1px solid #000;padding:5px;border-radius:3px;font-size:12px;";

  wrap.appendChild(mkRow("Progression", progSel));
  wrap.appendChild(mkRow("Key", keySel));
  wrap.appendChild(mkRow("Mode", modeSel));
  wrap.appendChild(mkRow("Octave", octSel));
  wrap.appendChild(mkRow("Chord length", lenInp));

  showModal("🎼 Chord Progression · " + track.name, wrap, [
    { label: "Cancel", onClick: hideModal },
    {
      label: "Apply",
      className: "play",
      onClick: () => {
        const progId = progSel.value;
        const key = parseInt(keySel.value);
        const mode = modeSel.value;
        const octave = parseInt(octSel.value);
        const len = Math.max(1, Math.min(32, parseInt(lenInp.value) || 8));

        // Sanity check
        if (!CHORD_PROGRESSIONS[progId]) {
          toast("Invalid progression", "error");
          return;
        }

        // Estimate impacted note count before replacing
        const prog = CHORD_PROGRESSIONS[progId];
        const totalEnd = prog.intervals.length * len;
        const existing = (
          patterns[currentPattern].pianoRoll[track.id] || []
        ).filter((n) => n.start < totalEnd).length;

        if (
          existing > 0 &&
          !confirm(
            "Replace " +
              existing +
              " existing note(s) in the first " +
              totalEnd +
              " steps?"
          )
        ) {
          return;
        }

        pushHistory();
        try {
          if (typeof applyChordProgression !== "function") {
            toast("applyChordProgression not available", "error");
            return;
          }
          const ok = applyChordProgression(
            track.id,
            progId,
            key,
            mode,
            octave,
            len
          );
          if (ok) {
            toast("Chords applied · " + prog.name, "success");
            hideModal();
            if (currentView === "rack") rebuildRack();
            if (prEditor && prEditor.trackId === track.id) redrawNotes();
          } else {
            toast("Chord generation failed", "error");
          }
        } catch (err) {
          console.error("Chord progression failed:", err);
          toast("Error: " + err.message, "error");
        }
      },
    },
  ]);
}

/* ---------- Drum Kit Selector ---------- */
function showDrumKitSelector() {
  if (typeof DRUM_KITS === "undefined") {
    toast("Drum kits not available", "error");
    return;
  }
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:8px;";

  const info = document.createElement("div");
  info.style.cssText = "font-size:11px;color:var(--muted);margin-bottom:4px;";
  info.textContent =
    "Selects drum synthesis for all 6 drum tracks. Affects pitch, decay, noise.";
  wrap.appendChild(info);

  Object.entries(DRUM_KITS).forEach(([id, kit]) => {
    const active = typeof drumKitId !== "undefined" && drumKitId === id;
    const btn = document.createElement("button");
    btn.style.cssText =
      "text-align:left;padding:10px 14px;" +
      "background:" +
      (active ? "var(--accent)" : "#2a2a2a") +
      ";" +
      "color:" +
      (active ? "#111" : "#ddd") +
      ";" +
      "border:1px solid " +
      (active ? "var(--accent2)" : "#000") +
      ";" +
      "border-radius:4px;cursor:pointer;font-size:13px;" +
      (active ? "font-weight:700;" : "");
    btn.textContent = kit.name + (active ? "  ✓" : "");
    btn.addEventListener("click", () => {
      try {
        if (typeof setDrumKit === "function") {
          setDrumKit(id);
        } else {
          drumKitId = id;
        }
        if (typeof autoSave === "function") autoSave();
        hideModal();
        toast("Drum Kit: " + kit.name, "success");
      } catch (err) {
        console.error("Drum kit change failed:", err);
        toast("Kit change failed: " + err.message, "error");
      }
    });
    wrap.appendChild(btn);
  });

  showModal("🥁 Drum Kit", wrap, [{ label: "Cancel", onClick: hideModal }]);
}
function showDrumPresetSelector(trackId) {
  const track = TRACKS.find((t) => t.id === trackId && t.type === "drum");
  if (!track) {
    toast("Only drum tracks have presets", "error");
    return;
  }
  if (typeof DRUM_PRESETS === "undefined") {
    toast("Drum presets unavailable", "error");
    return;
  }
  const presets = DRUM_PRESETS[track.id];
  if (!presets) {
    toast("No presets for " + track.id, "error");
    return;
  }

  const wrap = document.createElement("div");
  wrap.style.cssText =
    "display:flex;flex-direction:column;gap:6px;max-height:65vh;overflow-y:auto;padding-right:4px;";

  // Info
  const info = document.createElement("div");
  info.style.cssText =
    "font-size:11px;color:var(--muted);margin-bottom:4px;line-height:1.5;";
  const kitName =
    typeof DRUM_KITS !== "undefined" && DRUM_KITS[drumKitId]
      ? DRUM_KITS[drumKitId].name
      : "Default";
  info.textContent =
    "Current kit: " +
    kitName +
    ". Selecting a preset here overrides only this " +
    track.name +
    " — other drum sounds stay unchanged.";
  wrap.appendChild(info);

  // Reset to kit default
  const isKitDefault = !track.drumPresetId;
  const resetBtn = document.createElement("button");
  resetBtn.style.cssText =
    "text-align:left;padding:10px 14px;" +
    "background:" +
    (isKitDefault ? "var(--accent)" : "#3a3a3a") +
    ";" +
    "color:" +
    (isKitDefault ? "#111" : "#ddd") +
    ";" +
    "border:1px solid " +
    (isKitDefault ? "var(--accent2)" : "#000") +
    ";" +
    "border-radius:4px;cursor:pointer;font-size:13px;" +
    (isKitDefault ? "font-weight:700;" : "");
  resetBtn.textContent =
    "↺ Use Kit Default (" + kitName + ")" + (isKitDefault ? "  ✓" : "");
  resetBtn.addEventListener("click", () => {
    pushHistory();
    if (typeof setTrackDrumPreset === "function") {
      setTrackDrumPreset(track.id, null);
    } else {
      track.drumPresetId = null;
    }
    autoSave();
    hideModal();
    rebuildRack();
    toast("Reset to kit default", "success");
  });
  wrap.appendChild(resetBtn);

  // Separator
  const sep = document.createElement("div");
  sep.style.cssText = "height:1px;background:#444;margin:4px 0;";
  wrap.appendChild(sep);

  // Preset list
  Object.entries(presets).forEach(([id, preset]) => {
    const isActive = track.drumPresetId === id;
    const btn = document.createElement("button");
    btn.style.cssText =
      "text-align:left;padding:8px 14px;" +
      "background:" +
      (isActive ? "var(--accent)" : "#2a2a2a") +
      ";" +
      "color:" +
      (isActive ? "#111" : "#ddd") +
      ";" +
      "border:1px solid " +
      (isActive ? "var(--accent2)" : "#000") +
      ";" +
      "border-radius:4px;cursor:pointer;font-size:12px;" +
      (isActive ? "font-weight:700;" : "");
    btn.textContent = preset.name + (isActive ? "  ✓" : "");
    btn.addEventListener("click", () => {
      pushHistory();
      let ok = false;
      if (typeof setTrackDrumPreset === "function") {
        ok = setTrackDrumPreset(track.id, id);
      } else {
        track.drumPresetId = id;
        ok = true;
      }
      if (ok) {
        autoSave();
        hideModal();
        rebuildRack();
        toast(track.name + ": " + preset.name, "success");
      } else {
        toast("Could not set preset", "error");
      }
    });
    wrap.appendChild(btn);
  });

  showModal("🥁 " + track.name + " Preset", wrap, [
    { label: "Cancel", onClick: hideModal },
  ]);
}
/* --- Step editor --- */
let stepEditorEl = null;
function openStepEditor(track, step, x, y) {
  closeStepEditor();
  const pat = patterns[currentPattern];
  const isOn = isStepOn(pat, track.id, step);
  const sd = getStepData(pat, track.id, step) || defaultStep();
  const panel = document.createElement("div");
  panel.className = "step-editor";
  panel.innerHTML = `
    <div class="se-head"><span style="color:${track.color};font-weight:700">${
    track.name
  }</span> <span style="color:var(--muted)">· Step ${step + 1}</span></div>
    <div class="se-row"><label>Active</label><input type="checkbox" id="se_on" ${
      isOn ? "checked" : ""
    }></div>
    <div class="se-row"><label>Velocity</label><input type="range" id="se_vel" min="1" max="127" step="1" value="${
      sd.vel
    }"><span class="se-val" id="se_vel_v">${sd.vel}</span></div>
    <div class="se-row"><label>Probability</label><input type="range" id="se_prob" min="0" max="1" step="0.01" value="${
      sd.prob
    }"><span class="se-val" id="se_prob_v">${Math.round(
    sd.prob * 100
  )}%</span></div>
    <div class="se-row"><label>Ratchet</label><select id="se_ratchet"><option value="1">1×</option><option value="2">2×</option><option value="3">3×</option><option value="4">4×</option><option value="8">8×</option></select></div>
    <div class="se-row"><label>Timing</label><input type="range" id="se_offset" min="-0.5" max="0.5" step="0.01" value="${
      sd.offset
    }"><span class="se-val" id="se_offset_v">${(sd.offset * 100).toFixed(
    0
  )}%</span></div>
    <div class="se-row"><label>Accent</label><input type="checkbox" id="se_accent" ${
      sd.accent ? "checked" : ""
    }></div>
    <div class="se-actions"><button id="se_save">Apply</button><button id="se_clear">Clear</button></div>`;
  document.body.appendChild(panel);
  const r = panel.getBoundingClientRect();
  let nx = x,
    ny = y;
  if (r.right > window.innerWidth - 4) nx = x - r.width;
  if (r.bottom > window.innerHeight - 4) ny = y - r.height;
  panel.style.left = Math.max(4, nx) + "px";
  panel.style.top = Math.max(4, ny) + "px";
  stepEditorEl = panel;
  const $ = (id) => panel.querySelector("#" + id);
  $("se_ratchet").value = String(sd.ratchet);
  const sync = () => {
    $("se_vel_v").textContent = $("se_vel").value;
    $("se_prob_v").textContent =
      Math.round(parseFloat($("se_prob").value) * 100) + "%";
    $("se_offset_v").textContent =
      (parseFloat($("se_offset").value) * 100).toFixed(0) + "%";
  };
  ["se_vel", "se_prob", "se_offset"].forEach((id) =>
    $(id).addEventListener("input", sync)
  );
  const collect = () => ({
    on: $("se_on").checked,
    vel: parseInt($("se_vel").value),
    prob: parseFloat($("se_prob").value),
    ratchet: parseInt($("se_ratchet").value),
    offset: parseFloat($("se_offset").value),
    accent: $("se_accent").checked,
  });
  $("se_save").addEventListener("click", () => {
    pushHistory();
    const d = collect();
    pat.steps[track.id][step] = d.on ? d : null;
    rebuildRack();
    autoSave();
    closeStepEditor();
  });
  $("se_clear").addEventListener("click", () => {
    pushHistory();
    pat.steps[track.id][step] = null;
    rebuildRack();
    autoSave();
    closeStepEditor();
  });
}
function closeStepEditor() {
  if (stepEditorEl) {
    stepEditorEl.remove();
    stepEditorEl = null;
  }
}
document.addEventListener(
  "click",
  (e) => {
    if (stepEditorEl && !stepEditorEl.contains(e.target)) closeStepEditor();
  },
  true
);

async function exportSampleAsWav(trackId, opts) {
  const track = TRACKS.find((t) => t.id === trackId);
  const s = samples[trackId];
  if (!track || !s || !s.buffer) {
    toast("No sample loaded", "error");
    return;
  }

  try {
    const sampleRate = s.buffer.sampleRate;
    const startT = s.start || 0;
    const endT = s.end || s.buffer.duration;
    const dur = endT - startT;
    if (dur <= 0) {
      toast("Invalid trim range", "error");
      return;
    }

    const frames = Math.max(1, Math.ceil(dur * sampleRate));
    const offline = new OfflineAudioContext(1, frames, sampleRate);
    playSampleNode(
      offline,
      0,
      offline.destination,
      s.buffer,
      1,
      s,
      undefined,
      1
    );
    const rendered = await offline.startRendering();

    const bitDepth = (opts && opts.bitDepth) || 16;
    const blob = encodeWav(rendered, bitDepth);

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      (s.name || "sample").replace(/\.[a-z0-9]+$/i, "") +
      "-" +
      trackId +
      ".wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    toast("Sample exported: " + a.download, "success");
  } catch (err) {
    console.error("Export sample failed:", err);
    toast(
      "Export failed: " + ((err && err.message) || "Unknown error"),
      "error"
    );
  }
}

/* ---------- Sample Editor ---------- */
function showSampleEditor(trackId) {
  const track = TRACKS.find((t) => t.id === trackId);
  const s = samples[trackId];
  if (!track || !s || !s.buffer) {
    toast("No sample loaded", "error");
    return;
  }

  // Local UI state
  let zoomStart = 0;
  let zoomEnd = s.buffer.duration;
  let isSliceMode = false;
  let isLoop = false;
  let playHandle = null; // { source, startTime, endTime, duration, stop }
  let playheadRaf = null;
  let dragTarget = null; // 'start' | 'end' | 'sel' | null
  let dragOrigin = null;

  const modal = document.createElement("div");
  modal.style.cssText = "display:flex;flex-direction:column;gap:8px;";

  const head = document.createElement("h3");
  head.textContent = "✂️ Sample Editor · " + track.name;
  modal.appendChild(head);

  /* ────────── Controls row ────────── */
  const ctrl = document.createElement("div");
  ctrl.className = "se-controls";
  ctrl.style.cssText =
    "display:flex;gap:6px;flex-wrap:wrap;align-items:center;";

  const playBtn = document.createElement("button");
  playBtn.className = "play";
  playBtn.textContent = "▶ Play";
  playBtn.style.fontSize = "12px";

  const playTrimBtn = document.createElement("button");
  playTrimBtn.textContent = "▶ Play Trim";
  playTrimBtn.style.fontSize = "12px";

  const stopBtn = document.createElement("button");
  stopBtn.className = "stop";
  stopBtn.textContent = "■ Stop";
  stopBtn.style.fontSize = "12px";
  stopBtn.disabled = true;

  const loopBtn = document.createElement("button");
  loopBtn.textContent = "🔁 Loop: OFF";
  loopBtn.style.fontSize = "12px";

  const timeDisplay = document.createElement("span");
  timeDisplay.style.cssText =
    "font-family:monospace;font-size:11px;color:var(--accent2);padding:5px 8px;background:#111;border:1px solid #000;border-radius:3px;min-width:190px;text-align:center;";

  const zoomWrap = document.createElement("div");
  zoomWrap.style.cssText =
    "display:flex;gap:4px;align-items:center;margin-left:auto;";
  const zoomLbl = document.createElement("span");
  zoomLbl.textContent = "Zoom:";
  zoomLbl.style.cssText = "font-size:11px;color:var(--muted);";
  const zoomOut = document.createElement("button");
  zoomOut.textContent = "−";
  zoomOut.style.cssText = "min-width:26px;padding:3px 6px;";
  const zoomIn = document.createElement("button");
  zoomIn.textContent = "+";
  zoomIn.style.cssText = "min-width:26px;padding:3px 6px;";
  const zoomFit = document.createElement("button");
  zoomFit.textContent = "Fit";
  zoomFit.style.cssText = "padding:3px 8px;";
  zoomWrap.append(zoomLbl, zoomOut, zoomIn, zoomFit);

  ctrl.append(playBtn, playTrimBtn, stopBtn, loopBtn, timeDisplay, zoomWrap);
  modal.appendChild(ctrl);

  /* ────────── Ruler ────────── */
  const ruler = document.createElement("div");
  ruler.style.cssText =
    "position:relative;height:16px;background:#0a0a0a;border:1px solid #333;border-radius:3px;font-size:9px;color:#777;font-family:monospace;overflow:hidden;";
  modal.appendChild(ruler);

  /* ────────── Waveform ────────── */
  const canvasWrap = document.createElement("div");
  canvasWrap.style.cssText =
    "position:relative;width:100%;height:180px;background:#111;border:1px solid #333;border-radius:4px;overflow:hidden;cursor:crosshair;";
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;";
  const selBox = document.createElement("div");
  selBox.style.cssText =
    "position:absolute;top:0;bottom:0;background:rgba(78,163,255,.18);border-left:2px solid #4ea3ff;border-right:2px solid #4ea3ff;pointer-events:none;z-index:2;";
  const handleL = document.createElement("div");
  handleL.style.cssText =
    "position:absolute;top:0;bottom:0;left:0;width:10px;background:rgba(78,163,255,.5);cursor:ew-resize;pointer-events:auto;transform:translateX(-50%);z-index:3;";
  handleL.innerHTML =
    '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:2px;height:20px;background:#fff;border-radius:1px;box-shadow:0 0 4px rgba(0,0,0,.8);"></div>';
  const handleR = document.createElement("div");
  handleR.style.cssText =
    "position:absolute;top:0;bottom:0;left:100%;width:10px;background:rgba(78,163,255,.5);cursor:ew-resize;pointer-events:auto;transform:translateX(-50%);z-index:3;";
  handleR.innerHTML =
    '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:2px;height:20px;background:#fff;border-radius:1px;box-shadow:0 0 4px rgba(0,0,0,.8);"></div>';
  selBox.append(handleL, handleR);
  const playhead = document.createElement("div");
  playhead.style.cssText =
    "position:absolute;top:0;bottom:0;width:2px;background:#fff;pointer-events:none;z-index:4;box-shadow:0 0 6px #fff,0 0 2px #000;display:none;";
  canvasWrap.append(canvas, selBox, playhead);
  modal.appendChild(canvasWrap);

  /* ────────── Inputs (Start/End/Gain/Fade/Reverse) ────────── */
  const inputsWrap = document.createElement("div");
  inputsWrap.style.cssText =
    "display:grid;grid-template-columns:repeat(3,1fr);gap:8px;";
  const mkField = (label, type, val, step, onChange) => {
    const w = document.createElement("label");
    w.style.cssText =
      "display:flex;flex-direction:column;gap:2px;font-size:10px;color:var(--muted);";
    const sp = document.createElement("span");
    sp.textContent = label;
    const inp = document.createElement("input");
    inp.type = type;
    inp.value = val;
    if (step) inp.step = step;
    if (type === "checkbox") {
      inp.style.width = "auto";
    }
    inp.style.cssText +=
      ";background:#111;border:1px solid #000;border-radius:4px;padding:4px;color:#ddd;width:100%;font-family:monospace;font-size:11px;";
    inp.addEventListener("change", () => onChange(inp));
    w.append(sp, inp);
    return { w, inp };
  };
  const startField = mkField(
    "Start (s)",
    "number",
    (s.start || 0).toFixed(3),
    "0.001",
    (inp) => {
      s.start = Math.max(
        0,
        Math.min(
          parseFloat(inp.value) || 0,
          (s.end || s.buffer.duration) - 0.005
        )
      );
      inp.value = s.start.toFixed(3);
      redraw();
      save();
    }
  );
  const endField = mkField(
    "End (s)",
    "number",
    (s.end || s.buffer.duration).toFixed(3),
    "0.001",
    (inp) => {
      s.end = Math.max(
        (s.start || 0) + 0.005,
        Math.min(parseFloat(inp.value) || s.buffer.duration, s.buffer.duration)
      );
      inp.value = s.end.toFixed(3);
      redraw();
      save();
    }
  );
  const gainField = mkField(
    "Gain (dB)",
    "number",
    (20 * Math.log10(s.gain || 1)).toFixed(1),
    "0.5",
    (inp) => {
      s.gain = Math.pow(10, (parseFloat(inp.value) || 0) / 20);
      save();
    }
  );
  const fadeInField = mkField(
    "Fade In (s)",
    "number",
    (s.fadeIn || 0).toFixed(3),
    "0.001",
    (inp) => {
      s.fadeIn = Math.max(0, parseFloat(inp.value) || 0);
      redraw();
      save();
    }
  );
  const fadeOutField = mkField(
    "Fade Out (s)",
    "number",
    (s.fadeOut || 0).toFixed(3),
    "0.001",
    (inp) => {
      s.fadeOut = Math.max(0, parseFloat(inp.value) || 0);
      redraw();
      save();
    }
  );

  const revWrap = document.createElement("label");
  revWrap.style.cssText =
    "display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);padding-top:14px;";
  const revInp = document.createElement("input");
  revInp.type = "checkbox";
  revInp.checked = !!s.reverse;
  revInp.addEventListener("change", () => {
    s.reverse = revInp.checked;
    save();
  });
  const revLbl = document.createElement("span");
  revLbl.textContent = "Reverse";
  revWrap.append(revInp, revLbl);

  inputsWrap.append(
    startField.w,
    endField.w,
    gainField.w,
    fadeInField.w,
    fadeOutField.w,
    revWrap
  );
  modal.appendChild(inputsWrap);

  /* ────────── Slice / Export / Reset ────────── */
  const actionsRow = document.createElement("div");
  actionsRow.style.cssText =
    "display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px;padding-top:8px;border-top:1px solid #333;";
  const sliceModeBtn = document.createElement("button");
  sliceModeBtn.className = "mini-btn";
  sliceModeBtn.textContent = "Slice Mode: OFF";
  const autoSliceBtn = document.createElement("button");
  autoSliceBtn.className = "mini-btn";
  autoSliceBtn.textContent = "Auto-Slice";
  const clearSlicesBtn = document.createElement("button");
  clearSlicesBtn.className = "mini-btn";
  clearSlicesBtn.textContent = "Clear Slices";
  const tuneBtn = document.createElement("button");
  tuneBtn.className = "mini-btn";
  tuneBtn.textContent = "🎯 Tune";
  tuneBtn.title =
    "Detect pitch and tune sample to nearest note in current scale";
  const tuneResetBtn = document.createElement("button");
  tuneResetBtn.className = "mini-btn";
  tuneResetBtn.textContent = "↺ Untune";
  tuneResetBtn.title = "Reset tune offset";
  const exportBtn = document.createElement("button");
  exportBtn.className = "play";
  exportBtn.textContent = "⬇ Export WAV";
  exportBtn.style.marginLeft = "auto";
  const resetBtn = document.createElement("button");
  resetBtn.className = "danger";
  resetBtn.textContent = "Reset All";
  actionsRow.append(
    sliceModeBtn,
    autoSliceBtn,
    clearSlicesBtn,
    tuneBtn,
    tuneResetBtn,
    exportBtn,
    resetBtn
  );
  modal.appendChild(actionsRow);

  /* ---- Tune buttons ---- */
  const tuneInfo = document.createElement("div");
  tuneInfo.style.cssText =
    "font-size:10px;color:var(--muted);font-family:monospace;margin-top:-4px;";
  tuneInfo.textContent =
    "Tune: " +
    (s.tuneRate && s.tuneRate !== 1
      ? (12 * Math.log2(s.tuneRate)).toFixed(2) + " semis"
      : "0 (unmodified)");
  modal.appendChild(tuneInfo);

  tuneBtn.addEventListener("click", () => {
    try {
      if (typeof detectPitchAutocorrelation !== "function") {
        toast("Pitch detection unavailable", "error");
        return;
      }
      tuneBtn.disabled = true;
      tuneBtn.textContent = "🎯 Detecting…";
      setTimeout(() => {
        try {
          const detected = detectPitchAutocorrelation(s.buffer);
          if (!detected) {
            toast("No clear pitch detected (need monophonic audio)", "error");
            return;
          }

          const rootPC = typeof currentRoot === "number" ? currentRoot : 0;
          const scaleArr =
            typeof SCALES !== "undefined" && SCALES[currentScale]
              ? SCALES[currentScale]
              : [0, 2, 4, 5, 7, 9, 11];
          const targetPCS = scaleArr.map((x) => (rootPC + x) % 12);

          let targetMidi = Math.round(detected.midiFloat);
          let nearestPC = ((targetMidi % 12) + 12) % 12;
          let bestDist = 99,
            bestPC = targetPCS[0];
          targetPCS.forEach((pc) => {
            let d = Math.abs(pc - nearestPC);
            if (d > 6) d = 12 - d;
            if (d < bestDist) {
              bestDist = d;
              bestPC = pc;
            }
          });
          const diff = (bestPC - nearestPC + 12) % 12;
          const adjust = diff > 6 ? diff - 12 : diff;
          targetMidi += adjust;

          const semisOffset = targetMidi - detected.midiFloat;
          const rateMul = Math.pow(2, semisOffset / 12);

          if (!s.tuneRate) s.tuneRate = 1;
          s.tuneRate *= rateMul;

          tuneInfo.textContent =
            "Tune: " +
            (12 * Math.log2(s.tuneRate)).toFixed(2) +
            " semis · detected " +
            midiToName(targetMidi) +
            " (" +
            detected.frequency.toFixed(1) +
            " Hz)";
          toast(
            "Tuned to " +
              midiToName(targetMidi) +
              " (" +
              (semisOffset >= 0 ? "+" : "") +
              semisOffset.toFixed(2) +
              " semis)",
            "success"
          );
          autoSave();
        } catch (err) {
          console.error("Tune failed:", err);
          toast("Tune failed: " + err.message, "error");
        } finally {
          tuneBtn.disabled = false;
          tuneBtn.textContent = "🎯 Tune";
        }
      }, 20);
    } catch (err) {
      tuneBtn.disabled = false;
      tuneBtn.textContent = "🎯 Tune";
    }
  });

  tuneResetBtn.addEventListener("click", () => {
    if (s.tuneRate && s.tuneRate !== 1) {
      s.tuneRate = 1;
      tuneInfo.textContent = "Tune: 0 (unmodified)";
      toast("Tune offset reset", "success");
      autoSave();
    }
  });
  /* ────────── Helper: redraw / save / timing ────────── */
  const redraw = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = canvas.clientWidth * dpr);
    const h = (canvas.height = canvas.clientHeight * dpr);
    const g = canvas.getContext("2d");
    const data = s.buffer.getChannelData(0);
    const sampleRate = s.buffer.sampleRate;

    g.fillStyle = "#111";
    g.fillRect(0, 0, w, h);

    const zStart = zoomStart,
      zEnd = zoomEnd;
    const zDur = Math.max(0.0001, zEnd - zStart);
    const startSample = Math.floor(zStart * sampleRate);
    const endSample = Math.min(data.length, Math.floor(zEnd * sampleRate));
    const totalSamples = endSample - startSample;
    if (totalSamples <= 0) {
      return;
    }

    // Column-based min/max
    g.fillStyle = "#ff8a00";
    const cols = w;
    for (let i = 0; i < cols; i++) {
      const s0 = startSample + Math.floor((i / cols) * totalSamples);
      const s1 = startSample + Math.floor(((i + 1) / cols) * totalSamples);
      let mn = 1,
        mx = -1;
      for (let j = s0; j < s1 && j < endSample; j++) {
        const v = data[j];
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
      if (mx >= mn) {
        const y0 = ((1 - mx) * h) / 2;
        const y1 = ((1 - mn) * h) / 2;
        g.fillRect(i, y0, 1, Math.max(1, y1 - y0));
      }
    }

    // Fade overlays
    const tToPx = (t) => ((t - zStart) / zDur) * w;
    if (s.fadeIn > 0) {
      const fEnd = (s.start || 0) + s.fadeIn;
      g.fillStyle = "rgba(255,255,255,.08)";
      g.beginPath();
      g.moveTo(tToPx(s.start || 0), h);
      g.lineTo(tToPx(fEnd), 0);
      g.lineTo(tToPx(s.start || 0), 0);
      g.fill();
    }
    if (s.fadeOut > 0) {
      const fStart = (s.end || s.buffer.duration) - s.fadeOut;
      g.fillStyle = "rgba(255,255,255,.08)";
      g.beginPath();
      g.moveTo(tToPx(fStart), 0);
      g.lineTo(tToPx(s.end || s.buffer.duration), h);
      g.lineTo(tToPx(fStart), h);
      g.fill();
    }

    // Slices
    if (s.slices && s.slices.length) {
      g.strokeStyle = "#ff6b6b";
      g.lineWidth = 1;
      s.slices.forEach((sl) => {
        const x = tToPx(sl.start);
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, h);
        g.stroke();
      });
    }

    // Selection overlay positioning
    const selStartT = Math.max(s.start || 0, zStart);
    const selEndT = Math.min(s.end || s.buffer.duration, zEnd);
    const pxL = Math.max(0, Math.min(w, tToPx(selStartT)));
    const pxR = Math.max(0, Math.min(w, tToPx(selEndT)));
    selBox.style.left = pxL / dpr + "px";
    selBox.style.width = Math.max(0, (pxR - pxL) / dpr) + "px";
    handleL.style.left = "0%";
    handleR.style.left = "100%";

    // Ruler ticks
    ruler.innerHTML = "";
    const rulerDur = zDur;
    const tickCount = Math.max(1, Math.min(20, Math.floor(rulerDur * 8)));
    for (let i = 0; i <= tickCount; i++) {
      const t = zStart + (i / tickCount) * rulerDur;
      const pct = (i / tickCount) * 100;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;top:0;bottom:0;left:${pct}%;border-left:1px solid #333;padding-left:3px;display:flex;align-items:center;font-size:8px;color:#777;`;
      el.textContent = t.toFixed(2);
      ruler.appendChild(el);
    }

    updateTimeDisplay();
  };

  const updateTimeDisplay = () => {
    const st = s.start || 0;
    const en = s.end || s.buffer.duration;
    const dur = en - st;
    timeDisplay.textContent =
      st.toFixed(2) +
      "s → " +
      en.toFixed(2) +
      "s  ·  len " +
      dur.toFixed(2) +
      "s";
  };

  const save = () => {
    autoSave();
    updateTimeDisplay();
  };

  /* ────────── Playback ────────── */
  const stopPlayback = () => {
    if (playheadRaf) {
      cancelAnimationFrame(playheadRaf);
      playheadRaf = null;
    }
    playhead.style.display = "none";
    if (playHandle) {
      try {
        playHandle.stop();
      } catch (e) {}
      playHandle = null;
    }
    stopBtn.disabled = true;
    playBtn.disabled = false;
    playTrimBtn.disabled = false;
  };

  const startPlayback = (useTrim, useLoop) => {
    stopPlayback();
    try {
      initAudio();
      if (ctx.state === "suspended") ctx.resume();

      const startT = useTrim ? s.start || 0 : 0;
      const endT = useTrim ? s.end || s.buffer.duration : s.buffer.duration;
      const dur = endT - startT;
      if (dur <= 0) {
        toast("Nothing to play", "error");
        return;
      }

      // Build playback chain (mirrors playSampleNode but trackable)
      let useBuffer = s.buffer;
      if (s.reverse) {
        if (!s._reversedCache || s._reversedCache.srcBuffer !== s.buffer) {
          const rev = ctx.createBuffer(
            s.buffer.numberOfChannels,
            s.buffer.length,
            s.buffer.sampleRate
          );
          for (let ch = 0; ch < s.buffer.numberOfChannels; ch++) {
            const src = s.buffer.getChannelData(ch);
            const dst = rev.getChannelData(ch);
            for (let i = 0; i < src.length; i++)
              dst[i] = src[src.length - 1 - i];
          }
          s._reversedCache = { srcBuffer: s.buffer, revBuffer: rev };
        }
        useBuffer = s._reversedCache.revBuffer;
      }

      const src = ctx.createBufferSource();
      src.buffer = useBuffer;

      let playOffset = startT;
      if (s.reverse) playOffset = Math.max(0, s.buffer.duration - endT);

      const gain = ctx.createGain();
      const vol = s.gain || 1;
      const fi = s.fadeIn || 0;
      const fo = s.fadeOut || 0;

      const t0 = ctx.currentTime + 0.03;
      const t1 = t0 + dur;

      if (fi > 0 || fo > 0) {
        gain.gain.setValueAtTime(0, t0);
        if (fi > 0)
          gain.gain.linearRampToValueAtTime(vol, Math.min(t0 + fi, t1));
        else gain.gain.setValueAtTime(vol, t0);
        if (fo > 0) {
          gain.gain.setValueAtTime(vol, Math.max(t0, t1 - fo));
          gain.gain.linearRampToValueAtTime(0, t1);
        }
      } else {
        gain.gain.value = vol;
      }

      src.connect(gain);
      gain.connect(ctx.destination);

      if (useLoop) {
        src.loop = true;
        src.loopStart = playOffset;
        src.loopEnd = playOffset + dur;
      }

      src.start(t0, playOffset, useLoop ? undefined : dur);

      playHandle = {
        source: src,
        startTime: t0,
        endTime: t1,
        duration: dur,
        stop: () => {
          try {
            src.stop();
          } catch (e) {}
        },
      };
      stopBtn.disabled = false;
      playBtn.disabled = true;
      playTrimBtn.disabled = true;

      // Playhead animation
      const animate = () => {
        if (!playHandle) {
          return;
        }
        const now = ctx.currentTime;
        const elapsed = now - playHandle.startTime;
        if (elapsed >= 0 && playHandle) {
          const dur2 = playHandle.duration;
          const pct = Math.min(1, Math.max(0, elapsed / dur2));
          if (pct >= 1 && !useLoop) {
            stopPlayback();
            return;
          }
          // Map to display (zoom aware)
          const playingTime = startT + pct * dur;
          const dispPct =
            (playingTime - zoomStart) / Math.max(0.0001, zoomEnd - zoomStart);
          if (dispPct >= 0 && dispPct <= 1) {
            playhead.style.display = "block";
            playhead.style.left = dispPct * 100 + "%";
          } else {
            playhead.style.display = "none";
          }
        }
        playheadRaf = requestAnimationFrame(animate);
      };
      playhead.style.display = "block";
      animate();
    } catch (err) {
      console.error("Playback failed:", err);
      toast("Playback failed: " + (err.message || ""), "error");
      stopPlayback();
    }
  };

  playBtn.addEventListener("click", () => startPlayback(false, false));
  playTrimBtn.addEventListener("click", () => startPlayback(true, isLoop));
  stopBtn.addEventListener("click", stopPlayback);
  loopBtn.addEventListener("click", () => {
    isLoop = !isLoop;
    loopBtn.textContent = "🔁 Loop: " + (isLoop ? "ON" : "OFF");
    loopBtn.style.background = isLoop ? "var(--accent)" : "";
  });

  /* ────────── Zoom ────────── */
  const applyZoom = (newStart, newEnd) => {
    newStart = Math.max(0, newStart);
    newEnd = Math.min(s.buffer.duration, newEnd);
    if (newEnd - newStart < 0.02) return;
    zoomStart = newStart;
    zoomEnd = newEnd;
    redraw();
  };
  zoomIn.addEventListener("click", () => {
    const mid = (zoomStart + zoomEnd) / 2;
    const dur = (zoomEnd - zoomStart) * 0.6;
    applyZoom(mid - dur / 2, mid + dur / 2);
  });
  zoomOut.addEventListener("click", () => {
    const mid = (zoomStart + zoomEnd) / 2;
    const dur = (zoomEnd - zoomStart) / 0.6;
    applyZoom(mid - dur / 2, mid + dur / 2);
  });
  zoomFit.addEventListener("click", () => applyZoom(0, s.buffer.duration));

  /* ────────── Canvas interactions (trim handles + slice mode) ────────── */
  const clientXToTime = (clientX) => {
    const r = canvasWrap.getBoundingClientRect();
    const pct = (clientX - r.left) / r.width;
    return zoomStart + Math.max(0, Math.min(1, pct)) * (zoomEnd - zoomStart);
  };

  const onCanvasDown = (e) => {
    if (e.button !== 0) return;
    const r = canvasWrap.getBoundingClientRect();
    const px = e.clientX - r.left;
    const w = r.width;
    const time = clientXToTime(e.clientX);

    // Slice mode: click adds or removes slice
    if (isSliceMode) {
      pushHistory();
      if (!s.slices) s.slices = [];
      let removed = false;
      for (let i = 0; i < s.slices.length; i++) {
        if (Math.abs(s.slices[i].start - time) < 0.05) {
          s.slices.splice(i, 1);
          if (i > 0)
            s.slices[i - 1].end =
              i < s.slices.length
                ? s.slices[i].start
                : s.end || s.buffer.duration;
          removed = true;
          break;
        }
      }
      if (!removed) {
        const newEnd =
          s.slices.length > 0
            ? s.slices[s.slices.length - 1].end
            : s.end || s.buffer.duration;
        if (s.slices.length > 0) {
          let insertIdx = s.slices.findIndex((sl) => sl.start > time);
          if (insertIdx === -1) insertIdx = s.slices.length;
          if (insertIdx > 0) {
            const prev = s.slices[insertIdx - 1];
            const oldEnd = prev.end;
            prev.end = time;
            s.slices.splice(insertIdx, 0, { start: time, end: oldEnd });
          } else {
            s.slices.unshift({ start: time, end: s.slices[0].start });
          }
        } else {
          s.slices.push({ start: time, end: newEnd });
        }
      }
      redraw();
      save();
      return;
    }

    // Detect which target: L-handle, R-handle, or interior
    const startPx =
      (((s.start || 0) - zoomStart) / Math.max(0.0001, zoomEnd - zoomStart)) *
      w;
    const endPx =
      (((s.end || s.buffer.duration) - zoomStart) /
        Math.max(0.0001, zoomEnd - zoomStart)) *
      w;
    const dStart = Math.abs(px - startPx);
    const dEnd = Math.abs(px - endPx);
    const nearPx = 12;

    if (dStart < nearPx && dStart <= dEnd) {
      dragTarget = "start";
    } else if (dEnd < nearPx) {
      dragTarget = "end";
    } else if (px > startPx && px < endPx) {
      dragTarget = "sel";
      dragOrigin = {
        clickTime: time,
        sStart: s.start || 0,
        sEnd: s.end || s.buffer.duration,
      };
    } else {
      dragTarget = "start"; // clicking outside trim picks nearest edge
      if (time < ((s.start || 0) + (s.end || s.buffer.duration)) / 2)
        dragTarget = "start";
      else dragTarget = "end";
      // fall through to drag
    }
    onCanvasMove(e);
    e.preventDefault();
  };

  const onCanvasMove = (e) => {
    if (!dragTarget) return;
    const time = clientXToTime(e.clientX);
    if (dragTarget === "start") {
      s.start = Math.max(
        0,
        Math.min(time, (s.end || s.buffer.duration) - 0.005)
      );
      startField.inp.value = s.start.toFixed(3);
      redraw();
      save();
    } else if (dragTarget === "end") {
      s.end = Math.max(
        (s.start || 0) + 0.005,
        Math.min(time, s.buffer.duration)
      );
      endField.inp.value = s.end.toFixed(3);
      redraw();
      save();
    } else if (dragTarget === "sel" && dragOrigin) {
      const dt = time - dragOrigin.clickTime;
      const len = dragOrigin.sEnd - dragOrigin.sStart;
      let ns = dragOrigin.sStart + dt;
      let ne = ns + len;
      if (ns < 0) {
        ns = 0;
        ne = len;
      }
      if (ne > s.buffer.duration) {
        ne = s.buffer.duration;
        ns = ne - len;
      }
      s.start = ns;
      s.end = ne;
      startField.inp.value = s.start.toFixed(3);
      endField.inp.value = s.end.toFixed(3);
      redraw();
      save();
    }
  };

  const onCanvasUp = () => {
    dragTarget = null;
    dragOrigin = null;
  };

  canvasWrap.addEventListener("mousedown", onCanvasDown);
  window.addEventListener("mousemove", onCanvasMove);
  window.addEventListener("mouseup", onCanvasUp);

  /* ────────── Slice mode toggle ────────── */
  sliceModeBtn.addEventListener("click", () => {
    isSliceMode = !isSliceMode;
    sliceModeBtn.textContent = "Slice Mode: " + (isSliceMode ? "ON" : "OFF");
    sliceModeBtn.style.background = isSliceMode ? "var(--accent)" : "";
    canvasWrap.style.cursor = isSliceMode ? "crosshair" : "default";
    selBox.style.display = isSliceMode ? "none" : "block";
  });

  autoSliceBtn.addEventListener("click", () => {
    pushHistory();
    const data = s.buffer.getChannelData(0);
    const sr = s.buffer.sampleRate;
    const threshold = 0.2;
    const slices = [];
    let lastSliceTime = s.start || 0;
    const minSpacing = 0.05 * sr;
    let inPeak = false;
    for (
      let i = Math.floor((s.start || 0) * sr);
      i < Math.floor((s.end || s.buffer.duration) * sr);
      i++
    ) {
      const val = Math.abs(data[i]);
      if (val > threshold && !inPeak) {
        if (i - lastSliceTime * sr > minSpacing) {
          slices.push({ start: i / sr, end: s.end || s.buffer.duration });
          if (slices.length > 1) slices[slices.length - 2].end = i / sr;
          lastSliceTime = i / sr;
        }
        inPeak = true;
      } else if (val < threshold * 0.5) {
        inPeak = false;
      }
    }
    if (slices.length > 0) {
      slices[0].start = s.start || 0;
      s.slices = slices;
      redraw();
      save();
      toast(slices.length + " slices detected", "success");
    } else {
      toast("No transients found", "error");
    }
  });

  clearSlicesBtn.addEventListener("click", () => {
    if (!s.slices || !s.slices.length) return;
    pushHistory();
    s.slices = [];
    redraw();
    save();
    toast("Slices cleared", "success");
  });

  /* ────────── Export & Reset ────────── */
  exportBtn.addEventListener("click", async () => {
    await exportSampleAsWav(trackId);
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset all sample edits (trim, gain, fade, reverse, slices)?"))
      return;
    pushHistory();
    s.start = 0;
    s.end = s.buffer.duration;
    s.gain = 1;
    s.reverse = false;
    s.fadeIn = 0;
    s.fadeOut = 0;
    s.slices = [];
    startField.inp.value = "0.000";
    endField.inp.value = s.buffer.duration.toFixed(3);
    gainField.inp.value = "0.0";
    fadeInField.inp.value = "0.000";
    fadeOutField.inp.value = "0.000";
    revInp.checked = false;
    applyZoom(0, s.buffer.duration);
    redraw();
    save();
    toast("Sample reset", "success");
  });

  /* ────────── Modal show + final init ────────── */
  const closeFn = () => {
    stopPlayback();
    window.removeEventListener("mousemove", onCanvasMove);
    window.removeEventListener("mouseup", onCanvasUp);
    hideModal();
  };
  showModal("✂️ Sample Editor · " + track.name, modal, [
    { label: "Cancel", onClick: closeFn },
    {
      label: "Apply & Close",
      className: "play",
      onClick: () => {
        pushHistory();
        closeFn();
        rebuildRack();
      },
    },
  ]);

  // Initial redraw (after layout so clientWidth is valid)
  setTimeout(redraw, 30);
}
/* ---------- Sample import & microphone recording ---------- */
async function assignSampleToTrack(trackId, name, arrayBuffer, audioBuffer) {
  if (
    !audioBuffer ||
    typeof audioBuffer.duration !== "number" ||
    !isFinite(audioBuffer.duration) ||
    audioBuffer.duration <= 0
  ) {
    throw new Error("Invalid audio buffer (empty or zero-duration)");
  }
  const id = genId("smp");
  const previous = samples[trackId];
  await dbPutSample(id, name, arrayBuffer);
  samples[trackId] = {
    id,
    name,
    buffer: audioBuffer,
    missing: false,
    start: 0,
    end: audioBuffer.duration,
    gain: 1,
    reverse: false,
    fadeIn: 0,
    fadeOut: 0,
    slices: [],
  };
  autoSave();
  if (previous && previous.id && previous.id !== id) {
    try {
      await dbDeleteSample(previous.id);
    } catch (e) {
      console.warn("Could not delete old sample:", e);
    }
  }
  rebuildRack();
  rebuildMixer();
  toast("Sample loaded: " + name, "success");
}
function importSample(trackId) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "audio/*,.wav,.mp3,.ogg,.m4a,.flac";
  input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      initAudio();
      if (ctx.state === "suspended") await ctx.resume();
      const ab = await file.arrayBuffer();

      // Wenn es eine WAV ist → manueller Parser (kein Renderer-Crash-Risiko)
      const head = new Uint8Array(ab, 0, 12);
      const isRIFF =
        head[0] === 0x52 &&
        head[1] === 0x49 &&
        head[2] === 0x46 &&
        head[3] === 0x46;
      const isWAVE =
        head[8] === 0x57 &&
        head[9] === 0x41 &&
        head[10] === 0x56 &&
        head[11] === 0x45;

      let buf;
      if (isRIFF && isWAVE) {
        buf = parseWavToAudioBuffer(ab, ctx);
      } else {
        // MP3 / OGG / FLAC / M4A — nativer Decoder, aber User-initiiert (nicht Startup)
        buf = await ctx.decodeAudioData(ab.slice(0));
      }
      await assignSampleToTrack(trackId, file.name, ab, buf);
    } catch (err) {
      toast("Import failed: " + err.message, "error");
    }
  });
  input.click();
}
/* Convert AudioBuffer to 16-bit PCM WAV Blob (for reliable storage & playback) */
function audioBufferToWavBlob(audioBuffer) {
  if (
    !audioBuffer ||
    typeof audioBuffer.duration !== "number" ||
    !isFinite(audioBuffer.duration) ||
    audioBuffer.duration <= 0
  ) {
    throw new Error("Invalid audio buffer");
  }
  const numCh = Math.min(2, audioBuffer.numberOfChannels || 1);
  const len = audioBuffer.length;
  const sr = audioBuffer.sampleRate;
  const ba = numCh * 2;
  const ds = len * ba;
  const buf = new ArrayBuffer(44 + ds);
  const view = new DataView(buf);
  let o = 0;
  const ws = (s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o++, s.charCodeAt(i));
  };
  const u32 = (v) => {
    view.setUint32(o, v, true);
    o += 4;
  };
  const u16 = (v) => {
    view.setUint16(o, v, true);
    o += 2;
  };
  ws("RIFF");
  u32(36 + ds);
  ws("WAVE");
  ws("fmt ");
  u32(16);
  u16(1);
  u16(numCh);
  u32(sr);
  u32(sr * ba);
  u16(ba);
  u16(16);
  ws("data");
  u32(ds);
  const chs = [];
  for (let c = 0; c < numCh; c++) chs.push(audioBuffer.getChannelData(c));
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, chs[c][i] || 0));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(o, s | 0, true);
      o += 2;
    }
  }
  return new Blob([buf], { type: "audio/wav" });
}
/* Lazily loads a minimal AudioWorklet processor for raw PCM capture.
   Worklet code is inlined via Blob URL — no separate file needed.
   This avoids ScriptProcessorNode, which is deprecated and known to
   cause native renderer crashes with microphone streams on some builds. */
let _pcmWorkletState = "idle"; // 'idle' | 'ready' | 'failed'
async function _ensurePCMWorklet(audioCtx) {
  if (_pcmWorkletState === "failed")
    throw new Error("AudioWorklet previously failed to load");
  if (_pcmWorkletState === "ready") return;
  if (!audioCtx || !audioCtx.audioWorklet) {
    _pcmWorkletState = "failed";
    throw new Error("AudioWorklet is not supported in this environment");
  }
  const code = `
class PCMRecorderProcessor extends AudioWorkletProcessor {
  constructor(){
    super();
    this._active = true;
    this.port.onmessage = (e) => {
      if(e.data === 'stop') this._active = false;
    };
  }
  process(inputs){
    if(!this._active) return true;
    const input = inputs[0];
    if(input && input[0] && input[0].length){
      try{ this.port.postMessage(input[0].slice(0)); }catch(_){}
    }
    return true;
  }
}
registerProcessor('pcm-recorder', PCMRecorderProcessor);
  `.trim();
  const blob = new Blob([code], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    await audioCtx.audioWorklet.addModule(url);
    _pcmWorkletState = "ready";
  } catch (err) {
    _pcmWorkletState = "failed";
    throw err;
  } finally {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {}
  }
}
function showMicRecordModal(trackId) {
  const track = TRACKS.find((t) => t.id === trackId && t.type === "sample");
  if (!track) return;
  if (
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== "function"
  ) {
    toast("Microphone access is not supported in this environment.", "error");
    return;
  }
  if (micCaptureSession) releaseMicCaptureSession();

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:12px;";

  const description = document.createElement("div");
  description.style.cssText =
    "font-size:12px;color:var(--muted);line-height:1.5;";
  description.textContent =
    "Record audio through your microphone. After stopping you can preview the recording and use it as a sample in " +
    track.name +
    ". Recordings are stored locally as WAV.";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Sample name";
  nameLabel.style.cssText = "font-size:12px;color:var(--muted);";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value =
    "mic-" +
    track.id +
    "-" +
    new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  nameInput.style.cssText =
    "width:100%;background:#111;color:#ddd;border:1px solid #000;border-radius:4px;padding:8px;";
  nameLabel.appendChild(nameInput);

  const controls = document.createElement("div");
  controls.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;";
  const startBtn = document.createElement("button");
  startBtn.className = "play";
  startBtn.textContent = "● Start recording";
  const stopBtn = document.createElement("button");
  stopBtn.className = "stop";
  stopBtn.textContent = "■ Stop recording";
  stopBtn.disabled = true;
  const previewBtn = document.createElement("button");
  previewBtn.textContent = "▶ Preview";
  previewBtn.disabled = true;
  controls.append(startBtn, stopBtn, previewBtn);

  const status = document.createElement("div");
  status.style.cssText =
    "font-size:12px;padding:8px;background:#171717;border:1px solid #333;border-radius:4px;";
  status.textContent =
    'Ready. Press "Start recording" and allow microphone access.';

  wrap.append(description, nameLabel, controls, status);

  const session = {
    trackId,
    stream: null,
    source: null,
    workletNode: null,
    silentGain: null,
    chunks: [],
    sampleRate: 44100,
    audioBuffer: null,
    wavBlob: null,
    previewSource: null,
    isRecording: false,
    saving: false,
    startBtn,
    stopBtn,
    previewBtn,
    status,
    nameInput,
    useBtn: null,
  };
  micCaptureSession = session;

  /* ------- START ------- */
  startBtn.addEventListener("click", async () => {
    if (micCaptureSession !== session || session.isRecording || session.saving)
      return;
    startBtn.disabled = true;
    stopBtn.disabled = true;
    previewBtn.disabled = true;
    status.textContent = "Preparing recorder…";

    try {
      initAudio();
      if (ctx.state === "suspended") await ctx.resume();
      console.log("[mic] ctx ready, state =", ctx.state);

      try {
        await _ensurePCMWorklet(ctx);
        console.log("[mic] worklet module loaded");
      } catch (err) {
        console.error("[mic] worklet load failed:", err);
        status.textContent =
          "Recording not supported: " +
          ((err && err.message) || "AudioWorklet unavailable");
        toast("Recording not supported in this environment", "error");
        startBtn.disabled = false;
        return;
      }

      status.textContent = "Requesting microphone…";
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });
      console.log(
        "[mic] getUserMedia resolved, tracks =",
        stream.getTracks().length
      );

      if (micCaptureSession !== session) {
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch (e) {}
        return;
      }
      session.stream = stream;

      /* Create source node from mic stream */
      session.source = ctx.createMediaStreamSource(stream);
      console.log("[mic] source node created");

      /* Create AudioWorkletNode for raw PCM capture */
      const workletNode = new AudioWorkletNode(ctx, "pcm-recorder", {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
      });
      console.log("[mic] worklet node created");

      session.chunks = [];
      session.sampleRate = ctx.sampleRate;
      session.audioBuffer = null;
      session.wavBlob = null;
      session.isRecording = true;

      workletNode.port.onmessage = (ev) => {
        if (!session.isRecording) return;
        if (ev.data && ev.data.length) {
          try {
            session.chunks.push(ev.data);
          } catch (e) {}
        }
      };

      /* Silent sink so the worklet process() fires */
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;

      session.source.connect(workletNode);
      workletNode.connect(silentGain);
      silentGain.connect(ctx.destination);
      console.log("[mic] graph connected");

      session.workletNode = workletNode;
      session.silentGain = silentGain;

      stopBtn.disabled = false;
      status.textContent = "● Recording… speak or play into your microphone.";
    } catch (err) {
      console.error("[mic] start failed:", err);
      /* Safe cleanup of partial state */
      try {
        if (session.workletNode) {
          try {
            session.workletNode.disconnect();
          } catch (e) {}
          session.workletNode = null;
        }
        if (session.source) {
          try {
            session.source.disconnect();
          } catch (e) {}
          session.source = null;
        }
        if (session.silentGain) {
          try {
            session.silentGain.disconnect();
          } catch (e) {}
          session.silentGain = null;
        }
        if (session.stream) {
          try {
            session.stream.getTracks().forEach((t) => t.stop());
          } catch (e) {}
          session.stream = null;
        }
      } catch (e) {}
      session.isRecording = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      status.textContent =
        "Microphone access failed: " +
        ((err && (err.message || err.name)) || "Unknown error");
      toast(
        "Microphone unavailable: " + ((err && (err.message || err.name)) || ""),
        "error"
      );
    }
  });

  /* ------- STOP ------- */
  stopBtn.addEventListener("click", () => {
    if (!session.isRecording) return;
    session.isRecording = false;

    if (session.workletNode) {
      try {
        session.workletNode.port.postMessage("stop");
      } catch (e) {}
      try {
        session.workletNode.port.onmessage = null;
      } catch (e) {}
      try {
        session.workletNode.disconnect();
      } catch (e) {}
      session.workletNode = null;
    }
    if (session.source) {
      try {
        session.source.disconnect();
      } catch (e) {}
      session.source = null;
    }
    if (session.silentGain) {
      try {
        session.silentGain.disconnect();
      } catch (e) {}
      session.silentGain = null;
    }
    if (session.stream) {
      try {
        session.stream.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      session.stream = null;
    }

    const chunks = session.chunks || [];
    let total = 0;
    for (let i = 0; i < chunks.length; i++) total += chunks[i].length;
    if (!total) {
      session.chunks = [];
      status.textContent = "No audio data recorded. Please try again.";
      startBtn.disabled = false;
      stopBtn.disabled = true;
      return;
    }

    const merged = new Float32Array(total);
    let off = 0;
    for (let i = 0; i < chunks.length; i++) {
      merged.set(chunks[i], off);
      off += chunks[i].length;
    }
    session.chunks = [];

    try {
      const audioBuffer = ctx.createBuffer(
        1,
        merged.length,
        session.sampleRate
      );
      audioBuffer.copyToChannel(merged, 0);
      session.audioBuffer = audioBuffer;
      session.wavBlob = audioBufferToWavBlob(audioBuffer);
      status.textContent = `Recording finished · ${audioBuffer.duration.toFixed(
        2
      )}s · ${(session.wavBlob.size / 1024).toFixed(1)} KB.`;
      previewBtn.disabled = false;
      if (session.useBtn) session.useBtn.disabled = false;
      console.log(
        "[mic] audio buffer built, duration =",
        audioBuffer.duration.toFixed(2)
      );
    } catch (err) {
      console.error("[mic] buffer build failed:", err);
      session.audioBuffer = null;
      session.wavBlob = null;
      status.textContent =
        "Could not finalize recording: " +
        ((err && err.message) || "Unknown error");
      toast("Recording finalize failed", "error");
    }

    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  /* ------- PREVIEW ------- */
  previewBtn.addEventListener("click", () => {
    if (!session.audioBuffer) {
      toast("No recording available", "error");
      return;
    }
    try {
      initAudio();
      if (ctx.state === "suspended") ctx.resume();
      if (session.previewSource) {
        try {
          session.previewSource.stop();
        } catch (e) {}
        session.previewSource = null;
      }
      const src = ctx.createBufferSource();
      src.buffer = session.audioBuffer;
      const g = ctx.createGain();
      g.gain.value = 0.8;
      src.connect(g);
      g.connect(ctx.destination);
      src.onended = () => {
        if (session.previewSource === src) session.previewSource = null;
      };
      src.start();
      session.previewSource = src;
      status.textContent =
        "Previewing… " + session.audioBuffer.duration.toFixed(2) + "s";
    } catch (err) {
      console.error("[mic] preview failed:", err);
      toast(
        "Preview failed: " +
          ((err && (err.message || err.name)) || "Unknown error"),
        "error"
      );
    }
  });

  /* ------- MODAL ACTIONS ------- */
  showModal("🎙 Microphone recording · " + track.name, wrap, [
    { label: "Cancel", onClick: hideModal },
    {
      label: "Use as sample",
      className: "play",
      onClick: async () => {
        if (micCaptureSession !== session) return;
        if (!session.audioBuffer || !session.wavBlob) {
          toast("Please record something first.", "error");
          return;
        }
        if (session.saving) return;
        session.saving = true;
        if (session.useBtn) session.useBtn.disabled = true;
        try {
          const wavAb = await session.wavBlob.arrayBuffer();
          if (!wavAb || wavAb.byteLength < 44)
            throw new Error("WAV encoding failed");
          const base =
            session.nameInput.value.trim().replace(/\.[a-z0-9]+$/i, "") ||
            "mic-" + track.id;
          await assignSampleToTrack(
            track.id,
            base + ".wav",
            wavAb,
            session.audioBuffer
          );
          try {
            hideModal();
          } catch (e) {
            console.error("[mic] hideModal:", e);
          }
        } catch (err) {
          console.error("[mic] use as sample failed:", err);
          session.saving = false;
          if (session.useBtn) session.useBtn.disabled = false;
          status.textContent =
            "Could not save: " +
            ((err && (err.message || err.name)) || "Unknown error");
          toast("Could not save recording", "error");
        }
      },
    },
  ]);
  session.useBtn = modalOverlay.querySelector(
    ".modal-actions button:last-child"
  );
  if (session.useBtn) session.useBtn.disabled = true;
}

/* ---------- Mixer / FX ---------- */
const mixerView = document.getElementById("mixerView");
const fxPanel = document.getElementById("fxPanel");
function formatPan(p) {
  if (Math.abs(p) < 0.01) return "C";
  return p < 0 ? "L" + Math.round(-p * 100) : "R" + Math.round(p * 100);
}
function fmtHz(hz) {
  if (hz >= 1000) return (hz / 1000).toFixed(1) + "k";
  return Math.round(hz) + "";
}
function rebuildMixer() {
  if (!mixerView) return;
  mixerView.innerHTML = "";
  TRACKS.forEach((track) => {
    const strip = document.createElement("div");
    strip.className =
      "strip" + (track.type === "sample" ? " sample-strip" : "");
    strip.dataset.track = track.id;
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = track.name;
    name.style.color = track.color;
    if (track.type === "sample") {
      const s = document.createElement("div");
      s.className = "sub";
      const sm = samples[track.id];
      s.textContent = sm ? (sm.missing ? "⚠ " + sm.name : sm.name) : "empty";
      if (sm && sm.missing) s.style.color = "#c62828";
      strip.appendChild(s);
    }
    const led = document.createElement("div");
    led.className = "led";
    led.style.background = "#333";
    ledEls["mix_" + track.id] = led;
    const cutoffRow = document.createElement("div");
    cutoffRow.className = "small-row";
    const cL = document.createElement("span");
    cL.textContent = "Cut";
    const cS = document.createElement("input");
    cS.type = "range";
    cS.min = "20";
    cS.max = "20000";
    cS.step = "10";
    cS.value = track.filter.cutoff;
    const cV = document.createElement("span");
    cV.textContent = fmtHz(track.filter.cutoff);
    cS.addEventListener("input", () => {
      track.filter.cutoff = parseFloat(cS.value);
      cV.textContent = fmtHz(track.filter.cutoff);
      const b = buses[track.id];
      if (b && b.filter)
        b.filter.frequency.setTargetAtTime(
          track.filter.cutoff,
          ctx ? ctx.currentTime : 0,
          0.01
        );
      autoSave();
    });
    cutoffRow.appendChild(cL);
    cutoffRow.appendChild(cS);
    cutoffRow.appendChild(cV);
    const qRow = document.createElement("div");
    qRow.className = "small-row";
    const qL = document.createElement("span");
    qL.textContent = "Q";
    const qS = document.createElement("input");
    qS.type = "range";
    qS.min = "0.1";
    qS.max = "20";
    qS.step = "0.1";
    qS.value = track.filter.q;
    const qV = document.createElement("span");
    qV.textContent = track.filter.q.toFixed(1);
    qS.addEventListener("input", () => {
      track.filter.q = parseFloat(qS.value);
      qV.textContent = track.filter.q.toFixed(1);
      const b = buses[track.id];
      if (b && b.filter)
        b.filter.Q.setTargetAtTime(
          track.filter.q,
          ctx ? ctx.currentTime : 0,
          0.01
        );
      autoSave();
    });
    qRow.appendChild(qL);
    qRow.appendChild(qS);
    qRow.appendChild(qV);
    const panRow = document.createElement("div");
    panRow.className = "small-row";
    const pl = document.createElement("span");
    pl.textContent = "Pan";
    const ps = document.createElement("input");
    ps.type = "range";
    ps.min = "-1";
    ps.max = "1";
    ps.step = "0.01";
    ps.value = track.pan;
    const pv = document.createElement("span");
    pv.textContent = formatPan(track.pan);
    ps.addEventListener("input", () => {
      track.pan = parseFloat(ps.value);
      pv.textContent = formatPan(track.pan);
      const b = buses[track.id];
      if (b && b.panner) b.panner.pan.value = track.pan;
      autoSave();
    });
    panRow.appendChild(pl);
    panRow.appendChild(ps);
    panRow.appendChild(pv);
    const sendRow = document.createElement("div");
    sendRow.className = "small-row";
    const sl = document.createElement("span");
    sl.textContent = "Send";
    const ss = document.createElement("input");
    ss.type = "range";
    ss.min = "0";
    ss.max = "1";
    ss.step = "0.01";
    ss.value = track.send;
    const sv = document.createElement("span");
    sv.textContent = Math.round(track.send * 100) + "%";
    ss.addEventListener("input", () => {
      track.send = parseFloat(ss.value);
      sv.textContent = Math.round(track.send * 100) + "%";
      const b = buses[track.id];
      if (b) b.send.gain.value = track.send;
      autoSave();
    });
    sendRow.appendChild(sl);
    sendRow.appendChild(ss);
    sendRow.appendChild(sv);
    /* ── v18: Input Gain ── */
    const inRow = document.createElement("div");
    inRow.className = "small-row";
    const inL = document.createElement("span");
    inL.textContent = "In";
    inL.title = "Pre-Filter Gain";
    const inS = document.createElement("input");
    inS.type = "range";
    inS.min = "0";
    inS.max = "2";
    inS.step = "0.01";
    inS.value = typeof track.inputGain === "number" ? track.inputGain : 1;
    const inV = document.createElement("span");
    inV.textContent = Math.round((track.inputGain ?? 1) * 100) + "%";
    inS.addEventListener("input", () => {
      track.inputGain = parseFloat(inS.value);
      inV.textContent = Math.round(track.inputGain * 100) + "%";
      const b = buses[track.id];
      if (b && b.inputGain && ctx) {
        b.inputGain.gain.setTargetAtTime(
          track.inputGain,
          ctx.currentTime,
          0.01
        );
      }
      autoSave();
    });
    inRow.appendChild(inL);
    inRow.appendChild(inS);
    inRow.appendChild(inV);
    const faderWrap = document.createElement("div");
    faderWrap.className = "fader-wrap";
    const fader = document.createElement("input");
    fader.type = "range";
    fader.min = "0";
    fader.max = "1.2";
    fader.step = "0.01";
    fader.value = track.volume;
    fader.className = "fader";
    const val = document.createElement("div");
    val.className = "val";
    val.textContent = Math.round(track.volume * 100) + "%";
    fader.addEventListener("input", () => {
      track.volume = parseFloat(fader.value);
      applyTrackGain(track);
      const idx = TRACKS.indexOf(track);
      const rows = tracksContainer.children;
      if (rows[idx]) {
        const r = rows[idx].querySelector("input[type=range]");
        if (r) r.value = track.volume;
      }
      val.textContent = Math.round(track.volume * 100) + "%";
      autoSave();
    });
    faderWrap.appendChild(fader);
    const btns = document.createElement("div");
    btns.className = "btns";
    const mb = document.createElement("button");
    mb.textContent = "M";
    mb.title = "Mute";
    mb.className = "mute" + (track.mute ? " on" : "");
    mb.addEventListener("click", () => {
      pushHistory();
      track.mute = !track.mute;
      mb.classList.toggle("on", track.mute);
      refreshAllGains();
      autoSave();
    });
    const sb = document.createElement("button");
    sb.textContent = "S";
    sb.title = "Solo";
    sb.className = "solo" + (track.solo ? " on" : "");
    sb.addEventListener("click", () => {
      pushHistory();
      track.solo = !track.solo;
      sb.classList.toggle("on", track.solo);
      refreshAllGains();
      autoSave();
    });
    btns.appendChild(mb);
    btns.appendChild(sb);

    // ── Sidechain ──
    if (track.type !== "drum" || track.id !== "kick") {
      const scb = document.createElement("button");
      scb.textContent = "SC";
      scb.title = "Sidechain — duck this track whenever the kick fires";
      scb.className = "sidechain" + (track.sidechain ? " on" : "");
      scb.style.cssText = "font-size:9px;padding:4px 0;";
      scb.addEventListener("click", () => {
        pushHistory();
        track.sidechain = !track.sidechain;
        scb.classList.toggle("on", track.sidechain);
        if (typeof setTrackSidechain === "function")
          setTrackSidechain(track.id, track.sidechain);
        autoSave();
      });
      scb.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, [
          { header: "Sidechain · " + track.name },
          {
            label:
              "Amount: " +
              Math.round((track.sidechainAmount ?? 0.7) * 100) +
              "%",
            disabled: true,
          },
          {
            label: "Amount 30%",
            action: () => {
              pushHistory();
              if (typeof setTrackSidechain === "function")
                setTrackSidechain(track.id, null, 0.3, null);
              autoSave();
            },
          },
          {
            label: "Amount 50%",
            action: () => {
              pushHistory();
              if (typeof setTrackSidechain === "function")
                setTrackSidechain(track.id, null, 0.5, null);
              autoSave();
            },
          },
          {
            label: "Amount 70%",
            action: () => {
              pushHistory();
              if (typeof setTrackSidechain === "function")
                setTrackSidechain(track.id, null, 0.7, null);
              autoSave();
            },
          },
          {
            label: "Amount 90%",
            action: () => {
              pushHistory();
              if (typeof setTrackSidechain === "function")
                setTrackSidechain(track.id, null, 0.9, null);
              autoSave();
            },
          },
          "---",
          {
            label:
              "Release: " +
              Math.round((track.sidechainRelease ?? 0.15) * 1000) +
              "ms",
            disabled: true,
          },
          {
            label: "Fast (50ms)",
            action: () => {
              pushHistory();
              if (typeof setTrackSidechain === "function")
                setTrackSidechain(track.id, null, null, 0.05);
              autoSave();
            },
          },
          {
            label: "Med (150ms)",
            action: () => {
              pushHistory();
              if (typeof setTrackSidechain === "function")
                setTrackSidechain(track.id, null, null, 0.15);
              autoSave();
            },
          },
          {
            label: "Slow (400ms)",
            action: () => {
              pushHistory();
              if (typeof setTrackSidechain === "function")
                setTrackSidechain(track.id, null, null, 0.4);
              autoSave();
            },
          },
        ]);
      });
      btns.appendChild(scb);
    }
    const fxBtn = document.createElement("button");
    fxBtn.className = "fx-btn";
    fxBtn.textContent = "FX (" + (track.effects || []).length + ")";
    fxBtn.addEventListener("click", () => openFxPanel(track.id));
    strip.appendChild(name);
    strip.appendChild(led);
    strip.appendChild(cutoffRow);
    strip.appendChild(qRow);
    strip.appendChild(panRow);
    strip.appendChild(inRow);
    strip.appendChild(sendRow);
    strip.appendChild(faderWrap);
    strip.appendChild(val);
    strip.appendChild(btns);
    strip.appendChild(fxBtn);
    mixerView.appendChild(strip);
  });
  const mStrip = document.createElement("div");
  mStrip.className = "strip master-strip";
  const mName = document.createElement("div");
  mName.className = "name";
  mName.textContent = "MASTER";
  mName.style.color = "var(--accent)";
  const mFaderWrap = document.createElement("div");
  mFaderWrap.className = "fader-wrap";
  const mFader = document.createElement("input");
  mFader.type = "range";
  mFader.min = "0";
  mFader.max = "1.2";
  mFader.step = "0.01";
  mFader.value = master;
  mFader.className = "fader";
  const mVal = document.createElement("div");
  mVal.className = "val";
  mVal.textContent = Math.round(master * 100) + "%";
  mFader.addEventListener("input", () => {
    master = parseFloat(mFader.value);
    if (masterGain) masterGain.gain.value = master;
    document.getElementById("master").value = master;
    mVal.textContent = Math.round(master * 100) + "%";
    autoSave();
  });
  mFaderWrap.appendChild(mFader);
  // ── Reverb ──
  const rRow = document.createElement("div");
  rRow.className = "small-row";
  const rL = document.createElement("span");
  rL.textContent = "Reverb";
  const rS = document.createElement("input");
  rS.type = "range";
  rS.min = "0";
  rS.max = "1";
  rS.step = "0.01";
  rS.value = reverbAmount;
  rS.addEventListener("input", () => {
    reverbAmount = parseFloat(rS.value);
    if (reverbReturn) reverbReturn.gain.value = reverbAmount;
    document.getElementById("reverbAmount").value = reverbAmount;
    autoSave();
  });
  rRow.appendChild(rL);
  rRow.appendChild(rS);

  // ── Reverb Preset dropdown ──
  const rvPRow = document.createElement("div");
  rvPRow.className = "small-row";
  const rvPL = document.createElement("span");
  rvPL.textContent = "RV";
  const rvPSel = document.createElement("select");
  rvPSel.style.cssText =
    "flex:1;background:#111;color:#ddd;border:1px solid #000;font-size:9px;padding:1px 2px;border-radius:2px;";
  if (typeof REVERB_PRESETS !== "undefined") {
    Object.entries(REVERB_PRESETS).forEach(([id, p]) => {
      const o = document.createElement("option");
      o.value = id;
      o.textContent = p.name;
      if (id === reverbPresetId) o.selected = true;
      rvPSel.appendChild(o);
    });
  }
  rvPSel.addEventListener("change", () => {
    pushHistory();
    if (typeof setReverbPreset === "function") setReverbPreset(rvPSel.value);
    autoSave();
    rebuildMixer();
  });
  rvPRow.appendChild(rvPL);
  rvPRow.appendChild(rvPSel);

  // ── Reverb Decay slider ──
  const rvDRow = document.createElement("div");
  rvDRow.className = "small-row";
  const rvDL = document.createElement("span");
  rvDL.textContent = "Decay";
  const rvDS = document.createElement("input");
  rvDS.type = "range";
  rvDS.min = "0.3";
  rvDS.max = "8";
  rvDS.step = "0.1";
  rvDS.value = reverbDecay;
  const rvDV = document.createElement("span");
  rvDV.textContent = reverbDecay.toFixed(1) + "s";
  rvDS.addEventListener("input", () => {
    const v = parseFloat(rvDS.value);
    if (typeof setReverbDecay === "function") setReverbDecay(v);
    rvDV.textContent = v.toFixed(1) + "s";
    autoSave();
  });
  rvDRow.appendChild(rvDL);
  rvDRow.appendChild(rvDS);
  rvDRow.appendChild(rvDV);

  // ── Master EQ Low / Mid / High ──
  const mkEQRow = (label, val, onChange) => {
    const row = document.createElement("div");
    row.className = "small-row";
    const l = document.createElement("span");
    l.textContent = label;
    const s = document.createElement("input");
    s.type = "range";
    s.min = "-24";
    s.max = "24";
    s.step = "0.5";
    s.value = val;
    const v = document.createElement("span");
    v.textContent = (val >= 0 ? "+" : "") + val.toFixed(1);
    s.addEventListener("input", () => {
      const v2 = parseFloat(s.value);
      v.textContent = (v2 >= 0 ? "+" : "") + v2.toFixed(1);
      onChange(v2);
      autoSave();
    });
    row.appendChild(l);
    row.appendChild(s);
    row.appendChild(v);
    return row;
  };
  const eqLowRow = mkEQRow("EQ Lo", masterEQLow, (v) => {
    if (typeof setMasterEQ === "function") setMasterEQ(v, null, null);
  });
  const eqMidRow = mkEQRow("EQ Mid", masterEQMid, (v) => {
    if (typeof setMasterEQ === "function") setMasterEQ(null, v, null);
  });
  const eqHighRow = mkEQRow("EQ Hi", masterEQHigh, (v) => {
    if (typeof setMasterEQ === "function") setMasterEQ(null, null, v);
  });

  // ── v17: Mastering-Chain (Stereo-Width + Limiter + Ceiling) ──

  // Width (Stereo-Breite): 0 = Mono, 1 = Original, 2 = Extra breit
  const mkWidthRow = () => {
    const row = document.createElement("div");
    row.className = "small-row";
    const l = document.createElement("span");
    l.textContent = "Wid";
    const s = document.createElement("input");
    s.type = "range";
    s.min = "0";
    s.max = "2";
    s.step = "0.01";
    s.value = masteringWidth;
    const v = document.createElement("span");
    v.textContent = masteringWidth.toFixed(2);
    s.addEventListener("input", () => {
      const nv = parseFloat(s.value);
      v.textContent = nv.toFixed(2);
      if (typeof setMasteringWidth === "function") setMasteringWidth(nv);
      else masteringWidth = nv;
      autoSave();
    });
    row.append(l, s, v);
    return row;
  };
  const widthRow = mkWidthRow();

  // Limiter Toggle
  const mkLimiterRow = () => {
    const row = document.createElement("div");
    row.className = "small-row";
    const l = document.createElement("span");
    l.textContent = "Lim";
    const btn = document.createElement("button");
    btn.style.cssText = "flex:1;font-size:9px;padding:3px 0;border-radius:3px;";
    const applyBtnStyle = () => {
      if (masteringLimiterOn) {
        btn.textContent = "ON";
        btn.style.background = "var(--accent)";
        btn.style.color = "#111";
        btn.style.fontWeight = "700";
        btn.style.border = "1px solid #000";
      } else {
        btn.textContent = "OFF";
        btn.style.background = "#2a2a2a";
        btn.style.color = "#ddd";
        btn.style.fontWeight = "400";
        btn.style.border = "1px solid #111";
      }
    };
    applyBtnStyle();
    btn.title = "Brickwall Limiter — adds 12 ms lookahead delay when ON";
    btn.addEventListener("click", () => {
      pushHistory();
      const newState = !masteringLimiterOn;
      if (typeof toggleMasteringLimiter === "function")
        toggleMasteringLimiter(newState);
      else masteringLimiterOn = newState;
      applyBtnStyle();
      autoSave();
    });
    row.append(l, btn);
    return row;
  };
  const limiterRow = mkLimiterRow();

  // Limiter Ceiling (nur aktiv wenn Limiter an)
  const mkCeilingRow = () => {
    const row = document.createElement("div");
    row.className = "small-row";
    const l = document.createElement("span");
    l.textContent = "Ceil";
    const s = document.createElement("input");
    s.type = "range";
    s.min = "-12";
    s.max = "0";
    s.step = "0.1";
    s.value = masteringLimiterCeiling;
    const v = document.createElement("span");
    v.textContent = masteringLimiterCeiling.toFixed(1);
    s.style.opacity = masteringLimiterOn ? "1" : "0.4";
    s.disabled = !masteringLimiterOn;
    s.addEventListener("input", () => {
      const nv = parseFloat(s.value);
      v.textContent = nv.toFixed(1);
      if (typeof setMasteringLimiterCeiling === "function")
        setMasteringLimiterCeiling(nv);
      else masteringLimiterCeiling = nv;
      autoSave();
    });
    row.append(l, s, v);
    return row;
  };
  const ceilingRow = mkCeilingRow();

  // ── v17: Groove Template ──
  const mkGrooveRow = () => {
    const row = document.createElement("div");
    row.className = "small-row";
    const l = document.createElement("span");
    l.textContent = "Grv";
    const sel = document.createElement("select");
    sel.style.cssText =
      "flex:1;background:#111;color:#ddd;border:1px solid #000;font-size:9px;padding:1px 2px;border-radius:2px;";
    if (typeof GROOVE_TEMPLATES !== "undefined") {
      Object.entries(GROOVE_TEMPLATES).forEach(([id, tmpl]) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = tmpl.name;
        if (id === grooveTemplateId) opt.selected = true;
        sel.appendChild(opt);
      });
    }
    sel.addEventListener("change", () => {
      pushHistory();
      if (typeof setGroove === "function") setGroove(sel.value, grooveStrength);
      else grooveTemplateId = sel.value;
      autoSave();
    });
    row.append(l, sel);
    return row;
  };
  const grooveRow = mkGrooveRow();

  // Groove Strength (nur aktiv wenn Template ≠ straight)
  const mkGrooveAmtRow = () => {
    const row = document.createElement("div");
    row.className = "small-row";
    const l = document.createElement("span");
    l.textContent = "Amt";
    const s = document.createElement("input");
    s.type = "range";
    s.min = "0";
    s.max = "1";
    s.step = "0.01";
    s.value = grooveStrength;
    const v = document.createElement("span");
    v.textContent = Math.round(grooveStrength * 100) + "%";
    const isStraight = grooveTemplateId === "straight";
    s.style.opacity = isStraight ? "0.4" : "1";
    s.disabled = isStraight;
    s.addEventListener("input", () => {
      const nv = parseFloat(s.value);
      v.textContent = Math.round(nv * 100) + "%";
      if (typeof setGroove === "function") setGroove(null, nv);
      else grooveStrength = nv;
      autoSave();
    });
    row.append(l, s, v);
    return row;
  };
  const grooveAmtRow = mkGrooveAmtRow();
  // Master Lowpass
  const lpRow = document.createElement("div");
  lpRow.className = "small-row";
  const lpL = document.createElement("span");
  lpL.textContent = "LP";
  const lpS = document.createElement("input");
  lpS.type = "range";
  lpS.min = "200";
  lpS.max = "20000";
  lpS.step = "10";
  lpS.value = typeof masterLowpassFreq === "number" ? masterLowpassFreq : 20000;
  const lpV = document.createElement("span");
  lpV.textContent = fmtHz(lpS.value | 0);
  lpS.addEventListener("input", () => {
    const hz = parseFloat(lpS.value);
    if (typeof setMasterLowpass === "function") {
      setMasterLowpass(hz);
    }
    lpV.textContent = fmtHz(hz);
    autoSave();
  });
  lpRow.appendChild(lpL);
  lpRow.appendChild(lpS);
  lpRow.appendChild(lpV);
  mStrip.appendChild(mName);
  mStrip.appendChild(rRow);
  mStrip.appendChild(rvPRow);
  mStrip.appendChild(rvDRow);
  mStrip.appendChild(eqLowRow);
  mStrip.appendChild(eqMidRow);
  mStrip.appendChild(eqHighRow);
  mStrip.appendChild(widthRow);
  mStrip.appendChild(limiterRow);
  mStrip.appendChild(ceilingRow);
  mStrip.appendChild(grooveRow);
  mStrip.appendChild(grooveAmtRow);
  mStrip.appendChild(lpRow);
  mStrip.appendChild(mFaderWrap);
  mStrip.appendChild(mVal);
  mixerView.appendChild(mStrip);
}
function openFxPanel(trackId) {
  currentFxTrackId = trackId;
  const t = TRACKS.find((x) => x.id === trackId);
  if (!t) return;
  fxPanel.classList.remove("hidden");
  renderFxPanel();
  fxPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}
function renderFxPanel() {
  const track = TRACKS.find((t) => t.id === currentFxTrackId);
  if (!track) {
    fxPanel.classList.add("hidden");
    return;
  }
  fxPanel.innerHTML = "";
  const head = document.createElement("div");
  head.style.cssText =
    "display:flex;align-items:center;gap:10px;margin-bottom:10px;";
  const h3 = document.createElement("h3");
  h3.textContent = "Effect chain: " + track.name;
  h3.style.margin = 0;
  const cb = document.createElement("button");
  cb.textContent = "✖ Close";
  cb.style.marginLeft = "auto";
  cb.addEventListener("click", () => {
    currentFxTrackId = null;
    fxPanel.classList.add("hidden");
    fxPanel.innerHTML = "";
  });
  head.appendChild(h3);
  head.appendChild(cb);
  fxPanel.appendChild(head);
  const addRow = document.createElement("div");
  addRow.className = "fx-add";
  const sel = document.createElement("select");
  Object.entries(EFFECT_DEFS).forEach(([k, v]) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = v.name;
    sel.appendChild(o);
  });
  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Add effect";
  addBtn.addEventListener("click", () => {
    const fx = createEffect(sel.value);
    if (!fx) return;
    pushHistory();
    track.effects.push(fx);
    rebuildAudioGraphs();
    renderFxPanel();
    rebuildMixer();
    autoSave();
    toast("Effect: " + EFFECT_DEFS[fx.type].name, "success");
  });
  addRow.appendChild(sel);
  addRow.appendChild(addBtn);
  fxPanel.appendChild(addRow);
  const list = document.createElement("div");
  list.className = "fx-list";
  (track.effects || []).forEach((fx, idx) => {
    const def = EFFECT_DEFS[fx.type];
    if (!def) return;
    const item = document.createElement("div");
    item.className = "fx-item" + (fx.enabled ? "" : " off");
    const ih = document.createElement("div");
    ih.className = "fx-item-head";
    const ti = document.createElement("span");
    ti.className = "title";
    ti.textContent = idx + 1 + ". " + def.name;
    const up = document.createElement("button");
    up.textContent = "↑";
    up.disabled = idx === 0;
    up.addEventListener("click", () => {
      pushHistory();
      const a = track.effects;
      [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]];
      rebuildAudioGraphs();
      renderFxPanel();
      autoSave();
    });
    const dn = document.createElement("button");
    dn.textContent = "↓";
    dn.disabled = idx === track.effects.length - 1;
    dn.addEventListener("click", () => {
      pushHistory();
      const a = track.effects;
      [a[idx + 1], a[idx]] = [a[idx], a[idx + 1]];
      rebuildAudioGraphs();
      renderFxPanel();
      autoSave();
    });
    const en = document.createElement("button");
    en.textContent = fx.enabled ? "ON" : "OFF";
    en.className = fx.enabled ? "active" : "";
    en.addEventListener("click", () => {
      pushHistory();
      fx.enabled = !fx.enabled;
      rebuildAudioGraphs();
      renderFxPanel();
      rebuildMixer();
      autoSave();
    });
    const del = document.createElement("button");
    del.textContent = "🗑";
    del.className = "danger";
    del.addEventListener("click", () => {
      if (!confirm("Delete this effect?")) return;
      pushHistory();
      track.effects = track.effects.filter((f) => f.id !== fx.id);
      rebuildAudioGraphs();
      renderFxPanel();
      rebuildMixer();
      autoSave();
    });
    ih.appendChild(ti);
    ih.appendChild(up);
    ih.appendChild(dn);
    ih.appendChild(en);
    ih.appendChild(del);
    item.appendChild(ih);
    const params = document.createElement("div");
    params.className = "fx-params";
    def.params.forEach((p) => {
      const w = document.createElement("div");
      w.className = "fx-param";
      const l = document.createElement("label");
      l.textContent = p.label;
      w.appendChild(l);
      if (p.type === "select") {
        const s = document.createElement("select");
        p.options.forEach((o) => {
          const opt = document.createElement("option");
          opt.value = o;
          opt.textContent = o;
          s.appendChild(opt);
        });
        s.value = fx.params[p.key];
        s.addEventListener("change", () => {
          fx.params[p.key] = s.value;
          const b = buses[track.id];
          if (
            b &&
            b._chainNodes &&
            b._chainNodes[idx] &&
            b._chainNodes[idx].update
          )
            b._chainNodes[idx].update(fx.params);
          autoSave();
        });
        w.appendChild(s);
      } else {
        const inp = document.createElement("input");
        inp.type = "range";
        inp.min = p.min;
        inp.max = p.max;
        inp.step = p.step;
        inp.value = fx.params[p.key];
        const v = document.createElement("span");
        v.className = "val";
        const fmt = (val) => {
          let n;
          if (Math.abs(val) >= 1000) n = String(Math.round(val));
          else if (Math.abs(val) >= 100) n = val.toFixed(1);
          else if (Math.abs(val) >= 1) n = val.toFixed(2);
          else n = val.toFixed(4);
          return n + (p.unit || "");
        };
        v.textContent = fmt(parseFloat(inp.value));
        inp.addEventListener("input", () => {
          const val = parseFloat(inp.value);
          fx.params[p.key] = val;
          v.textContent = fmt(val);
          const b = buses[track.id];
          if (
            b &&
            b._chainNodes &&
            b._chainNodes[idx] &&
            b._chainNodes[idx].update
          )
            b._chainNodes[idx].update(fx.params);
          autoSave();
        });
        w.appendChild(inp);
        w.appendChild(v);
      }
      params.appendChild(w);
    });
    item.appendChild(params);
    list.appendChild(item);
  });
  fxPanel.appendChild(list);
}

/* =========================================================
   SONG – Pattern based
   ========================================================= */
const songInner = document.getElementById("songInner");
function isBlockSelected(id) {
  return songSelectedIds.has(id);
}
function setBlockSelected(id, mode) {
  if (mode === "replace") songSelectedIds.clear();
  if (mode === "sub") songSelectedIds.delete(id);
  else songSelectedIds.add(id);
}
function clearClipSelection() {
  songSelectedIds.clear();
  document
    .querySelectorAll(".song-clip")
    .forEach((c) => c.classList.remove("selected"));
}
function patternColor(pid) {
  const m = { A: "#ff8a00", B: "#4ea3ff", C: "#00b894", D: "#fd79a8" };
  return m[pid] || "#ff8a00";
}

function rebuildSong() {
  if (!songInner) return;
  songInner.innerHTML = "";
  const totalSteps = Math.max(64, getSongLength());
  const totalWidth = 130 + totalSteps * PX_PER_STEP;
  songInner.style.width = totalWidth + "px";

  const ruler = document.createElement("div");
  ruler.className = "song-ruler";
  ruler.style.width = totalWidth + "px";
  const sp = document.createElement("div");
  sp.className = "spacer";
  ruler.appendChild(sp);
  for (let s = 0; s < totalSteps; s += 16) {
    const t = document.createElement("div");
    t.className = "song-tick";
    t.style.width = 16 * PX_PER_STEP + "px";
    t.textContent = "Bar " + (s / 16 + 1);
    ruler.appendChild(t);
  }
  songInner.appendChild(ruler);

  const markerTrack = document.createElement("div");
  markerTrack.className = "song-markers";
  markerTrack.style.width = totalWidth + "px";
  const mSp = document.createElement("div");
  mSp.className = "spacer";
  markerTrack.appendChild(mSp);

  song.markers.forEach((marker) => {
    const el = document.createElement("div");
    el.className = "song-marker";
    el.style.left = 130 + marker.step * PX_PER_STEP + "px";
    el.style.background = marker.color;
    el.textContent = marker.text;
    el.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      const startX = e.clientX;
      const origStep = marker.step;
      function onMove(ev) {
        const dStep = Math.round((ev.clientX - startX) / PX_PER_STEP);
        const ns = Math.max(0, origStep + dStep);
        el.style.left = 130 + ns * PX_PER_STEP + "px";
        marker.step = ns;
      }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        pushHistory();
        rebuildSong();
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY, [
        { header: "Marker" },
        {
          label: "Rename…",
          action: () => {
            const v = prompt("Marker text:", marker.text);
            if (v) {
              marker.text = v;
              rebuildSong();
              autoSave();
            }
          },
        },
        {
          label: "Color: Blue",
          action: () => {
            marker.color = "#4ea3ff";
            rebuildSong();
            autoSave();
          },
        },
        {
          label: "Color: Red",
          action: () => {
            marker.color = "#c62828";
            rebuildSong();
            autoSave();
          },
        },
        {
          label: "Color: Green",
          action: () => {
            marker.color = "#2e7d32";
            rebuildSong();
            autoSave();
          },
        },
        "---",
        {
          label: "Delete",
          action: () => {
            song.markers = song.markers.filter((m) => m.id !== marker.id);
            rebuildSong();
            autoSave();
          },
        },
      ]);
    });
    markerTrack.appendChild(el);
  });

  markerTrack.addEventListener("contextmenu", (e) => {
    if (e.target !== markerTrack && e.target !== mSp) return;
    e.preventDefault();
    const rect = markerTrack.getBoundingClientRect();
    const px = e.clientX - rect.left + markerTrack.scrollLeft;
    const step = Math.max(0, Math.round((px - 130) / PX_PER_STEP));
    showContextMenu(e.clientX, e.clientY, [
      { header: "Add Marker @ Step " + step },
      {
        label: "Intro",
        action: () => {
          addMarker(step, "Intro", "#4ea3ff");
        },
      },
      {
        label: "Verse",
        action: () => {
          addMarker(step, "Verse", "#2e7d32");
        },
      },
      {
        label: "Chorus",
        action: () => {
          addMarker(step, "Chorus", "#ff8a00");
        },
      },
      {
        label: "Bridge",
        action: () => {
          addMarker(step, "Bridge", "#a78bfa");
        },
      },
      {
        label: "Outro",
        action: () => {
          addMarker(step, "Outro", "#c62828");
        },
      },
    ]);
  });
  songInner.appendChild(markerTrack);

  if (song.loopEnd > song.loopStart) {
    const lo = document.createElement("div");
    lo.className = "song-loop-region";
    lo.style.left = 130 + song.loopStart * PX_PER_STEP + "px";
    lo.style.width = (song.loopEnd - song.loopStart) * PX_PER_STEP + "px";
    lo.style.top = "52px";
    songInner.appendChild(lo);
  }

  PATTERN_IDS.forEach((pid) => {
    const row = document.createElement("div");
    row.className = "song-row";
    const label = document.createElement("div");
    label.className = "song-row-label";
    const dot = document.createElement("div");
    dot.className = "led";
    dot.style.background = patternColor(pid);
    dot.style.opacity = 0.7;
    label.appendChild(dot);
    label.appendChild(document.createTextNode("Pattern " + pid));
    label.style.color = patternColor(pid);
    label.style.fontWeight = "700";
    row.appendChild(label);
    const lane = document.createElement("div");
    lane.className = "song-lane";
    lane.style.width = totalSteps * PX_PER_STEP + "px";
    lane.style.backgroundSize =
      16 * PX_PER_STEP + "px 100%, " + 4 * PX_PER_STEP + "px 100%";
    lane.dataset.patternId = pid;
    song.blocks
      .filter((b) => b.patternId === pid)
      .forEach((block) => {
        lane.appendChild(makeBlockEl(block));
      });
    lane.addEventListener("mousedown", onSongLaneMouseDown);
    lane.addEventListener("contextmenu", (e) => {
      if (e.target !== lane) return;
      e.preventDefault();
      const rect = lane.getBoundingClientRect();
      const px = e.clientX - rect.left + lane.scrollLeft;
      const step = Math.max(0, Math.round(px / PX_PER_STEP));
      showContextMenu(e.clientX, e.clientY, [
        { header: "Pattern " + pid + " @ Step " + step },
        {
          label: "Place pattern here",
          action: () => {
            pushHistory();
            const b = {
              id: genId("block"),
              patternId: pid,
              startStep: step,
              lengthSteps: stepCount,
              sourceOffsetSteps: 0,
            };
            song.blocks.push(b);
            songSelectedIds = new Set([b.id]);
            rebuildSong();
            autoSave();
          },
        },
        {
          label: "Move playhead here",
          action: () => {
            currentSongStep = step;
            updateSongPlayhead();
            updateSongPositionDisplay(step);
          },
        },
        "---",
        {
          label: "Delete all " + pid + " blocks",
          disabled: !song.blocks.some((b) => b.patternId === pid),
          action: () => {
            if (!confirm("Delete all Pattern " + pid + " blocks?")) return;
            pushHistory();
            song.blocks = song.blocks.filter((b) => b.patternId !== pid);
            rebuildSong();
            autoSave();
          },
        },
      ]);
    });
    row.appendChild(lane);
    songInner.appendChild(row);
  });
  updateSongPlayhead();
}

function addMarker(step, text, color) {
  pushHistory();
  song.markers.push({ id: genId("marker"), step, text, color });
  rebuildSong();
  autoSave();
}

function makeBlockEl(block) {
  const el = document.createElement("div");
  el.className = "song-clip" + (isBlockSelected(block.id) ? " selected" : "");
  el.dataset.blockId = block.id;
  el.style.left = block.startStep * PX_PER_STEP + "px";
  el.style.width = block.lengthSteps * PX_PER_STEP - 4 + "px";
  el.textContent =
    "Pattern " +
    block.patternId +
    ((block.sourceOffsetSteps || 0) > 0
      ? " (off " + block.sourceOffsetSteps + ")"
      : "");
  el.style.background = patternColor(block.patternId);
  el.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const isSel = isBlockSelected(block.id);
    const alt = e.altKey,
      ctrl = e.ctrlKey || e.metaKey,
      shift = e.shiftKey;
    if (alt) {
      setBlockSelected(block.id, "sub");
      document
        .querySelectorAll(".song-clip")
        .forEach((c) =>
          c.classList.toggle("selected", isBlockSelected(c.dataset.blockId))
        );
      return;
    }
    if (ctrl || shift) {
      if (!isSel) setBlockSelected(block.id, "add");
    } else if (!isSel) {
      clearClipSelection();
      setBlockSelected(block.id, "replace");
    }
    document
      .querySelectorAll(".song-clip")
      .forEach((c) =>
        c.classList.toggle("selected", isBlockSelected(c.dataset.blockId))
      );
    startBlockDrag(e, block);
  });
  el.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    if (!confirm("Delete this pattern block?")) return;
    pushHistory();
    song.blocks = song.blocks.filter((b) => b.id !== block.id);
    songSelectedIds.delete(block.id);
    rebuildSong();
    autoSave();
  });
  el.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isBlockSelected(block.id)) {
      clearClipSelection();
      setBlockSelected(block.id, "replace");
      document
        .querySelectorAll(".song-clip")
        .forEach((c) =>
          c.classList.toggle("selected", isBlockSelected(c.dataset.blockId))
        );
    }
    const sc = songSelectedIds.size;
    showContextMenu(e.clientX, e.clientY, [
      {
        header:
          sc > 1
            ? sc + " blocks selected"
            : "Pattern " + block.patternId + " @ Step " + block.startStep,
      },
      { label: "Duplicate", action: duplicateSelectedClips },
      { label: "Delete", action: deleteSelectedClips },
      "---",
      {
        label: "Split at midpoint",
        disabled: sc > 1,
        action: () => {
          if (block.lengthSteps < 2) {
            toast("Block too short to split", "error");
            return;
          }
          pushHistory();
          const half = Math.floor(block.lengthSteps / 2);
          const off = block.sourceOffsetSteps || 0;
          const second = {
            id: genId("block"),
            patternId: block.patternId,
            startStep: block.startStep + half,
            lengthSteps: block.lengthSteps - half,
            sourceOffsetSteps: off + half,
          };
          block.lengthSteps = half;
          song.blocks.push(second);
          songSelectedIds = new Set([block.id, second.id]);
          rebuildSong();
          autoSave();
        },
      },
      {
        label: "Halve length",
        disabled: sc > 1,
        action: () => {
          pushHistory();
          block.lengthSteps = Math.max(1, Math.floor(block.lengthSteps / 2));
          rebuildSong();
          autoSave();
        },
      },
      {
        label: "Set length…",
        action: () => {
          const v = prompt("New length in steps (1–256):", block.lengthSteps);
          if (v == null) return;
          const n = parseInt(v);
          if (!isNaN(n) && n >= 1) {
            pushHistory();
            block.lengthSteps = n;
            rebuildSong();
            autoSave();
          }
        },
      },
      "---",
      {
        label: "Switch pattern to…",
        disabled: sc > 1,
        action: () => {
          const items = PATTERN_IDS.map((pid) => ({
            label: "Pattern " + pid + (pid === block.patternId ? " ✓" : ""),
            action: () => {
              pushHistory();
              block.patternId = pid;
              block.sourceOffsetSteps = 0;
              rebuildSong();
              autoSave();
            },
          }));
          showContextMenu(e.clientX, e.clientY, items);
        },
      },
      {
        label: "Reset source offset",
        action: () => {
          pushHistory();
          block.sourceOffsetSteps = 0;
          rebuildSong();
          autoSave();
        },
      },
    ]);
  });
  return el;
}

let songDrag = null;
function onSongLaneMouseDown(e) {
  if (e.button !== 0) return;
  const clipEl = e.target.closest(".song-clip");
  if (clipEl) return;
  const modifier = e.shiftKey ? "add" : e.altKey ? "sub" : "replace";
  const r = document.createElement("div");
  r.className = "pr-rubber";
  r.style.cssText = "position:fixed;z-index:9997;display:none;";
  document.body.appendChild(r);
  songDrag = {
    startX: e.clientX,
    startY: e.clientY,
    modifier,
    rubberEl: r,
    moved: false,
  };
  document.addEventListener("mousemove", onSongMouseMove);
  document.addEventListener("mouseup", onSongMouseUp);
}
function onSongMouseMove(e) {
  if (!songDrag) return;
  const dx = e.clientX - songDrag.startX,
    dy = e.clientY - songDrag.startY;
  if (!songDrag.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
    songDrag.moved = true;
    songDrag.rubberEl.style.display = "block";
  }
  if (!songDrag.moved) return;
  const r = songDrag.rubberEl;
  const x1 = Math.min(songDrag.startX, e.clientX),
    y1 = Math.min(songDrag.startY, e.clientY);
  const x2 = Math.max(songDrag.startX, e.clientX),
    y2 = Math.max(songDrag.startY, e.clientY);
  r.style.left = x1 + "px";
  r.style.top = y1 + "px";
  r.style.width = x2 - x1 + "px";
  r.style.height = y2 - y1 + "px";
}
function onSongMouseUp(e) {
  if (!songDrag) return;
  document.removeEventListener("mousemove", onSongMouseMove);
  document.removeEventListener("mouseup", onSongMouseUp);
  const d = songDrag;
  songDrag = null;
  if (d.rubberEl) d.rubberEl.remove();
  if (!d.moved) {
    if (d.modifier === "replace") clearClipSelection();
    return;
  }
  const x1 = Math.min(d.startX, e.clientX),
    y1 = Math.min(d.startY, e.clientY);
  const x2 = Math.max(d.startX, e.clientX),
    y2 = Math.max(d.startY, e.clientY);
  const hits = [];
  document.querySelectorAll(".song-clip").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (
      r.left + r.width > x1 &&
      r.left < x2 &&
      r.top + r.height > y1 &&
      r.top < y2
    )
      hits.push(el.dataset.blockId);
  });
  if (d.modifier === "replace") clearClipSelection();
  hits.forEach((id) => {
    if (d.modifier === "sub") songSelectedIds.delete(id);
    else songSelectedIds.add(id);
  });
  document
    .querySelectorAll(".song-clip")
    .forEach((el) =>
      el.classList.toggle("selected", songSelectedIds.has(el.dataset.blockId))
    );
}

function startBlockDrag(e, block) {
  const startX = e.clientX;
  const sel = song.blocks.filter((b) => songSelectedIds.has(b.id));
  if (!sel.length) {
    sel.push(block);
    songSelectedIds.add(block.id);
  }
  const orig = sel.map((b) => ({ id: b.id, startStep: b.startStep }));
  const els = {};
  orig.forEach((o) => {
    els[o.id] = document.querySelector(`.song-clip[data-block-id="${o.id}"]`);
  });
  let moved = false;
  function onMove(ev) {
    const dStep = Math.round((ev.clientX - startX) / PX_PER_STEP);
    if (!moved && dStep !== 0) moved = true;
    orig.forEach((o) => {
      const ns = Math.max(0, o.startStep + dStep);
      if (els[o.id]) els[o.id].style.left = ns * PX_PER_STEP + "px";
      o._liveStart = ns;
    });
  }
  function onUp() {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    if (!moved) return;
    pushHistory();
    orig.forEach((o) => {
      const b = song.blocks.find((x) => x.id === o.id);
      if (b) b.startStep = o._liveStart;
    });
    rebuildSong();
    autoSave();
  }
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

function duplicateSelectedClips() {
  if (!songSelectedIds.size) return;
  pushHistory();
  const sel = song.blocks.filter((b) => songSelectedIds.has(b.id));
  if (!sel.length) return;
  const minStart = Math.min(...sel.map((b) => b.startStep));
  const maxEnd = Math.max(...sel.map((b) => b.startStep + b.lengthSteps));
  const offset = maxEnd - minStart;
  const newIds = new Set();
  sel.forEach((b) => {
    const c = { ...b, id: genId("block"), startStep: b.startStep + offset };
    song.blocks.push(c);
    newIds.add(c.id);
  });
  songSelectedIds = newIds;
  rebuildSong();
  autoSave();
  toast(sel.length + " blocks duplicated", "success");
}
function deleteSelectedClips() {
  if (!songSelectedIds.size) return;
  pushHistory();
  song.blocks = song.blocks.filter((b) => !songSelectedIds.has(b.id));
  const n = songSelectedIds.size;
  clearClipSelection();
  rebuildSong();
  autoSave();
  toast(n + " blocks deleted", "success");
}

function updateSongPlayhead() {
  if (!songInner) return;
  let ph = document.getElementById("songPlayhead");
  if (!ph) {
    ph = document.createElement("div");
    ph.className = "song-playhead";
    ph.id = "songPlayhead";
    songInner.appendChild(ph);
  }
  const step = playMode === "song" ? currentSongStep : currentStep;
  ph.style.left = 130 + step * PX_PER_STEP + "px";
}
function updateSongPositionDisplay(step) {
  const el = document.getElementById("songPos");
  if (!el) return;
  const bar = Math.floor(step / 16) + 1;
  const beat = Math.floor((step % 16) / 4) + 1;
  el.textContent = bar + "." + beat;
}

/* =========================================================
   AUTOMATION VIEW
   ========================================================= */
const autoInner = document.getElementById("autoInner");
function rebuildAutoView() {
  if (!autoInner) return;
  const sel = document.getElementById("autoTargetSel");
  sel.innerHTML = "";
  getAutoTargets().forEach((t) => {
    const o = document.createElement("option");
    o.value = t.id;
    o.textContent = t.label;
    sel.appendChild(o);
  });
  autoInner.innerHTML = "";
  const totalSteps = Math.max(64, getSongLength());
  const totalWidth = 170 + totalSteps * PX_PER_STEP_AUTO;
  autoInner.style.width = totalWidth + "px";
  const ruler = document.createElement("div");
  ruler.className = "song-ruler";
  ruler.style.width = totalWidth + "px";
  const sp = document.createElement("div");
  sp.className = "spacer";
  sp.style.width = "170px";
  ruler.appendChild(sp);
  for (let s = 0; s < totalSteps; s += 16) {
    const t = document.createElement("div");
    t.className = "song-tick";
    t.style.width = 16 * PX_PER_STEP_AUTO + "px";
    t.textContent = "Bar " + (s / 16 + 1);
    ruler.appendChild(t);
  }
  autoInner.appendChild(ruler);
  if (song.loopEnd > song.loopStart) {
    const lo = document.createElement("div");
    lo.className = "song-loop-region";
    lo.style.left = 170 + song.loopStart * PX_PER_STEP_AUTO + "px";
    lo.style.width = (song.loopEnd - song.loopStart) * PX_PER_STEP_AUTO + "px";
    autoInner.appendChild(lo);
  }
  if (!automation.lanes.length) {
    const e = document.createElement("div");
    e.style.cssText = "padding:20px;color:var(--muted);font-size:12px;";
    e.textContent = "No automation lanes.";
    autoInner.appendChild(e);
  }
  automation.lanes.forEach((lane) => {
    const tgt = findAutoTarget(lane.target);
    if (!tgt) return;
    const laneEl = document.createElement("div");
    laneEl.className =
      "auto-lane" + (selectedAutoLaneId === lane.id ? " selected" : "");
    laneEl.dataset.laneId = lane.id;
    const label = document.createElement("div");
    label.className = "auto-lane-label";
    const tn = document.createElement("div");
    tn.className = "tname";
    tn.textContent = tgt.label;
    const rg = document.createElement("div");
    rg.className = "range";
    rg.textContent = tgt.min + " … " + tgt.max + " · " + lane.curve;
    label.appendChild(tn);
    label.appendChild(rg);
    label.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      selectedAutoLaneId = lane.id;
      document.getElementById("autoCurveSel").value = lane.curve;
      rebuildAutoView();

      /* v19: Controller-Link-Status */
      const linkedCount = controllerLinks.filter(
        (l) => l.laneId === lane.id
      ).length;

      showContextMenu(e.clientX, e.clientY, [
        { header: tgt.label },
        {
          label: "Linear",
          action: () => {
            pushHistory();
            lane.curve = "linear";
            rebuildAutoView();
            autoSave();
          },
        },
        {
          label: "Smooth",
          action: () => {
            pushHistory();
            lane.curve = "smooth";
            rebuildAutoView();
            autoSave();
          },
        },
        {
          label: "Hold",
          action: () => {
            pushHistory();
            lane.curve = "hold";
            rebuildAutoView();
            autoSave();
          },
        },
        "---",
        {
          label:
            "🔗 Link to Controller…" + (linkedCount ? ` (${linkedCount})` : ""),
          action: () => openLinkDialog(lane.id),
        },
        {
          label: "Clear all links",
          disabled: linkedCount === 0,
          action: () => {
            pushHistory();
            controllerLinks = controllerLinks.filter(
              (l) => l.laneId !== lane.id
            );
            autoSave();
            rebuildAutoView();
            toast("Links entfernt", "success");
          },
        },
        "---",
        {
          label: "Delete lane",
          action: () => {
            if (!confirm("Delete this automation lane?")) return;
            pushHistory();
            automation.lanes = automation.lanes.filter((l) => l.id !== lane.id);
            controllerLinks = controllerLinks.filter(
              (l) => l.laneId !== lane.id
            );
            selectedAutoLaneId = null;
            rebuildAutoView();
            autoSave();
          },
        },
      ]);
    });
    laneEl.appendChild(label);
    const canvas = document.createElement("div");
    canvas.className = "auto-canvas";
    canvas.style.width = totalSteps * PX_PER_STEP_AUTO + "px";
    canvas.style.height = "70px";
    canvas.style.backgroundSize = 16 * PX_PER_STEP_AUTO + "px 100%";
    canvas.style.backgroundImage =
      "linear-gradient(to right,#202020 1px,transparent 1px),linear-gradient(to right,#181818 1px,transparent 1px)";
    lane.clips.forEach((clip) => {
      const bg = document.createElement("div");
      bg.className = "auto-clip-bg";
      bg.style.left = clip.startStep * PX_PER_STEP_AUTO + "px";
      bg.style.width = clip.lengthSteps * PX_PER_STEP_AUTO + "px";
      canvas.appendChild(bg);
      const pts = clip.points.slice().sort((a, b) => a.step - b.step);
      if (!pts.length) return;
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("class", "auto-curve");
      svg.style.cssText = `position:absolute;left:${
        clip.startStep * PX_PER_STEP_AUTO
      }px;top:0;width:${
        clip.lengthSteps * PX_PER_STEP_AUTO
      }px;height:70px;overflow:visible;`;
      const poly = [];
      const yf = (v) => 70 - v * 70;
      if (lane.curve === "hold") {
        for (let i = 0; i < pts.length; i++) {
          poly.push([pts[i].step * PX_PER_STEP_AUTO, yf(pts[i].value)]);
          if (i < pts.length - 1)
            poly.push([pts[i + 1].step * PX_PER_STEP_AUTO, yf(pts[i].value)]);
        }
      } else if (lane.curve === "smooth") {
        const total = pts[pts.length - 1].step;
        const SD = 3;
        for (let s = 0; s <= total; s += 1 / SD) {
          let val;
          if (s <= pts[0].step) val = pts[0].value;
          else if (s >= pts[pts.length - 1].step)
            val = pts[pts.length - 1].value;
          else {
            for (let i = 0; i < pts.length - 1; i++) {
              const a = pts[i],
                b = pts[i + 1];
              if (s >= a.step && s <= b.step) {
                const sp = b.step - a.step;
                const t = sp <= 0 ? 0 : (s - a.step) / sp;
                const p0 = i > 0 ? pts[i - 1].value : a.value,
                  p1 = a.value,
                  p2 = b.value,
                  p3 = i < pts.length - 2 ? pts[i + 2].value : b.value;
                val = Math.max(0, Math.min(1, catmullRom(p0, p1, p2, p3, t)));
                break;
              }
            }
          }
          if (val == null) val = 0;
          poly.push([s * PX_PER_STEP_AUTO, yf(val)]);
        }
      } else
        pts.forEach((p) => poly.push([p.step * PX_PER_STEP_AUTO, yf(p.value)]));
      const pl = document.createElementNS(svgNS, "polyline");
      pl.setAttribute("points", poly.map((p) => p.join(",")).join(" "));
      pl.setAttribute("fill", "none");
      pl.setAttribute("stroke", "#ff8a00");
      pl.setAttribute("stroke-width", "2");
      svg.appendChild(pl);
      canvas.appendChild(svg);
    });
    lane.clips.forEach((clip) => {
      clip.points.forEach((pt) => {
        const el = document.createElement("div");
        el.className = "auto-point";
        el.style.left = (clip.startStep + pt.step) * PX_PER_STEP_AUTO + "px";
        el.style.top = 70 - pt.value * 70 + "px";
        el.dataset.laneId = lane.id;
        el.dataset.clipId = clip.id;
        el.dataset.ptStep = pt.step;
        canvas.appendChild(el);
      });
    });
    canvas.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("auto-point")) {
        if (e.button === 2) return;
        const ptEl = e.target;
        const cid = ptEl.dataset.clipId;
        const ps = parseFloat(ptEl.dataset.ptStep);
        const cl = lane.clips.find((c) => c.id === cid);
        if (!cl) return;
        const pt = cl.points.find((p) => p.step === ps);
        if (!pt) return;
        selectedAutoLaneId = lane.id;
        const sx = e.clientX,
          sy = e.clientY,
          os = pt.step,
          ov = pt.value;
        function mv(ev) {
          const ds = (ev.clientX - sx) / PX_PER_STEP_AUTO;
          const dv = -(ev.clientY - sy) / 70;
          pt.step = Math.max(0, Math.min(cl.lengthSteps, os + ds));
          pt.value = Math.max(0, Math.min(1, ov + dv));
          ptEl.style.left = (cl.startStep + pt.step) * PX_PER_STEP_AUTO + "px";
          ptEl.style.top = 70 - pt.value * 70 + "px";
        }
        function up() {
          document.removeEventListener("mousemove", mv);
          document.removeEventListener("mouseup", up);
          cl.points.sort((a, b) => a.step - b.step);
          pushHistory();
          rebuildAutoView();
          autoSave();
        }
        document.addEventListener("mousemove", mv);
        document.addEventListener("mouseup", up);
        e.stopPropagation();
        return;
      }
      if (e.button !== 0) return;
      selectedAutoLaneId = lane.id;
      document.getElementById("autoCurveSel").value = lane.curve;
      const rect = canvas.getBoundingClientRect();
      const step = (e.clientX - rect.left) / PX_PER_STEP_AUTO;
      const val = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / 70));
      const clip = lane.clips.find(
        (c) => step >= c.startStep && step < c.startStep + c.lengthSteps
      );
      if (!clip) return;
      pushHistory();
      clip.points.push({ step: step - clip.startStep, value: val });
      clip.points.sort((a, b) => a.step - b.step);
      rebuildAutoView();
      autoSave();
    });
    canvas.addEventListener("contextmenu", (e) => {
      const ptEl = e.target.closest(".auto-point");
      if (!ptEl) {
        e.preventDefault();
        selectedAutoLaneId = lane.id;
        showContextMenu(e.clientX, e.clientY, [
          { header: tgt.label },
          {
            label: "Insert point here",
            action: () => {
              pushHistory();
              const rect = canvas.getBoundingClientRect();
              const step = (e.clientX - rect.left) / PX_PER_STEP_AUTO;
              const val = Math.max(
                0,
                Math.min(1, 1 - (e.clientY - rect.top) / 70)
              );
              const clip = lane.clips.find(
                (c) => step >= c.startStep && step < c.startStep + c.lengthSteps
              );
              if (!clip) return;
              clip.points.push({ step: step - clip.startStep, value: val });
              clip.points.sort((a, b) => a.step - b.step);
              rebuildAutoView();
              autoSave();
            },
          },
          "---",
          {
            label: "Delete lane",
            action: () => {
              pushHistory();
              automation.lanes = automation.lanes.filter(
                (l) => l.id !== lane.id
              );
              selectedAutoLaneId = null;
              rebuildAutoView();
              autoSave();
            },
          },
        ]);
        return;
      }
      e.preventDefault();
      const cid = ptEl.dataset.clipId,
        ps = parseFloat(ptEl.dataset.ptStep);
      const cl = lane.clips.find((c) => c.id === cid);
      if (!cl) return;
      const pt = cl.points.find((p) => p.step === ps);
      if (!pt) return;
      showContextMenu(e.clientX, e.clientY, [
        { header: "Point @ " + pt.step.toFixed(2) },
        {
          label:
            "Value: " + (tgt.min + pt.value * (tgt.max - tgt.min)).toFixed(2),
          disabled: true,
        },
        "---",
        {
          label: "Delete point",
          action: () => {
            pushHistory();
            cl.points = cl.points.filter((p) => p !== pt);
            rebuildAutoView();
            autoSave();
          },
        },
      ]);
    });
    laneEl.appendChild(canvas);
    autoInner.appendChild(laneEl);
  });
  let ph = document.getElementById("autoPlayhead");
  if (!ph) {
    ph = document.createElement("div");
    ph.className = "song-playhead";
    ph.id = "autoPlayhead";
    autoInner.appendChild(ph);
  }
  ph.style.left = 170 + currentSongStep * PX_PER_STEP_AUTO + "px";
}
function updateAutoPlayhead(step) {
  if (currentView !== "auto") return;
  const ph = document.getElementById("autoPlayhead");
  if (!ph) return;
  ph.style.left = 170 + step * PX_PER_STEP_AUTO + "px";
}

/* =========================================================
   PIANO ROLL PRO
   ========================================================= */
const prOverlay = document.getElementById("prOverlay");
let prEditor = null;
let currentRoot = 0;
let currentScale = "major";

const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const SNAP_MODES = {
  off: { label: "Free", steps: 0 },
  "1/4": { label: "1/4", steps: 4 },
  "1/8": { label: "1/8", steps: 2 },
  "1/16": { label: "1/16", steps: 1 },
  "1/32": { label: "1/32", steps: 0.5 },
  "1/8T": { label: "1/8 T", steps: 4 / 3 },
  "1/16T": { label: "1/16 T", steps: 2 / 3 },
};
function snapTo(steps, mode) {
  const g = SNAP_MODES[mode]?.steps || 0;
  if (!g) return steps;
  return Math.round(steps / g) * g;
}
function updateUndoButtons() {
  if (!prEditor) return;
  const u = document.getElementById("prUndoBtn"),
    r = document.getElementById("prRedoBtn");
  if (u) u.disabled = historyIndex <= 0;
  if (r) r.disabled = historyIndex >= historyStack.length - 1;
}

function isInScale(midi) {
  if (currentScale === "chromatic") return true;
  const pc = (midi - currentRoot + 120) % 12;
  return SCALES[currentScale].includes(pc);
}

function insertChord(trackId, step, midi) {
  pushHistory();
  const notes = patterns[currentPattern].pianoRoll[trackId];
  const type = document.getElementById("chordTypeSel").value;

  let intervals = [0, 4, 7];
  if (type === "min") intervals = [0, 3, 7];
  if (type === "dim") intervals = [0, 3, 6];
  if (type === "aug") intervals = [0, 4, 8];
  if (type === "sus2") intervals = [0, 2, 7];
  if (type === "sus4") intervals = [0, 5, 7];
  if (type === "7") intervals = [0, 4, 7, 10];

  intervals.forEach((i) => {
    notes.push({
      id: genId("n"),
      start: step,
      len: 1,
      midi: midi + i,
      vel: 100,
    });
  });
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  autoSave();
}

function openPianoRoll(trackId) {
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track || (track.type !== "melodic" && track.type !== "sample")) return;

  // Ensure range exists for samples
  if (!track.range) {
    track.range = track.type === "sample" ? [24, 84] : [48, 72];
  }
  // Ensure pianoRoll array exists
  if (!patterns[currentPattern].pianoRoll[track.id]) {
    patterns[currentPattern].pianoRoll[track.id] = [];
  }
  closePianoRoll();
  const range = track.range;
  const totalNotes = range[1] - range[0] + 1;

  const panel = document.createElement("div");
  panel.className = "pr-panel";
  const head = document.createElement("div");
  head.className = "pr-head";
  const title = document.createElement("div");
  title.className = "pr-title";
  title.textContent = "🎹 Piano Roll · " + track.name;
  const info = document.createElement("div");
  info.className = "pr-info";
  if (track.type === "sample") {
    info.textContent =
      "Sample root: " +
      midiToName(track.rootMidi || 60) +
      " · Click empty = note · Drag = move all · Notes pitch-shift the sample chromatically";
  } else {
    info.textContent =
      "Click empty = note · Ctrl+drag = marquee · Drag selected = move all · Ctrl+C/V = copy/paste";
  }
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖ Close";
  closeBtn.style.marginLeft = "auto";
  closeBtn.addEventListener("click", closePianoRoll);
  head.appendChild(title);
  head.appendChild(info);
  head.appendChild(closeBtn);

  const toolbar = document.createElement("div");
  toolbar.className = "pr-toolbar";

  const rootSel = document.createElement("select");
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach(
    (n, i) => {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = n;
      rootSel.appendChild(o);
    }
  );
  rootSel.value = currentRoot;
  rootSel.addEventListener("change", () => {
    currentRoot = parseInt(rootSel.value);
    drawGrid();
  });

  const scaleSel = document.createElement("select");
  Object.keys(SCALES).forEach((k) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = k;
    scaleSel.appendChild(o);
  });
  scaleSel.value = currentScale;
  scaleSel.addEventListener("change", () => {
    currentScale = scaleSel.value;
    drawGrid();
  });

  const chordTypeSel = document.createElement("select");
  chordTypeSel.id = "chordTypeSel";
  [
    { v: "maj", t: "Maj" },
    { v: "min", t: "Min" },
    { v: "dim", t: "Dim" },
    { v: "aug", t: "Aug" },
    { v: "sus2", t: "Sus2" },
    { v: "sus4", t: "Sus4" },
    { v: "7", t: "Dom7" },
  ].forEach((c) => {
    const o = document.createElement("option");
    o.value = c.v;
    o.textContent = c.t;
    chordTypeSel.appendChild(o);
  });

  const chordToggle = document.createElement("button");
  chordToggle.textContent = "Chord Mode: OFF";
  chordToggle.className = "mini-btn";
  chordToggle.addEventListener("click", () => {
    prEditor.chordMode = !prEditor.chordMode;
    chordToggle.textContent =
      "Chord Mode: " + (prEditor.chordMode ? "ON" : "OFF");
    chordToggle.style.background = prEditor.chordMode ? "var(--accent)" : "";
  });

  toolbar.appendChild(document.createTextNode("Key:"));
  toolbar.appendChild(rootSel);
  toolbar.appendChild(scaleSel);
  toolbar.appendChild(document.createTextNode("Chord:"));
  toolbar.appendChild(chordTypeSel);
  toolbar.appendChild(chordToggle);

  const divider = document.createElement("div");
  divider.className = "divider";
  toolbar.appendChild(divider);

  const zoomLbl = document.createElement("label");
  zoomLbl.textContent = "Zoom:";
  const zoomInp = document.createElement("input");
  zoomInp.type = "range";
  zoomInp.min = "0.5";
  zoomInp.max = "2.0";
  zoomInp.step = "0.1";
  zoomInp.value = "1.0";
  zoomInp.style.width = "80px";

  const snapLbl = document.createElement("label");
  snapLbl.textContent = "Snap:";
  const snapSel = document.createElement("select");
  Object.entries(SNAP_MODES).forEach(([k, v]) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = v.label;
    snapSel.appendChild(o);
  });
  snapSel.value = "1/16";
  const quantLbl = document.createElement("label");
  quantLbl.textContent = "Q:";
  const quantVal = document.createElement("input");
  quantVal.type = "range";
  quantVal.min = "0";
  quantVal.max = "1";
  quantVal.step = "0.05";
  quantVal.value = "1";
  quantVal.style.width = "70px";
  const quantBox = document.createElement("span");
  quantBox.style.cssText =
    "font-size:11px;color:var(--accent2);font-family:monospace;width:36px;display:inline-block;text-align:center;";
  quantBox.textContent = "100%";
  quantVal.addEventListener("input", () => {
    quantBox.textContent = Math.round(parseFloat(quantVal.value) * 100) + "%";
  });

  const btnQuantStart = document.createElement("button");
  btnQuantStart.textContent = "Q Start";
  const btnQuantLen = document.createElement("button");
  btnQuantLen.textContent = "Q Len";

  const btnLegato = document.createElement("button");
  btnLegato.textContent = "Legato";
  const btnStaccato = document.createElement("button");
  btnStaccato.textContent = "Staccato";

  const btnCopy = document.createElement("button");
  btnCopy.textContent = "Copy";
  const btnPaste = document.createElement("button");
  btnPaste.textContent = "Paste";
  const btnDup = document.createElement("button");
  btnDup.textContent = "Duplicate";
  const btnDel = document.createElement("button");
  btnDel.textContent = "Delete";
  const btnAll = document.createElement("button");
  btnAll.textContent = "All";
  const btnUndo = document.createElement("button");
  btnUndo.id = "prUndoBtn";
  btnUndo.textContent = "↶";
  const btnRedo = document.createElement("button");
  btnRedo.id = "prRedoBtn";
  btnRedo.textContent = "↷";

  toolbar.appendChild(zoomLbl);
  toolbar.appendChild(zoomInp);
  toolbar.appendChild(snapLbl);
  toolbar.appendChild(snapSel);
  toolbar.appendChild(quantLbl);
  toolbar.appendChild(quantVal);
  toolbar.appendChild(quantBox);
  toolbar.appendChild(btnQuantStart);
  toolbar.appendChild(btnQuantLen);
  toolbar.appendChild(btnLegato);
  toolbar.appendChild(btnStaccato);
  toolbar.appendChild(btnCopy);
  toolbar.appendChild(btnPaste);
  toolbar.appendChild(btnDup);
  toolbar.appendChild(btnDel);
  toolbar.appendChild(btnAll);
  toolbar.appendChild(btnUndo);
  toolbar.appendChild(btnRedo);

  const main = document.createElement("div");
  main.className = "pr-main";
  const scroll = document.createElement("div");
  scroll.className = "pr-scroll";
  const content = document.createElement("div");
  content.className = "pr-content";

  const keyH = 18,
    keysW = 56;
  const notesH = totalNotes * keyH;

  /* v18.1: robuste Auto-Breite.
     Wichtig: bei Aufruf vor Layout (clientWidth 0) einen großzügigen
     Fallback verwenden — niemals 0, sonst bleibt das Grid unsichtbar. */
  const computeAutoPx = () => {
    let containerW = 0;
    try {
      containerW = scroll.clientWidth || main.clientWidth || 0;
    } catch (e) {}
    if (!containerW || containerW < 400) {
      containerW = Math.max(900, Math.floor((window.innerWidth || 1400) * 0.9));
    }
    const availW = Math.max(400, containerW - keysW - 30);
    const fit = Math.floor(availW / stepCount);
    return Math.max(14, Math.min(80, fit));
  };

  let pxPerStep = 22; // Startwert; wird in drawGrid() neu berechnet
  let gridW = stepCount * pxPerStep;

  const drawGrid = () => {
    /* v18.1: Breite bei jedem Draw neu berechnen */
    const zoom = parseFloat(zoomInp.value);
    const zoomMul = isFinite(zoom) && zoom > 0 ? zoom : 1;
    pxPerStep = Math.round(computeAutoPx() * zoomMul);
    if (pxPerStep < 1) pxPerStep = 22; // absolute Untergrenze
    gridW = stepCount * pxPerStep;
    if (prEditor) {
      prEditor.pxPerStep = pxPerStep;
      prEditor.gridW = gridW;
    }

    content.innerHTML = "";
    content.style.width = keysW + gridW + "px";
    content.style.height = notesH + "px";

    const keys = document.createElement("div");
    keys.className = "pr-keys";
    keys.style.height = notesH + "px";
    for (let row = 0; row < totalNotes; row++) {
      const midi = range[1] - row;
      const pc = midi % 12;
      const k = document.createElement("div");
      k.className =
        "pr-key" +
        (BLACK_PC.includes(pc) ? " black" : "") +
        (pc === 0 ? " c" : "");
      k.textContent = midiToName(midi);
      keys.appendChild(k);
    }
    content.appendChild(keys);

    const grid = document.createElement("div");
    grid.className = "pr-grid";
    grid.style.left = keysW + "px";
    grid.style.width = gridW + "px";
    grid.style.height = notesH + "px";
    for (let r = 0; r < totalNotes; r++) {
      const midi = range[1] - r;
      const ln = document.createElement("div");
      ln.className = "pr-row-line";
      if (!isInScale(midi)) ln.classList.add("pr-scale-highlight");
      ln.style.top = r * keyH + keyH - 1 + "px";
      grid.appendChild(ln);
    }
    for (let s = 0; s <= stepCount; s++) {
      if (s % 16 === 0) {
        const ln = document.createElement("div");
        ln.className = "pr-bar-line";
        ln.style.left = s * pxPerStep + "px";
        grid.appendChild(ln);
      } else if (s % 4 === 0) {
        const ln = document.createElement("div");
        ln.className = "pr-beat-line";
        ln.style.left = s * pxPerStep + "px";
        grid.appendChild(ln);
      }
    }
    content.appendChild(grid);

    const notesLayer = document.createElement("div");
    notesLayer.style.cssText = `position:absolute;left:${keysW}px;top:0;width:${gridW}px;height:${notesH}px;`;
    content.appendChild(notesLayer);

    const ruler = document.createElement("div");
    ruler.className = "pr-ruler";
    ruler.style.cssText = `position:absolute;left:${keysW}px;top:0;width:${gridW}px;height:22px;`;
    for (let s = 0; s < stepCount; s += 16) {
      const mk = document.createElement("div");
      mk.className = "pr-ruler-mark";
      mk.style.left = s * pxPerStep + "px";
      mk.textContent = "Bar " + (s / 16 + 1);
      ruler.appendChild(mk);
    }
    content.appendChild(ruler);

    const playhead = document.createElement("div");
    playhead.style.cssText = `position:absolute;left:0;top:0;width:1px;height:${notesH}px;background:#fff;pointer-events:none;z-index:6;display:none;box-shadow:0 0 6px rgba(255,255,255,.5);`;
    notesLayer.appendChild(playhead);

    prEditor.notesLayer = notesLayer;
    prEditor.playhead = playhead;

    notesLayer.addEventListener("mousedown", onPianoMouseDown);
    notesLayer.addEventListener("contextmenu", onPianoContextMenu);

    redrawNotes();
  };

  zoomInp.addEventListener("input", () => {
    drawGrid();
  });
  scroll.appendChild(content);
  main.appendChild(scroll);
  panel.appendChild(head);
  panel.appendChild(toolbar);
  panel.appendChild(main);

  const velo = document.createElement("div");
  velo.className = "pr-velo";
  const vLbl = document.createElement("div");
  vLbl.className = "pr-velo-label";
  vLbl.textContent = "VEL";
  const vContent = document.createElement("div");
  vContent.className = "pr-velo-content";
  vContent.style.width = gridW + "px";
  velo.appendChild(vLbl);
  velo.appendChild(vContent);
  panel.appendChild(velo);
  prOverlay.innerHTML = "";
  prOverlay.appendChild(panel);
  prOverlay.classList.remove("hidden");

  prEditor = {
    trackId,
    range,
    pxPerStep,
    keyH,
    keysW,
    gridW,
    notesH,
    totalNotes,
    scroll,
    content,
    notesLayer: null,
    vContent,
    playhead: null,
    snap: "1/16",
    quantStrength: 1,
    chordMode: false,
    selectedIds: new Set(),
    clipboard: null,
    drag: null,
    noteEls: new Map(),
    veloEls: new Map(),
    _resizeHandler: null,
  };

  /* v18.2: Resize-Handler erst NACH prEditor-Init definieren */
  const _prResize = () => {
    if (prEditor && prEditor.trackId === trackId) drawGrid();
  };
  window.addEventListener("resize", _prResize);
  prEditor._resizeHandler = _prResize;

  /* v18.2: Erst-Draw nach Layout, dann nochmal — schadet nichts,
     stellt sicher, dass scroll.clientWidth einen echten Wert hat. */
  requestAnimationFrame(() => {
    if (prEditor && prEditor.trackId === trackId) drawGrid();
  });
  drawGrid();
  updateUndoButtons();

  document.addEventListener("mousemove", onPianoMouseMove);
  document.addEventListener("mouseup", onPianoMouseUp);

  snapSel.addEventListener("change", () => {
    prEditor.snap = snapSel.value;
  });
  quantVal.addEventListener("input", () => {
    prEditor.quantStrength = parseFloat(quantVal.value);
  });
  btnQuantStart.addEventListener("click", () => quantizeSelected(false));
  btnQuantLen.addEventListener("click", () => quantizeSelected(true));
  btnLegato.addEventListener("click", () => {
    if (!prEditor || !prEditor.selectedIds.size) return;
    pushHistory();
    const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
    const sel = notes
      .filter((n) => prEditor.selectedIds.has(n.id))
      .sort((a, b) => a.start - b.start);
    for (let i = 0; i < sel.length - 1; i++) {
      sel[i].len = Math.max(0.1, sel[i + 1].start - sel[i].start);
    }
    redrawNotes();
    autoSave();
  });
  btnStaccato.addEventListener("click", () => {
    if (!prEditor || !prEditor.selectedIds.size) return;
    pushHistory();
    const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
    notes.forEach((n) => {
      if (prEditor.selectedIds.has(n.id)) n.len = Math.max(0.1, n.len / 2);
    });
    redrawNotes();
    autoSave();
  });
  btnCopy.addEventListener("click", () => copySelected());
  btnPaste.addEventListener("click", () => pasteClipboard());
  btnDup.addEventListener("click", () => duplicateSelected());
  btnDel.addEventListener("click", () => deleteSelected());
  btnAll.addEventListener("click", () => {
    prEditor.selectedIds = new Set(
      patterns[currentPattern].pianoRoll[trackId].map((n) => n.id)
    );
    redrawNotes();
  });
  btnUndo.addEventListener("click", performUndo);
  btnRedo.addEventListener("click", performRedo);

  vContent.addEventListener("mousedown", onVeloMouseDown);
  /* KEIN weiterer resize-Listener hier — der ist schon oben registriert */
}

function redrawNotes() {
  if (!prEditor) return;
  const { trackId, range, pxPerStep, keyH, notesLayer, vContent } = prEditor;
  if (!notesLayer) return;
  const notes = patterns[currentPattern].pianoRoll[trackId];
  prEditor.noteEls.forEach((el) => el.remove());
  prEditor.noteEls.clear();
  prEditor.veloEls.forEach((el) => el.remove());
  prEditor.veloEls.clear();
  notes.forEach((n) => {
    const top = (range[1] - n.midi) * keyH;
    const left = n.start * pxPerStep;
    const width = Math.max(6, n.len * pxPerStep - 1);
    const el = document.createElement("div");
    el.className =
      "pr-note" + (prEditor.selectedIds.has(n.id) ? " selected" : "");
    el.style.left = left + "px";
    el.style.top = top + "px";
    el.style.width = width + "px";
    el.style.height = keyH - 2 + "px";
    el.dataset.id = n.id;
    const eL = document.createElement("div");
    eL.className = "edge l";
    const eR = document.createElement("div");
    eR.className = "edge r";
    el.appendChild(eL);
    el.appendChild(eR);
    if (width > 30) el.appendChild(document.createTextNode(midiToName(n.midi)));
    notesLayer.appendChild(el);
    prEditor.noteEls.set(n.id, el);
    const vb = document.createElement("div");
    vb.className =
      "pr-velo-bar" + (prEditor.selectedIds.has(n.id) ? " selected" : "");
    vb.style.height = Math.max(3, Math.round((n.vel / 127) * 80)) + "px";
    vb.style.left = left + width / 2 - 2.5 + "px";
    vb.dataset.id = n.id;
    vContent.appendChild(vb);
    prEditor.veloEls.set(n.id, vb);
  });
}
function updateNoteEl(n) {
  if (!prEditor) return;
  const el = prEditor.noteEls.get(n.id);
  if (!el) return;
  el.style.left = n.start * prEditor.pxPerStep + "px";
  el.style.top = (prEditor.range[1] - n.midi) * prEditor.keyH + "px";
  el.style.width = Math.max(6, n.len * prEditor.pxPerStep - 1) + "px";
  const vb = prEditor.veloEls.get(n.id);
  if (vb) {
    const left = n.start * prEditor.pxPerStep;
    const width = Math.max(6, n.len * prEditor.pxPerStep - 1);
    vb.style.left = left + width / 2 - 2.5 + "px";
    vb.style.height = Math.max(3, Math.round((n.vel / 127) * 80)) + "px";
  }
}
function updateSelectionVisual() {
  if (!prEditor) return;
  prEditor.noteEls.forEach((el, id) =>
    el.classList.toggle("selected", prEditor.selectedIds.has(id))
  );
  prEditor.veloEls.forEach((el, id) =>
    el.classList.toggle("selected", prEditor.selectedIds.has(id))
  );
}
function clientToStep(clientX) {
  const rect = prEditor.notesLayer.getBoundingClientRect();
  return (clientX - rect.left) / prEditor.pxPerStep;
}
function clientToMidi(clientY) {
  const rect = prEditor.notesLayer.getBoundingClientRect();
  const row = (clientY - rect.top) / prEditor.keyH;
  return Math.round(prEditor.range[1] - row);
}

function onPianoMouseDown(e) {
  if (!prEditor) return;
  if (e.button !== 0) return;
  const target = e.target;
  const noteEl = target.closest(".pr-note");
  const ctrl = e.ctrlKey || e.metaKey;

  if (ctrl) {
    const rubber = document.createElement("div");
    rubber.className = "pr-rubber";
    rubber.style.display = "none";
    prEditor.notesLayer.appendChild(rubber);
    prEditor.drag = {
      mode: "marquee",
      startX: e.clientX,
      startY: e.clientY,
      rubberEl: rubber,
      moved: false,
      baseIds: new Set(prEditor.selectedIds),
      additive: e.shiftKey,
      subtract: e.altKey,
    };
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (!noteEl) {
    const startStep = snapTo(clientToStep(e.clientX), prEditor.snap);
    const startMidi = clientToMidi(e.clientY);

    if (prEditor.chordMode) {
      insertChord(
        prEditor.trackId,
        startStep,
        Math.max(prEditor.range[0], Math.min(prEditor.range[1], startMidi))
      );
      e.preventDefault();
      return;
    }

    const r = document.createElement("div");
    r.className = "pr-rubber";
    r.style.display = "none";
    prEditor.notesLayer.appendChild(r);
    prEditor.drag = {
      mode: "empty",
      startX: e.clientX,
      startY: e.clientY,
      startStep,
      startMidi,
      rubberEl: r,
      moved: false,
    };
    e.preventDefault();
    return;
  }

  if (target.classList.contains("edge")) {
    const edge = target.classList.contains("l") ? "l" : "r";
    const id = noteEl.dataset.id;
    const note = patterns[currentPattern].pianoRoll[prEditor.trackId].find(
      (n) => n.id === id
    );
    if (!note) return;
    prEditor.drag = {
      mode: "resize-" + edge,
      note,
      origStart: note.start,
      origLen: note.len,
      startX: e.clientX,
      preState: snapshotState(),
    };
    e.preventDefault();
    return;
  }

  const id = noteEl.dataset.id;
  const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  const isSel = prEditor.selectedIds.has(id);
  const alt = e.altKey,
    shift = e.shiftKey;
  if (alt) {
    prEditor.selectedIds.delete(id);
    updateSelectionVisual();
    e.preventDefault();
    return;
  }
  if (shift) {
    if (!isSel) prEditor.selectedIds.add(id);
  } else if (!isSel) prEditor.selectedIds = new Set([id]);
  updateSelectionVisual();

  const dragNotes = notes.filter((n) => prEditor.selectedIds.has(n.id));
  prEditor.drag = {
    mode: "move",
    startX: e.clientX,
    startY: e.clientY,
    notes: dragNotes.map((n) => ({
      id: n.id,
      origStart: n.start,
      origMidi: n.midi,
    })),
    preState: snapshotState(),
  };
  e.preventDefault();
}

function onPianoContextMenu(e) {
  if (!prEditor) return;
  const target = e.target;
  const noteEl = target.closest(".pr-note");
  if (!noteEl) return;
  e.preventDefault();
  const id = noteEl.dataset.id;
  const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  if (!prEditor.selectedIds.has(id)) {
    prEditor.selectedIds = new Set([id]);
    updateSelectionVisual();
  }
  const sc = prEditor.selectedIds.size;
  const trackName = TRACKS.find((t) => t.id === prEditor.trackId)?.name || "";
  showContextMenu(e.clientX, e.clientY, [
    {
      header:
        sc > 1
          ? sc + " notes selected"
          : midiToName(note.midi) + " @ " + note.start.toFixed(2),
    },
    { label: "Copy", shortcut: "Ctrl+C", action: copySelected },
    { label: "Duplicate", shortcut: "Ctrl+D", action: duplicateSelected },
    { label: "Delete", shortcut: "Del", action: deleteSelected },
    "---",
    { label: "Halve length", action: halfSelectedNotes },
    { label: "Split at midpoint", action: splitSelectedNotes },
    "---",
    { label: "Octave up", action: () => transposeSelected(12) },
    { label: "Octave down", action: () => transposeSelected(-12) },
    { label: "Semitone up", action: () => transposeSelected(1) },
    { label: "Semitone down", action: () => transposeSelected(-1) },
    "---",
    {
      label: "Edit velocity…",
      action: () => {
        const v = prompt("Velocity 1–127:", note.vel);
        if (v == null) return;
        const n = parseInt(v);
        if (isNaN(n)) return;
        pushHistory();
        notes.forEach((x) => {
          if (prEditor.selectedIds.has(x.id))
            x.vel = Math.max(1, Math.min(127, n));
        });
        redrawNotes();
        autoSave();
      },
    },
    {
      label: "Set length…",
      action: () => {
        const v = prompt("Length in steps:", note.len);
        if (v == null) return;
        const n = parseFloat(v);
        if (isNaN(n) || n <= 0) return;
        pushHistory();
        notes.forEach((x) => {
          if (prEditor.selectedIds.has(x.id)) x.len = n;
        });
        syncMelodicSteps(patterns[currentPattern]);
        redrawNotes();
        autoSave();
      },
    },
    "---",
    {
      label: "Delete all notes in this track",
      action: () => {
        if (!confirm("Delete all notes in " + trackName + "?")) return;
        pushHistory();
        patterns[currentPattern].pianoRoll[prEditor.trackId] = [];
        prEditor.selectedIds.clear();
        syncMelodicSteps(patterns[currentPattern]);
        redrawNotes();
        autoSave();
      },
    },
  ]);
}

function onPianoMouseMove(e) {
  if (!prEditor || !prEditor.drag) return;
  const d = prEditor.drag;
  if (d.mode === "empty" || d.mode === "marquee") {
    const dx = e.clientX - d.startX,
      dy = e.clientY - d.startY;
    if (!d.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      d.moved = true;
      d.rubberEl.style.display = "block";
    }
    if (!d.moved) return;
    const rect = prEditor.notesLayer.getBoundingClientRect();
    const x1 = Math.min(d.startX, e.clientX) - rect.left;
    const y1 = Math.min(d.startY, e.clientY) - rect.top;
    const x2 = Math.max(d.startX, e.clientX) - rect.left;
    const y2 = Math.max(d.startY, e.clientY) - rect.top;
    d.rubberEl.style.left = x1 + "px";
    d.rubberEl.style.top = y1 + "px";
    d.rubberEl.style.width = x2 - x1 + "px";
    d.rubberEl.style.height = y2 - y1 + "px";
    if (d.mode === "marquee") {
      const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
      const hits = [];
      notes.forEach((n) => {
        const nx1 = n.start * prEditor.pxPerStep;
        const ny1 = (prEditor.range[1] - n.midi) * prEditor.keyH;
        const nx2 = nx1 + Math.max(6, n.len * prEditor.pxPerStep - 1);
        const ny2 = ny1 + prEditor.keyH - 2;
        if (nx2 > x1 && nx1 < x2 && ny2 > y1 && ny1 < y2) hits.push(n.id);
      });
      if (d.subtract) {
        prEditor.selectedIds = new Set(
          [...d.baseIds].filter((id) => !hits.includes(id))
        );
      } else if (d.additive) {
        prEditor.selectedIds = new Set([...d.baseIds, ...hits]);
      } else {
        prEditor.selectedIds = new Set(hits);
      }
      updateSelectionVisual();
    }
  } else if (d.mode === "move") {
    const ds = (e.clientX - d.startX) / prEditor.pxPerStep;
    const dm = Math.round((d.startY - e.clientY) / prEditor.keyH);
    const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
    d.notes.forEach((o) => {
      const n = notes.find((x) => x.id === o.id);
      if (!n) return;
      let ns = o.origStart + ds;
      ns = Math.max(0, Math.min(stepCount - 0.01, ns));
      if (prEditor.snap !== "off") {
        const g = SNAP_MODES[prEditor.snap].steps;
        const os = Math.round(o.origStart / g) * g;
        const delta = Math.round(ds / g) * g;
        ns = Math.max(0, os + delta);
      }
      n.start = ns;
      let nm = o.origMidi + dm;
      nm = Math.max(prEditor.range[0], Math.min(prEditor.range[1], nm));
      n.midi = nm;
      updateNoteEl(n);
    });
  } else if (d.mode === "resize-r") {
    const ds = (e.clientX - d.startX) / prEditor.pxPerStep;
    let nl = d.origLen + ds;
    nl = Math.max(0.25, Math.min(64, nl));
    if (prEditor.snap !== "off") {
      const g = SNAP_MODES[prEditor.snap].steps;
      nl = Math.max(g, Math.round(nl / g) * g);
    }
    d.note.len = nl;
    updateNoteEl(d.note);
  } else if (d.mode === "resize-l") {
    const ds = (e.clientX - d.startX) / prEditor.pxPerStep;
    let ns = d.origStart + ds,
      nl = d.origLen - ds;
    if (prEditor.snap !== "off") {
      const g = SNAP_MODES[prEditor.snap].steps;
      ns = Math.round(ns / g) * g;
      nl = d.origStart + d.origLen - ns;
      nl = Math.max(g, Math.round(nl / g) * g);
      ns = d.origStart + d.origLen - nl;
    } else {
      nl = Math.max(0.25, nl);
      ns = Math.max(0, ns);
    }
    d.note.start = ns;
    d.note.len = nl;
    updateNoteEl(d.note);
  } else if (d.mode === "velo") {
    const rect = prEditor.vContent.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const val = Math.max(1, Math.min(127, Math.round((1 - relY / 80) * 127)));
    const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
    d.noteIds.forEach((id) => {
      const n = notes.find((x) => x.id === id);
      if (n) {
        n.vel = val;
        updateNoteEl(n);
      }
    });
  }
}
function onPianoMouseUp(e) {
  if (!prEditor || !prEditor.drag) return;
  const d = prEditor.drag;
  if (d.mode === "empty" || d.mode === "marquee") {
    if (d.rubberEl) d.rubberEl.remove();
    if (d.mode === "empty" && !d.moved) {
      const note = {
        id: genId("n"),
        start: Math.max(0, Math.min(stepCount - 1, d.startStep)),
        len: 1,
        midi: Math.max(
          prEditor.range[0],
          Math.min(prEditor.range[1], d.startMidi)
        ),
        vel: 100,
      };
      patterns[currentPattern].pianoRoll[prEditor.trackId].push(note);
      syncMelodicSteps(patterns[currentPattern]);
      prEditor.selectedIds = new Set([note.id]);
      prEditor.drag = null;
      redrawNotes();
      pushHistory();
      autoSave();
      return;
    }
    if (d.mode === "empty" && d.moved) {
      const rect = prEditor.notesLayer.getBoundingClientRect();
      const x1 = Math.min(d.startX, e.clientX) - rect.left;
      const y1 = Math.min(d.startY, e.clientY) - rect.top;
      const x2 = Math.max(d.startX, e.clientX) - rect.left;
      const y2 = Math.max(d.startY, e.clientY) - rect.top;
      const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
      const hits = [];
      notes.forEach((n) => {
        const nx1 = n.start * prEditor.pxPerStep;
        const ny1 = (prEditor.range[1] - n.midi) * prEditor.keyH;
        const nx2 = nx1 + Math.max(6, n.len * prEditor.pxPerStep - 1);
        const ny2 = ny1 + prEditor.keyH - 2;
        if (nx2 > x1 && nx1 < x2 && ny2 > y1 && ny1 < y2) hits.push(n.id);
      });
      if (e.shiftKey || e.ctrlKey || e.metaKey)
        hits.forEach((id) => prEditor.selectedIds.add(id));
      else prEditor.selectedIds = new Set(hits);
    } else if (d.mode === "marquee" && !d.moved) {
      const hit = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest(".pr-note");
      if (hit && prEditor.notesLayer.contains(hit)) {
        const id = hit.dataset.id;
        const next = new Set(d.baseIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        if (d.subtract) next.delete(id);
        prEditor.selectedIds = next;
      } else {
        prEditor.selectedIds = new Set(d.baseIds);
      }
    }
    updateSelectionVisual();
  } else if (
    d.mode === "move" ||
    d.mode === "resize-l" ||
    d.mode === "resize-r"
  ) {
    pushHistory();
    syncMelodicSteps(patterns[currentPattern]);
  } else if (d.mode === "velo") {
    pushHistory();
  }
  prEditor.drag = null;
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  autoSave();
}
function onVeloMouseDown(e) {
  if (!prEditor) return;
  const bar = e.target.closest(".pr-velo-bar");
  if (!bar) return;
  const id = bar.dataset.id;
  if (!prEditor.selectedIds.has(id)) {
    prEditor.selectedIds = new Set([id]);
    updateSelectionVisual();
  }
  prEditor.drag = {
    mode: "velo",
    noteIds: Array.from(prEditor.selectedIds),
    preState: snapshotState(),
  };
  e.stopPropagation();
  e.preventDefault();
}

function getSelectedNotes() {
  return patterns[currentPattern].pianoRoll[prEditor.trackId].filter((n) =>
    prEditor.selectedIds.has(n.id)
  );
}
function deleteSelected() {
  if (!prEditor || !prEditor.selectedIds.size) return;
  const tid = prEditor.trackId;
  patterns[currentPattern].pianoRoll[tid] = patterns[currentPattern].pianoRoll[
    tid
  ].filter((n) => !prEditor.selectedIds.has(n.id));
  prEditor.selectedIds.clear();
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  pushHistory();
  autoSave();
}
function copySelected() {
  if (!prEditor || !prEditor.selectedIds.size) return;
  const sel = getSelectedNotes();
  const ms = Math.min(...sel.map((n) => n.start));
  prEditor.clipboard = sel.map((n) => ({
    start: n.start - ms,
    len: n.len,
    midi: n.midi,
    vel: n.vel,
  }));
  toast(sel.length + " note(s) copied", "success");
}
function pasteClipboard() {
  if (!prEditor || !prEditor.clipboard) return;
  const tid = prEditor.trackId;
  const target = playMode === "song" ? currentSongStep % stepCount : 0;
  const newIds = new Set();
  prEditor.clipboard.forEach((c) => {
    const id = genId("n");
    const start = Math.min(stepCount - 0.5, target + c.start);
    patterns[currentPattern].pianoRoll[tid].push({
      id,
      start,
      len: c.len,
      midi: c.midi,
      vel: c.vel,
    });
    newIds.add(id);
  });
  prEditor.selectedIds = newIds;
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  pushHistory();
  autoSave();
}
function duplicateSelected() {
  if (!prEditor || !prEditor.selectedIds.size) return;
  const tid = prEditor.trackId;
  const sel = getSelectedNotes();
  const maxEnd = Math.max(...sel.map((n) => n.start + n.len));
  const minStart = Math.min(...sel.map((n) => n.start));
  const offset = maxEnd - minStart;
  const newIds = new Set();
  sel.forEach((n) => {
    const id = genId("n");
    patterns[currentPattern].pianoRoll[tid].push({
      id,
      start: n.start + offset,
      len: n.len,
      midi: n.midi,
      vel: n.vel,
    });
    newIds.add(id);
  });
  prEditor.selectedIds = newIds;
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  pushHistory();
  autoSave();
}
function quantizeSelected(lengthsOnly) {
  if (!prEditor || !prEditor.selectedIds.size) return;
  const g = SNAP_MODES[prEditor.snap]?.steps || 1;
  const s = prEditor.quantStrength;
  const tid = prEditor.trackId;
  patterns[currentPattern].pianoRoll[tid].forEach((n) => {
    if (!prEditor.selectedIds.has(n.id)) return;
    if (lengthsOnly) {
      const sn = Math.max(g, Math.round(n.len / g) * g);
      n.len = n.len + (sn - n.len) * s;
    } else {
      const ss = Math.round(n.start / g) * g;
      n.start = Math.max(0, n.start + (ss - n.start) * s);
    }
  });
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  pushHistory();
  autoSave();
  toast(lengthsOnly ? "Lengths quantized" : "Notes quantized", "success");
}
function halfSelectedNotes() {
  if (!prEditor || !prEditor.selectedIds.size) return;
  const notes = patterns[currentPattern].pianoRoll[prEditor.trackId];
  notes.forEach((n) => {
    if (prEditor.selectedIds.has(n.id))
      n.len = Math.max(0.25, (n.len || 1) / 2);
  });
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  pushHistory();
  autoSave();
  toast("Length halved", "success");
}
function splitSelectedNotes() {
  if (!prEditor || !prEditor.selectedIds.size) return;
  const tid = prEditor.trackId;
  const arr = patterns[currentPattern].pianoRoll[tid];
  const add = [];
  let sc = 0,
    sk = 0;
  arr.forEach((n) => {
    if (!prEditor.selectedIds.has(n.id)) return;
    const len = n.len || 1;
    if (len < 0.5) {
      sk++;
      return;
    }
    const half = len / 2;
    const second = {
      id: genId("n"),
      start: n.start + half,
      len: len - half,
      midi: n.midi,
      vel: n.vel,
    };
    n.len = half;
    add.push(second);
    sc++;
  });
  if (!sc) {
    toast("No note long enough to split", "error");
    return;
  }
  arr.push(...add);
  syncMelodicSteps(patterns[currentPattern]);
  redrawNotes();
  pushHistory();
  autoSave();
  toast(
    sc + " note(s) split" + (sk ? " (" + sk + " too short)" : ""),
    "success"
  );
}
function transposeSelected(semis) {
  if (!prEditor || !prEditor.selectedIds.size) return;
  const tid = prEditor.trackId;
  const arr = patterns[currentPattern].pianoRoll[tid];
  const r = prEditor.range;
  arr.forEach((n) => {
    if (prEditor.selectedIds.has(n.id))
      n.midi = Math.max(r[0], Math.min(r[1], n.midi + semis));
  });
  redrawNotes();
  pushHistory();
  autoSave();
}
function performUndo() {
  if (prEditor) prEditor.selectedIds.clear();
  undoHistory();
  if (prEditor) {
    redrawNotes();
    updateUndoButtons();
  }
}
function performRedo() {
  if (prEditor) prEditor.selectedIds.clear();
  redoHistory();
  if (prEditor) {
    redrawNotes();
    updateUndoButtons();
  }
}
function updatePRPlayhead(localStep) {
  if (!prEditor || !prEditor.playhead) return;
  prEditor.playhead.style.display = "block";
  prEditor.playhead.style.left = localStep * prEditor.pxPerStep + "px";
}
function closePianoRoll() {
  if (prEditor && prEditor.notesLayer) {
    prEditor.notesLayer.removeEventListener("mousedown", onPianoMouseDown);
    prEditor.notesLayer.removeEventListener("contextmenu", onPianoContextMenu);
  }
  document.removeEventListener("mousemove", onPianoMouseMove);
  document.removeEventListener("mouseup", onPianoMouseUp);
  prOverlay.classList.add("hidden");
  prOverlay.innerHTML = "";
  if (prEditor && prEditor._resizeHandler) {
    window.removeEventListener("resize", prEditor._resizeHandler);
  }
  prEditor = null;

  /* v18.3: Rack neu zeichnen, damit alle Piano-Roll-Noten
     sofort als aktive Steps sichtbar sind (statt erst nach
     der nächsten Aktion, die zufällig rebuildRack() aufruft). */
  if (typeof rebuildRack === "function") rebuildRack();
}
/* ---------- Undo-History Panel ---------- */
function showUndoHistory() {
  if (typeof historyStack === "undefined" || !Array.isArray(historyStack)) {
    toast("History unavailable", "error");
    return;
  }
  if (historyStack.length === 0) {
    toast("No history yet — do something first", "error");
    return;
  }

  const wrap = document.createElement("div");
  wrap.style.cssText =
    "display:flex;flex-direction:column;gap:4px;max-height:65vh;overflow-y:auto;padding-right:4px;";

  // Info
  const info = document.createElement("div");
  info.style.cssText =
    "font-size:11px;color:var(--muted);margin-bottom:4px;line-height:1.5;";
  info.textContent =
    "History: " +
    (historyIndex + 1) +
    " / " +
    historyStack.length +
    "  ·  Click an entry to jump to that state (will be saved to autoSave).";
  wrap.appendChild(info);

  // Helper: Summary aus Snapshot-JSON berechnen
  const summarize = (idx) => {
    try {
      const s = JSON.parse(historyStack[idx]);
      let notes = 0;
      if (s.patterns) {
        Object.values(s.patterns).forEach((p) => {
          if (p && p.pianoRoll) {
            Object.values(p.pianoRoll).forEach((arr) => {
              if (Array.isArray(arr)) notes += arr.length;
            });
          }
        });
      }
      const blocks =
        s.song && Array.isArray(s.song.blocks) ? s.song.blocks.length : 0;
      const lanes =
        s.automation && Array.isArray(s.automation.lanes)
          ? s.automation.lanes.length
          : 0;
      return notes + " notes · " + blocks + " blocks · " + lanes + " auto";
    } catch (e) {
      return "(unreadable)";
    }
  };

  // Einträge: von alt nach neu
  for (let i = 0; i < historyStack.length; i++) {
    const isCurrent = i === historyIndex;
    const isFuture = i > historyIndex;

    const row = document.createElement("div");
    row.style.cssText =
      "display:flex;align-items:center;gap:8px;padding:8px 10px;" +
      "background:" +
      (isCurrent ? "var(--accent)" : isFuture ? "#1a1a1a" : "#252525") +
      ";" +
      "color:" +
      (isCurrent ? "#111" : isFuture ? "#666" : "#ddd") +
      ";" +
      "border:1px solid " +
      (isCurrent ? "var(--accent2)" : "#000") +
      ";" +
      "border-radius:4px;cursor:pointer;font-size:11px;" +
      (isCurrent ? "font-weight:700;" : "") +
      (isFuture ? "font-style:italic;" : "");

    const num = document.createElement("span");
    num.textContent = "#" + (i + 1);
    num.style.cssText = "font-family:monospace;min-width:36px;font-weight:700;";

    const txt = document.createElement("span");
    txt.textContent = summarize(i);
    txt.style.cssText =
      "flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";

    const badge = document.createElement("span");
    if (isCurrent) badge.textContent = "● current";
    else if (isFuture) badge.textContent = "↷ redo";
    else badge.textContent = "";
    badge.style.cssText =
      "font-size:9px;color:" +
      (isCurrent ? "#333" : "#888") +
      ";font-style:italic;";

    row.append(num, txt, badge);

    row.addEventListener("click", () => {
      if (i === historyIndex) {
        hideModal();
        return;
      }
      try {
        historyIndex = i;
        if (typeof restoreState === "function") restoreState(historyStack[i]);
        if (typeof autoSave === "function") autoSave();
        hideModal();
        toast("Jumped to history #" + (i + 1), "success");
        // Rebuild ist in restoreState schon drin; falls nicht, Rack neu zeichnen
        if (typeof rebuildRack === "function" && currentView === "rack")
          rebuildRack();
        if (typeof rebuildMixer === "function" && currentView === "mixer")
          rebuildMixer();
      } catch (err) {
        console.error("History jump failed:", err);
        toast("Jump failed: " + err.message, "error");
      }
    });

    row.addEventListener("mouseenter", () => {
      if (!isCurrent) row.style.background = "#3a3a3a";
    });
    row.addEventListener("mouseleave", () => {
      if (!isCurrent) row.style.background = isFuture ? "#1a1a1a" : "#252525";
    });

    wrap.appendChild(row);
  }

  showModal("📜 Undo History", wrap, [{ label: "Close", onClick: hideModal }]);
}
/* ---------- Save / Load Modal ---------- */
function showSaveModal() {
  const ta = document.createElement("textarea");
  ta.value = JSON.stringify(serialize(), null, 2);
  ta.readOnly = true;
  const wrap = document.createElement("div");
  wrap.appendChild(ta);
  const info = document.createElement("div");
  info.style.cssText = "font-size:11px;color:var(--muted);margin-top:8px;";
  const refs = Object.values(samples).filter((s) => s.id);
  info.textContent = refs.length
    ? "Samples: " + refs.map((s) => s.name).join(", ")
    : "No external samples.";
  wrap.appendChild(info);
  showModal("💾 Project (JSON v17)", wrap, [
    {
      label: "📋 Copy",
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(ta.value);
          toast("Copied", "success");
        } catch (e) {
          ta.select();
          document.execCommand("copy");
          toast("Copied", "success");
        }
      },
    },
    {
      label: "⬇ Download",
      onClick: () => {
        const blob = new Blob([ta.value], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `flclone-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:.]/g, "-")}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast("Download started", "success");
      },
    },
    { label: "Close", onClick: hideModal },
  ]);
  setTimeout(() => {
    ta.focus();
    ta.select();
  }, 50);
}
function showLoadModal() {
  const ta = document.createElement("textarea");
  ta.placeholder = "JSON (v5–v17) …";
  const fi = document.createElement("input");
  fi.type = "file";
  fi.accept = ".json,application/json";
  fi.style.display = "none";
  fi.addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      ta.value = ev.target.result;
    };
    r.readAsText(f);
    e.target.value = "";
  });
  const wrap = document.createElement("div");
  wrap.appendChild(ta);
  wrap.appendChild(fi);
  showModal("📂 Import project", wrap, [
    { label: "📁 File", onClick: () => fi.click() },
    {
      label: "✔ Load",
      className: "play",
      onClick: async () => {
        const t = ta.value.trim();
        if (!t) {
          toast("No JSON", "error");
          return;
        }
        try {
          const res = apply(JSON.parse(t));
          if (res.ok) {
            await restoreSamplesFromDB();
            autoSave();
            hideModal();
            toast("Project loaded", "success");
          } else toast("Error: " + (res.msg || "?"), "error");
        } catch (err) {
          toast("JSON error: " + err.message, "error");
        }
      },
    },
    { label: "Cancel", onClick: hideModal },
  ]);
}

/* ---------- WAV Export ---------- */
function encodeWav(ab, bitDepth) {
  const nch = ab.numberOfChannels,
    sr = ab.sampleRate,
    len = ab.length,
    bps = bitDepth / 8,
    ba = nch * bps,
    ds = len * ba;
  const buffer = new ArrayBuffer(44 + ds);
  const view = new DataView(buffer);
  let o = 0;
  const ws = (s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o++, s.charCodeAt(i));
  };
  const u32 = (v) => {
    view.setUint32(o, v, true);
    o += 4;
  };
  const u16 = (v) => {
    view.setUint16(o, v, true);
    o += 2;
  };
  ws("RIFF");
  u32(36 + ds);
  ws("WAVE");
  ws("fmt ");
  u32(16);
  u16(1);
  u16(nch);
  u32(sr);
  u32(sr * ba);
  u16(ba);
  u16(bitDepth);
  ws("data");
  u32(ds);
  const ch = [];
  for (let c = 0; c < nch; c++) ch.push(ab.getChannelData(c));
  if (bitDepth === 16) {
    for (let i = 0; i < len; i++)
      for (let c = 0; c < nch; c++) {
        let s = Math.max(-1, Math.min(1, ch[c][i]));
        s = s < 0 ? s * 0x8000 : s * 0x7fff;
        view.setInt16(o, s | 0, true);
        o += 2;
      }
  } else if (bitDepth === 24) {
    for (let i = 0; i < len; i++)
      for (let c = 0; c < nch; c++) {
        let s = Math.max(-1, Math.min(1, ch[c][i]));
        s = s < 0 ? s * 0x800000 : s * 0x7fffff;
        const v = s | 0;
        view.setUint8(o, v & 0xff);
        view.setUint8(o + 1, (v >> 8) & 0xff);
        view.setUint8(o + 2, (v >> 16) & 0xff);
        o += 3;
      }
  }
  return new Blob([buffer], { type: "audio/wav" });
}
async function exportWav(opts) {
  const { sampleRate, bitDepth, tailSeconds, startStep, endStep } = opts;
  const stepDur = 60 / bpm / 4;
  let exportStartStep = 0;
  let exportEndStep = 0;

  if (playMode === "song") {
    exportStartStep = startStep || 0;
    exportEndStep = endStep || getSongLength();
    if (exportEndStep <= exportStartStep) exportEndStep = exportStartStep + 16;
  } else {
    exportStartStep = 0;
    exportEndStep = stepCount;
  }

  const totalSteps = exportEndStep - exportStartStep;
  const duration = totalSteps * stepDur + tailSeconds;
  const numFrames = Math.ceil(duration * sampleRate);
  const offline = new OfflineAudioContext(2, numFrames, sampleRate);
  const graph = buildGraph(offline, { master, reverbAmount, tracks: TRACKS });

  for (let i = 0; i < totalSteps; i++) {
    const absoluteStep = exportStartStep + i;
    const time = i * stepDur;

    if (playMode === "pattern") {
      TRACKS.forEach((track) => {
        const audible = (!soloActive || track.solo) && !track.mute;
        if (!audible) return;
        scheduleTrackStep(
          offline,
          graph.buses,
          track,
          currentPattern,
          i % stepCount,
          time,
          stepDur,
          absoluteStep
        );
      });
    } else {
      applyAutomationForStep(graph, absoluteStep, time, stepDur);
      song.blocks.forEach((block) => {
        if (
          absoluteStep < block.startStep ||
          absoluteStep >= block.startStep + block.lengthSteps
        )
          return;
        const localStep =
          (absoluteStep - block.startStep + (block.sourceOffsetSteps || 0)) %
          stepCount;
        TRACKS.forEach((track) => {
          const audible = (!soloActive || track.solo) && !track.mute;
          if (!audible) return;
          scheduleTrackStep(
            offline,
            graph.buses,
            track,
            block.patternId,
            localStep,
            time,
            stepDur,
            absoluteStep
          );
        });
      });
    }
  }
  const rendered = await offline.startRendering();
  return encodeWav(rendered, bitDepth);
}
function showExportModal() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="row"><label>Sample Rate</label>
      <select id="expSR" style="background:#111;color:#ddd;border:1px solid #000;padding:4px;">
        <option value="44100" selected>44100 Hz</option>
        <option value="48000">48000 Hz</option>
      </select>
      <label style="margin-left:16px">Bit Depth</label>
      <select id="expBD" style="background:#111;color:#ddd;border:1px solid #000;padding:4px;">
        <option value="16" selected>16 Bit PCM</option>
        <option value="24">24 Bit PCM</option>
      </select>
    </div>
    <div class="row" style="margin-top:10px">
      <label>Tail (s)</label>
      <input id="expTail" type="number" min="0" max="10" step="0.5" value="3" style="width:80px;background:#111;color:#ddd;border:1px solid #000;padding:4px;">
    </div>
    ${
      playMode === "song"
        ? `
    <div class="row" style="margin-top:10px">
      <label>Export Range (Bars)</label>
      <input id="expStart" type="number" min="0" value="0" style="width:60px;background:#111;color:#ddd;border:1px solid #000;padding:4px;">
      <span style="color:#666">–</span>
      <input id="expEnd" type="number" min="0" value="${Math.ceil(
        getSongLength() / 16
      )}" style="width:60px;background:#111;color:#ddd;border:1px solid #000;padding:4px;">
    </div>`
        : ""
    }
    <div class="progress" style="margin-top:14px"><div class="bar" id="expBar"></div></div>
    <div id="expStatus" style="font-size:11px;color:var(--muted);margin-top:6px">
      Mode: ${
        playMode === "song" ? "Song" : "Pattern (" + stepCount + " steps)"
      }
    </div>`;
  showModal("📤 WAV Export", wrap, [
    { label: "Cancel", onClick: hideModal },
    {
      label: "Start export",
      className: "play",
      onClick: async () => {
        const sr = parseInt(document.getElementById("expSR").value);
        const bd = parseInt(document.getElementById("expBD").value);
        const tail = parseFloat(document.getElementById("expTail").value) || 0;
        let startStep = 0;
        let endStep = 0;
        if (playMode === "song") {
          startStep =
            parseInt(document.getElementById("expStart").value) * 16 || 0;
          endStep =
            parseInt(document.getElementById("expEnd").value) * 16 ||
            getSongLength();
        }

        const bar = document.getElementById("expBar"),
          status = document.getElementById("expStatus");
        bar.style.width = "15%";
        status.textContent = "Rendering…";
        try {
          initAudio();
          const blob = await exportWav({
            sampleRate: sr,
            bitDepth: bd,
            tailSeconds: tail,
            startStep,
            endStep,
          });
          bar.style.width = "100%";
          status.textContent = "Done.";
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `flclone-${new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/[:.]/g, "-")}.wav`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 3000);
          toast("WAV exported", "success");
          setTimeout(hideModal, 400);
        } catch (err) {
          console.error(err);
          status.textContent = "Error: " + err.message;
          toast("Export: " + err.message, "error");
        }
      },
    },
  ]);
}

/* =========================================================
   v19: PERFORMANCE MODE
   ========================================================= */
const perfGrid = document.getElementById("perfGrid");

function rebuildPerformanceView() {
  if (!perfGrid) return;

  /* Toolbar-Werte synchronisieren */
  const qSel = document.getElementById("perfQuantSel");
  if (qSel) qSel.value = String(perfQuantize);
  const fSel = document.getElementById("perfFollowSel");
  if (fSel) fSel.value = String(perfFollowSteps);
  const bpmEl = document.getElementById("perfBpm");
  if (bpmEl) bpmEl.value = bpm;

  perfGrid.innerHTML = "";

  /* Header-Zeile: Scene-Labels */
  const corner = document.createElement("div");
  corner.className = "perf-rowlabel";
  corner.textContent = "Scene →";
  perfGrid.appendChild(corner);
  for (let scene = 0; scene < 8; scene++) {
    const lbl = document.createElement("div");
    lbl.style.cssText =
      "display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#888;background:#0e0e0e;border:1px solid #000;border-radius:4px;height:24px;";
    lbl.textContent = "Scene " + (scene + 1);
    perfGrid.appendChild(lbl);
  }

  /* Pattern-Zeilen */
  PATTERN_IDS.forEach((pid) => {
    const rowLabel = document.createElement("div");
    rowLabel.className = "perf-rowlabel";
    const dot = document.createElement("div");
    dot.className = "led";
    dot.style.background = patternMeta[pid].color;
    dot.style.marginRight = "6px";
    rowLabel.appendChild(dot);
    rowLabel.appendChild(
      document.createTextNode(patternMeta[pid].name || "Pattern " + pid)
    );
    perfGrid.appendChild(rowLabel);

    for (let scene = 0; scene < 8; scene++) {
      const slot = document.createElement("div");
      slot.className = "perf-slot";
      slot.dataset.patternId = pid;
      slot.dataset.sceneIndex = scene;

      // Slot hat Inhalt, wenn ein Song-Block von diesem Pattern existiert,
      // der zur Scene passt (Scene * stepCount == block.startStep).
      const expectedStart = scene * stepCount;
      const block = song.blocks.find(
        (b) => b.patternId === pid && b.startStep === expectedStart
      );
      if (block) {
        slot.classList.add("has-content");
        const pid = block.patternId;
        const pidSpan = document.createElement("span");
        pidSpan.className = "perf-slot-pid";
        pidSpan.textContent = pid;
        pidSpan.style.color = patternMeta[pid].color;
        slot.appendChild(pidSpan);
        slot.style.background = "rgba(255,255,255,0.05)";
        slot.style.color = "#ccc";
      } else {
        slot.classList.add("empty");
        slot.textContent = "–";
      }

      // Live-Status
      if (
        perfNowPlaying &&
        perfNowPlaying.patternId === pid &&
        perfNowPlaying.sceneIndex === scene
      ) {
        slot.classList.add("playing");
      }
      if (
        perfQueue &&
        perfQueue.patternId === pid &&
        perfQueue.sceneIndex === scene
      ) {
        slot.classList.add("queued");
        slot.textContent = "⏳ " + (slot.textContent === "–" ? "" : "");
      }

      slot.addEventListener("click", () => {
        if (
          perfNowPlaying &&
          perfNowPlaying.patternId === pid &&
          perfNowPlaying.sceneIndex === scene
        ) {
          // Stop wenn bereits spielend
          perfStopPlayback();
          return;
        }
        perfQueue = { patternId: pid, sceneIndex: scene };
        rebuildPerformanceView();
        if (perfQuantize === 0) {
          perfApplyQueue();
        }
      });

      perfGrid.appendChild(slot);
    }
  });

  updatePerfStatus();
}

function updatePerfStatus() {
  const el = document.getElementById("perfNowPlaying");
  if (!el) return;
  if (perfNowPlaying) {
    const meta = patternMeta[perfNowPlaying.patternId];
    el.textContent =
      "▶ " +
      (meta.name || "Pattern " + perfNowPlaying.patternId) +
      " · Scene " +
      (perfNowPlaying.sceneIndex + 1);
    el.style.color = meta.color;
  } else if (perfQueue) {
    const meta = patternMeta[perfQueue.patternId];
    el.textContent =
      "⏳ queued: " + (meta.name || "Pattern " + perfQueue.patternId);
    el.style.color = "#ffb347";
  } else {
    el.textContent = "— idle —";
    el.style.color = "";
  }
}

/* Startet das gequeuete Pattern sofort */
function perfApplyQueue() {
  if (!perfQueue) return;
  const { patternId, sceneIndex } = perfQueue;
  currentPattern = patternId;

  // Song-Playhead an Scene-Anfang setzen (nur im Song-Modus relevant)
  currentSongStep = sceneIndex * stepCount;

  // Playback starten, falls nicht schon läuft
  if (!isPlaying) {
    startPlayback();
  } else {
    scheduleLiveStep(currentSongStep, nextNoteTime);
    nextNoteTime += advance;
    currentSongStep++;
    if (song.loopEnd > song.loopStart && currentSongStep >= song.loopEnd)
      currentSongStep = song.loopStart;
    else if (
      song.loopEnd <= song.loopStart &&
      currentSongStep >= getSongLength()
    )
      currentSongStep = 0;
    /* v19: Performance-Follow-Action & Quantize */
    if (typeof perfTickSongStep === "function")
      perfTickSongStep(currentSongStep);
  }

  perfNowPlaying = { patternId, sceneIndex, startedAt: performance.now() };
  perfQueue = null;
  rebuildRack();
  rebuildPerformanceView();
  toast(
    "▶ " +
      (patternMeta[patternId].name || patternId) +
      " · Scene " +
      (sceneIndex + 1),
    "success"
  );
}

function perfStopPlayback() {
  stopPlayback();
  perfNowPlaying = null;
  perfQueue = null;
  rebuildPerformanceView();
}

/* Wird vom Scheduler aufgerufen, um Queue bei Quantize auszulösen */
function perfTickSongStep(songStep) {
  // Follow-Action: nach N Steps automatisch nächste Scene
  if (perfNowPlaying && perfFollowSteps > 0) {
    const elapsedSteps = songStep - perfNowPlaying.sceneIndex * stepCount;
    if (elapsedSteps > 0 && elapsedSteps % perfFollowSteps === 0) {
      // Nächste Scene queuen
      const nextScene = (perfNowPlaying.sceneIndex + 1) % 8;
      const nextBlock = song.blocks.find(
        (b) =>
          b.patternId === perfNowPlaying.patternId &&
          b.startStep === nextScene * stepCount
      );
      if (nextBlock) {
        perfQueue = {
          patternId: perfNowPlaying.patternId,
          sceneIndex: nextScene,
        };
      }
    }
  }

  // Quantize: Queue anwenden, wenn wir am richtigen Step sind
  if (perfQueue && perfQuantize > 0) {
    if (songStep % perfQuantize === 0) {
      perfApplyQueue();
    }
  }
}

/* Toolbar-Events */
document.addEventListener("DOMContentLoaded", () => {
  const qSel = document.getElementById("perfQuantSel");
  if (qSel)
    qSel.addEventListener("change", () => {
      perfQuantize = parseInt(qSel.value) || 0;
      autoSave();
    });
  const fSel = document.getElementById("perfFollowSel");
  if (fSel)
    fSel.addEventListener("change", () => {
      perfFollowSteps = parseInt(fSel.value) || 0;
      autoSave();
    });
  const bpmEl = document.getElementById("perfBpm");
  if (bpmEl)
    bpmEl.addEventListener("change", () => {
      const v = parseInt(bpmEl.value);
      if (v >= 40 && v <= 300) {
        bpm = v;
        const mainBpm = document.getElementById("bpm");
        if (mainBpm) mainBpm.value = bpm;
        autoSave();
      }
    });
});

/* =========================================================
   v19: BROWSER SIDEBAR
   ========================================================= */
function rebuildBrowser() {
  const list = document.getElementById("browserList");
  const tagsEl = document.getElementById("browserTags");
  if (!list || !tagsEl) return;

  // Tags rendern
  tagsEl.innerHTML = "";
  BROWSER_TAGS.forEach((tag) => {
    const el = document.createElement("div");
    el.className = "browser-tag" + (browserActiveTag === tag ? " active" : "");
    el.textContent = "#" + tag;
    el.addEventListener("click", () => {
      browserActiveTag = browserActiveTag === tag ? null : tag;
      rebuildBrowser();
    });
    tagsEl.appendChild(el);
  });

  // Sample-Liste: alle Tracks mit type='sample' + alle registrierten samples
  const items = [];
  Object.entries(samples).forEach(([trackId, s]) => {
    if (!s || !s.id) return;
    const track = TRACKS.find((t) => t.id === trackId);
    items.push({
      trackId,
      trackName: track ? track.name : trackId,
      name: s.name || "(unnamed)",
      tags: s.tags || [],
      missing: !!s.missing,
      type: "sample",
    });
  });

  // Filter anwenden
  const searchLower = browserSearchText.toLowerCase();
  const filtered = items.filter((it) => {
    if (browserActiveTag && !it.tags.includes(browserActiveTag)) return false;
    if (
      searchLower &&
      !it.name.toLowerCase().includes(searchLower) &&
      !it.trackName.toLowerCase().includes(searchLower)
    )
      return false;
    return true;
  });

  list.innerHTML = "";
  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "browser-empty";
    empty.textContent =
      browserSearchText || browserActiveTag
        ? "Keine Treffer."
        : "Noch keine Samples geladen.";
    list.appendChild(empty);
    return;
  }

  filtered.forEach((it) => {
    const row = document.createElement("div");
    row.className = "browser-item" + (it.missing ? " missing" : " loaded");
    const nameSpan = document.createElement("span");
    nameSpan.className = "bi-name";
    nameSpan.textContent = it.name;
    nameSpan.title = it.name + " → " + it.trackName;
    row.appendChild(nameSpan);
    if (it.tags.length) {
      const tagSpan = document.createElement("span");
      tagSpan.className = "bi-tag";
      tagSpan.textContent = "#" + it.tags[0];
      row.appendChild(tagSpan);
    }
    row.addEventListener("click", () => {
      // Klick: Sample in den Track laden (wenn nicht schon drin) oder Track als Ziel setzen
      const targetTrackId = it.trackId;
      toast("Sample: " + it.name + " · Track: " + it.trackName, "info");
      // Bei Bedarf: Track als aktuellen Sample-Track merken
      showContextMenu(0, 0, []); // dummy um Menü zu schließen
    });
    row.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const track = TRACKS.find((t) => t.id === it.trackId);
      const curTags = it.tags.slice();
      const items = BROWSER_TAGS.map((tag) => ({
        label: "#" + tag + (curTags.includes(tag) ? "  ✓" : ""),
        action: () => {
          const s = samples[it.trackId];
          if (!s) return;
          if (!s.tags) s.tags = [];
          if (s.tags.includes(tag)) s.tags = s.tags.filter((t) => t !== tag);
          else s.tags.push(tag);
          autoSave();
          rebuildBrowser();
        },
      }));
      items.unshift({ header: it.name });
      items.push("---");
      items.push({
        label: "Sample-Track öffnen",
        disabled: !track || !samples[it.trackId] || samples[it.trackId].missing,
        action: () => showSampleEditor(it.trackId),
      });
      items.push({
        label: "Zum Track laden…",
        action: () => importSample(it.trackId),
      });
      showContextMenu(e.clientX, e.clientY, items);
    });
    list.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInp = document.getElementById("browserSearch");
  if (searchInp)
    searchInp.addEventListener("input", () => {
      browserSearchText = searchInp.value || "";
      rebuildBrowser();
    });

  const toggleBtn = document.getElementById("browserToggleBtn");
  const panel = document.getElementById("browserPanel");
  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", () => {
      browserCollapsed = !browserCollapsed;
      panel.classList.toggle("collapsed", browserCollapsed);
      toggleBtn.textContent = browserCollapsed ? "+" : "–";
      toggleBtn.title = browserCollapsed ? "Expand" : "Collapse";
    });
  }
});

/* =========================================================
   v19: PATTERN-PICKER EXTRAS (Clone, Color, Rename)
   ========================================================= */
function showPatternContextMenu(pid, x, y) {
  const items = [
    { header: "Pattern " + pid },
    {
      label: "Clone Pattern",
      action: () => {
        pushHistory();
        // Nächsten freien Slot suchen (A→B→C→D, dann Loop)
        const idx = PATTERN_IDS.indexOf(pid);
        const nextId = PATTERN_IDS[(idx + 1) % PATTERN_IDS.length];
        patterns[nextId] = JSON.parse(JSON.stringify(patterns[pid]));
        // Noten-IDs neu vergeben (um Kollisionen zu vermeiden)
        TRACKS.forEach((t) => {
          if (patterns[nextId].pianoRoll[t.id]) {
            patterns[nextId].pianoRoll[t.id].forEach(
              (n) => (n.id = genId("n"))
            );
          }
        });
        patternMeta[nextId].color = patternMeta[pid].color;
        patternMeta[nextId].name =
          (patternMeta[pid].name || "Pattern " + pid) + " Copy";
        autoSave();
        rebuildRack();
        toast("Cloned " + pid + " → " + nextId, "success");
      },
    },
    "---",
    {
      label: "Rename…",
      action: () => {
        const cur = patternMeta[pid].name || "Pattern " + pid;
        const v = prompt("Pattern-Name:", cur);
        if (v == null) return;
        pushHistory();
        patternMeta[pid].name = v.trim() || "Pattern " + pid;
        autoSave();
        rebuildRack();
      },
    },
    {
      label: "Farbe ändern…",
      action: () => {
        const cols = [
          "#ff8a00",
          "#4ea3ff",
          "#00b894",
          "#fd79a8",
          "#a78bfa",
          "#f7b731",
          "#ff6b6b",
          "#00d2d3",
        ];
        const cur = patternMeta[pid].color;
        const list = cols.map((c) => ({
          label: "■ " + c + (c === cur ? "  ✓" : ""),
          action: () => {
            pushHistory();
            patternMeta[pid].color = c;
            autoSave();
            rebuildRack();
            rebuildSong();
          },
        }));
        showContextMenu(x + 180, y, list);
      },
    },
    "---",
    {
      label: "Split by Channel…",
      action: () => {
        pushHistory();
        // Für jeden Track mit Inhalt ein neues Pattern erzeugen
        let created = 0;
        TRACKS.forEach((t) => {
          const hasContent =
            t.type === "melodic" || t.type === "sample"
              ? (patterns[pid].pianoRoll[t.id] || []).length > 0
              : patterns[pid].steps[t.id].some((v) => v);
          if (!hasContent) return;
          // Freien Slot finden
          const free = PATTERN_IDS.find((pid2) => {
            const p = patterns[pid2];
            return TRACKS.every((tt) => {
              if (tt.type === "melodic" || tt.type === "sample")
                return (p.pianoRoll[tt.id] || []).length === 0;
              return p.steps[tt.id].every((v) => !v);
            });
          });
          if (!free) return;
          // Kopiere nur diesen Track
          patterns[free] = createEmptyPattern();
          if (t.type === "melodic" || t.type === "sample") {
            patterns[free].pianoRoll[t.id] = JSON.parse(
              JSON.stringify(patterns[pid].pianoRoll[t.id])
            );
          } else {
            patterns[free].steps[t.id] = JSON.parse(
              JSON.stringify(patterns[pid].steps[t.id])
            );
          }
          if (t.type === "melodic") syncMelodicSteps(patterns[free]);
          patternMeta[free].color = patternMeta[pid].color;
          patternMeta[free].name =
            (patternMeta[pid].name || "Pattern " + pid) + " · " + t.name;
          created++;
        });
        autoSave();
        rebuildRack();
        toast(created + " Pattern(s) erstellt (Split by Channel)", "success");
      },
    },
  ];
  showContextMenu(x, y, items);
}

/* Event-Handler an Pattern-Buttons hängen (in rebuildRack ergänzen) */
/* =========================================================
   v19: CONTROLLER-LINKING
   ========================================================= */
function openLinkDialog(laneId) {
  const lane = automation.lanes.find((l) => l.id === laneId);
  if (!lane) return;
  const targets = getAutoTargets();

  const wrap = document.createElement("div");
  wrap.style.cssText =
    "display:flex;flex-direction:column;gap:8px;max-height:60vh;";

  const info = document.createElement("div");
  info.style.cssText = "font-size:11px;color:var(--muted);line-height:1.5;";
  info.textContent =
    "Diese Automation-Lane (" +
    lane.target +
    ") kann zusätzlich weitere Ziele steuern. Wähle die Ziele aus, die gleichzeitig mit der Lane-Hüllkurve moduliert werden sollen.";
  wrap.appendChild(info);

  const searchInp = document.createElement("input");
  searchInp.type = "text";
  searchInp.placeholder = "Filter…";
  searchInp.style.cssText =
    "background:#111;color:#ddd;border:1px solid #000;border-radius:4px;padding:6px 8px;font-size:12px;";
  wrap.appendChild(searchInp);

  const listWrap = document.createElement("div");
  listWrap.style.cssText =
    "display:flex;flex-direction:column;gap:4px;overflow-y:auto;max-height:50vh;";
  wrap.appendChild(listWrap);

  const render = () => {
    listWrap.innerHTML = "";
    const search = (searchInp.value || "").toLowerCase();
    targets.forEach((t) => {
      if (t.id === lane.target) return; // sich selbst nicht verlinken
      if (search && !t.label.toLowerCase().includes(search)) return;
      const isLinked = controllerLinks.some(
        (l) => l.laneId === laneId && l.targetId === t.id
      );
      const row = document.createElement("div");
      row.style.cssText =
        "display:flex;align-items:center;gap:8px;padding:6px 10px;background:#1c1c1c;border:1px solid #333;border-radius:3px;font-size:11px;cursor:pointer;";
      if (isLinked) {
        row.style.background = "rgba(255,138,0,0.15)";
        row.style.borderColor = "var(--accent)";
      }
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = isLinked;
      cb.addEventListener("change", () => {
        if (cb.checked) {
          if (
            !controllerLinks.some(
              (l) => l.laneId === laneId && l.targetId === t.id
            )
          ) {
            controllerLinks.push({ id: genId("link"), laneId, targetId: t.id });
          }
        } else {
          controllerLinks = controllerLinks.filter(
            (l) => !(l.laneId === laneId && l.targetId === t.id)
          );
        }
        autoSave();
        render();
      });
      const lbl = document.createElement("span");
      lbl.textContent = t.label;
      lbl.style.flex = "1";
      row.appendChild(cb);
      row.appendChild(lbl);
      row.addEventListener("click", (e) => {
        if (e.target === cb) return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event("change"));
      });
      listWrap.appendChild(row);
    });
  };
  render();
  searchInp.addEventListener("input", render);

  showModal("🔗 Link to Controller", wrap, [
    { label: "Close", onClick: hideModal },
  ]);
}
