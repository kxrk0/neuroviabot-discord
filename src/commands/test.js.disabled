const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test komutu'),

    async execute(interaction) {
        try {
            console.log(`[TEST] Command executed by ${interaction.user.tag} in ${interaction.guild.name}`);
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Test Başarılı')
                .setDescription('Komut sistemi çalışıyor!')
                .addFields(
                    {
                        name: '👤 Kullanıcı',
                        value: `${interaction.user}`,
                        inline: true
                    },
                    {
                        name: '🏠 Sunucu',
                        value: `${interaction.guild.name}`,
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'Test Command' });

            await interaction.reply({ embeds: [embed] });
            console.log(`[TEST] Success reply sent successfully`);

        } catch (error) {
            console.error('Test komutu hatası:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Test komutu çalıştırılırken bir hata oluştu!')
                .addFields({
                    name: '🔧 Hata Detayı',
                    value: `\`\`\`${error.message}\`\`\``
                })
                .setTimestamp();

            try {
                if (interaction.replied) {
                    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } catch (replyError) {
                console.error(`[TEST] Failed to send error message:`, replyError);
            }
        }
    }
};
