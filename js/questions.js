// questions.js
// Общий генератор вопросов.
// Операции с 1 исключены для всех режимов.

function buildQuestionPool(types) {
    const pool = [];

    if (types.includes("multiply")) {
        for (let a = 2; a <= 9; a++) {
            for (let b = a; b <= 9; b++) {
                pool.push({
                    key: `multiply:${a}:${b}`,
                    type: "multiply",
                    expression: `${a} × ${b}`,
                    answer: a * b
                });
            }
        }
    }

    if (types.includes("divide")) {
        for (let d = 2; d <= 9; d++) {
            for (let a = 2; a <= 9; a++) {
                pool.push({
                    key: `divide:${d*a}:${d}`,
                    type: "divide",
                    expression: `${d*a} ÷ ${d}`,
                    answer: a
                });
            }
        }
    }

    return shuffle(pool);
}

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}
