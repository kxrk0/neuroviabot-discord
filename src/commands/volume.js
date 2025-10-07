const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Modern Volume Command
 * Ses seviyesini ayarlar
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('🔊 Ses seviyesini ayarla')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Ses seviyesi (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)),

    async execute(interaction) {
        try {
            console.log(`[VOLUME] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

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

            // Ses seviyesini al
            const newVolume = interaction.options.getInteger('level');
            const oldVolume = guildData.volume;

            // Ses seviyesini ayarla
            const success = musicManager.voiceManager.setVolume(interaction.guild.id, newVolume);
            
            if (success) {
                // Guild verilerini güncelle
                musicManager.updateGuildData(interaction.guild.id, {
                    volume: newVolume
                });

                // Event emit et
                musicManager.eventManager.emitVolumeChange(interaction.guild.id, oldVolume, newVolume);

                const successEmbed = new EmbedBuilder()
                    .setColor('#1db954')
                    .setTitle('🔊 Ses Seviyesi Ayarlandı')
                    .setDescription(`Ses seviyesi **${oldVolume}%** → **${newVolume}%** olarak ayarlandı!`)
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
                        },
                        {
                            name: '🎵 Çalan Şarkı',
                            value: guildData.currentTrack.title,
                            inline: false
                        }
                    )
                    .setThumbnail(guildData.currentTrack.thumbnail || null)
                    .setTimestamp()
                    .setFooter({ text: 'NeuroVia Music System' });

                await interaction.reply({ embeds: [successEmbed] });
                console.log(`[VOLUME] Ses seviyesi ayarlandı: ${oldVolume}% -> ${newVolume}%`);
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Ses Seviyesi Ayarlandı')
                    .setDescription('Ses seviyesi ayarlanamadı!')
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

        } catch (error) {
            console.error('[VOLUME] Komut hatası:', error);

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
                console.error('[VOLUME] Hata mesajı gönderilemedi:', replyError);
            }
        }
    }
};
