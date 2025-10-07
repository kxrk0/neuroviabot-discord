const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

/**
 * Debug Permissions Command
 * Bot'un izinlerini ve durumunu kontrol eder
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug-permissions')
        .setDescription('🔧 Bot izinlerini ve durumunu kontrol et')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            console.log(`[DEBUG-PERMISSIONS] Komut çalıştırıldı: ${interaction.user.tag} - ${interaction.guild.name}`);

            const bot = interaction.guild.members.me;
            const botPermissions = bot.permissions;
            const channelPermissions = interaction.channel.permissionsFor(bot);

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🔧 Bot İzinleri ve Durumu')
                .setDescription('Bot\'un mevcut izinleri ve durumu')
                .addFields(
                    {
                        name: '🤖 Bot Bilgileri',
                        value: `**ID:** ${bot.id}\n**Tag:** ${bot.user.tag}\n**Durum:** ${bot.presence?.status || 'Bilinmiyor'}`,
                        inline: true
                    },
                    {
                        name: '🏠 Sunucu Bilgileri',
                        value: `**ID:** ${interaction.guild.id}\n**Ad:** ${interaction.guild.name}\n**Üye:** ${interaction.guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: '📋 Kanal İzinleri',
                        value: `**Mesaj Gönder:** ${channelPermissions.has('SendMessages') ? '✅' : '❌'}\n**Embed Gönder:** ${channelPermissions.has('EmbedLinks') ? '✅' : '❌'}\n**Slash Komut:** ${channelPermissions.has('UseApplicationCommands') ? '✅' : '❌'}`,
                        inline: true
                    },
                    {
                        name: '🎵 Ses İzinleri',
                        value: `**Bağlan:** ${channelPermissions.has('Connect') ? '✅' : '❌'}\n**Konuş:** ${channelPermissions.has('Speak') ? '✅' : '❌'}\n**Ses Yönet:** ${channelPermissions.has('ManageChannels') ? '✅' : '❌'}`,
                        inline: true
                    },
                    {
                        name: '⚙️ Genel İzinler',
                        value: `**Yönetici:** ${botPermissions.has('Administrator') ? '✅' : '❌'}\n**Komut Kullan:** ${botPermissions.has('UseApplicationCommands') ? '✅' : '❌'}\n**Mesaj Geçmişi:** ${botPermissions.has('ReadMessageHistory') ? '✅' : '❌'}`,
                        inline: true
                    },
                    {
                        name: '🔧 Sistem Durumu',
                        value: `**Müzik Sistemi:** ${interaction.client.musicManager ? '✅ Aktif' : '❌ Pasif'}\n**Komut Sayısı:** ${interaction.client.commands.size}\n**Sunucu Sayısı:** ${interaction.client.guilds.cache.size}`,
                        inline: true
                    }
                )
                .setThumbnail(bot.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: 'NeuroVia Debug System' });

            await interaction.reply({ embeds: [embed] });
            console.log(`[DEBUG-PERMISSIONS] İzinler gösterildi: ${interaction.guild.name}`);

        } catch (error) {
            console.error('[DEBUG-PERMISSIONS] Komut hatası:', error);

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
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            } catch (replyError) {
                console.error('[DEBUG-PERMISSIONS] Hata mesajı gönderilemedi:', replyError);
            }
        }
    }
};
