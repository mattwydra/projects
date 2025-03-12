import { Player } from './modules/player.js';
import { createObstacle, drawObstacle, updateObstacle } from './modules/obstacle.js';
import { spawnPowerup, drawPowerup, updatePowerup, activatePowerup, deactivatePowerup } from './modules/powerup.js';
import { getRandomInt, isCollision, drawText, createButton, isPointInRect } from './modules/utils.js';

// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.getElementById("home-btn").hidden = false;

// Game state variables
const gameState = {
    gameMode: null,
    isGameOver: false,
    score: 0,
    survivalTime: 0,
    survivalInterval: null,
    obstacleTimer: 0,
    powerupTimer: 0,
    gameSpeed: 2,
    defaultGameSpeed: 2,
    challengeTargets: 10,
    lives: 3,
    activePowerup: null,
    powerupTimeRemaining: 0,
    powerupDuration: 10
};

// Game objects
let player = new Player();
let obstacles = [];
let bullets = [];
let powerups = [];
let menuButtons = [];

// Event listeners
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        player.jump();
    } else if (e.code === "KeyF") {
        const newBullets = player.shoot(gameState.activePowerup);
        bullets = [...bullets, ...newBullets];
    } else if (e.code === "KeyR" && gameState.isGameOver) {
        restartGame();
    }
});

// Show the main menu
function showMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawText(ctx, "Select Game Mode", canvas.width / 2, canvas.height / 3, "#fff", "36px Arial", "center");

    menuButtons = [
        {
            ...createButton(ctx, "Normal", canvas.width / 2, canvas.height / 2 - 20),
            callback: () => {
                gameState.gameMode = "normal";
                startNormalGame();
            }
        },
        {
            ...createButton(ctx, "Challenge", canvas.width / 2, canvas.height / 2 + 60),
            callback: () => {
                gameState.gameMode = "challenge";
                startChallengeGame();
            }
        },
        {
            ...createButton(ctx, "3 Lives Mode", canvas.width / 2, canvas.height / 2 + 140),
            callback: () => {
                gameState.gameMode = "3lives";
                startLivesMode();
            }
        }
    ];

    // Handle menu clicks
    canvas.addEventListener("click", handleMenuClick);
}

// Handle menu click events
function handleMenuClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if any button was clicked
    menuButtons.forEach((button) => {
        if (isPointInRect(mouseX, mouseY, button)) {
            canvas.removeEventListener("click", handleMenuClick); // Remove listener to avoid duplicate calls
            button.callback(); // Trigger the callback
        }
    });
}

// Start survival timer
function startSurvivalTimer() {
    gameState.survivalTime = 0;
    clearInterval(gameState.survivalInterval);
    
    gameState.survivalInterval = setInterval(() => {
        gameState.survivalTime += 0.1;

        // Handle powerup duration
        if (gameState.activePowerup && gameState.powerupTimeRemaining > 0) {
            gameState.powerupTimeRemaining -= 0.1;
            if (gameState.powerupTimeRemaining <= 0) {
                deactivatePowerup(gameState.activePowerup, player, gameState);
                gameState.activePowerup = null;
                gameState.powerupTimeRemaining = 0;
            }
        }
    }, 100);
}

// Game loop
function gameLoop() {
    if (gameState.isGameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw score and game info
    drawGameInfo();

    // Update and draw player
    player.update();
    player.draw(ctx);

    // Obstacle spawning logic
    gameState.obstacleTimer++;
    if (gameState.obstacleTimer > 90) {
        obstacles.push(createObstacle(canvas.width, gameState.gameSpeed));
        gameState.obstacleTimer = 0;
    }

    // Powerup spawning logic
    gameState.powerupTimer++;
    if (gameState.powerupTimer > 300) { // Every ~5 seconds
        if (Math.random() < 0.3) { // 30% chance to spawn a powerup
            powerups.push(spawnPowerup(canvas, gameState.gameMode));
        }
        gameState.powerupTimer = 0;
    }

    // Update and draw obstacles
    updateObstacles();

    // Update and draw powerups
    updatePowerups();

    // Update and draw bullets
    updateBullets();

    requestAnimationFrame(gameLoop);
}

// Draw score and game information
function drawGameInfo() {
    drawText(ctx, `Score: ${gameState.score}`, 10, 30);

    if (gameState.gameMode === "challenge") {
        drawText(ctx, `Targets Left: ${gameState.challengeTargets}`, 10, 60);
    }

    if (gameState.gameMode === "3lives" || gameState.gameMode === "normal") {
        drawText(ctx, `Time: ${gameState.survivalTime.toFixed(1)}s`, canvas.width - 150, 30);
    }

    if (gameState.gameMode === "3lives") {
        drawText(ctx, `Lives: ${gameState.lives}`, canvas.width - 150, 60);
    }

    // Display active powerup and time remaining
    if (gameState.activePowerup) {
        let powerupName;
        switch (gameState.activePowerup) {
            case "bonusLife": powerupName = "Extra Life"; break;
            case "piercing": powerupName = "Piercing Shot"; break;
            case "birdshot": powerupName = "Birdshot"; break;
            case "shield": powerupName = "Shield"; break;
            case "slowTime": powerupName = "Slow Time"; break;
        }
        drawText(ctx, `Powerup: ${powerupName} (${gameState.powerupTimeRemaining.toFixed(1)}s)`, 10, canvas.height - 10);
    }
}

// Update and draw obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        
        // Move obstacle
        obstacle.x -= gameState.gameSpeed;
        
        // Draw obstacle
        drawObstacle(ctx, obstacle);
        
        // Remove obstacles that go off-screen
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            continue;
        }
        
        // Collision detection with player
        if (isCollision(player, obstacle)) {
            // Handle collision based on obstacle type and game mode
            if (obstacle.isCantHit) {
                if (player.hasShield) {
                    // Shield protects against can't-hit obstacles
                    obstacles.splice(i, 1);
                    player.deactivateShield();
                    gameState.activePowerup = null;
                    gameState.powerupTimeRemaining = 0;
                } else {
                    gameState.isGameOver = true; // Game over on collision with can't-hit obstacle
                }
            } else if (gameState.gameMode === "3lives" && gameState.lives > 1) {
                obstacles.splice(i, 1);
                gameState.lives--;
            } else if (player.hasShield) {
                obstacles.splice(i, 1);
                player.deactivateShield();
                gameState.activePowerup = null;
                gameState.powerupTimeRemaining = 0;
            } else {
                gameState.isGameOver = true;
            }
        }
    }
}

// Update and draw powerups
function updatePowerups() {
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        
        // Move powerup
        powerup.x -= gameState.gameSpeed;
        
        // Draw powerup
        drawPowerup(ctx, powerup);
        
        // Remove powerups that go off-screen
        if (powerup.x + powerup.width < 0) {
            powerups.splice(i, 1);
            continue;
        }
        
        // Collision detection with player
        if (isCollision(player, powerup)) {
            // Activate the powerup
            const activatedPowerup = activatePowerup(powerup.type, gameState.gameMode, player, gameState);
            
            if (activatedPowerup) {
                gameState.activePowerup = activatedPowerup.type;
                gameState.powerupTimeRemaining = activatedPowerup.duration;
            }
            
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
        
        // Draw bullet
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Check collision with obstacles
        let hitObstacle = false;
        
        for (let j = obstacles.length - 1; j >= 0; j--) {
            const obstacle = obstacles[j];
            
            if (isCollision(bullet, obstacle)) {
                if (obstacle.isCantHit) {
                    gameState.isGameOver = true; // Game over when a bullet hits a can't hit obstacle
                } else if (obstacle.isDestructible) {
                    // Remove obstacle
                    obstacles.splice(j, 1);
                    gameState.score += 20;
                    
                    if (gameState.gameMode === "challenge") {
                        gameState.challengeTargets--;
                        if (gameState.challengeTargets <= 0) {
                            gameState.isGameOver = true; // End game when all targets are destroyed
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

// Game Over screen
function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawText(ctx, "Game Over", canvas.width / 2, canvas.height / 2 - 40, "#fff", "36px Arial", "center");
    
    if (gameState.gameMode === "normal" || gameState.gameMode === "3lives") {
        drawText(ctx, `Survived: ${gameState.survivalTime.toFixed(1)} seconds`, canvas.width / 2, canvas.height / 2, "#fff", "24px Arial", "center");
    } else if (gameState.gameMode === "challenge") {
        drawText(ctx, `Targets Destroyed: ${10 - gameState.challengeTargets}`, canvas.width / 2, canvas.height / 2, "#fff", "24px Arial", "center");
    }
    
    drawText(ctx, `Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 40, "#fff", "24px Arial", "center");
    drawText(ctx, "Press R to Restart", canvas.width / 2, canvas.height / 2 + 80, "#fff", "24px Arial", "center");
    
    // Stop all timers
    clearInterval(gameState.survivalInterval);
}

// Restart Game
function restartGame() {
    // Reset all game variables
    player = new Player();
    obstacles = [];
    bullets = [];
    powerups = [];
    
    gameState.obstacleTimer = 0;
    gameState.powerupTimer = 0;
    gameState.isGameOver = false;
    gameState.gameSpeed = gameState.defaultGameSpeed;
    gameState.score = 0;
    gameState.activePowerup = null;
    gameState.powerupTimeRemaining = 0;
    
    // Clear any existing intervals
    clearInterval(gameState.survivalInterval);
    
    if (!gameState.gameMode) {
        showMenu();
    } else if (gameState.gameMode === "normal") {
        startNormalGame();
    } else if (gameState.gameMode === "challenge") {
        startChallengeGame();
    } else if (gameState.gameMode === "3lives") {
        startLivesMode();
    }
}

// Start Normal Mode
function startNormalGame() {
    gameState.defaultGameSpeed = 2;
    gameState.gameSpeed = gameState.defaultGameSpeed;
    gameState.score = 0;
    gameState.lives = 1;
    startSurvivalTimer();
    gameLoop();
}

// Start Challenge Mode
function startChallengeGame() {
    gameState.defaultGameSpeed = 3;
    gameState.gameSpeed = gameState.defaultGameSpeed;
    gameState.score = 0;
    gameState.challengeTargets = 10;
    gameState.survivalTime = 0;
    clearInterval(gameState.survivalInterval);
    gameLoop();
}

// Start Lives Mode
function startLivesMode() {
    gameState.defaultGameSpeed = 4;
    gameState.gameSpeed = gameState.defaultGameSpeed;
    gameState.lives = 3;
    gameState.score = 0;
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