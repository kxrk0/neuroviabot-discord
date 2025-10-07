const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

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

            // Basit URL kontrolü
            if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
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

            // Basit track oluştur
            const track = {
                title: 'YouTube Video',
                author: 'Bilinmiyor',
                duration: 'Bilinmiyor',
                url: query,
                thumbnail: null
            };

            console.log(`[PLAY] Track created:`, track);

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
                .setTimestamp()
                .setFooter({ 
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