const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const { loadCommands } = require('./commands/commandManager');
const { handleInteraction } = require('./events/interactionHandler');
const { setupReadyEvent } = require('./events/readyHandler');
const config = require('../config/config.json');

// Constants
const REQUIRED_INTENTS = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers
];

// Error messages
const ERRORS = {
  TOKEN_MISSING: 'Error: Token is missing in config.json',
  UNKNOWN_COMMAND: 'Unknown command.',
  COMMAND_ERROR: 'An error occurred while processing the command.'
};

class Bot {
  constructor() {
    this.client = new Client({ intents: REQUIRED_INTENTS });
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Ready event
    this.client.once(Events.ClientReady, () => setupReadyEvent(this.client));

    // Interaction event
    this.client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isCommand()) return;

      try {
        await handleInteraction(interaction);
      } catch (error) {
        console.error('Error handling command:', error);
        await this.handleError(interaction, error);
      }
    });
  }

  async handleError(interaction, error) {
    const errorMessage = interaction.replied || interaction.deferred
      ? { content: ERRORS.COMMAND_ERROR, ephemeral: true }
      : { content: ERRORS.COMMAND_ERROR, ephemeral: true };

    try {
      await interaction.reply(errorMessage);
    } catch (e) {
      console.error('Error sending error message:', e);
    }
  }

  async start() {
    try {
      // Load commands
      await loadCommands(this.client);

      // Login
      if (!config.token) {
        throw new Error(ERRORS.TOKEN_MISSING);
      }

      await this.client.login(config.token);
    } catch (error) {
      console.error('Failed to start bot:', error);
      process.exit(1);
    }
  }
}

// Create and start the bot
const bot = new Bot();
bot.start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 