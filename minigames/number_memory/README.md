# Number Memory Game

## Overview
The Number Memory Game challenges players to memorize and recall a sequence of numbers that grows longer with each successful round. The game tests cognitive recall and memory skills, with added features to keep gameplay engaging.

This README explains the current functionality and outlines ideas for future enhancements.

---

## Features

### Core Functionality
- **Progressive Difficulty**:
  - Starts with a default sequence length of 6 digits.
  - Sequence length increases by 1 after each successful round.

- **Timer and Progress Bar**:
  - Displays a visual timer during the memorization phase.
  - Timer dynamically shrinks to indicate the remaining time.

- **Feedback**:
  - Displays success or failure messages based on the player’s performance.
  - Provides options to proceed or reset after each round.

- **High Score Tracking**:
  - Saves the highest successfully memorized sequence length using `localStorage`.
  - Alerts players when they set a new high score or fail to beat the existing one.

### User Interface
The HTML structure includes:
- **Progress Bar**: Visual indicator of the remaining memorization time.
- **Feedback Messages**:
  - Displays correct and incorrect responses with score details.
- **Game Controls**:
  - Start, proceed, reset, and save buttons for navigating the game.

---

## Code Explanation

### HTML
The HTML file defines the layout and elements for:
- `#progress-bar`: Visual timer for the memorization phase.
- `#sequence`: Displays the sequence for players to memorize.
- `#correct-text`, `#incorrect-text`: Feedback messages for success or failure.
- Buttons for game control (`#start-timer`, `#proceed-button`, `#reset-button`, `#save-btn`).

### JavaScript
The JavaScript file contains the game logic:

#### Sequence Generation
- Generates a random sequence of digits (0-9) based on the current sequence length.
- Converts the sequence to a string for display.

#### Display Logic
- Displays the sequence and hides it after the memorization timer ends.
- Dynamically updates the progress bar width during the timer.

#### User Input Handling
- Prompts the player to input the memorized sequence.
- Compares the input with the generated sequence to determine success or failure.

#### Game State Management
- Tracks variables like the sequence, user input, current score, and starting sequence length.
- Provides reset functionality to restart the game from the default state.

#### High Score Management
- Stores the highest score in `localStorage`.
- Updates the display and provides alerts based on performance.

---

## Future Features
1. **Reverse Memorization Mode**:
   - Players must input the sequence in reverse order.

2. **Lightning Mode**:
   - Reduces memorization time for an added challenge.

3. **Custom Starting Length**:
   - Allows players to choose a starting sequence length (1-5 or higher).

4. **Enhanced Timer Options**:
   - Add a configurable timer length to cater to different difficulty preferences.

---

## How to Run
1. Clone the repository or download the files.
2. Place the HTML, CSS, and JavaScript files in the same directory.
3. Open `index.html` in a web browser.
4. Click "Start" to begin the game.
