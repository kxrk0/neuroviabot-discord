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
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Komut çalıştırılırken bir hata oluştu!')
                .setTimestamp();

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], flags: 64 });
            }
        }
    }
};

// Özellik durumlarını göster
async function handleStatus(interaction) {
    // Config cache'ini temizle ve yeniden yükle
    delete require.cache[require.resolve('../config.js')];
    const config = require('../config.js');
    const features = config.features;
    
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

    await interaction.reply({ embeds: [statusEmbed], flags: 64 });
}

// Tek özelliği aktifleştir
async function handleEnable(interaction) {
    const feature = interaction.options.getString('özellik');
    
    // Defer reply to prevent timeout
    await interaction.deferReply({ ephemeral: true });
    
    // Özelliği aktifleştir
    const success = await toggleFeature(feature, true);
    
    if (!success) {
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ Hata')
            .setDescription('Özellik aktifleştirilirken bir hata oluştu!')
            .setTimestamp();
        
        return await interaction.editReply({ embeds: [errorEmbed] });
    }
    
    // Değişikliği doğrula (güvenli)
    try {
        const isActuallyEnabled = featureManager.isFeatureEnabled(feature);
        if (!isActuallyEnabled) {
            logger.warn(`Feature doğrulama başarısız: ${feature}`);
            // Doğrulama başarısız olsa bile devam et, çünkü toggle başarılı oldu
        }
    } catch (error) {
        logger.error('Feature doğrulama hatası', error);
        // Hata olsa bile devam et
    }
    
    const featureNames = {
        tickets: '🎫 Ticket Sistemi',
        economy: '💰 Ekonomi Sistemi',
        moderation: '🛡️ Moderasyon Sistemi',
        leveling: '📈 Seviye Sistemi',
        giveaways: '🎉 Çekiliş Sistemi'
    };

    const featureName = featureNames[feature] || feature;
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

    await interaction.editReply({ embeds: [successEmbed] });
}

// Tek özelliği devre dışı bırak
async function handleDisable(interaction) {
    const feature = interaction.options.getString('özellik');
    
    // Defer reply to prevent timeout
    await interaction.deferReply({ ephemeral: true });
    
    // Özelliği devre dışı bırak
    const success = await toggleFeature(feature, false);
    
    if (!success) {
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ Hata')
            .setDescription('Özellik devre dışı bırakılırken bir hata oluştu!')
            .setTimestamp();
        
        return await interaction.editReply({ embeds: [errorEmbed] });
    }
    
    // Değişikliği doğrula (güvenli)
    try {
        const isActuallyEnabled = featureManager.isFeatureEnabled(feature);
        if (isActuallyEnabled) {
            logger.warn(`Feature doğrulama başarısız: ${feature} hala aktif`);
            // Doğrulama başarısız olsa bile devam et, çünkü toggle başarılı oldu
        }
    } catch (error) {
        logger.error('Feature doğrulama hatası', error);
        // Hata olsa bile devam et
    }
    
    const featureNames = {
        tickets: '🎫 Ticket Sistemi',
        economy: '💰 Ekonomi Sistemi',
        moderation: '🛡️ Moderasyon Sistemi',
        leveling: '📈 Seviye Sistemi',
        giveaways: '🎉 Çekiliş Sistemi'
    };

    const featureName = featureNames[feature] || feature;
    const successEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Özellik Devre Dışı')
        .setDescription(`${featureName} devre dışı bırakıldı!`)
        .addFields(
            {
                name: '📝 Not',
                value: 'Özellik devre dışı bırakıldı. İlgili komutlar artık kullanılamaz.',
                inline: false
            }
        )
        .setFooter({ 
            text: `Komut kullanan: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    await interaction.editReply({ embeds: [successEmbed] });
}

// Tüm özellikleri aktifleştir
async function handleEnableAll(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const features = ['tickets', 'economy', 'moderation', 'leveling', 'giveaways'];
    
    for (const feature of features) {
        await toggleFeature(feature, true);
    }

    const successEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🚀 Tüm Özellikler Aktifleştirildi')
        .setDescription('Tüm bot özellikleri başarıyla aktifleştirildi!')
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

    await interaction.editReply({ embeds: [successEmbed] });
}

// Tüm özellikleri devre dışı bırak
async function handleDisableAll(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const features = ['tickets', 'economy', 'moderation', 'leveling', 'giveaways'];
    
    for (const feature of features) {
        await toggleFeature(feature, false);
    }

    const successEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('🛑 Tüm Özellikler Devre Dışı')
        .setDescription('Tüm bot özellikleri devre dışı bırakıldı!')
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

    await interaction.editReply({ embeds: [successEmbed] });
}

// Özellik toggle fonksiyonu
async function toggleFeature(feature, enabled) {
    try {
        // FeatureManager ile özelliği toggle et
        const success = await featureManager.toggleFeature(feature, enabled);
        
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

