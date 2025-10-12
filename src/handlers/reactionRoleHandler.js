const { getDatabase } = require('../database/simple-db');
const { logger } = require('../utils/logger');
const { getAuditLogger } = require('../utils/auditLogger');

class ReactionRoleHandler {
    constructor(client) {
        this.client = client;
        this.db = getDatabase();
        this.auditLogger = getAuditLogger();
        
        this.setupListeners();
        logger.info('✅ Reaction Role Handler initialized');
    }

    setupListeners() {
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return;
            await this.handleReactionAdd(reaction, user);
        });

        this.client.on('messageReactionRemove', async (reaction, user) => {
            if (user.bot) return;
            await this.handleReactionRemove(reaction, user);
        });
    }

    async handleReactionAdd(reaction, user) {
        try {
            // Fetch partial reactions
            if (reaction.partial) {
                await reaction.fetch();
            }

            const { message } = reaction;
            const guildId = message.guild?.id;
            if (!guildId) return;

            // Check if this message has reaction role config
            const config = this.getReactionRoleConfig(guildId, message.id, reaction.emoji.name);
            if (!config) return;

            // Get member
            const member = await message.guild.members.fetch(user.id);
            if (!member) return;

            // Add role
            const role = message.guild.roles.cache.get(config.roleId);
            if (!role) {
                logger.warn(`[ReactionRole] Role ${config.roleId} not found in guild ${guildId}`);
                return;
            }

            await member.roles.add(role);
            logger.info(`[ReactionRole] Added role ${role.name} to ${user.tag} in ${message.guild.name}`);

            // Log to audit
            this.auditLogger.log(
                guildId,
                'ROLE_ADD',
                user.id,
                role.id,
                `Reaction role added: ${role.name}`,
                { method: 'reaction', emoji: reaction.emoji.name },
                'info'
            );

        } catch (error) {
            logger.error('[ReactionRole] Error adding role:', error);
        }
    }

    async handleReactionRemove(reaction, user) {
        try {
            if (reaction.partial) {
                await reaction.fetch();
            }

            const { message } = reaction;
            const guildId = message.guild?.id;
            if (!guildId) return;

            const config = this.getReactionRoleConfig(guildId, message.id, reaction.emoji.name);
            if (!config) return;

            const member = await message.guild.members.fetch(user.id);
            if (!member) return;

            const role = message.guild.roles.cache.get(config.roleId);
            if (!role) return;

            await member.roles.remove(role);
            logger.info(`[ReactionRole] Removed role ${role.name} from ${user.tag} in ${message.guild.name}`);

            this.auditLogger.log(
                guildId,
                'ROLE_REMOVE',
                user.id,
                role.id,
                `Reaction role removed: ${role.name}`,
                { method: 'reaction', emoji: reaction.emoji.name },
                'info'
            );

        } catch (error) {
            logger.error('[ReactionRole] Error removing role:', error);
        }
    }

    getReactionRoleConfig(guildId, messageId, emoji) {
        const guildSettings = this.db.getGuildSettings(guildId);
        const reactionRoles = guildSettings.reactionRoles || [];
        
        return reactionRoles.find(config => 
            config.messageId === messageId && 
            config.emoji === emoji &&
            config.enabled !== false
        );
    }

    addReactionRole(guildId, config) {
        const guildSettings = this.db.getGuildSettings(guildId);
        const reactionRoles = guildSettings.reactionRoles || [];
        
        reactionRoles.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...config,
            enabled: true,
            createdAt: new Date().toISOString()
        });

        this.db.updateGuildSettingsCategory(guildId, 'reactionRoles', reactionRoles);
        logger.info(`[ReactionRole] Added reaction role config in guild ${guildId}`);
        
        return { success: true };
    }

    removeReactionRole(guildId, configId) {
        const guildSettings = this.db.getGuildSettings(guildId);
        let reactionRoles = guildSettings.reactionRoles || [];
        
        reactionRoles = reactionRoles.filter(config => config.id !== configId);
        this.db.updateGuildSettingsCategory(guildId, 'reactionRoles', reactionRoles);
        
        logger.info(`[ReactionRole] Removed reaction role config ${configId} in guild ${guildId}`);
        return { success: true };
    }

    getReactionRoles(guildId) {
        const guildSettings = this.db.getGuildSettings(guildId);
        return guildSettings.reactionRoles || [];
    }
}

module.exports = ReactionRoleHandler;

