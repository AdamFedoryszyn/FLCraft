let isPlaying = false,
  currentStep = 0,
  nextNoteTime = 0,
  timerId = null;
const LOOKAHEAD = 25,
  SCHEDULE_AHEAD = 0.1;
function getStepDuration() {
  return 60 / bpm / 4;
}

/* =========================================================
   MIDI helpers (encodeVarLen / exportMidi / parseMidi / importMidiFile)
   ========================================================= */
function encodeVarLen(value) {
  const bytes = [value & 0x7f];
  value >>= 7;
  while (value > 0) {
    bytes.unshift((value & 0x7f) | 0x80);
    value >>= 7;
  }
  return bytes;
}

function exportMidi() {
  try {
    const ticksPerBeat = 480;
    const ticksPerStep = ticksPerBeat / 4;

    // Header chunk
    const header = [
      0x4d,
      0x54,
      0x68,
      0x64,
      0,
      0,
      0,
      6,
      0,
      1,
      0,
      1,
      (ticksPerBeat >> 8) & 0xff,
      ticksPerBeat & 0xff,
    ];

    const metaEvents = [];
    const usPerBeat = Math.round(60000000 / bpm);
    metaEvents.push({
      tick: 0,
      data: [
        0xff,
        0x51,
        0x03,
        (usPerBeat >> 16) & 0xff,
        (usPerBeat >> 8) & 0xff,
        usPerBeat & 0xff,
      ],
      priority: 0,
    });
    metaEvents.push({
      tick: 0,
      data: [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08],
      priority: 0,
    });

    const nameStr =
      "FL Clone - " +
      (playMode === "pattern" ? "Pattern " + currentPattern : "Song");
    const nameBytes = [];
    for (let i = 0; i < nameStr.length; i++)
      nameBytes.push(nameStr.charCodeAt(i) & 0x7f);
    metaEvents.push({
      tick: 0,
      data: [0xff, 0x03, nameBytes.length, ...nameBytes],
      priority: 0,
    });

    const noteEvents = [];
    const drumMap = {
      kick: 36,
      snare: 38,
      hat: 42,
      openhat: 46,
      clap: 39,
      tom: 45,
    };

    const pushNote = (absTick, midi, vel, durTicks, channel) => {
      noteEvents.push({
        tick: absTick,
        data: [0x90 | channel, midi & 0x7f, vel & 0x7f],
        priority: 1,
      });
      noteEvents.push({
        tick: absTick + durTicks,
        data: [0x80 | channel, midi & 0x7f, 0],
        priority: 0,
      });
    };

    if (playMode === "pattern") {
      TRACKS.filter((t) => t.type === "melodic").forEach((track, idx) => {
        const notes = patterns[currentPattern].pianoRoll[track.id] || [];
        notes.forEach((n) => {
          pushNote(
            Math.round(n.start * ticksPerStep),
            n.midi,
            n.vel || 100,
            Math.round((n.len || 1) * ticksPerStep),
            idx % 16
          );
        });
      });
      TRACKS.filter((t) => t.type === "drum").forEach((track) => {
        const pat = patterns[currentPattern];
        for (let i = 0; i < stepCount; i++) {
          const sd = getStepData(pat, track.id, i);
          if (sd && sd.on) {
            const absTick = Math.round(i * ticksPerStep);
            const drumNote = drumMap[track.instr] || 38;
            noteEvents.push({
              tick: absTick,
              data: [0x99, drumNote & 0x7f, (sd.vel || 100) & 0x7f],
              priority: 1,
            });
            noteEvents.push({
              tick: absTick + Math.round(ticksPerStep / 2),
              data: [0x89, drumNote & 0x7f, 0],
              priority: 0,
            });
          }
        }
      });
    } else {
      song.blocks.forEach((block) => {
        const pat = patterns[block.patternId];
        if (!pat) return;
        TRACKS.filter((t) => t.type === "melodic").forEach((track, idx) => {
          const notes = pat.pianoRoll[track.id] || [];
          notes.forEach((n) => {
            const rel =
              (n.start - (block.sourceOffsetSteps || 0) + stepCount) %
              stepCount;
            if (rel < block.lengthSteps) {
              const absStep = block.startStep + rel;
              pushNote(
                Math.round(absStep * ticksPerStep),
                n.midi,
                n.vel || 100,
                Math.round((n.len || 1) * ticksPerStep),
                idx % 16
              );
            }
          });
        });
        TRACKS.filter((t) => t.type === "drum").forEach((track) => {
          for (let i = 0; i < stepCount; i++) {
            const sd = getStepData(pat, track.id, i);
            if (sd && sd.on) {
              const rel =
                (i - (block.sourceOffsetSteps || 0) + stepCount) % stepCount;
              if (rel < block.lengthSteps) {
                const absStep = block.startStep + rel;
                const absTick = Math.round(absStep * ticksPerStep);
                const drumNote = drumMap[track.instr] || 38;
                noteEvents.push({
                  tick: absTick,
                  data: [0x99, drumNote & 0x7f, (sd.vel || 100) & 0x7f],
                  priority: 1,
                });
                noteEvents.push({
                  tick: absTick + Math.round(ticksPerStep / 2),
                  data: [0x89, drumNote & 0x7f, 0],
                  priority: 0,
                });
              }
            }
          }
        });
      });
    }

    const all = [...metaEvents, ...noteEvents];
    all.sort((a, b) => a.tick - b.tick || a.priority - b.priority);

    const lastTick = all.length ? all[all.length - 1].tick : 0;
    all.push({ tick: lastTick, data: [0xff, 0x2f, 0x00], priority: 2 });

    const trackBytes = [];
    let prevTick = 0;
    all.forEach((ev) => {
      const delta = ev.tick - prevTick;
      prevTick = ev.tick;
      trackBytes.push(...encodeVarLen(delta), ...ev.data);
    });

    const trackLen = trackBytes.length;
    const trkHeader = [
      0x4d,
      0x54,
      0x72,
      0x6b,
      (trackLen >> 24) & 0xff,
      (trackLen >> 16) & 0xff,
      (trackLen >> 8) & 0xff,
      trackLen & 0xff,
    ];

    const full = new Uint8Array([...header, ...trkHeader, ...trackBytes]);
    const blob = new Blob([full], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flclone-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:.]/g, "-")}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    toast("MIDI exported", "success");
  } catch (err) {
    toast("MIDI export failed: " + err.message, "error");
  }
}

function parseMidi(bytes) {
  let pos = 0;
  const readStr = (n) => {
    let s = "";
    for (let i = 0; i < n; i++) s += String.fromCharCode(bytes[pos++]);
    return s;
  };
  const readU32 = () => {
    const v =
      ((bytes[pos] << 24) |
        (bytes[pos + 1] << 16) |
        (bytes[pos + 2] << 8) |
        bytes[pos + 3]) >>>
      0;
    pos += 4;
    return v;
  };
  const readU16 = () => {
    const v = (bytes[pos] << 8) | bytes[pos + 1];
    pos += 2;
    return v;
  };
  const readU8 = () => bytes[pos++];
  const readVarLen = () => {
    let v = 0,
      b;
    do {
      b = readU8();
      v = (v << 7) | (b & 0x7f);
    } while (b & 0x80);
    return v;
  };

  if (bytes.length < 14 || readStr(4) !== "MThd") return null;
  const headerLen = readU32();
  readU16(); // format
  const ntrks = readU16();
  const division = readU16();
  pos += Math.max(0, headerLen - 6);

  const ticksPerBeat = division & 0x8000 ? 480 : division;

  let bpm = null;
  const notes = [];

  for (let trk = 0; trk < ntrks; trk++) {
    if (pos + 8 > bytes.length) break;
    if (readStr(4) !== "MTrk") break;
    const trkLen = readU32();
    const trkEnd = Math.min(pos + trkLen, bytes.length);
    let absoluteTicks = 0;
    let runningStatus = 0;
    const pendingNotes = {};

    while (pos < trkEnd) {
      const delta = readVarLen();
      absoluteTicks += delta;

      let status = readU8();
      if (!(status & 0x80)) {
        pos--;
        status = runningStatus;
        if (status === 0) {
          pos = trkEnd;
          break;
        }
      } else {
        runningStatus = status;
      }

      if (status === 0xff) {
        const metaType = readU8();
        const metaLen = readVarLen();
        if (metaType === 0x51 && metaLen === 3) {
          const usPerBeat = (readU8() << 16) | (readU8() << 8) | readU8();
          bpm = Math.round(60000000 / usPerBeat);
        } else {
          pos += metaLen;
        }
      } else if (status === 0xf0 || status === 0xf7) {
        const len = readVarLen();
        pos += len;
      } else {
        const type = status & 0xf0;
        if (type === 0x90) {
          const midi = readU8();
          const vel = readU8();
          if (vel > 0) {
            pendingNotes[midi] = { tick: absoluteTicks, velocity: vel };
          } else if (pendingNotes[midi]) {
            notes.push({
              midi,
              tick: pendingNotes[midi].tick,
              duration: absoluteTicks - pendingNotes[midi].tick,
              velocity: pendingNotes[midi].velocity,
            });
            delete pendingNotes[midi];
          }
        } else if (type === 0x80) {
          const midi = readU8();
          readU8();
          if (pendingNotes[midi]) {
            notes.push({
              midi,
              tick: pendingNotes[midi].tick,
              duration: absoluteTicks - pendingNotes[midi].tick,
              velocity: pendingNotes[midi].velocity,
            });
            delete pendingNotes[midi];
          }
        } else if (type === 0xc0 || type === 0xd0) {
          pos += 1;
        } else {
          pos += 2;
        }
      }
    }

    Object.keys(pendingNotes).forEach((mk) => {
      notes.push({
        midi: parseInt(mk),
        tick: pendingNotes[mk].tick,
        duration: Math.round(ticksPerBeat / 2),
        velocity: pendingNotes[mk].velocity,
      });
    });

    pos = trkEnd;
  }

  return { bpm, ticksPerBeat, notes };
}

async function importMidiFile(file) {
  try {
    const ab = await file.arrayBuffer();
    const bytes = new Uint8Array(ab);
    const parsed = parseMidi(bytes);
    if (!parsed) {
      toast("Invalid MIDI file", "error");
      return;
    }

    const targetTrackId = (prEditor && prEditor.trackId) || "piano";
    const targetTrack = TRACKS.find((t) => t.id === targetTrackId);
    if (!targetTrack || targetTrack.type !== "melodic") {
      toast("No melodic track available for MIDI import", "error");
      return;
    }

    if (parsed.bpm && parsed.bpm >= 40 && parsed.bpm <= 300) {
      bpm = parsed.bpm;
      document.getElementById("bpm").value = bpm;
    }

    const ticksPerStep = (parsed.ticksPerBeat || 480) / 4;
    const notes = parsed.notes.map((n) => ({
      id: genId("n"),
      start: Math.max(0, Math.min(stepCount - 0.25, n.tick / ticksPerStep)),
      len: Math.max(
        0.25,
        Math.min(stepCount, (n.duration || ticksPerStep) / ticksPerStep)
      ),
      midi: Math.max(
        targetTrack.range[0],
        Math.min(targetTrack.range[1], n.midi)
      ),
      vel: Math.max(1, Math.min(127, n.velocity || 100)),
    }));

    if (!notes.length) {
      toast("No notes found in MIDI", "error");
      return;
    }

    pushHistory();
    patterns[currentPattern].pianoRoll[targetTrackId].push(...notes);
    syncMelodicSteps(patterns[currentPattern]);

    if (prEditor && prEditor.trackId === targetTrackId) {
      redrawNotes();
    } else {
      openPianoRoll(targetTrackId);
    }

    autoSave();
    toast(`Imported ${notes.length} notes into ${targetTrack.name}`, "success");
  } catch (err) {
    toast("MIDI import failed: " + err.message, "error");
  }
}

/* =========================================================
   Live scheduling (Metronome now independent of track mute/solo)
   ========================================================= */
function scheduleLiveStep(step, time) {
  const stepDur = getStepDuration();
  const audible = (t) => (!soloActive || t.solo) && !t.mute;

  // Metronome fires once per step, independent of any track's mute state
  if (metronomeOn && metroGain && step % 4 === 0) {
    playMetronomeTick(ctx, metroGain, time, step % 16 === 0);
  }

  if (playMode === "pattern") {
    TRACKS.forEach((track) => {
      if (!audible(track)) return;
      scheduleTrackStep(
        ctx,
        buses,
        track,
        currentPattern,
        step % stepCount,
        time,
        stepDur,
        step,
        null
      );
    });
  } else {
    applyAutomationForStep(
      { master: masterGain, buses, _fxMaps: buses._fxMaps },
      step,
      time,
      stepDur
    );
    song.blocks.forEach((block) => {
      if (step < block.startStep || step >= block.startStep + block.lengthSteps)
        return;
      const localStep =
        (step - block.startStep + (block.sourceOffsetSteps || 0)) % stepCount;
      TRACKS.forEach((track) => {
        if (!audible(track)) return;
        scheduleTrackStep(
          ctx,
          buses,
          track,
          block.patternId,
          localStep,
          time,
          stepDur,
          step,
          null
        );
      });
    });
  }
  const delay = Math.max(0, (time - ctx.currentTime) * 1000);
  setTimeout(() => uiTick(step), delay);
}

function uiTick(step) {
  if (playMode === "pattern") {
    const local = step % stepCount;
    TRACKS.forEach((track) => {
      const arr = stepEls[track.id];
      if (arr)
        for (let i = 0; i < arr.length; i++)
          arr[i].classList.toggle("playing", i === local);
    });
    if (prEditor) updatePRPlayhead(local);

    if (metronomeOn) {
      const beatIdx = Math.floor(local / 4) % 4;
      const metroBtn = document.getElementById("metroBtn");
      if (metroBtn) {
        metroBtn.style.color = beatIdx === 0 ? "#fff" : "var(--accent)";
        setTimeout(() => {
          metroBtn.style.color = "";
        }, 100);
      }
    }
  } else {
    updateSongPositionDisplay(step);
    updateSongPlayhead();
    updateAutoPlayhead(step);
  }
}

function scheduler() {
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
    const S = getStepDuration();
    let advance = S;
    if (swing > 0 && playMode === "pattern")
      advance += ((currentStep % 2 === 0 ? 1 : -1) * S * swing) / 3;
    if (playMode === "pattern") {
      scheduleLiveStep(currentStep, nextNoteTime);
      nextNoteTime += advance;
      currentStep = (currentStep + 1) % stepCount;
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
    }
  }
  timerId = setTimeout(scheduler, LOOKAHEAD);
}

function startPlayback() {
  initAudio();
  if (ctx.state === "suspended") ctx.resume();
  if (isPlaying) return;
  isPlaying = true;
  if (playMode === "pattern") currentStep = 0;
  else if (currentSongStep >= getSongLength()) currentSongStep = 0;
  nextNoteTime = ctx.currentTime + 0.05;
  scheduler();
}

function stopPlayback() {
  isPlaying = false;
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  TRACKS.forEach((track) => {
    if (stepEls[track.id])
      stepEls[track.id].forEach((el) => el.classList.remove("playing"));
    const led = ledEls[track.id];
    if (led) {
      led.style.background = "#333";
      led.style.boxShadow = "none";
    }
    const ml = ledEls["mix_" + track.id];
    if (ml) {
      ml.style.background = "#333";
      ml.style.boxShadow = "none";
    }
  });
  const metroBtn = document.getElementById("metroBtn");
  if (metroBtn) metroBtn.style.color = "";
}

function setPlayMode(mode) {
  playMode = mode;
  document
    .getElementById("modePatternBtn")
    .classList.toggle("active", mode === "pattern");
  document
    .getElementById("modeSongBtn")
    .classList.toggle("active", mode === "song");
  document
    .querySelectorAll(".pattern")
    .forEach((b) => (b.style.opacity = mode === "pattern" ? "" : "0.5"));
  document
    .querySelectorAll(".step-count")
    .forEach((b) => (b.style.opacity = mode === "pattern" ? "" : "0.5"));
  updateSongPositionDisplay(mode === "song" ? currentSongStep : 0);
}

const rackView = document.getElementById("rackView");
const songView = document.getElementById("songView");
const autoView = document.getElementById("autoView");
function setView(v) {
  currentView = v;
  const all = {
    rack: rackView,
    mixer: mixerView,
    song: songView,
    auto: autoView,
    perf: document.getElementById("perfView"),
  };
  Object.entries(all).forEach(([k, el]) => {
    if (el) el.classList.toggle("hidden", k !== v);
  });
  document
    .getElementById("viewRackBtn")
    .classList.toggle("active", v === "rack");
  document
    .getElementById("viewMixerBtn")
    .classList.toggle("active", v === "mixer");
  document
    .getElementById("viewSongBtn")
    .classList.toggle("active", v === "song");
  document
    .getElementById("viewAutoBtn")
    .classList.toggle("active", v === "auto");
  const perfBtn = document.getElementById("viewPerfBtn");
  if (perfBtn) perfBtn.classList.toggle("active", v === "perf");
  if (v === "song") rebuildSong();
  if (v === "auto") rebuildAutoView();
  if (v === "rack") {
    updateStepSelectionVisual();
    rebuildBrowser();
  }
  if (v === "perf") rebuildPerformanceView();
}

/* ---------- Events ---------- */
document.getElementById("playBtn").addEventListener("click", startPlayback);
document.getElementById("stopBtn").addEventListener("click", stopPlayback);

document.getElementById("metroBtn").addEventListener("click", () => {
  metronomeOn = !metronomeOn;
  document.getElementById("metroBtn").classList.toggle("active", metronomeOn);
  if (metroGain) metroGain.gain.value = metronomeOn ? metronomeVol : 0;
  autoSave();
});

let tapTimes = [];
document.getElementById("tapBtn").addEventListener("click", () => {
  const now = performance.now();
  tapTimes.push(now);
  if (tapTimes.length > 5) tapTimes.shift();
  if (tapTimes.length >= 2) {
    const diffs = [];
    for (let i = 1; i < tapTimes.length; i++)
      diffs.push(tapTimes[i] - tapTimes[i - 1]);
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const newBpm = Math.round(60000 / avg);
    if (newBpm >= 40 && newBpm <= 300) {
      bpm = newBpm;
      document.getElementById("bpm").value = bpm;
      autoSave();
    }
  }
});

document.getElementById("bpm").addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);
  if (!isNaN(v) && v >= 40 && v <= 300) {
    bpm = v;
    autoSave();
  }
});
document.getElementById("swing").addEventListener("input", (e) => {
  swing = parseInt(e.target.value) / 100;
  document.getElementById("swingVal").textContent =
    Math.round(swing * 100) + "%";
  autoSave();
});
document.getElementById("humanize").addEventListener("input", (e) => {
  humanizeTiming = parseInt(e.target.value) / 100;
  document.getElementById("humVal").textContent = e.target.value + "%";
  autoSave();
});
document.getElementById("humanizeV").addEventListener("input", (e) => {
  humanizeVelocity = parseInt(e.target.value) / 100;
  document.getElementById("humVVal").textContent = e.target.value + "%";
  autoSave();
});
document.getElementById("master").addEventListener("input", (e) => {
  master = parseFloat(e.target.value);
  if (masterGain) masterGain.gain.value = master;
  const mF = document.querySelector(".master-strip .fader");
  if (mF) mF.value = master;
  autoSave();
});
document.getElementById("reverbAmount").addEventListener("input", (e) => {
  reverbAmount = parseFloat(e.target.value);
  if (reverbReturn) reverbReturn.gain.value = reverbAmount;
  autoSave();
});

document.getElementById("genBeatBtn").addEventListener("click", generateBeat);

// MIDI
document.getElementById("midiExportBtn").addEventListener("click", exportMidi);
document.getElementById("midiImportBtn").addEventListener("click", () => {
  document.getElementById("midiFileInput").click();
});
document.getElementById("midiFileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) importMidiFile(file);
  e.target.value = "";
});

document.querySelectorAll(".step-count").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (playMode !== "pattern") return;
    stepCount = parseInt(btn.dataset.count);
    if (prEditor) closePianoRoll();
    rebuildRack();
    autoSave();
  })
);

document.querySelectorAll(".pattern").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (playMode !== "pattern") return;
    const id = btn.dataset.pattern;
    if (id === currentPattern) return;
    currentPattern = id;
    if (prEditor) closePianoRoll();
    clearStepSelection();
    rebuildRack();
    toast("Pattern " + id);
    autoSave();
  })
);

document
  .getElementById("modePatternBtn")
  .addEventListener("click", () => setPlayMode("pattern"));
document
  .getElementById("modeSongBtn")
  .addEventListener("click", () => setPlayMode("song"));
document
  .getElementById("viewRackBtn")
  .addEventListener("click", () => setView("rack"));
document
  .getElementById("viewMixerBtn")
  .addEventListener("click", () => setView("mixer"));
document
  .getElementById("viewSongBtn")
  .addEventListener("click", () => setView("song"));
document
  .getElementById("viewAutoBtn")
  .addEventListener("click", () => setView("auto"));
const viewPerfBtn = document.getElementById("viewPerfBtn");
if (viewPerfBtn) viewPerfBtn.addEventListener("click", () => setView("perf"));
document
  .getElementById("historyBtn")
  .addEventListener("click", showUndoHistory);
document.getElementById("saveBtn").addEventListener("click", showSaveModal);
document.getElementById("loadBtn").addEventListener("click", showLoadModal);
document.getElementById("exportBtn").addEventListener("click", showExportModal);

document.getElementById("songAddClipBtn").addEventListener("click", () => {
  pushHistory();
  const block = {
    id: genId("block"),
    patternId: currentPattern,
    startStep: Math.max(0, currentSongStep),
    lengthSteps: stepCount,
    sourceOffsetSteps: 0,
  };
  song.blocks.push(block);
  songSelectedIds = new Set([block.id]);
  rebuildSong();
  autoSave();
  toast("Pattern block added", "success");
});
document
  .getElementById("songDupBtn")
  .addEventListener("click", duplicateSelectedClips);
document
  .getElementById("songDelBtn")
  .addEventListener("click", deleteSelectedClips);
document.getElementById("loopSetBtn").addEventListener("click", () => {
  const a = Math.max(
    0,
    parseInt(document.getElementById("loopStart").value) || 0
  );
  const b = Math.max(
    0,
    parseInt(document.getElementById("loopEnd").value) || 0
  );
  if (b <= a) {
    toast("Loop end must be > start", "error");
    return;
  }
  song.loopStart = a;
  song.loopEnd = b;
  rebuildSong();
  rebuildAutoView();
  autoSave();
  toast(`Loop ${a}–${b}`, "success");
});
document.getElementById("loopClearBtn").addEventListener("click", () => {
  song.loopStart = 0;
  song.loopEnd = 0;
  document.getElementById("loopStart").value = 0;
  document.getElementById("loopEnd").value = 64;
  rebuildSong();
  rebuildAutoView();
  autoSave();
});
document.getElementById("autoAddLaneBtn").addEventListener("click", () => {
  const tid = document.getElementById("autoTargetSel").value;
  if (automation.lanes.some((l) => l.target === tid)) {
    toast("Target already has a lane", "error");
    return;
  }
  const lane = createAutoLane(tid);
  if (!lane) return;
  pushHistory();
  automation.lanes.push(lane);
  selectedAutoLaneId = lane.id;
  rebuildAutoView();
  autoSave();
  toast("Lane added", "success");
});
document.getElementById("autoDelLaneBtn").addEventListener("click", () => {
  if (!selectedAutoLaneId) {
    toast("No lane selected", "error");
    return;
  }
  if (!confirm("Delete this automation lane?")) return;
  pushHistory();
  automation.lanes = automation.lanes.filter(
    (l) => l.id !== selectedAutoLaneId
  );
  selectedAutoLaneId = null;
  rebuildAutoView();
  autoSave();
});
document.getElementById("autoCurveSel").addEventListener("change", (e) => {
  if (!selectedAutoLaneId) return;
  const lane = automation.lanes.find((l) => l.id === selectedAutoLaneId);
  if (!lane) return;
  pushHistory();
  lane.curve = e.target.value;
  rebuildAutoView();
  autoSave();
});

let clearArmed = false,
  clearTimer = null;
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  if (!clearArmed) {
    clearArmed = true;
    clearBtn.classList.add("armed");
    clearBtn.textContent = "⚠";
    clearTimer = setTimeout(() => {
      clearArmed = false;
      clearBtn.classList.remove("armed");
      clearBtn.textContent = "✖";
    }, 3000);
    return;
  }
  clearTimeout(clearTimer);
  clearArmed = false;
  clearBtn.classList.remove("armed");
  clearBtn.textContent = "✖";
  pushHistory();
  patterns[currentPattern] = createEmptyPattern();
  if (prEditor) closePianoRoll();
  clearStepSelection();
  rebuildRack();
  autoSave();
  toast("Pattern " + currentPattern + " cleared", "success");
});

document.addEventListener("keydown", (e) => {
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.tagName === "SELECT"
  )
    return;
  const ctrl = e.ctrlKey || e.metaKey;
  if (prEditor) {
    if (ctrl && e.key.toLowerCase() === "z") {
      e.preventDefault();
      performUndo();
      return;
    }
    if (
      ctrl &&
      (e.key.toLowerCase() === "y" ||
        (e.shiftKey && e.key.toLowerCase() === "z"))
    ) {
      e.preventDefault();
      performRedo();
      return;
    }
    if (ctrl && e.key.toLowerCase() === "c") {
      e.preventDefault();
      copySelected();
      return;
    }
    if (ctrl && e.key.toLowerCase() === "v") {
      e.preventDefault();
      pasteClipboard();
      return;
    }
    if (ctrl && e.key.toLowerCase() === "d") {
      e.preventDefault();
      duplicateSelected();
      return;
    }
    if (ctrl && e.key.toLowerCase() === "a") {
      e.preventDefault();
      prEditor.selectedIds = new Set(
        patterns[currentPattern].pianoRoll[prEditor.trackId].map((n) => n.id)
      );
      updateSelectionVisual();
      return;
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      deleteSelected();
      return;
    }
    if (e.code === "Escape") {
      e.preventDefault();
      // Priority 1: Context menu offen → nur Menü schließen
      if (document.querySelector(".ctx-menu")) {
        hideContextMenu();
        return;
      }
      // Priority 2: sonst Selektion aufheben
      prEditor.selectedIds.clear();
      updateSelectionVisual();
      return;
    }
    return;
  }
  if (ctrl && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undoHistory();
    return;
  }
  if (
    ctrl &&
    (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
  ) {
    e.preventDefault();
    redoHistory();
    return;
  }
  if (ctrl && e.key.toLowerCase() === "h") {
    e.preventDefault();
    showUndoHistory();
    return;
  }
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying ? stopPlayback() : startPlayback();
  }
  if (e.code === "Escape") {
    if (!modalOverlay.classList.contains("hidden")) {
      // Nutze den modalen Close-Handler (falls gesetzt), sonst hideModal()
      try {
        if (typeof modalOverlay._closeHandler === "function") {
          modalOverlay._closeHandler();
        } else {
          hideModal();
        }
      } catch (err) {
        try {
          hideModal();
        } catch (_) {}
      }
    }
    hideContextMenu();
    closeStepEditor();
    clearClipSelection();
    clearStepSelection();
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    if (currentView === "song" && songSelectedIds.size) {
      e.preventDefault();
      deleteSelectedClips();
      return;
    }
    if (currentView === "rack" && stepSelectedKeys.size) {
      e.preventDefault();
      deleteSelectedSteps();
      return;
    }
  }
  if (e.key >= "1" && e.key <= "4" && playMode === "pattern") {
    const id = PATTERN_IDS[parseInt(e.key) - 1];
    if (id && id !== currentPattern) {
      currentPattern = id;
      clearStepSelection();
      rebuildRack();
      toast("Pattern " + id);
      autoSave();
    }
  }
  if (e.key === "m" || e.key === "M") setView("mixer");
  if (e.key === "r" || e.key === "R") setView("rack");
  if (e.key === "s" && !e.shiftKey) setView("song");
  if (e.key === "a" || e.key === "A") setView("auto");
  if (e.key === "S" && e.shiftKey)
    setPlayMode(playMode === "song" ? "pattern" : "song");
});

prOverlay.addEventListener("click", (e) => {
  if (e.target === prOverlay) closePianoRoll();
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) hideModal();
});
window.addEventListener("error", (ev) => {
  try {
    toast("Error: " + (ev.message || "?"), "error");
  } catch (e) {}
});

/* ---------- Init ---------- */
(async function init() {
  try {
    await openDB();
  } catch (e) {
    console.warn("IndexedDB unavailable", e);
  }
  initDefaultPatterns();
  document.getElementById("bpm").value = bpm;
  document.getElementById("humanize").value = Math.round(humanizeTiming * 100);
  document.getElementById("humVal").textContent =
    Math.round(humanizeTiming * 100) + "%";
  document.getElementById("humanizeV").value = Math.round(
    humanizeVelocity * 100
  );
  document.getElementById("humVVal").textContent =
    Math.round(humanizeVelocity * 100) + "%";
  document.getElementById("loopStart").value = 0;
  document.getElementById("loopEnd").value = 64;

  const loaded = await tryLoadAutoSave();
  if (!loaded) {
    rebuildRack();
    rebuildMixer();
    rebuildSong();
    rebuildAutoView();
    setPlayMode("pattern");
    initHistory();
  } else {
    toast("Last state restored", "info");
    await restoreSamplesFromDB();
  }

  /* v19: Browser initial befüllen */
  try {
    rebuildBrowser();
  } catch (e) {
    console.warn("Browser init failed:", e);
  }

  document.getElementById("metroBtn").classList.toggle("active", metronomeOn);
  if (ctx && metroGain) metroGain.gain.value = metronomeOn ? metronomeVol : 0;
})();
