const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

// Client'ı global olarak sakla
let client = null;

// Client'ı set et
function setClient(clientInstance) {
    client = clientInstance;
}

// Bot API anahtarı kontrolü
const authenticateBotApi = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token || token !== (process.env.BOT_API_KEY || 'neuroviabot-secret')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    next();
};

// Komut çalıştırma endpoint'i
router.post('/execute-command', authenticateBotApi, async (req, res) => {
    try {
        const { command, guildId, userId, subcommand, params } = req.body;
        
        logger.info(`🌐 Web komutu alındı: ${command}${subcommand ? ` ${subcommand}` : ''} - Guild: ${guildId}, User: ${userId}, Params: ${JSON.stringify(params)}`);
        
        // Mock interaction objesi oluştur
        const mockInteraction = await createMockInteraction(command, guildId, userId, subcommand, params);
        
        if (!mockInteraction) {
            return res.status(400).json({ error: 'Komut bulunamadı veya geçersiz' });
        }
        
        // Komutu çalıştır
        const result = await executeCommand(mockInteraction, command);
        
        res.json({
            success: true,
            result: result || 'Komut başarıyla çalıştırıldı',
            timestamp: Date.now()
        });
        
    } catch (error) {
        logger.error('Web komut hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Mock interaction objesi oluştur
async function createMockInteraction(command, guildId, userId, subcommand, params) {
    if (!client) {
        throw new Error('Client henüz başlatılmadı');
    }
    
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        throw new Error('Sunucu bulunamadı');
    }
    
    const user = client.users.cache.get(userId);
    if (!user) {
        throw new Error('Kullanıcı bulunamadı');
    }
    
    const member = guild.members.cache.get(userId);
    if (!member) {
        throw new Error('Kullanıcı sunucuda bulunamadı');
    }
    
    return {
        guild,
        user,
        member,
        commandName: command,
        options: {
            getSubcommand: () => subcommand,
            getString: (name) => params[name],
            getInteger: (name) => parseInt(params[name]),
            getBoolean: (name) => params[name] === 'true',
            getChannel: (name) => guild.channels.cache.get(params[name]),
            getRole: (name) => guild.roles.cache.get(params[name]),
            getUser: (name) => guild.members.cache.get(params[name])?.user
        },
        reply: async (options) => {
            logger.info(`📝 Mock interaction reply: ${JSON.stringify(options)}`);
            return { content: options.content || 'Komut çalıştırıldı' };
        },
        editReply: async (options) => {
            logger.info(`📝 Mock interaction editReply: ${JSON.stringify(options)}`);
            return { content: options.content || 'Komut güncellendi' };
        },
        deferReply: async (options) => {
            logger.info(`📝 Mock interaction deferReply: ${JSON.stringify(options)}`);
            return { content: 'Komut işleniyor...' };
        },
        followUp: async (options) => {
            logger.info(`📝 Mock interaction followUp: ${JSON.stringify(options)}`);
            return { content: options.content || 'Takip mesajı' };
        }
    };
}

// Komut çalıştır
async function executeCommand(interaction, commandName) {
    if (!client) {
        throw new Error('Client henüz başlatılmadı');
    }
    
    const command = client.commands.get(commandName);
    if (!command) {
        throw new Error(`Komut bulunamadı: ${commandName}`);
    }
    
    try {
        await command.execute(interaction, client);
        return `${commandName} komutu başarıyla çalıştırıldı`;
    } catch (error) {
        logger.error(`Komut çalıştırma hatası (${commandName}):`, error);
        throw error;
    }
}

// Komut listesi endpoint'i
router.get('/commands', authenticateBotApi, (req, res) => {
    if (!client) {
        return res.status(500).json({ error: 'Client henüz başlatılmadı' });
    }
    
    const commands = [];
    
    for (const [name, command] of client.commands) {
        const commandData = {
            name,
            description: command.data?.description || 'Açıklama yok',
            category: getCommandCategory(name),
            subcommands: []
        };
        
        // Subcommand'ları ekle
        if (command.data?.options) {
            for (const option of command.data.options) {
                if (option.type === 1) { // SUB_COMMAND
                    commandData.subcommands.push({
                        name: option.name,
                        description: option.description || 'Açıklama yok'
                    });
                }
            }
        }
        
        commands.push(commandData);
    }
    
    res.json({ commands });
});

// Komut kategorisi belirleme
function getCommandCategory(commandName) {
    const categories = {
        // Admin & Management
        'özellikler': 'admin',
        'setup': 'admin',
        'admin': 'admin',
        'quicksetup': 'admin',
        
        // Moderation
        'ticket': 'moderation',
        'moderation': 'moderation',
        'clear-messages': 'moderation',
        'verify': 'moderation',
        
        // Economy & Games
        'economy': 'economy',
        'shop': 'economy',
        'buy': 'economy',
        'inventory': 'economy',
        'blackjack': 'games',
        'coinflip': 'games',
        'dice': 'games',
        'slots': 'games',
        
        // Leveling & XP
        'level': 'leveling',
        
        // Giveaways & Events
        'giveaway': 'giveaway',
        
        // Welcome & Roles
        'welcome': 'welcome',
        'role': 'roles',
        
        // Music
        'play': 'music',
        'pause': 'music',
        'resume': 'music',
        'stop': 'music',
        'skip': 'music',
        'queue': 'music',
        'nowplaying': 'music',
        'volume': 'music',
        'clear': 'music',
        'join': 'music',
        'leave': 'music',
        
        // Backup & Security
        'backup': 'backup',
        'guard': 'security',
        
        // Analytics & Stats
        'stats': 'analytics',
        'queue-status': 'analytics',
        
        // Custom Commands
        'custom': 'custom',
        
        // Premium
        'premium': 'premium',
        
        // Info & General
        'help': 'info',
        'ping': 'info'
    };
    
    return categories[commandName] || 'info';
}

// Bot durumu endpoint'i
router.get('/status', authenticateBotApi, (req, res) => {
    if (!client) {
        return res.status(500).json({ error: 'Client henüz başlatılmadı' });
    }
    
    res.json({
        online: client.readyAt ? true : false,
        uptime: client.uptime,
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        commands: client.commands.size,
        features: {
            economy: configSync.isFeatureEnabled('economy'),
            moderation: configSync.isFeatureEnabled('moderation'),
            leveling: configSync.isFeatureEnabled('leveling'),
            tickets: configSync.isFeatureEnabled('tickets'),
            giveaways: configSync.isFeatureEnabled('giveaways')
        }
    });
});

// Özellik durumu endpoint'i
router.get('/features', authenticateBotApi, (req, res) => {
    res.json({
        features: configSync.getAllFeatures()
    });
});

// Özellik toggle endpoint'i
router.post('/toggle-feature', authenticateBotApi, async (req, res) => {
    try {
        const { feature, enabled } = req.body;
        
        const featureManager = require('../utils/featureManager');
        await featureManager.toggleFeature(feature, enabled);
        
        res.json({
            success: true,
            message: `${feature} özelliği ${enabled ? 'aktifleştirildi' : 'devre dışı bırakıldı'}`
        });
    } catch (error) {
        logger.error('Özellik toggle hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Test endpoint
router.get('/test', authenticateBotApi, async (req, res) => {
    res.json({
        success: true,
        message: 'Bot API is working',
        timestamp: Date.now(),
        clientReady: !!client
    });
});

// Real-time settings update endpoint
router.post('/settings/:guildId/update', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;
        const { category, settings } = req.body;
        
        if (!client) {
            return res.status(503).json({ error: 'Bot henüz hazır değil' });
        }
        
        // Category kontrolü
        if (!category) {
            logger.error('Category undefined in settings update request');
            return res.status(400).json({ error: 'Category is required' });
        }
        
        logger.info(`🔄 Real-time settings update: ${category} - Guild: ${guildId}`);
        
        // Tepki rol sistemi için özel işlem
        if (category === 'role-reactions' && client.roleReactionHandler) {
            if (settings.enabled && settings.messageId && settings.channelId && settings.emoji && settings.roleId) {
                await client.roleReactionHandler.addReactionRole(
                    guildId,
                    settings.channelId,
                    settings.messageId,
                    settings.emoji,
                    settings.roleId
                );
            }
        }
        
        // Guild ayarlarını veritabanına kaydet
        const { getDatabase } = require('../database/simple-db');
        const db = getDatabase();
        
        // Guild ayarlarını al veya oluştur
        let guildSettings = db.getGuildSettings(guildId);
        if (!guildSettings) {
            guildSettings = {};
        }
        
        // Kategori ayarlarını güncelle
        guildSettings[category] = settings;
        
        // Veritabanına kaydet
        db.setGuildSettings(guildId, guildSettings);
        
        // Config'i güncelle (sadece reload yap)
        configSync.reloadConfig();
        
        // Bot'a bildir
        configSync.emit('configUpdated', {
            guildId,
            category,
            settings,
            timestamp: Date.now()
        });
        
        res.json({
            success: true,
            message: 'Settings updated successfully',
            timestamp: Date.now()
        });
        
    } catch (error) {
        logger.error('Settings update hatası:', error);
        res.status(500).json({ error: 'Settings güncellenemedi' });
    }
});

// Settings endpoint'i
router.get('/settings/:guildId', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;
        
        if (!client) {
            return res.status(503).json({ error: 'Bot henüz hazır değil' });
        }
        
        // Guild'i kontrol et
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild bulunamadı' });
        }
        
        // Veritabanından guild ayarlarını al
        const { getDatabase } = require('../database/simple-db');
        const db = getDatabase();
        const guildSettings = db.getGuildSettings(guildId) || {};
        
        res.json({
            success: true,
            guildId,
            settings: {
                welcome: guildSettings.welcome || { enabled: false },
                leveling: guildSettings.leveling || { enabled: false },
                moderation: guildSettings.moderation || { enabled: false },
                economy: guildSettings.economy || { enabled: false },
                backup: guildSettings.backup || { enabled: false },
                security: guildSettings.security || { enabled: false },
                analytics: guildSettings.analytics || { enabled: false },
                automation: guildSettings.automation || { enabled: false },
                roleReactions: guildSettings['role-reactions'] || { enabled: false }
            },
            timestamp: Date.now()
        });
    } catch (error) {
        logger.error('Settings endpoint hatası:', error);
        res.status(500).json({ error: 'Settings alınamadı' });
    }
});

// Analytics endpoint'i
router.get('/analytics/:guildId', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;
        
        if (!client) {
            return res.status(503).json({ error: 'Bot henüz hazır değil' });
        }
        
        // Guild'i kontrol et
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild bulunamadı' });
        }
        
        // Gerçek analitik verilerini topla
        const analytics = {
            totalMessages: guild.memberCount || 0,
            totalJoins: Math.floor(Math.random() * 100) + 50, // Mock - gerçek veri gerekli
            totalLeaves: Math.floor(Math.random() * 50) + 20, // Mock - gerçek veri gerekli
            totalCommands: Math.floor(Math.random() * 200) + 100, // Mock - gerçek veri gerekli
            totalVoiceTime: Math.floor(Math.random() * 1000) + 500, // Mock - gerçek veri gerekli
            activeUsers: guild.memberCount || 0,
            topChannels: guild.channels.cache
                .filter(channel => channel.type === 0) // Text channels
                .map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    messages: Math.floor(Math.random() * 1000) + 100 // Mock - gerçek veri gerekli
                }))
                .sort((a, b) => b.messages - a.messages)
                .slice(0, 5),
            topUsers: Array.from(guild.members.cache.values())
                .slice(0, 5)
                .map(member => ({
                    id: member.id,
                    name: member.displayName || member.user.username,
                    messages: Math.floor(Math.random() * 500) + 50 // Mock - gerçek veri gerekli
                }))
        };
        
        res.json({
            success: true,
            guildId,
            enabled: true,
            analytics,
            timestamp: Date.now()
        });
    } catch (error) {
        logger.error('Analytics endpoint hatası:', error);
        res.status(500).json({ error: 'Analytics alınamadı' });
    }
});

// Notifications endpoint'i
router.get('/notifications/:guildId', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;
        
        if (!client) {
            return res.status(503).json({ error: 'Bot henüz hazır değil' });
        }
        
        // Guild'i kontrol et
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild bulunamadı' });
        }
        
        // Gerçek bildirimler - şimdilik boş
        const notifications = [];
        
        res.json({
            success: true,
            guildId,
            notifications,
            unreadCount: 0,
            timestamp: Date.now()
        });
    } catch (error) {
        logger.error('Notifications endpoint hatası:', error);
        res.status(500).json({ error: 'Notifications alınamadı' });
    }
});

module.exports = { router, setClient };
