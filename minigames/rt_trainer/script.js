const startBtn = document.getElementById("start-btn");
const saveAverageBtn = document.getElementById("save-average-btn");
const saveBestBtn = document.getElementById("save-best-btn");
const instructions = document.getElementById("instructions");
const result = document.getElementById("result");
const stats = document.getElementById("stats");

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

let reactionTimes = [];
let bestAverage = null;
let bestTime = null;

function randomInterval(min, max) {
  return Math.random() * (max - min) + min;
}

function startGame() {
  reactionTimes = [];
  instructions.textContent = "Wait for the screen to turn green, then click!";
  result.classList.add("hidden");
  stats.classList.add("hidden");
  startBtn.classList.add("hidden");
  saveAverageBtn.classList.add("hidden");
  saveBestBtn.classList.add("hidden");

  let attempt = 0;

  function nextAttempt() {
    instructions.textContent = "Wait for the screen to change color, then click!";
    if (attempt >= 5) {
      endGame();
      return;
    }

    const delay = randomInterval(3000, 7000); // 3-7 seconds
    setTimeout(() => {
      const startTime = performance.now();
      instructions.textContent = "CLICK NOW!";
      document.body.style.backgroundColor = document.body.getAttribute("data-theme") === "light" ? "#fdfd96" : "crimson";

      function handleClick() {
        const reactionTime = performance.now() - startTime;
        if (reactionTime < 100) {
          alert("That was too fast! False start.");
          // reactionTimes.push(Infinity);
          nextAttempt();
          document.body.style.backgroundColor = "";
          document.removeEventListener("click", handleClick);
        } else {
          reactionTimes.push(reactionTime);
          attempt++;
          document.body.style.backgroundColor = "";
          document.removeEventListener("click", handleClick);
          nextAttempt();
        }
      }

      document.addEventListener("click", handleClick, { once: true });
    }, delay);
  }

  nextAttempt();
}

function endGame() {
  instructions.textContent = "Game Over!";
  result.classList.remove("hidden");
  stats.classList.remove("hidden");
  startBtn.classList.remove("hidden");
  saveAverageBtn.classList.remove("hidden");
  saveBestBtn.classList.remove("hidden");

  const validTimes = reactionTimes.filter((time) => time !== Infinity);
  const best = Math.min(...validTimes);
  const worst = Math.max(...validTimes);
  const average = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;

  result.textContent = `Best: ${best.toFixed(2)} ms, Worst: ${worst.toFixed(
    2
  )} ms, Average: ${average.toFixed(2)} ms`;
  stats.textContent = `Your Times: ${validTimes
    .map((t) => t.toFixed(2))
    .join(", ")}`;

  if (!bestAverage || average < bestAverage) bestAverage = average;
  if (!bestTime || best < bestTime) bestTime = best;
}

startBtn.addEventListener("click", startGame);
saveAverageBtn.addEventListener("click", () => {
  alert(`Best average (${bestAverage.toFixed(2)} ms) saved!`);
});
saveBestBtn.addEventListener("click", () => {
  alert(`Best time (${bestTime.toFixed(2)} ms) saved!`);
});

