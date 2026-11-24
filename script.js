
const flashSound = document.getElementById("flashSound");

const backgroundMusic = document.getElementById("backgroundMusic");

const standbyScreen = document.getElementById("standbyScreen");
const startGuide = document.getElementById("startGuide");
const flash = document.getElementById("flash");

const loadingScreen = document.getElementById("loadingScreen");
const loadingStatus = document.getElementById("loadingStatus");
const progressBar = document.getElementById("progressBar");
const loadingPercent = document.getElementById("loadingPercent");

const mainMenu = document.getElementById("mainMenu");
const menuButtons = document.querySelectorAll(".menu-button");

const game = document.getElementById("game");
const gameScreen = document.getElementById("gameScreen");
const transitionLoading = document.getElementById("transitionLoading");

const characterFrame = document.getElementById("characterFrame");
const characterScreen = document.getElementById("characterScreen");

// OPERATION GUIDELINES
const guideScreen = document.getElementById("guideScreen");
const guideStartButton = document.getElementById("guideStartButton");

// CREDITS
const creditsScreen = document.getElementById("creditsScreen");
const creditsReturnButton = document.getElementById("creditsReturnButton");

let started = false;
let selectedIndex = 0;
let gameStarted = false;

let inputMode = "mouse";
let lastMoveTime = 0;
const moveInterval = 250;

let exitInProgress = false;


// =========================
// 화면 섬광 효과
// =========================

function screenFlash() {
    // 기존 효과음 재생 위치 초기화
    flashSound.volume = 0.2;
    flashSound.currentTime = 0;
    flashSound.play().catch(error => {
        console.log("섬광 효과음 재생 실패:", error);
    });

    // 기존 섬광 효과
    flash.classList.remove("active");
    void flash.offsetWidth;
    flash.classList.add("active");
}


// =========================
// 처음 화면 등장
// =========================

window.addEventListener("load", () => {
    setTimeout(() => {
        standbyScreen.classList.add("visible");
    }, 1000);
});


// =========================
// 아무 키나 눌러 시작
// =========================

document.addEventListener("keydown", (event) => {
    if (started) return;
    if (!standbyScreen.classList.contains("visible")) return;

    started = true;

    startGuide.classList.add("hidden");

    screenFlash();

    setTimeout(() => {
        standbyScreen.classList.add("fade-out");
    }, 500);

    setTimeout(() => {
        loadingStatus.textContent = "시스템 초기화 중...";
        loadingStatus.style.opacity = "1";

        progressBar.style.width = "0%";
        loadingPercent.textContent = "0%";

        loadingScreen.classList.add("visible");
    }, 2000);

    setTimeout(() => {
        startLoading();
    }, 2600);
});


// =========================
// 초기 로딩 시스템
// =========================

function startLoading() {
    loadingStatus.textContent = "시스템 초기화 중...";
    loadingStatus.style.opacity = "1";

    const duration = 3000;
    const interval = 30;

    let elapsed = 0;
    let isPaused = false;
    let pauseTime = 0;
    let stopIndex = 0;

    const stopPoints = [
        Math.random() * 25 + 20,
        Math.random() * 25 + 55
    ].sort((a, b) => a - b);

    const loadingTimer = setInterval(() => {
        if (isPaused) {
            pauseTime += interval;

            if (pauseTime >= 300) {
                isPaused = false;
                pauseTime = 0;
            }

            return;
        }

        elapsed += interval;

        let progress = Math.min(
            (elapsed / duration) * 100,
            100
        );

        if (
            stopIndex < stopPoints.length &&
            progress >= stopPoints[stopIndex]
        ) {
            progress = stopPoints[stopIndex];
            isPaused = true;
            stopIndex++;
        }

        progressBar.style.width = `${progress}%`;
        loadingPercent.textContent = `${Math.floor(progress)}%`;

        if (progress >= 100) {
            clearInterval(loadingTimer);

            // 초기화 완료
            loadingStatus.textContent = "시스템 초기화 완료";

            // 완료 순간에만 섬광
            screenFlash();

            setTimeout(() => {
                loadingScreen.classList.add("finished");

                setTimeout(() => {

                    // 기존 육각형 로딩 화면 준비
                    transitionLoading.style.display = "";

                    game.classList.remove("is-loaded");
                    game.classList.add("is-transitioning");

                    setTimeout(() => {

                        game.classList.remove("is-transitioning");
                        game.classList.add("is-loaded");

                        setTimeout(() => {

                            transitionLoading.style.display = "none";

                            game.classList.remove("is-loaded");

                            // 메인 메뉴 등장
                            mainMenu.classList.add("visible");
                            selectMenu(0);
                            menuButtons[0].focus();

                            // BGM 재생
                            backgroundMusic.volume = 0.4;
                            backgroundMusic.play().catch(error => {
                                console.log("BGM 재생 실패:", error);
                            });

                        }, 600);

                    }, 2200);

                }, 900);

            }, 1000);
        }
    }, interval);
}


// =========================
// 메인 메뉴 → 메뉴얼
// =========================

function startGame() {
    if (gameStarted || exitInProgress) return;

    gameStarted = true;

    // 이전 화면 상태 초기화
    transitionLoading.style.display = "";

    characterFrame.classList.remove("visible");
    characterScreen.classList.remove("active");

    guideScreen.classList.remove("visible");

    gameScreen.classList.add("visible");

    screenFlash();

    // 첫 번째 육각형 로딩 시작
    setTimeout(() => {
        game.classList.add("is-transitioning");
    }, 500);

    setTimeout(() => {

        // 메인 메뉴 퇴장
        mainMenu.classList.remove("visible");
        mainMenu.style.display = "none";

        game.classList.remove("is-transitioning");
        game.classList.add("is-loaded");

        setTimeout(() => {

            // 로딩 화면 숨김
            transitionLoading.style.display = "none";

            game.classList.remove("is-loaded");

            // 메뉴얼 등장
            guideScreen.classList.add("visible");

        }, 600);

    }, 2300);
}


// =========================
// 메뉴얼 → 실제 게임 시작
// =========================

function startActualGame() {
    if (!gameStarted || exitInProgress) return;

    // 메뉴얼 퇴장
    guideScreen.classList.remove("visible");

    // 기존 육각형 로딩 화면 준비
    transitionLoading.style.display = "";

    game.classList.remove("is-loaded");

    screenFlash();

    // 두 번째 육각형 로딩 시작
    setTimeout(() => {
        game.classList.add("is-transitioning");
    }, 500);

    setTimeout(() => {

        game.classList.remove("is-transitioning");
        game.classList.add("is-loaded");

        setTimeout(() => {

            // 로딩 화면 숨김
            transitionLoading.style.display = "none";

            game.classList.remove("is-loaded");

            // 기존 게임 화면 진입
            setTimeout(() => {

                characterFrame.classList.add("visible");

                setTimeout(() => {
                    characterScreen.classList.add("active");

                    setTimeout(() => {
                        // 게임 시작 시에는 시스템 메시지를
                        // 자동으로 표시하지 않음
                    }, 700);

                }, 600);

            }, 300);

        }, 600);

    }, 2300);
}


// =========================
// 메뉴얼 START 버튼
// =========================

guideStartButton.addEventListener("click", () => {
    startActualGame();
});


// =========================
// 메뉴 선택 시스템
// =========================

function selectMenu(index) {
    selectedIndex = index;

    menuButtons.forEach((button) => {
        button.classList.remove("selected");
    });

    menuButtons[selectedIndex].classList.add("selected");
}


function enableMouseMode() {
    inputMode = "mouse";
    document.body.classList.add("mouse-mode");

    const hoveredButton = Array.from(menuButtons).find(
        button => button.matches(":hover")
    );

    if (hoveredButton) {
        const index = Array.from(menuButtons).indexOf(hoveredButton);
        selectMenu(index);
    }
}


menuButtons.forEach((button, index) => {

    button.addEventListener("mouseenter", () => {
        if (inputMode !== "mouse") return;
        selectMenu(index);
    });

    button.addEventListener("click", () => {
        enableMouseMode();
        selectMenu(index);

        if (index === 0) {
            startGame();
        }

        if (index === 2) {
            openCredits();
        }

        if (index === 3) {
            exitToTitle();
        }
    });

});


document.addEventListener("keydown", (event) => {
    if (!mainMenu.classList.contains("visible")) return;

    if (event.key === "Enter") {
        event.preventDefault();
        menuButtons[selectedIndex].click();
        return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();

    inputMode = "keyboard";
    document.body.classList.remove("mouse-mode");

    const now = Date.now();

    if (now - lastMoveTime < moveInterval) return;

    lastMoveTime = now;

    if (event.key === "ArrowDown") {
        selectMenu((selectedIndex + 1) % menuButtons.length);
    } else {
        selectMenu(
            (selectedIndex - 1 + menuButtons.length) % menuButtons.length
        );
    }
});


document.addEventListener("keyup", (event) => {
    if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
    ) {
        enableMouseMode();
    }
});


// =========================
// OUT → 처음 대기 화면
// =========================

function exitToTitle() {
    if (exitInProgress) return;

    exitInProgress = true;

    // BGM 정지
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    screenFlash();

    // 전환 로딩 화면 초기화
    transitionLoading.style.display = "";

    setTimeout(() => {
        game.classList.add("is-transitioning");
    }, 500);

    setTimeout(() => {

        mainMenu.classList.remove("visible");
        mainMenu.style.display = "";

        gameScreen.classList.remove("visible");

        game.classList.remove("is-transitioning", "is-loaded");

        characterFrame.classList.remove("visible");
        characterScreen.classList.remove("active");

        // 메뉴얼 초기화
        guideScreen.classList.remove("visible");

        // 초기 로딩 화면 초기화
        loadingScreen.classList.remove("visible", "finished");

        progressBar.style.width = "0%";
        loadingPercent.textContent = "0%";
        loadingStatus.textContent = "";

        // 게임 상태 초기화
        if (typeof resetTaskState === "function") {
            resetTaskState();
        }

        if (typeof resetDialogueState === "function") {
            resetDialogueState();
        }

        if (typeof resetSystemMessage === "function") {
            resetSystemMessage();
        }

        started = false;
        gameStarted = false;

        standbyScreen.classList.remove("fade-out");
        startGuide.classList.remove("hidden");
        standbyScreen.classList.add("visible");

        exitInProgress = false;

    }, 2300);
}


// =========================
// RETURN TO TITLE
// =========================

function returnToTitle() {
    exitToTitle();
}


// =========================
// ENDING → MAIN MENU
// =========================

function returnToMainMenuAfterEnding() {

    // 캐릭터 화면 먼저 퇴장
    characterScreen.classList.remove("active");
    characterFrame.classList.remove("visible");

    // 캐릭터가 사라진 뒤 섬광
    setTimeout(() => {
        screenFlash();
    }, 500);

    // 기존 로딩 화면 준비
    transitionLoading.style.display = "";

    game.classList.remove("is-loaded");

    setTimeout(() => {
        game.classList.add("is-transitioning");
    }, 1000);

    setTimeout(() => {

        // 로딩 화면 퇴장
        game.classList.remove("is-transitioning");
        game.classList.add("is-loaded");

        setTimeout(() => {

            // 로딩 화면 숨김
            transitionLoading.style.display = "none";

            game.classList.remove("is-loaded");

            // 캐릭터 화면 종료
            characterScreen.classList.remove("active");
            characterFrame.classList.remove("visible");

            // 게임 화면 종료
            gameScreen.classList.remove("visible");

            // 메뉴얼 초기화
            guideScreen.classList.remove("visible");

            // 메인 메뉴 복귀
            mainMenu.style.display = "";
            mainMenu.classList.add("visible");

            selectMenu(0);
            menuButtons[0].focus();

            // 게임 상태 초기화
            if (typeof resetTaskState === "function") {
                resetTaskState();
            }

            if (typeof resetDialogueState === "function") {
                resetDialogueState();
            }

            if (typeof resetSystemMessage === "function") {
                resetSystemMessage();
            }

            gameStarted = false;

        }, 600);

    }, 2300);
}


// =========================
// MAIN MENU → CREDITS
// =========================

function openCredits() {
    if (gameStarted || exitInProgress) return;

    // 기존 육각형 로딩 화면 준비
    transitionLoading.style.display = "";

    game.classList.remove("is-loaded");

    screenFlash();

    // 로딩 시작
    setTimeout(() => {
        game.classList.add("is-transitioning");
    }, 500);

    setTimeout(() => {

        // 메인 메뉴 퇴장
        mainMenu.classList.remove("visible");
        mainMenu.style.display = "none";

        game.classList.remove("is-transitioning");
        game.classList.add("is-loaded");

        setTimeout(() => {

            // 로딩 화면 숨김
            transitionLoading.style.display = "none";

            game.classList.remove("is-loaded");

            // 크레딧 화면 등장
            creditsScreen.classList.add("visible");

            // 스크롤 위치 초기화
            document.querySelector(".credits-container").scrollTop = 0;

        }, 600);

    }, 2300);
}


// =========================
// CREDITS → MAIN MENU
// =========================

creditsReturnButton.addEventListener("click", () => {

    // 크레딧 화면 퇴장
    creditsScreen.classList.remove("visible");

    screenFlash();

    // 기존 로딩 화면 준비
    transitionLoading.style.display = "";

    game.classList.remove("is-loaded");

    // 로딩 시작
    setTimeout(() => {
        game.classList.add("is-transitioning");
    }, 500);

    setTimeout(() => {

        game.classList.remove("is-transitioning");
        game.classList.add("is-loaded");

        setTimeout(() => {

            // 로딩 화면 숨김
            transitionLoading.style.display = "none";

            game.classList.remove("is-loaded");

            // 메인 메뉴 복귀
            mainMenu.style.display = "";
            mainMenu.classList.add("visible");

            selectMenu(0);
            menuButtons[0].focus();

        }, 600);

    }, 2300);

});
