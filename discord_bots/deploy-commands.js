const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();

console.log("1");

// Load the commands
const commands = [];
const commandFiles = fs.readdirSync('path/to/commands_directory').filter(file => file.endsWith('.js'));

console.log("2");

// Add each command to the commands array
for (const file of commandFiles) {
    const command = require(`path/to/commands_directory/${file}`);
    commands.push(command.data.toJSON());

    console.log("3");
}

// Create the REST instance
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

console.log("4");

const token = process.env.DISCORD_TOKEN;  // Token from your .env file. Don't forget to include this, you'll get an error
if (!token) {
    console.error('No token found!');
    process.exit(1);  // Exit the process if token is missing
}

// Deploy the commands
(async () => {
    try {
        console.log('Started refreshing application (slash) commands.');

	console.log("5");

        // Register global commands (use Routes.applicationCommands for guild-specific testing)
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID), 
            { body: commands },
        );

	console.log("6");

        console.log('Successfully reloaded application (slash) commands.');
    } catch (error) {
	console.log("g");
        console.error(error);
    }
})();

console.log("7");
