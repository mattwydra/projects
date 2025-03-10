# Highscore Manager

## Overview
This project is a highscore management system designed for games and mini-projects. It evolves from local storage to connected hosting and includes advanced features like global leaderboards and bot integrations.

## Features
- **Manual Input**: Users can create their own highscore sheets locally.
- **Local Storage**: Save and manage highscores locally using SQLite.
- **Cloud Hosting**: Host highscores online for better accessibility.
- **Dedicated hosting from my (owner of this repo) machine.
- **Advanced Integrations**: Compare scores, integrate with bots, and create leaderboards.

## Versioning Roadmap

#### Version 0.x: Manual Features
- **v0.1**: Will require users to manually create and manage their own highscore sheet (e.g., a CSV file or Excel sheet).
  - Provide instructions for creating a simple sheet locally.
  - Updating and storing highscores will be handled by my coding, but they will need to go through the setup.
- **v0.2**: Introduce a script to parse and display data from the user-created sheet.
  - Read scores from the file and display them in the console.
  - Validate the format of the file to ensure compatibility.

#### Version 1.x: Local Features
- **v1.0**: Enable local highscore storage using SQLite.
  - Users can save their highscores directly on their machine.
  - Scores persist between sessions.
- **v1.1**: Add delete/reset functionality.
  - Users can manually delete or reset their highscores.
- **v1.2**: Create a basic user interface (UI) for highscore management.
  - View, edit, and organize highscores in a simple interface.

#### Version 2.x: Connected Features
- **v2.0**: Implement temporary hosting on Render or a similar platform.
  - Allow users to access their highscores online while the database is being hosted.
- **v2.1**: Migrate to a cloud-based hosting solution.
  - Provide better uptime and reliability.

#### Version 3.x: Building My Own Server for Hosting
- **v3.0**: Hosting the database on my own machine for constant uptime
  - Allow users to access their highscores 
- **v3.1**: Prepare server for advanced functionality (explained in version 4.x)
  - Integration of Discord Bots and migration to a dedicated machine for server uptime will likely require prep work

#### Version 4.x: Advanced Server Functionality
- **v4.0**: Introduce score comparison.
  - Allow users to compare their scores with others.
- **v4.1**: Integrate with Discord Bots
  - Allow for games to be played in discord instances
  - Allow functionality for other types of bots (simple moderation, etc.) to run on the server with constant uptime
- **v4.2**: Leaderboard accessible by Discord Bots in Discord app
  - Allow for users to save their scores and access the leaderboard all within Discord 

#### Version 5.x: Final Version
- **v5.0**: Create cloud/web-based backups as fail-safes in the event of power-loss
  - Will allow for continuous uptime, so that users anywhere (at anytime) can rely on accessibility.

## Getting Started
### Prerequisites
- Python 3.x
- SQLite

### Setup 
(CURRENTLY NON-FUNCTIONAL) Will change with each version release. After version 1.0, there should be no legwork required on the user's end, aside from adding a Discord Bot to your server (which is only needed if you want discord functionality. Planned release is version 4.0 for Discord integration). 
1. Clone the repository.
2. Install dependencies using `pip install -r requirements.txt`.
3. Ensure you are in the [correct directory](.)
4. Run the application with `python database.py`.

Thank you for trying out my service!
