// ==========================================
// 🤖 NeuroViaBot - Features Management Command
// ==========================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { logger } = require('../utils/logger');
const config = require('../config.js');
const featureManager = require('../utils/featureManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('özellikler')
        .setDescription('🔧 Bot özelliklerini yönet (Sadece Yöneticiler)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('durum')
                .setDescription('📊 Tüm özelliklerin durumunu göster')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('aç')
                .setDescription('✅ Bir özelliği aktifleştir')
                .addStringOption(option =>
                    option.setName('özellik')
                        .setDescription('Aktifleştirilecek özellik')
                        .setRequired(true)
                        .addChoices(
                            { name: '🎫 Ticket Sistemi', value: 'tickets' },
                            { name: '💰 Ekonomi Sistemi', value: 'economy' },
                            { name: '🛡️ Moderasyon Sistemi', value: 'moderation' },
                            { name: '📈 Seviye Sistemi', value: 'leveling' },
                            { name: '🎉 Çekiliş Sistemi', value: 'giveaways' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('kapat')
                .setDescription('❌ Bir özelliği devre dışı bırak')
                .addStringOption(option =>
                    option.setName('özellik')
                        .setDescription('Devre dışı bırakılacak özellik')
                        .setRequired(true)
                        .addChoices(
                            { name: '🎫 Ticket Sistemi', value: 'tickets' },
                            { name: '💰 Ekonomi Sistemi', value: 'economy' },
                            { name: '🛡️ Moderasyon Sistemi', value: 'moderation' },
                            { name: '📈 Seviye Sistemi', value: 'leveling' },
                            { name: '🎉 Çekiliş Sistemi', value: 'giveaways' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tümünü-aç')
                .setDescription('🚀 Tüm özellikleri aktifleştir')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tümünü-kapat')
                .setDescription('🛑 Tüm özellikleri devre dışı bırak')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'durum':
                    await handleStatus(interaction);
                    break;
                case 'aç':
                    await handleEnable(interaction);
                    break;
                case 'kapat':
                    await handleDisable(interaction);
                    break;
                case 'tümünü-aç':
                    await handleEnableAll(interaction);
                    break;
                case 'tümünü-kapat':
                    await handleDisableAll(interaction);
                    break;
            }
        } catch (error) {
            logger.error('Features komut hatası', error);
            console.error('❌ Features command error details:', {
                message: error.message,
                stack: error.stack,
                subcommand: interaction.options.getSubcommand(),
                user: interaction.user.tag,
                guild: interaction.guild?.name
            });
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription(`Komut çalıştırılırken bir hata oluştu!\n\`\`\`${error.message}\`\`\``)
                .setTimestamp();

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                }
            } catch (replyError) {
                logger.error('Failed to send error message', replyError);
            }
        }
    }
};

// Özellik durumlarını göster
async function handleStatus(interaction) {
    // Hızlı yanıt gönder - deferReply kullanma
    try {
        if (interaction.replied || interaction.deferred) {
            return; // Zaten yanıtlandıysa çık
        }
    
    // Config güncel durumunu al
    const configSync = require('../utils/configSync');
    const features = configSync.getAllFeatures();
    
    const statusEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📊 Bot Özellik Durumları')
        .setDescription('Sunucudaki tüm bot özelliklerinin durumu:')
        .addFields(
            {
                name: '🎫 Ticket Sistemi',
                value: features.tickets ? '✅ Aktif' : '❌ Devre Dışı',
                inline: true
            },
            {
                name: '💰 Ekonomi Sistemi',
                value: features.economy ? '✅ Aktif' : '❌ Devre Dışı',
                inline: true
            },
            {
                name: '🛡️ Moderasyon Sistemi',
                value: features.moderation ? '✅ Aktif' : '❌ Devre Dışı',
                inline: true
            },
            {
                name: '📈 Seviye Sistemi',
                value: features.leveling ? '✅ Aktif' : '❌ Devre Dışı',
                inline: true
            },
            {
                name: '🎉 Çekiliş Sistemi',
                value: features.giveaways ? '✅ Aktif' : '❌ Devre Dışı',
                inline: true
            }
        )
        .setFooter({ 
            text: `Komut kullanan: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

        // Hızlı yanıt gönder
        await interaction.reply({ embeds: [statusEmbed], flags: 64 });
    } catch (error) {
        logger.error('Status command error', error);
        // Sessizce devam et
    }
}

// Tek özelliği aktifleştir
async function handleEnable(interaction) {
    const feature = interaction.options.getString('özellik');

    // Özelliği aktifleştir (sync olarak dene önce)
    let success = false;
    let isEnabled = false;

    try {
        success = await toggleFeature(feature, true);
        // Çok kısa bir bekleme ekle - config güncellemesi için
        await new Promise(resolve => setTimeout(resolve, 50));
        // Hemen kontrol et
        isEnabled = featureManager.isFeatureEnabled(feature);
        // ConfigSync ile de kontrol et
        const configSync = require('../utils/configSync');
        const configSyncEnabled = configSync.isFeatureEnabled(feature);
        
        if (isEnabled !== configSyncEnabled) {
            logger.warn(`Feature senkronizasyon sorunu: featureManager=${isEnabled}, configSync=${configSyncEnabled}`);
            // ConfigSync'i yeniden yükle
            configSync.reloadConfig();
            isEnabled = configSync.isFeatureEnabled(feature);
        }
        
    } catch (error) {
        logger.error('Feature toggle error', error);
    }

    const featureNames = {
        tickets: '🎫 Ticket Sistemi',
        economy: '💰 Ekonomi Sistemi',
        moderation: '🛡️ Moderasyon Sistemi',
        leveling: '📈 Seviye Sistemi',
        giveaways: '🎉 Çekiliş Sistemi'
    };

    const featureName = featureNames[feature] || feature;

    if (success && isEnabled) {
        const successEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Özellik Aktifleştirildi')
            .setDescription(`${featureName} başarıyla aktifleştirildi!`)
            .addFields(
                {
                    name: '📝 Not',
                    value: 'Özellik aktifleştirildi. İlgili komutlar artık kullanılabilir.',
                    inline: false
                }
            )
            .setFooter({
                text: `Komut kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        // Daha güvenli yanıt gönder - önce durumu kontrol et
        try {
            if (interaction.replied) {
                // Zaten yanıtlandıysa hiçbir şey yapma
                logger.info('Interaction zaten yanıtlandı, sessizce devam ediliyor');
                return;
            }

            if (interaction.deferred) {
                // Defer edilmişse editReply kullan
                await interaction.editReply({ embeds: [successEmbed] });
            } else {
                // Hiçbir şey yoksa normal reply kullan
                await interaction.reply({ embeds: [successEmbed], flags: 64 });
            }
        } catch (replyError) {
            logger.error('Yanıt gönderme hatası (başarı durumu)', replyError);
            // Sessizce devam et - kullanıcı zaten bilgilendirildi
        }
    } else {
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ Hata')
            .setDescription(`Özellik aktifleştirilirken bir hata oluştu!\n\`\`\`${success ? 'Doğrulama başarısız' : 'Toggle başarısız'}\`\`\``)
            .setTimestamp();

        // Daha güvenli hata mesajı gönder - önce durumu kontrol et
        try {
            if (interaction.replied) {
                // Zaten yanıtlandıysa hiçbir şey yapma
                logger.info('Interaction zaten yanıtlandı, hata mesajı gönderilemiyor');
                return;
            }

            if (interaction.deferred) {
                // Defer edilmişse editReply kullan
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                // Hiçbir şey yoksa normal reply kullan
                await interaction.reply({ embeds: [errorEmbed], flags: 64 });
            }
        } catch (replyError) {
            logger.error('Hata mesajı gönderme hatası', replyError);
            // Sessizce devam et - zaten hata durumunda
        }
    }
}

// Tek özelliği devre dışı bırak
async function handleDisable(interaction) {
    const feature = interaction.options.getString('özellik');

    // Özelliği devre dışı bırak (sync olarak dene önce)
    let success = false;
    let isEnabled = false;

    try {
        success = await toggleFeature(feature, false);
        // Çok kısa bir bekleme ekle - config güncellemesi için
        await new Promise(resolve => setTimeout(resolve, 50));
        // Hemen kontrol et
        isEnabled = featureManager.isFeatureEnabled(feature);
        // ConfigSync ile de kontrol et
        const configSync = require('../utils/configSync');
        const configSyncEnabled = configSync.isFeatureEnabled(feature);
        
        if (isEnabled !== configSyncEnabled) {
            logger.warn(`Feature senkronizasyon sorunu: featureManager=${isEnabled}, configSync=${configSyncEnabled}`);
            // ConfigSync'i yeniden yükle
            configSync.reloadConfig();
            isEnabled = configSync.isFeatureEnabled(feature);
        }
        
    } catch (error) {
        logger.error('Feature toggle error', error);
    }
    
    const featureNames = {
        tickets: '🎫 Ticket Sistemi',
        economy: '💰 Ekonomi Sistemi',
        moderation: '🛡️ Moderasyon Sistemi',
        leveling: '📈 Seviye Sistemi',
        giveaways: '🎉 Çekiliş Sistemi'
    };

    const featureName = featureNames[feature] || feature;

    if (success && !isEnabled) {
        const successEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Özellik Devre Dışı Bırakıldı')
            .setDescription(`${featureName} başarıyla devre dışı bırakıldı!`)
            .addFields(
                {
                    name: '📝 Not',
                    value: 'Özellik devre dışı bırakıldı. İlgili komutlar artık kullanılamayacak.',
                    inline: false
                }
            )
            .setFooter({
                text: `Komut kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        // Daha güvenli yanıt gönder - önce durumu kontrol et
        try {
            if (interaction.replied) {
                // Zaten yanıtlandıysa hiçbir şey yapma
                logger.info('Interaction zaten yanıtlandı, sessizce devam ediliyor');
                return;
            }

            if (interaction.deferred) {
                // Defer edilmişse editReply kullan
                await interaction.editReply({ embeds: [successEmbed] });
            } else {
                // Hiçbir şey yoksa normal reply kullan
                await interaction.reply({ embeds: [successEmbed], flags: 64 });
            }
        } catch (replyError) {
            logger.error('Yanıt gönderme hatası (başarı durumu)', replyError);
            // Sessizce devam et - kullanıcı zaten bilgilendirildi
        }
    } else {
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ Hata')
            .setDescription(`Özellik devre dışı bırakılırken bir hata oluştu!\n\`\`\`${success ? 'Doğrulama başarısız' : 'Toggle başarısız'}\`\`\``)
            .setTimestamp();

        // Daha güvenli hata mesajı gönder - önce durumu kontrol et
        try {
            if (interaction.replied) {
                // Zaten yanıtlandıysa hiçbir şey yapma
                logger.info('Interaction zaten yanıtlandı, hata mesajı gönderilemiyor');
                return;
            }

            if (interaction.deferred) {
                // Defer edilmişse editReply kullan
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                // Hiçbir şey yoksa normal reply kullan
                await interaction.reply({ embeds: [errorEmbed], flags: 64 });
            }
        } catch (replyError) {
            logger.error('Hata mesajı gönderme hatası', replyError);
            // Sessizce devam et - zaten hata durumunda
        }
    }
}

// Tüm özellikleri aktifleştir
async function handleEnableAll(interaction) {
    const features = ['tickets', 'economy', 'moderation', 'leveling', 'giveaways'];

    // Tüm özellikleri aktifleştir
    let successCount = 0;
    for (const feature of features) {
        try {
            const success = await toggleFeature(feature, true);
            if (success && featureManager.isFeatureEnabled(feature)) {
                successCount++;
            }
        } catch (error) {
            logger.error(`Feature toggle error for ${feature}`, error);
        }
    }

    const successEmbed = new EmbedBuilder()
        .setColor(successCount === features.length ? '#00ff00' : '#ffa500')
        .setTitle(successCount === features.length ? '🚀 Tüm Özellikler Aktifleştirildi' : '⚠️ Kısmi Başarı')
        .setDescription(successCount === features.length ?
            'Tüm bot özellikleri başarıyla aktifleştirildi!' :
            `${successCount}/${features.length} özellik aktifleştirildi. Bazı özelliklerde sorun var.`
        )
        .addFields(
            {
                name: '✅ Aktifleştirilen Özellikler',
                value: '🎫 Ticket Sistemi\n💰 Ekonomi Sistemi\n🛡️ Moderasyon Sistemi\n📈 Seviye Sistemi\n🎉 Çekiliş Sistemi',
                inline: false
            }
        )
        .setFooter({
            text: `Komut kullanan: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    // Güvenli yanıt gönder
    if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [successEmbed], flags: 64 });
    } else {
        await interaction.editReply({ embeds: [successEmbed] });
    }
}

// Tüm özellikleri devre dışı bırak
async function handleDisableAll(interaction) {
    const features = ['tickets', 'economy', 'moderation', 'leveling', 'giveaways'];

    // Tüm özellikleri devre dışı bırak
    let successCount = 0;
    for (const feature of features) {
        try {
            const success = await toggleFeature(feature, false);
            if (success && !featureManager.isFeatureEnabled(feature)) {
                successCount++;
            }
        } catch (error) {
            logger.error(`Feature toggle error for ${feature}`, error);
        }
    }

    const successEmbed = new EmbedBuilder()
        .setColor(successCount === features.length ? '#00ff00' : '#ffa500')
        .setTitle(successCount === features.length ? '🛑 Tüm Özellikler Devre Dışı Bırakıldı' : '⚠️ Kısmi Başarı')
        .setDescription(successCount === features.length ?
            'Tüm bot özellikleri başarıyla devre dışı bırakıldı!' :
            `${successCount}/${features.length} özellik devre dışı bırakıldı. Bazı özelliklerde sorun var.`
        )
        .addFields(
            {
                name: '❌ Devre Dışı Bırakılan Özellikler',
                value: '🎫 Ticket Sistemi\n💰 Ekonomi Sistemi\n🛡️ Moderasyon Sistemi\n📈 Seviye Sistemi\n🎉 Çekiliş Sistemi',
                inline: false
            },
            {
                name: '📝 Not',
                value: 'Sadece hoş geldin mesajı aktif kalacak.',
                inline: false
            }
        )
        .setFooter({
            text: `Komut kullanan: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    // Güvenli yanıt gönder
    if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [successEmbed], flags: 64 });
    } else {
        await interaction.editReply({ embeds: [successEmbed] });
    }
}

// Özellik toggle fonksiyonu
async function toggleFeature(feature, enabled) {
    try {
        // FeatureManager ile özelliği toggle et (timeout ekle)
        const success = await Promise.race([
            featureManager.toggleFeature(feature, enabled),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Feature toggle timeout')), 5000)
            )
        ]);

        if (success) {
            return true;
        } else {
            logger.error(`Özellik toggle başarısız: ${feature}`);
            return false;
        }
    } catch (error) {
        logger.error('Toggle feature hatası', error);
        return false;
    }
}

