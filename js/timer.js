// timer.js

let examTimer = null;

function startAnswerTimer(seconds, callback) {
    stopAnswerTimer();
    let left = seconds;

    examTimer = setInterval(() => {
        left--;
        if (typeof updateTimerDisplay === "function") {
            updateTimerDisplay(left);
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
