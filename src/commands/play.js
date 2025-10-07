const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const playdl = require('play-dl');
const { logger } = require('../utils/logger');

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
                // Önce YouTube'da ara
                const ytInfo = await playdl.search(query, { limit: 1 });
                if (ytInfo && ytInfo.length > 0) {
                    searchResult = ytInfo[0];
                    console.log(`[CUSTOM-PLAY] Found YouTube result: ${searchResult.title}`);
                } else {
                    throw new Error('No results found');
                }
            } catch (error) {
                console.error(`[CUSTOM-PLAY] Search error:`, error);
                
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Şarkı Bulunamadı')
                    .setDescription(`**${query}** için sonuç bulunamadı!`)
                    .addFields({
                        name: '🔍 Arama Önerileri',
                        value: '• Şarkı adını daha spesifik yaz\n• Sanatçı adını ekle\n• YouTube linkini dene',
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
            const track = {
                title: searchResult.title,
                author: searchResult.channel?.name || 'Bilinmiyor',
                duration: searchResult.durationFormatted || 'Bilinmiyor',
                url: searchResult.url,
                thumbnail: searchResult.thumbnails?.[0]?.url || null
            };

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
