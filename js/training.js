// training.js

let trainingState = {
    questions: [],
    index: 0,
    current: null
};

function startTraining() {
    trainingState.questions = buildQuestionPool(["multiply", "divide"]);
    trainingState.index = 0;
    showTrainingQuestion();
}

function showTrainingQuestion() {
    const q = trainingState.questions[trainingState.index];
    if (!q) {
        showResult("Тренировка завершена");
        return;
    }
    trainingState.current = q;
    renderQuestion(q.expression);
}

function submitTrainingAnswer(value) {
    if (Number(value) === trainingState.current.answer) {
        trainingState.index++;
        showTrainingQuestion();
    } else {
        document.getElementById("feedback").textContent = "Правильный ответ: " + trainingState.current.answer;
    }
}
