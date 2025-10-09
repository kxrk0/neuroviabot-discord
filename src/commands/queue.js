const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('📋 Müzik kuyruğunu gösterir')
        .addIntegerOption(option =>
            option.setName('sayfa')
                .setDescription('Gösterilecek sayfa numarası (varsayılan: 1)')
                .setRequired(false)
                .setMinValue(1)
        ),

    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild);
        const page = interaction.options.getInteger('sayfa') || 1;

        // Queue var mı kontrol et
        if (!queue || (!queue.currentTrack && queue.tracks.size === 0)) {
            const emptyQueueEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('📭 Kuyruk Boş')
                .setDescription('Şu anda çalan şarkı yok ve kuyruk boş!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [emptyQueueEmbed], ephemeral: true });
        }

        try {
            const tracksPerPage = 10;
            const totalPages = Math.ceil(queue.tracks.size / tracksPerPage);
            
            if (page > totalPages && queue.tracks.size > 0) {
                const invalidPageEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Geçersiz Sayfa')
                    .setDescription(`Toplam ${totalPages} sayfa var!`)
                    .setTimestamp();
                
                return interaction.reply({ embeds: [invalidPageEmbed], ephemeral: true });
            }

            const startIndex = (page - 1) * tracksPerPage;
            const endIndex = startIndex + tracksPerPage;
            const tracks = queue.tracks.toArray().slice(startIndex, endIndex);

            const queueEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('📋 Müzik Kuyruğu')
                .setTimestamp();

            // Şu anda çalan şarkı
            if (queue.currentTrack) {
                queueEmbed.addFields({
                    name: '🎵 Şu Anda Çalan',
                    value: `**${queue.currentTrack.title}**\n👤 ${queue.currentTrack.requestedBy}\n⏱️ ${queue.currentTrack.duration}`,
                    inline: false
                });
            }

            // Kuyruk bilgileri
            if (queue.tracks.size > 0) {
                let queueDescription = '';
                tracks.forEach((track, index) => {
                    const trackNumber = startIndex + index + 1;
                    queueDescription += `**${trackNumber}.** ${track.title}\n`;
                });

                queueEmbed.addFields({
                    name: `📋 Kuyruk (${queue.tracks.size} şarkı)`,
                    value: queueDescription || 'Kuyruk boş',
                    inline: false
                });

                // Sayfa bilgisi
                if (totalPages > 1) {
                    queueEmbed.setFooter({ text: `Sayfa ${page}/${totalPages}` });
                }
            } else {
                queueEmbed.addFields({
                    name: '📋 Kuyruk',
                    value: 'Kuyruk boş',
                    inline: false
                });
            }

            await interaction.reply({ embeds: [queueEmbed] });

        } catch (error) {
            console.error('Queue command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Kuyruk gösterilirken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
