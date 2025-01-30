// Define variables
let curWord = ""; // Current word to type
let score = 0; // Player's score
let round = 0; // Track the current round
const totalRounds = 10; // Total rounds per game

// DOM elements
const highscoreDisplay = document.getElementById("highscore-display");
const wordToEnter = document.getElementById("word-to-enter");
const textBox = document.getElementById("text-box");
const introText = document.getElementById("intro-text");

// Hide character at the start
wordToEnter.hidden = true;

// Initialize the game after loading the words file
(async function init() {
  await handleFile(); // Wait for words to load
  textBox.focus(); // Focus cursor on the text box after initialization
})();

// Handle key press to start the game
function handleStartKey(event) {
  if (event.key === "Enter") {
    introText.textContent = "Type the character below. Press Enter to restart.";
    wordToEnter.hidden = false;
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
  wordToEnter.textContent = curWord;
  textBox.value = "";
  round++;

  // Listen for input (Enter key press)
  textBox.addEventListener("keydown", handleEnterPress);
}

// Handle Enter key press to check the input
function handleEnterPress(event) {
  if (event.key === "Enter") {
    const input = textBox.value.trim(); // Trim any spaces or newlines from the input
    const sanitizedCurWord = curWord.trim(); // Trim any spaces or newlines from the word to type
    console.log(`Input: "${input}"`);  // Debug log to check input
    console.log(`Sanitized Current word: "${sanitizedCurWord}"`);  // Debug log to check curWord

    if (input === sanitizedCurWord) {
      // Correct word
      score++;
      introText.textContent = `Correct!`;
      console.log("Correct input!"); // Debug log for correct input
    } else {
      // Incorrect word
      score--;
      introText.textContent = `Incorrect. Try again.`;
      console.log("Incorrect input!"); // Debug log for incorrect input
    }

    // Clear the input and proceed to the next round
    textBox.value = "";
    textBox.removeEventListener("keydown", handleEnterPress);
    nextRound();
  }
}


// End the game
function endGame() {
  console.log(`Game over! Final score: ${score}`); // Debug log to see final score
  textBox.value = "";
  wordToEnter.hidden = true;
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
