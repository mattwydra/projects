const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config(); // Ensure your .env file exists and has DISCORD_TOKEN, CLIENT_ID

console.log("1 - Starting command deployment");

// Load the commands
const commands = [];
const commandFiles = fs.readdirSync('./commands/hc/').filter(file => file.endsWith('.js'));

console.log("2 - Command files loaded:", commandFiles);

// Add each command to the commands array
for (const file of commandFiles) {
    const command = require(`./commands/hc/${file}`);
    commands.push(command.data.toJSON());
    console.log(`Loaded command: ${file}`);
}

// Ensure token is available
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error('DISCORD_TOKEN not found in .env file!');
    process.exit(1);
}

// Create the REST instance
const rest = new REST({ version: '10' }).setToken(token);

console.log("3 - REST instance created");

// Deploy the commands
(async () => {
    try {
        console.log('Started refreshing application (slash) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), // Ensure CLIENT_ID exists in .env
            { body: commands },
        );

        console.log('Successfully reloaded application (slash) commands.');
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
})();
