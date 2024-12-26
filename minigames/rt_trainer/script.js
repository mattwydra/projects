// Select elements
const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");
const resetBtn = document.getElementById("reset-button");
const saveBtn = document.getElementById("save-button");
const highscoreDisplay = document.getElementById("highest-reaction-time");

// Initialize variables
let gameTimer = null;
let startTime = null;
let attemptsRemaining = 5;

// Hide elements at start
highscoreDisplay.hidden = true;
resetBtn.hidden = true;
gameArea.hidden = true;
saveBtn.hidden = true;

// Start game logic
function startGame() {
  reset();
  startButton.hidden = true;
  gameArea.hidden = false;

  // Random delay before showing the "click now" indicator
  const delay = Math.random() * 4000 + 3000; // ~3-7s
  gameTimer = setTimeout(() => {
    gameArea.style.background = "green";
    startTime = Date.now();
  }, delay);
}

// Handle click on game area
gameArea.onclick = () => {
  if (startTime) {
    const reactionTime = Date.now() - startTime;
    alert(`Your reaction time: ${reactionTime}ms`);
    reset();
  }
};

// Reset game
function reset() {
  clearTimeout(gameTimer);
  gameTimer = null;
  startTime = null;

  gameArea.style.background = "crimson";
  gameArea.hidden = true;
  resetBtn.hidden = false;
  startButton.hidden = false;
}

// Attach event listeners
startButton.addEventListener("click", startGame);
resetBtn.addEventListener("click", reset);
