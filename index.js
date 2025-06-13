const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const config = require('./src/config/config.json');
const { loadCommands } = require('./commands');
const { restoreVouches, submitVouch } = require('./vouches');

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
    this.client.once(Events.ClientReady, () => {
      console.log(`Logged in as ${this.client.user.tag}`);
      
      // Set bot activity
      this.client.user.setActivity('vouches', { 
        type: ActivityType.Watching,
        name: 'vouches'
      });
    });

    // Interaction event
    this.client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isCommand()) return;

      try {
        await this.handleCommand(interaction);
      } catch (error) {
        console.error('Error handling command:', error);
        await this.handleError(interaction, error);
      }
    });
  }

  async handleCommand(interaction) {
    switch (interaction.commandName) {
      case 'vouch':
        await submitVouch(interaction);
        break;
      case 'restore':
        await restoreVouches(interaction);
        break;
      default:
        await interaction.reply({ content: ERRORS.UNKNOWN_COMMAND, ephemeral: true });
    }
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
