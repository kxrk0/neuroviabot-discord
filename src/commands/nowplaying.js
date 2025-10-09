const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('🎵 Çalan şarkı bilgilerini gösterir'),

    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild);

        // Queue var mı kontrol et
        if (!queue || !queue.currentTrack) {
            const noTrackEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('📭 Çalan Şarkı Yok')
                .setDescription('Şu anda çalan bir şarkı yok!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [noTrackEmbed], ephemeral: true });
        }

        try {
            const track = queue.currentTrack;
            const progress = queue.node.createProgressBar();
            const isPaused = queue.node.isPaused();

            const nowPlayingEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('🎵 Şu Anda Çalan')
                .setDescription(`**${track.title}**`)
                .addFields(
                    { name: '👤 İsteyen', value: track.requestedBy.toString(), inline: true },
                    { name: '⏱️ Süre', value: track.duration, inline: true },
                    { name: '👀 Görüntülenme', value: track.views.toString(), inline: true },
                    { name: '🔗 Link', value: `[YouTube'da Aç](${track.url})`, inline: false },
                    { name: '📊 İlerleme', value: progress || 'Bilinmiyor', inline: false }
                )
                .setThumbnail(track.thumbnail)
                .setTimestamp();

            // Duraklatılmışsa belirt
            if (isPaused) {
                nowPlayingEmbed.setTitle('⏸️ Duraklatılmış');
            }

            // Kuyruk bilgisi
            if (queue.tracks.size > 0) {
                nowPlayingEmbed.addFields({
                    name: '📋 Sıradaki',
                    value: `**${queue.tracks.size}** şarkı kuyrukta`,
                    inline: true
                });
            }

            await interaction.reply({ embeds: [nowPlayingEmbed] });

        } catch (error) {
            console.error('Nowplaying command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Şarkı bilgileri gösterilirken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
