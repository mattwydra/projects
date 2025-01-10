console.log("Script is loaded!");

// Select the generate button
const generateButton = document.getElementById("hopecore-link");

// Correct GitHub raw paths for images (using the updated repo links)
const regularImagePath = "https://raw.githubusercontent.com/gymney/hopecore/main/assets/hc";
const specialImagePath = "https://raw.githubusercontent.com/gymney/hopecore/main/assets/daily-reminder-that-you-will-have-this";

// Function to fetch and parse the quotes file
async function getQuotes() {
  try {
    console.log("Fetching quotes...");
    const response = await fetch("./assets/quotes.txt"); // Adjust path if needed
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    console.log("Quotes fetched successfully!");
    return text.split("\n").filter((line) => line.trim() !== "");
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

// Function to get a random image URL from GitHub
async function getRandomImage(folderPath) {
  const apiUrl = `https://api.github.com/repos/gymney/hopecore/contents/${folderPath}`;
  try {
    const response = await fetch(apiUrl);

    // If the folder doesn't exist or is empty, return an empty string
    if (response.status === 404) {
      console.error(`Folder "${folderPath}" not found.`);
      return "";
    }

    const files = await response.json();

    if (!Array.isArray(files)) {
      console.error("Unexpected response format:", files);
      return "";
    }

    // Filter for .png and .PNG files (case-insensitive)
    const imageFilenames = files
      .filter(file => file.name.toLowerCase().endsWith('.png'))
      .map(file => file.name);

    if (imageFilenames.length === 0) {
      console.error("No images found in the folder!");
      return "";
    }

    const randomIndex = Math.floor(Math.random() * imageFilenames.length);
    const imageName = imageFilenames[randomIndex];
    return `${folderPath}/${imageName}`;
  } catch (error) {
    console.error("Error fetching image filenames:", error);
    return "";
  }
}

// Function to generate the hopecore content
async function generateHopecore() {
  try {
    console.log("Generating hopecore content...");

    // Load quotes
    const quotes = await getQuotes();
    if (quotes.length === 0) {
      console.error("No quotes available!");
      return;
    }

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].trim();
    console.log("Random quote selected:", randomQuote);

    // Determine if the quote is special
    const isSpecialQuote = randomQuote.toLowerCase() === "daily reminder that you will have this";
    console.log("Is this a special quote?", isSpecialQuote);

    // Get a random image URL
    const folderPath = isSpecialQuote ? "assets/daily-reminder-that-you-will-have-this" : "assets/hc";
    const imageUrl = await getRandomImage(folderPath);
    if (!imageUrl) return; // Exit if no image URL is generated

    console.log("Random image URL:", imageUrl);

    // Create and display the image and quote
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = "Generated Hopecore Image";
    imageElement.style.maxWidth = "100%";
    imageElement.style.marginTop = "14px";
    imageElement.style.marginBottom = "24px";

    const quoteElement = document.createElement("div");
    quoteElement.textContent = randomQuote;
    quoteElement.style.marginTop = "25px";
    quoteElement.style.fontWeight = "bold";

    // Update the result container
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "";
    resultContainer.appendChild(quoteElement);
    resultContainer.appendChild(imageElement);
    console.log("Hopecore content generated successfully!");
  } catch (error) {
    console.error("Error generating hopecore content:", error);
  }
}

// Attach the event listener
if (generateButton) {
  generateButton.addEventListener("click", generateHopecore);
} else {
  console.error("Generate button not found!");
}
