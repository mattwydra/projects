require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Clearing all commands...');

        // Clear global commands
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: [],
        });
        console.log('Cleared global commands.');

        // Clear guild-specific commands (if applicable)
        const guildId = process.env.GUILD_ID; // Replace with your guild ID or add to .env
        if (guildId) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: [] }
            );
            console.log(`Cleared commands for guild: ${guildId}`);
        }
    } catch (error) {
        console.error('Error clearing commands:', error);
    }
})();
