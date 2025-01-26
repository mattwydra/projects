export function createObstacle(canvasWidth, gameSpeed) {
    const isDestructible = Math.random() > 0.5;
    const isCantHit = Math.random() > 0.8; // 20% chance to spawn a can't-hit obstacle
    const isFlying = Math.random() > 0.5;
    const yPos = isFlying ? 200 : 300;

    return {
        x: canvasWidth,
        y: yPos,
        width: 20,
        height: 20,
        color: isCantHit ? "#ff0000" : isDestructible ? "#1e90ff" : "#ff6347",
        isDestructible: isDestructible && !isCantHit,
        isCantHit: isCantHit,
        isFlying: isFlying,
    };
}

export function drawObstacle(ctx, obstacle) {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

export function updateObstacle(obstacle, index, gameSpeed, obstacles) {
    obstacle.x -= gameSpeed;

    if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(index, 1); // Remove obstacles off-screen
    }
}
