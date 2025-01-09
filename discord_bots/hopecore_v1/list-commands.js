require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Fetching application (/) commands.');

        // Fetch global commands
        const globalCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );
        console.log('Global Commands:', globalCommands);

        // Fetch guild-specific commands (if any)
        const guildId = process.env.GUILD_ID; // Replace or add to .env
        if (guildId) {
            const guildCommands = await rest.get(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId)
            );
            console.log('Guild Commands:', guildCommands);
        }
    } catch (error) {
        console.error('Error fetching commands:', error);
    }
})();
