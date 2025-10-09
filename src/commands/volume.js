const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('🔊 Ses seviyesini ayarlar')
        .addIntegerOption(option =>
            option.setName('seviye')
                .setDescription('Ses seviyesi (0-100)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)
        ),

    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild);
        const volume = interaction.options.getInteger('seviye');

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
                .setDescription('Ses seviyesi ayarlanacak bir şarkı yok!')
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
            // Ses seviyesini ayarla
            queue.node.setVolume(volume);

            const volumeEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('🔊 Ses Seviyesi Ayarlandı')
                .setDescription(`Ses seviyesi **${volume}%** olarak ayarlandı!`)
                .addFields({
                    name: '🎵 Şarkı',
                    value: `**${queue.currentTrack.title}**`,
                    inline: false
                })
                .setTimestamp();

            await interaction.reply({ embeds: [volumeEmbed] });

        } catch (error) {
            console.error('Volume command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Ses seviyesi ayarlanırken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
