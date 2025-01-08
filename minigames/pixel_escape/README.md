# Pixel Escape

## Overview
Pixel Escape is a fast-paced, 2D endless runner game where players control a pixel character and avoid obstacles by jumping. The game tests reflexes and timing skills, with potential for exciting future enhancements.

This README outlines the current gameplay mechanics, code structure, and plans for future features.

---

## Features

### Core Functionality
- **Player Movement**:
  - Players control a pixel character that can jump to avoid obstacles.
  - Gravity brings the character back to the ground after a jump.

- **Obstacles**:
  - Rectangular obstacles spawn periodically and move left across the screen.
  - Obstacles are removed when they exit the canvas.

- **Collision Detection**:
  - The game ends (and reloads) if the player collides with an obstacle.

### User Interface
The game uses a simple HTML canvas for rendering:
- A red pixel character represents the player.
- Blue rectangles represent obstacles.

---

## Code Explanation

### HTML
Defines the canvas where the game is rendered:
- `<canvas id="gameCanvas" width="800" height="400"></canvas>`: Main game area.

### JavaScript
Implements the game logic:

#### Player Logic
- The player object includes position, size, color, and vertical velocity.
- **Jump Functionality**:
  - Adds an upward velocity to the player when the spacebar is pressed.
  - Prevents multiple jumps until the player lands.

#### Gravity
- Constant downward force applied to the player’s vertical velocity.
- Ensures realistic motion during and after a jump.

#### Obstacles
- Periodically spawns new obstacles at fixed intervals.
- Moves obstacles left across the canvas at a constant speed.
- Removes obstacles that move off-screen to optimize performance.

#### Collision Detection
- Checks for overlap between the player and obstacles.
- Reloads the game if a collision is detected.

#### Game Loop
- Uses `requestAnimationFrame` for smooth and continuous game rendering.
- Clears the canvas, updates game objects, and redraws them at each frame.

---

## Future Features

### Planned Features
1. **New Gamemodes**:
   - Introduce alternate playstyles, such as time trials or survival mode.

2. **Powerups**:
   - Add collectible items that grant temporary advantages (e.g., higher jumps, slower obstacles).

3. **Difficulty Levels**:
   - Allow players to select different difficulty levels, altering game speed and obstacle frequency.

4. **3D Display**:
   - Transform the game into a 3D environment for added immersion.

### Planned Enhancements
1. **Adjustable Gravity**:
   - Reduce the gravity effect to allow smoother, more forgiving jumps.

2. **Variable Obstacle Dimensions**:
   - Introduce obstacles of varying sizes for more dynamic gameplay.

3. **Improved Collision Effects**:
   - Add visual feedback or animations when the player collides with an obstacle.

4. **Score Tracking**:
   - Implement a score system to track the player's progress and performance.

5. **Mobile Optimization**:
   - Make the game touch-friendly for mobile devices.
   - Create a mobile app equivalent for iOS and Android

---

## How to Run
1. Clone the repository or download the files.
2. Place the HTML, CSS, and JavaScript files in the same directory.
3. Open `index.html` in a web browser.
4. Use the spacebar to jump and avoid obstacles.
