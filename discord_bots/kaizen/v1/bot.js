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
    "your time is limited. don't waste it living someone else's life",
    "the future belongs to those who believe in the beauty of their dreams",
    "the best revenge is great success",
    "failure is not a sign of defeat, but a stepping stone towards growth and success",
    "one of the deep secrets of life is the only things worth doing are the things we do for others -nully",
    "a bend in the road is not the end of the road... unless you fail to make the turn",
    "if the ship doesn't come in, swim out to it",
    "you have to believe in yourself when no one else does. that's what makes you a winner",
    "the ones who want it are gonna get it",
    "lazy people do the least and expect great results. great people do everything and still fear it isn't enough",
    "life begins at the end of your comfort zone",
    "opportunities don't happen; you create them",
    "the road to success and the road to failure are almost exactly the same",
    "perseverance is not a long race; it is many short races one after the other",
    "a smooth sea never made a skilled sailor",
    "success is where preparation meets opportunity",
    "practice gratitude daily; for it is the key to finding contentment and abundance",
    "success usually comes to those who are too busy to be looking for it",
    "you are never really playing an opponent. you are playing yourself, your own highest standards, and when you reach your limits, that is real joy",
    "it always seems impossible until it is done",
    "it's not mutually exclusive to believe in yourself while still being humble. confidence is about believing in your abilities and potential, while humility is about recognizing that you're not perfect and being open to learning and growth",
    "potential is only the expression of a possibility; something that can be assessed accurately only in retrospect. in other words, you'll never know how good you might've become unless you try",
    "let your past experiences serve as a reminder of your resilience rather than evidence of an unsafe world. life isn't trying to break you down. it's trying to break you open",
    "we don't always get the chance to make someone feel loved. so when you do, make sure you do it",
    "when things are bad, be on each others sides more than at each others throats",
    "you wouldn't have learned to ride a bike if someone you trusted hadn't let you go",
    "you can't pick up the same book twice and expect a different ending",
    "you can't change the cards that you were dealt, but you can choose how to play them",
    "the best time to plant a tree was years ago. the second best time is now",
    "comparison is the thief of joy. focus on your own journey and celebrate your progress",
    "only difference between giving up and a setback is the latter you keep going",
    "if you give up on your dreams, what do you have left?",
    "every time you rise after falling, you are rewriting the story that says you weren't meant to survive",
    "your windshield is bigger than your rearview mirror for a reason",
    "what is better? to be born good, or to overcome your evil nature through great effort?",
    "you don't need to see the path through the forest, you only need to see your first step",
    "a bird on a branch does not fear the branch breaking, as its trust lies not in the branch but in its own wings",
    "to be successful at anything, the truth is you don't have to be special. you just have to be what most people aren't: consistent, determined and willing to work for it",
    "'you should love your neighbors and hate your enemies.' you've heard this to be a good and righteous thing. and yet, i say unto you now: love your enemies. do good to those that hate you. pray for those who persecute you. so that you may be sons of your Father who is in heaven. for, he saw to it that His sun would rise on both the evil and the good",
    "the day after you quit could be the day you succeed",
    "it's better to try and to fail than to not try at all",
    "when you focus on you, you grow. when you focus on shit, shit grows",
    "when you can't get through the door, try a window. the path isn't the same for everyone",
    "trying your best is always good enough",
    "the more you dwell on your past, the more you are taken out of the present",
    "yesterday is history, tomorrow is a mystery, and today is a gift... that is why they call it the present",
    "you gotta take a risk, or you'll be doing the same shit forever",
    "the greatest pleasure in life is doing what other people say you cannot do",
    "don't watch the clock; do what it does. keep going",
    "if you want to go fast, go alone. if you want to go far, go together",
    "a comfort zone is a beautiful place, but nothing ever grows there",
    "you can't put a limit on anything. the more you dream, the farther you get",
    "the only time that success comes before work is in the dictionary",
    "you don't have to be great to start. but you have to start to be great",
    "the only limits in life are the ones you make",
    "all hard work brings a profit, but mere talk leads only to poverty",
    "the only guarantee for failure is to stop trying",
    "if you want something you've never had, you have to be willing to do something you've never done",
    "nothing changes if nothing changes",
    "obstacles don't have to stop you. if you run into a wall, don't turn around and give up. figure out how to climb it, go through it, or work around it",
    "hard work beats talent when talent doesn't work hard",
    "conformity is the jailer of freedom and the enemy of growth",
    "opportunity does not knock -- it presents itself when you break down the door",
    "the secret of getting ahead is getting started",
    "the difference between a stumbling block and a stepping stone is how high you raise your foot",
    "failure is a detour, not a dead-end street",
    "the best way to predict the future is to create it",
    "some people dream of success, while others wake up and work hard for it",
    "opportunities are like sunrises. if you wait too long, you miss them",
    "perseverance is the hard work you do after you get tired of the hard work you already did",
    "the only limit to our realization of tomorrow will be our doubts of today",
    "you are never too old to set another goal or dream a new dream",
    "many of life's failures are people who did not realize how close they were to success when they gave up",
    "your life does not get better by chance, it gets better by change",
    "small minds try to disparage your ambitions. but great minds will give you the feeling that you can become great too",
    "the difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will",
    "if you don't build your dream, someone else will hire you to build theirs",
    "the day will come when the risk to remain tight in a bud is greater and more painful than the risk it will take to blossom",
    "failure is only the opportunity to begin again. only this time, more wisely",
    "the only way to discover the limits of the possible is to go beyond them into the impossible",
    "the only person you should try to be better than is the person you were yesterday",
    "the journey of a thousand miles begins with a single step",
    "only those willing to risk going too far can possibly find out how far one can go",
    "the only person you are destined to become is the person you decide to be",
    "if you want to achieve greatness, stop asking for permission",
    "if you want to change your life, change your thoughts",
    "a wise man learns from his mistakes, but a wiser man learns from the mistakes of others",
    "life is too short to hold onto grudges; choose forgiveness and let go of bitterness",
    "it's never too late to be what you might have been",
    "he who jumps into the void owes no explanation to those who stand and watch",
    "don't be pushed around by the fears in your mind. be led by the dreams in your heart",
    "let your smile change the world, but don't let the world change your smile",
    "pride is not the opposite of shame, but its source. true humility is the only antidote to shame",
    "life happens wherever you are, whether you make it or not",
    "it's time for you to look inward and start asking yourself the big questions: who are you? and what do you want?",
    "it is important to draw wisdom from many different places. if we take it from only one place, it becomes rigid and stale. understanding others will help you to become whole",
    "the person who says it cannot be done should not interrupt the person who is doing it",
    "shoot for the moon and if you miss you will still be among the stars",
    "dreams are useless if they stay on the pillow",
    "we can complain that rose bushes have thorns. or, we can be happy that thorn bushes have roses",
    "don't light yourself on fire to keep others warm",
    "cold hands feel warm when you're freezing",
    "a piano has 88 keys. they all look the same, but can sound very different",
    "the day you plant the seed is not the day you eat the fruit",
    "stars only shine in the darkness",
    "even the prettiest of diamonds needed to be subjected to immense pressure",
    "don't let someone who hasn't been in your shoes tell you how to tie your laces",
    "when a blind man gets his vision, the first thing he will do is throw away the stick that helped him his whole life",
    "if the sun was afraid to burn people, it wouldn't shine",
    "you can't sprint to success if you tiptoe around failure",
    "the only thing worse than being blind is having sight but no vision",
    "the tallest buildings took the longest to build",
    "feeling defeated is just your heart telling you to work harder",
    "give your heart but keep your head",
    "if you pray for flowers, don't get mad when it starts raining",
    "you have to have a little bit of rain to have a little bit of rainbow",
    "the only impossible journey is the one that never started",
    "if you give it your all, you will never have to wonder, 'what if...?'",
    "feeling lost in life is like making a wrong turn. you can always get back on the right path",
    "when it's warm, you want cold. when it's cold, you want warm. enjoy every second; good or bad",
    "you have to turn over a page to get to the next chapter",
    "the best view comes after the highest climb",
    "the man who enjoys walking will walk further than the man who enjoys the destination",
    "even flowers need rainy days to grow",
    "let your dreams shape the world, but don't let the world shape your dreams",
    "waste no more time arguing about what a good man should be. be one",
    "your true self is shown through how you act",
    "you're not a bad person for the ways you tried to kill your sadness",
    "self improvement isn't about becoming perfect. it's about becoming a better person",
    "if you went back and erased all your mistakes, you'd erase yourself",
    "a strong person doesn't bring others down. they lift others up",
    "just because you love the ocean doesn't mean you should drown in it",
    "worrying doesn't take away tomorrow's troubles, it takes away today's peace",
    "if all you have is 10% and you give 10%... you gave 100%",
    "you have to live in your head forever. just make it a peaceful place to be",
    "don't worry about what hasn't happened. it will be a great experience or a great lesson",
    "be kind. you never know what others are dealing with",
    "if you focus on others too much, you'll slowly forget who you are",
    "don't be upset by disrespect from people you don't respect. it reveals more about them than it does about you",
    "the quieter you become, the more you can hear",
    "one day you will look back and know exactly why it had to happen",
    "there is no 'right' time. just time, and what you do with it",
    "one bad chapter doesn't mean your story is over",
    "closed doors are just as important as open ones",
    "letting go is hard, but being free is beautiful",
    "don't offer a lecture to a person who needs a hug",
    "what leaves was never meant to stay",
    "sunsets are proof that endings can be beautiful too",
    "as long as you have yourself, you're never truly alone",
    "a good man is hard on himself, not on others",
    "your past mistakes are there to guide you. not to define you",
    "don't go back to less because you're too impatient to wait for better",
    "time is precious; use it wisely and prioritize what truly matters to you",
    "the only easy day was yesterday",
    "you have to expect things of yourself before you can do them",
    "there is no elevator to success. you have to take the stairs",
    "if you're not willing to learn, no one can help you. if you're determined to learn, no one can stop you",
    "one day, you'll be the best thing that ever happened to someone. until then, be the best for yourself",
    "love yourself first, because that's who you'll be spending the rest of your life with",
    "nurture the garden within you before inviting others to admire it",
    "you are your longest commitment. treat yourself with the love and care you deserve",
    "you're either all in or you're nowhere. half-effort leaves you with half of nothing",
    "the wolves of ambition don't hunt in packs of hesitation",
    "purpose isn't found, it's created by what you're willing to sacrifice for",
    "the direction you seek is already inside you; it's just buried beneath excuses",
    "you'll only find your way when you stop fearing getting lost",
    "what you're looking for won't be found by waiting -- you need to create it",
    "until death, all defeat is psychological",
    "you may have to fight a battle more than once to win",
    "you cannot cross the ocean without the courage to lose sight of the shore",
    "you're holding the map. but if you never take a step, you'll be lost in the same place forever",
    "it's not the weight that breaks you, but the way you choose to carry it",
    "the real prison isn't the one with walls, it's the one you build in your mind",
    "a man isn't great because he hasn't failed; a man is great because failure hasn't stopped him",
    "you must choose between two pains: the pain of discipline or the pain of regret",
    "a river cuts through rock not because of its power, but because of its persistence",
    "man cannot remake himself without suffering, for he is both the marble and the sculptor"
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