export function createBullet(player) {
    return {
        x: player.x + player.width,
        y: player.y + player.height / 2 - 2,
        width: 10,
        height: 4,
        color: "#ffdd57",
        speed: 6,
    };
}

export function drawBullet(ctx, bullet) {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

export function updateBullet(bullet, index, bullets) {
    bullet.x += bullet.speed;

    if (bullet.x > canvas.width) {
        bullets.splice(index, 1); // Remove bullets off-screen
    }
}
