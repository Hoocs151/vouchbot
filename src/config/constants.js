// File paths
const PATHS = {
  VOUCH_DATA: 'src/data/information.json'
};

// Embed colors
const COLORS = {
  EMBED: 0x2B2D31,
  SHOP: 0x5865F2,    // Discord Blurple
  SUCCESS: 0x57F287, // Green
  WARNING: 0xFEE75C, // Yellow
  ERROR: 0xED4245    // Red
};

// Rate limiting
const RATE_LIMITS = {
  RESTORE_DELAY: 2500, // ms
  MAX_VOUCHES_PER_HOUR: 5
};

// Error messages
const ERRORS = {
  NO_PERMISSION: 'You do not have permission to use this command.',
  NO_VOUCH_DATA: 'No vouch data found to restore.',
  NO_CHANNEL: 'Channel not found. Please check your configuration!',
  NO_CONFIG: 'Channel ID is not defined in the configuration!',
  SUBMISSION_SUCCESS: '✅ Your vouch has been submitted successfully!',
  SHOP_SUCCESS: '🛍️ Your review has also been posted to the shop channel!',
  TOKEN_MISSING: 'Error: Token is missing in config.json',
  UNKNOWN_COMMAND: 'Unknown command.',
  COMMAND_ERROR: 'An error occurred while processing the command.',
  RATE_LIMIT: '⏰ You have reached the maximum number of vouches allowed per hour. Please try again later.'
};

// Command options
const COMMAND_OPTIONS = {
  REVIEW_MAX_LENGTH: 1000,
  SHOP_TITLE_MAX_LENGTH: 100
};

module.exports = {
  PATHS,
  COLORS,
  RATE_LIMITS,
  ERRORS,
  COMMAND_OPTIONS
}; 