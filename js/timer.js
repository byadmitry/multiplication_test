// timer.js

let examTimer = null;
let examAnimation = null;
let examTimerTotal = 0;
let examAnimationStart = 0;

function startAnswerTimer(seconds, callback) {
    stopAnswerTimer();

    examTimerTotal = seconds;
    resetExamTimeBar(seconds);

    examTimer = setTimeout(() => {
        stopAnswerTimer();
        callback();
    }, seconds * 1000);

    examAnimationStart = performance.now();
    examAnimation = requestAnimationFrame(animateExamTimer);
}

function animateExamTimer(now) {
    const elapsed = (now - examAnimationStart) / 1000;
    const left = Math.max(0, examTimerTotal - elapsed);

    updateTimerDisplay(Math.ceil(left), examTimerTotal);

    if (left > 0) {
        examAnimation = requestAnimationFrame(animateExamTimer);
    }
}

function resetExamTimeBar(seconds) {
    const fill = document.getElementById('exam-time-fill');
    if (!fill) return;

    fill.style.animation = 'none';
    fill.style.transform = 'scaleX(1)';
    void fill.offsetWidth;
    fill.style.animation = `examCountdown ${seconds}s linear forwards`;
}

function stopAnswerTimer() {
    if (examTimer) {
        clearTimeout(examTimer);
        examTimer = null;
    }

    if (examAnimation) {
        cancelAnimationFrame(examAnimation);
        examAnimation = null;
    }
}
