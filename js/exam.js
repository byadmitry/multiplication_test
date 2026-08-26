// exam.js

const EXAM_TIME_SECONDS = 5;
const EXAM_ANSWER_SHOW_MS = 2000;

let examState = {
    queue: [],
    errors: [],
    current: null,
    correct: 0,
    wrong: 0,
    total: 0
};

function startExam() {
    currentMode = "exam";
    const types = typeof getSelectedTypes === 'function' ? getSelectedTypes() : ['multiply', 'divide'];
    examState.queue = buildQuestionPool(types.length ? types : ['multiply', 'divide']).slice(0, Number(document.getElementById('q-count')?.value || 20));
    examState.errors = [];
    examState.current = null;
    examState.correct = 0;
    examState.wrong = 0;
    examState.total = examState.queue.length;
    showScreen('screen-test');
    showNextExamQuestion();
}

function showNextExamQuestion() {
    if (examState.queue.length) {
        examState.current = examState.queue.shift();
    } else if (examState.errors.length) {
        examState.current = examState.errors.shift();
    } else {
        showResult('Экзамен завершён. Правильных: ' + examState.correct + ', ошибок: ' + examState.wrong);
        return;
    }

    renderQuestion(examState.current);
    startAnswerTimer(EXAM_TIME_SECONDS, examTimeout);
}

function submitExamAnswer(value) {
    if (!examState.current) return;
    stopAnswerTimer();

    const isCorrect = Number(value) === examState.current.answer;
    if (isCorrect) {
        examState.correct++;
        showExamFeedback('✓ Правильно', true);
    } else {
        examState.wrong++;
        examState.errors.push(examState.current);
        showExamFeedback('✕ Неверно. Ответ: ' + examState.current.answer, false);
    }

    setTimeout(showNextExamQuestion, EXAM_ANSWER_SHOW_MS);
}

function examTimeout() {
    if (!examState.current) return;

    // Проверяем уже введённое значение автоматически
    const input = document.getElementById('question-answer');
    submitExamAnswer(input ? input.value : '');
}

function finishExamEarly() {
    stopAnswerTimer();
    showResult('Экзамен завершён. Правильных: ' + examState.correct + ', ошибок: ' + examState.wrong);
}

function showExamFeedback(text, correct = null) {
    const el = document.getElementById('answer-feedback');
    if (!el) return;

    el.textContent = text;
    el.classList.remove('feedback-correct', 'feedback-wrong');

    if (correct === true) {
        el.classList.add('feedback-correct');
    } else if (correct === false) {
        el.classList.add('feedback-wrong');
    }
}
