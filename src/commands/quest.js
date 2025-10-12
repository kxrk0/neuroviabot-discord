const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getDatabase } = require('../database/simple-db');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quest')
        .setDescription('🗺️ Görev sistemi - NeuroCoin kazan!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('📋 Mevcut görevleri görüntüle')
                .addStringOption(option =>
                    option.setName('tür')
                        .setDescription('Görev türü')
                        .addChoices(
                            { name: '📅 Günlük', value: 'daily' },
                            { name: '📆 Haftalık', value: 'weekly' },
                            { name: '🏆 Başarı', value: 'achievement' }
                        )
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('progress')
                .setDescription('📊 Görev ilerlemeni kontrol et')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription('🎁 Tamamlanan görev ödülünü al')
                .addStringOption(option =>
                    option.setName('görev-id')
                        .setDescription('Görev ID\'si')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('daily')
                .setDescription('📅 Günlük görevleri görüntüle')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'list':
                    await this.handleList(interaction);
                    break;
                case 'progress':
                    await this.handleProgress(interaction);
                    break;
                case 'claim':
                    await this.handleClaim(interaction);
                    break;
                case 'daily':
                    await this.handleDaily(interaction);
                    break;
            }
        } catch (error) {
            logger.error('Quest komutunda hata', error, { subcommand, user: interaction.user.id });
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#8B5CF6')
                .setTitle('❌ Görev Hatası')
                .setDescription('Görev işlemi sırasında bir hata oluştu!')
                .setTimestamp();

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },

    async handleList(interaction) {
        const type = interaction.options.getString('tür') || 'all';
        const db = getDatabase();
        const userId = interaction.user.id;

        // Get user's quest progress
        const userProgress = db.data.questProgress.get(userId) || {};

        // Define available quests
        const quests = this.getAvailableQuests(type);

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('🗺️ Mevcut Görevler')
            .setDescription('Görevleri tamamlayarak NeuroCoin ve özel ödüller kazan!')
            .setTimestamp();

        for (const quest of quests) {
            const progress = userProgress[quest.id] || { current: 0, completed: false };
            const progressBar = this.createProgressBar(progress.current, quest.target);
            const status = progress.completed ? '✅' : '⏳';

            embed.addFields({
                name: `${status} ${quest.name}`,
                value: `${quest.description}\n${progressBar} ${progress.current}/${quest.target}\n**Ödül:** ${quest.reward} NRC ${quest.badge ? `+ ${quest.badge}` : ''}`,
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },

    async handleProgress(interaction) {
        const db = getDatabase();
        const userId = interaction.user.id;
        const userProgress = db.data.questProgress.get(userId) || {};

        const allQuests = this.getAvailableQuests('all');
        const completedQuests = Object.values(userProgress).filter(p => p.completed).length;
        const totalQuests = allQuests.length;

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('📊 Görev İlerlemeniz')
            .setDescription(`Toplam: ${completedQuests}/${totalQuests} görev tamamlandı`)
            .setTimestamp();

        // Daily quests
        const dailyQuests = allQuests.filter(q => q.type === 'daily');
        const dailyCompleted = dailyQuests.filter(q => userProgress[q.id]?.completed).length;
        embed.addFields({
            name: '📅 Günlük Görevler',
            value: `${dailyCompleted}/${dailyQuests.length} tamamlandı`,
            inline: true
        });

        // Weekly quests
        const weeklyQuests = allQuests.filter(q => q.type === 'weekly');
        const weeklyCompleted = weeklyQuests.filter(q => userProgress[q.id]?.completed).length;
        embed.addFields({
            name: '📆 Haftalık Görevler',
            value: `${weeklyCompleted}/${weeklyQuests.length} tamamlandı`,
            inline: true
        });

        // Achievement quests
        const achievementQuests = allQuests.filter(q => q.type === 'achievement');
        const achievementCompleted = achievementQuests.filter(q => userProgress[q.id]?.completed).length;
        embed.addFields({
            name: '🏆 Başarı Görevleri',
            value: `${achievementCompleted}/${achievementQuests.length} tamamlandı`,
            inline: true
        });

        await interaction.reply({ embeds: [embed] });
    },

    async handleClaim(interaction) {
        const questId = interaction.options.getString('görev-id');
        const db = getDatabase();
        const userId = interaction.user.id;

        const userProgress = db.data.questProgress.get(userId) || {};
        const progress = userProgress[questId];

        if (!progress) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#8B5CF6')
                    .setTitle('❌ Görev Bulunamadı')
                    .setDescription('Bu görev bulunamadı veya henüz başlamadınız.')],
                ephemeral: true
            });
        }

        if (progress.claimed) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#8B5CF6')
                    .setTitle('❌ Zaten Alındı')
                    .setDescription('Bu görevin ödülünü zaten aldınız.')],
                ephemeral: true
            });
        }

        if (!progress.completed) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#8B5CF6')
                    .setTitle('❌ Görev Tamamlanmadı')
                    .setDescription('Bu görevi henüz tamamlamadınız.')],
                ephemeral: true
            });
        }

        // Find quest details
        const quest = this.getAvailableQuests('all').find(q => q.id === questId);
        if (!quest) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#8B5CF6')
                    .setTitle('❌ Görev Bulunamadı')
                    .setDescription('Görev bilgisi bulunamadı.')],
                ephemeral: true
            });
        }

        // Award rewards
        db.updateNeuroCoinBalance(userId, quest.reward, 'wallet');
        
        // Mark as claimed
        progress.claimed = true;
        progress.claimedAt = new Date().toISOString();
        userProgress[questId] = progress;
        db.data.questProgress.set(userId, userProgress);

        // Record transaction
        db.recordTransaction('system', userId, quest.reward, 'quest', {
            questId,
            questName: quest.name
        });

        db.saveData();

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('🎁 Görev Ödülü Alındı!')
            .setDescription(`**${quest.name}** görevini tamamladınız!`)
            .addFields(
                { name: '💰 Kazanılan', value: `**${quest.reward.toLocaleString()}** NRC`, inline: true },
                { name: '🏅 Bonus', value: quest.badge || 'Yok', inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },

    async handleDaily(interaction) {
        const db = getDatabase();
        const userId = interaction.user.id;
        const userProgress = db.data.questProgress.get(userId) || {};

        const dailyQuests = this.getAvailableQuests('daily');

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('📅 Günlük Görevler')
            .setDescription('Her gün yeni görevler! Hepsini tamamla ve bonus kazan.')
            .setTimestamp();

        for (const quest of dailyQuests) {
            const progress = userProgress[quest.id] || { current: 0, completed: false };
            const progressBar = this.createProgressBar(progress.current, quest.target);
            const status = progress.completed ? (progress.claimed ? '✅' : '🎁') : '⏳';

            embed.addFields({
                name: `${status} ${quest.name}`,
                value: `${quest.description}\n${progressBar} ${progress.current}/${quest.target}\n**Ödül:** ${quest.reward} NRC`,
                inline: false
            });
        }

        // Check if all daily quests are completed
        const allCompleted = dailyQuests.every(q => userProgress[q.id]?.completed);
        if (allCompleted) {
            embed.addFields({
                name: '🌟 Bonus Ödül!',
                value: 'Tüm günlük görevleri tamamladınız! **+1000 NRC** bonus kazandınız!',
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },

    getAvailableQuests(type) {
        const allQuests = [
            // Daily Quests
            {
                id: 'daily_messages_10',
                type: 'daily',
                name: '💬 Sohbet Ustası',
                description: '10 mesaj gönder',
                target: 10,
                reward: 500,
                badge: null
            },
            {
                id: 'daily_reactions_5',
                type: 'daily',
                name: '👍 Tepki Göster',
                description: '5 mesaja tepki ver',
                target: 5,
                reward: 300,
                badge: null
            },
            {
                id: 'daily_voice_30',
                type: 'daily',
                name: '🎤 Sesli Sohbet',
                description: '30 dakika sesli kanalda kal',
                target: 30,
                reward: 800,
                badge: null
            },

            // Weekly Quests
            {
                id: 'weekly_earn_5000',
                type: 'weekly',
                name: '💰 Zenginlik Yolu',
                description: '5000 NRC kazan',
                target: 5000,
                reward: 2000,
                badge: '🏆 Zengin'
            },
            {
                id: 'weekly_trades_3',
                type: 'weekly',
                name: '🤝 Tüccar',
                description: '3 ticaret tamamla',
                target: 3,
                reward: 1500,
                badge: '🛒 Tüccar'
            },
            {
                id: 'weekly_games_10',
                type: 'weekly',
                name: '🎮 Oyuncu',
                description: '10 oyun oyna',
                target: 10,
                reward: 1000,
                badge: null
            },

            // Achievement Quests
            {
                id: 'achievement_level_50',
                type: 'achievement',
                name: '⭐ Seviye 50',
                description: '50. seviyeye ulaş',
                target: 50,
                reward: 10000,
                badge: '⭐ Efsane'
            },
            {
                id: 'achievement_marketplace_10',
                type: 'achievement',
                name: '🛍️ Koleksiyoncu',
                description: 'Pazar yerinden 10 eşya al',
                target: 10,
                reward: 5000,
                badge: '🛍️ Koleksiyoncu'
            },
            {
                id: 'achievement_streak_30',
                type: 'achievement',
                name: '🔥 Sadık Kullanıcı',
                description: '30 günlük streak yap',
                target: 30,
                reward: 15000,
                badge: '🔥 Sadık'
            }
        ];

        if (type === 'all') return allQuests;
        return allQuests.filter(q => q.type === type);
    },

    createProgressBar(current, target) {
        const percentage = Math.min((current / target) * 100, 100);
        const filled = Math.floor(percentage / 10);
        const empty = 10 - filled;
        return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.floor(percentage)}%`;
    }
};

