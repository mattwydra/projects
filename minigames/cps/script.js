//script.js

//select elems
const clickContainer = document.getElementById("click-container");
const tally = document.getElementById("click-total");
const startBtn = document.getElementById("start-btn");
const saveBtn = document.getElementById("save-btn");
const resetBtn = document.getElementById("reset-btn");
const durationBtns = document.querySelectorAll(".duration-btn");

//game vars
let clicks = 0;
let dur = 10; //default
let timer;
let highscore = 0;

//update dur
durationBtns.forEach((button) => {
  button.addEventListener("click", () => {
    dur = parseInt(button.getAttribute("data-time"), 10);
    durationBtns.forEach((btn) => btn.classList.remove("selected")); //rm prev btn
    button.classList.add("selected"); //highlight new btn
    alert(`Game duration set to ${dur} seconds.`);
  });
});

//start game
startBtn.addEventListener("click", () => {
  clicks = 0;
  tally.textContent = "Clicks: 0";
  startBtn.style.display = "none"; //hide start btn
  clickContainer.addEventListener("click", countClick); //enable clicking
  startTimer(dur); //start timer
});

//implement timer
function startTimer(duration) {
  let timeLeft = duration;
  timeLeftDisplay.textContent = `Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

//increment click
function countClick() {
  clicks++;
  tally.textContent = `Clicks: ${clicks}`;
}

//infinity war
function endGame() {
  clickContainer.removeEventListener("click", countClick);
  startBtn.style.display = "block"; //show begin btn again
  let cps = clicks / dur;
  if (cps > 10) {
    alert(
      `fair play, your cps is pretty good. you scored: ${(clicks / dur).toFixed(
        2
      )}`
    );
  } else if (cps > 7) {
    alert(
      `your cps is above average, but we both know you can do better than ${(
        clicks / dur
      ).toFixed(2)}`
    );
  } else {
    alert(
      `${(clicks / dur).toFixed(
        2
      )} is a poor showing. but it was a one-time thing... surely...`
    );
  }
}

//save score
saveBtn.addEventListener("click", () => {
  if ((highscore = 0)) {
    highscore = (clicks / dur).toFixed(2);
    `cant really congratulate you bc you beat your old score of 0, which isnt really impressive... see if you can do better than ${highscore} for a proper congratulations`;
  } else if (clicks / dur > highscore) {
    alert(
      `new highscore! ${(clicks / dur).toFixed(2)} is ${
        (clicks / dur).toFixed(2) - highscore
      } better than your previous score of: ${highscore}`
    );
    highscore = (clicks / dur).toFixed(2);
  } else {
    alert(
      `not a new highscore :/ better luck next time. your current highscore is: ${highscore}`
    );
  }
});

//reset game
resetBtn.addEventListener("click", () => {
  clicks = 0;
  tally.textContent = "Clicks: 0";
  clearInterval(timer);
  startBtn.style.display = "block"; //show start btn
  alert("its time");
});

// Add this to your existing JavaScript

const timeLeftDisplay = document.getElementById("time-left");
let timeLeft = 10; // Default duration in seconds

// Function to start the timer
function startTimer(duration) {
  timeLeft = duration;
  timeLeftDisplay.textContent = `Time Left: ${timeLeft}s`;

  const timerInterval = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval); // Stop the timer
      endGame(); // Call your end game logic
    }
  }, 1000); // Update every 1 second
}

// Example usage: start the timer when the game starts
startGameButton.addEventListener("click", () => {
  startTimer(10); // Start the timer with 10 seconds
  startGame(); // Call your existing game start logic
});
