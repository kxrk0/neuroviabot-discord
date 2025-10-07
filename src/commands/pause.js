// ==========================================
// 🎵 NeuroVia Music System - Pause Command
// ==========================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('⏸️ Müziği duraklat'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const guildId = interaction.guild.id;
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

            // Müzik çalıyor mu kontrol et
            if (!musicManager.isPlaying(guildId)) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('❌ Müzik Çalmıyor')
                            .setDescription('Şu anda hiçbir şarkı çalmıyor!')
                            .addFields({
                                name: '💡 Çözüm',
                                value: 'Önce `/play` komutunu kullanarak şarkı çalmaya başlayın'
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Zaten duraklatılmış mı kontrol et
            if (musicManager.isPaused(guildId)) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('⏸️ Zaten Duraklatılmış')
                            .setDescription('Müzik zaten duraklatılmış durumda!')
                            .addFields({
                                name: '💡 Çözüm',
                                value: 'Müziği devam ettirmek için `/resume` komutunu kullanın'
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Müziği duraklat
            console.log(`[PAUSE-NEW] Pausing music for guild: ${guildId}`);
            const paused = musicManager.pause(guildId);

            if (!paused) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Duraklatma Hatası')
                            .setDescription('Müzik duraklatılamadı!')
                            .setTimestamp()
                    ]
                });
            }

            // Başarı mesajı
            const currentTrack = musicManager.getCurrentTrack(guildId);
            const successEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('⏸️ Müzik Duraklatıldı')
                .setDescription('Müzik başarıyla duraklatıldı!')
                .addFields({
                    name: '🎵 Duraklatılan Şarkı',
                    value: currentTrack ? `**${currentTrack.title}** - ${currentTrack.author}` : 'Bilinmiyor'
                })
                .addFields({
                    name: '💡 Devam Ettirmek İçin',
                    value: '`/resume` komutunu kullanın'
                })
                .setTimestamp();

            if (currentTrack && currentTrack.thumbnail) {
                successEmbed.setThumbnail(currentTrack.thumbnail);
            }

            successEmbed.setFooter({ 
                text: `NeuroVia Music System`, 
                iconURL: interaction.client.user.displayAvatarURL() 
            });

            console.log(`[PAUSE-NEW] Music paused successfully`);
            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(`[PAUSE-NEW] Command error:`, error);
            logger.error('Pause command error', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Müzik duraklatılırken bir hata oluştu!')
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
                console.error(`[PAUSE-NEW] Failed to send error message:`, replyError);
            }
        }
    }
};
