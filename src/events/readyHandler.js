const { ActivityType } = require('discord.js');

function setupReadyEvent(client) {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Set bot activity
  client.user.setActivity('vouches', { 
    type: ActivityType.Watching,
    name: 'vouches'
  });
}

module.exports = {
  setupReadyEvent
}; 