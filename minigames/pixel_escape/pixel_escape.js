import { drawButton, showMenu, handleMenuClick } from './utils.js';
import { player } from './player.js';
import { handleObstacles } from './obstacles.js';
import { handleBullets } from './bullets.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameMode = null;
let isGameOver = false;
let score = 0;
let survivalTime = 0;
let survivalInterval;

canvas.addEventListener("click", handleMenuClick);
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") player.jump();
    if (e.code === "KeyF") player.shoot();
});

function startSurvivalTimer() {
    survivalTime = 0;
    survivalInterval = setInterval(() => survivalTime += 0.1, 100);
}

function gameLoop() {
    if (isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "24px Arial";
        ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2, canvas.height / 2);
        clearInterval(survivalInterval);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw(ctx);

    handleObstacles(ctx, score);
    handleBullets(ctx);

    requestAnimationFrame(gameLoop);
}

showMenu();
