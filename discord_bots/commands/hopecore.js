const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hopecore')
        .setDescription('Replies with a random inspirational quote.'),
    async execute(interaction) {
        // Logic for returning a random quote
        const quotes = [
            "Keep pushing forward!",
            "Every day is a chance to improve.",
            "Believe in yourself and your abilities."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        await interaction.reply(randomQuote);
    },
};
