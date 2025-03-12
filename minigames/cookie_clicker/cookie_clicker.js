// Game state variables
let cookieCount = 0;
let clickMultiplier = 1; // Multiplier for manual clicks
let autoMultiplier = 1; // Multiplier for auto-clicker
let delay = 1000; // Delay for auto-clicker in milliseconds
let autoStarted = false;
let totalClicks = 0;
let totalAutoCookies = 0;
let cookiesConsumed = 0;
let cashedInCookies = 0; // New variable to track cashed in cookies
let totalCashedIn = 0; // New variable to track lifetime cashed in cookies
let cashMultiplier = 1; // New variable for cash multiplier
let startTime = null;
let achievements = [];
let gameEnded = false; // Make sure this is false initially

// Winning condition - Game ends after this many cookies
const GAME_END_THRESHOLD = 10000;

// Thresholds for power-ups
const thresholds = {
  autoClick: 50, // Auto-clicker threshold (reduced from 500 for testing)
  autoBoost: 200, // Auto-clicker multiplier boost threshold (reduced from 1000 for testing)
  clickBoost: 100, // Click multiplier boost threshold (reduced from 500 for testing)
  cashIn: 25, // Threshold for cash in feature
  achievements: {
    clickMilestone: [10, 50, 100, 500, 1000],
    cookieMilestone: [100, 500, 1000, 5000, 10000],
    cashInMilestone: [50, 200, 1000, 5000] // New milestone for cashed in cookies
  }
};

// Cost for each upgrade
const upgradeCosts = {
  clickMultiplier: 50,
  autoClickerStart: 50,
  autoClickerSpeed: 50,
  autoMultiplier: 200,
  cashMultiplier: 100 // New cost for cash multiplier
};

// Initialize game
document.addEventListener("DOMContentLoaded", function () {
  initGame();
});

function initGame() {
  // Get DOM elements
  const cookieEl = document.getElementById("cookie");
  const cookieCountEl = document.getElementById("cookie-count");
  const clickMultiplierEl = document.getElementById("click-multiplier-value");
  const autoStatusEl = document.getElementById("auto-status");
  const autoMultiplierEl = document.getElementById("auto-multiplier-value");
  const autoSpeedEl = document.getElementById("auto-speed-value");
  const powerUpsContainer = document.getElementById("power-ups-container");
  const elapsedTimeEl = document.getElementById("elapsed-time");
  const gameEndScreen = document.getElementById("game-end-screen");
  const endStats = document.getElementById("end-stats");
  const restartButton = document.getElementById("restart-game");

  // Add cash display to stats panel
  const statsPanel = document.getElementById("stats-panel");
  if (statsPanel) {
    const cashElement = document.createElement("p");
    cashElement.className = "stat";
    cashElement.innerHTML = 'Cashed In: <span id="cashed-in-value">0</span>';
    statsPanel.appendChild(cashElement);

    const cashMultiplierElement = document.createElement("p");
    cashMultiplierElement.className = "stat";
    cashMultiplierElement.innerHTML = 'Cash Multiplier: <span id="cash-multiplier-value">1</span>';
    statsPanel.appendChild(cashMultiplierElement);
  }

  // Reset game state
  cookieCount = 0;
  clickMultiplier = 1;
  autoMultiplier = 1;
  delay = 1000;
  autoStarted = false;
  totalClicks = 0;
  totalAutoCookies = 0;
  cookiesConsumed = 0;
  cashedInCookies = 0;
  totalCashedIn = 0;
  cashMultiplier = 1;
  achievements = [];
  gameEnded = false;

  // Hide the achievements container permanently
  const achievementsContainer = document.getElementById("achievements-container");
  if (achievementsContainer) {
    achievementsContainer.classList.add("hidden");
    achievementsContainer.style.display = "none";
  }

  // Ensure game end screen is hidden initially - force this with !important style
  if (gameEndScreen) {
    gameEndScreen.classList.add("hidden");
    gameEndScreen.style.display = "none";
  }

  // Start timer
  startTime = new Date();
  updateElapsedTime();

  // Add click event listener to cookie
  if (cookieEl) {
    cookieEl.addEventListener("click", handleCookieClick);
  }

  // Set up theme toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Set up restart button
  if (restartButton) {
    restartButton.addEventListener("click", restartGame);
  }

  // Start the update loop
  requestAnimationFrame(updateLoop);

  // Cookie click handler
  function handleCookieClick() {
    if (gameEnded) return;

    totalClicks++;
    cookieCount += clickMultiplier;
    updateDisplay();

    // Add cookie click animation
    animateCookieClick();

    // Check for click-based achievements
    checkAchievements();
  }

  // Animate cookie when clicked
  function animateCookieClick() {
    if (!cookieEl) return;

    cookieEl.classList.add("clicked");
    setTimeout(() => {
      cookieEl.classList.remove("clicked");
    }, 100);

    // Create floating number animation
    const floatingText = document.createElement("div");
    floatingText.classList.add("floating-text");
    floatingText.textContent = `+${clickMultiplier}`;

    // Position near the cookie
    const cookieRect = cookieEl.getBoundingClientRect();
    const randomOffset = Math.random() * 40 - 20;
    floatingText.style.left = `${cookieRect.left + cookieRect.width / 2 + randomOffset}px`;
    floatingText.style.top = `${cookieRect.top}px`;

    document.body.appendChild(floatingText);

    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, 1000);
  }

  // New Cash In feature
  window.cashInCookies = function () {
    if (cookieCount < thresholds.cashIn) return;

    // Calculate cash earned based on cookies and multiplier
    const cashEarned = Math.floor(cookieCount * cashMultiplier / 10);

    // Update cash stats
    cashedInCookies += cashEarned;
    totalCashedIn += cashEarned;

    // Reset cookie count after cashing in
    cookieCount = 0;

    // Update display
    updateDisplay();

    // Create floating text animation for cash in
    const floatingText = document.createElement("div");
    floatingText.classList.add("floating-text");
    floatingText.style.color = "#00FF00"; // Green color for cash
    floatingText.textContent = `+${cashEarned} cashed in!`;

    // Position in the center
    floatingText.style.left = "50%";
    floatingText.style.top = "50%";
    floatingText.style.transform = "translate(-50%, -50%)";

    document.body.appendChild(floatingText);

    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, 1500);

    // Check for cash achievements
    checkCashAchievements();

    // Update power-up buttons
    updatePowerUpButtons();
  };

  // Boost Cash Multiplier
  window.boostCashMultiplier = function () {
    if (cashedInCookies < upgradeCosts.cashMultiplier) return;

    cashedInCookies -= upgradeCosts.cashMultiplier;
    cashMultiplier++;

    // Increase cost for next upgrade
    upgradeCosts.cashMultiplier = Math.floor(upgradeCosts.cashMultiplier * 1.7);

    // Update display
    const cashMultiplierEl = document.getElementById("cash-multiplier-value");
    if (cashMultiplierEl) {
      cashMultiplierEl.textContent = cashMultiplier;
    }

    updateDisplay();
    updatePowerUpButtons();

    // Add achievement if multiplier is high
    if (cashMultiplier >= 3) {
      addAchievement("Cash Master", "Cash multiplier reached 3x");
    }
  };

  // Start Auto-Clicker
  window.startAutoClick = function () {
    if (cookieCount < upgradeCosts.autoClickerStart) return;

    cookieCount -= upgradeCosts.autoClickerStart;
    cookiesConsumed += upgradeCosts.autoClickerStart;
    autoStarted = true;
    if (autoStatusEl) {
      autoStatusEl.textContent = "Active";
    }
    updateDisplay();

    // Add achievement
    addAchievement("Auto Pilot", "Started the auto-clicker");

    // Remove the start button and create speed boost button
    updatePowerUpButtons();
  };

  // Auto-Clicker Logic - now part of main game loop
  function processAutoClicker(deltaTime) {
    if (!autoStarted || gameEnded) return;

    // Calculate cookies to add based on time passed
    const cookiesToAdd = (autoMultiplier * deltaTime) / delay;
    cookieCount += cookiesToAdd;
    totalAutoCookies += cookiesToAdd;

    updateDisplay();
  }

  // Boost Auto-Clicker Speed
  window.boostAutoClickSpeed = function () {
    if (cookieCount < upgradeCosts.autoClickerSpeed) return;

    cookieCount -= upgradeCosts.autoClickerSpeed;
    cookiesConsumed += upgradeCosts.autoClickerSpeed;

    if (delay > 100) {
      delay -= 100; // Decrease delay by 100ms
    } else {
      delay /= 2; // Halve delay if <= 100ms
    }

    // Increase cost for next upgrade
    upgradeCosts.autoClickerSpeed = Math.floor(upgradeCosts.autoClickerSpeed * 1.5);

    // Update speed display
    if (autoSpeedEl) {
      autoSpeedEl.textContent = (delay / 1000).toFixed(1);
    }

    updateDisplay();
    updatePowerUpButtons();

    // Add achievement if speed is very fast
    if (delay <= 100) {
      addAchievement("Speed Demon", "Auto-clicker is super fast!");
    }
  };

  // Boost Auto-Clicker Multiplier
  window.boostAutoClickerMultiplier = function () {
    if (cookieCount < upgradeCosts.autoMultiplier) return;

    cookieCount -= upgradeCosts.autoMultiplier;
    cookiesConsumed += upgradeCosts.autoMultiplier;
    autoMultiplier++;

    // Increase cost for next upgrade
    upgradeCosts.autoMultiplier = Math.floor(upgradeCosts.autoMultiplier * 1.8);

    // Update display
    if (autoMultiplierEl) {
      autoMultiplierEl.textContent = autoMultiplier;
    }

    updateDisplay();
    updatePowerUpButtons();

    // Add achievement if multiplier is high
    if (autoMultiplier >= 5) {
      addAchievement("Cookie Factory", "Auto-clicker multiplier reached 5x");
    }
  };

  // Boost Click Multiplier
  window.boostClickMultiplier = function () {
    if (cookieCount < upgradeCosts.clickMultiplier) return;

    cookieCount -= upgradeCosts.clickMultiplier;
    cookiesConsumed += upgradeCosts.clickMultiplier;
    clickMultiplier++;

    // Increase cost for next upgrade
    upgradeCosts.clickMultiplier = Math.floor(upgradeCosts.clickMultiplier * 1.5);

    // Update display
    if (clickMultiplierEl) {
      clickMultiplierEl.textContent = clickMultiplier;
    }

    updateDisplay();
    updatePowerUpButtons();

    // Add achievement if multiplier is high
    if (clickMultiplier >= 5) {
      addAchievement("Cookie Master", "Click multiplier reached 5x");
    }
  };

  // Create Button with tooltips
  function createButton(id, text, onClick, cost, currency = "cookies") {
    // Check if button already exists
    if (document.getElementById(id) || !powerUpsContainer) return;

    const button = document.createElement("button");
    button.id = id;
    button.className = "power-up-button";
    button.innerHTML = `${text}<span class="cost">${cost} ${currency}</span>`;
    button.addEventListener("click", onClick);

    // Add tooltip
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";

    switch (id) {
      case "auto-cookie-start":
        tooltip.textContent = "Automatically generates cookies over time";
        break;
      case "auto-cookie-speed":
        tooltip.textContent = "Makes the auto-clicker generate cookies faster";
        break;
      case "auto-multiplier":
        tooltip.textContent = "Increases the number of cookies generated per auto-click";
        break;
      case "click-multiplier":
        tooltip.textContent = "Increases the number of cookies you get per click";
        break;
      case "cash-in-cookies":
        tooltip.textContent = "Convert cookies to cash at a ratio of 10:1";
        break;
      case "cash-multiplier":
        tooltip.textContent = "Increases the amount of cash earned when cashing in cookies";
        break;
    }

    button.appendChild(tooltip);
    powerUpsContainer.appendChild(button);

    // Add appear animation
    button.classList.add("appear");
  }

  // Update all power-up buttons based on current state
  function updatePowerUpButtons() {
    // Clear existing buttons
    if (!powerUpsContainer) return;
    powerUpsContainer.innerHTML = "";

    // Cash in button - always available if above threshold
    if (cookieCount >= thresholds.cashIn) {
      createButton(
        "cash-in-cookies",
        "Cash In Cookies",
        window.cashInCookies,
        Math.floor(cookieCount * cashMultiplier / 10),
        "cash"
      );
    }

    // Cash multiplier button
    if (cashedInCookies >= upgradeCosts.cashMultiplier) {
      createButton(
        "cash-multiplier",
        "Boost Cash Multiplier",
        window.boostCashMultiplier,
        upgradeCosts.cashMultiplier,
        "cash"
      );
    }

    // Auto-clicker start button
    if (!autoStarted && cookieCount >= thresholds.autoClick) {
      createButton(
        "auto-cookie-start",
        "Start Auto-Clicker",
        window.startAutoClick,
        upgradeCosts.autoClickerStart
      );
    }

    // Auto-clicker speed boost button
    if (autoStarted) {
      createButton(
        "auto-cookie-speed",
        "Speed Up Auto-Clicker",
        window.boostAutoClickSpeed,
        upgradeCosts.autoClickerSpeed
      );
    }

    // Auto-clicker multiplier button
    if (cookieCount >= thresholds.autoBoost) {
      createButton(
        "auto-multiplier",
        "Boost Auto-Clicker Multiplier",
        window.boostAutoClickerMultiplier,
        upgradeCosts.autoMultiplier
      );
    }

    // Click multiplier button
    if (cookieCount >= thresholds.clickBoost) {
      createButton(
        "click-multiplier",
        "Boost Click Multiplier",
        window.boostClickMultiplier,
        upgradeCosts.clickMultiplier
      );
    }
  }

  // Add new achievement
  function addAchievement(title, description) {
    // Check if achievement already exists
    if (achievements.some(a => a.title === title)) return;

    // Add to achievements array
    achievements.push({ title, description, time: new Date() });

    // Show achievement notification - no longer adding to list
    showAchievementNotification(title);
  }

  // Show achievement notification
  function showAchievementNotification(title) {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <span class="achievement-icon">🏆</span>
      <span>Achievement Unlocked: ${title}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Remove after animation
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }

  // Check for achievements
  function checkAchievements() {
    // Click milestones
    thresholds.achievements.clickMilestone.forEach(milestone => {
      if (totalClicks >= milestone) {
        addAchievement(`${milestone} Clicks`, `Clicked the cookie ${milestone} times`);
      }
    });

    // Cookie count milestones
    thresholds.achievements.cookieMilestone.forEach(milestone => {
      if (cookieCount >= milestone) {
        addAchievement(`${milestone} Cookies`, `Collected ${milestone} cookies in total`);
      }
    });
  }

  // Check for cash achievements
  function checkCashAchievements() {
    // Cash milestones
    thresholds.achievements.cashInMilestone.forEach(milestone => {
      if (totalCashedIn >= milestone) {
        addAchievement(`${milestone} Cash`, `Cashed in ${milestone} total cash`);
      }
    });
  }

  // Update elapsed time
  function updateElapsedTime() {
    if (!startTime || !elapsedTimeEl) return;

    const now = new Date();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    elapsedTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Main game loop
  let lastTimestamp = 0;
  function updateLoop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;

    // Calculate time since last frame
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // Process auto-clicker
    if (autoStarted) {
      processAutoClicker(deltaTime);
    }

    // Update elapsed time every second
    if (Math.floor(timestamp / 1000) > Math.floor(lastTimestamp / 1000)) {
      updateElapsedTime();
    }

    // Update power-up buttons
    updatePowerUpButtons();

    // Check for game end - only if NOT already ended
    if (!gameEnded && cookieCount >= GAME_END_THRESHOLD) {
      endGame();
    }

    // Continue the loop
    requestAnimationFrame(updateLoop);
  }

  // Update display
  function updateDisplay() {
    if (cookieCountEl) cookieCountEl.textContent = Math.floor(cookieCount);
    if (clickMultiplierEl) clickMultiplierEl.textContent = clickMultiplier;
    if (autoMultiplierEl) autoMultiplierEl.textContent = autoMultiplier;
    if (autoStatusEl) autoStatusEl.textContent = autoStarted ? "Active" : "Inactive";
    if (autoSpeedEl) autoSpeedEl.textContent = (delay / 1000).toFixed(1);

    // Update cash display
    const cashedInEl = document.getElementById("cashed-in-value");
    if (cashedInEl) cashedInEl.textContent = Math.floor(cashedInCookies);

    const cashMultiplierEl = document.getElementById("cash-multiplier-value");
    if (cashMultiplierEl) cashMultiplierEl.textContent = cashMultiplier;
  }

  // Toggle dark/light theme
  function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme");

    if (currentTheme === "light") {
      body.setAttribute("data-theme", "dark");
    } else {
      body.setAttribute("data-theme", "light");
    }
  }

  // End game
  function endGame() {
    gameEnded = true;

    // Calculate final stats
    const now = new Date();
    const totalTimeMs = now - startTime;
    const totalTimeSeconds = Math.floor(totalTimeMs / 1000);
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;

    // Show end game screen
    if (gameEndScreen) {
      gameEndScreen.classList.remove("hidden");
      gameEndScreen.style.display = "flex";
    }

    // Display end game stats
    if (endStats) {
      endStats.innerHTML = `
        <p>Total Time: ${minutes}m ${seconds}s</p>
        <p>Total Clicks: ${totalClicks}</p>
        <p>Total Manual Cookies: ${Math.floor(totalClicks * clickMultiplier)}</p>
        <p>Total Auto Cookies: ${Math.floor(totalAutoCookies)}</p>
        <p>Cookies Consumed: ${cookiesConsumed}</p>
        <p>Total Cash: ${Math.floor(totalCashedIn)}</p>
        <p>Final Cookie Count: ${Math.floor(cookieCount)}</p>
        <p>Achievements Unlocked: ${achievements.length}</p>
      `;
    }

    // Add final achievement
    addAchievement("Game Complete!", `Reached ${GAME_END_THRESHOLD} cookies`);
  }

  // Restart game
  function restartGame() {
    // Reset all game state variables
    cookieCount = 0;
    clickMultiplier = 1;
    autoMultiplier = 1;
    delay = 1000;
    autoStarted = false;
    totalClicks = 0;
    totalAutoCookies = 0;
    cookiesConsumed = 0;
    cashedInCookies = 0;
    totalCashedIn = 0;
    cashMultiplier = 1;
    achievements = [];
    gameEnded = false;

    // Reset costs
    upgradeCosts.clickMultiplier = 50;
    upgradeCosts.autoClickerStart = 50;
    upgradeCosts.autoClickerSpeed = 50;
    upgradeCosts.autoMultiplier = 200;
    upgradeCosts.cashMultiplier = 100;

    // Reset UI
    if (powerUpsContainer) powerUpsContainer.innerHTML = "";

    // Hide the game end screen
    if (gameEndScreen) {
      gameEndScreen.classList.add("hidden");
      gameEndScreen.style.display = "none";
    }

    // Reset start time
    startTime = new Date();

    // Update display
    updateDisplay();
  }

  // Make sure window.restartGame references our function
  window.restartGame = restartGame;

  // Initialize display
  updateDisplay();
}