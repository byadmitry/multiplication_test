// app.js

let currentMode = "training";

function setMode(mode) {
    currentMode = mode;
}

function startSelectedMode() {
    if (currentMode === "exam") {
        startExam();
    } else {
        startTraining();
    }
}

function renderQuestion(expr, seconds = null) {
    document.getElementById("screen-settings").classList.remove("active");
    document.getElementById("screen-results").classList.remove("active");
    document.getElementById("screen-test").classList.add("active");
    document.getElementById("screen-test").innerHTML = `
        <div class="question-card">
            <div class="question-expression">${expr}</div>
            <input id="answer-input" class="q-answer-input" type="number" autofocus>
            <button class="btn btn-primary" onclick="submitCurrent()">Проверить</button>
            <div id="feedback" class="answer-feedback"></div>
            ${seconds !== null ? `<div>Время: <span id="timer">${seconds}</span></div>` : ""}
        </div>`;
}

function submitCurrent() {
    const input = document.getElementById("answer-input");
    if (!input) return;

    if (currentMode === "exam") {
        submitExamAnswer(input.value);
    } else {
        submitTrainingAnswer(input.value);
    }
}

function updateTimerDisplay(seconds) {
    const timer = document.getElementById("timer");
    if (timer) timer.textContent = seconds;
}

function showResult(text) {
    document.getElementById("screen-test").classList.remove("active");
    document.getElementById("screen-results").classList.add("active");
    document.getElementById("screen-results").innerHTML = `<div class="results-card"><h2>${text}</h2><button class="btn btn-secondary" onclick="location.reload()">Заново</button></div>`;
}
