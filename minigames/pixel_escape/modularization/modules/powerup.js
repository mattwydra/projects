// PowerUp.js
export function spawnPowerup(canvas, gameMode) {
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
    switch(type) {
        case "bonusLife": color = "#32CD32"; break; // Green
        case "piercing": color = "#FFD700"; break; // Gold
        case "birdshot": color = "#00BFFF"; break; // Blue
        case "shield": color = "#9932CC"; break; // Purple
        case "slowTime": color = "#FF69B4"; break; // Pink
    }
    
    return {
        x: canvas.width,
        y: yPos,
        width: 15,
        height: 15,
        color: color,
        type: type
    };
}

export function drawPowerup(ctx, powerup) {
    ctx.fillStyle = powerup.color;
    ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
    
    // Draw a "P" on the powerup for better visibility
    ctx.fillStyle = "#FFF";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("P", powerup.x + powerup.width/2, powerup.y + powerup.height/2 + 4);
}

export function updatePowerup(powerup, gameSpeed) {
    powerup.x -= gameSpeed;
    return powerup.x + powerup.width < 0; // Return true if off-screen
}

export function activatePowerup(type, gameMode, player, gameState) {
    // Bonus life is immediate, not a duration powerup
    if (type === "bonusLife") {
        if (gameMode === "3lives") {
            gameState.lives++;
        } else {
            gameState.score += 50; // Give extra points instead in other modes
        }
        return null;
    }
    
    // For slow time, modify the game speed
    if (type === "slowTime") {
        gameState.gameSpeed = gameState.defaultGameSpeed / 2;
    }
    
    // For shield, activate on player
    if (type === "shield") {
        player.activateShield();
    }
    
    return {
        type: type,
        duration: 10 // 10 seconds
    };
}

export function deactivatePowerup(activePowerup, player, gameState) {
    if (activePowerup === "slowTime") {
        gameState.gameSpeed = gameState.defaultGameSpeed;
    }
    
    if (activePowerup === "shield") {
        player.deactivateShield();
    }
}