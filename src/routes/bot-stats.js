const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

let client = null;

function setClient(clientInstance) {
    client = clientInstance;
}

const authenticateBotApi = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== (process.env.BOT_API_KEY || 'neuroviabot-secret')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// GET /api/bot/stats/guild/:guildId - Enhanced guild stats
router.get('/guild/:guildId', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;
        
        if (!client) {
            return res.status(503).json({ error: 'Bot not ready' });
        }

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        // Calculate stats
        const memberCount = guild.memberCount;
        const onlineCount = guild.members.cache.filter(m => m.presence?.status !== 'offline').size;
        const channelCount = guild.channels.cache.size;
        const roleCount = guild.roles.cache.size;
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount || 0;

        res.json({
            success: true,
            name: guild.name,
            icon: guild.iconURL({ format: 'png', size: 256 }),
            banner: guild.bannerURL({ format: 'png', size: 1024 }),
            description: guild.description,
            memberCount,
            onlineCount,
            channelCount,
            roleCount,
            boostLevel,
            boostCount,
            createdAt: guild.createdAt.toISOString(),
            ownerId: guild.ownerId,
        });

    } catch (error) {
        logger.error('Guild stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router, setClient };

