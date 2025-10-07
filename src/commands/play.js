const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const { logger } = require('../utils/logger');

function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return 'Bilinmiyor';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Şarkı çal veya kuyruğa ekle')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('YouTube linki')
                .setRequired(true)),

    async execute(interaction) {
        try {
            // Hemen yanıt ver
            await interaction.deferReply();

            const query = interaction.options.getString('query');
            const member = interaction.member;
            const voiceChannel = member?.voice?.channel;

            // Kullanıcı sesli kanalda mı kontrol et
            if (!voiceChannel) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Hata')
                            .setDescription('Önce bir sesli kanala katılman gerekiyor!')
                            .setTimestamp()
                    ]
                });
            }

            // Bot'un yetkisi var mı kontrol et
            const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
            if (!permissions || !permissions.has(['Connect', 'Speak'])) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Yetki Hatası')
                            .setDescription('Sesli kanala bağlanma veya konuşma yetkim yok!')
                            .setTimestamp()
                    ]
                });
            }

            console.log(`[PLAY] Query: ${query}`);

            // YouTube URL doğrulama
            if (!ytdl.validateURL(query)) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Geçersiz URL')
                            .setDescription('Lütfen geçerli bir YouTube URL\'si girin!')
                            .addFields({
                                name: '🔍 Örnek',
                                value: '`https://www.youtube.com/watch?v=VIDEO_ID`'
                            })
                            .setTimestamp()
                    ]
                });
            }

            console.log(`[PLAY] Valid YouTube URL: ${query}`);

            // Video bilgilerini al
            let videoInfo;
            try {
                videoInfo = await ytdl.getInfo(query);
                console.log(`[PLAY] Video info retrieved: ${videoInfo.videoDetails.title}`);
            } catch (infoError) {
                console.error(`[PLAY] Failed to get video info:`, infoError);
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Video Bilgisi Alınamadı')
                            .setDescription('YouTube videosu bulunamadı veya erişilemiyor!')
                            .setTimestamp()
                    ]
                });
            }

            // Track oluştur
            const track = {
                title: videoInfo.videoDetails.title,
                author: videoInfo.videoDetails.author?.name || 'Bilinmiyor',
                duration: videoInfo.videoDetails.lengthSeconds ? 
                    formatDuration(videoInfo.videoDetails.lengthSeconds) : 'Bilinmiyor',
                url: query,
                thumbnail: videoInfo.videoDetails.thumbnails?.[0]?.url || null
            };

            console.log(`[PLAY] Track created:`, track);

            // Custom player'ı kontrol et
            const customPlayer = interaction.client.customPlayer;
            if (!customPlayer) {
                console.error(`[PLAY] Custom player not found`);
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

            // Sesli kanala bağlan
            console.log(`[PLAY] Joining voice channel: ${voiceChannel.name}`);
            const connected = await customPlayer.joinChannel(interaction.guild.id, voiceChannel);
            if (!connected) {
                console.error(`[PLAY] Failed to connect to voice channel`);
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Bağlantı Hatası')
                            .setDescription('Sesli kanala bağlanılamadı!')
                            .setTimestamp()
                    ]
                });
            }

            // Kuyruğa ekle
            console.log(`[PLAY] Adding track to queue`);
            await customPlayer.addTrack(interaction.guild.id, track, interaction.channel);

            // Başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Şarkı Eklendi')
                .setDescription(`**${track.title}** kuyruğa eklendi!`)
                .addFields(
                    { name: '👤 Sanatçı', value: track.author, inline: true },
                    { name: '⏱️ Süre', value: track.duration, inline: true },
                    { name: '🔗 Kaynak', value: 'YouTube', inline: true }
                )
                .setTimestamp();

            if (track.thumbnail) {
                successEmbed.setThumbnail(track.thumbnail);
            }

            successEmbed.setFooter({ 
                text: `İsteyen: ${interaction.user.username}`, 
                iconURL: interaction.user.displayAvatarURL() 
            });

            console.log(`[PLAY] Sending success reply`);
            await interaction.editReply({ embeds: [successEmbed] });
            console.log(`[PLAY] Command completed successfully`);

        } catch (error) {
            console.error(`[PLAY] Command error:`, error);
            logger.error('Play command error', error);

            // Hata mesajı gönder
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Bir hata oluştu!')
                .addFields({
                    name: '🔧 Detay',
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
                console.error(`[PLAY] Failed to send error message:`, replyError);
            }
        }
    }
};
