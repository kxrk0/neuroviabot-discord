const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Modern Play Command - yt-dlp + @discordjs/voice tabanlı
 * YouTube URL'leri ve arama sorgularını destekler
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 YouTube\'dan şarkı çal veya kuyruğa ekle')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('YouTube URL\'si veya şarkı adı')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('shuffle')
                .setDescription('Kuyruğu karıştır')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('volume')
                .setDescription('Ses seviyesi (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(false)),

    async execute(interaction) {
        try {
            console.log(`[PLAY] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

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

            // Bot'un sesli kanala bağlanma izni var mı kontrol et
            const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
            if (!permissions.has(['Connect', 'Speak'])) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ İzin Hatası')
                    .setDescription('Sesli kanala bağlanma veya konuşma yetkim yok!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Komut seçeneklerini al
            const query = interaction.options.getString('query');
            const shuffle = interaction.options.getBoolean('shuffle') || false;
            const volume = interaction.options.getInteger('volume') || 50;

            console.log(`[PLAY] Query: ${query}, Shuffle: ${shuffle}, Volume: ${volume}`);

            // Defer reply - işlem uzun sürebilir
            await interaction.deferReply();

            // Music Manager'ı al
            const musicManager = interaction.client.musicManager;
            if (!musicManager) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Sistem Hatası')
                    .setDescription('Müzik sistemi henüz başlatılmadı!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            // Guild müzik sistemini başlat
            const guildData = await musicManager.initializeGuild(interaction.guild.id);

            // Voice channel'a bağlan
            const voiceConnection = await musicManager.voiceManager.connect(
                interaction.guild.id,
                voiceChannel.id,
                interaction.channel.id
            );

            // Guild verilerini güncelle
            musicManager.updateGuildData(interaction.guild.id, {
                voiceChannel: voiceChannel,
                textChannel: interaction.channel,
                volume: volume
            });

            // Query'nin URL mi yoksa arama sorgusu mu olduğunu kontrol et
            let trackInfo;
            let isPlaylist = false;

            if (this.isYouTubeUrl(query)) {
                if (this.isPlaylistUrl(query)) {
                    // Playlist URL'si
                    const playlistInfo = await musicManager.streamManager.getPlaylistInfo(query);
                    const tracks = await musicManager.queueManager.addPlaylist(
                        interaction.guild.id,
                        playlistInfo,
                        interaction.user.id
                    );

                    const successEmbed = new EmbedBuilder()
                        .setColor('#1db954')
                        .setTitle('✅ Playlist Eklendi')
                        .setDescription(`**${playlistInfo.title}** kuyruğa eklendi!`)
                        .addFields(
                            {
                                name: '📋 Şarkı Sayısı',
                                value: tracks.length.toString(),
                                inline: true
                            },
                            {
                                name: '👤 İstek Sahibi',
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            },
                            {
                                name: '📍 Sesli Kanal',
                                value: `${voiceChannel}`,
                                inline: true
                            }
                        )
                        .setThumbnail(playlistInfo.thumbnail || null)
                        .setTimestamp()
                        .setFooter({ text: 'NeuroVia Music System' });

                    await interaction.editReply({ embeds: [successEmbed] });

                    // İlk şarkıyı çal
                    if (tracks.length > 0) {
                        await this.playTrack(interaction, musicManager, tracks[0]);
                    }

                    return;
                } else {
                    // Tek şarkı URL'si
                    trackInfo = await musicManager.streamManager.getTrackInfo(query);
                }
            } else {
                // Arama sorgusu
                const searchResults = await musicManager.streamManager.search(query, 1);
                if (searchResults.length === 0) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ Sonuç Bulunamadı')
                        .setDescription(`"${query}" için sonuç bulunamadı!`)
                        .setTimestamp();

                    return interaction.editReply({ embeds: [errorEmbed] });
                }

                trackInfo = await musicManager.streamManager.getTrackInfo(searchResults[0].url);
            }

            // Track'i kuyruğa ekle
            const queueTrack = await musicManager.queueManager.addTrack(
                interaction.guild.id,
                {
                    ...trackInfo,
                    addedBy: interaction.user.id
                }
            );

            // Shuffle modunu ayarla
            if (shuffle) {
                musicManager.queueManager.shuffleQueue(interaction.guild.id);
            }

            // Başarı embed'i
            const successEmbed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('✅ Şarkı Eklendi')
                .setDescription(`**${trackInfo.title}** kuyruğa eklendi!`)
                .addFields(
                    {
                        name: '👤 İstek Sahibi',
                        value: `<@${interaction.user.id}>`,
                        inline: true
                    },
                    {
                        name: '📍 Sesli Kanal',
                        value: `${voiceChannel}`,
                        inline: true
                    },
                    {
                        name: '⏱️ Süre',
                        value: this.formatDuration(trackInfo.duration),
                        inline: true
                    },
                    {
                        name: '🔊 Ses Seviyesi',
                        value: `${volume}%`,
                        inline: true
                    },
                    {
                        name: '🔀 Karıştırma',
                        value: shuffle ? 'Açık' : 'Kapalı',
                        inline: true
                    }
                )
                .setThumbnail(trackInfo.thumbnail || null)
                .setTimestamp()
                .setFooter({ text: 'NeuroVia Music System' });

            await interaction.editReply({ embeds: [successEmbed] });

            // Şarkıyı çal
            await this.playTrack(interaction, musicManager, queueTrack);

        } catch (error) {
            console.error('[PLAY] Komut hatası:', error);

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
                if (interaction.deferred) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error('[PLAY] Hata mesajı gönderilemedi:', replyError);
            }
        }
    },

    /**
     * YouTube URL kontrolü
     */
    isYouTubeUrl(query) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(query);
    },

    /**
     * Playlist URL kontrolü
     */
    isPlaylistUrl(query) {
        return query.includes('playlist') || query.includes('list=');
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
     * Track çal
     */
    async playTrack(interaction, musicManager, track) {
        try {
            console.log(`[PLAY] Track çalınıyor: ${track.title}`);

            // Audio stream oluştur
            const audioStream = await musicManager.streamManager.createAudioStream(track.url);

            // Müziği çal
            await musicManager.voiceManager.play(interaction.guild.id, audioStream, {
                volume: musicManager.getGuildData(interaction.guild.id).volume / 100
            });

            // Event emit et
            musicManager.eventManager.emitTrackStart(interaction.guild.id, track, {
                queueSize: musicManager.queueManager.getQueue(interaction.guild.id).tracks.length
            });

            console.log(`[PLAY] Track başarıyla çalındı: ${track.title}`);

        } catch (error) {
            console.error('[PLAY] Track çalma hatası:', error);
            musicManager.eventManager.emitError(interaction.guild.id, error, 'playTrack');
            throw error;
        }
    }
};
