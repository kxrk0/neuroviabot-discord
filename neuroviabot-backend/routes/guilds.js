const express = require('express');
const router = express.Router();

// Node.js 18+ has native fetch, older versions need node-fetch
const fetch = globalThis.fetch || require('node-fetch');

// For production, use actual database model:
// const GuildSettings = require('../../src/models/GuildSettings');

// Mock database - Replace with actual MongoDB/database
const guildSettings = new Map();

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
    // TODO: Fetch from actual Discord bot client
    // const guild = client.guilds.cache.get(guildId);
    
    res.json({
      id: guildId,
      name: 'Test Server',
      icon: null,
      memberCount: 1234,
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
    // Get settings from storage or use defaults
    let settings = guildSettings.get(guildId);
    
    if (!settings) {
      // Default settings
      settings = {
        music: {
          enabled: true,
          defaultVolume: 50,
          maxQueueSize: 100,
          djRoleId: null,
          allowFilters: true,
        },
        moderation: {
          enabled: true,
          autoMod: true,
          spamProtection: true,
          logChannelId: null,
          muteRoleId: null,
        },
        economy: {
          enabled: true,
          startingBalance: 1000,
          dailyReward: 100,
          workReward: 50,
        },
        leveling: {
          enabled: true,
          xpPerMessage: 15,
          xpCooldown: 60,
          levelUpMessage: true,
        },
        welcome: {
          enabled: true,
          channelId: null,
          message: 'Hoş geldin {user}! Sunucumuza katıldığın için teşekkürler! 🎉',
        },
        general: {
          prefix: '!',
          language: 'tr',
        },
      };
      
      guildSettings.set(guildId, settings);
    }
    
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
    // Get current settings
    let settings = guildSettings.get(guildId) || {};
    
    // Update specific category
    settings[category] = {
      ...settings[category],
      ...updates,
    };
    
    // Save to storage
    guildSettings.set(guildId, settings);
    
    // TODO: Save to database
    // await GuildSettings.findOneAndUpdate(
    //   { guildId },
    //   { $set: { [category]: settings[category] } },
    //   { upsert: true, new: true }
    // );
    
    // TODO: Emit real-time update via WebSocket
    // io.to(guildId).emit('settings_updated', { category, settings: settings[category] });
    
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
    // Get current settings
    let settings = guildSettings.get(guildId) || {};
    
    // Merge updates
    settings = {
      ...settings,
      ...updates,
    };
    
    // Save to storage
    guildSettings.set(guildId, settings);
    
    // TODO: Save to database
    // await GuildSettings.findOneAndUpdate(
    //   { guildId },
    //   { $set: updates },
    //   { upsert: true, new: true }
    // );
    
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
