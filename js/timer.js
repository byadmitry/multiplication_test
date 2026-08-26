// timer.js

let examTimer = null;
let examTimerTotal = 0;

function startAnswerTimer(seconds, callback) {
    stopAnswerTimer();
    examTimerTotal = seconds;
    let left = seconds;

    updateTimerDisplay(left, examTimerTotal);
    updateExamTimeBar(left, examTimerTotal);

    examTimer = setInterval(() => {
        left--;

        updateTimerDisplay(left, examTimerTotal);
        updateExamTimeBar(left, examTimerTotal);

        if (left <= 0) {
            stopAnswerTimer();
            callback();
        }
    }, 1000);
}

function updateExamTimeBar(left, total) {
    const fill = document.getElementById('exam-time-fill');
    if (!fill || !total) return;

    const percent = Math.max(0, (left / total) * 100);
    fill.style.width = percent + '%';
}

function stopAnswerTimer() {
    if (examTimer) {
        clearInterval(examTimer);
        examTimer = null;
    }
}
