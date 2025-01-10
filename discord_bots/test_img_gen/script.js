// Select the generate button
const generateButton = document.getElementById("hopecore-link");

// Paths to image folders
const regularImagePath = "assets/hc";
const specialImagePath = "assets/daily-reminder-that-you-will-have-this";

const resultContainer = document.getElementById("result");

const imageElement = document.createElement("img");
imageElement.src =
  "./assets/daily-reminder-that-you-will-have-this/IMG_1047.png";
imageElement.alt = "Generated Hopecore Image";
imageElement.style.maxWidth = "80%";

resultContainer.innerHTML = "";
resultContainer.appendChild(imageElement);

// // Function to fetch and parse the quotes file
// async function getQuotes() {
//   const response = await fetch("./assets/quotes.txt");
//   const text = await response.text();
//   return text.split("\n").filter((line) => line.trim() !== "");
// }

// // Function to get a random image from a folder
// async function getRandomImage(folderPath) {
//   const response = await fetch(folderPath);
//   const html = await response.text();
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, "text/html");

//   // Find all image files in the folder
//   const images = Array.from(doc.querySelectorAll("a"))
//     .map((a) => a.href)
//     .filter((href) => /\.(jpg|jpeg|PNG|gif)$/i.test(href));
//   if (images.length === 0) {
//     throw new Error(`No images found in ${folderPath}`);
//   }

//   // Pick a random image
//   return images[Math.floor(Math.random() * images.length)];
// }

// // Function to generate the hopecore content
// async function generateHopecore() {
//   try {
//     // Load quotes
//     const quotes = await getQuotes();
//     console.log("quotes: ", quotes);
//     const randomQuote =
//       quotes[Math.floor(Math.random() * quotes.length)].trim();

//     // Determine if the quote is special
//     const isSpecialQuote =
//       randomQuote.toLowerCase() === "daily reminder that you will have this";
//     const folderPath = isSpecialQuote ? specialImagePath : regularImagePath;

//     // Get a random image from the selected folder
//     const randomImagePath = await getRandomImage(folderPath);

//     // Display the quote and image
//     const imageElement = document.createElement("img");
//     imageElement.src = randomImagePath;
//     imageElement.alt = "Generated Hopecore Image";
//     imageElement.style.maxWidth = "100%";

//     const quoteElement = document.createElement("div");
//     quoteElement.textContent = randomQuote;
//     quoteElement.style.marginTop = "20px";
//     quoteElement.style.fontWeight = "bold";

//     // Clear previous content and append new
//     const resultContainer = document.getElementById("result");
//     resultContainer.innerHTML = "";
//     resultContainer.appendChild(imageElement);
//     resultContainer.appendChild(quoteElement);
//   } catch (error) {
//     console.error("Error generating hopecore content:", error);
//   }
// }

// // Attach the event listener
// generateButton.addEventListener("click", generateHopecore);
