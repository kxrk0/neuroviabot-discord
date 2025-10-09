const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('⏭️ Şu anki şarkıyı atlar')
        .addIntegerOption(option =>
            option.setName('sayı')
                .setDescription('Kaç şarkı atlanacak (varsayılan: 1)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)
        ),

    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild);
        const skipCount = interaction.options.getInteger('sayı') || 1;

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
                .setDescription('Atlanacak bir şarkı yok!')
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
            // Kuyrukta yeterli şarkı var mı kontrol et
            if (queue.tracks.size < skipCount - 1) {
                const notEnoughTracksEmbed = new EmbedBuilder()
                    .setColor('#ffa500')
                    .setTitle('📭 Yetersiz Şarkı')
                    .setDescription(`Kuyrukta sadece ${queue.tracks.size} şarkı var!`)
                    .setTimestamp();
                
                return interaction.reply({ embeds: [notEnoughTracksEmbed], ephemeral: true });
            }

            const currentTrack = queue.currentTrack;
            
            // Şarkıyı atla
            queue.node.skip();

            const skipEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('⏭️ Şarkı Atlandı')
                .setDescription(`**${currentTrack.title}** atlandı!`)
                .setThumbnail(currentTrack.thumbnail)
                .setTimestamp();

            await interaction.reply({ embeds: [skipEmbed] });

        } catch (error) {
            console.error('Skip command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Şarkı atlanırken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
