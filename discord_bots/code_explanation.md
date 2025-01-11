# Hopecore Bot Demo

Welcome to the **Hopecore Bot Demo**! This project generates inspirational quotes paired with matching images for the intent of mirroring the functionality of the [hopecore bot](README.md) I created. It's designed to showcase simple yet effective use of HTML, CSS, and JavaScript for creating dynamic and interactive web applications.

---

## Features

- Fetches random quotes from a local file.
- Displays a random image corresponding to the selected quote.
- Dynamically adjusts quote width to match the image width.
- Includes a special category for "daily reminder" quotes with unique images.
- Responsive and visually appealing design.

---

## File Structure

```
/
├── index.html        # Main HTML file
├── hopecore.css      # Styles for the page
├── script.js         # JavaScript logic
├── assets/
│   ├── quotes.txt    # Text file containing quotes
│   ├── hc/           # Folder for regular hopecore images
│   └── daily-reminder-that-you-will-have-this/ # Special hopecore images
```

---

## How It Works

### HTML: The Structure

The `index.html` file provides the structure of the webpage. Here's the core setup:

```html
<button id="hopecore-link">generate hopecore</button>
<div id="result" style="margin-top: 50px"></div>
```

- A button (`hopecore-link`) triggers the image and quote generation.
- The `result` container displays the generated image and quote.

### CSS: Styling the Page

The `hopecore.css` file ensures the page looks clean and visually appealing:

```css
body {
  background-color: black;
  color: aliceblue;
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
}

#result img {
  max-width: 80%;
  height: auto;
  margin-top: 14px;
  margin-bottom: 24px;
}

#hopecore-link {
  padding: 10px 20px;
  background-color: rosybrown;
  color: aliceblue;
  border-radius: 5px;
  font-size: 1.2em;
}

#hopecore-link:hover {
  background-color: lavenderblush;
  color: darksalmon;
}
```

- Images are responsive, maintaining aspect ratio.
- The button changes color when hovered over for better interactivity.

### JavaScript: Adding Functionality

The `script.js` file handles the logic:

#### Fetching Quotes

```javascript
async function getQuotes() {
  const response = await fetch("./assets/quotes.txt");
  const text = await response.text();
  return text.split("\n").filter((line) => line.trim() !== "");
}
```

- Fetches the `quotes.txt` file and parses it into an array of quotes.

#### Selecting Random Images

```javascript
async function getRandomImage(folderPath) {
  const apiUrl = `https://api.github.com/repos/gymney/hopecore/contents/${folderPath}`;
  const response = await fetch(apiUrl);
  const files = await response.json();
  const imageFilenames = files
    .filter(file => file.name.toLowerCase().endsWith('.png'))
    .map(file => file.name);
  const randomIndex = Math.floor(Math.random() * imageFilenames.length);
  return `${folderPath}/${imageFilenames[randomIndex]}`;
}
```

- Fetches image filenames from GitHub.
- Selects a random `.png` file.

#### Generating Hopecore Content

```javascript
async function generateHopecore() {
  const quotes = await getQuotes();
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].trim();
  const isSpecialQuote = randomQuote.toLowerCase() === "daily reminder that you will have this";
  const folderPath = isSpecialQuote ? "assets/daily-reminder-that-you-will-have-this" : "assets/hc";
  const imageUrl = await getRandomImage(folderPath);

  const imageElement = document.createElement("img");
  imageElement.src = imageUrl;
  const quoteElement = document.createElement("div");
  quoteElement.textContent = randomQuote;

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";
  resultContainer.appendChild(quoteElement);
  resultContainer.appendChild(imageElement);

  imageElement.onload = () => {
    quoteElement.style.maxWidth = `${imageElement.offsetWidth}px`;
  };
}
```

- Selects a random quote and determines if it's "special."
- Dynamically creates image and quote elements and appends them to the `result` container.
- Adjusts quote width to match the image width after the image loads.

#### Button Listener

```javascript
const generateButton = document.getElementById("hopecore-link");
if (generateButton) {
  generateButton.addEventListener("click", generateHopecore);
} else {
  console.error("Generate button not found!");
}
```

- Adds a click listener to the button to trigger content generation.

---

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hopecore.git
   cd hopecore
   ```
2. Open `index.html` in a browser.
3. Click the "generate hopecore" button to display a random quote and image.

---

## Known Issues

- Requires an internet connection to fetch images from GitHub.
- Ensure all `.png` files in the `assets/hc` and `assets/daily-reminder-that-you-will-have-this` directories are accessible.
