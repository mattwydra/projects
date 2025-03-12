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

// Show the main menu
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
        }),
        drawButton("Challenge", canvas.width / 2, canvas.height / 2 + 60, () => {
            gameMode = "challenge";
            startChallengeGame();
        }),
        drawButton("3 Lives Mode", canvas.width / 2, canvas.height / 2 + 140, () => {
            gameMode = "3lives";
            startLivesMode();
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
let powerups = [];
let obstacleTimer = 0;
let powerupTimer = 0;
let gameSpeed = 2;
let defaultGameSpeed = 2;

let score = 0;
let challengeTargets = 10; // Number of targets to destroy in Challenge mode
let lives = 3;  // Player starts with 3 lives

// Active powerups tracking
let activePowerup = null;
let powerupTimeRemaining = 0;
let powerupDuration = 10; // 10 seconds for all powerups

function updateScore(points) {
    score += points;
}

// Draw score, lives, and active powerup
function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameMode === "challenge") {
        ctx.fillText(`Targets Left: ${challengeTargets}`, 10, 60);
    }

    if (gameMode === "3lives" || gameMode === "normal") {
        ctx.fillText(`Time: ${survivalTime.toFixed(1)}s`, canvas.width - 150, 30);
    }

    if (gameMode === "3lives") {
        ctx.fillText(`Lives: ${lives}`, canvas.width - 150, 60);
    }

    // Display active powerup and time remaining
    if (activePowerup) {
        let powerupName;
        switch (activePowerup) {
            case "bonusLife": powerupName = "Extra Life"; break;
            case "piercing": powerupName = "Piercing Shot"; break;
            case "birdshot": powerupName = "Birdshot"; break;
            case "shield": powerupName = "Shield"; break;
            case "slowTime": powerupName = "Slow Time"; break;
        }
        ctx.fillText(`Powerup: ${powerupName} (${powerupTimeRemaining.toFixed(1)}s)`, 10, canvas.height - 10);
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
    if (activePowerup === "birdshot") {
        // Create 3 bullets in a spread pattern
        for (let i = -1; i <= 1; i++) {
            bullets.push({
                x: player.x + player.width,
                y: player.y + player.height / 2 - 2,
                width: 10,
                height: 4,
                color: "#00BFFF", // Blue for birdshot
                speed: 6,
                angle: i * 15, // -15, 0, and 15 degrees
                piercing: activePowerup === "piercing"
            });
        }
    } else {
        bullets.push({
            x: player.x + player.width,
            y: player.y + player.height / 2 - 2,
            width: 10,
            height: 4,
            color: activePowerup === "piercing" ? "#FFD700" : "#ffdd57", // Gold for piercing
            speed: 6,
            angle: 0,
            piercing: activePowerup === "piercing"
        });
    }
}

// Add a survival time tracker
let survivalTime = 0;
let survivalInterval;

// Start Survival Timer Function
function startSurvivalTimer() {
    survivalTime = 0; // Reset survival time
    clearInterval(survivalInterval); // Clear any existing interval
    survivalInterval = setInterval(() => {
        survivalTime += 0.1; // Increment survival time

        // Decrement powerup time if active
        if (activePowerup && powerupTimeRemaining > 0) {
            powerupTimeRemaining -= 0.1;
            if (powerupTimeRemaining <= 0) {
                deactivatePowerup();
            }
        }
    }, 100); // Update every 0.1 second
}

// Game loop
function gameLoop() {
    if (isGameOver) {
        drawGameOver();
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

    // Add shield visual if shield powerup is active
    if (activePowerup === "shield") {
        ctx.strokeStyle = "#32CD32"; // Green outline
        ctx.lineWidth = 3;
        ctx.strokeRect(player.x - 2, player.y - 2, player.width + 4, player.height + 4);
    }

    // Obstacle spawning logic
    obstacleTimer++;
    if (obstacleTimer > 90) {
        spawnObstacle();
        obstacleTimer = 0;
    }

    // Powerup spawning logic
    powerupTimer++;
    if (powerupTimer > 300) { // Every ~5 seconds
        if (Math.random() < 0.3) { // 30% chance to spawn a powerup
            spawnPowerup();
        }
        powerupTimer = 0;
    }

    // Update and draw obstacles
    updateObstacles();

    // Update and draw powerups
    updatePowerups();

    // Bullet logic
    updateBullets();

    requestAnimationFrame(gameLoop);
}

// Spawn a new obstacle
function spawnObstacle() {
    const isDestructible = Math.random() > 0.5;
    const isCantHit = gameMode === "challenge" ? false : Math.random() > 0.8; // 20% chance except in challenge mode
    const isFlying = Math.random() > 0.5;
    const yPos = isFlying ? 200 + Math.random() * 50 : 300;

    obstacles.push({
        x: canvas.width,
        y: yPos,
        width: 20 + Math.random() * 10, // Variable width
        height: 20 + Math.random() * 10, // Variable height
        color: isCantHit ? "#ff0000" : isDestructible ? "#1e90ff" : "#ff6347",
        isDestructible: isDestructible && !isCantHit,
        isCantHit: isCantHit,
        isFlying: isFlying,
    });
}

// Spawn a new powerup
function spawnPowerup() {
    const rand = Math.random();
    let type;

    if (gameMode === "3lives" && rand < 0.2) {
        type = "bonusLife";
    } else if (rand < 0.4) {
        type = "piercing";
    } else if (rand < 0.6) {
        type = "birdshot";
    } else if (rand < 0.8) {
        type = "shield";
    } else {
        type = "slowTime";
    }

    const isFlying = Math.random() > 0.3;
    const yPos = isFlying ? 150 + Math.random() * 100 : 300;

    let color;
    switch (type) {
        case "bonusLife": color = "#32CD32"; break; // Green
        case "piercing": color = "#FFD700"; break; // Gold
        case "birdshot": color = "#00BFFF"; break; // Blue
        case "shield": color = "#9932CC"; break; // Purple
        case "slowTime": color = "#FF69B4"; break; // Pink
    }

    powerups.push({
        x: canvas.width,
        y: yPos,
        width: 15,
        height: 15,
        color: color,
        type: type
    });
}

// Activate a powerup
function activatePowerup(type) {
    // Bonus life is immediate, not a duration powerup
    if (type === "bonusLife") {
        if (gameMode === "3lives") {
            lives++;
        } else {
            score += 50; // Give extra points instead in other modes
        }
        return;
    }

    // For slow time, modify the game speed
    if (type === "slowTime") {
        gameSpeed = defaultGameSpeed / 2;
    }

    activePowerup = type;
    powerupTimeRemaining = powerupDuration;
}

// Deactivate current powerup
function deactivatePowerup() {
    if (activePowerup === "slowTime") {
        gameSpeed = defaultGameSpeed;
    }
    activePowerup = null;
    powerupTimeRemaining = 0;
}

// Update and draw obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= gameSpeed;

        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Remove obstacles that go off-screen
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            continue;
        }

        // Collision detection with player
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            // Handle collision based on obstacle type and game mode
            if (obstacle.isCantHit) {
                if (activePowerup === "shield") {
                    // Shield protects against can't-hit obstacles
                    obstacles.splice(i, 1);
                    deactivatePowerup(); // Use up the shield
                } else {
                    isGameOver = true; // Game over on collision with can't-hit obstacle
                }
            } else if (gameMode === "3lives" && lives > 1) {
                obstacles.splice(i, 1);
                lives--;
            } else if (activePowerup === "shield") {
                obstacles.splice(i, 1);
                deactivatePowerup(); // Use up the shield
            } else {
                isGameOver = true;
            }
        }
    }
}

// Update and draw powerups
function updatePowerups() {
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        powerup.x -= gameSpeed;

        ctx.fillStyle = powerup.color;
        ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);

        // Draw a "P" on the powerup for better visibility
        ctx.fillStyle = "#FFF";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("P", powerup.x + powerup.width / 2, powerup.y + powerup.height / 2 + 4);

        // Remove powerups that go off-screen
        if (powerup.x + powerup.width < 0) {
            powerups.splice(i, 1);
            continue;
        }

        // Collision detection with player
        if (
            player.x < powerup.x + powerup.width &&
            player.x + player.width > powerup.x &&
            player.y < powerup.y + powerup.height &&
            player.y + player.height > powerup.y
        ) {
            // Activate the powerup
            activatePowerup(powerup.type);
            powerups.splice(i, 1);
        }
    }
}

// Update and draw bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        // Calculate x and y movement based on angle
        const radians = bullet.angle * Math.PI / 180;
        bullet.x += bullet.speed * Math.cos(radians);
        bullet.y += bullet.speed * Math.sin(radians);

        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Check collision with obstacles
        let hitObstacle = false;

        for (let j = obstacles.length - 1; j >= 0; j--) {
            const obstacle = obstacles[j];

            if (
                bullet.x < obstacle.x + obstacle.width &&
                bullet.x + bullet.width > obstacle.x &&
                bullet.y < obstacle.y + obstacle.height &&
                bullet.y + bullet.height > obstacle.y
            ) {
                if (obstacle.isCantHit) {
                    isGameOver = true; // Game over when a bullet hits a can't hit obstacle
                } else if (obstacle.isDestructible) {
                    // Remove obstacle
                    obstacles.splice(j, 1);
                    score += 20;

                    if (gameMode === "challenge") {
                        challengeTargets--;
                        if (challengeTargets <= 0) {
                            isGameOver = true; // End game when all targets are destroyed
                        }
                    }
                }

                // Only remove the bullet if it's not piercing or if it hit a can't-hit obstacle
                if (!bullet.piercing || obstacle.isCantHit) {
                    hitObstacle = true;
                    break;
                }
            }
        }

        // Remove the bullet if it hit an obstacle (and isn't piercing) or went off-screen
        if (hitObstacle || bullet.x > canvas.width || bullet.x < 0 || bullet.y > canvas.height || bullet.y < 0) {
            bullets.splice(i, 1);
        }
    }
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

    if (gameMode === "normal" || gameMode === "3lives") {
        ctx.font = "24px Arial";
        ctx.fillText(`Survived: ${survivalTime.toFixed(1)} seconds`, canvas.width / 2, canvas.height / 2);
    } else if (gameMode === "challenge") {
        ctx.font = "24px Arial";
        ctx.fillText(`Targets Destroyed: ${10 - challengeTargets}`, canvas.width / 2, canvas.height / 2);
    }

    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 80);

    // Stop all timers
    clearInterval(survivalInterval);
}

window.addEventListener("keydown", (e) => {
    if (e.code === "KeyR" && isGameOver) {
        restartGame();
    }
});

// Restart Game
function restartGame() {
    // Reset all game variables
    player = { x: 50, y: 300, width: 20, height: 20, color: "#ff4757", velocityY: 0 };
    obstacles = [];
    bullets = [];
    powerups = [];
    obstacleTimer = 0;
    powerupTimer = 0;
    isGameOver = false;
    gameSpeed = defaultGameSpeed;
    gravity = 0.3;
    score = 0;
    activePowerup = null;
    powerupTimeRemaining = 0;

    // Clear any existing intervals
    clearInterval(survivalInterval);

    if (!gameMode) {
        showMenu();
    } else if (gameMode === "normal") {
        startNormalGame();
    } else if (gameMode === "challenge") {
        startChallengeGame();
    } else if (gameMode === "3lives") {
        startLivesMode();
    }
}

// Start Normal Mode
function startNormalGame() {
    defaultGameSpeed = 2;
    gameSpeed = defaultGameSpeed;
    score = 0;
    lives = 1;
    startSurvivalTimer();
    gameLoop();
}

// Start Challenge Mode
function startChallengeGame() {
    defaultGameSpeed = 3;
    gameSpeed = defaultGameSpeed;
    score = 0;
    challengeTargets = 10;
    survivalTime = 0;
    clearInterval(survivalInterval);
    gameLoop();
}

// Start Lives Mode
function startLivesMode() {
    defaultGameSpeed = 4;
    gameSpeed = defaultGameSpeed;
    lives = 3;
    score = 0;
    startSurvivalTimer();
    gameLoop();
}

// Set up theme toggle
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const body = document.body;
        if (body.getAttribute("data-theme") === "dark") {
            body.setAttribute("data-theme", "light");
        } else {
            body.setAttribute("data-theme", "dark");
        }
    });
}

// Start with the menu
showMenu();