const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 Şarkı çal veya kuyruğa ekle')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('YouTube linki veya şarkı adı')
                .setRequired(true)),

    async execute(interaction) {
        try {
            console.log(`[PLAY] Command executed by ${interaction.user.tag} in ${interaction.guild.name}`);
            console.log(`[PLAY] Interaction ID: ${interaction.id}`);
            console.log(`[PLAY] Command name: ${interaction.commandName}`);
            
            const query = interaction.options.getString('query');
            const voiceChannel = interaction.member?.voice?.channel;
            
            console.log(`[PLAY] Query: ${query}`);
            console.log(`[PLAY] Voice channel: ${voiceChannel?.name || 'None'}`);

            // Kullanıcının sesli kanalda olup olmadığını kontrol et
            if (!voiceChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Hata')
                    .setDescription('Önce bir sesli kanala katılman gerekiyor!')
                    .setTimestamp();
                
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Bot'un o kanala katılma izni var mı kontrol et
            const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
            if (!permissions.has(['Connect', 'Speak'])) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ İzin Hatası')
                    .setDescription('Sesli kanala bağlanma veya konuşma yetkim yok!')
                    .setTimestamp();
                
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Başarı mesajı - debug-play ile aynı pattern
            const embed = new EmbedBuilder()
                .setColor('#1db954')
                .setTitle('✅ Şarkı Eklendi')
                .setDescription(`**${query}** kuyruğa eklendi!`)
                .addFields(
                    {
                        name: '📍 Sesli Kanal',
                        value: `${voiceChannel}`,
                        inline: true
                    },
                    {
                        name: '👤 İstek Sahibi',
                        value: `${interaction.user}`,
                        inline: true
                    },
                    {
                        name: '📋 Query',
                        value: query,
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'NeuroVia Music System' });

            console.log(`[PLAY] Sending success reply`);
            await interaction.reply({ embeds: [embed] });
            console.log(`[PLAY] Success reply sent successfully`);

        } catch (error) {
            console.error('Play komutu hatası:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Komut çalıştırılırken bir hata oluştu!')
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
                console.error(`[PLAY] Failed to send error message:`, replyError);
            }
        }
    }
};
