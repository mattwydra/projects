require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started deleting application (/) commands.');

        // Delete global commands
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] },
        );
        console.log('Successfully deleted all global commands.');

        // Delete guild-specific commands (if any)
        const guildId = process.env.GUILD_ID; // Replace with your guild ID or add to .env
        if (guildId) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: [] },
            );
            console.log('Successfully deleted all guild commands.');
        }

    } catch (error) {
        console.error('Error deleting commands:', error);
    }
})();
