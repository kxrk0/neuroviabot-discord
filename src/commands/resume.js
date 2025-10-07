// ==========================================
// 🎵 NeuroVia Music System - Resume Command
// ==========================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('▶️ Müziği devam ettir'),

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

            // Müzik duraklatılmış mı kontrol et
            if (!musicManager.isPaused(guildId)) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('▶️ Zaten Çalıyor')
                            .setDescription('Müzik zaten çalıyor durumda!')
                            .addFields({
                                name: '💡 Çözüm',
                                value: 'Müziği duraklatmak için `/pause` komutunu kullanın'
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Müziği devam ettir
            console.log(`[RESUME-NEW] Resuming music for guild: ${guildId}`);
            const resumed = musicManager.resume(guildId);

            if (!resumed) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Devam Ettirme Hatası')
                            .setDescription('Müzik devam ettirilemedi!')
                            .setTimestamp()
                    ]
                });
            }

            // Başarı mesajı
            const currentTrack = musicManager.getCurrentTrack(guildId);
            const successEmbed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('▶️ Müzik Devam Ediyor')
                .setDescription('Müzik başarıyla devam ettirildi!')
                .addFields({
                    name: '🎵 Çalan Şarkı',
                    value: currentTrack ? `**${currentTrack.title}** - ${currentTrack.author}` : 'Bilinmiyor'
                })
                .addFields({
                    name: '⏱️ Süre',
                    value: currentTrack ? currentTrack.duration : 'Bilinmiyor'
                })
                .setTimestamp();

            if (currentTrack && currentTrack.thumbnail) {
                successEmbed.setThumbnail(currentTrack.thumbnail);
            }

            successEmbed.setFooter({ 
                text: `NeuroVia Music System`, 
                iconURL: interaction.client.user.displayAvatarURL() 
            });

            console.log(`[RESUME-NEW] Music resumed successfully`);
            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(`[RESUME-NEW] Command error:`, error);
            logger.error('Resume command error', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Müzik devam ettirilirken bir hata oluştu!')
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
                console.error(`[RESUME-NEW] Failed to send error message:`, replyError);
            }
        }
    }
};
