// Player.js
export class Player {
    constructor(x = 50, y = 300, width = 20, height = 20, color = "#ff4757", jumpStrength = -8, gravity = 0.3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocityY = 0;
        this.isJumping = false;
        this.jumpStrength = jumpStrength;
        this.gravity = gravity;
        this.hasShield = false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw shield if active
        if (this.hasShield) {
            ctx.strokeStyle = "#32CD32"; // Green outline
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }
    }

    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Prevent player from falling below the ground
        if (this.y >= 300) {
            this.y = 300;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
        }
    }

    shoot(activePowerup = null) {
        const bullets = [];

        if (activePowerup === "birdshot") {
            // Create 3 bullets in a spread pattern
            for (let i = -1; i <= 1; i++) {
                bullets.push({
                    x: this.x + this.width,
                    y: this.y + this.height / 2 - 2,
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
                x: this.x + this.width,
                y: this.y + this.height / 2 - 2,
                width: 10,
                height: 4,
                color: activePowerup === "piercing" ? "#FFD700" : "#ffdd57", // Gold for piercing
                speed: 6,
                angle: 0,
                piercing: activePowerup === "piercing"
            });
        }

        return bullets;
    }

    activateShield() {
        this.hasShield = true;
    }

    deactivateShield() {
        this.hasShield = false;
    }
}

export default Player;