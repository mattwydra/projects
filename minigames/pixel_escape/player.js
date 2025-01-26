// Player.js
class Player {
    constructor(x, y, width, height, color, jumpStrength, gravity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocityY = 0;
        this.isJumping = false;
        this.jumpStrength = jumpStrength;
        this.gravity = gravity;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
}
