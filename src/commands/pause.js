const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Modern Pause Command
 * Çalan müziği duraklatır
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('⏸️ Çalan müziği duraklat'),

    async execute(interaction) {
        try {
            console.log(`[PAUSE] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

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

            // Müziği duraklat
            const success = musicManager.voiceManager.pause(interaction.guild.id);
            
            if (success) {
                // Guild verilerini güncelle
                musicManager.updateGuildData(interaction.guild.id, {
                    isPaused: true
                });

                // Event emit et
                musicManager.eventManager.emitTrackPause(interaction.guild.id, guildData.currentTrack);

                const successEmbed = new EmbedBuilder()
                    .setColor('#ffa500')
                    .setTitle('⏸️ Müzik Duraklatıldı')
                    .setDescription(`**${guildData.currentTrack.title}** duraklatıldı!`)
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
                console.log(`[PAUSE] Müzik duraklatıldı: ${guildData.currentTrack.title}`);
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Duraklatma Hatası')
                    .setDescription('Müzik duraklatılamadı!')
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

        } catch (error) {
            console.error('[PAUSE] Komut hatası:', error);

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
                console.error('[PAUSE] Hata mesajı gönderilemedi:', replyError);
            }
        }
    }
};
