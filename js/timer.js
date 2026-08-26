// timer.js

let examTimer = null;
let examTimerTotal = 0;

function startAnswerTimer(seconds, callback) {
    stopAnswerTimer();
    examTimerTotal = seconds;
    let left = seconds;

    if (typeof updateTimerDisplay === "function") {
        updateTimerDisplay(left, examTimerTotal);
    }

    examTimer = setInterval(() => {
        left--;

        if (typeof updateTimerDisplay === "function") {
            updateTimerDisplay(left, examTimerTotal);
        }

        if (left <= 0) {
            stopAnswerTimer();
            callback();
        }
    }, 1000);
}

function stopAnswerTimer() {
    if (examTimer) {
        clearInterval(examTimer);
        examTimer = null;
    }
}
