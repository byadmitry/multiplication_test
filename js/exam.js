// exam.js

const EXAM_TIME_SECONDS = 5;
const EXAM_ANSWER_SHOW_MS = 2000;

let examState = {
    queue: [],
    errors: [],
    current: null,
    correct: 0,
    wrong: 0,
    total: 0,
    locked: false,
    finished: false
};

function startExam() {
    currentMode = "exam";
    const types = typeof getSelectedTypes === 'function' ? getSelectedTypes() : ['multiply', 'divide'];
    examState.queue = buildQuestionPool(types).slice(0, Number(document.getElementById('q-count')?.value || 20));
    examState.total = examState.queue.length;
    examState.errors = [];
    examState.current = null;
    examState.correct = 0;
    examState.wrong = 0;
    examState.locked = false;
    examState.finished = false;
    showScreen('screen-test');
    showNextExamQuestion();
}

function showNextExamQuestion() {
    if (examState.finished) return;
    examState.locked = false;
    if (examState.queue.length) {
        examState.current = examState.queue.shift();
    } else if (examState.errors.length) {
        examState.current = examState.errors.shift();
    } else {
        finishExamEarly();
        return;
    }

    renderQuestion(examState.current);
    startAnswerTimer(EXAM_TIME_SECONDS, examTimeout);
}

function submitExamAnswer(value) {
    if (!examState.current || examState.locked || examState.finished) return;
    examState.locked = true;
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

    setTimeout(() => {
        if (!examState.finished) showNextExamQuestion();
    }, EXAM_ANSWER_SHOW_MS);
}

function examTimeout() {
    const input = document.getElementById('question-answer');
    submitExamAnswer(input ? input.value : '');
}

function finishExamEarly() {
    if (examState.finished) return;
    examState.finished = true;
    stopAnswerTimer();
    examState.current = null;
    showResult('Экзамен завершён. Решено: ' + examState.total + ' вопросов. Правильных: ' + examState.correct + ', ошибок: ' + examState.wrong);
}

function showExamFeedback(text, correct = null) {
    const el = document.getElementById('answer-feedback');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('feedback-correct', 'feedback-wrong');
    if (correct === true) el.classList.add('feedback-correct');
    if (correct === false) el.classList.add('feedback-wrong');
}
