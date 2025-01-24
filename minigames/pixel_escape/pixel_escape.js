// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

function updateScore(points) {
  score += points;
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 30);
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      score += 10;
    }

    // Collision detection with player
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      isGameOver = true; // Trigger Game Over
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

// Draw Game Over Screen
function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

  ctx.font = "24px Arial";
  ctx.fillText(`Survived: ${survivalTime.toFixed(1)} seconds`, canvas.width / 2, canvas.height / 2);
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
  ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 80);
}


// Restart Game Function
function restartGame() {
  player = { x: 50, y: 300, width: 20, height: 20, color: "#ff4757", velocityY: 0 };
  obstacles = [];
  bullets = [];
  obstacleTimer = 0;
  isGameOver = false;
  gameSpeed = 2;
  gravity = 0.3;
  score = 0;

  startSurvivalTimer()
  gameLoop();
}

// Start the game and start the timer
startSurvivalTimer()
gameLoop();
