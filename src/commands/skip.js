// ==========================================
// 🎵 NeuroVia Music System - Skip Command
// = ==========================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('⏭️ Şarkıyı atla')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Kaç şarkı atlanacak (varsayılan: 1)')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const guildId = interaction.guild.id;
            const count = interaction.options.getInteger('count') || 1;
            const musicManager = interaction.client.musicManager;

            // Music manager kontrolü
            if (!musicManager) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Sistem Hatası')
                            .setDescription('Müzik sistemi başlatılamadı!')
                            .setTimestamp()
                    ]
                });
            }

            // Bot'un sesli kanalda olup olmadığını kontrol et
            if (!musicManager.isConnected(guildId)) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('❌ Bağlantı Yok')
                            .setDescription('Bot hiçbir sesli kanala bağlı değil!')
                            .addFields({
                                name: '💡 Çözüm',
                                value: 'Önce `/play` komutunu kullanarak şarkı çalmaya başlayın'
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Kuyruk var mı kontrol et
            const queueSize = musicManager.getQueueSize(guildId);
            if (queueSize === 0) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('❌ Kuyruk Boş')
                            .setDescription('Atlanacak şarkı yok!')
                            .addFields({
                                name: '💡 Çözüm',
                                value: 'Önce `/play` komutunu kullanarak şarkı ekleyin'
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Atlanacak şarkı sayısı kuyruktan fazla mı kontrol et
            if (count > queueSize) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('❌ Geçersiz Sayı')
                            .setDescription(`Kuyrukta sadece **${queueSize}** şarkı var!`)
                            .addFields({
                                name: '💡 Çözüm',
                                value: `1-${queueSize} arasında bir sayı girin`
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Şarkıyı atla
            console.log(`[SKIP-NEW] Skipping ${count} track(s) for guild: ${guildId}`);
            
            const currentTrack = musicManager.getCurrentTrack(guildId);
            const skipped = musicManager.skip(guildId);

            if (!skipped) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Atlama Hatası')
                            .setDescription('Şarkı atlanamadı!')
                            .setTimestamp()
                    ]
                });
            }

            // Başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('⏭️ Şarkı Atlatıldı')
                .setDescription(`**${count}** şarkı başarıyla atlatıldı!`)
                .addFields({
                    name: '🎵 Atlatılan Şarkı',
                    value: currentTrack ? `**${currentTrack.title}** - ${currentTrack.author}` : 'Bilinmiyor'
                })
                .addFields({
                    name: '📋 Kalan Kuyruk',
                    value: `${musicManager.getQueueSize(guildId)} şarkı`
                })
                .setTimestamp();

            if (currentTrack && currentTrack.thumbnail) {
                successEmbed.setThumbnail(currentTrack.thumbnail);
            }

            successEmbed.setFooter({ 
                text: `NeuroVia Music System`, 
                iconURL: interaction.client.user.displayAvatarURL() 
            });

            console.log(`[SKIP-NEW] Track(s) skipped successfully`);
            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(`[SKIP-NEW] Command error:`, error);
            logger.error('Skip command error', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Şarkı atlanırken bir hata oluştu!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message || 'Bilinmeyen hata'}\`\`\``
                })
                .setTimestamp();

            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error(`[SKIP-NEW] Failed to send error message:`, replyError);
            }
        }
    }
};
