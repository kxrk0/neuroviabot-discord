const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('👋 Botu ses kanalından çıkarır'),

    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild);

        // Bot ses kanalında mı kontrol et
        const botChannel = interaction.guild.members.me?.voice?.channel;
        if (!botChannel) {
            const notInChannelEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('👋 Zaten Çıkmış')
                .setDescription('Bot zaten herhangi bir ses kanalında değil!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [notInChannelEmbed], ephemeral: true });
        }

        try {
            // Kuyruk varsa temizle
            if (queue) {
                queue.delete();
            }

            const leaveEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('👋 Bot Ayrıldı')
                .setDescription(`Bot **${botChannel.name}** kanalından ayrıldı!`)
                .addFields({
                    name: '👤 İsteyen',
                    value: interaction.user.toString(),
                    inline: true
                })
                .setTimestamp();

            await interaction.reply({ embeds: [leaveEmbed] });

        } catch (error) {
            console.error('Leave command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Bot kanaldan ayrılırken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
