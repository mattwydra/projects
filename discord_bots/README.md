# Hopecore Bot

The Hopecore bot is a somewhat simple bot. you run the /hopecore command, and it sends back a nice quote to help keep life in perspective, overlayed on an image of Miyamoto Musashi. Hopecore is a beautiful thing. I will create an in-depth explanation eventually, but in short, it's a movement to help young people keep things in perspective.

## Features

- Miyamoto Musashi image display
- Inspirational quote overlay at the top
- Lightweight and easy to set up

## Installation

1. **Prerequisites:**
   - Ensure you have node.js and npm installed on your machine. I will go over more details on how to install them in section 3 if you need assistance.

2. **Clone the Repository:**

   ```
   git clone https://github.com/your-username/projects/discord_bots.git
   ```

3. **Install Dependencies:**

   Ensure that you have [nodejs](https://nodejs.org) installed. to check if they are installed, run:
   ```
   node -v
   npm -v
   ```

   If npm is returning an error regarding execution policies, use the following command:

   ```
   Get-ExecutionPolicy
   ```
   
   If this returns "Restricted" then you will have to find a workaround. I will show you mine, but do your own research before messing with your perms. Furthermore, ensure that you set them back to "Restricted" after you install the dependencies. This might not be necessary, but to be safe, I recommend it.

   The workaround I found is as follows:

   ```
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

   try running ```npm -v``` again. If you're still getting an error, then check to see if you installed npm properly. If you didn't get any errors, you're ready to install dependencies.

   In the project directory, run the following commands to install necessary dependencies:

   ```
   npm install
   npm install canvas
   npm install dotenv
   ```

4. **Setup:**
   - Create a `.env` file in the root of the project.
   - Populate it with your Discord bot token and client ID like this:

   ```
   DISCORD_TOKEN=[your-bot-token]
   CLIENT_ID=[your-client-id]
   ```

   Replace `[your-bot-token]` and `[your-client-id]` with the actual values you get from the [Discord Developer Portal](https://discord.com/developers/applications).

   Finally, run
   ```
   node deploy-commands.js 
   ```
   NOTE: this only needs to be done once to set up the command for the bot. If you add more commands later, you will need to run this command again.

## Running the Bot

After setting up your `.env` file, you can run the bot with:

```
node index.js
```

This will start the bot. you should see the message "Hopecore Bot is online!" 

Then, use the /hopecore command to retrieve your image!

## Limitations & Notes

- The bot currently works great 90% of the time. However, for long quotes, the text may not wrap correctly. There is no support yet for wrapping canvas text, but this is a future feature that will improve the bot's appearance and functionality.
  
- **Please note**: Make sure to keep your bot's token secure and never push it to a public repository.
