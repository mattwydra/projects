const progressBar = document.getElementById("progress-bar");
const progressBarDisplay = document.getElementById("progress-bar-display");
const startPage = document.getElementById("start-page");
const correctDisplay = document.getElementById("correct-text");
const incorrectDisplay = document.getElementById("incorrect-text");
const memorizeDisplay = document.getElementById("memorize-prompt");
const sequenceDisplay = document.getElementById("sequence");

// Select elements
const startBtn = document.getElementById("start-timer");
const saveBtn = document.getElementById("save-btn");
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
saveBtn.hidden = true;
proceedBtn.hidden = true;

// Generate a random sequence of numbers of a given length.
function generateSequence() {
  numberSequence = [];
  for (let i = 0; i < startingLength; i++) {
    numberSequence.push(Math.floor(Math.random() * 10)); // Generate random digit 0-9
  }
  sequence = numberSequence.join(""); // Convert array to a single string
}

startBtn.onclick = () => {
  startGame();
};

// Display the sequence to the user for a limited time.
function displaySequence() {
  sequenceDisplay.hidden = false;
  memorizeDisplay.hidden = false;

  progressBar.style.opacity = "1";
  progressBarDisplay.style.opacity = "1";

  // Debug: Ensure visible and sized correctly
  progressBar.style.width = "100%";
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
      progressBar.style.opacity = "0"; // Hide smoothly
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
  if (startingLength === 6) {
    incorrectDisplay.textContent = `That was incorrect. Wanna try again?`;
  } else {
    incorrectDisplay.textContent = `That was incorrect. Your final score was: ${startingLength - 1
      }. Wanna try again?`;
  }
  resetBtn.hidden = false;
  saveBtn.hidden = false;
  progressBar.hidden = true;
  progressBarDisplay.hidden = true;
  saveBtn.onclick = () => {
    prev_high = localStorage.getItem("highscore") || 0;
    if (startingLength === 6) {
      alert(`we both know i can't count that`);
    } else if (startingLength - 1 > prev_high) {
      localStorage.setItem("highscore", startingLength - 1);
      alert(
        `NEW HIGHSCORE! You managed to memorize a string up to length ${startingLength - 1
        }!`
      );
    } else {
      alert(
        `You were not able to beat your highscore of ${prev_high} :/ \nBetter luck next time <3`
      );
    }
  };
}
resetBtn.onclick = () => {
  numberSequence = [];
  userInput = "";
  currentIndex = 0;
  startingLength = 6;
  sequence = 0;
  startPage.hidden = false;
  startBtn.hidden = false;
  incorrectDisplay.hidden = true;
  resetBtn.hidden = true;
  saveBtn.hidden = true;
};

// Start game logic
function startGame() {
  startPage.hidden = true;
  startBtn.hidden = true;
  correctDisplay.hidden = true;
  proceedBtn.hidden = true;

  generateSequence();
  displaySequence();
}

const themeToggle = document.getElementById("themeToggle")
themeToggle.addEventListener("click", () => {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");

  if (currentTheme === "light") {
    body.setAttribute("data-theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
  }
});