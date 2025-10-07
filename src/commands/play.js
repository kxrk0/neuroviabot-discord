// ==========================================
// 🎵 NeuroVia Music System - Play Command (Test Version)
// ==========================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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

            // Basit başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('✅ Test Başarılı')
                .setDescription(`**${query}** komutu alındı!`)
                .addFields(
                    { name: '👤 Kullanıcı', value: interaction.user.username, inline: true },
                    { name: '🔊 Sesli Kanal', value: voiceChannel.name, inline: true },
                    { name: '📋 Query', value: query, inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(`[PLAY-TEST] Command error:`, error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Komut çalıştırılırken bir hata oluştu!')
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
                console.error(`[PLAY-TEST] Failed to send error message:`, replyError);
            }
        }
    }
};
