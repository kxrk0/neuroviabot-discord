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
      { id: '4', name: 'hoşgeldin', type: 'text' },
      { id: '5', name: 'seviye', type: 'text' },
      { id: '6', name: 'moderasyon', type: 'text' },
      { id: '7', name: 'Genel', type: 'voice' },
      { id: '8', name: 'Müzik', type: 'voice' },
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

// Backup settings
router.get('/:guildId/settings/backup', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual database query
    const settings = {
      enabled: false,
      autoBackup: false,
      backupInterval: 24,
      maxBackups: 10,
      includeChannels: true,
      includeRoles: true,
      includeSettings: true,
      includeMessages: false,
      backups: [],
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching backup settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch backup settings' });
  }
});

router.post('/:guildId/settings/backup', async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    
    // Mock save - replace with actual database save
    console.log('Saving backup settings for guild:', guildId, settings);
    
    res.json({ success: true, message: 'Backup settings saved successfully' });
  } catch (error) {
    console.error('Error saving backup settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save backup settings' });
  }
});

// Security settings
router.get('/:guildId/settings/security', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual database query
    const settings = {
      enabled: false,
      antiRaid: false,
      antiSpam: false,
      antiNuke: false,
      verificationSystem: false,
      verificationLevel: 'medium',
      verificationChannel: '',
      verificationRole: '',
      verificationMessage: 'Sunucumuza hoş geldin! Lütfen aşağıdaki mesaja tepki vererek doğrulan.',
      autoModeration: false,
      autoBan: false,
      autoKick: false,
      maxWarnings: 3,
      muteRole: '',
      logChannel: '',
      trustedRoles: [],
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching security settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch security settings' });
  }
});

router.post('/:guildId/settings/security', async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    
    // Mock save - replace with actual database save
    console.log('Saving security settings for guild:', guildId, settings);
    
    res.json({ success: true, message: 'Security settings saved successfully' });
  } catch (error) {
    console.error('Error saving security settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save security settings' });
  }
});

// Analytics settings
router.get('/:guildId/settings/analytics', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    // Mock data for now - replace with actual database query
    const settings = {
      enabled: false,
      trackMessages: true,
      trackJoins: true,
      trackLeaves: true,
      trackCommands: true,
      trackVoice: false,
      logChannel: '',
      dailyReports: false,
      weeklyReports: false,
      monthlyReports: false,
      reportChannel: '',
      analytics: {
        totalMessages: 1250,
        totalJoins: 45,
        totalLeaves: 12,
        totalCommands: 89,
        totalVoiceTime: 3600,
        activeUsers: 23,
        topChannels: [
          { id: '1', name: 'genel', messages: 450 },
          { id: '2', name: 'sohbet', messages: 320 },
          { id: '3', name: 'duyurular', messages: 180 },
        ],
        topUsers: [
          { id: '1', name: 'User1', messages: 120 },
          { id: '2', name: 'User2', messages: 95 },
          { id: '3', name: 'User3', messages: 78 },
        ],
      },
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching analytics settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics settings' });
  }
});

router.post('/:guildId/settings/analytics', async (req, res) => {
  try {
    const { guildId } = req.params;
    const settings = req.body;
    
    // Mock save - replace with actual database save
    console.log('Saving analytics settings for guild:', guildId, settings);
    
    res.json({ success: true, message: 'Analytics settings saved successfully' });
  } catch (error) {
    console.error('Error saving analytics settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save analytics settings' });
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
