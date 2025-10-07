// ==========================================
// 🎵 NeuroVia Music System - Queue Command
// ==========================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('📋 Müzik kuyruğunu görüntüle')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Görüntülenecek sayfa numarası')
                .setMinValue(1)
                .setRequired(false)),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const guildId = interaction.guild.id;
            const page = interaction.options.getInteger('page') || 1;
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

            // Kuyruk bilgilerini al
            const queue = musicManager.getQueue(guildId);
            if (!queue) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('❌ Kuyruk Bulunamadı')
                            .setDescription('Müzik kuyruğu bulunamadı!')
                            .setTimestamp()
                    ]
                });
            }

            const queueSize = queue.getSize();
            const currentTrack = queue.getCurrentTrack();
            const queueInfo = queue.getQueueInfo();

            // Kuyruk boş mu kontrol et
            if (queueSize === 0 && !currentTrack) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('📋 Kuyruk Boş')
                            .setDescription('Müzik kuyruğu boş!')
                            .addFields({
                                name: '💡 Çözüm',
                                value: '`/play` komutunu kullanarak şarkı ekleyin'
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Sayfa kontrolü
            const tracksPerPage = 10;
            const totalPages = Math.ceil(queueSize / tracksPerPage);
            
            if (page > totalPages && queueSize > 0) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ffa500')
                            .setTitle('❌ Geçersiz Sayfa')
                            .setDescription(`Toplam **${totalPages}** sayfa var!`)
                            .addFields({
                                name: '💡 Çözüm',
                                value: `1-${totalPages} arasında bir sayfa numarası girin`
                            })
                            .setTimestamp()
                    ]
                });
            }

            // Kuyruk embed'ini oluştur
            const queueEmbed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('📋 Müzik Kuyruğu')
                .setDescription(`**${queueSize}** şarkı kuyrukta`)
                .setFooter({ 
                    text: `Sayfa ${page}/${totalPages} • ${queueInfo.isPlaying ? 'Çalıyor' : queueInfo.isPaused ? 'Duraklatıldı' : 'Durduruldu'}`,
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            // Şu anda çalan şarkı
            if (currentTrack) {
                queueEmbed.addFields({
                    name: '🎵 Şu Anda Çalan',
                    value: `**${currentTrack.title}**\n👤 ${currentTrack.author}\n⏱️ ${currentTrack.duration}`,
                    inline: false
                });

                if (currentTrack.thumbnail) {
                    queueEmbed.setThumbnail(currentTrack.thumbnail);
                }
            }

            // Kuyruk listesi
            if (queueSize > 0) {
                const startIndex = (page - 1) * tracksPerPage;
                const endIndex = Math.min(startIndex + tracksPerPage, queueSize);
                const pageTracks = queue.getTracks().slice(startIndex, endIndex);

                if (pageTracks.length > 0) {
                    const trackList = pageTracks.map((track, index) => {
                        const position = startIndex + index + 1;
                        const emoji = position === queueInfo.currentIndex + 1 ? '▶️' : '🎵';
                        return `${emoji} **${position}.** ${track.title} - ${track.author}`;
                    }).join('\n');

                    queueEmbed.addFields({
                        name: '📋 Kuyruk',
                        value: trackList,
                        inline: false
                    });
                }
            }

            // Kuyruk bilgileri
            const infoFields = [];
            
            if (queueInfo.loopMode !== 'none') {
                infoFields.push({
                    name: '🔄 Döngü Modu',
                    value: queueInfo.loopMode === 'track' ? 'Şarkı' : 'Kuyruk',
                    inline: true
                });
            }

            if (queueInfo.shuffled) {
                infoFields.push({
                    name: '🔀 Karışık',
                    value: 'Aktif',
                    inline: true
                });
            }

            infoFields.push({
                name: '🔊 Ses Seviyesi',
                value: `${queueInfo.volume}%`,
                inline: true
            });

            if (infoFields.length > 0) {
                queueEmbed.addFields(infoFields);
            }

            console.log(`[QUEUE-NEW] Queue displayed successfully`);
            await interaction.editReply({ embeds: [queueEmbed] });

        } catch (error) {
            console.error(`[QUEUE-NEW] Command error:`, error);
            logger.error('Queue command error', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Kuyruk görüntülenirken bir hata oluştu!')
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
                console.error(`[QUEUE-NEW] Failed to send error message:`, replyError);
            }
        }
    }
};
