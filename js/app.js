// app.js

let currentMode = "training";

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('#mode-selector button').forEach((button) => {
        button.classList.toggle('active', button.dataset.mode === mode);
    });
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
}

function getSelectedTypes() {
    const types = [...document.querySelectorAll('.toggle-btn.active')]
        .map((button) => button.dataset.type);
    return types.length ? types : ['multiply', 'divide'];
}

function renderQuestion(question, progressText = '', progressPercent = 0) {
    showScreen('screen-test');

    document.getElementById('screen-test').innerHTML = `
        <div class="progress-area">
            <div class="progress-info">
                <span>${progressText}</span>
                <span>${progressPercent}%</span>
            </div>
        </div>
        <div class="question-card">
            <div class="question-expression">${question.expression}</div>
            <div class="answer-row">
                <span class="answer-equals">=</span>
                <input type="number" id="question-answer" class="q-answer-input" inputmode="numeric">
            </div>
            <div id="answer-feedback" class="answer-feedback"></div>
        </div>
        <div class="q-buttons">
            <button type="button" class="btn btn-primary" onclick="submitCurrentAnswer()">✓ Проверить</button>
            <button type="button" class="btn btn-danger" onclick="finishEarly()">⏹ Завершить</button>
        </div>`;

    const input = document.getElementById('question-answer');
    input.focus();
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') submitCurrentAnswer();
    });
}

function submitCurrentAnswer() {
    const input = document.getElementById('question-answer');
    if (!input) return;
    if (currentMode === 'exam') submitExamAnswer(input.value);
    else submitTrainingAnswer(input.value);
}

function showResult(text) {
    showScreen('screen-results');
    document.getElementById('screen-results').innerHTML = `
        <div class="results-card">
            <div class="result-title">${text}</div>
            <button type="button" class="btn btn-secondary" onclick="returnToMenu()">⬅ Вернуться в меню</button>
        </div>`;
}

function returnToMenu() {
    showScreen('screen-settings');
}

function updateTimerDisplay(seconds) {
    const timer = document.getElementById('timer');
    if (timer) timer.textContent = seconds;
}

function finishEarly() {
    if (currentMode === 'exam' && typeof finishExamEarly === 'function') {
        finishExamEarly();
    } else if (typeof finishTrainingEarly === 'function') {
        finishTrainingEarly();
    }
}

function toggleType(button) {
    button.classList.toggle('active');
}

function startSelectedMode() {
    if (currentMode === 'exam') startExam();
    else startTraining();
}
