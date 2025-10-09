const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('⏹️ Müziği durdurur ve kuyruğu temizler'),

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
        if (!queue || (!queue.currentTrack && queue.tracks.size === 0)) {
            const noTrackEmbed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('📭 Çalan Şarkı Yok')
                .setDescription('Durdurulacak bir şarkı yok!')
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
            // Müziği durdur ve kuyruğu temizle
            queue.delete();

            const stopEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('⏹️ Müzik Durduruldu')
                .setDescription('Müzik durduruldu ve kuyruk temizlendi!')
                .setTimestamp();

            await interaction.reply({ embeds: [stopEmbed] });

        } catch (error) {
            console.error('Stop command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Müzik durdurulurken bir hata oluştu!')
                .addFields({ name: 'Hata', value: error.message })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
