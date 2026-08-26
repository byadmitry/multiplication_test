// exam.js

const EXAM_TIME_SECONDS = 5;
const EXAM_ANSWER_SHOW_MS = 2000;

let examAudioContext = null;

function getExamAudioContext() {
    if (!examAudioContext) {
        examAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (examAudioContext.state === 'suspended') {
        examAudioContext.resume();
    }
    return examAudioContext;
}

function playAnswerSound(correct) {
    try {
        const audioContext = getExamAudioContext();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        if (correct) {
            oscillator.frequency.value = 880;
            gain.gain.value = 0.12;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
        } else {
            oscillator.frequency.value = 220;
            gain.gain.value = 0.15;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.25);
        }
    } catch (e) {
        console.warn('Звук недоступен', e);
    }
}

let examState = {
    queue: [],
    errors: [],
    current: null,
    correct: 0,
    wrong: 0,
    answered: 0,
    total: 0,
    locked: false,
    finished: false
};

function startExam() {
    currentMode = "exam";
    getExamAudioContext();
    const types = typeof getSelectedTypes === 'function' ? getSelectedTypes() : ['multiply', 'divide'];
    examState.queue = buildQuestionPool(types);
    examState.total = examState.queue.length;
    examState.errors = [];
    examState.current = null;
    examState.correct = 0;
    examState.wrong = 0;
    examState.answered = 0;
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
        completeExam();
        return;
    }
    renderQuestion(examState.current);
    startAnswerTimer(EXAM_TIME_SECONDS, examTimeout);
}

function submitExamAnswer(value) {
    if (!examState.current || examState.locked || examState.finished) return;
    examState.locked = true;
    stopAnswerTimer();
    examState.answered++;
    const isCorrect = Number(value) === examState.current.answer;
    if (isCorrect) {
        examState.correct++;
        playAnswerSound(true);
        showExamFeedback('✓ Правильно', true);
    } else {
        examState.wrong++;
        playAnswerSound(false);
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
    showResult('Экзамен завершён<br>Всего вопросов: ' + examState.total + '<br>Отвечено: ' + examState.answered + '<br>Правильных: ' + examState.correct + '<br>Ошибок: ' + examState.wrong);
}

function completeExam() {
    finishExamEarly();
}

function showExamFeedback(text, correct = null) {
    const el = document.getElementById('answer-feedback');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('feedback-correct', 'feedback-wrong');
    if (correct === true) el.classList.add('feedback-correct');
    if (correct === false) el.classList.add('feedback-wrong');
}
