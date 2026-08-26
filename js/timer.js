// timer.js

let examTimer = null;
let examAnimation = null;
let examTimerTotal = 0;

function startAnswerTimer(seconds, callback) {
    stopAnswerTimer();

    examTimerTotal = seconds;
    const startedAt = performance.now();

    resetExamTimeBar(seconds);

    function animate() {
        const elapsed = (performance.now() - startedAt) / 1000;
        const left = Math.max(0, examTimerTotal - elapsed);
        const percent = (left / examTimerTotal) * 100;

        updateTimerDisplay(Math.ceil(left), examTimerTotal);
        updateExamTimeBar(percent);

        if (left <= 0) {
            stopAnswerTimer();
            callback();
            return;
        }

        examAnimation = requestAnimationFrame(animate);
    }

    examAnimation = requestAnimationFrame(animate);
}

function resetExamTimeBar(seconds) {
    const fill = document.getElementById('exam-time-fill');
    if (!fill) return;

    fill.style.animation = 'none';
    fill.style.width = '100%';
    fill.style.transform = 'scaleX(1)';
}

function updateExamTimeBar(percent) {
    const fill = document.getElementById('exam-time-fill');
    if (!fill) return;

    const value = Math.max(0, Math.min(100, percent));
    fill.style.width = value + '%';
    fill.style.transform = 'scaleX(' + (value / 100) + ')';
}

function stopAnswerTimer() {
    if (examTimer) {
        clearInterval(examTimer);
        examTimer = null;
    }

    if (examAnimation) {
        cancelAnimationFrame(examAnimation);
        examAnimation = null;
    }
}
