const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('▶️ Duraklatılmış müziği devam ettirir'),

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
                .setDescription('Devam ettirilecek bir şarkı yok!')
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
            if (!queue.node.isPaused()) {
                const notPausedEmbed = new EmbedBuilder()
                    .setColor('#ffa500')
                    .setTitle('▶️ Zaten Çalıyor')
                    .setDescription('Müzik zaten çalıyor!')
                    .setTimestamp();
                
                return interaction.reply({ embeds: [notPausedEmbed], ephemeral: true });
            }

            // Müziği devam ettir
            queue.node.resume();

            const resumeEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('▶️ Müzik Devam Ediyor')
                .setDescription(`**${queue.currentTrack.title}** devam ediyor!`)
                .setThumbnail(queue.currentTrack.thumbnail)
                .setTimestamp();

            await interaction.reply({ embeds: [resumeEmbed] });

        } catch (error) {
            console.error('Resume command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Müzik devam ettirilirken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
