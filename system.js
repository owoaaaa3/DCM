// =========================
// SYSTEM MESSAGE
// =========================

const systemMessage = document.getElementById("systemMessage");
const systemMessageContent = document.getElementById("systemMessageContent");

let systemMessageActive = false;


// 시스템 메시지 표시
function showSystemMessage(message) {

    systemMessageContent.textContent = message;

    systemMessage.classList.remove("hidden");
    systemMessage.classList.add("visible");

    systemMessageActive = true;

}


// 시스템 메시지 종료
function hideSystemMessage() {

    systemMessage.classList.add("hidden");

    setTimeout(() => {

        systemMessage.classList.remove("visible");
        systemMessageActive = false;

        // 첫 번째 캐릭터 대사 시작
        showDialogue();

    }, 300);

}


// =========================
// SPACEBAR INPUT
// =========================

document.addEventListener("keydown", (event) => {

    if (!systemMessageActive) return;

    if (event.code !== "Space") return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (event.repeat) return;

    hideSystemMessage();

}, true);