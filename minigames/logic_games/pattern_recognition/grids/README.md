# Grid Pattern Puzzle Game

A fun, interactive memory game where players must remember and recreate grid patterns under time pressure. Challenge your visual memory and pattern recognition skills across increasingly difficult levels.

![Grid Pattern Puzzle Game Screenshot](https://placehold.co/600x400)

## Description

Grid Pattern Puzzle is a browser-based memory game that tests and improves your visual memory and pattern recognition abilities. The game shows you a pattern of highlighted cells in a grid for a limited time, then challenges you to recreate that pattern from memory.

### Features

- Progressive difficulty: As you advance through levels, patterns become more complex and viewing time decreases
- Score tracking: Earn points based on your level and accuracy
- Visual feedback: Clear indicators for correct and incorrect selections
- Time pressure: Limited time to memorize each pattern
- Pattern review: Option to briefly view the pattern again if needed

## How to Play

1. Click the "Start Game" button to begin
2. Memorize the blue pattern shown on the grid
3. After the time runs out, the pattern disappears
4. Click on the grid cells to recreate the pattern you just saw
5. Use the "Show Pattern" button if you need a quick refresher
6. Click "Submit" when you're ready to check your answer
7. Advance to the next level and repeat with increasingly difficult patterns

## Game Mechanics

- **Scoring**: Score = Level × 10 points for each correct pattern
- **Difficulty Progression**:
  - Higher levels have more cells to remember
  - Viewing time increases slightly in higher levels to compensate
- **Feedback**:
  - Green cells: Correctly selected
  - Red cells: Incorrectly selected
  - Orange cells: Cells you missed (part of the pattern but not selected)

## Installation

No installation required! This game runs entirely in your web browser.

### Local Setup

1. Clone the main repository:
```
git clone https://github.com/mattwydra/projects.git
```

2. Navigate to the correct directory in your file explorer (or finder)
 - <path/to/cloned/project/repo>/minigames/logic_games/pattern_recognition/grids

3. Open `index.html` in any modern web browser

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks or libraries)

## Customization

You can easily customize the game by modifying these variables in the JavaScript:

- Grid size (default 4×4)
- Starting level
- Time limits
- Scoring formula
- Visual appearance (via CSS)

## Browser Compatibility

Should work on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Future Enhancements

- High score leaderboard
- Sound effects
- Custom difficulty settings
- Additional game modes
- Mobile touch optimization
