// ==========================================
// 🔍 Debug Play Command - Sorun Tespiti
// ==========================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug-play')
        .setDescription('🔍 Play komutu debug ve test'),

    async execute(interaction) {
        try {
            console.log(`[DEBUG-PLAY] Command triggered by ${interaction.user.tag}`);
            console.log(`[DEBUG-PLAY] Guild: ${interaction.guild.name} (${interaction.guild.id})`);
            console.log(`[DEBUG-PLAY] Channel: ${interaction.channel.name} (${interaction.channel.id})`);
            
            // Bot bilgileri
            const bot = interaction.guild.members.me;
            console.log(`[DEBUG-PLAY] Bot: ${bot.user.tag} (${bot.user.id})`);
            console.log(`[DEBUG-PLAY] Bot permissions: ${bot.permissions.toArray().join(', ')}`);
            
            // Kullanıcı bilgileri
            const member = interaction.member;
            console.log(`[DEBUG-PLAY] User: ${member.user.tag} (${member.user.id})`);
            console.log(`[DEBUG-PLAY] User voice channel: ${member.voice?.channel?.name || 'None'}`);
            
            // Komut yükleme durumu
            const client = interaction.client;
            console.log(`[DEBUG-PLAY] Total commands loaded: ${client.commands.size}`);
            console.log(`[DEBUG-PLAY] Available commands: ${Array.from(client.commands.keys()).join(', ')}`);
            
            // Play komutu kontrolü
            const playCommand = client.commands.get('play');
            console.log(`[DEBUG-PLAY] Play command exists: ${!!playCommand}`);
            if (playCommand) {
                console.log(`[DEBUG-PLAY] Play command data:`, playCommand.data.toJSON());
            }
            
            // Debug embed oluştur
            const debugEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🔍 Debug Play Command')
                .setDescription('Play komutu debug bilgileri')
                .addFields(
                    {
                        name: '📊 Bot Bilgileri',
                        value: `**Tag:** ${bot.user.tag}\n**ID:** ${bot.user.id}\n**Permissions:** ${bot.permissions.toArray().length} yetki`,
                        inline: true
                    },
                    {
                        name: '👤 Kullanıcı Bilgileri',
                        value: `**Tag:** ${member.user.tag}\n**ID:** ${member.user.id}\n**Voice:** ${member.voice?.channel?.name || 'Yok'}`,
                        inline: true
                    },
                    {
                        name: '⚙️ Sistem Bilgileri',
                        value: `**Commands:** ${client.commands.size}\n**Play Command:** ${playCommand ? '✅ Var' : '❌ Yok'}\n**Guild:** ${interaction.guild.name}`,
                        inline: true
                    },
                    {
                        name: '📋 Yüklü Komutlar',
                        value: `\`\`\`${Array.from(client.commands.keys()).join(', ')}\`\`\``,
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'Debug Command - NeuroVia Bot' });

            await interaction.reply({ embeds: [debugEmbed] });
            console.log(`[DEBUG-PLAY] Debug command completed successfully`);

        } catch (error) {
            console.error(`[DEBUG-PLAY] Error:`, error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Debug Hatası')
                .setDescription('Debug komutu çalıştırılırken hata oluştu!')
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
                console.error(`[DEBUG-PLAY] Failed to send error message:`, replyError);
            }
        }
    }
};
