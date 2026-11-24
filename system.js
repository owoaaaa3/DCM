
const systemMessage = document.getElementById("systemMessage");
const systemMessageContent = document.getElementById("systemMessageContent");

let systemMessageActive = false;
let systemMessageTimer = null;


// 시스템 메시지 표시
function showSystemMessage(message) {
    if (systemMessageTimer !== null) {
        clearTimeout(systemMessageTimer);
        systemMessageTimer = null;
    }

    systemMessageContent.textContent = message;

    systemMessage.classList.remove("hidden");
    systemMessage.classList.add("visible");

    systemMessageActive = true;
}


// 시스템 메시지 종료
function hideSystemMessage() {
    systemMessage.classList.add("hidden");

    systemMessageTimer = setTimeout(() => {
        systemMessage.classList.remove("visible");
        systemMessageActive = false;
        systemMessageTimer = null;

        showDialogue();
    }, 300);
}


// 시스템 메시지 초기화
function resetSystemMessage() {
    if (systemMessageTimer !== null) {
        clearTimeout(systemMessageTimer);
        systemMessageTimer = null;
    }

    systemMessageActive = false;

    systemMessage.classList.remove("visible", "hidden");
    systemMessageContent.textContent = "";
}


// =========================
// SPACEBAR INPUT
// =========================

document.addEventListener("keydown", event => {
    if (!systemMessageActive) return;
    if (event.code !== "Space") return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (event.repeat) return;

    hideSystemMessage();
}, true);
