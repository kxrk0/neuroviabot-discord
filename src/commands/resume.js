const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Modern Resume Command
 * Duraklatılmış müziği devam ettirir
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('▶️ Duraklatılmış müziği devam ettir'),

    async execute(interaction) {
        try {
            console.log(`[RESUME] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

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
            if (!guildData || !guildData.isPaused) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Müzik Duraklatılmamış')
                    .setDescription('Şu anda duraklatılmış bir müzik yok!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Müziği devam ettir
            const success = musicManager.voiceManager.resume(interaction.guild.id);
            
            if (success) {
                // Guild verilerini güncelle
                musicManager.updateGuildData(interaction.guild.id, {
                    isPaused: false
                });

                // Event emit et
                musicManager.eventManager.emitTrackResume(interaction.guild.id, guildData.currentTrack);

                const successEmbed = new EmbedBuilder()
                    .setColor('#1db954')
                    .setTitle('▶️ Müzik Devam Ettirildi')
                    .setDescription(`**${guildData.currentTrack.title}** devam ettirildi!`)
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
                        }
                    )
                    .setThumbnail(guildData.currentTrack.thumbnail || null)
                    .setTimestamp()
                    .setFooter({ text: 'NeuroVia Music System' });

                await interaction.reply({ embeds: [successEmbed] });
                console.log(`[RESUME] Müzik devam ettirildi: ${guildData.currentTrack.title}`);
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Devam Ettirme Hatası')
                    .setDescription('Müzik devam ettirilemedi!')
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

        } catch (error) {
            console.error('[RESUME] Komut hatası:', error);

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
                console.error('[RESUME] Hata mesajı gönderilemedi:', replyError);
            }
        }
    }
};
