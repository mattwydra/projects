console.log("Script is loaded!");

// Select the generate button
const generateButton = document.getElementById("hopecore-link");

// GitHub API paths for the image folders (make sure to replace `your-username` and `your-repo` with actual values)
const regularImagePath = "https://raw.githubusercontent.com/mattwydra/projects/main/discord_bots/hopecore_v1/static/assets/hc";
const specialImagePath = "https://raw.githubusercontent.com/mattwydra/projects/main/discord_bots/hopecore_v1/static/assets/daily-reminder-that-you-will-have-this";


// Function to fetch and parse the quotes file
async function getQuotes() {
  console.log("Fetching quotes from './assets/quotes.txt'...");
  const response = await fetch("./assets/quotes.txt");
  const text = await response.text();
  console.log("Quotes fetched successfully!");
  return text.split("\n").filter((line) => line.trim() !== "");
}

// Function to fetch the image list from GitHub API
async function getImageList(folder) {
  const apiUrl = `https://api.github.com/repos/mattwydra/projects/contents/discord_bots/hopecore_v1/static/assets/${folder}`;

  // PAT required for more than 60 requests. __TOKEN_PLACEHOLDER__ is updated with the deploy.yml file
  const token = "__TOKEN_PLACEHOLDER__"; // This will be replaced during deployment
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Check if the response is successful

  if (!response.ok) {
    console.error("Error fetching folder contents:", response.statusText);
    return [];
  }

  const data = await response.json();
  console.log("GitHub API Response:", data);

  // Ensure the data is an array and filter out non-file items
  if (Array.isArray(data)) {
    const imageFiles = data.filter(item => item.type === 'file').map(item => item.name);
    console.log("Filtered image files:", imageFiles);
    return imageFiles;
  } else {
    console.error("Expected an array but received:", typeof data);
    return [];
  }
}

// Function to get a random image from a list
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

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)].trim();
    console.log("Random quote selected:", randomQuote);

    // Determine if the quote is special
    const isSpecialQuote = randomQuote.toLowerCase() === "daily reminder that you will have this";
    console.log("Is this a special quote?", isSpecialQuote);

    // Load the image list (regular and special images)
    const folderImages = await getImageList(isSpecialQuote ? 'daily-reminder-that-you-will-have-this' : 'hc');
    console.log("Selected image list:", folderImages);

    // Check if there are any images in the folder
    if (folderImages.length === 0) {
      console.error("No images found in the folder!");
      return;
    }

    // Get a random image from the selected list
    const randomImagePath = getRandomImage(folderImages);
    console.log("Random image path:", randomImagePath);


    console.log("Image URL:", isSpecialQuote ? `${specialImagePath}/${randomImagePath}` : `${regularImagePath}/${randomImagePath}`);

    // Create image URL by combining folder path with image filename
    const imageElement = document.createElement("img");
    imageElement.src = isSpecialQuote ? `${specialImagePath}/${randomImagePath}` : `${regularImagePath}/${randomImagePath}`;
    imageElement.alt = "Generated Hopecore Image";
    imageElement.style.maxWidth = "100%";
    imageElement.style.marginTop = "14px";
    imageElement.style.marginBottom = "24px";

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
