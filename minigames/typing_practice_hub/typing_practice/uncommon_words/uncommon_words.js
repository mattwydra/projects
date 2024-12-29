// Define variables
let maxTime = 0; // Longest time to find special character
let mt_char = ""; // Most difficult character to find
let curWord = ""; // Current word to type
let startTime = 0; // Time when the round starts
let score = 0; // Player's score
let words = []; // List of possible words
let round = 0; // Track the current round
const totalRounds = 10; // Total rounds per game

// DOM elements
const highscoreDisplay = document.getElementById("highscore-display");
const charToEnter = document.getElementById("char-to-enter");
const textBox = document.getElementById("text-box");
const introText = document.getElementById("intro-text");

// Hide character at the start
charToEnter.hidden = true;

// Initialize the game after loading the words file
(async function init() {
  await handleFile(); // Wait for words to load
  textBox.focus(); // Focus cursor on the text box after initialization
})();

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
  console.log("Game started!"); // Debug log to ensure the game starts
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

  // Generate a new word
  curWord = words[Math.floor(Math.random() * words.length)];
  console.log(`New word: ${curWord}`); // Debug log to see the word update
  charToEnter.textContent = curWord;
  textBox.value = "";
  startTime = Date.now();
  round++;

  // Listen for input
  textBox.addEventListener("input", handleInput);
}

// Handle user input
function handleInput() {
  const input = textBox.value.trim();
  if (input === curWord) {
    // Correct word
    const reactionTime = Date.now() - startTime;
    score++;
    console.log("Correct input!"); // Debug log for correct input
    introText.textContent = `Correct!`;
    textBox.removeEventListener("input", handleInput);
    nextRound();
  } else if (input.length === curWord.length) {
    // Incorrect word, check if input matches word length
    score--;
    console.log("Incorrect input!"); // Debug log for incorrect input
    introText.textContent = `Incorrect. Try again.`;
    textBox.value = ""; // Clear the incorrect input
  }
}

// End the game
function endGame() {
  console.log(`Game over! Final score: ${score}`); // Debug log to see final score
  textBox.value = "";
  charToEnter.hidden = true;
  introText.textContent = `Game over! Your final score was: ${score}. Press Enter to play again.`;
  textBox.addEventListener("keydown", handleStartKey); // Add the start listener back
}

// Load words from file
async function handleFile() {
  try {
    const response = await fetch("uncommon_words.txt");
    if (!response.ok) {
      throw new Error("Failed to load words file");
    }
    const text = await response.text();
    words = text.split("\n").filter((word) => word.trim() !== "");
    console.log("Words loaded:", words.length); // Debug log to ensure words are loaded
  } catch (error) {
    console.error(error);
    introText.textContent = "Error loading words. Please try again later.";
  }
}
