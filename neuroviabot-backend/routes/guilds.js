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
    const botClient = req.app.get('botClient');
    
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
    
    // Get bot guild IDs from Discord bot client
    const botGuildIds = botClient && botClient.guilds 
      ? Array.from(botClient.guilds.cache.keys())
      : [];
    
    console.log('[Guilds] Bot is in', botGuildIds.length, 'guilds');
    
    // Enhance guild data with bot presence
    const enhancedGuilds = adminGuilds.map(guild => {
      const botGuild = botClient?.guilds?.cache.get(guild.id);
      return {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner,
        permissions: guild.permissions,
        botPresent: botGuildIds.includes(guild.id),
        memberCount: botGuild?.memberCount || null,
      };
    });
    
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
    const botClient = req.app.get('botClient');
    const guild = botClient?.guilds?.cache.get(guildId);
    
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

module.exports = router;
