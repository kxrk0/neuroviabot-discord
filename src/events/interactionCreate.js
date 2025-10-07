// ==========================================
// 🤖 NeuroViaBot - Interaction Create Event
// ==========================================

const { logger } = require('../utils/logger');
const config = require('../config.js');

// Cooldown Map
const cooldowns = new Map();

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        // QuickSetup menü etkileşimlerini handle et
        if (interaction.isStringSelectMenu() && interaction.customId.startsWith('quicksetup_')) {
            const { handleSetupInteraction } = require('../commands/quicksetup.js');
            return await handleSetupInteraction(interaction);
        }

        // Sadece slash komutları için
        if (!interaction.isChatInputCommand()) return;

        console.log(`[INTERACTION] Received command: ${interaction.commandName}`);
        console.log(`[INTERACTION] User: ${interaction.user.tag} (${interaction.user.id})`);
        console.log(`[INTERACTION] Guild: ${interaction.guild?.name || 'DM'} (${interaction.guild?.id || 'DM'})`);
        console.log(`[INTERACTION] Available commands: ${Array.from(client.commands.keys()).join(', ')}`);

        const command = client.commands.get(interaction.commandName);
        console.log(`[INTERACTION] Command found: ${!!command}`);

        // Komut bulunamadıysa
        if (!command) {
            console.error(`[INTERACTION] Command not found: ${interaction.commandName}`);
            logger.error(`Komut bulunamadı: ${interaction.commandName}`);
            if (!interaction.replied && !interaction.deferred) {
                return await interaction.reply({
                    content: '❌ Bu komut bulunamadı veya geçici olarak devre dışı!',
                    flags: 64 // Ephemeral
                }).catch(() => {});
            }
            return;
        }

        // Cooldown kontrolü
        const cooldownResult = checkCooldown(interaction, command);
        if (cooldownResult) {
            if (!interaction.replied && !interaction.deferred) {
                return await interaction.reply({
                    content: cooldownResult,
                    flags: 64 // Ephemeral
                }).catch(() => {});
            }
            return;
        }

        // Feature kontrolü
        const featureCheck = checkFeatureEnabled(command);
        if (!featureCheck.enabled) {
            if (!interaction.replied && !interaction.deferred) {
                return await interaction.reply({
                    content: `❌ ${featureCheck.message}`,
                    flags: 64 // Ephemeral
                }).catch(() => {});
            }
            return;
        }

        // Permission kontrolü (guild komutları için)
        if (interaction.guild && command.data.default_member_permissions) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.permissions.has(command.data.default_member_permissions)) {
                return await interaction.reply({
                    content: config.messages.noPermission,
                    ephemeral: true
                });
            }
        }

        // Performans izleme - try bloğundan ÖNCE tanımla
        const startTime = Date.now();

        try {
            // Security kontrolü
            if (client.security.isBlacklisted(interaction.user.id)) {
                return await interaction.reply({
                    content: '❌ Bu bot ile etkileşimde bulunma yetkiniz kısıtlanmıştır.',
                    ephemeral: true
                });
            }

            // Rate limit kontrolü
            if (client.security.isRateLimited(interaction.user.id, 'commands')) {
                return await interaction.reply({
                    content: '⏰ Çok hızlı komut kullanıyorsunuz! Lütfen biraz bekleyin.',
                    ephemeral: true
                });
            }
            
            // Komutu çalıştır
            await command.execute(interaction);
            
            const endTime = Date.now();
            const executionTime = endTime - startTime;

            // Analytics tracking
            client.analytics.trackCommand(
                interaction.commandName,
                interaction.user.id,
                interaction.guild?.id || 'DM',
                executionTime,
                true
            );

            // Başarılı komut logu
            logger.commandUsage(
                interaction.commandName, 
                interaction.user, 
                interaction.guild, 
                true
            );

            // Yavaş komutları logla (>3 saniye)
            if (executionTime > 3000) {
                logger.warn(`Yavaş komut: ${interaction.commandName} - ${executionTime}ms`, {
                    command: interaction.commandName,
                    user: interaction.user.tag,
                    guild: interaction.guild?.name,
                    executionTime
                });
            }

        } catch (error) {
            const errorId = Date.now().toString(36);
            const executionTime = Date.now() - startTime;
            
            // Analytics error tracking
            client.analytics.trackError(
                error.name || 'UnknownError',
                interaction.commandName,
                interaction.user.id,
                interaction.guild?.id || 'DM',
                error.message
            );

            client.analytics.trackCommand(
                interaction.commandName,
                interaction.user.id,
                interaction.guild?.id || 'DM',
                executionTime,
                false
            );
            
            // Hata logu
            logger.error(`Komut hatası (${errorId}): ${interaction.commandName}`, error, {
                command: interaction.commandName,
                user: interaction.user.tag,
                guild: interaction.guild?.name,
                errorId
            });

            // Başarısız komut logu
            logger.commandUsage(
                interaction.commandName, 
                interaction.user, 
                interaction.guild, 
                false
            );

            const errorMessage = {
                content: `❌ Komut çalıştırılırken bir hata oluştu!\n\`\`\`Hata ID: ${errorId}\`\`\``,
                flags: 64 // Ephemeral
            };

            try {
                // Check if interaction is still valid and not expired
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply(errorMessage).catch(() => {});
                } else if (interaction.deferred || interaction.replied) {
                    await interaction.followUp(errorMessage).catch(() => {});
                }
            } catch (replyError) {
                // Silently fail if interaction expired (3 second timeout)
                logger.debug('Could not send error message (interaction expired)');
            }
        }
    }
};

// Cooldown kontrolü
function checkCooldown(interaction, command) {
    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = getCooldownAmount(command.data.name) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = Math.ceil((expirationTime - now) / 1000);
            return config.messages.cooldownMessage.replace('{time}', timeLeft);
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    return null;
}

// Cooldown süresi belirleme
function getCooldownAmount(commandName) {
    // Komut kategorisine göre cooldown
    if (['play', 'skip', 'pause', 'resume', 'stop', 'queue', 'nowplaying'].includes(commandName)) {
        return config.cooldowns.music;
    }
    if (['clear', 'ban', 'kick', 'mute', 'warn'].includes(commandName)) {
        return config.cooldowns.moderation;
    }
    if (['slots', 'coinflip', 'dice'].includes(commandName)) {
        return config.cooldowns.coinflip;
    }
    if (commandName === 'blackjack') {
        return config.cooldowns.blackjack;
    }
    if (commandName === 'daily') {
        return config.cooldowns.daily;
    }
    if (commandName === 'work') {
        return config.cooldowns.work;
    }

    return 3; // Default 3 saniye
}

// Feature kontrolü
function checkFeatureEnabled(command) {
    const commandName = command.data.name;
    
    // Müzik komutları
    const musicCommands = ['play', 'skip', 'pause', 'resume', 'stop', 'queue', 'nowplaying', 'loop', 'shuffle', 'volume', 'join', 'leave'];
    if (musicCommands.includes(commandName) && !config.features.music) {
        return {
            enabled: false,
            message: 'Müzik sistemi şu anda devre dışı!'
        };
    }

    // Ekonomi komutları
    const economyCommands = ['balance', 'daily', 'work', 'shop', 'buy', 'inventory', 'slots', 'coinflip', 'blackjack'];
    if (economyCommands.includes(commandName) && !config.features.economy) {
        return {
            enabled: false,
            message: 'Ekonomi sistemi şu anda devre dışı!'
        };
    }

    // Moderasyon komutları
    const moderationCommands = ['ban', 'kick', 'mute', 'warn', 'clear', 'backup'];
    if (moderationCommands.includes(commandName) && !config.features.moderation) {
        return {
            enabled: false,
            message: 'Moderasyon sistemi şu anda devre dışı!'
        };
    }

    // Seviye komutları
    const levelingCommands = ['level', 'rank', 'leaderboard'];
    if (levelingCommands.includes(commandName) && !config.features.leveling) {
        return {
            enabled: false,
            message: 'Seviye sistemi şu anda devre dışı!'
        };
    }

    // Ticket komutları
    const ticketCommands = ['ticket'];
    if (ticketCommands.includes(commandName) && !config.features.tickets) {
        return {
            enabled: false,
            message: 'Ticket sistemi şu anda devre dışı!'
        };
    }

    // Çekiliş komutları
    const giveawayCommands = ['giveaway'];
    if (giveawayCommands.includes(commandName) && !config.features.giveaways) {
        return {
            enabled: false,
            message: 'Çekiliş sistemi şu anda devre dışı!'
        };
    }

    return { enabled: true };
}

// Cooldown temizleme (memory leak önleme)
setInterval(() => {
    const now = Date.now();
    cooldowns.forEach((timestamps, commandName) => {
        timestamps.forEach((timestamp, userId) => {
            const cooldownAmount = getCooldownAmount(commandName) * 1000;
            if (now - timestamp > cooldownAmount) {
                timestamps.delete(userId);
            }
        });
    });
}, 300000); // Her 5 dakikada bir temizle
