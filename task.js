
// =========================
// TASK MENU
// =========================

const taskMenu = document.getElementById("taskMenu");

const taskScreen = document.getElementById("taskScreen");
const task2Screen = document.getElementById("task2Screen");

const task1 = document.getElementById("task1");
const task2 = document.getElementById("task2");

const taskProgress = document.getElementById("taskProgress");

// 업무 결과 저장
let task1Correct = false;
let task2Correct = false;

function showTaskMenu() {
    taskMenu.classList.add("visible");
}


// =========================
// TASK 01
// =========================

task1.addEventListener("click", () => {
    taskMenu.classList.remove("visible");
    taskScreen.classList.add("visible");
});

const choiceA = document.getElementById("choiceA");
const choiceB = document.getElementById("choiceB");

function finishTask1(isCorrect) {
    task1Correct = isCorrect;

    taskScreen.classList.remove("visible");

    // TASK 02 잠금 해제
    task2.classList.remove("locked");
    task2.querySelector(".task-status").textContent = "AVAILABLE";

    taskProgress.textContent = "TASK PROGRESS : 1 / 2";

    taskMenu.classList.add("visible");

    console.log(isCorrect ? "TASK 01 정답!" : "TASK 01 오답!");
}

// A: 전력 공급 설비 개선 (오답)
choiceA.addEventListener("click", () => {
    finishTask1(false);
});

// B: 냉각 시스템 개선 (정답)
choiceB.addEventListener("click", () => {
    finishTask1(true);
});


// =========================
// TASK 02
// =========================

task2.addEventListener("click", () => {
    if (task2.classList.contains("locked")) return;

    taskMenu.classList.remove("visible");
    task2Screen.classList.add("visible");
});

const choiceC = document.getElementById("choiceC");
const choiceD = document.getElementById("choiceD");

function finishTask2(isCorrect) {
    task2Correct = isCorrect;

    task2Screen.classList.remove("visible");

    taskProgress.textContent = "TASK PROGRESS : 2 / 2";

document.getElementById("submitButton").disabled = false;

    taskMenu.classList.add("visible");

    console.log(isCorrect ? "TASK 02 정답!" : "TASK 02 오답!");

    console.log(
        task1Correct && task2Correct
            ? "완벽 엔딩 조건 충족!"
            : "부족 엔딩 조건!"
    );
}

// A: 서버 자원 추가 (오답)
choiceC.addEventListener("click", () => {
    finishTask2(false);
});

// B: AI 연산 과정 최적화 (정답)
choiceD.addEventListener("click", () => {
    finishTask2(true);
});


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

// 두 업무가 같은 자료창을 사용
function openDataWindow() {
    dataContent.innerHTML = `
        <img
            src="./images/task1-data.jpeg"
            alt="데이터 센터 에너지 소비 관련 자료"
            class="data-image"
        >
    `;

    dataWindow.classList.add("visible");
}

dataButtons.forEach(button => {
    button.addEventListener("click", openDataWindow);
});

closeDataButton.addEventListener("click", () => {
    dataWindow.classList.remove("visible");
});



// =========================
// SUBMIT REPORT
// =========================

const submitButton = document.getElementById("submitButton");
const endingScreen = document.getElementById("endingScreen");

const endingTitle = document.getElementById("endingTitle");
const endingSubtitle = document.getElementById("endingSubtitle");

submitButton.addEventListener("click", () => {

    // 두 업무를 모두 완료했는지 확인
    if (!task1Correct && task1Correct !== false) return;
    if (taskProgress.textContent !== "TASK PROGRESS : 2 / 2") return;

    // 완벽 엔딩
    if (task1Correct && task2Correct) {

        endingTitle.textContent = "PERFECT";
        endingSubtitle.textContent =
            "모든 업무를 성공적으로 완료했습니다.";

    }

    // 부족 엔딩
    else {

        endingTitle.textContent = "INCOMPLETE";
        endingSubtitle.textContent =
            "일부 업무에서 개선이 필요한 부분이 발견되었습니다.";

    }

    // 업무 메뉴 숨기기
    taskMenu.classList.remove("visible");

    // 엔딩 화면 표시
    endingScreen.classList.add("visible");

});


// =========================
// RETURN TO MAIN MENU
// =========================

const returnMenuButton = document.getElementById("returnMenuButton");

returnMenuButton.addEventListener("click", () => {
    endingScreen.classList.remove("visible");

    document.getElementById("gameScreen").classList.remove("visible");

    const menu = document.getElementById("mainMenu");

    menu.style.display = "";
    menu.classList.add("visible");
});