const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { logger } = require('../utils/logger');
const { getDatabase } = require('../database/simple-db');

class ReactionRoleHandler {
    constructor(client) {
        this.client = client;
        this.db = getDatabase();
        this.activeSetups = new Map(); // messageId -> setup data
        
        this.setupListeners();
        logger.info('✅ Reaction Role Handler initialized');
    }

    setupListeners() {
        // Listen for message reactions
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return;
            await this.handleReactionAdd(reaction, user);
        });

        this.client.on('messageReactionRemove', async (reaction, user) => {
            if (user.bot) return;
            await this.handleReactionRemove(reaction, user);
        });
    }

    async createReactionRoleMessage(guildId, channelId, config) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                throw new Error('Guild not found');
            }

            const channel = guild.channels.cache.get(channelId);
            if (!channel) {
                throw new Error('Channel not found');
            }

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(config.title || '⭐ Rol Seçimi')
                .setDescription(config.description || 'Aşağıdaki reaksiyonlara tıklayarak rol alabilirsiniz!')
                .setColor(config.color || '#5865F2')
                .setTimestamp();

            // Add role information to embed
            if (config.roles && config.roles.length > 0) {
                const roleList = config.roles.map(r => `${r.emoji} - <@&${r.roleId}>`).join('\n');
                embed.addFields({
                    name: 'Roller',
                    value: roleList
                });
            }

            // Send message
            const message = await channel.send({ embeds: [embed] });

            // Add reactions
            if (config.roles && config.roles.length > 0) {
                for (const roleConfig of config.roles) {
                    try {
                        await message.react(roleConfig.emoji);
                    } catch (error) {
                        logger.error(`Failed to add reaction ${roleConfig.emoji}:`, error);
                    }
                }
            }

            // Save to database
            const setup = {
                guildId,
                channelId,
                messageId: message.id,
                ...config,
                createdAt: Date.now()
            };

            if (!this.db.data.reactionRoles) {
                this.db.data.reactionRoles = new Map();
            }

            this.db.data.reactionRoles.set(message.id, setup);
            this.activeSetups.set(message.id, setup);
            this.db.save();

            logger.info(`[ReactionRole] Created reaction role message ${message.id} in ${guildId}`);

            return {
                success: true,
                messageId: message.id,
                channelId: channel.id,
                messageUrl: message.url
            };
        } catch (error) {
            logger.error('[ReactionRole] Error creating message:', error);
            throw error;
        }
    }

    async handleReactionAdd(reaction, user) {
        try {
            // Fetch partial reactions
            if (reaction.partial) {
                await reaction.fetch();
            }

            const messageId = reaction.message.id;
            const setup = this.activeSetups.get(messageId) || 
                          this.db.data.reactionRoles?.get(messageId);

            if (!setup) return;

            // Find matching role
            const roleConfig = setup.roles?.find(r => r.emoji === reaction.emoji.name || r.emoji === reaction.emoji.id);
            if (!roleConfig) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(roleConfig.roleId);

            if (!role) {
                logger.warn(`[ReactionRole] Role ${roleConfig.roleId} not found`);
                return;
            }

            // Add role
            if (!member.roles.cache.has(role.id)) {
                await member.roles.add(role);
                logger.info(`[ReactionRole] Added role ${role.name} to ${user.tag}`);
            }
        } catch (error) {
            logger.error('[ReactionRole] Error handling reaction add:', error);
        }
    }

    async handleReactionRemove(reaction, user) {
        try {
            // Fetch partial reactions
            if (reaction.partial) {
                await reaction.fetch();
            }

            const messageId = reaction.message.id;
            const setup = this.activeSetups.get(messageId) || 
                          this.db.data.reactionRoles?.get(messageId);

            if (!setup) return;

            // Find matching role
            const roleConfig = setup.roles?.find(r => r.emoji === reaction.emoji.name || r.emoji === reaction.emoji.id);
            if (!roleConfig) return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(roleConfig.roleId);

            if (!role) {
                logger.warn(`[ReactionRole] Role ${roleConfig.roleId} not found`);
                return;
            }

            // Remove role
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                logger.info(`[ReactionRole] Removed role ${role.name} from ${user.tag}`);
            }
        } catch (error) {
            logger.error('[ReactionRole] Error handling reaction remove:', error);
        }
    }

    async deleteReactionRoleMessage(messageId) {
        try {
            const setup = this.db.data.reactionRoles?.get(messageId);
            if (!setup) {
                throw new Error('Reaction role message not found');
            }

            const guild = this.client.guilds.cache.get(setup.guildId);
            if (guild) {
                const channel = guild.channels.cache.get(setup.channelId);
                if (channel) {
                    const message = await channel.messages.fetch(messageId).catch(() => null);
                    if (message) {
                        await message.delete();
                    }
                }
            }

            this.db.data.reactionRoles.delete(messageId);
            this.activeSetups.delete(messageId);
            this.db.save();

            logger.info(`[ReactionRole] Deleted reaction role message ${messageId}`);
            return { success: true };
        } catch (error) {
            logger.error('[ReactionRole] Error deleting message:', error);
            throw error;
        }
    }

    getActiveSetups(guildId) {
        if (!this.db.data.reactionRoles) return [];

        const setups = [];
        this.db.data.reactionRoles.forEach((setup, messageId) => {
            if (setup.guildId === guildId) {
                setups.push({ messageId, ...setup });
            }
        });

        return setups;
    }

    async loadActiveSetups() {
        if (!this.db.data.reactionRoles) return;

        this.db.data.reactionRoles.forEach((setup, messageId) => {
            this.activeSetups.set(messageId, setup);
        });

        logger.info(`[ReactionRole] Loaded ${this.activeSetups.size} active setups`);
    }
}

module.exports = ReactionRoleHandler;
