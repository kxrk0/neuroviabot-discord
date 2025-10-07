const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Müziği durdur ve kuyruğu temizle'),

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

            // Çalan şarkı var mı kontrol et
            const isPlaying = customPlayer.isPlaying(interaction.guild.id);
            const isPaused = customPlayer.isPaused(interaction.guild.id);
            const queue = customPlayer.getQueue(interaction.guild.id);

            console.log(`[CUSTOM-STOP] Guild: ${interaction.guild.id}, Playing: ${isPlaying}, Paused: ${isPaused}, Queue: ${queue.length}`);

            // Eğer hiçbir şey çalmıyorsa ve kuyruk boşsa
            if (!isPlaying && queue.length === 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Hata')
                    .setDescription('Şu anda çalan veya duraklatılmış bir şarkı yok!')
                    .setTimestamp();

                return interaction.editReply({ embeds: [errorEmbed] });
            }

            // Müziği durdur ve kuyruğu temizle
            await customPlayer.stop(interaction.guild.id);

            const successEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('⏹️ Müzik Durduruldu')
                .setDescription('Müzik durduruldu ve kuyruk temizlendi!')
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error(`[CUSTOM-STOP] Command error:`, error);
            logger.error('Stop komutu hatası', error);

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
