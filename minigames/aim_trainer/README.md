# Aim Trainer

## Overview
Aim Trainer is a simple browser-based game designed to test and improve a player's precision and reaction time. The user clicks on randomly appearing targets within a set time limit, with scores and accuracy displayed in real time. The game features intuitive UI elements and tracks high scores for motivation and progress.

This README explains the current functionality of the game and highlights planned enhancements.

---

## Features

### Core Functionality
- **Start and Reset Buttons**: Controls to start a new game or reset the current session.
- **Timer**: Countdown timer indicating the remaining game duration.
- **Game Area**: Interactive area where targets appear randomly.
- **Scoring System**:
  - Score increases upon successfully clicking a target.
  - Accuracy is calculated as the ratio of successful hits to total attempts.
  - High scores and accuracy metrics are displayed and saved locally.
- **Feedback on Reaction Time**: Tracks and displays average reaction time.

### User Interface
The HTML file provides a structured layout:
- Header for the game title.
- Buttons for starting, resetting, and giving up.
- Real-time statistics (score, accuracy, and reaction time).
- Game area dynamically populated by JavaScript.

---

## Code Explanation

### HTML
The HTML file defines the structure of the Aim Trainer. Key elements include:
- `#timer`: Displays the countdown timer.
- `#game-area`: Container where targets appear (initially hidden).
- `#highest-score`, `#highest-accuracy`, `#highest-reaction-time`: Metrics displayed after the game ends.

### JavaScript
The `aim_trainer.js` script implements the game logic. Key components include:

#### Event Listeners
- **Start Button**: Initiates the game, sets the timer, and shows the game area.
- **Target Clicks**: Handles user interactions with the game area and updates scores.

#### Timer
- Uses `setInterval` to decrement the timer and stop the game when time runs out.

#### Target Generation
- Dynamically generates clickable elements within the game area at random positions.

#### Scoring and Accuracy
- Tracks hits and attempts to calculate accuracy in real time.
- Updates and displays high scores and accuracy metrics using `localStorage`.

---

## Future Features
The following features are planned for future implementation, and can be found [here](issues_aim_trainer.txt):

1. **Display Top 5 Scores**:
   - Show a leaderboard of the top 5 scores with their associated accuracies.

2. **Server Integration**:
   - Replace local storage with server/database integration to save and load scores across devices.

3. **Dynamic Timer Options**:
   - Allow users to select game durations, such as 5 seconds, 10 seconds, or 1 minute.

4. **Detailed Post-Game Statistics**:
   - Provide additional insights, including:
     - Average reaction time per hit.
     - Longest streak of successful hits.

---

## How to Run
1. Clone the repository or download the files.
2. Open `aim_trainer.html` in a web browser.
3. Click "Start" to begin the game.
