# Kaizen Discord Bot

A personal productivity Discord bot designed to help you track daily goals, wins, gratitude, and reflections. Built with the philosophy of continuous improvement (kaizen), this bot provides a structured way to manage your daily growth journey.

## Features

- **Automated Daily Prompts** - Automatically sends a fresh kaizen board every day at 6 AM
- **Live Progress Tracking** - Real-time updates to your daily progress embed
- **Comprehensive Goal Management** - Track 6 daily tasks, 3 types of wins, gratitude, and reflections
- **Motivational Quotes** - 200+ inspirational quotes randomly displayed
- **Interactive Commands** - Easy-to-use slash commands for all interactions
- **Visual Progress Indicators** - Clear ✅/❌ status for all tracked items

## Setup

### Prerequisites

- Node.js
- A Discord bot token
- A Discord server where you have permission to add bots

### Installation

1. **Clone or download this project**
   ```
   git clone [your-repo-url]
   cd kaizen-bot
   ```

2. **Install dependencies**
   ```
   npm init -y
   npm install discord.js node-cron
   ```

3. **Configure the bot**
   - Replace `YOUR_BOT_TOKEN_HERE` with your actual Discord bot token
   - Update the `CHANNEL_ID` to your desired channel ID

4. **Create your Discord bot**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to "Bot" section and create a bot
   - Copy the token and paste it in the code
   - Under "OAuth2" → "URL Generator", select "bot" and "applications.commands" scopes
   - Select necessary permissions (Send Messages, Use Slash Commands, etc.)
   - Use the generated URL to invite the bot to your server

5. **Run the bot**
   ```
   node bot.js
   ```

## Commands

### Setting Up Your Day
- `/settask [1-6] [task description]` - Set one of your 6 daily tasks
- `/setwin [physical/spiritual/mental] [win description]` - Set your daily wins
- `/gratitude [1-2] [message]` - Add gratitude items (2 total)
- `/reflect [reflection]` - Add your daily reflection

### Tracking Progress
- `/finishtask [1-6]` - Mark a task as completed ✅
- `/finishwin [physical/spiritual/mental]` - Mark a win as completed ✅
- `/progress` - View your current progress (ephemeral)

### Utility
- `/newday` - Manually start a new day
- Bot automatically resets at 6 AM daily

## Daily Structure

The bot tracks:

### 📋 Daily Tasks (6 items)
- Six actionable tasks you want to complete today
- Each can be marked as complete with `/finishtask`

### 🏆 Daily Wins (3 categories)
- **Physical Win** - Exercise, health, physical achievement
- **Spiritual Win** - Meditation, prayer, spiritual growth
- **Mental Win** - Learning, problem-solving, mental challenge

### 🙏 Gratitude (2 items)
- Two things you're grateful for today
- Helps maintain a positive mindset

### 💭 Daily Reflection
- End-of-day reflection on your progress, learnings, or thoughts
- Space for introspection and planning

## Customization

### Changing the Schedule
The bot automatically sends a new daily prompt at 6 AM. To change this, modify the cron schedule:

```
// Current: 6 AM daily
cron.schedule('0 6 * * *', () => {
    sendDailyPrompt();
});

// Example: 8 AM daily
cron.schedule('0 8 * * *', () => {
    sendDailyPrompt();
});
```

### Adding More Quotes
The bot includes 200+ motivational quotes. To add more, simply add them to the `quotes` array in the code.

### Changing the Channel
Update the `CHANNEL_ID` constant to your desired channel ID.

## File Structure

```
kaizen-bot/
├── bot.js              # Main bot file
├── package.json        # Dependencies
├── README.md           # This file
└── quotes.txt          # Quote collection (reference)
```

## Contributing

This is a personal productivity bot, but feel free to:
- Fork and customize for your needs
- Add new features
- Improve the code structure
- Share your improvements

## Future Enhancements

Potential features to add:
- [ ] Data persistence (save progress to JSON/database)
- [ ] Weekly/monthly summaries
- [ ] Streak tracking
- [ ] DM functionality
- [ ] Multiple user support
- [ ] Custom reminder times
- [ ] Progress analytics
- [ ] Export capabilities

## Troubleshooting

### Bot not responding
- Check if the bot is online in your server
- Verify the bot has necessary permissions
- Check console for error messages

### Commands not working
- Ensure commands are properly registered (check console on startup)
- Verify bot has "Use Slash Commands" permission
- Try restarting the bot

### Daily prompt not sending
- Check the cron schedule format
- Verify the channel ID is correct
- Ensure bot has permission to send messages in the channel

*Built with the philosophy of continuous improvement. One day at a time. 🌱*
