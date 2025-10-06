const express = require('express');
const router = express.Router();
const fetch = globalThis.fetch || require('node-fetch');
const { getDatabase } = require('../database/simple-db');

// Get shared database instance (same as bot uses)
const db = getDatabase();

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get user guilds with bot presence
router.get('/user', requireAuth, async (req, res) => {
  try {
    const accessToken = req.user.accessToken;
    const db = req.app.get('db');
    
    // Fetch user's guilds from Discord API
    const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!guildsResponse.ok) {
      return res.status(guildsResponse.status).json({ error: 'Failed to fetch guilds' });
    }
    
    const guilds = await guildsResponse.json();
    
    // Filter guilds where user has ADMINISTRATOR permission (0x8)
    const adminGuilds = guilds.filter(guild => {
      const permissions = BigInt(guild.permissions);
      return guild.owner || (permissions & BigInt(0x8)) === BigInt(0x8);
    });
    
    // Get bot guild IDs from database
    const botGuildIds = Array.from(db.data.guilds.keys());
    
    console.log('[Guilds] Bot is in', botGuildIds.length, 'guilds');
    console.log('[Guilds] Bot guild IDs:', botGuildIds);
    console.log('[Guilds] User admin guild IDs:', adminGuilds.map(g => g.id));
    
    // Check bot presence via Discord API for each guild
    const enhancedGuilds = await Promise.all(adminGuilds.map(async (guild) => {
      const botGuild = db.data.guilds.get(guild.id);
      let botPresent = botGuildIds.includes(guild.id);
      
      // Double-check via Discord API if not found in database
      if (!botPresent) {
        try {
          const botCheckResponse = await fetch(`https://discord.com/api/v10/guilds/${guild.id}`, {
            headers: {
              'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
            },
          });
          
          if (botCheckResponse.ok) {
            botPresent = true;
            console.log(`[Guilds] Bot found in ${guild.name} via Discord API`);
            
            // Add to database if not present
            if (!botGuild) {
              const guildData = {
                name: guild.name,
                memberCount: 0, // Will be updated later
                ownerId: guild.owner ? req.user.id : null,
                icon: guild.icon,
                active: true,
                joinedAt: new Date().toISOString()
              };
              db.getOrCreateGuild(guild.id, guildData);
              console.log(`[Guilds] Added ${guild.name} to database`);
            }
          }
        } catch (error) {
          console.log(`[Guilds] Discord API check failed for ${guild.name}:`, error.message);
        }
      }
      
      console.log(`[Guilds] ${guild.name} (${guild.id}): botPresent=${botPresent}`);
      
      return {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner,
        permissions: guild.permissions,
        botPresent: botPresent,
        memberCount: botGuild?.memberCount || null,
      };
    }));
    
    res.json(enhancedGuilds);
  } catch (error) {
    console.error('Error fetching user guilds:', error);
    res.status(500).json({ error: 'Failed to fetch user guilds' });
  }
});

// Get guild stats
router.get('/:guildId/stats', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  
  try {
    // TODO: Fetch from actual Discord bot client
    // const guild = client.guilds.cache.get(guildId);
    // Return real stats when bot is in guild
    
    res.json({
      memberCount: 0,
      onlineMembers: 0,
      totalCommands: 0,
      dailyMessages: 0,
    });
  } catch (error) {
    console.error('Error fetching guild stats:', error);
    res.status(500).json({ error: 'Failed to fetch guild stats' });
  }
});

// Get guild info
router.get('/:guildId', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  
  try {
    const db = req.app.get('db');
    const guild = db.data.guilds.get(guildId);
    
    if (!guild) {
      return res.status(404).json({ 
        error: 'Guild not found',
        message: 'Bot is not in this guild'
      });
    }
    
    res.json({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      memberCount: guild.memberCount,
      ownerId: guild.ownerId,
      description: guild.description,
    });
  } catch (error) {
    console.error('Error fetching guild:', error);
    res.status(500).json({ error: 'Failed to fetch guild' });
  }
});

// Get all guild settings
router.get('/:guildId/settings', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  
  try {
    // Get settings from bot database
    const settings = db.getGuildSettings(guildId);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update specific category settings
router.put('/:guildId/settings/:category', requireAuth, async (req, res) => {
  const { guildId, category } = req.params;
  const updates = req.body;
  
  try {
    // Update in bot database
    const settings = db.updateGuildSettingsCategory(guildId, category, updates);
    
    // Emit real-time update via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`guild_${guildId}`).emit('settings_changed', {
        guildId,
        category,
        settings: settings[category],
        timestamp: new Date().toISOString(),
      });
    }
    
    res.json({ [category]: settings[category] });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get specific category settings
router.get('/:guildId/settings/:category', requireAuth, async (req, res) => {
  const { guildId, category } = req.params;
  
  try {
    const settings = guildSettings.get(guildId) || {};
    const categorySettings = settings[category];
    
    if (!categorySettings) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(categorySettings);
  } catch (error) {
    console.error('Error fetching category settings:', error);
    res.status(500).json({ error: 'Failed to fetch category settings' });
  }
});

// Bulk update settings
router.put('/:guildId/settings', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  const updates = req.body;
  
  try {
    // Update in bot database
    const settings = db.updateGuildSettings(guildId, updates);
    
    // Emit real-time update via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`guild_${guildId}`).emit('settings_changed', {
        guildId,
        settings,
        timestamp: new Date().toISOString(),
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Reset settings to defaults
router.post('/:guildId/settings/reset', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  
  try {
    // Remove from storage
    guildSettings.delete(guildId);
    
    // TODO: Delete from database
    // await GuildSettings.findOneAndDelete({ guildId });
    
    res.json({ success: true, message: 'Settings reset to defaults' });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

// Get guild settings
router.get('/:guildId/settings', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const db = req.app.get('db');
    
    // Get guild settings from database
    const guild = db.data.guilds.get(guildId);
    
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }
    
    // Return settings or empty object if no settings
    res.json(guild.settings || {});
  } catch (error) {
    console.error('Error fetching guild settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update guild settings
router.put('/:guildId/settings', requireAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { category, feature, setting, value } = req.body;
    const db = req.app.get('db');
    
    // Get or create guild
    let guild = db.data.guilds.get(guildId);
    if (!guild) {
      guild = {
        id: guildId,
        name: 'Unknown Guild',
        settings: {}
      };
      db.data.guilds.set(guildId, guild);
    }
    
    // Initialize settings structure if not exists
    if (!guild.settings) {
      guild.settings = {};
    }
    if (!guild.settings[category]) {
      guild.settings[category] = {};
    }
    if (!guild.settings[category][feature]) {
      guild.settings[category][feature] = {};
    }
    
    // Update setting
    guild.settings[category][feature][setting] = value;
    
    // Save to database
    db.data.guilds.set(guildId, guild);
    db.save();
    
    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating guild settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
