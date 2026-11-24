
const dialogues = [
    "휴… 드디어 오늘 업무도 끝나가네.",
    "이제 슬슬 정리하고 퇴근하면 되겠지?",
    "… 응? 잠깐, 뭐가 왔…",
    "추가 업무? 지금?",
    "아… 데이터 센터 환경 효율성 분석 보고서라.",
    "그러고 보니 최근 AI 연산량이 급격히 늘면서 전력 소비 문제도 커지고 있다고 했었지.",
    "이번 보고서에서는 에너지 효율 개선, 연산 과정 최적화, 해외 정책 분석까지 다뤄야 하는 모양이네.",
    "… 퇴근은 조금 미뤄야겠군.",
    "일단 하나씩 살펴보자."
];

const dialogueBox = document.getElementById("dialogueBox");
const dialogueText = document.getElementById("dialogueText");

const characterNormal = document.getElementById("characterNormal");
const characterTalk = document.getElementById("characterTalk");

let currentDialogue = 0;
let typing = false;
let typingTimer = null;
let dialogueEndTimer = null;
let displayedText = "";

// 업무 대사 상태
let taskDialogueActive = false;
let taskDialogueCallback = null;
let taskDialogueList = [];
let taskDialogueIndex = 0;


// =========================
// 공통 타이핑
// =========================

function startTyping(text) {

    if (typingTimer !== null) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    displayedText = text;
    dialogueText.textContent = "";

    typing = true;

    let index = 0;

    characterNormal.style.opacity = "0";
    characterTalk.style.opacity = "1";

    typingTimer = setInterval(() => {

        dialogueText.textContent += displayedText[index];
        index++;

        if (index >= displayedText.length) {

            clearInterval(typingTimer);
            typingTimer = null;

            typing = false;

            characterNormal.style.opacity = "1";
            characterTalk.style.opacity = "0";
        }

    }, 50);
}


// =========================
// 오프닝 대사 출력
// =========================

function showDialogue() {

    if (currentDialogue >= dialogues.length) return;

    dialogueBox.classList.add("visible");

    startTyping(dialogues[currentDialogue]);
}


// =========================
// 업무 대사 출력
// =========================

function playTaskDialogue(text, callback) {

    if (taskDialogueActive) return;

    taskDialogueActive = true;
    taskDialogueCallback = callback;

    // 문자열 또는 배열 모두 지원
    taskDialogueList = Array.isArray(text) ? text : [text];

    taskDialogueIndex = 0;

    dialogueBox.classList.add("visible");

    startTyping(taskDialogueList[taskDialogueIndex]);
}


// 업무 대사 다음 문장
function finishTaskDialogue() {

    taskDialogueIndex++;

    // 다음 대사가 남아 있다면 출력
    if (taskDialogueIndex < taskDialogueList.length) {

        startTyping(taskDialogueList[taskDialogueIndex]);

        return;
    }

    // 모든 대사 종료
    dialogueBox.classList.remove("visible");

    characterNormal.style.opacity = "1";
    characterTalk.style.opacity = "0";

    taskDialogueActive = false;

    taskDialogueList = [];
    taskDialogueIndex = 0;

    const callback = taskDialogueCallback;
    taskDialogueCallback = null;

    dialogueEndTimer = setTimeout(() => {

        dialogueEndTimer = null;

        if (callback) {
            callback();
        }

    }, 350);
}


// =========================
// 다음 오프닝 대사
// =========================

function nextDialogue() {

    // 타이핑 중이면 전체 문장 표시
    if (typing) {

        clearInterval(typingTimer);
        typingTimer = null;

        dialogueText.textContent = displayedText;

        typing = false;

        characterNormal.style.opacity = "1";
        characterTalk.style.opacity = "0";

        return;
    }

    // 세 번째 대사 다음 시스템 메시지
    if (currentDialogue === 2) {

        dialogueBox.classList.remove("visible");

        currentDialogue++;

        dialogueEndTimer = setTimeout(() => {

            dialogueEndTimer = null;

            screenFlash();
            showSystemMessage("추가 업무가 배정되었습니다.");

        }, 400);

        return;
    }

    currentDialogue++;

    if (currentDialogue < dialogues.length) {

        showDialogue();

    } else {

        dialogueBox.classList.remove("visible");

        dialogueEndTimer = setTimeout(() => {

            dialogueEndTimer = null;

            screenFlash();
            showTaskMenu();

        }, 400);
    }
}


// =========================
// 대사 초기화
// =========================

function resetDialogueState() {

    if (typingTimer !== null) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    if (dialogueEndTimer !== null) {
        clearTimeout(dialogueEndTimer);
        dialogueEndTimer = null;
    }

    currentDialogue = 0;
    typing = false;
    displayedText = "";

    taskDialogueActive = false;
    taskDialogueCallback = null;
    taskDialogueList = [];
    taskDialogueIndex = 0;

    dialogueBox.classList.remove("visible");
    dialogueText.textContent = "";

    characterNormal.style.opacity = "1";
    characterTalk.style.opacity = "0";
}


// =========================
// 스페이스바 입력
// =========================

document.addEventListener("keydown", event => {

    if (event.code !== "Space") return;
    if (!gameScreen.classList.contains("visible")) return;

    event.preventDefault();

    if (event.repeat) return;

    // 시스템 메시지가 표시 중이면 system.js에서 처리
    if (systemMessageActive) return;

    // 업무 대사 진행 중
    if (taskDialogueActive) {

        // 타이핑 중이면 문장 전체 표시
        if (typing) {

            clearInterval(typingTimer);
            typingTimer = null;

            dialogueText.textContent = displayedText;

            typing = false;

            characterNormal.style.opacity = "1";
            characterTalk.style.opacity = "0";

        } else {

            // 다음 업무 대사로 이동
            finishTaskDialogue();

        }

        return;
    }

    // 오프닝 대사 진행
    if (currentDialogue === 0 && !dialogueBox.classList.contains("visible")) {

        showDialogue();

    } else {

        nextDialogue();

    }

});
