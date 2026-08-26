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
    const types = typeof getSelectedTypes === 'function' ? getSelectedTypes() : ['multiply', 'divide'];
    examState.queue = buildQuestionPool(types).slice(0, Number(document.getElementById('q-count')?.value || 20));
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
    if (Number(value) === examState.current.answer) {
        examState.correct++;
        showNextExamQuestion();
    } else {
        examState.wrong++;
        examState.errors.push(examState.current);
        showExamFeedback('Ответ: ' + examState.current.answer);
        setTimeout(showNextExamQuestion, EXAM_ANSWER_SHOW_MS);
    }
}

function examTimeout() {
    if (!examState.current) return;
    examState.wrong++;
    examState.errors.push(examState.current);
    showExamFeedback('Ответ: ' + examState.current.answer);
    setTimeout(showNextExamQuestion, EXAM_ANSWER_SHOW_MS);
}

function finishExamEarly() {
    showResult('Экзамен завершён. Правильных: ' + examState.correct + ', ошибок: ' + examState.wrong);
}

function showExamFeedback(text) {
    const el = document.getElementById('answer-feedback');
    if (el) el.textContent = text;
}
