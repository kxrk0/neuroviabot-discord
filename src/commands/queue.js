const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mevcut kuyruğu göster'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const customPlayer = interaction.client.customPlayer;
            if (!customPlayer) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Sistem Hatası')
                    .setDescription('Müzik sistemi başlatılamadı!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            const queue = customPlayer.getQueue(interaction.guild.id);
            const isPlaying = customPlayer.isPlaying(interaction.guild.id);
            const isPaused = customPlayer.isPaused(interaction.guild.id);

            console.log(`[CUSTOM-QUEUE] Guild: ${interaction.guild.id}, Queue: ${queue.length}, Playing: ${isPlaying}, Paused: ${isPaused}`);

            if (queue.length === 0) {
                const emptyQueueEmbed = new EmbedBuilder()
                    .setColor('#ffa500')
                    .setTitle('📭 Kuyruk Boş')
                    .setDescription('Şu anda kuyruğunuzda hiç şarkı yok!')
                    .addFields({
                        name: '🎵 Şarkı Ekle',
                        value: '`/play [şarkı adı]` komutunu kullanarak şarkı ekleyebilirsin!',
                        inline: false
                    })
                    .setTimestamp();

                return interaction.editReply({ embeds: [emptyQueueEmbed] });
            }

            // Kuyruk mesajını oluştur
            let queueDescription = '';
            const maxTracks = Math.min(queue.length, 10); // İlk 10 şarkıyı göster

            for (let i = 0; i < maxTracks; i++) {
                const track = queue[i];
                const position = i + 1;
                const status = i === 0 ? (isPlaying ? '▶️' : isPaused ? '⏸️' : '⏹️') : '⏳';
                
                queueDescription += `${status} **${position}.** ${track.title}\n`;
                queueDescription += `   👤 ${track.author} • ⏱️ ${track.duration}\n\n`;
            }

            if (queue.length > 10) {
                queueDescription += `... ve ${queue.length - 10} şarkı daha`;
            }

            const queueEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📋 Müzik Kuyruğu')
                .setDescription(queueDescription)
                .addFields(
                    { name: '📊 Toplam Şarkı', value: queue.length.toString(), inline: true },
                    { name: '🎵 Durum', value: isPlaying ? 'Çalıyor' : isPaused ? 'Duraklatıldı' : 'Bekliyor', inline: true },
                    { name: '⏱️ Tahmini Süre', value: 'Hesaplanıyor...', inline: true }
                )
                .setFooter({ text: `Sunucu: ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [queueEmbed] });

        } catch (error) {
            console.error(`[CUSTOM-QUEUE] Command error:`, error);
            logger.error('Queue komutu hatası', error);

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
