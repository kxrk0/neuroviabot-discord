const { getDatabase } = require('../database/simple-db');
const { logger } = require('../utils/logger');

class AnalyticsHandler {
    constructor(client) {
        this.client = client;
        this.db = getDatabase();
        this.setupListeners();
        logger.info('📊 Analytics Handler initialized');
    }

    setupListeners() {
        // Message tracking
        this.client.on('messageCreate', (message) => this.trackMessage(message));
        
        // Voice state tracking
        this.client.on('voiceStateUpdate', (oldState, newState) => this.trackVoiceState(oldState, newState));
        
        logger.info('📊 Analytics event listeners registered');
    }

    trackMessage(message) {
        try {
            if (message.author.bot) return;
            if (!message.guild) return;

            const guildId = message.guild.id;
            const analytics = this.getGuildAnalytics(guildId);
            const today = new Date().toISOString().split('T')[0];

            // Increment total messages
            analytics.messages.total = (analytics.messages.total || 0) + 1;

            // Daily messages
            if (!analytics.messages.daily) analytics.messages.daily = {};
            analytics.messages.daily[today] = (analytics.messages.daily[today] || 0) + 1;

            // By channel
            if (!analytics.messages.byChannel) analytics.messages.byChannel = {};
            analytics.messages.byChannel[message.channel.id] = (analytics.messages.byChannel[message.channel.id] || 0) + 1;

            // By user
            if (!analytics.messages.byUser) analytics.messages.byUser = {};
            analytics.messages.byUser[message.author.id] = (analytics.messages.byUser[message.author.id] || 0) + 1;

            // Save to database
            this.saveGuildAnalytics(guildId, analytics);

            // Broadcast update
            if (this.client.socket && this.client.socket.connected) {
                this.client.socket.emit('broadcast_to_guild', {
                    guildId: guildId,
                    event: 'analytics_updated',
                    data: {
                        type: 'message',
                        total: analytics.messages.total,
                        timestamp: new Date().toISOString(),
                    },
                });
            }
        } catch (error) {
            logger.error('[Analytics] Error tracking message:', error);
        }
    }

    trackVoiceState(oldState, newState) {
        try {
            if (!newState.guild) return;
            
            const guildId = newState.guild.id;
            const userId = newState.member.id;
            const analytics = this.getGuildAnalytics(guildId);

            if (!analytics.voice) {
                analytics.voice = {
                    totalMinutes: 0,
                    byUser: {},
                    sessions: {}
                };
            }

            // User joined voice channel
            if (!oldState.channel && newState.channel) {
                if (!analytics.voice.sessions) analytics.voice.sessions = {};
                analytics.voice.sessions[userId] = Date.now();
                logger.debug(`[Analytics] ${newState.member.user.username} joined voice in ${guildId}`);
            }

            // User left voice channel
            if (oldState.channel && !newState.channel) {
                if (analytics.voice.sessions && analytics.voice.sessions[userId]) {
                    const sessionStart = analytics.voice.sessions[userId];
                    const duration = Math.floor((Date.now() - sessionStart) / 1000 / 60); // minutes

                    analytics.voice.totalMinutes = (analytics.voice.totalMinutes || 0) + duration;
                    
                    if (!analytics.voice.byUser) analytics.voice.byUser = {};
                    analytics.voice.byUser[userId] = (analytics.voice.byUser[userId] || 0) + duration;

                    delete analytics.voice.sessions[userId];
                    
                    logger.debug(`[Analytics] ${newState.member.user.username} left voice (${duration}m) in ${guildId}`);
                }
            }

            this.saveGuildAnalytics(guildId, analytics);
        } catch (error) {
            logger.error('[Analytics] Error tracking voice state:', error);
        }
    }

    trackCommand(guildId, commandName, userId) {
        try {
            const analytics = this.getGuildAnalytics(guildId);

            if (!analytics.commands) {
                analytics.commands = {
                    total: 0,
                    byCommand: {}
                };
            }

            analytics.commands.total = (analytics.commands.total || 0) + 1;
            analytics.commands.byCommand[commandName] = (analytics.commands.byCommand[commandName] || 0) + 1;

            this.saveGuildAnalytics(guildId, analytics);

            logger.debug(`[Analytics] Command ${commandName} tracked in ${guildId}`);
        } catch (error) {
            logger.error('[Analytics] Error tracking command:', error);
        }
    }

    trackMemberJoin(guildId) {
        try {
            const analytics = this.getGuildAnalytics(guildId);
            const today = new Date().toISOString().split('T')[0];

            if (!analytics.members) {
                analytics.members = {
                    joins: {},
                    leaves: {}
                };
            }

            analytics.members.joins[today] = (analytics.members.joins[today] || 0) + 1;
            this.saveGuildAnalytics(guildId, analytics);

            logger.debug(`[Analytics] Member join tracked in ${guildId}`);
        } catch (error) {
            logger.error('[Analytics] Error tracking member join:', error);
        }
    }

    trackMemberLeave(guildId) {
        try {
            const analytics = this.getGuildAnalytics(guildId);
            const today = new Date().toISOString().split('T')[0];

            if (!analytics.members) {
                analytics.members = {
                    joins: {},
                    leaves: {}
                };
            }

            analytics.members.leaves[today] = (analytics.members.leaves[today] || 0) + 1;
            this.saveGuildAnalytics(guildId, analytics);

            logger.debug(`[Analytics] Member leave tracked in ${guildId}`);
        } catch (error) {
            logger.error('[Analytics] Error tracking member leave:', error);
        }
    }

    getGuildAnalytics(guildId) {
        const settings = this.db.getGuildSettings(guildId) || {};
        return settings.analytics || {
            messages: {
                total: 0,
                daily: {},
                byChannel: {},
                byUser: {}
            },
            members: {
                joins: {},
                leaves: {}
            },
            commands: {
                total: 0,
                byCommand: {}
            },
            voice: {
                totalMinutes: 0,
                byUser: {},
                sessions: {}
            }
        };
    }

    saveGuildAnalytics(guildId, analytics) {
        try {
            const settings = this.db.getGuildSettings(guildId) || {};
            settings.analytics = analytics;
            this.db.setGuildSettings(guildId, settings);
        } catch (error) {
            logger.error('[Analytics] Error saving analytics:', error);
        }
    }

    getTopChannels(guildId, limit = 5) {
        const analytics = this.getGuildAnalytics(guildId);
        const channels = analytics.messages.byChannel || {};
        
        return Object.entries(channels)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([channelId, count]) => {
                const channel = this.client.channels.cache.get(channelId);
                return {
                    id: channelId,
                    name: channel ? channel.name : 'Unknown',
                    messages: count
                };
            });
    }

    getTopUsers(guildId, limit = 5) {
        const analytics = this.getGuildAnalytics(guildId);
        const users = analytics.messages.byUser || {};
        
        return Object.entries(users)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([userId, count]) => {
                const guild = this.client.guilds.cache.get(guildId);
                const member = guild ? guild.members.cache.get(userId) : null;
                return {
                    id: userId,
                    name: member ? (member.displayName || member.user.username) : 'Unknown',
                    messages: count
                };
            });
    }
}

module.exports = AnalyticsHandler;

