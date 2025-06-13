# VouchBot

A Discord bot for managing vouches and reviews.

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
│   └── index.js          # Main application entry point
├── package.json
└── README.md
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the bot:
   - Copy `src/config/config.json.example` to `src/config/config.json`
   - Fill in your bot token and other configuration
4. Start the bot:
   ```bash
   node src/index.js
   ```

## Commands

- `/vouch` - Submit a new vouch review
  - `review`: Your review text
  - `stars`: Rating (1-5 stars)
  - `attachment`: Optional image attachment
- `/restore` - Restore all vouches (Owner only)

## License

This project is private and exclusive. Unauthorized use or distribution is prohibited. 