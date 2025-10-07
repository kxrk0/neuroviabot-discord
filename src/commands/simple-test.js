const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('simple-test')
        .setDescription('En basit test komutu'),

    async execute(interaction) {
        await interaction.reply('✅ Basit test başarılı!');
    }
};
