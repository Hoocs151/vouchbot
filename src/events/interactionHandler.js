const { submitVouch, restoreVouches } = require('../services/vouchService');

async function handleInteraction(interaction) {
  switch (interaction.commandName) {
    case 'vouch':
      await submitVouch(interaction);
      break;
    case 'restore':
      await restoreVouches(interaction);
      break;
    default:
      await interaction.reply({ content: 'Unknown command.', ephemeral: true });
  }
}

module.exports = {
  handleInteraction
}; 