const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play-simple')
        .setDescription('🎵 Basit müzik çalıcı (test için)')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('YouTube URL veya şarkı adı')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            // Kullanıcının sesli kanalda olup olmadığını kontrol et
            const voiceChannel = interaction.member?.voice?.channel;
            if (!voiceChannel) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Hata')
                    .setDescription(config.messages.userNotInVoice)
                    .setTimestamp();
                
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Bot'un o kanala katılma izni var mı kontrol et
            const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
            if (!permissions.has(['Connect', 'Speak'])) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ İzin Hatası')
                    .setDescription(config.messages.botMissingPermissions)
                    .setTimestamp();
                
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const query = interaction.options.getString('url');

            // Basit yanıt (gerçek müzik çalma özelliği henüz aktif değil)
            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle('🎵 Müzik Sistemi (Geliştirme Aşaması)')
                .setDescription(`**Aranılan:** ${query}\n\n⚠️ **Not:** Müzik sistemi şu anda geliştirme aşamasında.\nTam özellikli müzik sistemi için discord-player konfigürasyonu tamamlanıyor.`)
                .addFields(
                    {
                        name: '🔧 Mevcut Durum',
                        value: '• Discord-player yüklendi ✅\n• Audio dependencies kurulumu gerekli\n• Extractorlar konfigüre ediliyor',
                        inline: false
                    },
                    {
                        name: '📍 Sesli Kanal',
                        value: `${voiceChannel}`,
                        inline: true
                    },
                    {
                        name: '👤 İstek Sahibi',
                        value: `${interaction.user}`,
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'Müzik sistemi yakında aktif olacak!' });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Play-simple komutu hatası:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Hata')
                .setDescription('Komut çalıştırılırken bir hata oluştu!')
                .setTimestamp();
            
            if (interaction.replied) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
