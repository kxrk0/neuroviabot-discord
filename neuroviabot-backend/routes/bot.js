const express = require('express');
const router = express.Router();

// Get bot stats
router.get('/stats', (req, res) => {
  try {
    const botClient = req.app.get('botClient');
    
    if (!botClient || !botClient.user) {
      return res.json({
        guilds: 0,
        users: 0,
        commands: 43,
        uptime: 0,
        ping: 0,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        guildIds: [],
      });
    }
    
    const guildIds = Array.from(botClient.guilds.cache.keys());
    
    res.json({
      guilds: botClient.guilds.cache.size,
      users: botClient.users.cache.size,
      commands: 43,
      uptime: botClient.uptime,
      ping: botClient.ws.ping,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      guildIds: guildIds, // List of guild IDs where bot is present
    });
  } catch (error) {
    console.error('Error fetching bot stats:', error);
    res.status(500).json({ error: 'Failed to fetch bot stats' });
  }
});

// Get bot status
router.get('/status', (req, res) => {
  try {
    res.json({
      online: true,
      status: 'online',
      activities: [
        {
          name: 'with 66 servers',
          type: 0,
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching bot status:', error);
    res.status(500).json({ error: 'Failed to fetch bot status' });
  }
});

// Check if bot is in a guild
router.get('/check-guild/:guildId', (req, res) => {
  const { guildId } = req.params;
  
  try {
    const botClient = req.app.get('botClient');
    const guild = botClient?.guilds?.cache.get(guildId);
    const isPresent = !!guild;
    
    res.json({
      guildId,
      botPresent: isPresent,
      ...(isPresent && {
        memberCount: guild.memberCount,
        name: guild.name,
      }),
    });
  } catch (error) {
    console.error('Error checking guild:', error);
    res.status(500).json({ error: 'Failed to check guild' });
  }
});

// Batch check bot presence in multiple guilds
router.post('/check-guilds', (req, res) => {
  const { guildIds } = req.body;
  
  if (!Array.isArray(guildIds)) {
    return res.status(400).json({ error: 'guildIds must be an array' });
  }
  
  try {
    const botClient = req.app.get('botClient');
    
    const results = guildIds.map(guildId => {
      const guild = botClient?.guilds?.cache.get(guildId);
      return {
        guildId,
        botPresent: !!guild,
      };
    });
    
    res.json({ results });
  } catch (error) {
    console.error('Error checking guilds:', error);
    res.status(500).json({ error: 'Failed to check guilds' });
  }
});

module.exports = router;
