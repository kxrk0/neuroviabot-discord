const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getDatabase } = require('../database/simple-db');
const { logger } = require('../utils/logger');
const { getAuditLogger } = require('../utils/auditLogger');

class AutoModHandler {
    constructor(client) {
        this.client = client;
        this.db = getDatabase();
        this.auditLogger = getAuditLogger();
        
        // Track user message rates: Map<userId:guildId, Array<timestamp>>
        this.messageHistory = new Map();
        
        // Track user violations: Map<userId:guildId, count>
        this.violations = new Map();
        
        // Cleanup interval
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
        
        this.setupListeners();
        logger.info('✅ Auto-Moderation Handler initialized');
    }

    setupListeners() {
        this.client.on('messageCreate', async (message) => {
            if (message.author.bot || !message.guild) return;
            await this.handleMessage(message);
        });
    }

    async handleMessage(message) {
        try {
            const guildId = message.guild.id;
            const userId = message.user.id;
            
            // Get automod settings
            const settings = this.getAutoModSettings(guildId);
            if (!settings || !settings.enabled) return;

            // Check spam
            if (settings.antiSpam?.enabled) {
                const isSpam = await this.checkSpam(message, settings.antiSpam);
                if (isSpam) return; // Message was deleted
            }

            // Check links
            if (settings.linkFilter?.enabled) {
                const hasBlockedLink = await this.checkLinks(message, settings.linkFilter);
                if (hasBlockedLink) return;
            }

            // Check words
            if (settings.wordFilter?.enabled) {
                const hasBlockedWord = await this.checkWords(message, settings.wordFilter);
                if (hasBlockedWord) return;
            }

        } catch (error) {
            logger.error('[AutoMod] Error handling message:', error);
        }
    }

    async checkSpam(message, spamSettings) {
        const key = `${message.author.id}:${message.guild.id}`;
        const now = Date.now();
        
        // Get or create message history
        if (!this.messageHistory.has(key)) {
            this.messageHistory.set(key, []);
        }
        
        const history = this.messageHistory.get(key);
        
        // Add current message
        history.push({
            timestamp: now,
            content: message.content,
            channelId: message.channel.id
        });
        
        // Remove messages older than timeframe
        const timeframe = spamSettings.timeframe || 5000; // 5 seconds default
        const recentMessages = history.filter(m => now - m.timestamp < timeframe);
        this.messageHistory.set(key, recentMessages);
        
        // Check message rate
        const maxMessages = spamSettings.maxMessages || 5;
        if (recentMessages.length > maxMessages) {
            await this.handleSpamViolation(message, spamSettings);
            return true;
        }
        
        // Check duplicate messages
        if (spamSettings.checkDuplicates) {
            const duplicateCount = recentMessages.filter(m => 
                m.content === message.content
            ).length;
            
            if (duplicateCount >= 3) {
                await this.handleSpamViolation(message, spamSettings, 'duplicate');
                return true;
            }
        }
        
        return false;
    }

    async checkLinks(message, linkSettings) {
        // URL regex
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        const urls = message.content.match(urlRegex) || [];
        
        if (urls.length === 0) return false;
        
        // Check whitelist first
        if (linkSettings.whitelist && linkSettings.whitelist.length > 0) {
            const isWhitelisted = urls.every(url => 
                linkSettings.whitelist.some(allowed => url.includes(allowed))
            );
            
            if (!isWhitelisted) {
                await this.handleLinkViolation(message, linkSettings, urls);
                return true;
            }
        }
        
        // Check blacklist
        if (linkSettings.blacklist && linkSettings.blacklist.length > 0) {
            const hasBlacklisted = urls.some(url => 
                linkSettings.blacklist.some(blocked => url.includes(blocked))
            );
            
            if (hasBlacklisted) {
                await this.handleLinkViolation(message, linkSettings, urls);
                return true;
            }
        }
        
        return false;
    }

    async checkWords(message, wordSettings) {
        const blockedWords = wordSettings.blockedWords || [];
        if (blockedWords.length === 0) return false;
        
        const content = message.content.toLowerCase();
        
        for (const word of blockedWords) {
            const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
            if (regex.test(content)) {
                await this.handleWordViolation(message, wordSettings, word);
                return true;
            }
        }
        
        return false;
    }

    async handleSpamViolation(message, settings, type = 'rate') {
        try {
            // Delete message
            await message.delete().catch(() => {});
            
            // Track violation
            await this.trackViolation(message.author.id, message.guild.id, 'SPAM', {
                type,
                channel: message.channel.name
            });
            
            // Get violation count
            const key = `${message.author.id}:${message.guild.id}`;
            const violationCount = this.violations.get(key) || 0;
            
            // Take action based on settings and violation count
            const action = this.getAction(violationCount, settings.actions);
            
            if (action === 'mute') {
                await this.muteUser(message.member, settings.muteDuration || 600000); // 10 min default
            } else if (action === 'kick') {
                await message.member.kick('Auto-mod: Spam');
            } else if (action === 'ban') {
                await message.member.ban({ reason: 'Auto-mod: Spam', deleteMessageSeconds: 86400 });
            }
            
            // Send warning DM
            const embed = new EmbedBuilder()
                .setColor('#ef4444')
                .setTitle('⚠️ Spam Uyarısı')
                .setDescription(`${message.guild.name} sunucusunda spam tespit edildi.\n\n**Sebep:** ${type === 'rate' ? 'Çok hızlı mesaj' : 'Tekrarlayan mesajlar'}\n**İşlem:** ${action || 'Uyarı'}`)
                .setTimestamp();
            
            await message.author.send({ embeds: [embed] }).catch(() => {});
            
            // Log to channel
            if (settings.logChannel) {
                const logChannel = message.guild.channels.cache.get(settings.logChannel);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#ef4444')
                        .setTitle('🚫 Auto-Mod: Spam')
                        .addFields(
                            { name: 'Kullanıcı', value: `${message.author} (${message.author.tag})`, inline: true },
                            { name: 'Kanal', value: `${message.channel}`, inline: true },
                            { name: 'İhlal Sayısı', value: `${violationCount}`, inline: true },
                            { name: 'İşlem', value: action || 'Uyarı', inline: true },
                            { name: 'Mesaj', value: message.content.substring(0, 1024) || 'N/A', inline: false }
                        )
                        .setTimestamp();
                    
                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
            
            // Audit log
            this.auditLogger.log({
                guildId: message.guild.id,
                action: 'AUTOMOD_SPAM',
                executor: { id: this.client.user.id, username: 'AutoMod' },
                target: { id: message.author.id, name: message.author.tag, type: 'user' },
                changes: { violationCount, action: action || 'warning', type },
                reason: `Spam detected: ${type}`
            });
            
        } catch (error) {
            logger.error('[AutoMod] Error handling spam violation:', error);
        }
    }

    async handleLinkViolation(message, settings, urls) {
        try {
            await message.delete().catch(() => {});
            
            await this.trackViolation(message.author.id, message.guild.id, 'LINK', {
                urls,
                channel: message.channel.name
            });
            
            const key = `${message.author.id}:${message.guild.id}`;
            const violationCount = this.violations.get(key) || 0;
            const action = this.getAction(violationCount, settings.actions);
            
            if (action === 'mute') {
                await this.muteUser(message.member, settings.muteDuration || 600000);
            } else if (action === 'kick') {
                await message.member.kick('Auto-mod: Yasak link');
            } else if (action === 'ban') {
                await message.member.ban({ reason: 'Auto-mod: Yasak link' });
            }
            
            const embed = new EmbedBuilder()
                .setColor('#ef4444')
                .setTitle('⚠️ Link Uyarısı')
                .setDescription(`${message.guild.name} sunucusunda yasak link tespit edildi.\n\n**İşlem:** ${action || 'Uyarı'}`)
                .setTimestamp();
            
            await message.author.send({ embeds: [embed] }).catch(() => {});
            
            this.auditLogger.log({
                guildId: message.guild.id,
                action: 'AUTOMOD_LINK',
                executor: { id: this.client.user.id, username: 'AutoMod' },
                target: { id: message.author.id, name: message.author.tag, type: 'user' },
                changes: { violationCount, action: action || 'warning', urls },
                reason: 'Blocked link detected'
            });
            
        } catch (error) {
            logger.error('[AutoMod] Error handling link violation:', error);
        }
    }

    async handleWordViolation(message, settings, word) {
        try {
            await message.delete().catch(() => {});
            
            await this.trackViolation(message.author.id, message.guild.id, 'WORD', {
                word,
                channel: message.channel.name
            });
            
            const key = `${message.author.id}:${message.guild.id}`;
            const violationCount = this.violations.get(key) || 0;
            const action = this.getAction(violationCount, settings.actions);
            
            if (action === 'mute') {
                await this.muteUser(message.member, settings.muteDuration || 600000);
            } else if (action === 'kick') {
                await message.member.kick('Auto-mod: Uygunsuz kelime');
            } else if (action === 'ban') {
                await message.member.ban({ reason: 'Auto-mod: Uygunsuz kelime' });
            }
            
            const embed = new EmbedBuilder()
                .setColor('#ef4444')
                .setTitle('⚠️ Kelime Filtresi')
                .setDescription(`${message.guild.name} sunucusunda uygunsuz kelime tespit edildi.\n\n**İşlem:** ${action || 'Uyarı'}`)
                .setTimestamp();
            
            await message.author.send({ embeds: [embed] }).catch(() => {});
            
            this.auditLogger.log({
                guildId: message.guild.id,
                action: 'AUTOMOD_WORD',
                executor: { id: this.client.user.id, username: 'AutoMod' },
                target: { id: message.author.id, name: message.author.tag, type: 'user' },
                changes: { violationCount, action: action || 'warning' },
                reason: 'Blocked word detected'
            });
            
        } catch (error) {
            logger.error('[AutoMod] Error handling word violation:', error);
        }
    }

    async muteUser(member, duration) {
        try {
            // Try to use timeout first (native Discord feature)
            if (member.moderatable) {
                await member.timeout(duration, 'Auto-mod violation');
                return;
            }
            
            // Fallback: Add mute role
            const muteRole = member.guild.roles.cache.find(r => r.name === 'Muted' || r.name === 'Susturuldu');
            if (muteRole) {
                await member.roles.add(muteRole);
                
                // Auto-unmute after duration
                setTimeout(async () => {
                    try {
                        await member.roles.remove(muteRole);
                    } catch (error) {
                        logger.error('[AutoMod] Error removing mute role:', error);
                    }
                }, duration);
            }
        } catch (error) {
            logger.error('[AutoMod] Error muting user:', error);
        }
    }

    async trackViolation(userId, guildId, type, data) {
        const key = `${userId}:${guildId}`;
        const currentCount = this.violations.get(key) || 0;
        this.violations.set(key, currentCount + 1);
        
        // Save to database
        const settings = this.db.getGuildSettings(guildId) || {};
        if (!settings.automod_violations) {
            settings.automod_violations = [];
        }
        
        settings.automod_violations.push({
            userId,
            type,
            data,
            timestamp: new Date().toISOString(),
            count: currentCount + 1
        });
        
        // Keep only last 100 violations
        if (settings.automod_violations.length > 100) {
            settings.automod_violations = settings.automod_violations.slice(-100);
        }
        
        this.db.setGuildSettings(guildId, settings);
    }

    getAction(violationCount, actions) {
        if (!actions) return null;
        
        // Actions format: { 1: 'warn', 3: 'mute', 5: 'kick', 10: 'ban' }
        const counts = Object.keys(actions).map(Number).sort((a, b) => b - a);
        
        for (const count of counts) {
            if (violationCount >= count) {
                return actions[count];
            }
        }
        
        return null;
    }

    getAutoModSettings(guildId) {
        const settings = this.db.getGuildSettings(guildId);
        return settings?.automod_settings || null;
    }

    cleanup() {
        const now = Date.now();
        const maxAge = 60000; // 1 minute
        
        // Clean message history
        for (const [key, history] of this.messageHistory.entries()) {
            const recent = history.filter(m => now - m.timestamp < maxAge);
            if (recent.length === 0) {
                this.messageHistory.delete(key);
            } else {
                this.messageHistory.set(key, recent);
            }
        }
        
        // Reset violations older than 1 hour
        const violationMaxAge = 3600000; // 1 hour
        for (const [key, count] of this.violations.entries()) {
            const [userId, guildId] = key.split(':');
            const settings = this.db.getGuildSettings(guildId);
            const violations = settings?.automod_violations || [];
            
            const recentViolations = violations.filter(v => 
                v.userId === userId && 
                Date.now() - new Date(v.timestamp).getTime() < violationMaxAge
            );
            
            if (recentViolations.length === 0) {
                this.violations.delete(key);
            }
        }
    }

    destroy() {
        clearInterval(this.cleanupInterval);
        this.messageHistory.clear();
        this.violations.clear();
        logger.info('[AutoMod] Handler destroyed');
    }
}

module.exports = AutoModHandler;

