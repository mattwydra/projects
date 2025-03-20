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

    const isSpecialQuote = randomQuote.toLowerCase() === "daily reminder that you will have this";
    console.log("Is this a special quote?", isSpecialQuote);

    const folderPath = isSpecialQuote ? "assets/daily-reminder-that-you-will-have-this" : "assets/hc";
    const imageUrl = await getRandomImage(folderPath);
    if (!imageUrl) return;

    console.log("Random image URL:", imageUrl);

    // Create and display the image and quote
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = "Generated Hopecore Image";
    imageElement.style.margin = "14px auto";
    imageElement.style.display = "block"; // Ensures the image is centered
    imageElement.style.maxWidth = "80%"; // Responsive sizing
    imageElement.style.height = "auto"; // Maintain aspect ratio

    const quoteElement = document.createElement("div");
    quoteElement.textContent = randomQuote;
    quoteElement.style.marginTop = "25px";
    quoteElement.style.textAlign = "center"; // Center text by default

    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "";
    resultContainer.appendChild(quoteElement);
    resultContainer.appendChild(imageElement);

    // Adjust the quote width after the image loads
    imageElement.onload = () => {
      const imageWidth = imageElement.offsetWidth; // Get the rendered width of the image
      quoteElement.style.maxWidth = `${imageWidth}px`; // Match the quote's max width to the image
      quoteElement.style.margin = "0 auto"; // Center the quote below the image
    };

    console.log("Hopecore content generated successfully!");
  } catch (error) {
    console.error("Error generating hopecore content:", error);
  }
}


// auto-generate
generateHopecore();
setInterval(generateHopecore, 10000);