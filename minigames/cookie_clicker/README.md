# Cookie Clicker

## Overview
Cookie Clicker is a simple and interactive game where players click on a cookie to increase their cookie count. It provides a minimalistic design and instant feedback to keep users engaged.

This README explains the current functionality and offers a placeholder for future features that can be added to enhance the game.

---

## Features

### Core Functionality
- **Cookie Click Counter**: Every click on the cookie image increases the cookie count by 1.
- **Dynamic Updates**: The cookie count is displayed and updated in real time.

### User Interface
The HTML file creates a simple and clean layout:
- Header displaying the game title.
- Image of the cookie, clickable to increase the count.
- Paragraph showing the current number of cookies collected.

---

## Code Explanation

### HTML
The HTML file defines the structure of the game:
- `#cookie`: The image of the cookie that users click.
- `#cookie-count`: A span element where the total number of cookies is displayed.

### JavaScript
The JavaScript file (`cookie_clicker.js`) contains the logic for the game:

- **Click Event Listener**:
  - Listens for clicks on the `#cookie` element.
  - Increments the `cookieCount` variable.
  - Updates the text content of `#cookie-count` to reflect the new count.

---

## How to Run
1. Clone the repository or download the files.
2. Place the HTML, CSS, and JavaScript files in the same directory.
3. Open `cookie_clicker.html` in a web browser.
4. Start clicking the cookie to increase the count!

---

## Future Features
1. Custom image to click
2. Powerups/game modes
3. Highscore functionality
4. Dark mode/light mode
5. Achievements/unlocks
