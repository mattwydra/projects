// Select elements
const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const saveBtn = document.getElementById("save-score");
const timerDisplay = document.getElementById("timer");
const accuracyDisplay = document.getElementById("accuracy");
const resetBtn = document.getElementById("reset-button");
const giveUpBtn = document.getElementById("give-up");

//display HS elems
const highestScoreDisplay = document.getElementById("highest-score");
const highestAccuracyDisplay = document.getElementById("highest-accuracy");
const highestRTDisplay = document.getElementById("highest-reaction-time");

// Initialize variables
let score = 0;
let gameTimer = null;
let highScore = 0;
let accuracy = 0.0;
let reactionTime = "poor";
let clicks = 0; //score/clicks will be accuracy
let completed = 1;

//hide elements at start
scoreDisplay.hidden = true;
timerDisplay.hidden = true;
saveBtn.hidden = true;
resetBtn.hidden = true;
accuracyDisplay.hidden = true;
giveUpBtn.hidden = true;

// Save high score to local storage
function saveHighScore() {
  localStorage.setItem("highest-score", highScore);
  localStorage.setItem("highest-accuracy", accuracy);
  localStorage.setItem("reaction-time", reactionTime);
  highestScoreDisplay.textContent = `highest score: ${localStorage.getItem(
    "highest-score"
  )}`;
  highestAccuracyDisplay.textContent = `highest score accuracy: ${localStorage.getItem(
    "highest-accuracy"
  )}%`;
  highestRTDisplay.textContent = `reaction time: ${localStorage.getItem(
    "reaction-time"
  )}`;
}

// Start game logic
function startGame() {
  reset();
  //show elements/hide elements
  startButton.hidden = true;
  gameArea.hidden = false;
  scoreDisplay.hidden = false;
  accuracyDisplay.hidden = false;
  giveUpBtn.hidden = false;

  score = 0; //reset score at the start of the game
  clicks = 0; //reset clicks at start as well
  accuracy = 0; //finally, reset accuracy
  scoreDisplay.textContent = `score: ${score}\t`;
  accuracyDisplay.textContent = `accuracy: 0`;
  timerDisplay.hidden = false;

  startTimer();
  spawnTarget();
}

// Start game timer
function startTimer() {
  let timeLeft = 10; // Fixed duration for now
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;

  gameTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      stopGame(completed);
    }
  }, 1000);
}

// Create and position new target
function spawnTarget() {
  // Remove any existing target
  const existingTarget = document.querySelector(".target");
  if (existingTarget) {
    existingTarget.remove();
  }

  // Create a new target
  const target = document.createElement("div");
  target.classList.add("target");

  // Randomize position
  const x = Math.random() * (gameArea.offsetWidth - 50);
  const y = Math.random() * (gameArea.offsetHeight - 50);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  // Add event listener to increment score
  target.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = `score: ${score}\t`;

    spawnTarget();
  });

  // Add target to the game area
  gameArea.appendChild(target);
}

//track total clicks. will be used to calculate accuracy
gameArea.onclick = () => {
  clicks++;
  if (clicks > 0) {
    accuracy = ((score / clicks) * 100).toFixed(2);
    accuracyDisplay.textContent = `accuracy: ${accuracy}%`;
  } else {
    `accuracy: 0`;
  }
};

// Stop game logic
function stopGame(completed) {
  if (completed) {
    clearInterval(gameTimer);
    gameArea.hidden = true;
    timerDisplay.hidden = true;

    //calculate reaction time
    let RT_raw = (10000 / score).toFixed(0);
    if (RT_raw > 700) {
      reactionTime = "poor";
    } else if (RT_raw > 500) {
      reactionTime = "average";
    } else if (RT_raw > 350) {
      reactionTime = "good";
    } else {
      reactionTime = "insane";
    }


    localStorage.setItem("score", `${score}`);
    localStorage.setItem("reactionTime", `${reactionTime}`);
    // localStorage.setItem("RT_raw", RT_raw);
    localStorage.setItem("misses", `${(clicks - score)}`);
    localStorage.setItem("accuracy", `${((score / clicks) * 100).toFixed(2)}`);

    console.log("here");
    console.log(localStorage.getItem("score"))
    console.log(localStorage.getItem("accuracy"));
    console.log(localStorage.getItem("misses"));
    console.log(localStorage.getItem("reactionTime"));

    window.location.href = "test.html"; // Redirects to game-over.html

    if (clicks > 0) {
      alert(
        `final score: ${score}\naccuracy: ${((score / clicks) * 100).toFixed(
          2
        )}%\ntotal misses: ${clicks - score}\naverage time to hit target: ${(
          10000 / score
        ).toFixed(0)}ms`
      );

      saveBtn.hidden = false;
      saveBtn.onclick = () => {
        if (score > highScore) {
          alert(
            `NEW HIGHSCORE!\n${score} is ${score - highScore
            } greater than your previous highscore of: ${highScore}\nyour previous highest reaction time was: ${(
              10000 / highScore
            ).toFixed(0)}\nyour new highest reaction time is: ${(
              10000 / score
            ).toFixed(0)}`
          );
          highScore = score;
          saveHighScore();
        } else if (score == highScore) {
          let old_acc =
            parseFloat(localStorage.getItem("highest-accuracy")) || 0;
          if (accuracy > old_acc) {
            alert(
              `so close! you tied your high score of: ${highScore}.\non the bright-side, your accuracy went up by ${(
                accuracy - old_acc
              ).toFixed(2)}%!\nyour highest recorded reaction time remains: ${(
                10000 / highScore
              ).toFixed(0)}.`
            );
            saveHighScore();
          } else {
            alert(
              `so close! you tied your high score of: ${highScore}.\nyour highest recorded reaction time remains: ${(
                10000 / highScore
              ).toFixed(0)}.`
            );
          }
        } else {
          alert(
            `you were unable to beat your previous highscore of ${highScore}.\nyour highest recorded reaction time remains: ${(
              10000 / highScore
            ).toFixed(0)}.`
          );
        }
      };
    } else {
      alert(`so we're not even trying`);
    }
    startButton.hidden = false;
    resetBtn.hidden = false;
  } else {
    clearInterval(gameTimer);
    gameArea.hidden = true;
    timerDisplay.hidden = true;
    reset();
    alert(`coward`);
  }
}

// Attach start game event listener
startButton.addEventListener("click", startGame);

//reset btn logic
resetBtn.onclick = () => {
  reset();
};
function reset() {
  scoreDisplay.hidden = true;
  timerDisplay.hidden = true;
  saveBtn.hidden = true;
  resetBtn.hidden = true;
  accuracyDisplay.hidden = true;
}

//cowardice logic
giveUpBtn.onclick = () => {
  completed = 0;
  stopGame();
  startButton.hidden = false;
  completed = 1;
};

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