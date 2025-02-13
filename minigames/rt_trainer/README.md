# Reaction Time Minigame

[link](https://mattwydra.github.io/projects/minigames/rt_trainer/index.html)

## Overview
The Reaction Time Minigame tests a player's ability to respond quickly to visual stimuli. The game tracks reaction times across multiple attempts and calculates key performance statistics, such as the best time and average time. This fun and challenging minigame encourages players to improve their reflexes.

This README explains the current functionality and outlines planned features for future development.

---

## Features

### Core Functionality
- **Randomized Start Time**:
  - The game begins with a random delay (3-7 seconds) before the visual cue appears.
  - Players must wait for the screen to turn green before clicking.

- **Reaction Time Tracking**:
  - Tracks the time between the visual cue (green screen) and the player's click.
  - Records times for up to 5 attempts per session.

- **Performance Statistics**:
  - Calculates and displays the best, worst, and average reaction times at the end of the session.
  - Displays all valid reaction times for player review.

- **High Score Saving**:
  - Allows players to save their best time and best average for future comparison.

### User Interface
The HTML structure includes:
- `#instructions`: Displays game instructions and feedback.
- `#start-btn`: Button to start the game.
- `#result`: Shows performance statistics after the session.
- `#stats`: Lists all recorded reaction times.
- `#save-average-btn`, `#save-best-btn`: Buttons to save the best average and best time.

---

## Code Explanation

### HTML
Defines the layout and structure for:
- **Game Area**: Instructions, start button, and result displays.
- **Save Buttons**: Buttons to save best performance metrics.

### JavaScript
Implements the game logic:

#### Randomized Delay
- Uses `setTimeout` with a random interval (3-7 seconds) to create unpredictability.

#### Reaction Time Calculation
- Measures the time from the visual cue to the player's click using `performance.now()`.
- Filters out invalid times (e.g., false starts).

#### Session Management
- Tracks up to 5 reaction times per session.
- Ends the game after 5 attempts and displays results.

#### High Score Management
- Saves the best time and average time locally.
- Alerts players when a new best score is saved.

---

## Future Features

### Planned Enhancements
1. **Session Averaging**:
   - Ensure the game automatically calculates and averages reaction times across 5 attempts per session.

2. **Reset and Give Up Buttons**:
   - Add reset functionality to restart the game at any point.
   - Implement a "Give Up" button to exit the session prematurely.

3. **Color-Blind Mode**:
   - Introduce customizable colors for the visual cue to make the game accessible for color-blind players.

4. **Difficulty Levels**:
   - Add adjustable difficulty levels, such as shorter randomized delays or smaller visual cues.

5. **Graphical Feedback**:
   - Provide a visual graph showing reaction times for each attempt.

6. **Leaderboard Integration**:
   - Allow players to submit their best scores to a global or local leaderboard.
  
7. **Streak Tracking**:
  - Track and reward players for consistent reaction times within a tight range.

8. **Time Threshold Feedback**:
  - Introduce categories (e.g., "Excellent," "Average," "Needs Improvement") based on the reaction time.
  - Potentially titled as ranks (bronze, silver, gold, etc.)
     - Could be based on reaction time + aim trainer for a ranked from two combined metrics

---

## How to Run
1. Clone the repository or download the files.
2. Place the HTML, CSS, and JavaScript files in the same directory.
3. Open `index.html` in a web browser.
4. Click "Start" to begin the game.
