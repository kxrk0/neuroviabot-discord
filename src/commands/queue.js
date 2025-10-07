const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Modern Queue Command
 * Müzik kuyruğunu gösterir
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('📋 Müzik kuyruğunu göster')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Sayfa numarası (varsayılan: 1)')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)),

    async execute(interaction) {
        try {
            console.log(`[QUEUE] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

            // Music Manager'ı al
            const musicManager = interaction.client.musicManager;
            if (!musicManager) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Sistem Hatası')
                    .setDescription('Müzik sistemi henüz başlatılmadı!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Guild verilerini al
            const guildData = musicManager.getGuildData(interaction.guild.id);
            const queue = musicManager.queueManager.getQueue(interaction.guild.id);

            if (!guildData || queue.tracks.length === 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Kuyruk Boş')
                    .setDescription('Kuyrukta şarkı bulunmuyor!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Sayfa numarasını al
            const page = interaction.options.getInteger('page') || 1;
            const tracksPerPage = 10;
            const startIndex = (page - 1) * tracksPerPage;
            const endIndex = startIndex + tracksPerPage;
            const pageTracks = queue.tracks.slice(startIndex, endIndex);

            // Kuyruk embed'i oluştur
            const queueEmbed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('📋 Müzik Kuyruğu')
                .setDescription(`Toplam **${queue.tracks.length}** şarkı`)
                .setTimestamp()
                .setFooter({ text: `Sayfa ${page} • NeuroVia Music System` });

            // Mevcut şarkıyı göster
            if (guildData.currentTrack) {
                queueEmbed.addFields({
                    name: '🎵 Şu Anda Çalan',
                    value: `**${guildData.currentTrack.title}**\n` +
                           `👤 ${guildData.currentTrack.uploader || 'Bilinmiyor'}\n` +
                           `⏱️ ${this.formatDuration(guildData.currentTrack.duration)}\n` +
                           `🔊 ${guildData.volume}%`,
                    inline: false
                });
            }

            // Kuyruktaki şarkıları göster
            if (pageTracks.length > 0) {
                const queueList = pageTracks.map((track, index) => {
                    const position = startIndex + index + 1;
                    const duration = this.formatDuration(track.duration);
                    const addedBy = track.addedBy ? `<@${track.addedBy}>` : 'Bilinmiyor';
                    
                    return `**${position}.** ${track.title}\n` +
                           `👤 ${track.uploader || 'Bilinmiyor'} • ⏱️ ${duration} • 👤 ${addedBy}`;
                }).join('\n\n');

                queueEmbed.addFields({
                    name: `📋 Kuyruk (${startIndex + 1}-${Math.min(endIndex, queue.tracks.length)})`,
                    value: queueList,
                    inline: false
                });
            }

            // Kuyruk bilgilerini ekle
            const queueInfo = musicManager.queueManager.getQueueInfo(interaction.guild.id);
            queueEmbed.addFields(
                {
                    name: '🔄 Loop Modu',
                    value: this.getLoopModeText(queueInfo.loopMode),
                    inline: true
                },
                {
                    name: '🔀 Karıştırma',
                    value: queueInfo.shuffleMode ? 'Açık' : 'Kapalı',
                    inline: true
                },
                {
                    name: '📊 Toplam',
                    value: `${queueInfo.totalTracks} şarkı`,
                    inline: true
                }
            );

            // Sayfa bilgisi
            const totalPages = Math.ceil(queue.tracks.length / tracksPerPage);
            if (totalPages > 1) {
                queueEmbed.setFooter({ text: `Sayfa ${page}/${totalPages} • NeuroVia Music System` });
            }

            await interaction.reply({ embeds: [queueEmbed] });
            console.log(`[QUEUE] Kuyruk gösterildi: ${queue.tracks.length} şarkı`);

        } catch (error) {
            console.error('[QUEUE] Komut hatası:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Komut çalıştırılırken bir hata oluştu!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message}\`\`\``
                })
                .setTimestamp();

            try {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            } catch (replyError) {
                console.error('[QUEUE] Hata mesajı gönderilemedi:', replyError);
            }
        }
    },

    /**
     * Süre formatla
     */
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return 'Bilinmiyor';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    },

    /**
     * Loop modu metnini al
     */
    getLoopModeText(mode) {
        switch (mode) {
            case 'track':
                return '🔄 Tekrar';
            case 'queue':
                return '🔁 Kuyruk';
            default:
                return '❌ Kapalı';
        }
    }
};
