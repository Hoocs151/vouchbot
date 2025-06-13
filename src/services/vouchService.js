const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config/config.json');

// Constants
const VOUCH_FILE = 'information.json';
const EMBED_COLOR = 0x2B2D31;
const RATE_LIMIT_DELAY = 2500;

// Error messages
const ERRORS = {
  NO_PERMISSION: 'You do not have permission to use this command.',
  NO_VOUCH_DATA: 'No vouch data found to restore.',
  NO_CHANNEL: 'Vouch channel not found. Please check your configuration!',
  NO_CONFIG: 'Vouch channel ID is not defined in the configuration!',
  SUBMISSION_SUCCESS: 'Your vouch has been submitted successfully!'
};

class VouchService {
  constructor() {
    this.vouchData = [];
    this.loadVouchData();
  }

  async loadVouchData() {
    try {
      if (fs.existsSync(VOUCH_FILE)) {
        const rawData = fs.readFileSync(VOUCH_FILE);
        this.vouchData = JSON.parse(rawData);
      }
    } catch (error) {
      console.error('Error loading vouch data:', error);
      this.vouchData = [];
    }
  }

  async saveVouchData() {
    try {
      fs.writeFileSync(VOUCH_FILE, JSON.stringify(this.vouchData, null, 2));
    } catch (error) {
      console.error('Error saving vouch data:', error);
      throw new Error('Failed to save vouch data');
    }
  }

  createVouchEmbed(userData, isNew = true) {
    const starsEmoji = '⭐'.repeat(userData.rating);
    const emptyStars = '☆'.repeat(5 - userData.rating);

    return new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setAuthor({
        name: isNew ? 'New Vouch' : 'Restored Vouch',
        iconURL: userData.guildIcon
      })
      .setDescription(`**Author:** <@${userData.authorId}>\n**Rating:** ${starsEmoji}${emptyStars}\n\n\`\`\`${userData.review}\`\`\``)
      .setThumbnail(userData.avatar)
      .setFooter({ 
        text: `Vouch #${userData.id} • ${new Date(userData.timestamp).toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}`,
        iconURL: userData.guildIcon
      });
  }

  async submitVouch(interaction) {
    try {
      const review = interaction.options.getString('review');
      const stars = interaction.options.getInteger('stars');
      const attachment = interaction.options.getAttachment('attachment');

      const id = this.vouchData.length + 1;
      const userData = {
        id,
        author: interaction.user.tag,
        authorId: interaction.user.id,
        avatar: interaction.user.displayAvatarURL({ dynamic: true }),
        guildIcon: interaction.guild.iconURL({ dynamic: true }),
        rating: stars,
        review,
        timestamp: new Date().toISOString(),
        attachment: attachment ? attachment.url : null,
      };

      this.vouchData.push(userData);
      await this.saveVouchData();

      const embed = this.createVouchEmbed(userData, true);
      if (attachment) {
        embed.setImage(attachment.url);
      }

      const vouchChannel = await this.getVouchChannel(interaction);
      if (!vouchChannel) return;

      await vouchChannel.send({ embeds: [embed] });
      await interaction.reply({ content: ERRORS.SUBMISSION_SUCCESS, ephemeral: true });

    } catch (error) {
      console.error('Error submitting vouch:', error);
      await interaction.reply({ content: 'An error occurred while submitting your vouch.', ephemeral: true });
    }
  }

  async restoreVouches(interaction) {
    try {
      if (interaction.user.id !== config.ownerId) {
        return interaction.reply({ content: ERRORS.NO_PERMISSION, ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      if (!fs.existsSync(VOUCH_FILE)) {
        return interaction.editReply({ content: ERRORS.NO_VOUCH_DATA, ephemeral: true });
      }

      await this.loadVouchData();
      const vouchChannel = await this.getVouchChannel(interaction);
      if (!vouchChannel) return;

      for (const vouch of this.vouchData) {
        const userData = {
          ...vouch,
          guildIcon: interaction.guild.iconURL({ dynamic: true })
        };

        const embed = this.createVouchEmbed(userData, false);
        if (vouch.attachment) {
          embed.setImage(vouch.attachment);
        }

        await vouchChannel.send({ embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }

      await interaction.editReply({ content: 'All vouches have been restored.', ephemeral: true });

    } catch (error) {
      console.error('Error restoring vouches:', error);
      await interaction.editReply({ content: 'An error occurred while restoring vouches.', ephemeral: true });
    }
  }

  async getVouchChannel(interaction) {
    const vouchChannelId = config.vouchChannelId;
    if (!vouchChannelId) {
      await interaction.reply({ content: ERRORS.NO_CONFIG, ephemeral: true });
      return null;
    }

    const vouchChannel = interaction.guild.channels.cache.get(vouchChannelId);
    if (!vouchChannel) {
      await interaction.reply({ content: ERRORS.NO_CHANNEL, ephemeral: true });
      return null;
    }

    return vouchChannel;
  }
}

// Create and export a single instance
const vouchService = new VouchService();
module.exports = {
  submitVouch: (interaction) => vouchService.submitVouch(interaction),
  restoreVouches: (interaction) => vouchService.restoreVouches(interaction)
}; 