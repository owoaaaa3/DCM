
// =========================
// TASK MENU
// =========================

const taskMenu = document.getElementById("taskMenu");

const taskScreen = document.getElementById("taskScreen");
const task2Screen = document.getElementById("task2Screen");

const task1 = document.getElementById("task1");
const task2 = document.getElementById("task2");

const taskProgress = document.getElementById("taskProgress");
const submitButton = document.getElementById("submitButton");


// 업무 결과 저장
let task1Correct = false;
let task2Correct = false;

let task1Finished = false;
let task2Finished = false;


// 리듬게임 결과 저장
let task1RhythmResult = null;
let task2RhythmResult = null;


// 현재 진행 중인 과제
let currentTaskNumber = null;
let currentTaskCorrect = false;


// =========================
// DATA WINDOW
// =========================

const dataWindow = document.getElementById("dataWindow");
const closeDataButton = document.getElementById("closeDataButton");
const dataContent = document.getElementById("dataContent");

const dataButtons = [
    document.getElementById("dataButton"),
    document.getElementById("task2DataButton")
];


// =========================
// ENDING ELEMENTS
// =========================

const endingScreen = document.getElementById("endingScreen");

const endingTitle = document.getElementById("endingTitle");
const endingSubtitle = document.getElementById("endingSubtitle");
const endingDescription = document.getElementById("endingDescription");


// 성과 분석 페이지
const performancePage = document.getElementById("performancePage");

const performanceAccuracy =
    document.getElementById("performanceAccuracy");

const performanceScoreFill =
    document.getElementById("performanceScoreFill");

const performanceTotalScore =
    document.getElementById("performanceTotalScore");

const performanceMiss =
    document.getElementById("performanceMiss");

const performanceExcellent =
    document.getElementById("performanceExcellent");

const performanceGreat =
    document.getElementById("performanceGreat");

const performanceGood =
    document.getElementById("performanceGood");

const performanceBad =
    document.getElementById("performanceBad");

const performanceNextButton =
    document.getElementById("performanceNextButton");


// 보고서 평가 및 정책 분석 페이지
const evaluationPage = document.getElementById("evaluationPage");
const policyPage = document.getElementById("policyPage");

const endingNextButton = document.getElementById("endingNextButton");
const returnMenuButton = document.getElementById("returnMenuButton");


// =========================
// TASK COMPLETION BUTTON
// =========================

// 리듬게임을 마친 뒤 과제 화면에 표시할 버튼
function createTaskCompleteButton(taskNumber) {

    const targetScreen =
        taskNumber === 1 ? taskScreen : task2Screen;

    const taskFooter = targetScreen.querySelector(".task-footer");

    // 기존 버튼 제거
    const existingButton =
        document.getElementById("taskCompleteButton");

    if (existingButton) {
        existingButton.remove();
    }

    const completeButton = document.createElement("button");

    completeButton.id = "taskCompleteButton";
    completeButton.type = "button";
    completeButton.className = "data-button";
    completeButton.textContent = "과제 완료";

    completeButton.addEventListener("click", () => {

        if (taskNumber === 1) {
            finishTask1(currentTaskCorrect);
        } else {
            finishTask2(currentTaskCorrect);
        }

    });

    taskFooter.appendChild(completeButton);
}


// =========================
// TASK RESET
// =========================

function resetTaskState() {

    task1Correct = false;
    task2Correct = false;

    task1Finished = false;
    task2Finished = false;

    task1RhythmResult = null;
    task2RhythmResult = null;

    currentTaskNumber = null;
    currentTaskCorrect = false;

    // 두 업무 모두 다시 접근 가능
    task1.classList.remove("locked", "completed");
    task2.classList.remove("locked", "completed");

    task1.querySelector(".task-status").textContent = "AVAILABLE";
    task2.querySelector(".task-status").textContent = "AVAILABLE";

    // 진행도 초기화
    taskProgress.textContent = "TASK PROGRESS : 0 / 2";

    submitButton.disabled = true;

    // 선택 버튼 초기화
    [
        document.getElementById("choiceA"),
        document.getElementById("choiceB"),
        document.getElementById("choiceC"),
        document.getElementById("choiceD")
    ].forEach(button => {

        button.disabled = false;
        button.classList.remove("choice-selected");

    });

    // 과제 완료 버튼 제거
    const completeButton =
        document.getElementById("taskCompleteButton");

    if (completeButton) {
        completeButton.remove();
    }

    // 화면 초기화
    taskMenu.classList.remove("visible");
    taskScreen.classList.remove("visible");
    task2Screen.classList.remove("visible");

    dataWindow.classList.remove("visible");
    dataContent.innerHTML = "";

    endingScreen.classList.remove("visible");

    // 엔딩 페이지 초기화
    performancePage.classList.add("active");
    evaluationPage.classList.remove("active");
    policyPage.classList.remove("active");

    // 성과 분석 게이지 초기화
    performanceScoreFill.style.width = "0%";

    performanceAccuracy.textContent = "0.0";
    performanceTotalScore.textContent = "0 / 3,200";

    performanceMiss.textContent = "0";
    performanceExcellent.textContent = "0";
    performanceGreat.textContent = "0";
    performanceGood.textContent = "0";
    performanceBad.textContent = "0";
}


// 처음부터 두 업무 모두 접근 가능
resetTaskState();


// =========================
// TASK MENU
// =========================

function showTaskMenu() {
    taskMenu.classList.add("visible");
}


// 진행도 업데이트
function updateTaskProgress() {

    const completedCount =
        Number(task1Finished) + Number(task2Finished);

    taskProgress.textContent =
        `TASK PROGRESS : ${completedCount} / 2`;

    submitButton.disabled = completedCount !== 2;
}


// =========================
// RHYTHM GAME CONNECTION
// =========================

function beginTaskRhythm(taskNumber, isCorrect) {

    currentTaskNumber = taskNumber;
    currentTaskCorrect = isCorrect;

    // 현재 과제 화면 숨기기
    if (taskNumber === 1) {
        taskScreen.classList.remove("visible");
    } else {
        task2Screen.classList.remove("visible");
    }

    // 리듬게임 시작
    if (typeof startRhythmGame !== "function") {

        console.error(
            "리듬게임을 시작할 수 없습니다. rhythm.js를 확인하세요."
        );

        return;
    }

    startRhythmGame(taskNumber, (result) => {

        // 리듬게임 결과 저장
        if (taskNumber === 1) {
            task1RhythmResult = result;
        } else {
            task2RhythmResult = result;
        }

        // 해당 과제 즉시 완료 처리
        if (taskNumber === 1) {
            finishTask1(currentTaskCorrect);
        } else {
            finishTask2(currentTaskCorrect);
        }

    });

}


// =========================
// TASK 01
// =========================

task1.addEventListener("click", () => {

    if (task1Finished) return;

    taskMenu.classList.remove("visible");
    taskScreen.classList.add("visible");

});


const choiceA = document.getElementById("choiceA");
const choiceB = document.getElementById("choiceB");


function finishTask1(isCorrect) {

    if (task1Finished) return;

    // 선택 순간 섬광
    screenFlash();

    task1Correct = isCorrect;
    task1Finished = true;
    currentTaskNumber = null;

    taskScreen.classList.remove("visible");

    task1.classList.add("completed");
    task1.classList.remove("locked");

    task1.querySelector(".task-status").textContent = "COMPLETED";

    updateTaskProgress();

    taskMenu.classList.add("visible");

    console.log(isCorrect ? "TASK 01 정답!" : "TASK 01 오답!");

}


// A: 서버 규모 확대 (오답)
choiceA.addEventListener("click", () => {

    if (currentTaskNumber !== null) return;

    choiceA.classList.add("choice-selected");

    playTaskDialogue(
        "수요 증가에는 규모도 커져야 대응할 수 있겠지. 서버 규모를 확대하자.",
        () => beginTaskRhythm(1, false)
    );

});


// B: 기존 방식 유지 및 효율 개선 (정답)
choiceB.addEventListener("click", () => {

    if (currentTaskNumber !== null) return;

    choiceB.classList.add("choice-selected");

    playTaskDialogue(
        "기존 방식으로 그대로 간다면 큰일 나겠어… 효율 개선이 우선이겠는걸.",
        () => beginTaskRhythm(1, true)
    );

});


// =========================
// TASK 02
// =========================

task2.addEventListener("click", () => {

    if (task2Finished) return;

    taskMenu.classList.remove("visible");
    task2Screen.classList.add("visible");

});


const choiceC = document.getElementById("choiceC");
const choiceD = document.getElementById("choiceD");


function finishTask2(isCorrect) {

    if (task2Finished) return;

    // 선택 순간 섬광
    screenFlash();

    task2Correct = isCorrect;
    task2Finished = true;
    currentTaskNumber = null;

    task2Screen.classList.remove("visible");

    task2.classList.add("completed");
    task2.classList.remove("locked");

    task2.querySelector(".task-status").textContent = "COMPLETED";

    updateTaskProgress();

    taskMenu.classList.add("visible");

    console.log(isCorrect ? "TASK 02 정답!" : "TASK 02 오답!");

}


// A: 냉각 시스템 개선 (정답)
choiceC.addEventListener("click", () => {

    if (currentTaskNumber !== null) return;

    choiceC.classList.add("choice-selected");

    playTaskDialogue(
        "역시 냉각 시스템 개선이 가장 시급해 보여. 이걸 손보자.",
        () => beginTaskRhythm(2, true)
    );

});


// B: 전력 공급 설비 개선 (오답)
choiceD.addEventListener("click", () => {

    if (currentTaskNumber !== null) return;

    choiceD.classList.add("choice-selected");

    playTaskDialogue(
        "전력 공급 설비를 개선하면 낭비를 줄이는 데 도움이 되지 않을까?",
        () => beginTaskRhythm(2, false)
    );

});





// =========================
// DATA WINDOW
// =========================

function openDataWindow(taskNumber) {

    const imagePath = taskNumber === 1
        ? "./images/task1-data.jpeg"
        : "./images/task2-data.jpeg";

    const imageAlt = taskNumber === 1
        ? "데이터센터 전력 소비량 증가 추이 그래프"
        : "데이터센터 냉각 관련 전력 소비 자료";

    dataContent.innerHTML = `
        <img
            src="${imagePath}"
            alt="${imageAlt}"
            class="data-image"
        >
    `;

    dataWindow.classList.add("visible");
}


// 각 과제 버튼 연결
dataButtons.forEach((button, index) => {

    button.addEventListener("click", () => {
        openDataWindow(index + 1);
    });

});


// 자료 창 닫기
closeDataButton.addEventListener("click", () => {
    dataWindow.classList.remove("visible");
});



// =========================
// PERFORMANCE ANALYSIS
// =========================

function updatePerformanceAnalysis() {

    const result1 = task1RhythmResult;
    const result2 = task2RhythmResult;

    // 두 과제의 리듬게임 결과가 모두 있는지 확인
    if (!result1 || !result2) {

        console.error(
            "리듬게임 결과가 저장되지 않았습니다.",
            {
                task1: result1,
                task2: result2
            }
        );

        return;
    }

    // 총점 계산
    const totalScore = result1.score + result2.score;

    // 최대 점수
    const maxScore = 3200;

    // 전체 달성률 계산
    const accuracy = (totalScore / maxScore) * 100;


    // 판정 횟수 합산
    const totalCounts = {

        EXCELLENT:
            (result1.counts?.EXCELLENT || 0) +
            (result2.counts?.EXCELLENT || 0),

        GREAT:
            (result1.counts?.GREAT || 0) +
            (result2.counts?.GREAT || 0),

        GOOD:
            (result1.counts?.GOOD || 0) +
            (result2.counts?.GOOD || 0),

        BAD:
            (result1.counts?.BAD || 0) +
            (result2.counts?.BAD || 0),

        MISS:
            (result1.counts?.MISS || 0) +
            (result2.counts?.MISS || 0)

    };


    // 화면에 결과 표시
    performanceAccuracy.textContent =
        accuracy.toFixed(1);

    performanceTotalScore.textContent =
        `${totalScore.toLocaleString()} / ${maxScore.toLocaleString()}`;


    // MISS 횟수
    performanceMiss.textContent =
        totalCounts.MISS;


    // 판정별 횟수
    performanceExcellent.textContent =
        totalCounts.EXCELLENT;

    performanceGreat.textContent =
        totalCounts.GREAT;

    performanceGood.textContent =
        totalCounts.GOOD;

    performanceBad.textContent =
        totalCounts.BAD;


    // 달성률 게이지
    performanceScoreFill.style.width =
        `${accuracy}%`;


    console.log("OVERALL PERFORMANCE", {
        totalScore,
        maxScore,
        accuracy,
        totalCounts
    });

}


// =========================
// SUBMIT REPORT
// =========================

submitButton.addEventListener("click", () => {

    if (!task1Finished || !task2Finished) return;

    // 중복 제출 방지
    submitButton.disabled = true;

    // 보고서 제출 섬광
    screenFlash();

    // 캐릭터 제출 후 대사
    playTaskDialogue(
        [
            "휴… 드디어 끝냈네.",
            "어라…? 벌써 검토 결과가 나왔잖아?",
            "어디 보자… 읽어볼까."
        ],
        () => {

            // 성과 분석 데이터 계산
            updatePerformanceAnalysis();

            // 첫 페이지인 성과 분석 페이지 표시
            performancePage.classList.add("active");
            evaluationPage.classList.remove("active");
            policyPage.classList.remove("active");


            // 완벽 엔딩
            if (task1Correct && task2Correct) {

                endingTitle.textContent = "REPORT APPROVED";

                endingSubtitle.textContent =
                    "보고서 검토 결과 · 적합";

                endingDescription.innerHTML = `
                    <h3>종합 검토 의견</h3>

                    <p>
                        데이터센터의 지속적인 발전은 인공지능 기술과
                        다양한 산업의 성장을 뒷받침하고 있습니다.
                    </p>

                    <p>
                        그러나 그 이면에는 막대한 전력 소비와
                        냉각 과정에서 발생하는 환경적 부담이 존재합니다.
                    </p>

                    <p>
                        기술의 발전과 환경 보호는 서로 대립하는 목표가 아닙니다.
                        에너지 효율을 높이고 지속 가능한 운영 방식을 도입한다면
                        두 가지 목표를 함께 실현할 수 있습니다.
                    </p>

                    <p>
                        전력 수요 증가 대응과 시스템 환경 개선을 통해
                        지속 가능한 데이터센터 운영을 실현해야 합니다.
                    </p>
                `;

            } else {

                // 부족 엔딩
                endingTitle.textContent = "REPORT INCOMPLETE";

                endingSubtitle.textContent =
                    "보고서 검토 결과 · 보완 필요";

                endingDescription.innerHTML = `
                    <h3>종합 검토 의견</h3>

                    <h4>01. 전력 수요 증가 대응</h4>

                    <p>
                        전력 수요 증가에 단순히 서버 규모를 확대하는 방식으로
                        대응한다면 불필요한 전력 소비와 에너지 낭비가
                        심화될 수 있습니다.
                        기존 데이터센터의 에너지 효율을 높이는 방안이 필요합니다.
                    </p>

                    <h4>02. 시스템 환경 개선</h4>

                    <p>
                        서버에서 발생하는 열을 관리하기 위한 냉각 과정 역시
                        상당한 전력을 소비합니다.
                        냉각 시스템을 개선하여 데이터센터 내부의
                        에너지 소비를 줄여야 합니다.
                    </p>

                    <p>
                        지속 가능한 데이터센터 운영을 위해
                        두 가지 개선 방향을 충분히 고려해야 합니다.
                    </p>
                `;
            }

            taskMenu.classList.remove("visible");
            endingScreen.classList.add("visible");

        }
    );

});


// =========================
// PERFORMANCE NEXT PAGE
// =========================

performanceNextButton.addEventListener("click", () => {

    performancePage.classList.remove("active");
    evaluationPage.classList.add("active");

});


// =========================
// NEXT REPORT
// =========================

endingNextButton.addEventListener("click", () => {

    evaluationPage.classList.remove("active");
    policyPage.classList.add("active");

});


// =========================
// RETURN TO MAIN MENU
// =========================

returnMenuButton.addEventListener("click", () => {

    // 정책 분석 화면 닫기
    endingScreen.classList.remove("visible");

    // 엔딩 페이지 초기화
    performancePage.classList.add("active");
    evaluationPage.classList.remove("active");
    policyPage.classList.remove("active");

    // 성과 분석 게이지 초기화
    performanceScoreFill.style.width = "0%";

    // 캐릭터 화면 복귀
    characterFrame.classList.add("visible");
    characterScreen.classList.add("active");

    // 마지막 후일담 대사
    playTaskDialogue(
        [
            "…생각보다 데이터센터와 환경은 밀접하게 연결되어 있었구나.",
            "기술이 발전하는 만큼, 그에 따른 환경적 부담도 함께 고민해야겠어.",
            "앞으로는 기술의 발전과 환경 보호가 공존할 수 있는 방법을 찾아야겠네."
        ],
        () => {
            returnToMainMenuAfterEnding();
        }
    );

});
