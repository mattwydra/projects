require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands from the `commands/hc` folder
const commandsPath = path.join(__dirname, 'commands/hc');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log("index.js - Command files loaded:", commandFiles);

const { quotes, generateImage } = require('./commands/hc/hopecore'); // Adjusted to use the export

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
  console.log(`index.js - Command loaded: ${command.data.name}`);
}

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('interactionCreate', async (interaction) => {
  console.log('index.js - Received interaction:', interaction.commandName);

  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'hopecore') {
    console.log('index.js - Hopecore command triggered.');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const imageBuffer = await generateImage(randomQuote);
    console.log('index.js - Image generated for hopecore command.');

    await interaction.reply({
      files: [{ attachment: imageBuffer, name: 'hopecore.png' }]
    });
  }
  else if (interaction.commandName === 'hopecore_test_3') {
    console.log('index.js - hopecore_test_3 command triggered.');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log('index.js - hopecore_test_3 quote found.');
    const imageBuffer = await generateImage(randomQuote);
    console.log('index.js - hopecore_test_3 image generated.');

    await interaction.reply({
      files: [{ attachment: imageBuffer, name: 'hopecore.png' }]
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
