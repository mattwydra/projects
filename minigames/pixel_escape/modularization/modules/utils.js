// utils.js

/**
 * Get a random integer between min and max (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer between min and max.
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Detect if two rectangles are colliding.
 * @param {Object} rect1 - First rectangle with x, y, width, height.
 * @param {Object} rect2 - Second rectangle with x, y, width, height.
 * @returns {boolean} True if the rectangles collide, false otherwise.
 */
export function isCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

/**
 * Draw text on the canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {string} text - The text to draw.
 * @param {number} x - X-coordinate for the text.
 * @param {number} y - Y-coordinate for the text.
 * @param {string} [color="#fff"] - Text color.
 * @param {string} [font="20px Arial"] - Font style.
 * @param {string} [align="left"] - Text alignment.
 */
export function drawText(ctx, text, x, y, color = "#fff", font = "20px Arial", align = "left") {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

/**
 * Create a button object and draw it on the canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
 * @param {string} text - Button label.
 * @param {number} x - X-coordinate for the center of the button.
 * @param {number} y - Y-coordinate for the center of the button.
 * @returns {Object} The button object with dimensions and position.
 */
export function createButton(ctx, text, x, y) {
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

    return { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
}

/**
 * Check if a point is inside a rectangle (e.g., for mouse click detection).
 * @param {number} px - X-coordinate of the point.
 * @param {number} py - Y-coordinate of the point.
 * @param {Object} rect - Rectangle with x, y, width, height.
 * @returns {boolean} True if the point is inside the rectangle, false otherwise.
 */
export function isPointInRect(px, py, rect) {
    return px > rect.x && px < rect.x + rect.width && py > rect.y && py < rect.y + rect.height;
}
