// app.js

let currentMode = "training";

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('#mode-selector button').forEach((button) => {
        button.classList.toggle('active', button.getAttribute('onclick') === `setMode('${mode}')`);
    });
}

function getSelectedTypes() {
    return [...document.querySelectorAll('.toggle-btn.active')]
        .map((button) => button.dataset.type);
}

function renderQuestion(question, progressText = '', progressPercent = 0) {
    document.getElementById('screen-settings').classList.remove('active');
    document.getElementById('screen-results').classList.remove('active');
    document.getElementById('screen-test').classList.add('active');

    document.getElementById('screen-test').innerHTML = `
        <div class="progress-area">
            <div class="progress-info">
                <span id="progress-text">${progressText}</span>
                <span id="progress-pct">${progressPercent}%</span>
            </div>
            <div class="progress-bar-bg">
                <div id="progress-fill" class="progress-bar-fill" style="width:${progressPercent}%"></div>
            </div>
        </div>
        <div class="question-card">
            <div id="question-number" class="question-number">${progressText}</div>
            <div id="question-expression" class="question-expression">${question.expression}</div>
            <div class="answer-row">
                <span class="answer-equals">=</span>
                <input type="number" id="question-answer" class="q-answer-input" step="any" autocomplete="off" inputmode="numeric" aria-label="Ответ">
            </div>
            <div id="answer-feedback" class="answer-feedback" aria-live="polite"></div>
        </div>
        <div class="q-buttons">
            <button type="button" id="btn-submit" class="btn btn-primary" onclick="submitCurrentAnswer()">✓ Проверить</button>
            <button type="button" class="btn btn-danger" onclick="finishEarly()">⏹ Завершить</button>
        </div>
        <p class="typing-hint">Введите ответ и нажмите Enter</p>
    `;

    const input = document.getElementById('question-answer');
    input.focus();
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') submitCurrentAnswer();
    });
}

function submitCurrentAnswer() {
    const input = document.getElementById('question-answer');
    if (!input) return;

    if (currentMode === 'exam') {
        submitExamAnswer(input.value);
    } else {
        submitTrainingAnswer(input.value);
    }
}

function showResult(text) {
    document.getElementById('screen-test').classList.remove('active');
    document.getElementById('screen-results').classList.add('active');
    document.getElementById('screen-results').innerHTML = `
        <div class="results-card">
            <div class="result-title">${text}</div>
            <button type="button" class="btn btn-secondary" onclick="location.reload()">🔄 Начать заново</button>
        </div>
    `;
}

function updateTimerDisplay(seconds) {
    const timer = document.getElementById('timer');
    if (timer) timer.textContent = seconds;
}

function finishEarly() {
    if (currentMode === 'exam' && typeof finishExamEarly === 'function') {
        finishExamEarly();
        return;
    }
    if (typeof finishTrainingEarly === 'function') {
        finishTrainingEarly();
    }
}

function toggleType(button) {
    button.classList.toggle('active');
}

function startSelectedMode() {
    if (currentMode === 'exam') {
        startExam();
    } else {
        startTraining();
    }
}
