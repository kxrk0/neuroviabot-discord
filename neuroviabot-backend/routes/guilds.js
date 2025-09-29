const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Get user guilds from Discord with bot status
router.get('/user', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    });
    
    // Filter guilds where user has MANAGE_GUILD permission
    const managedGuilds = response.data.filter(guild => {
      const permissions = BigInt(guild.permissions);
      const MANAGE_GUILD = BigInt(0x00000020);
      const ADMINISTRATOR = BigInt(0x00000008);
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD || (permissions & ADMINISTRATOR) === ADMINISTRATOR;
    });
    
    // TODO: Check bot presence in each guild from Discord bot client
    // For now, return guilds with botPresent flag
    const guildsWithBotStatus = managedGuilds.map(guild => ({
      ...guild,
      botPresent: false, // Will be checked from bot client
    }));
    
    res.json(guildsWithBotStatus);
  } catch (error) {
    console.error('Error fetching user guilds:', error);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

// Generate bot invite URL
router.get('/invite-url', (req, res) => {
  const { guildId } = req.query;
  const clientId = process.env.DISCORD_CLIENT_ID;
  
  const permissions = '8'; // ADMINISTRATOR permission
  const scopes = 'bot applications.commands';
  
  let inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${encodeURIComponent(scopes)}`;
  
  if (guildId) {
    inviteUrl += `&guild_id=${guildId}&disable_guild_select=true`;
  }
  
  res.json({ inviteUrl });
});

// Get guild settings
router.get('/:guildId/settings', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  
  try {
    // TODO: Fetch from database
    // For now, return mock data
    res.json({
      guildId,
      prefix: '!',
      language: 'en',
      musicEnabled: true,
      moderationEnabled: true,
      economyEnabled: true,
      levelingEnabled: true,
      welcomeEnabled: false,
      welcomeChannel: null,
      welcomeMessage: 'Welcome {user}!',
    });
  } catch (error) {
    console.error('Error fetching guild settings:', error);
    res.status(500).json({ error: 'Failed to fetch guild settings' });
  }
});

// Update guild settings
router.patch('/:guildId/settings', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  const settings = req.body;
  
  try {
    // TODO: Save to database
    console.log(`Updating settings for guild ${guildId}:`, settings);
    
    res.json({
      success: true,
      guildId,
      settings,
    });
  } catch (error) {
    console.error('Error updating guild settings:', error);
    res.status(500).json({ error: 'Failed to update guild settings' });
  }
});

// Get guild stats
router.get('/:guildId/stats', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  
  try {
    // TODO: Fetch from bot/database
    res.json({
      guildId,
      memberCount: 1234,
      onlineCount: 567,
      commands: {
        music: 'Active',
        moderation: 12,
        economy: 45200,
        leveling: 234,
      },
    });
  } catch (error) {
    console.error('Error fetching guild stats:', error);
    res.status(500).json({ error: 'Failed to fetch guild stats' });
  }
});

// Get guild members
router.get('/:guildId/members', requireAuth, async (req, res) => {
  const { guildId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  
  try {
    // TODO: Fetch from bot
    res.json({
      data: [],
      page: parseInt(page),
      limit: parseInt(limit),
      total: 0,
      hasMore: false,
    });
  } catch (error) {
    console.error('Error fetching guild members:', error);
    res.status(500).json({ error: 'Failed to fetch guild members' });
  }
});

module.exports = router;
