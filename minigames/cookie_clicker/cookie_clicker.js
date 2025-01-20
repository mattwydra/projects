let cookieCount = 0;
let clickMultiplier = 1; // Multiplier for manual clicks
let autoMultiplier = 1; // Multiplier for auto-clicker
let delay = 1000; // Delay for auto-clicker in milliseconds
let autoStarted = false;

const thresholds = {
  autoClick: 500, // Auto-clicker threshold
  autoBoost: 1000, // Auto-clicker multiplier boost threshold
  clickBoost: 500, // Click multiplier boost threshold
};

document.getElementById("cookie").addEventListener("click", () => {
  cookieCount += 1 * clickMultiplier; // Apply click multiplier
  document.getElementById("cookie-count").textContent = cookieCount;
  checkThresholds();
});

// Start Auto-Clicker
function startAutoClick() {
  autoStarted = true;
  removeButton("auto-cookie-start");
  autoClickerLoop();
}

// Auto-Clicker Logic
function autoClickerLoop() {
  if (!autoStarted) return; // Exit if auto-clicker is stopped
  cookieCount += autoMultiplier; // Apply auto-clicker multiplier
  document.getElementById("cookie-count").textContent = cookieCount;
  checkThresholds();
  setTimeout(autoClickerLoop, delay);
}

// Boost Auto-Clicker Speed
function boostAutoClickSpeed() {
  if (delay > 100) {
    delay -= 100; // Decrease delay by 100ms
  } else {
    delay /= 2; // Halve delay if <= 100ms
  }
  cookieCount -= 50; // Cash in cookies
  document.getElementById("cookie-count").textContent = cookieCount;
  removeButton("auto-cookie-speed");
}

// Boost Auto-Clicker Multiplier
function boostAutoClickerMultiplier() {
  autoMultiplier++; // Increase auto-clicker multiplier
  cookieCount -= 1000; // Cash in cookies
  document.getElementById("cookie-count").textContent = cookieCount;
  removeButton("auto-multiplier");
}

// Boost Click Multiplier
function boostClickMultiplier() {
  clickMultiplier++; // Increase click multiplier
  cookieCount -= 500; // Cash in cookies
  document.getElementById("cookie-count").textContent = cookieCount;
  removeButton("click-multiplier");
}

// Create Buttons Dynamically
function createButton(id, text, onClick) {
  const button = document.createElement("button");
  button.id = id;
  button.textContent = text;
  button.addEventListener("click", onClick);
  document.body.appendChild(button);
}

// Remove Buttons Dynamically
function removeButton(id) {
  const button = document.getElementById(id);
  if (button) button.remove();
}

// Check Thresholds and Show Buttons
function checkThresholds() {
  // Show Auto-Clicker Start Button
  if (!autoStarted && cookieCount >= thresholds.autoClick && !document.getElementById("auto-cookie-start")) {
    createButton("auto-cookie-start", "Start Auto-Clicker", startAutoClick);
  }

  // Show Auto-Clicker Speed Boost Button
  if (autoStarted && cookieCount >= thresholds.autoClick && !document.getElementById("auto-cookie-speed")) {
    createButton("auto-cookie-speed", "Speed Up Auto-Clicker", boostAutoClickSpeed);
  }

  // Show Auto-Clicker Multiplier Button
  if (cookieCount >= thresholds.autoBoost && !document.getElementById("auto-multiplier")) {
    createButton("auto-multiplier", "Boost Auto-Clicker Multiplier", boostAutoClickerMultiplier);
  }

  // Show Click Multiplier Button
  if (cookieCount >= thresholds.clickBoost && !document.getElementById("click-multiplier")) {
    createButton("click-multiplier", "Boost Click Multiplier", boostClickMultiplier);
  }
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