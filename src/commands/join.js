const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('🔗 Botu ses kanalına çağırır'),

    async execute(interaction) {
        const player = useMainPlayer();
        const voiceChannel = interaction.member?.voice?.channel;

        // Kullanıcının sesli kanalda olup olmadığını kontrol et
        if (!voiceChannel) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Bu komutu kullanabilmek için bir sesli kanalda olmanız gerekiyor!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        try {
            // Bot zaten aynı kanalda mı kontrol et
            const botChannel = interaction.guild.members.me?.voice?.channel;
            if (botChannel && voiceChannel.id === botChannel.id) {
                const alreadyInChannelEmbed = new EmbedBuilder()
                    .setColor('#ffa500')
                    .setTitle('🔗 Zaten Bağlı')
                    .setDescription(`Bot zaten **${voiceChannel.name}** kanalında!`)
                    .setTimestamp();
                
                return interaction.reply({ embeds: [alreadyInChannelEmbed], ephemeral: true });
            }

            // Botu kanala bağla
            await player.play(voiceChannel, null, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        requestedBy: interaction.user
                    }
                }
            });

            const joinEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('🔗 Bot Bağlandı')
                .setDescription(`Bot **${voiceChannel.name}** kanalına bağlandı!`)
                .addFields({
                    name: '👤 İsteyen',
                    value: interaction.user.toString(),
                    inline: true
                })
                .setTimestamp();

            await interaction.reply({ embeds: [joinEmbed] });

        } catch (error) {
            console.error('Join command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Bot kanala bağlanırken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
