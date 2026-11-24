
// =========================
// RHYTHM GAME DATA
// =========================


// =========================
// NOTE SETTINGS
// =========================

const RHYTHM_NOTE_COUNT = 16;

// 노트 간격
const RHYTHM_BEAT_INTERVAL = 150;

// 노트 이동 시간
const RHYTHM_TRAVEL_TIME = 650;


// =========================
// JUDGEMENT SETTINGS
// =========================

const RHYTHM_JUDGEMENTS = [
    { name: "EXCELLENT", score: 100, timing: 50 },
    { name: "GREAT", score: 80, timing: 100 },
    { name: "GOOD", score: 60, timing: 160 },
    { name: "BAD", score: 30, timing: 220 }
];


// =========================
// NOTE CHART
// =========================

// 0 = ←
// 1 = ↓
// 2 = ↑
// 3 = →

// TASK 1 패턴
const rhythmChart1 = [
    0, 1, 2, 3,
    2, 1, 0, 1,
    2, 2, 3, 0,
    1, 0, 3, 2
];

// TASK 2 패턴
const rhythmChart2 = [
    2, 2, 3, 0,
    1, 2, 3, 0,
    2, 1, 3, 0,
    3, 3, 0, 3
];