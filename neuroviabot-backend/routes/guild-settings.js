const express = require('express');
const router = express.Router();

// Welcome settings
router.get('/:guildId/settings/welcome', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual database query
    const settings = {
      enabled: false,
      channelId: '',
      message: 'Hoş geldin {user}! Sunucumuza katıldığın için teşekkürler!',
      embed: true,
      imageUrl: '',
      leaveEnabled: false,
      leaveChannelId: '',
      leaveMessage: '{user} sunucumuzdan ayrıldı. Görüşmek üzere!',
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching welcome settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch welcome settings' });
  }
});

router.post('/:guildId/settings/welcome', async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    
    // Mock save - replace with actual database save
    console.log('Saving welcome settings for guild:', guildId, settings);
    
    res.json({ success: true, message: 'Welcome settings saved successfully' });
  } catch (error) {
    console.error('Error saving welcome settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save welcome settings' });
  }
});

// Leveling settings
router.get('/:guildId/settings/leveling', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual database query
    const settings = {
      enabled: false,
      xpPerMessage: 15,
      cooldown: 60,
      announceChannelId: '',
      roleRewards: [],
      levelUpMessage: '🎉 {user} seviye {level}\'e yükseldi!',
      showLevelUpMessage: true,
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching leveling settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leveling settings' });
  }
});

router.post('/:guildId/settings/leveling', async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    
    // Mock save - replace with actual database save
    console.log('Saving leveling settings for guild:', guildId, settings);
    
    res.json({ success: true, message: 'Leveling settings saved successfully' });
  } catch (error) {
    console.error('Error saving leveling settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save leveling settings' });
  }
});

// Moderation settings
router.get('/:guildId/settings/moderation', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual database query
    const settings = {
      autoModEnabled: false,
      spamProtection: true,
      badWordsFilter: true,
      logChannelId: '',
      warningsEnabled: false,
      maxWarnings: 3,
      punishments: [
        { warnings: 1, action: 'mute', duration: 300 },
        { warnings: 2, action: 'mute', duration: 1800 },
        { warnings: 3, action: 'kick' },
      ],
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching moderation settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch moderation settings' });
  }
});

router.post('/:guildId/settings/moderation', async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    
    // Mock save - replace with actual database save
    console.log('Saving moderation settings for guild:', guildId, settings);
    
    res.json({ success: true, message: 'Moderation settings saved successfully' });
  } catch (error) {
    console.error('Error saving moderation settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save moderation settings' });
  }
});

// Get channels for a guild
router.get('/:guildId/channels', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual Discord API call
    const channels = [
      { id: '1', name: 'genel', type: 'text' },
      { id: '2', name: 'duyurular', type: 'text' },
      { id: '3', name: 'log', type: 'text' },
      { id: '4', name: 'Genel', type: 'voice' },
    ];

    res.json({ success: true, channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch channels' });
  }
});

// Economy settings
router.get('/:guildId/settings/economy', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual database query
    const settings = {
      enabled: false,
      currencyName: 'Coin',
      currencySymbol: '🪙',
      dailyAmount: 100,
      dailyCooldown: 86400,
      workAmount: 50,
      workCooldown: 3600,
      shopEnabled: false,
      shopItems: [],
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching economy settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch economy settings' });
  }
});

router.post('/:guildId/settings/economy', async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    
    // Mock save - replace with actual database save
    console.log('Saving economy settings for guild:', guildId, settings);
    
    res.json({ success: true, message: 'Economy settings saved successfully' });
  } catch (error) {
    console.error('Error saving economy settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save economy settings' });
  }
});

// Get roles for a guild
router.get('/:guildId/roles', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual Discord API call
    const roles = [
      { id: '1', name: 'Admin', color: '#ff0000' },
      { id: '2', name: 'Moderator', color: '#00ff00' },
      { id: '3', name: 'Member', color: '#0000ff' },
      { id: '4', name: 'VIP', color: '#ffff00' },
    ];

    res.json({ success: true, roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch roles' });
  }
});

module.exports = router;
