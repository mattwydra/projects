require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// Load the quotes from the text file
let quotes = [];
try {
  const fileContent = fs.readFileSync('./quotes.txt', 'utf8');
  quotes = fileContent.split('\n').filter(line => line.trim() !== '');
  console.log(`Loaded ${quotes.length} quotes from quotes.txt`);
} catch (error) {
  // If you're getting an error, ensure you have quotes.txt called correctly. Check file paths.
  console.error('Error loading quotes:', error);
  process.exit(1);
}


// Initialize the bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Helper function to generate the image
async function generateImage(quote) {
  // Load the image
  const image = await loadImage('path/to/image.jpg');
  const imageWidth = image.width;
  const imageHeight = image.height;

  // Set text properties
  const ctxFont = 'bold 24px Arial';
  const ctx = createCanvas(1, 1).getContext('2d'); // Temporary context to measure text
  ctx.font = ctxFont;

  const lineHeight = 30;
  const maxTextWidth = imageWidth - 40; // 20px padding on each side

  // Split the quote into lines
  const words = quote.split(' ');
  let lines = [];
  let currentLine = '';

  for (let word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width: testLineWidth } = ctx.measureText(testLine);

    if (testLineWidth > maxTextWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Calculate the height of the white bar
  const barHeight = 90 + (lines.length - 1) * lineHeight;

  // Create canvas based on image and bar height
  const canvas = createCanvas(imageWidth, imageHeight + barHeight);
  const canvasCtx = canvas.getContext('2d');

  // Draw the white bar at the top
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0, 0, imageWidth, barHeight);

  // Draw the text on the white bar
  canvasCtx.fillStyle = 'black';
  canvasCtx.font = ctxFont;
  canvasCtx.textAlign = 'center';

  lines.forEach((line, index) => {
    canvasCtx.fillText(line, imageWidth / 2, 50 + index * lineHeight);
  });

  // Draw the image below the white bar
  canvasCtx.drawImage(image, 0, barHeight, imageWidth, imageHeight);

  return canvas.toBuffer(); // Return the complete canvas as a buffer
}
// When the bot is ready
client.once('ready', () => {
  console.log('Hopecore Bot is online!');
});

// Listen for slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'hopecore') {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const imageBuffer = await generateImage(randomQuote);

    await interaction.reply({
      files: [{ attachment: imageBuffer, name: 'hopecore.png' }]
    });
  }
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
