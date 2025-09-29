const express = require('express');
const router = express.Router();

// Mock bot client (will be replaced with actual Discord.js client)
const getBotClient = () => {
  // This should connect to your actual bot
  // For now, returning mock data
  return {
    guilds: { cache: { size: 66 } },
    users: { cache: { size: 59032 } },
    uptime: 86400000,
  };
};

// Get bot stats
router.get('/stats', (req, res) => {
  try {
    const client = getBotClient();
    
    res.json({
      guilds: client.guilds.cache.size,
      users: client.users.cache.size,
      commands: 43,
      uptime: client.uptime,
      ping: 45,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
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

module.exports = router;
