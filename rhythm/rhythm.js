
// =========================
// RHYTHM GAME
// =========================

// =========================
// DOM ELEMENTS
// =========================

const hitSounds = [
    new Audio("./music/hit.mp3"),
    new Audio("./music/hit.mp3"),
    new Audio("./music/hit.mp3"),
    new Audio("./music/hit.mp3")
];

let hitSoundIndex = 0;

const rhythmScreen = document.getElementById("rhythmScreen");
const rhythmProgress = document.getElementById("rhythmProgress");

const rhythmJudgement = document.getElementById("rhythmJudgement");

const rhythmResult = document.getElementById("rhythmResult");
const rhythmGrade = document.getElementById("rhythmGrade");
const rhythmAccuracy = document.getElementById("rhythmAccuracy");
const rhythmBreakdown = document.getElementById("rhythmBreakdown");

const rhythmContinueButton = document.getElementById("rhythmContinueButton");

const rhythmGameArea = document.querySelector(".rhythm-game-area");

const rhythmLanes = document.querySelectorAll(".rhythm-lane");

const rhythmNoteContainers = Array.from(
    document.querySelectorAll(".rhythm-note-container")
);

const rhythmTargets = Array.from(
    document.querySelectorAll(".rhythm-target")
);


// =========================
// GAME STATE
// =========================

let rhythmActive = false;

let rhythmTaskNumber = null;
let rhythmCallback = null;

let rhythmAnimationFrame = null;
let rhythmStartTime = 0;

let rhythmNotes = [];

let rhythmJudgedCount = 0;
let rhythmScore = 0;

let rhythmCounts = {
    EXCELLENT: 0,
    GREAT: 0,
    GOOD: 0,
    BAD: 0,
    MISS: 0
};

let rhythmResultData = null;


// TASK별 결과 저장
window.rhythmTaskResults = window.rhythmTaskResults || {};


// =========================
// KEY SETTINGS
// =========================

const rhythmKeyMap = {
    ArrowLeft: 0,
    ArrowDown: 1,
    ArrowUp: 2,
    ArrowRight: 3
};


// =========================
// START GAME
// =========================


function startRhythmGame(taskNumber, callback) {

    if (!rhythmScreen) {
        console.error("Rhythm screen not found.");
        return;
    }

    // 이전 게임 초기화
    resetRhythmGame();

    rhythmTaskNumber = taskNumber;
    rhythmCallback = callback;

    rhythmActive = true;

    rhythmJudgedCount = 0;
    rhythmScore = 0;

    rhythmCounts = {
        EXCELLENT: 0,
        GREAT: 0,
        GOOD: 0,
        BAD: 0,
        MISS: 0
    };

    rhythmResultData = null;

    rhythmProgress.textContent = `NOTE 00 / ${RHYTHM_NOTE_COUNT}`;

    rhythmJudgement.textContent = "";
    rhythmResult.hidden = true;

    // ★ 먼저 게임 시작 시간을 기록
    rhythmStartTime = performance.now();

    // 그다음 노트 생성
    createRhythmNotes();

    // 화면 표시
    rhythmScreen.classList.add("visible");

    // 게임 루프 시작
    rhythmAnimationFrame = requestAnimationFrame(updateRhythmGame);
}



// =========================
// CREATE NOTES
// =========================

function createRhythmNotes() {

    rhythmNotes = [];

    rhythmNoteContainers.forEach(container => {
        container.innerHTML = "";
    });

    // TASK 번호에 따라 패턴 선택
    const selectedChart =
        rhythmTaskNumber === 1
            ? rhythmChart1
            : rhythmChart2;

    for (let i = 0; i < RHYTHM_NOTE_COUNT; i++) {

        const lane = selectedChart[i];

        const note = document.createElement("div");

        note.className = "rhythm-note";

        rhythmNoteContainers[lane].appendChild(note);

        rhythmNotes.push({

            index: i,
            lane: lane,

            element: note,

            targetTime:
                rhythmStartTime +
                RHYTHM_TRAVEL_TIME +
                i * RHYTHM_BEAT_INTERVAL,

            judged: false

        });

    }

}
// =========================
// GAME LOOP
// =========================

function updateRhythmGame(currentTime) {

    if (!rhythmActive) return;

    const elapsedTime = currentTime - rhythmStartTime;

    const areaHeight = rhythmGameArea.clientHeight;

    const noteHeight = 18;

    const targetHeight = 35;
    
    const targetTop = 45 + 35 / 2 - noteHeight / 2;

    const initialTop = areaHeight + noteHeight;

    const travelDistance = initialTop - targetTop;

    rhythmNotes.forEach(note => {

        if (note.judged) return;

        const noteStartTime =
            note.targetTime - RHYTHM_TRAVEL_TIME;

        const progress =
            (currentTime - noteStartTime) / RHYTHM_TRAVEL_TIME;

        const clampedProgress = Math.max(
            0,
            Math.min(1, progress)
        );

        const position =
            initialTop - travelDistance * clampedProgress;

        note.element.style.top = `${position}px`;

        // 판정 가능 시간이 지나면 MISS
        if (currentTime > note.targetTime + 220) {

            judgeRhythmNote(note, "MISS");

        }

    });


    // 진행 상황 표시
    rhythmProgress.textContent =
        `NOTE ${String(rhythmJudgedCount).padStart(2, "0")} / ${RHYTHM_NOTE_COUNT}`;


    // 모든 노트 판정 완료
    if (rhythmJudgedCount >= RHYTHM_NOTE_COUNT) {

        finishRhythmGame();
        return;

    }

    rhythmAnimationFrame =
        requestAnimationFrame(updateRhythmGame);

}


// =========================
// KEY INPUT
// =========================

document.addEventListener("keydown", event => {

    if (!rhythmActive) return;

    const lane = rhythmKeyMap[event.key];

    if (lane === undefined) return;

    event.preventDefault();

    if (event.repeat) return;

    // 방향키 타격음
    const sound = hitSounds[hitSoundIndex];

    sound.volume = 0.25;
    sound.currentTime = 0;
    sound.play().catch(() => {});

hitSoundIndex =
    (hitSoundIndex + 1) % hitSounds.length;

    const currentTime = performance.now();

    // 해당 레인의 가장 가까운 미판정 노트 찾기
    let nearestNote = null;
    let nearestDifference = Infinity;

    rhythmNotes.forEach(note => {

        if (note.judged) return;
        if (note.lane !== lane) return;

        const difference =
            Math.abs(currentTime - note.targetTime);

        if (difference < nearestDifference) {

            nearestDifference = difference;
            nearestNote = note;

        }

    });


    // 판정 범위 밖이면 입력 무시
    if (!nearestNote || nearestDifference > 220) return;


    const timingDifference =
        Math.abs(currentTime - nearestNote.targetTime);


    let judgement = "MISS";

    for (const item of RHYTHM_JUDGEMENTS) {

        if (timingDifference <= item.timing) {

            judgement = item.name;
            break;

        }

    }


    judgeRhythmNote(nearestNote, judgement);


    // 레인 반짝임
    const target = rhythmTargets[lane];

    if (target) {

        target.classList.add("hit");

        setTimeout(() => {
            target.classList.remove("hit");
        }, 100);

    }

});

// =========================
// JUDGE NOTE
// =========================

function judgeRhythmNote(note, judgement) {

    if (note.judged) return;

    note.judged = true;

    note.element.remove();

    rhythmJudgedCount++;

    rhythmCounts[judgement]++;

    const judgementData = RHYTHM_JUDGEMENTS.find(
        item => item.name === judgement
    );

    if (judgementData) {

        rhythmScore += judgementData.score;

    }

    // 판정 텍스트 표시
    rhythmJudgement.textContent = judgement;

    rhythmJudgement.className = "rhythm-judgement";

    rhythmJudgement.classList.add(
        judgement.toLowerCase()
    );

}


// =========================
// FINISH GAME
// =========================

function finishRhythmGame() {

    rhythmActive = false;

    cancelAnimationFrame(rhythmAnimationFrame);

    const accuracy =
        (rhythmScore / (RHYTHM_NOTE_COUNT * 100)) * 100;


    let grade = "D";

    if (accuracy >= 95) {
        grade = "S";
    } else if (accuracy >= 85) {
        grade = "A";
    } else if (accuracy >= 70) {
        grade = "B";
    } else if (accuracy >= 50) {
        grade = "C";
    }


    rhythmResultData = {

        taskNumber: rhythmTaskNumber,

        score: rhythmScore,

        accuracy: Number(accuracy.toFixed(1)),

        grade: grade,

        counts: { ...rhythmCounts }

    };


    // TASK별 결과 저장
    window.rhythmTaskResults[rhythmTaskNumber] =
        rhythmResultData;


    // 결과 화면
    rhythmGrade.textContent = grade;

    rhythmAccuracy.textContent =
        `${accuracy.toFixed(1)}%`;


    rhythmBreakdown.innerHTML = `
        <p>EXCELLENT : ${rhythmCounts.EXCELLENT}</p>
        <p>GREAT : ${rhythmCounts.GREAT}</p>
        <p>GOOD : ${rhythmCounts.GOOD}</p>
        <p>BAD : ${rhythmCounts.BAD}</p>
        <p>MISS : ${rhythmCounts.MISS}</p>
    `;


    rhythmResult.hidden = false;

}


// =========================
// CONTINUE
// =========================

rhythmContinueButton.addEventListener("click", () => {

    if (!rhythmResultData) return;

    const result = rhythmResultData;
    const callback = rhythmCallback;

    rhythmScreen.classList.remove("visible");

    resetRhythmGame();

    // 기존 TASK 화면 복귀 처리
    if (typeof callback === "function") {

        callback(result);

    }

});


// =========================
// RESET GAME
// =========================

function resetRhythmGame() {

    rhythmActive = false;

    cancelAnimationFrame(rhythmAnimationFrame);

    rhythmAnimationFrame = null;

    rhythmNotes = [];

    rhythmJudgedCount = 0;
    rhythmScore = 0;

    rhythmJudgement.textContent = "";

    rhythmResult.hidden = true;

    rhythmNoteContainers.forEach(container => {
        container.innerHTML = "";
    });

    rhythmTargets.forEach(target => {
        target.classList.remove("hit");
    });

    rhythmScreen.classList.remove("visible");

}
