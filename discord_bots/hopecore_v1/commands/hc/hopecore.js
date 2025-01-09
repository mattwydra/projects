const { SlashCommandBuilder } = require('discord.js');
console.log("hopecore.js - Started");

// Setup canvas and image processing
const { createCanvas, loadImage } = require('canvas');
console.log("hopecore.js - Canvas and image libraries loaded");

const fs = require('fs');
const path = require('path');

// Paths for images and quotes
const regularImagePath = path.join(__dirname, '..', '..', 'static', 'assets', 'hc');
console.log("hopecore.js - Regular image path set:", regularImagePath);

const specialImagePath = path.join(__dirname, '..', '..', 'static', 'assets', 'daily-reminder-that-you-will-have-this');
console.log("hopecore.js - Special image path set:", specialImagePath);

const quotes = fs.readFileSync('./quotes.txt', 'utf8').split('\n').filter(line => line.trim() !== '');
console.log("hopecore.js - Quotes loaded:", quotes.length);

// Helper function to pick a random image
function getRandomImage(folderPath) {
    console.log("hopecore.js - Getting random image from:", folderPath);
    const files = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    if (files.length === 0) throw new Error(`No images found in ${folderPath}`);
    const randomFile = files[Math.floor(Math.random() * files.length)];
    console.log("hopecore.js - Selected image:", randomFile);
    return path.join(folderPath, randomFile);
}

// Helper function to generate the image
async function generateImage(quote) {
    console.log("hopecore.js - Generating image for quote:", quote);
    const isSpecialQuote = quote.trim().toLowerCase() === 'daily reminder that you will have this';
    const folderPath = isSpecialQuote ? specialImagePath : regularImagePath;
    console.log("hopecore.js - Image folder path:", folderPath);

    const randomImagePath = getRandomImage(folderPath);
    console.log("hopecore.js - Random image path:", randomImagePath);

    const image = await loadImage(randomImagePath);
    const canvas = createCanvas(image.width, image.height + 100);
    const ctx = canvas.getContext('2d');

    // Draw text and image
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(quote, canvas.width / 2, 50);
    ctx.drawImage(image, 0, 100);

    console.log("hopecore.js - Image generated successfully.");
    return canvas.toBuffer();
}

// Export the necessary variables and functions
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hopecore_test_3')
        .setDescription('Get a random hopecore image with a quote.'),
    async execute(interaction) {
        console.log("hopecore.js - Executing hopecore_test_3 command.");

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        console.log("hopecore.js - Selected random quote:", randomQuote);

        const imageBuffer = await generateImage(randomQuote);
        await interaction.reply({
            files: [{ attachment: imageBuffer, name: 'hopecore.png' }],
        });

        console.log("hopecore.js - Image sent.");
    },
    quotes, // Export the quotes array
    generateImage, // Export the generateImage function
};
