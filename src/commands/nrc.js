// ==========================================
// 🪙 NRC (NeuroCoin) - Quick Access Command
// ==========================================

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getDatabase } = require('../database/simple-db');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nrc')
        .setDescription('🪙 NeuroCoin (NRC) hızlı erişim')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bakiye')
                .setDescription('💳 NRC bakiyeni görüntüle')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Bakiyesi görüntülenecek kullanıcı')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('günlük')
                .setDescription('🎁 Günlük NRC ödülünü al (500-1000 NRC)')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('çalış')
                .setDescription('💼 Çalış ve NRC kazan (200-500 NRC, 4 saat cooldown)')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('gönder')
                .setDescription('💸 Başka kullanıcıya NRC gönder')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('NRC gönderilecek kullanıcı')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('miktar')
                        .setDescription('Gönderilecek NRC miktarı')
                        .setMinValue(10)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('yatır')
                .setDescription('🏦 Bankaya NRC yatır (güvenli sakla)')
                .addIntegerOption(option =>
                    option.setName('miktar')
                        .setDescription('Yatırılacak NRC miktarı')
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('çek')
                .setDescription('💰 Bankadan NRC çek')
                .addIntegerOption(option =>
                    option.setName('miktar')
                        .setDescription('Çekilecek NRC miktarı')
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sıralama')
                .setDescription('🏆 NRC zenginlik sıralaması')
                .addStringOption(option =>
                    option.setName('tür')
                        .setDescription('Sıralama türü')
                        .addChoices(
                            { name: '💰 Toplam Bakiye', value: 'total' },
                            { name: '💵 Cüzdan', value: 'wallet' },
                            { name: '🏦 Banka', value: 'bank' }
                        )
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('profil')
                .setDescription('👤 NRC profil ve istatistikleri')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Profili görüntülenecek kullanıcı')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('yardım')
                .setDescription('❓ NRC sistemi hakkında bilgi al')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        // Ekonomi sistemi kontrolü
        const db = getDatabase();
        const settings = db.getGuildSettings(interaction.guild.id);
        
        // Features objesi içinde veya direkt economy objesi olarak kontrol et
        const economyEnabled = settings.features?.economy || settings.economy?.enabled;
        
        if (!economyEnabled) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#8B5CF6')
                .setTitle('❌ NeuroCoin Sistemi Kapalı')
                .setDescription('Bu sunucuda NeuroCoin ekonomi sistemi etkin değil!')
                .addFields({
                    name: '💡 Yöneticiler İçin',
                    value: `🌐 **Web Dashboard üzerinden açabilirsiniz:**\n└ https://neuroviabot.xyz/dashboard\n└ Sunucunuzu seçin → Ekonomi → Sistemi Etkinleştir`,
                    inline: false
                })
                .setFooter({ text: 'The Neural Currency of Discord' })
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        try {
            switch (subcommand) {
                case 'bakiye':
                    await this.handleBalance(interaction);
                    break;
                case 'günlük':
                    await this.handleDaily(interaction);
                    break;
                case 'çalış':
                    await this.handleWork(interaction);
                    break;
                case 'gönder':
                    await this.handleTransfer(interaction);
                    break;
                case 'yatır':
                    await this.handleDeposit(interaction);
                    break;
                case 'çek':
                    await this.handleWithdraw(interaction);
                    break;
                case 'sıralama':
                    await this.handleLeaderboard(interaction);
                    break;
                case 'profil':
                    await this.handleProfile(interaction);
                    break;
                case 'yardım':
                    await this.handleHelp(interaction);
                    break;
            }
        } catch (error) {
            logger.error('NRC komut hatası', error, { 
                subcommand, 
                user: interaction.user.id 
            });

            const errorEmbed = new EmbedBuilder()
                .setColor('#8B5CF6')
                .setTitle('❌ Hata')
                .setDescription('İşlem sırasında bir hata oluştu!')
                .setTimestamp();

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },

    // Bakiye görüntüleme
    async handleBalance(interaction) {
        const targetUser = interaction.options.getUser('kullanıcı') || interaction.user;

        if (targetUser.bot) {
            return interaction.reply({
                content: '❌ Bot kullanıcılarının NeuroCoin bakiyesi yoktur!',
                ephemeral: true
            });
        }

        const db = getDatabase();
        const balance = db.getNeuroCoinBalance(targetUser.id);

        // Zenginlik yüzdesi hesapla
        const allBalances = Array.from(db.data.neuroCoinBalances.values());
        const totalNRC = allBalances.reduce((sum, b) => sum + b.total, 0);
        const wealthPercentage = totalNRC > 0 ? ((balance.total / totalNRC) * 100).toFixed(2) : 0;

        const balanceEmbed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle(`💰 ${targetUser.username} - NeuroCoin Bakiyesi`)
            .setDescription('**The Neural Currency of Discord**')
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: '💵 Cüzdan', value: `**${balance.wallet.toLocaleString()}** NRC`, inline: true },
                { name: '🏦 Banka', value: `**${balance.bank.toLocaleString()}** NRC`, inline: true },
                { name: '📊 Toplam', value: `**${balance.total.toLocaleString()}** NRC`, inline: true },
                { name: '📈 Zenginlik Oranı', value: `%${wealthPercentage}`, inline: true },
                { name: '💎 Sıralama', value: `#${this.getUserRank(db, targetUser.id)}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true }
            )
            .setFooter({
                text: `NeuroCoin (NRC) • ${interaction.guild.name}`,
                iconURL: interaction.guild.iconURL()
            })
            .setTimestamp();

        // Quick action buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('nrc_daily')
                    .setLabel('🎁 Günlük')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('nrc_work')
                    .setLabel('💼 Çalış')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('nrc_leaderboard')
                    .setLabel('🏆 Sıralama')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [balanceEmbed], components: [row] });
    },

    // Günlük ödül
    async handleDaily(interaction) {
        const db = getDatabase();
        const balance = db.getNeuroCoinBalance(interaction.user.id);

        // Son daily kontrolü
        const now = new Date();
        const lastDaily = balance.lastDaily;
        
        if (lastDaily) {
            const timeSinceDaily = now - new Date(lastDaily);
            const hoursLeft = 24 - (timeSinceDaily / (1000 * 60 * 60));
            
            if (hoursLeft > 0) {
                const hours = Math.floor(hoursLeft);
                const minutes = Math.floor((hoursLeft - hours) * 60);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor('#8B5CF6')
                    .setTitle('⏰ Çok Erken!')
                    .setDescription(`Günlük ödülünüzü zaten aldınız!\n\n⏱️ **Kalan Süre:** ${hours} saat ${minutes} dakika`)
                    .setTimestamp();
                
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        // Streak hesapla
        const streakData = db.data.dailyStreaks.get(interaction.user.id) || { count: 0, lastClaim: null };
        let currentStreak = streakData.count;
        
        if (streakData.lastClaim) {
            const lastClaim = new Date(streakData.lastClaim);
            const daysSinceLastClaim = Math.floor((now - lastClaim) / (1000 * 60 * 60 * 24));
            
            if (daysSinceLastClaim === 1) {
                currentStreak++;
            } else if (daysSinceLastClaim > 1) {
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }

        // Ödül hesapla (streak bonus)
        const baseReward = Math.floor(Math.random() * 501) + 500; // 500-1000
        const streakBonus = Math.min(currentStreak * 50, 500); // Max 500 bonus
        const totalReward = baseReward + streakBonus;

        // Bakiye güncelle
        balance.wallet += totalReward;
        balance.total = balance.wallet + balance.bank;
        balance.lastDaily = now.toISOString();
        db.data.neuroCoinBalances.set(interaction.user.id, balance);
        
        // Streak kaydet
        db.data.dailyStreaks.set(interaction.user.id, {
            count: currentStreak,
            lastClaim: now.toISOString()
        });
        
        db.saveData();

        const dailyEmbed = new EmbedBuilder()
            .setColor('#10b981')
            .setTitle('🎁 Günlük Ödül Alındı!')
            .setDescription(`Günlük NeuroCoin ödülünüzü aldınız!`)
            .addFields(
                { name: '💰 Temel Ödül', value: `${baseReward.toLocaleString()} NRC`, inline: true },
                { name: '🔥 Streak Bonusu', value: `${streakBonus.toLocaleString()} NRC (${currentStreak} gün)`, inline: true },
                { name: '🎉 Toplam', value: `**${totalReward.toLocaleString()} NRC**`, inline: true },
                { name: '💵 Yeni Bakiye', value: `${balance.wallet.toLocaleString()} NRC`, inline: true }
            )
            .setFooter({ text: '24 saat sonra tekrar gelebilirsiniz!' })
            .setTimestamp();

        await interaction.reply({ embeds: [dailyEmbed] });
    },

    // Çalışma
    async handleWork(interaction) {
        const db = getDatabase();
        const balance = db.getNeuroCoinBalance(interaction.user.id);

        // Son work kontrolü (4 saat cooldown)
        const now = new Date();
        const lastWork = balance.lastWork;
        
        if (lastWork) {
            const timeSinceWork = now - new Date(lastWork);
            const hoursLeft = 4 - (timeSinceWork / (1000 * 60 * 60));
            
            if (hoursLeft > 0) {
                const hours = Math.floor(hoursLeft);
                const minutes = Math.floor((hoursLeft - hours) * 60);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor('#8B5CF6')
                    .setTitle('😓 Yorgunsunuz!')
                    .setDescription(`Biraz dinlenmeniz gerekiyor!\n\n⏱️ **Kalan Süre:** ${hours} saat ${minutes} dakika`)
                    .setTimestamp();
                
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        // Rastgele iş ve ödül
        const jobs = [
            { name: 'Yazılım Geliştirme', emoji: '💻', min: 300, max: 500 },
            { name: 'Discord Moderasyonu', emoji: '🛡️', min: 250, max: 450 },
            { name: 'Grafik Tasarım', emoji: '🎨', min: 280, max: 480 },
            { name: 'İçerik Oluşturma', emoji: '📝', min: 270, max: 470 },
            { name: 'Müzik Prodüksiyonu', emoji: '🎵', min: 290, max: 490 },
            { name: 'Bot Geliştirme', emoji: '🤖', min: 310, max: 500 }
        ];

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const reward = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

        // Bakiye güncelle
        balance.wallet += reward;
        balance.total = balance.wallet + balance.bank;
        balance.lastWork = now.toISOString();
        db.data.neuroCoinBalances.set(interaction.user.id, balance);
        db.saveData();

        const workEmbed = new EmbedBuilder()
            .setColor('#3b82f6')
            .setTitle(`${job.emoji} Çalıştınız!`)
            .setDescription(`**${job.name}** yaptınız ve kazandınız!`)
            .addFields(
                { name: '💰 Kazanç', value: `**${reward.toLocaleString()} NRC**`, inline: true },
                { name: '💵 Yeni Bakiye', value: `${balance.wallet.toLocaleString()} NRC`, inline: true }
            )
            .setFooter({ text: '4 saat sonra tekrar çalışabilirsiniz!' })
            .setTimestamp();

        await interaction.reply({ embeds: [workEmbed] });
    },

    // Transfer
    async handleTransfer(interaction) {
        const targetUser = interaction.options.getUser('kullanıcı');
        const amount = interaction.options.getInteger('miktar');

        if (targetUser.bot) {
            return interaction.reply({
                content: '❌ Bot kullanıcılarına NRC gönderemezsiniz!',
                ephemeral: true
            });
        }

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ Kendinize NRC gönderemezsiniz!',
                ephemeral: true
            });
        }

        const db = getDatabase();
        const senderBalance = db.getNeuroCoinBalance(interaction.user.id);

        if (senderBalance.wallet < amount) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#8B5CF6')
                .setTitle('❌ Yetersiz Bakiye')
                .setDescription(`Cüzdanınızda yeterli NRC yok!\n\n**Cüzdan:** ${senderBalance.wallet.toLocaleString()} NRC`)
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Transfer işlemi
        const receiverBalance = db.getNeuroCoinBalance(targetUser.id);
        
        senderBalance.wallet -= amount;
        senderBalance.total = senderBalance.wallet + senderBalance.bank;
        
        receiverBalance.wallet += amount;
        receiverBalance.total = receiverBalance.wallet + receiverBalance.bank;
        
        db.data.neuroCoinBalances.set(interaction.user.id, senderBalance);
        db.data.neuroCoinBalances.set(targetUser.id, receiverBalance);
        
        // Transaction kaydet
        db.recordTransaction(interaction.user.id, targetUser.id, amount, 'transfer', {
            guild: interaction.guild.id
        });
        
        db.saveData();

        const transferEmbed = new EmbedBuilder()
            .setColor('#10b981')
            .setTitle('✅ Transfer Başarılı')
            .setDescription(`**${targetUser.username}** kullanıcısına NRC gönderildi!`)
            .addFields(
                { name: '💸 Gönderilen', value: `**${amount.toLocaleString()} NRC**`, inline: true },
                { name: '💵 Kalan Bakiye', value: `${senderBalance.wallet.toLocaleString()} NRC`, inline: true }
            )
            .setFooter({ text: 'NeuroCoin Transfer' })
            .setTimestamp();

        await interaction.reply({ embeds: [transferEmbed] });
    },

    // Yatırma
    async handleDeposit(interaction) {
        const amount = interaction.options.getInteger('miktar');
        const db = getDatabase();
        const balance = db.getNeuroCoinBalance(interaction.user.id);

        if (balance.wallet < amount) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#8B5CF6')
                .setTitle('❌ Yetersiz Bakiye')
                .setDescription(`Cüzdanınızda yeterli NRC yok!\n\n**Cüzdan:** ${balance.wallet.toLocaleString()} NRC`)
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        balance.wallet -= amount;
        balance.bank += amount;
        balance.total = balance.wallet + balance.bank;
        
        db.data.neuroCoinBalances.set(interaction.user.id, balance);
        db.saveData();

        const depositEmbed = new EmbedBuilder()
            .setColor('#10b981')
            .setTitle('🏦 Bankaya Yatırıldı')
            .setDescription('NeuroCoin başarıyla bankaya yatırıldı!')
            .addFields(
                { name: '💰 Yatırılan', value: `${amount.toLocaleString()} NRC`, inline: true },
                { name: '🏦 Yeni Banka', value: `${balance.bank.toLocaleString()} NRC`, inline: true },
                { name: '💵 Yeni Cüzdan', value: `${balance.wallet.toLocaleString()} NRC`, inline: true }
            )
            .setFooter({ text: 'Banka paranız güvende!' })
            .setTimestamp();

        await interaction.reply({ embeds: [depositEmbed] });
    },

    // Çekme
    async handleWithdraw(interaction) {
        const amount = interaction.options.getInteger('miktar');
        const db = getDatabase();
        const balance = db.getNeuroCoinBalance(interaction.user.id);

        if (balance.bank < amount) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#8B5CF6')
                .setTitle('❌ Yetersiz Bakiye')
                .setDescription(`Bankanızda yeterli NRC yok!\n\n**Banka:** ${balance.bank.toLocaleString()} NRC`)
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        balance.bank -= amount;
        balance.wallet += amount;
        balance.total = balance.wallet + balance.bank;
        
        db.data.neuroCoinBalances.set(interaction.user.id, balance);
        db.saveData();

        const withdrawEmbed = new EmbedBuilder()
            .setColor('#3b82f6')
            .setTitle('💰 Bankadan Çekildi')
            .setDescription('NeuroCoin başarıyla çekildi!')
            .addFields(
                { name: '💵 Çekilen', value: `${amount.toLocaleString()} NRC`, inline: true },
                { name: '🏦 Yeni Banka', value: `${balance.bank.toLocaleString()} NRC`, inline: true },
                { name: '💵 Yeni Cüzdan', value: `${balance.wallet.toLocaleString()} NRC`, inline: true }
            )
            .setFooter({ text: 'Paranız cüzdanınızda' })
            .setTimestamp();

        await interaction.reply({ embeds: [withdrawEmbed] });
    },

    // Sıralama
    async handleLeaderboard(interaction) {
        const type = interaction.options.getString('tür') || 'total';
        const db = getDatabase();

        // Tüm balanceları al ve sırala
        const balances = [];
        for (const [userId, balance] of db.data.neuroCoinBalances) {
            balances.push({
                userId,
                wallet: balance.wallet,
                bank: balance.bank,
                total: balance.total
            });
        }

        // Sıralama türüne göre sırala
        balances.sort((a, b) => b[type] - a[type]);

        // Top 10
        const top10 = balances.slice(0, 10);

        if (top10.length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#8B5CF6')
                .setTitle('📊 Sıralama Boş')
                .setDescription('Henüz hiç kimse NeuroCoin kazanmamış!')
                .setTimestamp();
            
            return interaction.reply({ embeds: [errorEmbed] });
        }

        // Leaderboard text oluştur
        let leaderboardText = '';
        for (let i = 0; i < top10.length; i++) {
            const entry = top10[i];
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            
            try {
                const user = await interaction.client.users.fetch(entry.userId);
                const amount = entry[type].toLocaleString();
                leaderboardText += `${medal} **${user.username}** - ${amount} NRC\n`;
            } catch (error) {
                leaderboardText += `${medal} Unknown User - ${entry[type].toLocaleString()} NRC\n`;
            }
        }

        // Kullanıcının sıralaması
        const userRank = balances.findIndex(b => b.userId === interaction.user.id) + 1;
        const userBalance = db.getNeuroCoinBalance(interaction.user.id);

        const typeNames = {
            total: '💰 Toplam Bakiye',
            wallet: '💵 Cüzdan',
            bank: '🏦 Banka'
        };

        const leaderboardEmbed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle(`🏆 NeuroCoin Sıralaması - ${typeNames[type]}`)
            .setDescription(leaderboardText)
            .addFields({
                name: '📍 Sizin Sıralamanız',
                value: userRank > 0 
                    ? `**#${userRank}** - ${userBalance[type].toLocaleString()} NRC`
                    : 'Henüz sıralamada değilsiniz',
                inline: false
            })
            .setFooter({ text: `${interaction.guild.name} • NeuroCoin Leaderboard` })
            .setTimestamp();

        await interaction.reply({ embeds: [leaderboardEmbed] });
    },

    // Profil
    async handleProfile(interaction) {
        const targetUser = interaction.options.getUser('kullanıcı') || interaction.user;

        if (targetUser.bot) {
            return interaction.reply({
                content: '❌ Bot kullanıcılarının NRC profili yoktur!',
                ephemeral: true
            });
        }

        const db = getDatabase();
        const balance = db.getNeuroCoinBalance(targetUser.id);
        const transactions = db.getUserTransactions(targetUser.id, 5);
        const streakData = db.data.dailyStreaks.get(targetUser.id) || { count: 0 };

        // İstatistikler
        let totalEarned = 0;
        let totalSpent = 0;
        let totalTransfers = 0;

        for (const tx of transactions) {
            if (tx.to === targetUser.id) {
                totalEarned += tx.amount;
            } else if (tx.from === targetUser.id) {
                if (tx.type === 'transfer') {
                    totalTransfers++;
                }
                totalSpent += tx.amount;
            }
        }

        // Son işlemler
        const recentTransactions = transactions.length > 0 
            ? transactions.slice(0, 5).map((tx, i) => {
                const icon = tx.to === targetUser.id ? '📥' : '📤';
                return `${icon} ${tx.amount.toLocaleString()} NRC - ${tx.type}`;
            }).join('\n')
            : 'İşlem bulunamadı';

        const rank = this.getUserRank(db, targetUser.id);

        const profileEmbed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle(`👤 ${targetUser.username} - NRC Profil`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: '💰 Toplam Bakiye', value: `**${balance.total.toLocaleString()}** NRC`, inline: true },
                { name: '💵 Cüzdan', value: `${balance.wallet.toLocaleString()} NRC`, inline: true },
                { name: '🏦 Banka', value: `${balance.bank.toLocaleString()} NRC`, inline: true },
                { name: '📈 Sıralama', value: `#${rank}`, inline: true },
                { name: '🔥 Daily Streak', value: `${streakData.count} gün`, inline: true },
                { name: '💸 Transfer Sayısı', value: `${totalTransfers}`, inline: true },
                { name: '📜 Son 5 İşlem', value: recentTransactions, inline: false }
            )
            .setFooter({ text: `NeuroCoin Profile • ${interaction.guild.name}` })
            .setTimestamp();

        await interaction.reply({ embeds: [profileEmbed] });
    },

    // Yardım
    async handleHelp(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('❓ NeuroCoin (NRC) Yardım')
            .setDescription('**The Neural Currency of Discord**\n\nNeuroCoin, Discord sunucunuzda kullanabileceğiniz dijital bir para birimidir.')
            .addFields(
                {
                    name: '💰 Temel Komutlar',
                    value: '`/nrc bakiye` - Bakiyenizi görüntüleyin\n`/nrc günlük` - Günlük ödül (24 saat)\n`/nrc çalış` - Çalışıp NRC kazanın (4 saat)\n`/nrc profil` - Profilinizi görüntüleyin',
                    inline: false
                },
                {
                    name: '💸 Transfer ve Banka',
                    value: '`/nrc gönder` - Başkasına NRC gönderin\n`/nrc yatır` - Bankaya güvenle saklayın\n`/nrc çek` - Bankadan çekin',
                    inline: false
                },
                {
                    name: '🏆 Sıralama ve İstatistikler',
                    value: '`/nrc sıralama` - Zenginlik sıralaması\n`/nrc profil` - Detaylı profil ve istatistikler',
                    inline: false
                },
                {
                    name: '💡 İpuçları',
                    value: '• Her gün giriş yaparak streak bonusu kazanın!\n• Paranızı bankaya yatırın, güvenli olsun\n• Çalışma ile düzenli gelir elde edin\n• Sunucu etkinliklerine katılarak NRC kazanın',
                    inline: false
                },
                {
                    name: '🔗 Web Dashboard',
                    value: '[neuroviabot.xyz/dashboard](https://neuroviabot.xyz/dashboard)\nDetaylı yönetim için web paneli kullanın!',
                    inline: false
                }
            )
            .setFooter({ text: 'NeuroCoin • The Neural Currency of Discord' })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    },

    // Helper: Kullanıcının sırasını bul
    getUserRank(db, userId) {
        const balances = Array.from(db.data.neuroCoinBalances.entries())
            .map(([id, balance]) => ({ userId: id, total: balance.total }))
            .sort((a, b) => b.total - a.total);
        
        const rank = balances.findIndex(b => b.userId === userId) + 1;
        return rank > 0 ? rank : '-';
    }
};

