const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

let time = WORK_TIME;
let timerRunning = false;
let isWorkPhase = true;
let phase = 0;
let intervalId = null;

function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        intervalId = setInterval(goTime, 1000);
        broadcastUpdate();
    }
}

function pauseTimer() {
    if (timerRunning) {
        clearInterval(intervalId);
        timerRunning = false;
        broadcastUpdate();
    }
}

function resetTimer() {
    clearInterval(intervalId);
    timerRunning = false;
    if (phase === 0 && !isWorkPhase) {
        time = LONG_BREAK_TIME;
    } else {
        time = isWorkPhase ? WORK_TIME : BREAK_TIME;
    }
    broadcastUpdate();
}

function goTime() {
    if (time > 0) {
        time--;
        broadcastUpdate();
    } else {
        switchPhase();
    }
}

function switchPhase() {
    phase++;
    if (phase < 8) {
        isWorkPhase = !isWorkPhase;
        time = isWorkPhase ? WORK_TIME : BREAK_TIME;
    } else {
        time = LONG_BREAK_TIME;
        phase = 0;
    }
    pauseTimer();
    // Можно использовать chrome.runtime.sendMessage для уведомления popup
    chrome.runtime.sendMessage({ type: "PHASE_SWITCH" });
}

function broadcastUpdate() {
    chrome.runtime.sendMessage({
        type: "TIMER_UPDATE",
        time,
        timerRunning,
        isWorkPhase,
        phase
    });
}

// Слушаем команды от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START") {
        startTimer();
    } else if (message.type === "PAUSE") {
        pauseTimer();
    } else if (message.type === "RESET") {
        resetTimer();
    } else if (message.type === "GET_STATE") {
        sendResponse({ time, timerRunning, isWorkPhase, phase });
    }
});