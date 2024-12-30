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
  console.error('Error loading quotes:', error);
  process.exit(1);
}


// Initialize the bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Helper function to generate the image
async function generateImage(quote) {
  const width = 900;
  const height = 900;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background image
  const backgroundImage = await loadImage('assets/musashi.jpg');
  ctx.drawImage(backgroundImage, 0, 0, width, height);

  // Add white bar at the top
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, 100);

  // Add text
  ctx.fillStyle = 'black';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  // ctx.fillText(`how i look at bro when he says\n\"${quote}\"`, width / 2, 60);
  ctx.fillText(`${quote}`, width / 2, 60);

  //handle long quotes as follows: check length. if it's over a certain length, find the part that's fine
  // and backtrack until a space is found. then, see if the remainder is fine. if not, repeat

  return canvas.toBuffer(); // Return the image as a buffer
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
