// app.js

let currentMode = "training";

function setMode(mode) {
    currentMode = mode;
}

function startSelectedMode() {
    if (currentMode === "exam") {
        startExam();
    } else {
        startTest();
    }
}
