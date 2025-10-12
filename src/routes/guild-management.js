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

// === MEMBER MANAGEMENT ===

// Get all members
router.get('/:guildId/members', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;
        const { page = 1, limit = 50, search = '' } = req.query;
        
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        // Fetch all members
        await guild.members.fetch();
        
        let members = Array.from(guild.members.cache.values());
        
        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            members = members.filter(member => 
                member.user.username.toLowerCase().includes(searchLower) ||
                member.displayName.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedMembers = members.slice(startIndex, endIndex);

        const memberData = paginatedMembers.map(member => ({
            id: member.user.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            avatar: member.user.avatar,
            nickname: member.nickname,
            roles: member.roles.cache
                .filter(role => role.id !== guild.id)
                .map(role => ({
                    id: role.id,
                    name: role.name,
                    color: role.color,
                })),
            joinedAt: member.joinedAt,
        }));

        res.json({
            members: memberData,
            page: parseInt(page),
            limit: parseInt(limit),
            total: members.length,
            totalPages: Math.ceil(members.length / limit),
        });

        logger.debug(`[Bot API] Fetched ${memberData.length} members for guild ${guildId}`);
    } catch (error) {
        logger.error('[Bot API] Error fetching members:', error);
        res.status(500).json({ error: error.message });
    }
});

// Kick member
router.post('/:guildId/members/:userId/kick', authenticateBotApi, async (req, res) => {
    try {
        const { guildId, userId } = req.params;
        const { reason = 'No reason provided', executor } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        const member = await guild.members.fetch(userId);
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        await member.kick(reason);

        // Broadcast to frontend
        if (client.socket && client.socket.connected) {
            client.socket.emit('broadcast_to_guild', {
                guildId: guildId,
                event: 'member_action',
                data: {
                    action: 'Üye atıldı',
                    memberName: member.user.username,
                    executor: executor,
                    timestamp: new Date().toISOString(),
                },
            });
        }

        logger.info(`[Bot API] Kicked member ${member.user.username} from guild ${guildId}`);
        res.json({ success: true, message: 'Member kicked successfully' });
    } catch (error) {
        logger.error('[Bot API] Error kicking member:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ban member
router.post('/:guildId/members/:userId/ban', authenticateBotApi, async (req, res) => {
    try {
        const { guildId, userId } = req.params;
        const { reason = 'No reason provided', deleteMessageDays = 0, executor } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        const member = await guild.members.fetch(userId).catch(() => null);
        const username = member ? member.user.username : userId;

        await guild.members.ban(userId, {
            reason: reason,
            deleteMessageDays: parseInt(deleteMessageDays),
        });

        // Broadcast to frontend
        if (client.socket && client.socket.connected) {
            client.socket.emit('broadcast_to_guild', {
                guildId: guildId,
                event: 'member_action',
                data: {
                    action: 'Üye yasaklandı',
                    memberName: username,
                    executor: executor,
                    timestamp: new Date().toISOString(),
                },
            });
        }

        logger.info(`[Bot API] Banned member ${username} from guild ${guildId}`);
        res.json({ success: true, message: 'Member banned successfully' });
    } catch (error) {
        logger.error('[Bot API] Error banning member:', error);
        res.status(500).json({ error: error.message });
    }
});

// Unban member
router.delete('/:guildId/bans/:userId', authenticateBotApi, async (req, res) => {
    try {
        const { guildId, userId } = req.params;
        const { executor } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        await guild.members.unban(userId);

        // Broadcast to frontend
        if (client.socket && client.socket.connected) {
            client.socket.emit('broadcast_to_guild', {
                guildId: guildId,
                event: 'member_action',
                data: {
                    action: 'Yasak kaldırıldı',
                    memberName: userId,
                    executor: executor,
                    timestamp: new Date().toISOString(),
                },
            });
        }

        logger.info(`[Bot API] Unbanned member ${userId} from guild ${guildId}`);
        res.json({ success: true, message: 'Member unbanned successfully' });
    } catch (error) {
        logger.error('[Bot API] Error unbanning member:', error);
        res.status(500).json({ error: error.message });
    }
});

// Timeout member
router.post('/:guildId/members/:userId/timeout', authenticateBotApi, async (req, res) => {
    try {
        const { guildId, userId } = req.params;
        const { duration = 600, reason = 'No reason provided', executor } = req.body; // duration in seconds

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        const member = await guild.members.fetch(userId);
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Calculate timeout until timestamp (max 28 days)
        const timeoutUntil = new Date(Date.now() + duration * 1000);
        await member.timeout(timeoutUntil, reason);

        // Broadcast to frontend
        if (client.socket && client.socket.connected) {
            client.socket.emit('broadcast_to_guild', {
                guildId: guildId,
                event: 'member_action',
                data: {
                    action: 'Üye susturuldu',
                    memberName: member.user.username,
                    duration: `${duration}s`,
                    executor: executor,
                    timestamp: new Date().toISOString(),
                },
            });
        }

        logger.info(`[Bot API] Timed out member ${member.user.username} in guild ${guildId}`);
        res.json({ success: true, message: 'Member timed out successfully' });
    } catch (error) {
        logger.error('[Bot API] Error timing out member:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get banned members
router.get('/:guildId/bans', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        const bans = await guild.bans.fetch();
        const banData = Array.from(bans.values()).map(ban => ({
            user: {
                id: ban.user.id,
                username: ban.user.username,
                discriminator: ban.user.discriminator,
                avatar: ban.user.avatar,
            },
            reason: ban.reason || 'No reason provided',
        }));

        res.json({ bans: banData, total: banData.length });
        logger.debug(`[Bot API] Fetched ${banData.length} bans for guild ${guildId}`);
    } catch (error) {
        logger.error('[Bot API] Error fetching bans:', error);
        res.status(500).json({ error: error.message });
    }
});

// === ROLE MANAGEMENT ===

// Get all roles
router.get('/:guildId/roles', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        const roles = Array.from(guild.roles.cache.values())
            .filter(role => role.id !== guild.id) // Exclude @everyone
            .map(role => ({
                id: role.id,
                name: role.name,
                color: role.color,
                position: role.position,
                permissions: role.permissions.bitfield.toString(),
                hoist: role.hoist,
                mentionable: role.mentionable,
                managed: role.managed,
                memberCount: role.members.size,
            }))
            .sort((a, b) => b.position - a.position);

        res.json({ roles, total: roles.length });
        logger.debug(`[Bot API] Fetched ${roles.length} roles for guild ${guildId}`);
    } catch (error) {
        logger.error('[Bot API] Error fetching roles:', error);
        res.status(500).json({ error: error.message });
    }
});

// === CHANNEL MANAGEMENT ===

// Get all channels
router.get('/:guildId/channels', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        const channels = Array.from(guild.channels.cache.values()).map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
            parentId: channel.parentId,
            topic: channel.topic || null,
            nsfw: channel.nsfw || false,
        }));

        res.json({ channels, total: channels.length });
        logger.debug(`[Bot API] Fetched ${channels.length} channels for guild ${guildId}`);
    } catch (error) {
        logger.error('[Bot API] Error fetching channels:', error);
        res.status(500).json({ error: error.message });
    }
});

// === AUDIT LOGS ===

// Get audit logs
router.get('/:guildId/audit-logs', authenticateBotApi, async (req, res) => {
    try {
        const { guildId } = req.params;
        const { limit = 25 } = req.query;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        const auditLogs = await guild.fetchAuditLogs({ limit: parseInt(limit) });
        const logs = Array.from(auditLogs.entries.values()).map(entry => ({
            id: entry.id,
            action: entry.action,
            actionType: entry.actionType,
            executor: {
                id: entry.executor.id,
                username: entry.executor.username,
                avatar: entry.executor.avatar,
            },
            target: entry.target ? {
                id: entry.target.id,
                name: entry.target.name || entry.target.username || 'Unknown',
            } : null,
            reason: entry.reason || null,
            createdAt: entry.createdAt,
        }));

        res.json({ logs, total: logs.length });
        logger.debug(`[Bot API] Fetched ${logs.length} audit logs for guild ${guildId}`);
    } catch (error) {
        logger.error('[Bot API] Error fetching audit logs:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router, setClient };

