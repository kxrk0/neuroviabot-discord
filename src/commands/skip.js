const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Modern Skip Command
 * Çalan müziği atlar ve sonraki şarkıya geçer
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('⏭️ Çalan müziği atla ve sonraki şarkıya geç')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Kaç şarkı atlanacak (varsayılan: 1)')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)),

    async execute(interaction) {
        try {
            console.log(`[SKIP] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

            // Kullanıcı sesli kanalda mı kontrol et
            const voiceChannel = interaction.member?.voice?.channel;
            if (!voiceChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Sesli Kanal Hatası')
                    .setDescription('Önce bir sesli kanala katılman gerekiyor!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

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
            if (!guildData || !guildData.isPlaying) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Müzik Çalmıyor')
                    .setDescription('Şu anda çalan bir müzik yok!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Atlanacak şarkı sayısını al
            const count = interaction.options.getInteger('count') || 1;
            const queue = musicManager.queueManager.getQueue(interaction.guild.id);

            if (queue.tracks.length <= 1) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Kuyruk Boş')
                    .setDescription('Kuyrukta atlanacak başka şarkı yok!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Şarkıyı atla
            const skippedTrack = guildData.currentTrack;
            const nextTrack = musicManager.queueManager.skipTrack(interaction.guild.id, count);

            if (nextTrack) {
                // Yeni şarkıyı çal
                await this.playNextTrack(interaction, musicManager, nextTrack);

                // Event emit et
                musicManager.eventManager.emitTrackSkip(interaction.guild.id, skippedTrack, nextTrack);

                const successEmbed = new EmbedBuilder()
                    .setColor('#1db954')
                    .setTitle('⏭️ Şarkı Atlandı')
                    .setDescription(`**${skippedTrack.title}** atlandı!`)
                    .addFields(
                        {
                            name: '👤 Kullanıcı',
                            value: `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: '📍 Sesli Kanal',
                            value: `${voiceChannel}`,
                            inline: true
                        },
                        {
                            name: '🎵 Sonraki Şarkı',
                            value: nextTrack.title,
                            inline: false
                        },
                        {
                            name: '📊 Atlanan Şarkı',
                            value: count.toString(),
                            inline: true
                        }
                    )
                    .setThumbnail(nextTrack.thumbnail || null)
                    .setTimestamp()
                    .setFooter({ text: 'NeuroVia Music System' });

                await interaction.reply({ embeds: [successEmbed] });
                console.log(`[SKIP] Şarkı atlandı: ${skippedTrack.title} -> ${nextTrack.title}`);
            } else {
                // Sonraki şarkı yok
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Sonraki Şarkı Yok')
                    .setDescription('Kuyrukta sonraki şarkı bulunamadı!')
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

        } catch (error) {
            console.error('[SKIP] Komut hatası:', error);

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
                console.error('[SKIP] Hata mesajı gönderilemedi:', replyError);
            }
        }
    },

    /**
     * Sonraki track'i çal
     */
    async playNextTrack(interaction, musicManager, track) {
        try {
            console.log(`[SKIP] Sonraki track çalınıyor: ${track.title}`);

            // Audio stream oluştur
            const audioStream = await musicManager.streamManager.createAudioStream(track.url);

            // Müziği çal
            await musicManager.voiceManager.play(interaction.guild.id, audioStream, {
                volume: musicManager.getGuildData(interaction.guild.id).volume / 100
            });

            // Guild verilerini güncelle
            musicManager.updateGuildData(interaction.guild.id, {
                currentTrack: track,
                isPlaying: true,
                isPaused: false
            });

            // Event emit et
            musicManager.eventManager.emitTrackStart(interaction.guild.id, track, {
                queueSize: musicManager.queueManager.getQueue(interaction.guild.id).tracks.length
            });

            console.log(`[SKIP] Sonraki track başarıyla çalındı: ${track.title}`);

        } catch (error) {
            console.error('[SKIP] Sonraki track çalma hatası:', error);
            musicManager.eventManager.emitError(interaction.guild.id, error, 'playNextTrack');
            throw error;
        }
    }
};
