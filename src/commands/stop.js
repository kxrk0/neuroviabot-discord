const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

/**
 * Modern Stop Command
 * Çalan müziği durdurur ve kuyruğu temizler
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('⏹️ Müziği durdur ve kuyruğu temizle'),

    async execute(interaction) {
        try {
            console.log(`[STOP] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

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
            if (!guildData || (!guildData.isPlaying && guildData.queue.length === 0)) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Müzik Çalmıyor')
                    .setDescription('Şu anda çalan bir müzik yok!')
                    .setTimestamp();

                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Müziği durdur
            const stopSuccess = musicManager.voiceManager.stop(interaction.guild.id);
            
            // Kuyruğu temizle
            const clearedCount = musicManager.queueManager.clearQueue(interaction.guild.id);

            // Guild verilerini güncelle
            musicManager.updateGuildData(interaction.guild.id, {
                isPlaying: false,
                isPaused: false,
                currentTrack: null
            });

            // Event emit et
            if (guildData.currentTrack) {
                musicManager.eventManager.emitTrackEnd(interaction.guild.id, guildData.currentTrack, 'stopped');
            }
            musicManager.eventManager.emitQueueClear(interaction.guild.id, clearedCount);

            const successEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('⏹️ Müzik Durduruldu')
                .setDescription('Müzik durduruldu ve kuyruk temizlendi!')
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
                        name: '🗑️ Temizlenen Şarkı',
                        value: clearedCount.toString(),
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'NeuroVia Music System' });

            await interaction.reply({ embeds: [successEmbed] });
            console.log(`[STOP] Müzik durduruldu ve kuyruk temizlendi: ${clearedCount} şarkı`);

        } catch (error) {
            console.error('[STOP] Komut hatası:', error);

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
                console.error('[STOP] Hata mesajı gönderilemedi:', replyError);
            }
        }
    }
};
