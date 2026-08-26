// exam.js

const EXAM_TIME_SECONDS = 5;
const EXAM_ANSWER_SHOW_MS = 2000;

let examState = {
    queue: [],
    errors: [],
    current: null,
    correct: 0,
    wrong: 0,
    fixed: 0
};

function startExam() {
    examState.queue = buildQuestionPool(["multiply", "divide"]);
    examState.errors = [];
    examState.correct = 0;
    examState.wrong = 0;
    examState.fixed = 0;
    showNextExamQuestion();
}

function showNextExamQuestion() {
    if (examState.queue.length) {
        examState.current = examState.queue.shift();
    } else if (examState.errors.length) {
        examState.current = examState.errors.shift();
        examState.current.isRepeat = true;
    } else {
        finishExam();
        return;
    }

    renderExamQuestion(examState.current);
    startAnswerTimer(EXAM_TIME_SECONDS, examTimeout);
}

function submitExamAnswer(value) {
    stopAnswerTimer();
    const ok = Number(value) === examState.current.answer;

    if (ok) {
        examState.correct++;
        if (examState.current.isRepeat) examState.fixed++;
        showNextExamQuestion();
    } else {
        examState.wrong++;
        examState.errors.push(examState.current);
        showExamResult(false, examState.current.answer);
        setTimeout(showNextExamQuestion, EXAM_ANSWER_SHOW_MS);
    }
}

function examTimeout() {
    examState.wrong++;
    examState.errors.push(examState.current);
    showExamResult(false, examState.current.answer);
    setTimeout(showNextExamQuestion, EXAM_ANSWER_SHOW_MS);
}
