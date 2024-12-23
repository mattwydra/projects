//script.js

//select the display element and buttons
const counterDisplay = document.getElementById("counter-display");
const incrementBtn = document.getElementById("increment-btn");
const decrementBtn = document.getElementById("decrement-btn");
const clearBtn = document.getElementById("clear-btn");

//initialize counter
let count = 0;

//define button funtions
incrementBtn.addEventListener("click", () => {
  count++;
  counterDisplay.textContent = count;
});

decrementBtn.addEventListener("click", () => {
  count--;
  counterDisplay.textContent = count;
});

clearBtn.addEventListener("click", () => {
  count = 0;
  counterDisplay.textContent = count;
});
