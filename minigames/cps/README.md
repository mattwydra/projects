# Clicks Per Second (CPS) Tester

[link](https://mattwydra.github.io/projects/minigames/cps/index.html)

## Overview
The CPS Tester is a browser-based application designed to measure and track a user's clicking speed over a specified duration. The game provides real-time feedback, customizable test durations, and high score tracking for competitive fun.

This README explains the current functionality and outlines planned features for future enhancements.

---

## Features

### Core Functionality
- **Custom Duration Selection**:
  - Users can select their preferred test duration (5 seconds, 10 seconds, or 1 minute).
  - Selected duration is highlighted for visual feedback.

- **Click Counting**:
  - Counts and displays the total number of clicks during the test.

- **Clicks Per Second (CPS) Calculation**:
  - Calculates the average CPS after each test.
  - Provides dynamic feedback based on the CPS achieved:
    - Above-average performance.
    - Excellent performance.
    - Areas for improvement.

- **High Score Tracking**:
  - Saves the highest CPS score for future comparison using `localStorage`.
  - Updates high score displays in real-time.

### User Interface
The HTML structure includes:
- Buttons for selecting the test duration.
- Dynamic displays for:
  - Remaining time (`#time-left`).
  - Total clicks (`#click-total`).
  - Highest CPS achieved (`#high-score`).
- Controls for starting, saving, and resetting the game.

---

## Code Explanation

### HTML
The HTML file defines the user interface with:
- `#time-selection`: Buttons for selecting the test duration.
- `#click-container`: Area for counting clicks and displaying the total.
- `#control-btns`: Save and reset options.
- `#high-score`: Displays the highest CPS achieved.

### JavaScript
The JavaScript file (`script.js`) handles game logic:

#### Event Listeners
- **Duration Buttons**: Set the test duration and visually highlight the selection.
- **Start Button**: Resets click count, starts the timer, and enables click counting.
- **Click Events**: Counts user clicks in real time.
- **Save Button**: Compares the current CPS to the high score and updates it if necessary.
- **Reset Button**: Stops the game and resets the click count and timer.

#### Timer
- Implements a countdown timer with `setInterval`.
- Automatically ends the game when the timer reaches zero.

#### Click Tracking
- Increments the click count and updates the display in real time.

#### End Game Logic
- Stops the timer and disables click tracking.
- Calculates and alerts the user of their CPS performance.

#### High Score Management
- Saves and retrieves the highest CPS using `localStorage`.
- Alerts the user about their high score status (new record or not).

---

## Future Features

1. **Dynamic Click Display**:
   - Show live feedback on clicks per second during the test.

2. **Graphical Feedback**:
   - Introduce a visual graph or bar to display click consistency over time.

3. **Expanded Duration Options**:
   - Add more duration choices, such as 15 seconds, 30 seconds, etc.

4. **Mobile Optimization**:
   - Ensure the game works seamlessly on touch devices.

---

## How to Run
1. Clone the repository or download the files.
2. Place the HTML, CSS, and JavaScript files in the same directory.
3. Open `index.html` in a web browser.
4. Select a duration and click "BEGIN" to start the game.
