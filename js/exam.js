// exam.js

const EXAM_TIME_SECONDS = 5;
const EXAM_ANSWER_SHOW_MS = 2000;

let examState = {
    queue: [],
    errors: [],
    current: null
};

function startExam() {
    examState.queue = buildQuestionPool(["multiply", "divide"]);
    examState.errors = [];
    showNextExamQuestion();
}

function showNextExamQuestion() {
    if (examState.queue.length) {
        examState.current = examState.queue.shift();
    } else if (examState.errors.length) {
        examState.current = examState.errors.shift();
    } else {
        showResult("Экзамен завершён");
        return;
    }

    renderQuestion(examState.current.expression, EXAM_TIME_SECONDS);
    startAnswerTimer(EXAM_TIME_SECONDS, examTimeout);
}

function submitExamAnswer(value) {
    stopAnswerTimer();
    if (Number(value) === examState.current.answer) {
        showNextExamQuestion();
    } else {
        examState.errors.push(examState.current);
        document.getElementById("feedback").textContent = "Ответ: " + examState.current.answer;
        setTimeout(showNextExamQuestion, EXAM_ANSWER_SHOW_MS);
    }
}

function examTimeout() {
    examState.errors.push(examState.current);
    document.getElementById("feedback").textContent = "Ответ: " + examState.current.answer;
    setTimeout(showNextExamQuestion, EXAM_ANSWER_SHOW_MS);
}
