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
let gravity = 0.3; // Reduced gravity for smoother fall
let jumpStrength = -8; // Adjusted jump velocity
let isJumping = false;
let obstacles = [];
let obstacleTimer = 0;
let gameSpeed = 2;

// Jump function
function jump() {
  if (!isJumping) {
    player.velocityY = jumpStrength;
    isJumping = true;
  }
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


  requestAnimationFrame(gameLoop);
}

// Event listener for jump
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// Start the game
gameLoop();

// Theme toggle logic
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");

  if (currentTheme === "light") {
    body.setAttribute("data-theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
  }
});
