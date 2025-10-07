// ==========================================
// 🎵 NeuroVia Music System - Play Command
// ==========================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 Şarkı çal veya kuyruğa ekle')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('YouTube linki veya şarkı adı')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const query = interaction.options.getString('query');
            const member = interaction.member;
            const voiceChannel = member?.voice?.channel;
            const guildId = interaction.guild.id;

            // Kullanıcı sesli kanalda mı kontrol et
            if (!voiceChannel) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('❌ Hata')
                            .setDescription('Önce bir sesli kanala katılman gerekiyor!')
                            .addFields({
                                name: '🔍 Nasıl Kullanılır',
                                value: '1. Bir sesli kanala katıl\n2. `/play <YouTube linki>` komutunu kullan'
                            })
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
                            .addFields({
                                name: '🔧 Çözüm',
                                value: 'Bot\'a "Bağlan" ve "Konuş" yetkilerini verin'
                            })
                            .setTimestamp()
                    ]
                });
            }

            console.log(`[PLAY-NEW] Query: ${query}`);

            // Music manager'ı al
            const musicManager = interaction.client.musicManager;
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

            // Sesli kanala bağlan
            console.log(`[PLAY-NEW] Joining voice channel: ${voiceChannel.name}`);
            const connected = await musicManager.joinChannel(guildId, voiceChannel, interaction.channel);
            if (!connected) {
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

            // Track'i kuyruğa ekle
            console.log(`[PLAY-NEW] Adding track to queue`);
            const track = await musicManager.addTrack(guildId, query, interaction.user);

            // Başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('✅ Şarkı Eklendi')
                .setDescription(`**${track.title}** kuyruğa eklendi!`)
                .addFields(
                    { name: '👤 Sanatçı', value: track.author, inline: true },
                    { name: '⏱️ Süre', value: track.duration, inline: true },
                    { name: '🔗 Kaynak', value: 'YouTube', inline: true },
                    { name: '👥 İsteyen', value: interaction.user.username, inline: true },
                    { name: '📋 Kuyruk', value: `${musicManager.getQueueSize(guildId)} şarkı`, inline: true }
                )
                .setTimestamp();

            if (track.thumbnail) {
                successEmbed.setThumbnail(track.thumbnail);
            }

            successEmbed.setFooter({ 
                text: `NeuroVia Music System`, 
                iconURL: interaction.client.user.displayAvatarURL() 
            });

            console.log(`[PLAY-NEW] Sending success reply`);
            await interaction.editReply({ embeds: [successEmbed] });
            console.log(`[PLAY-NEW] Command completed successfully`);

        } catch (error) {
            console.error(`[PLAY-NEW] Command error:`, error);
            logger.error('Play command error', error);

            // Hata mesajı gönder
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Şarkı eklenirken bir hata oluştu!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message || 'Bilinmeyen hata'}\`\`\``
                })
                .addFields({
                    name: '💡 Çözüm Önerileri',
                    value: '• YouTube linkinin doğru olduğundan emin olun\n• Şarkının erişilebilir olduğunu kontrol edin\n• Bot\'un sesli kanala bağlanabildiğini kontrol edin'
                })
                .setTimestamp();

            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error(`[PLAY-NEW] Failed to send error message:`, replyError);
            }
        }
    }
};
