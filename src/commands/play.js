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
                .setDescription('Şarkı adı, sanatçı veya YouTube linki')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const query = interaction.options.getString('query');
            const member = interaction.member;
            const voiceChannel = member.voice.channel;

            // Kullanıcı sesli kanalda mı kontrol et
            if (!voiceChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Hata')
                    .setDescription('Önce bir sesli kanala katılman gerekiyor!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            // Bot'un yetkisi var mı kontrol et
            const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
            if (!permissions.has(['Connect', 'Speak'])) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Yetki Hatası')
                    .setDescription('Sesli kanala bağlanma veya konuşma yetkim yok!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            console.log(`[CUSTOM-PLAY] Searching for: ${query}`);

            // Şarkı ara
            let searchResult;
            try {
                // Eğer query bir YouTube URL'si ise
                if (ytdl.validateURL(query)) {
                    console.log(`[CUSTOM-PLAY] Valid YouTube URL detected: ${query}`);
                    const videoInfo = await ytdl.getInfo(query);
                    searchResult = {
                        title: videoInfo.videoDetails.title,
                        url: query,
                        id: videoInfo.videoDetails.videoId,
                        channel: { name: videoInfo.videoDetails.author.name },
                        durationFormatted: videoInfo.videoDetails.lengthSeconds ? 
                            formatDuration(videoInfo.videoDetails.lengthSeconds) : 'Bilinmiyor',
                        thumbnails: videoInfo.videoDetails.thumbnails
                    };
                    console.log(`[CUSTOM-PLAY] Found YouTube result: ${searchResult.title}`);
                } else {
                    // ytdl-core search özelliği yok, bu yüzden kullanıcıdan tam URL isteyelim
                    throw new Error('Lütfen tam YouTube URL\'si girin');
                }
            } catch (error) {
                console.error(`[CUSTOM-PLAY] Search error:`, error);
                
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Geçersiz URL')
                    .setDescription(`**${query}** geçerli bir YouTube URL'si değil!`)
                    .addFields({
                        name: '🔍 Nasıl Kullanılır',
                        value: '• Tam YouTube URL\'si girin\n• Örnek: `https://www.youtube.com/watch?v=VIDEO_ID`\n• YouTube\'dan linki kopyalayın',
                        inline: false
                    })
                    .setTimestamp();

                return interaction.editReply({ embeds: [notFoundEmbed] });
            }

            // Custom player'ı al veya oluştur
            const customPlayer = interaction.client.customPlayer;
            if (!customPlayer) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Sistem Hatası')
                    .setDescription('Müzik sistemi başlatılamadı!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            // Sesli kanala bağlan
            const connected = await customPlayer.joinChannel(interaction.guild.id, voiceChannel);
            if (!connected) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Bağlantı Hatası')
                    .setDescription('Sesli kanala bağlanılamadı!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            // Track bilgilerini hazırla
            console.log(`[CUSTOM-PLAY] Search result keys:`, Object.keys(searchResult));
            console.log(`[CUSTOM-PLAY] Search result URL:`, searchResult.url);
            console.log(`[CUSTOM-PLAY] Search result ID:`, searchResult.id);
            
            // URL'yi doğru formatta oluştur
            let trackUrl;
            if (searchResult.url) {
                trackUrl = searchResult.url;
            } else if (searchResult.id) {
                trackUrl = `https://www.youtube.com/watch?v=${searchResult.id}`;
            } else {
                throw new Error('No valid URL or ID found in search result');
            }
            
            const track = {
                title: searchResult.title,
                author: searchResult.channel?.name || 'Bilinmiyor',
                duration: searchResult.durationFormatted || 'Bilinmiyor',
                url: trackUrl,
                thumbnail: searchResult.thumbnails?.[0]?.url || null
            };
            
            console.log(`[CUSTOM-PLAY] Track URL:`, track.url);

            // Kuyruğa ekle
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
                .setThumbnail(track.thumbnail)
                .setFooter({ text: `İsteyen: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            console.log(`[CUSTOM-PLAY] Sending success reply for: ${track.title}`);
            await interaction.editReply({ embeds: [successEmbed] });
            console.log(`[CUSTOM-PLAY] Success reply sent successfully`);

        } catch (error) {
            console.error(`[CUSTOM-PLAY] Command error:`, error);
            logger.error('Play komutu hatası', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Komut Hatası')
                .setDescription('Komut çalıştırılırken bir hata oluştu!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message}\`\`\``,
                    inline: false
                })
                .setTimestamp();

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.editReply({ embeds: [errorEmbed] });
            }
        }
    }
};
