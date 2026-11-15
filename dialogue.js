// =========================
// 대사 데이터
// =========================

const dialogues = [
    "하아… 드디어 오늘 업무도 끝나가네.",
    "이제 슬슬 정리하고 퇴근하면 되겠지?",
    "… 응? 잠깐, 뭐가 왔는데.",
    "추가 업무? 지금?",
    "아… 데이터 센터 환경 효율성 분석 보고서라.",
    "그러고 보니 최근 AI 연산량이 급격히 늘면서 전력 소비 문제도 커지고 있다고 했었지.",
    "이번 보고서에서는 에너지 효율 개선, 연산 과정 최적화, 관련 정책 분석까지 다뤄야 하는 모양이네.",
    "… 퇴근은 조금 미뤄야겠군.",
    "일단 하나씩 살펴보자."
];


// =========================
// 대사 시스템
// =========================

const dialogueBox = document.getElementById("dialogueBox");
const dialogueText = document.getElementById("dialogueText");

const characterNormal = document.getElementById("characterNormal");
const characterTalk = document.getElementById("characterTalk");

let currentDialogue = 0;
let typing = false;
let typingTimer = null;
let displayedText = "";


// 대사 출력
function showDialogue() {

    if (currentDialogue >= dialogues.length) return;

    displayedText = dialogues[currentDialogue];

    dialogueBox.classList.add("visible");

    dialogueText.textContent = "";

    typing = true;

    let index = 0;

    // 말하는 표정
    characterNormal.style.opacity = "0";
    characterTalk.style.opacity = "1";

    typingTimer = setInterval(() => {

        dialogueText.textContent += displayedText[index];

        index++;

        if (index >= displayedText.length) {

            clearInterval(typingTimer);

            typing = false;

            // 기본 표정
            characterNormal.style.opacity = "1";
            characterTalk.style.opacity = "0";

        }

    }, 50);

}


// 다음 대사
function nextDialogue() {

    // 출력 중이면 즉시 전체 출력
    if (typing) {

        clearInterval(typingTimer);

        dialogueText.textContent = displayedText;

        typing = false;

        characterNormal.style.opacity = "1";
        characterTalk.style.opacity = "0";

        return;

    }

    // 다음 대사로 이동
    currentDialogue++;

    if (currentDialogue < dialogues.length) {

        showDialogue();

    } else {

        dialogueBox.classList.remove("visible");

        // 대사 종료 후 업무 메뉴 등장
        setTimeout(() => {

            showTaskMenu();

        }, 400);

    }

}


// 스페이스바 입력
document.addEventListener("keydown", (event) => {

    if (event.code !== "Space") return;

    if (!gameScreen.classList.contains("visible")) return;

    event.preventDefault();

    if (event.repeat) return;

    // 첫 대사 시작
    if (currentDialogue === 0 && !dialogueBox.classList.contains("visible")) {

        showDialogue();

    } else {

        nextDialogue();

    }

});