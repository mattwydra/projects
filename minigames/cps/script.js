// select elems
const clickContainer = document.getElementById("click-container");
const tally = document.getElementById("click-total");
const startBtn = document.getElementById("start-btn");
const saveBtn = document.getElementById("save-btn");
const resetBtn = document.getElementById("reset-btn");
const durationBtns = document.querySelectorAll(".duration-btn");
const timeLeftDisplay = document.getElementById("time-left");
const highestScoreDisplay = document.getElementById("high-score");

// game vars
let clicks = 0;
let dur = 10; // default
let timer;
let cps = 0;

// update dur
durationBtns.forEach((button) => {
  button.addEventListener("click", () => {
    dur = parseInt(button.getAttribute("data-time"), 10);
    durationBtns.forEach((btn) => btn.classList.remove("selected")); // remove prev btn
    button.classList.add("selected"); // highlight new btn
    alert(`Game duration set to ${dur} seconds.`);
  });
});

// start game
startBtn.addEventListener("click", () => {
  clicks = 0;
  tally.textContent = "Clicks: 0";
  startBtn.style.display = "none"; // hide start btn
  clickContainer.addEventListener("click", countClick); // enable clicking
  startTimer(dur); // start timer
});

// implement timer
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

// increment click
function countClick() {
  clicks++;
  tally.textContent = `Clicks: ${clicks}`;
}

// end game
function endGame() {
  clickContainer.removeEventListener("click", countClick);
  startBtn.style.display = "block"; // show start btn again
  saveBtn.hidden = false;

  // Calculate CPS and alert user
  cps = (clicks / dur).toFixed(2);
  if (cps > 10) {
    alert(`Fair play, your cps is pretty good. You scored: ${cps}`);
  } else if (cps > 7) {
    alert(
      `Your cps is above average, but we both know you can do better than ${cps}`
    );
  } else {
    alert(`${cps} is a poor showing. But it was a one-time thing... surely...`);
  }

  // Save high score
  saveBtn.onclick = () => {
    let high_cps = parseFloat(localStorage.getItem("cps")) || 0;
    if (high_cps === 0) {
      alert(
        `Can't really congratulate you because you beat your old score of 0, which isn't really impressive... See if you can do better than ${cps} for a proper congratulations`
      );
      localStorage.setItem("cps", cps);
    } else if (cps > high_cps) {
      alert(
        `New highscore! ${cps} is ${(cps - high_cps).toFixed(
          2
        )} better than your previous score of: ${high_cps}`
      );
      localStorage.setItem("cps", cps);
    } else {
      alert(
        `Not a new highscore :/ Better luck next time. Your current highscore is: ${high_cps}`
      );
    }
    // Update high score displays
    highestScoreDisplay.textContent = `Highest Score: ${localStorage.getItem(
      "cps"
    )}`;
  };
}

// reset game
resetBtn.addEventListener("click", () => {
  clicks = 0;
  tally.textContent = "Clicks: 0";
  clearInterval(timer);
  startBtn.style.display = "block"; // show start btn
  alert("Game reset!");
});

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