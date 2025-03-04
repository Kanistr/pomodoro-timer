const timerString = document.querySelector("#timer-string");
const timerStart = document.querySelector("#timer-start");
const timerReset = document.querySelector("#timer-reset")
const notification = new Audio("notification.mp3");
notification.volume = 0.5;

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

let time = WORK_TIME; 
let timerRunning = false;
let isWorkPhase = true;
let intervalId;
let phase = 0;

timerStart.onclick = function() {
    timerRunning ? pauseTimer() : startTimer();
}

timerReset.onclick = function() {
    resetTimer();
}

function switchPhase () {
    ++phase;
    if(phase < 8){
        isWorkPhase = !isWorkPhase;
        time = isWorkPhase ? WORK_TIME : BREAK_TIME;
        timerString.textContent = formatTime(time);
        timerReset.classList.remove("timer-none");
        notification.play().catch(error => console.error("Ошибка воспроизведения звука:", error));
        pauseTimer();
    } else{
        time = LONG_BREAK_TIME;
        timerString.textContent = formatTime(time);
        notification.play().catch(error => console.error("Ошибка воспроизведения звука:", error));
        pauseTimer();
        phase = 0;
    }
}

function startTimer(){
    intervalId = setInterval(goTime, 1000);
    timerStart.textContent = "PAUSE";
    timerReset.classList.remove("timer-none");
    timerRunning = true;
}

function pauseTimer() {
    clearInterval(intervalId);
    timerStart.textContent = "START";
    timerRunning = false;
}

function resetTimer() {
    clearInterval(intervalId);
    timerRunning = false;
    timerStart.textContent = "START";
    if(phase === 0 && !isWorkPhase) {
        time = LONG_BREAK_TIME
    }else {
        time = isWorkPhase ? WORK_TIME : BREAK_TIME;
    }
    timerReset.classList.add("timer-none");
    timerString.textContent = formatTime(time);
}

function goTime() {
    if (time > 0) {
        time--; 
        timerString.textContent = formatTime(time);
    } else {
        switchPhase();
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

timerString.textContent = formatTime(time);