// ==========================================
// 🤖 NeuroViaBot - Message Create Event
// ==========================================

const { logger } = require('../utils/logger');
const { getOrCreateUser, getOrCreateGuild, getOrCreateGuildMember } = require('../models/index');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        try {
            // Bot mesajlarını ve DM'leri görmezden gel
            if (message.author.bot || !message.guild) return;

            // Analytics message tracking
            client.analytics.trackMessage(
                message.author.id,
                message.guild.id,
                message.channel.id,
                message.content.length,
                message.attachments.size > 0
            );

            // Spam detection
            const spamResult = client.security.detectSpam(message);
            if (spamResult.isSpam) {
                logger.warn(`Spam detected from ${message.author.tag}`, {
                    guild: message.guild.name,
                    score: spamResult.score,
                    reason: spamResult.reason
                });
                
                // Optional: Auto-delete spam messages
                // await message.delete().catch(() => {});
                return;
            }

            // Database'e kullanıcı/guild bilgilerini kaydet
            await saveToDatabase(message);

            // Auto-Moderation kontrolü
            const shouldContinue = await handleAutoModeration(message);
            if (!shouldContinue) return; // Mesaj otomatik moderasyon tarafından silinmişse dur

            // Custom command kontrolü
            await handleCustomCommands(message);

            // XP/Leveling sistemi (eğer aktifse)
            await handleLevelingSystem(message);

        } catch (error) {
            logger.error('messageCreate event hatası', error, {
                guild: message.guild?.name,
                user: message.author.tag,
                messageId: message.id
            });
        }
    }
};

// Auto-Moderation handler
async function handleAutoModeration(message) {
    try {
        const { getDatabase } = require('../database/simple-db');
        const { EmbedBuilder } = require('discord.js');
        const db = getDatabase();
        
        // Sunucu ayarlarını kontrol et
        const settings = db.getGuildSettings(message.guild.id);
        
        // Auto-mod aktif mi kontrol et
        if (!settings.moderationEnabled || !settings.autoModEnabled) return true;
        
        const content = message.content.toLowerCase();
        let shouldDelete = false;
        let reason = '';
        
        // Davet linki kontrolü
        if (settings.antiInvite && (content.includes('discord.gg/') || content.includes('discord.com/invite/'))) {
            shouldDelete = true;
            reason = 'Discord davet linki paylaşımı yasak';
        }
        
        // Link kontrolü
        if (settings.antiLink && (content.includes('http://') || content.includes('https://') || content.includes('www.'))) {
            shouldDelete = true;
            reason = 'Link paylaşımı yasak';
        }
        
        // Kötü kelime kontrolü
        if (settings.badWords && settings.badWords.length > 0) {
            const badWordsList = typeof settings.badWords === 'string' 
                ? settings.badWords.split(',').map(w => w.trim().toLowerCase())
                : settings.badWords;
            
            for (const badWord of badWordsList) {
                if (content.includes(badWord)) {
                    shouldDelete = true;
                    reason = 'Yasaklı kelime kullanımı';
                    break;
                }
            }
        }
        
        // Spam kontrolü
        if (settings.spamProtection) {
            const userId = message.author.id;
            if (!message.client.spamTracker) {
                message.client.spamTracker = new Map();
            }
            
            const now = Date.now();
            const userSpam = message.client.spamTracker.get(userId) || [];
            
            // Son 5 saniyedeki mesajları filtrele
            const recentMessages = userSpam.filter(timestamp => now - timestamp < 5000);
            recentMessages.push(now);
            
            message.client.spamTracker.set(userId, recentMessages);
            
            // 5 saniyede 5'ten fazla mesaj
            if (recentMessages.length > 5) {
                shouldDelete = true;
                reason = 'Spam tespiti';
            }
        }
        
        // Mesajı sil ve uyarı ver
        if (shouldDelete) {
            try {
                await message.delete();
                
                // Kullanıcıya uyarı gönder
                const warningEmbed = new EmbedBuilder()
                    .setColor('#ff4444')
                    .setTitle('⚠️ Otomatik Moderasyon')
                    .setDescription(`${message.author}, mesajınız otomatik moderasyon sistemi tarafından silindi.`)
                    .addFields({ name: 'Sebep', value: reason })
                    .setTimestamp();
                
                const warningMessage = await message.channel.send({ embeds: [warningEmbed] });
                
                // 5 saniye sonra uyarı mesajını da sil
                setTimeout(() => {
                    warningMessage.delete().catch(() => {});
                }, 5000);
                
                // Mod log kanalına bildir
                if (settings.modLogChannelId) {
                    const modLogChannel = message.guild.channels.cache.get(settings.modLogChannelId);
                    if (modLogChannel) {
                        const modLogEmbed = new EmbedBuilder()
                            .setColor('#ff4444')
                            .setTitle('🛡️ Auto-Mod: Mesaj Silindi')
                            .addFields(
                                { name: '👤 Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
                                { name: '📢 Kanal', value: `${message.channel}`, inline: true },
                                { name: '📝 İçerik', value: message.content.substring(0, 1024) || '*İçerik yok*' },
                                { name: '⚠️ Sebep', value: reason }
                            )
                            .setTimestamp();
                        
                        await modLogChannel.send({ embeds: [modLogEmbed] });
                    }
                }
                
                logger.info(`[Auto-Mod] Message deleted from ${message.author.tag}: ${reason}`);
                return false; // Mesaj silindi, işleme devam etme
            } catch (error) {
                console.error('❌ Auto-mod handler hatası');
                return true;
            }
        }
        
        return true; // Mesaj temiz, işleme devam et
        
    } catch (error) {
        console.error('❌ Auto-mod handler hatası');
        return true;
    }
}

// Database'e kaydetme
async function saveToDatabase(message) {
    try {
        // User kaydı
        await getOrCreateUser(message.author.id, {
            username: message.author.username,
            discriminator: message.author.discriminator,
            globalName: message.author.globalName,
            avatar: message.author.avatar
        });

        // Guild kaydı
        await getOrCreateGuild(message.guild.id, {
            name: message.guild.name
        });

        // GuildMember kaydı
        await getOrCreateGuildMember(message.author.id, message.guild.id, {
            nickname: message.member.nickname
        });

    } catch (error) {
        logger.debug('Database kayıt hatası (kritik değil)', error);
    }
}

// Custom command kontrolü
async function handleCustomCommands(message) {
    try {
        const { CustomCommand } = require('../models/index');
        
        // Basit prefix kontrolü (! ile başlayan mesajlar)
        if (!message.content.startsWith('!')) return;
        
        const commandName = message.content.slice(1).split(' ')[0].toLowerCase();
        
        // Custom command var mı kontrol et
        const customCommand = await CustomCommand.findByName(message.guild.id, commandName);
        
        if (customCommand) {
            // Usage count artır
            await CustomCommand.update(customCommand.id, {
                usageCount: customCommand.usageCount + 1
            });
            
            // Response gönder
            let response = customCommand.response;
            
            // Variable replacement
            response = response.replace(/{user}/g, `<@${message.author.id}>`);
            response = response.replace(/{server}/g, message.guild.name);
            response = response.replace(/{memberCount}/g, message.guild.memberCount);
            response = response.replace(/{channel}/g, `<#${message.channel.id}>`);
            
            await message.reply(response);
            
            logger.info(`Custom command executed: ${commandName}`, {
                guild: message.guild.name,
                user: message.author.tag
            });
        }
        
    } catch (error) {
        logger.debug('Custom command handling hatası', error);
    }
}

// Leveling sistemi
async function handleLevelingSystem(message) {
    try {
        const { getDatabase } = require('../database/simple-db');
        const db = getDatabase();
        
        // Sunucu ayarlarını kontrol et
        const settings = db.getGuildSettings(message.guild.id);
        
        // Leveling aktif mi kontrol et
        if (!settings.levelingEnabled) return;
        
        // Cooldown kontrolü (ayarlarda tanımlı veya 60 saniye)
        const userId = message.author.id;
        const guildId = message.guild.id;
        const cooldownKey = `${userId}-${guildId}`;
        
        if (message.client.xpCooldowns && message.client.xpCooldowns.has(cooldownKey)) {
            return;
        }
        
        // XP hesaplama (ayarlardaki miktarı kullan)
        const messageLength = message.content.length;
        const baseXP = settings.xpPerMessage || 15;
        let xpGain = Math.floor(Math.random() * (baseXP / 2)) + (baseXP / 2); // Base XP ±50%
        
        // Mesaj uzunluğu bonusu
        if (messageLength > 50) xpGain += 2;
        if (messageLength > 100) xpGain += 3;
        if (messageLength > 200) xpGain += 5;
        
        // Attachment/embed bonusu
        if (message.attachments.size > 0) xpGain += 3;
        if (message.embeds.length > 0) xpGain += 2;
        
        // Database'e XP kaydet
        const { GuildMember } = require('../models/index');
        let guildMember = await GuildMember.findOne({
            userId: message.author.id,
            guildId: message.guild.id
        });
        
        if (!guildMember) {
            guildMember = await GuildMember.findOrCreate(
                message.author.id, 
                message.guild.id, 
                {
                    xp: xpGain,
                    level: 1,
                    totalMessages: 1
                }
            );
        } else {
            const newXp = (guildMember.xp || 0) + xpGain;
            const oldLevel = guildMember.level || 1;
            const newLevel = Math.floor(0.1 * Math.sqrt(newXp));
            
            await GuildMember.update(guildMember, {
                xp: newXp,
                level: Math.max(newLevel, 1),
                totalMessages: (guildMember.totalMessages || 0) + 1,
                lastActive: new Date().toISOString()
            });
            
            // Level up kontrolü
            if (newLevel > oldLevel) {
                await handleLevelUp(message, newLevel, newXp);
            }
        }
        
        // Cooldown ekle (ayarlardaki süreyi kullan)
        if (!message.client.xpCooldowns) {
            message.client.xpCooldowns = new Map();
        }
        message.client.xpCooldowns.set(cooldownKey, Date.now());
        
        // Ayarlardaki cooldown süresini kullan (saniye cinsinden)
        const cooldownDuration = (settings.xpCooldown || 60) * 1000;
        setTimeout(() => {
            message.client.xpCooldowns.delete(cooldownKey);
        }, cooldownDuration);
        
    } catch (error) {
        logger.debug('Leveling system hatası', error);
    }
}

// Level up mesajı
async function handleLevelUp(message, newLevel, totalXP) {
    try {
        const { EmbedBuilder } = require('discord.js');
        const config = require('../config.js');
        
        const levelUpEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🎉 Seviye Atladın!')
            .setDescription(`**${message.author}** tebrikler!`)
            .addFields(
                {
                    name: '📈 Yeni Seviye',
                    value: `**Level ${newLevel}**`,
                    inline: true
                },
                {
                    name: '⭐ Toplam XP',
                    value: `${totalXP.toLocaleString()} XP`,
                    inline: true
                },
                {
                    name: '🎯 Sonraki Seviye',
                    value: `${Math.pow((newLevel + 1) * 10, 2) - totalXP} XP kaldı`,
                    inline: true
                }
            )
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        
        // Level rol kontrolü
        const levelRole = message.guild.roles.cache.find(role => 
            role.name.toLowerCase() === `level ${newLevel}` || 
            role.name.toLowerCase() === `level${newLevel}` ||
            role.name.toLowerCase() === `lvl ${newLevel}`
        );
        
        if (levelRole && message.member) {
            try {
                await message.member.roles.add(levelRole);
                levelUpEmbed.addFields({
                    name: '🎭 Yeni Rol',
                    value: `${levelRole} rolü verildi!`,
                    inline: false
                });
            } catch (roleError) {
                logger.debug('Level rol verme hatası', roleError);
            }
        }
        
        await message.reply({ embeds: [levelUpEmbed] });
        
        logger.success(`Level up: ${message.author.tag} → Level ${newLevel}`, {
            guild: message.guild.name,
            totalXP: totalXP
        });
        
    } catch (error) {
        logger.error('Level up mesajı hatası', error);
    }
}
