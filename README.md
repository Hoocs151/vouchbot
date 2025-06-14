# Basic VouchBot Shop

A Discord bot for managing vouches and reviews.

## Preview

### Vouch Display
![Vouch Display](https://cdn.discordapp.com/attachments/1255155199329177672/1383195214830764182/image.png?ex=684de86d&is=684c96ed&hm=cd553e183cde2841a97e4db99bf04097614a3de72217ed2e644a4ad1812d56aa&)
*How vouches appear in the designated channel*

### Command Interface
![Command Interface](https://cdn.discordapp.com/attachments/1255155199329177672/1383195308825120830/image.png?ex=684de884&is=684c9704&hm=323e2b301c549a1be38056b72e9c5b4bdbb4dffb93730c80268204afe75df129&)
*The /vouch command interface with all options*

## Features

- Submit vouches with ratings and reviews
- Support for image attachments
- Restore vouches from backup
- Clean and modern embed design
- Rate limiting protection
- Exclusive owner commands

## Project Structure

```
vouchbot/
├── src/
│   ├── commands/         # Command definitions and management
│   ├── events/           # Event handlers
│   ├── services/         # Business logic and services
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── data/            # Data storage
│   └── index.js         # Main application entry point
├── package.json
└── README.md
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vouchbot.git
   cd vouchbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the bot:
   - Copy `src/config/config.json.example` to `src/config/config.json`
   - Fill in your bot token and other configuration:
     - `token`: Your Discord bot token
     - `clientId`: Your bot's client ID
     - `guildId`: Your server's ID
     - `vouchChannelId`: ID of the channel where vouches will be posted
     - `ownerId`: Your Discord user ID

4. Start the bot:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Commands

- `/vouch` - Submit a new vouch review
  - `review`: Your review text (max 1000 characters)
  - `stars`: Rating (1-5 stars)
  - `attachment`: Optional image attachment
- `/restore` - Restore all vouches (Owner only)

## Security

- Never commit your `config.json` file
- Keep your bot token secure
- The bot uses rate limiting to prevent spam

## License

This project is private and exclusive. Unauthorized use or distribution is prohibited.

If you find this project useful, consider giving it a star on GitHub! ⭐
