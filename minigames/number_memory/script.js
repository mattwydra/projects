const progressBar = document.getElementById("progress-bar");
const progressBarDisplay = document.getElementById("progress-bar-display");
const startPage = document.getElementById("start-page");
const correctDisplay = document.getElementById("correct-text");
const incorrectDisplay = document.getElementById("incorrect-text");
const memorizeDisplay = document.getElementById("memorize-prompt");
const sequenceDisplay = document.getElementById("sequence");

// Select elements
const startButton = document.getElementById("start-timer");
const resetBtn = document.getElementById("reset-button");
const proceedBtn = document.getElementById("proceed-button");
const startTimer = document.getElementById("start-timer");

// Initialize variables
let numberSequence = [];
let userInput = "";
let currentIndex = 0;
let startingLength = 6;
let sequence = 0;

//hide elems
progressBar.hidden = true;
progressBarDisplay.hidden = true;
sequenceDisplay.hidden = true;
memorizeDisplay.hidden = true;
correctDisplay.hidden = true;
incorrectDisplay.hidden = true;
resetBtn.hidden = true;
proceedBtn.hidden = true;

// Generate a random sequence of numbers of a given length.
function generateSequence() {
  numberSequence = [];
  for (let i = 0; i < startingLength; i++) {
    numberSequence.push(Math.floor(Math.random() * 10)); // Generate random digit 0-9
  }
  sequence = numberSequence.join(""); // Convert array to a single string
  console.log("Generated sequence:", sequence);
}

startButton.onclick = () => {
  startGame();
};

// Display the sequence to the user for a limited time.
function displaySequence() {
  sequenceDisplay.hidden = false;
  memorizeDisplay.hidden = false;

  progressBar.hidden = false;
  progressBarDisplay.hidden = false;

  sequenceDisplay.textContent = `${sequence}`;

  let memorizationTime = startingLength;
  let currentTime = startingLength;

  const interval = setInterval(() => {
    currentTime -= 0.1; // Decrease time
    const percentage = (currentTime / memorizationTime) * 100;
    progressBar.style.width = `${percentage}%`;

    if (currentTime <= 0) {
      clearInterval(interval);
      progressBar.style.width = "0%";
      progressBar.hidden = true;
      beginTest();
    }
  }, 100);
}

function beginTest() {
  //hide answer
  sequenceDisplay.hidden = true;
  memorizeDisplay.hidden = true;

  // Delay the prompt to allow DOM updates
  setTimeout(() => {
    //prompt user for input
    let userAttempt = handleUserInput();
    if (userAttempt == sequence) {
      startingLength++;
      pass();
    } else {
      fail();
    }
  }, 100); // Delay of 100ms to allow DOM updates
}

// Allow the user to input their guess.
function handleUserInput() {
  let userAttempt = prompt("Enter your guess:");
  return userAttempt.trim(); // Trim any whitespace
}

function pass() {
  correctDisplay.hidden = false;
  proceedBtn.hidden = false;
}
proceedBtn.onclick = () => {
  startGame();
};

function fail() {
  incorrectDisplay.hidden = false;
  incorrectDisplay.textContent = `That was incorrect. Your final score was: ${
    startingLength - 1
  }. Wanna try again?`;
  resetBtn.hidden = false;
}
resetBtn.onclick = () => {
  numberSequence = [];
  userInput = "";
  currentIndex = 0;
  startingLength = 6;
  sequence = 0;
  startPage.hidden = false;
  startButton.hidden = false;
  incorrectDisplay.hidden = true;
  resetBtn.hidden = true;
};

// Start game logic
function startGame() {
  startPage.hidden = true;
  startButton.hidden = true;
  correctDisplay.hidden = true;
  proceedBtn.hidden = true;

  generateSequence();
  displaySequence();
}
