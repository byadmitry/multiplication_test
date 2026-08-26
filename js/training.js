// training.js

const REPEAT_AFTER = 3;

let trainingState = {
    queue: [],
    currentIndex: 0,
    answered: 0,
    initialCount: 0,
    correct: 0,
    wrong: 0,
    extra: 0,
    repeats: 0,
    repeatCorrect: 0,
    repeatWrong: 0,
    pendingRepeats: []
};

function startTraining() {
    const count = Number.parseInt(document.getElementById('q-count').value, 10);
    const types = getSelectedTypes();

    if (!Number.isInteger(count) || count < 1) {
        alert('Введите корректное количество вопросов.');
        return;
    }
    if (!types.length) {
        alert('Выберите хотя бы один тип задач.');
        return;
    }

    const pool = buildQuestionPool(types);
    if (!pool.length) {
        alert('Не удалось сформировать вопросы.');
        return;
    }

    trainingState = {
        queue: [],
        currentIndex: 0,
        answered: 0,
        initialCount: Math.min(count, pool.length),
        correct: 0,
        wrong: 0,
        extra: 0,
        repeats: 0,
        repeatCorrect: 0,
        repeatWrong: 0,
        pendingRepeats: []
    };

    for (let i = 0; i < trainingState.initialCount; i++) {
        trainingState.queue.push({ ...pool[i], isExtra: false, isRepeat: false });
    }

    showNextTrainingQuestion();
}

function showNextTrainingQuestion() {
    if (trainingState.currentIndex >= trainingState.queue.length) {
        finishTraining();
        return;
    }

    const question = trainingState.queue[trainingState.currentIndex];
    const total = trainingState.queue.length;
    const percent = Math.round((trainingState.currentIndex / Math.max(total, 1)) * 100);
    renderQuestion(
        question,
        `Вопрос ${trainingState.currentIndex + 1} из ${total}`,
        percent
    );
}

function submitTrainingAnswer(value) {
    if (trainingState.currentIndex >= trainingState.queue.length) return;

    const question = trainingState.queue[trainingState.currentIndex];
    const input = document.getElementById('question-answer');
    const feedback = document.getElementById('answer-feedback');
    const answer = Number(value);

    if (value === '' || !Number.isFinite(answer)) {
        feedback.textContent = 'Введите ответ.';
        feedback.className = 'answer-feedback feedback-wrong';
        return;
    }

    const correct = answer === question.answer;
    question.userAnswer = answer;
    question.isCorrect = correct;
    question.answered = true;

    if (question.isRepeat) {
        trainingState.repeats++;
        if (correct) trainingState.repeatCorrect++;
        else trainingState.repeatWrong++;
    } else if (correct) {
        trainingState.correct++;
    } else {
        trainingState.wrong++;
    }

    if (correct) {
        input.classList.remove('wrong-input');
        input.classList.add('correct-input');
        feedback.textContent = '✓ Правильно!';
        feedback.className = 'answer-feedback feedback-correct';
    } else {
        input.classList.remove('correct-input');
        input.classList.add('wrong-input');
        feedback.textContent = `✗ Неправильно. Правильный ответ: ${question.answer}`;
        feedback.className = 'answer-feedback feedback-wrong';

        // По правилам исходной реализации: ошибка добавляет два новых вопроса,
        // а ошибочный пример повторяется после трех других вопросов.
        addExtraQuestions(question);
        scheduleRepeat(question);
    }

    trainingState.answered++;
    const button = document.getElementById('btn-submit');
    if (button) button.disabled = true;

    setTimeout(() => {
        trainingState.currentIndex++;
        showNextTrainingQuestion();
    }, correct ? 350 : 1200);
}

function addExtraQuestions(sourceQuestion) {
    const types = [sourceQuestion.type];
    const pool = buildQuestionPool(types).filter((q) => q.key !== sourceQuestion.key);

    for (let i = 0; i < Math.min(2, pool.length); i++) {
        trainingState.queue.push({
            ...pool[i],
            isExtra: true,
            isRepeat: false
        });
        trainingState.extra++;
    }
}

function scheduleRepeat(question) {
    const repeat = {
        ...question,
        userAnswer: null,
        isCorrect: null,
        answered: false,
        isExtra: false,
        isRepeat: true
    };

    const insertAt = Math.min(
        trainingState.currentIndex + REPEAT_AFTER + 1,
        trainingState.queue.length
    );
    trainingState.queue.splice(insertAt, 0, repeat);
}

function finishTrainingEarly() {
    if (!confirm('Завершить тест сейчас?')) return;
    finishTraining();
}

function finishTraining() {
    showResult(
        `Тест завершён. Правильных: ${trainingState.correct}. Ошибок: ${trainingState.wrong}. ` +
        `Повторных заданий: ${trainingState.repeats}.`
    );
}
