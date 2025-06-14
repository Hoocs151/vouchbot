const { Client, GatewayIntentBits, Events, ActivityType, MessageFlags } = require('discord.js');
const { loadCommands } = require('./commands/commandManager');
const { handleInteraction } = require('./events/interactionHandler');
const { setupReadyEvent } = require('./events/readyHandler');
const config = require('./config/config.json');

// Constants
const REQUIRED_INTENTS = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers
];

// Error messages
const ERRORS = {
  TOKEN_MISSING: 'Error: Token is missing in config.json',
  UNKNOWN_COMMAND: 'Unknown command.',
  COMMAND_ERROR: 'An error occurred while processing the command.',
  INTERACTION_FAILED: 'Failed to process the interaction.',
  STARTUP_ERROR: 'Failed to initialize the bot.'
};

class Bot {
  constructor() {
    this.client = new Client({ 
      intents: REQUIRED_INTENTS,
      failIfNotExists: false, // More resilient handling of deleted messages/users
      retryLimit: 3 // Add retry mechanism for failed requests
    });
    this.setupEventHandlers();
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    process.on('unhandledRejection', (error) => {
      console.error('Unhandled promise rejection:', error);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      // Gracefully shutdown
      this.shutdown(1);
    });

    this.client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    this.client.on('warn', (warning) => {
      console.warn('Discord client warning:', warning);
    });
  }

  setupEventHandlers() {
    // Ready event
    this.client.once(Events.ClientReady, () => {
      setupReadyEvent(this.client);
      console.log(`Logged in as ${this.client.user.tag}`);
    });

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
    const errorMessage = {
      content: ERRORS.COMMAND_ERROR,
      flags: MessageFlags.Ephemeral,
      components: []
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (e) {
      console.error('Error sending error message:', e);
      try {
        await interaction.followUp({
          ...errorMessage,
          flags: MessageFlags.Ephemeral
        });
      } catch (finalError) {
        console.error('Failed to send any error response:', finalError);
      }
    }
  }

  async shutdown(code = 0) {
    console.log('Shutting down bot...');
    try {
      await this.client.destroy();
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
    process.exit(code);
  }

  async start() {
    try {
      // Load commands
      await loadCommands(this.client);

      // Validate config
      if (!config.token) {
        throw new Error(ERRORS.TOKEN_MISSING);
      }

      // Login with automatic retry
      let retries = 3;
      while (retries > 0) {
        try {
          await this.client.login(config.token);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          console.warn(`Login failed, retrying... (${retries} attempts remaining)`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error('Failed to start bot:', error);
      this.shutdown(1);
    }
  }
}

// Create and start the bot
const bot = new Bot();
bot.start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 