// timer.js

let examTimer = null;
let examAnimation = null;
let examTimerTotal = 0;

function startAnswerTimer(seconds, callback) {
    stopAnswerTimer();

    examTimerTotal = seconds;
    resetExamTimeBar(seconds);

    examTimer = setTimeout(() => {
        stopAnswerTimer();
        callback();
    }, seconds * 1000);

    function animate() {
        const now = performance.now();
        if (!examAnimationStart) examAnimationStart = now;
        const elapsed = (now - examAnimationStart) / 1000;
        const left = Math.max(0, examTimerTotal - elapsed);

        updateTimerDisplay(Math.ceil(left), examTimerTotal);

        if (left <= 0) return;
        examAnimation = requestAnimationFrame(animate);
    }

    examAnimationStart = performance.now();
    examAnimation = requestAnimationFrame(animate);
}

let examAnimationStart = 0;

function resetExamTimeBar(seconds) {
    const fill = document.getElementById('exam-time-fill');
    if (!fill) return;

    fill.style.animation = 'none';
    fill.offsetHeight;
    fill.style.animation = `examCountdown ${seconds}s linear forwards`;
}

function updateExamTimeBar(percent) {
    const fill = document.getElementById('exam-time-fill');
    if (!fill) return;

    fill.style.width = Math.max(0, percent) + '%';
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
