const express = require('express');
const router = express.Router();

// Get bot stats
router.get('/stats', (req, res) => {
  try {
    const db = req.app.get('db');
    
    // Get guild data from shared database
    const guilds = Array.from(db.data.guilds.values());
    const guildIds = Array.from(db.data.guilds.keys());
    
    // Calculate total users from database
    let totalUsers = 0;
    guilds.forEach((guild) => {
      if (guild.memberCount) {
        totalUsers += guild.memberCount;
      }
    }); 
    
    console.log('[Backend API] Stats from database - Guilds:', guilds.length, 'Users:', totalUsers);
    console.log('[Backend API] Guild IDs:', guildIds);
    
    res.json({
      guilds: guilds.length,
      users: totalUsers,
      commands: 43,
      uptime: process.uptime() * 1000, // Process uptime in milliseconds
      ping: 0, // Not available without bot client
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      guildIds: guildIds,
    });
  } catch (error) {
    console.error('[Backend API] Error fetching bot stats:', error);
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
    const db = req.app.get('db');
    const guild = db.data.guilds.get(guildId);
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
    const db = req.app.get('db');
    
    const results = guildIds.map(guildId => {
      const guild = db.data.guilds.get(guildId);
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
