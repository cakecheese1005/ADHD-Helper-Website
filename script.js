// === Fetch Movie Quote ===
async function fetchQuote() {
    try {
        const response = await fetch("http://localhost:3000/quote");
        if (!response.ok) throw new Error("Failed to fetch quote.");
        const data = await response.json();
        document.getElementById("quote").innerText = data.quote;
    } catch (error) {
        document.getElementById("quote").innerText = "Error loading quote.";
        console.error(error);
    }
}
fetchQuote();

// === Pomodoro Timer ===
let timer;
let remainingTime = 25 * 60;
let totalTime = 25 * 60;

function updateTimerDisplay() {
    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;
    document.getElementById("timer-display").textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateProgressBar() {
    const percentage = ((totalTime - remainingTime) / totalTime) * 100;
    document.getElementById("progress-bar").style.width = `${percentage}%`;
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateTimerDisplay();
                updateProgressBar();
            } else {
                clearInterval(timer);
                timer = null;
                showToast("Time's up! Take a break.");
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    remainingTime = totalTime;
    updateTimerDisplay();
    updateProgressBar();
}

document.getElementById("start-timer").addEventListener("click", startTimer);
document.getElementById("reset-timer").addEventListener("click", resetTimer);

// === Dark Mode ===
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll("input, button").forEach(el => el.classList.toggle("dark-mode"));
});

// === Toast Notification ===
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// === Scroll-to-Top Button ===
const scrollToTop = document.getElementById("scroll-to-top");
scrollToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", () => {
    scrollToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

// === Task Organizer ===
document.getElementById("add-task").addEventListener("click", () => {
    const taskText = document.getElementById("new-task").value;
    const priority = document.getElementById("task-priority").value;

    if (taskText) {
        const taskItem = document.createElement("li");
        taskItem.textContent = `${taskText} (${priority})`;
        taskItem.className = priority;
        taskItem.addEventListener("click", () => {
            taskItem.remove();
            showToast("Task Removed");
        });
        document.getElementById("task-list").appendChild(taskItem);
        document.getElementById("new-task").value = "";
        showToast("Task Added Successfully");
    }
});

// === Breathing Exercise ===
const breathingCircle = document.querySelector(".breathing-circle");
const breathingInstructions = document.getElementById("breathing-instructions");
let breathingInterval;

document.getElementById("start-breathing").addEventListener("click", () => {
    let step = 0;
    breathingInterval = setInterval(() => {
        step = (step + 1) % 4;
        if (step === 0) {
            breathingInstructions.textContent = "Breathe In...";
            breathingCircle.style.transform = "scale(1.5)";
        } else if (step === 1) {
            breathingInstructions.textContent = "Hold...";
        } else if (step === 2) {
            breathingInstructions.textContent = "Breathe Out...";
            breathingCircle.style.transform = "scale(1)";
        } else {
            breathingInstructions.textContent = "Hold...";
        }
    }, 4000);
});

document.getElementById("stop-breathing").addEventListener("click", () => {
    clearInterval(breathingInterval);
    breathingInstructions.textContent = "Relax...";
    breathingCircle.style.transform = "scale(1)";
});

// === Focus Finder Game ===
const focusGrid = document.getElementById("focus-grid");
const focusStatus = document.getElementById("focus-status");

function generateFocusGrid() {
    focusGrid.innerHTML = "";
    focusStatus.textContent = "";
    const size = 5;
    const smileIndex = Math.floor(Math.random() * size * size);

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.className = "focus-cell";
        cell.textContent = i === smileIndex ? "😊" : "😐";
        cell.style.cursor = "pointer";

        cell.addEventListener("click", () => {
            if (i === smileIndex) {
                cell.style.backgroundColor = "lightgreen";
                focusStatus.textContent = "✅ You found it!";
            } else {
                cell.style.backgroundColor = "#ffcccc";
                focusStatus.textContent = "❌ Try again!";
            }
        });

        focusGrid.appendChild(cell);
    }

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Play Again";
    resetBtn.onclick = generateFocusGrid;
    focusGrid.appendChild(document.createElement("br"));
    focusGrid.appendChild(resetBtn);
}
generateFocusGrid();

// === Color Switch Game ===
const colorPrompt = document.getElementById("color-prompt");
const colorOptions = document.getElementById("color-options");
const colorFeedback = document.getElementById("color-feedback");

function generateColorSwitchGame() {
    const colors = ["red", "blue", "green", "yellow", "purple"];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    colorPrompt.textContent = `Click the color: ${targetColor}`;
    colorFeedback.textContent = "";
    colorOptions.innerHTML = "";

    colors.sort(() => 0.5 - Math.random());

    colors.forEach(color => {
        const btn = document.createElement("button");
        btn.style.backgroundColor = color;
        btn.style.width = "60px";
        btn.style.height = "60px";
        btn.style.margin = "5px";
        btn.style.borderRadius = "10px";
        btn.style.border = "2px solid #000";
        btn.title = color;

        btn.addEventListener("click", () => {
            colorFeedback.textContent = color === targetColor
                ? "✅ Correct!"
                : `❌ Nope. That was ${color}`;
        });

        colorOptions.appendChild(btn);
    });

    const retry = document.createElement("button");
    retry.textContent = "Try Another Round";
    retry.onclick = generateColorSwitchGame;
    retry.style.marginTop = "10px";
    colorOptions.appendChild(retry);
}
generateColorSwitchGame();

// === Quick Math Challenge ===
const mathProblem = document.getElementById("math-problem");
const mathAnswer = document.getElementById("math-answer");
const mathFeedback = document.getElementById("math-feedback");
const submitMath = document.getElementById("submit-math");
let mathTimer;
let timeLeft = 10;
let correctStreak = 0;

function generateMathProblem() {
    const ops = ["+", "-"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const max = 10 + correctStreak * 5;
    const num1 = Math.floor(Math.random() * max) + 1;
    const num2 = Math.floor(Math.random() * max) + 1;

    mathProblem.textContent = `What is ${num1} ${op} ${num2}?`;
    mathAnswer.dataset.correctAnswer = op === "+" ? num1 + num2 : num1 - num2;
    startMathTimer();
}

function startMathTimer() {
    clearInterval(mathTimer);
    timeLeft = 10;
    mathFeedback.textContent = `You have ${timeLeft} seconds left.`;
    mathTimer = setInterval(() => {
        timeLeft--;
        mathFeedback.textContent = `You have ${timeLeft} seconds left.`;
        if (timeLeft <= 0) {
            clearInterval(mathTimer);
            mathFeedback.textContent = "⏰ Time's up! Try again.";
            generateMathProblem();
            mathAnswer.value = "";
        }
    }, 1000);
}

function addRetryButton() {
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Try Again";
    retryBtn.onclick = () => {
        retryBtn.remove();
        generateMathProblem();
    };
    mathFeedback.appendChild(retryBtn);
}

submitMath.addEventListener("click", () => {
    const userAnswer = parseInt(mathAnswer.value, 10);
    const correctAnswer = parseInt(mathAnswer.dataset.correctAnswer, 10);
    clearInterval(mathTimer);

    if (userAnswer === correctAnswer) {
        correctStreak++;
        mathFeedback.textContent = `✅ Correct! Streak: ${correctStreak}`;
        mathAnswer.value = "";
        setTimeout(generateMathProblem, 1000);
    } else {
        correctStreak = 0;
        mathFeedback.textContent = `❌ Incorrect. It was ${correctAnswer}`;
        mathAnswer.value = "";
        addRetryButton();
    }
});
generateMathProblem();

// === Pattern Memory Game ===
const patternStartButton = document.getElementById("start-pattern-game");
const patternFeedback = document.getElementById("pattern-feedback");
const patternDisplay = document.getElementById("pattern-display");
const patternBtns = ['🔴', '🟢', '🔵', '🟡'];
const patternInput = document.createElement("div");
patternInput.style.marginTop = "10px";
let patternSequence = [];
let userSequence = [];

function generatePatternSequence() {
    patternSequence.push(Math.floor(Math.random() * 4));
    displayPattern();
}

function displayPattern() {
    patternDisplay.textContent = "Memorize this:";
    let index = 0;

    const interval = setInterval(() => {
        if (index < patternSequence.length) {
            patternDisplay.textContent = patternBtns[patternSequence[index]];
            index++;
        } else {
            clearInterval(interval);
            patternDisplay.textContent = "Now repeat it!";
            showPatternButtons();
            userSequence = [];
        }
    }, 1000);
}

function showPatternButtons() {
    patternInput.innerHTML = "";
    patternBtns.forEach((emoji, i) => {
        const btn = document.createElement("button");
        btn.textContent = emoji;
        btn.style.margin = "5px";
        btn.onclick = () => {
            userSequence.push(i);
            checkPattern();
        };
        patternInput.appendChild(btn);
    });
    patternDisplay.appendChild(patternInput);
}

function checkPattern() {
    const current = userSequence.length - 1;
    if (userSequence[current] !== patternSequence[current]) {
        patternFeedback.textContent = "❌ Incorrect! Try again.";
        patternSequence = [];
        userSequence = [];
        return;
    }

    if (userSequence.length === patternSequence.length) {
        patternFeedback.textContent = "✅ Correct!";
        setTimeout(generatePatternSequence, 1500);
    }
}

patternStartButton.addEventListener("click", () => {
    patternSequence = [];
    generatePatternSequence();
});
