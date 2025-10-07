const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

            console.log(`[PLAY] Searching for: ${query}`);

            // Custom player'ı al
            const customPlayer = interaction.client.customPlayer;
            if (!customPlayer) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Sistem Hatası')
                    .setDescription('Müzik sistemi başlatılamadı!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            // Join voice channel first
            try {
                await customPlayer.joinChannel(interaction.guild.id, voiceChannel);
            } catch (error) {
                console.error(`[PLAY] Failed to join voice channel:`, error);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Bağlantı Hatası')
                    .setDescription('Ses kanalına bağlanılamadı!')
                    .addFields({
                        name: '🔧 Hata',
                        value: error.message,
                        inline: false
                    })
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            // Add track to queue
            try {
                await customPlayer.addTrack(
                    interaction.guild.id, 
                    query, 
                    interaction.channel, 
                    interaction.user
                );

                // Başarılı yanıt
                const successEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('🔍 Aranıyor...')
                    .setDescription(`**${query}** için arama yapılıyor...`)
                    .setFooter({ text: `İsteyen: ${interaction.user.tag}` })
                    .setTimestamp();

                return interaction.editReply({ embeds: [successEmbed] });

            } catch (error) {
                console.error(`[PLAY] Failed to play:`, error);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Çalma Hatası')
                    .setDescription('Şarkı çalınamadı!')
                    .addFields({
                        name: '🔧 Hata Detayı',
                        value: `\`\`\`${error.message}\`\`\``,
                        inline: false
                    })
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

        } catch (error) {
            console.error('[PLAY] Command error:', error);
            logger.error('Play command error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Beklenmeyen Hata')
                .setDescription('Komut çalıştırılırken bir hata oluştu!')
                .setTimestamp();

            if (interaction.deferred || interaction.replied) {
                return interaction.editReply({ embeds: [errorEmbed] });
            } else {
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
