// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameMode = null; // Tracks the gamemode


// Draw a button on the menu
function drawButton(text, x, y, callback) {
  const buttonWidth = 200;
  const buttonHeight = 50;
  const buttonX = x - buttonWidth / 2;
  const buttonY = y - buttonHeight / 2;

  // Draw button rectangle
  ctx.fillStyle = "#333";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  // Draw button text
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y + 7);

  // Store button dimensions for click detection
  return { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight, callback };
}

// Debug
// canvas.addEventListener("click", (event) => {
//   const rect = canvas.getBoundingClientRect();
//   const mouseX = event.clientX - rect.left;
//   const mouseY = event.clientY - rect.top;
//   console.log(`Mouse clicked at: ${mouseX}, ${mouseY}`);
// });


// Rename 'Survival' mode to 'Normal' and add '3 Lives Mode'
function showMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Select Game Mode", canvas.width / 2, canvas.height / 3);

  const buttons = [
    drawButton("Normal", canvas.width / 2, canvas.height / 2 - 20, () => {
      gameMode = "normal";
      startNormalGame();
      gameLoop();
    }),
    drawButton("Challenge", canvas.width / 2, canvas.height / 2 + 60, () => {
      gameMode = "challenge";
      gameLoop();
    }),
    drawButton("3 Lives Mode", canvas.width / 2, canvas.height / 2 + 140, () => {
      gameMode = "3lives";
      startLivesMode();
      gameLoop();
    }),
  ];

  // Add a single click event listener
  canvas.addEventListener("click", function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if any button was clicked
    buttons.forEach((button) => {
      if (
        mouseX > button.x &&
        mouseX < button.x + button.width &&
        mouseY > button.y &&
        mouseY < button.y + button.height
      ) {
        canvas.removeEventListener("click", handleClick); // Remove listener to avoid duplicate calls
        button.callback(); // Trigger the callback
      }
    });
  });
}


// Game variables
let player = {
  x: 50,
  y: 300,
  width: 20,
  height: 20,
  color: "#ff4757",
  velocityY: 0,
};
let gravity = 0.3;
let jumpStrength = -8;
let isJumping = false;
let obstacles = [];
let bullets = [];
let obstacleTimer = 0;
let gameSpeed = 2;

let score = 0;
let challengeTargets = 10; // Number of targets to destroy in Challenge mode
let lives = 3;  // Player starts with 3 lives

function updateScore(points) {
  score += points;
}

// Draw score and lives
function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 30);

  if (gameMode === "challenge") {
    ctx.fillText(`Targets Left: ${challengeTargets}`, 10, 60);
  }

  if (gameMode === "3lives") {
    ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30);
  }
}

let isGameOver = false;

// Jump function
function jump() {
  if (!isJumping) {
    player.velocityY = jumpStrength;
    isJumping = true;
  }
}

// Shoot function
function shoot() {
  bullets.push({
    x: player.x + player.width,
    y: player.y + player.height / 2 - 2, // Centered on the player
    width: 10,
    height: 4,
    color: "#ffdd57",
    speed: 6,
  });
}

// Add a survival time tracker
let survivalTime = 0;
let survivalInterval;

// Start Survival Timer Function
function startSurvivalTimer() {
  survivalTime = 0; // Reset survival time
  survivalInterval = setInterval(() => {
    survivalTime += 0.1; // Increment survival time
  }, 100); // Update every 0.1 second
}

// Game loop
function gameLoop() {
  if (isGameOver) {
    drawGameOver();
    clearInterval(survivalInterval); // Stop tracking survival time
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw score
  drawScore();

  // Player logic
  player.velocityY += gravity;
  player.y += player.velocityY;

  if (player.y >= 300) {
    player.y = 300;
    isJumping = false;
  }

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Obstacle logic
  obstacleTimer++;
  if (obstacleTimer > 90) {
    const isDestructible = Math.random() > 0.5 ? true : false;
    const isFlying = Math.random() > 0.5 ? true : false;
    const yPos = isFlying === true ? 200 : 300;
    obstacles.push({
      x: canvas.width,
      y: yPos,
      width: 20,
      height: 20,
      color: isDestructible === true ? "#1e90ff" : "#ff6347",
      isDestructible: isDestructible,
      isFlying: isFlying,
    });
    obstacleTimer = 0;
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed;

    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Remove obstacles that go off-screen
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      if (gameMode === "survival") score += 10;
    }

    // Collision detection with player
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      if (gameMode === "3lives" && lives > 1) {
        obstacles.splice(index, 1);
        lives--;
      } else { lives--; isGameOver = true; } // Trigger Game Over
    }
  });

  // Event listeners
  window.addEventListener("keydown", (e) => {
    if (!isGameOver) {
      if (e.code === "Space") {
        jump();
      } else if (e.code === "KeyF") {
        shoot();
      }
    } else if (e.code === "KeyR") {
      restartGame();
    }
  });

  // Bullet logic
  bullets.forEach((bullet, bulletIndex) => {
    bullet.x += bullet.speed;

    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    // Check collision with obstacles
    obstacles.forEach((obstacle, obstacleIndex) => {
      if (
        bullet.x < obstacle.x + obstacle.width &&
        bullet.x + bullet.width > obstacle.x &&
        bullet.y < obstacle.y + obstacle.height &&
        bullet.y + bullet.height > obstacle.y
      ) {
        if (obstacle.isDestructible === true) {
          // Remove bullet and obstacle
          bullets.splice(bulletIndex, 1);
          obstacles.splice(obstacleIndex, 1);
          score += 20;
          if (gameMode === "challenge") {
            challengeTargets--;
            if (challengeTargets <= 0) {
              isGameOver = true; // End game when all targets are destroyed
              challengeTargets = 10;
            }
          }
        } else {
          // Remove the bullet
          bullets.splice(bulletIndex, 1);
        }
      }
    });

    // Remove bullets that go off-screen
    if (bullet.x > canvas.width) {
      bullets.splice(bulletIndex, 1);
    }
  });

  requestAnimationFrame(gameLoop);
}

// Event listeners
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  } else if (e.code === "KeyF") {
    shoot();
  }
});

// Game Over screen
function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

  if (gameMode === "normal") {
    ctx.font = "24px Arial";
    ctx.fillText(`Survived: ${survivalTime.toFixed(1)} seconds`, canvas.width / 2, canvas.height / 2);
  } else if (gameMode === "challenge") {
    ctx.font = "24px Arial";
    ctx.fillText(`Targets Destroyed: ${10 - challengeTargets}`, canvas.width / 2, canvas.height / 2);
  } else if (gameMode === "3lives") {
    ctx.font = "24px Arial";
    // ctx.fillText(`Lives Remaining: ${lives}`, canvas.width / 2, canvas.height / 2);
  }

  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
  ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 80);
}

// Restart Game
function restartGame() {
  player = { x: 50, y: 300, width: 20, height: 20, color: "#ff4757", velocityY: 0 };
  obstacles = [];
  bullets = [];
  obstacleTimer = 0;
  isGameOver = false;
  gameSpeed = 2;
  gravity = 0.3;
  score = 0;
  lives = 3;  // Reset lives

  if (!gameMode) {
    showMenu();
  } else if (gameMode === "normal" || gameMode === "3lives") {
    startLivesMode();
    gameLoop();
  } else {
    gameLoop();
  }
}

// Start Lives Mode
function startLivesMode() {
  lives = 3;  // Reset lives
  score = 0;
  gameLoop();
}

// Start Normal Mode (if needed)
function startNormalGame() {
  survivalTime = 0;
  survivalInterval = setInterval(() => {
    survivalTime += 0.1;  // Increment survival time
  }, 100); // Update every 0.1 second
}

// Start with the menu
showMenu();
