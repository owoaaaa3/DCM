
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

let started = false;
let selectedIndex = 0;
let gameStarted = false;


// =========================
// 화면 섬광 효과
// =========================

function screenFlash() {

    flash.classList.remove("active");

    // 애니메이션 재실행
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

    // 시작 안내 문구 제거
    startGuide.classList.add("hidden");

    // 흰색 섬광
    screenFlash();

    // SYSTEM STANDBY 퇴장
    setTimeout(() => {
        standbyScreen.classList.add("fade-out");
    }, 500);

    // 초기 로딩 화면 등장
    setTimeout(() => {
        loadingScreen.classList.add("visible");
    }, 2000);

    // 로딩 시작
    setTimeout(() => {
        startLoading();
    }, 2600);

});


// =========================
// 초기 로딩 시스템
// =========================

function startLoading() {

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

        // 로딩 중 잠시 정지
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

        // 랜덤 정지 지점
        if (
            stopIndex < stopPoints.length &&
            progress >= stopPoints[stopIndex]
        ) {

            progress = stopPoints[stopIndex];

            isPaused = true;
            stopIndex++;

        }

        // 진행률 표시
        progressBar.style.width = `${progress}%`;
        loadingPercent.textContent = `${Math.floor(progress)}%`;

        // 로딩 완료
        if (progress >= 100) {

            clearInterval(loadingTimer);

            loadingStatus.textContent = "시스템 초기화 완료";

            // 완료 문구 잠시 표시
            setTimeout(() => {

                loadingScreen.classList.add("finished");

                // 메인 메뉴 등장
                setTimeout(() => {

                    mainMenu.classList.add("visible");

                    selectMenu(0);
                    menuButtons[0].focus();

                }, 1000);

            }, 1000);

        }

    }, interval);

}


// =========================
// 게임 시작 및 전환 로딩
// =========================

function startGame() {

    // 중복 실행 방지
    if (gameStarted) return;

    gameStarted = true;

    // 게임 화면 준비
    gameScreen.classList.add("visible");

    // 섬광 발생
    screenFlash();

    // 섬광이 잠시 유지된 후 전환 시작
    setTimeout(() => {

        game.classList.add("is-transitioning");

    }, 500);


    // 로딩 후 프레임 복귀
    setTimeout(() => {

        // 메뉴 완전히 제거
        mainMenu.style.display = "none";

        // 프레임 원상 복귀
        game.classList.remove("is-transitioning");
        game.classList.add("is-loaded");

        // 로딩 화면 퇴장
        setTimeout(() => {

            transitionLoading.style.display = "none";

            // 검은 화면 1초 유지
            setTimeout(() => {

                // 캐릭터 프레임 등장
                characterFrame.classList.add("visible");

                // 프레임 등장 후 화면 점등
                setTimeout(() => {

                    characterScreen.classList.add("active");

                    // 캐릭터 등장 애니메이션 이후 시스템 메시지
                    setTimeout(() => {

                        showSystemMessage("추가 업무가 배정되었습니다.");

                    }, 700);

                }, 600);

            }, 1000);

        }, 600);

    }, 2300);

}


// =========================
// 메뉴 선택 시스템
// =========================

let inputMode = "mouse";
let lastMoveTime = 0;

const moveInterval = 250;


// 메뉴 선택 함수
function selectMenu(index) {

    selectedIndex = index;

    menuButtons.forEach((button) => {
        button.classList.remove("selected");
    });

    menuButtons[selectedIndex].classList.add("selected");

}


// 마우스 모드로 전환
function enableMouseMode() {

    inputMode = "mouse";

    document.body.classList.add("mouse-mode");

    // 마우스가 이미 버튼 위에 있는지 확인
    const hoveredButton = Array.from(menuButtons).find(
        button => button.matches(":hover")
    );

    if (hoveredButton) {

        const index = Array.from(menuButtons).indexOf(hoveredButton);

        selectMenu(index);

    }

}


// 마우스 선택
menuButtons.forEach((button, index) => {

    button.addEventListener("mouseenter", () => {
        if (inputMode !== "mouse") return;
        selectMenu(index);
    });

    button.addEventListener("click", () => {

        enableMouseMode();
        selectMenu(index);

        // START
        if (index === 0) {
            startGame();
        }

        // OUT
        if (index === 3) {
            returnToTitle();
        }

    });

});


// =========================
// 키보드 선택 및 실행
// =========================

document.addEventListener("keydown", (event) => {

    if (!mainMenu.classList.contains("visible")) return;

    // ENTER로 현재 메뉴 실행
    if (event.key === "Enter") {

        event.preventDefault();

        menuButtons[selectedIndex].click();

        return;

    }

    if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp"
    ) return;

    event.preventDefault();

    // 키보드 우선 모드
    inputMode = "keyboard";

    document.body.classList.remove("mouse-mode");

    const now = Date.now();

    // 일정 시간 간격으로 이동
    if (now - lastMoveTime < moveInterval) return;

    lastMoveTime = now;

    if (event.key === "ArrowDown") {

        const nextIndex =
            (selectedIndex + 1) % menuButtons.length;

        selectMenu(nextIndex);

    } else if (event.key === "ArrowUp") {

        const nextIndex =
            (selectedIndex - 1 + menuButtons.length) %
            menuButtons.length;

        selectMenu(nextIndex);

    }

});


// =========================
// 방향키에서 손을 떼면 마우스 모드로 복귀
// =========================

document.addEventListener("keyup", (event) => {

    if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
    ) {

        enableMouseMode();

    }

});


// =========================
// RETURN TO TITLE
// =========================

function returnToTitle() {

    // 상태 초기화
    started = false;
    gameStarted = false;

    // 메인 메뉴 숨기기
    mainMenu.classList.remove("visible");
    mainMenu.style.display = "";

    // 로딩 화면 초기화
    loadingScreen.classList.remove("visible", "finished");
    progressBar.style.width = "0%";
    loadingPercent.textContent = "0%";
    loadingStatus.textContent = "";

    // 게임 화면 초기화
    gameScreen.classList.remove("visible");
    game.classList.remove("is-transitioning", "is-loaded");

    // 타이틀 화면 복귀
    standbyScreen.classList.remove("fade-out");
    startGuide.classList.remove("hidden");
    standbyScreen.classList.add("visible");

}