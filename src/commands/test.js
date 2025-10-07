const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test komutu'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Test Başarılı')
            .setDescription('Komut sistemi çalışıyor!')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
