const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const configSync = require('../utils/configSync');

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
        
        logger.info(`🌐 Web komutu alındı: ${command}${subcommand ? ` ${subcommand}` : ''} - Guild: ${guildId}, User: ${userId}`);
        
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
    const guild = global.client.guilds.cache.get(guildId);
    if (!guild) {
        throw new Error('Sunucu bulunamadı');
    }
    
    const user = global.client.users.cache.get(userId);
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
    const command = global.client.commands.get(commandName);
    if (!command) {
        throw new Error(`Komut bulunamadı: ${commandName}`);
    }
    
    try {
        await command.execute(interaction, global.client);
        return `${commandName} komutu başarıyla çalıştırıldı`;
    } catch (error) {
        logger.error(`Komut çalıştırma hatası (${commandName}):`, error);
        throw error;
    }
}

// Komut listesi endpoint'i
router.get('/commands', authenticateBotApi, (req, res) => {
    const commands = [];
    
    for (const [name, command] of global.client.commands) {
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
        'özellikler': 'admin',
        'ticket': 'moderation',
        'moderation': 'moderation',
        'economy': 'economy',
        'level': 'leveling',
        'giveaway': 'giveaway',
        'welcome': 'welcome',
        'role': 'roles',
        'setup': 'admin',
        'stats': 'info',
        'help': 'info',
        'ping': 'info'
    };
    
    return categories[commandName] || 'general';
}

// Bot durumu endpoint'i
router.get('/status', authenticateBotApi, (req, res) => {
    res.json({
        online: global.client.readyAt ? true : false,
        uptime: global.client.uptime,
        guilds: global.client.guilds.cache.size,
        users: global.client.users.cache.size,
        commands: global.client.commands.size,
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

module.exports = router;
