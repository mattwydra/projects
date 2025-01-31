// Define variables
let maxTime = 0; // Longest time to find a number
let mt_num = ""; // Most difficult number to find
let curNum = ""; // Current number to type
let startTime = 0; // Time when the round starts
let totalTime = 0; // Total time across all rounds
let round = 0; // Track the current round
const totalRounds = 10; // Total rounds per game

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme");
    body.setAttribute("data-theme", currentTheme === "light" ? "dark" : "light");
});

// DOM elements
const highscoreDisplay = document.getElementById("highscore-display");
const charToEnter = document.getElementById("char-to-enter");
const textBox = document.getElementById("text-box");
const introText = document.getElementById("intro-text");

// Hide number at the start
charToEnter.hidden = true;

// Focus cursor on the text box
textBox.focus();

// Handle key press to start the game
function handleStartKey(event) {
    if (event.key === "Enter") {
        introText.textContent = "Type the number below:";
        startGame();
    }
}
textBox.addEventListener("keydown", handleStartKey);

// Start the game
function startGame() {
    textBox.removeEventListener("keydown", handleStartKey);
    charToEnter.hidden = false;
    totalTime = 0;
    maxTime = 0;
    round = 0;
    nextRound();
}

// Move to the next round
function nextRound() {
    if (round >= totalRounds) {
        endGame();
        return;
    }

    generateNum();
    charToEnter.textContent = curNum;
    textBox.value = "";
    startTime = Date.now();
    round++;
    textBox.addEventListener("input", handleInput);
}

// Handle user input
function handleInput() {
    const input = textBox.value.trim();
    if (input === curNum) {
        const reactionTime = Date.now() - startTime;
        totalTime += reactionTime;
        if (reactionTime > maxTime) {
            maxTime = reactionTime;
            mt_num = curNum;
        }
        textBox.removeEventListener("input", handleInput);
        nextRound();
    } else if (input.length >= 1) {
        textBox.value = ""; // Clear incorrect input
    }
}

// Generate a random number
function generateNum() {
    curNum = Math.floor(Math.random() * 10).toString();
}

// End the game
function endGame() {
    charToEnter.hidden = true;
    textBox.value = "";
    const avgTime = (totalTime / totalRounds).toFixed(2);
    introText.textContent = `Game over! Avg time: ${avgTime}ms, Slowest: ${maxTime}ms (${mt_num}). Press Enter to retry.`;
    textBox.addEventListener("keydown", handleStartKey);
}
