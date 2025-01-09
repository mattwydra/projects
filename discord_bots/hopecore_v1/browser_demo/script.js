console.log("Script is loaded!");

// Select the generate button
const generateButton = document.getElementById("hopecore-link");

// Paths to image folders
const regularImagePath = "./assets/hc";
const specialImagePath = "./assets/daily-reminder-that-you-will-have-this";

// List of available images in each folder
// const regularImages = ["IMG_1071.png", "IMG_1077.png", "IMG_1078.png"];  // Add your actual image filenames here
// const specialImages = ["IMG_1047.png", "IMG_1064.png"];  // Add special images here

const regularImages = [
  "IMG_1070.PNG",
  "IMG_1071.PNG",
  "IMG_1072.PNG",
  "IMG_1073.PNG",
  "IMG_1075.PNG",
  "IMG_1076.PNG",
  "IMG_1077.PNG",
  "IMG_1078.PNG"
];
const specialImages = [
  "IMG_1047.png",
  "IMG_1064.png"
];


// Function to fetch and parse the quotes file
async function getQuotes() {
  console.log("Fetching quotes from './assets/quotes.txt'...");
  const response = await fetch("./assets/quotes.txt");
  const text = await response.text();
  console.log("Quotes fetched successfully!");
  return text.split("\n").filter((line) => line.trim() !== "");
}

// Function to get a random image from a folder
function getRandomImage(imagesArray) {
  console.log("Selecting a random image...");
  const randomImage = imagesArray[Math.floor(Math.random() * imagesArray.length)];
  console.log("Random image selected:", randomImage);
  return randomImage;
}

// Function to generate the hopecore content
async function generateHopecore() {
  try {
    console.log("Generating hopecore content...");

    // Load quotes
    const quotes = await getQuotes();
    console.log("Quotes loaded:", quotes);

    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)].trim();
    console.log("Random quote selected:", randomQuote);

    // Determine if the quote is special
    const isSpecialQuote =
      randomQuote.toLowerCase() === "daily reminder that you will have this";
    console.log("Is this a special quote?", isSpecialQuote);

    const folderImages = isSpecialQuote ? specialImages : regularImages;
    console.log("Selected image list:", folderImages);

    // Get a random image from the selected list
    const randomImagePath = getRandomImage(folderImages);
    console.log("Random image path:", randomImagePath);

    // Create image URL by combining folder path with image filename
    const imageElement = document.createElement("img");
    imageElement.src = isSpecialQuote ? `${specialImagePath}/${randomImagePath}` : `${regularImagePath}/${randomImagePath}`;
    imageElement.alt = "Generated Hopecore Image";
    imageElement.style.maxWidth = "100%";
    imageElement.style.marginTop = "14px"

    const quoteElement = document.createElement("div");
    quoteElement.textContent = randomQuote;
    quoteElement.style.marginTop = "25px";
    quoteElement.style.fontWeight = "bold";

    // Clear previous content and append new
    const resultContainer = document.getElementById("result");
    console.log("Clearing previous content...");
    resultContainer.innerHTML = "";
    resultContainer.appendChild(quoteElement);
    resultContainer.appendChild(imageElement);
    console.log("Hopecore content generated successfully!");
  } catch (error) {
    console.error("Error generating hopecore content:", error);
  }
}

// Attach the event listener
generateButton.addEventListener("click", generateHopecore);
