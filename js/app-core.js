/* =========================================================
   FL Clone v17.0 – Core (FIXED / COMPLETE)
   ========================================================= */

const TRACKS = [
  /* ── Drums ── */
  { id: "kick", name: "Kick", color: "#ff8a00", type: "drum", instr: "kick" },
  {
    id: "snare",
    name: "Snare",
    color: "#ffb347",
    type: "drum",
    instr: "snare",
  },
  { id: "hat", name: "Hat", color: "#ffd47a", type: "drum", instr: "hat" },
  {
    id: "openhat",
    name: "OpenHat",
    color: "#e0b040",
    type: "drum",
    instr: "openhat",
  },
  { id: "clap", name: "Clap", color: "#ff6b6b", type: "drum", instr: "clap" },
  { id: "tom", name: "Tom", color: "#ff9f43", type: "drum", instr: "tom" },

  /* ── Melodic (v17) ── */
  {
    id: "bass",
    name: "Bass",
    color: "#4ecdc4",
    type: "melodic",
    instr: "bass",
    range: [24, 48],
    synth: { a: 0.01, d: 0.1, s: 0.6, r: 0.2, cutoff: 2000, q: 1 },
  },
  {
    id: "lead",
    name: "Lead",
    color: "#a78bfa",
    type: "melodic",
    instr: "lead",
    range: [48, 72],
    synth: { a: 0.01, d: 0.2, s: 0.4, r: 0.1, cutoff: 4000, q: 2 },
  },
  {
    id: "piano",
    name: "Piano",
    color: "#f7b731",
    type: "melodic",
    instr: "piano",
    range: [48, 84],
    synth: { a: 0.01, d: 0.5, s: 0.2, r: 0.5, cutoff: 8000, q: 1 },
  },
  {
    id: "pad",
    name: "Pad",
    color: "#6c5ce7",
    type: "melodic",
    instr: "pad",
    range: [48, 84],
    synth: { a: 0.4, d: 0.5, s: 0.8, r: 1.0, cutoff: 1500, q: 1 },
  },
  {
    id: "pluck",
    name: "Pluck",
    color: "#00b894",
    type: "melodic",
    instr: "pluck",
    range: [48, 84],
    synth: { a: 0.01, d: 0.15, s: 0.0, r: 0.1, cutoff: 5000, q: 1 },
  },
  {
    id: "arp",
    name: "Arp",
    color: "#fd79a8",
    type: "melodic",
    instr: "arp",
    range: [60, 84],
    synth: { a: 0.01, d: 0.1, s: 0.1, r: 0.05, cutoff: 3000, q: 3 },
  },
  {
    id: "guitar",
    name: "Guitar",
    color: "#e67e22",
    type: "melodic",
    instr: "guitar",
    range: [40, 88],
    synth: { a: 0.005, d: 0.3, s: 0.2, r: 0.3, cutoff: 4000, q: 1 },
  },

  /* ── Melodic (v18 – neu) ── */
  {
    id: "organ",
    name: "Organ",
    color: "#d4a373",
    type: "melodic",
    instr: "organ",
    range: [36, 84],
    synth: { a: 0.01, d: 0.05, s: 0.9, r: 0.1, cutoff: 8000, q: 1 },
  },
  {
    id: "strings",
    name: "Strings",
    color: "#c084fc",
    type: "melodic",
    instr: "strings",
    range: [36, 84],
    synth: { a: 0.3, d: 0.4, s: 0.85, r: 0.6, cutoff: 4000, q: 1 },
  },
  {
    id: "brass",
    name: "Brass",
    color: "#fbbf24",
    type: "melodic",
    instr: "brass",
    range: [36, 84],
    synth: { a: 0.05, d: 0.2, s: 0.7, r: 0.2, cutoff: 5000, q: 2 },
  },
  {
    id: "flute",
    name: "Flute",
    color: "#a7f3d0",
    type: "melodic",
    instr: "flute",
    range: [48, 84],
    synth: { a: 0.05, d: 0.2, s: 0.8, r: 0.3, cutoff: 6000, q: 1 },
  },
  {
    id: "bell",
    name: "Bell",
    color: "#fde68a",
    type: "melodic",
    instr: "bell",
    range: [48, 96],
    synth: { a: 0.001, d: 1.5, s: 0.1, r: 1.5, cutoff: 12000, q: 1 },
  },
  {
    id: "marimba",
    name: "Marimba",
    color: "#fca5a5",
    type: "melodic",
    instr: "marimba",
    range: [36, 84],
    synth: { a: 0.001, d: 0.3, s: 0.0, r: 0.3, cutoff: 5000, q: 1 },
  },
  {
    id: "choir",
    name: "Choir",
    color: "#93c5fd",
    type: "melodic",
    instr: "choir",
    range: [36, 84],
    synth: { a: 0.5, d: 0.5, s: 0.9, r: 1.0, cutoff: 3000, q: 1 },
  },
  {
    id: "chip",
    name: "Chip",
    color: "#67e8f9",
    type: "melodic",
    instr: "chip",
    range: [48, 84],
    synth: { a: 0.001, d: 0.1, s: 0.3, r: 0.1, cutoff: 8000, q: 1 },
  },
  {
    id: "supersaw",
    name: "Supersaw",
    color: "#f9a8d4",
    type: "melodic",
    instr: "supersaw",
    range: [36, 84],
    synth: { a: 0.02, d: 0.15, s: 0.6, r: 0.2, cutoff: 8000, q: 2 },
  },

  /* ── Samples ── */
  {
    id: "s1",
    name: "Sample 1",
    color: "#00d2d3",
    type: "sample",
    rootMidi: 60,
    range: [24, 84],
  },
  {
    id: "s2",
    name: "Sample 2",
    color: "#48dbfb",
    type: "sample",
    rootMidi: 60,
    range: [24, 84],
  },
  {
    id: "s3",
    name: "Sample 3",
    color: "#c8d6e5",
    type: "sample",
    rootMidi: 60,
    range: [24, 84],
  },
  {
    id: "s4",
    name: "Sample 4",
    color: "#8395a7",
    type: "sample",
    rootMidi: 60,
    range: [24, 84],
  },
];
TRACKS.forEach((t) => {
  t.volume = 0.8;
  t.pan = 0;
  t.send = 0.15;
  t.mute = false;
  t.solo = false;
  t.effects = [];
  t.filter = { cutoff: 20000, q: 0.7 };
  t.sidechain = false;
  t.sidechainAmount = 0.7;
  t.sidechainRelease = 0.15;
  t.arp = { enabled: false, rate: 4, mode: "up", octaves: 1 };
  t.presetName = null;
  t.presetId = null;
  t.drumPresetId = null;
  t.inputGain = 1.0; // v18: Pre-Filter Gain
});
const PATTERN_IDS = ["A", "B", "C", "D"];
const BLACK_PC = [1, 3, 6, 8, 10];
const PX_PER_STEP = 20;
const PX_PER_STEP_AUTO = 14;

let bpm = 120,
  master = 0.8,
  reverbAmount = 0.35,
  swing = 0;
let stepCount = 16,
  currentPattern = "A",
  currentView = "rack";
let playMode = "pattern";
let patterns = {};
let song = { blocks: [], markers: [], loopStart: 0, loopEnd: 0 };
let automation = { lanes: [] };
let samples = {};
let userPresets = [];
let soloActive = false;
let songSelectedIds = new Set();
let selectedAutoLaneId = null;
let currentSongStep = 0;
let currentFxTrackId = null;
let humanizeTiming = 0,
  humanizeVelocity = 0,
  projectSeed = "flclone-default";
let metronomeOn = false,
  metronomeVol = 0.5;
let metronomeSound = "click";
/* ── v19: Performance Mode ── */
let perfQuantize = 4; // Steps: 0=immediate, 4=beat, 16=bar
let perfFollowSteps = 0; // 0=off, sonst Wechsel nach N Steps
let perfNowPlaying = null; // { patternId, sceneIndex, startedAt }
let perfQueue = null; // { patternId, sceneIndex, atStep }

/* ── v19: Pattern-Metadaten ── */
const DEFAULT_PATTERN_COLORS = {
  A: "#ff8a00",
  B: "#4ea3ff",
  C: "#00b894",
  D: "#fd79a8",
};
let patternMeta = {
  A: { color: DEFAULT_PATTERN_COLORS.A, name: "Pattern A" },
  B: { color: DEFAULT_PATTERN_COLORS.B, name: "Pattern B" },
  C: { color: DEFAULT_PATTERN_COLORS.C, name: "Pattern C" },
  D: { color: DEFAULT_PATTERN_COLORS.D, name: "Pattern D" },
};

/* ── v19: Controller-Links (eine Automation-Lane → mehrere Ziele) ── */
let controllerLinks = []; // [{ id, laneId, targetId }]

/* ── v19: Browser / Sample-Tags ── */
const BROWSER_TAGS = [
  "kick",
  "snare",
  "hat",
  "perc",
  "loop",
  "bass",
  "vocal",
  "fx",
  "other",
];
let browserActiveTag = null;
let browserSearchText = "";
let browserCollapsed = false;

/* ---- Reverb / Master EQ (v16) ---- */
let reverbPresetId = "hall";
let reverbDecay = 2.2;
let reverbDamp = 0.3;
let reverbDuration = 3.0;
let masterEQLow = 0;
let masterEQMid = 0;
let masterEQHigh = 0;
const MASTER_EQ_LOW_FREQ = 200;
const MASTER_EQ_HIGH_FREQ = 4000;
let masterEQLowNode = null,
  masterEQMidNode = null,
  masterEQHighNode = null;
/* ---- Drum Kits / Master Lowpass / Presets ---- */
let drumKitId = "default";
let masterLowpassFreq = 20000;
let masterLowpassNode = null;

/* ---- v17: Mastering-Chain + Groove ---- */
let masteringWidth = 1.0; // 0.5 = eng, 1.0 = original, 2.0 = extra breit
let masteringLimiterOn = false; // v17.2: off by default — Limiter fügt 12 ms Delay hinzu
let masteringLimiterCeiling = -0.1; // dB, -0.1 bis -6
let grooveTemplateId = "straight"; // 'straight' | 'hiphop' | 'house' | 'trap' | 'lofi'
let grooveStrength = 0.0; // 0..1
let stereoWidthNode = null;
let masteringLimiter1 = null;
let masteringLimiterBypass = null;

const DRUM_KITS = {
  default: {
    name: "Default",
    kick: { baseFreq: 150, endFreq: 45, decay: 0.35, noise: 0 },
    snare: { tone: 180, noise: 0.7, decay: 0.2 },
    hat: { freq: 7000, decay: 0.06 },
    openhat: { freq: 6000, decay: 0.5 },
    clap: { freq: 1500, reps: 3, decay: 0.09 },
    tom: { baseFreq: 220, endFreq: 80, decay: 0.4 },
  },
  808: {
    name: "808",
    kick: { baseFreq: 120, endFreq: 35, decay: 1.2, noise: 0 },
    snare: { tone: 200, noise: 0.5, decay: 0.15 },
    hat: { freq: 8000, decay: 0.05 },
    openhat: { freq: 7000, decay: 0.4 },
    clap: { freq: 1400, reps: 2, decay: 0.08 },
    tom: { baseFreq: 180, endFreq: 60, decay: 0.5 },
  },
  909: {
    name: "909",
    kick: { baseFreq: 180, endFreq: 55, decay: 0.25, noise: 0 },
    snare: { tone: 200, noise: 0.8, decay: 0.18 },
    hat: { freq: 9000, decay: 0.04 },
    openhat: { freq: 7500, decay: 0.35 },
    clap: { freq: 1600, reps: 4, decay: 0.08 },
    tom: { baseFreq: 240, endFreq: 90, decay: 0.3 },
  },
  acoustic: {
    name: "Acoustic",
    kick: { baseFreq: 120, endFreq: 50, decay: 0.5, noise: 0.1 },
    snare: { tone: 190, noise: 0.9, decay: 0.25 },
    hat: { freq: 6000, decay: 0.1 },
    openhat: { freq: 5000, decay: 0.6 },
    clap: { freq: 1300, reps: 3, decay: 0.12 },
    tom: { baseFreq: 200, endFreq: 70, decay: 0.6 },
  },
  lofi: {
    name: "Lo-Fi",
    kick: { baseFreq: 100, endFreq: 40, decay: 0.6, noise: 0.2 },
    snare: { tone: 160, noise: 0.6, decay: 0.3 },
    hat: { freq: 4000, decay: 0.15 },
    openhat: { freq: 3500, decay: 0.7 },
    clap: { freq: 1000, reps: 2, decay: 0.15 },
    tom: { baseFreq: 150, endFreq: 50, decay: 0.7 },
  },
  trap: {
    name: "Trap",
    kick: { baseFreq: 100, endFreq: 30, decay: 1.5, noise: 0 },
    snare: { tone: 220, noise: 0.3, decay: 0.1 },
    hat: { freq: 10000, decay: 0.03 },
    openhat: { freq: 8000, decay: 0.3 },
    clap: { freq: 1800, reps: 4, decay: 0.08 },
    tom: { baseFreq: 200, endFreq: 70, decay: 0.4 },
  },
};

/* ── v17.1: Per-Drum Presets — überschreiben den Kit-Default ── */
const DRUM_PRESETS = {
  kick: {
    kick_default: {
      name: "Default",
      baseFreq: 150,
      endFreq: 45,
      decay: 0.35,
      noise: 0,
    },
    kick_808_deep: {
      name: "808 Deep",
      baseFreq: 120,
      endFreq: 35,
      decay: 1.2,
      noise: 0,
    },
    kick_808_punch: {
      name: "808 Punch",
      baseFreq: 140,
      endFreq: 40,
      decay: 0.7,
      noise: 0,
    },
    kick_909: {
      name: "909",
      baseFreq: 180,
      endFreq: 55,
      decay: 0.25,
      noise: 0,
    },
    kick_trap: {
      name: "Trap Sub",
      baseFreq: 100,
      endFreq: 28,
      decay: 1.5,
      noise: 0,
    },
    kick_punchy: {
      name: "Punchy",
      baseFreq: 200,
      endFreq: 60,
      decay: 0.15,
      noise: 0,
    },
    kick_clicky: {
      name: "Clicky",
      baseFreq: 220,
      endFreq: 80,
      decay: 0.1,
      noise: 0.06,
    },
    kick_acoustic: {
      name: "Acoustic",
      baseFreq: 120,
      endFreq: 50,
      decay: 0.5,
      noise: 0.1,
    },
    kick_lofi: {
      name: "Lo-Fi",
      baseFreq: 100,
      endFreq: 40,
      decay: 0.6,
      noise: 0.22,
    },
    kick_short: {
      name: "Short Kick",
      baseFreq: 160,
      endFreq: 60,
      decay: 0.1,
      noise: 0,
    },
  },
  snare: {
    snare_default: { name: "Default", tone: 180, noise: 0.7, decay: 0.2 },
    snare_808: { name: "808", tone: 200, noise: 0.5, decay: 0.15 },
    snare_909: { name: "909", tone: 200, noise: 0.8, decay: 0.18 },
    snare_tight: { name: "Tight", tone: 220, noise: 0.6, decay: 0.08 },
    snare_fat: { name: "Fat", tone: 160, noise: 0.9, decay: 0.35 },
    snare_rimshot: { name: "Rimshot", tone: 400, noise: 0.3, decay: 0.05 },
    snare_trap: { name: "Trap", tone: 220, noise: 0.3, decay: 0.1 },
    snare_acoustic: { name: "Acoustic", tone: 190, noise: 0.9, decay: 0.25 },
    snare_lofi: { name: "Lo-Fi", tone: 160, noise: 0.6, decay: 0.3 },
  },
  hat: {
    hat_default: { name: "Default", freq: 7000, decay: 0.06 },
    hat_closed_tight: { name: "Tight", freq: 9000, decay: 0.03 },
    hat_closed_long: { name: "Long", freq: 7500, decay: 0.12 },
    hat_808: { name: "808", freq: 8000, decay: 0.05 },
    hat_909: { name: "909", freq: 9000, decay: 0.04 },
    hat_trap: { name: "Trap", freq: 10000, decay: 0.03 },
    hat_acoustic: { name: "Acoustic", freq: 6000, decay: 0.1 },
    hat_lofi: { name: "Lo-Fi", freq: 4000, decay: 0.15 },
    hat_click: { name: "Hi-Click", freq: 12000, decay: 0.02 },
  },
  openhat: {
    openhat_default: { name: "Default", freq: 6000, decay: 0.5 },
    openhat_808: { name: "808", freq: 7000, decay: 0.4 },
    openhat_909: { name: "909", freq: 7500, decay: 0.35 },
    openhat_short: { name: "Short", freq: 6500, decay: 0.2 },
    openhat_long: { name: "Long", freq: 6000, decay: 0.8 },
    openhat_trap: { name: "Trap", freq: 8000, decay: 0.3 },
    openhat_acoustic: { name: "Acoustic", freq: 5000, decay: 0.6 },
    openhat_lofi: { name: "Lo-Fi", freq: 3500, decay: 0.7 },
  },
  clap: {
    clap_default: { name: "Default", freq: 1500, reps: 3, decay: 0.09 },
    clap_808: { name: "808", freq: 1400, reps: 2, decay: 0.08 },
    clap_909: { name: "909", freq: 1600, reps: 4, decay: 0.08 },
    clap_tight: { name: "Tight", freq: 1800, reps: 2, decay: 0.05 },
    clap_fat: { name: "Fat", freq: 1200, reps: 4, decay: 0.15 },
    clap_hand: { name: "Hand Clap", freq: 1300, reps: 3, decay: 0.12 },
    clap_trap: { name: "Trap", freq: 1800, reps: 4, decay: 0.08 },
    clap_acoustic: { name: "Acoustic", freq: 1300, reps: 3, decay: 0.12 },
  },
  tom: {
    tom_default: { name: "Default", baseFreq: 220, endFreq: 80, decay: 0.4 },
    tom_low: { name: "Low", baseFreq: 150, endFreq: 55, decay: 0.5 },
    tom_mid: { name: "Mid", baseFreq: 220, endFreq: 80, decay: 0.4 },
    tom_high: { name: "High", baseFreq: 320, endFreq: 120, decay: 0.3 },
    tom_808: { name: "808", baseFreq: 180, endFreq: 60, decay: 0.5 },
    tom_909: { name: "909", baseFreq: 240, endFreq: 90, decay: 0.3 },
    tom_acoustic: { name: "Acoustic", baseFreq: 200, endFreq: 70, decay: 0.6 },
    tom_lofi: { name: "Lo-Fi", baseFreq: 150, endFreq: 50, decay: 0.7 },
  },
};

const REVERB_PRESETS = {
  hall: { name: "Hall", decay: 2.2, damp: 0.3, duration: 3.0 },
  room: { name: "Room", decay: 1.2, damp: 0.6, duration: 1.2 },
  plate: { name: "Plate", decay: 2.5, damp: 0.2, duration: 2.5 },
  spring: { name: "Spring", decay: 1.8, damp: 0.5, duration: 2.0 },
};

const METRONOME_SOUNDS = {
  click: { name: "Click" },
  woodblock: { name: "Woodblock" },
  cowbell: { name: "Cowbell" },
  beep: { name: "Beep" },
};

const CHORD_PROGRESSIONS = {
  pop_1564: { name: "I–V–vi–IV (Pop)", intervals: [0, 7, 9, 5], type: "maj" },
  pop_6415: { name: "vi–IV–I–V (Pop)", intervals: [9, 5, 0, 7], type: "maj" },
  rock_145: { name: "I–IV–V (Rock)", intervals: [0, 5, 7], type: "maj" },
  jazz_251: { name: "ii–V–I (Jazz)", intervals: [2, 7, 0], type: "maj" },
  minor_167: { name: "i–VI–VII (Minor)", intervals: [0, 8, 10], type: "min" },
  edm_1m: { name: "i–VI–III–VII (EDM)", intervals: [0, 8, 3, 10], type: "min" },
  sad_6415: { name: "vi–IV–I–V (Sad)", intervals: [9, 5, 0, 7], type: "min" },
  folk_145: { name: "I–IV–V (Folk)", intervals: [0, 5, 7], type: "maj" },
};
const GROOVE_TEMPLATES = {
  straight: {
    name: "Straight",
    timing: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    velocity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  hiphop: {
    name: "Hip-Hop",
    timing: [
      0.0, 0.0, 0.02, 0.05, 0.0, 0.0, 0.03, 0.05, 0.0, 0.0, 0.02, 0.05, 0.0,
      0.0, 0.03, 0.05,
    ],
    velocity: [
      1.05, 0.85, 0.95, 1.1, 1.05, 0.85, 0.95, 1.1, 1.05, 0.85, 0.95, 1.1, 1.05,
      0.85, 0.95, 1.1,
    ],
  },
  house: {
    name: "House",
    timing: [
      0.0, 0.0, 0.08, 0.0, 0.0, 0.0, 0.08, 0.0, 0.0, 0.0, 0.08, 0.0, 0.0, 0.0,
      0.08, 0.0,
    ],
    velocity: [
      1.1, 0.9, 1.05, 0.9, 1.1, 0.9, 1.05, 0.9, 1.1, 0.9, 1.05, 0.9, 1.1, 0.9,
      1.05, 0.9,
    ],
  },
  trap: {
    name: "Trap",
    timing: [
      0.0, 0.03, 0.06, 0.03, 0.0, 0.03, 0.06, 0.03, 0.0, 0.03, 0.06, 0.03, 0.0,
      0.03, 0.06, 0.03,
    ],
    velocity: [
      1.15, 0.75, 0.9, 0.8, 1.15, 0.75, 0.9, 0.8, 1.15, 0.75, 0.9, 0.8, 1.15,
      0.75, 0.9, 0.8,
    ],
  },
  lofi: {
    name: "Lo-Fi",
    timing: [
      0.02, 0.03, 0.05, 0.04, 0.02, 0.03, 0.05, 0.04, 0.02, 0.03, 0.05, 0.04,
      0.02, 0.03, 0.05, 0.04,
    ],
    velocity: [
      1.0, 0.85, 0.95, 0.9, 1.0, 0.85, 0.95, 0.9, 1.0, 0.85, 0.95, 0.9, 1.0,
      0.85, 0.95, 0.9,
    ],
  },
};

/* ---------- Undo/Redo ---------- */
const HISTORY_MAX = 80;
let historyStack = [],
  historyIndex = -1,
  historySuspended = false;

function snapshotState() {
  return JSON.stringify({
    patterns,
    song,
    automation,
    tracks: TRACKS.map((t) => ({
      id: t.id,
      volume: t.volume,
      pan: t.pan,
      send: t.send,
      mute: t.mute,
      solo: t.solo,
      filter: t.filter,
      effects: t.effects,
      synth: t.synth,
      sidechain: t.sidechain,
      sidechainAmount: t.sidechainAmount,
      sidechainRelease: t.sidechainRelease,
      presetName: t.presetName || null,
      presetId: t.presetId || null,
      drumPresetId: t.drumPresetId || null,
      arp: t.arp
        ? JSON.parse(JSON.stringify(t.arp))
        : { enabled: false, rate: 4, mode: "up", octaves: 1 },
      inputGain: typeof t.inputGain === "number" ? t.inputGain : 1.0,
    })),
    samples: Object.fromEntries(
      Object.entries(samples).map(([k, v]) => [
        k,
        {
          id: v.id,
          name: v.name,
          start: v.start,
          end: v.end,
          reverse: v.reverse,
          gain: v.gain,
          fadeIn: v.fadeIn,
          fadeOut: v.fadeOut,
          slices: v.slices || [],
          tuneRate: v.tuneRate || 1,
        },
      ])
    ),
    reverbPresetId,
    reverbDecay,
    reverbDamp,
    reverbDuration,
    masterEQLow,
    masterEQMid,
    masterEQHigh,
    metronomeSound,
    masteringWidth,
    masteringLimiterOn,
    masteringLimiterCeiling,
    grooveTemplateId,
    grooveStrength,
    userPresets,
    patternMeta,
    controllerLinks,
    perfQuantize,
    perfFollowSteps,
  });
}
function restoreState(json) {
  const s = JSON.parse(json);
  patterns = s.patterns;
  song = s.song;
  automation = s.automation;
  if (Array.isArray(s.tracks)) {
    s.tracks.forEach((st) => {
      const t = TRACKS.find((x) => x.id === st.id);
      if (!t) return;
      t.volume = st.volume;
      t.pan = st.pan;
      t.send = st.send;
      t.mute = !!st.mute;
      t.solo = !!st.solo;
      t.filter = st.filter || { cutoff: 20000, q: 0.7 };
      t.effects = Array.isArray(st.effects) ? st.effects : [];
      if (st.synth) t.synth = st.synth;
      t.presetName = st.presetName || null;
      t.presetId = st.presetId || null;
      t.drumPresetId = st.drumPresetId || null;
      if (typeof st.sidechain === "boolean") t.sidechain = st.sidechain;
      if (typeof st.sidechainAmount === "number")
        t.sidechainAmount = st.sidechainAmount;
      if (typeof st.sidechainRelease === "number")
        t.sidechainRelease = st.sidechainRelease;
      if (st.arp) t.arp = st.arp;
      if (typeof st.inputGain === "number")
        t.inputGain = Math.max(0, Math.min(2, st.inputGain));
      else t.inputGain = 1.0;
    });
  }
  if (s.samples) {
    Object.entries(s.samples).forEach(([k, v]) => {
      if (samples[k]) Object.assign(samples[k], v);
    });
  }
  if (typeof s.reverbPresetId === "string" && REVERB_PRESETS[s.reverbPresetId])
    reverbPresetId = s.reverbPresetId;
  if (typeof s.reverbDecay === "number") reverbDecay = s.reverbDecay;
  if (typeof s.reverbDamp === "number") reverbDamp = s.reverbDamp;
  if (typeof s.reverbDuration === "number") reverbDuration = s.reverbDuration;
  if (typeof s.masterEQLow === "number") masterEQLow = s.masterEQLow;
  if (typeof s.masterEQMid === "number") masterEQMid = s.masterEQMid;
  if (typeof s.masterEQHigh === "number") masterEQHigh = s.masterEQHigh;
  if (typeof s.metronomeSound === "string") metronomeSound = s.metronomeSound;
  if (typeof s.masteringWidth === "number")
    masteringWidth = Math.max(0, Math.min(2, s.masteringWidth));
  if (typeof s.masteringLimiterOn === "boolean")
    masteringLimiterOn = s.masteringLimiterOn;
  if (typeof s.masteringLimiterCeiling === "number")
    masteringLimiterCeiling = Math.max(
      -12,
      Math.min(0, s.masteringLimiterCeiling)
    );
  if (
    typeof s.grooveTemplateId === "string" &&
    GROOVE_TEMPLATES[s.grooveTemplateId]
  )
    grooveTemplateId = s.grooveTemplateId;
  if (typeof s.grooveStrength === "number")
    grooveStrength = Math.max(0, Math.min(1, s.grooveStrength));
  if (s.userPresets) userPresets = s.userPresets;
  if (s.patternMeta) patternMeta = s.patternMeta;
  if (Array.isArray(s.controllerLinks)) controllerLinks = s.controllerLinks;
  if (typeof s.perfQuantize === "number") perfQuantize = s.perfQuantize;
  if (typeof s.perfFollowSteps === "number")
    perfFollowSteps = s.perfFollowSteps;

  historySuspended = true;
  rebuildAudioGraphs();
  rebuildRack();
  rebuildMixer();
  rebuildSong();
  rebuildAutoView();
  if (prEditor) closePianoRoll();
  // v17: Mastering-Chain nach Rebuild neu anwenden
  if (stereoWidthNode && ctx) {
    const g = 0.5 * masteringWidth;
    try {
      stereoWidthNode.sSumL.gain.setValueAtTime(g, ctx.currentTime);
      stereoWidthNode.sSumR.gain.setValueAtTime(-g, ctx.currentTime);
    } catch (e) {}
  }
  if (masteringLimiter1 && ctx) {
    try {
      masteringLimiter1.threshold.setValueAtTime(
        masteringLimiterCeiling,
        ctx.currentTime
      );
    } catch (e) {}
  }
  if (masteringLimiterBypass && ctx) {
    try {
      masteringLimiterBypass.bypassGain.gain.setValueAtTime(
        masteringLimiterOn ? 0 : 1,
        ctx.currentTime
      );
      masteringLimiterBypass.limiterPathGain.gain.setValueAtTime(
        masteringLimiterOn ? 1 : 0,
        ctx.currentTime
      );
    } catch (e) {}
  }
  historySuspended = false;
}
function pushHistory() {
  if (historySuspended) return;
  const snap = snapshotState();
  if (historyIndex >= 0 && historyStack[historyIndex] === snap) return;
  historyStack = historyStack.slice(0, historyIndex + 1);
  historyStack.push(snap);
  if (historyStack.length > HISTORY_MAX) historyStack.shift();
  historyIndex = historyStack.length - 1;
}
function undoHistory() {
  if (historyIndex <= 0) return false;
  historyIndex--;
  restoreState(historyStack[historyIndex]);
  autoSave();
  toast("Undo", "info");
  return true;
}
function redoHistory() {
  if (historyIndex >= historyStack.length - 1) return false;
  historyIndex++;
  restoreState(historyStack[historyIndex]);
  autoSave();
  toast("Redo", "info");
  return true;
}
function initHistory() {
  historyStack = [snapshotState()];
  historyIndex = 0;
}

/* ---------- Utility ---------- */
function genId(prefix) {
  try {
    if (window.crypto && typeof crypto.randomUUID === "function")
      return prefix + "_" + crypto.randomUUID();
  } catch (e) {}
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 10)
  );
}
function hashToUnit(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}
function stepRandom(seed, trackId, songStep) {
  return hashToUnit(seed + "|" + trackId + "|" + songStep);
}

/* ---------- Effekte ---------- */
const EFFECT_DEFS = {
  eq: {
    name: "EQ (3-Band)",
    defaults: {
      lowFreq: 200,
      lowGain: 0,
      midFreq: 1000,
      midGain: 0,
      midQ: 1,
      highFreq: 4000,
      highGain: 0,
    },
    params: [
      {
        key: "lowFreq",
        label: "Low Hz",
        min: 30,
        max: 500,
        step: 1,
        unit: "Hz",
      },
      {
        key: "lowGain",
        label: "Low dB",
        min: -24,
        max: 24,
        step: 0.5,
        unit: "dB",
      },
      {
        key: "midFreq",
        label: "Mid Hz",
        min: 200,
        max: 6000,
        step: 10,
        unit: "Hz",
      },
      {
        key: "midGain",
        label: "Mid dB",
        min: -24,
        max: 24,
        step: 0.5,
        unit: "dB",
      },
      { key: "midQ", label: "Mid Q", min: 0.1, max: 10, step: 0.1, unit: "" },
      {
        key: "highFreq",
        label: "High Hz",
        min: 1500,
        max: 16000,
        step: 100,
        unit: "Hz",
      },
      {
        key: "highGain",
        label: "High dB",
        min: -24,
        max: 24,
        step: 0.5,
        unit: "dB",
      },
    ],
    build(c, p) {
      const lo = c.createBiquadFilter();
      lo.type = "lowshelf";
      const mi = c.createBiquadFilter();
      mi.type = "peaking";
      const hi = c.createBiquadFilter();
      hi.type = "highshelf";
      lo.connect(mi);
      mi.connect(hi);
      const apply = (par) => {
        lo.frequency.value = par.lowFreq;
        lo.gain.value = par.lowGain;
        mi.frequency.value = par.midFreq;
        mi.gain.value = par.midGain;
        mi.Q.value = par.midQ;
        hi.frequency.value = par.highFreq;
        hi.gain.value = par.highGain;
      };
      apply(p);
      return {
        input: lo,
        output: hi,
        update: apply,
        getAudioParam(k) {
          const m = {
            lowFreq: lo.frequency,
            lowGain: lo.gain,
            midFreq: mi.frequency,
            midGain: mi.gain,
            midQ: mi.Q,
            highFreq: hi.frequency,
            highGain: hi.gain,
          };
          return m[k] || null;
        },
        destroy() {
          try {
            lo.disconnect();
            mi.disconnect();
            hi.disconnect();
          } catch (e) {}
        },
      };
    },
  },
  delay: {
    name: "Delay",
    defaults: { division: "1/8", feedback: 0.35, wet: 0.3 },
    params: [
      {
        key: "division",
        label: "Division",
        type: "select",
        options: ["1/16", "1/8", "1/4", "1/8.", "1/4.", "1/8T", "1/4T"],
      },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01,
        unit: "",
      },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
    ],
    build(c, p) {
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const dl = c.createDelay(2),
        fb = c.createGain();
      const dp = c.createBiquadFilter();
      dp.type = "lowpass";
      dp.frequency.value = 4000;
      inp.connect(dry);
      dry.connect(out);
      inp.connect(dl);
      dl.connect(dp);
      dp.connect(fb);
      fb.connect(dl);
      dl.connect(wet);
      wet.connect(out);
      const sec = (d, b) => {
        const t = 60 / b;
        switch (d) {
          case "1/16":
            return t / 4;
          case "1/8":
            return t / 2;
          case "1/4":
            return t;
          case "1/8.":
            return t * 0.75;
          case "1/4.":
            return t * 1.5;
          case "1/8T":
            return t / 3;
          case "1/4T":
            return (t * 2) / 3;
        }
        return t / 2;
      };
      const apply = (par) => {
        const t = c.currentTime;
        dl.delayTime.setTargetAtTime(
          Math.min(1.9, Math.max(0.01, sec(par.division, bpm))),
          t,
          0.01
        );
        fb.gain.setTargetAtTime(
          Math.max(0, Math.min(0.9, par.feedback)),
          t,
          0.01
        );
        wet.gain.setTargetAtTime(Math.max(0, Math.min(1, par.wet)), t, 0.01);
        dry.gain.setTargetAtTime(
          1 - Math.max(0, Math.min(1, par.wet)) * 0.5,
          t,
          0.01
        );
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "feedback") return fb.gain;
          if (k === "wet") return wet.gain;
          return null;
        },
        destroy() {
          try {
            [inp, out, dry, wet, dl, fb, dp].forEach((n) => n.disconnect());
          } catch (e) {}
        },
      };
    },
  },
  dist: {
    name: "Distortion",
    defaults: { drive: 0.3, fatness: 0.3, tone: 0.6, wet: 1.0, out: 0.8 },
    params: [
      { key: "drive", label: "Drive", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "fatness",
        label: "Fatness",
        min: 0,
        max: 1,
        step: 0.01,
        unit: "",
      },
      { key: "tone", label: "Tone", min: 0, max: 1, step: 0.01, unit: "" },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
      { key: "out", label: "Gain", min: 0, max: 2, step: 0.01, unit: "" },
    ],
    build(c, p) {
      p = Object.assign(
        { drive: 0.3, fatness: 0.3, tone: 0.6, wet: 1.0, out: 0.8 },
        p || {}
      );
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const sh = c.createWaveShaper();
      sh.oversample = "4x";
      const preLP = c.createBiquadFilter();
      preLP.type = "lowpass";
      const postLP = c.createBiquadFilter();
      postLP.type = "lowpass";
      const preGain = c.createGain(),
        postGain = c.createGain();
      inp.connect(dry);
      dry.connect(out);
      inp.connect(preLP);
      preLP.connect(preGain);
      preGain.connect(sh);
      sh.connect(postLP);
      postLP.connect(postGain);
      postGain.connect(wet);
      wet.connect(out);
      const curve = (d) => {
        const k = d * 100 + 1,
          n = 1024,
          arr = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          const x = (i * 2) / n - 1;
          arr[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
        }
        return arr;
      };
      const apply = (par) => {
        const t = c.currentTime;
        const d = Math.max(0, Math.min(1, par.drive));
        sh.curve = curve(d);
        preGain.gain.setTargetAtTime(1 + d * 6, t, 0.02);
        const fat = Math.max(0, Math.min(1, par.fatness));
        preLP.frequency.setTargetAtTime(800 + fat * 4000, t, 0.02);
        const tone = Math.max(0, Math.min(1, par.tone));
        postLP.frequency.setTargetAtTime(800 + tone * 12000, t, 0.02);
        wet.gain.setTargetAtTime(Math.max(0, Math.min(1, par.wet)), t, 0.02);
        dry.gain.setTargetAtTime(
          1 - Math.max(0, Math.min(1, par.wet)),
          t,
          0.02
        );
        out.gain.setTargetAtTime(Math.max(0, Math.min(2, par.out)), t, 0.02);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "wet") return wet.gain;
          if (k === "out") return out.gain;
          if (k === "drive") return preGain.gain;
          if (k === "tone") return postLP.frequency;
          if (k === "fatness") return preLP.frequency;
          return null;
        },
        destroy() {
          try {
            [inp, out, dry, wet, sh, preLP, postLP, preGain, postGain].forEach(
              (n) => n.disconnect()
            );
          } catch (e) {}
        },
      };
    },
  },
  comp: {
    name: "Compressor",
    defaults: {
      threshold: -18,
      knee: 12,
      ratio: 4,
      attack: 0.01,
      release: 0.25,
      makeup: 1.0,
    },
    params: [
      {
        key: "threshold",
        label: "Threshold",
        min: -60,
        max: 0,
        step: 0.5,
        unit: "dB",
      },
      { key: "knee", label: "Knee", min: 0, max: 40, step: 0.5, unit: "dB" },
      { key: "ratio", label: "Ratio", min: 1, max: 20, step: 0.5, unit: ":1" },
      {
        key: "attack",
        label: "Attack",
        min: 0,
        max: 0.5,
        step: 0.001,
        unit: "s",
      },
      {
        key: "release",
        label: "Release",
        min: 0.01,
        max: 1.5,
        step: 0.01,
        unit: "s",
      },
      { key: "makeup", label: "Makeup", min: 0, max: 3, step: 0.01, unit: "" },
    ],
    build(c, p) {
      const cp = c.createDynamicsCompressor(),
        mu = c.createGain();
      cp.connect(mu);
      const apply = (par) => {
        cp.threshold.value = Math.max(-100, Math.min(0, par.threshold));
        cp.knee.value = Math.max(0, Math.min(40, par.knee));
        cp.ratio.value = Math.max(1, Math.min(20, par.ratio));
        cp.attack.value = Math.max(0, Math.min(1, par.attack));
        cp.release.value = Math.max(0, Math.min(1, par.release));
        mu.gain.value = Math.max(0, Math.min(3, par.makeup));
      };
      apply(p);
      return {
        input: cp,
        output: mu,
        update: apply,
        getAudioParam(k) {
          const m = {
            threshold: cp.threshold,
            knee: cp.knee,
            ratio: cp.ratio,
            attack: cp.attack,
            release: cp.release,
            makeup: mu.gain,
          };
          return m[k] || null;
        },
        destroy() {
          try {
            cp.disconnect();
            mu.disconnect();
          } catch (e) {}
        },
      };
    },
  },
  chorus: {
    name: "Chorus",
    defaults: { rate: 1.5, depth: 0.003, wet: 0.4, spread: 0.005 },
    params: [
      {
        key: "rate",
        label: "Rate Hz",
        min: 0.05,
        max: 8,
        step: 0.05,
        unit: "Hz",
      },
      {
        key: "depth",
        label: "Depth",
        min: 0.0001,
        max: 0.01,
        step: 0.0001,
        unit: "s",
      },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "spread",
        label: "Spread",
        min: 0,
        max: 0.02,
        step: 0.0001,
        unit: "s",
      },
    ],
    build(c, p) {
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const dL = c.createDelay(0.1),
        dR = c.createDelay(0.1);
      const lfo = c.createOscillator();
      const gL = c.createGain(),
        gR = c.createGain();
      const mg = c.createChannelMerger(2);
      lfo.type = "sine";
      lfo.frequency.value = p.rate;
      lfo.connect(gL);
      lfo.connect(gR);
      gL.gain.value = p.depth;
      gR.gain.value = -p.depth;
      dL.delayTime.value = 0.02;
      dR.delayTime.value = 0.025;
      gL.connect(dL.delayTime);
      gR.connect(dR.delayTime);
      inp.connect(dry);
      dry.connect(out);
      inp.connect(dL);
      inp.connect(dR);
      dL.connect(mg, 0, 0);
      dR.connect(mg, 0, 1);
      mg.connect(wet);
      wet.connect(out);
      lfo.start();
      const apply = (par) => {
        const t = c.currentTime;
        lfo.frequency.setTargetAtTime(Math.max(0.01, par.rate), t, 0.05);
        const d = Math.max(0.0001, Math.min(0.01, par.depth));
        gL.gain.setTargetAtTime(d, t, 0.05);
        gR.gain.setTargetAtTime(-d, t, 0.05);
        const sp = Math.max(0, Math.min(0.02, par.spread || 0));
        dL.delayTime.setTargetAtTime(0.02 + sp, t, 0.05);
        dR.delayTime.setTargetAtTime(0.025 - sp, t, 0.05);
        wet.gain.setTargetAtTime(Math.max(0, Math.min(1, par.wet)), t, 0.05);
        dry.gain.setTargetAtTime(
          1 - Math.max(0, Math.min(1, par.wet)) * 0.5,
          t,
          0.05
        );
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "rate") return lfo.frequency;
          if (k === "depth") return gL.gain;
          if (k === "wet") return wet.gain;
          return null;
        },
        destroy() {
          try {
            lfo.stop();
          } catch (e) {}
          try {
            [inp, out, dry, wet, dL, dR, lfo, gL, gR, mg].forEach((n) =>
              n.disconnect()
            );
          } catch (e) {}
        },
      };
    },
  },
  filter: {
    name: "Filter (HP/LP)",
    defaults: { type: "lowpass", cutoff: 2000, q: 1 },
    params: [
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["lowpass", "highpass"],
      },
      {
        key: "cutoff",
        label: "Cutoff",
        min: 20,
        max: 20000,
        step: 10,
        unit: "Hz",
      },
      { key: "q", label: "Reso(Q)", min: 0.1, max: 20, step: 0.1, unit: "" },
    ],
    build(c, p) {
      const f = c.createBiquadFilter();
      f.type = p.type;
      f.frequency.value = p.cutoff;
      f.Q.value = p.q;
      const apply = (par) => {
        f.type = par.type;
        f.frequency.setTargetAtTime(par.cutoff, c.currentTime, 0.01);
        f.Q.setTargetAtTime(par.q, c.currentTime, 0.01);
      };
      return {
        input: f,
        output: f,
        update: apply,
        getAudioParam(k) {
          if (k === "cutoff") return f.frequency;
          if (k === "q") return f.Q;
          return null;
        },
        destroy() {
          try {
            f.disconnect();
          } catch (e) {}
        },
      };
    },
  },
  phaser: {
    name: "Phaser",
    defaults: { rate: 0.5, depth: 1.0, wet: 0.5, feedback: 0.3 },
    params: [
      {
        key: "rate",
        label: "Rate Hz",
        min: 0.05,
        max: 8,
        step: 0.05,
        unit: "Hz",
      },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, unit: "" },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01,
        unit: "",
      },
    ],
    build(c, p) {
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const stages = 4;
      const filters = [];
      const lfo = c.createOscillator();
      const lfoGain = c.createGain();
      lfo.type = "sine";
      lfo.frequency.value = p.rate;
      lfoGain.gain.value = p.depth * 1000;
      lfo.connect(lfoGain);
      let cur = inp;
      for (let i = 0; i < stages; i++) {
        const f = c.createBiquadFilter();
        f.type = "allpass";
        f.frequency.value = 1000;
        f.Q.value = 1;
        lfoGain.connect(f.frequency);
        cur.connect(f);
        cur = f;
        filters.push(f);
      }
      const fb = c.createGain();
      fb.gain.value = p.feedback;
      cur.connect(fb);
      fb.connect(filters[0]);
      cur.connect(wet);
      inp.connect(dry);
      dry.connect(out);
      wet.connect(out);
      lfo.start();
      const apply = (par) => {
        const t = c.currentTime;
        lfo.frequency.setTargetAtTime(par.rate, t, 0.05);
        lfoGain.gain.setTargetAtTime(par.depth * 1000, t, 0.05);
        wet.gain.setTargetAtTime(par.wet, t, 0.05);
        dry.gain.setTargetAtTime(1 - par.wet, t, 0.05);
        fb.gain.setTargetAtTime(par.feedback, t, 0.05);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "rate") return lfo.frequency;
          if (k === "depth") return lfoGain.gain;
          if (k === "wet") return wet.gain;
          return null;
        },
        destroy() {
          try {
            lfo.stop();
          } catch (e) {}
          try {
            [inp, out, dry, wet, fb, lfo, lfoGain, ...filters].forEach((n) =>
              n.disconnect()
            );
          } catch (e) {}
        },
      };
    },
  },
  tremolo: {
    name: "Tremolo",
    defaults: { rate: 5.0, depth: 0.5, shape: "sine" },
    params: [
      {
        key: "rate",
        label: "Rate Hz",
        min: 0.1,
        max: 20,
        step: 0.1,
        unit: "Hz",
      },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "shape",
        label: "Shape",
        type: "select",
        options: ["sine", "square", "triangle", "sawtooth"],
      },
    ],
    build(c, p) {
      const inp = c.createGain(),
        out = c.createGain();
      const lfo = c.createOscillator();
      const lfoGain = c.createGain();
      const modGain = c.createGain();
      inp.connect(modGain);
      modGain.connect(out);
      lfo.type = p.shape;
      lfo.frequency.value = p.rate;
      lfo.connect(lfoGain);
      lfoGain.connect(modGain.gain);
      lfo.start();
      const apply = (par) => {
        const t = c.currentTime;
        lfo.type = par.shape;
        lfo.frequency.setTargetAtTime(par.rate, t, 0.05);
        const d = par.depth;
        lfoGain.gain.setTargetAtTime(d * 0.5, t, 0.05);
        modGain.gain.setTargetAtTime(1 - d * 0.5, t, 0.05);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "rate") return lfo.frequency;
          if (k === "depth") return lfoGain.gain;
          return null;
        },
        destroy() {
          try {
            lfo.stop();
          } catch (e) {}
          try {
            [inp, out, lfo, lfoGain, modGain].forEach((n) => n.disconnect());
          } catch (e) {}
        },
      };
    },
  },
  wobble: {
    name: "Wobble",
    defaults: { rate: 4, depth: 0.7, baseFreq: 500, resonance: 6, wet: 1.0 },
    params: [
      {
        key: "rate",
        label: "Rate Hz",
        min: 0.5,
        max: 20,
        step: 0.1,
        unit: "Hz",
      },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "baseFreq",
        label: "Base Hz",
        min: 100,
        max: 5000,
        step: 10,
        unit: "Hz",
      },
      {
        key: "resonance",
        label: "Reso",
        min: 0.1,
        max: 20,
        step: 0.1,
        unit: "",
      },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
    ],
    build(c, p) {
      p = Object.assign(
        { rate: 4, depth: 0.7, baseFreq: 500, resonance: 6, wet: 1.0 },
        p || {}
      );
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = p.resonance;
      const lfo = c.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = p.rate;
      const lfoGain = c.createGain();
      lfoGain.gain.value = p.depth * 1500;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      filter.frequency.value = p.baseFreq;
      inp.connect(dry);
      dry.connect(out);
      inp.connect(filter);
      filter.connect(wet);
      wet.connect(out);
      lfo.start();
      const apply = (par) => {
        const t = c.currentTime;
        lfo.frequency.setTargetAtTime(par.rate, t, 0.02);
        lfoGain.gain.setTargetAtTime(par.depth * 1500, t, 0.02);
        filter.frequency.setTargetAtTime(par.baseFreq, t, 0.02);
        filter.Q.setTargetAtTime(par.resonance, t, 0.02);
        wet.gain.setTargetAtTime(par.wet, t, 0.02);
        dry.gain.setTargetAtTime(1 - par.wet, t, 0.02);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "rate") return lfo.frequency;
          if (k === "depth") return lfoGain.gain;
          if (k === "wet") return wet.gain;
          if (k === "baseFreq") return filter.frequency;
          if (k === "resonance") return filter.Q;
          return null;
        },
        destroy() {
          try {
            lfo.stop();
          } catch (e) {}
          try {
            [inp, out, dry, wet, filter, lfo, lfoGain].forEach((n) =>
              n.disconnect()
            );
          } catch (e) {}
        },
      };
    },
  },
  hiss: {
    name: "Hiss",
    defaults: { level: 0.1, highpass: 4000, lowpass: 16000, wet: 0.4 },
    params: [
      { key: "level", label: "Level", min: 0, max: 0.5, step: 0.01, unit: "" },
      {
        key: "highpass",
        label: "HiPass",
        min: 100,
        max: 8000,
        step: 10,
        unit: "Hz",
      },
      {
        key: "lowpass",
        label: "LoPass",
        min: 4000,
        max: 20000,
        step: 10,
        unit: "Hz",
      },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
    ],
    build(c, p) {
      p = Object.assign(
        { level: 0.1, highpass: 4000, lowpass: 16000, wet: 0.4 },
        p || {}
      );
      const inp = c.createGain(),
        out = c.createGain();
      inp.connect(out);
      const noise = noiseSource(c);
      noise.loop = true;
      const hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = p.highpass;
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = p.lowpass;
      const ng = c.createGain();
      ng.gain.value = p.level * p.wet;
      noise.connect(hp);
      hp.connect(lp);
      lp.connect(ng);
      ng.connect(out);
      noise.start();
      const apply = (par) => {
        const t = c.currentTime;
        hp.frequency.setTargetAtTime(par.highpass, t, 0.02);
        lp.frequency.setTargetAtTime(par.lowpass, t, 0.02);
        ng.gain.setTargetAtTime(par.level * par.wet, t, 0.02);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "level") return ng.gain;
          return null;
        },
        destroy() {
          try {
            noise.stop();
          } catch (e) {}
          try {
            [inp, out, hp, lp, ng, noise].forEach((n) => n.disconnect());
          } catch (e) {}
        },
      };
    },
  },
  /* ── v18: neue Effekte ── */
  bitcrush: {
    name: "Bitcrusher",
    defaults: { bits: 8, drive: 1.0, wet: 0.7 },
    params: [
      { key: "bits", label: "Bits", min: 1, max: 16, step: 1, unit: "" },
      { key: "drive", label: "Drive", min: 0.5, max: 4, step: 0.1, unit: "" },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
    ],
    build(c, p) {
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const preGain = c.createGain();
      const sh = c.createWaveShaper();
      inp.connect(dry);
      dry.connect(out);
      inp.connect(preGain);
      preGain.connect(sh);
      sh.connect(wet);
      wet.connect(out);
      const apply = (par) => {
        const t = c.currentTime;
        const bits = Math.max(1, Math.min(16, par.bits || 8));
        const steps = Math.pow(2, bits) - 1;
        preGain.gain.setTargetAtTime(Math.max(0.5, par.drive || 1), t, 0.02);
        const n = 2048,
          curve = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          const x = (i / n) * 2 - 1;
          curve[i] = Math.round(x * steps) / steps;
        }
        sh.curve = curve;
        sh.oversample = "none";
        const w = Math.max(0, Math.min(1, par.wet ?? 1));
        wet.gain.setTargetAtTime(w, t, 0.02);
        dry.gain.setTargetAtTime(1 - w, t, 0.02);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "wet") return wet.gain;
          if (k === "drive") return preGain.gain;
          return null;
        },
        destroy() {
          try {
            [inp, out, dry, wet, preGain, sh].forEach((n) => n.disconnect());
          } catch (e) {}
        },
      };
    },
  },
  pingpong: {
    name: "Ping-Pong Delay",
    defaults: { division: "1/4", feedback: 0.4, wet: 0.3 },
    params: [
      {
        key: "division",
        label: "Division",
        type: "select",
        options: ["1/8", "1/4", "1/4.", "1/8."],
      },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01,
        unit: "",
      },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
    ],
    build(c, p) {
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const dL = c.createDelay(2),
        dR = c.createDelay(2);
      const fb = c.createGain();
      const merge = c.createChannelMerger(2);
      inp.connect(dry);
      dry.connect(out);
      inp.connect(dL);
      dL.connect(dR);
      dR.connect(fb);
      fb.connect(dL);
      dL.connect(merge, 0, 0);
      dR.connect(merge, 0, 1);
      merge.connect(wet);
      wet.connect(out);
      const sec = (d, b) => {
        const t = 60 / b;
        switch (d) {
          case "1/8":
            return t / 2;
          case "1/4":
            return t;
          case "1/4.":
            return t * 1.5;
          case "1/8.":
            return t * 0.75;
        }
        return t;
      };
      const apply = (par) => {
        const t = c.currentTime;
        const time = Math.min(1.9, Math.max(0.01, sec(par.division, bpm)));
        dL.delayTime.setTargetAtTime(time, t, 0.02);
        dR.delayTime.setTargetAtTime(time, t, 0.02);
        fb.gain.setTargetAtTime(
          Math.max(0, Math.min(0.9, par.feedback ?? 0.4)),
          t,
          0.02
        );
        const w = Math.max(0, Math.min(1, par.wet ?? 0.3));
        wet.gain.setTargetAtTime(w, t, 0.02);
        dry.gain.setTargetAtTime(1 - w * 0.5, t, 0.02);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "wet") return wet.gain;
          if (k === "feedback") return fb.gain;
          return null;
        },
        destroy() {
          try {
            [inp, out, dry, wet, dL, dR, fb, merge].forEach((n) =>
              n.disconnect()
            );
          } catch (e) {}
        },
      };
    },
  },
  autopan: {
    name: "Auto-Pan",
    defaults: { rate: 0.5, depth: 1.0, shape: "sine" },
    params: [
      {
        key: "rate",
        label: "Rate Hz",
        min: 0.05,
        max: 10,
        step: 0.05,
        unit: "Hz",
      },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "shape",
        label: "Shape",
        type: "select",
        options: ["sine", "triangle", "square"],
      },
    ],
    build(c, p) {
      const inp = c.createGain(),
        out = c.createGain();
      if (!c.createStereoPanner) {
        inp.connect(out);
        return {
          input: inp,
          output: out,
          update: () => {},
          getAudioParam: () => null,
          destroy() {
            try {
              [inp, out].forEach((n) => n.disconnect());
            } catch (e) {}
          },
        };
      }
      const pan = c.createStereoPanner();
      inp.connect(pan);
      pan.connect(out);
      const lfo = c.createOscillator(),
        lfoG = c.createGain();
      lfo.type = p.shape || "sine";
      lfo.frequency.value = p.rate || 0.5;
      lfoG.gain.value = p.depth || 1.0;
      lfo.connect(lfoG);
      lfoG.connect(pan.pan);
      lfo.start();
      const apply = (par) => {
        const t = c.currentTime;
        lfo.type = par.shape || "sine";
        lfo.frequency.setTargetAtTime(par.rate || 0.5, t, 0.05);
        lfoG.gain.setTargetAtTime(par.depth || 1.0, t, 0.05);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "rate") return lfo.frequency;
          if (k === "depth") return lfoG.gain;
          return null;
        },
        destroy() {
          try {
            lfo.stop();
          } catch (e) {}
          try {
            [inp, out, pan, lfo, lfoG].forEach((n) => n.disconnect());
          } catch (e) {}
        },
      };
    },
  },
  vintagephaser: {
    name: "Vintage Phaser",
    defaults: {
      rate: 0.4,
      depth: 0.8,
      wet: 0.5,
      feedback: 0.5,
      stages: 6,
      drift: 0.15,
    },
    params: [
      {
        key: "rate",
        label: "Rate Hz",
        min: 0.05,
        max: 8,
        step: 0.05,
        unit: "Hz",
      },
      { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01, unit: "" },
      { key: "wet", label: "Wet", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01,
        unit: "",
      },
      { key: "stages", label: "Stages", min: 2, max: 12, step: 1, unit: "" },
      {
        key: "drift",
        label: "LFO Drift",
        min: 0,
        max: 1,
        step: 0.01,
        unit: "",
      },
    ],
    build(c, p) {
      p = Object.assign(
        {
          rate: 0.4,
          depth: 0.8,
          wet: 0.5,
          feedback: 0.5,
          stages: 6,
          drift: 0.15,
        },
        p || {}
      );
      const inp = c.createGain(),
        out = c.createGain(),
        dry = c.createGain(),
        wet = c.createGain();
      const stageFilters = [];
      let cur = inp;
      const stageCount = Math.max(2, Math.min(12, p.stages || 6));
      for (let i = 0; i < stageCount; i++) {
        const f = c.createBiquadFilter();
        f.type = "allpass";
        f.frequency.value = 200 + i * 400;
        f.Q.value = 1.2;
        cur.connect(f);
        cur = f;
        stageFilters.push(f);
      }
      const fb = c.createGain();
      fb.gain.value = p.feedback;
      cur.connect(fb);
      fb.connect(stageFilters[0]);
      cur.connect(wet);
      inp.connect(dry);
      dry.connect(out);
      wet.connect(out);
      const lfo = c.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = p.rate;
      const lfoGain = c.createGain();
      lfoGain.gain.value = p.depth * 1200;
      lfo.connect(lfoGain);
      stageFilters.forEach((f, idx) => {
        const stageAmp = c.createGain();
        const multiplier = 1 + idx * 0.4;
        lfoGain.connect(stageAmp);
        stageAmp.connect(f.frequency);
        stageAmp.gain.value = multiplier;
      });
      const driftLfo = c.createOscillator();
      driftLfo.type = "sine";
      driftLfo.frequency.value = 0.07;
      const driftGain = c.createGain();
      driftGain.gain.value = p.drift * 0.1;
      driftLfo.connect(driftGain);
      driftGain.connect(lfo.frequency);
      lfo.start();
      driftLfo.start();
      const apply = (par) => {
        const t = c.currentTime;
        lfo.frequency.setTargetAtTime(par.rate, t, 0.05);
        lfoGain.gain.setTargetAtTime(par.depth * 1200, t, 0.05);
        fb.gain.setTargetAtTime(
          Math.max(0, Math.min(0.9, par.feedback)),
          t,
          0.05
        );
        wet.gain.setTargetAtTime(par.wet, t, 0.05);
        dry.gain.setTargetAtTime(1 - par.wet, t, 0.05);
        driftGain.gain.setTargetAtTime((par.drift || 0) * 0.1, t, 0.2);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "rate") return lfo.frequency;
          if (k === "depth") return lfoGain.gain;
          if (k === "wet") return wet.gain;
          if (k === "feedback") return fb.gain;
          return null;
        },
        destroy() {
          try {
            lfo.stop();
            driftLfo.stop();
          } catch (e) {}
          try {
            [
              inp,
              out,
              dry,
              wet,
              fb,
              lfo,
              lfoGain,
              driftLfo,
              driftGain,
              ...stageFilters,
            ].forEach((n) => n.disconnect());
          } catch (e) {}
        },
      };
    },
  },
  multibanddelay: {
    name: "Multiband Delay",
    defaults: {
      lowTime: 0.25,
      midTime: 0.5,
      highTime: 0.75,
      lowWet: 0.4,
      midWet: 0.3,
      highWet: 0.2,
      feedback: 0.35,
      splitLow: 300,
      splitHigh: 3000,
    },
    params: [
      {
        key: "lowTime",
        label: "Low Time",
        min: 0.01,
        max: 2,
        step: 0.01,
        unit: "s",
      },
      {
        key: "midTime",
        label: "Mid Time",
        min: 0.01,
        max: 2,
        step: 0.01,
        unit: "s",
      },
      {
        key: "highTime",
        label: "High Time",
        min: 0.01,
        max: 2,
        step: 0.01,
        unit: "s",
      },
      { key: "lowWet", label: "Low Wet", min: 0, max: 1, step: 0.01, unit: "" },
      { key: "midWet", label: "Mid Wet", min: 0, max: 1, step: 0.01, unit: "" },
      {
        key: "highWet",
        label: "High Wet",
        min: 0,
        max: 1,
        step: 0.01,
        unit: "",
      },
      {
        key: "feedback",
        label: "Feedback",
        min: 0,
        max: 0.9,
        step: 0.01,
        unit: "",
      },
      {
        key: "splitLow",
        label: "Low Split",
        min: 60,
        max: 1000,
        step: 10,
        unit: "Hz",
      },
      {
        key: "splitHigh",
        label: "Hi Split",
        min: 1000,
        max: 8000,
        step: 50,
        unit: "Hz",
      },
    ],
    build(c, p) {
      p = Object.assign(
        {
          lowTime: 0.25,
          midTime: 0.5,
          highTime: 0.75,
          lowWet: 0.4,
          midWet: 0.3,
          highWet: 0.2,
          feedback: 0.35,
          splitLow: 300,
          splitHigh: 3000,
        },
        p || {}
      );
      const inp = c.createGain(),
        out = c.createGain();
      const lpLow = c.createBiquadFilter();
      lpLow.type = "lowpass";
      lpLow.frequency.value = p.splitLow;
      lpLow.Q.value = 0.7;
      const lpMid = c.createBiquadFilter();
      lpMid.type = "lowpass";
      lpMid.frequency.value = p.splitHigh;
      lpMid.Q.value = 0.7;
      const hpMid = c.createBiquadFilter();
      hpMid.type = "highpass";
      hpMid.frequency.value = p.splitLow;
      hpMid.Q.value = 0.7;
      const hpHigh = c.createBiquadFilter();
      hpHigh.type = "highpass";
      hpHigh.frequency.value = p.splitHigh;
      hpHigh.Q.value = 0.7;
      const dLow = c.createDelay(2),
        dMid = c.createDelay(2),
        dHigh = c.createDelay(2);
      const fLow = c.createGain(),
        fMid = c.createGain(),
        fHigh = c.createGain();
      const wLow = c.createGain(),
        wMid = c.createGain(),
        wHigh = c.createGain();
      dLow.delayTime.value = p.lowTime;
      dMid.delayTime.value = p.midTime;
      dHigh.delayTime.value = p.highTime;
      fLow.gain.value = p.feedback;
      fMid.gain.value = p.feedback;
      fHigh.gain.value = p.feedback;
      wLow.gain.value = p.lowWet;
      wMid.gain.value = p.midWet;
      wHigh.gain.value = p.highWet;
      inp.connect(lpLow);
      lpLow.connect(dLow);
      inp.connect(hpMid);
      hpMid.connect(lpMid);
      lpMid.connect(dMid);
      inp.connect(hpHigh);
      hpHigh.connect(dHigh);
      dLow.connect(fLow);
      fLow.connect(dLow);
      dMid.connect(fMid);
      fMid.connect(dMid);
      dHigh.connect(fHigh);
      fHigh.connect(dHigh);
      dLow.connect(wLow);
      wLow.connect(out);
      dMid.connect(wMid);
      wMid.connect(out);
      dHigh.connect(wHigh);
      wHigh.connect(out);
      inp.connect(out);
      const apply = (par) => {
        const t = c.currentTime;
        dLow.delayTime.setTargetAtTime(
          Math.max(0.01, Math.min(1.9, par.lowTime)),
          t,
          0.02
        );
        dMid.delayTime.setTargetAtTime(
          Math.max(0.01, Math.min(1.9, par.midTime)),
          t,
          0.02
        );
        dHigh.delayTime.setTargetAtTime(
          Math.max(0.01, Math.min(1.9, par.highTime)),
          t,
          0.02
        );
        wLow.gain.setTargetAtTime(par.lowWet, t, 0.02);
        wMid.gain.setTargetAtTime(par.midWet, t, 0.02);
        wHigh.gain.setTargetAtTime(par.highWet, t, 0.02);
        fLow.gain.setTargetAtTime(
          Math.max(0, Math.min(0.9, par.feedback)),
          t,
          0.02
        );
        fMid.gain.setTargetAtTime(
          Math.max(0, Math.min(0.9, par.feedback)),
          t,
          0.02
        );
        fHigh.gain.setTargetAtTime(
          Math.max(0, Math.min(0.9, par.feedback)),
          t,
          0.02
        );
        lpLow.frequency.setTargetAtTime(par.splitLow, t, 0.05);
        lpMid.frequency.setTargetAtTime(par.splitHigh, t, 0.05);
        hpMid.frequency.setTargetAtTime(par.splitLow, t, 0.05);
        hpHigh.frequency.setTargetAtTime(par.splitHigh, t, 0.05);
      };
      apply(p);
      return {
        input: inp,
        output: out,
        update: apply,
        getAudioParam(k) {
          if (k === "lowWet") return wLow.gain;
          if (k === "midWet") return wMid.gain;
          if (k === "highWet") return wHigh.gain;
          if (k === "feedback") return fLow.gain;
          return null;
        },
        destroy() {
          try {
            [
              inp,
              out,
              lpLow,
              lpMid,
              hpMid,
              hpHigh,
              dLow,
              dMid,
              dHigh,
              fLow,
              fMid,
              fHigh,
              wLow,
              wMid,
              wHigh,
            ].forEach((n) => n.disconnect());
          } catch (e) {}
        },
      };
    },
  },
};
function createEffect(type) {
  const d = EFFECT_DEFS[type];
  if (!d) return null;
  return {
    id: genId("fx"),
    type,
    enabled: true,
    params: JSON.parse(JSON.stringify(d.defaults)),
  };
}
function buildTrackChain(c, track) {
  const built = [],
    fxMap = {};
  const iG = c.createGain(),
    oG = c.createGain();
  let cur = iG;
  (track.effects || []).forEach((fx) => {
    if (!fx.enabled) return;
    const d = EFFECT_DEFS[fx.type];
    if (!d) return;
    try {
      const m = d.build(c, fx.params || d.defaults);
      cur.connect(m.input);
      built.push(m);
      fxMap[fx.id] = { module: m, def: d, fx };
      cur = m.output;
    } catch (e) {
      console.warn("fx", e);
    }
  });
  cur.connect(oG);
  return { input: iG, output: oG, nodes: built, fxMap };
}

/* ---------- Pattern ---------- */
function createEmptyPattern() {
  const p = { steps: {}, pianoRoll: {} };
  TRACKS.forEach((t) => {
    if (t.type === "melodic") {
      p.steps[t.id] = new Array(64).fill(0);
      p.pianoRoll[t.id] = [];
    } else if (t.type === "sample") {
      p.steps[t.id] = new Array(64).fill(null);
      p.pianoRoll[t.id] = []; // ← NEW: leeres Piano-Roll-Set
    } else {
      p.steps[t.id] = new Array(64).fill(null);
    }
  });
  return p;
}
function defaultStep() {
  return { on: true, vel: 100, prob: 1, ratchet: 1, offset: 0, accent: false };
}
function isStepOn(p, tid, st) {
  const s = p.steps[tid][st];
  if (s === null || s === undefined || s === 0) return false;
  if (s === 1) return true;
  return !!s.on;
}
function getStepData(p, tid, st) {
  const s = p.steps[tid][st];
  if (s === null || s === undefined || s === 0) return null;
  if (s === 1) return defaultStep();
  return s;
}
function repeat16(pat) {
  const o = new Array(64).fill(0);
  for (let i = 0; i < 64; i++) o[i] = pat[i % 16];
  return o;
}
function toStepArray(b16) {
  const o = new Array(64).fill(null);
  for (let i = 0; i < 64; i++) if (b16[i % 16]) o[i] = defaultStep();
  return o;
}
function syncMelodicSteps(p) {
  TRACKS.forEach((t) => {
    if (t.type !== "melodic") return;
    const m = new Array(64).fill(0);
    p.pianoRoll[t.id].forEach((n) => {
      const s = Math.max(0, Math.min(63, Math.floor(n.start)));
      m[s] = 1;
    });
    p.steps[t.id] = m;
  });
}
function migrateStepIndexedToFlat(stepArr) {
  const notes = [];
  if (!Array.isArray(stepArr)) return notes;
  for (let step = 0; step < stepArr.length; step++) {
    const a = stepArr[step];
    if (!Array.isArray(a)) continue;
    for (const n of a) {
      if (typeof n === "number")
        notes.push({ id: genId("n"), start: step, len: 1, midi: n, vel: 100 });
      else if (n && typeof n.midi === "number")
        notes.push({
          id: genId("n"),
          start: step,
          len: Math.max(1, n.len | 0 || 1),
          midi: n.midi,
          vel: n.vel | 0 || 100,
        });
    }
  }
  return notes;
}
function initDefaultPatterns() {
  PATTERN_IDS.forEach((id) => (patterns[id] = createEmptyPattern()));
  const A = patterns.A;
  A.steps.kick = toStepArray([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
  A.steps.snare = toStepArray([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
  A.steps.hat = toStepArray([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  A.steps.clap = toStepArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
  A.pianoRoll.bass.push(
    { id: genId("n"), start: 0, len: 2, midi: 36, vel: 110 },
    { id: genId("n"), start: 6, len: 2, midi: 43, vel: 100 },
    { id: genId("n"), start: 8, len: 2, midi: 36, vel: 110 },
    { id: genId("n"), start: 14, len: 2, midi: 41, vel: 100 }
  );
  A.pianoRoll.piano.push(
    { id: genId("n"), start: 0, len: 2, midi: 60, vel: 90 },
    { id: genId("n"), start: 4, len: 2, midi: 64, vel: 90 },
    { id: genId("n"), start: 8, len: 4, midi: 67, vel: 95 }
  );
  syncMelodicSteps(A);
}

/* ---------- Automation ---------- */
function getAutoTargets() {
  const list = [
    {
      id: "master.volume",
      label: "Master · Volume",
      min: 0,
      max: 1.2,
      def: 0.8,
      resolve: (g) => g.master.gain,
    },
  ];
  TRACKS.forEach((t) => {
    list.push({
      id: "track." + t.id + ".volume",
      label: t.name + " · Volume",
      min: 0,
      max: 1.2,
      def: t.volume,
      resolve: (g) => g.buses[t.id]?.gain?.gain,
    });
    list.push({
      id: "track." + t.id + ".pan",
      label: t.name + " · Pan",
      min: -1,
      max: 1,
      def: t.pan,
      resolve: (g) => g.buses[t.id]?.panner?.pan,
    });
    list.push({
      id: "track." + t.id + ".send",
      label: t.name + " · Send",
      min: 0,
      max: 1,
      def: t.send,
      resolve: (g) => g.buses[t.id]?.send?.gain,
    });
    list.push({
      id: "track." + t.id + ".cutoff",
      label: t.name + " · Cutoff",
      min: 20,
      max: 20000,
      def: 20000,
      curveLog: true,
      resolve: (g) => g.buses[t.id]?.filter?.frequency,
    });
    list.push({
      id: "track." + t.id + ".q",
      label: t.name + " · Q",
      min: 0.1,
      max: 20,
      def: 0.7,
      resolve: (g) => g.buses[t.id]?.filter?.Q,
    });
    (t.effects || []).forEach((fx) => {
      const d = EFFECT_DEFS[fx.type];
      if (!d) return;
      d.params.forEach((p) => {
        if (p.type === "select") return;
        list.push({
          id: "fx." + t.id + "." + fx.id + "." + p.key,
          label: t.name + " · " + d.name + " · " + p.label,
          min: p.min,
          max: p.max,
          def: (fx.params && fx.params[p.key]) ?? p.min,
          resolve: (g) => {
            const m = g._fxMaps && g._fxMaps[t.id];
            if (!m) return null;
            const e = m[fx.id];
            if (!e || !e.module.getAudioParam) return null;
            return e.module.getAudioParam(p.key);
          },
        });
      });
    });
  });
  return list;
}
function findAutoTarget(id) {
  return getAutoTargets().find((t) => t.id === id);
}
function createAutoLane(tid) {
  const t = findAutoTarget(tid);
  if (!t) return null;
  const dn = (t.def - t.min) / (t.max - t.min);
  return {
    id: genId("lane"),
    target: tid,
    curve: "linear",
    clips: [
      {
        id: genId("ac"),
        startStep: 0,
        lengthSteps: 64,
        points: [
          { step: 0, value: dn },
          { step: 64, value: dn },
        ],
      },
    ],
  };
}
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t,
    t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}
function evalAutoLaneFloat(lane, s) {
  const tgt = findAutoTarget(lane.target);
  if (!tgt) return null;
  const clip = lane.clips.find(
    (cl) => s >= cl.startStep && s < cl.startStep + cl.lengthSteps
  );
  if (!clip) return null;
  const local = s - clip.startStep;
  const pts = clip.points.slice().sort((a, b) => a.step - b.step);
  if (!pts.length) return null;
  if (local <= pts[0].step) return tgt.min + pts[0].value * (tgt.max - tgt.min);
  if (local >= pts[pts.length - 1].step)
    return tgt.min + pts[pts.length - 1].value * (tgt.max - tgt.min);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i],
      b = pts[i + 1];
    if (local >= a.step && local <= b.step) {
      const sp = b.step - a.step;
      if (sp <= 0) return tgt.min + b.value * (tgt.max - tgt.min);
      const t = (local - a.step) / sp;
      let norm;
      if (lane.curve === "hold") norm = a.value;
      else if (lane.curve === "smooth") {
        const p0 = i > 0 ? pts[i - 1].value : a.value,
          p1 = a.value,
          p2 = b.value,
          p3 = i < pts.length - 2 ? pts[i + 2].value : b.value;
        norm = catmullRom(p0, p1, p2, p3, t);
        norm = Math.max(0, Math.min(1, norm));
      } else norm = a.value + (b.value - a.value) * t;
      if (tgt.curveLog) {
        const lo = Math.log(Math.max(1, tgt.min)),
          hi = Math.log(tgt.max);
        return Math.exp(lo + norm * (hi - lo));
      }
      return tgt.min + norm * (tgt.max - tgt.min);
    }
  }
  return null;
}
function applyAutomationForStep(graph, step, time, stepDur) {
  const targets = getAutoTargets();
  automation.lanes.forEach((lane) => {
    const tgt = targets.find((t) => t.id === lane.target);
    if (!tgt) return;
    const param = tgt.resolve(graph);
    if (!param) return;
    try {
      param.cancelScheduledValues(time);
    } catch (e) {}

    // v19: alle verlinkten Ziele dieser Lane mit-steuern
    const linkedTargets = controllerLinks
      .filter((l) => l.laneId === lane.id)
      .map((l) => targets.find((t) => t.id === l.targetId))
      .filter(Boolean);

    if (lane.curve === "smooth") {
      const SD = 6,
        subD = stepDur / SD;
      for (let i = 0; i <= SD; i++) {
        const sf = step + i / SD;
        const v = evalAutoLaneFloat(lane, sf);
        const val = v == null ? tgt.def : v;
        if (i === 0) {
          param.setValueAtTime(val, time);
        } else {
          param.linearRampToValueAtTime(val, time + i * subD);
        }
        // v19: Link-Ziele mit gleichem Wert
        linkedTargets.forEach((lt) => {
          const lp = lt.resolve(graph);
          if (!lp) return;
          const lval = v == null ? lt.def : v;
          try {
            if (i === 0) lp.setValueAtTime(lval, time);
            else lp.linearRampToValueAtTime(lval, time + i * subD);
          } catch (e) {}
        });
      }
    } else {
      const v0 = evalAutoLaneFloat(lane, step),
        v1 = evalAutoLaneFloat(lane, step + 1);
      const a = v0 == null ? tgt.def : v0,
        b = v1 == null ? a : v1;
      param.setValueAtTime(a, time);
      if (stepDur > 0) param.linearRampToValueAtTime(b, time + stepDur);
      // v19: Link-Ziele
      linkedTargets.forEach((lt) => {
        const lp = lt.resolve(graph);
        if (!lp) return;
        try {
          lp.setValueAtTime(a, time);
          if (stepDur > 0) lp.linearRampToValueAtTime(b, time + stepDur);
        } catch (e) {}
      });
    }
  });
}

/* ---------- Serialize / Migrate ---------- */
function serialize() {
  return {
    version: 18,
    transport: {
      bpm,
      master,
      reverbAmount,
      swing,
      stepCount,
      humanizeTiming,
      humanizeVelocity,
      projectSeed,
      metronomeOn,
      metronomeVol,
      drumKitId,
      masterLowpassFreq,
      reverbPresetId,
      reverbDecay,
      reverbDamp,
      reverbDuration,
      masterEQLow,
      masterEQMid,
      masterEQHigh,
      metronomeSound,
      masteringWidth,
      masteringLimiterOn,
      masteringLimiterCeiling,
      grooveTemplateId,
      grooveStrength,
    },
    currentPattern,
    playMode,
    tracks: TRACKS.map((t) => ({
      id: t.id,
      volume: t.volume,
      pan: t.pan,
      send: t.send,
      mute: t.mute,
      solo: t.solo,
      filter: { cutoff: t.filter.cutoff, q: t.filter.q },
      synth: t.synth,
      rootMidi: t.type === "sample" ? t.rootMidi || 60 : undefined,
      sidechain: t.sidechain,
      sidechainAmount: t.sidechainAmount,
      sidechainRelease: t.sidechainRelease,
      presetName: t.presetName || null,
      presetId: t.presetId || null,
      drumPresetId: t.drumPresetId || null,
      arp: t.arp
        ? JSON.parse(JSON.stringify(t.arp))
        : { enabled: false, rate: 4, mode: "up", octaves: 1 },
      inputGain: typeof t.inputGain === "number" ? t.inputGain : 1.0,
      effects: (t.effects || []).map((fx) => ({
        id: fx.id,
        type: fx.type,
        enabled: !!fx.enabled,
        params: JSON.parse(JSON.stringify(fx.params)),
      })),
    })),
    patterns: PATTERN_IDS.reduce((acc, id) => {
      const p = patterns[id];
      const sp = { steps: {}, pianoRoll: {} };
      TRACKS.forEach((t) => {
        sp.steps[t.id] = p.steps[t.id].slice(0, 64).map((v) => {
          if (v === null || v === undefined || v === 0 || v === 1)
            return v === 1 ? defaultStep() : null;
          return {
            on: !!v.on,
            vel: v.vel | 0 || 100,
            prob: typeof v.prob === "number" ? v.prob : 1,
            ratchet: v.ratchet | 0 || 1,
            offset: typeof v.offset === "number" ? v.offset : 0,
            accent: !!v.accent,
          };
        });
        // melodic AND sample store pianoRoll
        if (t.type === "melodic" || t.type === "sample") {
          const arr = p.pianoRoll[t.id] || [];
          sp.pianoRoll[t.id] = arr.map((n) => ({
            id: n.id,
            start: n.start,
            len: n.len,
            midi: n.midi,
            vel: n.vel,
          }));
        }
      });
      acc[id] = sp;
      return acc;
    }, {}),
    song: {
      blocks: song.blocks.map((b) => ({
        id: b.id,
        patternId: b.patternId,
        startStep: b.startStep,
        lengthSteps: b.lengthSteps,
        sourceOffsetSteps: b.sourceOffsetSteps || 0,
      })),
      markers: song.markers.map((m) => ({
        id: m.id,
        step: m.step,
        text: m.text,
        color: m.color,
      })),
      loopStart: song.loopStart,
      loopEnd: song.loopEnd,
    },
    automation: {
      lanes: automation.lanes.map((l) => ({
        id: l.id,
        target: l.target,
        curve: l.curve,
        clips: l.clips.map((cl) => ({
          id: cl.id,
          startStep: cl.startStep,
          lengthSteps: cl.lengthSteps,
          points: cl.points.map((pt) => ({ step: pt.step, value: pt.value })),
        })),
      })),
    },
    samples: Object.fromEntries(
      Object.entries(samples).map(([k, v]) => [
        k,
        {
          id: v.id,
          name: v.name,
          start: v.start || 0,
          end: v.end,
          gain: v.gain ?? 1,
          reverse: !!v.reverse,
          fadeIn: v.fadeIn || 0,
          fadeOut: v.fadeOut || 0,
          slices: v.slices || [],
          tuneRate: v.tuneRate || 1,
        },
      ])
    ),
    userPresets,
    /* v19 */
    patternMeta,
    controllerLinks,
    perfQuantize,
    perfFollowSteps,
    metadata: {
      createdAt: new Date().toISOString(),
      app: "fl-clone",
      appVersion: "19.0.0",
    },
  };
}
function migrateV5toV6(d) {
  return {
    version: 6,
    transport: {
      bpm: d.bpm ?? 120,
      master: d.master ?? 0.8,
      reverbAmount: d.reverbAmount ?? 0.35,
      swing: d.swing ?? 0,
      stepCount: d.stepCount ?? 16,
    },
    currentPattern: PATTERN_IDS.includes(d.currentPattern)
      ? d.currentPattern
      : "A",
    playMode: "pattern",
    tracks: d.tracks || [],
    patterns: d.patterns || {},
    song: { clips: [], loopStart: 0, loopEnd: 0 },
    samples: (() => {
      const o = {};
      if (d.sampleNames)
        Object.entries(d.sampleNames).forEach(([id, name]) => {
          o[id] = { id: null, name, missing: true };
        });
      return o;
    })(),
    metadata: { migratedFrom: 5 },
  };
}
function migrateV6toV7(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 7;
  if (o.patterns) {
    PATTERN_IDS.forEach((id) => {
      const p = o.patterns[id];
      if (!p || !p.pianoRoll) return;
      TRACKS.forEach((t) => {
        if (t.type !== "melodic") return;
        const a = p.pianoRoll[t.id];
        if (
          Array.isArray(a) &&
          a.length <= 64 &&
          a.every((el) => Array.isArray(el))
        )
          p.pianoRoll[t.id] = migrateStepIndexedToFlat(a);
        else if (Array.isArray(a))
          p.pianoRoll[t.id] = a.map((n) => ({
            id: n.id || genId("n"),
            start: n.start | 0,
            len: Math.max(1, n.len | 0 || 1),
            midi: n.midi | 0,
            vel: n.vel | 0 || 100,
          }));
        else p.pianoRoll[t.id] = [];
      });
    });
  }
  return o;
}
function migrateV7toV8(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 8;
  if (Array.isArray(o.tracks))
    o.tracks.forEach((t) => {
      if (!Array.isArray(t.effects)) t.effects = [];
    });
  if (!o.automation) o.automation = { lanes: [] };
  return o;
}
function migrateV8toV9(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 9;
  if (Array.isArray(o.tracks))
    o.tracks.forEach((t) => {
      if (!t.filter) t.filter = { cutoff: 20000, q: 0.7 };
    });
  if (o.automation && Array.isArray(o.automation.lanes))
    o.automation.lanes.forEach((l) => {
      if (l.curve !== "hold" && l.curve !== "smooth") l.curve = "linear";
    });
  return o;
}
function migrateV9toV10(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 10;
  if (o.patterns) {
    PATTERN_IDS.forEach((id) => {
      const p = o.patterns[id];
      if (!p || !p.steps) return;
      TRACKS.forEach((t) => {
        if (t.type === "melodic") return;
        const a = p.steps[t.id];
        if (!Array.isArray(a)) return;
        p.steps[t.id] = a.map((v) => {
          if (v === 1) return defaultStep();
          if (v === 0 || v === null || v === undefined) return null;
          if (typeof v === "object")
            return {
              on: v.on !== false,
              vel: v.vel | 0 || 100,
              prob:
                typeof v.prob === "number"
                  ? Math.max(0, Math.min(1, v.prob))
                  : 1,
              ratchet: Math.max(1, Math.min(8, v.ratchet | 0 || 1)),
              offset: Math.max(
                -0.5,
                Math.min(0.5, typeof v.offset === "number" ? v.offset : 0)
              ),
              accent: !!v.accent,
            };
          return null;
        });
      });
    });
  }
  if (!o.transport) o.transport = {};
  if (typeof o.transport.humanizeTiming !== "number")
    o.transport.humanizeTiming = 0;
  if (typeof o.transport.humanizeVelocity !== "number")
    o.transport.humanizeVelocity = 0;
  if (typeof o.transport.projectSeed !== "string")
    o.transport.projectSeed = "flclone-default";
  return o;
}
function migrateV10toV11(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 11;
  if (o.song && Array.isArray(o.song.clips))
    o.song.clips.forEach((c) => {
      if (typeof c.sourceOffsetSteps !== "number") c.sourceOffsetSteps = 0;
    });
  return o;
}
function migrateV11toV12(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 12;
  if (o.song && Array.isArray(o.song.clips)) {
    const map = new Map();
    o.song.clips.forEach((c) => {
      if (!c || !c.patternId) return;
      const key = c.patternId + "|" + (c.startStep | 0);
      const ex = map.get(key);
      const len = Math.max(1, c.lengthSteps | 0 || 16);
      const off = Math.max(0, c.sourceOffsetSteps | 0 || 0);
      if (!ex || len > ex.lengthSteps) {
        map.set(key, {
          id: ex?.id || genId("block"),
          patternId: c.patternId,
          startStep: c.startStep | 0,
          lengthSteps: len,
          sourceOffsetSteps: off,
        });
      }
    });
    o.song.blocks = Array.from(map.values());
    delete o.song.clips;
  }
  if (o.song && !Array.isArray(o.song.blocks)) o.song.blocks = [];
  return o;
}
function migrateV12toV13(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 13;
  if (o.samples) {
    Object.keys(o.samples).forEach((k) => {
      if (o.samples[k]) {
        if (typeof o.samples[k].start !== "number") o.samples[k].start = 0;
        if (typeof o.samples[k].gain !== "number") o.samples[k].gain = 1.0;
        if (typeof o.samples[k].fadeIn !== "number") o.samples[k].fadeIn = 0;
        if (typeof o.samples[k].fadeOut !== "number") o.samples[k].fadeOut = 0;
      }
    });
  }
  return o;
}
function migrateV13toV14(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 14;
  if (o.transport) {
    if (typeof o.transport.metronomeOn === "undefined")
      o.transport.metronomeOn = false;
    if (typeof o.transport.metronomeVol === "undefined")
      o.transport.metronomeVol = 0.5;
  }
  if (Array.isArray(o.tracks)) {
    o.tracks.forEach((t) => {
      if (!t.synth) {
        const def = TRACKS.find((x) => x.id === t.id);
        if (def && def.synth) t.synth = JSON.parse(JSON.stringify(def.synth));
        else t.synth = { a: 0.01, d: 0.1, s: 0.5, r: 0.1, cutoff: 20000, q: 1 };
      }
    });
  }
  return o;
}
function migrateV14toV15(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 15;
  return o;
}
function migrateV15toV16(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 16;
  if (!o.song.markers) o.song.markers = [];
  return o;
}
function migrateV16toV17(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 17;
  if (!o.userPresets) o.userPresets = [];
  if (o.samples) {
    Object.keys(o.samples).forEach((k) => {
      if (o.samples[k] && !Array.isArray(o.samples[k].slices)) {
        o.samples[k].slices = [];
      }
    });
  }
  return o;
}
function migrateV17toV18(d) {
  const o = JSON.parse(JSON.stringify(d));
  o.version = 18;
  if (!o.transport) o.transport = {};
  if (typeof o.transport.masteringWidth !== "number")
    o.transport.masteringWidth = 1.0;
  if (typeof o.transport.masteringLimiterOn !== "boolean")
    o.transport.masteringLimiterOn = true;
  if (typeof o.transport.masteringLimiterCeiling !== "number")
    o.transport.masteringLimiterCeiling = -0.1;
  if (typeof o.transport.grooveTemplateId !== "string")
    o.transport.grooveTemplateId = "straight";
  if (typeof o.transport.grooveStrength !== "number")
    o.transport.grooveStrength = 0.0;
  return o;
}
function apply(data) {
  if (!data || typeof data !== "object")
    return { ok: false, msg: "Not an object" };
  let proj = data;
  if (proj.version === 5) {
    proj = migrateV5toV6(proj);
    toast("Migrating v5 → v6", "info");
  }
  if (proj.version === 6) {
    proj = migrateV6toV7(proj);
    toast("Migrating v6 → v7", "info");
  }
  if (proj.version === 7) {
    proj = migrateV7toV8(proj);
    toast("Migrating v7 → v8", "info");
  }
  if (proj.version === 8) {
    proj = migrateV8toV9(proj);
    toast("Migrating v8 → v9", "info");
  }
  if (proj.version === 9) {
    proj = migrateV9toV10(proj);
    toast("Migrating v9 → v10", "info");
  }
  if (proj.version === 10) {
    proj = migrateV10toV11(proj);
    toast("Migrating v10 → v11", "info");
  }
  if (proj.version === 11) {
    proj = migrateV11toV12(proj);
    toast("Migrating v11 → v12", "info");
  }
  if (proj.version === 12) {
    proj = migrateV12toV13(proj);
    toast("Migrating v12 → v13", "info");
  }
  if (proj.version === 13) {
    proj = migrateV13toV14(proj);
    toast("Migrating v13 → v14", "info");
  }
  if (proj.version === 14) {
    proj = migrateV14toV15(proj);
    toast("Migrating v14 → v15", "info");
  }
  if (proj.version === 15) {
    proj = migrateV15toV16(proj);
    toast("Migrating v15 → v16", "info");
  }
  if (proj.version === 16) {
    proj = migrateV16toV17(proj);
    toast("Migrating v16 → v17", "info");
  }
  if (proj.version === 17) {
    proj = migrateV17toV18(proj);
    toast("Migrating v17 → v18", "info");
  }
  if (proj.version === 18) {
    proj.version = 19;
    toast("Migrating v18 → v19", "info");
  }
  if (proj.version !== 19)
    return { ok: false, msg: "Unknown version: " + data.version };

  const tr = proj.transport || {};
  if (typeof tr.bpm === "number") bpm = tr.bpm;
  if (typeof tr.master === "number") master = tr.master;
  if (typeof tr.reverbAmount === "number") reverbAmount = tr.reverbAmount;
  if (typeof tr.swing === "number") swing = tr.swing;
  if ([16, 32, 64].includes(tr.stepCount)) stepCount = tr.stepCount;
  if (typeof tr.humanizeTiming === "number") humanizeTiming = tr.humanizeTiming;
  if (typeof tr.humanizeVelocity === "number")
    humanizeVelocity = tr.humanizeVelocity;
  if (typeof tr.projectSeed === "string") projectSeed = tr.projectSeed;
  if (typeof tr.metronomeOn === "boolean") metronomeOn = tr.metronomeOn;
  if (typeof tr.metronomeVol === "number") metronomeVol = tr.metronomeVol;
  if (
    typeof tr.reverbPresetId === "string" &&
    REVERB_PRESETS[tr.reverbPresetId]
  )
    reverbPresetId = tr.reverbPresetId;
  if (typeof tr.reverbDecay === "number")
    reverbDecay = Math.max(0.1, Math.min(8, tr.reverbDecay));
  if (typeof tr.reverbDamp === "number")
    reverbDamp = Math.max(0, Math.min(0.98, tr.reverbDamp));
  if (typeof tr.reverbDuration === "number")
    reverbDuration = Math.max(0.2, Math.min(10, tr.reverbDuration));
  if (typeof tr.masterEQLow === "number")
    masterEQLow = Math.max(-24, Math.min(24, tr.masterEQLow));
  if (typeof tr.masterEQMid === "number")
    masterEQMid = Math.max(-24, Math.min(24, tr.masterEQMid));
  if (typeof tr.masterEQHigh === "number")
    masterEQHigh = Math.max(-24, Math.min(24, tr.masterEQHigh));
  if (
    typeof tr.metronomeSound === "string" &&
    METRONOME_SOUNDS[tr.metronomeSound]
  )
    metronomeSound = tr.metronomeSound;
  if (typeof tr.masteringWidth === "number")
    masteringWidth = Math.max(0, Math.min(2, tr.masteringWidth));
  if (typeof tr.masteringLimiterOn === "boolean")
    masteringLimiterOn = tr.masteringLimiterOn;
  if (typeof tr.masteringLimiterCeiling === "number")
    masteringLimiterCeiling = Math.max(
      -12,
      Math.min(0, tr.masteringLimiterCeiling)
    );
  if (
    typeof tr.grooveTemplateId === "string" &&
    GROOVE_TEMPLATES[tr.grooveTemplateId]
  )
    grooveTemplateId = tr.grooveTemplateId;
  if (typeof tr.grooveStrength === "number")
    grooveStrength = Math.max(0, Math.min(1, tr.grooveStrength));
  if (PATTERN_IDS.includes(proj.currentPattern))
    currentPattern = proj.currentPattern;
  if (["pattern", "song"].includes(proj.playMode)) playMode = proj.playMode;
  if (Array.isArray(proj.tracks)) {
    proj.tracks.forEach((t) => {
      const l = TRACKS.find((x) => x.id === t.id);
      if (!l) return;
      if (typeof t.volume === "number") l.volume = t.volume;
      if (typeof t.pan === "number") l.pan = t.pan;
      if (typeof t.send === "number") l.send = t.send;
      l.mute = !!t.mute;
      l.solo = !!t.solo;
      if (t.filter) {
        if (typeof t.filter.cutoff === "number")
          l.filter.cutoff = Math.max(20, Math.min(20000, t.filter.cutoff));
        if (typeof t.filter.q === "number")
          l.filter.q = Math.max(0.1, Math.min(20, t.filter.q));
      }
      if (t.synth) l.synth = t.synth;
      l.presetName = t.presetName || null;
      l.presetId = t.presetId || null;
      l.drumPresetId =
        typeof t.drumPresetId === "string" &&
        DRUM_PRESETS[l.id] &&
        DRUM_PRESETS[l.id][t.drumPresetId]
          ? t.drumPresetId
          : null;
      if (typeof t.sidechain === "boolean") l.sidechain = t.sidechain;
      else l.sidechain = false;
      if (typeof t.sidechainAmount === "number")
        l.sidechainAmount = Math.max(0, Math.min(1, t.sidechainAmount));
      else l.sidechainAmount = 0.7;
      if (typeof t.sidechainRelease === "number")
        l.sidechainRelease = Math.max(0.02, Math.min(2, t.sidechainRelease));
      else l.sidechainRelease = 0.15;
      if (t.arp && typeof t.arp === "object") {
        l.arp = {
          enabled: !!t.arp.enabled,
          rate: Math.max(1, Math.min(8, t.arp.rate | 0 || 4)),
          mode: ["up", "down", "updown"].includes(t.arp.mode)
            ? t.arp.mode
            : "up",
          octaves: Math.max(1, Math.min(4, t.arp.octaves | 0 || 1)),
        };
      } else {
        l.arp = { enabled: false, rate: 4, mode: "up", octaves: 1 };
      }
      if (typeof t.inputGain === "number")
        l.inputGain = Math.max(0, Math.min(2, t.inputGain));
      else l.inputGain = 1.0;
      if (l.type === "sample" && typeof t.rootMidi === "number")
        l.rootMidi = Math.max(0, Math.min(127, t.rootMidi));
      if (Array.isArray(t.effects))
        l.effects = t.effects
          .filter((fx) => fx && EFFECT_DEFS[fx.type])
          .map((fx) => ({
            id: fx.id || genId("fx"),
            type: fx.type,
            enabled: fx.enabled !== false,
            params: Object.assign(
              {},
              EFFECT_DEFS[fx.type].defaults,
              fx.params || {}
            ),
          }));
      else l.effects = [];
    });
  }
  if (proj.patterns) {
    PATTERN_IDS.forEach((id) => {
      const src = proj.patterns[id];
      if (!src) return;
      const p = createEmptyPattern();
      TRACKS.forEach((t) => {
        if (src.steps && Array.isArray(src.steps[t.id])) {
          const a = src.steps[t.id];
          for (let i = 0; i < 64; i++) {
            const v = a[i];
            if (t.type === "melodic") p.steps[t.id][i] = v ? 1 : 0;
            else if (v === 1) p.steps[t.id][i] = defaultStep();
            else if (v === 0 || v == null) p.steps[t.id][i] = null;
            else if (typeof v === "object")
              p.steps[t.id][i] = {
                on: v.on !== false,
                vel: v.vel | 0 || 100,
                prob: typeof v.prob === "number" ? v.prob : 1,
                ratchet: v.ratchet | 0 || 1,
                offset: typeof v.offset === "number" ? v.offset : 0,
                accent: !!v.accent,
              };
            else p.steps[t.id][i] = null;
          }
        }
        if (
          (t.type === "melodic" || t.type === "sample") &&
          src.pianoRoll &&
          Array.isArray(src.pianoRoll[t.id])
        )
          p.pianoRoll[t.id] = src.pianoRoll[t.id].map((n) => ({
            id: n.id || genId("n"),
            start: Math.max(0, n.start | 0),
            len: Math.max(1, n.len | 0 || 1),
            midi: n.midi | 0,
            vel: n.vel | 0 || 100,
          }));
      });
      syncMelodicSteps(p);
      patterns[id] = p;
    });
  }
  song = { blocks: [], markers: [], loopStart: 0, loopEnd: 0 };
  if (proj.song) {
    if (Array.isArray(proj.song.blocks)) {
      song.blocks = proj.song.blocks
        .filter(
          (b) =>
            b &&
            typeof b.startStep === "number" &&
            PATTERN_IDS.includes(b.patternId)
        )
        .map((b) => ({
          id: b.id || genId("block"),
          patternId: b.patternId,
          startStep: Math.max(0, b.startStep | 0),
          lengthSteps: Math.max(1, b.lengthSteps | 0 || 16),
          sourceOffsetSteps: Math.max(
            0,
            typeof b.sourceOffsetSteps === "number"
              ? b.sourceOffsetSteps | 0
              : 0
          ),
        }));
    }
    if (Array.isArray(proj.song.markers)) {
      song.markers = proj.song.markers
        .filter((m) => m && typeof m.step === "number")
        .map((m) => ({
          id: m.id || genId("marker"),
          step: Math.max(0, m.step | 0),
          text: m.text || "Marker",
          color: m.color || "#4ea3ff",
        }));
    }
    if (typeof proj.song.loopStart === "number")
      song.loopStart = proj.song.loopStart;
    if (typeof proj.song.loopEnd === "number") song.loopEnd = proj.song.loopEnd;
  }
  songSelectedIds = new Set();
  automation = { lanes: [] };
  if (proj.automation && Array.isArray(proj.automation.lanes)) {
    proj.automation.lanes.forEach((l) => {
      if (!l || typeof l.target !== "string") return;
      const c = l.curve === "hold" || l.curve === "smooth" ? l.curve : "linear";
      const lane = {
        id: l.id || genId("lane"),
        target: l.target,
        curve: c,
        clips: [],
      };
      if (Array.isArray(l.clips))
        l.clips.forEach((cl) => {
          if (!cl) return;
          lane.clips.push({
            id: cl.id || genId("ac"),
            startStep: Math.max(0, cl.startStep | 0),
            lengthSteps: Math.max(1, cl.lengthSteps | 0 || 16),
            points: Array.isArray(cl.points)
              ? cl.points
                  .filter(
                    (p) =>
                      p &&
                      typeof p.step === "number" &&
                      typeof p.value === "number"
                  )
                  .map((p) => ({
                    step: Math.max(0, p.step | 0),
                    value: Math.max(0, Math.min(1, p.value)),
                  }))
              : [],
          });
        });
      if (findAutoTarget(lane.target)) automation.lanes.push(lane);
    });
  }
  samples = {};
  if (proj.samples)
    Object.entries(proj.samples).forEach(([tid, meta]) => {
      if (!meta || !meta.id) return;
      samples[tid] = {
        id: meta.id,
        name: meta.name || "(unknown)",
        buffer: null,
        missing: true,
        start: meta.start || 0,
        end: meta.end || null,
        reverse: !!meta.reverse,
        gain: typeof meta.gain === "number" ? meta.gain : 1.0,
        fadeIn: meta.fadeIn || 0,
        fadeOut: meta.fadeOut || 0,
        slices: Array.isArray(meta.slices) ? meta.slices : [],
        tuneRate:
          typeof meta.tuneRate === "number"
            ? Math.max(0.25, Math.min(4, meta.tuneRate))
            : 1,
      };
    });

  if (Array.isArray(proj.userPresets)) {
    userPresets = proj.userPresets;
  } else {
    userPresets = [];
  }

  /* v19 */
  if (proj.patternMeta) {
    PATTERN_IDS.forEach((id) => {
      if (proj.patternMeta[id]) patternMeta[id] = proj.patternMeta[id];
    });
  }
  if (Array.isArray(proj.controllerLinks))
    controllerLinks = proj.controllerLinks;
  if (typeof proj.perfQuantize === "number") perfQuantize = proj.perfQuantize;
  if (typeof proj.perfFollowSteps === "number")
    perfFollowSteps = proj.perfFollowSteps;

  document.getElementById("bpm").value = bpm;
  document.getElementById("master").value = master;
  document.getElementById("reverbAmount").value = reverbAmount;
  document.getElementById("swing").value = Math.round(swing * 100);
  document.getElementById("swingVal").textContent =
    Math.round(swing * 100) + "%";
  document.getElementById("humanize").value = Math.round(humanizeTiming * 100);
  document.getElementById("humVal").textContent =
    Math.round(humanizeTiming * 100) + "%";
  document.getElementById("humanizeV").value = Math.round(
    humanizeVelocity * 100
  );
  document.getElementById("humVVal").textContent =
    Math.round(humanizeVelocity * 100) + "%";
  document.getElementById("loopStart").value = song.loopStart;
  document.getElementById("loopEnd").value = song.loopEnd;

  const metroBtn = document.getElementById("metroBtn");
  if (metroBtn) metroBtn.classList.toggle("active", metronomeOn);

  rebuildAudioGraphs();
  rebuildRack();
  rebuildMixer();
  rebuildSong();
  rebuildAutoView();
  closePianoRoll();
  updateSongPlayhead();
  setView(currentView);
  setPlayMode(playMode);

  // ── v16: Master-Nodes nach rebuildAudioGraphs() neu justieren ──
  if (masterLowpassNode && ctx) {
    masterLowpassNode.frequency.setValueAtTime(
      masterLowpassFreq,
      ctx.currentTime
    );
  }
  if (masterEQLowNode) masterEQLowNode.gain.value = masterEQLow;
  if (masterEQMidNode) masterEQMidNode.gain.value = masterEQMid;
  if (masterEQHighNode) masterEQHighNode.gain.value = masterEQHigh;
  if (reverbBus && reverbBus._conv && ctx) {
    try {
      reverbBus._conv.buffer = getReverbImpulse(ctx, reverbPresetId);
    } catch (e) {}
  }

  // ── v17: Mastering-Chain neu justieren ──
  if (stereoWidthNode && ctx) {
    const g = 0.5 * masteringWidth;
    try {
      stereoWidthNode.sSumL.gain.setValueAtTime(g, ctx.currentTime);
      stereoWidthNode.sSumR.gain.setValueAtTime(-g, ctx.currentTime);
    } catch (e) {}
  }
  if (masteringLimiter1 && ctx) {
    try {
      masteringLimiter1.threshold.setValueAtTime(
        masteringLimiterCeiling,
        ctx.currentTime
      );
    } catch (e) {}
  }
  // v17.2: Bypass-Status wiederherstellen
  if (masteringLimiterBypass && ctx) {
    try {
      masteringLimiterBypass.bypassGain.gain.setValueAtTime(
        masteringLimiterOn ? 0 : 1,
        ctx.currentTime
      );
      masteringLimiterBypass.limiterPathGain.gain.setValueAtTime(
        masteringLimiterOn ? 1 : 0,
        ctx.currentTime
      );
    } catch (e) {}
  }
  initHistory();
  return { ok: true };
}

/* ---------- IndexedDB ---------- */
const DB_NAME = "flclone",
  DB_VERSION = 1,
  STORE = "samples";
let dbPromise = null;
function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(STORE))
        r.result.createObjectStore(STORE, { keyPath: "id" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbPromise;
}
async function dbPutSample(id, name, ab) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ id, name, data: ab });
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
  });
}
async function dbGetSample(id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const rq = tx.objectStore(STORE).get(id);
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
}
async function dbDeleteSample(id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
  });
}

/* ─────────────────────────────────────────────────────────
   Manueller WAV-Parser — vermeidet decodeAudioData()
   Decodiert RIFF/WAVE (PCM 8/16/24/32-bit, IEEE float 32-bit)
   in einen AudioBuffer. Crasht nie den Renderer-Prozess.
   ───────────────────────────────────────────────────────── */
function parseWavToAudioBuffer(arrayBuffer, audioCtx) {
  if (!arrayBuffer || arrayBuffer.byteLength < 44) {
    throw new Error("WAV: file too small");
  }
  const dv = new DataView(arrayBuffer);

  // "RIFF"      "WAVE"
  if (dv.getUint32(0, false) !== 0x52494646)
    throw new Error("WAV: no RIFF magic");
  if (dv.getUint32(8, false) !== 0x57415645)
    throw new Error("WAV: no WAVE magic");

  let pos = 12;
  let fmt = null;
  let dataStart = -1,
    dataLen = 0;

  while (pos + 8 <= arrayBuffer.byteLength) {
    const chunkId = dv.getUint32(pos, false);
    const chunkSize = dv.getUint32(pos + 4, true);
    const chunkStart = pos + 8;
    if (chunkStart + chunkSize > arrayBuffer.byteLength) break;

    if (chunkId === 0x666d7420) {
      // 'fmt '
      fmt = {
        audioFormat: dv.getUint16(chunkStart, true),
        numChannels: dv.getUint16(chunkStart + 2, true),
        sampleRate: dv.getUint32(chunkStart + 4, true),
        byteRate: dv.getUint32(chunkStart + 8, true),
        blockAlign: dv.getUint16(chunkStart + 12, true),
        bitsPerSample: dv.getUint16(chunkStart + 14, true),
      };
      // WAVE_FORMAT_EXTENSIBLE → echten Format-Code aus Subformat-GUID lesen
      if (fmt.audioFormat === 0xfffe && chunkSize >= 40) {
        fmt.audioFormat = dv.getUint16(chunkStart + 24, true);
      }
    } else if (chunkId === 0x64617461) {
      // 'data'
      dataStart = chunkStart;
      dataLen = chunkSize;
      break;
    }
    pos = chunkStart + chunkSize;
    if (pos & 1) pos++; // Chunks sind 2-byte-aligned
  }

  if (!fmt) throw new Error("WAV: missing fmt chunk");
  if (dataStart < 0) throw new Error("WAV: missing data chunk");

  const { numChannels, sampleRate, bitsPerSample, audioFormat } = fmt;
  if (numChannels < 1 || numChannels > 2) {
    throw new Error("WAV: unsupported channel count (" + numChannels + ")");
  }
  if (sampleRate < 1000 || sampleRate > 192000) {
    throw new Error("WAV: unsupported sample rate (" + sampleRate + ")");
  }
  if (![8, 16, 24, 32].includes(bitsPerSample)) {
    throw new Error("WAV: unsupported bit depth (" + bitsPerSample + ")");
  }
  if (audioFormat !== 1 && audioFormat !== 3) {
    throw new Error("WAV: unsupported format code (" + audioFormat + ")");
  }
  const isFloat = audioFormat === 3;

  const bytesPerSample = bitsPerSample / 8;
  const stride = numChannels * bytesPerSample;
  const frameCount = Math.floor(dataLen / stride);
  if (frameCount <= 0) throw new Error("WAV: empty data chunk");

  const buffer = audioCtx.createBuffer(numChannels, frameCount, sampleRate);

  for (let ch = 0; ch < numChannels; ch++) {
    const out = buffer.getChannelData(ch);
    let off = dataStart + ch * bytesPerSample;

    if (bitsPerSample === 8) {
      for (let i = 0; i < frameCount; i++) {
        out[i] = (dv.getUint8(off) - 128) / 128;
        off += stride;
      }
    } else if (bitsPerSample === 16) {
      for (let i = 0; i < frameCount; i++) {
        out[i] = dv.getInt16(off, true) / 32768;
        off += stride;
      }
    } else if (bitsPerSample === 24) {
      for (let i = 0; i < frameCount; i++) {
        const b0 = dv.getUint8(off);
        const b1 = dv.getUint8(off + 1);
        const b2 = dv.getUint8(off + 2);
        let v = (b2 << 16) | (b1 << 8) | b0;
        if (v & 0x800000) v |= 0xff000000;
        out[i] = v / 8388608;
        off += stride;
      }
    } else {
      // 32
      if (isFloat) {
        for (let i = 0; i < frameCount; i++) {
          out[i] = dv.getFloat32(off, true);
          off += stride;
        }
      } else {
        for (let i = 0; i < frameCount; i++) {
          out[i] = dv.getInt32(off, true) / 2147483648;
          off += stride;
        }
      }
    }
  }

  return buffer;
}
async function restoreSamplesFromDB() {
  let failedCount = 0;
  let loadedCount = 0;

  for (const tid of Object.keys(samples)) {
    const m = samples[tid];
    if (!m || !m.id) continue;

    try {
      const rec = await dbGetSample(m.id);
      if (!rec || !rec.data) {
        m.missing = true;
        continue;
      }

      const ab = rec.data;
      if (!ab || ab.byteLength < 44) {
        console.warn(`[sample-restore] ${tid}: data too small, skipping`);
        m.missing = true;
        failedCount++;
        continue;
      }

      // Magic-Byte-Check (defensiv, parseWavToAudioBuffer prüft nochmal)
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
      if (!(isRIFF && isWAVE)) {
        const magic = Array.from(head.slice(0, 4))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");
        console.warn(
          `[sample-restore] ${tid}: not a WAV (header: ${magic}), skipping`
        );
        m.missing = true;
        failedCount++;
        continue;
      }

      if (!ctx) initAudio();

      // ★ Statt ctx.decodeAudioData() → manueller JS-Parser.
      //   Kann den Renderer nicht crashen.
      const buf = parseWavToAudioBuffer(ab, ctx);
      m.buffer = buf;
      m.name = rec.name || m.name;
      m.missing = false;
      loadedCount++;
      console.log(
        `[sample-restore] ${tid}: loaded OK (${buf.duration.toFixed(2)}s)`
      );
    } catch (e) {
      console.warn(`[sample-restore] ${tid}: parse failed`, e);
      m.missing = true;
      failedCount++;
    }
  }

  if (failedCount > 0) {
    try {
      toast(`${failedCount} sample(s) couldn't be loaded`, "error");
    } catch (e) {}
  }
  if (loadedCount > 0) {
    try {
      console.log(`[sample-restore] ${loadedCount} sample(s) loaded OK`);
    } catch (e) {}
  }

  if (currentView === "rack") rebuildRack();
  if (currentView === "mixer") rebuildMixer();
}

/* ---------- Audio ---------- */
let ctx = null,
  masterGain = null,
  limiterNode = null,
  reverbBus = null,
  reverbReturn = null,
  metroGain = null;
const buses = {};
const analysers = {};
const masterAnalyser = null;
const ctxRes = new WeakMap();

function getCtxRes(c) {
  if (!ctxRes.has(c)) {
    const len = c.sampleRate;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    ctxRes.set(c, { noiseBuffer: buf });
  }
  return ctxRes.get(c);
}
const _reverbImpulseCache = {};
function getReverbImpulse(c, id, force) {
  const sr = c.sampleRate;
  const key = sr + "|" + id;
  if (!force && _reverbImpulseCache[key]) return _reverbImpulseCache[key];
  const p = REVERB_PRESETS[id] || REVERB_PRESETS.hall;
  const imp = createReverbImpulse(c, p.duration, p.decay, p.damp);
  _reverbImpulseCache[key] = imp;
  return imp;
}
function createReverbImpulse(c, dur, decay, damp) {
  const rate = c.sampleRate;
  const length = Math.max(1, Math.floor(rate * dur));
  const imp = c.createBuffer(2, length, rate);
  const dampCoeff = Math.max(0, Math.min(0.98, damp || 0));
  for (let ch = 0; ch < 2; ch++) {
    const d = imp.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    if (dampCoeff > 0) {
      let prev = 0;
      for (let i = 0; i < length; i++) {
        prev = prev * dampCoeff + d[i] * (1 - dampCoeff);
        d[i] = prev;
      }
    }
  }
  return imp;
}
function buildGraph(c, opts) {
  const mg = c.createGain();
  mg.gain.value = opts.master ?? 0.8;

  // Master 3-band EQ
  const eqLow = c.createBiquadFilter();
  eqLow.type = "lowshelf";
  eqLow.frequency.value = MASTER_EQ_LOW_FREQ;
  eqLow.gain.value = masterEQLow;
  const eqMid = c.createBiquadFilter();
  eqMid.type = "peaking";
  eqMid.frequency.value = 1000;
  eqMid.Q.value = 1;
  eqMid.gain.value = masterEQMid;
  const eqHigh = c.createBiquadFilter();
  eqHigh.type = "highshelf";
  eqHigh.frequency.value = MASTER_EQ_HIGH_FREQ;
  eqHigh.gain.value = masterEQHigh;

  const masterLP = c.createBiquadFilter();
  masterLP.type = "lowpass";
  masterLP.frequency.value = Math.max(
    20,
    Math.min(20000, opts.masterLowpassFreq ?? 20000)
  );
  masterLP.Q.value = 0.7;

  // ── v17: Stereo Width (Mid/Side Matrix) ──
  const splitterL = c.createChannelSplitter(2);
  const widthMerger = c.createChannelMerger(2);
  const mSum = c.createGain();
  mSum.gain.value = 0.5;
  const sSumL = c.createGain();
  sSumL.gain.value = 0.5 * masteringWidth;
  const sSumR = c.createGain();
  sSumR.gain.value = -0.5 * masteringWidth;
  const sSum = c.createGain();
  const negS = c.createGain();
  negS.gain.value = -1;

  // ★ KRITISCH: Master-Gain → EQ → MasterLP Kette wiederherstellen
  mg.connect(eqLow);
  eqLow.connect(eqMid);
  eqMid.connect(eqHigh);
  eqHigh.connect(masterLP);

  // masterLP → stereo splitter
  masterLP.connect(splitterL);
  // M = (L+R)/2
  splitterL.connect(mSum, 0);
  splitterL.connect(mSum, 1);
  // S = (L*0.5*w) + (R*(-0.5*w))
  splitterL.connect(sSumL, 0);
  splitterL.connect(sSumR, 1);
  sSumL.connect(sSum);
  sSumR.connect(sSum);
  // L' = M + S, R' = M - S
  sSum.connect(negS);
  mSum.connect(widthMerger, 0, 0);
  sSum.connect(widthMerger, 0, 0);
  mSum.connect(widthMerger, 0, 1);
  negS.connect(widthMerger, 0, 1);

  // ── v17.2: Limiter-Kaskade mit sauberem Bypass-Pfad ──
  // WICHTIG: DynamicsCompressor hat immer 6 ms Lookahead-Delay — auch wenn nicht
  // komprimiert wird. Zwei in Kaskade = 12 ms Delay = Kick-Attack wird verschmiert.
  // Lösung: Wenn Limiter "off", wird das Signal komplett an den Kompressoren
  // vorbei geroutet (Bypass-Gain). Keine Lookahead-Delay mehr.
  const lim1 = c.createDynamicsCompressor();
  lim1.threshold.value = masteringLimiterCeiling;
  lim1.knee.value = 0;
  lim1.ratio.value = 20;
  lim1.attack.value = 0.001;
  lim1.release.value = 0.05;

  const lim2 = c.createDynamicsCompressor();
  lim2.threshold.value = masteringLimiterCeiling - 0.4;
  lim2.knee.value = 0;
  lim2.ratio.value = 20;
  lim2.attack.value = 0.001;
  lim2.release.value = 0.05;

  const bypassGain = c.createGain();
  bypassGain.gain.value = masteringLimiterOn ? 0 : 1;

  const limiterPathGain = c.createGain();
  limiterPathGain.gain.value = masteringLimiterOn ? 1 : 0;

  const masterOut = c.createGain();

  widthMerger.connect(lim1);
  lim1.connect(lim2);
  lim2.connect(limiterPathGain);
  limiterPathGain.connect(masterOut);

  widthMerger.connect(bypassGain);
  bypassGain.connect(masterOut);

  masterOut.connect(c.destination);
  const rb = c.createGain();
  const conv = c.createConvolver();
  try {
    conv.buffer = getReverbImpulse(c, reverbPresetId);
  } catch (e) {
    console.warn("Reverb impulse failed:", e);
  }
  const rr = c.createGain();
  rr.gain.value = opts.reverbAmount ?? 0.35;
  rb.connect(conv);
  conv.connect(rr);
  rr.connect(mg);
  rb._conv = conv;

  const mtg = c.createGain();
  mtg.gain.value = opts.metronomeVol ?? 0.5;
  mtg.connect(mg);

  const localBuses = {},
    fxMaps = {},
    localAnalysers = {};
  (opts.tracks || TRACKS).forEach((t) => {
    const ti = c.createGain();
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = Math.max(
      20,
      Math.min(20000, t.filter?.cutoff ?? 20000)
    );
    f.Q.value = Math.max(0.1, Math.min(20, t.filter?.q ?? 0.7));
    const inGain = c.createGain();
    inGain.gain.value = typeof t.inputGain === "number" ? t.inputGain : 1.0;
    const chain = buildTrackChain(c, t);
    const panner = c.createStereoPanner ? c.createStereoPanner() : null;
    const scGain = c.createGain();
    scGain.gain.value = 1;
    const gain = c.createGain(),
      send = c.createGain();
    ti.connect(inGain);
    inGain.connect(f);
    f.connect(chain.input);
    if (panner) {
      chain.output.connect(panner);
      panner.connect(scGain);
    } else chain.output.connect(scGain);
    scGain.connect(gain);
    gain.connect(mg);
    gain.connect(send);
    send.connect(rb);

    let an = null;
    if (c instanceof AudioContext || c instanceof OfflineAudioContext) {
      an = c.createAnalyser();
      an.fftSize = 256;
      gain.connect(an);
    }

    localBuses[t.id] = {
      input: ti,
      inputGain: inGain,
      filter: f,
      output: chain.output,
      panner,
      scGain,
      gain,
      send,
      _chainNodes: chain.nodes,
    };
    if (an) localAnalysers[t.id] = an;
  });
  return {
    master: mg,
    masterLowpass: masterLP,
    masterEQLow: eqLow,
    masterEQMid: eqMid,
    masterEQHigh: eqHigh,
    stereoWidth: {
      splitter: splitterL,
      merger: widthMerger,
      mSum,
      sSumL,
      sSumR,
      sSum,
      negS,
    },
    limiter1: lim1,
    limiter2: lim2,
    limiterBypass: { bypassGain, limiterPathGain },
    reverbBus: rb,
    reverbReturn: rr,
    buses: localBuses,
    analysers: localAnalysers,
    _fxMaps: fxMaps,
    metroGain: mtg,
  };
}
function initAudio() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const g = buildGraph(ctx, {
    master,
    reverbAmount,
    tracks: TRACKS,
    metronomeVol,
    masterLowpassFreq,
  });
  masterGain = g.master;
  masterLowpassNode = g.masterLowpass;
  masterEQLowNode = g.masterEQLow;
  masterEQMidNode = g.masterEQMid;
  masterEQHighNode = g.masterEQHigh;
  reverbBus = g.reverbBus;
  reverbReturn = g.reverbReturn;
  metroGain = g.metroGain;
  stereoWidthNode = g.stereoWidth;
  masteringLimiter1 = g.limiter1;
  masteringLimiterBypass = g.limiterBypass;
  Object.assign(buses, g.buses);
  Object.assign(analysers, g.analysers);
  buses._fxMaps = g._fxMaps;
  TRACKS.forEach(applyTrackGain);
  startMetering();
}
let meterRaf = null;
function startMetering() {
  if (meterRaf) cancelAnimationFrame(meterRaf);
  function tick() {
    meterRaf = requestAnimationFrame(tick);
    if (!ctx || ctx.state !== "running") return;
    TRACKS.forEach((t) => {
      const an = analysers[t.id];
      if (!an) return;
      const arr = new Uint8Array(an.frequencyBinCount);
      an.getByteTimeDomainData(arr);
      let peak = 0;
      for (let i = 0; i < arr.length; i++) {
        const v = Math.abs(arr[i] - 128);
        if (v > peak) peak = v;
      }
      const level = peak / 128;
      const ledRack = ledEls[t.id];
      const ledMix = ledEls["mix_" + t.id];
      let color = "#333";
      if (level > 0.01) color = "#2e7d32";
      if (level > 0.5) color = "#ff8a00";
      if (level >= 0.98) color = "#c62828";

      if (ledRack) {
        ledRack.style.background = color;
        ledRack.style.boxShadow = level > 0.01 ? `0 0 8px ${color}` : "none";
      }
      if (ledMix) {
        ledMix.style.background = color;
        ledMix.style.boxShadow = level > 0.01 ? `0 0 8px ${color}` : "none";
      }
    });
  }
  tick();
}

function disposeLiveGraph() {
  TRACKS.forEach((t) => {
    const b = buses[t.id];
    if (b && b._chainNodes) {
      b._chainNodes.forEach((n) => {
        try {
          n.destroy();
        } catch (e) {}
      });
      b._chainNodes = null;
    }
  });
  if (meterRaf) {
    cancelAnimationFrame(meterRaf);
    meterRaf = null;
  }
  if (ctx && ctx.state !== "closed") {
    try {
      ctx.close();
    } catch (e) {}
  }
  ctx = null;
  masterGain = null;
  masterLowpassNode = null;
  masterEQLowNode = null;
  masterEQMidNode = null;
  masterEQHighNode = null;
  stereoWidthNode = null;
  masteringLimiter1 = null;
  masteringLimiterBypass = null;
  limiterNode = null;
  reverbBus = null;
  reverbReturn = null;
  metroGain = null;
  Object.keys(buses).forEach((k) => delete buses[k]);
  Object.keys(analysers).forEach((k) => delete analysers[k]);
}
function rebuildAudioGraphs() {
  if (ctx) {
    disposeLiveGraph();
    initAudio();
    if (ctx.state === "suspended") ctx.resume();
    if (currentView === "mixer") rebuildMixer();
    if (currentFxTrackId) renderFxPanel();
  }
}
function applyTrackGain(t) {
  const b = buses[t.id];
  if (!b) return;
  const a = (!soloActive || t.solo) && !t.mute;
  b.gain.gain.value = a ? t.volume : 0;
}
function refreshAllGains() {
  soloActive = TRACKS.some((t) => t.solo);
  TRACKS.forEach(applyTrackGain);
}
/* ───── v16 Helpers ───── */
function setReverbPreset(id) {
  if (!REVERB_PRESETS[id]) return;
  reverbPresetId = id;
  const p = REVERB_PRESETS[id];
  reverbDecay = p.decay;
  reverbDamp = p.damp;
  reverbDuration = p.duration;
  if (reverbBus && reverbBus._conv && ctx) {
    try {
      reverbBus._conv.buffer = getReverbImpulse(ctx, id);
    } catch (e) {
      console.warn("Reverb preset swap failed:", e);
    }
  }
}
function regenerateReverbImpulse() {
  if (!ctx) return;
  const key = ctx.sampleRate + "|" + reverbPresetId;
  delete _reverbImpulseCache[key];
  if (reverbBus && reverbBus._conv) {
    try {
      reverbBus._conv.buffer = getReverbImpulse(ctx, reverbPresetId, true);
    } catch (e) {
      console.warn("Reverb regen failed:", e);
    }
  }
}
function setReverbDecay(v) {
  reverbDecay = Math.max(0.1, Math.min(8, v));
  regenerateReverbImpulse();
}
function setReverbDamp(v) {
  reverbDamp = Math.max(0, Math.min(0.98, v));
  regenerateReverbImpulse();
}
function setMasterEQ(low, mid, high) {
  if (typeof low === "number") masterEQLow = Math.max(-24, Math.min(24, low));
  if (typeof mid === "number") masterEQMid = Math.max(-24, Math.min(24, mid));
  if (typeof high === "number")
    masterEQHigh = Math.max(-24, Math.min(24, high));
  if (ctx) {
    if (masterEQLowNode)
      masterEQLowNode.gain.setTargetAtTime(masterEQLow, ctx.currentTime, 0.02);
    if (masterEQMidNode)
      masterEQMidNode.gain.setTargetAtTime(masterEQMid, ctx.currentTime, 0.02);
    if (masterEQHighNode)
      masterEQHighNode.gain.setTargetAtTime(
        masterEQHigh,
        ctx.currentTime,
        0.02
      );
  }
}
function setMetronomeSound(id) {
  if (METRONOME_SOUNDS[id]) metronomeSound = id;
}
function setTrackSidechain(trackId, enabled, amount, release) {
  const t = TRACKS.find((x) => x.id === trackId);
  if (!t) return;
  if (typeof enabled === "boolean") t.sidechain = enabled;
  if (typeof amount === "number")
    t.sidechainAmount = Math.max(0, Math.min(1, amount));
  if (typeof release === "number")
    t.sidechainRelease = Math.max(0.02, Math.min(2, release));
}
function setArp(trackId, config) {
  const t = TRACKS.find((x) => x.id === trackId);
  if (!t) return;
  if (!t.arp) t.arp = { enabled: false, rate: 4, mode: "up", octaves: 1 };
  if (config && typeof config.enabled === "boolean")
    t.arp.enabled = config.enabled;
  if (config && typeof config.rate === "number")
    t.arp.rate = Math.max(1, Math.min(8, config.rate | 0));
  if (
    config &&
    typeof config.mode === "string" &&
    ["up", "down", "updown"].includes(config.mode)
  )
    t.arp.mode = config.mode;
  if (config && typeof config.octaves === "number")
    t.arp.octaves = Math.max(1, Math.min(4, config.octaves | 0));
}
function applyChordProgression(
  trackId,
  progressionId,
  key,
  mode,
  octave,
  chordSteps
) {
  const t = TRACKS.find((x) => x.id === trackId);
  if (!t || t.type !== "melodic") return false;
  const prog = CHORD_PROGRESSIONS[progressionId];
  if (!prog) return false;
  const rootPC = Math.max(0, Math.min(11, key | 0));
  const baseOctave = Math.max(1, Math.min(6, octave | 0));
  const chordLen = Math.max(1, Math.min(32, chordSteps | 0)) || 8;
  const rootMidi = 12 * (baseOctave + 1) + rootPC;
  const pattern = patterns[currentPattern];
  if (!pattern.pianoRoll[t.id]) pattern.pianoRoll[t.id] = [];
  const notes = pattern.pianoRoll[t.id];
  const totalEnd = prog.intervals.length * chordLen;
  for (let i = notes.length - 1; i >= 0; i--) {
    if (notes[i].start < totalEnd) notes.splice(i, 1);
  }
  prog.intervals.forEach((semiOffset, idx) => {
    const chordStart = idx * chordLen;
    const baseMidi = rootMidi + semiOffset;
    let intervals;
    if (progressionId === "jazz_251") {
      if (idx === 0) intervals = [0, 3, 7, 10];
      else if (idx === 1) intervals = [0, 4, 7, 10];
      else intervals = [0, 4, 7, 11];
    } else if (
      progressionId === "edm_1m" ||
      progressionId === "minor_167" ||
      progressionId === "sad_6415"
    ) {
      intervals = mode === "maj" ? [0, 4, 7] : [0, 3, 7];
    } else if (prog.type === "maj") {
      intervals = [0, 4, 7];
    } else {
      intervals = [0, 3, 7];
    }
    intervals.forEach((semi) => {
      notes.push({
        id: genId("n"),
        start: chordStart,
        len: chordLen,
        midi: baseMidi + semi,
        vel: 100,
      });
    });
  });
  syncMelodicSteps(pattern);
  autoSave();
  return true;
}
/* ── v17: Mastering-Chain ── */
function setMasteringWidth(w) {
  masteringWidth = Math.max(0, Math.min(2, w));
  if (stereoWidthNode && ctx) {
    const g = 0.5 * masteringWidth;
    try {
      stereoWidthNode.sSumL.gain.setTargetAtTime(g, ctx.currentTime, 0.02);
      stereoWidthNode.sSumR.gain.setTargetAtTime(-g, ctx.currentTime, 0.02);
    } catch (e) {}
  }
}
function setMasteringLimiterCeiling(db) {
  masteringLimiterCeiling = Math.max(-12, Math.min(0, db));
  if (masteringLimiterOn && masteringLimiter1 && ctx) {
    try {
      masteringLimiter1.threshold.setTargetAtTime(
        masteringLimiterCeiling,
        ctx.currentTime,
        0.02
      );
    } catch (e) {}
  }
}
function toggleMasteringLimiter(on) {
  masteringLimiterOn = !!on;
  if (!ctx) return;
  // v17.2: Echten Bypass umschalten — vermeidet 12 ms Lookahead-Delay wenn off
  if (masteringLimiterBypass) {
    try {
      masteringLimiterBypass.bypassGain.gain.setTargetAtTime(
        masteringLimiterOn ? 0 : 1,
        ctx.currentTime,
        0.02
      );
      masteringLimiterBypass.limiterPathGain.gain.setTargetAtTime(
        masteringLimiterOn ? 1 : 0,
        ctx.currentTime,
        0.02
      );
    } catch (e) {}
  }
  if (masteringLimiter1 && ctx) {
    try {
      masteringLimiter1.threshold.setTargetAtTime(
        masteringLimiterCeiling,
        ctx.currentTime,
        0.02
      );
    } catch (e) {}
  }
}

/* ── v17: Groove-Templates ── */
function setGroove(templateId, strength) {
  if (GROOVE_TEMPLATES[templateId]) grooveTemplateId = templateId;
  if (typeof strength === "number")
    grooveStrength = Math.max(0, Math.min(1, strength));
}
function getGrooveOffsets(step, templateId, strength) {
  if (!templateId || templateId === "straight" || strength <= 0) {
    return { timeOffset: 0, velMult: 1 };
  }
  const tmpl = GROOVE_TEMPLATES[templateId];
  if (!tmpl) return { timeOffset: 0, velMult: 1 };
  const idx = ((step % 16) + 16) % 16;
  const t = (tmpl.timing[idx] || 0) * strength;
  const v = 1 + ((tmpl.velocity[idx] || 1) - 1) * strength;
  return { timeOffset: t, velMult: Math.max(0.3, Math.min(1.5, v)) };
}
function setDrumKit(id) {
  if (DRUM_KITS[id]) drumKitId = id;
}

function setTrackDrumPreset(trackId, presetId) {
  const t = TRACKS.find((x) => x.id === trackId);
  if (!t || t.type !== "drum") return false;
  if (presetId === null) {
    t.drumPresetId = null;
    return true;
  }
  const presets = DRUM_PRESETS[t.id];
  if (!presets || !presets[presetId]) return false;
  t.drumPresetId = presetId;
  return true;
}

/* Einfache Autokorrelations-Pitch-Erkennung (monophon, ~1000Hz max) */
function detectPitchAutocorrelation(audioBuffer) {
  if (!audioBuffer) return null;
  const data = audioBuffer.getChannelData(0);
  const sr = audioBuffer.sampleRate;
  const start = Math.floor(data.length * 0.25);
  const size = Math.min(4096, Math.floor(data.length * 0.5));
  if (size < 512) return null;
  const sample = data.subarray(start, start + size);
  const minLag = Math.floor(sr / 1000);
  const maxLag = Math.floor(sr / 60);
  let bestLag = 0,
    bestVal = 0;
  const corr = new Float32Array(maxLag + 2);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < size - lag; i++) sum += sample[i] * sample[i + lag];
    corr[lag] = sum;
  }
  for (let lag = minLag + 1; lag < maxLag; lag++) {
    if (
      corr[lag] > corr[lag - 1] &&
      corr[lag] > corr[lag + 1] &&
      corr[lag] > bestVal
    ) {
      bestVal = corr[lag];
      bestLag = lag;
      break;
    }
  }
  if (!bestLag) return null;
  const frequency = sr / bestLag;
  const midiFloat = 69 + 12 * Math.log2(frequency / 440);
  return { frequency, midi: Math.round(midiFloat), midiFloat };
}
function noiseSource(c) {
  const s = c.createBufferSource();
  s.buffer = getCtxRes(c).noiseBuffer;
  return s;
}
function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}
function midiToName(m) {
  const n = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return n[m % 12] + (Math.floor(m / 12) - 1);
}

/* ---------- Instrumente ---------- */
function playKick(c, t, dest, vel, track) {
  const k =
    track &&
    track.drumPresetId &&
    DRUM_PRESETS.kick &&
    DRUM_PRESETS.kick[track.drumPresetId]
      ? DRUM_PRESETS.kick[track.drumPresetId]
      : (DRUM_KITS[drumKitId] || DRUM_KITS.default).kick;
  const v = vel == null ? 1 : Math.max(0, Math.min(1, vel));
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(k.baseFreq, t);
  o.frequency.exponentialRampToValueAtTime(k.endFreq, t + k.decay * 0.4);
  g.gain.setValueAtTime(1 * v, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + k.decay);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + k.decay + 0.05);
  if (k.noise > 0) {
    const n = noiseSource(c),
      hp = c.createBiquadFilter(),
      ng = c.createGain();
    hp.type = "highpass";
    hp.frequency.value = 1000;
    ng.gain.setValueAtTime(k.noise * v, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    n.connect(hp).connect(ng).connect(dest);
    n.start(t);
    n.stop(t + 0.03);
  }
}
function playSnare(c, t, dest, vel, track) {
  const k =
    track &&
    track.drumPresetId &&
    DRUM_PRESETS.snare &&
    DRUM_PRESETS.snare[track.drumPresetId]
      ? DRUM_PRESETS.snare[track.drumPresetId]
      : (DRUM_KITS[drumKitId] || DRUM_KITS.default).snare;
  const v = vel == null ? 1 : Math.max(0, Math.min(1, vel));
  const o = c.createOscillator(),
    g1 = c.createGain();
  o.type = "triangle";
  o.frequency.value = k.tone;
  g1.gain.setValueAtTime(0.5 * v, t);
  g1.gain.exponentialRampToValueAtTime(0.001, t + k.decay);
  o.connect(g1).connect(dest);
  o.start(t);
  o.stop(t + k.decay + 0.05);
  const n = noiseSource(c),
    hp = c.createBiquadFilter(),
    g2 = c.createGain();
  hp.type = "highpass";
  hp.frequency.value = 1200;
  g2.gain.setValueAtTime(k.noise * v, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + k.decay * 1.2);
  n.connect(hp).connect(g2).connect(dest);
  n.start(t);
  n.stop(t + k.decay * 1.2 + 0.05);
}
function playHat(c, t, dest, vel, track) {
  const k =
    track &&
    track.drumPresetId &&
    DRUM_PRESETS.hat &&
    DRUM_PRESETS.hat[track.drumPresetId]
      ? DRUM_PRESETS.hat[track.drumPresetId]
      : (DRUM_KITS[drumKitId] || DRUM_KITS.default).hat;
  const v = vel == null ? 1 : Math.max(0, Math.min(1, vel));
  const n = noiseSource(c),
    hp = c.createBiquadFilter(),
    g = c.createGain();
  hp.type = "highpass";
  hp.frequency.value = k.freq;
  g.gain.setValueAtTime(0.35 * v, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + k.decay);
  n.connect(hp).connect(g).connect(dest);
  n.start(t);
  n.stop(t + k.decay + 0.02);
}
function playOpenHat(c, t, dest, vel, track) {
  const k =
    track &&
    track.drumPresetId &&
    DRUM_PRESETS.openhat &&
    DRUM_PRESETS.openhat[track.drumPresetId]
      ? DRUM_PRESETS.openhat[track.drumPresetId]
      : (DRUM_KITS[drumKitId] || DRUM_KITS.default).openhat;
  const v = vel == null ? 1 : Math.max(0, Math.min(1, vel));
  const n = noiseSource(c),
    hp = c.createBiquadFilter(),
    g = c.createGain();
  hp.type = "highpass";
  hp.frequency.value = k.freq;
  g.gain.setValueAtTime(0.35 * v, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + k.decay);
  n.connect(hp).connect(g).connect(dest);
  n.start(t);
  n.stop(t + k.decay + 0.02);
}
function playClap(c, t, dest, vel, track) {
  const k =
    track &&
    track.drumPresetId &&
    DRUM_PRESETS.clap &&
    DRUM_PRESETS.clap[track.drumPresetId]
      ? DRUM_PRESETS.clap[track.drumPresetId]
      : (DRUM_KITS[drumKitId] || DRUM_KITS.default).clap;
  const v = vel == null ? 1 : Math.max(0, Math.min(1, vel));
  for (let i = 0; i < k.reps; i++) {
    const n = noiseSource(c),
      bp = c.createBiquadFilter(),
      g = c.createGain();
    bp.type = "bandpass";
    bp.frequency.value = k.freq;
    bp.Q.value = 1.2;
    const off = i * 0.012;
    g.gain.setValueAtTime(0.6 * v, t + off);
    g.gain.exponentialRampToValueAtTime(0.001, t + off + k.decay);
    n.connect(bp).connect(g).connect(dest);
    n.start(t + off);
    n.stop(t + off + k.decay + 0.01);
  }
}
function playTom(c, t, dest, vel, track) {
  const k =
    track &&
    track.drumPresetId &&
    DRUM_PRESETS.tom &&
    DRUM_PRESETS.tom[track.drumPresetId]
      ? DRUM_PRESETS.tom[track.drumPresetId]
      : (DRUM_KITS[drumKitId] || DRUM_KITS.default).tom;
  const v = vel == null ? 1 : Math.max(0, Math.min(1, vel));
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(k.baseFreq, t);
  o.frequency.exponentialRampToValueAtTime(k.endFreq, t + k.decay * 0.6);
  g.gain.setValueAtTime(0.8 * v, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + k.decay);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + k.decay + 0.05);
}
function playBass(c, t, dest, freq, vel, dur, synth) {
  const o = c.createOscillator(),
    g = c.createGain(),
    f = c.createBiquadFilter();
  o.type = (synth && synth.waveform) || "sawtooth";
  o.frequency.value = freq;
  f.type = "lowpass";
  f.frequency.value = synth ? synth.cutoff : 800;
  f.Q.value = synth ? synth.q : 6;
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.01,
    D = synth ? synth.d : 0.1,
    S = synth ? synth.s : 0.6,
    R = synth ? synth.r : 0.2;
  const pitchEnv = (synth && synth.pitchEnv) || 0;
  if (pitchEnv > 0) {
    o.frequency.setValueAtTime(freq * Math.pow(2, pitchEnv / 12), t);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.08);
  }
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.6 * v, t + A);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.6 * v * S), t + A + D);
  g.gain.setValueAtTime(Math.max(0.001, 0.6 * v * S), t + dur);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
  o.connect(f).connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + R + 0.1);
}

function playLead(c, t, dest, freq, vel, dur, synth) {
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = (synth && synth.waveform) || "square";
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.01,
    D = synth ? synth.d : 0.1,
    S = synth ? synth.s : 0.5,
    R = synth ? synth.r : 0.1;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3 * v, t + A);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.3 * v * S), t + A + D);
  g.gain.setValueAtTime(Math.max(0.001, 0.3 * v * S), t + dur);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + R + 0.1);
}
function playPiano(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.01,
    D = synth ? synth.d : 0.5,
    S = synth ? synth.s : 0.2,
    R = synth ? synth.r : 0.5;
  const cutoff = synth ? synth.cutoff || 8000 : 8000;
  const q = synth ? synth.q || 1 : 1;
  let H, G;
  if (synth && Array.isArray(synth.harmonics) && synth.harmonics.length) {
    H = synth.harmonics.map((_, i) => i + 1);
    G = synth.harmonics.slice();
  } else {
    H = [1, 2, 3, 5];
    G = [1, 0.45, 0.2, 0.08];
  }
  const d = Math.max(0.6, Math.min(1.6, (dur || 0.5) + 0.6));
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = q;
  filter.connect(dest);
  H.forEach((h, i) => {
    const amp = G[i];
    if (amp <= 0) return;
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = "sine";
    o.frequency.value = freq * h;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp * v, t + A);
    g.gain.exponentialRampToValueAtTime(
      Math.max(0.001, amp * v * S),
      t + A + D
    );
    g.gain.setValueAtTime(Math.max(0.001, amp * v * S), t + dur);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
    o.connect(g).connect(filter);
    o.start(t);
    o.stop(t + dur + R + 0.1);
  });
}
function playPad(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.4,
    D = synth ? synth.d : 0.5,
    S = synth ? synth.s : 0.8,
    R = synth ? synth.r : 1.0;
  const sus = Math.max(0.5, dur || 0.6);
  [-8, 0, 8].forEach((det) => {
    const o = c.createOscillator(),
      g = c.createGain(),
      f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = synth ? synth.cutoff : 1500;
    f.Q.value = synth ? synth.q : 1;
    o.type = (synth && synth.waveform) || "sawtooth";
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12 * v, t + A);
    g.gain.linearRampToValueAtTime(Math.max(0.001, 0.12 * v * S), t + A + D);
    g.gain.setValueAtTime(Math.max(0.001, 0.12 * v * S), t + sus);
    g.gain.linearRampToValueAtTime(0.001, t + sus + R);
    o.connect(f).connect(g).connect(dest);
    o.start(t);
    o.stop(t + sus + R + 0.1);
  });
}
function playPluck(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const o = c.createOscillator(),
    g = c.createGain(),
    f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(synth ? synth.cutoff : 4000, t);
  f.frequency.exponentialRampToValueAtTime(500, t + 0.2);
  const A = synth ? synth.a : 0.01,
    D = synth ? synth.d : 0.15,
    S = synth ? synth.s : 0.0,
    R = synth ? synth.r : 0.1;
  o.type = (synth && synth.waveform) || "triangle";
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.5 * v, t + A);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.5 * v * S), t + A + D);
  g.gain.setValueAtTime(Math.max(0.001, 0.5 * v * S), t + dur);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
  o.connect(f).connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + R + 0.1);
}
function playArp(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const o = c.createOscillator(),
    g = c.createGain(),
    f = c.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = 300;
  o.type = (synth && synth.waveform) || "sawtooth";
  const A = synth ? synth.a : 0.01,
    D = synth ? synth.d : 0.1,
    S = synth ? synth.s : 0.1,
    R = synth ? synth.r : 0.05;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3 * v, t + A);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.3 * v * S), t + A + D);
  g.gain.setValueAtTime(Math.max(0.001, 0.3 * v * S), t + dur);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
  o.connect(f).connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + R + 0.1);
}
function playGuitar(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.005,
    D = synth ? synth.d : 0.3,
    S = synth ? synth.s : 0.2,
    R = synth ? synth.r : 0.3;
  const waveform = (synth && synth.waveform) || "triangle";
  const cutoff = synth ? synth.cutoff || 4000 : 4000;
  const q = synth ? synth.q || 1 : 1;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = q;
  filter.connect(dest);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.4 * v, t + A);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.4 * v * S), t + A + D);
  g.gain.setValueAtTime(Math.max(0.001, 0.4 * v * S), t + dur);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
  g.connect(filter);
  [-3, 0, 3].forEach((det) => {
    const o = c.createOscillator();
    o.type = waveform;
    o.frequency.value = freq * Math.pow(2, det / 1200);
    o.connect(g);
    o.start(t);
    o.stop(t + dur + R + 0.1);
  });
}
function playSampleNode(c, t, dest, buffer, vel, smp, sliceIdx, playbackRate) {
  const rate = playbackRate || 1;
  const v = vel == null ? 1 : Math.max(0, Math.min(1, vel));

  // Determine source buffer (maybe reversed, with cache)
  let useBuffer = buffer;
  if (smp && smp.reverse && buffer) {
    if (!smp._reversedCache || smp._reversedCache.srcBuffer !== buffer) {
      try {
        const nCh = buffer.numberOfChannels;
        const len = buffer.length;
        const rev = c.createBuffer(nCh, len, buffer.sampleRate);
        for (let ch = 0; ch < nCh; ch++) {
          const src = buffer.getChannelData(ch);
          const dst = rev.getChannelData(ch);
          for (let i = 0; i < len; i++) dst[i] = src[len - 1 - i];
        }
        smp._reversedCache = { srcBuffer: buffer, revBuffer: rev };
      } catch (e) {
        console.warn("Reverse buffer creation failed:", e);
      }
    }
    if (smp._reversedCache) useBuffer = smp._reversedCache.revBuffer;
  }

  const s = c.createBufferSource();
  s.buffer = useBuffer;
  let finalRate = rate;
  if (smp && typeof smp.tuneRate === "number" && smp.tuneRate !== 1) {
    finalRate = rate * smp.tuneRate;
  }
  if (finalRate !== 1) s.playbackRate.value = finalRate;
  const vol = smp?.gain !== undefined ? smp.gain : 1.0;

  let startTime = smp?.start || 0;
  let endTime = smp?.end || buffer.duration;

  if (sliceIdx !== undefined && smp && smp.slices && smp.slices[sliceIdx]) {
    startTime = smp.slices[sliceIdx].start;
    endTime = smp.slices[sliceIdx].end;
  }

  let duration = endTime - startTime;
  if (duration <= 0) duration = 0.01;

  // For reversed playback, the segment [start,end] sits at [D-end, D-start] in reversed buffer
  let playOffset = startTime;
  if (smp && smp.reverse && buffer) {
    playOffset = Math.max(0, buffer.duration - endTime);
  }

  const fadeIn = smp?.fadeIn || 0;
  const fadeOut = smp?.fadeOut || 0;

  if (fadeIn > 0 || fadeOut > 0) {
    const g = c.createGain();
    const realDur = duration / rate;
    const realFadeIn = fadeIn / rate;
    const realFadeOut = fadeOut / rate;
    const t0 = t;
    const t1 = t0 + realDur;
    if (fadeIn > 0) {
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(vol * v, Math.min(t0 + realFadeIn, t1));
    } else {
      g.gain.setValueAtTime(vol * v, t0);
    }
    if (fadeOut > 0) {
      const fadeStartT = Math.max(t0, t1 - realFadeOut);
      g.gain.setValueAtTime(vol * v, fadeStartT);
      g.gain.linearRampToValueAtTime(0, t1);
    }
    s.connect(g);
    g.connect(dest);
  } else {
    const g = c.createGain();
    g.gain.value = vol * v;
    s.connect(g);
    g.connect(dest);
  }

  try {
    s.start(t, playOffset, duration);
  } catch (err) {
    console.error("playSampleNode start error:", err);
  }
}
/* ── v18: Neue Instrumente ── */
function playOrgan(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.01,
    R = synth ? synth.r : 0.1;
  const cutoff = synth ? synth.cutoff || 8000 : 8000;
  const q = synth ? synth.q || 1 : 1;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = q;
  filter.connect(dest);
  const harmonics = [1, 2, 3, 4, 6, 8],
    gains = [1, 0.5, 0.35, 0.25, 0.15, 0.08];
  harmonics.forEach((h, i) => {
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = "sine";
    o.frequency.value = freq * h;
    const amp = 0.12 * gains[i] * v;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + A);
    g.gain.setValueAtTime(amp, t + dur);
    g.gain.linearRampToValueAtTime(0.001, t + dur + R);
    o.connect(g).connect(filter);
    o.start(t);
    o.stop(t + dur + R + 0.1);
  });
}
function playStrings(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.3,
    D = synth ? synth.d : 0.4,
    S = synth ? synth.s : 0.85,
    R = synth ? synth.r : 0.6;
  const cutoff = synth ? synth.cutoff || 4000 : 4000;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = 1;
  filter.connect(dest);
  const lfo = c.createOscillator(),
    lfoG = c.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 5.5;
  lfoG.gain.value = freq * 0.006;
  lfo.connect(lfoG);
  lfo.start(t);
  lfo.stop(t + dur + R + 0.1);
  [-6, 0, 6].forEach((det) => {
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = "sawtooth";
    o.frequency.value = freq * Math.pow(2, det / 1200);
    lfoG.connect(o.frequency);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1 * v, t + A);
    g.gain.linearRampToValueAtTime(0.1 * v * S, t + A + D);
    g.gain.setValueAtTime(0.1 * v * S, t + dur);
    g.gain.linearRampToValueAtTime(0.001, t + dur + R);
    o.connect(g).connect(filter);
    o.start(t);
    o.stop(t + dur + R + 0.1);
  });
}
function playBrass(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.05,
    D = synth ? synth.d : 0.2,
    S = synth ? synth.s : 0.7,
    R = synth ? synth.r : 0.2;
  const cutoff = synth ? synth.cutoff || 5000 : 5000;
  const q = synth ? synth.q || 2 : 2;
  const o = c.createOscillator(),
    g = c.createGain(),
    f = c.createBiquadFilter();
  o.type = "sawtooth";
  o.frequency.value = freq;
  f.type = "lowpass";
  f.Q.value = q;
  f.frequency.setValueAtTime(cutoff * 0.3, t);
  f.frequency.linearRampToValueAtTime(cutoff, t + A + D * 0.5);
  f.frequency.linearRampToValueAtTime(cutoff * 0.5, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.35 * v, t + A);
  g.gain.linearRampToValueAtTime(0.35 * v * S, t + A + D);
  g.gain.setValueAtTime(0.35 * v * S, t + dur);
  g.gain.linearRampToValueAtTime(0.001, t + dur + R);
  o.connect(f).connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + R + 0.1);
}
function playFlute(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.05,
    D = synth ? synth.d : 0.2,
    S = synth ? synth.s : 0.85,
    R = synth ? synth.r : 0.3;
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.3 * v, t + A);
  g.gain.linearRampToValueAtTime(0.3 * v * S, t + A + D);
  g.gain.setValueAtTime(0.3 * v * S, t + dur);
  g.gain.linearRampToValueAtTime(0.001, t + dur + R);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + R + 0.1);
  const n = noiseSource(c),
    nf = c.createBiquadFilter(),
    ng = c.createGain();
  nf.type = "bandpass";
  nf.frequency.value = freq * 2;
  nf.Q.value = 2;
  ng.gain.setValueAtTime(0, t);
  ng.gain.linearRampToValueAtTime(0.03 * v, t + A);
  ng.gain.linearRampToValueAtTime(0.02 * v * S, t + dur);
  ng.gain.linearRampToValueAtTime(0.001, t + dur + R);
  n.connect(nf).connect(ng).connect(dest);
  n.start(t);
  n.stop(t + dur + R + 0.1);
}
function playBell(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const R = synth ? synth.r : 1.5;
  const car = c.createOscillator(),
    g = c.createGain();
  car.type = "sine";
  car.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.4 * v, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
  car.connect(g).connect(dest);
  car.start(t);
  car.stop(t + dur + R + 0.1);
  const mod = c.createOscillator(),
    modG = c.createGain();
  mod.type = "sine";
  mod.frequency.value = freq * 2.76;
  modG.gain.setValueAtTime(freq * 3, t);
  modG.gain.exponentialRampToValueAtTime(freq * 0.1, t + 0.5);
  mod.connect(modG).connect(car.frequency);
  mod.start(t);
  mod.stop(t + dur + R + 0.1);
  const car2 = c.createOscillator(),
    g2 = c.createGain();
  car2.type = "sine";
  car2.frequency.value = freq * 3.5;
  g2.gain.setValueAtTime(0, t);
  g2.gain.linearRampToValueAtTime(0.15 * v, t + 0.003);
  g2.gain.exponentialRampToValueAtTime(0.001, t + dur + R * 0.6);
  car2.connect(g2).connect(dest);
  car2.start(t);
  car2.stop(t + dur + R * 0.6 + 0.1);
}
function playMarimba(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const R = synth ? synth.r : 0.3;
  [1, 4].forEach((h, i) => {
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = "sine";
    o.frequency.value = freq * h;
    const amp = (i === 0 ? 0.5 : 0.1) * v;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur + R);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + R + 0.1);
  });
}
function playChoir(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.5,
    D = synth ? synth.d : 0.5,
    S = synth ? synth.s : 0.9,
    R = synth ? synth.r : 1.0;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 800;
  filter.Q.value = 4;
  filter.connect(dest);
  [-8, 0, 8, -4, 4].forEach((det) => {
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = "sawtooth";
    o.frequency.value = freq * Math.pow(2, det / 1200);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.08 * v, t + A);
    g.gain.linearRampToValueAtTime(0.08 * v * S, t + A + D);
    g.gain.setValueAtTime(0.08 * v * S, t + dur);
    g.gain.linearRampToValueAtTime(0.001, t + dur + R);
    o.connect(g).connect(filter);
    o.start(t);
    o.stop(t + dur + R + 0.1);
  });
}
function playChip(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.001,
    D = synth ? synth.d : 0.1,
    S = synth ? synth.s : 0.3,
    R = synth ? synth.r : 0.1;
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.2 * v, t + A);
  g.gain.linearRampToValueAtTime(0.2 * v * S, t + A + D);
  g.gain.setValueAtTime(0.2 * v * S, t + dur);
  g.gain.linearRampToValueAtTime(0.001, t + dur + R);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + R + 0.1);
}
function playSupersaw(c, t, dest, freq, vel, dur, synth) {
  const v = (vel ?? 100) / 127;
  const A = synth ? synth.a : 0.02,
    D = synth ? synth.d : 0.15,
    S = synth ? synth.s : 0.6,
    R = synth ? synth.r : 0.2;
  const cutoff = synth ? synth.cutoff || 8000 : 8000;
  const q = synth ? synth.q || 2 : 2;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  filter.Q.value = q;
  filter.connect(dest);
  [-15, -7, 0, 7, 15].forEach((det) => {
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = "sawtooth";
    o.frequency.value = freq * Math.pow(2, det / 1200);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07 * v, t + A);
    g.gain.linearRampToValueAtTime(0.07 * v * S, t + A + D);
    g.gain.setValueAtTime(0.07 * v * S, t + dur);
    g.gain.linearRampToValueAtTime(0.001, t + dur + R);
    o.connect(g).connect(filter);
    o.start(t);
    o.stop(t + dur + R + 0.1);
  });
}
const DRUM_INSTRUMENTS = {
  kick: playKick,
  snare: playSnare,
  hat: playHat,
  openhat: playOpenHat,
  clap: playClap,
  tom: playTom,
};
const MELODIC_INSTRUMENTS = {
  bass: playBass,
  lead: playLead,
  piano: playPiano,
  pad: playPad,
  pluck: playPluck,
  arp: playArp,
  guitar: playGuitar,
  /* v18 */
  organ: playOrgan,
  strings: playStrings,
  brass: playBrass,
  flute: playFlute,
  bell: playBell,
  marimba: playMarimba,
  choir: playChoir,
  chip: playChip,
  supersaw: playSupersaw,
};
/* ---------- Scheduler-Support ---------- */
function notesAtStep(p, tid, st) {
  return (p.pianoRoll[tid] || []).filter((n) => Math.floor(n.start) === st);
}
function patternHasNoteAtStep(p, tid, st) {
  return (p.pianoRoll[tid] || []).some((n) => Math.floor(n.start) === st);
}
function playMetronomeTick(c, dest, time, isDownbeat) {
  try {
    if (metronomeSound === "woodblock") {
      const n = noiseSource(c);
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = isDownbeat ? 2000 : 1500;
      bp.Q.value = 8;
      const g = c.createGain();
      g.gain.setValueAtTime(0.5, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      n.connect(bp);
      bp.connect(g);
      g.connect(dest);
      n.start(time);
      n.stop(time + 0.04);
    } else if (metronomeSound === "cowbell") {
      const f1 = isDownbeat ? 540 : 400,
        f2 = isDownbeat ? 800 : 600;
      [f1, f2].forEach((freq) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "square";
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.3, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        o.connect(g);
        g.connect(dest);
        o.start(time);
        o.stop(time + 0.09);
      });
    } else if (metronomeSound === "beep") {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = isDownbeat ? 1500 : 1000;
      g.gain.setValueAtTime(0.6, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      o.connect(g);
      g.connect(dest);
      o.start(time);
      o.stop(time + 0.05);
    } else {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = isDownbeat ? 1000 : 800;
      g.gain.setValueAtTime(0.8, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      o.connect(g).connect(dest);
      o.start(time);
      o.stop(time + 0.06);
    }
  } catch (e) {
    try {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = isDownbeat ? 1000 : 800;
      g.gain.setValueAtTime(0.6, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      o.connect(g).connect(dest);
      o.start(time);
      o.stop(time + 0.06);
    } catch (_) {}
  }
}
function scheduleTrackStep(
  c,
  busMap,
  track,
  patternId,
  localStep,
  time,
  stepDur,
  absoluteStep,
  metroDest
) {
  const pat = patterns[patternId];
  const absStep = absoluteStep == null ? localStep : absoluteStep;

  if (metronomeOn && metroDest && absStep % 4 === 0) {
    playMetronomeTick(c, metroDest, time, absStep % 16 === 0);
  }

  // Sidechain: duck this track when kick fires
  if (
    track.sidechain &&
    track.id !== "kick" &&
    busMap[track.id] &&
    busMap[track.id].scGain
  ) {
    const kickData = getStepData(pat, "kick", localStep);
    if (kickData && kickData.on) {
      try {
        const sc = busMap[track.id].scGain.gain;
        const amt = Math.max(0, Math.min(1, track.sidechainAmount ?? 0.7));
        const rel = Math.max(0.02, Math.min(2, track.sidechainRelease ?? 0.15));
        sc.cancelScheduledValues(time);
        sc.setValueAtTime(1, time);
        sc.linearRampToValueAtTime(1 - amt, time + 0.005);
        sc.linearRampToValueAtTime(1, time + rel);
      } catch (e) {}
    }
  }

  // Sample-track with piano-roll notes → chromatic pitch-shift playback
  if (
    track.type === "sample" &&
    pat.pianoRoll &&
    pat.pianoRoll[track.id] &&
    pat.pianoRoll[track.id].length > 0
  ) {
    const sample = samples[track.id];
    if (!sample || !sample.buffer) return;
    const notesHere = notesAtStep(pat, track.id, localStep);
    const rootMidi = track.rootMidi || 60;
    notesHere.forEach((n) => {
      const semis = (n.midi || rootMidi) - rootMidi;
      const rate = Math.pow(2, semis / 12) * (sample.tuneRate || 1);
      const velN = Math.max(1, Math.min(127, n.vel || 100));
      playSampleNode(
        c,
        time,
        busMap[track.id].input,
        sample.buffer,
        velN / 127,
        sample,
        undefined,
        rate
      );
    });
    return;
  }

  if (track.type === "drum" || track.type === "sample") {
    const sd = getStepData(pat, track.id, localStep);
    if (!sd || !sd.on) return;
    if (sd.prob < 1) {
      const r = stepRandom(projectSeed, track.id, absStep);
      if (r >= sd.prob) return;
    }
    const off = (sd.offset || 0) * stepDur;
    let humT = 0;
    if (humanizeTiming > 0) {
      const r = stepRandom(projectSeed + "_ht", track.id, absStep);
      humT = (r - 0.5) * 2 * humanizeTiming * stepDur * 0.5;
    }
    let vel = sd.vel == null ? 100 : sd.vel;
    if (sd.accent) vel = Math.min(127, vel * 1.25);
    if (humanizeVelocity > 0) {
      const r = stepRandom(projectSeed + "_hv", track.id, absStep);
      vel = Math.max(
        1,
        Math.min(127, vel + (r - 0.5) * 2 * humanizeVelocity * 30)
      );
    }
    // v17: Groove anwenden (nur Drum/Sample, nicht Metronom)
    const groove = getGrooveOffsets(
      localStep,
      grooveTemplateId,
      grooveStrength
    );
    const grooveT = groove.timeOffset * stepDur;
    vel = Math.max(1, Math.min(127, vel * groove.velMult));
    const base = time + off + humT + grooveT;
    const rat = Math.max(1, Math.min(8, sd.ratchet || 1));
    const sub = stepDur / rat;
    if (track.type === "drum") {
      const fn = DRUM_INSTRUMENTS[track.instr];
      if (!fn) return;
      for (let i = 0; i < rat; i++) {
        const t = base + i * sub;
        const tp = rat > 1 ? 1 - (i / rat) * 0.4 : 1;
        const sv = Math.max(1, Math.min(127, vel * tp));
        fn(c, t, busMap[track.id].input, sv / 127, track);
      }
    } else {
      const s = samples[track.id];
      if (!s || !s.buffer) return;
      for (let i = 0; i < rat; i++) {
        const t = base + i * sub;
        const tp = rat > 1 ? 1 - (i / rat) * 0.4 : 1;
        const sv = Math.max(1, Math.min(127, vel * tp));
        let sliceIdx = undefined;
        if (s.slices && s.slices.length > 0) {
          sliceIdx = localStep % s.slices.length;
        }
        playSampleNode(
          c,
          t,
          busMap[track.id].input,
          s.buffer,
          sv / 127,
          s,
          sliceIdx,
          s.tuneRate || 1
        );
      }
    }
    return;
  }
  const notes = notesAtStep(pat, track.id, localStep);
  const fn = MELODIC_INSTRUMENTS[track.instr];
  if (!fn) return;

  // Arp mode
  if (track.arp && track.arp.enabled) {
    const rate = Math.max(1, Math.min(8, track.arp.rate | 0 || 4));
    const octaves = Math.max(1, Math.min(4, track.arp.octaves | 0 || 1));
    const mode = track.arp.mode || "up";
    notes.forEach((n) => {
      const totalDur = Math.max(0.05, n.len || 1) * stepDur;
      const subDur = totalDur / rate;
      for (let i = 0; i < rate; i++) {
        let octOffset;
        if (mode === "down") {
          octOffset = octaves - 1 - (i % octaves);
        } else if (mode === "updown") {
          const cycle = Math.max(1, 2 * octaves - 2);
          const pos = i % cycle;
          octOffset = pos < octaves ? pos : cycle - pos;
        } else {
          octOffset = i % octaves;
        }
        const midi = n.midi + 12 * octOffset;
        const t = time + i * subDur;
        try {
          fn(
            c,
            t,
            busMap[track.id].input,
            midiToFreq(midi),
            n.vel,
            subDur * 0.9,
            track.synth
          );
        } catch (e) {}
      }
    });
    return;
  }
  // Normal (non-arp) — mit Groove
  const grooveM = getGrooveOffsets(localStep, grooveTemplateId, grooveStrength);
  const grooveTM = grooveM.timeOffset * stepDur;
  notes.forEach((n) => {
    const d = Math.max(0.05, n.len || 1) * stepDur;
    const nVel = Math.max(1, Math.min(127, (n.vel || 100) * grooveM.velMult));
    try {
      fn(
        c,
        time + grooveTM,
        busMap[track.id].input,
        midiToFreq(n.midi),
        nVel,
        d,
        track.synth
      );
    } catch (e) {}
  });
}
function getSongLength() {
  let max = 64;
  song.blocks.forEach(
    (b) => (max = Math.max(max, b.startStep + b.lengthSteps))
  );
  automation.lanes.forEach((l) =>
    l.clips.forEach(
      (cl) => (max = Math.max(max, cl.startStep + cl.lengthSteps))
    )
  );
  if (song.loopEnd > 0) max = Math.max(max, song.loopEnd);
  return max;
}
