const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 YouTube veya Spotify\'dan müzik çalar')
        .addStringOption(option =>
            option.setName('şarkı')
                .setDescription('Çalınacak şarkı adı veya URL')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('hemen-çal')
                .setDescription('Kuyruğa eklemek yerine hemen çal (varsayılan: false)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const player = useMainPlayer();
        const query = interaction.options.getString('şarkı');
        const playNow = interaction.options.getBoolean('hemen-çal') || false;

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

        try {
            await interaction.deferReply();

            // Botu ses kanalına bağla
            const { track } = await player.play(voiceChannel, query, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        requestedBy: interaction.user
                    }
                }
            });

            const successEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('🎵 Şarkı Eklendi')
                .setDescription(`**${track.title}** kuyruğa eklendi!`)
                .addFields(
                    { name: '👤 İsteyen', value: interaction.user.toString(), inline: true },
                    { name: '⏱️ Süre', value: track.duration, inline: true },
                    { name: '👀 Görüntülenme', value: track.views.toString(), inline: true }
                )
                .setThumbnail(track.thumbnail)
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Play command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Şarkı çalınırken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
