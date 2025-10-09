const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('⏸️ Müziği duraklatır'),

    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild);

        // Kullanıcının sesli kanalda olup olmadığını kontrol et
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Bu komutu kullanabilmek için bir sesli kanalda olmanız gerekiyor!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Queue var mı kontrol et
        if (!queue || !queue.currentTrack) {
            const noTrackEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('📭 Çalan Şarkı Yok')
                .setDescription('Duraklatılacak bir şarkı yok!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [noTrackEmbed], ephemeral: true });
        }

        // Bot ve kullanıcı aynı kanalda mı
        const botChannel = interaction.guild.members.me?.voice?.channel;
        if (botChannel && voiceChannel.id !== botChannel.id) {
            const wrongChannelEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Yanlış Kanal')
                .setDescription('Bot ile aynı sesli kanalda olmanız gerekiyor!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [wrongChannelEmbed], ephemeral: true });
        }

        try {
            // Duraklatılmış mı kontrol et
            if (queue.node.isPaused()) {
                const alreadyPausedEmbed = new EmbedBuilder()
                    .setColor('#ffa500')
                    .setTitle('⏸️ Zaten Duraklatılmış')
                    .setDescription('Müzik zaten duraklatılmış durumda!')
                    .setTimestamp();
                
                return interaction.reply({ embeds: [alreadyPausedEmbed], ephemeral: true });
            }

            // Müziği duraklat
            queue.node.pause();

            const pauseEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('⏸️ Müzik Duraklatıldı')
                .setDescription(`**${queue.currentTrack.title}** duraklatıldı!`)
                .setThumbnail(queue.currentTrack.thumbnail)
                .setTimestamp();

            await interaction.reply({ embeds: [pauseEmbed] });

        } catch (error) {
            console.error('Pause command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Müzik duraklatılırken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
