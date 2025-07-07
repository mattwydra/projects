const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Bot configuration
const TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHANNEL_ID = 'CHANNEL_ID';

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load quotes
const quotes = [
    "every thing will be okay in the end. if it isn't okay, it isn't the end",
    "sometimes, when we're surrounded by darkness, we feel like we've been buried. but we've actually been planted",
    "a flower does not think of competing with the flower next to it. it just blooms",
    "a candle loses nothing by lighting another candle",
    "a knight in shining armor has never had his armor truly tested",
    "God gives his toughest tasks to His strongest soldiers",
    "keep your face always toward the sunshine—and shadows will fall behind you",
    "act as if what you do makes a difference. it does",
    "success is not final, failure is not fatal: it is the courage to continue that counts",
    "believe you can and you're halfway there",
    "growing up, you deal with the ramifications of other people's choices. don't blame yourself for how you stifled the pain",
    "hardships often prepare ordinary people for an extraordinary destiny",
    "your mind is a garden that God gave you. do not allow bad seeds to take root, and you must nurture the good seeds",
    "i hope you live a life that you're proud of. if you find you're not, i hope you have the strength to start over again",
    "if you don't stand for something, you'll fall for everything",
    "the moment that you feel that, just possibly, you're walking down the street naked, exposing too much of your heart and your mind and what exists on the inside, showing too much of yourself. that's the moment you may be starting to get it right",
    "don't be afraid to give up the good to go for the great",
    "the expert in anything was once a beginner",
    "ask not for a lighter burden, but for broader shoulders",
    "your time is limited. don't waste it living someone else's life"
];

// Daily data storage
let dailyData = {
    date: '',
    tasks: ['', '', '', '', '', ''],
    taskStatus: [false, false, false, false, false, false],
    wins: {
        physical: { text: '', completed: false },
        spiritual: { text: '', completed: false },
        mental: { text: '', completed: false }
    },
    gratitude: ['', ''],
    reflection: '',
    messageId: null
};

// Reset daily data
function resetDailyData() {
    dailyData = {
        date: new Date().toLocaleDateString(),
        tasks: ['', '', '', '', '', ''],
        taskStatus: [false, false, false, false, false, false],
        wins: {
            physical: { text: '', completed: false },
            spiritual: { text: '', completed: false },
            mental: { text: '', completed: false }
        },
        gratitude: ['', ''],
        reflection: '',
        messageId: null
    };
}

// Get random quote
function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Create progress embed
function createProgressEmbed() {
    const embed = new EmbedBuilder()
        .setTitle('📈 Daily Kaizen Progress')
        .setDescription(`**Date:** ${dailyData.date}`)
        .setColor('#4CAF50')
        .setFooter({ text: getRandomQuote() });

    // Tasks section
    let tasksText = '';
    for (let i = 0; i < 6; i++) {
        const status = dailyData.taskStatus[i] ? '✅' : '❌';
        const task = dailyData.tasks[i] || 'Not set';
        tasksText += `${status} **Task ${i + 1}:** ${task}\n`;
    }
    embed.addFields({ name: '📋 Daily Tasks', value: tasksText, inline: false });

    // Wins section
    const physicalStatus = dailyData.wins.physical.completed ? '✅' : '❌';
    const spiritualStatus = dailyData.wins.spiritual.completed ? '✅' : '❌';
    const mentalStatus = dailyData.wins.mental.completed ? '✅' : '❌';

    const winsText = `${physicalStatus} **Physical:** ${dailyData.wins.physical.text || 'Not set'}\n${spiritualStatus} **Spiritual:** ${dailyData.wins.spiritual.text || 'Not set'}\n${mentalStatus} **Mental:** ${dailyData.wins.mental.text || 'Not set'}`;
    embed.addFields({ name: '🏆 Daily Wins', value: winsText, inline: false });

    // Gratitude section
    const gratitudeText = `**1.** ${dailyData.gratitude[0] || 'Not set'}\n**2.** ${dailyData.gratitude[1] || 'Not set'}`;
    embed.addFields({ name: '🙏 Gratitude', value: gratitudeText, inline: false });

    // Reflection section
    const reflectionText = dailyData.reflection || 'Not set';
    embed.addFields({ name: '💭 Daily Reflection', value: reflectionText, inline: false });

    return embed;
}

// Update progress message
async function updateProgressMessage() {
    if (!dailyData.messageId) return;

    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        const message = await channel.messages.fetch(dailyData.messageId);
        const embed = createProgressEmbed();
        await message.edit({ embeds: [embed] });
    } catch (error) {
        console.error('Error updating progress message:', error);
    }
}

// Send new daily prompt
async function sendDailyPrompt() {
    resetDailyData();

    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        const embed = createProgressEmbed();
        const message = await channel.send({ embeds: [embed] });
        dailyData.messageId = message.id;

        // Send instructions
        await channel.send({
            content: `**🌟 Daily Kaizen Commands:**
\`/settask [1-6] [task description]\` - Set a daily task
\`/setwin [physical/spiritual/mental] [win description]\` - Set a daily win
\`/finishtask [1-6]\` - Mark a task as completed
\`/finishwin [physical/spiritual/mental]\` - Mark a win as completed
\`/gratitude [1-2] [message]\` - Add gratitude (1 or 2)
\`/reflect [reflection]\` - Add daily reflection
\`/progress\` - Show current progress
\`/newday\` - Start a new day manually`
        });

    } catch (error) {
        console.error('Error sending daily prompt:', error);
    }
}

// Commands
const commands = [
    new SlashCommandBuilder()
        .setName('settask')
        .setDescription('Set a daily task')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Task number (1-6)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(6))
        .addStringOption(option =>
            option.setName('task')
                .setDescription('Task description')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('setwin')
        .setDescription('Set a daily win')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Win type')
                .setRequired(true)
                .addChoices(
                    { name: 'Physical', value: 'physical' },
                    { name: 'Spiritual', value: 'spiritual' },
                    { name: 'Mental', value: 'mental' }
                ))
        .addStringOption(option =>
            option.setName('win')
                .setDescription('Win description')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('finishtask')
        .setDescription('Mark a task as completed')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Task number (1-6)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(6)),

    new SlashCommandBuilder()
        .setName('finishwin')
        .setDescription('Mark a win as completed')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Win type')
                .setRequired(true)
                .addChoices(
                    { name: 'Physical', value: 'physical' },
                    { name: 'Spiritual', value: 'spiritual' },
                    { name: 'Mental', value: 'mental' }
                )),

    new SlashCommandBuilder()
        .setName('gratitude')
        .setDescription('Add gratitude')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Gratitude number (1-2)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(2))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('What are you grateful for?')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('reflect')
        .setDescription('Add daily reflection')
        .addStringOption(option =>
            option.setName('reflection')
                .setDescription('Your daily reflection')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('progress')
        .setDescription('Show current progress'),

    new SlashCommandBuilder()
        .setName('newday')
        .setDescription('Start a new day manually')
];

// Register commands
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        console.log('Registering slash commands...');
        await client.application.commands.set(commands);
        console.log('Commands registered successfully!');
    } catch (error) {
        console.error('Error registering commands:', error);
    }

    // Schedule daily prompt at 6 AM
    cron.schedule('0 6 * * *', () => {
        sendDailyPrompt();
    });

    // Send initial prompt if it's a new day
    if (!dailyData.date || dailyData.date !== new Date().toLocaleDateString()) {
        sendDailyPrompt();
    }
});

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        switch (commandName) {
            case 'settask':
                const taskNum = interaction.options.getInteger('number') - 1;
                const taskDesc = interaction.options.getString('task');
                dailyData.tasks[taskNum] = taskDesc;
                await updateProgressMessage();
                await interaction.reply({ content: `✅ Task ${taskNum + 1} set: "${taskDesc}"`, ephemeral: true });
                break;

            case 'setwin':
                const winType = interaction.options.getString('type');
                const winDesc = interaction.options.getString('win');
                dailyData.wins[winType].text = winDesc;
                await updateProgressMessage();
                await interaction.reply({ content: `✅ ${winType} win set: "${winDesc}"`, ephemeral: true });
                break;

            case 'finishtask':
                const finishTaskNum = interaction.options.getInteger('number') - 1;
                dailyData.taskStatus[finishTaskNum] = true;
                await updateProgressMessage();
                await interaction.reply({ content: `🎉 Task ${finishTaskNum + 1} completed!`, ephemeral: true });
                break;

            case 'finishwin':
                const finishWinType = interaction.options.getString('type');
                dailyData.wins[finishWinType].completed = true;
                await updateProgressMessage();
                await interaction.reply({ content: `🎉 ${finishWinType} win completed!`, ephemeral: true });
                break;

            case 'gratitude':
                const gratitudeNum = interaction.options.getInteger('number') - 1;
                const gratitudeMsg = interaction.options.getString('message');
                dailyData.gratitude[gratitudeNum] = gratitudeMsg;
                await updateProgressMessage();
                await interaction.reply({ content: `✅ Gratitude ${gratitudeNum + 1} added: "${gratitudeMsg}"`, ephemeral: true });
                break;

            case 'reflect':
                const reflection = interaction.options.getString('reflection');
                dailyData.reflection = reflection;
                await updateProgressMessage();
                await interaction.reply({ content: `✅ Daily reflection added: "${reflection}"`, ephemeral: true });
                break;

            case 'progress':
                const embed = createProgressEmbed();
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;

            case 'newday':
                await sendDailyPrompt();
                await interaction.reply({ content: '🌅 New day started! Fresh kaizen board created.', ephemeral: true });
                break;
        }
    } catch (error) {
        console.error('Error handling command:', error);
        await interaction.reply({ content: 'An error occurred while processing your command.', ephemeral: true });
    }
});

// Login
client.login(TOKEN);