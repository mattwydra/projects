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

// Game loop
function gameLoop() {
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
    const obstacleType = Math.random() > 0.5 ? "destructible" : "indestructible";
    obstacles.push({
      x: canvas.width,
      y: 300,
      width: 20,
      height: 20,
      color: obstacleType === "destructible" ? "#1e90ff" : "#ff6347",
      type: obstacleType,
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
    }

    // Collision detection with player
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      document.location.reload();
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
        if (obstacle.type === "destructible") {
          // Remove bullet and obstacle
          bullets.splice(bulletIndex, 1);
          obstacles.splice(obstacleIndex, 1);
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

// Start the game
gameLoop();
