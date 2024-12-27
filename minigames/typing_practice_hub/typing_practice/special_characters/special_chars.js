// Define variables
let maxTime = 0; // Longest time to find special character
let mt_char = ""; // Most difficult character to find
let curChar = ""; // Current character to type
let startTime = 0; // Time when the round starts
let score = 0; // Player's score
let chars = []; // List of possible characters
let round = 0; // Track the current round
const totalRounds = 10; // Total rounds per game

// DOM elements
const highscoreDisplay = document.getElementById("highscore-display");
const charToEnter = document.getElementById("char-to-enter");
const textBox = document.getElementById("text-box");
const introText = document.getElementById("intro-text");

// Hide character at the start
charToEnter.hidden = true;

// Populate characters
populateChars();

// Focus cursor on the text box
textBox.focus();

// Handle key press to start the game
function handleStartKey(event) {
  if (event.key === "Enter") {
    introText.textContent = "Type the character below. Press Enter to restart.";
    startGame();
  }
}
textBox.addEventListener("keydown", handleStartKey);

// Start the game
function startGame() {
  // Remove the start listener
  textBox.removeEventListener("keydown", handleStartKey);

  // Reset variables
  charToEnter.hidden = false;
  score = 0;
  round = 0;
  nextRound();
}

// Move to the next round
function nextRound() {
  if (round >= totalRounds) {
    endGame();
    return;
  }

  // Generate a new character
  generateChar();
  charToEnter.textContent = curChar;
  textBox.value = "";
  startTime = Date.now();
  round++;

  // Listen for input
  textBox.addEventListener("input", handleInput);
}

// Handle user input
function handleInput() {
  const input = textBox.value.trim();
  if (input === curChar) {
    // Correct character
    const reactionTime = Date.now() - startTime;
    score++;
    introText.textContent = `Correct!`;
    textBox.removeEventListener("input", handleInput);
    nextRound();
  } else if (input.length >= 1) {
    // Incorrect character
    score--;
    introText.textContent = `Incorrect. Try again.`;
    textBox.value = ""; // Clear the incorrect input
  }
}

// Generate a random character
function generateChar() {
  curChar = chars[Math.floor(Math.random() * chars.length)];
}

// End the game
function endGame() {
  textBox.value = "";
  charToEnter.hidden = true;
  introText.textContent = `Game over! Your final score was: ${score}. Press Enter to play again.`;
  textBox.addEventListener("keydown", handleStartKey); // Add the start listener back
}

// Populate the list of special characters
function populateChars() {
  let index = 0;
  for (let val = 33; val < 48; val++) {
    chars[index++] = String.fromCharCode(val);
  }
  for (let val = 58; val < 65; val++) {
    chars[index++] = String.fromCharCode(val);
  }
  for (let val = 91; val < 97; val++) {
    chars[index++] = String.fromCharCode(val);
  }
  for (let val = 123; val < 127; val++) {
    chars[index++] = String.fromCharCode(val);
  }
  console.log(chars);
}
